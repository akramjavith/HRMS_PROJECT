const PageModel = require("../../../model/modules/project/pagemodel");
const Subproject = require("../../../model/modules/project/subproject");
const Module = require("../../../model/modules/project/module");
const SubModule = require("../../../model/modules/project/submodule");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All PageModel =>/api/pagemodels
exports.getAllPageModel = catchAsyncErrors(async (req, res, next) => {
  let pagemodel;
  try {
    pagemodel = await PageModel.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagemodel) {
    return next(new ErrorHandler("Page model not found!", 404));
  }
  return res.status(200).json({
    pagemodel,
  });
});
exports.getAllPageModellimited = catchAsyncErrors(async (req, res, next) => {
  let pagemodel;
  try {
    pagemodel = await PageModel.find({}, { project: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagemodel) {
    return next(new ErrorHandler("Page model not found!", 404));
  }
  return res.status(200).json({
    pagemodel,
  });
});

//get All Subprojects =>/api/pagemodels
exports.getAllSubprojectsDrop = catchAsyncErrors(async (req, res, next) => {
  let subprojects;
  try {
    subprojects = await Subproject.find({ project: req.body.project });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subprojects) {
    return next(new ErrorHandler("subprojects not found!", 404));
  }
  return res.status(200).json({
    subprojects,
  });
});

//get All Module =>/api/pagemodels
exports.getAllModuleDrop = catchAsyncErrors(async (req, res, next) => {
  let modules, module;
  let sub = req.body.subproject;
  let proj = req.body.project;
  try {
    module = await Module.find();
    modules = module.filter((data) => data.project === proj && data.subproject === sub);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!modules) {
    return next(new ErrorHandler("Page model not found!", 404));
  }
  return res.status(200).json({
    modules,
  });
});
//get All SubModule =>/api/pagemodels
exports.getAllSubModuleDrop = catchAsyncErrors(async (req, res, next) => {
  let submodules, submod;
  let project = req.body.project;
  let sub = req.body.subproject;
  let modulename = req.body.modulename;
  try {
    submod = await SubModule.find({ endpage: "notend" });
    submodules = submod.filter((data) => data.project === project && data.subproject === sub && data.module === modulename);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!submodules) {
    return next(new ErrorHandler("Sub Module not found!", 404));
  }
  return res.status(200).json({
    submodules,
  });
});

//get All PageTypeMain =>/api/pagetypemain
exports.getAllPageTypeMain = catchAsyncErrors(async (req, res, next) => {
  let pagetypemain, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;
  let pagType = req.body.pagetype === "SUBPAGE" ? "MAINPAGE" : req.body.pagetype === "SUBSUBPAGE" ? "MAINPAGE" : "";
  try {
    pagetype = await PageModel.find({ pagetypename: pagType });
    pagetypemain = pagetype.filter((data) => data.submodule === submod && proj === data.project && mod === data.module && data.subproject === subproj);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypemain) {
    return next(new ErrorHandler("Main Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypemain,
  });
});

exports.getAllPageTypeMainmulti = catchAsyncErrors(async (req, res, next) => {
  let pagetypemain, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;

  try {
    pagetype = await PageModel.find();
    pagetypemain = pagetype.filter((data) => submod.includes(data.submodule) && proj.includes(data.project) && mod.includes(data.module) && subproj.includes(data.subproject));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypemain) {
    return next(new ErrorHandler("Main Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypemain,
  });
});

//get All PageTypeMain =>/api/pagetypemain
exports.getAllPageTypeSubSubPagesDrop = catchAsyncErrors(async (req, res, next) => {
  let pagetypesub, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;

  try {
    pagetype = await PageModel.find();
    pagetypesub = pagetype.filter((data) => data.mainpage === req.body.mainpage && data.submodule === submod && proj === data.project && mod === data.module && data.subproject === subproj);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypesub) {
    return next(new ErrorHandler("Sub Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypesub,
  });
});

//get All PageTypeMain =>/api/pagetypemain
exports.getAllPageTypeSubPagesDrop = catchAsyncErrors(async (req, res, next) => {
  let pagetypesub, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;
  let pagType = req.body.pagetype === "SUBPAGE" ? "MAINPAGE" : req.body.pagetype === "SUBSUBPAGE" ? "SUBPAGE" : "";
  try {
    pagetype = await PageModel.find({ pagetypename: pagType,mainpage:{$ne:""}, });
    pagetypesub = pagetype.filter((data) => data.mainpage === req.body.mainpage && data.submodule === submod && proj === data.project && mod === data.module && data.subproject === subproj);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypesub) {
    return next(new ErrorHandler("Sub Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypesub,
  });
});

exports.getAllPageTypeSubPagesDropmulti = catchAsyncErrors(async (req, res, next) => {
  let pagetypesub, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;
  let main = req.body.mainpage;
  try {
    pagetype = await PageModel.find({
      mainpage:{$ne:""},
      subpage:{$ne:""}
    });
    pagetypesub = pagetype.filter((data) => main.includes(data.mainpage)  && submod.includes(data.submodule) && proj.includes(data.project) && mod.includes(data.module) && subproj.includes(data.subproject));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypesub) {
    return next(new ErrorHandler("Sub Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypesub,
  });
});

exports.getAllPageTypeSubSubPagesDropmulti = catchAsyncErrors(async (req, res, next) => {
  let pagetypesub, pagetype;
  let proj = req.body.project;
  let subproj = req.body.subproject;
  let mod = req.body.module;
  let submod = req.body.submodule;
  let subpage = req.body.subpage;
  let main = req.body.mainpage;

  try {
 
    pagetype = await PageModel.find({
      subpage:{$ne:""},
      name:{$ne:""}
    });
    pagetypesub = pagetype.filter((data) => 
    subpage.includes(data.subpage) && main.includes(data.mainpage) && submod.includes(data.submodule) 
    && proj.includes(data.project) && mod.includes(data.module) && subproj.includes(data.subproject)
   
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypesub) {
    return next(new ErrorHandler("Sub Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypesub,
  });
});

exports.getAllPageTypeMainEstimationTime = catchAsyncErrors(async (req, res, next) => {
  let pagetypemainEst, pagetype;

  try {
    pagetypemainEst = await PageModel.find({ name: req.body.pagetypemain });
    // pagetypemain = pagetype.filter((data)=> data.submodule === submod)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pagetypemainEst) {
    return next(new ErrorHandler("Main Page Dropdowns not found!", 404));
  }
  return res.status(200).json({
    pagetypemainEst,
  });
});

//create new submodule => /api/submodule/new
exports.addPageModel = catchAsyncErrors(async (req, res, next) => {
  // let pagemodel = await SubModule.findOne({ name: req.body.name });
  // if (checksubproj) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let apagemodel = await PageModel.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single PageModel => /api/submodule/:id
exports.getSinglePageModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let spagemodel = await PageModel.findById(id);
  if (!spagemodel) {
    return next(new ErrorHandler("Page Model not found", 404));
  }
  return res.status(200).json({
    spagemodel,
  });
});

//update PageModel by id => /api/PageModel/:id
exports.updatePageModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upagemodel = await PageModel.findByIdAndUpdate(id, req.body);
  if (!upagemodel) {
    return next(new ErrorHandler("Page Model not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete PageModel by id => /api/PageModel/:id
exports.deletePageModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dpagemodel = await PageModel.findByIdAndRemove(id);
  if (!dpagemodel) {
    return next(new ErrorHandler("Page Model not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});