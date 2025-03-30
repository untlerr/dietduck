function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close the menu if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.hamburger') && !event.target.matches('.dropdown-menu *')) {
        const menu = document.getElementById('dropdownMenu');
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        }
    }
}
