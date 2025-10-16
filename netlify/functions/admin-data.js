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

    try {
        const spotsStore = getStore("spots");
        const adSpots = await spotsStore.get("spots-data", { type: "json" });
        
        return new Response(JSON.stringify(adSpots), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error reading data from Blob store" }), {
            status: 500,
        });
    }
};