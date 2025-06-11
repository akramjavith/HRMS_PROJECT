const categoryTimeLog = require("../../../model/modules/production/categorytimelog");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


// get All categoryTimeLog Name => /api/allcategorytimelog
exports.getAllcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let categorytimelog;
    try {
      categorytimelog = await categoryTimeLog.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // count: products.length,
      categorytimelog,
    });
  }
);



// Create new categoryTimeLog=> /api/categorytimelog/new
exports.addcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let acategorytimelog = await categoryTimeLog.create(
      req.body
    );

    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Signle categoryTimeLog => /api/categorytimelog/:id
exports.getSinglecategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let scategorytimelog = await categoryTimeLog.findById(id);

    if (!scategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
      scategorytimelog,
    });
  }
);

// update categoryTimeLog by id => /api/categorytimelog/:id
exports.updatecategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    if (!ucategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

// delete categoryTimeLog by id => /api/categorytimelog/:id
exports.deletecategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let dcategorytimelog =
      await categoryTimeLog.findByIdAndRemove(id);

    if (!dcategorytimelog) {
      return next(new ErrorHandler("Data  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);


