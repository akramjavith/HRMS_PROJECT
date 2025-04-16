const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const documentgroupingSchema = new Schema({
  
    designation:{
        type: String,
        required: false,
    },
    document:{
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
module.exports = mongoose.model('Documentgrouping',documentgroupingSchema);