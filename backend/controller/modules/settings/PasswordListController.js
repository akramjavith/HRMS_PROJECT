const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const User = require('../../../model/login/auth');
const bcrypt = require('bcryptjs');
const { decryptPassword } = require('../../../controller/login/decryptPassword');


// get All user => /api/alluserspasswordchange
exports.getAllUsersForPassword = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({
            enquirystatus:{
                $nin: ["Enquiry Purpose"]
               },
               resonablestatus:{
                $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
              }
        }, { resonablestatus: 1, empcode: 1, companyname: 1, username: 1, password: 1, originalpassword: 1 })
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


// get Signle user => /api/singleuserpasswordchange/:id
exports.getSingleUserPassword = catchAsyncErrors(async (req, res, next) => {
    let suser;
    suser = await User.findById({ _id: req.params.id }, { empcode: 1, salt: 1, originalpassword: 1, companyname: 1, username: 1, password: 1, updatedby: 1 })

    if (!suser) {
        return next(new ErrorHandler('User not found', 404));
    }


    return res.status(200).json({
        success: true,
        suser
    })
})



exports.updateSingleUserPassword = catchAsyncErrors(async (req, res, next) => {

    // encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const id = req.params.id;

    const upuser = await User.findByIdAndUpdate(id, { updatedby: req.body.updatedby, password: hashPassword, originalpassword: req.body.originalpassword });


    if (!upuser) {
        return next(new ErrorHandler('User not found', 404));
    }

    return res.status(200).json({ message: 'Password Updated successfully!', upuser })
})

exports.getAllUsersForPasswordAssignbranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;
    
    // Validate assignbranch input
    if (!Array.isArray(assignbranch) || !assignbranch.every(item => item.company && item.branch && item.unit)) {
        return next(new ErrorHandler('Invalid assignbranch data', 400));
    }

    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
        unit: item.unit
      })),
      enquirystatus: { $nin: ["Enquiry Purpose"] },
      resonablestatus: { $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"] }
    };

    try {
        const users = await User.find(query, {
            resonablestatus: 1, 
            empcode: 1, 
            companyname: 1, 
            username: 1, 
            password: 1, 
            originalpassword: 1 
        });

        if (users.length === 0) {
            return next(new ErrorHandler('Users not found', 400));
        }

        const allusers = users.map((data, index) => ({
            serialNumber: index + 1,
            ...data.toObject()
        }));

        return res.status(200).json({ count: users.length, users: allusers });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});