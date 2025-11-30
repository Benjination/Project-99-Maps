export const zoneData = {
    name: 'Befallen Level 2',
    region: 'Antonica',
    description: 'Befallen Level 2 - Deeper Undead Chambers',
    suggestedLevel: '20-40',
    mapImage: '../../Images/Antonica/Befallen2.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
    locations: [
        { number: 1, name: 'Pit from Level 1', x: 433, y: 81 },
        { number: 2, name: 'The Thaumaturgist', x: 443, y: 175 },
        { number: 3, name: 'Troll Shadow Knight', x: 677, y: 85 },
        { number: 4, name: 'Pit Trap Bottom', x: 600, y: 328 },
        { number: 5, name: 'Elf Skeleton', x: 797, y: 451 },
        { number: 6, name: 'Dark Elf Female SK', x: 819, y: 833 },
    ],
    buttons: [
        { name: 'Level 2', link: 'befallen1.html', x: 796, y: 375 },
    ]
};