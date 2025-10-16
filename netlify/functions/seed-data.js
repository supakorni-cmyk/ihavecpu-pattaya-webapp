import { getStore } from "@netlify/blobs";
import fs from "fs/promises";
import path from "path";

export default async (req) => {
    try {
        const dataPath = path.resolve(process.cwd(), 'data/spots.json');
        const localData = await fs.readFile(dataPath, 'utf-8');
        const spotsObject = JSON.parse(localData);
        const spotsStore = getStore("spots");
        await spotsStore.setJSON("spots-data", spotsObject);
        return new Response("✅ Data seeded successfully.", { headers: { "Content-Type": "text/plain" } });
    } catch (error) {
        return new Response(`Error seeding data: ${error.message}`, { status: 500 });
    }
};