const Permission = require("../../../model/modules/permission/permission");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");
const LeaveVerification = require("../../../model/modules/leave/leaveverification");


//get All Permission =>/api/Permission
exports.getAllPermissions = catchAsyncErrors(async (req, res, next) => {
  let permissions;
  try {
    permissions = await Permission.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!permissions) {
    return next(new ErrorHandler("Permission not found!", 404));
  }
  return res.status(200).json({
    permissions,
  });
});
exports.getActiveApplyPermissions = catchAsyncErrors(async (req, res, next) => {
  let permissions;
  let users;
  try {
    users = await User.find(
      {

        resonablestatus: {
          $in: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        },
      },
      {

        companyname: 1,
      }
    );
    let companyname = users.map(d => d.companyname)
    permissions = await Permission.find({ employeename: { $nin: companyname }, status: "Applied" }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!permissions) {
    return next(new ErrorHandler("Permission not found!", 404));
  }
  return res.status(200).json({
    permissions,
  });
});

//create new Permission => /api/Permission/new
exports.addPermission = catchAsyncErrors(async (req, res, next) => {
  let aPermission = await Permission.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Permission => /api/Permission/:id
exports.getSinglePermission = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sPermission = await Permission.findById(id);
  if (!sPermission) {
    return next(new ErrorHandler("Permission not found", 404));
  }
  return res.status(200).json({
    sPermission,
  });
});

//update Permission by id => /api/Permission/:id
exports.updatePermission = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uPermission = await Permission.findByIdAndUpdate(id, req.body);
  if (!uPermission) {
    return next(new ErrorHandler("Permission not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Permission by id => /api/Permission/:id
exports.deletePermission = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let duPermission = await Permission.findByIdAndRemove(id);
  if (!duPermission) {
    return next(new ErrorHandler("Permission not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllApprovedPermissions = catchAsyncErrors(async (req, res, next) => {
  let approvedpermissions;
  try {
    approvedpermissions = await Permission.find({ status: 'Approved' });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!approvedpermissions) {
    return next(new ErrorHandler("Permission not found!", 404));
  }
  return res.status(200).json({
    approvedpermissions,
  });
});


//get All Permission =>/api/Permission
exports.getAllPermissionsHome = catchAsyncErrors(async (req, res, next) => {
  let permissions, leaveverification;
  try {

    if (!req.body.role.includes("Manager")) {
      leaveverification = await LeaveVerification.find({ employeenameto: { $in: req.body.username } }, { employeenamefrom: 1, _id: 0 })
      // console.log(leaveverification.map(d => d.employeenamefrom).flat(), "leaveveri")
      // console.log(req.body, "request")

      permissions = await Permission.countDocuments({ status: "Applied", employeename: { $in: leaveverification.map(d => d.employeenamefrom).flat() } }, {});
    } else {
      permissions = await Permission.countDocuments({ status: "Applied" }, {});

    }
    // console.log(permissions, "per")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!permissions) {
    return next(new ErrorHandler("Permission not found!", 404));
  }
  return res.status(200).json({
    permissions,
  });
});