const Teamgrouping = require("../../../model/modules/tickets/teamgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");

//get All Teamgrouping =>/api/Teamgrouping
exports.getAllTeamgrouping = catchAsyncErrors(async (req, res, next) => {
  let teamgroupings;
  try {
    teamgroupings = await Teamgrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!teamgroupings) {
    return next(new ErrorHandler("Teamgrouping not found!", 404));
  }
  return res.status(200).json({
    teamgroupings,
  });
});


exports.usersTeamGrouping = catchAsyncErrors(async (req, res, next) => {
  let userteamgroup;
  try {
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && key != "date") {
        const value = req.body[key];
        if (value !== "ALL") {
          query[key] = value.toString();
        }
      }
    });
    query.resonablestatus = {
      $nin: [
        "Not Joined",
        "Postponed",
        "Rejected",
        "Closed",
        "Releave Employee",
        "Absconded",
        "Hold",
        "Terminate",
      ],
    };
    query.enquirystatus = {
      $nin: ["Enquiry Purpose"],
    };
    if (req.body.date) {
      query.doj = {
        $lte: req.body.date,
      };
    }
    userteamgroup = await User.find(query, {
      empcode: 1,
      companyname: 1,
      team: 1,
      unit: 1,
      branch: 1,
      firstname: 1,
      callingname: 1,
      lastname: 1,
      legalname: 1,
      profileimage: 1,
      dob: 1,
      bloodgroup: 1,
      email: 1,
      emergencyno: 1,
      pdoor: 1,
      pstreet: 1,
      parea: 1,
      plandmark: 1,
      pcountry: 1,
      cpincode: 1,
      department: 1,
      username: 1,
      ccity: 1,
      empcode: 1,
      company: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!userteamgroup) {
    return next(new ErrorHandler("Teamgrouping not found!", 404));
  }
  return res.status(200).json({
    userteamgroup,
  });
});


//create new Teamgrouping => /api/Teamgrouping/new
exports.addTeamgrouping = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aTeamgrouping = await Teamgrouping.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Teamgrouping => /api/Teamgrouping/:id
exports.getSingleTeamgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let steamgrouping = await Teamgrouping.findById(id);
  if (!steamgrouping) {
    return next(new ErrorHandler("Teamgrouping not found", 404));
  }
  return res.status(200).json({
    steamgrouping,
  });
});

//update Teamgrouping by id => /api/Teamgrouping/:id
exports.updateTeamgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uteamgrouping = await Teamgrouping.findByIdAndUpdate(id, req.body);
  if (!uteamgrouping) {
    return next(new ErrorHandler("Teamgrouping not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Teamgrouping by id => /api/Teamgrouping/:id
exports.deleteTeamgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dteamgrouping = await Teamgrouping.findByIdAndRemove(id);
  if (!dteamgrouping) {
    return next(new ErrorHandler("Teamgrouping not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
