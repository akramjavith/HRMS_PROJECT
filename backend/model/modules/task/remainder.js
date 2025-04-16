const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const remainderSchema = new Schema({
    categoryexpense: {
        type: String,
        required: false,
    },
    subcategoryexpense: {
        type: String,
        required: false,
    },
    frequency: {
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
module.exports = mongoose.model("Remainder", remainderSchema);
