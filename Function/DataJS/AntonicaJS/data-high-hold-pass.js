export const zoneData = {
    name: 'High Hold Pass',
    region: 'Antonica',
    description: 'High Hold Pass - Mountain Pass to High Keep',
    suggestedLevel: '15-35',
    mapImage: '../../Images/Antonica/HighHoldPass.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
     locations: [
        { number: 1, name: 'Gnoll Area', x: 550, y: 186 },
        { number: 2, name: 'The Golden Rooster', x: 791, y: 214 },
        { number: 3, name: 'Pottery Shop', x: 414, y: 306 },
        { number: 4, name: 'Tiger\'s Roar', x: 441, y: 424 },
        { number: 5, name: 'Bandit Camp', x: 579, y: 397 },
        { number: 6, name: 'Serpent Supply', x: 623, y: 508 },
        { number: 7, name: 'The Lumberyard', x: 690, y: 513 },
        { number: 8, name: 'Greenbanes\' Weapons', x: 769, y: 578 },
        { number: 9, name: 'Orc Area', x: 574, y: 784 },
    ],
    buttons: [
        { name: 'Eartern Karana', link: 'eastern-karana.html', x: 650, y: 32 },
        { name: 'High Hold Keep', link: 'high-keep-level-1.html', x: 794, y: 343 },
        { name: 'Kithicor Forest', link: 'kithicor-forest.html', x: 601, y: 869 },
    ]
};