const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrainingUserResponseSchema = new Schema({

  username: {
        type: String,
        required: false,
    },
    trainingdetails: {
        type: String,
        required: false,
    },
    trainingassigneddate: {
        type: String,
        required: false,
    },
    trainingdate: {
        type: String,
        required: false,
    },
    typequestion: {
        type: String,
        required: false,
    },
    questioncount: {
        type: String,
        required: false,
    },
    trainingtype: {
        type: String,
        required: false,
    },
    estimationtimetraining: {
        type: String,
        required: false,
    },
    estimationtraining: {
        type: String,
        required: false,
    },
    trainingid: {
        type: String,
        required: false,
    },
    testattended: {
        type: String,
        required: false,
    },
    totalmarksobtained: {
        type: String,
        required: false,
    },
    totalmarks: {
        type: String,
        required: false,
    },
    interviewForm: [
        {
          question: {
            type: String,
            required: false,
          },
          documentFiles:[
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
module.exports = mongoose.model('TrainingUserResponse', TrainingUserResponseSchema);