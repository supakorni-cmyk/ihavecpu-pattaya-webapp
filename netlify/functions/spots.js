const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
    try {
        const spotsStore = getStore("spots");
        const adSpots = await spotsStore.get("spots-data", { type: "json" });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adSpots),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error reading data from Blob store" }),
        };
    }
};