# Zone Development Reference Guide

This guide documents the process and standards used to create zone pages for Project 1999 Maps. Follow these steps to add new zones consistently.

## File Structure Overview

Every zone requires these files:

```
Fashion/AntonicaHTML/{zonename}.html          # Zone page (Antonica zones)
Fashion/HTML/{zonename}.html                  # Zone page (Odus zones)  
Function/DataJS/AntonicaJS/data-{zonename}.js # Zone data (Antonica)
Function/DataJS/OdusJS/data-{zonename}.js     # Zone data (Odus)
Images/Antonica/{ZoneName}.png                # Map image (Antonica)
Images/Odus/{ZoneName}.png                    # Map image (Odus)
Locations/AntonicaLoc/{zonename}.txt          # Location reference (Antonica)
Locations/{zonename}.txt                      # Location reference (Odus)
```

## Step 1: Create the HTML Page

**Location**: `Fashion/HTML/{zonename}.html`

**Template** (customize as needed):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Zone Name} - Project 1999 Maps</title>
    <link rel="stylesheet" href="../../Function/CSS/maps.css">
    <link rel="stylesheet" href="../../Function/CSS/paineel.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Project 1999 Maps</h1>
            <p class="subtitle">{Region} - {Zone Name}</p>
        </header>

        <nav class="location-nav">
            <a href="../HTML/index.html" class="nav-link">Home</a>
            <span class="nav-separator">/</span>
            <a href="../HTML/index.html" class="nav-link">{Region}</a>
            <span class="nav-separator">/</span>
            <span class="nav-current">{Zone Name}</span>
        </nav>

        <nav class="adjacent-zones">
            <!-- Add adjacent zone buttons here -->
            <!-- <a href="{adjacent-zone}.html" class="adjacent-button">→ {Adjacent Zone}</a> -->
        </nav>

        <div class="map-container">
            <div class="map-viewer">
                <div class="map-image-wrapper">
                    <img id="zone-map" src="../../Images/{Region}/{ZoneName}.png" alt="{Zone Name} Map" class="map-image">
                    <div id="map-overlay" class="map-overlay"></div>
                </div>
                <div class="map-info">
                    <h2>Locations</h2>
                    <div id="locations-list" class="locations-list"></div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="../../Function/zone-init.js"></script>
    <script src="../../Function/page-check.js"></script>
</body>
</html>
```

**Key Notes**:
- Image ID format: `{zonename}-map` (e.g., `paineel-map`, `the-hole-map`)
- Always include `<div id="map-overlay" class="map-overlay"></div>` for interactive features
- Adjacent zone buttons go in the `<nav class="adjacent-zones">` section

## Step 2: Create the Zone Data File

**Location**: `Function/DataJS/AntonicaJS/data-{zonename}.js` (or `Function/DataJS/OdusJS/` for Odus zones)

**Template**:
```javascript
export const zoneData = {
    name: '{Zone Name}',
    region: '{Region Name}', 
    description: '{Zone Description} - {Brief Details}',
    suggestedLevel: '{Level Range}',
    mapImage: '../../Images/{Region}/{ZoneName}.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
    locations: [
        // Location objects (see below for format)
    ],
    buttons: [
        // Navigation buttons (see below for format)  
    ]
};
```

### Location Object Format

```javascript
{
    number: 1,                          // Location number (1-indexed)
    name: 'Location Name',              // Full name
    description: 'Optional details',    // Optional: guild info, merchants, etc.
    x: 600,                             // X coordinate (0-1200, universal viewport)
    y: 450                              // Y coordinate (0-900, universal viewport)
}
```

**Coordinate System**:
- **Universal Viewport**: All zones use 1200×900 coordinate space
- **X-axis**: 0 (left) → 1200 (right)
- **Y-axis**: 0 (top) → 900 (bottom)
- **Builder Mode**: Use `?builder=true` to position pins by clicking
- **No Manual Conversion**: System automatically handles different image sizes

### Navigation Button Format

```javascript
{
    name: 'Adjacent Zone Name',         // Button label
    link: '{zonename}.html',            // Target zone page
    x: 500,                             // X position
    y: 700                              // Y position
}
```

**Button Guidelines**:
- Place at edges of map (near zone boundaries)
- Only include zones reachable without going through other zones
- Position relative to where the adjacent zone would be geographically

## Step 3: Add Location Coordinates

Use the interactive builder mode to place pins:

1. Open the zone page with `?builder=true` query parameter (e.g., `zone.html?builder=true`)
2. Click on the map where each location should be
3. Enter the location number and description
4. The coordinates are automatically stored in viewport space (0-1200, 0-900)

**Important**: All coordinates are stored in a universal viewport system (0-1200, 0-900) that works with all maps regardless of size or aspect ratio. No manual coordinate conversion needed.

## Step 4: Add Location Reference File (Optional)

**Location**: `Locations/{zonename}.txt`

Format as plain text with location numbers and descriptions:
```
1. Location Name
   Description or notes about this location

