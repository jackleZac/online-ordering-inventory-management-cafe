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
    rating: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

const Menu = mongoose.model('Menu', productSchema);
module.exports = Menu;