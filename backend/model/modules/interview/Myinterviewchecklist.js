const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MyCheckListSchema = new Schema({

    commonid: {
        type: String,
        required: false,
    },
    module: {
        type: String,
        required: false,
    },
    submodule: {
        type: String,
        required: false,
    },
    mainpage: {
        type: String,
        required: false,
    },
    subpage: {
        type: String,
        required: false,
    },
    subsubpage: {
        type: String,
        required: false,
    },


    category: {
        type: [String],
        required: false,
    },
    subcategory: {
        type: [String],
        required: false,
    },

    candidatename: {
        type: String,
        required: false,
    },

    status: {
        type: String,
        required: false,
    },


    longleaveabsentaprooveddatechecklist: {
        type: [String],
        required: false,
      },
    
    
    groups: [
        {
            category: {
                type: String,
                required: false,
            },
            checklist: {
                type: String,
                required: false,
            },
            details: {
                type: String,
                required: false,
            },
            information: {
                type: String,
                required: false,
            },
            subcategory: {
                type: String,
                required: false,
            },
            data: {
                type: String,
                required: false,
            },
            employee: {
                type: [String],
                required: false,
            },
            lastcheck: {
                type: Boolean,
                required: false,
            },
            completedby: {
                type: String,
                required: false,
            },
            completedat: {
                type: String,
                required: false,
            },
            files:
            {
                data: {
                    type: String,
                    required: false,
                },
                name: {
                    type: String,
                    required: false,
                },
                preview: {
                    type: String,
                    required: false,
                },
                remark: {
                    type: String,
                    required: false,
                },
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
module.exports = mongoose.model("mychecklist", MyCheckListSchema);