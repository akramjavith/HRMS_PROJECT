const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const maintanencelogSchema = new Schema({
    empcode: {
        type: String,
        required: false,
    },
    commonid: {
        type: String,
        required: false,
    },
    companyname: {
        type: String,
        required: false,
    },
    pagename: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
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
    
    
});


module.exports = mongoose.model("maintanencelog", maintanencelogSchema);