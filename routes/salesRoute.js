const express = require('express');
const router = express.Router();
const { Sales } = require('../models/salesModel');
const { Inventory } = require('../models/inventoryModel');

// Display All Sales Transactions
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.findAll({
            include: [{ model: Inventory, as: 'item' }] // Fetch item details
        });

        // Calculate Total Revenue
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalSaleAmount, 0);

        res.render('sales', { sales, totalRevenue });
    } catch (error) {
        console.error('Error fetching sales transactions:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Display Ledger Report (Debits and Credits)
router.get('/ledger', async (req, res) => {
    try {
        const inventoryItems = await Inventory.findAll();
        const sales = await Sales.findAll();

        // Calculate Ledger Balances
        const ledgerEntries = inventoryItems.map(item => {
            const totalSold = sales
                .filter(sale => sale.itemId === item.id)
                .reduce((sum, sale) => sum + sale.totalSaleAmount, 0);

            return {
                itemName: item.name,
                debit: item.quantity * item.price, // Initial stock value
                credit: totalSold, // Total sales value
                balance: (item.quantity * item.price) - totalSold // Remaining stock value
            };
        });

        res.render('ledger', { ledgerEntries });
    } catch (error) {
        console.error('Error generating ledger report:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Process Sale Transaction
router.post('/sell/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { quantitySold } = req.body;

        if (!quantitySold || quantitySold <= 0) {
            return res.status(400).send('Invalid quantity entered.');
        }

        const sale = await Sales.recordSale(itemId, quantitySold);
        console.log(`Sale recorded: ${sale.quantitySold} units of item ID ${sale.itemId}`);
        res.redirect('/sales'); // Redirect to sales page after selling
    } catch (error) {
        console.error('Error processing sale:', error.message);
        res.status(500).send(error.message);
    }
});

module.exports = router;
