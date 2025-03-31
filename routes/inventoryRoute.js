const express = require('express');
const router = express.Router();
const { Inventory } = require('../models/inventoryModel');
const { Sales } = require('../models/salesModel');

// Home Route - List All Inventory Items
router.get('/', async (req, res) => {
    try {
        const items = await Inventory.findAll();
        res.render('index', { items });
    } catch (error) {
        console.error('Error fetching inventory items:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Display Add New Item Form
router.get('/add', (req, res) => {
    res.render('add');
});

// Add New Inventory Item
router.post('/add', async (req, res) => {
    try {
        const { name, quantity, price, description } = req.body;

        if (quantity < 0 || isNaN(price) || name.trim() === '') {
            return res.status(400).send('Invalid input. Please check quantity, price, and name.');
        }

        // Prevent Duplicate Entries
        const existingItem = await Inventory.findOne({ where: { name: name.trim() } });
        if (existingItem) {
            return res.status(400).send('Item already exists.');
        }

        await Inventory.create({ name: name.trim(), quantity, price, description });
        res.redirect('/');
    } catch (error) {
        console.error('Error adding item:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Display Edit Item Form
router.get('/edit/:id', async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).send('Item not found.');
        res.render('edit', { item });
    } catch (error) {
        console.error('Error fetching item for edit:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Update Inventory Item
router.post('/edit/:id', async (req, res) => {
    try {
        const { name, quantity, price, description } = req.body;

        if (quantity < 0 || isNaN(price) || name.trim() === '') {
            return res.status(400).send('Invalid input. Please check quantity, price, and name.');
        }

        const existingItem = await Inventory.findOne({
            where: { name: name.trim(), id: { [require('sequelize').Op.ne]: req.params.id } }
        });

        if (existingItem) return res.status(400).send('Another item with this name already exists.');

        const updated = await Inventory.update(
            { name: name.trim(), quantity, price, description },
            { where: { id: req.params.id } }
        );

        if (updated[0] === 0) return res.status(404).send('Item not found.');

        res.redirect('/');
    } catch (error) {
        console.error('Error updating item:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Display Delete Confirmation Page
router.get('/delete/:id', async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).send('Item not found.');
        res.render('delete', { item });
    } catch (error) {
        console.error('Error fetching item for deletion:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Delete an Inventory Item
router.post('/delete/:id', async (req, res) => {
    try {
        const deleted = await Inventory.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).send('Item not found.');
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting item:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Display Sell Item Form
router.get('/sell/:id', async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).send('Item not found.');
        res.render('sell', { item });
    } catch (error) {
        console.error('Error fetching item for selling:', error.message);
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
