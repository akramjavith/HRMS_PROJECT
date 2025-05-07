const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const masterfieldnameSchema = new Schema({

    projectvendor: {
        type: String,
        required: false,
    },
    process: {
        type: String,
        required: false,
    }, 
    fieldname: {
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
module.exports = mongoose.model("Masterfieldname", masterfieldnameSchema);
