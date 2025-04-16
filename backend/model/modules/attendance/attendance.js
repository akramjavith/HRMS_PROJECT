const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attandanceSchema = new Schema({
    username: {
        type: String,
        required: false,
    },
    shiftendtime: {
        type: String,
        required: false,
    },
    shiftmode: {
        type: String,
        required: false,
    },
    clockintime: {
        type: String,
        required: false,
    },
    clockouttime: {
        type: String,
        required: false
    },
    totalhours: {
        type: String,
        required: false
    },
    buttonstatus: {
        type: String,
        required: false
    },
    shiftname: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    calculatedshiftend: {
        type: String,
        required: false,
    },
    clockinipaddress: {
        type: String,
        required: false
    },
    clockoutipaddress: {
        type: String,
        required: false
    },
    userid: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: false
    },
    today: {
        type: String,
        required: false
    },
    timedifference: {
        type: String,
        required: false
    },
    endtime: {
        type: String,
        required: false
    },
    autoclockout: {
        type: Boolean,
        required: false
    },
    attendancemanual: {
        type: Boolean,
        required: false
    },
    attendancestatus: {
        type: String,
        required: false,
    },
    shiftmode: {
        type: String,
        required: false,
    },
    weekoffpresentstatus: {
        type: Boolean,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})

attandanceSchema.index({ date: 1 })
module.exports = mongoose.model('Attandance', attandanceSchema);