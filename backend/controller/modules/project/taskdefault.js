const Taskcheckdefault = require('../../../model/modules/project/taskdefault');
const ErrorHandler = require('../../../utils/errorhandler');
const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Taskcheckdefault => /api/Designation
exports.getAllTaskcheckdefault = catchAsyncErrors(async (req, res, next) => {

    let taskcheckdefault;
    try {
        taskcheckdefault = await Taskcheckdefault.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskcheckdefault) {
        return next(new ErrorHandler('taskcheckdefault not found!', 404));
    }
    return res.status(200).json({
        taskcheckdefault
    });
})

// getoverall edit functionality 
exports.getOverallDescriptions = catchAsyncErrors(async (req, res, next) => {

    let task;
    try {
        task = await Task.find({
            checkpointsdev: {
                $elemMatch: {
                    label: req.body.oldname,
                }

            },
        },)

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!task) {
        return next(new ErrorHandler('taskcheckdefault not found!', 404));
    }
    return res.status(200).json({
        task, count: task.length
    });
})

// Create new Taskcheckdefault=> /api/taskcheckdefault/new
exports.addtaskcheckdefault = catchAsyncErrors(async (req, res, next) => {
    let ataskCheckdefault = await Taskcheckdefault.findOne({ description: req.body.description });
    if (ataskCheckdefault) {
        return next(new ErrorHandler('Description already exist!', 400));
    }
    let aproduct = await Taskcheckdefault.create(req.body)
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Taskcheckdefault => /api/taskcheckdefault/:id
exports.getSingletaskcheckdefault = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let staskcheckdefault = await Taskcheckdefault.findById(id);
    if (!staskcheckdefault) {
        return next(new ErrorHandler('Taskcheckdefault not found!', 404));
    }
    return res.status(200).json({
        staskcheckdefault
    })
})

// update Taskcheckdefault by id => /api/Taskcheckdefault/:id
exports.updatetaskcheckdefault = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utaskcheckdefault = await Taskcheckdefault.findByIdAndUpdate(id, req.body);
    if (!utaskcheckdefault) {
        return next(new ErrorHandler('Taskcheckdefault not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Taskcheckdefault by id => /api/Taskcheckdefault/:id
exports.deletetaskcheckdefault = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtaskcheckdefault = await Taskcheckdefault.findByIdAndRemove(id);
    if (!dtaskcheckdefault) {
        return next(new ErrorHandler('Taskcheckdefault not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})