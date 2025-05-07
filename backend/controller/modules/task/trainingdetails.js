
const TrainingDetails = require('../../../model/modules/task/trainingdetails');
const TrainingForUser = require("../../../model/modules/task/trainingforuser");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TrainingDetails => /api/trainingdetailss
exports.getAllTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  let trainingdetails;
  try {
    trainingdetails = await TrainingDetails.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!trainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingdetails,
  });
});
exports.getOverallEditTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  let tasforuser;
  try {
    tasforuser = await TrainingForUser.find({trainingdetails: req?.body?.details });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
     count: tasforuser?.length,
     tasforuser,
  });
});


// get All TrainingDetails Without Documents => /api/trainingdetailss
exports.getAllTrainingDetailsWithoutDocument = catchAsyncErrors(async (req, res, next) => {
  let trainingdetails;
  try {
    trainingdetails = await TrainingDetails.find({},{
      trainingdetails: 1,
      category: 1,
      subcategory: 1,
      duration: 1,
      trainingdocuments: 1,
      estimationtimetraining: 1,
      estimationtraining: 1,
      mode: 1,
      taskassign:1,
      required: 1,
      date: 1,
      status: 1,
      questioncount: 1,
      time: 1,
      deadlinedate: 1,
      frequency: 1,
      schedule: 1,
      weekdays: 1,
      typequestion: 1,
      monthdate: 1,
      annuday: 1,
      annumonth: 1,
      estimationtime: 1,
      estimation: 1,
      type: 1,
      designation: 1,
      department: 1,
      company: 1,
      branch: 1,
      unit: 1,
      team: 1,
      employeenames: 1,
      isOnlineTest: 1,
      testnames: 1,
      timetodo: 1,   
  });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!trainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingdetails,
  });
});
// get All TrainingDetails Without Documents => /api/trainingdetailss
exports.getAllTrainingDetailsWithoutDocumentActive = catchAsyncErrors(async (req, res, next) => {
  let trainingdetails;
  try {
    trainingdetails = await TrainingDetails.find({status : "Active"},{
      trainingdetails: 1,
      category: 1,
      subcategory: 1,
      duration: 1,
      trainingdocuments: 1,
      estimationtimetraining: 1,
      estimationtraining: 1,
      mode: 1,
      taskassign:1,
      required: 1,
      date: 1,
      status: 1,
      questioncount: 1,
      time: 1,
      deadlinedate: 1,
      frequency: 1,
      schedule: 1,
      weekdays: 1,
      typequestion: 1,
      monthdate: 1,
      annuday: 1,
      annumonth: 1,
      estimationtime: 1,
      estimation: 1,
      type: 1,
      designation: 1,
      department: 1,
      company: 1,
      branch: 1,
      unit: 1,
      team: 1,
      employeenames: 1,
      isOnlineTest: 1,
      testnames: 1,
      timetodo: 1,   
  });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!trainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingdetails,
  });
});



// Create new TrainingDetails=> /api/trainingdetails/new
exports.addTrainingDetails = catchAsyncErrors(async (req, res, next) => {

  let atrainingdetails = await TrainingDetails.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TrainingDetails => /api/trainingdetails/:id
exports.getSingleTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let strainingdetails = await TrainingDetails.findById(id);

  if (!strainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    strainingdetails,
  });
});

// update TrainingDetails by id => /api/trainingdetails/:id
exports.updateTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utrainingdetails = await TrainingDetails.findByIdAndUpdate(id, req.body);
  if (!utrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TrainingDetails by id => /api/trainingdetails/:id
exports.deleteTrainingDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtrainingdetails = await TrainingDetails.findByIdAndRemove(id);

  if (!dtrainingdetails) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
