document.addEventListener('DOMContentLoaded', function() {
    const zoneButtons = document.querySelectorAll('.zone-button');
    const odusSubmenu = document.getElementById('odus-submenu');
    const odusButton = document.querySelector('[data-zone="odus"]');

    // Handle zone button clicks
    zoneButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const zone = this.getAttribute('data-zone');
            
            // Remove active class from all buttons
            zoneButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');

            // Handle Odus submenu toggle
            if (zone === 'odus') {
                e.preventDefault();
                odusButton.classList.toggle('active');
                odusSubmenu.classList.toggle('hidden');
            } else {
                // Hide submenu if clicking other zones
                odusSubmenu.classList.add('hidden');
                odusButton.classList.remove('active');
            }
        });
    });

    // Close submenu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.zone-item')) {
            odusSubmenu.classList.add('hidden');
            odusButton.classList.remove('active');
        }
    });
});
