const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceStatusSchema = new Schema({

    clockinstatus: {
        type: String,
        required: false,
    },
    clockoutstatus: {
        type: String,
        required: false,
    },
    defalutclockinstatus: {
        type: String,
        required: false,
    },
    defaultclockoutstatus: {
        type: String,
        required: false,
    },
    clockincount: {
        type: String,
        required: false,
    },
    clockincountstatus: {
        type: Boolean,
        required: false,
    },
    clockoutcountstatus: {
        type: Boolean,
        required: false,
    },
    clockoutcount: {
        type: String,
        required: false,
    },
    name: {
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
module.exports = mongoose.model('Attendancestatusmaster', attendanceStatusSchema);