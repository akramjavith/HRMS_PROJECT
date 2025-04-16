const AddPassword = require("../../../model/modules/password/addPasswordModel");
const PasswordCategory = require("../../../model/modules/password/passwordCategoryModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");
const IPCategory = require("../../../model/modules/account/ipcategory");
const IpMaster = require("../../../model/modules/account/ipmodel");

// get All Password => /api/allpasswords
exports.getAllPassword = catchAsyncErrors(async (req, res, next) => {
  let pass;
  try {
    pass = await AddPassword.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));
  return res.status(200).json({
    pass: alldoccategory,
  });
});

// get All Password => /api/allpasswords
exports.getActiveAllPassword = catchAsyncErrors(async (req, res, next) => {
  let pass, users;
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
    pass = await AddPassword.find({ employeename: { $nin: companyname } }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));
  return res.status(200).json({
    pass: alldoccategory,
  });
});
// Create new Password=> /api/password/new
exports.addPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    let ascheduleMeeting = await AddPassword.create(req.body);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Password => /api/password/:id
exports.getSinglePassword = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spass = await AddPassword.findById(id);

  if (!spass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  return res.status(200).json({
    spass,
  });
});

// update Password by id => /api/password/:id
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let upass = await AddPassword.findByIdAndUpdate(id, req.body);

  if (!upass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  return res.status(200).json({ message: "Pasword Updated successfully" });
});

// delete Password by id => /api/password/:id
exports.deletePassword = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const singlePassword = await AddPassword.findById(req.params.id);

  if (singlePassword.type === "IP") {
    const updateOperations = {
      updateOne: {
        filter: {
          "ipconfig._id": singlePassword.assignedipid,
        },
        update: {
          $set: {
            "ipconfig.$.company": singlePassword.company,
            "ipconfig.$.branch": singlePassword.branch,
            "ipconfig.$.unit": singlePassword.unit,
            "ipconfig.$.team": singlePassword.team,
            "ipconfig.$.employeename": singlePassword.employeename,
            "ipconfig.$.status": "unassigned",
          },
        },
      },
    };
    const { filter, update } = updateOperations.updateOne;

    const ipmaster = await IpMaster.findOne(filter);

    if (ipmaster) {
      const product = ipmaster.ipconfig.id(filter["ipconfig._id"]);

      await IpMaster.updateOne(filter, update);
    }
  }

  let dpass = await AddPassword.findByIdAndRemove(id);

  if (!dpass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  return res.status(200).json({ message: "Password Deleted successfully" });
});

exports.getEmployeeName = catchAsyncErrors(async (req, res, next) => {
  let emp, users;
  try {
    users = await User.find(

      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"]
        },
        resonablestatus: {
          $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        },
      },
      {
        companyname: 1,
        branch: 1,
        unit: 1,
        team: 1,
        resonablestatus: 1,
        dob: 1,
        _id: 1,
      }
    );
    emp = users
      .filter(
        (user) =>
          user.branch === req.body.branch &&
          user.unit === req.body.unit &&
          user.team === req.body.team
      )
      .map((user) => ({ companyname: user.companyname }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!emp) {
    return next(new ErrorHandler("Employee Name not found!", 404));
  }
  return res.status(200).json({
    emp,
  });
});

//get subcategory based on category =>/api/getsubcategory
exports.getSubCat = catchAsyncErrors(async (req, res, next) => {
  let subcat;
  try {
    if (req.body.type === "Password") {
      subcat = await PasswordCategory.find({
        categoryname: { $eq: req.body.category },
      });
    } else if (req.body.type === "IP") {
      subcat = await IPCategory.find({
        categoryname: { $eq: req.body.category },
      });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcat) {
    return next(new ErrorHandler("Category not found!", 404));
  }
  return res.status(200).json({
    subcat,
  });
});

exports.getEmployeeDetails = catchAsyncErrors(async (req, res, next) => {
  let empDetails, users;
  try {
    users = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"]
        },
      },
      {
        companyname: 1,
        company: 1,
        branch: 1,
        unit: 1,
        team: 1,
        dob: 1,
        _id: 1,
      }
    );
    empDetails = users
      .filter(
        (user) =>
          req.body.company.includes(user.company) &&
          req.body.branch.includes(user.branch) &&
          req.body.unit.includes(user.unit) &&
          req.body.team.includes(user.team) &&
          user.companyname === req.body.employeename
      )
      .map((user) => ({ companyname: user.companyname, dob: user.dob }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!empDetails) {
    return next(new ErrorHandler("Employee Name not found!", 404));
  }
  return res.status(200).json({
    empDetails,
  });
});

