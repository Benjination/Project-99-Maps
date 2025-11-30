export const zoneData = {
    name: 'West Freepoint Tunnel',
    region: 'Antonica',
    description: 'West Freepoint Tunnel - Underground Cisterns',
    suggestedLevel: '10-25',
    mapImage: '../../Images/Antonica/WestFreepointTunnel.png',
    // NOTE: Coordinates use universal viewport system (0-1200, 0-900)
    // Use builder mode (?builder=true) to position pins accurately
    locations: [
        { number: 1, name: 'Flooded Room', description: 'Water-filled chamber', x: 300, y: 300 },
        { number: 2, name: 'Toxdil the Rogue', description: 'Rogue dealing in Poison', x: 600, y: 400 },
        { number: 3, name: 'Flooded Water Cistern', description: 'Large water cistern (with four A Drowned Citizens post-Velious only)', x: 450, y: 600 }
    ],
    buttons: [
        { name: 'West Freeport', link: 'west-freeport.html', x: 600, y: 100 }
    ]
};