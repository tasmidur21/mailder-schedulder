// index.js

const express = require('express');
const geolib = require('geolib');
const app = express();
const PORT = 3009;

// Mock data for vehicles with latitude and longitude
const vehicles =[
        { id: 1, driver: "John", type: "Car", location: { latitude: 40.751234, longitude: -73.982345 }, available: true },
        { id: 2, driver: "Alice", type: "Car", location: { latitude: 40.763456, longitude: -73.971234 }, available: true, distance: 1200 },
        { id: 3, driver: "David", type: "Car", location: { latitude: 40.778901, longitude: -73.958765 }, available: true, distance: 2500 },
        { id: 4, driver: "Emily", type: "Car", location: { latitude: 40.742345, longitude: -73.985678 }, available: false, distance: 1800 },
        { id: 5, driver: "Michael", type: "Car", location: { latitude: 40.759012, longitude: -73.972345 }, available: true, distance: 3000 },
        { id: 6, driver: "Sarah", type: "Car", location: { latitude: 40.774567, longitude: -73.961234 }, available: true, distance: 2200 },
        { id: 7, driver: "Kevin", type: "Car", location: { latitude: 40.786789, longitude: -73.948765 }, available: false, distance: 4200 },
        { id: 8, driver: "Jessica", type: "Car", location: { latitude: 40.751234, longitude: -73.984567 }, available: true, distance: 1500 },
        { id: 9, driver: "Brian", type: "Car", location: { latitude: 40.768901, longitude: -73.975678 }, available: true, distance: 2800 },
        { id: 10, driver: "Rachel", type: "Car", location: { latitude: 40.742345, longitude: -73.982345 }, available: false, distance: 2000 },
        { id: 11, driver: "Chris", type: "Car", location: { latitude: 40.759012, longitude: -73.971234 }, available: true, distance: 3500 },
        { id: 12, driver: "Laura", type: "Car", location: { latitude: 40.774567, longitude: -73.958765 }, available: true, distance: 2600 },
        { id: 13, driver: "Tom", type: "Car", location: { latitude: 40.786789, longitude: -73.945678 }, available: false, distance: 4800 },
        { id: 14, driver: "Lisa", type: "Car", location: { latitude: 40.751234, longitude: -73.984567 }, available: true, distance: 1300 },
        { id: 15, driver: "Peter", type: "Car", location: { latitude: 40.768901, longitude: -73.975678 }, available: true, distance: 3100 },
        { id: 16, driver: "Amy", type: "Car", location: { latitude: 40.742345, longitude: -73.982345 }, available: false, distance: 2300 },
        { id: 17, driver: "Mark", type: "Car", location: { latitude: 40.759012, longitude: -73.971234 }, available: true, distance: 3800 },
        { id: 18, driver: "Helen", type: "Car", location: { latitude: 40.774567, longitude: -73.958765 }, available: true, distance: 2900 },
        { id: 19, driver: "Paul", type: "Car", location: { latitude: 40.786789, longitude: -73.945678 }, available: false, distance: 5100 },
        { id: 20, driver: "Karen", type: "Car", location: { latitude: 40.751234, longitude: -73.984567 }, available: true, distance: 1600 },
        { id: 21, driver: "Steven", type: "Car", location: { latitude: 40.768901, longitude: -73.975678 }, available: true, distance: 3300 },
        { id: 22, driver: "Donna", type: "Car", location: { latitude: 40.742345, longitude: -73.982345 }, available: false, distance: 2400 }
];

// Function to find nearby vehicles within a given radius
function findNearbyVehicles(lat, lon, radius) {
    const userLocation = { latitude: lat, longitude: lon };

    return vehicles.filter(vehicle => {
        if (!vehicle.available) return false; // Filter out unavailable vehicles
        const distance = geolib.getDistance(userLocation, vehicle.location);
        return distance <= radius; // Return vehicles within the specified radius (in meters)
    });
}

// Endpoint to get nearby vehicles based on selected location
app.get('/nearby-vehicles', (req, res) => {
    const { lat, lon, radius,isSelect } = req.query;

    if (!lat || !lon || !radius) {
        return res.status(400).send('Please provide latitude, longitude, and radius.');
    }

    const nearbyVehicles = findNearbyVehicles(
        parseFloat(lat),
        parseFloat(lon),
        parseInt(radius) // Radius in meters
    );
    const response=nearbyVehicles?.length?nearbyVehicles:(isSelect=='0'?vehicles:[])

    res.json(response);
});

// Serve the frontend (HTML + Leaflet)
app.use(express.static('public'));
app.use('/map', express.static('public'))
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
