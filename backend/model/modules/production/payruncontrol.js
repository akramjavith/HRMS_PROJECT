const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payRunSchema = new Schema({
    company: {
        type: String,
        required: false,
    },

    empstatus: {
        type: String,
        required: false,
    },
    filtertype: {
        type: String,
        required: false,
    },
    choosestatus: {
        type: String,
        required: false,
    },
    choosetype: {
        type: Boolean,
        required: false,
    },
    uniqueid: {
        type: Number,
        required: false,
    },
    department: {
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


    userdepartment: {
        type: [String],
        required: false,
    },

    userbranch: {
        type: [String],
        required: false,
    },
    userunit: {
        type: [String],
        required: false,
    },
    userteam: {
        type: [String],
        required: false,
    },
    empname: {
        type: [String],
        required: false,
    },
    achievedsymbol: {
        type: String,
        required: false,
    },
    achieved: {
        type: String,
        required: false,
    },
    achievedfrom: {
        type: String,
        required: false,
    },
    achievedto: {
        type: String,
        required: false,
    },
    newgrosssymbol: {
        type: String,
        required: false,
    },
    newgross: {
        type: String,
        required: false,
    },
    newgrossfrom: {
        type: String,
        required: false,
    },
    newgrossto: {
        type: String,
        required: false,
    },
    salraytype: {
        type: String,
        required: false,
    },
    deductiontype: {
        type: String,
        required: false,
    },
    

  //productionentry
  entrystatusHour: {
    type: String,
    required: false,
  },
  entrystatusMin: {
    type: String,
    required: false,
  },
  approvalstatusHour: {
    type: String,
    required: false,
  },
  approvalstatusMin: {
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
        },
    ],
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
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("payrun", payRunSchema);