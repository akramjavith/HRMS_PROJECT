const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AcheivedAccuracySchema = new Schema({
    date: {
        type: Date,
        required: false,
    },
    project: {
        type: String,
        required: false,
    },
    vendor: {
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
    acheivedaccuracy: {
        type: Number,
        required: false,
    },
    clientstatus: {
        type: String,
        required: false,
    },
    internalstatus: {
        type: String,
        required: false,
    },
    files: [
        {
            data: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            preview: {
                type: String,
                required: false,
            },
            remark: {
                type: String,
                required: false,
            },
        },
    ],
    // statusmode: {
    //     type: String,
    //     required: false,
    // },
    // percentage: {
    //     type: String,
    //     required: false,
    // },
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
AcheivedAccuracySchema.index({ date: 1 })
module.exports = mongoose.model("Acheivedaccuracy", AcheivedAccuracySchema);