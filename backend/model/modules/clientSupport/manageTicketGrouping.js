const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TicketGroupingSchema = new Schema({
  clientname: {
    type: String,
    required: false,
  },
  modulename: {
    type: [String],
    required: false,
  },
  submodulename: {
    type: [String],
    required: false,
  },
  mainpage: {
    type: [String],
    required: false,
  },
  subpage: {
    type: [String],
    required: false,
  },
  subsubpage: {
    type: [String],
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
  employeedbid: {
    type: [String],
    required: false,
  },
  clientid: {
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
module.exports = mongoose.model("ticketGrouping", TicketGroupingSchema);
