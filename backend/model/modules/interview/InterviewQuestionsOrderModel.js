const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InterviewQuestionsOrderSchema = new Schema({
  designation: {
    type: String,
    required: false,
  },
  round: {
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
  duration: {
    type: String,
    required: false,
  },
  question: [String],
  totalmarks: {
    type: Number,
    required: false,
  },
  eligiblemarks: {
    type: Number,
    required: false,
  },
  markcomparison: {
    type: String,
    required: false,
  },

  interviewForm: [
    {
      typingspeed: {
        type: String,
        required: false,
      },
      typingspeedvalidation: {
        type: String,
        required: false,
      },
      typingspeedfrom: {
        type: String,
        required: false,
      },
      typingspeedto: {
        type: String,
        required: false,
      },
      typingspeedstatus: {
        type: String,
        required: false,
      },
      statusAllotId: {
        type: String,
        required: false,
      },
      typingaccuracy: {
        type: String,
        required: false,
      },
      typingaccuracyvalidation: {
        type: String,
        required: false,
      },
      typingaccuracyfrom: {
        type: String,
        required: false,
      },
      typingaccuracyto: {
        type: String,
        required: false,
      },
      typingaccuracystatus: {
        type: String,
        required: false,
      },

      typingmistakes: {
        type: String,
        required: false,
      },
      typingmistakesvalidation: {
        type: String,
        required: false,
      },
      typingmistakesfrom: {
        type: String,
        required: false,
      },
      typingmistakesto: {
        type: String,
        required: false,
      },
      typingmistakesstatus: {
        type: String,
        required: false,
      },

      typingduration: {
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
      answers: {
        type: String,
        required: false,
      },
      statusAns: {
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
      datestatus: {
        type: String,
        required: false,
      },
      datedescription: {
        type: String,
        required: false,
      },
      subquestionlength: {
        type: String,
        required: false,
      },
      yesorno: {
        type: String,
        required: false,
      },
      userans: {
        type: String,
        required: false,
      },
      statusAns: {
        type: String,
        required: false,
      },
      optionArr: [
        {
          status: {
            type: String,
            required: false,
          },
          options: {
            type: String,
            required: false,
          },
          description: {
            type: String,
            required: false,
          },
          validation: {
            type: String,
            required: false,
          },
          betweenfrom: {
            type: String,
            required: false,
          },
          betweento: {
            type: String,
            required: false,
          },
        },
      ],
      secondarytodo: [
        {
          extraquestion: {
            type: String,
            required: false,
          },
          options: {
            type: String,
            required: false,
          },
          question: {
            type: String,
            required: false,
          },
          userans: {
            type: String,
            required: false,
          },
          type: {
            type: String,
            required: false,
          },
          optionslist: [
            {
              status: {
                type: String,
                required: false,
              },
              answer: {
                type: String,
                required: false,
              },
              description: {
                type: String,
                required: false,
              },
              validation: {
                type: String,
                required: false,
              },
              betweenfrom: {
                type: String,
                required: false,
              },
              betweento: {
                type: String,
                required: false,
              },
            },
          ],
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
module.exports = mongoose.model(
  "InterviewQuestionsOrder",
  InterviewQuestionsOrderSchema
);
