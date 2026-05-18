const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    imageKey: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // ingredients, cups, etc.
        required: false,
    },
    rating: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
    },
    category: {
        type: String, // coffee, cakes, wraps, etc.
        required: true, 
    },
    price: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Menu = mongoose.model('Menu', productSchema);
module.exports = Menu;