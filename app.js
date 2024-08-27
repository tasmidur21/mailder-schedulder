const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const axiosRetry = require('axios-retry').default; // Import axios-retry
const districts = require('./cities_lite.json');

const app = express();

// MongoDB Connection URL and Configuration
const url = 'mongodb://localhost:27017';
const dbName = 'geolocation';
const collectionName = 'sa';
const client = new MongoClient(url);

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Nominatim API URL
        const nominatimUrl = 'https://nominatim.openstreetmap.org/search.php';

        // Set up Axios to retry failed requests up to 3 times
        axiosRetry(axios, {
            retries: 3, // Retry failed requests up to 3 times
            retryDelay: axiosRetry.exponentialDelay, // Exponential backoff delay
        });

        // Function to Insert Location Data using findOrCreate
        const insertLocation = async (query) => {
            const params = {
                addressdetails: 1,
                q: query,
                'accept-language': 'en',
                countrycodes: 'sa',
                format: 'jsonv2',
            };

            try {
                const response = await axios.get(nominatimUrl, {
                    params,
                    timeout: 10000, // 10-second timeout for the request
                });
                const data = response.data;

                // Iterate through the API response and use findOrCreate for each item
                for (const item of data) {
                    await findOrCreate(
                        {
                            osm_id: item.osm_id,
                            display_name: item.display_name,
                            lat: item.lat,
                            lon: item.lon,
                        }, // Query to find the document by osm_id
                        item, // Data to insert if the document is not found
                        collection // MongoDB collection
                    );
                }
            } catch (error) {
                if (error.code === 'ECONNABORTED') {
                    console.error(`Request timeout for ${query}:`, error.message);
                } else {
                    console.error(`Error fetching data for ${query}:`, error.message);
                }
            }
        };

        // Function to find or create a document in MongoDB
        const findOrCreate = async (query, data, collection) => {
            try {
                const result = await collection.findOneAndUpdate(
                    query, // Filter: find a document that matches this query
                    { $setOnInsert: data }, // Insert this data if no document is found
                    { upsert: true, returnDocument: 'after' } // Create the document if not found, and return the updated document
                );
                console.log(`Processed document with osm_id: ${data.display_name}`);
                return result.value; // Return the found or created document
            } catch (error) {
                console.error('Error in findOrCreate:', error.message);
            }
        };

        // Process Districts with Delayed Requests
        districts.forEach((item, index) => {
            setTimeout(() => {
                insertLocation(item.name_en);
            }, index * 1000); // Delay each request by 1 second to avoid rate limits
        });

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    } finally {
        // Ensure MongoDB client closes after the process completes
        process.on('SIGINT', async () => {
            await client.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    }
}

// Run the main function
main().catch(console.error);
