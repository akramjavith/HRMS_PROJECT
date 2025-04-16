const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdvanceSchema = new Schema({

    advanceamount: {
        type: String,
        required: false,
    },
    requestyear: {
        type: String,
        required: false,
    },
    requestmonth: {
        type: String,
        required: false,
    },
    requestdate: {
        type: String,
        required: false,
    },
   
    company: {
        type: [String],
        required: false,
    },
    branch: {
        type: [String],
        required: false,
    },
    unit: {
        type: [String],
        required: false,
    },
    team: {
        type: [String],
        required: false,
    },
    employeename: {
        type: String,
        required: false,
    },
    empcode: {
        type: String,
        required: false,
    },
    companyname: {
        type: String,
        required: false,
    },
    shifttiming: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    rejectedreason: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        require: false,
    },


    document: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

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

        }],
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

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Advance', AdvanceSchema);