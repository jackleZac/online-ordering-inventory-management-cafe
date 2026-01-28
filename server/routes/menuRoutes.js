require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { upload } = require('../multer');
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Import model schemas
const Menu = require('../model/menuSchema');

// ------------------------ Private routes (Admins only) -------------------------- //
router.post('/', verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    // Receive and validate data
    const { name, description, category, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    };

    // Create a product
    const createdProduct = new Menu({
      imageKey: req.file.filename,
      name,
      description,
      category,
      price,
    });
    await createdProduct.save();
    // Broadcast to WebSocket clients
    req.app.locals.broadcastMessage({
      type: 'NEW_MENU_ITEM',
      product: createdProduct
    });
    // Product is created
    res.status(201).json({
      message: 'Product created successfully',
      createdProduct
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.put('/:id', verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, category, price } = req.body;
    // Find existing product
    const product = await Menu.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      category,
      price,
    };

    // If new image uploaded
    if (req.file) {
      // Delete old image
      if (product.imageKey) {
        const oldImagePath = path.join(
        __dirname,
        "uploads",
        product.imageKey
        );
        if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        }
      }
      // Save new image key
      updateData.imageKey = req.file.filename;
    }

  // Update product
  const updatedProduct = await Menu.findByIdAndUpdate(
    productId,
    updateData,
    { new: true }
  );
  // Broadcast to WebSocket clients
  req.app.locals.broadcastMessage({
    type: 'UPDATED_MENU_ITEM',
    product: updatedProduct
  });
  res.status(200).json({ 
    message: "Product updated successfully", 
    updatedProduct
  });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id
    // Delete product
    const deletedProduct = await Menu.findByIdAndDelete(productId);

    // If no product is found
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    };

    // Delete the product's image
    const deletedProductImage = path.join(
      __dirname,
      "uploads",
      deletedProduct.imageKey 
    );
    if (fs.existsSync(deletedProductImage)) {
        fs.unlinkSync(deletedProductImage);
    };
    // Broadcast to WebSocket clients
    req.app.locals.broadcastMessage({
      type: 'DELETED_MENU_ITEM',
      product: deletedProduct
    });
    // If product is found and deleted
    res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// ------------------------ Public routes -------------------------- //
// Define routes to handle menu
router.get('/', async (req, res) => {
  try {
    // Confirm connection
    console.log('Receiving GET request for /menu');
    // GET all available menu
    const items = await Menu.find({});
    res.status(200).send(items);
    console.log(items);
  } catch (error) {
    console.log({ message: error });
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const targetedMenu = req.params.category;
    // Get a specific menu
    const items = await Menu.find({ category: targetedMenu}).exec();
    res.status(200).send(items)
    console.log(items)
  } catch (error) {
    console.log({ message: error });
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;