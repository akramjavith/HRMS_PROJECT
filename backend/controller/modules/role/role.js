const Role = require("../../../model/modules/role/role");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
//get All Role =>/api/roles
exports.getAllRole = catchAsyncErrors(async (req, res, next) => {
  let roles;
  try {
    roles = await Role.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!roles) {
    return next(new ErrorHandler("Role not found!", 404));
  }
  return res.status(200).json({
    roles,
  });
});

exports.getAllauthRoles = catchAsyncErrors(async (req, res, next) => {
  let result = [];
  let allroles;

  try {
    allroles = await Role.find();

    if (!allroles || allroles.length === 0) {
      return next(new ErrorHandler("Role not found!", 404));
    }

    if (!Array.isArray(req.body.userrole)) {
      return next(new ErrorHandler("Role Not Add This User!", 400));
    }

    allroles.forEach((data) => {
      if (req.body.userrole.some((role) => role === data.name)) {
        data.rolenew.forEach((item) => {
          result.push(item);
        });
      }
    });

    return res.status(200).json({
      result,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//get All Role =>/api/roles
exports.getAllRoleName = catchAsyncErrors(async (req, res, next) => {
  let roles;
  try {
    roles = await Role.find({}, { name: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!roles) {
    return next(new ErrorHandler("Role not found!", 404));
  }
  return res.status(200).json({
    roles,
  });
});

exports.getOverAllauthRole = catchAsyncErrors(async (req, res, next) => {
  let users;
  try {
    users = await User.find({ enquirystatus:{
      $nin: ["Enquiry Purpose"]
     },role: req.body.oldname },{company:1, branch:1,unit:1,role:1});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler("Role not found!", 404));
  }
  return res.status(200).json({
    users,
    count: users.length,
  });
});
//get All Role =>/api/roles
exports.getAllauthRole = catchAsyncErrors(async (req, res, next) => {
  let result;
  try {
    result = await Role.find({ name: req.body.userrole });
    if (!result) {
      return next(new ErrorHandler("Role not found!", 404));
    }
    return res.status(200).json({
      result,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//create new role => /api/role/new
exports.addRole = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Role.findOne({ name: req.body.name });
  if (checkloc) {
    return next(new ErrorHandler("Role name already exist!", 400));
  }

  let aRole = await Role.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single role => /api/role/:id
exports.getSingleRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let srole = await Role.findById(id);
  if (!srole) {
    return next(new ErrorHandler("Role not found", 404));
  }
  return res.status(200).json({
    srole,
  });
});
//update role by id => /api/role/:id
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let urole = await Role.findByIdAndUpdate(id, req.body);
  if (!urole) {
    return next(new ErrorHandler("Role not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete role by id => /api/role/:id
exports.deleteRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let drole = await Role.findByIdAndRemove(id);
  if (!drole) {
    return next(new ErrorHandler("Role not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
