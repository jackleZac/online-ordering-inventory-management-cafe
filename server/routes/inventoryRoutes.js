require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { upload } = require('../multer');
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Import model schemas
const Item = require('../model/itemSchema');
const Batch = require('../model/batchSchema');
const Supplier = require('../model/supplierSchema');

// ----------------------- Private routes ---------------------------------------//
router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try {
        // count total items, total batches, total units used
        const today = new Date();
        const totalItems = await Item.countDocuments();
        const totalBatches = await Batch.countDocuments();
        const fetchTotalUsedUnits = await Batch.aggregate([
            { 
                $project: {
                usedUnits: { 
                    $subtract: ["$initialQuantity", "$currentQuantity"]
                }
            }},
            { 
                $group: { 
                _id: null, 
                total: { $sum: "$usedUnits" }
            }}
        ]);
        const totalUsedUnits = fetchTotalUsedUnits[0]?.total || 0;
        // count perishable & non-perishable items, expired items
        const perishableItems = await Item.countDocuments({ isPerishable: true });
        const nonPerishableItems = await Item.countDocuments({ isPerishable: false });
        const expiredBatches = await Batch.countDocuments({ expiryDate: { $lte: today }});

        // fetch low-stock items
        /**
         * Method: total quantity of batches lower than or equal to item's threshold
         */
        const lowStockItems = await Batch.aggregate([
            {
                $group: {
                    _id: "$item", // group by item id
                    totalQuantity: { $sum: "$currentQuantity"} // sum qty
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails"
            },
            {
                $match: {
                    $expr: {
                        $lte: ["$totalQuantity", "$itemDetails.threshold"]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    itemId: "$_id",
                    name: "$itemDetails.name",
                    supplier: "$itemDetails.supplier",
                    unit: "$itemDetails.unit",
                    threshold: "$itemDetails.threshold",
                    totalQuantity: "$totalQuantity"
                }
            }
        ]);

        // Fetch a list of suppliers and item catalogs
        const suppliers = await Supplier.find();
        const itemCatalogs = await Item.find();

        // Count total used units for every item
        const totalUsedUnitsPerItems = await Batch.aggregate([
            {
                $project: {
                item: 1,
                usedUnits: { $subtract: ["$initialQuantity", "$currentQuantity"] }
                }
            },
            {
                $group: {
                _id: "$item", // group by item id
                totalUsedUnits: { $sum: "$usedUnits" },   // sum of units consumed
                usedBatchCount: { $sum: { $cond: [{ $gt: ["$usedUnits", 0] }, 1, 0] } } // count of batches touched
                }
            },
            {
                $lookup: {
                from: "items",        
                localField: "_id", 
                foreignField: "_id",
                as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails" 
            },
            {
                $project: {
                _id: 0, 
                itemId: "$_id",
                itemName: "$itemDetails.name",
                supplier: "$itemDetails.supplier",
                totalUsedUnits: "$totalUsedUnits",
                usedBatchCount: "$usedBatchCount"
                }
            }
        ]);

        return res.status(200).json({
            totalItems,
            totalBatches,
            totalUsedUnits,
            perishableItems,
            nonPerishableItems,
            expiredBatches,
            lowStockItems,
            suppliers,
            itemCatalogs,
            totalUsedUnitsPerItems
        });
    } catch(error){
        console.log('Error:', error);
    }
});

module.exports = router;