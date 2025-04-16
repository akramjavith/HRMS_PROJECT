const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConsolidatedSalaryReleaseSchema = new Schema({

    outerId: {
        type: String,
        required: false,

    },
    innerId: {
        type: String,
        required: false,

    },
    logid: {
        type: String,
        required: false,

    },
    status: {
        type: String,
        required: false,

    },

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
    designation: {
        type: String,
        required: false,

    },
    team: {
        type: String,
        required: false,

    },
    department: {
        type: String,
        required: false,

    },

    totalnumberofdays: {
        type: String,
        required: false,

    },
    totalshift: {
        type: String,
        required: false,

    },
    clsl: {
        type: String,
        required: false,

    },
    totalasbleave: {
        type: String,
        required: false,

    },
    totalpaidDays: {
        type: String,
        required: false,

    },
    targetpoints: {
        type: String,
        required: false,

    },
    acheivedpoints: {
        type: String,
        required: false,

    },

    acheivedpercent: {
        type: String,
        required: false,

    },
    penaltyamount: {
        type: String,
        required: false,

    },
    accountholdername: {
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
    releaseamount: {
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

    approvedby: {
        type: String,
        required: false,

    },
    description: {
        type: String,
        required: false,

    },

    paidstatus: {
        type: String,
        required: false,

    },
    paydate: {
        type: String,
        required: false,

    },
    holdpercent: {
        type: String,
        required: false,

    },
    payamount: {
        type: String,
        required: false,

    },

    payonsalarytype: {
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
module.exports = mongoose.model("ConsolidatedSalaryRelease", ConsolidatedSalaryReleaseSchema);