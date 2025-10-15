const fs = require('fs-extra');
const path = require('path');

// Helper function for Basic Authentication
const checkAuth = (event) => {
    const authHeader = event.headers.authorization;
    if (!authHeader) return false;
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme !== 'Basic' || !encoded) return false;
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [user, pass] = decoded.split(':');
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
};

exports.handler = async (event, context) => {
    // 1. Check for password
    if (!checkAuth(event)) {
        return {
            statusCode: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            body: 'Unauthorized',
        };
    }

    // 2. Return the data
    try {
        const dataPath = path.join(process.cwd(), 'data', 'spots.json');
        const adSpots = await fs.readJson(dataPath);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adSpots),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error reading data' }) };
    }
};