const Skillset = require('../../model/modules/skillset');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get All Skillset => /api/Skillsets
exports.getAllSkillset = catchAsyncErrors(async (req, res, next) => {
    let skillsets;
    try {
        skillsets = await Skillset.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!skillsets) {
        return next(new ErrorHandler('Skillset not found!', 404));
    }
    return res.status(200).json({
        skillsets
    });
})


// Overall Shift edit
exports.getOverallSkillsetDetails = catchAsyncErrors(async (req, res, next) => {
    let users;
    users = await User.find(
        {
            addAddQuaTodo: {

                $elemMatch: {
                    addQual: req.body.oldname,
                }

            },
        },
        {company:1, branch:1,unit:1,addAddQuaTodo:1}
    );
    if (!users) {
        return next(new ErrorHandler('Skillset details not found', 404));
    }
    return res.status(200).json({
        users, count: users.length
    });
})


// Create new Skillset => /api/Skillset/new
exports.addSkillset = catchAsyncErrors(async (req, res, next) => {


    let askillset = await Skillset.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Single Skillset => /api/Skillset/:id
exports.getSingleSkillset = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sskillset = await Skillset.findById(id);

    if (!sskillset) {
        return next(new ErrorHandler('Skillset not found!', 404));
    }
    return res.status(200).json({
        sskillset
    })
})
// update Skillset by id => /api/Skillset/:id
exports.updateSkillset = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uskillset = await Skillset.findByIdAndUpdate(id, req.body);

    if (!uskillset) {
        return next(new ErrorHandler('Skillset not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Skillset by id => /api/Skillset/:id
exports.deleteSkillset = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dskillset = await Skillset.findByIdAndRemove(id);

    if (!dskillset) {
        return next(new ErrorHandler('Skillset not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})