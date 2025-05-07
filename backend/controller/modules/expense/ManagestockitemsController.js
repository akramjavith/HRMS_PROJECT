const Managestockitems = require("../../../model/modules/expense/ManagestockitemsModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Managestockitems =>/api/Managestockitems
exports.getAllManagestockitems = catchAsyncErrors(async (req, res, next) => {
  try {
    let managestockitems = await Managestockitems.find();
    if (!managestockitems) {
      return next(new ErrorHandler("Managestockitems not found!", 404));
    }
    return res.status(200).json({
        managestockitems,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//create new Managestockitems => /api/Managestockitems/new
exports.addManagestockitems = catchAsyncErrors(async (req, res, next) => {
  let managestockitems = await Managestockitems.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Managestockitems => /api/Managestockitems/:id
exports.getSingleManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findById(id);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({
    managestockitems,
  });
});
//update Managestockitems by id => /api/Managestockitems/:id
exports.updateManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findByIdAndUpdate(id, req.body);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

//delete Managestockitems by id => /api/Managestockitems/:id
exports.deleteManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findByIdAndRemove(id);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
