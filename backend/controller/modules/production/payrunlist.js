const PayrunList = require("../../../model/modules/production/payrunlist");
const ProductionDay = require('../../../model/modules/production/productionday');
const DayPointsUpload = require("../../../model/modules/production/dayPointsUpload");
const DaypointsUploadTemp = require('../../../model/modules/production/daypointsuploadtemp')
const ProductionDayTemp = require("../../../model/modules/production/productiondaytemp")

const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All payrunlist => /api/payrunlist
exports.getAllPayrunList = catchAsyncErrors(async (req, res, next) => {
    let payrunlists;
    try {
        payrunlists = await PayrunList.find({}, { department: 1, empcount: 1, generatedon: 1, month: 1, year: 1, from: 1, to: 1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!payrunlists) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payrunlists,
    });
});

// get All payrunlist => /api/payrunlist
exports.getAllPayrunListLimited = catchAsyncErrors(async (req, res, next) => {
    let payrunlists;
    try {
        // payrunlist = await PayrunList.find({}, { department: 1, empcount: 1, generatedon: 1, month: 1, year: 1, from: 1, to: 1 });

        payrunlists = await PayrunList.aggregate([
            {
                $project: {
                    department: 1,
                    empcount: 1,
                    generatedon: 1,
                    month: 1,
                    year: 1,
                    from: 1,
                    to: 1,
                    data: {
                        ctc: 1,
                        fixedctc: 1,
                        prodctc: 1,
                        salarytype: 1,
                        deductiontype: 1,
                        pfdeduction: 1,
                        esideduction: 1,
                        fixedemppf: 1,

                        professionaltax: 1,
                        fixedempptax: 1,
                        prodempptax: 1,

                        fixedempesi: 1,
                        prodemppf: 1,
                        prodempesi: 1

                    }
                }
            }
        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!payrunlists) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payrunlists,
    });
});


// Create new payrunlist=> /api/payrunlist/new
exports.addPayrunList = catchAsyncErrors(async (req, res, next) => {
    console.log("add")
    let apayrunlist = await PayrunList.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle payrunlist => /api/payrunlist/:id
exports.getSinglePayrunList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spayrunlist = await PayrunList.findById(id);

    if (!spayrunlist) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({
        spayrunlist,
    });
});

// update payrunlist by id => /api/payrunlist/:id
exports.updatePayrunList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upayrunlist = await PayrunList.findByIdAndUpdate(id, req.body);
    if (!upayrunlist) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete payrunlist by id => /api/payrunlist/:id
exports.deletePayrunList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpayrunlist = await PayrunList.findByIdAndRemove(id);

    if (!dpayrunlist) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// update ProductionUpload by id => /api/productionupload/:id
exports.updatePayrunListInnerData = catchAsyncErrors(async (req, res, next) => {

    const { inid, outerId, month, value, year, date, fieldName } = req.body; // Extract the inner ID, month, value, year, date, and dynamic field name from the request body

    // Construct the dynamic field path
    const fieldPath = `data.$[outerElem].${fieldName}`;
    console.log(fieldPath, req.body, 'fieldPath')
    const update = {
        $push: {
            [fieldPath]: { month, value, year, date }
        }
    };


    const options = {
        arrayFilters: [
            { "outerElem._id": inid } // Filter for the correct inner ID
        ],
        new: true
    };


    let upayrunlist = await PayrunList.findOneAndUpdate(
        { _id: outerId },
        update,
        options
    );


    if (!upayrunlist) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully", upayrunlist });
});

