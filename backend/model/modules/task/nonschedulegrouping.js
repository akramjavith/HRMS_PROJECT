const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskNonScheduleGroupingSchema = new Schema({

    category: {
        type: String,
        required: false,
    },
    subcategory: {
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
module.exports = mongoose.model('TaskNonScheduleGrouping', TaskNonScheduleGroupingSchema);