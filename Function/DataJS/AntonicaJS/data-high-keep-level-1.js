export const zoneData = {
    name: 'High Keep - Level 1',
    region: 'Antonica',
    description: 'High Keep - Level 1',
    suggestedLevel: '20-40',
    mapImage: '../../Images/Antonica/HighHoldKeep1.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
     locations: [
        { number: 11, name: 'Mail Bard', x: 346, y: 514 },
        { number: 12, name: 'Captain Boshinko', x: 364, y: 605 },
        { number: 13, name: 'Spell Merchants', x: 646, y: 428 },
        { number: 14, name: 'Locked Room', x: 781, y: 436 },
        { number: 15, name: 'Inn', x: 594, y: 615 },
        { number: 16, name: 'Gem Merchant', x: 776, y: 663 },
        { number: 17, name: 'Wizard Trainer', x: 883, y: 596 },
    ],
    buttons: [
        { name: 'Basement - A', link: 'high-keep-basement.html', x: 730, y: 340 },
        { name: 'Level 2', link: 'high-keep-level-2.html', x: 917, y: 526 },
        { name: 'High Hold Pass', link: 'high-hold-pass.html', x: 76, y: 534 },
    ]
};