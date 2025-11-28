/**
 * UNIVERSAL MAP BUILDER SYSTEM
 * 
 * ⚠️  IMPORTANT: This file has been cleaned of legacy coordinate systems.
 * ⚠️  DO NOT REVERT to old draw.io coordinate calculations (1000-0, 400-1400 ranges)
 * ⚠️  DO NOT use image-specific offset calculations or getBoundingClientRect on images
 * 
 * CURRENT SYSTEM (November 2025):
 * - Universal coordinate space: (0-1200, 0-900) 
 * - Locked to .map-image-wrapper dimensions, NOT individual image sizes
 * - Works with ANY image size (200+ different maps)
 * - Uses convertClickToViewportCoordinates() and convertViewportToDisplayCoordinates()
 * - Element detection: document.querySelector('.map-image-wrapper') or '.map-overlay'
 * 
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
    ],
    'qeynos-n': [
        'Order of the Silent Fist',
        'Kliknik Tunnel',
        'Reflecting Pond',
        'Crow\'s Pub & Casino',
        'Galliway\'s Trading Post',
        'Ironforge\'s',
        'Jewelbox',
        'Ironforges\' Estate',
        'Armor Merchant',
        'The Cobbler',
        'Weapon & Spell Merchant',
        'Temple of Life'
    ],
    'qeynos-s': [
        'Tin Soldier',
        'The Wind Spirit\'s Song',
        'Fharn\'s Leather & Thread',
        'Bag n Barrel',
        'Nesiff\'s Wooden Weapons',
        'Lion\'s Mane Inn',
        'Tax Hall',
        'Qeynos Hold',
        'Underwater Tunnel',
        'The Herb Jar',
        'Wizard Guild Hall',
        'Armor Tent Merchants',
        'Fireprides',
        'Large Armor Tent',
        'Boat Dock',
        'Mermaid\'s Lure',
        'Mixed Goods Tent',
        'Warrior Training Hall',
        'Underwater Tunnel 2',
        'Port Authority',
        'Merchant Stall',
        'Voleen\'s Fine Baked Goods',
        'Fish\'s Ale',
        'Temple of Thunder'
    ]
};

// ===== UNIVERSAL COORDINATE SYSTEM =====
// ONE system that works with ALL maps, regardless of size or continent
// 
// The viewing window is ALWAYS a fixed size (1200×900 reference)
// All maps are scaled/fitted into this window using CSS (object-fit: contain)
// 
// How it works:
// 1. Browser renders image at actual file size
// 2. CSS scales it to fit within viewport (object-fit: contain)
// 3. Image may be smaller than viewport, so it's centered by flex
// 4. Click coordinates are captured in viewport pixels
// 5. We account for image offset (centering) then convert to fixed reference coords
// 6. Display converts reference coords back, accounting for the same offset
// 
// Result: One coordinate system (0-1200, 0-900) works for ALL maps
const VIEWPORT_WIDTH = 1200;   // Fixed reference width (what we store)
const VIEWPORT_HEIGHT = 900;   // Fixed reference height (what we store)

// Conversion helpers - works with FIXED viewport size, not actual image size
function getViewportSize() {
    // The viewport is always 1200×900 in our coordinate system
    // The actual pixel size may vary (browser window, scaling), but we work in fixed reference space
    return { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT };
}

function convertClickToViewportCoordinates(viewportPixelX, viewportPixelY) {
    // UNIVERSAL SYSTEM: Only works with .map-image-wrapper structure
    // All pages MUST use this structure for consistent coordinate system
    
    const mapWrapper = document.querySelector('.map-image-wrapper');
    
    if (!mapWrapper) {
        console.error('CRITICAL: .map-image-wrapper not found! All pages must use universal structure.');
        return { x: Math.round(viewportPixelX), y: Math.round(viewportPixelY) };
    }
    
    const wrapperRect = mapWrapper.getBoundingClientRect();
    
    // Scale click position from actual wrapper size to fixed reference space
    const scaleX = VIEWPORT_WIDTH / wrapperRect.width;
    const scaleY = VIEWPORT_HEIGHT / wrapperRect.height;
    
    const viewportX = viewportPixelX * scaleX;
    const viewportY = viewportPixelY * scaleY;
    
    console.log(`🔄 Click conversion: wrapper=${wrapperRect.width.toFixed(0)}x${wrapperRect.height.toFixed(0)}, click=(${viewportPixelX.toFixed(0)},${viewportPixelY.toFixed(0)}), scale=(${scaleX.toFixed(3)},${scaleY.toFixed(3)}), viewport=(${viewportX.toFixed(0)},${viewportY.toFixed(0)})`);
    
    return { x: Math.round(viewportX), y: Math.round(viewportY) };
}

function convertViewportToDisplayCoordinates(viewportX, viewportY) {
    // UNIVERSAL SYSTEM: Only works with .map-image-wrapper structure
    // All pages MUST use this structure for consistent coordinate system
    
    const mapWrapper = document.querySelector('.map-image-wrapper');
    
    if (!mapWrapper) {
        console.error('CRITICAL: .map-image-wrapper not found! All pages must use universal structure.');
        return { x: viewportX, y: viewportY };
    }
    
    const wrapperRect = mapWrapper.getBoundingClientRect();
    
    // Scale from our fixed 1200×900 coordinate space to actual wrapper size
    const scaleX = wrapperRect.width / VIEWPORT_WIDTH;
    const scaleY = wrapperRect.height / VIEWPORT_HEIGHT;
    
    const displayX = viewportX * scaleX;
    const displayY = viewportY * scaleY;
    
    console.log(`🔄 Display conversion: viewport=(${viewportX},${viewportY}), wrapper=${wrapperRect.width.toFixed(0)}x${wrapperRect.height.toFixed(0)}, scale=(${scaleX.toFixed(3)},${scaleY.toFixed(3)}), display=(${displayX.toFixed(1)},${displayY.toFixed(1)})`);
    
    return { 
        x: displayX, 
        y: displayY 
    };
}

let LOCATION_NAMES = [];
let LOCATION_DATA = []; // Store full location objects with numbers/identifiers
let ZONE_NAME = 'Unknown'; // Store the zone name for export
let MAX_LOCATIONS = 11;

let placedLocations = {};
let placedButtons = {};
let nextLocationNumber = 1;
let builderMode = 'locations'; // 'locations' or 'buttons'

export async function initBuilderMode() {
    // Check if builder mode is enabled via query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('builder') !== 'true') {
        return false;
    }

    // Detect the current zone
    const url = window.location.pathname;
    const filename = url.split('/').pop().replace('.html', '');
    
    // Load location names from zone data file dynamically
    await loadLocationNamesFromZoneData(filename);

    console.log(`🔨 Builder Mode Activated for ${filename} (${MAX_LOCATIONS} locations)`);
    setupBuilderUI(filename);
    setupMapClickListener();

    return true;
}

/**
 * Load location names from zone data file dynamically
 * Tries to load from OdusJS first, then AntonicaJS, with fallback to hardcoded data
 */
