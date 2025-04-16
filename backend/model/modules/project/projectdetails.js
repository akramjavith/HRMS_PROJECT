const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectDetailsSchema = new Schema({

    projectid:{
        type: String,
        required: false
    },
    project:{
        type: String,
        required: false
    },
    subproject:{
        type: String,
        required: false
    },
    module:{
        type: String,
        required: false
    },
    submodule:{
        type: String,
        required: false
    },
    mainpage:{
        type: String,
        required: false
    },
    subpageone:{
        type: String,
        required: false
    },
    subpagetwo:{
        type: String,
        required: false
    },
    subpagethree:{
        type: String,
        required: false
    },
    subpagefour:{
        type: String,
        required: false
    },
    subpagefive:{
        type: String,
        required: false
    },
    taskname:{
        type: String,
        required: false
    },
    files:[
        {  
    base64: {
        type: String,
        required: false
    },
    name:{
        type: String,
        required: false
    },  
    preview:{
        type: String,
        required: false
    },
    size:{
         type: String,
        required: false
    },
    type:{
        type: String,
        required: false
    },
        }
    ],
    projectdescrip:{
        type: String,
        required: false
    },

    projectsummary:{
        type: String,
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

module.exports = mongoose.model('projectDetails', projectDetailsSchema);