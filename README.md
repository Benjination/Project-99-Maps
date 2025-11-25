
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

## Project Structure

```
.
├── index.html                 # Homepage with zone selection
├── Fashion/HTML/              # Zone page templates
│   ├── paineel.html
│   ├── paineel-2.html
│   ├── the-hole.html
│   ├── the-warrens.html
│   └── toxulia-forest.html
├── Function/
│   ├── zone-init.js          # Zone page initialization
│   ├── map-utils.js          # Shared mapping utilities
│   ├── Data/                 # Zone data files
│   │   ├── data-paineel.js
│   │   ├── data-paineel-2.js
│   │   ├── data-the-hole.js
│   │   ├── data-the-warrens.js
│   │   └── data-toxulia-forest.js
│   └── CSS/                  # Stylesheets
│       ├── maps.css
│       ├── paineel.css
│       └── zone.css
├── Images/Odus/              # Zone map images
│   ├── Paineel.png
│   ├── Paineel2.png
│   ├── TheHole.png
│   ├── TheWarrens.png
│   └── ToxuliaForest.png
└── Locations/                # Location reference files
    ├── paineel.txt
    ├── theHole.txt
    ├── theWarrens.txt
    └── toxuliaForest.txt
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

1. Create a new HTML file in `Fashion/HTML/`
2. Create a corresponding data file in `Function/Data/data-zonename.js`
3. Add zone image to `Images/Odus/`
4. Update navigation links in existing zone pages
5. Update the main `index.html` if adding a new region

## Project 1999

This project is a fan tool for [Project 1999](https://www.project1999.com/), a free EverQuest emulation server.

---

**Last Updated**: November 2024
**Maintainer**: Benjination
