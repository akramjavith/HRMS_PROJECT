const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NonScheduleTrainingDetailsSchema = new Schema({

    trainingdetails: {
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
    mode: {
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
    schedule: {
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
    type: {
        type: String,
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
module.exports = mongoose.model('TrainingNonSchedule', NonScheduleTrainingDetailsSchema);