const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PenaltyClientErrorSchema = new Schema({
    project: {
        type: String,
        required: false,
    },
vendorvalue: {
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
    loginid: {
        type: String,
        required: false,
    },
    vendor: {
        type: String,
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
    department: {
        type: String,
        required: false,
    },
    employeename: {
        type: String,
        required: false,
    },
    employeeid: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    documentnumber: {
        type: String,
        required: false,
    },
    documentlink: {
        type: String,
        required: false,
    },

    fieldname: {
        type: String,
        required: false,
    },
    line: {
        type: String,
        required: false,
    },
    errorvalue: {
        type: String,
        required: false,
    },
    correctvalue: {
        type: String,
        required: false,
    },
    clienterror: {
        type: String,
        required: false,
    },
    errorstatus: {
        type: String,
        required: false,
    },
    rejectreason: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    clientamount: {
        type: Number,
        required: false,
    },
    percentage: {
        type: Number,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    history: [
        {
            tablename: {
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
            status: {
                type: String,
                required: false,
            },
            reason: {
                type: String,
                required: false,
            },
            mode: {
                type: String,
                required: false,
            },
            percentage: {
                type: Number,
                required: false,
            },
            calculatedamount: {
                type: Number,
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

PenaltyClientErrorSchema.index({
    project: 1, vendor: 1, loginid: 1, employeename: 1,  errorstatus: 1, history: 1, date: 1,
})

module.exports = mongoose.model("Penaltyclienterror", PenaltyClientErrorSchema);