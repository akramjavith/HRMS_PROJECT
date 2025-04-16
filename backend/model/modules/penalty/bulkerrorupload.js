const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bulkerroruploadSchema = new Schema({
    fromdate: {
        type: String,
        required: false,
    },
    editedcount: {
        type: String,
        required: false,
    },
    todate: {
        type: String,
        required: false,
    },
    projectvendor: {
        type: String,
        required: false,
    },
    process: {
        type: String,
        required: false,
    },
    loginid: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    errorfilename: {
        type: String,
        required: false,
    },
    documentnumber: {
        type: String,
        required: false,
    },
    documenttype: {
        type: String,
        required: false,
    },
    fieldname: {
        type: String,
        required: false,
    },
    line: {
        type: String,
        required: false,
    },
    errorvalue: {
        type: String,
        required: false,
    },
    correctvalue: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    doclink: {
        type: String,
        required: false,
    },
    filename: {
        type: String,
        required: false,
    },

    //excel format
    datedrop: {
        type: String,
        required: false,
    },
    monthdrop: {
        type: String,
        required: false,
    },
    yeardrop: {
        type: String,
        required: false,
    },
    symboldrop: {
        type: String,
        required: false,
    },
    hoursdrop: {
        type: String,
        required: false,
    },
    uniqueid: {
        type: Number,
        required: false,
    },
    //validation error entry
    errortype: {
        type: String,
        required: false,
    },
    reason: {
        type: String,
        required: false,
    },
    explanation: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },

    errorseverity: {
        type: String,
        required: false,
    },

    validatestatus: {
        type: String,
        required: false,
    },
    dateformat: {
        type: String,
        required: false,
    },
    dateformatted: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },

    invalidcheck: {
        type: Boolean,
        required: false,
    },

    validcheck: {
        type: Boolean,
        required: false,
    },

    validreject: {
        type: String,
        required: false,
    },


    validrejectcheck: {
        type: Boolean,
        required: false,
    },

    movedstatus: {
        type: Boolean,
        required: false,
    },
    //invalid error

    invalidbulkupload: [
        {


            processinvalid: {
                type: String,
                required: false,
            },
            fieldinvalid: {
                type: String,
                required: false,
            },
            errorinvalid: {
                type: String,
                required: false,
            },
            correctvalueinvalid: {
                type: String,
                require: false,
            },



            clienterror: {
                type: String,
                required: false,
            },
            rejectreason: {
                type: String,
                required: false,
            },

            projectvendorfirst: {
                type: String,
                required: false,
            },
            processfirst: {
                type: String,
                require: false,
            },
            loginidfirst: {
                type: String,
                require: false,
            },
            errorvaluefirst: {
                type: String,
                required: false,
            },
            correctvaluefirst: {
                type: String,
                require: false,
            },
            reasonfirst: {
                type: String,
                require: false,
            },


            projectvendordouble: {
                type: String,
                required: false,
            },
            processdouble: {
                type: String,
                require: false,
            },
            loginiddouble: {
                type: String,
                require: false,
            },
            errorvaluedouble: {
                type: String,
                required: false,
            },
            correctvaluedouble: {
                type: String,
                require: false,
            },
            reasondouble: {
                type: String,
                require: false,
            },



            projectvendorthird: {
                type: String,
                required: false,
            },
            processthird: {
                type: String,
                require: false,
            },
            loginidthird: {
                type: String,
                require: false,
            },
            errorvaluethird: {
                type: String,
                required: false,
            },
            correctvaluethird: {
                type: String,
                require: false,
            },
            reasonthird: {
                type: String,
                require: false,
            },


        },
    ],

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
bulkerroruploadSchema.index({ projectvendor: 1, dateformatted: 1 })
bulkerroruploadSchema.index({ dateformatted: 1, loginid: 1 })
bulkerroruploadSchema.index({ projectvendor: 1, process: 1, loginid: 1 })
bulkerroruploadSchema.index({ filename: 1 })
bulkerroruploadSchema.index({ fromdate: 1, todate: 1 })
bulkerroruploadSchema.index({ projectvendor: 1, dateformatted: 1 })
bulkerroruploadSchema.index({ loginid: 1 })
bulkerroruploadSchema.index({ projectvendor: 1, dateformatted: 1, process: 1, loginid: 1 })
module.exports = mongoose.model("bulkerrorupload", bulkerroruploadSchema);
