const Branch = require("../../model/modules/branch");
const Excelmaprespersondata = require("../../model/modules/excel/excelmapresperson");
const Unit = require("../../model/modules/unit");
const Floor = require("../../model/modules/floor");
const User = require("../../model/login/auth");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const Hirerarchi = require("../../model/modules/setup/hierarchy");

// get All branch => /api/branches
exports.getAllBranch = catchAsyncErrors(async (req, res, next) => {
  let branch;
  try {
    branch = await Branch.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    branch,
  });
});

exports.getAllBranchQrCode = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  console.log(assignbranch, "FR")
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      name: item.branch,
    }))
  };
  
  let branch;
  try {
    branch = await Branch.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    branch,
  });
});


exports.getBranchAddress = catchAsyncErrors(async (req, res, next) => {
  let branchaddress;
  try {
    branchaddress = await Branch.find({ name: req.body.branch });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branchaddress) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    branchaddress,
  });
});


// get All branch => /api/branches
exports.getOverAllBranch = catchAsyncErrors(async (req, res, next) => {
  let units, floors, users, excelmapresperson, hierarchy;
  try {
    units = await Unit.find({ branch: req.body.oldname });
    floors = await Floor.find({ branch: req.body.oldname });
    users = await User.find({ enquirystatus:{
      $nin: ["Enquiry Purpose"]
     },branch: req.body.oldname },{company:1, branch:1,unit:1});
    hierarchy = await Hirerarchi.find({ branch: req.body.oldname });
    excelmapresperson = await Excelmaprespersondata.find({
      todo: {
        $elemMatch: {
          branch: req.body.oldname,
        },
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!units) {
    return next(new ErrorHandler("branch not found", 404));
  }
  return res.status(200).json({
    count: units.length + floors.length + users.length + excelmapresperson.length + hierarchy.length,
    units,
    floors,
    users,
    excelmapresperson,
    hierarchy,
  });
});

// get overall delete functionlity
exports.getAllBranchCheck = catchAsyncErrors(async (req, res, next) => {
  let branch;
  try {
    branch = await Branch.find();
    let query = {
      company: req.body.checkbranch,
    };
    branch = await Branch.find(query, {
      name: 1,
      code: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    branch,
  });
});

// Create new branch => /api/branch/new
exports.addBranch = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Branch.findOne({ code: req.body.code });

  if (checkloc) {
    return next(new ErrorHandler("Code already exist!", 400));
  }

  let abranch = await Branch.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Branch => /api/branch/:id
exports.getSingleBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sbranch = await Branch.findById(id);

  if (!sbranch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    sbranch,
  });
});
// update branch by id => /api/branch/:id
exports.updateBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ubranch = await Branch.findByIdAndUpdate(id, req.body);

  if (!ubranch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});
// delete branch by id => /api/branch/:id
exports.deleteBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dbranch = await Branch.findByIdAndRemove(id);

  if (!dbranch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
