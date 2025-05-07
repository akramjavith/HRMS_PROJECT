const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ManageSchema = new Schema({

    branch:{
        type: String,
        required: false,
    },
    unit:{
        type: [String],
        required: false
    },
    addedby:[
        {
        name:{
            type: String,
            required: false,
        },
        date:{
            type: String,
            required: false,
        },
    
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Managebranch", ManageSchema)