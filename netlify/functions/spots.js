const fs = require('fs-extra');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'spots.json');
        const adSpots = await fs.readJson(dataPath);
        return {
            statusCode: 200,
            body: JSON.stringify(adSpots),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error reading data' }) };
    }
};