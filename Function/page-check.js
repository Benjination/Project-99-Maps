// Check if the current page exists, if not redirect to under-construction page
async function checkPageExists() {
    const currentUrl = window.location.href;
    
    try {
        const response = await fetch(currentUrl, { method: 'HEAD' });
        
        // If we get a 404, redirect to under-construction
        if (response.status === 404) {
            const pathname = window.location.pathname;
            // Check if this is a page in any Fashion subdirectory (Fashion/*/*.html)
            const isFashionSubdirectoryPage = /\/Fashion\/[^/]+\//.test(pathname);
            
            if (isFashionSubdirectoryPage) {
                // Use relative path to go up two levels and to under-construction
                window.location.href = '../../Fashion/HTML/under-construction.html';
            } else {
                // Fallback for other pages
                window.location.href = '/Project-99-Maps/Fashion/HTML/under-construction.html';
            }
        }
    } catch (error) {
        // If there's a network error, assume page doesn't exist
        console.error('Error checking page:', error);
        const pathname = window.location.pathname;
        // Check if this is a page in any Fashion subdirectory (Fashion/*/*.html)
        const isFashionSubdirectoryPage = /\/Fashion\/[^/]+\//.test(pathname);
        
        if (isFashionSubdirectoryPage) {
            window.location.href = '../../Fashion/HTML/under-construction.html';
        }
    }
}

// Run check when page loads
window.addEventListener('DOMContentLoaded', checkPageExists);
