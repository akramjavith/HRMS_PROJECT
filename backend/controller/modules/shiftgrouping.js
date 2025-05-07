const ShiftGrouping = require('../../model/modules/shiftgrouping');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
const Shift = require('../../model/modules/shift');
const User = require('../../model/login/auth');
//create new shiftgrouping => /api/shiftgrouping/new
exports.addShiftgrouping = catchAsyncErrors(async (req, res, next) => {
 
                let ashiftgrouping = await ShiftGrouping.create(req.body);
                return res.status(200).json({
                    message: 'Successfully added!'
                });
           
           
})

//get All Shiftgrouping =>/api/shiftgroupings
exports.getAllShiftgrouping = catchAsyncErrors(async (req, res, next) => {
    let shiftgroupings;
    try {
        shiftgroupings = await ShiftGrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shiftgroupings) {
        return next(new ErrorHandler('Shiftgrouping not found!', 404));
    }
    return res.status(200).json({
        shiftgroupings
    });
})

// get Single shiftgrouping=> /api/shiftgrouping/:id
exports.getSingleShiftGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let shiftGrouping = await ShiftGrouping.findById(id);
    if (!shiftGrouping) {
        return next(new ErrorHandler('Shift not found', 404));
    }
    return res.status(200).json({
        shiftGrouping
    })
})

//update shiftgrouping by id => /api/shiftgrouping/:id
exports.updateShiftGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
 
                let uShiftGroup = await ShiftGrouping.findByIdAndUpdate(id, req.body);
                if (!uShiftGroup) {
                    return next(new ErrorHandler('Shift not found', 404));
                }
           
                return res.status(200).json({ message: 'Updated successfully' });
       
})

//delete shiftgrouping by id => /api/shiftgrouping/:id
exports.deleteShiftGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dshiftGrouping = await ShiftGrouping.findByIdAndRemove(id);
    if (!dshiftGrouping) {
        return next(new ErrorHandler('Shift not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

// checking duplicate condition /api/shiftgrouping/:shiftday/:shift
exports.CheckingDuplicateCondition =catchAsyncErrors(async (req, res, next) => {
    const {shiftday,shift} = req.params;
    let isAvailed = await ShiftGrouping.findOne({"shiftday":shiftday,"shift":shift});
    if (!isAvailed) {
        return false;
    }
    return true;
})
exports.getAllShiftgroupingByCondition = catchAsyncErrors(async (req, res, next) => {
    let shiftgroupings;
    try {
        shiftgroupings = await ShiftGrouping.aggregate([
       
            {
                $lookup: {
                    from: "users",
                    localField: "shift",
                    foreignField: "boardingLog.shifttiming",
                    as: "result",
                    pipeline: [
                        { $project: { _id: 1, boardingLog: 1 } } // Only project necessary fields
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "shift",
                    foreignField: "boardingLog.todo.shifttiming",
                    as: "result_todo",
                    pipeline: [
                        { $project: { _id: 1, boardingLog: 1 } } // Only project necessary fields
                    ]
                }
            },
            {
                $addFields: {
                    hasResults: {
                        $or: [
                            { $gt: [{ $size: "$result" }, 0] },
                            { $gt: [{ $size: "$result_todo" }, 0] },

                        ]
                    }
                }
            },

            {
                $project: {
                    _id: 1,
                    shiftday: 1,
                    shifthours: 1,
                    shift: 1,
                    updatedby: 1,
                    createdAt: 1,
                    __v: 1,
                    hasResults: 1

                }
            }
        ])
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shiftgroupings) {
        return next(new ErrorHandler('Shiftgrouping not found!', 404));
    }
    return res.status(200).json({
        shiftgroupings
    });
})


exports.getAllShiftgroupingToDelete = catchAsyncErrors(async (req, res, next) => {
    let shiftgroupings;
    let isArray = Array.isArray(req.body.shifts);
    try {
        if (isArray) {
            shiftgroupings = await ShiftGrouping.aggregate([
                {
                    $match: {
                        shift: { $in: req.body.shifts }
                    }
                },
                {
                    $lookup: {
                        from: 'shifts',
                        localField: 'shift',
                        foreignField: 'name',
                        as: 'matchedShifts'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        combinedMatchedShifts: {
                            $setUnion: [
                                {
                                    $map: {
                                        input: "$matchedShifts",
                                        as: "shift",
                                        in: { $toString: "$$shift._id" }
                                    }
                                }
                            ]
                        }
                    }
                }
            ])
        } else {
            shiftgroupings = await ShiftGrouping.aggregate([
                {
                    $match: {
                        shift: req.body.shifts
                    }
                },
                {
                    $lookup: {
                        from: 'shifts',
                        localField: 'shift',
                        foreignField: 'name',
                        as: 'matchedShifts'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        combinedMatchedShifts: {
                            $setUnion: [
                                {
                                    $map: {
                                        input: "$matchedShifts",
                                        as: "shift",
                                        in: { $toString: "$$shift._id" }
                                    }
                                }
                            ]
                        }
                    }
                }
            ])
        }

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shiftgroupings) {
        return next(new ErrorHandler('Shiftgrouping not found!', 404));
    }
    return res.status(200).json({
        shiftgroupings
    });
})

