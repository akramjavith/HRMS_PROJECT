const Project = require("../../../model/modules/project/project");
const Subproject = require("../../../model/modules/project/subproject");
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
// get All Project Details => /api/projects
exports.getAllProject = catchAsyncErrors(async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!projects) {
    return next(new ErrorHandler("Project not found", 404));
  }
  return res.status(200).json({
    // count: Project.length,
    projects,
  });
});

exports.overallProject = catchAsyncErrors(async (req, res, next) => {
  let subproject, module, submodule, mainpage, subpage1, subpage2, subpage3, subpage4, subpage5;
  try {
    subproject = await Subproject.find({ project: req.body.oldname });
    module = await Module.find({ project: req.body.oldname });
    submodule = await SubModule.find({ project: req.body.oldname });
    mainpage = await Mainpage.find({ project: req.body.oldname });
    subpage1 = await Subpageone.find({ project: req.body.oldname });
    subpage2 = await Subpagetwo.find({ project: req.body.oldname });
    subpage3 = await Subpagethree.find({ project: req.body.oldname });
    subpage4 = await Subpagefour.find({ project: req.body.oldname });
    subpage5 = await Subpagefive.find({ project: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!subproject) {
    return next(new ErrorHandler("Project not found", 404));
  }
  return res.status(200).json({
    count: subproject.length + module.length + submodule.length + mainpage.length + subpage1.length + subpage2.length + subpage3.length + subpage4.length + subpage5.length,
    subproject,
    module,
    submodule,
    mainpage,
    subpage1,
    subpage2,
    subpage3,
    subpage4,
    subpage5,
  });
});

//get overall delete functionality
exports.getCheckUserToProject = catchAsyncErrors(async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find();
    const query = {
      team: {
        $in: [req.body.checkprojectouser],
      },
    };
    projects = await Project.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!projects) {
    return next(new ErrorHandler("Project not found", 404));
  }
  return res.status(200).json({
    // count: Project.length,
    projects,
  });
});

// get All projects => /api/projectslimit
exports.getAllAddProjectLimit = catchAsyncErrors(async (req, res, next) => {
  let projects;

  try {
    projects = await Project.find({}, { name: 1, estimation: 1, estimationtime: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!projects) {
    return next(new ErrorHandler("Project not found", 400));
  }

  return res.status(200).json({ count: projects.length, projects });
});

// Create new Project => /api/project/new
exports.addProject = catchAsyncErrors(async (req, res, next) => {
  let checkproj = await Project.findOne({ name: req.body.name });
  if (checkproj) {
    return next(new ErrorHandler("Name already exist!", 400));
  }
  let aproject = await Project.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Signle Project => /api/project/:id
exports.getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sprojects = await Project.findById(id);
  if (!sprojects) {
    return next(new ErrorHandler("Project not found", 404));
  }
  return res.status(200).json({
    sprojects,
  });
});
// update Project by id => /api/project/:id
exports.updateProject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upprojects = await Project.findByIdAndUpdate(id, req.body);
  if (!upprojects) {
    return next(new ErrorHandler("Project Details not found", 404));
  }
  return res.status(200).json({ message: "Updates successfully" });
});
// delete Project by id => /api/project/:id
exports.deleteProject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dprojects = await Project.findByIdAndRemove(id);
  if (!dprojects) {
    return next(new ErrorHandler("Project Details not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
