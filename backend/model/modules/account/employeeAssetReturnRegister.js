const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeAssetReturnSchema = new Schema({


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
    employee: {
        type: String,
        required: false,
    },
    distributionid: {
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

    returntime: {
        type: String,
        required: false,
    },
    returndate: {
        type: String,
        required: false,
    },
    description: {
        type: String,
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
            type: {
                type: String,
                required: false,
            },
            remarks: {
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
module.exports = mongoose.model('EmployeeAssetReturn', employeeAssetReturnSchema);