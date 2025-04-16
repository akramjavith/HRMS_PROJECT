const TaskScheduleGrouping = require("../../../model/modules/task/TaskScheduleGroupingModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TaskScheduleGrouping => /api/taskschedulegroupings
exports.getAllTaskScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  let taskschedulegrouping;
  try {
    taskschedulegrouping = await TaskScheduleGrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskschedulegrouping,
  });
});

// Create new TaskScheduleGrouping=> /api/taskschedulegrouping/new
exports.addTaskScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  let ataskschedulegrouping = await TaskScheduleGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TaskScheduleGrouping => /api/taskschedulegrouping/:id
exports.getSingleTaskScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let staskschedulegrouping = await TaskScheduleGrouping.findById(id);

  if (!staskschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    staskschedulegrouping,
  });
});

// update TaskScheduleGrouping by id => /api/taskschedulegrouping/:id
exports.updateTaskScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utaskschedulegrouping = await TaskScheduleGrouping.findByIdAndUpdate(id, req.body);
  if (!utaskschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TaskScheduleGrouping by id => /api/taskschedulegrouping/:id
exports.deleteTaskScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtaskschedulegrouping = await TaskScheduleGrouping.findByIdAndRemove(id);

  if (!dtaskschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
