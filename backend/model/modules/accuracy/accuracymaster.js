const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccuracymasterSchema = new Schema({

    projectvendor: {
        type: String,
        required: false,
    },
    queue: {
        type: String,
        required: false,
    },
    minimumaccuracy: {
        type: Number,
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
AccuracymasterSchema.index({ fromdate: 1, todate: 1 })
module.exports = mongoose.model("Accuracymaster", AccuracymasterSchema);