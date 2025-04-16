const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paiddatefixSchema = new Schema({
    department: {
        type: [String],
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    year: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    paymode: {
        type: String,
        required: false,
    },
    afterexpiry: {
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
module.exports = mongoose.model("Paiddatefix", paiddatefixSchema);