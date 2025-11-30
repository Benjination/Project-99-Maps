export const zoneData = {
    name: 'Befallen Level 1',
    region: 'Antonica',
    description: 'Befallen Level 1 - Ancient Undead Catacombs',
    suggestedLevel: '15-35',
    mapImage: '../../Images/Antonica/Befallen1.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
    locations: [
        { number: 1, name: 'Dark Elf Shadow Knight', x: 266, y: 435 },
        { number: 2, name: 'Skeleton Lrodd & Pit', x: 400, y: 471 },
        { number: 'A', name: 'First Locked Door', x: 653, y: 370 },
        { number: 3, name: 'PIT TRAP Room', x: 591, y: 767 },
        { number: 4, name: 'Ogre Shadow Knight', x: 297, y: 710 },
        { number: 'B', name: 'Second Locked Door', x: 486, y: 759 },
        { number: 5, name: 'The Broken Stair', x: 803, y: 790 },
        { number: 'C', name: 'Third Locked Door', x: 803, y: 851 },
    ],
    buttons: [
        { name: 'West Commonlands', link: 'west-commonlands.html', x: 474, y: 49 },
        { name: 'Level 3', link: 'befallen2.html', x: 803, y: 873 },
    ]
};