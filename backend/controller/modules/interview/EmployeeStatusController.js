const EmployeeStatus = require('../../../model/modules/interview/EmployeeStatusModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All EmployeeStatus Name => /api/employeestatuss
exports.getAllEmployeeStatus = catchAsyncErrors(async (req, res, next) => {
  let employeestatus;
  try {
    employeestatus = await EmployeeStatus.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!employeestatus) {
    return next(new ErrorHandler("EmployeeStatus Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    employeestatus,
  });
});

// Create new EmployeeStatus=> /api/employeestatus/new
exports.addEmployeeStatus = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await EmployeeStatus.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let aemployeestatus = await EmployeeStatus.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle EmployeeStatus => /api/employeestatus/:id
exports.getSingleEmployeeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let semployeestatus = await EmployeeStatus.findById(id);

  if (!semployeestatus) {
    return next(new ErrorHandler("EmployeeStatus Name not found!", 404));
  }
  return res.status(200).json({
    semployeestatus,
  });
});

// update EmployeeStatus by id => /api/employeestatus/:id
exports.updateEmployeeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uemployeestatus = await EmployeeStatus.findByIdAndUpdate(id, req.body);
  if (!uemployeestatus) {
    return next(new ErrorHandler("EmployeeStatus Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete EmployeeStatus by id => /api/employeestatus/:id
exports.deleteEmployeeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let demployeestatus = await EmployeeStatus.findByIdAndRemove(id);

  if (!demployeestatus) {
    return next(new ErrorHandler("EmployeeStatus Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
