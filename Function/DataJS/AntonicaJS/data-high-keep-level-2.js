export const zoneData = {
    name: 'High Keep - Level 2',
    region: 'Antonica',
    description: 'High Keep - Level 2',
    suggestedLevel: '20-40',
    mapImage: '../../Images/Antonica/HighHoldKeep2.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
   locations: [
        { number: 1, name: 'Kitchen', x: 507, y: 264 },
        { number: 2, name: 'Gambling Room', x: 696, y: 611 },
    ],
    buttons: [
        { name: 'Level 1', link: 'high-keep-level-1.html', x: 833, y: 469 },
        { name: 'Level 3', link: 'high-keep-level-3.html', x: 291, y: 464 },
    ]
};