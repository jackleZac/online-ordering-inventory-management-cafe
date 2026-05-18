const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = new Schema({
    item: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item',
        required: true, 
    },
    batchNumber: {
        type: String,
        required: false, 
    },
    initialQuantity: {
        type: Number, 
        required: true,
    },
    currentQuantity: {
        type: Number,
        required: true,  
    },
    expiryDate: {
        type: Date,
        required: false // applicable to perishable items
    },
    receivedDate: { 
        type: Date, default: Date.now 
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Batch = mongoose.model('batch', batchSchema);
module.exports = Batch;