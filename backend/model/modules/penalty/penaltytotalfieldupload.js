const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const penaltytotalfielduploadSchema = new Schema({

    projectvendor: {
        type: String,
        required: false,
    },
    queuename: {
        type: String,
        required: false,
    },
    loginid: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    accuracy: {
        type: String,
        required: false,
    },
    errorcount: {
        type: Number,
        required: false,
    },
    totalfields: {
        type: Number,
        required: false,
    },
    autocount: {
        type: Number,
        required: false,
    },

    filename: {
        type: String,
        required: false,
    },
    manualerror: {
        type: String,
        required: false,
    },
    isedited: {
        type: String,
        required: false,
    },
    manualtotal: {
        type: String,
        required: false,
    },
    isedited: {
        type: String,
        required: false,
    },
    iseditedtotal: {
        type: String,
        required: false,
    },
    uploadcount: {
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
        },
    ],
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
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
penaltytotalfielduploadSchema.index({ loginid: 1, isedited: 1, accuracy: 1 })
module.exports = mongoose.model("Penaltytotalfieldupload", penaltytotalfielduploadSchema);