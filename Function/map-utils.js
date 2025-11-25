/**
 * Shared map utilities for all zone pages
 */

/**
 * Render locations list in the sidebar
 * @param {Array} locations - Array of location objects from zone data
 */
export function renderLocationsList(locations) {
    const locationsList = document.getElementById('locations-list');
    if (!locationsList) return;
    
    locationsList.innerHTML = ''; // Clear existing content
    
    locations.forEach(location => {
        const locationItem = document.createElement('div');
        locationItem.className = 'location-item';
        const description = location.description ? `<span class="location-item-description">${location.description}</span>` : '';
        locationItem.innerHTML = `
            <span class="location-item-number">${location.number}</span>
            <div class="location-item-content">
                <span class="location-item-name">${location.name}</span>
                ${description}
            </div>
        `;
        
        locationItem.addEventListener('click', function() {
            highlightLocation(location);
        });
        
        locationsList.appendChild(locationItem);
    });
}

/**
 * Render navigation buttons on the map overlay
 * @param {Array} buttons - Array of button objects with name, link, x, y
 */
export function renderMapButtons(buttons) {
    const overlay = document.getElementById('map-overlay');
    const mapImage = document.getElementById('map-image') || document.getElementById('paineel-map') || document.getElementById('paineel-2-map');
    const wrapper = mapImage?.parentElement;
    
    if (!overlay || !mapImage || !wrapper || !buttons) return;
    
    buttons.forEach(button => {
        // Get the actual displayed dimensions of the image
        const imgRect = mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        
        // Image natural dimensions in draw.io coordinates
        const drawioWidth = 755;
        const drawioHeight = 800;
        const drawioLeft = 140;
        const drawioTop = 350;
        
        // Convert desired coordinates to draw.io coordinates
        const drawio_x = drawioLeft + ((1000 - button.x) / 1000) * drawioWidth;
        const drawio_y = drawioTop + ((button.y - 400) / 1000) * drawioHeight;
        
        // Convert draw.io coordinates to pixel positions on the displayed image
        const pixelX = (drawio_x - drawioLeft) * (imgRect.width / drawioWidth);
        const pixelY = (drawio_y - drawioTop) * (imgRect.height / drawioHeight);
        
        // Calculate offset of image within wrapper
        const offsetX = (imgRect.left - wrapperRect.left);
        const offsetY = (imgRect.top - wrapperRect.top);
        
        // Create a button element
        const buttonEl = document.createElement('button');
        buttonEl.className = 'map-button';
        buttonEl.textContent = button.name;
        buttonEl.style.position = 'absolute';
        buttonEl.style.left = (offsetX + pixelX - 50) + 'px';
        buttonEl.style.top = (offsetY + pixelY - 15) + 'px';
        buttonEl.style.width = '100px';
        buttonEl.style.height = '30px';
        buttonEl.style.padding = '5px';
        buttonEl.style.backgroundColor = '#ffd700';
        buttonEl.style.color = '#1e1e1e';
        buttonEl.style.border = 'none';
        buttonEl.style.borderRadius = '4px';
        buttonEl.style.cursor = 'pointer';
        buttonEl.style.fontWeight = 'bold';
        buttonEl.style.fontSize = '12px';
        buttonEl.style.zIndex = '20';
        buttonEl.style.pointerEvents = 'auto';
        
        buttonEl.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = button.link;
        });
        
        buttonEl.addEventListener('mouseover', function() {
            buttonEl.style.backgroundColor = '#ffed4e';
        });
        
        buttonEl.addEventListener('mouseout', function() {
            buttonEl.style.backgroundColor = '#ffd700';
        });
        
        overlay.appendChild(buttonEl);
    });
}

/**
 * Highlight a location on the map
 * @param {Object} location - Location object with x, y coordinates
 */
