const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clienterrormonthamountSchema = new Schema({
    fromdate: {
        type: String,
        required: false,
    },
    todate: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    createdby: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("clienterrormonthamount", clienterrormonthamountSchema);