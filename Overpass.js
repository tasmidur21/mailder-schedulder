const overpy = require('overpy');

const query = `
  node(around:200000,27.584181,85.2482828);
  out;
`;

overpy.Overpass(query, (err, osm) => {
    if (err) {
        console.error(err);
    } else {
        const nodes = osm.elements;
        nodes.forEach((node) => {
            console.log(`Latitude: ${node.lat}, Longitude: ${node.lon}`);
        });
    }
});