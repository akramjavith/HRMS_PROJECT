
const ProductionDayTemp = require('../../../model/modules/production/productiondaytemp');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionDayTemp => /api/productiondayss
exports.getAllProductionDayTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondays;
  try {
    productiondays = await ProductionDayTemp.find();
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

// get All ProductionOriginalLIMITED => /api/productionoriginalslimited
exports.getAllProductionDayUniqidTemp = catchAsyncErrors(async (req, res, next) => {
  let productionDay, productionDayid;
  try {
    // productionoriginal = await ProductionOriginal.find();
    productionDay = await ProductionDayTemp.findOne()
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

// get All ProductionDayTemp => /api/productiondayss
exports.checkIsProdDayCreatedTemp = catchAsyncErrors(async (req, res, next) => {
  let count;
  try {
    count = await ProductionDayTemp.countDocuments({ date: req.body.date });
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    count,
  });
});


// Create new ProductionDayTemp=> /api/productiondays/new
exports.addProductionDayTemp = catchAsyncErrors(async (req, res, next) => {

  let aproductiondays = await ProductionDayTemp.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionDayTemp => /api/productiondays/:id
exports.getSingleProductionDayTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductiondays = await ProductionDayTemp.findById(id);

  if (!sproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductiondays,
  });
});

// update ProductionDayTemp by id => /api/productiondays/:id
exports.updateProductionDayTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductiondays = await ProductionDayTemp.findByIdAndUpdate(id, req.body);
  if (!uproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionDayTemp by id => /api/productiondays/:id
exports.deleteProductionDayTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductiondays = await ProductionDayTemp.findByIdAndRemove(id);

  if (!dproductiondays) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
