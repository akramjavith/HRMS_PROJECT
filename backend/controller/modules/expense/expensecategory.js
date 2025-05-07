const Expensecategory = require("../../../model/modules/expense/expensecategory");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Expensecategories =>/api/expensecategories
exports.getAllExpCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    let expensecategory = await Expensecategory.find();
    if (!expensecategory) {
      return next(new ErrorHandler("Expensecategory not found!", 404));
    }
    return res.status(200).json({
      expensecategory,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//create new expensecategory => /api/expensecategory/new
exports.addExpCategory = catchAsyncErrors(async (req, res, next) => {
  let aexpensecategory = await Expensecategory.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single expensecategory => /api/expensecategory/:id
exports.getSingleExpCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sexpensecategory = await Expensecategory.findById(id);
  if (!sexpensecategory) {
    return next(new ErrorHandler("Expensecategory not found", 404));
  }
  return res.status(200).json({
    sexpensecategory,
  });
});
//update expensecategory by id => /api/expensecategory/:id
exports.updateExpCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uexpensecategory = await Expensecategory.findByIdAndUpdate(id, req.body);
  if (!uexpensecategory) {
    return next(new ErrorHandler("Expensecategory not found", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

//delete expensecategory by id => /api/expensecategory/:id
exports.deleteExpCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dexpensecategory = await Expensecategory.findByIdAndRemove(id);
  if (!dexpensecategory) {
    return next(new ErrorHandler("Expensecategory not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.ExpenseCategoryAutoId = catchAsyncErrors(async (req, res, next) => {
  let autoid;
  try {
    // Find the last expense category document sorted by _id in descending order
    const lastexpense = await Expensecategory.findOne().sort({ _id: -1 });

    // Check if there's any document in the collection
    if (!lastexpense) {
      // If no document found, start with EC0001
      autoid = "EC0001";
    } else {
      // If a document is found, get the last generated autoid
      let lastAutoId = lastexpense.categorycode; // Assuming you have 'autoid' field in the document

      // Extract the numeric part from the last autoid
      let codenum = lastAutoId ? lastAutoId.split("EC")[1] : "0000";
      // Increment the numeric part by 1
      let nextIdNum = parseInt(codenum, 10) + 1;

      // Convert the number back to a string and pad it with leading zeros
      let nextIdStr = String(nextIdNum).padStart(4, "0");

      // Form the next autoid
      autoid = "EC" + nextIdStr;
    }
  } catch (err) {
    return next(new ErrorHandler("Record not found!", 404));
  }

  return res.status(200).json({
    autoid,
  });
});