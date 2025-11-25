/**
 * Builder Mode - Interactive location pin placement for map building
 * Activated with ?builder=true query parameter
 */

// Define location names by zone
const LOCATION_NAMES_BY_ZONE = {
    'toxulia-forest': [
        'Wizard Hut',
        'Bags',
        'Enchanter\'s Hut',
        'Magician\'s Hut',
        'Druid Ring',
        'Abandoned Necromancer\'s Hut',
        'Western Dock',
        'Kobold Camp',
        'Wizard Spires',
        'Kobold Camp',
        'Rungupp'
    ],
    'paineel': [
        'Darkglow Palace',
        'Athenaeum Necromantia',
        'Fortunes\' Fancy',
        'Tabernacle of Terror',
        'Chain Mail & Blunt Weapons',
        'Shields & Blunt Weapons',
        'False Idols',
        'The Final Reckoning',
        'Shackled Spirits',
        'Superior Supplies',
        'Sinfully Handsome',
        'Good Iva\'s Tasty Treats',
        'The Abbatoir',
        'The Fell Blade',
        'Plate Armor & Forge',
        'PvP Area',
        'Observatory'
    ],
    'paineel-2': [
        'Location 1',
        'Location 2',
        'Location 3',
        'Location 4',
        'Location 5'
    ],
    'the-warrens': [
        'Diseased Room',
        'Kitchen',
        'Batling Caves',
        'Lorekeeper Room',
        'Warlord Room',
        'Prince\'s Room',
        'Training Room',
        'Hallway',
        'Rat Room',
        'Prison Area',
        'Throne Room',
        'Huntmaster Room',
        'Bat Room',
        'Bear Paw Room'
    ],
    'the-hole': [
        'West Tower',
        'East Tower',
        'High Scale Kirn Room',
        'West Graveyard',
        'East Graveyard',
        'Courtyard',
        'Master Yael Chamber',
        'Pool Room',
        'Mighty Room',
        'Observation Room',
        'Secret Vault',
        'Mushroom Cellar',
        'Jail Cell',
        'Jail Cell',
        'Entry Observation Tower',
        'Zone Out Room'
    ],
    'stonebruntmountains': [
        'Highland Kobold Camps',
        'Town of Kejek',
        'Kobold Camps',
        'Dock'
    ],
    'erudin': [
        'Temple of Divine Light',
        'Teleporter to Erudin Palace',
        'Bard',
        'Teleporter to Erudin Docks',
        'City Armory',
        'Arrival Platform',
        'Erudin Surplus',
        'Erudin City Library',
        'Deepwater Knights',
        'Vasty Deep Inn',
        'BlueHawk\'s Food'
    ],
    'kerra-isle': [
        'Prison',
        'High Temple',
        'Cave of Sujah',
        'Tiger Island',
        'Tiger Training Pit'
    ],
    'eruds-crossing': [
        'Sunken Haunted Ship',
        'Ancient Statues',
        'Volcanic Crater',
        'Merchant',
        'Dock for boat to Erudin'
    ],
    'erudin-docks': [
        'Merchant - Bags and Boxes',
        'Erudin Port Authority',
        'Merchant - Cooking Supplies',
        'Priest of Discord',
        'Teleporter to Erudin',
        'Teleporter Arrival Platform'
    ],
    'erudin-palace': [
        'Teleporter Arrival Platform / Teleporter to Erudin',
        'Bank of Erudin',
        'Erudin City Office',
        'Sothure\'s Fine Gems',
        'Vials of Vitality',
        'Tower of the Crimson Hands',
        'Tower of the Gate Callers',
        'Tower of the Craft Keepers',
        'Merchant - Common Spells'
    ]
};

let LOCATION_NAMES = [];
let MAX_LOCATIONS = 11;

let placedLocations = {};
let placedButtons = {};
let nextLocationNumber = 1;
let builderMode = 'locations'; // 'locations' or 'buttons'

