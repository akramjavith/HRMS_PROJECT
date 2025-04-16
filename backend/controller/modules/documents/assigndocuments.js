const AssignDocumnent = require("../../../model/modules/documents/assigndocuments");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

exports.getAllAssignDocument = catchAsyncErrors(async (req, res, next) => {
  let assigndocument;
  
  try {
    assigndocument = await AssignDocumnent.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assigndocument) {
    return next(new ErrorHandler("AssignDocumnent not found", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = assigndocument.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    assigndocument: alldoccategory,
  });
});

exports.addAssignDocument = catchAsyncErrors(async (req, res, next) => {
  await AssignDocumnent.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

exports.getSingleAssignDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sassigndocument = await AssignDocumnent.findById(id);
  if (!sassigndocument) {
    return next(new ErrorHandler("AssignDocumnent not found"));
  }
  return res.status(200).json({
    sassigndocument,
  });
});

exports.updateAssignDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uassigndocument = await AssignDocumnent.findByIdAndUpdate(id, req.body);

  if (!uassigndocument) {
    return next(new ErrorHandler("AssignDocumnent not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    uassigndocument,
  });
});

exports.deleteAssignDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dassigndocument = await AssignDocumnent.findByIdAndRemove(id);
  if (!dassigndocument) {
    return next(new ErrorHandler("AssignDocumnent not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

