const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskdesignationgroupingSchems = new Schema({

  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  schedulestatus: {
    type: String,
    required: false,
  },
  taskassign: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  frequency: {
    type: [String],
    required: false,
  },
  designation: {
    type: [String],
    required: false,
  },
  department: {
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
  employeenames: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  taskdesignationlog: [
    {
      category: {
        type: String,
        required: false
      },
      subcategory: {
        type: String,
        required: false
      },
      schedulestatus: {
        type: String,
        required: false,
      },
      date:{
        type: String,
        required: false,
      },
      taskassign: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        required: false,
      },
      frequency: {
        type: [String],
        required: false,
      },
      designation: {
        type: [String],
        required: false,
      },
      department: {
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
      employeenames: {
        type: [String],
        required: false,
      },

    }
  ],

  documentfiles: [
    {
      data: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      preview: {
        type: String,
        required: false
      },
      remark: {
        type: String,
        required: false
      },

    }
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
module.exports = mongoose.model(
  "TaskDesignationGroupingSchema",
  taskdesignationgroupingSchems
);