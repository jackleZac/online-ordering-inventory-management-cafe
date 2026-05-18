require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Import model schemas
const Orders = require('../model/orderSchema');
const Menu = require('../model/menuSchema');

// ----------------- Private routes -------------------------//
router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try {
        // Count number of orders (this month)
        const now = new Date()
        const ordersThisMonth = await Orders.find({ 
            isDeleted: false,
            orderDate: {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
            }
        });
        const totalOrders = ordersThisMonth.length;
        const pendingOrders = ordersThisMonth.filter(order => order.status === 'pending').length;
        const completedOrders = ordersThisMonth.filter(order => order.status === 'completed').length;
        const refundOrders = ordersThisMonth.filter(order => order.status === 'refund').length;

        // Get a trend of every product purchasement
        /**
         * Filters: food, coffee, period (6 months, default: 1 year)
         * Method: Calculate number of orders for every products
         */
        const menu = await Menu.find({
            isDeleted: false
        });
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        const endDate = now;
        const trendStartDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
        const trendEndDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
        );

        // Build month labels manually so missing months still appear in chart
        const monthLabels = [];
        const monthKeys = [];

        const cursor = new Date(trendStartDate);

        while (cursor <= trendEndDate) {
            const year = cursor.getFullYear();
            const month = cursor.getMonth();

            const key = `${year}-${String(month + 1).padStart(2, "0")}`;

            const label = cursor.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
            });

            monthKeys.push(key);
            monthLabels.push(label);

            cursor.setMonth(cursor.getMonth() + 1);
        }

        // Group orders by month and product
        const trendRows = await Orders.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: trendStartDate,
                        $lte: trendEndDate,
                    },
                    status: {
                        $ne: "refund",
                    },
                    isDeleted: false
                },
            },
            {
                $addFields: {
                    monthKey: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$orderDate",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        monthKey: "$monthKey",
                        menu: "$menu",
                    },
                    totalOrders: {
                        $sum: 1,
                    },
                    totalQuantity: {
                        $sum: "$quantity",
                    },
                },
            },
            {
                $lookup: {
                    from: "menus",
                    let: {
                        menuId: "$_id.menu"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$_id",
                                                "$$menuId"
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$isDeleted",
                                                false
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "menuDetails",
                },
            },
            {
                $unwind: "$menuDetails",
            },
            {
                $project: {
                    _id: 0,
                    monthKey: "$_id.monthKey",
                    menuId: "$_id.menu",
                    productName: "$menuDetails.name",
                    category: "$menuDetails.category",
                    totalOrders: 1,
                    totalQuantity: 1,
                },
            },
            {
                $sort: {
                    monthKey: 1,
                    productName: 1,
                },
            },
        ]);

        // Product sales summary
        const productSummary = await Orders.aggregate([
            {
                $match: {
                    isDeleted: false,
                    status: {
                        $ne: "refund"
                    }
                }
            },
            {
                $group: {
                    _id: "$menu",
                    totalOrderRecords: {
                        $sum: 1
                    },
                    totalQuantitySold: {
                        $sum: "$quantity"
                    }
                }
            },
            {
                $lookup: {
                    from: "menus",
                    let: {
                        menuId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$_id",
                                                "$$menuId"
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$isDeleted",
                                                false
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "menuDetails"
                }
            },
            {
                $unwind: "$menuDetails"
            },
            {
                $project: {
                    _id: 0,
                    menuId: "$_id",
                    productName: "$menuDetails.name",
                    category: "$menuDetails.category",
                    totalOrderRecords: 1,
                    totalQuantitySold: 1
                }
            },
            {
                $sort: {
                    totalQuantitySold: -1
                }
            }
        ]);

        // Convert raw aggregation rows into chart-friendly datasets
        const productMap = {};

        trendRows.forEach((row) => {
            const productId = row.menuId.toString();

            if (!productMap[productId]) {
                productMap[productId] = {
                    menuId: productId,
                    productName: row.productName,
                    category: row.category,
                    monthlyOrders: {},
                    monthlyQuantity: {},
                };
            }

            productMap[productId].monthlyOrders[row.monthKey] = row.totalOrders;
            productMap[productId].monthlyQuantity[row.monthKey] = row.totalQuantity;
        });

        const products = Object.values(productMap);

        const orderTrendByProduct = {
            labels: monthLabels,
            monthKeys,
            datasets: products.map((product) => {
                return {
                    menuId: product.menuId,
                    label: product.productName,
                    category: product.category,
                    data: monthKeys.map((monthKey) => {
                        return product.monthlyQuantity[monthKey] || 0;
                    }),
                };
            }),
        };

        return res.status(200).json({
            overview: {
                totalOrders,
                pendingOrders,
                completedOrders,
                refundOrders,
            },
            orderTrendByProduct,
            productSummary
        });
    } catch (error){
        console.log('Error:', error);
    }
});

module.exports = router;