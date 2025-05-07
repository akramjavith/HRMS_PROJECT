const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError')
const IndividualSettings = require('../../../model/modules/settings/IndividualSettingsModel');
const User = require("../../../model/login/auth");

exports.getAllUsersSwitchDetails = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, { branch: 1,unit: 1,team: 1, companyname: 1, ipswitch: 1, mobileipswitch: 1,twofaswitch: 1, })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Users not found', 400));
    }
    const allusers = users.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({ count: users.length, users: allusers });
});

exports.getUserIndividual = catchAsyncErrors(async (req, res, next) => {
  let individualsettings = {};
  try {
    individualsettings = await IndividualSettings.findOne({ companyname: { $in: req.body.companyname } })
    // console.log(individualsettings, "individualsettings")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({ individualsettings });
});

//All Individual Settings =>/api/allindividualsettings
exports.getAllIndividualSettings = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  console.log(assignbranch)
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit
    }))
  };
  let individualsettings;
  try {
    individualsettings = await IndividualSettings.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!individualsettings) {
    return next(new ErrorHandler("IndividualSettings not found!", 404));
  }
  console.log(individualsettings)
  return res.status(200).json({
    individualsettings,
  });
});
  
  //create new individualsettings => /api/individualsettings/new
  exports.addIndividualSettings = catchAsyncErrors(async (req, res, next) => {
    let aindividualsettings = await IndividualSettings.create(req.body);
    return res.status(200).json({
      message: "Successfully added!",
    });
  });
  
  // get Single individualsettings => /api/individualsettings/:id
  exports.getSingleIndividualSettings = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sindividualsettings = await IndividualSettings.findById(id);
    if (!sindividualsettings) {
      return next(new ErrorHandler("IndividualSettings not found", 404));
    }
    return res.status(200).json({
      sindividualsettings,
    });
  });
  //update individualsettings by id => /api/individualsettings/:id
  exports.updateIndividualSettings = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uindividualsettings = await IndividualSettings.findByIdAndUpdate(id, req.body);
    if (!uindividualsettings) {
      return next(new ErrorHandler("IndividualSettings not found", 404));
    }
  
    return res.status(200).json({ message: "Updated successfully" });
  });
  //delete individualsettings by id => /api/individualsettings/:id
  exports.deleteIndividualSettings = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dindividualsettings = await IndividualSettings.findByIdAndRemove(id);
    if (!dindividualsettings) {
      return next(new ErrorHandler("IndividualSettings not found", 404));
    }
  
    return res.status(200).json({ message: "Deleted successfully" });
  });
  

  exports.getUserIndividualLastIndex = catchAsyncErrors(async (req, res, next) => {
    let individualsettings;
    try {
      individualsettings = await IndividualSettings.findOne().sort({ createdAt: -1 })
        .exec();
  
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({ individualsettings });
  });