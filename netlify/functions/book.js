import { getStore } from "@netlify/blobs";
import nodemailer from "nodemailer";

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { spotIds, email, brand } = await req.json();
        
        if (!spotIds || spotIds.length === 0 || !email || !brand) {
            return new Response(JSON.stringify({ message: "Spot selections, email, and brand name are required." }), { status: 400 });
        }

        const spotsStore = getStore("spots");
        let adSpots = await spotsStore.get("spots-data", { type: "json" });

        // Validation Phase (unchanged)
        for (const item of spotIds) {
            const spot = adSpots[item.zoneId]?.spots[item.spotId];
            if (!spot || spot.status === 'Booked') {
                return new Response(JSON.stringify({ message: `Position "${spot?.name || 'Unknown'}" is invalid or already booked.` }), { status: 409 });
            }
        }

        // Booking Phase (unchanged)
        let bookedSpotsDetails = [];
        let subtotal = 0;
        spotIds.forEach(item => {
            const spot = adSpots[item.zoneId].spots[item.spotId];
            spot.status = 'Booked';
            spot.bookedBy = email;
            spot.brand = brand;
            bookedSpotsDetails.push({ name: spot.name, price: spot.price });
            subtotal += spot.price;
        });

        // --- THIS IS THE FIX: Write back to the Blob store ---
        await spotsStore.setJSON("spots-data", adSpots);

        // ... (rest of your email logic is the same) ...

        return new Response(JSON.stringify({ success: true, message: "All selected positions have been booked successfully!" }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `An error occurred: ${error.message}` }), { status: 500 });
    }
};