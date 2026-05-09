const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    supplier: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    isPerishable: {
        type: Boolean,
        required: true,
    },
    threshold: {
        type: Number, // for low-stock alerts
        required: false,
    },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;