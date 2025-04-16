const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DesignationRequirementsSchema = new Schema({

    designation: {
        type: String,
        required: false,
    },
    education: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: false,
    },
    skill: {
        type: String,
        required: false,
    },
    experiencefrom: {
        type: String,
        require: false,
    },
    experienceto: {
        type: String,
        require: false,
    },
    salaryfrom: {
        type: String,
        require: false,
    },
    salaryto: {
        type: String,
        require: false,
    },
    noticeperiodfrom: {
        type: String,
        require: false,
    },
    noticeperiodto: {
        type: String,
        require: false,
    },
    rolesandres: {
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
module.exports = mongoose.model("Designationrequirement", DesignationRequirementsSchema)