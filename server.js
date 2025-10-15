// File: server.js

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer'); // <-- Add this line
const app = express();
const PORT = 3000;
const basicAuth = require('express-basic-auth');

// --- NEW: Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail'
    auth: {
        user: 'supakorn.i@ihavecpu.com',         // <-- Replace with your Gmail address
        pass: 'vmvm fhiu vgds typt' // <-- Replace with your App Password
    }
});
// --- END NEW ---

app.use(express.json());

const adminAuth = basicAuth({
    users: { 'admin': 'mktihavecpunarak' }, // <-- CHANGE your username and password here
    challenge: true, // This will cause a browser popup
    realm: 'Imb4T3st4pp',
});

// --- Protect the Admin Routes ---
// This requires a password to access /admin.html
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// This requires a password to get the admin data
app.get('/admin/data', adminAuth, (req, res) => {
    res.json(adSpots);
});

app.use(express.static(path.join(__dirname, 'public')));

// --- In-Memory Mock Database (Organized by Zones) ---
const adSpots = {
  "exteriorLogo": {
    name: "Exterior Logo",
    layoutImages: ["images/exterior_logo.jpg"],
    spots: {
      "EX1": { 
        name: "EX1", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '',
      },
      "EX2": { 
        name: "EX2", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '',
      },
      "EX3": { 
        name: "EX3", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX4": { 
        name: "EX4", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX5": { 
        name: "EX5", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX6": { 
        name: "EX6", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX7": { 
        name: "EX7", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX8": { 
        name: "EX8", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX9": { 
        name: "EX9", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX10": { 
        name: "EX10", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX11": { 
        name: "EX11", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX12": { 
        name: "EX12", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX13": { 
        name: "EX13", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX14": { 
        name: "EX14", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "EX15": { 
        name: "EX15", 
        size: "1920x1080px", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
    }
  },
  "exteriorSticker": {
    name: "Exterior Sticker",
    layoutImages: ['images/exterior_sticker.jpg'],
    spots: {
      "FST-1": { 
        name: "FST-1", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "FST-2": { 
        name: "FST-2", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "FST-3": { 
        name: "FST-3", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "FST-4": { 
        name: "FST-4", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "FST-5": { 
        name: "FST-5", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
    }
  },
  "interiorSticker": {
    name: "Interior Sticker",
    layoutImages: [
      'images/ist1-2.jpg',
      'images/ist3-4.jpg',
      'images/ist5-6.jpg',
      'images/ist7-8.jpg'
    ],
    spots: {
      "IST-1": { 
        name: "IST-1", 
        size: "3m x 1.5m", 
        price: 35000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-2": { 
        name: "IST-2", 
        size: "3m x 1.5m", 
        price: 35000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-3": { 
        name: "IST-3", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-4": { 
        name: "IST-4", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-5": { 
        name: "IST-5", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-6": { 
        name: "IST-6", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-7": { 
        name: "IST-7", 
        size: "3m x 1.5m", 
        price: 30000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "IST-8": { 
        name: "IST-8", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
    }
  },
"interiorLogo": {
    name: "Interior Logo",
    layoutImages: [
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
    ],
    spots: {
      "A1": { 
        name: "A1 - CPU", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A2": { 
        name: "A2 - CPU", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A3": { 
        name: "A3 - Monitor", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A4": { 
        name: "A4 - Monitor", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A5": { 
        name: "A5 - Monitor", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A6": { 
        name: "A6 - Monitor", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A7": { 
        name: "A7 - Monitor", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A8": { 
        name: "A8 - Accessories", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A9": { 
        name: "A9 - Case & Cooling", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A10": { 
        name: "A10 - Case & Cooling", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A11": { 
        name: "A11 - Case & Cooling", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A12": { 
        name: "A12 - Case & Cooling", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A13": { 
        name: "A13 - Case & Cooling", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A14": { 
        name: "A14 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A15": { 
        name: "A15 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },
      "A16": { 
        name: "A16 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },     
      "A17": { 
        name: "A17 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A18": { 
        name: "A18 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A19": { 
        name: "A19 - DIY", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A20": { 
        name: "A20 - Gaming Gear", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A21": { 
        name: "A21 - Gaming Gear", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A22": { 
        name: "A22 - Gaming Gear", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
      "A23": { 
        name: "A23 - Gaming Gear", 
        size: "3m x 1.5m", 
        price: 20000, 
        status: 'Available', 
        bookedBy: '', 
      },  
    }
  }
};
// ---------------------------------

// --- API Endpoints ---

// Endpoint for the frontend to get all spot data
app.get('/api/spots', (req, res) => {
  res.json(adSpots);
});

// Endpoint for the admin page to get all spot data
app.get('/admin/data', (req, res) => {
    res.json(adSpots);
});

// Endpoint to handle new bookings from users
app.post('/api/book', (req, res) => {
    const { spotIds, email, brand } = req.body;

    if (!spotIds || spotIds.length === 0 || !email || !brand) {
        return res.status(400).json({ success: false, message: "Spot selections, an email and brand name are required." });
    }

    // Validation Phase
    for (const item of spotIds) {
        const zone = adSpots[item.zoneId];
        if (!zone || !zone.spots[item.spotId]) {
            return res.status(404).json({ success: false, message: `An invalid position was selected.` });
        }
        const spot = zone.spots[item.spotId];
        if (spot.status === 'Booked') {
            return res.status(409).json({ success: false, message: `Position "${spot.name}" is already booked.` });
        }
    }

    // Booking Phase & Email preparation
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

    // Calculate discount for the email
    let discountRate = 0;
    if (bookedSpotsDetails.length === 2) { discountRate = 0.02; } 
    else if (bookedSpotsDetails.length >= 3) { discountRate = 0.05; }
    const discountAmount = subtotal * discountRate;
    const finalTotal = subtotal - discountAmount;

    // Send Confirmation Email
    const spotsListHtml = bookedSpotsDetails.map(s => `<li>${s.name} - ${s.price.toLocaleString()} THB</li>`).join('');
    const discountHtml = discountAmount > 0 ? `<p>Discount (${discountRate * 100}%): -${discountAmount.toLocaleString()} THB</p>` : '';

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });

    console.log(`✅ ${spotIds.length} positions booked by ${email} for brand: ${brand}.`);
    res.status(200).json({ success: true, message: "All selected positions have been booked successfully!" });
});

// Endpoint for admins to un-book (delete) a booking
app.post('/api/unbook', (req, res) => {
    const { zoneId, spotId } = req.body;

    if (!zoneId || !spotId) {
        return res.status(400).json({ success: false, message: "Zone ID and Spot ID are required." });
    }

    const zone = adSpots[zoneId];
    if (!zone || !zone.spots[spotId]) {
        return res.status(404).json({ success: false, message: "Spot not found." });
    }

    const spot = zone.spots[spotId];
    spot.status = 'Available';
    spot.bookedBy = '';
    spot.brand = '';

    console.log(`✅ Admin un-booked position: ${spot.name} (${spotId})`);
    res.status(200).json({ success: true, message: "Position has been made available." });
});

// --- NEW ENDPOINT TO EXPORT DATA TO EXCEL ---
const ExcelJS = require('exceljs');

app.get('/admin/export-excel', adminAuth, async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');

        // 1. Define the columns for the Excel sheet
        worksheet.columns = [
            { header: 'Brand', key: 'brand', width: 30 },
            { header: 'Position Name', key: 'name', width: 30 },
            { header: 'Zone', key: 'zoneName', width: 25 },
            { header: 'Price', key: 'price', width: 15, style: { numFmt: '#,##0 THB' } },
            { header: 'Booked By (Email)', key: 'bookedBy', width: 30 },
            { header: 'Booking Date', key: 'bookingDate', width: 20 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };

        let totalRevenue = 0;

        // 2. Add the booked data as rows
        for (const zoneId in adSpots) {
            const zone = adSpots[zoneId];
            for (const spotId in zone.spots) {
                const spot = zone.spots[spotId];
                if (spot.status === 'Booked') {
                    worksheet.addRow({
                        brand: spot.brand,
                        name: spot.name,
                        zoneName: zone.name,
                        price: spot.price,
                        bookedBy: spot.bookedBy,
                        bookingDate: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD format
                    });
                    totalRevenue += spot.price;
                }
            }
        }
        
        // Add a total row at the bottom
        worksheet.addRow([]); // Blank row for spacing
        const totalRow = worksheet.addRow({ brand: 'Total Revenue', price: totalRevenue });
        totalRow.font = { bold: true };

        // 3. Set headers to tell the browser it's an Excel file
        const date = new Date().toISOString().slice(0, 10);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="bookings-${date}.xlsx"`
        );

        // 4. Write the file to the response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Failed to export Excel file:", error);
        res.status(500).send("Error creating Excel file.");
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ iHAVECPU Pattaya server running at http://localhost:${PORT}`);
});