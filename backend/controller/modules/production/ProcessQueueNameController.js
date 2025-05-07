const ProcessQueueName = require("../../../model/modules/production/ProcessQueueNameModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProcessQueueName => /api/processqueuename
exports.getAllProcessQueueName = catchAsyncErrors(async (req, res, next) => {
  let processqueuename;
  try {
    processqueuename = await ProcessQueueName.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!processqueuename) {
    return next(new ErrorHandler("Process Queue Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    processqueuename,
  });
});

// Create new ProcessQueueName=> /api/processqueuename/new
exports.addProcessQueueName = catchAsyncErrors(async (req, res, next) => {
  let aprocessqueuename = await ProcessQueueName.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProcessQueueName => /api/processqueuename/:id
exports.getSingleProcessQueueName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sprocessqueuename = await ProcessQueueName.findById(id);

  if (!sprocessqueuename) {
    return next(new ErrorHandler("Process Queue Name not found!", 404));
  }
  return res.status(200).json({
    sprocessqueuename,
  });
});

// update ProcessQueueName by id => /api/processqueuename/:id
exports.updateProcessQueueName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uprocessqueuename = await ProcessQueueName.findByIdAndUpdate(id, req.body);
  if (!uprocessqueuename) {
    return next(new ErrorHandler("Process Queue Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProcessQueueName by id => /api/processqueuename/:id
exports.deleteProcessQueueName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dprocessqueuename = await ProcessQueueName.findByIdAndRemove(id);

  if (!dprocessqueuename) {
    return next(new ErrorHandler("Process Queue Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


exports.processQueueNameSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await ProcessQueueName.countDocuments();

      result = await ProcessQueueName.find()
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