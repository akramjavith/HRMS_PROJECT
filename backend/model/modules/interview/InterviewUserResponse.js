const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const interviewuserresponseSchema = new Schema({
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  questionId: {
    type: String,
    required: false,
  },
  testcategory: {
    type: String,
    required: false,
  },
  testsubcategory: {
    type: String,
    required: false,
  },

  interviewForm: [
    {
      question: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },

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
      //typing ans
      typingspeedans: {
        type: String,
        required: false,
      },
      typingaccuracyans: {
        type: String,
        required: false,
      },
      typingmistakesans: {
        type: String,
        required: false,
      },
      useransstatus: {
        type: [String],
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
          userans: {
            type: [String],
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
      answers: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      statusAns: {
        type: String,
        required: false,
      },
      userans: {
        type: [String],
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
module.exports = mongoose.model(
  "Interviewuserresponse",
  interviewuserresponseSchema
);