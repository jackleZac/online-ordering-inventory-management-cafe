const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerName: {
        type: String,
        required: true,
    },
    menu: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true, // pending, completed, refund
    },
    orderDate: { 
        type: Date, 
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;