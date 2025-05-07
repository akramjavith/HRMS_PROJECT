const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paiddatemodeSchema = new Schema({
    department: {
        type: [String],
        required: false,
    },
   
    date: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    paymode: {
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
module.exports = mongoose.model("Paiddatemode", paiddatemodeSchema);
