const Manageshortagemaster = require("../../../model/modules/production/Shortagemaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Manageshortagemaster =>/api/Manageshortagemaster
exports.getAllManageshortagemaster = catchAsyncErrors(async (req, res, next) => {
  let manageshortagemasters;
  try {
    manageshortagemasters = await Manageshortagemaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manageshortagemasters) {
    return next(new ErrorHandler("Manageshortagemaster not found!", 404));
  }
  return res.status(200).json({
    manageshortagemasters,
  });
});

//create new Manageshortagemaster => /api/Manageshortagemaster/new
exports.addManageshortagemaster = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aManageshortagemaster = await Manageshortagemaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Manageshortagemaster => /api/Manageshortagemaster/:id
exports.getSingleManageshortagemaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let smanageshortagemaster = await Manageshortagemaster.findById(id);
  if (!smanageshortagemaster) {
    return next(new ErrorHandler("Manageshortagemaster not found", 404));
  }
  return res.status(200).json({
    smanageshortagemaster,
  });
});

//update Manageshortagemaster by id => /api/Manageshortagemaster/:id
exports.updateManageshortagemaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umanageshortagemaster = await Manageshortagemaster.findByIdAndUpdate(id, req.body);
  if (!umanageshortagemaster) {
    return next(new ErrorHandler("Manageshortagemaster not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Manageshortagemaster by id => /api/Manageshortagemaster/:id
exports.deleteManageshortagemaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dmanageshortagemaster = await Manageshortagemaster.findByIdAndRemove(id);
  if (!dmanageshortagemaster) {
    return next(new ErrorHandler("Manageshortagemaster not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.ManageshortagemasterSOrt = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await Manageshortagemaster.countDocuments();

      result = await Manageshortagemaster.find()
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