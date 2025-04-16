const Manageassignedmode = require('../../../model/modules/othertask/manageassignedmode');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Manageassigned =>/api/manageassignedmode
exports.getAllManageassignedmode = catchAsyncErrors(async (req, res, next) => {
    let manageassignedmode;
    try {
        manageassignedmode = await Manageassignedmode.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!manageassignedmode) {
        return next(new ErrorHandler('Manageassigned not found!', 404));
    }
    return res.status(200).json({
        manageassignedmode
    });
})


//create new assignedby => /api/Assignedby/new
exports.addManageassignedmode = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }

    let aAssignedby = await Manageassignedmode.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Assignedby => /api/Assignedby/:id
exports.getSingleManageassignedmode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let manageassignedmode = await Manageassignedmode.findById(id);
    if (!manageassignedmode) {
        return next(new ErrorHandler('Manageassigned not found', 404));
    }
    return res.status(200).json({
        manageassignedmode
    })
})

//update Assignedby by id => /api/Assignedby/:id
exports.updateManageassignedmode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let manageassignedmode = await Manageassignedmode.findByIdAndUpdate(id, req.body);
    if (!manageassignedmode) {
        return next(new ErrorHandler('Manageassigned not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Assignedby by id => /api/Assignedby/:id
exports.deleteManageassignedmode = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let manageassignedmode = await Manageassignedmode.findByIdAndRemove(id);
    if (!manageassignedmode) {
        return next(new ErrorHandler('Manageassigned not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getOverallManageassignedmodeSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, result, totalPages, currentPage;

    const { page, pageSize } = req.body;
    try {

        totalProjects = await Manageassignedmode.countDocuments();

        result = await Manageassignedmode.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        totalProjects,
        result,
        currentPage: page,
        totalPages: Math.ceil(totalProjects / pageSize),
    });
});

