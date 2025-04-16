const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskAssignBoardListSchema = new Schema({
  project: {
    type: String,
    required: false,
  },
  subproject: {
    type: String,
    required: false,
  },
  module: {
    type: String,
    required: false,
  },
  submodule: {
    type: String,
    required: false,
  },
  prevId: {
    type: String,
    required: false,
  },
  pagetypename: {
    type: String,
    required: false,
  },
  pagetype: {
    type: String,
    required: false,
  },
  mainpage: {
    type: String,
    required: false,
  },
  subpage: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  taskname: {
    type: String,
    required: false,
  },
  taskid: {
    type: String,
    required: false,
  },
  phase: {
    type: String,
    required: false,
  },
  estimationtype: {
    type: String,
    required: false,
  },
  estimationtime: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  taskassignboardliststatus: {
    type: String,
    required: false,
  },
  componentgrouping: {
    type: String,
    required: false,
  },
  component: {
    type: String,
    required: false,
  },
  subcomponent: {
    type: String,
    required: false,
  },
  compgrpCheck: {
    type: Boolean,
    required: false,
  },
  count: {
    type: String,
    required: false,
  },
  subComReq: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      subrefCode: {
        type: String,
        required: false,
      },
      subrefDetails: {
        type: String,
        required: false,
      },
      subrefLinks: {
        type: String,
        required: false,
      },
      subrefImage: [
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
      subrefDocuments: [
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

      idval: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },

      githublink: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },
      sizeheight: {
        type: String,
        required: false,
      },
      sizewidth: {
        type: String,
        required: false,
      },
      colour: {
        type: String,
        required: false,
      },
      direction: {
        type: String,
        required: false,
      },
      position: {
        type: String,
        required: false,
      },
      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  //workorder section
  assignby: {
    type: String,
    required: false,
  },
  assignmode: {
    type: String,
    required: false,
  },
  assigndate: {
    type: String,
    required: false,
  },
  team: {
    type: String,
    required: false,
  },
  calculatedtime: {
    type: String,
    required: false,
  },
  taskassignui: {
    type: String,
    required: false,
  },
  taskassigndev: {
    type: String,
    required: false,
  },
  taskassigntest: {
    type: String,
    required: false,
  },
  allotedstatus: {
    type: Boolean,
    required: false,
  },
  workorders: [
    {
      progress: {
        type: String,
        required: false,
      },
      idval: {
        type: Number,
        required: false,
      },
      subComponents: [
        {
          subcomponent: {
            type: String,
            required: false,
          },
          id: {
            type: String,
            required: false,
          },
          subEstTime: {
            type: String,
            required: false,
          },
          developer: {
            type: String,
            required: false,
          },
          priority: {
            type: String,
            required: false,
          },
        },
      ],
    },
  ],
  uploadpbi: [
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
  uidesign: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      devpName: {
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

      state: {
        type: String,
        required: false,
      },

      isreturn: {
        type: String,
        required: false,
      },
      starttime: {
        type: [String],
        required: false,
      },
      endtime: {
        type: [String],
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      taskpriority: {
        type: String,
        required: false,
      },
      taskdev: {
        type: String,
        required: false,
      },
      checkpointsstatus: {
        type: String,
        required: false,
      },
      procsts: {
        type: String,
        required: false,
      },
      uidev: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },
      sizeheight: {
        type: String,
        required: false,
      },
      sizewidth: {
        type: String,
        required: false,
      },
      colour: {
        type: String,
        required: false,
      },
      direction: {
        type: String,
        required: false,
      },
      position: {
        type: String,
        required: false,
      },
      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      assignedby: {
        type: String,
        required: false,
      },
      assignmode: {
        type: String,
        required: false,
      },
      assigndate: {
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
      team: {
        type: String,
        required: false,
      },
      resperson: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        required: false,
      },
      sourcelink: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  develop: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      taskdev: {
        type: String,
        required: false,
      },
      taskpriority: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      starttime: {
        type: [String],
        required: false,
      },
      endtime: {
        type: [String],
        required: false,
      },
      testName: {
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

      state: {
        type: String,
        required: false,
      },

      isreturn: {
        type: String,
        required: false,
      },
      procsts: {
        type: String,
        required: false,
      },
      assignedby: {
        type: String,
        required: false,
      },

      assignmode: {
        type: String,
        required: false,
      },
      assigndate: {
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
      team: {
        type: String,
        required: false,
      },
      resperson: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        required: false,
      },
      sourcelink: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },
      checkpointsstatus: {
        type: String,
        required: false,
      },
      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  testing: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      taskdev: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      taskpriority: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      checkpointsstatus: {
        type: String,
        required: false,
      },
      procsts: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      starttime: {
        type: [String],
        required: false,
      },
      endtime: {
        type: [String],
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

      state: {
        type: String,
        required: false,
      },

      isreturn: {
        type: String,
        required: false,
      },
      assignedby: {
        type: String,
        required: false,
      },
      assignmode: {
        type: String,
        required: false,
      },
      assigndate: {
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
      team: {
        type: String,
        required: false,
      },
      resperson: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        required: false,
      },
      sourcelink: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },

      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  testinguidesign: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      checkpointsstatus: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      procsts: {
        type: String,
        required: false,
      },
      taskdev: {
        type: String,
        required: false,
      },
      taskpriority: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      starttime: {
        type: [String],
        required: false,
      },
      endtime: {
        type: [String],
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

      state: {
        type: String,
        required: false,
      },

      isreturn: {
        type: String,
        required: false,
      },
      assignedby: {
        type: String,
        required: false,
      },
      assignmode: {
        type: String,
        required: false,
      },
      assigndate: {
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
      team: {
        type: String,
        required: false,
      },
      priority: {
        type: String,
        required: false,
      },
      sourcelink: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },

      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
module.exports = mongoose.model("TaskAssignBoardList", TaskAssignBoardListSchema);
