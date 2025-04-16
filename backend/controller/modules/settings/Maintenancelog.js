const Userchecks =require("../../../model/modules/settings/Maintenancelog")
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const User = require("../../../model/login/auth");
const moment = require("moment");

exports.getSingleUsercheck = catchAsyncErrors(async (req, res, next)=>{
    const suser = await Userchecks.find({commonid:req.params.id});

    if (!suser) {
        // return next(new ErrorHandler('user not found', 404));     
        return res.status(200).json({});
    }

    return res.status(200).json({
        success: true,
        suser
    })
})



exports.getAllUsercheck = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await Userchecks.find(
           
            {
        role: 1,
        empcode: 1,
        companyname: 1,
        pagename:1,
     
        date:1,

            }
        );
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!users) {
        return next(new ErrorHandler("Users not found", 400));
    }

    return res.status(200).json({ count: users.length, users });
});



exports.addUsercheck = catchAsyncErrors( async (req, res, next) =>{
    try {
    let userchecks = await Userchecks.create(req.body);
    return res.status(200).json({
        success: true,
    });
}
 catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
}
})




  exports.skippedemployees = catchAsyncErrors(async (req, res, next) => {
    let totalProjects , result , totalPages , currentPage;
  
    const {frequency, page, pageSize,commonid } = req.body;
    try {
  
      totalProjects =  await Userchecks.countDocuments({commonid});
  
  
      result = await Userchecks.find({commonid})
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));
  
  
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
       totalProjects,
      result,
      currentPage:  page ,
      totalPages: Math.ceil( totalProjects / pageSize),
    });
  });
  

