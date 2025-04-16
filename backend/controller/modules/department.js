const Department = require("../../model/modules/department");
const User = require("../../model/login/auth");
const Teams = require("../../model/modules/teams");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const Hirerarchi = require("../../model/modules/setup/hierarchy");

// get All Department Details => /api/Departments

exports.getAllDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  let departmentdetails;

  try {
    departmentdetails = await Department.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!departmentdetails) {
    return next(new ErrorHandler("Department details not found", 404));
  }

  return res.status(200).json({
    // count: Departments.length,
    departmentdetails,
  });
});

exports.getOverallDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  let users, teams, hierarchy,usersdepartmentlog;

  try {
    users = await User.find({ department: req.body.oldname });
    teams = await Teams.find({ department: req.body.oldname });
    hierarchy = await Hirerarchi.find({ department: req.body.oldname });
    usersdepartmentlog = await User.find({departmentlog: {
      $elemMatch: { department: req.body.oldname }
    }})
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler("Department details not found", 404));
  }
  return res.status(200).json({
    users,
    teams,
    hierarchy,
    usersdepartmentlog,
    count: users.length + teams.length + hierarchy.length+usersdepartmentlog.length
  });
});


exports.getAllAddlDepartmentLimit = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 1, sizename, sort, search } = req.query;

  const filters = {};
  if (sizename) {
    filters.sizename = sizename;
  }

  const query = Department.find(filters);

  if (search) {
    query.where({ name: { $regex: search, $options: "i" } });
  }

  if (sort) {
    const [field, order] = sort.split(":");
    query.sort({ [field]: order === "desc" ? -1 : 1 });
  }
  try {
    const items = await query.skip((page - 1) * limit).limit(+limit);
    const totalCount = await Department.countDocuments(filters);

    if (!items) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
      items,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

// Create new Department => /api/department/new
exports.addDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  let adepartmentdetails = await Department.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Department => /api/department/:id

exports.getSingleDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdepartmentdetails = await Department.findById(id);

  if (!sdepartmentdetails) {
    return next(new ErrorHandler("Department not found", 404));
  }

  return res.status(200).json({
    sdepartmentdetails,
  });
});

// update Department by id => /api/customer/:id

exports.updateDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let updepartmentdetails = await Department.findByIdAndUpdate(id, req.body);

  if (!updepartmentdetails) {
    return next(new ErrorHandler("Department Details not found", 404));
  }

  return res.status(200).json({ message: "Updates successfully" });
});

// delete Department by id => /api/customer/:id

exports.deleteDepartmentDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddepartmentdetails = await Department.findByIdAndRemove(id);

  if (!ddepartmentdetails) {
    return next(new ErrorHandler("Department Details not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
