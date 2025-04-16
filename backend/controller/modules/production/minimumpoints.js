const MinimumPoints = require("../../../model/modules/production/minimumpoints");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All MinimumPoints => /api/minimumpointss
exports.getAllMinimumPoints = catchAsyncErrors(async (req, res, next) => {
  let minimumpoints;
  try {
    minimumpoints = await MinimumPoints.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!minimumpoints) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    minimumpoints,
  });
});

// Create new MinimumPoints=> /api/minimumpoints/new
exports.addMinimumPoints = catchAsyncErrors(async (req, res, next) => {
  let aminimumpoints = await MinimumPoints.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle MinimumPoints => /api/minimumpoints/:id
exports.getSingleMinimumPoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sminimumpoints = await MinimumPoints.findById(id);

  if (!sminimumpoints) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sminimumpoints,
  });
});

// update MinimumPoints by id => /api/minimumpoints/:id
exports.updateMinimumPoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uminimumpoints = await MinimumPoints.findByIdAndUpdate(id, req.body);
  if (!uminimumpoints) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete MinimumPoints by id => /api/minimumpoints/:id
exports.deleteMinimumPoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dminimumpoints = await MinimumPoints.findByIdAndRemove(id);

  if (!dminimumpoints) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.deleteMultipleMinimumPoints = catchAsyncErrors(
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
      await MinimumPoints.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.getAllMinimumPointsAcessbranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  
    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
        unit: item.unit,
      }))
    };

  let minimumpoints;
  try {
    minimumpoints = await MinimumPoints.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!minimumpoints) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    minimumpoints,
  });
});