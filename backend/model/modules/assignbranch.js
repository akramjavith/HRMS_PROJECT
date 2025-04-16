const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assignBranch = new Schema({
  company: String,
  branch: String,
  unit: String,
  companycode: String,
  branchcode: String,
  branchemail: String,
  branchaddress: String,
  branchstate: String,
  branchcity: String,
  branchcountry: String,
  branchpincode: String,
  unitcode: String,
  employee: String,
  employeecode: String,
  fromcompany: String,
  frombranch: String,
  fromunit: String,
  modulename: {
    type: [String],
    required: false,
  },
  submodulename: {
    type: [String],
    required: false,
  },
  mainpagename: {
    type: [String],
    required: false,
  },
  subpagename: {
    type: [String],
    required: false,
  },
  subsubpagename: {
    type: [String],
    required: false,
  },
  modulenameurl: {
    type: [String],
    required: false,
  },
  submodulenameurl: {
    type: [String],
    required: false,
  },
  mainpagenameurl: {
    type: [String],
    required: false,
  },
  subpagenameurl: {
    type: [String],
    required: false,
  },
  subsubpagenameurl: {
    type: [String],
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
module.exports = mongoose.model("Assignbranch", assignBranch);