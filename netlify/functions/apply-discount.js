import { getStore } from "@netlify/blobs";

// Helper function for Basic Authentication
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
        const { brandName, moreDiscount } = await req.json();
        if (brandName === undefined || moreDiscount === undefined) {
            return new Response(JSON.stringify({ message: "Brand name and discount amount are required." }), { status: 400 });
        }

        const spotsStore = getStore("spots");
        let adSpots = await spotsStore.get("spots-data", { type: "json" });

        // Find all spots for the given brand and apply the new discount
        let spotsFound = 0;
        for (const zoneId in adSpots) {
            for (const spotId in adSpots[zoneId].spots) {
                const spot = adSpots[zoneId].spots[spotId];
                if (spot.brand === brandName) {
                    spot.manualDiscount = parseFloat(moreDiscount) || 0;
                    spotsFound++;
                }
            }
        }

        if (spotsFound === 0) {
            return new Response(JSON.stringify({ message: `No bookings found for brand: ${brandName}` }), { status: 404 });
        }

        // Write the updated data back to the Blob store
        await spotsStore.setJSON("spots-data", adSpots);

        return new Response(JSON.stringify({ success: true, message: `Discount of ${moreDiscount} THB saved for ${brandName}.` }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Server error: ${error.message}` }), { status: 500 });
    }
};