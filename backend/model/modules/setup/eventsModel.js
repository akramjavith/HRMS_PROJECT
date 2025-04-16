const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ScheduleEventsSchema = new Schema({
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
  eventname: {
    type: String,
    required: false,
  },
  eventdescription: {
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
  area: {
    type: String,
    required: false,
  },
  insideoffice: {
    type: Boolean,
    required: false,
  },
  reminder: {
    type: String,
    required: false,
  },
  participants: {
    type: [String],
    required: false,
  },
  files: [
    {
      data: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
    },
  ],
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
ScheduleEventsSchema.index({ company: 1, branch: 1, unit: 1 })
module.exports = mongoose.model("Events", ScheduleEventsSchema);
