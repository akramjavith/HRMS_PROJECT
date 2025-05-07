const ClockinIP = require('../../../model/modules/settings/clockinipModel');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const AdminOverAllSettings = require('../../../model/modules/settings/AdminOverAllSettingsModel');
const IndividualSettings = require('../../../model/modules/settings/IndividualSettingsModel');
const User = require('../../../model/login/auth');
const UserEmployee = require('../../../model/login/employeedocuments');
const moment = require('moment');

// get all ClockinIP => /api/allclockinip
exports.getAllClockinIp = catchAsyncErrors(async (req, res, next) => {
  let clockinip
  try {
    clockinip = await ClockinIP.find()
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clockinip) {
    return next(new ErrorHandler('ClockinIP not found', 404));
  }
  const overallsettings = await AdminOverAllSettings.find();
  const individualsettings = await IndividualSettings.find();
  let adminIPswitch, adminMobileswitch;
  if (overallsettings.length === 0) {
    adminIPswitch = true
    adminMobileswitch = true
  } else {
    adminIPswitch = overallsettings[overallsettings.length - 1].iprestrictionswitch
    adminMobileswitch = overallsettings[overallsettings.length - 1].mobilerestrictionswitch
  }
  // Add serial numbers to the clockinip
  const allclock = clockinip.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject()
  }));

  return res.status(200).json({
    clockinip: allclock,
    adminIPswitch,
    adminMobileswitch,
    individualsettings
  });

})

exports.getAssignAllClockinIp = catchAsyncErrors(async (req, res, next) => {

  const { assignbranch } = req.body;
  console.log(assignbranch)
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let clockinip
  try {
    clockinip = await ClockinIP.find(query)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clockinip) {
    return next(new ErrorHandler('ClockinIP not found', 404));
  }
  const overallsettings = await AdminOverAllSettings.find();
  const individualsettings = await IndividualSettings.find();
  let adminIPswitch, adminMobileswitch;
  if (overallsettings.length === 0) {
    adminIPswitch = true
    adminMobileswitch = true
  } else {
    adminIPswitch = overallsettings[overallsettings.length - 1].iprestrictionswitch
    adminMobileswitch = overallsettings[overallsettings.length - 1].mobilerestrictionswitch
  }

  console.log(clockinip)
  // Add serial numbers to the clockinip
  const allclock = clockinip.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject()
  }));

  return res.status(200).json({
    clockinip: allclock,
    adminIPswitch,
    adminMobileswitch,
    individualsettings
  });

})

// add ClockinIP =>/api/clockinip/new
exports.addClockinIp = catchAsyncErrors(async (req, res, next) => {
  await ClockinIP.create(req.body);
  return res.status(200).json({
    message: 'Successfully added'
  })
})

// get single ClockinIP =>/api/clockinip/:id
exports.getSingleClockinIp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sclockinip = await ClockinIP.findById(id);
  if (!sclockinip) {
    return next(new ErrorHandler('ClockinIP not found'));

  }
  return res.status(200).json({
    sclockinip
  });

});

// update single ClockinIP =>/api/clockinip/:id
exports.updateClockinIp = catchAsyncErrors(async (req, res, next) => {

  const id = req.params.id

  let uclockinip = await ClockinIP.findByIdAndUpdate(id, req.body);

  if (!uclockinip) {
    return next(new ErrorHandler('ClockinIP not found'));
  }
  return res.status(200).json({
    message: 'Update Successfully', uclockinip
  });
});

// delete single ClockinIP =>/api/clockinip/:id
exports.deleteClockinIp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dclockinip = await ClockinIP.findByIdAndRemove(id);
  if (!dclockinip) {
    return next(new ErrorHandler('ClockinIP not found', 404));
  }

  return res.status(200).json({ message: 'Deleted successfully' });
})


//get ip based on branch =>/api/getipbybranch
exports.getIPbyBranch = catchAsyncErrors(async (req, res, next) => {
  let ipbybranch;
  try {
    ipbybranch = await ClockinIP.find({ branch: req.body.branch }, { ipaddress: 1 });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ipbybranch) {
    return next(new ErrorHandler('Branch not found!', 404));
  }
  return res.status(200).json({
    ipbybranch
  });
});


