const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoLogoutSchema = new Schema({
  //overall

  autologoutswitch: {
    type: Boolean,
    required: false,
  },
  autologoutmins: {
    type: String,
    required: false,
  },

  //todo

  todos: [
    {
      company: {
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
      employeename: {
        type: String,
        required: false,
      },
      employeedbid: {
        type: String,
        required: false,
      },

      autologoutswitch: {
        type: Boolean,
        required: false,
      },
      autologoutmins: {
        type: String,
        required: false,
      },
    },
  ],

  // addedby: [
  //     {
  //         name: {
  //             type: String,
  //             required: false,
  //         },
  //         date: {
  //             type: String,
  //             required: false,
  //         },

  //     }],
  // updatedby: [
  //     {
  //         name: {
  //             type: String,
  //             required: false,
  //         },
  //         date: {
  //             type: String,
  //             required: false,
  //         },

  //     }],
});
module.exports = mongoose.model("autoLogout", AutoLogoutSchema);