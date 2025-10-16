const { getStore } = require("@netlify/blobs");
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { spotIds, email, brand } = JSON.parse(event.body);
        if (!spotIds || spotIds.length === 0 || !email || !brand) {
            return { statusCode: 400, body: JSON.stringify({ message: "Spot selections, email, and brand name are required." }) };
        }

        const spotsStore = getStore("spots");
        let adSpots = await spotsStore.get("spots-data", { type: "json" });

        // Validation Phase
        for (const item of spotIds) {
            const spot = adSpots[item.zoneId]?.spots[item.spotId];
            if (!spot || spot.status === 'Booked') {
                return { statusCode: 409, body: JSON.stringify({ message: `Position "${spot?.name || 'Unknown'}" is invalid or already booked.` }) };
            }
        }

        // Booking Phase
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

        // Write back to the Blob store
        await spotsStore.setJSON("spots-data", adSpots);

        // Email logic...
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
        });

        let discountAmount = 0;
        if (bookedSpotsDetails.length === 2) { discountAmount = 5000; } 
        else if (bookedSpotsDetails.length >= 3) { discountAmount = 10000; }
        const finalTotal = subtotal - discountAmount;
        
        const spotsListHtml = bookedSpotsDetails.map(s => `<li>${s.name} - ${s.price.toLocaleString()} THB</li>`).join('');
        const discountHtml = discountAmount > 0 ? `<p>Discount: -${discountAmount.toLocaleString()} THB</p>` : '';

        const mailOptions = {
            from: `"iHAVECPU Pattaya" <${process.env.GMAIL_USER}>`,
            to: email, cc: 'manager@example.com',
            subject: `Booking Confirmation for ${brand} at iHAVECPU Pattaya`,
            html: `<h1>Thank you!</h1><p>Booking for brand "<strong>${brand}</strong>" confirmed.</p><h3>Positions:</h3><ul>${spotsListHtml}</ul><hr><p>Subtotal: ${subtotal.toLocaleString()} THB</p>${discountHtml}<h3>Total: ${finalTotal.toLocaleString()} THB</h3><br><p>Sincerely,<br>The iHAVECPU Pattaya Team</p>`
        };
        await transporter.sendMail(mailOptions);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "All selected positions have been booked successfully!" }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: `An error occurred: ${error.message}` }) };
    }
};