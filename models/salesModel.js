const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./inventoryModel'); // Import existing DB connection
const { Inventory } = require('./inventoryModel'); // Import Inventory model

// Define Sales Model
const Sales = sequelize.define('Sales', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    itemId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Inventory, key: 'id' } // Foreign Key to Inventory
    },
    quantitySold: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        validate: { min: 1 } // Prevents zero or negative sales
    },
    pricePerItem: { 
        type: DataTypes.FLOAT, 
        allowNull: false, 
        validate: { isFloat: true } 
    },
    totalSaleAmount: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
        validate: { isFloat: true }
    },
    saleDate: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW // Auto-generate timestamp
    }
}, {
    tableName: 'sales',
    timestamps: false
});

// Define Relationship
Inventory.hasMany(Sales, { foreignKey: 'itemId', as: 'sales' });
Sales.belongsTo(Inventory, { foreignKey: 'itemId', as: 'item' });

// Function to Record a Sale
Sales.recordSale = async function (itemId, quantitySold) {
    const item = await Inventory.findByPk(itemId);
    if (!item) throw new Error('Item not found');

    if (item.quantity < quantitySold) throw new Error('Not enough stock available');

    const totalAmount = quantitySold * item.price;

    // Create Sale Record
    const sale = await Sales.create({
        itemId,
        quantitySold,
        pricePerItem: item.price,
        totalSaleAmount: totalAmount
    });

    // Reduce stock in inventory
    await Inventory.sellItem(itemId, quantitySold);

    return sale;
};

module.exports = { Sales };
