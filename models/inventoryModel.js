const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false 
});

// Define Inventory Model
const Inventory = sequelize.define('Inventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    price: { type: DataTypes.FLOAT, allowNull: false, validate: { isFloat: true } },
    description: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'inventory',
    timestamps: false
});

// Reduce Stock when an Item is Sold
Inventory.sellItem = async function (itemId, quantitySold) {
    const item = await Inventory.findByPk(itemId);
    if (!item) throw new Error('Item not found');

    if (item.quantity < quantitySold) throw new Error('Not enough stock available');

    item.quantity -= quantitySold;
    await item.save();
};

module.exports = { Inventory, sequelize };