exports.undoPayrunListInnerData = catchAsyncErrors(async (req, res, next) => {

    const { inid, outerId, fieldName } = req.body; // Extract the inner ID, month, value, year, date, and dynamic field name from the request body

    // Construct the dynamic field path
    const fieldPath = `data.$[outerElem].${fieldName}`;

    const update = {
        $set: {
            [fieldPath]: []
        }
    };


    const options = {
        arrayFilters: [
            { "outerElem._id": inid } // Filter for the correct inner ID
        ],
        new: true
    };


    let upayrunlist = await PayrunList.findOneAndUpdate(
        { _id: outerId },
        update,
        options
    );


    if (!upayrunlist) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully", data: upayrunlist });
});
exports.checkPayRunIsCreated = catchAsyncErrors(async (req, res, next) => {

    let payrunlist;
    try {
        const { department, month, year } = req.body
        // console.log(req.body)
        payrunlist = await PayrunList.find({ department: department, month: month, year: year }, { department: 1, empcount: 1, generatedon: 1, month: 1, year: 1, from: 1, to: 1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!payrunlist) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payrunlist,
    });
});


exports.updateInnerDataSingleUserRerun = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, updateData } = req.body;
    console.log(outerId, innerId)

    // Update the nested array element using array filters
    let user = await PayrunList.findOneAndUpdate(
        { _id: outerId, "data._id": innerId }, // Find the document with outerId and where data._id matches innerId
        { $set: { "data.$": updateData } }, // Set the matched array element to updateData
        { new: true } // Return the updated document
    );

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});


exports.updateInnerDataSingleUserWaiver = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, waiver, lossdeductionfinal, otherdeduction, lossdeductionischanged, salarytypefinal, deductiontypefinal } = req.body;
    console.log(req.body, req.body.salarytypefinal, 'tet')

    // Update the nested array element using array filters
    let user = await PayrunList.findOneAndUpdate(
        { _id: outerId, "data._id": innerId }, // Find the document with outerId and where data._id matches innerId
        {
            $set: {
                "data.$.waiver": waiver,
                "data.$.salarytypefinal": salarytypefinal,
                "data.$.deductiontypefinal": deductiontypefinal,
                "data.$.lossdeductionischanged": "Yes",
                "data.$.lossdeductionfinal": lossdeductionfinal,
                "data.$.otherdeduction": otherdeduction,
            }
        }, // Set the matched array element to updateData
        { new: true } // Return the updated document
    );

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});

exports.payRunListSentSalaryFixDate = catchAsyncErrors(async (req, res, next) => {
    const { outerId } = req.body;
    console.log(req.body, 'sentfix')

    // Update the nested array element using array filters
    let user = await PayrunList.findOneAndUpdate(
        { _id: outerId },
        {
            $set: {
                "data.$[].sentfixsalary": "Yes"

            }
        }, // Set the matched array element to updateData
        { new: true } // Return the updated document
    );

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});


// get All payrunlist => /api/payrunlist
exports.fetchPayRunListDataMonthwise = catchAsyncErrors(async (req, res, next) => {
    let payrunlists;
    try {
        const { month, year } = req.body
        console.log(req.body, 'req.body')
        payrunlists = await PayrunList.find({ month: month, year: year }, { data: 1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!payrunlists) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payrunlists,
    });
});


exports.confirmFixSalaryDate = catchAsyncErrors(async (req, res, next) => {
    // const { outerId, innerId, updatedpaidstatus, updatechangedate, updatedholdpercent, paydate, updatedreason, payonsalarytype, finalusersalary } = req.body;
    const { outerId, innerId, logdata } = req.body;
    console.log(outerId, innerId, 'confirm')
    let user;
    try {
        // Update the nested array element using array filters
        user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId }, // Find the document with outerId and where data._id matches innerId
            {

                $set: {
                    "data.$.logdata": logdata,
                    "data.$.fixsalarydateconfirm": "Yes",
                }
            }, // Set the matched array element to updateData
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.log(err.message);
    }

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});

exports.confirmFixHoldSalaryDate = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logdata, logid } = req.body;
    console.log(req.body.outerId, req.body.innerId, 'hold');

    let user = await PayrunList.findOneAndUpdate(
        { _id: outerId, "data._id": innerId },
        {
            $set: {

                "data.$.fixholdsalarydateconfirm": "Yes",
            },
            $push: {
                "data.$.logdata": { $each: logdata }
            }
        },
        { new: true } // Return the updated document
    );
    let userUpdate = await PayrunList.findOneAndUpdate(
        { _id: outerId, "data._id": innerId, "data.logdata._id": logid },
        {
            $set: {
                "data.$[innerElem].logdata.$[logElem].holdsalaryconfirm": "Confirmed",
            },
        },
        {
            arrayFilters: [
                { "innerElem._id": innerId },
                { "logElem._id": logid }
            ],
            new: true // Return the updated document
        }
    );

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});

