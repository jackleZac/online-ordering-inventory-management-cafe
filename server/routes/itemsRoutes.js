require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Import model schemas
const Item = require('../model/itemSchema');
const Menu = require('../model/menuSchema');
const Batch = require('../model/batchSchema');

// ------------------- Private routes ------------------------------------------ //
router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try {
        // Fetch a list of items
        const items = await Item.find({ isDeleted: false }).populate('supplier', 'name').lean();

        const formattedItems = items.map(item => ({
            _id: item._id,
            name: item.name,
            unit: item.unit,
            isPerishable: item.isPerishable,
            threshold: item.threshold,
            supplier: item.supplier?.name
        }));

        return res.status(200).json({
            formattedItems
        })
    }  catch(error){
        console.log('Error:', error);
    }
});

router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {

        const item = await Item.findById(req.params.id)
            .populate('supplier', 'name');

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        return res.status(200).json({
            item
        });

    } catch (error) {

        console.log('Error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
});

router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            supplier,
            unit,
            isPerishable,
            threshold
        } = req.body;

        // Find item by ID and update
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                name,
                supplier,
                unit,
                isPerishable,
                threshold
            },
            {
                new: true, // return updated document
                runValidators: true
            }
        ).populate('supplier');

        // Check if item exists
        if (!updatedItem) {
            return res.status(404).json({
                message: 'Item not found'
            });
        };

        return res.status(200).json({
            message: 'Item updated successfully',
            item: updatedItem
        });

    } catch(error){
        console.log('Error:', error);
    }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        // Mark the item as deleted
        const deletedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { 
                isDeleted: true 
            },
            {
                new: true
            }
        );

        if (!deletedItem) {
            return res.status(404).json({
                message: 'Item not found'
            });
        };

        // remove item reference from menus        
        await Menu.updateMany(
            {
                item: req.params.id
            },
            {
                $set: {
                    item: null
                }
            }
        );
        
        // soft-delete related batches
        await Batch.updateMany(
            {
                item: req.params.id
            },
            {
                isDeleted: true
            }
        );

        return res.status(200).json({
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.log('Error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;


