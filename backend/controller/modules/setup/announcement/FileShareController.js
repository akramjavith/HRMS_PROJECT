const FileShare = require("../../../../model/modules/setup/announcement/FileShareModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");

// get All FileShare => /api/fileshares
exports.getAllFileShare = catchAsyncErrors(async (req, res, next) => {
  let fileshare;
  try {
    fileshare = await FileShare.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!fileshare) {
    return next(new ErrorHandler("FileShare not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    fileshare,
  });
});

// Create new FileShare=> /api/fileshare/new
exports.addFileShare = catchAsyncErrors(async (req, res, next) => {
  let afileshare = await FileShare.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle FileShare => /api/fileshare/:id
exports.getSingleFileShare = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sfileshare = await FileShare.findById(id);

  if (!sfileshare) {
    return next(new ErrorHandler("FileShare not found!", 404));
  }
  return res.status(200).json({
    sfileshare,
  });
});

// update FileShare by id => /api/fileshare/:id
exports.updateFileShare = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ufileshare = await FileShare.findByIdAndUpdate(id, req.body);
  if (!ufileshare) {
    return next(new ErrorHandler("FileShare not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete FileShare by id => /api/fileshare/:id
exports.deleteFileShare = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dfileshare = await FileShare.findByIdAndRemove(id);

  if (!dfileshare) {
    return next(new ErrorHandler("FileShare not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
