const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StockSchema = new Schema({



    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: false,
    },
    companyto: {
        type: String,
        required: false,
    },
    branchto: {
        type: String,
        required: false,
    },
    unitto: {
        type: String,
        required: false,
    },
    employeenameto: {
        type: String,
        required: false,
    },
    handover: {
        type: String,
        required: false,
    },
    totalbillamount: {
        type: String,
        required: false,
    },
    duedate: {
        type: String,
        required: false,
    },
    floor: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    area: {
        type: String,
        required: false,
    },
    workstation: {
        type: String,
        required: false,
    },

    department: {
        type: String,
        required: false,
    },
    workcheck: {
        type: Boolean,
        required: false,
    },
    responsibleteam: {
        type: String,
        required: false,
    },
    responsibleperson: {
        type: String,
        required: false,
    },

    asset: {
        type: String,
        required: false,
    },
    material: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: false,
    },
    countquantity: {
        type: String,
        required: false,
    },
    materialcountcode: {
        type: String,
        required: false,
    },
    count: {
        type: String,
        required: false,
    },
    rate: {
        type: String,
        required: false,
    },
    overallrate: {
        type: Boolean,
        required: false,
    },

    warranty: {
        type: String,
        required: false,
    },
    estimation: {
        type: String,
        required: false,
    },
    vendorid: {
        type: String,
        require: false,
    },
    phonenumber: {
        type: String,
        require: false,
    },
    address: {
        type: String,
        require: false,
    },
    estimationtime: {
        type: String,
        required: false,
    },
    warrantycalculation: {
        type: String,
        required: false,
    },
    purchasedate: {
        type: String,
        required: false,
    },
    vendorgroup: {
        type: String,
        required: false,
    },
    vendor: {
        type: String,
        required: false,
    },
    customercare: {
        type: String,
        required: false,
    },
    stockcode: {
        type: String,
        required: false,
    },
    assettype: {
        type: String,
        required: false,
    },
    producthead: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    usagetime: {
        type: String,
        required: false,
    },
    usagedate: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    component: {
        type: String,
        required: false,
    },
    team: {
        type: String,
        required: false,
    },
    productname: {
        type: String,
        required: false,
    },

    usercompany: {
        type: String,
        required: false,
    },
    userbranch: {
        type: String,
        required: false,
    },
    userunit: {
        type: String,
        required: false,
    },

    userfloor: {
        type: String,
        required: false,
    },
    userarea: {
        type: String,
        required: false,
    },
    userlocation: {
        type: String,
        required: false,
    },
    userteam: {
        type: String,
        required: false,
    },
    useremployee: {
        type: String,
        required: false,
    },

    productdetails: {
        type: String,
        required: false,
    },
    warrantydetails: {
        type: String,
        required: false,
    },
    uom: {
        type: String,
        required: false,
    },
    billdate: {
        type: String,
        required: false,
    },


    requestmode: {
        type: String,
        require: false,
    },
    stockcategory: {
        type: String,
        require: false,
    },
    stocksubcategory: {
        type: String,
        require: false,
    },
    quantity: {
        type: String,
        require: false,
    },
    returnqty: {
        type: String,
        require: false,
    },

    billno: {
        type: String,
        require: false,
    },
    gstno: {
        type: String,
        require: false,
    },


    stockmaterialarray: [
        {
            totalbillamount: {
                type: String,
                required: false,
            },
            uomnew: {
                type: String,
                required: false,
            },
            quantitynew: {
                type: String,
                required: false,
            },
            materialnew: {
                type: String,
                required: false,
            },
            productdetailsnew: {
                type: String,
                require: false,
            },
            uomcodenew: {
                type: String,
                require: false,
            },
        },
    ],

    subcomponent: [
        {
            sub: {
                type: String,
                required: false,
            },
            subname: {
                type: String,
                required: false,
            },
            subcomponentcheck: {
                type: Boolean,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            model: {
                type: String,
                required: false,
            },
            size: {
                type: String,
                required: false,
            },
            variant: {
                type: String,
                required: false,
            },

            brand: {
                type: String,
                required: false,
            },

            serial: {
                type: String,
                required: false,
            },
            other: {
                type: String,
                required: false,
            },
            capacity: {
                type: String,
                required: false,
            },
            hdmiport: {
                type: String,
                required: false,
            },
            vgaport: {
                type: String,
                required: false,
            },
            dpport: {
                type: String,
                required: false,
            },
            usbport: {
                type: String,
                required: false,
            },
            paneltypescreen: {
                type: String,
                required: false,
            },
            resolution: {
                type: String,
                required: false,
            },
            connectivity: {
                type: String,
                required: false,
            },
            daterate: {
                type: String,
                required: false,
            },
            compatibledevice: {
                type: String,
                required: false,
            },
            outputpower: {
                type: String,
                required: false,
            },
            collingfancount: {
                type: String,
                required: false,
            },
            clockspeed: {
                type: String,
                required: false,
            },
            core: {
                type: String,
                required: false,
            },
            speed: {
                type: String,
                required: false,
            },
            frequency: {
                type: String,
                required: false,
            },
            output: {
                type: String,
                required: false,
            },
            ethernetports: {
                type: String,
                required: false,
            },
            distance: {
                type: String,
                required: false,
            },
            lengthname: {
                type: String,
                required: false,
            },
            slot: {
                type: String,
                required: false,
            },
            noofchannels: {
                type: String,
                required: false,
            },
            colours: {
                type: String,
                required: false,
            },
            warranty: {
                type: String,
                required: false,
            },
            estimation: {
                type: String,
                required: false,
            },
            vendorid: {
                type: String,
                require: false,
            },
            phonenumber: {
                type: String,
                require: false,
            },
            address: {
                type: String,
                require: false,
            },
            estimationtime: {
                type: String,
                required: false,
            },
            warrantycalculation: {
                type: String,
                required: false,
            },
            purchasedate: {
                type: String,
                required: false,
            },
            vendorgroup: {
                type: String,
                required: false,
            },
            vendor: {
                type: String,
                required: false,
            },
            code: {
                type: String,
                required: false,
            },
            countquantity: {
                type: String,
                required: false,
            },
            rate: {
                type: String,
                required: false,
            },
        },
    ],

    files: [
        {
            base64: {
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
            size: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
        },
    ],

    warrantyfiles: [
        {
            base64: {
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
            size: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
        },
    ],

    filesusagecount: [
        {
            base64: {
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
            size: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            remarks: {
                type: String,
                required: false,
            },
        },
    ],
    filenames: {
        type: [String],
        required: false,
    },
    filenamesbill: {
        type: [String],
        required: false,
    },
    uniqueId: {
        type: String,
        required: false,
    },


    paidstatus: {
        type: String,
        required: false,
    },
    paidmode: {
        type: String,
        required: false,
    },
    paidamount: {
        type: Number,
        required: false,
    },
    balanceamount: {
        type: Number,
        required: false,
    },
    expensetotal: {
        type: String,
        required: false,
    },
    billstatus: {
        type: String,
        required: false,
    },
    bankname: {
        type: String,
        required: false,
    },
    bankbranchname: {
        type: String,
        required: false,
    },
    accountholdername: {
        type: String,
        required: false,
    },
    accountnumber: {
        type: String,
        required: false,
    },
    ifsccode: {
        type: String,
        required: false,
    },
    upinumber: {
        type: String,
        required: false,
    },
    cardnumber: {
        type: String,
        required: false,
    },
    cardholdername: {
        type: String,
        required: false,
    },
    cardtransactionnumber: {
        type: String,
        required: false,
    },
    cardtype: {
        type: String,
        required: false,
    },
    cardmonth: {
        type: String,
        required: false,
    },
    cardyear: {
        type: String,
        required: false,
    },
    cardsecuritycode: {
        type: String,
        required: false,
    },
    chequenumber: {
        type: String,
        required: false,
    },
    cash: {
        type: String,
        required: false,
    },



    tododetails: [
        {
            particularmode: {
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
            materialnew: {
                type: String,
                required: false,
            },
            uomnew: {
                type: String,
                required: false,
            },
            productdetailsnew: {
                type: String,
                required: false,
            },
            rate: {
                type: String,
                required: false,
            },
            quantitynew: {
                type: String,
                required: false,
            },
            amount: {
                type: String,
                required: false,
            },


        },
    ],

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            empname: {
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
},

    { strict: false }



);
StockSchema.index({ company: 1, branch: 1, unit: 1, requestmode: 1 })
StockSchema.index({ company: 1, branch: 1, unit: 1 })
StockSchema.index({ company: 1, branch: 1, unit: 1 })
StockSchema.index({ company: 1, branch: 1, unit: 1 })
StockSchema.index({ requestmode: 1 })
StockSchema.index({ status: 1 })
StockSchema.index({ handover: 1 })
StockSchema.index({ employeenameto: 1, handover: 1 })
StockSchema.index({ productname: 1, branch: 1, producthead: 1 })
StockSchema.index({ productname: 1, requestmode: 1, handover: 1 })
StockSchema.index({ status: 1, handover: 1, requestmode: 1, productname: 1, company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1 })
StockSchema.index({ company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, requestmode: 1, handover: 1 })
StockSchema.index({ company: 1, branch: 1, unit: 1, requestmode: 1, handover: 1 })




module.exports = mongoose.model("Stock", StockSchema);