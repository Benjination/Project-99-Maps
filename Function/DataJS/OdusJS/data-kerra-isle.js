export const zoneData = {
    name: 'Kerra Isle',
    region: 'Odus',
    suggestedLevel: '1-10',
    mapImage: '../../Images/Odus/KerraIsle.png',
    // NOTE: Coordinates have been updated to the new universal viewport system (0-1200, 0-900)
    // If locations appear incorrect, use builder mode (?builder=true) to re-place pins
       locations: [
        { number: 1, name: 'Prison', x: 391, y: 233 },
        { number: 2, name: 'High Temple', x: 333, y: 303 },
        { number: 3, name: 'Cave of Sujah', x: 606, y: 357 },
        { number: 4, name: 'Tiger Island', x: 637, y: 723 },
        { number: 5, name: 'Tiger Training Pit', x: 563, y: 779 },
    ],
    buttons: [
        { name: 'Toxxulia Forest', link: 'toxulia-forest.html', x: 931, y: 420 },
    ]
};
