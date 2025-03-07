document.addEventListener("DOMContentLoaded", () => {
    let enable_border = document.getElementById("enable_border_chkb");
    let savedValue_enable_border = localStorage.getItem('enable_border');
    if (savedValue_enable_border !== null) {
        enable_border.checked = (savedValue_enable_border === 'true');  
    }  
    enable_border.addEventListener("change", function() {

        localStorage.setItem('enable_border', enable_border.checked);
    });


    let clear_highscore_btn=document.getElementById("clear_highscore_btn");
    clear_highscore_btn.addEventListener("click",()=>{
        localStorage.removeItem("highscore");

    })

    

    let volumeControl = document.getElementById('volumeControl');
    let savedValue_volumeControl = localStorage.getItem('volumeControl');
    if (savedValue_volumeControl !== null) {
        volumeControl.value = savedValue_volumeControl;
    }

    volumeControl.addEventListener('input', function() {
        localStorage.setItem('volumeControl', volumeControl.value);  
    });

    let mobile_mode = document.getElementById("mobile_mode_chkb");
    let savedValue_mobile_mode = localStorage.getItem('mobile_mode');
    if (savedValue_mobile_mode !== null) {
        mobile_mode.checked = (savedValue_mobile_mode === 'true');  
    }  
    mobile_mode.addEventListener("change", function() {

        localStorage.setItem('mobile_mode', mobile_mode.checked);
    });

});