const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noticeperiodapplySchema = new Schema({
  empcode: {
    type: String,
    required: false,
  },
  empname: {
    type: String,
    required: false,
  },
  exitstatus: {
    type: Boolean,
    required: false,
  },

  // today: {
  //     type: String,
  //     required: false,
  // },
  reasonleavingname: {
    type: String,
    required: false,
  },
  noticedate: {
    type: String,
    required: false,
  },
  other: {
    type: String,
    required: false,
  },
  // notice period request list schema
  approvedStatus: {
    type: String,
    require: false,
  },
  rejectStatus: {
    type: String,
    require: false,
  },
  recheckStatus: {
    type: String,
    require: false,
  },
  approvenoticereq: {
    type: String,
    require: false,
  },
  rejectnoticereq: {
    type: String,
    require: false,
  },
  rechecknoticereq: {
    type: String,
    require: false,
  },

  files: [
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
  company: {
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
  department: {
    type: String,
    required: false,
  },
  team: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  requestdate: {
    type: String,
    required: false,
  },
  requestdatereason: {
    type: String,
    required: false,
  },
  requestdatestatus: {
    type: Boolean,
    required: false,
  },
  approvedthrough: {
    type: String,
    required: false,
  },
  cancelreason: {
    type: String,
    required: false,
  },
  cancelstatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  continuereason: {
    type: String,
    required: false,
  },
  continuestatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  meetingscheduled: {
    type: Boolean,
    required: false,
    default: false,
  },

  //newly added
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  interviewcategory: {
    type: String,
    required: false,
  },
  interviewtype: {
    type: String,
    required: false,
  },
  interviewmode: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  branchvenue: {
    type: [String],
    required: false,
  },
  interviewer: {
    type: [String],
    required: false,
  },
  floorvenue: {
    type: [String],
    required: false,
  },
  interviewscheduled: {
    type: Boolean,
    required: false,
  },
  venue: {
    type: String,
    required: false,
  },
  testname: {
    type: String,
    required: false,
  },
  confirmationstatus: {
    type: String,
    required: false,
  },

  requestfile: [
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
  interviewForm: [
    {
      attendby: {
        type: String,
        required: false,
      },
      manuallyedidted: {
        type: Boolean,
        required: false,
      },
      testcount: {
        type: Number,
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
      timetaken: {
        type: String,
        required: false,
      },
      useransstatus: {
        type: [String],
        required: false,
      },
      typingresult: {
        type: String,
        required: false,
      },
      typingresultstatus: {
        type: [Boolean],
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
          questionattended: {
            type: Boolean,
            required: false,
          },
          manualdecision: {
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
      manualdecision: {
        type: String,
        required: false,
      },
      userans: {
        type: [String],
        required: false,
      },
      questionattended: {
        type: Boolean,
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
noticeperiodapplySchema.index({ company: 1, branch: 1, unit: 1 })
module.exports = mongoose.model("Noticeperiodapply", noticeperiodapplySchema);