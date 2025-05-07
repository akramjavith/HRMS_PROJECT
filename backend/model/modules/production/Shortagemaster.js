const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const manageshortagemasterSchema = new Schema({

    department: {
        type: String,
        required: false,
    },
    from: {
        type: String,
        required: false,
    },
    to: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
        required: false,
    },

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },

        }],
    updatedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Manageshortagemaster', manageshortagemasterSchema);