const Designation = require("../../model/modules/designation");
const User = require("../../model/login/auth");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All Designation => /api/Designation
exports.getAllDesignation = catchAsyncErrors(async (req, res, next) => {
  let designation;
  try {
    designation = await Designation.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    designation,
  });
});

// Overall designation edit
exports.getOverallDesignationDetails = catchAsyncErrors(async (req, res, next) => {
  let users,usersdesignationlog;

  try {
    
     users = await User.find({ designation: req.body.oldname });
    usersdesignationlog = await User.find({designationlog: {
      $elemMatch: { designation: req.body.oldname }
    }})
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler("Designation details not found", 404));
  }
  return res.status(200).json({
    users,
    usersdesignationlog,
    count: users.length+usersdesignationlog.length,
  });
});

// get overall delete functionality
exports.getCheckDesignationToGroup = catchAsyncErrors(async (req, res, next) => {
  let designation, group;
  try {
    designation = await Designation.find();

    let query = {
      group: req.body.checkdesignationgrp,
    };
    group = await Designation.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    group,
  });
});

exports.getCheckDesignationToBranch = catchAsyncErrors(async (req, res, next) => {
  let designation;
  try {
    designation = await Designation.find();

    let query = {
      branch: req.body.checkdesigtobranch,
    };
    designation = await Designation.find(query, {
      name: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    designation,
  });
});

//add designation
exports.adddesignation = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Designation.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Designation => /api/desiggroup/:id
exports.getSingledesignation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sdesiggroup = await Designation.findById(id);
  if (!sdesiggroup) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    sdesiggroup,
  });
});

// update Designation by id => /api/Designation/:id
exports.updatedesignation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let udesignation = await Designation.findByIdAndUpdate(id, req.body);
  if (!udesignation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Designation by id => /api/Designation/:id
exports.deletedesignation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddesignation = await Designation.findByIdAndRemove(id);
  if (!ddesignation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
