const Loan = require("../../model/modules/loan");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All Loan => /api/  
exports.getAllLoan = catchAsyncErrors(async (req, res, next) => {
  let loan;
  try {
    loan = await Loan.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!loan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    loan,
  });
});

// Create new Loan=> /api/Loan/new
exports.addLoan = catchAsyncErrors(async (req, res, next) => {

  let aloan = await Loan.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Loan => /api/Loan/:id
exports.getSingleLoan = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sloan = await Loan.findById(id);

  if (!sloan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sloan,
  });
});

// update Loan by id => /api/Loan/:id
exports.updateLoan = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uloan = await Loan.findByIdAndUpdate(id, req.body);
  if (!uloan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Loan by id => /api/Loan/:id
exports.deleteLoan = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dloan = await Loan.findByIdAndRemove(id);

  if (!dloan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllLoanByAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit
    }))
  };
  let loan;
  try {
    loan = await Loan.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!loan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    loan,
  });
});

exports.getAllLoanByAssignBranchHome = catchAsyncErrors(async (req, res, next) => {

  let loan;
  try {
    loan = await Loan.countDocuments();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!loan) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    loan,
  });
});


