const ChecklistInterview = require('../../../model/modules/interview/ChecklistInterviewModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ChecklistInterview => /api/checklistinterviews
exports.getAllChecklistInterview = catchAsyncErrors(async (req, res, next) => {
  let checklistinterview;
  try {
    checklistinterview = await ChecklistInterview.find();
    if (!checklistinterview) {
      return next(new ErrorHandler("ChecklistInterview not found!", 404));
    }
    const allchecklistinterview = checklistinterview.map((data, index) => ({
      serialNumber: index + 1,
      ...data.toObject(),
    }));
    return res.status(200).json({
      // count: products.length,
      checklistinterview:allchecklistinterview
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  
});

// Create new ChecklistInterview=> /api/checklistinterview/new
exports.addChecklistInterview = catchAsyncErrors(async (req, res, next) => {

  let achecklistinterview = await ChecklistInterview.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ChecklistInterview => /api/checklistinterview/:id
exports.getSingleChecklistInterview = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let schecklistinterview = await ChecklistInterview.findById(id);

  if (!schecklistinterview) {
    return next(new ErrorHandler("ChecklistInterview not found!", 404));
  }
  return res.status(200).json({
    schecklistinterview,
  });
});

// update ChecklistInterview by id => /api/checklistinterview/:id
exports.updateChecklistInterview = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uchecklistinterview = await ChecklistInterview.findByIdAndUpdate(id, req.body);
  if (!uchecklistinterview) {
    return next(new ErrorHandler("ChecklistInterview not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ChecklistInterview by id => /api/checklistinterview/:id
exports.deleteChecklistInterview = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dchecklistinterview = await ChecklistInterview.findByIdAndRemove(id);

  if (!dchecklistinterview) {
    return next(new ErrorHandler("ChecklistInterview not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
