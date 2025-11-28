# Zone Development Reference Guide

This guide documents the process and standards used to create zone pages for Project 1999 Maps. Follow these steps to add new zones consistently.

## File Structure Overview

Every zone requires these files:

```
Fashion/HTML/{zonename}.html          # Zone page template
Function/Data/data-{zonename}.js      # Zone configuration and locations
Images/Odus/{ZoneName}.png            # Map image
Locations/{zonename}.txt              # Location reference (optional)
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
    <link rel="stylesheet" href="../../Function/CSS/zone.css">
</head>
<body>
    <div class="container">
        <header>
            <a href="../../index.html" class="back-link">← Back to Zones</a>
            <h1>{Zone Name}</h1>
            <p class="subtitle">{Zone Description}</p>
        </header>

        <nav class="location-nav">
            <a href="../../index.html">Home</a>
            <span class="separator">/</span>
            <a href="../../index.html">{Region}</a>
            <span class="separator">/</span>
            <span class="current">{Zone Name}</span>
        </nav>

        <nav class="adjacent-zones">
            <!-- Add adjacent zone buttons here -->
            <!-- <a href="{adjacent-zone}.html" class="adjacent-button">→ {Adjacent Zone}</a> -->
        </nav>

        <main id="map-container">
            <section class="map-viewer">
                <div class="map-image-wrapper">
                    <img id="{zonename}-map" src="../../Images/Odus/{ZoneName}.png" alt="{Zone Name} Map" class="map-image">
                    <div id="map-overlay" class="map-overlay"></div>
                </div>
                <div class="map-info">
                    <h2>Locations</h2>
                    <div id="locations-list" class="locations-list"></div>
                </div>
            </section>
        </main>
    </div>

    <script type="module" src="../../Function/zone-init.js"></script>
</body>
</html>
```

**Key Notes**:
- Image ID format: `{zonename}-map` (e.g., `paineel-map`, `the-hole-map`)
- Always include `<div id="map-overlay" class="map-overlay"></div>` for interactive features
- Adjacent zone buttons go in the `<nav class="adjacent-zones">` section

## Step 2: Create the Zone Data File

**Location**: `Function/Data/data-{zonename}.js`

**Template**:
```javascript
export const zoneData = {
    name: '{Zone Name}',
    region: '{Region Name}',
    suggestedLevel: '{Level Range}',
    mapImage: '../../Images/Odus/{ZoneName}.png',
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
    x: 500,                             // X coordinate (0-1000, left to right)
    y: 700                              // Y coordinate (400-1400, bottom to top)
}
```

**Coordinate System**:
- **X-axis**: 1000 (left) → 0 (right) — REVERSED
- **Y-axis**: 400 (bottom) → 1400 (top)
- **Corners**:
  - Top-left: (1000, 1400)
  - Top-right: (0, 1400)
  - Bottom-left: (1000, 400)
  - Bottom-right: (0, 400)

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
