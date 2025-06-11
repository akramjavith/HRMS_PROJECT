const TempcategoryTimeLog = require("../../../model/modules/production/tempcategorytimelog");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


// get All TempcategoryTimeLog Name => /api/alltempcategorytimelog
exports.getAllTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let tempcategorytimelog;
    try {
      tempcategorytimelog = await TempcategoryTimeLog.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // count: products.length,
      tempcategorytimelog,
    });
  }
);



// Create new TempcategoryTimeLog=> /api/tempcategorytimelog/new
exports.addTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let atempcategorytimelog = await TempcategoryTimeLog.create(
      req.body
    );

    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Signle TempcategoryTimeLog => /api/tempcategorytimelog/:id
exports.getSingleTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let stempcategorytimelog = await TempcategoryTimeLog.findById(id);

    if (!stempcategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
      stempcategorytimelog,
    });
  }
);

// update TempcategoryTimeLog by id => /api/tempcategorytimelog/:id
exports.updateTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    if (!utempcategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

// delete TempcategoryTimeLog by id => /api/tempcategorytimelog/:id
exports.deleteTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let dtempcategorytimelog =
      await TempcategoryTimeLog.findByIdAndRemove(id);

    if (!dtempcategorytimelog) {
      return next(new ErrorHandler("Data  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);


