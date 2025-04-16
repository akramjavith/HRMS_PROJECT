const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const applyleaveSchema = new Schema({
  employeename: {
    type: String,
    required: false,
  },
  access: {
    type: String,
    required: false,
  },
  employeeid: {
    type: String,
    required: false,
  },
  leavetype: {
    type: String,
    required: false,
  },
  // date: {
  //   type: String,
  //   required: false,
  // },
  // todate: {
  //   type: String,
  //   required: false,
  // },
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
  department: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  doj: {
    type: String,
    required: false,
  },
  weekoff: [String],
  workmode: {
    type: String,
    required: false,
  },
  date: [String],
  usershifts: [
    {
      formattedDate: {
        type: String,
        required: false,
      },
      dayName: {
        type: String,
        required: false,
      },
      dayCount: {
        type: String,
        required: false,
      },
      shift: {
        type: String,
        required: false,
      },
      leavestatus: {
        type: String,
        required: false,
      },
      shiftcount: {
        type: String,
        required: false,
      },
      tookleavecheckstatus: {
        type: String,
        required: false,
      },
    }
  ],
  noofshift: {
    type: Number,
    required: false,
  },
  durationtype: {
    type: String,
    required: false,
  },
  availabledays: {
    type: Number,
    required: false,
  },
  reasonforleave: {
    type: String,
    required: false,
  },
  reportingto: {
    type: String,
    required: false,
  },
  numberofdays: {
    type: String,
    required: false,
  },
  rejectedreason: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  uninformedleavestatus: {
    type: String,
    required: false,
  },
  noticeperiodstatus: {
    type: String,
    required: false,
  },
  actionby: {
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
applyleaveSchema.index({ date: 1 })
applyleaveSchema.index({ status: 1, date: 1 })

module.exports = mongoose.model("Applyleave", applyleaveSchema);