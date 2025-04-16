const ipCategory = require("../../../model/modules/account/ipcategory");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Ipmaster = require("../../../model/modules/account/ipmodel");

// get all ipCategory => /api/referencecategories
exports.getAllipCategory = catchAsyncErrors(async (req, res, next) => {
  let ipcategory;
  try {
    ipcategory = await ipCategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ipcategory) {
    return next(new ErrorHandler("ipcategory not found", 404));
  }
  // Add serial numbers to the ipcategory
  const allipcategory = ipcategory.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    ipcategory: allipcategory,
  });
});

// add ipCategory =>/api/ipCategory/new
exports.addipCategory = catchAsyncErrors(async (req, res, next) => {
  await ipCategory.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

// get single ipCategory =>/api/ipCategory/:id
exports.getSingleipCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sipcategory = await ipCategory.findById(id);
  if (!sipcategory) {
    return next(new ErrorHandler("ipcategory not found"));
  }
  return res.status(200).json({
    sipcategory,
  });
});

// update single ipCategory =>/api/ipCategory/:id
exports.updateipCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uipcategory = await ipCategory.findByIdAndUpdate(id, req.body);

  if (!uipcategory) {
    return next(new ErrorHandler("ipcategory not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    uipcategory,
  });
});

// delete single ipCategory =>/api/ipCategory/:id
exports.deleteipCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dipcategory = await ipCategory.findByIdAndRemove(id);
  if (!dipcategory) {
    return next(new ErrorHandler("ipcategory not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


// get overall delete functionality
exports.getOverAllIpCategoryCheck = catchAsyncErrors(async (req, res, next) => {
  let ipcat;
  try {
    let query = {
      categoryname: { $in: req.body.checkunit },

    };
    ipcat = await Ipmaster.find(query, {
      categoryname: 1,
      _id: 0,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ipcat) {
    return next(new ErrorHandler("Ipcategory not found!", 404));
  }
  return res.status(200).json({
    ipcat,
  });
});


/// get overall edit
exports.getOverAllEditIpcategory = catchAsyncErrors(async (req, res, next) => {
  let ipmaster
  try {

    ipmaster = await Ipmaster.find({ categoryname: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!ipmaster) {
    return next(new ErrorHandler("Ipcategory not found", 404));
  }
  return res.status(200).json({
    count: ipmaster.length,
    ipmaster,

  });
});
