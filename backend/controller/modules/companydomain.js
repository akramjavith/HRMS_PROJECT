const Companydomain = require('../../model/modules/companydomain');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError'); 

//create new assignedby => /api/Assignedby/new
exports.addCompanydomain = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
console.log(req.body)
    let aCompanydomain = await Companydomain.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
    
})

// get Single Assignedby => /api/Assignedby/:id
exports.getSingleCompanydomain = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let companydomainn = await Companydomain.findById(id);
    if (!companydomainn) {
        return next(new ErrorHandler('companydomain not found', 404));
    }
    return res.status(200).json({
        companydomainn
    })
})

//update Assignedby by id => /api/Assignedby/:id
exports.updateCompanydomain = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let companydomainn = await Companydomain.findByIdAndUpdate(id, req.body);
    if (!companydomainn) {
        return next(new ErrorHandler('companydomain not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Assignedby by id => /api/Assignedby/:id
exports.deleteCompanydomain = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let companydomainn = await Companydomain.findByIdAndRemove(id);
    if (!companydomainn) {
        return next(new ErrorHandler('companydomain not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

//get All Source =>/api/assignedby
exports.getAllCompanydomain = catchAsyncErrors(async (req, res, next) => {
    let companydomainn;
    try {
        const { assignbranch } = req.body;

        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
          company: branchObj.company,
        }));
    
        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        const filterQuery = { $or: branchFilter };
        companydomainn = await Companydomain.find(filterQuery);
        // companydomainn = await Companydomain.find()  
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!companydomainn) {
        return next(new ErrorHandler('companydomain not found!', 404));
    }
    return res.status(200).json({
        companydomainn
    });
})