const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ResumemailAttachmentsSchema = new Schema({
    resumedoc: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    source:{
        type: String,
        required: false,
    },
    uploaddocfile: [
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
      ],
    attachments:{
        type: String,
        required: false,
    },
    candidateinfo:{
        type: String,
        required: false,
    },
    candidateinfodata:{
        type: String,
        required: false,
    },
    resumemailattachmentstatus:{
        type: String,
        required: false,
    },
    rejectedreason:{
        type: String,
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
module.exports = mongoose.model('Resumemailattachments',ResumemailAttachmentsSchema);