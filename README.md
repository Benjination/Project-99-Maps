
Site: https://benjination.github.io/Project-99-Maps/

# Project 1999 Maps

An interactive web-based mapping system for Project 1999 EverQuest zones. Browse detailed zone maps with clickable location markers and navigate between adjacent zones.

## Features

- **Interactive Zone Maps**: Clickable location markers on hand-drawn maps
- **Multi-Zone Support**: Multiple EverQuest zones with inter-zone navigation
- **Responsive Design**: Works on desktop and mobile browsers
- **Dark Theme**: Easy on the eyes with gold accents
- **Location Details**: Browse location names and descriptions

## Currently Supported Zones

- **Odus Region**
  - Paineel (The Hidden City of Heretics)
  - Paineel 2 (Hidden sub-zone)
  - The Hole
  - The Warrens
  - Toxulia Forest

- **Antonica Region**
  - Qeynos (North & South)
  - Qeynos Hills & Aqueducts
  - Surefall Glade & Bear Caves
  - Blackburrow (3 levels)
  - Everfrost Peaks & Halas
  - Permafrost Keep
  - Karana Plains (Western, Northern, Eastern, Southern)
  - High Hold Pass & High Keep (5 levels)
  - Kithicor Forest
  - Misty Thicket & Rivervale
  - Gorge of King Xorbb
  - Runnyeye Citadel (4 levels)

## Project Structure

```
.
├── index.html                 # Homepage with zone selection
├── Fashion/HTML/              # Odus zone page templates
│   ├── paineel.html
│   ├── paineel-2.html
│   ├── the-hole.html
│   ├── the-warrens.html
│   └── toxulia-forest.html
├── Fashion/AntonicaHTML/      # Antonica zone page templates
│   ├── qeynos-n.html
│   ├── qeynos-s.html
│   ├── western-karana.html
│   ├── runnyeye1.html
│   └── ...
├── Function/
│   ├── zone-init.js          # Zone page initialization
│   ├── map-utils.js          # Shared mapping utilities
│   ├── builder-mode.js       # Interactive pin placement
│   ├── DataJS/              # Zone data files
│   │   ├── OdusJS/          # Odus zone data
│   │   │   ├── data-paineel.js
│   │   │   ├── data-the-hole.js
│   │   │   └── ...
│   │   └── AntonicaJS/      # Antonica zone data
│   │       ├── data-qeynos-n.js
│   │       ├── data-western-karana.js
│   │       └── ...
│   └── CSS/                 # Stylesheets
│       ├── maps.css
│       ├── paineel.css      # Universal zone styling
│       └── zone.css
├── Images/
│   ├── Odus/               # Odus zone map images
│   │   ├── Paineel.png
│   │   ├── TheHole.png
│   │   └── ...
│   └── Antonica/           # Antonica zone map images
│       ├── QeynosN.png
│       ├── WesternKarana.png
│       └── ...
└── Locations/              # Location reference files
    ├── paineel.txt         # Odus locations
    ├── theHole.txt
    └── AntonicaLoc/        # Antonica locations
        ├── qeynosN.txt
        ├── westernKarana.txt
        └── ...
```

## Usage

Simply open `index.html` in a web browser to get started. Click on any zone to view its map and locations.

## Attribution

This project uses content from [Wikipedia](https://www.wikipedia.org/) under the Creative Commons Attribution-ShareAlike License. Zone descriptions, location names, and other information are sourced from EverQuest-related Wikipedia articles.

- EverQuest world information: [https://en.wikipedia.org/wiki/EverQuest](https://en.wikipedia.org/wiki/EverQuest)
- Odus region details from EverQuest community resources

## License

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License** (CC BY-SA 4.0).

You are free to use, modify, and share this project under the following conditions:
- **Attribution**: Give credit to this project and Wikipedia sources
- **ShareAlike**: Any modifications must be shared under the same license

See the [LICENSE](LICENSE) file for full details, or visit [creativecommons.org](https://creativecommons.org/licenses/by-sa/4.0/).

## Contributing

Contributions are welcome! If you'd like to:
- Add more zones
- Improve map layouts
- Add more location details
- Fix bugs

Please feel free to submit a pull request.

## Development

To add a new zone:

1. Create a new HTML file in `Fashion/AntonicaHTML/` or `Fashion/HTML/`
2. Create a corresponding data file in `Function/DataJS/AntonicaJS/` or `Function/DataJS/OdusJS/` using `export const zoneData` format
3. Add zone image to `Images/Antonica/` or `Images/Odus/`
4. Use builder mode (`?builder=true`) to position location pins
5. Update navigation buttons in adjacent zone data files
6. Update the main `index.html` navigation menu

## Project 1999

This project is a fan tool for [Project 1999](https://www.project1999.com/), a free EverQuest emulation server.

---

**Last Updated**: November 2024
**Maintainer**: Benjination