export function highlightLocation(location) {
    const mapImage = document.getElementById('map-image') || document.getElementById('paineel-map') || document.getElementById('paineel-2-map');
    const overlay = document.getElementById('map-overlay');
    const wrapper = mapImage?.parentElement;
    
    if (!mapImage || !overlay || !wrapper) return;
    
    // Get the actual displayed dimensions of the image
    const imgRect = mapImage.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Image natural dimensions in draw.io coordinates
    const drawioWidth = 755; // 895 - 140
    const drawioHeight = 800; // 1150 - 350
    const drawioLeft = 140;
    const drawioTop = 350;
    
    // Coordinate system (FLIPPED):
    // Top-left: (1000, 1400), Top-right: (0, 1400)
    // Bottom-left: (1000, 400), Bottom-right: (0, 0)
    // X: 1000 (left) to 0 (right) - REVERSED
    // Y: 1400 (top) to 0 (bottom) - but our data uses 400-1400
    
    // Convert desired coordinates to draw.io coordinates
    // X is reversed: location.x goes 1000->0, but draw.io goes 140->895
    const drawio_x = drawioLeft + ((1000 - location.x) / 1000) * drawioWidth;
    // Y: location.y goes 400->1400, draw.io goes 350->1150
    const drawio_y = drawioTop + ((location.y - 400) / 1000) * drawioHeight;
    
    // Convert draw.io coordinates to pixel positions on the displayed image
    const pixelX = (drawio_x - drawioLeft) * (imgRect.width / drawioWidth);
    const pixelY = (drawio_y - drawioTop) * (imgRect.height / drawioHeight);
    
    // Calculate offset of image within wrapper
    const offsetX = (imgRect.left - wrapperRect.left);
    const offsetY = (imgRect.top - wrapperRect.top);
    
    // Create a circle marker at the location
    const marker = document.createElement('div');
    marker.className = 'location-marker';
    marker.style.position = 'absolute';
    marker.style.left = (offsetX + pixelX - 15) + 'px';
    marker.style.top = (offsetY + pixelY - 15) + 'px';
    marker.style.width = '30px';
    marker.style.height = '30px';
    marker.style.borderRadius = '50%';
    marker.style.border = '3px solid #ffd700';
    marker.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    marker.style.zIndex = '10';
    marker.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
    marker.style.pointerEvents = 'none';
    
    // Remove previous marker (but keep buttons)
    const previousMarker = overlay.querySelector('.location-marker');
    if (previousMarker) {
        previousMarker.remove();
    }
    overlay.appendChild(marker);
    
    // Debug info
    console.log(`Location ${location.number}: desired (${location.x}, ${location.y}) → drawio (${drawio_x.toFixed(1)}, ${drawio_y.toFixed(1)}) → pixels (${pixelX.toFixed(1)}, ${pixelY.toFixed(1)})`);
}

/**
 * Detect which zone page is currently loaded
 * @returns {string} Zone identifier (e.g., 'paineel', 'the-hole')
 */
export function detectCurrentZone() {
    const url = window.location.pathname;
    const filename = url.split('/').pop().replace('.html', '');
    return filename;
}

/**
 * Dynamically load zone data module
 * @param {string} zoneId - Zone identifier
 * @returns {Promise} Promise that resolves with zone data
 */
export async function loadZoneData(zoneId) {
    try {
        const module = await import(`./Data/data-${zoneId}.js`);
        return module.zoneData;
    } catch (error) {
        console.error(`Failed to load zone data for ${zoneId}:`, error);
        return null;
    }
}

/**
 * Set map image source and update zone info
 * @param {Object} zoneData - Zone data object
 */
export function setMapImage(zoneData) {
    const mapImg = document.getElementById('zone-map') || document.getElementById('paineel-map') || document.getElementById('paineel-2-map');
    if (mapImg && zoneData.mapImage) {
        mapImg.src = zoneData.mapImage;
        mapImg.alt = `${zoneData.name} Map`;
    }
}
