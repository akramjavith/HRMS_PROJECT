const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const checklistInterviewSchema = new Schema({

    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    employeestatus: {
        type: String,
        required: false,
    },
    checklisttype: {
        type: String,
        required: false,
    },
    checklistname: [String],
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
module.exports = mongoose.model("checklistInterview", checklistInterviewSchema)