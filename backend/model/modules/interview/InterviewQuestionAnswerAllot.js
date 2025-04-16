const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const interviewAnswerAllotSchema = new Schema({
  mode: {
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
  question: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },

  //for typing test
  typingspeed: {
    type: String,
    required: false,
  },
  typingaccuracy: {
    type: String,
    required: false,
  },
  typingmistakes: {
    type: String,
    required: false,
  },
  typingduration: {
    type: String,
    required: false,
  },

  yesorno: {
    type: String,
    required: false,
  },
  subquestionlength: {
    type: String,
    required: false,
  },
  optionArr: [
    {
      //   status: {
      //     type: String,
      //     required: false,
      //   },
      options: {
        type: String,
        required: false,
      },
      //   description: {
      //     type: String,
      //     required: false,
      //   },
    },
  ],
  secondarytodo: [
    {
      //   extraquestion: {
      //     type: String,
      //     required: false,
      //   },
      //   options: {
      //     type: String,
      //     required: false,
      //   },
      question: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      optionslist: {
        type: [String],
        required: false,
      },
      date: {
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
    },
  ],
  answers: {
    type: String,
    required: false,
  },
  date: {
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
  statusAns: {
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
module.exports = mongoose.model(
  "InterviewAnswerAllot",
  interviewAnswerAllotSchema
);
