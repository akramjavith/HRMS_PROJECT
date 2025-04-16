const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ManagecompanySchema = new Schema({

    company:{
        type: String,
        required: false,
    },
    branch:{
        type: [String],
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Managecompany", ManagecompanySchema)