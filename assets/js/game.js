document.addEventListener("DOMContentLoaded", () => {
    let start_screen=document.getElementById("start-screen");
    start_screen.style.display="flex";    
    let gameover_screen=document.getElementById("gameover-screen");
    gameover_screen.style.display="none"; 

    let start_btn= document.getElementById("play-btn");
    start_btn.addEventListener("click",startGame);
    let retry_btn= document.getElementById("retry-btn");
    retry_btn.addEventListener("click",resetGame);

    let dpad = document.getElementById("dpad");
    if (window.innerWidth > 800) {
        dpad.style.display = "none";
    } else {
        dpad.style.display = localStorage.getItem("mobile_mode") === "true" ? "flex" : "none";
    }
   

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var raf;
    var direction = "right";
    var grid_size =20;
    var gridStep = canvas.width / grid_size;
    
    
    var lastTime = 0; 
    var interval = 10;
    let score=0;
    let highscore = localStorage.getItem('highscore') || '0';
    document.getElementById('highscoretxt').textContent = 'Highscore: ' + highscore;

    var gameOver=false;
    
    let ball = {
        x: gridStep*10, 
        y: gridStep*10 ,
        vx: 5,
        vy: -5,
        radius: gridStep/8,
        color: "blue",
        draw: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        },
        move:function(){
            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.y + ball.vy < ball.radius) {
                ball.vy = -ball.vy;
            }
            if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius  ) {
                ball.vx = -ball.vx;
            }
        },
        reset : function() {
            this.x=gridStep*10;
            this.y=gridStep *15;
            this.vx=5;
            this.vy=-5;
        }
    };


    let paddle = {
        x: canvas.width / 2 - (gridStep * 2),
        y: canvas.width - (gridStep * 2),
        length: gridStep * 4,
        color: "yellow",
        velocity: 0, 
        moveSpeed: 5,
        draw: function () {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.length, gridStep);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        },
        update: function () {
            this.x += this.velocity;
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x + this.length > canvas.width) {
                this.x = canvas.width - this.length;
            }
        }
    };

    let brickMap ;
    const rows = 5;
    const cols = 8;

    

    function buildWall(){
        brickMap = new Map();
        for (let r = 0; r < rows; r++) {
            for (let c = 1; c <= cols; c++) {
                brickMap.set(`${r}-${c}`, { present: true, color: "brown" });
            }
        }

    }

    
    function drawBricks() {
        brickMap.forEach((brick, key) => {
            if (brick.present) {
                let [r, c] = key.split('-').map(Number);
                let x = c * gridStep * 2;
                let y = r * gridStep;
                ctx.beginPath();
                ctx.rect(x, y, gridStep * 2, gridStep);
                ctx.strokeRect(x, y, gridStep * 2, gridStep);
                ctx.closePath();
                ctx.fillStyle = brick.color;
                ctx.fill();
            }
        });
    }

    function checkBrickCollision() {
        brickMap.forEach((brick, key) => {
            if (brick.present) {
                let [r, c] = key.split('-').map(Number);
                let brickX = c * gridStep * 2;
                let brickY = r * gridStep;
                if (ball.x + ball.radius > brickX && ball.x - ball.radius < brickX + gridStep * 2 &&
                    ball.y + ball.radius > brickY && ball.y - ball.radius < brickY + gridStep) {
                    
                    brickMap.set(key, { present: false, color: "transparent" });
                    updateScore();

                    if (ball.y > brickY && ball.y < brickY + gridStep) { 
                        ball.vx = -ball.vx;
                    }
    
                    
                    if (ball.x > brickX && ball.x < brickX + gridStep * 2) { 
                        ball.vy = -ball.vy;
                    }
                }
            }
        });
        checkWallDestroyed();
    }
    function checkWallDestroyed() {
        let allBricksDestroyed = true;

        brickMap.forEach((brick) => {
            if (brick.present) {
                allBricksDestroyed = false;
            }
        });
        if (allBricksDestroyed) {
            buildWall();
            score += 50;
            document.getElementById('scoretxt').textContent = 'Score: ' + score;
        }
    }
    

    function startGame(){
        start_screen.style.display="none";
        initGame();
        startAnimation();
    }
    function initGame(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        buildWall();
        score=0;
        ball.reset();
    }
    function startAnimation() {
        
        if (gameOver) {
            resetGame();      
          }        
        if (!raf) {

            raf = window.requestAnimationFrame(draw);
        }
    }

    function draw(timestamp) {
        console.log("inGame");
        if (gameOver) {
            return;
        }
        if (timestamp - lastTime >= interval) {
            lastTime = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ball.draw();
            drawBricks();
            ball.move();
            checkBorderCollision();
            
            paddle.draw();
            paddle.update();
            checkPaddleCollision();
            checkBrickCollision();
        
        }
        raf = window.requestAnimationFrame(draw);

    }


    function checkBorderCollision(){        
        if(ball.y + ball.vy > canvas.height - ball.radius){
            ball.vy =0;
            ball.vx =0;
            console.log("checkBorder");
            gameOverHandler();
        }
    }
    function checkPaddleCollision() {
        if (ball.y + ball.vy + ball.radius >= paddle.y && 
            ball.y + ball.vy - ball.radius <= paddle.y + gridStep &&
            ball.x + ball.radius > paddle.x && 
            ball.x - ball.radius < paddle.x + paddle.length) {
            ball.vy = -ball.vy;
    
            const hitPos = (ball.x - (paddle.x + paddle.length / 2)) / (paddle.length / 2);
            ball.vx += hitPos * 2; 
        }
    }


    function updateScore(){  
        score += 10;   
        document.getElementById('scoretxt').textContent = 'Score: ' + score;
        console.log(highscore)
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore',highscore);
            document.getElementById('highscoretxt').textContent = 'Highscore: ' + highscore;
        }

    }
    

    function gameOverHandler(){
        gameOver=true;
        cancelAnimationFrame(raf);        
        gameover_screen.style.display="flex";
    }

    function resetGame() {
        gameOver = false;
        raf = null;        
        gameover_screen.style.display="none";
        startGame();
    }

    window.addEventListener("keydown", (e) => {
        if (gameOver) return;

        if (e.key === "ArrowRight") {
            paddle.velocity = paddle.moveSpeed;
        } else if (e.key === "ArrowLeft") {
            paddle.velocity = -paddle.moveSpeed;
        }
    });

    
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            paddle.velocity = 0;
        }
    });




});


