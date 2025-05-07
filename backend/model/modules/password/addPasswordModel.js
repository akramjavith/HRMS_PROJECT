const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddPasswordSchema = new Schema({
  company: {
    type: [String],
    required: false,
  },
  branch: {
    type: [String],
    required: false,
  },
  
  firewallstatus: {
    type: String,
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
  employeename: {
    type: String,
    required: false,
  },
  employeedbid: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  publicip: {
    type: String,
    required: false,
  },
  vpnname: {
    type: String,
    required: false,
  },
  vpntype: {
    type: String,
    required: false,
  },
  assignedip: {
    type: String,
    required: false,
  },
  assignedipid: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  autogenerate: {
    type: Boolean,
    required: false,
  },
  temppassword: {
    type: String,
    required: false,
  },
  livepassword: {
    type: String,
    required: false,
  },
  ipsecsecretpassword: {
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
module.exports = mongoose.model("addPassword", AddPasswordSchema);
