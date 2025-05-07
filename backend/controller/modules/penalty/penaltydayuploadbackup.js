const Penaltydayupload = require("../../../model/modules/penalty/penaltydayupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


// get All Penaltydayupload Name => /api/Penaltydayupload
exports.getAllPenaltydayupload = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;
    let penaltydayupload;
    try {
        penaltydayupload = await Penaltydayupload.find();

        penaltydayupload = penaltydayupload.map(doc => {
            // Filter the `uploaddata` array within the document
            const filteredUploadData = doc.uploaddata.filter(item =>
                assignbranch.some(branch =>

                    branch.company === item.company &&
                    branch.branch === item.branch &&
                    branch.unit === item.unit
                )
            );

            // If no items in `uploaddata` match, set `uploaddata` to an empty array
            if (filteredUploadData.length === 0) {
                return { ...doc._doc, uploaddata: [] };
            }

            // Otherwise, return the document with the filtered `uploaddata`
            return { ...doc._doc, uploaddata: filteredUploadData };
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltydayupload) {
        return next(new ErrorHandler("Penaltydayupload not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltydayupload,
    });
});

// get All Penaltydayupload Name => /api/Penaltydayupload
exports.getPenaltydayuploadLimited = catchAsyncErrors(async (req, res, next) => {
    let penaltydayupload, answer;
    try {
        //   penaltydayupload = await Penaltydayupload.find({},{uploaddata:1});
        //   answer = penaltydayupload.flatMap((data) =>
        //   data.uploaddata.filter(item => item).map((upload) => ({
        //     companyname: upload.companyname,
        //     name: upload.name,
        //     empcode: upload.empcode,
        //     branch: upload.branch,
        //     unit: upload.unit,
        //     team: upload.team,
        //     date: upload.date,
        //     amount: upload.amount,
        //     id: upload._id,
        //   }))
        // );
        const { ismonth, isyear, } = req.body;

        const from_date = new Date(isyear, ismonth - 1, 1);

        // Calculate the last day of the previous month
        const last_day_prev_month = new Date(from_date.getFullYear(), from_date.getMonth(), 0);

        // Get the 15th day of the previous month
        const before_month_date = new Date(last_day_prev_month.getFullYear(), last_day_prev_month.getMonth(), 20);

        // Get the 15th day of the next month
        const next_month = new Date(from_date.getFullYear(), from_date.getMonth() + 1, 10);

        let fromdate = before_month_date.toISOString().split('T')[0];
        let todate = next_month.toISOString().split('T')[0];

        const conditions = [];

        if (fromdate && todate) {
            conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
        }


        const cond = {
            $and: conditions,
        };

        // daypointsupload = await Penaltydayupload.aggregate([
        //   {
        //     $project: {
        //       uploaddata: {
        //         $filter: {
        //           input: "$uploaddata",
        //           as: "upload",
        //           cond: cond,
        //         },
        //       },
        //     },
        //   },
        // ]);
        penaltydayupload = await Penaltydayupload.aggregate([
            {
                $project: {
                    // Specify the fields you want to include in the uploaddata array
                    uploaddata: {
                        $map: {
                            input: "$uploaddata",
                            as: "upload",
                            in: {
                                // Specify the fields you want to include
                                company: "$$upload.company",
                                name: "$$upload.name",
                                branch: "$$upload.branch",
                                unit: "$$upload.unit",
                                team: "$$upload.team",
                                empcode: "$$upload.empcode",
                                amount: "$$upload.amount",
                                date: "$$upload.date",
                                _id: "$$upload._id",
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    uploaddata: {
                        $filter: {
                            input: "$uploaddata",
                            as: "upload",
                            cond: cond,
                        },
                    },
                },
            },
        ]);

        answer = penaltydayupload.flatMap((data) => data.uploaddata);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltydayupload) {
        return next(new ErrorHandler("Penaltydayupload not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        answer,
    });
});

// Create new Penaltydayupload=> /api/Penaltydayupload/new
exports.addPenaltydayupload = catchAsyncErrors(async (req, res, next) => {
    let aPenaltydayupload = await Penaltydayupload.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle Penaltydayupload => /api/Penaltydayupload/:id
exports.getSinglePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltydayupload = await Penaltydayupload.findById(id);

    if (!spenaltydayupload) {
        return next(new ErrorHandler("Penaltydayupload not found!", 404));
    }
    return res.status(200).json({
        spenaltydayupload,
    });
});

// update Penaltydayupload by id => /api/Penaltydayupload/:id
exports.updatePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upenaltydayupload = await Penaltydayupload.findByIdAndUpdate(id, req.body);
    if (!upenaltydayupload) {
        return next(new ErrorHandler("Penaltydayupload not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// exports.updateDayPointsSingleUpload = catchAsyncErrors(
exports.updatePenaltydaySingleupload = catchAsyncErrors(
    async (req, res, next) => {
        const subid = req.params.id;
        req.body.id = subid;
        try {
            const uploaddata = await Penaltydayupload.findOneAndUpdate(
                { "uploaddata._id": subid },
                { $set: { "uploaddata.$": req.body } },
                { new: true }
            );

            if (uploaddata) {
                return res.status(200).json({ message: "Updated successfully" });
            } else {
                return next(new ErrorHandler("Something went wrong", 500));
            }
        } catch (err) {
            return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
        }
    }
);

// delete Penaltydayupload by id => /api/Penaltydayupload/:id
exports.deletePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltydayupload = await Penaltydayupload.findByIdAndRemove(id);

    if (!dpenaltydayupload) {
        return next(new ErrorHandler("Penaltydayupload not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});



exports.getAllPenaltydayuploadFilter = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch, fromdate, todate, company, branch, unit, team, employeenames } = req.body;
    let penaltydayuploadTesting;
    try {
        const pipeline = [
            {
                $match: {
                    date: {
                        $gte: fromdate, // Compare string format "YYYY-MM-DD"
                        $lte: todate,   // Compare string format "YYYY-MM-DD"
                    },
                    uploaddata: {
                        $elemMatch: {
                            ...(company?.length > 0 && { company: { $in: company } }), // Only include this condition if company is not empty
                            ...(branch?.length > 0 && { branch: { $in: branch } }),   // Only include this condition if branch is not empty
                            ...(unit?.length > 0 && { unit: { $in: unit } }),           // Only include this condition if unit is not empty
                            ...(team?.length > 0 && { team: { $in: team } }),           // Only include this condition if team is not empty
                            ...(employeenames?.length > 0 && { name: { $in: employeenames } }), // Only include if employeename is not empty
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1, // Include `_id` or any other fields you want
                    date: 1, // Include `date` or other top-level fields
                    filename: 1,
                    document: 1,
                    uploaddata: {
                        $filter: {
                            input: "$uploaddata",
                            as: "item",
                            cond: {
                                $and: [
                                    ...(company?.length > 0 && { $in: ["$$item.company", company] }), // Only filter if company is not empty
                                    ...(branch?.length > 0 && { $in: ["$$item.branch", branch] }),   // Only filter if branch is not empty
                                    ...(unit?.length > 0 && { $in: ["$$item.unit", unit] }),           // Only filter if unit is not empty
                                    ...(team?.length > 0 && { $in: ["$$item.team", team] }),           // Only filter if team is not empty
                                    ...(employeenames?.length > 0 && { $in: ["$$item.name", employeenames] }), // Only filter if employeename is not empty
                                ],
                            },
                        },
                    },
                },
            },
        ];



        // Execute the aggregation
        penaltydayuploadTesting = await Penaltydayupload.aggregate(pipeline);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!penaltydayupload) {
    //   return next(new ErrorHandler("Penaltydayupload not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        penaltydayuploadTesting
    });
});


exports.getAllPenaltydayuploadFilterList = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch, fromdate, todate } = req.body;
    let penaltydayupload, penaltydayuploadoverall;
    try {
        const pipeline = [
            {
                $match: {
                    date: {
                        $gte: fromdate,
                        $lte: todate,
                    },
                },
            },
            {
                $sort: {
                    date: -1, // -1 for descending order (latest first)
                },
            },
            {
                $project: {
                    _id: 1, // Include `_id` or any other fields you want
                    date: 1, // Include `date` or other top-level fields
                    uploaddata: 1,
                    filename: 1,
                    document: 1
                },
            },
        ];

        // Execute the aggregation
        penaltydayuploadoverall = await Penaltydayupload.aggregate(pipeline);
        // penaltydayuploadoverall = await Penaltydayupload.find()?.lean();

        penaltydayupload = penaltydayuploadoverall.map(doc => {
            // Filter the `uploaddata` array within the document
            const filteredUploadData = doc.uploaddata.filter(item =>
                assignbranch.some(branch =>
                    branch.company === item.company &&
                    branch.branch === item.branch &&
                    branch.unit === item.unit
                )
            );

            // If no items in `uploaddata` match, set `uploaddata` to an empty array
            if (filteredUploadData.length === 0) {
                return { ...doc._doc, uploaddata: [] };
            }

            // Otherwise, return the document with the filtered `uploaddata`
            return { ...doc._doc, uploaddata: filteredUploadData };
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        // count: products.length,
        penaltydayupload, penaltydayuploadoverall
    });
});