2. Another Location
   Details about merchants, guilds, or other features
```

## Step 5: Update Navigation

### Update Adjacent Zone Pages

Add buttons to zones that border this new zone:

```html
<nav class="adjacent-zones">
    <!-- existing buttons -->
    <a href="{newzone}.html" class="adjacent-button">→ {New Zone Name}</a>
</nav>
```

### Update Index Page

Add the zone to `index.html` in the appropriate region:

```html
<a href="Fashion/HTML/{zonename}.html" class="zone-button">{Zone Name}</a>
```

### Update Data Files

For adjacent zones, add buttons pointing to the new zone in their `data-{zonename}.js` file.

## Best Practices

### Naming Conventions
- HTML files: lowercase with hyphens (e.g., `the-hole.html`, `toxulia-forest.html`)
- Data files: `data-{htmlname}.js` (e.g., `data-the-hole.js`)
- Image IDs: lowercase with hyphens (e.g., `the-hole-map`)
- Zone names in code: lowercase with hyphens

### Coordinate Accuracy
1. Use builder mode to place pins by clicking
2. Pins will appear exactly where you click in the viewport
3. Test location markers on the actual page
4. Check that markers appear at correct positions before committing
5. Use browser console (F12) to verify if needed

### Button Placement
1. Only add navigation buttons for directly adjacent zones
2. Don't create shortcut buttons that bypass natural zone progression
3. Consider gameplay flow when placing buttons
4. Test that buttons navigate to correct pages

### Location Details
1. Include descriptions for guilds, banks, merchants, and special NPCs
2. Note important items available (armor, weapons, reagents, etc.)
3. Keep location numbers consistent across references
4. Keep descriptions concise (one sentence recommended)

## Testing Checklist

Before committing a new zone:

- [ ] HTML page loads without errors (F12 console)
- [ ] Map image displays correctly
- [ ] All location markers appear at correct positions
- [ ] Clicking locations in sidebar shows yellow marker on map
- [ ] Marker disappears when clicking a different location
- [ ] Navigation buttons (adjacent zones) work correctly
- [ ] Navigation buttons remain visible when selecting locations
- [ ] Back link goes to correct page
- [ ] Breadcrumb navigation displays correctly
- [ ] Page is responsive on mobile (test in DevTools)

## Troubleshooting

### Markers appear in wrong locations
- Check that you're using the builder mode to place pins correctly
- Verify coordinates are in viewport space (0-1200, 0-900)
- Use browser console to check coordinate conversion logs

### Buttons disappear when clicking locations
- This was fixed in `map-utils.js` to only remove location markers, not buttons
- Ensure you're using the current version of `map-utils.js`

### Image not loading
- Check relative paths in HTML and data files
- Verify image file exists in `Images/Odus/` or `Images/Antonica/`
- Ensure image ID matches the one in JavaScript

### Navigation links broken
- Use relative paths: `zonename.html` (same directory)
- From HTML pages, use `../../index.html` for root level
- Test all links before committing

## Performance Notes

- Keep location arrays in data files (no external API calls)
- Images should be PNG format, reasonably compressed
- CSS files are shared across all zones to reduce redundancy
- JavaScript modules are cached in the browser

## Future Expansion

When expanding to other regions (e.g., Antonica, Kunark):

1. Create new image directories (e.g., `Images/Antonica/`, `Images/Kunark/`)
2. Use same HTML template (just change paths for region)
3. Maintain consistent coordinate system across all regions
4. Update index.html with new region sections
5. Follow same data file format for consistency

---

**Last Updated**: November 2024

For questions or updates to this guide, refer to the actual zone implementations in the repository.
