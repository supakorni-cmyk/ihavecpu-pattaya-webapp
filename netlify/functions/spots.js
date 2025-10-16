import { getStore } from "@netlify/blobs";

export default async (req) => {
    try {
        const spotsStore = getStore("spots");
        const adSpots = await spotsStore.get("spots-data", { type: "json" });
        return new Response(JSON.stringify(adSpots), { headers: { "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error reading data" }), { status: 500 });
    }
};