async function loadLocationNamesFromZoneData(zoneId) {
    try {
        // Try to load from OdusJS first
        try {
            const module = await import(`./DataJS/OdusJS/data-${zoneId}.js`);
            if (module.zoneData && module.zoneData.locations) {
                LOCATION_DATA = module.zoneData.locations;
                LOCATION_NAMES = LOCATION_DATA.map(loc => loc.name);
                ZONE_NAME = module.zoneData.name || 'Unknown';
                MAX_LOCATIONS = LOCATION_NAMES.length;
                console.log(`📍 Loaded ${MAX_LOCATIONS} locations from OdusJS data`);
                return;
            }
        } catch (e) {
            // Try AntonicaJS
            try {
                const module = await import(`./DataJS/AntonicaJS/data-${zoneId}.js`);
                if (module.zoneData && module.zoneData.locations) {
                    LOCATION_DATA = module.zoneData.locations;
                    LOCATION_NAMES = LOCATION_DATA.map(loc => loc.name);
                    ZONE_NAME = module.zoneData.name || 'Unknown';
                    MAX_LOCATIONS = LOCATION_NAMES.length;
                    console.log(`📍 Loaded ${MAX_LOCATIONS} locations from AntonicaJS data`);
                    return;
                }
            } catch (e2) {
                // Continue to fallback
            }
        }
        
        // Fallback to hardcoded data if available
        if (LOCATION_NAMES_BY_ZONE[zoneId]) {
            LOCATION_NAMES = LOCATION_NAMES_BY_ZONE[zoneId];
            // For hardcoded data, create location data with numeric IDs
            LOCATION_DATA = LOCATION_NAMES.map((name, index) => ({
                number: index + 1,
                name: name
            }));
            MAX_LOCATIONS = LOCATION_NAMES.length;
            console.log(`📍 Loaded ${MAX_LOCATIONS} locations from hardcoded data`);
        } else {
            console.warn(`⚠️ No location data found for ${zoneId}, builder will have 0 locations`);
        }
    } catch (error) {
        console.error('Error loading zone data:', error);
        // Fallback to hardcoded or empty
        if (LOCATION_NAMES_BY_ZONE[zoneId]) {
            LOCATION_NAMES = LOCATION_NAMES_BY_ZONE[zoneId];
            // For hardcoded data, create location data with numeric IDs
            LOCATION_DATA = LOCATION_NAMES.map((name, index) => ({
                number: index + 1,
                name: name
            }));
            MAX_LOCATIONS = LOCATION_NAMES.length;
        }
    }
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

    // Hide the normal locations-list and adjust map-container to full width
    const locationsList = document.getElementById('locations-list');
    if (locationsList) {
        locationsList.style.display = 'none';
    }
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.style.gridTemplateColumns = '1fr'; // Full width instead of '1fr 300px'
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
    // UNIVERSAL SYSTEM: Only works with .map-image-wrapper structure
    const mapWrapper = document.querySelector('.map-image-wrapper');
    const overlay = document.getElementById('map-overlay') || document.querySelector('.map-overlay');

    if (!mapWrapper || !overlay) {
        console.error('CRITICAL: Universal structure not found! Need .map-image-wrapper and .map-overlay');
        return;
    }

    console.log('Universal map click listener setup on .map-image-wrapper');

    // Attach click listener to the wrapper element
    mapWrapper.addEventListener('click', function(e) {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        
        // Get pixel coordinates relative to the wrapper
        const pixelX = e.clientX - wrapperRect.left;
        const pixelY = e.clientY - wrapperRect.top;

        // Convert to viewport coordinates using universal system
        const viewportCoords = convertClickToViewportCoordinates(pixelX, pixelY);

        console.log(`🖱️ UNIVERSAL CLICK: wrapper pixel=(${pixelX.toFixed(0)},${pixelY.toFixed(0)}), viewport coord=(${viewportCoords.x},${viewportCoords.y})`);

        if (builderMode === 'locations') {
            placePin(viewportCoords.x, viewportCoords.y);
        } else {
            placeButton(viewportCoords.x, viewportCoords.y);
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
    for (let i = 0; i < LOCATION_DATA.length; i++) {
        const locData = LOCATION_DATA[i];
        locationOptions.push(`${locData.number}. ${locData.name}`);
    }

    const choice = prompt('Select location:\n\n' + locationOptions.join('\n'));
    if (!choice) return;

    // Parse the choice - can be a number or letter or alphanumeric
    const colonIndex = choice.indexOf('.');
    let locationIdentifier;
    
    if (colonIndex > 0) {
        locationIdentifier = choice.substring(0, colonIndex).trim();
    } else {
        locationIdentifier = choice.trim();
    }

    // Find the location data by identifier (works for numbers, letters, or combinations like "8a")
    const locationData = LOCATION_DATA.find(loc => String(loc.number) === locationIdentifier);
    
    if (!locationData) {
        alert(`Invalid location: ${locationIdentifier}`);
        return;
    }

    const locationName = locationData.name;

    // Generate unique key for multiple instances of same location
    const instanceKey = `${locationIdentifier}_${Date.now()}_${Math.random()}`;

    // Store location - allow duplicates by using a unique key
    placedLocations[instanceKey] = {
        number: locationData.number,
        name: locationName,
        x: x,
        y: y
    };

    console.log('💾 Stored location:', {
        key: instanceKey,
        number: locationData.number,
        name: locationName,
        coords: { x, y }
    });

    // Create visual pin on map
    createVisualPin(x, y, locationData.number);

    // Update UI
    updateLocationsList();
    updateExportText();

    console.log(`📍 Placed location ${locationData.number} (${locationName}) at (${x}, ${y})`);
}

function createButtonMarker(x, y, buttonId) {
    // NEW: Universal element detection
    const overlay = document.getElementById('map-overlay') || document.querySelector('.map-overlay');

    if (!overlay) {
        console.error('Could not find map overlay for button creation');
        return;
    }

    // LEGACY CODE REMOVED: Complex image offset calculations
    // OLD: imgRect, viewportRect, imgOffsetX, imgOffsetY calculations
    
    // NEW: Simple wrapper-based coordinate conversion
    const displayCoords = convertViewportToDisplayCoordinates(x, y);

    // Create button marker element
    const marker = document.createElement('div');
    marker.className = 'builder-button-marker';
    marker.dataset.buttonId = buttonId;
    marker.style.cssText = `
        position: absolute;
        left: ${displayCoords.x - 20}px;
        top: ${displayCoords.y - 20}px;
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

        // UNIVERSAL SYSTEM: Only use .map-image-wrapper
        const mapWrapper = document.querySelector('.map-image-wrapper');
        if (!mapWrapper) return;
        
        const wrapperRect = mapWrapper.getBoundingClientRect();
        
        const newX = e.clientX - wrapperRect.left - offsetX;
        const newY = e.clientY - wrapperRect.top - offsetY;
        
        // Clamp to wrapper bounds
        const clampedX = Math.max(0, Math.min(wrapperRect.width - 40, newX));
        const clampedY = Math.max(0, Math.min(wrapperRect.height - 40, newY));

        marker.style.left = clampedX + 'px';
        marker.style.top = clampedY + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        marker.style.zIndex = '14';

        // UNIVERSAL SYSTEM: Only use .map-image-wrapper
        const mapWrapper = document.querySelector('.map-image-wrapper');
        if (!mapWrapper) return;
        
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const wrapperRelativeX = e.clientX - wrapperRect.left;
        const wrapperRelativeY = e.clientY - wrapperRect.top;
        const viewportCoords = convertClickToViewportCoordinates(wrapperRelativeX, wrapperRelativeY);
        
        placedButtons[buttonId].x = viewportCoords.x;
        placedButtons[buttonId].y = viewportCoords.y;

        updateButtonsList();
        updateExportText();

        console.log(`↪️ Moved button "${placedButtons[buttonId].name}" to (${viewportCoords.x}, ${viewportCoords.y})`);
    });
}

function createVisualPin(x, y, locationNum) {
    // NEW: Universal element detection
    const overlay = document.getElementById('map-overlay') || document.querySelector('.map-overlay');

    if (!overlay) {
        console.error('Could not find map overlay for pin creation');
        return;
    }

    // NEW: Simple coordinate conversion using universal system
    const displayCoords = convertViewportToDisplayCoordinates(x, y);
    
    // Position pin with center offset
    const pinLeft = displayCoords.x - 15;
    const pinTop = displayCoords.y - 15;
    
    console.log(`Pin display: viewport=(${x},${y}), display=(${displayCoords.x.toFixed(1)},${displayCoords.y.toFixed(1)}), pinPos=(${pinLeft.toFixed(1)},${pinTop.toFixed(1)})`);

    // Create pin element
    const pin = document.createElement('div');
    pin.className = 'builder-pin';
    pin.dataset.locationNum = locationNum;
    pin.style.cssText = `
        position: absolute;
        left: ${pinLeft}px;
        top: ${pinTop}px;
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

    // Append to overlay (which is already positioned within map-image)
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
        
        // If mapImage is a container div, find the actual img element inside it
        let actualImg = mapImage;
        if (mapImage && mapImage.tagName !== 'IMG') {
            actualImg = mapImage.querySelector('img');
        }

        const wrapper = mapImage.parentElement;
        const imgRect = actualImg?.getBoundingClientRect() || mapImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const pixelX = e.clientX - imgRect.left;
        const pixelY = e.clientY - imgRect.top;

        // Get natural image dimensions to convert pixel coordinates
        const imgNaturalWidth = actualImg?.naturalWidth || imgRect.width;
        const imgNaturalHeight = actualImg?.naturalHeight || imgRect.height;

        // Convert displayed pixel coordinates to natural image coordinates
        const x = Math.round((pixelX / imgRect.width) * imgNaturalWidth);
        const y = Math.round((pixelY / imgRect.height) * imgNaturalHeight);

        // Update using the instance key, or find the right one
        if (currentInstanceKey && placedLocations[currentInstanceKey]) {
            placedLocations[currentInstanceKey].x = x;
            placedLocations[currentInstanceKey].y = y;
        } else {
            // Fallback: find first instance of this location number
            for (const key in placedLocations) {
                if (placedLocations[key].number === locationNum) {
                    placedLocations[key].x = x;
                    placedLocations[key].y = y;
                    currentInstanceKey = key;
                    break;
                }
            }
        }

        updateLocationsList();
        updateExportText();

        console.log(`↪️ Moved location ${locationNum} to (${x}, ${y})`);
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
    output += `    name: '${ZONE_NAME}',\n`;
    output += '    region: \'Antonica\',\n';
    output += '    suggestedLevel: \'1-10\',\n';
    output += '    mapImage: \'../../Images/Antonica/qeynosAquaducts.png\',\n';
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
