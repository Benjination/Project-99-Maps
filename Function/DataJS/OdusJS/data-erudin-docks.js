export const zoneData = {
    name: 'Erudin Docks',
    region: 'Odus',
    suggestedLevel: '1-10',
    mapImage: '../../Images/Odus/ErudinDocks.png',
    // NOTE: Coordinates have been updated to the new universal viewport system (0-1200, 0-900)
    // If locations appear incorrect, use builder mode (?builder=true) to re-place pins
   locations: [
        { number: 1, name: 'Merchant - Bags and Boxes', x: 331, y: 111 },
        { number: 2, name: 'Erudin Port Authority', x: 429, y: 111 },
        { number: 3, name: 'Merchant - Cooking Supplies', x: 314, y: 227 },
        { number: 4, name: 'Priest of Discord', x: 404, y: 481 },
        { number: 5, name: 'Teleporter to Erudin', x: 447, y: 718 },
        { number: 6, name: 'Teleporter Arrival Platform', x: 447, y: 783 },
    ],
    buttons: [
        { name: 'Erudin', link: 'erudin.html', x: 447, y: 678 },
        { name: 'Qeynos', link: '../AntonicaHTML/qeynos-s.html', x: 857, y: 331 },
    ]
};
