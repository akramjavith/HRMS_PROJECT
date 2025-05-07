const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const nonproductionSchema = new Schema({


    name: {
        type: String,
        required: false,
    }, 
    category: {
        type: String,
        required: false,
    }, 
    subcategory: {
        type: String,
        required: false,
    }, 
    mode: {
        type: String,
        required: false,
    }, 
    count: {
        type: String,
        required: false,
    }, 
    date: {
        type: String,
        required: false,
    }, 
    fromtime: {
        type: String,
        required: false,
    }, 
    totime: {
        type: String,
        required: false,
    }, 
    totalhours: {
        type: String,
        required: false,
    }, 
    alloteddays: {
        type: String,
        required: false,
    }, 
    allotedhours: {
        type: String,
        required: false,
    }, 
    allotedminutes: {
        type: String,
        required: false,
    }, 
    days: {
        type: String,
        required: false,
    }, 
    hours: {
        type: String,
        required: false,
    }, 
    minutes: {
        type: String,
        required: false,
    }, 
    approvestatus: {
        type: Boolean,
        required: false,
    }, 
    company: {
        type: String,
        required: false,
    }, 
    branch: {
        type: String,
        required: false,
    }, 
    unit: {
        type: String,
        required: false,
    }, 
    team: {
        type: String,
        required: false,
    }, 
    empcode: {
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
module.exports = mongoose.model("Nonproduction", nonproductionSchema);