const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectAllocationSchema = new Schema({
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
    assignedto:{
        type: String,
        required: false
    },
    assignedtotype:{
        type: String,
        required: false
    },
    assignedby:{
        type: String,
        required: false
    },
    assignedbydate:{
        type: String,
        required: false
    },
    assignedbytime:{
        type: String,
        required: false
    },
    deadline:{
        type: String,
        required: false
    },
    calculatedtime:{
        type: String,
        required: false
    },
    assignedtodate:{
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

module.exports = mongoose.model('ProjectAllocation`', projectAllocationSchema);