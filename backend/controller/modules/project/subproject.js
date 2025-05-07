const Subproject = require("../../../model/modules/project/subproject");
const Project = require("../../../model/modules/project/project");
const Module = require("../../../model/modules/project/module");
const SubModule = require("../../../model/modules/project/submodule");
const Mainpage = require("../../../model/modules/project/mainpage");
const Subpageone = require("../../../model/modules/project/subpageone");
const Subpagetwo = require("../../../model/modules/project/subpagetwo");
const Subpagethree = require("../../../model/modules/project/subpagethree");
const Subpagefour = require("../../../model/modules/project/subpagefour");
const Subpagefive = require("../../../model/modules/project/subpagefive");
const Task = require("../../../model/modules/project/task");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Subproject Details => /api/Subprojects
exports.getAllSubproject = catchAsyncErrors(async (req, res, next) => {
  let subprojects;
  try {
    subprojects = await Subproject.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojects) {
    return next(new ErrorHandler("Subproject details not found", 404));
  }
  return res.status(200).json({
    // count: Subproject.length,
    subprojects,
  });
});
// get All Subproject Details => /api/Subprojects
exports.getAllSubprojectLimit = catchAsyncErrors(async (req, res, next) => {
  let subprojects;
  try {
    subprojects = await Subproject.find({}, { name: 1, project: 1, estimation: 1, estimationtime: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojects) {
    return next(new ErrorHandler("Subproject details not found", 404));
  }
  return res.status(200).json({
    // count: Subproject.length,
    subprojects,
  });
});

// getting linked data with task and project name in create page
exports.getRelatedTaskSub = catchAsyncErrors(async (req, res, next) => {
  let subprojTask;
  try {
    subprojTask = await Project.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojTask) {
    return next(new ErrorHandler("Project Linked with task details not found", 404));
  }
  return res.status(200).json({
    count: subprojTask.length,
    subprojTask,
  });
});

// getting linked data with task and project name in create page
exports.getRelatedTaskSubEdit = catchAsyncErrors(async (req, res, next) => {
  let subprojTask;
  try {
    subprojTask = await Subproject.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojTask) {
    return next(new ErrorHandler("Subproject Linked with task details not found", 404));
  }
  return res.status(200).json({
    count: subprojTask.length,
    subprojTask,
  });
});
exports.overallSubProject = catchAsyncErrors(async (req, res, next) => {
  let module, submodule, mainpage, subpage1, subpage2, subpage3, subpage4, subpage5, task;
  try {
    module = await Module.find({ subproject: req.body.oldname });
    submodule = await SubModule.find({ subproject: req.body.oldname });
    mainpage = await Mainpage.find({ subproject: req.body.oldname });
    subpage1 = await Subpageone.find({ subproject: req.body.oldname });
    subpage2 = await Subpagetwo.find({ subproject: req.body.oldname });
    subpage3 = await Subpagethree.find({ subproject: req.body.oldname });
    subpage4 = await Subpagefour.find({ subproject: req.body.oldname });
    subpage5 = await Subpagefive.find({ subproject: req.body.oldname });
    task = await Task.find({ subproject: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!module) {
    return next(new ErrorHandler("Subproject details not found", 404));
  }
  return res.status(200).json({
    count: module.length + submodule.length + mainpage.length + subpage1.length + subpage2.length + subpage3.length + subpage4.length + subpage5.length + task.length,
    module,
    submodule,
    mainpage,
    subpage1,
    subpage2,
    subpage3,
    subpage4,
    subpage5,
    task,
  });
});

// get overall delete functionality
exports.getProjectToSubproject = catchAsyncErrors(async (req, res, next) => {
  let subprojects;
  try {
    subprojects = await Subproject.find();

    let query = {
      project: req.body.checkprojecttosub,
    };
    subprojects = await Subproject.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojects) {
    return next(new ErrorHandler("Subproject details not found", 404));
  }
  return res.status(200).json({
    subprojects,
  });
});

// Create new Subproject => /api/subproject/new
exports.addSubproject = catchAsyncErrors(async (req, res, next) => {
  let checksubproj = await Subproject.findOne({ name: req.body.name });
  if (checksubproj) {
    return next(new ErrorHandler("Name already exist!", 400));
  }
  let asubproject = await Subproject.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Signle Subproject => /api/subproject/:id
exports.getSingleSubproject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ssubprojects = await Subproject.findById(id);
  if (!ssubprojects) {
    return next(new ErrorHandler("Subproject not found", 404));
  }
  return res.status(200).json({
    ssubprojects,
  });
});
// update Subproject by id => /api/subproject/:id
exports.updateSubproject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upsubprojects = await Subproject.findByIdAndUpdate(id, req.body);
  if (!upsubprojects) {
    return next(new ErrorHandler("Subproject Details not found", 404));
  }
  return res.status(200).json({ message: "Updates successfully" });
});

// delete Subproject by id => /api/subproject/:id
exports.deleteSubproject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dsubprojects = await Subproject.findByIdAndRemove(id);
  if (!dsubprojects) {
    return next(new ErrorHandler("Subproject Details not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
