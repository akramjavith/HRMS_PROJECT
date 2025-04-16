const ShiftGrouping = require('../../model/modules/shiftgrouping');
const Shift = require('../../model/modules/shift');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All Shifts =>/api/shifts
exports.getAllShift = catchAsyncErrors(async (req, res, next) => {
    let shifts;
    try {
        shifts = await Shift.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shifts) {
        return next(new ErrorHandler('Shift not found!', 404));
    }
    return res.status(200).json({
        shifts
    });
})

exports.getTodayShift = catchAsyncErrors(async (req, res, next) => {
    let shifts;

    const resplit = req?.body?.todayshifttiming?.split('-');
    const ressttimeplit = resplit[0]?.split(':');
    
    const ressttimeampm =ressttimeplit[1]?.slice(ressttimeplit[1]?.length - 2);

    const ressttimemin =ressttimeplit[1]?.slice(0, 2);

    const resendtimeplit = resplit[1]?.split(':');
    const resendtimemin = resendtimeplit[1]?.slice(0, 2);

    const resendtimeampm = resendtimeplit[1]?.slice(resendtimeplit[1]?.length -2);
    
    try {
        shifts = await Shift.find({fromhour:ressttimeplit[0], frommin:ressttimemin, fromtime:ressttimeampm, tohour:resendtimeplit[0],  tomin:resendtimemin, totime:resendtimeampm,})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shifts) {
        return next(new ErrorHandler('Shift not found!', 404));
    }
    return res.status(200).json({
        shifts
    });
})

//get All Shifts =>/api/shifts
exports.getAllShiftLimited = catchAsyncErrors(async (req, res, next) => {
    let shifts;
    try {
        shifts = await Shift.find({},{name:1, isallowance:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shifts) {
        return next(new ErrorHandler('Shift not found!', 404));
    }
    return res.status(200).json({
        shifts
    });
})


// Overall Shift edit
exports.getOverallShiftDetails = catchAsyncErrors(async (req, res, next) => {
    let users;

    try {
        users = await User.find({ enquirystatus:{
            $nin: ["Enquiry Purpose"]
           },shifttiming: req.body.oldname },{company:1, branch:1,unit:1, shifttiming:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Shift details not found', 404));
    }
    return res.status(200).json({
        users, count: users.length
    });
})

exports.getSingleusershiftime = catchAsyncErrors(async (req, res, next) => {
    let shifts;

    try {
        shifts = await Shift.find({ name: req.body.shiftname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        shifts
    });
})



//create new shift => /api/shift/new
exports.addShift = catchAsyncErrors(async (req, res, next) => {


    let ashift = await Shift.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})


// get Single shift=> /api/shift/:id
exports.getSingleShift = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sshift = await Shift.findById(id);
    if (!sshift) {
        return next(new ErrorHandler('Shift not found', 404));
    }
    return res.status(200).json({
        sshift
    })
})
//update shift by id => /api/shift/:id
exports.updateShift = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ushift = await Shift.findByIdAndUpdate(id, req.body);
    if (!ushift) {
        return next(new ErrorHandler('Shift not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete shift by id => /api/shift/:id
exports.deleteShift = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dshift = await Shift.findByIdAndRemove(id);
    if (!dshift) {
        return next(new ErrorHandler('Shift not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getAllShiftByCondition = catchAsyncErrors(async (req, res, next) => {
    let shifts;
    try {
        shifts = await Shift.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "name",
                    foreignField: "boardingLog.shifttiming",
                    as: "result"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "name",
                    foreignField: "boardingLog.todo.shifttiming",
                    as: "result_todo"
                }
            },
            {
                $lookup: {
                    from: "shiftgroupings",
                    localField: "name",
                    foreignField: "shift",
                    as: "resultnew"
                }
            },
            {
                $addFields: {
                    hasResults: {
                        $or: [
                            { $gt: [{ $size: "$result" }, 0] },
                            { $gt: [{ $size: "$result_todo" }, 0] },
                            { $gt: [{ $size: "$resultnew" }, 0] }
                        ]
                    }
                }
            },

            {
                $project: {
                    _id: 1,
                    name: 1,
                    fromhour: 1,
                    tohour: 1,
                    frommin: 1,
                    tomin: 1,
                    fromtime: 1,
                    totime: 1,
                    payhours: 1,
                    breakhours: 1,
                    shifthours: 1,
                    workinghours: 1,
                    isallowance: 1,
                    addedby: 1,
                    updatedby: 1,
                    createdAt: 1,
                    __v: 1,
                    hasResults: 1

                }
            }

        ]);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shifts) {
        return next(new ErrorHandler('Shift not found!', 404));
    }
    return res.status(200).json({
        shifts
    });
})

