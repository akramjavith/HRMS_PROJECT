const Applicationname = require("../../../model/modules/account/Applicationnamemodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Applicationname Name => /api/operatingsystem
exports.getAllApplicationname = catchAsyncErrors(async (req, res, next) => {
  let applicationname;
  try {
    applicationname = await Applicationname.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!applicationname) {
    return next(new ErrorHandler("Applicationname Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    applicationname,
  });
});

// Create new Applicationname=> /api/operatingsystem/new
exports.addApplicationname = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Applicationname.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let aapplicationname = await Applicationname.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Applicationname => /api/operatingsystem/:id
exports.getSingleApplicationname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sapplicationname= await Applicationname.findById(id);

  if (!sapplicationname) {
    return next(new ErrorHandler("Applicationname Name not found!", 404));
  }
  return res.status(200).json({
    sapplicationname,
  });
});

// update Applicationname by id => /api/operatingsystem/:id
exports.updateApplicationname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uapplicationname = await Applicationname.findByIdAndUpdate(id, req.body);
  if (!uapplicationname) {
    return next(new ErrorHandler("Applicationname Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Applicationname by id => /api/operatingsystem/:id
exports.deleteApplicationname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dapplicationname = await Applicationname.findByIdAndRemove(id);

  if (!dapplicationname) {
    return next(new ErrorHandler("Applicationname Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
