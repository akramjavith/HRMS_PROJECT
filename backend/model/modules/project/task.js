const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  projectname: {
    type: String,
    required: false
  },
  userrole: {
    type: String,
    required: false,
  },
  homeuserlogin: {
    type: String,
    required: false,
  },
  homeuseraccess: {
    type: String,
    required: false,
  },
  loginreportacess: {
    type: String,
    required: false,
  },
  startdate: {
    type: String,
    required: false
  },
  enddate: {
    type: String,
    required: false
  },
  userid: {
    type: String,
    required: false,
  },
  subprojectname: {
    type: String,
    required: false
  },
  module: {
    type: String,
    required: false
  },
  submodule: {
    type: String,
    require: false
  },
  mainpage: {
    type: String,
    require: false
  },
  subpageone: {
    type: String,
    require: false
  },
  subpagetwo: {
    type: String,
    require: false
  },
  subpagethree: {
    type: String,
    require: false
  },
  subpagefour: {
    type: String,
    require: false
  },
  subpagefive: {
    type: String,
    require: false
  },
  taskname: {
    type: String,
    required: false
  },
  taskid: {
    type: String,
    require: false
  },
  priority: {
    type: String,
    required: false
  },
  assignedby: {
    type: String,
    require: false
  },
  assignedmode: {
    type: String,
    require: false
  },
  assigneddate: {
    type: String,
    require: false
  },
  taskpagename: {
    type: String,
    require: false
  },
  taskpageid: {
    type: String,
    require: false
  },
  sameascheckpoints: {
    type: Boolean,
    require: false
  },
  checkall: {
    type: Boolean,
    require: false
  },
  taskasignliststatus: {
    type: String,
    require: false

  },
  assignedtodeveloper: [
    {
      label: {
        type: String,
        required: false
      },
      time: {
        type: String,
        required: false
      },
      prioritystatus: {
        type: String,
        required: false
      },
      status: {
        type: String,
        required: false
      },
      description: {
        type: String,
        required: false
      },
      returnstatus: {
        type: String,
        required: false
      },
      usermsg: [
        {
          message: {
            type: [String],
            required: false
          },
          time: {
            type: [Date],
            default: Date.now
          }
        }
      ],
      assignedbymsg: [
        {
          message: {
            type: [String],
            required: false
          },
          time: {
            type: [Date],
            default: Date.now
          }
        }
      ],
    }
  ],
  description: {
    type: String,
    require: false
  },
  calculatedtime: {
    type: String,
    require: false
  },
  status: {
    type: String,
    require: false
  },
  assignedbyprofileimg: {
    type: String,
    require: false
  },

  pbiupload: [
    {
      base64: {
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
      size: {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false
      }
    }
  ],
  resources: [
    {
      base64: {
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
      size: {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false
      }
    }
  ],
  checkpointsdev: [
    {
      label: {
        type: String,
        required: false
      },
      time: {
        type: String,
        required: false
      },
      checkuser: {
        type: String,
        required: false
      },
      priority: {
        type: String,
        required: false
      },

      title: {
        type: String,
        required: false
      },
      idval: {
        type: String,
        required: false
      },
      indexval: {
        type: String,
        required: false
      },
      starttime: {
        type: [String],
        required: false
      },
      endtime: {
        type: [String],
        required: false
      },
      difftime: {
        type: String,
        required: false
      },
      running: {
        type: String,
        required: false
      },
      processstatus: {
        type: String,
        required: false
      },
      state: {
        type: String,
        required: false
      },
      returndate: {
        type: String,
        required: false
      },
      isreturn: {
        type: String,
        required: false
      },

      returncount: {
        type: Number,
        required: false
      },
      files: [
        {
          base64: {
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
          size: {
            type: String,
            required: false
          },
          type: {
            type: String,
            required: false
          }
        }
      ],
    }
  ],
  assignedtotester: {
    type: String,
    require: false
  },
  descriptiontester: {
    type: String,
    require: false
  },
  pbitester: [
    {
      base64: {
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
      size: {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false
      }
    }
  ],
  usecasetester: [
    {
      label: {
        type: String,
        required: false
      },
      time: {
        type: String,
        required: false
      },
      starttime: {
        type: [String],
        required: false
      },
      title: {
        type: String,
        required: false
      },
      idval: {
        type: String,
        required: false
      },
      endtime: {
        type: [String],
        required: false
      },
      difftime: {
        type: String,
        required: false
      },
      running: {
        type: String,
        required: false
      },
      state: {
        type: String,
        required: false
      },
      processstatus: {
        type: String,
        required: false
      },
      files: [
        {
          base64: {
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
          size: {
            type: String,
            required: false
          },
          type: {
            type: String,
            required: false
          }
        }
      ],
    }
  ],
  testerassigneddate: {
    type: String,
    required: false
  },
  usermsg: [
    {
      message: {
        type: [String],
        required: false
      },
      time: {
        type: [Date],
        default: Date.now
      }
    }
  ],
  assignedbymsg: [
    {
      message: {
        type: [String],
        required: false
      },
      time: {
        type: [Date],
        default: Date.now
      }
    }
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
  taskstatus: {
    type: String,
    require: false
  },

  homeuseraccesschecktimer: {
    type: String,
    require: false
  },
  homeuserloginchecktimer: {
    type: String,
    require: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Tasks", TaskSchema);