exports.getAllUsersDates = catchAsyncErrors(async (req, res, next) => {
  let users, userbirthday, userbirthdays, userdateofjoining, userdateofjoinings, userdateofmarriage, userdateofmarriages;
  try {


    users = await User.find({
      enquirystatus: {
        $nin: ["Enquiry Purpose"]
      },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, {
      companyname: 1, doj: 1, dob: 1, doj: 1, dom: 1, _id: 1, profileimage: 1, gender: 1
    });




    // Function to check if a date is in the current week
    const currentDate = moment();
    const currDate = new Date();
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');

    userbirthdays = users.filter(user => {
      const userDobExist = user?.dob;
      if (!userDobExist) {
        return false;
      }
      const userDob = moment(userDobExist, 'YYYY-MM-DD');
      userDob.year(currentDate.year());
      return (
        userDob.isBetween(startOfWeek, endOfWeek, null, '[]')
      );
    })
      .map(user => ({ companyname: user.companyname, profileimage: user.profileimage, gender: user.gender, _id: user._id, dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY') }));

    userdateofjoinings = users.filter(user => {
      const userDojExist = user?.doj;
      if (!userDojExist) {
        return false;
      }

      const userDoj = moment(userDojExist, 'YYYY-MM-DD');
      if (userDoj.isSame(currentDate, 'year')) {
        return false;
      }
      userDoj.year(currentDate.year());
      return (
        userDoj.isBetween(startOfWeek, endOfWeek, null, '[]')
      );
    })
      .map(user => ({ companyname: user.companyname, profileimage: user.profileimage, _id: user._id, gender: user.gender, doj: moment(user?.doj).year(currentDate.year()).format('MM-DD-YYYY') }));

    userdateofmarriages = users.filter(user => {
      const userDomExist = user?.dom;
      if (!userDomExist) {
        return false;
      }
      const userDom = moment(userDomExist, 'YYYY-MM-DD');
      userDom.year(currentDate.year());
      return (
        userDom.isBetween(startOfWeek, endOfWeek, null, '[]')
      );
    })
      .map(user => ({ companyname: user?.companyname, profileimage: user.profileimage, _id: user._id, gender: user.gender, dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY') }));



    let findids = [...new Set([...userbirthdays,
    ...userdateofjoinings,
    ...userdateofmarriages].map(d => String(d._id)))]


    // console.log(findids, "findids")
    let usersemployee = await UserEmployee.find({ commonid: { $in: findids } }, { profileimage: 1, commonid: 1 })

    userbirthday = userbirthdays.map(item => {
      let findprofile = usersemployee.find(d => d.commonid == String(item._id))?.profileimage
      return {
        ...item,
        profileimage: findprofile
      }
    })
    userdateofjoining = userdateofjoinings.map(item => {
      let findprofile = usersemployee.find(d => d.commonid == String(item._id))?.profileimage
      return {
        ...item,
        profileimage: findprofile
      }
    })
    userdateofmarriage = userdateofmarriages.map(item => {
      let findprofile = usersemployee.find(d => d.commonid == String(item._id))?.profileimage
      return {
        ...item,
        profileimage: findprofile
      }
    })

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler('Users not found!', 404));
  }
  return res.status(200).json({
    userbirthday,
    userdateofjoining,
    userdateofmarriage

  });
})



exports.getAllUsersDob = catchAsyncErrors(async (req, res, next) => {
  let usersdob, userbirthday;
  try {
    usersdob = await User.find({
      enquirystatus: {
        $nin: ["Enquiry Purpose"]
      },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { companyname: 1, dob: 1, _id: 1 });
    const currentDate = moment();
    userbirthday = usersdob
      .filter(user => user?.dob)
      .map(user => ({
        companyname: user.companyname,
        dob: moment(user.dob).year(currentDate.year()).format('MM-DD-YYYY')
      }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!usersdob) {
    return next(new ErrorHandler('Users not found!', 404));
  }
  return res.status(200).json({
    userbirthday
  });
})

exports.getAllUsersDoj = catchAsyncErrors(async (req, res, next) => {
  let usersdoj, userdateofjoining;
  try {
    usersdoj = await User.find({
      enquirystatus: {
        $nin: ["Enquiry Purpose"]
      },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { companyname: 1, doj: 1, _id: 1 });
    const currentDate = moment();
    userdateofjoining = usersdoj
      .filter(user => {
        return user?.doj && !moment(user.doj).isSame(currentDate, 'year');
      })
      .map(user => ({
        companyname: user.companyname,
        doj: moment(user.doj).year(currentDate.year()).format('MM-DD-YYYY')
      }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!usersdoj) {
    return next(new ErrorHandler('Users not found!', 404));
  }
  return res.status(200).json({
    userdateofjoining
  });
});

exports.getAllUsersDom = catchAsyncErrors(async (req, res, next) => {
  let usersdom, userdateofmarriage;
  try {
    usersdom = await User.find({
      enquirystatus: {
        $nin: ["Enquiry Purpose"]
      },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { companyname: 1, dom: 1, _id: 1 });
    const currentDate = moment();
    userdateofmarriage = usersdom
      .filter(user => user?.dom)
      .map(user => ({
        companyname: user.companyname,
        dom: moment(user.dom).year(currentDate.year()).format('MM-DD-YYYY')
      }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!usersdom) {
    return next(new ErrorHandler('Users not found!', 404));
  }
  return res.status(200).json({
    userdateofmarriage
  });
})


