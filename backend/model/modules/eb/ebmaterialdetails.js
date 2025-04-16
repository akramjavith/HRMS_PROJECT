const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ebmaterialdetails = new Schema({
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
    floor: {
        type: String,
        required: false,
    },
    area: {
        type: String,
        required: false,
    },
    location: {
        type: [String],
        required: false,
    },
    servicenumber: {
        type: String,
        required: false,
    },
    materialname: {
        type: String,
        required: false,
    },
    // quantity: {
    //     type: Number,
    //     required: false,
    // },
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
    // usageqty: {
    //     type: Number,
    //     required: false,
    // },
    hours: {
        type: String,
        required: false,
    },
    totalunitconsumed: {
        type: Number,
        required: false,
    },
    ebtodos: [
        {
    
            materialname: {
                type: String,
                required: false,
            },
            quantity: {
                type: Number,
                required: false,
            },
            usageqty: {
                type: Number,
                required: false,
            },
            totalunitcalculation: {
                type: Number,
                required: false,
            },
            // assettype:{
            //     type: String,
            //     required: false,
            // },
            // assethead:{
            //     type: String,
            //     require: false,
            // },          
        }],
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
module.exports = mongoose.model("Ebmaterialdetails", ebmaterialdetails);