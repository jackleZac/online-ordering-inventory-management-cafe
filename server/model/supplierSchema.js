const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    }
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;