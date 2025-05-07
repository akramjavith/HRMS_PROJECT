const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const approveSchema = new Schema({
    company: {
        type: String,
        required: false,
    },
    designationuniqid: {
        type: String,
        required: false,
    },
    seats: {
        type: String,
        required: false,
    },
    area: {
        type: [String],
        required: false,
    },
    floor: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    approvedseats: {
        type: String,
        required: false,
    },
    designation: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    education: {
        type: [String],
        required: false,
    },
    category: {
        type: [String],
        required: false,
    },
    subcategory: {
        type: [String],
        required: false,
    },
    language: {
        type: [String],
        required: false,
    },
    skill: {
        type: [String],
        required: false,
    },
    experience: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    fromexperience: {
        type: String,
        required: false,
    },
    toexperience: {
        type: String,
        required: false,
    },
    fromsalary: {
        type: String,
        required: false,
    },
    tosalary: {
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
        default: Date.now
    }
})
module.exports = mongoose.model('Approvevacancies', approveSchema);