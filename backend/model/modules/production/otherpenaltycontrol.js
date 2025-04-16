const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const otherpenaltycontrolSchema = new Schema({

    mode: {
        type: String,
        required: false,
    }, 
    rate: {
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
module.exports = mongoose.model("Otherpenaltycontrol", otherpenaltycontrolSchema);
