require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Import models
const User = require('../model/userSchema');
const Supplier = require('../model/supplierSchema');
const Item = require('../model/itemSchema');
const Batch = require('../model/batchSchema');
const Menu = require('../model/menuSchema');
const Order = require('../model/orderSchema');

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
    return new Date(
        start.getTime() +
        Math.random() * (end.getTime() - start.getTime())
    );
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ------------------------------------------------------------
// SEED FUNCTION
// ------------------------------------------------------------

async function seedDatabase() {

    try {
        await mongoose.connect(process.env.DB, { dbName: 'cafe' });
    
        console.log("Connected to MongoDB");
        // ------------------------------------------------------------
        // USERS
        // ------------------------------------------------------------

        const users = await User.insertMany([
            {
                username: 'admin',
                password: 'admin123',
                email: 'admin@cafesystem.com',
                phone: '0123456789',
                isAdmin: true
            },
            {
                username: 'cashier1',
                password: 'cashier123',
                email: 'cashier1@cafesystem.com',
                phone: '0112233445',
                isAdmin: false
            },
            {
                username: 'cashier2',
                password: 'cashier123',
                email: 'cashier2@cafesystem.com',
                phone: '0112233446',
                isAdmin: false
            }
        ]);

        console.log('Users created');

        // ------------------------------------------------------------
        // SUPPLIERS
        // ------------------------------------------------------------

        const suppliers = await Supplier.insertMany([
            {
                name: 'Fresh Dairy Supply',
                phoneNumber: '0121111111',
                email: 'freshdairy@gmail.com'
            },
            {
                name: 'Coffee Bean Trading',
                phoneNumber: '0122222222',
                email: 'coffeebeans@gmail.com'
            },
            {
                name: 'Sweet Bakery Ingredients',
                phoneNumber: '0123333333',
                email: 'sweetbakery@gmail.com'
            },
            {
                name: 'Packaging Hub',
                phoneNumber: '0124444444',
                email: 'packaginghub@gmail.com'
            },
            {
                name: 'Frozen Foods Supplier',
                phoneNumber: '0125555555',
                email: 'frozenfoods@gmail.com'
            }
        ]);

        console.log('Suppliers created');

        // ------------------------------------------------------------
        // ITEMS
        // ------------------------------------------------------------

        const items = await Item.insertMany([
            {
                name: 'Coffee Beans',
                supplier: suppliers[1]._id,
                unit: 'kg',
                isPerishable: false,
                threshold: 10
            },
            {
                name: 'Fresh Milk',
                supplier: suppliers[0]._id,
                unit: 'litre',
                isPerishable: true,
                threshold: 20
            },
            {
                name: 'Chocolate Syrup',
                supplier: suppliers[2]._id,
                unit: 'bottle',
                isPerishable: false,
                threshold: 5
            },
            {
                name: 'Paper Cups',
                supplier: suppliers[3]._id,
                unit: 'box',
                isPerishable: false,
                threshold: 15
            },
            {
                name: 'Whipped Cream',
                supplier: suppliers[0]._id,
                unit: 'can',
                isPerishable: true,
                threshold: 10
            },
            {
                name: 'Chicken Patty',
                supplier: suppliers[4]._id,
                unit: 'pack',
                isPerishable: true,
                threshold: 8
            },
            {
                name: 'Bread Bun',
                supplier: suppliers[2]._id,
                unit: 'pack',
                isPerishable: true,
                threshold: 10
            },
            {
                name: 'Sugar',
                supplier: suppliers[2]._id,
                unit: 'kg',
                isPerishable: false,
                threshold: 15
            }
        ]);

        console.log('Items created');

        // ------------------------------------------------------------
        // BATCHES (1 YEAR)
        // ------------------------------------------------------------

        const batchData = [];

        // Generate data for past 1 year until today
        const endDate = new Date();

        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        for (let i = 0; i < 250; i++) {

            const selectedItem = randomElement(items);

            const receivedDate = randomDate(startDate, endDate);

            let expiryDate = null;

            if (selectedItem.isPerishable) {
                expiryDate = new Date(receivedDate);
                expiryDate.setDate(expiryDate.getDate() + randomNumber(7, 60));
            }

            const initialQuantity = randomNumber(20, 200);
            const currentQuantity = randomNumber(0, initialQuantity);

            batchData.push({
                item: selectedItem._id,
                batchNumber: `BATCH-${1000 + i}`,
                initialQuantity,
                currentQuantity,
                expiryDate,
                receivedDate,
                isUsed: currentQuantity === 0
            });
        }

        await Batch.insertMany(batchData);

        console.log('Batches created');

        // ------------------------------------------------------------
        // MENU
        // ------------------------------------------------------------

        const menuItems = await Menu.insertMany([
            {
                imageKey: 'latte.jpg',
                name: 'Cafe Latte',
                rating: 4.5,
                description: 'Fresh espresso with steamed milk',
                category: 'Coffee',
                item: items[0]._id,
                price: 12
            },
            {
                imageKey: 'americano.jpg',
                name: 'Americano',
                rating: 4.2,
                description: 'Strong black coffee',
                category: 'coffee',
                item: items[0]._id,
                price: 10
            },
            {
                imageKey: 'mocha.jpg',
                name: 'Mocha',
                rating: 4.6,
                description: 'Chocolate coffee drink',
                category: 'coffee',
                item: items[2]._id,
                price: 15
            },
            {
                imageKey: 'chicken-wrap.jpg',
                name: 'Chicken Wrap',
                rating: 4.4,
                description: 'Chicken wrap with lettuce and sauce',
                category: 'wraps',
                item: items[5]._id,
                price: 18
            },
            {
                imageKey: 'croissant.jpg',
                name: 'Butter Croissant',
                rating: 4.1,
                description: 'Fresh buttery croissant',
                category: 'pastry',
                item: items[6]._id,
                price: 8
            }
        ]);

        console.log('Menu items created');

        // ------------------------------------------------------------
        // ORDERS (1 YEAR)
        // ------------------------------------------------------------

        const customerNames = [
            'Ali',
            'Siti',
            'Joshua',
            'Michael',
            'Sarah',
            'Aisyah',
            'Daniel',
            'Nurul',
            'Amir',
            'Ahmad'
        ];

        const statuses = ['pending', 'completed', 'refund'];

        const orderData = [];

        for (let i = 0; i < 1500; i++) {

            const selectedMenu = randomElement(menuItems);

            let status = 'completed';

            const randomStatus = Math.random();

            if (randomStatus < 0.05) {
                status = 'refund';
            } else if (randomStatus < 0.10) {
                status = 'pending';
            }

            orderData.push({
                customerName: randomElement(customerNames),
                menu: selectedMenu._id,
                quantity: randomNumber(1, 5),
                status,
                orderDate: randomDate(startDate, endDate)
            });
        }

        await Order.insertMany(orderData);

        console.log('Orders created');

        console.log('Database seeded successfully');

        mongoose.connection.close();

    } catch (error) {

        console.log(error);
        mongoose.connection.close();

    }
}

seedDatabase();
