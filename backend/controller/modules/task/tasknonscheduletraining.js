const TrainingNonSchedule = require('../../../model/modules/task/tasknonscheduletraining');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TrainingNonSchedule => /api/trainingdetailss
exports.getAllNonscheduleTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  let nonscheduletrainingdetails;
  try {
    nonscheduletrainingdetails = await TrainingNonSchedule.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!nonscheduletrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    nonscheduletrainingdetails,
  });
});

// Create new TrainingNonSchedule=> /api/nonscheduletrainingdetails/new
exports.addNonscheduleTrainingDetails = catchAsyncErrors(async (req, res, next) => {

  let anonscheduletrainingdetails = await TrainingNonSchedule.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TrainingNonSchedule => /api/nonscheduletrainingdetails/:id
exports.getSingleNonscheduleTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let snonscheduletrainingdetails = await TrainingNonSchedule.findById(id);

  if (!snonscheduletrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    snonscheduletrainingdetails,
  });
});

// update TrainingNonSchedule by id => /api/nonscheduletrainingdetails/:id
exports.updateNonscheduleTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let unonscheduletrainingdetails = await TrainingNonSchedule.findByIdAndUpdate(id, req.body);
  if (!unonscheduletrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TrainingNonSchedule by id => /api/nonscheduletrainingdetails/:id
exports.deleteNonscheduleTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dnonscheduletrainingdetails = await TrainingNonSchedule.findByIdAndRemove(id);

  if (!dnonscheduletrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});