const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const qualificationSchema = new Schema({

    qualiname:{
        type: String,
        required: true
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

module.exports = mongoose.model('Qualification', qualificationSchema);