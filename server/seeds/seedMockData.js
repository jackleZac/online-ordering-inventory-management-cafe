require("dotenv").config();
const mongoose = require("mongoose");

const Item = require("../model/itemSchema");
const Batch = require("../model/batchSchema");
const Supplier = require("../model/supplierSchema");
const Menu = require("../model/menuSchema");
const Order = require("../model/orderSchema");

async function seedMockData() {
  try {
    await mongoose.connect(process.env.DB, { dbName: 'cafe' });

    console.log("Connected to MongoDB");

    // Clear old data
    await Promise.all([
      Item.deleteMany({}),
      Batch.deleteMany({}),
      Supplier.deleteMany({}),
      Menu.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log("Old data deleted");

    // -----------------------------
    // Suppliers
    // -----------------------------
    const suppliers = await Supplier.insertMany([
      {
        name: "Kuching Coffee Supply",
        phoneNumber: "082-111222",
        email: "sales@kchcoffee.com",
      },
      {
        name: "Sarawak Dairy & Milk Co.",
        phoneNumber: "082-333444",
        email: "orders@sarawakdairy.com",
      },
      {
        name: "Borneo Bakery Ingredients",
        phoneNumber: "082-555666",
        email: "support@borneobakery.com",
      },
      {
        name: "Matang Packaging Supplier",
        phoneNumber: "082-777888",
        email: "contact@matangpackaging.com",
      },
      {
        name: "Fresh Farm Kuching",
        phoneNumber: "082-999000",
        email: "freshfarm@example.com",
      },
    ]);

    // -----------------------------
    // Items / Inventory Catalog
    // -----------------------------
    const items = await Item.insertMany([
      {
        name: "Arabica Coffee Beans",
        supplier: suppliers[0].name,
        unit: "kg",
        isPerishable: false,
        threshold: 15,
      },
      {
        name: "Robusta Coffee Beans",
        supplier: suppliers[0].name,
        unit: "kg",
        isPerishable: false,
        threshold: 12,
      },
      {
        name: "Fresh Milk",
        supplier: suppliers[1].name,
        unit: "litre",
        isPerishable: true,
        threshold: 20,
      },
      {
        name: "Chocolate Powder",
        supplier: suppliers[2].name,
        unit: "kg",
        isPerishable: false,
        threshold: 10,
      },
      {
        name: "Vanilla Syrup",
        supplier: suppliers[2].name,
        unit: "bottle",
        isPerishable: false,
        threshold: 8,
      },
      {
        name: "Paper Cups",
        supplier: suppliers[3].name,
        unit: "pcs",
        isPerishable: false,
        threshold: 200,
      },
      {
        name: "Plastic Lids",
        supplier: suppliers[3].name,
        unit: "pcs",
        isPerishable: false,
        threshold: 200,
      },
      {
        name: "Croissant Dough",
        supplier: suppliers[2].name,
        unit: "pcs",
        isPerishable: true,
        threshold: 30,
      },
      {
        name: "Chicken Slice",
        supplier: suppliers[4].name,
        unit: "kg",
        isPerishable: true,
        threshold: 8,
      },
      {
        name: "Lettuce",
        supplier: suppliers[4].name,
        unit: "kg",
        isPerishable: true,
        threshold: 5,
      },
    ]);

    const itemMap = {};
    items.forEach((item) => {
      itemMap[item.name] = item;
    });

    // -----------------------------
    // Batches from May 2025 to May 2026
    // -----------------------------
    const batches = [
      // May 2025
      {
        item: itemMap["Arabica Coffee Beans"]._id,
        batchNumber: "ARB-2025-05-A",
        initialQuantity: 80,
        currentQuantity: 20,
        receivedDate: new Date("2025-05-10"),
        isUsed: true,
      },
      {
        item: itemMap["Fresh Milk"]._id,
        batchNumber: "MILK-2025-05-A",
        initialQuantity: 120,
        currentQuantity: 0,
        expiryDate: new Date("2025-05-25"),
        receivedDate: new Date("2025-05-12"),
        isUsed: true,
      },

      // June 2025
      {
        item: itemMap["Robusta Coffee Beans"]._id,
        batchNumber: "ROB-2025-06-A",
        initialQuantity: 60,
        currentQuantity: 18,
        receivedDate: new Date("2025-06-08"),
        isUsed: true,
      },
      {
        item: itemMap["Paper Cups"]._id,
        batchNumber: "CUP-2025-06-A",
        initialQuantity: 1000,
        currentQuantity: 260,
        receivedDate: new Date("2025-06-15"),
        isUsed: true,
      },

      // July 2025
      {
        item: itemMap["Chocolate Powder"]._id,
        batchNumber: "CHOCO-2025-07-A",
        initialQuantity: 50,
        currentQuantity: 16,
        receivedDate: new Date("2025-07-05"),
        isUsed: true,
      },
      {
        item: itemMap["Croissant Dough"]._id,
        batchNumber: "CRO-2025-07-A",
        initialQuantity: 150,
        currentQuantity: 0,
        expiryDate: new Date("2025-07-20"),
        receivedDate: new Date("2025-07-08"),
        isUsed: true,
      },

      // August 2025
      {
        item: itemMap["Vanilla Syrup"]._id,
        batchNumber: "VAN-2025-08-A",
        initialQuantity: 40,
        currentQuantity: 9,
        receivedDate: new Date("2025-08-03"),
        isUsed: true,
      },
      {
        item: itemMap["Plastic Lids"]._id,
        batchNumber: "LID-2025-08-A",
        initialQuantity: 1000,
        currentQuantity: 180,
        receivedDate: new Date("2025-08-13"),
        isUsed: true,
      },

      // September 2025
      {
        item: itemMap["Chicken Slice"]._id,
        batchNumber: "CHK-2025-09-A",
        initialQuantity: 40,
        currentQuantity: 0,
        expiryDate: new Date("2025-09-28"),
        receivedDate: new Date("2025-09-10"),
        isUsed: true,
      },
      {
        item: itemMap["Lettuce"]._id,
        batchNumber: "LET-2025-09-A",
        initialQuantity: 30,
        currentQuantity: 0,
        expiryDate: new Date("2025-09-18"),
        receivedDate: new Date("2025-09-11"),
        isUsed: true,
      },

      // October 2025
      {
        item: itemMap["Arabica Coffee Beans"]._id,
        batchNumber: "ARB-2025-10-A",
        initialQuantity: 90,
        currentQuantity: 35,
        receivedDate: new Date("2025-10-04"),
        isUsed: true,
      },
      {
        item: itemMap["Fresh Milk"]._id,
        batchNumber: "MILK-2025-10-A",
        initialQuantity: 150,
        currentQuantity: 0,
        expiryDate: new Date("2025-10-24"),
        receivedDate: new Date("2025-10-10"),
        isUsed: true,
      },

      // November 2025
      {
        item: itemMap["Robusta Coffee Beans"]._id,
        batchNumber: "ROB-2025-11-A",
        initialQuantity: 70,
        currentQuantity: 25,
        receivedDate: new Date("2025-11-06"),
        isUsed: true,
      },
      {
        item: itemMap["Paper Cups"]._id,
        batchNumber: "CUP-2025-11-A",
        initialQuantity: 1200,
        currentQuantity: 400,
        receivedDate: new Date("2025-11-12"),
        isUsed: true,
      },

      // December 2025
      {
        item: itemMap["Chocolate Powder"]._id,
        batchNumber: "CHOCO-2025-12-A",
        initialQuantity: 60,
        currentQuantity: 20,
        receivedDate: new Date("2025-12-04"),
        isUsed: true,
      },
      {
        item: itemMap["Vanilla Syrup"]._id,
        batchNumber: "VAN-2025-12-A",
        initialQuantity: 45,
        currentQuantity: 14,
        receivedDate: new Date("2025-12-09"),
        isUsed: true,
      },

      // January 2026
      {
        item: itemMap["Fresh Milk"]._id,
        batchNumber: "MILK-2026-01-A",
        initialQuantity: 160,
        currentQuantity: 0,
        expiryDate: new Date("2026-01-23"),
        receivedDate: new Date("2026-01-09"),
        isUsed: true,
      },
      {
        item: itemMap["Croissant Dough"]._id,
        batchNumber: "CRO-2026-01-A",
        initialQuantity: 180,
        currentQuantity: 12,
        expiryDate: new Date("2026-01-29"),
        receivedDate: new Date("2026-01-12"),
        isUsed: true,
      },

      // February 2026
      {
        item: itemMap["Chicken Slice"]._id,
        batchNumber: "CHK-2026-02-A",
        initialQuantity: 45,
        currentQuantity: 6,
        expiryDate: new Date("2026-02-26"),
        receivedDate: new Date("2026-02-10"),
        isUsed: true,
      },
      {
        item: itemMap["Lettuce"]._id,
        batchNumber: "LET-2026-02-A",
        initialQuantity: 25,
        currentQuantity: 3,
        expiryDate: new Date("2026-02-18"),
        receivedDate: new Date("2026-02-11"),
        isUsed: true,
      },

      // March 2026
      {
        item: itemMap["Arabica Coffee Beans"]._id,
        batchNumber: "ARB-2026-03-A",
        initialQuantity: 100,
        currentQuantity: 40,
        receivedDate: new Date("2026-03-04"),
        isUsed: true,
      },
      {
        item: itemMap["Plastic Lids"]._id,
        batchNumber: "LID-2026-03-A",
        initialQuantity: 1300,
        currentQuantity: 500,
        receivedDate: new Date("2026-03-10"),
        isUsed: true,
      },

      // April 2026
      {
        item: itemMap["Fresh Milk"]._id,
        batchNumber: "MILK-2026-04-A",
        initialQuantity: 180,
        currentQuantity: 18,
        expiryDate: new Date("2026-05-10"),
        receivedDate: new Date("2026-04-28"),
        isUsed: true,
      },
      {
        item: itemMap["Paper Cups"]._id,
        batchNumber: "CUP-2026-04-A",
        initialQuantity: 1500,
        currentQuantity: 650,
        receivedDate: new Date("2026-04-15"),
        isUsed: true,
      },

      // May 2026
      {
        item: itemMap["Robusta Coffee Beans"]._id,
        batchNumber: "ROB-2026-05-A",
        initialQuantity: 80,
        currentQuantity: 50,
        receivedDate: new Date("2026-05-03"),
        isUsed: true,
      },
      {
        item: itemMap["Fresh Milk"]._id,
        batchNumber: "MILK-2026-05-A",
        initialQuantity: 200,
        currentQuantity: 140,
        expiryDate: new Date("2026-05-22"),
        receivedDate: new Date("2026-05-05"),
        isUsed: false,
      },
      {
        item: itemMap["Lettuce"]._id,
        batchNumber: "LET-2026-05-A",
        initialQuantity: 35,
        currentQuantity: 4,
        expiryDate: new Date("2026-05-13"),
        receivedDate: new Date("2026-05-06"),
        isUsed: true,
      },
    ];

    await Batch.insertMany(batches);

    // -----------------------------
    // Menu Products
    // -----------------------------
    const menuItems = await Menu.insertMany([
      {
        imageKey: "americano.jpg",
        name: "Americano",
        rating: 4.5,
        description: "Classic black coffee made with espresso and hot water.",
        category: "coffee",
        item: itemMap["Arabica Coffee Beans"]._id,
        price: 8.9,
      },
      {
        imageKey: "latte.jpg",
        name: "Cafe Latte",
        rating: 4.7,
        description: "Espresso with steamed milk.",
        category: "coffee",
        item: itemMap["Fresh Milk"]._id,
        price: 11.9,
      },
      {
        imageKey: "mocha.jpg",
        name: "Mocha",
        rating: 4.6,
        description: "Coffee with milk and chocolate.",
        category: "coffee",
        item: itemMap["Chocolate Powder"]._id,
        price: 12.9,
      },
      {
        imageKey: "vanilla-latte.jpg",
        name: "Vanilla Latte",
        rating: 4.8,
        description: "Latte with vanilla syrup.",
        category: "coffee",
        item: itemMap["Vanilla Syrup"]._id,
        price: 13.5,
      },
      {
        imageKey: "croissant.jpg",
        name: "Butter Croissant",
        rating: 4.4,
        description: "Freshly baked croissant.",
        category: "pastry",
        item: itemMap["Croissant Dough"]._id,
        price: 7.5,
      },
      {
        imageKey: "chicken-wrap.jpg",
        name: "Chicken Wrap",
        rating: 4.3,
        description: "Chicken wrap with lettuce and sauce.",
        category: "wraps",
        item: itemMap["Chicken Slice"]._id,
        price: 14.9,
      },
    ]);

    const menuMap = {};
    menuItems.forEach((menu) => {
      menuMap[menu.name] = menu;
    });

    // -----------------------------
    // Orders from May 2025 to May 2026
    // -----------------------------
    const orders = [
      // May 2025
      {
        customerName: "Aiman",
        menu: menuMap["Americano"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-05-15"),
      },
      {
        customerName: "Siti",
        menu: menuMap["Cafe Latte"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2025-05-22"),
      },

      // June 2025
      {
        customerName: "Jason",
        menu: menuMap["Mocha"]._id,
        quantity: 3,
        status: "completed",
        orderDate: new Date("2025-06-11"),
      },
      {
        customerName: "Nurul",
        menu: menuMap["Chicken Wrap"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2025-06-19"),
      },

      // July 2025
      {
        customerName: "Daniel",
        menu: menuMap["Butter Croissant"]._id,
        quantity: 4,
        status: "completed",
        orderDate: new Date("2025-07-07"),
      },
      {
        customerName: "Mira",
        menu: menuMap["Vanilla Latte"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-07-28"),
      },

      // August 2025
      {
        customerName: "Farid",
        menu: menuMap["Americano"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-08-04"),
      },
      {
        customerName: "Michelle",
        menu: menuMap["Cafe Latte"]._id,
        quantity: 3,
        status: "completed",
        orderDate: new Date("2025-08-21"),
      },

      // September 2025
      {
        customerName: "Hafiz",
        menu: menuMap["Chicken Wrap"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-09-14"),
      },
      {
        customerName: "Kelly",
        menu: menuMap["Mocha"]._id,
        quantity: 1,
        status: "refund",
        orderDate: new Date("2025-09-26"),
      },

      // October 2025
      {
        customerName: "Raymond",
        menu: menuMap["Vanilla Latte"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-10-05"),
      },
      {
        customerName: "Amira",
        menu: menuMap["Butter Croissant"]._id,
        quantity: 5,
        status: "completed",
        orderDate: new Date("2025-10-17"),
      },

      // November 2025
      {
        customerName: "Irfan",
        menu: menuMap["Americano"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2025-11-02"),
      },
      {
        customerName: "Lina",
        menu: menuMap["Cafe Latte"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-11-23"),
      },

      // December 2025
      {
        customerName: "Marcus",
        menu: menuMap["Mocha"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2025-12-09"),
      },
      {
        customerName: "Nadia",
        menu: menuMap["Chicken Wrap"]._id,
        quantity: 3,
        status: "completed",
        orderDate: new Date("2025-12-20"),
      },

      // January 2026
      {
        customerName: "Wei Ming",
        menu: menuMap["Vanilla Latte"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2026-01-08"),
      },
      {
        customerName: "Sarah",
        menu: menuMap["Butter Croissant"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2026-01-18"),
      },

      // February 2026
      {
        customerName: "Arif",
        menu: menuMap["Chicken Wrap"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2026-02-06"),
      },
      {
        customerName: "Carmen",
        menu: menuMap["Cafe Latte"]._id,
        quantity: 2,
        status: "pending",
        orderDate: new Date("2026-02-25"),
      },

      // March 2026
      {
        customerName: "Hakim",
        menu: menuMap["Americano"]._id,
        quantity: 4,
        status: "completed",
        orderDate: new Date("2026-03-10"),
      },
      {
        customerName: "Grace",
        menu: menuMap["Mocha"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2026-03-24"),
      },

      // April 2026
      {
        customerName: "Faiz",
        menu: menuMap["Vanilla Latte"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2026-04-03"),
      },
      {
        customerName: "Joanne",
        menu: menuMap["Chicken Wrap"]._id,
        quantity: 1,
        status: "completed",
        orderDate: new Date("2026-04-27"),
      },

      // May 2026
      {
        customerName: "Adam",
        menu: menuMap["Cafe Latte"]._id,
        quantity: 3,
        status: "completed",
        orderDate: new Date("2026-05-02"),
      },
      {
        customerName: "Mei Ling",
        menu: menuMap["Butter Croissant"]._id,
        quantity: 2,
        status: "completed",
        orderDate: new Date("2026-05-07"),
      },
    ];

    await Order.insertMany(orders);

    console.log("Mock data inserted successfully");
    console.log(`Suppliers: ${suppliers.length}`);
    console.log(`Items: ${items.length}`);
    console.log(`Batches: ${batches.length}`);
    console.log(`Menu Items: ${menuItems.length}`);
    console.log(`Orders: ${orders.length}`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Seed error:", error);
    await mongoose.disconnect();
  }
}

seedMockData();