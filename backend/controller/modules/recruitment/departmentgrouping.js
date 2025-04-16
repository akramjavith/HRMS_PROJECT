const Departmentgrouping = require("../../../model/modules/recruitment/departmentgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Departmentgrouping Name => /api/departmentgrouping
exports.getAllDepartmentgrouping = catchAsyncErrors(async (req, res, next) => {
  let departmentgrouping;
  try {
    departmentgrouping = await Departmentgrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!departmentgrouping) {
    return next(new ErrorHandler("Departmentgrouping Name not found!1", 404));
  }
  return res.status(200).json({
    // count: products.length,
    departmentgrouping,
  });
});

// Create new Departmentgrouping=> /api/departmentgrouping/new
exports.addDepartmentgrouping = catchAsyncErrors(async (req, res, next) => {


  let aconnectivity = await Departmentgrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Departmentgrouping => /api/departmentgrouping/:id
exports.getSingleDepartmentgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdepartmentgrouping = await Departmentgrouping.findById(id);

  if (!sdepartmentgrouping) {
    return next(new ErrorHandler("Departmentgrouping Name not found!2", 404));
  }
  return res.status(200).json({
    sdepartmentgrouping,
  });
});

// update Departmentgrouping by id => /api/departmentgrouping/:id
exports.updateDepartmentgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udepartmentgrouping = await Departmentgrouping.findByIdAndUpdate(id, req.body);
  if (!udepartmentgrouping) {
    return next(new ErrorHandler("Departmentgrouping Name not found!3", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Departmentgrouping by id => /api/connectivity/:id
exports.deleteDepartmentgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddepartmentgrouping = await Departmentgrouping.findByIdAndRemove(id);

  if (!ddepartmentgrouping) {
    return next(new ErrorHandler("Departmentgrouping Name not found!4", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
