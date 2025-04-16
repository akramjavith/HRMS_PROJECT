const Tasksubcategory = require('../../../model/modules/task/tasksubcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const TaskDesignationGrouping = require('../../../model/modules/task/taskdesignationgrouping');
const TaskNonScheduleGrouping = require("../../../model/modules/task/nonschedulegrouping");
const TaskScheduleGrouping = require("../../../model/modules/task/TaskScheduleGroupingModel");
const TaskForUser = require("../../../model/modules/task/taskforuser");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Tasksubcategory =>/api/Tasksubcategory
exports.getAllTasksubcategory = catchAsyncErrors(async (req, res, next) => {
    let tasksubcategorys;
    try {
        tasksubcategorys = await Tasksubcategory.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!tasksubcategorys) {
        return next(new ErrorHandler('Tasksubcategory not found!', 404));
    }
    return res.status(200).json({
        tasksubcategorys
    });
})
exports.getOverallEditSubCategory = catchAsyncErrors(async (req, res, next) => {
    let  taskdesig, taskschedule, tasforuser, tasknonschedule,taskschedulelog;
    try {
        taskdesig = await TaskDesignationGrouping.find({ subcategory: req.body.subcategory })
        tasknonschedule = await TaskNonScheduleGrouping.find({ subcategory: req.body.subcategory })
        tasforuser = await TaskForUser.find({ subcategory: req.body.subcategory })
        taskschedule = await TaskScheduleGrouping.find({ subcategory: req.body.subcategory })
        const result = await TaskDesignationGrouping.find()
        taskschedulelog = result?.filter(data => data?.taskdesignationlog?.some(dat => dat?.subcategory === req.body.subcategory))
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if ( !taskdesig && tasknonschedule && !tasforuser && !taskschedule && !taskschedulelog) {
        return next(new ErrorHandler('Taskcategory not found!', 404));
    }
    return res.status(200).json({
        count: taskdesig?.length + tasknonschedule?.length + tasforuser?.length + taskschedule?.length + taskschedulelog?.length
        ,taskdesig, tasknonschedule, tasforuser, taskschedule, taskschedulelog
    });
})

exports.getOverallDeleteSubCategory = catchAsyncErrors(async (req, res, next) => {
    let  taskdesig, taskschedule, tasforuser, tasknonschedule, taskcate, result, count;
    let id = req.body.id
    try {

        taskcate = await Tasksubcategory.find()
        const answer = taskcate?.filter(data => id?.includes(data._id?.toString()))
        taskdesig = await TaskDesignationGrouping.find()
        tasknonschedule = await TaskNonScheduleGrouping.find()
        taskschedule = await TaskScheduleGrouping.find()


        const unmatchedtaskdesig = answer.filter(answers => taskdesig.some(sub => sub.subcategory === answers.subcategoryname))?.map(data => data._id?.toString());
        const unmatchedtasknonschedule = answer.filter(answers => tasknonschedule.some(sub => sub.subcategory === answers.subcategoryname))?.map(data => data._id?.toString());
        const unmatchedtaskschedule = answer.filter(answers => taskschedule.some(sub => sub.subcategory === answers.subcategoryname))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedtaskdesig, ...unmatchedtasknonschedule, ...unmatchedtaskschedule]
        result = id?.filter(data => !duplicateId?.includes(data))
        count = id?.filter(data => !duplicateId?.includes(data))?.length
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: count,
        result
    });
})





//create new Tasksubcategory => /api/Tasksubcategory/new
exports.addTasksubcategory = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTasksubcategory = await Tasksubcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Tasksubcategory => /api/Tasksubcategory/:id
exports.getSingleTasksubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stasksubcategory = await Tasksubcategory.findById(id);
    if (!stasksubcategory) {
        return next(new ErrorHandler('Tasksubcategory not found', 404));
    }
    return res.status(200).json({
        stasksubcategory
    })
})

//update Tasksubcategory by id => /api/Tasksubcategory/:id
exports.updateTasksubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utasksubcategory = await Tasksubcategory.findByIdAndUpdate(id, req.body);
    if (!utasksubcategory) {
        return next(new ErrorHandler('Tasksubcategory not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Tasksubcategory by id => /api/Tasksubcategory/:id
exports.deleteTasksubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtasksubcategory = await Tasksubcategory.findByIdAndRemove(id);
    if (!dtasksubcategory) {
        return next(new ErrorHandler('Tasksubcategory not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})