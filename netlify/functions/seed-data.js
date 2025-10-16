const { getStore } = require("@netlify/blobs");
const fs = require("fs").promises;
const path = require("path");

exports.handler = async (event, context) => {
    try {
        // Construct the path to the local data file
        const dataPath = path.resolve(process.cwd(), 'data/spots.json');
        
        // Read the local JSON data
        const localData = await fs.readFile(dataPath, 'utf-8');
        const spotsObject = JSON.parse(localData);

        // Get the blob store named "spots"
        const spotsStore = getStore("spots");
        
        // Save the entire JSON object to the blob store under the key "spots-data"
        await spotsStore.setJSON("spots-data", spotsObject);

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: "✅ Data has been successfully seeded into the Blob store.",
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "text/plain" },
            body: `Error seeding data: ${error.message}`,
        };
    }
};