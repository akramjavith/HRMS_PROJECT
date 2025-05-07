const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const interviewquestionSchema = new Schema({
  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  testattendby: {
    type: String,
    required: false,
  },
  typingtest: {
    type: Boolean,
    required: false,
  },
  questiontype: {
    type: String,
    required: false,
  },
  doyouhaveextraquestion: {
    type: String,
    required: false,
  },
  isuploadimage: {
    type: Boolean,
    required: false,
  },
  uploadedimage: {
    type: String,
    required: false,
  },
  uploadedimagename: {
    type: String,
    required: false,
  },

  files: [
    {
      data: {
        type: String,
        required: false,
      },
      filename: {
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

  subquestions: [
    {
      subquestionnumber: {
        type: String,
        required: false,
      },
      question: {
        type: String,
        required: false,
      },
      doyouhaveextraquestion: {
        type: String,
        required: false,
      },
      editstatus: {
        type: Boolean,
        required: false,
      },

      isuploadimage: {
        type: Boolean,
        required: false,
      },
      uploadedimage: {
        type: String,
        required: false,
      },
      uploadedimagename: {
        type: String,
        required: false,
      },

      files: [
        {
          data: {
            type: String,
            required: false,
          },
          filename: {
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
module.exports = mongoose.model("InterviewQuestion", interviewquestionSchema);