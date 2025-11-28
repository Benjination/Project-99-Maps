export const zoneData = {
    name: 'Erudin Docks',
    region: 'Odus',
    suggestedLevel: '1-10',
    mapImage: '../../Images/Odus/ErudinDocks.png',
    // NOTE: Coordinates have been updated to the new universal viewport system (0-1200, 0-900)
    // If locations appear incorrect, use builder mode (?builder=true) to re-place pins
    locations: [
        { number: 1, name: 'Merchant - Bags and Boxes', x: 673, y: 605 },
        { number: 2, name: 'Erudin Port Authority', x: 612, y: 605 },
        { number: 3, name: 'Merchant - Cooking Supplies', x: 686, y: 707 },
        { number: 4, name: 'Priest of Discord', x: 625, y: 926 },
        { number: 5, name: 'Teleporter to Erudin', x: 598, y: 1127 },
        { number: 6, name: 'Teleporter Arrival Platform', x: 599, y: 1183 }
    ],
    buttons: [
        { name: 'South Qeynos', link: '../AntonicaHTML/qeynos-s.html', x: 339, y: 804 },
        { name: 'Erudin', link: 'erudin.html', x: 599, y: 1101 }
    ]
};
