const ErrorMode = require("../../../model/modules/penalty/errormode");
const BulkErrorUploadpoints = require("../../../model/modules/penalty/bulkerrorupload");
const PenaltyErrorUploadpoints = require("../../../model/modules/penalty/penaltyerrorupload");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ErrorMode Name => /api/ErrorMode
exports.getAllErrorMode = catchAsyncErrors(async (req, res, next) => {
    let errormodes;
    try {
        errormodes = await ErrorMode.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!errormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        errormodes,
    });
});

// Create new ErrorMode=> /api/ErrorMode/new
exports.addErrorMode = catchAsyncErrors(async (req, res, next) => {
    let aErrorMode = await ErrorMode.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle ErrorMode => /api/ErrorMode/:id
exports.getSingleErrorMode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let serrormodes = await ErrorMode.findById(id);

    if (!serrormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({
        serrormodes,
    });
});

// update ErrorMode by id => /api/ErrorMode/:id
exports.updateErrorMode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uerrormodes = await ErrorMode.findByIdAndUpdate(id, req.body);
    if (!uerrormodes) {
        return next(new ErrorHandler("ErrorMode not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete ErrorMode by id => /api/ErrorMode/:id
exports.deleteErrorMode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let derrormodes = await ErrorMode.findByIdAndRemove(id);

    if (!derrormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// get All ErrorMode Name => /api/ErrorMode
exports.ErrorModeUnallotList = catchAsyncErrors(async (req, res, next) => {
    let errormodes;
    try {
        const { project, process } = req.body;

        errormodes = await BulkErrorUploadpoints.aggregate([
            {
                $match: {
                    projectvendor: { $in: project },
                    process: { $in: process },
                },
            },

            {
                // Final grouping to remove duplicates across both collections
                $group: {
                    _id: {
                        projectvendor: "$projectvendor",
                        process: "$process",
                        fieldname: "$fieldname",
                    },
                    // Store the first _id found in this group
                    firstId: { $first: "$_id" }, // Capture the first _id value from the grouped documents
                },
            },
            {
                // Project the final result
                $project: {
                    projectvendor: "$_id.projectvendor",
                    process: "$_id.process",
                    fieldname: "$_id.fieldname",
                    _id: "$firstId", // Retrieve the _id value stored earlier
                },
            },

            {
                // Use $unionWith to combine results from BulkErrorUploadpoints and PenaltyErrorupload
                $unionWith: {
                    coll: "penaltyerroruploads", // the second collection to merge
                    pipeline: [
                        {
                            $match: {
                                projectvendor: { $in: project },
                                process: { $in: process },
                            },
                        },
                        {
                            $lookup: {
                                from: "penaltyerrormodes", // collection name for ErrorMode
                                let: { projectvendor: "$projectvendor", process: "$process", fieldname: "$fieldname" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [{ $eq: ["$projectvendor", "$$projectvendor"] }, { $eq: ["$process", "$$process"] }, { $eq: ["$fieldname", "$$fieldname"] }],
                                            },
                                        },
                                    },
                                ],
                                as: "errormodeMatch",
                            },
                        },
                        {
                            // Final grouping to remove duplicates across both collections
                            $group: {
                                _id: {
                                    projectvendor: "$projectvendor",
                                    process: "$process",
                                    fieldname: "$fieldname",
                                },
                                // Store the first _id found in this group
                                firstId: { $first: "$_id" }, // Capture the first _id value from the grouped documents
                            },
                        },
                        {
                            // Project the final result
                            $project: {
                                projectvendor: "$_id.projectvendor",
                                process: "$_id.process",
                                fieldname: "$_id.fieldname",
                                _id: "$firstId", // Retrieve the _id value stored earlier
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "penaltyerrormodes", // collection name for ErrorMode
                    let: { projectvendor: "$projectvendor", process: "$process", fieldname: "$fieldname" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$projectvendor", "$$projectvendor"] }, { $eq: ["$process", "$$process"] }, { $eq: ["$fieldname", "$$fieldname"] }],
                                },
                            },
                        },
                    ],
                    as: "errormodeMatch",
                },
            },
            {
                $match: {
                    errormodeMatch: { $size: 0 },
                },
            },

            {
                // Final grouping to remove duplicates across both collections
                $group: {
                    _id: {
                        projectvendor: "$projectvendor",
                        process: "$process",
                        fieldname: "$fieldname",
                    },
                    // Store the first _id found in this group
                    firstId: { $first: "$_id" }, // Capture the first _id value from the grouped documents
                },
            },
            {
                // Project the final result
                $project: {
                    projectvendor: "$_id.projectvendor",
                    process: "$_id.process",
                    fieldname: "$_id.fieldname",
                    _id: "$firstId", // Retrieve the _id value stored earlier
                },
            },
        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!errormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        errormodes,
    });
});

// get All ErrorMode Name => /api/ErrorMode
exports.ErrorModeAllotedList = catchAsyncErrors(async (req, res, next) => {
    let errormodes;
    try {
        const { project, process } = req.body;
        errormodes = await ErrorMode.find({ projectvendor: { $in: project }, process: { $in: process } }, { projectvendor: 1, process: 1, fieldname: 1, rate: 1, mode: 1 });
        console.log(errormodes.length);
    } catch (err) {
        console.log(err.message);
    }
    if (!errormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        errormodes,
    });
});

exports.getOrginData = catchAsyncErrors(async (req, res, next) => {
    let errormodes;
    try {
        const { project, process, fieldname } = req.body;
        let errormodesAllSingle = await PenaltyErrorUploadpoints.find(
            { projectvendor: project, process: process, fieldname: fieldname },
            {
                projectvendor: 1,
                dateformatted: 1,
                errorfilename: 1,
                documenttype: 1,
                date: 1,
                line: 1,
                mode: 1,
                errorvalue: 1,
                correctvalue: 1,
                link: 1,
                doclink: 1,
                filename: 1,
                documentnumber: 1,
                loginid: 1,
                process: 1,
                fieldname: 1,
            }
        );
        let errormodesAll = await BulkErrorUploadpoints.find(
            { projectvendor: project, process: process, fieldname: fieldname },
            {
                projectvendor: 1,
                dateformatted: 1,
                errorfilename: 1,
                documenttype: 1,
                mode: 1,
                date: 1,
                line: 1,
                errorvalue: 1,
                correctvalue: 1,
                link: 1,
                doclink: 1,
                filename: 1,
                documentnumber: 1,
                loginid: 1,
                process: 1,
                fieldname: 1,
            }
        );
        const userids = [...new Set(errormodesAll.map((item) => item.loginid))];
        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted", userid: { $in: userids } }, {});

        errormodes = [...errormodesAll, ...errormodesAllSingle].map((upload) => {
            const loginInfo = loginids.find((login) => login.userid === upload.loginid && login.projectvendor == upload.projectvendor);
            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};
                // Group items by date and time
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                });

                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date} ${lastItemsForEachDateTime[i].time}`;
                    // let datevalsplit = upload.mode == "Manual" ? upload.fromdate : upload.dateval.split(" ");
                    let datevalsplitfinal = upload.mode == "Bulkupload" ? upload.dateformatted : upload.date;

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break; // Break the loop if we encounter an item with date and time greater than or equal to selectedDateTime
                    }
                }
            }
            // console.log(filteredDataDateTime, 'filteredDataDateTime')
            let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
            let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

            return {
                ...upload._doc,
                name: logininfoname,
                user: upload.loginid,
                date: upload.date,
                mode: upload._doc.mode && upload._doc.mode == "Bulkupload" ? "Bulkupload" : "Individual",
                branch: logininfobranch,
                unit: logininfounit,
            };
        });
    } catch (err) {
        console.log(err.message);
    }
    if (!errormodes) {
        return next(new ErrorHandler("ErrorMode  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        errormodes,
    });
});





exports.getAllErrorModeFilter = catchAsyncErrors(async (req, res, next) => {
    let errormodes;
    try {
        console.log(req.body, "errormode")
        errormodes = await ErrorMode.findOne({ projectvendor: req.body.projectvendor, process: req.body.process, fieldname: req.body.fieldname }, { mode: 1 });
        console.log(errormodes.length, "eleleleel")
    } catch (err) {
        console.log(err.message);
    }
    return res.status(200).json({
        // count: products.length,
        errormodes,
    });
});