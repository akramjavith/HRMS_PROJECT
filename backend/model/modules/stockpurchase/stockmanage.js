const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StockmanageSchema = new Schema({

    company: {
        type: String,
        required: false,
    },
    mode: {
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
    location: {
        type: String,
        required: false,
    },
    area: {
        type: String,
        required: false,
    },
    workcheck: {
        type: Boolean,
        required: false,
    },

    requestdate: {
        type: String,
        required: false,
    },
    requesttime: {
        type: String,
        required: false,
    },


    expectdays: {
        type: String,
        required: false,
    },
    duedate: {
        type: String,
        required: false,
    },
    assettype: {
        type: String,
        required: false,
    },
    asset: {
        type: String,
        required: false,
    },
    component: {
        type: String,
        required: false,
    },
    subcomponent: {
        type: [String],
        required: false,
    },
    workstation: {
        type: String,
        required: false,
    },
    material: {
        type: String,
        required: false,
    },
    producthead: {
        type: String,
        required: false,
    },
    productname: {
        type: String,
        required: false,
    },
    productdetails: {
        type: String,
        require: false,
    },
    uom: {
        type: String,
        require: false,
    },
    quantity: {
        type: Number,
        require: false,
    },
    updating: {
        type: String,
        require: false,
    },

    requestmode: {
        type: String,
        require: false,
    },
    stockcategory: {
        type: String,
        require: false,
    },
    stocksubcategory: {
        type: String,
        require: false,
    },


    stockmaterialarray: [
        {
            uomnew: {
                type: String,
                required: false,
            },
            quantitynew: {
                type: String,
                required: false,
            },
            materialnew: {
                type: String,
                required: false,
            },
            productdetailsnew: {
                type: String,
                require: false,
            },
            uomcodenew: {
                type: String,
                require: false,
            },
        },
    ],



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
StockmanageSchema.index({ company: 1, branch: 1, unit: 1 })
StockmanageSchema.index({ requestmode: 1, handover: 1, status: 1 })
StockmanageSchema.index({ company: 1, branch: 1, unit: 1 })
StockmanageSchema.index({ company: 1, branch: 1, unit: 1, mode: 1 })
StockmanageSchema.index({ company: 1, branch: 1, unit: 1, mode: 1 })
StockmanageSchema.index({ company: 1, branch: 1, unit: 1, requestmode: 1 })
StockmanageSchema.index({ company: 1, branch: 1, unit: 1, requestmode: 1 })
module.exports = mongoose.model("Stockmanage", StockmanageSchema);