const NotAddedBills = require("../../../model/modules/expense/NotaddedBills");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All  =>/api/allschedulepaymentnotaddedbills
exports.getAllIgnoredNotAddedBills = catchAsyncErrors(
  async (req, res, next) => {
    let notaddedbills;
    try {
      notaddedbills = await NotAddedBills.find({
        ignored: true,
        billstatus: "NOTADDED",
      });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!notaddedbills) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
      notaddedbills,
    });
  }
);
exports.getAllIndividualNotAddedBills = catchAsyncErrors(
  async (req, res, next) => {
    let notaddedbills;
    try {
      notaddedbills = await NotAddedBills.find({
        ignored: false,
        billstatus: "NOTADDED",
      });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!notaddedbills) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
      notaddedbills,
    });
  }
);
exports.getAllNotAddedBills = catchAsyncErrors(async (req, res, next) => {
  let notaddedbills;
  try {
    const { assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };
    notaddedbills = await NotAddedBills.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!notaddedbills) {
    return next(new ErrorHandler("Data not found!", 404));
  }

  return res.status(200).json({
    notaddedbills,
  });
});
//create new schedulepaymentnotaddedbills => /api/schedulepaymentnotaddedbills/new
exports.addNotAddedBills = catchAsyncErrors(async (req, res, next) => {
  let anotaddedbills = await NotAddedBills.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single schedulepaymentnotaddedbills => /api/schedulepaymentnotaddedbills/:id
exports.getSingleNotAddedBills = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let snotaddedbills = await NotAddedBills.findById(id);
  if (!snotaddedbills) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({
    snotaddedbills,
  });
});
//update schedulepaymentnotaddedbills by id => /api/schedulepaymentnotaddedbills/:id
exports.updateNotAddedBills = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let unotaddedbills = await NotAddedBills.findByIdAndUpdate(id, req.body);
  if (!unotaddedbills) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Updated successfully", unotaddedbills });
});

//delete schedulepaymentnotaddedbills by id => /api/schedulepaymentnotaddedbills/:id
exports.deleteNotAddedBills = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dnotaddedbills = await NotAddedBills.findByIdAndRemove(id);
  if (!dnotaddedbills) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});