require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Import model schemas
const Batch = require('../model/batchSchema');

// ------------------- Private routes ------------------------------------------ //
router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try {
        // Fetch a list of batches (include items' names)
        const batches = await Batch.find({ isDeleted: false })
            .populate({
                path: 'item',
                select: 'name supplier',
                populate: {
                    path: 'supplier',
                    select: 'name'
                }
            })
            .select('batchNumber initialQuantity currentQuantity expiryDate receivedDate')

        return res.status(200).json({
            batches
        })
    }  catch(error){
        console.log('Error:', error);
    }
});

router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {

        const batch = await Batch.findById(req.params.id)
            .populate({
                path: 'item',
                select: 'name supplier',
                populate: {
                    path: 'supplier',
                    select: 'name'
                }
            });

        if (!batch) {
            return res.status(404).json({
                message: 'Batch not found'
            });
        }

        return res.status(200).json({
            batch
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
            item,
            batchNumber,
            initialQuantity,
            currentQuantity,
            expiryDate,
            receivedDate,
            isUsed
        } = req.body;

        // Find batch by ID and update
        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id,
            {
                item,
                batchNumber,
                initialQuantity,
                currentQuantity,
                expiryDate,
                receivedDate,
                isUsed
            },
            {
                new: true, // return updated document
                runValidators: true
            }
        ).populate('item');

        // Check if item exists
        if (!updatedBatch) {
            return res.status(404).json({
                message: 'Batch not found'
            });
        };

        return res.status(200).json({
            message: 'Batch updated successfully',
            batch: updatedBatch
        });

    } catch(error){
        console.log('Error:', error);
    }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const deletedBatch = await Batch.findByIdAndDelete(req.params.id);

        if (!deletedBatch) {
            return res.status(404).json({
                message: 'Batch not found'
            });
        }

        return res.status(200).json({
            message: 'Batch deleted successfully'
        });        
    } catch (error) {
        console.log('Error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;