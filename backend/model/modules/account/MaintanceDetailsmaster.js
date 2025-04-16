const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MaintenancemasterDetailsSchema = new Schema({

    assetmaterial: {
        type: String,
        required: false,
    },
    assetmaterialcode: {
        type: String,
        required: false,
    },
    maintenancedescriptionmaster: {
        type: String,
        required: false,
    },
    groupid: {
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
        default: Date.now,
    },
})
module.exports = mongoose.model('MaintenancemasterDetails', MaintenancemasterDetailsSchema);