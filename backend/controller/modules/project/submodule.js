const SubModule = require("../../../model/modules/project/submodule");
const Module = require("../../../model/modules/project/module");
const Mainpage = require("../../../model/modules/project/mainpage");
const Subpageone = require("../../../model/modules/project/subpageone");
const Subpagetwo = require("../../../model/modules/project/subpagetwo");
const Subpagethree = require("../../../model/modules/project/subpagethree");
const Subpagefour = require("../../../model/modules/project/subpagefour");
const Subpagefive = require("../../../model/modules/project/subpagefive");
const Task = require("../../../model/modules/project/task");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
//get All SubModule =>/api/submodules
exports.getAllSubModule = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await SubModule.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});

//get All SubModule =>/api/submodules
exports.getAllSubmoduleLimit = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await SubModule.find({}, { name: 1, project: 1, subproject: 1, module: 1, estimation: 1, estimationtime: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});

//checking whether the module is linked with task or not in create
exports.getSubModuleTaskCheck = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await Module.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
    count: submodules.length,
  });
});
//checking whether the submodule is linked with task or not in edit
exports.getSubModuleTaskCheckEdit = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  let page = req.body.page;
  try {
    submodules = page === "mainpage" ? await Mainpage.find({ name: req.body.name, stateassign: "assigned" }) : page === "subpage1" ? await Subpageone.find({ name: req.body.name, stateassign: "assigned" }) : page === "subpage2" ? await Subpagetwo.find({ name: req.body.name, stateassign: "assigned" }) : page === "subpage3" ? await Subpagethree.find({ name: req.body.name, stateassign: "assigned" }) : page === "subpage4" ? await Subpagefour.find({ name: req.body.name, stateassign: "assigned" }) : await Subpagefive.find({ name: req.body.name, stateassign: "assigned" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
    count: submodules.length,
  });
});
exports.getoverallsubmodule = catchAsyncErrors(async (req, res, next) => {
  let mainpage, subpage1, subpage2, subpage3, subpage4, subpage5, task;
  try {
    mainpage = await Mainpage.find({ submodule: req.body.oldname });
    subpage1 = await Subpageone.find({ submodule: req.body.oldname });
    subpage2 = await Subpagetwo.find({ submodule: req.body.oldname });
    subpage3 = await Subpagethree.find({ submodule: req.body.oldname });
    subpage4 = await Subpagefour.find({ submodule: req.body.oldname });
    subpage5 = await Subpagefive.find({ submodule: req.body.oldname });
    task = await Task.find({ submodule: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!mainpage) {
    return next(new ErrorHandler("main page details not found", 404));
  }
  return res.status(200).json({
    count: mainpage.length + subpage1.length + subpage2.length + subpage3.length + subpage4.length + subpage5.length + task.length,
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
exports.getProjectToSubModule = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await SubModule.find();
    let query = {
      project: req.body.checkprojtosubmodule,
    };
    submodules = await SubModule.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});
exports.getSubProjectToSubModule = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await SubModule.find();
    let query = {
      subproject: req.body.checksubprojtosubmodule,
    };
    submodules = await SubModule.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});
exports.getModuleToSubModule = catchAsyncErrors(async (req, res, next) => {
  let submodules;
  try {
    submodules = await SubModule.find();
    let query = {
      module: req.body.checkmoduletosubmodule,
    };
    submodules = await SubModule.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("SubModule not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});
//create new submodule => /api/submodule/new
exports.addSubModule = catchAsyncErrors(async (req, res, next) => {
  let checksubproj = await SubModule.findOne({ name: req.body.name });

  let asubmodule = await SubModule.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single submodule => /api/submodule/:id
exports.getSingleSubModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ssubmodule = await SubModule.findById(id);
  if (!ssubmodule) {
    return next(new ErrorHandler("SubModule not found", 404));
  }
  return res.status(200).json({
    ssubmodule,
  });
});
//update submodule by id => /api/submodule/:id
exports.updateSubModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let usubmodule = await SubModule.findByIdAndUpdate(id, req.body);
  if (!usubmodule) {
    return next(new ErrorHandler("SubModule not found", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});
//delete submodule by id => /api/submodule/:id
exports.deleteSubModule = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dsubmodule = await SubModule.findByIdAndRemove(id);
  if (!dsubmodule) {
    return next(new ErrorHandler("SubModule not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
