const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const salarySlabSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  grosstotal: {
    type: Number,
    required: false,
  },
  salarycode: {
    type: String,
    required: false,
  },
  basic: {
    type: Number,
    required: false,
  },
  hra: {
    type: Number,
    required: false,
  },
  conveyance: {
    type: Number,
    required: false,
  },
  medicalallowance: {
    type: Number,
    required: false,
  },
  productionallowance: {
    type: Number,
    required: false,
  },
  productionallowancetwo: {
    type: Number,
    required: false,
  },
  otherallowance: {
    type: Number,
    required: false,
  },
  shiftallowance: {
    type: Number,
    required: false,
  },
  esideduction: {
    type: Boolean,
    required: false,
  },
  esipercentage: {
    type: Number,
    required: false,
  },
  esimaxsalary: {
    type: Number,
    required: false,
  },
  esiemployeepercentage: {
    type: Number,
    required: false,
  },
  pfdeduction: {
    type: Boolean,
    required: false,
  },
  pfpercentage: {
    type: Number,
    required: false,
  },
  pfemployeepercentage: {
    type: Number,
    required: false,
  },
  processqueue: {
    type: String,
    required: false,
  },
  checkinput: {
    type: String,
    required: false,
  },
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
salarySlabSchema.index({ company: 1, branch: 1 })
salarySlabSchema.index({ company: 1, branch: 1, processqueue: 1 })
salarySlabSchema.index({ company: 1, branch: 1, grosstotal: 1 })
salarySlabSchema.index({ company: 1, branch: 1, totalValue: 1 })
salarySlabSchema.index({ company: 1, branch: 1, salarycode: 1 })
salarySlabSchema.index({
  company: 1, branch: 1, basic: 1, hra: 1, conveyance: 1,
  medicalallowance: 1,
  productionallowance: 1,
  otherallowance: 1,
})
module.exports = mongoose.model("salarySlab", salarySlabSchema);
