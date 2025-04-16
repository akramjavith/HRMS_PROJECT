const BankDetailsVerificationUser = require("../../../model/modules/settings/BankVerificationDetailsModel");
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//post bankdetailsverification api/bankdetailsverfication/new
exports.Postbankdetailsverification = catchAsyncErrors(async (req, res, next) => {
    const {empname,empcode,phone,doj,noofdays,addedby,updatedby,dot,time} = req.body;
    if (empname !=="" && empcode !=="" && phone!=="" && doj !=="" && noofdays !== "") {
        const bankVerificationUser= new BankDetailsVerificationUser ({
            empname,
            empcode,
            phone,
            doj,
            noofdays,
            time,
            dot,
            addedby,
            updatedby
        });

        await bankVerificationUser.save();
        return res.status(200).json({
            bankVerificationUser
        });
    }
    else{
        return next(new ErrorHandler('Please enter all the fields', 404));
    }
    }
);

//get bankdetailsverification users api/bankdetailsverfication/all
exports.Getallbankdetailsverificationusers = catchAsyncErrors(async (req, res, next) => {
    const allBankVerificationUsers = await BankDetailsVerificationUser.find();
    if (allBankVerificationUsers !== ""){
        return res.status(200).json({
            allBankVerificationUsers
    })
    }
    else{
        return next(new ErrorHandler('No users found', 404));
    }
    }
);

//get single userdetails api/bankdetailsverfication/single/:id
exports.Getsingleuserdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let suser = await BankDetailsVerificationUser.findById(id);
    if (!suser) {
      return next(new ErrorHandler("user not found", 404));
    }
    return res.status(200).json({
      suser,
    });
  });


//get single user using employee id api/bankdetailsverfication/single/empidbased/:empid
exports.Getsingleempidbaseduserdetails = catchAsyncErrors(async (req, res, next) => {
    const empId = req.params.empid;
    let suser = await BankDetailsVerificationUser.findOne({empcode:empId});
    if (!suser) {
      return next(new ErrorHandler("user not found", 404));
    }
    return res.status(200).json({
      suser,
    });
  });

//get single user using employee id api/bankdetailsverfication/single/empidbasedarr/:empid
exports.Getsingleempidbaseduserdetailsarray = catchAsyncErrors(async (req, res, next) => {
  const empId = req.params.empid;
  let suser = await BankDetailsVerificationUser.find({empcode:empId});
  if (!suser) {
    return next(new ErrorHandler("user not found", 404));
  }
  return res.status(200).json({
    suser,
  });
});



//update user by id => /api/bankdetailsverfication/single/:id
exports.Updateuserdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uuser = await BankDetailsVerificationUser.findByIdAndUpdate(id, req.body,{new:true});
    if (!uuser) {
      return next(new ErrorHandler("user not found", 404));
    }
    return res.status(200).json({ message: "Updated successfully", uuser });
  });

//delete user by id => /api/bankdetailsverfication/single/:id
exports.Deleteuser = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let duser = await BankDetailsVerificationUser.findByIdAndRemove(id);
    if (!duser) {
      return next(new ErrorHandler("user not found", 404));
    }
  
    return res.status(200).json({ message: "Deleted successfully" });
  });
