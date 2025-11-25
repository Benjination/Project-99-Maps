/**
 * Generic zone page initializer
 * Automatically loads the correct zone data and renders the map
 */

import { detectCurrentZone, loadZoneData, renderLocationsList, setMapImage, renderMapButtons } from './map-utils.js';

document.addEventListener('DOMContentLoaded', async function() {
    const zoneId = detectCurrentZone();
    console.log('Detected zone:', zoneId);
    
    // Special handling for pages with different image element IDs
    if (zoneId === 'paineel' || zoneId === 'paineel-2') {
        console.log(`Loading ${zoneId} data...`);
        const { zoneData } = await import(`./Data/data-${zoneId}.js`);
        console.log(`${zoneId} data:`, zoneData);
        if (zoneData) {
            console.log('Rendering locations:', zoneData.locations.length);
            renderLocationsList(zoneData.locations);
            setMapImage(zoneData);
            // Render navigation buttons if they exist
            if (zoneData.buttons) {
                renderMapButtons(zoneData.buttons);
            }
        }
    } else {
        // Generic handling for all other zone pages
        console.log('Loading generic zone data for:', zoneId);
        const zoneData = await loadZoneData(zoneId);
        console.log('Zone data:', zoneData);
        if (zoneData) {
            console.log('Rendering locations:', zoneData.locations.length);
            renderLocationsList(zoneData.locations);
            setMapImage(zoneData);
            // Render navigation buttons if they exist
            if (zoneData.buttons) {
                renderMapButtons(zoneData.buttons);
            }
        }
    }
});
