const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timerSchema = new Schema({
    
    userid:{
        type: String,
        required: false,
    },
    taskname:{
        type: String,
        required: false
    },
    startTime:{
        type: String,
        required: false,
    },
    endTime:{
        type: String,
        required: false,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("timer", timerSchema)