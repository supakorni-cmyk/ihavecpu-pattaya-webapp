import { getStore } from "@netlify/blobs";
import ExcelJS from "exceljs";

// Helper function for Basic Authentication
const checkAuth = (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return false;

    const [scheme, encoded] = authHeader.split(" ");
    if (scheme !== "Basic" || !encoded) return false;

    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");
    
    // Uses environment variables set in your Netlify dashboard
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
};

export default async (req) => {
    // 1. Check if the user is authorized
    if (!checkAuth(req)) {
        return new Response("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
        });
    }

    // 2. Generate the Excel file
    try {
        const spotsStore = getStore("spots");
        const adSpots = await spotsStore.get("spots-data", { type: "json" });
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Bookings");

        // Define the columns for the Excel sheet
        worksheet.columns = [
            { header: "Brand", key: "brand", width: 30 },
            { header: "Position Name", key: "name", width: 30 },
            { header: "Zone", key: "zoneName", width: 25 },
            { header: "Price", key: "price", width: 15, style: { numFmt: "#,##0 THB" } },
            { header: "Booked By (Email)", key: "bookedBy", width: 30 },
        ];
        worksheet.getRow(1).font = { bold: true }; // Style the header
        
        let totalRevenue = 0;

        // Loop through the data and add rows for booked spots
        for (const zoneId in adSpots) {
            const zone = adSpots[zoneId];
            for (const spotId in zone.spots) {
                const spot = zone.spots[spotId];
                if (spot.status === "Booked") {
                    worksheet.addRow({ 
                        brand: spot.brand, 
                        name: spot.name, 
                        zoneName: zone.name, 
                        price: spot.price, 
                        bookedBy: spot.bookedBy 
                    });
                    totalRevenue += spot.price;
                }
            }
        }
        
        // Add a total row at the bottom
        worksheet.addRow([]); // Blank row for spacing
        const totalRow = worksheet.addRow({ brand: "Total Revenue", price: totalRevenue });
        totalRow.font = { bold: true };

        // Write the Excel file to a buffer in memory
        const buffer = await workbook.xlsx.writeBuffer();
        const date = new Date().toISOString().slice(0, 10);

        // Return the buffer as a downloadable file
        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="bookings-${date}.xlsx"`,
            },
        });
    } catch (error) {
        console.error("Excel Export Error:", error);
        return new Response(JSON.stringify({ message: "Error creating Excel file." }), { status: 500 });
    }
};