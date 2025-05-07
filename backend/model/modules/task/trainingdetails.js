const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrainingDeatilsSchema = new Schema({

  trainingdetails: {
    type: String,
    required: false,
  },
  required: {
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
  estimationtraining: {
    type: String,
    required: false,
  },
  estimationtimetraining: {
    type: String,
    required: false,
  },
  frequency: {
    type: String,
    required: false,
  },
  schedule: {
    type: String,
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
  status: {
    type: String,
    required: false,
  },
  taskassign: {
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
  questioncount: {
    type: String,
    required: false,
  },
  typequestion: {
    type: String,
    required: false,
  },
  isOnlineTest: {
    type: Boolean,
    required: false,
  },
  testnames: {
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

  trainingdetailslog: [
    {
   
  trainingdetails: {
    type: String,
    required: false,
  },
  required: {
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
  estimationtraining: {
    type: String,
    required: false,
  },
  estimationtimetraining: {
    type: String,
    required: false,
  },
  frequency: {
    type: String,
    required: false,
  },
  schedule: {
    type: String,
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
  status: {
    type: String,
    required: false,
  },
  taskassign: {
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
  assigndate: {
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
  isOnlineTest: {
    type: Boolean,
    required: false,
  },
  testnames: {
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


    }
  ],







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
module.exports = mongoose.model('TrainingDeatils', TrainingDeatilsSchema);