// File: netlify/functions/spots.js

const fs = require('fs-extra');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // This builds the path from the function's location up to the root, then down to data/spots.json
        // It's more reliable than process.cwd() in some cases.
        const dataPath = path.resolve(process.cwd(), 'data/spots.json');
        
        console.log("Attempting to read data from:", dataPath); // Adds a debug log

        const adSpots = await fs.readJson(dataPath);
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adSpots),
        };
    } catch (error) {
        console.error("Function Error:", error);
        
        return { 
            statusCode: 500, 
            body: JSON.stringify({ 
                message: 'Error reading booking data file.',
                error: error.message,
                path_tried: path.resolve(process.cwd(), 'data/spots.json') // Shows the exact path it failed on
            }) 
        };
    }
};