exports.getAllPasswordActionemployee = catchAsyncErrors(async (req, res, next) => {
  let pass, users;
  try {
    users = await User.find(
      {

        resonablestatus: {
          $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        },
      },
      {
        companyname: 1,
      }
    );
    let companyname = users.map(d => d.companyname)
    pass = await AddPassword.find({ employeename: { $nin: companyname } }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!pass) {
  //   return next(new ErrorHandler("Password not found!", 404));
  // }
  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));
  return res.status(200).json({
    pass: alldoccategory,
  });
});

exports.getAllPasswordAccess = catchAsyncErrors(async (req, res, next) => {
  let pass;
  try {
    // Construct the filter query based on the assignbranch array from the request body
    const { assignbranch } = req.body;
    let filterQuery = {};

    // Create branch, company, and unit filters
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter records that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = {
        $or: branchFilter
      };
    }
    pass = await AddPassword.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));
  return res.status(200).json({
    pass: alldoccategory,
  });
});

exports.getActiveAllPasswordAccess = catchAsyncErrors(async (req, res, next) => {
  let pass, users;
  try {
    // Fetch users based on resonablestatus
    users = await User.find(
      {
        resonablestatus: {
          $in: [
            "Not Joined",
            "Postponed",
            "Rejected",
            "Closed",
            "Releave Employee",
            "Absconded",
            "Hold",
            "Terminate",
          ],
        },
      },
      {
        companyname: 1,
      }
    );

    // Extract company names
    let companyname = users.map((d) => d.companyname);

    // Construct the filter query based on the assignbranch array from the request body
    const { assignbranch } = req.body;
    let filterQuery = {};

    // Create branch, company, and unit filters
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter records that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = {
        $or: branchFilter,
        employeename: { $nin: companyname }, // Include the employeename filter
      };
    }

    // Fetch records based on the constructed filter query
    pass = await AddPassword.find(filterQuery, {});

  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Records not found!", 404));
  }

  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  // Return the response with the processed data
  return res.status(200).json({
    pass: alldoccategory,
  });
});


exports.getActiveAllPasswordAccessFilter = catchAsyncErrors(async (req, res, next) => {
  let pass, users;
  try {
    // Fetch users based on resonablestatus
    users = await User.find(
      {
        resonablestatus: {
          $in: [
            "Not Joined",
            "Postponed",
            "Rejected",
            "Closed",
            "Releave Employee",
            "Absconded",
            "Hold",
            "Terminate",
          ],
        },
      },
      {
        companyname: 1,
      }
    );

    // Extract company names
    let companyname = users.map((d) => d.companyname);

    // Construct the filter query based on the assignbranch array from the request body
    const { company, branch, unit } = req.body;
    let query = {};


    if (company && company?.length > 0) {
      query.company = { $in: company }
    }

    if (branch && branch?.length > 0) {
      query.branch = { $in: branch }
    }
    if (unit && unit?.length > 0) {
      query.unit = { $in: unit }
    }
    query.employeename = { $nin: companyname }


    // Fetch records based on the constructed filter query
    pass = await AddPassword.find(query, { firewallstatus: 1, company: 1, branch: 1, unit: 1, team: 1, type: 1, employeename: 1, category: 1, subcategory: 1, temppassword: 1, livepassword: 1 });

  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Records not found!", 404));
  }

  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  // Return the response with the processed data
  return res.status(200).json({
    pass: alldoccategory,
  });
});


exports.getAllPasswordAccessFilter = catchAsyncErrors(async (req, res, next) => {
  let pass;
  try {
    // Construct the filter query based on the assignbranch array from the request body
    const { assignbranch } = req.body;
    const { company, branch, unit } = req.body;
    let query = {};


    if (company && company?.length > 0) {
      query.company = { $in: company }
    }

    if (branch && branch?.length > 0) {
      query.branch = { $in: branch }
    }
    if (unit && unit?.length > 0) {
      query.unit = { $in: unit }
    }


    pass = await AddPassword.find(query, { firewallstatus: 1, company: 1, branch: 1, unit: 1, team: 1, type: 1, employeename: 1, category: 1, subcategory: 1, temppassword: 1, livepassword: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!pass) {
    return next(new ErrorHandler("Password not found!", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = pass.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));
  return res.status(200).json({
    pass: alldoccategory,
  });
});