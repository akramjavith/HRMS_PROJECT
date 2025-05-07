const Reportingheader = require("../../../model/modules/role/reportingheader");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Reportingheader =>/api/Reportingheader
exports.getAllReportingheader = catchAsyncErrors(async (req, res, next) => {
  let reportingheaders;
  try {
    reportingheaders = await Reportingheader.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!reportingheaders) {
    return next(new ErrorHandler("Reportingheader not found!", 404));
  }
  return res.status(200).json({
    reportingheaders,
  });
});


// //create new Reportingheader => /api/Reportingheader/new
// exports.addReportingheader = catchAsyncErrors(async (req, res, next) => {
//   let checkloc = await Reportingheader.findOne({ name: req.body.name });
//   if (checkloc) {
//     return next(new ErrorHandler("Reportingheader name already exist!", 400));
//   }

//   let aReportingheader = await Reportingheader.create(req.body);
//   return res.status(200).json({
//     message: "Successfully added!",
//   });
// });

exports.addReportingheader = catchAsyncErrors(async (req, res, next) => {
    // Convert the name to lowercase to ensure case-insensitivity
    const name = req.body.name.toLowerCase(); 
  
    // Check if a Reportingheader with the same name (case-insensitive) already exists
    let checkloc = await Reportingheader.findOne({ name });
  
    if (checkloc) {
      return next(new ErrorHandler("Reportingheader name already exists!", 400));
    }
  
    // Set the name to lowercase before saving
    let aReportingheader = await Reportingheader.create({ ...req.body, name });
  
    return res.status(200).json({
      message: "Successfully added!",
    });
  });
  
  
// get Single Reportingheader => /api/Reportingheader/:id
exports.getSingleReportingheader = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sreportingheader = await Reportingheader.findById(id);
  if (!sreportingheader) {
    return next(new ErrorHandler("Reportingheader not found", 404));
  }
  return res.status(200).json({
    sreportingheader,
  });
});

//update role by id => /api/role/:id
exports.updateReportingheader = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ureportingheader = await Reportingheader.findByIdAndUpdate(id, req.body);
  if (!ureportingheader) {
    return next(new ErrorHandler("Reportingheader not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete role by id => /api/role/:id
exports.deleteReportingheader = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dreportingheader = await Reportingheader.findByIdAndRemove(id);
  if (!dreportingheader) {
    return next(new ErrorHandler("Reportingheader not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
