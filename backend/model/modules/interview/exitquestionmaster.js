const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exitQuestionSchema = new Schema({
    question: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    questiontype: {
        type: String,
        required: false,
    },

    optionArr: [
        {
            status: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            options: {
                type: String,
                required: false,
            },
        },
    ],
    answers: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    documentFiles: [
        {
            data: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            preview: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            },

        }
    ],
    dateRangefrom: {
        type: String,
        required: false,
    },
    dateRangeto: {
        type: String,
        required: false,
    },
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
module.exports = mongoose.model(
    "exitinterviewquestion",
    exitQuestionSchema
);