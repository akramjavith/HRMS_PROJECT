const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AcPointCalculationSchema = new Schema({
    company: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    department:  {
        type: String,
        required: false
    },
    dividevalue:  {
        type: String,
        required: false
    },
    multiplevalue:  {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
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
})
module.exports = mongoose.model('acpointcalculation', AcPointCalculationSchema);