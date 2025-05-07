const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShiftRoasterSchema = new Schema({
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: false,
    },
    team: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    shifttype: {
        type: String,
        require: false,
    },
    fromdate: {
        type: String,
        required: false,
    },
    todate: {
        type: String,
        require: false,
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
module.exports = mongoose.model('ShiftRoaster', ShiftRoasterSchema);