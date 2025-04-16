const Module = require("../../../model/modules/project/module");
const Subproject = require("../../../model/modules/project/subproject");
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
//get All Module =>/api/modules
exports.getAllModule = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Module not found!", 404));
  }
  return res.status(200).json({
    modules,
  });
});

//get All Module =>/api/modules
exports.getAllModuleLimit = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find({}, { name: 1, project: 1, subproject: 1, estimation: 1, estimationtime: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Module not found!", 404));
  }
  return res.status(200).json({
    modules,
  });
});
//checking whether the module data is linked with task or not in create
exports.getModuleTaskCheck = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Subproject.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("SubProject data Linked with Task not found!", 404));
  }
  return res.status(200).json({
    modules,
    count: modules.length,
  });
});
//checking whether the module is linked with task or not in edit
exports.getModuleTaskCheckEdit = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Module linked with Task details not found!", 404));
  }
  return res.status(200).json({
    modules,
    count: modules.length,
  });
});

exports.getoverallmodule = catchAsyncErrors(async (req, res, next) => {
  let submodule, mainpage, subpage1, subpage2, subpage3, subpage4, subpage5, task;
  try {
    submodule = await SubModule.find({ module: req.body.oldname });
    mainpage = await Mainpage.find({ module: req.body.oldname });
    subpage1 = await Subpageone.find({ module: req.body.oldname });
    subpage2 = await Subpagetwo.find({ module: req.body.oldname });
    subpage3 = await Subpagethree.find({ module: req.body.oldname });
    subpage4 = await Subpagefour.find({ module: req.body.oldname });
    subpage5 = await Subpagefive.find({ module: req.body.oldname });
    task = await Task.find({ module: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodule) {
    return next(new ErrorHandler("Module details not found", 404));
  }
  return res.status(200).json({
    count: submodule.length + mainpage.length + subpage1.length + subpage2.length + subpage3.length + subpage4.length + subpage5.length + task.length,
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

exports.getProjectToModule = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find();

    let query = {
      project: req.body.checkprojecttomodule,
    };
    modules = await Module.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Module not found!", 404));
  }
  return res.status(200).json({
    modules,
  });
});

exports.getSubProjectToModule = catchAsyncErrors(async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find();

    let query = {
      subproject: req.body.checksubprojecttomodule,
    };
    modules = await Module.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Module not found!", 404));
  }
  return res.status(200).json({
    modules,
  });
});

//create new module => /api/module/new
exports.addModule = catchAsyncErrors(async (req, res, next) => {
  let amodule = await Module.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single module => /api/module/:id
exports.getSingleModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let smodule = await Module.findById(id);
  if (!smodule) {
    return next(new ErrorHandler("Module not found", 404));
  }
  return res.status(200).json({
    smodule,
  });
});

//update module by id => /api/module/:id
exports.updateModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umodule = await Module.findByIdAndUpdate(id, req.body);
  if (!umodule) {
    return next(new ErrorHandler("Module not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete module by id => /api/module/:id
exports.deleteModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dmodule = await Module.findByIdAndRemove(id);
  if (!dmodule) {
    return next(new ErrorHandler("Module not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
