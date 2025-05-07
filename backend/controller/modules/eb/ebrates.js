const Ebrates = require('../../../model/modules/eb/ebrates');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Ebrates =>/api/Ebrates
exports.getAllEbrates = catchAsyncErrors(async (req, res, next) => {
    let ebrates;
    try {
        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            // unit: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0) {
            filterQuery = { $or: branchFilter };
        }
        ebrates = await Ebrates.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebrates) {
        return next(new ErrorHandler('Ebrates not found!', 404));
    }
    return res.status(200).json({
        ebrates
    });
})


//create new Ebrates => /api/Ebrates/new
exports.addEbrates = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aEbrates = await Ebrates.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Ebrates => /api/Ebrates/:id
exports.getSingleEbrates = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sebrate = await Ebrates.findById(id);
    if (!sebrate) {
        return next(new ErrorHandler('Ebrates not found', 404));
    }
    return res.status(200).json({
        sebrate
    })
})

//update Ebrates by id => /api/Ebrates/:id
exports.updateEbrates = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uebrate = await Ebrates.findByIdAndUpdate(id, req.body);
    if (!uebrate) {
        return next(new ErrorHandler('Ebrates not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Ebrates by id => /api/Ebrates/:id
exports.deleteEbrates = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let debrate = await Ebrates.findByIdAndRemove(id);
    if (!debrate) {
        return next(new ErrorHandler('Ebrates not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})