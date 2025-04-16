const Colours = require('../../../model/modules/account/ColoursModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Colours Name => /api/colourss
exports.getAllColours = catchAsyncErrors(async (req, res, next) => {
  let colours;
  try {
    colours = await Colours.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!colours) {
    return next(new ErrorHandler("Colours Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    colours,
  });
});

// Create new Colours=> /api/colours/new
exports.addColours = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Colours.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Colours Name already exist!", 400));
  }

  let acolours = await Colours.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Colours => /api/colours/:id
exports.getSingleColours = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let scolours = await Colours.findById(id);

  if (!scolours) {
    return next(new ErrorHandler("Colours Name not found!", 404));
  }
  return res.status(200).json({
    scolours,
  });
});

// update Colours by id => /api/colours/:id
exports.updateColours = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucolours = await Colours.findByIdAndUpdate(id, req.body);
  if (!ucolours) {
    return next(new ErrorHandler("Colours Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Colours by id => /api/colours/:id
exports.deleteColours = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcolours = await Colours.findByIdAndRemove(id);

  if (!dcolours) {
    return next(new ErrorHandler("Colours Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
