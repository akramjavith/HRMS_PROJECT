const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const raiseticketmasterSchema = new Schema({
  branch: {
    type: String,
    required: false,
  },
  company: {
    type: [String],
    required: false,
  },
  accessdrop: {
    type: String,
    required: false,
  },
  raiseddate: {
    type: String,
    required: false,
  },
  raisedby: {
    type: String,
    required: false,
  },
  resolverby: {
    type: [String],
    required: false,
  },
  resolvedate: {
    type: String,
    required: false,
  },
  materialnamecut: {
    type: String,
    required: false,
  },
  textAreaCloseDetails: {
    type: String,
    required: false,
  },
  workstation: {
    type: String,
    required: false,
  },
  checkRaiseResolve: {
    type: String,
    required: false,
  },
  checkedworkstation:{
    type: Boolean,
    required: false,
  },
  materialname: {
    type: String,
    required: false,
  },
  companyRaise: {
    type: [String],
    required: false,
  },
  raiseTeamGroup: {
    type: String,
    required: false,
  },
  raiseself: {
    type: String,
    required: false,
  },
  accessEmp: {
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
  employeename: {
    type: [String],
    required: false,
  },
  teamgroupname: {
    type: String,
    required: false,
  },
  branchRaise: {
    type: String,
    required: false,
  },
  unitRaise: {
    type: String,
    required: false,
  },
  teamRaise: {
    type: String,
    required: false,
  },
  employeenameRaise: {
    type: [String],
    required: false,
  },
  employeecode: {
    type: [String],
    required: false,
  },
  ticketclosed: {
    type: String,
    required: false,
  },
  forwardedemployee: {
    type: [String],
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
  subsubcategory: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  duedate: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  estimation: {
    type: String,
    required: false,
  },
  workassetgroup: {
    type: String,
    required: false,
  },
  raiseticketcount: {
    type: String,
    required: false,
  },
  resolverreason: {
    type: String,
    required: false,
  },
  descriptionstatus: {
    type: [String],
    required: false,
  },
  materialcode: {
    type: String,
    required: false,
  },
  materialcodeid: {
    type: String,
    required: false,
  },
  materialstatus: {
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
  forwardedlog: [
    {
      names: {
        type: [String],
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      claimreason: {
        type: String,
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
      forwardedby: {
        type: String,
        required: false,
      },
    },
  ],
  description: {
    type: String,
    required: false,
  },
  requiredfields:[
    {
      namegen: {
        type: String,
        required: false,
      },
      details: {
        type: String,
        required: false,
      },
      options: {
        type: String,
        required: false,
      },
      value: {
        type: String,
        required: false,
      },
      time: {
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
    }
  ],
  checkingNewtable:[
    {
      name: {
        type: String,
        required: false,
      },
      total:[
        {
          namegen: {
            type: String,
            required: false,
          },
          details: {
            type: String,
            required: false,
          },
          options: {
            type: String,
            required: false,
          },
          value: {
            type: String,
            required: false,
          },
          time: {
            type: String,
            required: false,
          },
          display: {
            type: String,
            required: false,
          },
          raiser: {
            type: Boolean,
            required: false,
          },
          resolver: {
            type: Boolean,
            required: false,
          },
          restriction: {
            type: Boolean,
            required: false,
          },
          viewpage: {
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
        }
      ]
    }
   

  ],
  selfcheckpointsmaster:[{
    category: {
      type: [String],
      required: false,
    },
    subcategory: {
      type: [String],
      required: false,
    },
    subsubcategory: {
      type: [String],
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: false,
    },
   checkpointgrp: [
    {
      label: {
        type: String,
        required: false,
      },
      checked: {
        type: String,
        required: false,
      },
    }
  ]
}],
raisefilterissues:[{
      label: {
        type: String,
        required: false,
      },
      checked: {
        type: Boolean,
        required: false,
      },
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
module.exports = mongoose.model("Raiseticketmaster", raiseticketmasterSchema);