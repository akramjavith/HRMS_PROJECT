const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clientUserIDSchema = new Schema({
  projectvendor: {
    type: String,
    required: false,
  },
  userid: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  allotted: {
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
  team: {
    type: String,
    required: false,
  },
  empname: {
    type: String,
    required: false,
  },
  empcode: {
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
  loginallotlog: [
    {
      company: {
        type: String,
        required: false,
      },
      branch: {
        type: String,
        required: false,
      },
      
 logeditedby: [
  {
    username: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
  },
],

      unit: {
        type: String,
        required: false,
      },
      team: {
        type: String,
        required: false,
      },
      empname: {
        type: String,
        required: false,
      },
      empcode: {
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
      userid: {
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
module.exports = mongoose.model("clientuserid", clientUserIDSchema);
