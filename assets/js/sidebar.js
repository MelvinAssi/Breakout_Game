
    const toggleButton = document.getElementById("toggle-btn")
    const sidebar=document.getElementById("sidebar")
    const sidebarState = localStorage.getItem('sidebarState');

    if (sidebarState === 'closed' && !(sidebar.classList.contains('close'))) {
        sidebar.classList.add('close');
    }
    setTimeout(() => {
        sidebar.style.transition = 'width 300ms ease-in-out, padding 300ms ease-in-out'; 
    }, 10);

    toggleButton.addEventListener('click', () => {
        
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle("rotate")

        if (sidebar.classList.contains('close')) {
            localStorage.setItem('sidebarState', 'closed');
        } else {
            localStorage.setItem('sidebarState', 'open');
        }
    });

