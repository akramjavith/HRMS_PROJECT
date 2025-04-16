const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskMaintenanceNonScheduleGrouping = new Schema({

    companyto: {
        type: String,
        required: false,
    },
    branchto: {
        type: String,
        required: false,
    },
    unitto: {
        type: String,
        required: false,
    },
    floorto: {
        type: String,
        required: false,
    },
    locationto: {
        type: String,
        required: false,
    },
    areato: {
        type: String,
        required: false,
    },

    assetmaterial: {
        type: String,
        required: false,
    },

    state: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    monthdate: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    breakup: {
        type: String,
        required: false,
    },
    breakupcount: {
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
    priority: {
        type: String,
        required: false,
    },
    schedule: {
        type: String,
        required: false,
    },

    required: {
        type: [String],
        required: false,
    },
    designation: {
        type: [String],
        required: false,
    },
    department: {
        type: [String],
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
    employeenames: {
        type: [String],
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
        default: Date.now
    }
})
TaskMaintenanceNonScheduleGrouping.index({ companyto: 1, branchto: 1, unitto: 1, assetmaterial: 1 })
module.exports = mongoose.model('TaskMaintenanceNonScheduleGrouping', TaskMaintenanceNonScheduleGrouping);