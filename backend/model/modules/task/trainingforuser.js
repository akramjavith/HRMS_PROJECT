const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrainingForUserSchema = new Schema({

    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    taskassign: {
        type: String,
        required: false,
    },
    assignId: {
        type: String,
        required: false,
    },
    startTime: {
        type: [String],
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    userdescription: {
        type: String,
        required: false,
    },
    orginalid: {
        type: String,
        required: false,
    },
    taskstatus: {
        type: String,
        required: false,
    },
    scheduledDates: {
        type: [String],
        required: false,
    },
    created: {
        type: String,
        required: false,
    },
    shiftEndTime: {
        type: String,
        required: false,
    },
    taskassigneddate: {
        type: String,
        required: false,
    },

    taskdetails: {
        type: String,
        required: false,
    },
    taskdate: {
        type: String,
        required: false,
    },
    tasktime: {
        type: String,
        required: false,
    },
    endtraining: {
        type: String,
        required: false,
    },
    monthdate: {
        type: String,
        required: false,
    },
    dueDateCheck: {
        type: String,
        required: false,
    },
    dueFromdate: {
        type: String,
        required: false,
    },
    weekdays: {
        type: [String],
        required: false,
    },
    documentslist: [{
        name: {
          type: String,
          required: false
        },
        document: {
          type: [String],
          required: false
        },
        files: [
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
      }],
    datewise: {
        type: String,
        required: false,
    },
    annumonth: {
        type: String,
        required: false,
    },
    annuday: {
        type: String,
        required: false,
    },

    endTime: {
        type: [String],
        required: false,
    },
    startTimeSchedule: {
        type: [String],
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    endTimeSchedule: {
        type: [String],
        required: false,
    },
    timetodo: [
        {
            hour: {
                type: String,
                required: false,
            },
            min: {
                type: String,
                required: false,
            },
            timetype: {
                type: String,
                required: false,
            },
        }
    ],

    monthdate: {
        type: String,
        required: false,
    },
    weekdays: {
        type: [String],
        required: false,
    },
    datewise: {
        type: String,
        required: false,
    },
    annumonth: {
        type: String,
        required: false,
    },
    annuday: {
        type: String,
        required: false,
    },
    frequency: {
        type: String,
        required: false,
    },
    estimation: {
        type: String,
        required: false,
    },
    estimationtime: {
        type: String,
        required: false,
    },
    estimationtraining: {
        type: String,
        required: false,
    },
    estimationtimetraining: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    onlinetestdate: {
        type: String,
        required: false,
    },
    onlinetesttime: {
        type: String,
        required: false,
    },
    breakup: {
        type: String,
        required: false,
    },
    breakupcount: {
        type: String,
        required: false,
    },
    schedule: {
        type: String,
        required: false,
    },
    trainingdetails: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    isOnlineTest: {
        type: String,
        required: false,
    },
    trainingdocuments: [{
        category: {
          type: String,
          required: false,
        },
        subcategory: {
          type: String,
          required: false,
        },
        subcatgeoryDocuments: [{
          name: {
            type: String,
            required: false
          },
          document: {
            type: [String],
            required: false
          },
          files: [
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
        }],
      }],
    testnames: {
        type: String,
        required: false,
    },
    questioncount: {
        type: String,
        required: false,
    },
    typequestion: {
        type: String,
        required: false,
    },
    typeofpage: {
        type: String,
        required: false,
    },
    required: {
        type: [String],
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    tableFormat: [{
        sno: {
            type: String,
            required: false,
        },
        task: {
            type: String,
            required: false,
        },
        subtask: {
            type: String,
            required: false,
        },
        totalduration: {
            type: String,
            required: false,
        },
        breakupcount: {
            type: String,
            required: false,
        },
        startDate: {
            type: String,
            required: false,
        },
        endDate: {
            type: String,
            required: false,
        },
        endTime: {
            type: String,
            required: false,
        },

        reason: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: false,
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

    }]
    ,
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

        }],
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

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('TrainingForUser', TrainingForUserSchema);