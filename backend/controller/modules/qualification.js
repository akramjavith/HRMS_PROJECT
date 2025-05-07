const Qualification = require('../../model/modules/qualification')
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
const User = require('../../model/login/auth');


// get All Qualification Details => /api/Qualification

exports.getAllQualificationDetails = catchAsyncErrors(async (req, res, next) => {
    let qualificationdetails;

    try {
        qualificationdetails = await Qualification.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!qualificationdetails) {
        return next(new ErrorHandler('Qualification details not found', 404));
    }

    return res.status(200).json({
        // count: Qualification.length,
        qualificationdetails
    });
})

// Overall Qualification edit
exports.getOverallQulalificationDetails = catchAsyncErrors(async (req, res, next) => {
    let users;
    users = await User.find(
        {
            eduTodo: {
                $elemMatch: {
                    qualification: req.body.oldname,
                }
            },
        },
        {company:1, branch:1,unit:1, eduTodo:1} 
    );
    if (!users) {
        return next(new ErrorHandler('Qualification details not found', 404));
    }
    return res.status(200).json({
        users, count: users.length
    });
})

// Create new Qualification => /api/Qualification/new
exports.addQualificationDetails = catchAsyncErrors(async (req, res, next) => {

    let aqualificationdetails = await Qualification.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})


// get Signle Qualification => /api/Qualification/:id

exports.getSingleQualificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let squalificationdetails = await Qualification.findById(id);

    if (!squalificationdetails) {
        return next(new ErrorHandler('Qualification not found', 404));
    }

    return res.status(200).json({
        squalificationdetails
    })
})

// update Qualification by id => /api/Qualification/:id

exports.updateQualificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upqualificationdetails = await Qualification.findByIdAndUpdate(id, req.body);

    if (!upqualificationdetails) {
        return next(new ErrorHandler('Qualification Details not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})

// delete Qualification by id => /api/Qualification/:id

exports.deleteQualificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dqualificationdetails = await Qualification.findByIdAndRemove(id);

    if (!dqualificationdetails) {
        return next(new ErrorHandler('Qualification Details not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})