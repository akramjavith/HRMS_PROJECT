const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ebreadingdetailSchema = new Schema({
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
    usageunit: {
        type: String,
        required: false,
    },
    currentusageunit: {
        type: String,
        required: false,
    },
    currentstatus: {
        type: String,
        required: false,
    },
    servicenumber: {
        type: String,
        required: false,
    },
    readingmode: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    enddate: {
        type: String,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },
    // kwhreading: {
    //     type: String,
    //     required: false,
    // },
    openkwh: {
        type: String,
        required: false,
    },
    kvah: {
        type: String,
        required: false,
    },
    kwhunit: {
        type: String,
        required: false,
    },
    kvahunit: {
        type: String,
        required: false,
    },
    pf: {
        type: String,
        required: false,
    },
    md: {
        type: String,
        required: false,
    },
    pfrphase: {
        type: String,
        required: false,
    },
    pfyphase: {
        type: String,
        required: false,
    },
    pfbphase: {
        type: String,
        required: false,
    },
    pfcurrent: {
        type: String,
        required: false,
    },
    pfaverage: {
        type: String,
        required: false,
    },
    mdrphase: {
        type: String,
        required: false,
    },
    mdyphase: {
        type: String,
        required: false,
    },
    mdbphase: {
        type: String,
        required: false,
    },
    mdcurrent: {
        type: String,
        required: false,
    },
    mdaverage: {
        type: String,
        required: false,
    },
    description: {
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
module.exports = mongoose.model("Ebreadingdetail", ebreadingdetailSchema);