// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const RoleandresponseSchema = new Schema({

//     category: {
//         type: Array,
//         required: false,
//     },
//     subcategory: {
//         type: Array,
//         required: false,
//     },
//     frequency: {
//         type: String,
//         required: false,
//     },
//     description: {
//         type: String,
//         required: false,
//     },
//     designation: {
//         type: [String],
//         required: false,
//     },
//     type: {
//         type: String,
//         required: false,
//     },
//     hour:{
//         type: String,
//         required: false,
//     },
//     min:{
//         type: String,
//         require: false,
//     },
//     timetype:{
//         type: String,
//         required: false,
//     },
//     date:{
//         type: String,
//         required: false,
//     },
//     days: {
//         type: [String],
//         required: false,
//     },
//     addedby: [
//         {
//             name: {
//                 type: String,
//                 required: false,
//             },
//             date: {
//                 type: String,
//                 required: false,
//             },
//         }],
//     updatedby: [
//         {
//             name: {
//                 type: String,
//                 required: false,
//             },
//             date: {
//                 type: String,
//                 required: false,
//             },
//         }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })
// module.exports = mongoose.model('Roleofresponse', RoleandresponseSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoleandresponseSchema = new Schema({

    category: {
        type: Array,
        required: false,
    },
    subcategory: {
        type: Array,
        required: false,
    },
    // frequency: {
    //     type: String,
    //     required: false,
    // },
    description: {
        type: String,
        required: false,
    },
    designation: {
        type: [String],
        required: false,
    },
    designationgroup: {
        type: [String],
        required: false,
    },
    // type: {
    //     type: String,
    //     required: false,
    // },
    // hour:{
    //     type: String,
    //     required: false,
    // },
    // min:{
    //     type: String,
    //     require: false,
    // },
    // timetype:{
    //     type: String,
    //     required: false,
    // },
    // date:{
    //     type: String,
    //     required: false,
    // },
    // days: {
    //     type: [String],
    //     required: false,
    // },
    roletodos: [
        {
    
            frequency: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            hour:{
                type: String,
                required: false,
            },
            min:{
                type: String,
                require: false,
            },
            timetype:{
                type: String,
                required: false,
            },
            date:{
                type: String,
                required: false,
            },
            days: {
                type: [String],
                required: false,
            },
        }],
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
        }],
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
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Roleofresponse', RoleandresponseSchema);