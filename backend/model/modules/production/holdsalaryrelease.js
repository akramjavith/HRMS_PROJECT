const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HoldSalaryReleaseSchema = new Schema({

    companyname: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: false,
    },
    empcode: {
        type: String,
        required: false,
    },
    legalname: {
        type: String,
        required: false,
    },
    desgination: {
        type: String,
        required: false,
    },
    team: {
        type: String,
        required: false,
    },
    bankname: {
        type: String,
        required: false,
    },
    accountnumber: {
        type: String,
        required: false,
    },
    ifsccode: {
        type: String,
        required: false,
    },
    penaltyamount: {
        type: String,
        required: false,
    },
    releaseamount: {
        type: String,
        required: false,
    },
    originalid: {
        type: String,
        required: false,
    },
    outerId: {
        type: String,
        required: false,
    },
    otherdeductionamount: {
        type: String,
        required: false,
    },
    totalexcess: {
        type: String,
        required: false,
    },
    totaladvance: {
        type: String,
        required: false,
    },
    payamount: {
        type: String,
        required: false,
    },
    paydate: {
        type: String,
        required: false,
    },
    paidstatus: {
        type: String,
        required: false,
    },
    approvedby: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    recheckreason: {
        type: String,
        required: false,
    },
    updatedpaidstatus: {
        type: String,
        required: false,
    },
    updatechangedate: {
        type: String,
        required: false,
    },
    updatedholdpercent: {
        type: String,
        required: false,
    },
    updatedreason: {
        type: String,
        required: false,
    },
    payonsalarytype: {
        type: String,
        required: false,
    },
    paydate: {
        type: String,
        required: false,
    },
    paymonth: {
        type: String,
        required: false,
    },
    payyear: {
        type: String,
        required: false,
    },
    finalusersalary: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("HoldSalaryRelease", HoldSalaryReleaseSchema);