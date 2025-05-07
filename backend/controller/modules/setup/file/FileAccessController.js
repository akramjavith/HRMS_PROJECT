const FileAccess = require("../../../../model/modules/setup/file/FileAccessModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");

// get All FileAccess => /api/fileaccesss
exports.getAllFileAccess = catchAsyncErrors(async (req, res, next) => {
  let fileaccess;
  try {
    fileaccess = await FileAccess.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!fileaccess) {
    return next(new ErrorHandler("FileAccess not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    fileaccess,
  });
});

// Create new FileAccess=> /api/fileaccess/new
exports.addFileAccess = catchAsyncErrors(async (req, res, next) => {
  let afileaccess = await FileAccess.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle FileAccess => /api/fileaccess/:id
exports.getSingleFileAccess = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sfileaccess = await FileAccess.findById(id);

  if (!sfileaccess) {
    return next(new ErrorHandler("FileAccess not found!", 404));
  }
  return res.status(200).json({
    sfileaccess,
  });
});

// update FileAccess by id => /api/fileaccess/:id
exports.updateFileAccess = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ufileaccess = await FileAccess.findByIdAndUpdate(id, req.body);
  if (!ufileaccess) {
    return next(new ErrorHandler("FileAccess not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete FileAccess by id => /api/fileaccess/:id
exports.deleteFileAccess = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dfileaccess = await FileAccess.findByIdAndRemove(id);

  if (!dfileaccess) {
    return next(new ErrorHandler("FileAccess not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
