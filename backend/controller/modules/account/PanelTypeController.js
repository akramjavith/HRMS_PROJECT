const PanelType = require("../../../model/modules/account/PanelTypeModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All PanelType Name => /api/paneltypes
exports.getAllPanelType = catchAsyncErrors(async (req, res, next) => {
  let paneltype;
  try {
    paneltype = await PanelType.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!paneltype) {
    return next(new ErrorHandler("PanelType Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paneltype,
  });
});

// Create new PanelType=> /api/paneltype/new
exports.addPanelType = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await PanelType.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("PanelType Name already exist!", 400));
  }

  let apaneltype = await PanelType.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle PanelType => /api/paneltype/:id
exports.getSinglePanelType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spaneltype = await PanelType.findById(id);

  if (!spaneltype) {
    return next(new ErrorHandler("PanelType Name not found!", 404));
  }
  return res.status(200).json({
    spaneltype,
  });
});

// update PanelType by id => /api/paneltype/:id
exports.updatePanelType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upaneltype = await PanelType.findByIdAndUpdate(id, req.body);
  if (!upaneltype) {
    return next(new ErrorHandler("PanelType Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete PanelType by id => /api/paneltype/:id
exports.deletePanelType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpaneltype = await PanelType.findByIdAndRemove(id);

  if (!dpaneltype) {
    return next(new ErrorHandler("PanelType Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
