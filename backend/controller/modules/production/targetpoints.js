const Targetpoints = require("../../../model/modules/production/targetpoints");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All targetpoints => /api/targetpoints
exports.getAlltargetpoints = catchAsyncErrors(async (req, res, next) => {
  let targetpoints;
  try {
    targetpoints = await Targetpoints.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!targetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    targetpoints,
  });
});

// get All targetpoints => /api/targetpoints
exports.getTargetpointslimited = catchAsyncErrors(async (req, res, next) => {
  let targetpoints;
  try {
    targetpoints = await Targetpoints.find({},{company:1, branch:1, points:1,processcode:1});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!targetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    targetpoints,
  });
});
// Create new targetpoints=> /api/targetpoints/new
exports.addtargetpoints = catchAsyncErrors(async (req, res, next) => {
  let atargetpoints = await Targetpoints.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle targetpoints => /api/targetpoints/:id
exports.getSingletargetpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let stargetpoints = await Targetpoints.findById(id);

  if (!stargetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({
    stargetpoints,
  });
});

// update targetpoints by id => /api/targetpoints/:id
exports.updatetargetpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utargetpoints = await Targetpoints.findByIdAndUpdate(id, req.body);
  if (!utargetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete targetpoints by id => /api/targetpoints/:id
exports.deletetargetpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtargetpoints = await Targetpoints.findByIdAndRemove(id);

  if (!dtargetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getOverallTargetpointsSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await Targetpoints.countDocuments();

      result = await Targetpoints.find()
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

exports.targetpointsbulkdelete = catchAsyncErrors(
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
      await Targetpoints.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.getTargetpointslimitedAssignedbranch = catchAsyncErrors(async (req, res, next) => {

  const {  assignbranch } = req.body;
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };


  let targetpoints;
  try {
    targetpoints = await Targetpoints.find(query, { company: 1, branch: 1, points: 1, processcode: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!targetpoints) {
    return next(new ErrorHandler("Targetpoints not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    targetpoints,
  });
});
