const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddPermissionSchema = new Schema({
  actionby: {
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
  time: {
    type: String,
    required: false,
  },
  shifttiming: {
    type: String,
    required: false,
  },
  applytype: {
    type: String,
    required: false,
  },
  access: {
    type: String,
    required: false,
  },
  employeename: {
    type: String,
    required: false,
  },
  employeeid: {
    type: String,
    required: false,
  },
  permissiontype: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  fromtime: {
    type: String,
    required: false,
  },
  requesthours: {
    type: String,
    required: false,
  },
  endtime: {
    type: String,
    required: false,
  },
  reportingto: {
    type: String,
    required: false,
  },
  companyname: {
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
  reasonforpermission: {
    type: String,
    required: false,
  },
  compensationapplytype: {
    type: String,
    required: false,
  },
  compensationstatus: {
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
module.exports = mongoose.model("addPermission", AddPermissionSchema);