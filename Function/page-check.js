// Check if the current page exists, if not redirect to under-construction page
async function checkPageExists() {
    const currentUrl = window.location.href;
    
    try {
        const response = await fetch(currentUrl, { method: 'HEAD' });
        
        // If we get a 404, redirect to under-construction
        if (response.status === 404) {
            window.location.href = '/Project-99-Maps/Fashion/HTML/under-construction.html';
        }
    } catch (error) {
        // If there's a network error, assume page doesn't exist
        console.error('Error checking page:', error);
        // Only redirect if this appears to be a zone page
        if (window.location.pathname.includes('/Fashion/HTML/')) {
            window.location.href = '/Project-99-Maps/Fashion/HTML/under-construction.html';
        }
    }
}

// Run check when page loads
window.addEventListener('DOMContentLoaded', checkPageExists);
