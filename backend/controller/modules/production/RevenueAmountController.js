const RevenueAmount = require("../../../model/modules/production/RevenueAmountModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All RevenueAmount => /api/revenueamounts
exports.getAllRevenueAmount = catchAsyncErrors(async (req, res, next) => {
  let revenueamounts;
  try {
    revenueamounts = await RevenueAmount.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!revenueamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    revenueamounts,
  });
});

// get All RevenueAmount => /api/revenueamounts
exports.getRevenueamountLimited = catchAsyncErrors(async (req, res, next) => {
  let revenueamounts;
  try {
    revenueamounts = await RevenueAmount.find({}, { company: 1, branch: 1, processcode: 1, amount: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!revenueamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    revenueamounts,
  });
});

// get All RevenueAmount => /api/revenueamounts
exports.getRevenueamountLimited = catchAsyncErrors(async (req, res, next) => {
  let revenueamounts;
  try {
    revenueamounts = await RevenueAmount.find({}, { company: 1, branch: 1, processcode: 1, amount: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!revenueamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    revenueamounts,
  });
});

// Create new RevenueAmount=> /api/revenueamount/new
exports.addRevenueAmount = catchAsyncErrors(async (req, res, next) => {
  let arevenueamount = await RevenueAmount.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle RevenueAmount => /api/revenueamount/:id
exports.getSingleRevenueAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let srevenueamount = await RevenueAmount.findById(id);

  if (!srevenueamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    srevenueamount,
  });
});

// update RevenueAmount by id => /api/revenueamount/:id
exports.updateRevenueAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let urevenueamount = await RevenueAmount.findByIdAndUpdate(id, req.body);
  if (!urevenueamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete RevenueAmount by id => /api/revenueamount/:id
exports.deleteRevenueAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let drevenueamount = await RevenueAmount.findByIdAndRemove(id);

  if (!drevenueamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getOverallRevenueAmountSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

    totalProjects = await RevenueAmount.countDocuments();

    result = await RevenueAmount.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects,
    result,
    currentPage: page,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});


exports.revenueAmountfileDel = catchAsyncErrors(
  async (req, res, next) => {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorHandler("Invalid IDs provided", 400));
    }

    // Define a batch size for deletion
    // const batchSize = Math.ceil(ids.length / 10);
    const batchSize = 10000;

    // Loop through IDs in batches
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);

      // Delete records in the current batch
      await RevenueAmount.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.getAllRevenueAmountAssignBranch = catchAsyncErrors(async (req, res, next) => {

  const { assignbranch } = req.body;
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let revenueamounts;
  try {
    revenueamounts = await RevenueAmount.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!revenueamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    revenueamounts,
  });
});



exports.getRevenueamountLimitedHome = catchAsyncErrors(async (req, res, next) => {
  let revenueamounts;
  try {
    revenueamounts = await RevenueAmount.find({ processcode: { $in: req.body.processcode } }, { company: 1, branch: 1, processcode: 1, amount: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!revenueamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    revenueamounts,
  });
});