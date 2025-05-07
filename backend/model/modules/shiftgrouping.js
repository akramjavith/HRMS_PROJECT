const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShiftSchema = new Schema({
    shiftday:{
        type: String,
        required: false,
    },
    shifthours:{
        type: String,
        required: false,
    },
    shift:{
        type: [String],
        required: false,
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
    updatedby:[
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
module.exports = mongoose.model('Shiftgrouping',ShiftSchema);