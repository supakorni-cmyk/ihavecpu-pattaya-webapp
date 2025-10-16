import { getStore } from "@netlify/blobs";

const checkAuth = (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return false;
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme !== "Basic" || !encoded) return false;
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
};

export default async (req) => {
    if (!checkAuth(req)) {
        return new Response("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
        });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { zoneId, spotId } = await req.json();
        if (!zoneId || !spotId) {
            return new Response(JSON.stringify({ message: "Zone ID and Spot ID are required." }), { status: 400 });
        }

        const spotsStore = getStore("spots");
        let adSpots = await spotsStore.get("spots-data", { type: "json" });

        const spot = adSpots[zoneId]?.spots[spotId];
        if (!spot) {
            return new Response(JSON.stringify({ message: "Spot not found." }), { status: 404 });
        }

        spot.status = "Available";
        spot.bookedBy = "";
        spot.brand = "";

        await spotsStore.setJSON("spots-data", adSpots);

        return new Response(JSON.stringify({ success: true, message: "Position has been made available." }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};