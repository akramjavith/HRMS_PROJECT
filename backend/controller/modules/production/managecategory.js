const Managecategory = require("../../../model/modules/production/managecategory");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Managecategory => /api/managecategorys
exports.getAllManagecategory = catchAsyncErrors(async (req, res, next) => {
  let managecategory;
  try {
    managecategory = await Managecategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!managecategory) {
    return next(new ErrorHandler("Managecategory not found!", 404));
  }
  return res.status(200).json({
    managecategory,
  });
});

exports.ManagecategorySort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await Managecategory.countDocuments();

      result = await Managecategory.find()
          .skip((page - 1) * pageSize)
          .limit(parseInt(pageSize));

  } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
  });
});


// Create new Managecategory=> /api/managecategory/new
exports.addManagecategory = catchAsyncErrors(async (req, res, next) => {

  let aproduct = await Managecategory.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Managecategory => /api/managecategory/:id
exports.getSingleManagecategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let smanagecategory = await Managecategory.findById(id);

  if (!smanagecategory) {
    return next(new ErrorHandler("Managecategory not found!", 404));
  }
  return res.status(200).json({
    smanagecategory,
  });
});

// update Managecategory by id => /api/managecategory/:id
exports.updateManagecategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let umanagecategory = await Managecategory.findByIdAndUpdate(id, req.body);

  if (!umanagecategory) {
    return next(new ErrorHandler("Managecategory not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Managecategory by id => /api/managecategory/:id
exports.deleteManagecategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dmanagecategory = await Managecategory.findByIdAndRemove(id);

  if (!dmanagecategory) {
    return next(new ErrorHandler("Managecategory Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


