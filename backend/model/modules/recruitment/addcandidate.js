const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CandidateSchema = new Schema({
  rolebacktoid: {
    type: String,
    required: false,
  },
  rescheduleafterreject: {
    type: Boolean,
    required: false,
  },

  rolebackto: {
    type: String,
    required: false,
  },
  roleback: {
    type: Boolean,
    required: false,
  },
  domainexperience: {
    type: Number,
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

  domainexperienceestimation: {
    type: String,
    required: false,
  },

  today: {
    type: String,
    required: false,
  },
  finalstatus: {
    type: String,
    required: false,
  },
  expectedsalaryopts: {
    type: String,
    required: false,
  },
  joiningbydaysopts: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  screencandidate: {
    type: String,
    required: false,
  },
  candidatestatus: {
    type: String,
    required: false,
  },

  prefix: {
    type: String,
    required: false,
  },
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  mobile: {
    type: Number,
    required: false,
  },
  whatsapp: {
    type: Number,
    required: false,
  },
  phonecheck: {
    type: Boolean,
    required: false,
  },
  adharnumber: {
    type: Number,
    required: false,
  },
  pannumber: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  jobopeningsid: {
    type: String,
    required: false,
  },
  otherqualification: {
    type: String,
    required: false,
  },
  skill: [String],
  dateofbirth: {
    type: String,
    required: false,
  },
  street: {
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
  postalcode: {
    type: Number,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  experience: {
    type: Number,
    required: false,
  },
  fromexp: {
    type: Number,
    required: false,
  },
  toexp: {
    type: Number,
    required: false,
  },
  category: {
    type: [String],
    required: false,
  },
  subcategory: {
    type: [String],
    required: false,
  },
  qualification: {
    type: [String],
    required: false,
  },
  currentjobtitle: {
    type: String,
    required: false,
  },
  currentemployer: {
    type: String,
    required: false,
  },
  expectedsalary: {
    type: String,
    required: false,
  },
  currentsalary: {
    type: String,
    required: false,
  },
  skillset: {
    type: String,
    required: false,
  },
  additionalinfo: {
    type: String,
    required: false,
  },
  linkedinid: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  interviewdate: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  sourcecandidate: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },

  education: {
    type: [String],
    required: false,
  },
  educationdetails: [
    {
      categoryedu: {
        type: String,
        required: false,
      },
      subcategoryedu: {
        type: String,
        required: false,
      },
      specialization: {
        type: String,
        required: false,
      },
      school: {
        type: String,
        required: false,
      },
      department: {
        type: String,
        required: false,
      },
      degree: {
        type: String,
        required: false,
      },
      fromduration: {
        type: String,
        required: false,
      },
      toduration: {
        type: String,
        required: false,
      },
      pursuing: {
        type: Boolean,
        required: false,
      },
    },
  ],

  experiencedetails: [
    {
      occupation: {
        type: String,
        required: false,
      },
      company: {
        type: String,
        required: false,
      },
      summary: {
        type: String,
        required: false,
      },
      fromduration: {
        type: String,
        required: false,
      },
      toduration: {
        type: String,
        required: false,
      },
      currentlyworkhere: {
        type: Boolean,
        required: false,
      },
    },
  ],
  resumefile: [
    {
      data: {
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
      remark: {
        type: String,
        required: false,
      },
    },
  ],
  coverletterfile: [
    {
      data: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
    },
  ],
  experienceletterfile: [
    {
      data: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
    },
  ],
  payslipletterfile: [
    {
      data: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      remark: {
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

  domainexperience: {
    type: Number,
    required: false,
  },
  joinbydays: {
    type: Number,
    required: false,
  },
  noticeperiod: {
    type: Number,
    required: false,
  },
  certification: {
    type: [String],
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
  gender: {
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

  username: {
    type: String,
    required: false,
  },
  coverlettertext: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  overallstatus: {
    type: String,
    required: false,
  },
  candidatedatafile: [
    {
      candidatefilename: {
        type: String,
        required: false,
      },
      data: {
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
      remark: {
        type: String,
        required: false,
      },
      uniqueid: {
        type: String,
        required: false,
      },
      link: {
        type: String,
        required: false,
      },
      linkname: {
        type: String,
        required: false,
      },
      csfilname: {
        type: String,
        required: false,
      },
      uploadedby: {
        type: String,
        required: false,
      },
      shortname: {
        type: String,
        required: false,
      },
    },
  ],
  rolebacktocompany: {
    type: String,
    required: false,
  },
  rolebacktobranch: {
    type: String,
    required: false,
  },

  interviewrounds: [
    {
      rescheduleafterreject: {
        type: Boolean,
        required: false,
      },
      roundCreatedAt: {
        type: Date,
        default: Date.now,
      },
      testcompletedat: {
        type: String,
        required: false,
      },
      questiontype: {
        type: String,
        required: false,
      },
      questioncount: {
        type: String,
        required: false,
      },
      questioncountfrom: {
        type: String,
        required: false,
      },
      questioncountto: {
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
      meetingcategory: {
        type: String,
        required: false,
      },
      meetingtype: {
        type: String,
        required: false,
      },
      meetingmode: {
        type: String,
        required: false,
      },
      branchvenue: {
        type: [String],
        required: false,
      },
      floorvenue: {
        type: [String],
        required: false,
      },
      venue: {
        type: String,
        required: false,
      },
      link: {
        type: String,
        required: false,
      },
      title: {
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
      deadlinedate: {
        type: String,
        required: false,
      },
      deadlinetime: {
        type: String,
        required: false,
      },
      teststartedby: {
        type: String,
        required: false,
      },

      duration: {
        type: String,
        required: false,
      },
      timezone: {
        type: String,
        required: false,
      },
      participants: {
        type: String,
        required: false,
      },

      hostcompany: {
        type: [String],
        required: false,
      },
      hostbranch: {
        type: [String],
        required: false,
      },
      hostunit: {
        type: [String],
        required: false,
      },
      hostteam: {
        type: [String],
        required: false,
      },
      interviewer: {
        type: [String],
        required: false,
      },
      interviewscheduledby: {
        type: String,
        required: false,
      },

      roundtype: {
        type: String,
        required: false,
      },
      roundcategory: {
        type: String,
        required: false,
      },
      roundsubcategory: {
        type: String,
        required: false,
      },
      roundname: {
        type: String,
        required: false,
      },
      designation: {
        type: String,
        required: false,
      },

      roundlink: {
        type: String,
        required: false,
      },
      roundstatus: {
        type: String,
        required: false,
      },
      roundanswerstatus: {
        type: String,
        required: false,
      },
      rounduserstatus: {
        type: String,
        required: false,
      },
      nextround: {
        type: Boolean,
        required: false,
      },

      mode: {
        type: String,
        required: false,
      },
      retestcount: {
        type: Number,
        required: false,
      },
      retestfor: {
        type: String,
        required: false,
      },
      testname: {
        type: String,
        required: false,
      },
      totalmarks: {
        type: String,
        required: false,
      },
      eligiblemarks: {
        type: String,
        required: false,
      },
      userobtainedmarks: {
        type: String,
        required: false,
      },

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

      interviewFormLog: [
        [
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
      ],

      manualEntry: [
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
    },
  ],
});
CandidateSchema.index({ overallstatus: 1, createdAt: 1 })
CandidateSchema.index({ fromdate: 1, todate: 1, "interviewrounds.roundcreatedAt": 1 })
module.exports = mongoose.model("Candidate", CandidateSchema);