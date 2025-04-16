const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const leavecriteriaSchema = new Schema({

  mode: {
    type: String,
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
  employee: {
    type: [String],
    required: false,
  },
  department: {
    type: [String],
    required: false,
  },
  designation: {
    type: [String],
    required: false,
  },

  leaverespecttoweekoff: {
    type: Boolean,
    required: false,
  },
  leaverespecttotraining: {
    type: Boolean,
    required: false,
  },
  uninformedleave: {
    type: Boolean,
    required: false,
  },
  uninformedleavecount: {
    type: String,
    required: false,
  },
  leavefornoticeperiod: {
    type: Boolean,
    required: false,
  },
  leavefornoticeperiodcount: {
    type: String,
    required: false,
  },



  leavetype: {
    type: String,
    required: false,
  },
  numberofdays: {
    type: String,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  experiencein: {
    type: String,
    required: false,
  },
  leaveautocheck: {
    type: Boolean,
    required: false,
  },
  leaveautoincrease: {
    type: String,
    required: false,
  },
  leaveautodays: {
    type: String,
    required: false,
  },
  pendingleave: {
    type: Boolean,
    required: false,
  },
  pendingfrommonth: {
    type: String,
    required: false,
  },
  pendingfromyear: {
    type: String,
    required: false,
  },
  pendingfromdate: {
    type: String,
    required: false,
  },
  leavecalculation: {
    type: Boolean,
    required: false,
  },
  leavefrommonth: {
    type: String,
    required: false,
  },
  leavefromdate: {
    type: String,
    required: false,
  },
  leavetomonth: {
    type: String,
    required: false,
  },
  leavetodate: {
    type: String,
    required: false,
  },
  tookleavecheck: {
    type: Boolean,
    required: false,
  },
  weekstartday: {
    type: String,
    required: false,
  },
  tookleave: [{
    year: {
      type: String,
      required: false,
    },
    month: {
      type: String,
      required: false,
    },
    week: {
      type: String,
      required: false,
    },
    day: {
      type: String,
      required: false,
    },
  }],
  applicablesalary: {
    type: Boolean,
    required: false,
  },
  fullsalary: {
    type: Boolean,
    required: false,
  },
  halfsalary: {
    type: Boolean,
    required: false,
  },

  // tookleavemonth: {
  //   type: String,
  //   required: false,
  // },
  // tookleaveyear: {
  //   type: String,
  //   required: false,
  // },
  // tookleaveday: [{
  //   week: {
  //     type: String,
  //     required: false,
  //   },
  //   dayname: {
  //     type: String,
  //     required: false,
  //   },
  // }],

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
module.exports = mongoose.model("Leave Criteria", leavecriteriaSchema);