const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DepartmentmonthSchema = new Schema({
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: false,
  },
  monthname: {
    type: String,
    required: false,
  },
  fromdate: {
    type: String,
    required: false,
  },
  todate: {
    type: String,
    required: false,
  },
  totaldays: {
    type: String,
    required: false,
  },
  salary: {
    type: Boolean,
    required: false,
  },
  proftaxstop: {
    type: Boolean,
    required: false,
  },
  penalty: {
    type: Boolean,
    required: false,
  },
  esistop: {
    type: Boolean,
    required: false,
  },
  pfstop: {
    type: Boolean,
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
module.exports = mongoose.model("Departmentmonth", DepartmentmonthSchema);
