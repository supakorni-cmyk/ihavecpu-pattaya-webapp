import { getStore } from "@netlify/blobs";

const checkAuth = (req) => {
    // ... (checkAuth function remains the same) ...
};

export default async (req) => {
    // ... (Authentication check remains the same) ...

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { zoneId, spotId } = await req.json();
        console.log(`[Unbook] Received request for Zone: ${zoneId}, Spot: ${spotId}`); // Log input

        if (!zoneId || !spotId) {
            return new Response(JSON.stringify({ message: "Zone ID and Spot ID are required." }), { status: 400 });
        }

        const spotsStore = getStore("spots");
        console.log("[Unbook] Getting data from Blob store..."); // Log before read
        let adSpots = await spotsStore.get("spots-data", { type: "json" });
        console.log("[Unbook] Data received from Blob store."); // Log after read

        const spot = adSpots[zoneId]?.spots[spotId];
        if (!spot) {
            console.error(`[Unbook] Spot not found: ${zoneId}/${spotId}`); // Log error
            return new Response(JSON.stringify({ message: "Spot not found." }), { status: 404 });
        }

        console.log(`[Unbook] Spot status BEFORE update: ${spot.status}`); // Log status before change
        spot.status = "Available";
        spot.bookedBy = "";
        spot.brand = "";
        console.log(`[Unbook] Spot status AFTER update: ${spot.status}`); // Log status after change

        console.log("[Unbook] Attempting to save updated data to Blob store..."); // Log before write
        await spotsStore.setJSON("spots-data", adSpots);
        console.log("[Unbook] Data successfully saved to Blob store."); // Log after write

        return new Response(JSON.stringify({ success: true, message: "Position has been made available." }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("[Unbook] Function crashed:", error); // Log any crashes
        return new Response(JSON.stringify({ message: `Server error: ${error.message}` }), { status: 500 });
    }
};