const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ScheduleMeetingSchema = new Schema({
  company: {
    type: [String],
    required: false,
  },
  branch: {
    type: [String],
    required: false,
  },
  department: {
    type: [String],
    required: false,
  },
  team: {
    type: [String],
    required: false,
  },
  meetingcategory: {
    type: String,
    required: false,
  },
  meetingtype: {
    type: String,
    required: false,
  },
  meetingmode: {
    type: String,
    required: false,
  },
  branchvenue: {
    type: [String],
    required: false,
  },
  floorvenue: {
    type: [String],
    required: false,
  },
  venue: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  timezone: {
    type: String,
    required: false,
  },
  participants: {
    type: [String],
    required: false,
  },
  participantsid: {
    type: [String],
    required: false,
  },
  reminder: {
    type: String,
    required: false,
  },
  agenda: {
    type: String,
    required: false,
  },
  recuringmeeting: {
    type: Boolean,
    required: false,
  },
  repeattype: {
    type: String,
    required: false,
  },
  uniqueid: {
    type: String,
    required: false,
  },
  // repeatevery: {
  //     type: String,
  //     required: false,
  // },

  //notice period datas
  hostcompany: {
    type: [String],
    required: false,
  },
  hostbranch: {
    type: [String],
    required: false,
  },
  hostdepartment: {
    type: [String],
    required: false,
  },
  hostteam: {
    type: [String],
    required: false,
  },
  interviewer: {
    type: [String],
    required: false,
  },
  meetinghostid: {
    type: [String],
    required: false,
  },
  interviewscheduledby: {
    type: String,
    required: false,
  },
  meetingparticipant: {
    type: String,
    required: false,
  },
  noticeperiodid: {
    type: String,
    required: false,
  },
  meetingassignedthrough: {
    type: String,
    required: false,
  },

  meetingstatus: {
    type: String,
    required: false,
  },
  minutesofmeeting: {
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
module.exports = mongoose.model("ScheduleMeeting", ScheduleMeetingSchema);