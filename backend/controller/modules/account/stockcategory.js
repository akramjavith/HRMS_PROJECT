const StockCategory = require("../../../model/modules/account/stockcategory");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All StockCategory => /api/stockcategorys
exports.getAllStockCategory = catchAsyncErrors(async (req, res, next) => {
  let stockcategory;
  try {
    stockcategory = await StockCategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stockcategory) {
    return next(new ErrorHandler("StockCategory not found!", 404));
  }

  // Add serial numbers to the stock category
  const allstockcategory = stockcategory.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    stockcategory: allstockcategory,
  });
});

// Create new StockCategory=> /api/stockcategory/new
exports.addStockCategory = catchAsyncErrors(async (req, res, next) => {
  let astockcategory = await StockCategory.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle StockCategory => /api/stockcategory/:id
exports.getSingleStockCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sstockcategory = await StockCategory.findById(id);

  if (!sstockcategory) {
    return next(new ErrorHandler("StockCategory not found!", 404));
  }
  return res.status(200).json({
    sstockcategory,
  });
});

// update StockCategory by id => /api/stockcategory/:id
exports.updateStockCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ustockcategory = await StockCategory.findByIdAndUpdate(id, req.body);

  if (!ustockcategory) {
    return next(new ErrorHandler("StockCategory not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete StockCategory by id => /api/stockcategory/:id
exports.deleteStockCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dstockcategory = await StockCategory.findByIdAndRemove(id);

  if (!dstockcategory) {
    return next(new ErrorHandler("StockCategory not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.StockCategoryAutoId = catchAsyncErrors(async (req, res, next) => {
  let autoid;
  try {
    // Find the last expense category document sorted by _id in descending order
    const stockcategory = await StockCategory.findOne().sort({ _id: -1 });

    // Check if there's any document in the collection
    if (!stockcategory) {
      // If no document found, start with EC0001
      autoid = "STC0001";
    } else {
      // If a document is found, get the last generated autoid
      let lastAutoId = stockcategory.categorycode; // Assuming you have 'autoid' field in the document

      // Extract the numeric part from the last autoid
      let codenum = lastAutoId ? lastAutoId.split("STC")[1] : "0000";
      // Increment the numeric part by 1
      let nextIdNum = parseInt(codenum, 10) + 1;

      // Convert the number back to a string and pad it with leading zeros
      let nextIdStr = String(nextIdNum).padStart(4, "0");

      // Form the next autoid
      autoid = "STC" + nextIdStr;
    }
  } catch (err) {
    return next(new ErrorHandler("Record not found!", 404));
  }

  return res.status(200).json({
    autoid,
  });
});
