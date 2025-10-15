const fs = require('fs-extra');
const path = require('path');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { spotIds, email, brand } = JSON.parse(event.body);
        
        // --- 1. Validate incoming data ---
        if (!spotIds || spotIds.length === 0 || !email || !brand) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Spot selections, an email and brand name are required." })
            };
        }

        // --- 2. Read the current booking data from the JSON file ---
        // Note: process.cwd() is the root of your project during Netlify's build process.
        const dataPath = path.join(process.cwd(), 'data', 'spots.json');
        let adSpots = await fs.readJson(dataPath);
        
        // --- 3. Validate that all selected spots are available ---
        for (const item of spotIds) {
            const spot = adSpots[item.zoneId]?.spots[item.spotId];
            if (!spot) {
                return { statusCode: 404, body: JSON.stringify({ message: `An invalid position was selected.` }) };
            }
            if (spot.status === 'Booked') {
                return { statusCode: 409, body: JSON.stringify({ message: `Position "${spot.name}" is already booked.` }) };
            }
        }
        
        // --- 4. Update the adSpots object in memory ---
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

        // --- 5. Write the updated data back to the spots.json file ---
        await fs.writeJson(dataPath, adSpots, { spaces: 2 });
        
        // --- 6. Send Confirmation Email ---
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Netlify environment variable
                pass: process.env.GMAIL_PASS, // Netlify environment variable
            }
        });

        // Calculate discount for the email
        let discountAmount = 0;
        if (bookedSpotsDetails.length === 2) { discountAmount = 5000; } 
        else if (bookedSpotsDetails.length >= 3) { discountAmount = 10000; }
        const finalTotal = subtotal - discountAmount;
        
        const spotsListHtml = bookedSpotsDetails.map(s => `<li>${s.name} - ${s.price.toLocaleString()} THB</li>`).join('');
        const discountHtml = discountAmount > 0 ? `<p>Discount: -${discountAmount.toLocaleString()} THB</p>` : '';

        const mailOptions = {
        from: '"iHAVECPU Marketing" <supakorn.i@ihavecpu.com>',
        to: email,
        // cc: 'panarin.b@ihavecpu.com, sompong@ihavecpu.com, jittikorn.m@ihavecpu.com, kittichai.r@ihavecpu.com, setthinat.s@ihavecpu.com, attapon.p@ihavecpu.com, sutharat@ihavecpu.com, mkt@ihavecpu.com',
        subject: `[ iHAVECPU x ${brand} ] iHAVECPU PATTAYA`,
        html: `
            <h1>Thank you for your booking!</h1>
            <p>Hello,</p>
            <p>This email confirms your ad-space booking for the brand "<strong>${brand}</strong>" at our Pattaya branch. Here are the details of your reservation:</p>
            <h3>Booked Positions:</h3>
            <ul>${spotsListHtml}</ul>
            <hr>
            <p>Subtotal: ${subtotal.toLocaleString()} THB</p>
            ${discountHtml}
            <h3>Total: ${finalTotal.toLocaleString()} THB</h3>
            <br>
            <p>We look forward to featuring your brand in our store. If you have any questions, please reply to this email.</p>
            <p>Sincerely,</p>
            <p>Boom iHAVECPU</p>
        `
        };

    } catch (error) {
        console.error('Booking Error:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: `An error occurred during the booking process: ${error.message}` }) 
        };
    }
};