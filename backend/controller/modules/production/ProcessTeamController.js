const ProcessTeam = require("../../../model/modules/production/ProcessTeamModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProcessTeam => /api/processteams
exports.getAllProcessTeam = catchAsyncErrors(async (req, res, next) => {
  let processteam;
  try {
    processteam = await ProcessTeam.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!processteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    processteam,
  });
});

exports.processTeamSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await ProcessTeam.countDocuments();

      result = await ProcessTeam.find()
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

exports.getFilterProcessNamesLimited = catchAsyncErrors(async (req, res, next) => {
  let processteam;
  try {
 
    processteam = await ProcessTeam.find({},{_id:0,process:1,company:1,branch:1,unit:1,team:1});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!processteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    processteam,
  });
});

exports.getFilterProcessNames = catchAsyncErrors(async (req, res, next) => {
  let processteam;
  try {
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "ALL") {
          query[key] = value.toString();
        }
      }
    });
    processteam = await ProcessTeam.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!processteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    processteam,
  });
});

// Create new ProcessTeam=> /api/processteam/new
exports.addProcessTeam = catchAsyncErrors(async (req, res, next) => {
  let aprocessteam = await ProcessTeam.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProcessTeam => /api/processteam/:id
exports.getSingleProcessTeam = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sprocessteam = await ProcessTeam.findById(id);

  if (!sprocessteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sprocessteam,
  });
});

// update ProcessTeam by id => /api/processteam/:id
exports.updateProcessTeam = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uprocessteam = await ProcessTeam.findByIdAndUpdate(id, req.body);
  if (!uprocessteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProcessTeam by id => /api/processteam/:id
exports.deleteProcessTeam = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dprocessteam = await ProcessTeam.findByIdAndRemove(id);

  if (!dprocessteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllProcessTeamAssignbranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;

  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let processteam;
  try {
    processteam = await ProcessTeam.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!processteam) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    processteam,
  });
});