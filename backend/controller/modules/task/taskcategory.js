const Taskcategory = require('../../../model/modules/task/taskcategory');
const Tasksubcategory = require('../../../model/modules/task/tasksubcategory');
const TaskDesignationGrouping = require('../../../model/modules/task/taskdesignationgrouping');
const TaskNonScheduleGrouping = require("../../../model/modules/task/nonschedulegrouping");
const TaskScheduleGrouping = require("../../../model/modules/task/TaskScheduleGroupingModel");
const TaskForUser = require("../../../model/modules/task/taskforuser");
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Taskcategory =>/api/Taskcategory
exports.getAllTaskcategory = catchAsyncErrors(async (req, res, next) => {
    let taskcategorys;
    try {
        taskcategorys = await Taskcategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskcategorys) {
        return next(new ErrorHandler('Taskcategory not found!', 404));
    }
    return res.status(200).json({
        taskcategorys
    });
})
exports.getOverallEditCategory = catchAsyncErrors(async (req, res, next) => {
    let tasksubcat, taskdesig, taskschedule, tasforuser, tasknonschedule , taskschedulelog;
    try {
        tasksubcat = await Tasksubcategory.find({ category: req.body.category })
        taskdesig = await TaskDesignationGrouping.find({ category: req.body.category })
        tasknonschedule = await TaskNonScheduleGrouping.find({ category: req.body.category })
        tasforuser = await TaskForUser.find({ category: req.body.category })
        taskschedule = await TaskScheduleGrouping.find({ category: req.body.category })
       const result = await TaskDesignationGrouping.find()
       taskschedulelog = result?.filter(data => data?.taskdesignationlog?.some(dat => dat?.category === req.body.category))
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!tasksubcat && !taskdesig && tasknonschedule && !tasforuser && !taskschedule && !taskschedulelog) {
        return next(new ErrorHandler('Taskcategory not found!', 404));
    }
    return res.status(200).json({
        count: tasksubcat?.length + taskdesig?.length + tasknonschedule?.length + tasforuser?.length + taskschedule?.length + taskschedulelog?.length
        , tasksubcat, taskdesig, tasknonschedule, tasforuser, taskschedule , taskschedulelog
    });
})


exports.getOverallDeleteCategory = catchAsyncErrors(async (req, res, next) => {
    let tasksubcat, taskdesig, taskschedule, tasforuser, tasknonschedule, taskcate, result, count;
    let id = req.body.id
    try {

        taskcate = await Taskcategory.find()
        const answer = taskcate?.filter(data => id?.includes(data._id?.toString()))

        tasksubcat = await Tasksubcategory.find()
        taskdesig = await TaskDesignationGrouping.find()
        tasknonschedule = await TaskNonScheduleGrouping.find()
        taskschedule = await TaskScheduleGrouping.find()


        const unmatchedSubCate = answer.filter(answers => tasksubcat.some(sub => sub.category === answers.categoryname))?.map(data => data._id?.toString());
        const unmatchedtaskdesig = answer.filter(answers => taskdesig.some(sub => sub.category === answers.categoryname))?.map(data => data._id?.toString());
        const unmatchedtasknonschedule = answer.filter(answers => tasknonschedule.some(sub => sub.category === answers.categoryname))?.map(data => data._id?.toString());
        const unmatchedtaskschedule = answer.filter(answers => taskschedule.some(sub => sub.category === answers.categoryname))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedtaskdesig, ...unmatchedSubCate, ...unmatchedtasknonschedule,  ...unmatchedtaskschedule ]
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


//create new Taskcategory => /api/Taskcategory/new
exports.addTaskcategory = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTaskcategory = await Taskcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Taskcategory => /api/Taskcategory/:id
exports.getSingleTaskcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let staskcategory = await Taskcategory.findById(id);
    if (!staskcategory) {
        return next(new ErrorHandler('Taskcategory not found', 404));
    }
    return res.status(200).json({
        staskcategory
    })
})

//update Taskcategory by id => /api/Taskcategory/:id
exports.updateTaskcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utaskcategory = await Taskcategory.findByIdAndUpdate(id, req.body);
    if (!utaskcategory) {
        return next(new ErrorHandler('Taskcategory not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Taskcategory by id => /api/Taskcategory/:id
exports.deleteTaskcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtaskcategory = await Taskcategory.findByIdAndRemove(id);
    if (!dtaskcategory) {
        return next(new ErrorHandler('Taskcategory not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
