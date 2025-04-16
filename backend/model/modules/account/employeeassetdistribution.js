const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeassetSchema = new Schema({
    acceptedby: {
        type: String,
        required: false,
    },
    accepteddateandtime: {
        type: Date,
        required: false,
    },

    status: {
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
    assetmaterial: {
        type: String,
        required: false,
    },
    assetmaterialcode: {
        type: String,
        required: false,
    },
    assetmaterialcheck: {
        type: String,
        required: false,
    },
    workstation: {
        type: String,
        required: false,
    },
    assetmaterialcheck: {
        type: String,
        required: false,
    },
    uniqueid: {
        type: Number,
        required: false,
    },
    assigntime: {
        type: String,
        required: false,
    },
    assigndate: {
        type: String,
        required: false,
    },
    companyto: {
        type: String,
        required: false,
    },

    empcode: {
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
    companyname: {
        type: String,
        required: false,
    },
    branchto: {
        type: [String],
        required: false,
    },
    unitto: {
        type: [String],
        required: false,
    },
    teamto: {
        type: [String],
        required: false,
    },

    employeenameto: {
        type: [String],
        required: false,
    },

    images: [
        {
            data: {
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
module.exports = mongoose.model('Employeeasset', employeeassetSchema);