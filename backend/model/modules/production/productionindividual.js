const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductionIndividualSchema = new Schema({
    vendor: {
        type: String,
        required: false,
    },
    approvalstatus: {
        type: String,
        required: false,
    },
    lateentrystatus: {
        type: String,
        required: false,
    },
    approvaldate: {
        type: Date,
        required: false,
        // default: Date.now,
    },
    fromdate: {
        type: String,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },

    startdate: {
        type: String,
        required: false,
    },
    starttime: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },

    reason: {
        type: String,
        required: false,
    },
    totalpages: {
        type: String,
        required: false,
    },
    completedpages: {
        type: String,
        required: false,
    },
    pendingpages: {
        type: String,
        required: false,
    },

    startpage: {
        type: String,
        required: false,
    },
    startmode: {
        type: String,
        required: false,
    },
    statusmode: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },

    datemode: {
        type: String,
        required: false,
    },
    datetimezone: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    filename: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    unitid: {
        type: String,
        required: false,
    },
    unitrate: {
        type: Number,
        required: false,
    },
    originalunitrate: {
        type: Number,
        required: false,
    },
    user: {
        type: String,
        required: false,
    },
    section: {
        type: String,
        required: false,
    },
    updatedunitrate: {
        type: String,
        required: false,
    },
    updatedsection: {
        type: String,
        required: false,
    },
    updatedflag: {
        type: String,
        required: false,
    },

    unallothide: {
        type: String,
        required: false,
    },
    unallotcategory: {
        type: String,
        required: false,
    },
    unallotsubcategory: {
        type: String,
        required: false,
    },
    originalunitrate: {
        type: Number,
        required: false,
    },
    originalsection: {
        type: String,
        required: false,
    },
    flagcount: {
        type: String,
        required: false,
    },
    alllogin: {
        type: String,
        required: false,
    },
    docnumber: {
        type: String,
        required: false,
    },
    doclink: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    creationstatus: {
        type: String,
        required: false,
    },
    remarks: {
        type: String,
        required: false,
    },
    enddatemode: {
        type: String,
        required: false,
    },
    startbuttonstatus: {
        type: Boolean,
        required: false,
    },
    fromtotime: {
        type: String,
        required: false,
    },

    todate: {
        type: String,
        required: false,
    },
    totime: {
        type: String,
        required: false,
    },

    files: [
        {
            base64: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            preview: {
                type: String,
                required: false,
            },
            size: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
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
module.exports = mongoose.model("ProductionIndividual", ProductionIndividualSchema);