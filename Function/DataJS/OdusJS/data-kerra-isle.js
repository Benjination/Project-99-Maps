export const zoneData = {
    name: 'Kerra Isle',
    region: 'Odus',
    suggestedLevel: '1-10',
    mapImage: '../../Images/Odus/KerraIsle.png',
    // NOTE: Coordinates have been updated to the new universal viewport system (0-1200, 0-900)
    // If locations appear incorrect, use builder mode (?builder=true) to re-place pins
    locations: [
        { number: 1, name: 'Prison', x: 674, y: 659 },
        { number: 2, name: 'High Temple', x: 722, y: 730 },
        { number: 3, name: 'Cave of Sujah', x: 495, y: 791 },
        { number: 4, name: 'Tiger Island', x: 467, y: 1206 },
        { number: 5, name: 'Tiger Training Pit', x: 532, y: 1265 }
    ],
    buttons: [
        { name: 'Toxulia Forest', link: 'toxulia-forest.html', x: 216, y: 860 }
    ]
};
