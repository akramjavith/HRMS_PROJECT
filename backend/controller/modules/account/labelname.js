const LabelName = require('../../../model/modules/account/labelname');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All LabelName Name => /api/LabelName
exports.getAllLabelName = catchAsyncErrors(async (req, res, next) => {
  let labelname;
  try {
    labelname = await LabelName.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!labelname) {
    return next(new ErrorHandler("LabelName Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    labelname,
  });
});

// Create new LabelName=> /api/LabelName/new
exports.addLabelName = catchAsyncErrors(async (req, res, next) => {
//   let checkloc = await LabelName.findOne({ name: req.body.name });

//   if (checkloc) {
//     return next(new ErrorHandler("Colours Name already exist!", 400));
//   }

  let alabelname = await LabelName.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle LabelName => /api/LabelName/:id
exports.getSingleLabelName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let slabelname = await LabelName.findById(id);

  if (!slabelname) {
    return next(new ErrorHandler("LabelName Name not found!", 404));
  }
  return res.status(200).json({
    slabelname,
  });
});

// update LabelName by id => /api/LabelName/:id
exports.updateLabelName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ulabelname = await LabelName.findByIdAndUpdate(id, req.body);
  if (!ulabelname) {
    return next(new ErrorHandler("LabelName Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete LabelName by id => /api/LabelName/:id
exports.deleteLabelName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dlabelname = await LabelName.findByIdAndRemove(id);

  if (!dlabelname) {
    return next(new ErrorHandler("LabelName Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});