exports.confirmFixHoldSalaryLogUpdate = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logid, holdsalaryconfirm } = req.body;
    console.log(req.body.outerId, req.body.innerId, 'hold');

    try {
        let user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, "data.logdata._id": logid },
            {
                $set: {
                    "data.$[innerElem].logdata.$[logElem].holdsalaryconfirm": holdsalaryconfirm,
                },
            },
            {
                arrayFilters: [
                    { "innerElem._id": innerId },
                    { "logElem._id": logid }
                ],
                new: true // Return the updated document
            }
        );

        if (!user) {
            return next(new ErrorHandler("Data not found!", 404));
        }

        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});




exports.undoFieldNameConfirmListFix = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId } = req.body;
    console.log(req.body, 'sdf')
    let user = await PayrunList.findOneAndUpdate(
        { _id: outerId, "data._id": innerId },
        {
            $unset: {
                "data.$.logdata": "",
                "data.$.fixsalarydateconfirm": "",
                "data.$.fixholdsalarydateconfirm": "",
            }
        },

    );

    if (!user) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});


exports.fixHoldSalaryReject = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logid, rejectreason } = req.body;
    console.log(req.body, 'reject');
    let user;
    try {
        user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, "data.logdata._id": logid },
            {
                $set: {
                    "data.$[innerElem].logdata.$[logElem].holdreleaseconfirm": "Rejected",
                    "data.$[innerElem].logdata.$[logElem].rejectreason": rejectreason,
                },
            },
            {
                arrayFilters: [
                    { "innerElem._id": innerId },
                    { "logElem._id": logid }
                ],
                new: true // Return the updated document
            }
        );

        if (!user) {
            return next(new ErrorHandler("Data not found!", 404));
        }

        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateRemoveReject = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logid, matchid } = req.body;
    console.log(req.body, 'reject');
    let user;
    try {
        user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, },
            {
                $pull: {
                    "data.$.logdata": { _id: logid }
                }
            },
            {

                new: true // Return the updated document
            }
        );
        let userUpdate = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, "data.logdata._id": matchid },
            {
                $set: {
                    "data.$[innerElem].logdata.$[logElem].holdreleaseconfirm": "",
                    "data.$[innerElem].logdata.$[logElem].holdsalaryconfirm": "No",
                },
            },
            {
                arrayFilters: [
                    { "innerElem._id": innerId },
                    { "logElem._id": matchid }
                ],
                new: true // Return the updated document
            }
        );

        if (!user) {
            return next(new ErrorHandler("Data not found!", 404));
        }

        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.confirmHoldReleaseSave = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logid, logdata, } = req.body;
    console.log(req.body.logid, 'reject');
    let user;
    try {
        user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, "data.logdata._id": logid },
            {
                $set: {
                    "data.$[innerElem].logdata.$[logElem].holdreleaseconfirm": "Approved",
                    "data.$[innerElem].logdata.$[logElem].holdsalaryconfirm": "Yes",
                    "data.$[innerElem].logdata.$[logElem].rejectreason": "",
                },
            },
            {
                arrayFilters: [
                    { "innerElem._id": innerId },
                    { "logElem._id": logid }
                ],
                new: true // Return the updated document
            }
        );

        let userNew = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId },
            {

                $push: {
                    "data.$.logdata": { $each: logdata }
                }
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            return next(new ErrorHandler("Data not found!", 404));
        }

        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.confirmConsolidatedReleaseSave = catchAsyncErrors(async (req, res, next) => {
    const { outerId, innerId, logid } = req.body;

    let user;
    try {
        user = await PayrunList.findOneAndUpdate(
            { _id: outerId, "data._id": innerId, "data.logdata._id": logid },
            {
                $set: {
                    "data.$[innerElem].logdata.$[logElem].bankreleasestatus": "closed",
                },
            },
            {
                arrayFilters: [
                    { "innerElem._id": innerId },
                    { "logElem._id": logid }
                ],
                new: true
            }
        );

        if (!user) {
            return next(new ErrorHandler("Data not found!", 404));
        }

        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getBankReleasePayrunListMonthwise = catchAsyncErrors(async (req, res, next) => {
    const { month, year } = req.body;
    let payrunlists;
    try {
        let query = {
            month: month,
            year: year
        }

        payrunlists = await PayrunList.find(query, { data: 1 });

        return res.status(200).json({ payrunlists });
    }

    catch (err) {

        console.log(err.message);
    }
});


exports.updateBankReleaseClose = catchAsyncErrors(async (req, res, next) => {
    const { ids, bankstatus, status } = req.body;
    console.log(ids, 'ids')

    const filter = {
        $or: ids.map(id => ({
            _id: id.outerId,
            "data._id": id.innerId,
            "data.logdata._id": id.logid
        }))
    };

    const update = {
        $set: {
            "data.$[innerElem].logdata.$[logElem].bankreleasestatus": bankstatus,
            "data.$[innerElem].logdata.$[logElem].bankclose": status
        }
    };

    const arrayFilters = [
        { "innerElem._id": { $in: ids.map(id => id.innerId) } },
        { "logElem._id": { $in: ids.map(id => id.logid) } }
    ];

    try {
        await PayrunList.updateMany(filter, update, { arrayFilters });
        return res.status(200).json({ msg: "Success" });
    } catch (error) {
        console.error('Bulk update error:', error);
    }

});


// exports.updateBankReleaseClose = catchAsyncErrors(async (req, res, next) => {
//     const { ids } = req.body;
//     console.log(ids, 'ids');

//     try {
//         const bulkOps = ids.map(({ outerId, innerId, logid }) => ({

//             updateOne: {
//                 filter: {
//                     _id: outerId,
//                     "data._id": innerId,
//                     "data.logdata._id": logid
//                 },
//                 update: {
//                     $set: {
//                         "data.$[outerElem].logdata.$[logElem].bankclose": "closed"
//                     }
//                 },
//                 arrayFilters: [
//                     { "outerElem._id": innerId },
//                     { "logElem._id": logid }
//                 ],
//                 new: true
//             }
//         }));

//         // Execute the bulk operations
//         const result = await PayrunList.bulkWrite(bulkOps);
//         console.log(result, 'result');

//         // Check if all operations were successful
//         if (result.modifiedCount !== ids.length) {
//             return next(new ErrorHandler("Some updates failed or data not found!", 404));
//         }

//         return res.status(200).json({ message: "All records updated successfully" });
//     } catch (error) {
//         console.log(error);
//         return next(new ErrorHandler(error.message, 500));
//     }
// });


// exports.updateBankReleaseClose = catchAsyncErrors(async (req, res, next) => {

//     const { ids } = req.body;
//     console.log(ids, 'ids')

//     const bulkOps = ids.map(id => ({

//         updateOne: {
//             filter: {
//                 _id: id.outerId,
//                 "data._id": id.innerId,
//                 "data.olgdata._id": id.logid
//             },
//             update: {
//                 $set: {
//                     "data.$[innerElem].logdata.$[logElem].bankclose": "closed",
//                 }
//             },
//             arrayFilters: [
//                 { "innerElem._id": id.innerId },
//                 { "logElem._id": id.logid }
//             ]
//         }

//     }));

//     // Perform bulk write operation
//     try {
//         const result = await PayrunList.bulkWrite(bulkOps, { ordered: false });
//         console.log('Bulk update successful:', result);
//     } catch (error) {
//         console.error('Bulk update error:', error);
//     }
// });





// get All payruncontrol => /api/payruncontrol
exports.deletePayrunBulkData = catchAsyncErrors(async (req, res, next) => {
    let payruncontrol;
    try {
        payruncontrol = await PayrunList.deleteMany({ _id: { $in: req.body.ids } });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!payruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payruncontrol,
    });
});

// get All payruncontrol => /api/payruncontrol
exports.getPayrunBulkDataExcel = catchAsyncErrors(async (req, res, next) => {
    let payruncontrol;
    try {
        payruncontrol = await PayrunList.find({ _id: { $in: req.body.ids } }, { data: 1, month: 1, year: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!payruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payruncontrol,
    });
});


exports.getAllPayrunListConsolidatedDate = catchAsyncErrors(async (req, res, next) => {
    let payrunlists, daypoints, productionday, count;
    try {

        const query = {
            from: { $lte: req.body.to }, // Start date of the range is before or equal to the end date of the query
            to: { $gte: req.body.from }  // End date of the range is after or equal to the start date of the query
        };
        // console.log(query, "po");
        const productiondayquery = {
            date: { $gte: req.body.from, $lte: req.body.to },
        }

        payrunlists = await PayrunList.countDocuments(query);
        productionday = await ProductionDay.countDocuments(productiondayquery);
        daypoints = await DayPointsUpload.countDocuments(productiondayquery);


        count = payrunlists + productionday + daypoints

        // console.log(payrunlists, "payrunlists")
    } catch (err) {
        console.log(err);
    }
    // if (!payrunlists) {
    //     return next(new ErrorHandler("PayrunList not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,


        count,
        payrunlists,
        productionday,
        daypoints


    });
});


exports.getAllPayrunListConsolidatedDateTemp = catchAsyncErrors(async (req, res, next) => {
    let payrunlists, daypoints, productionday, count;
    try {

        const query = {
            from: { $lte: req.body.to }, // Start date of the range is before or equal to the end date of the query
            to: { $gte: req.body.from }  // End date of the range is after or equal to the start date of the query
        };
        // console.log(query, "po");
        const productiondayquery = {
            date: { $gte: req.body.from, $lte: req.body.to },
        }

        payrunlists = await PayrunList.countDocuments(query);
        productionday = await ProductionDayTemp.countDocuments(productiondayquery);
        daypoints = await DaypointsUploadTemp.countDocuments(productiondayquery);


        count = payrunlists + productionday + daypoints

        // console.log(payrunlists, "payrunlists")
    } catch (err) {
        console.log(err);
    }
    // if (!payrunlists) {
    //     return next(new ErrorHandler("PayrunList not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,


        count,
        payrunlists,
        productionday,
        daypoints


    });
});


