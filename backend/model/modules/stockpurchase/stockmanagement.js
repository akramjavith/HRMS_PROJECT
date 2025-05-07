const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StockManagementSchema = new Schema({

    allotcount: [{
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
            type: String,
            required: false,
        },
        material: {
            type: String,
            required: false,
        },
        mode: {
            type: String,
            required: false,
        },


    }
    ],


    usagecount: [{
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
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: false,
        },
        team: {
            type: String,
            required: false,
        },
        employee: {
            type: String,
            required: false,
        },
        material: {
            type: String,
            required: false,
        },
        date: {
            type: String,
            required: false,
        },
        time: {
            type: String,
            required: false,
        },

        description: {
            type: String,
            required: false,
        },



    }
    ],

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            empname: {
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
module.exports = mongoose.model("StockManagement", StockManagementSchema);