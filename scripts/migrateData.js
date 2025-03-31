const XLSX = require('xlsx');
const { Inventory, sequelize } = require('../models/inventoryModel');

async function migrateData() {
    try {
        console.log('Starting data migration...');

        // Read Excel file
        const workbook = XLSX.readFile('./data/Inventory.xlsx');
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const cleanedData = [];
        const uniqueItems = new Set();

        data.forEach(item => {
            const name = item.Name?.trim().toLowerCase();
            const quantity = Math.max(0, parseInt(item.Quantity)); // Fix negative quantity
            const price = isNaN(item.Price) ? 0 : parseFloat(item.Price); // Fix invalid price
            const description = item.Description?.trim() || '';

            const uniqueKey = `${name}-${price}-${description}`;

            // Avoid duplicate entries
            if (!uniqueItems.has(uniqueKey)) {
                uniqueItems.add(uniqueKey);
                cleanedData.push({ name, quantity, price, description });
            }
        });

        console.log('Data cleaned. Ready to migrate.');

        await sequelize.sync({ force: true }); // Recreate the table
        await Inventory.bulkCreate(cleanedData, { ignoreDuplicates: true });

        console.log('Data migrated successfully to Neon Tech!');
        process.exit();
    } catch (error) {
        console.error('Error migrating data:', error);
        process.exit(1);
    }
}

migrateData();
