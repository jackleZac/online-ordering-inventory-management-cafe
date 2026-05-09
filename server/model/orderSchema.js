const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerName: {
        type: String,
        required: true,
    },
    menu: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Menu' 
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
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;