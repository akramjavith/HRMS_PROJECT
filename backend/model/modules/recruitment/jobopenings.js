const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jobOpenSchema = new Schema({
  status: {
    type: String,
    required: false,
  },
  recruitmentname: {
    type: String,
    required: false,
  },
  joboopenid: {
    type: String,
    required: false,
  },
  hiringmanager: {
    type: String,
    required: false,
  },
  approvedseats: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  education: {
    type: [String],
    required: false,
  },
  language: {
    type: [String],
    required: false,
  },
  requiredskill: {
    type: [String],
    required: false,
  },
  fromsalary: {
    type: String,
    required: false,
  },
  tosalary: {
    type: String,
    required: false,
  },

  experiencefrom: {
    type: String,
    required: false,
  },
  experienceto: {
    type: String,
    required: false,
  },

  dateopened: {
    type: String,
    required: false,
  },
  targetdate: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  jobdescription: {
    type: String,
    required: false,
  },
  jobrequirements: {
    type: String,
    required: false,
  },
  jobbenefits: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  jobtype: {
    type: String,
    required: false,
  },
  remotejob: {
    type: Boolean,
    required: false,
  },
  designationuniqid: {
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
  floor: {
    type: String,
    required: false,
  },
  area: {
    type: [String],
    required: false,
  },
  rolesresponse: {
    type: String,
    required: false,
  },

  attachments: [
    {
      base64: {
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
      size: {
        type: String,
        required: false,
      },
      type: {
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
module.exports = mongoose.model("jobOpenings", jobOpenSchema);
