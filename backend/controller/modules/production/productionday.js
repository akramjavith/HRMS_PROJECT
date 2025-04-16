
const ProductionDay = require('../../../model/modules/production/productionday');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionDay => /api/productiondayss
exports.getAllProductionDay = catchAsyncErrors(async (req, res, next) => {
  let productiondays;
  try {
    productiondays = await ProductionDay.find();
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondays,
  });
});

// get All ProductionDay => /api/productiondayss
exports.checkIsProdDayCreated = catchAsyncErrors(async (req, res, next) => {
  let count;
  try {
    count = await ProductionDay.countDocuments({ date: req.body.date });
  } catch (err) {
    console.log(err.message);
  }  return res.status(200).json({
    count,
  });
});

// get All ProductionOriginalLIMITED => /api/productionoriginalslimited
exports.getAllProductionDayUniqid = catchAsyncErrors(async (req, res, next) => {
  let productionDay,productionDayid;
  try {
    // productionoriginal = await ProductionOriginal.find();
    productionDay = await ProductionDay.findOne()
    .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
    .exec();

    productionDayid = productionDay ? productionDay.uniqueid : 0

  } catch (err) {
    console.log(err.message);
  }
  // if (!productionoriginal) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    productionDayid,
  });
});


// Create new ProductionDay=> /api/productiondays/new
exports.addProductionDay = catchAsyncErrors(async (req, res, next) => {

  let aproductiondays = await ProductionDay.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionDay => /api/productiondays/:id
exports.getSingleProductionDay = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductiondays = await ProductionDay.findById(id);

  if (!sproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductiondays,
  });
});

// update ProductionDay by id => /api/productiondays/:id
exports.updateProductionDay = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductiondays = await ProductionDay.findByIdAndUpdate(id, req.body);
  if (!uproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionDay by id => /api/productiondays/:id
exports.deleteProductionDay = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductiondays = await ProductionDay.findByIdAndRemove(id);

  if (!dproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


