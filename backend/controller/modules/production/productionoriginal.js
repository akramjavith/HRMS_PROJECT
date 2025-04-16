
const ProductionOriginal = require('../../../model/modules/production/productionoriginal');
const ProductionUpload = require("../../../model/modules/production/productionupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionOriginal => /api/productionoriginals
exports.getAllProductionOriginal = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal;
  try {
    productionoriginal = await ProductionOriginal.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionoriginal,
  });
});

// get All ProductionOriginal => /api/productionoriginals
exports.getAllProductionOriginalLimited = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal;
  try {
    productionoriginal = await ProductionOriginal.find({}, { datetimezone: 1, vendor: 1, fromdate: 1, todate: 1, overallcount: 1, percent: 1, createddate: 1, uniqueid: 1, addedby: 1 }).sort({ fromdate: -1, createdAt: -1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!productionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionoriginal,
  });
});

// get All ProductionOriginal => /api/productionoriginals
exports.getAllProductionOriginalLimitedFilter = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal;
  try {
    const { vendor, fromdate, todate } = req.body;

    let query = {};

    if (vendor.length > 0) {
      query.vendor = { $in: vendor };
    }
    if (fromdate != "" && todate != "") {
      (query.fromdate = { $gte: fromdate }), (query.todate = { $lte: todate });
    }

    productionoriginal = await ProductionOriginal.find(query, { datetimezone: 1, vendor: 1, fromdate: 1, todate: 1, overallcount: 1, percent: 1, createddate: 1, uniqueid: 1, addedby: 1 }).sort({ fromdate: -1, createdAt: -1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!productionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  console.log(productionoriginal.length);
  return res.status(200).json({
    // count: products.length,
    productionoriginal,
  });
});

// get All ProductionOriginalLIMITED => /api/productionoriginalslimited
exports.getAllProductionOriginalLimitedUniqid = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal, productionoriginalid;
  try {
    // productionoriginal = await ProductionOriginal.find();
    productionoriginalid = await ProductionOriginal.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    productionoriginal = productionoriginalid && productionoriginalid.uniqueid

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!productionoriginal) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    productionoriginal,
  });
});

// Create new ProductionOriginal=> /api/productionoriginal/new
exports.addProductionOriginal = catchAsyncErrors(async (req, res, next) => {

  let aproductionoriginal = await ProductionOriginal.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionOriginal => /api/productionoriginal/:id
exports.getSingleProductionOriginal = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductionoriginal = await ProductionOriginal.findById(id);

  if (!sproductionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductionoriginal,
  });
});

// update ProductionOriginal by id => /api/productionoriginal/:id
exports.updateProductionOriginal = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductionoriginal = await ProductionOriginal.findByIdAndUpdate(id, req.body);
  if (!uproductionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionOriginal by id => /api/productionoriginal/:id
exports.deleteProductionOriginal = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductionoriginal = await ProductionOriginal.findByIdAndRemove(id);

  if (!dproductionoriginal) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// get All ProductionOriginal => /api/productionoriginals
exports.getUniqidFromDateProdupload = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal, productionUpload, totalSum;
  try {
    const { date } = req.body;

    let dateoneafter = new Date(date);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split('T')[0];

    let datebefore = new Date(date);
    datebefore.setDate(datebefore.getDate() - 1);
    let newDateOneMinus = datebefore.toISOString().split('T')[0];

    //  productionoriginal = await ProductionOriginal.find({ fromdate: { $in: [date, newDateOnePlus] } }, { overallcount: 1, _id: 0 }).lean();

    // productionUpload = await ProductionUpload.countDocuments({ fromdate: { $in: [date, newDateOnePlus] } });

    let [productionoriginal, productionUpload] = await Promise.all([
      ProductionOriginal.find({ fromdate: { $in: [date, newDateOnePlus] } }, { overallcount: 1, _id: 0 }).lean(),
      ProductionUpload.countDocuments({ fromdate: { $in: [date, newDateOnePlus] } }),
    ]);

    totalSum = productionoriginal.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

    // totalSum = productionoriginal.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

    console.log(date, newDateOnePlus, newDateOneMinus, 'dfgdfg');

    // totalSum = productionoriginal.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

    console.log(totalSum, productionUpload, 'productionoriginalcheck');
    return res.status(200).json({
      // count: products.length,
      totalSum,
      productionUpload,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// get All ProductionOriginalLIMITED => /api/productionoriginalslimited
exports.productionOriginalLastThree = catchAsyncErrors(async (req, res, next) => {
  let productionoriginal;
  try {
    productionoriginal = await ProductionOriginal.find({}, { vendor: 1, percent: 1, addedby: 1, fromdate: 1, todate: 1, createddate: 1, _id: 0 }).sort({ fromdate: -1, createdAt: -1 }).limit(4);
  } catch (err) {
    console.log(err.message);
  }
  // if (!productionoriginal) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    productionoriginal,
  });
});