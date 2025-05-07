
const salaryPfMaster = require("../../../model/modules/setup/salarypfmaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All salaryPfMaster => /api/salarypfs
exports.getAllsalaryPfMaster = catchAsyncErrors(async (req, res, next) => {
  let salarypf;
  try {
    salarypf = await salaryPfMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
 
  return res.status(200).json({
    // count: products.length,
    salarypf,
  });
});

exports.getAllsalaryPfMasterLastData = catchAsyncErrors(async (req, res, next) => {
  let salarypf;
  try {
    salarypf = await salaryPfMaster.findOne().sort({createdAt:1}).exec();
    salarypf = salarypf ? salarypf : {}
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
 
  return res.status(200).json({
    // count: products.length,
    salarypf,
  });
});


// Create new salaryPfMaster=> /api/salarypf/new
exports.addsalaryPfMaster = catchAsyncErrors(async (req, res, next) => {

  let asalarypf = await salaryPfMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle salaryPfMaster => /api/salarypf/:id
exports.getSinglesalaryPfMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ssalarypf = await salaryPfMaster.findById(id);

  if (!ssalarypf) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    ssalarypf,
  });
});

// update salaryPfMaster by id => /api/salarypf/:id
exports.updatesalaryPfMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let usalarypf = await salaryPfMaster.findByIdAndUpdate(id, req.body);
  if (!usalarypf) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete salaryPfMaster by id => /api/salarypf/:id
exports.deletesalaryPfMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dsalarypf = await salaryPfMaster.findByIdAndRemove(id);

  if (!dsalarypf) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});




