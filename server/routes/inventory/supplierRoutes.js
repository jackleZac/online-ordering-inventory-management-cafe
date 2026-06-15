require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require("../../middleware/authMiddleware");

// Import model schemas
const Supplier = require('../../model/supplierSchema');
const Item = require('../../model/itemSchema');
const Menu = require('../../model/menuSchema');
const Batch = require('../../model/batchSchema');

// ------------------- Private routes ------------------------------------------ //
router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try {
        // Fetch a list of suppliers
        const suppliers = await Supplier.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: 'supplier',
                    as: 'items'
                }
            },
            {
                $addFields: {
                    totalItemsSupplied: {
                        $size: '$items'
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    phoneNumber: 1,
                    email: 1,
                    totalItemsSupplied: 1
                }
            }
        ])

        return res.status(200).json({
            suppliers
        })
    }  catch(error){
        console.log('Error:', error);
    }
});

router.post('/', verifyToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            email
        } = req.body;

        const savedSupplier = await Supplier.create({
            name,
            phoneNumber,
            email,
            isDeleted: false
        });

        return res.status(201).json({
            message: 'Supplier created successfully',
            supplier: savedSupplier
        });
    } catch (error){
        console.log('Error:', error);
    };
});

router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {

        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: 'Supplier not found'
            });
        }

        return res.status(200).json({
            supplier
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
            phoneNumber,
            email
        } = req.body;

        // Find supplier by ID and update
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            {
                name,
                phoneNumber,
                email
            },
            {
                new: true, // return updated document
                runValidators: true
            }
        );

        // Check if item exists
        if (!updatedSupplier) {
            return res.status(404).json({
                message: 'Supplier not found'
            });
        };

        return res.status(200).json({
            message: 'Supplier updated successfully',
            item: updatedSupplier
        });

    } catch(error){
        console.log('Error:', error);
    }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!deletedSupplier) {
            return res.status(404).json({
                message: 'Supplier not found'
            });
        };

        // Find items related to supplier
        const relatedItems = await Item.find({
            supplier: req.params.id
        });

        // Extract item ids
        const itemIds = relatedItems.map(
            (item) => item._id
        );

        // soft delete items to supplier
        await Item.updateMany(
            {
                supplier: req.params.id
            },
            {
                isDeleted: true
            }
        );

        // for every menu related to the items, remove item references
        await Menu.updateMany(
            {
                item: {
                    $in: itemIds
                }
            },
            {
                $set: {
                    item: null
                }
            }
        );

        // soft-delete batches related to the items
        await Batch.updateMany(
            {
                item: {
                    $in: itemIds
                }
            },
            {
                isDeleted: true
            }
        );

        return res.status(200).json({
            message: 'Supplier deleted successfully'
        });

    } catch (error) {
        console.log('Error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;