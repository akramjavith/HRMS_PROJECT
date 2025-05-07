const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AnnouncementSchema = new Schema({

    company: {
        type: String,
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
    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    view: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    files: [
        {
            data: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            preview: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
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
module.exports = mongoose.model('announcement', AnnouncementSchema);