// check payrun is generated or not for penalty day upload
exports.checkPayRunIsCreatedForPenaltyDayUpload = catchAsyncErrors(async (req, res, next) => {
    let payrunlist;
    try {
        const { date } = req.body;
        payrunlist = await PayrunList.find({ from: { $lte: date }, to: { $gte: date } }, { department: 1, empcount: 1, generatedon: 1, month: 1, year: 1, from: 1, to: 1 });
    } catch (err) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    if (!payrunlist) {
        return next(new ErrorHandler("PayrunList not found!", 404));
    }
    return res.status(200).json({ payrunlist });
});

exports.checkIsPayRunGeneratedFromTo = catchAsyncErrors(async (req, res, next) => {
    let count;
    try {
        const { fromdate, todate } = req.body;
        let query = {
            $or: [
                { from: { $lte: todate }, to: { $gte: fromdate } }, // Overlapping ranges
            ],
        };
        const dateformatted = new Date(todate);
        let payruncontrols = await PayrunList.find(query, { from: 1, to: 1, createdAt: 1 });

        // let payruncontrols = await PayrunList.find({ from: { $lte: date }, to: { $gte: date } }, { from: 1, to: 1, createdAt: 1 });

        count = payruncontrols.filter((item) => {
            let todate = new Date(item.to) > new Date(item.createdAt?.toISOString().split("T")[0]) ? new Date(item.createdAt?.toISOString().split("T")[0]) : new Date(item.to);
            //  console.log(new Date(item.from) <= new Date(fromdate), todate >= dateformatted, "fate");
            if (new Date(item.from) <= new Date(fromdate) && todate >= dateformatted) {
                return item;
            }
        }).length;
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        count,
    });
});
