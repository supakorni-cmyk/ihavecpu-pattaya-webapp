const { getStore } = require("@netlify/blobs");

// (You'll need a basic auth helper for CJS)
const checkAuth = (event) => {
    const authHeader = event.headers.authorization;
    if (!authHeader) return false;
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme !== "Basic" || !encoded) return false;
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
};

exports.handler = async (event, context) => {
    if (!checkAuth(event)) {
        return { statusCode: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' }, body: "Unauthorized" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { zoneId, spotId } = JSON.parse(event.body);
        if (!zoneId || !spotId) {
            return { statusCode: 400, body: JSON.stringify({ message: "Zone ID and Spot ID are required." }) };
        }

        const spotsStore = getStore("spots");
        let adSpots = await spotsStore.get("spots-data", { type: "json" });

        const spot = adSpots[zoneId]?.spots[spotId];
        if (!spot) {
            return { statusCode: 404, body: JSON.stringify({ message: "Spot not found." }) };
        }

        spot.status = "Available";
        spot.bookedBy = "";
        spot.brand = "";

        await spotsStore.setJSON("spots-data", adSpots);

        return { statusCode: 200, body: JSON.stringify({ success: true, message: "Position has been made available." }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};