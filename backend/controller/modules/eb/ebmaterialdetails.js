const Ebmaterialdetails = require('../../../model/modules/eb/ebmaterialdetails');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Ebmaterialdetails =>/api/Ebmaterialdetails
exports.getAllEbmaterialdetails = catchAsyncErrors(async (req, res, next) => {
    let ebmaterialdetails;
    try {

        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0) {
            filterQuery = { $or: branchFilter };
        }
        ebmaterialdetails = await Ebmaterialdetails.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebmaterialdetails) {
        return next(new ErrorHandler('Ebmaterialdetails not found!', 404));
    }
    return res.status(200).json({
        ebmaterialdetails
    });
})


//OVERALL DELTE
exports.getOverAllEbMaterialdetails = catchAsyncErrors(async (req, res, next) => {
    let ebmaterial;
    try {
        let query = {
            servicenumber: { $in: req.body.checkebmaterial },

        };
        ebmaterial = await Ebmaterialdetails.find(query, {
            servicenumber: 1,
            _id: 0,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebmaterial) {
        return next(new ErrorHandler("Eb Material not found!", 404));
    }
    return res.status(200).json({
        ebmaterial,
    });
});


//create new Ebmaterialdetails => /api/Ebmaterialdetails/new
exports.addEbmaterialdetails = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aEbmaterialdetails = await Ebmaterialdetails.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Ebmaterialdetails => /api/Ebmaterialdetails/:id
exports.getSingleEbmaterialdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sebmaterialdetails = await Ebmaterialdetails.findById(id);
    if (!sebmaterialdetails) {
        return next(new ErrorHandler('Ebmaterialdetails not found', 404));
    }
    return res.status(200).json({
        sebmaterialdetails
    })
})

//update Ebmaterialdetails by id => /api/Ebmaterialdetails/:id
exports.updateEbmaterialdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uebmaterialdetails = await Ebmaterialdetails.findByIdAndUpdate(id, req.body);
    if (!uebmaterialdetails) {
        return next(new ErrorHandler('Ebmaterialdetails not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Ebmaterialdetails by id => /api/Ebmaterialdetails/:id
exports.deleteEbmaterialdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let debmaterialdetails = await Ebmaterialdetails.findByIdAndRemove(id);
    if (!debmaterialdetails) {
        return next(new ErrorHandler('Ebmaterialdetails not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})