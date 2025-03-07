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

    var gameOver=false;
    
    let ball = {
        x: gridStep / 2, 
        y: gridStep / 2 ,
        vx: 7,
        vy: 2,
        radius: gridStep/2,
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
            this.x=gridStep / 2;
            this.y=gridStep / 2;
            this.vx=7;
            this.vy=2;
        }
    };

    let brick={
        x: gridStep / 2, 
        y: gridStep / 2,
        color: "brown",
        draw:function(){
            ctx.beginPath();
            ctx.rect(gridStep, gridStep, 2*gridStep, gridStep);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
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

    function startGame(){
        start_screen.style.display="none";
        initGame();
        startAnimation();
    }
    function initGame(){
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
            
            ball.move();
            checkBorderCollision();
            brick.draw();
            paddle.draw();
            paddle.update();
            checkPaddleCollision();
        
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
        if (ball.y + ball.vy + ball.radius == paddle.y && ball.y + ball.vy - ball.radius < paddle.y + gridStep) {
            
            if (ball.x + ball.vx > paddle.x && ball.x + ball.vx < paddle.x + paddle.length) {                
                ball.vy = -ball.vy;                
                const hitPos = (ball.x - (paddle.x + paddle.length / 2)) / (paddle.length / 2); // Calculate hit position
                ball.vx += hitPos * 2; 
            }
        }
    }

    function updateScore(){     

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


