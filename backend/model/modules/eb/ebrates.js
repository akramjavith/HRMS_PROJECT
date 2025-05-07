const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ebratesSchema = new Schema({
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    fromunit: {
        type: String,
        required: false,
    },
    tounit: {
        type: String,
        required: false,
    },
    maxunit: {
        type: String,
        required: false,
    },
    rate: {
        type: String,
        required: false,
    },
    date: {
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
module.exports = mongoose.model("EbratesSchema", ebratesSchema);
