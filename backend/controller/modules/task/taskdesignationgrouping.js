const TaskDesignationGrouping = require('../../../model/modules/task/taskdesignationgrouping');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All TaskDesignationGrouping =>/api/TaskDesignationGrouping
exports.getAllTaskDesignationGrouping = catchAsyncErrors(async (req, res, next) => {
    let taskdesignationgrouping;
    try {
        taskdesignationgrouping = await TaskDesignationGrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskdesignationgrouping) {
        return next(new ErrorHandler('Task Designation Grouping not found!', 404));
    }
    return res.status(200).json({
        taskdesignationgrouping
    });
})
exports.getAllTaskDesignationGroupingActive = catchAsyncErrors(async (req, res, next) => {
    let taskdesignationgrouping;
    try {
        taskdesignationgrouping = await TaskDesignationGrouping.find({schedulestatus:"Active"},{})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskdesignationgrouping) {
        return next(new ErrorHandler('Task Designation Grouping not found!', 404));
    }
    return res.status(200).json({
        taskdesignationgrouping
    });
})


//create new TaskDesignationGrouping => /api/TaskDesignationGrouping/new
exports.addTaskDesignationGrouping = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTaskDesignationGrouping = await TaskDesignationGrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single TaskDesignationGrouping => /api/TaskDesignationGrouping/:id
exports.getSingleTaskDesignationGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let staskdesignationgrouping = await TaskDesignationGrouping.findById(id);
    if (!staskdesignationgrouping) {
        return next(new ErrorHandler('Task Designation Grouping not found', 404));
    }
    return res.status(200).json({
        staskdesignationgrouping
    })
})

//update TaskDesignationGrouping by id => /api/TaskDesignationGrouping/:id
exports.updateTaskDesignationGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utaskdesignationgrouping = await TaskDesignationGrouping.findByIdAndUpdate(id, req.body);
    if (!utaskdesignationgrouping) {
        return next(new ErrorHandler('Task Designation Grouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete TaskDesignationGrouping by id => /api/TaskDesignationGrouping/:id
exports.deleteTaskDesignationGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtaskdesignationgrouping = await TaskDesignationGrouping.findByIdAndRemove(id);
    if (!dtaskdesignationgrouping) {
        return next(new ErrorHandler('Task Designation Grouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
