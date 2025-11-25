document.addEventListener('DOMContentLoaded', function() {
    const zoneButtons = document.querySelectorAll('.zone-button');
    let activeSubmenu = null;
    let activeButton = null;

    // Handle zone button clicks
    zoneButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const zone = this.getAttribute('data-zone');
            const submenuId = `${zone}-submenu`;
            const submenu = document.getElementById(submenuId);
            
            // If this button has a submenu
            if (submenu) {
                e.preventDefault();
                
                // If clicking the same button, toggle the submenu
                if (activeButton === this) {
                    submenu.classList.toggle('hidden');
                    this.classList.toggle('active');
                } else {
                    // Hide previous submenu
                    if (activeSubmenu) {
                        activeSubmenu.classList.add('hidden');
                        activeButton.classList.remove('active');
                    }
                    
                    // Show new submenu
                    submenu.classList.remove('hidden');
                    this.classList.add('active');
                    activeSubmenu = submenu;
                    activeButton = this;
                }
            } else {
                // No submenu for this zone, hide any open submenu
                if (activeSubmenu) {
                    activeSubmenu.classList.add('hidden');
                    activeButton.classList.remove('active');
                    activeSubmenu = null;
                    activeButton = null;
                }
                // Remove active class from all buttons
                zoneButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
            }
        });
    });

    // Close submenu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.zone-item')) {
            if (activeSubmenu) {
                activeSubmenu.classList.add('hidden');
                activeButton.classList.remove('active');
                activeSubmenu = null;
                activeButton = null;
            }
        }
    });
});
