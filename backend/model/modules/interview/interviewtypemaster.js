// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const interviewtypemasterSchema = new Schema({
//   categorytype: {
//     type: String,
//     required: false,
//   },
//   subcategorytype: {
//     type: String,
//     required: false,
//   },
//   nametype: {
//     type: String,
//     required: false,
//   },
//   // today: {
//   //     type: String,
//   //     required: false,
//   // },

//   addedby: [
//     {
//       name: {
//         type: String,
//         required: false,
//       },
//       date: {
//         type: String,
//         required: false,
//       },
//     },
//   ],
//   updatedby: [
//     {
//       name: {
//         type: String,
//         required: false,
//       },
//       date: {
//         type: String,
//         required: false,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// module.exports = mongoose.model("Interviewtypemaster", interviewtypemasterSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const interviewtypemasterSchema = new Schema({
  categorytype: {
    type: [String],
    required: false,
  },
  subcategorytype: {
    type: [String],
    required: false,
  },
  nametype: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    required: false,
  },
  // today: {
  //     type: String,
  //     required: false,
  // },

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
module.exports = mongoose.model(
  "Interviewtypemaster",
  interviewtypemasterSchema
);
