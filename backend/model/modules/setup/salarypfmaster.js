const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const salaryPfSchema = new Schema({
 
  
  esiemployeepercentage: {
    type: Number,
    required: false,
  },
  esiemployerpercentage: {
    type: Number,
    required: false,
  },

  pfemployeepercentage: {
    type: Number,
    required: false,
  },
  pfemployerpercentage: {
    type: Number,
    required: false,
  },


  epfcontribution: {
    type: Number,
    required: false,
  },
  epspension: {
    type: Number,
    required: false,
  },

  edliinsurance: {
    type: Number,
    required: false,
  },
  epfadmincharges: {
    type: Number,
    required: false,
  },
  esilimit: {
    type: Number,
    required: false,
  },
  pflimit: {
    type: Number,
    required: false,
  },
 
  year: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: false,
  },
  // pftodoList:[
  //   {
  //     formula: {
  //       type: String,
  //       required: false,
  //     },
  //     type: {
  //       type: String,
  //       required: false,
  //     },
  //     month: {
  //       type: String,
  //       required: false,
  //     },
  //     year: {
  //       type: String,
  //       required: false,
  //     },
  //   }
  // ],
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

module.exports = mongoose.model("salaryPf", salaryPfSchema);
