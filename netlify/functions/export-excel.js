const fs = require('fs-extra');
const path = require('path');
const ExcelJS = require('exceljs');

// Helper function for Basic Authentication
const checkAuth = (event) => {
    // ... (same checkAuth function as above) ...
};

exports.handler = async (event, context) => {
    // 1. Check for password
    if (!checkAuth(event)) {
        return {
            statusCode: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            body: 'Unauthorized',
        };
    }

    // 2. Generate the Excel file
    try {
        const dataPath = path.join(process.cwd(), 'data', 'spots.json');
        const adSpots = await fs.readJson(dataPath);
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');

        worksheet.columns = [
            { header: 'Brand', key: 'brand', width: 30 },
            { header: 'Position Name', key: 'name', width: 30 },
            { header: 'Zone', key: 'zoneName', width: 25 },
            { header: 'Price', key: 'price', width: 15, style: { numFmt: '#,##0 THB' } },
            { header: 'Booked By (Email)', key: 'bookedBy', width: 30 },
        ];
        worksheet.getRow(1).font = { bold: true };
        let totalRevenue = 0;

        for (const zoneId in adSpots) {
            const zone = adSpots[zoneId];
            for (const spotId in zone.spots) {
                const spot = zone.spots[spotId];
                if (spot.status === 'Booked') {
                    worksheet.addRow({ brand: spot.brand, name: spot.name, zoneName: zone.name, price: spot.price, bookedBy: spot.bookedBy });
                    totalRevenue += spot.price;
                }
            }
        }
        worksheet.addRow([]);
        const totalRow = worksheet.addRow({ brand: 'Total Revenue', price: totalRevenue });
        totalRow.font = { bold: true };

        // Write to a buffer and convert to Base64
        const buffer = await workbook.xlsx.writeBuffer();
        const base64data = buffer.toString('base64');
        const date = new Date().toISOString().slice(0, 10);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="bookings-${date}.xlsx"`,
            },
            body: base64data,
            isBase64Encoded: true, // This is crucial for binary files
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Error creating Excel file." }) };
    }
};