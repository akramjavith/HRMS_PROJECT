const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const candidatedocumentSchema = new Schema({
    designation: {
        type: String, 
        required: false,
    },
    candidatefilename: {
        type: String,
        required: false,
    },

    shortname: {
        type: String,
        required: false,
      },
      allresume: {
        type: Boolean,
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
module.exports = mongoose.model("Candidatedocument", candidatedocumentSchema);