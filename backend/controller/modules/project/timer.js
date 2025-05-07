const Timer = require('../../../model/modules/project/timer');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Timer => /api/timer
exports.getAllTimer = catchAsyncErrors(async (req, res, next) => {

    let timer;
    try {
        timer = await Timer.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timer) {
        return next(new ErrorHandler('Timer not found!', 404));
    }
    return res.status(200).json({
        timer
    });
})




exports.getUserTimerStatus = catchAsyncErrors(async (req, res, next) => {
    let task;
    let userTime;
    let answer = 0;
    let totalans = 0;

    try {
        task = await Timer.find()
        userTime = task.filter((data) => {

            return data.userid == req.body.userlogin && data.taskname == req.body.taskname
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!task) {
        return next(new ErrorHandler('Task not found', 400));
    }

    return res.status(200).json({ count: task.length, task, userTime });
})


// Create new Timer=> /api/timer/new
exports.addtaskTimer = catchAsyncErrors(async (req, res, next) => {
    let atimer = await Timer.create(req.body)
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Timer => /api/timer/:id
exports.getSingleTimer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stimer = await Timer.findById(id);
    if (!stimer) {
        return next(new ErrorHandler('Timer not found!', 404));
    }
    return res.status(200).json({
        stimer
    })
})

// update Timer by id => /api/Timer/:id
exports.updateTimer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utimer = await Timer.findByIdAndUpdate(id, req.body);
    if (!utimer) {
        return next(new ErrorHandler('Timer not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Timer by id => /api/Timer/:id
exports.deleteTimer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtimer = await Timer.findByIdAndRemove(id);
    if (!dtimer) {
        return next(new ErrorHandler('Timer not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})