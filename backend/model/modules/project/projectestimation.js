const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectEstimationSchema = new Schema({
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
    expectcompdate:{
        type: String,
        required: false
    },
    expectcomptime:{
        type: String,
        required: false
    },
    expectcompduration:{
        type: String,
        required: false
    },
    budget:{
        type: String,
        required: false
    },
    budgetsign:{
        type: String,
        required: false
    },
    priority:{
        type: String,
        required: false
    },
    prioritylevel:{
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

module.exports = mongoose.model('ProjectEstimation', projectEstimationSchema);