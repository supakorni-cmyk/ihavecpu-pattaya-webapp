const fs = require('fs-extra');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Construct the full path to the data file.
        // process.cwd() refers to the root directory during Netlify's build process.
        const dataPath = path.join(process.cwd(), 'data', 'spots.json');
        
        // Read the JSON file from the data directory.
        const adSpots = await fs.readJson(dataPath);
        
        // Return a successful response with the data.
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adSpots),
        };
    } catch (error) {
        // Log the error for debugging purposes in Netlify.
        console.error("Error reading spots data:", error);
        
        // Return an error response if something goes wrong.
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: 'Error: Could not read booking data.' }) 
        };
    }
};