export function initBuilderMode() {
    // Check if builder mode is enabled via query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('builder') !== 'true') {
        return false;
    }

    // Detect the current zone
    const url = window.location.pathname;
    const filename = url.split('/').pop().replace('.html', '');
    
    // Set location names and max locations based on zone
    LOCATION_NAMES = LOCATION_NAMES_BY_ZONE[filename] || [];
    MAX_LOCATIONS = LOCATION_NAMES.length;

    console.log(`🔨 Builder Mode Activated for ${filename} (${MAX_LOCATIONS} locations)`);
    setupBuilderUI(filename);
    setupMapClickListener();
    return true;
}

function setupBuilderUI(zoneId) {
    // Create builder panel
    const panel = document.createElement('div');
    panel.id = 'builder-panel';
    panel.style.cssText = `
        position: fixed;
        right: 0;
        top: 0;
        width: 350px;
        height: 100vh;
        background: #1e1e1e;
        color: #e0e0e0;
        border-left: 2px solid #ffd700;
        z-index: 1000;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.5);
    `;

    panel.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #ffd700;">
            <h2 style="margin: 0 0 10px 0; color: #ffd700;">🔨 Builder Mode</h2>
            <p style="margin: 0; font-size: 11px; color: #888;">${zoneId} (${MAX_LOCATIONS} locations)</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #888; display: none;" id="builder-status">Click on the map to place pins</p>
        </div>

        <div style="padding: 15px; border-bottom: 1px solid #333;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button id="builder-mode-locations" style="
                    flex: 1;
                    padding: 8px;
                    background: #ffd700;
                    color: #1e1e1e;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 11px;
                ">📍 Locations</button>
                <button id="builder-mode-buttons" style="
                    flex: 1;
                    padding: 8px;
                    background: #666;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 11px;
                ">🔗 Nav Buttons</button>
            </div>
            <button id="builder-export-btn" style="
                width: 100%;
                padding: 8px;
                background: #4caf50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 8px;
            ">📋 Copy Data to Clipboard</button>
            <button id="builder-clear-btn" style="
                width: 100%;
                padding: 8px;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            ">🗑️ Clear All</button>
        </div>

        <div style="padding: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #ffd700; font-size: 13px;">Placed Locations:</h3>
            <div id="builder-locations-list" style="
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 10px;
                max-height: 200px;
                overflow-y: auto;
            ">
                <p style="color: #888; margin: 0;">No locations placed yet</p>
            </div>
        </div>

        <div style="padding: 15px; border-top: 1px solid #333;">
            <h3 style="margin: 0 0 10px 0; color: #ffd700; font-size: 13px;">Placed Buttons:</h3>
            <div id="builder-buttons-list" style="
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 10px;
                max-height: 150px;
                overflow-y: auto;
            ">
                <p style="color: #888; margin: 0;">No buttons placed yet</p>
            </div>
        </div>

        <div style="padding: 15px; border-top: 1px solid #333;">
            <h3 style="margin: 0 0 10px 0; color: #ffd700; font-size: 13px;">Export Format:</h3>
            <textarea id="builder-export-text" readonly style="
                width: 100%;
                height: 300px;
                background: #0d0d0d;
                color: #00ff00;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 8px;
                font-family: 'Courier New', monospace;
                font-size: 10px;
                resize: none;
            "></textarea>
        </div>

        <div style="padding: 15px; border-top: 1px solid #333; text-align: center;">
            <a href="javascript:window.location.search=''" style="
                color: #ffd700;
                text-decoration: none;
                font-size: 11px;
            ">Exit Builder Mode</a>
        </div>
    `;

    document.body.appendChild(panel);

    // Adjust page layout
    const container = document.querySelector('.container');
    if (container) {
        container.style.marginRight = '350px';
    }

    // Add event listeners
    document.getElementById('builder-mode-locations').addEventListener('click', function() {
        builderMode = 'locations';
        document.getElementById('builder-mode-locations').style.background = '#ffd700';
        document.getElementById('builder-mode-locations').style.color = '#1e1e1e';
        document.getElementById('builder-mode-buttons').style.background = '#666';
        document.getElementById('builder-mode-buttons').style.color = '#fff';
    });

    document.getElementById('builder-mode-buttons').addEventListener('click', function() {
        builderMode = 'buttons';
        document.getElementById('builder-mode-locations').style.background = '#666';
        document.getElementById('builder-mode-locations').style.color = '#fff';
        document.getElementById('builder-mode-buttons').style.background = '#4caf50';
        document.getElementById('builder-mode-buttons').style.color = '#fff';
    });

    document.getElementById('builder-export-btn').addEventListener('click', exportToClipboard);
    document.getElementById('builder-clear-btn').addEventListener('click', clearAllPins);
}

function setupMapClickListener() {
    // Handle both standard and custom map image IDs
    let mapImage = document.getElementById('map-image');
    let mapContainer = document.getElementById('map-overlay');
    
    // For Paineel and other custom maps
    if (!mapImage) {
        mapImage = document.getElementById('paineel-map');
    }
    if (!mapImage) {
        mapImage = document.getElementById('paineel-2-map');
    }
    
    // For custom overlay containers
    if (!mapContainer) {
        mapContainer = document.querySelector('.map-overlay');
    }

    if (!mapImage || !mapContainer) {
        console.error('Map elements not found. Map ID:', mapImage?.id, 'Overlay ID:', mapContainer?.id);
        return;
    }

    console.log('Map click listener setup on:', mapImage.id);

    mapImage.addEventListener('click', function(e) {
        const rect = mapImage.getBoundingClientRect();
        const wrapperRect = mapImage.parentElement.getBoundingClientRect();

        // Get pixel coordinates relative to the image
        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        // Get image natural/displayed dimensions
        const imgWidth = rect.width;
        const imgHeight = rect.height;

        // Convert to normalized coordinates (0-1000 range)
        // X: reversed (left=1000, right=0)
        // Y: 400-1400 range
        const normX = 1000 - (pixelX / imgWidth) * 1000;
        const normY = 400 + (pixelY / imgHeight) * 1000;

        // Round to nearest integer
        const x = Math.round(normX);
        const y = Math.round(normY);

        if (builderMode === 'locations') {
            placePin(x, y);
        } else {
            placeButton(x, y);
        }
    });
}

function updateButtonsList() {
    const list = document.getElementById('builder-buttons-list');
    if (!list) return;

    if (Object.keys(placedButtons).length === 0) {
        list.innerHTML = '<p style="color: #888; margin: 0;">No buttons placed yet</p>';
        return;
    }

    let html = '';
    for (const num in placedButtons) {
        const btn = placedButtons[num];
        html += `
            <div style="
                padding: 6px;
                margin-bottom: 6px;
                background: #1e1e1e;
                border: 1px solid #4caf50;
                border-radius: 3px;
            ">
                <div style="color: #4caf50; font-weight: bold;">${btn.name}</div>
                <div style="color: #aaa; font-size: 10px;">→ ${btn.link}</div>
                <div style="color: #aaa; font-size: 10px;">(${btn.x}, ${btn.y})</div>
            </div>
        `;
    }
    list.innerHTML = html;
}

function placePin(x, y) {
    // Build list of available locations with duplicates allowed
    const locationOptions = [];
    for (let i = 1; i <= MAX_LOCATIONS; i++) {
        locationOptions.push(`${i}. ${LOCATION_NAMES[i - 1]}`);
    }

    const choice = prompt('Select location number:\n\n' + locationOptions.join('\n'));
    if (!choice) return;

    const locationNum = parseInt(choice);
    if (isNaN(locationNum) || locationNum < 1 || locationNum > MAX_LOCATIONS) {
        alert('Invalid location number!');
        return;
    }

    const locationName = LOCATION_NAMES[locationNum - 1];

    // Generate unique key for multiple instances of same location
    const instanceKey = `${locationNum}_${Date.now()}_${Math.random()}`;

    // Store location - allow duplicates by using a unique key
    placedLocations[instanceKey] = {
        number: locationNum,
        name: locationName,
        x: x,
        y: y
    };

    // Create visual pin on map
    createVisualPin(x, y, locationNum);

    // Update UI
    updateLocationsList();
    updateExportText();

    console.log(`📍 Placed location ${locationNum} (${locationName}) at (${x}, ${y})`);
}

function createButtonMarker(x, y, buttonId) {
    let mapImage = document.getElementById('map-image');
    let overlay = document.getElementById('map-overlay');
    
    if (!mapImage) {
        mapImage = document.getElementById('paineel-map');
    }
    if (!mapImage) {
        mapImage = document.getElementById('paineel-2-map');
    }
    
    if (!overlay) {
        overlay = document.querySelector('.map-overlay');
    }

    const wrapper = mapImage?.parentElement;

    if (!mapImage || !overlay || !wrapper) {
        console.error('Could not find map elements for button creation');
        return;
    }

    // Get dimensions
    const imgRect = mapImage.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Convert back to pixel coordinates
    const drawioWidth = 755;
    const drawioHeight = 800;
    const drawioLeft = 140;
    const drawioTop = 350;

    const drawio_x = drawioLeft + ((1000 - x) / 1000) * drawioWidth;
    const drawio_y = drawioTop + ((y - 400) / 1000) * drawioHeight;

    const pixelX = (drawio_x - drawioLeft) * (imgRect.width / drawioWidth);
    const pixelY = (drawio_y - drawioTop) * (imgRect.height / drawioHeight);

    const offsetX = (imgRect.left - wrapperRect.left);
    const offsetY = (imgRect.top - wrapperRect.top);

    // Create button marker element
    const marker = document.createElement('div');
    marker.className = 'builder-button-marker';
    marker.dataset.buttonId = buttonId;
    marker.style.cssText = `
        position: absolute;
        left: ${offsetX + pixelX - 20}px;
        top: ${offsetY + pixelY - 20}px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #4caf50;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        z-index: 14;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
        user-select: none;
    `;
    marker.textContent = '🔗';

    // Make draggable
    makeButtonDraggable(marker, buttonId);

    overlay.appendChild(marker);
}

function makeButtonDraggable(marker, buttonId) {
    let isDragging = false;
    let offsetX, offsetY;

    marker.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = marker.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        marker.style.zIndex = '20';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        let mapImage = document.getElementById('map-image');
        if (!mapImage) mapImage = document.getElementById('paineel-map');
        if (!mapImage) mapImage = document.getElementById('paineel-2-map');
        
        const wrapper = mapImage.parentElement;
        const imgRect = mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const pixelX = e.clientX - imgRect.left - offsetX;
        const pixelY = e.clientY - imgRect.top - offsetY;

        const offsetLeft = (imgRect.left - wrapperRect.left);
        const offsetTop = (imgRect.top - wrapperRect.top);

        const minX = offsetLeft;
        const maxX = offsetLeft + imgRect.width;
        const minY = offsetTop;
        const maxY = offsetTop + imgRect.height;

        const clampedX = Math.max(minX, Math.min(maxX, e.clientX - offsetX));
        const clampedY = Math.max(minY, Math.min(maxY, e.clientY - offsetY));

        marker.style.left = (clampedX - wrapperRect.left) + 'px';
        marker.style.top = (clampedY - wrapperRect.top) + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        marker.style.zIndex = '14';

        let mapImage = document.getElementById('map-image');
        if (!mapImage) mapImage = document.getElementById('paineel-map');
        if (!mapImage) mapImage = document.getElementById('paineel-2-map');
        
        const wrapper = mapImage.parentElement;
        const imgRect = mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const pixelX = e.clientX - imgRect.left;
        const pixelY = e.clientY - imgRect.top;

        const normX = 1000 - (pixelX / imgRect.width) * 1000;
        const normY = 400 + (pixelY / imgRect.height) * 1000;

        placedButtons[buttonId].x = Math.round(normX);
        placedButtons[buttonId].y = Math.round(normY);

        updateButtonsList();
        updateExportText();

        console.log(`↪️ Moved button "${placedButtons[buttonId].name}" to (${Math.round(normX)}, ${Math.round(normY)})`);
    });
}

function createVisualPin(x, y, locationNum) {
    // Handle both standard and custom map image IDs
    let mapImage = document.getElementById('map-image');
    let overlay = document.getElementById('map-overlay');
    
    if (!mapImage) {
        mapImage = document.getElementById('paineel-map');
    }
    if (!mapImage) {
        mapImage = document.getElementById('paineel-2-map');
    }
    
    if (!overlay) {
        overlay = document.querySelector('.map-overlay');
    }

    const wrapper = mapImage?.parentElement;

    if (!mapImage || !overlay || !wrapper) {
        console.error('Could not find map elements for pin creation');
        return;
    }

    // Get dimensions
    const imgRect = mapImage.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Convert back to pixel coordinates
    const drawioWidth = 755;
    const drawioHeight = 800;
    const drawioLeft = 140;
    const drawioTop = 350;

    const drawio_x = drawioLeft + ((1000 - x) / 1000) * drawioWidth;
    const drawio_y = drawioTop + ((y - 400) / 1000) * drawioHeight;

    const pixelX = (drawio_x - drawioLeft) * (imgRect.width / drawioWidth);
    const pixelY = (drawio_y - drawioTop) * (imgRect.height / drawioHeight);

    const offsetX = (imgRect.left - wrapperRect.left);
    const offsetY = (imgRect.top - wrapperRect.top);

    // Create pin element
    const pin = document.createElement('div');
    pin.className = 'builder-pin';
    pin.dataset.locationNum = locationNum;
    pin.style.cssText = `
        position: absolute;
        left: ${offsetX + pixelX - 15}px;
        top: ${offsetY + pixelY - 15}px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ffd700;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: #1e1e1e;
        z-index: 15;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        user-select: none;
    `;
    pin.textContent = locationNum;

    // Make draggable
    makePinDraggable(pin, locationNum);

    overlay.appendChild(pin);
}

function makePinDraggable(pin, locationNum) {
    let isDragging = false;
    let offsetX, offsetY;
    let currentInstanceKey = null;

    pin.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = pin.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        pin.style.zIndex = '20';
        
        // Find the instance key for this pin
        for (const key in placedLocations) {
            const loc = placedLocations[key];
            if (loc.number === locationNum) {
                // If multiple instances, find the closest one
                const pinX = parseInt(pin.style.left);
                const pinY = parseInt(pin.style.top);
                if (currentInstanceKey === null) {
                    currentInstanceKey = key;
                }
                break;
            }
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        let mapImage = document.getElementById('map-image');
        if (!mapImage) mapImage = document.getElementById('paineel-map');
        if (!mapImage) mapImage = document.getElementById('paineel-2-map');
        
        const wrapper = mapImage.parentElement;
        const imgRect = mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        // Get pixel coordinates
        const pixelX = e.clientX - imgRect.left - offsetX;
        const pixelY = e.clientY - imgRect.top - offsetY;

        const offsetLeft = (imgRect.left - wrapperRect.left);
        const offsetTop = (imgRect.top - wrapperRect.top);

        // Constrain to map bounds
        const minX = offsetLeft;
        const maxX = offsetLeft + imgRect.width;
        const minY = offsetTop;
        const maxY = offsetTop + imgRect.height;

        const clampedX = Math.max(minX, Math.min(maxX, e.clientX - offsetX));
        const clampedY = Math.max(minY, Math.min(maxY, e.clientY - offsetY));

        pin.style.left = (clampedX - wrapperRect.left) + 'px';
        pin.style.top = (clampedY - wrapperRect.top) + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        pin.style.zIndex = '15';

        // Update location coordinates
        let mapImage = document.getElementById('map-image');
        if (!mapImage) mapImage = document.getElementById('paineel-map');
        if (!mapImage) mapImage = document.getElementById('paineel-2-map');
        
        const wrapper = mapImage.parentElement;
        const imgRect = mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const pixelX = e.clientX - imgRect.left;
        const pixelY = e.clientY - imgRect.top;

        const normX = 1000 - (pixelX / imgRect.width) * 1000;
        const normY = 400 + (pixelY / imgRect.height) * 1000;

        // Update using the instance key, or find the right one
        if (currentInstanceKey && placedLocations[currentInstanceKey]) {
            placedLocations[currentInstanceKey].x = Math.round(normX);
            placedLocations[currentInstanceKey].y = Math.round(normY);
        } else {
            // Fallback: find first instance of this location number
            for (const key in placedLocations) {
                if (placedLocations[key].number === locationNum) {
                    placedLocations[key].x = Math.round(normX);
                    placedLocations[key].y = Math.round(normY);
                    currentInstanceKey = key;
                    break;
                }
            }
        }

        updateLocationsList();
        updateExportText();

        console.log(`↪️ Moved location ${locationNum} to (${Math.round(normX)}, ${Math.round(normY)})`);
    });
}

function updateLocationsList() {
    const list = document.getElementById('builder-locations-list');
    if (!list) return;

    if (Object.keys(placedLocations).length === 0) {
        list.innerHTML = '<p style="color: #888; margin: 0;">No locations placed yet</p>';
        return;
    }

    let html = '';
    // Sort by location number, then by placement order
    const sorted = Object.entries(placedLocations).sort((a, b) => a[1].number - b[1].number);
    
    for (const [key, loc] of sorted) {
        html += `
            <div style="
                padding: 6px;
                margin-bottom: 6px;
                background: #1e1e1e;
                border: 1px solid #ffd700;
                border-radius: 3px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <strong style="color: #ffd700;">${loc.number}</strong>. ${loc.name}
                </div>
                <div style="color: #aaa; font-size: 10px;">
                    (${loc.x}, ${loc.y})
                </div>
            </div>
        `;
    }
    list.innerHTML = html;
}

function updateExportText() {
    const textarea = document.getElementById('builder-export-text');
    if (!textarea) return;

    let output = 'export const zoneData = {\n';
    output += `    name: '${LOCATION_NAMES.length === 11 ? 'Toxulia Forest' : LOCATION_NAMES.length === 17 ? 'Paineel' : 'Unknown'}',\n`;
    output += '    region: \'Odus\',\n';
    output += '    suggestedLevel: \'1-10\',\n';
    output += '    mapImage: \'../../Images/Odus/...\',\n';
    output += '    locations: [\n';

    // Sort all placed locations by location number, maintaining multiple instances
    const sorted = Object.entries(placedLocations).sort((a, b) => a[1].number - b[1].number);
    
    for (const [key, loc] of sorted) {
        output += `        { number: ${loc.number}, name: '${loc.name}', x: ${loc.x}, y: ${loc.y} },\n`;
    }

    output += '    ],\n';
    
    // Add buttons if any are placed
    if (Object.keys(placedButtons).length > 0) {
        output += '    buttons: [\n';
        for (const [buttonId, button] of Object.entries(placedButtons)) {
            output += `        { name: '${button.name}', link: '${button.link}', x: ${button.x}, y: ${button.y} },\n`;
        }
        output += '    ]\n';
    }
    
    output += '};\n';

    textarea.value = output;
}

function exportToClipboard() {
    const textarea = document.getElementById('builder-export-text');
    if (!textarea || !textarea.value) {
        alert('No locations placed yet!');
        return;
    }

    textarea.select();
    document.execCommand('copy');

    const btn = document.getElementById('builder-export-btn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function clearAllPins() {
    if (!confirm('Clear all placed pins and buttons?')) return;

    placedLocations = {};
    placedButtons = {};
    nextLocationNumber = 1;

    const overlay = document.getElementById('map-overlay');
    if (!overlay) return;
    
    const pins = overlay.querySelectorAll('.builder-pin, .builder-button-marker');
    pins.forEach(pin => pin.remove());

    updateLocationsList();
    updateButtonsList();
    updateExportText();

    console.log('🗑️ Cleared all pins and buttons');
}

function placeButton(x, y) {
    // Prompt for button name and link
    const name = prompt('Button name (e.g., "Paineel"):');
    if (!name) return;

    const link = prompt('Link path (e.g., "paineel.html" or "#"):');
    if (!link) return;

    const buttonId = Object.keys(placedButtons).length + 1;
    placedButtons[buttonId] = {
        name: name,
        link: link,
        x: x,
        y: y
    };

    // Create visual button marker
    createButtonMarker(x, y, buttonId);

    updateButtonsList();
    updateExportText();

    console.log(`🔗 Placed button "${name}" at (${x}, ${y})`);
}
