const Projectcategory = require('../../../model/modules/project/projectcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Projectcategory => /api/Projectcategory
exports.getAllProjectcategory = catchAsyncErrors(async (req, res, next) => {
    let projectcategory;
    try{
        projectcategory = await Projectcategory.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!projectcategory){
        return next(new ErrorHandler('Manage not found!', 404));
    }
    return res.status(200).json({
        // count: projectcategory.length,
        projectcategory
    });
})

// Create new Projectcategory=> /api/projectcategory/new
exports.addprojectcategory = catchAsyncErrors(async (req, res, next) =>{
   let aprojectcategory = await Projectcategory.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Projectcategory => /api/projectcategory/:id
exports.getSingleprojectcategory = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sprojectcategory = await Projectcategory.findById(id);

    if(!sprojectcategory){
        return next(new ErrorHandler('projectcategory not found!', 404));
    }
    return res.status(200).json({
        sprojectcategory
    })
})

// update projectcategory by id => /api/projectcategory/:id
exports.updateprojectcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojectcategory = await Projectcategory.findByIdAndUpdate(id, req.body);

    if (!uprojectcategory) {
      return next(new ErrorHandler('projectcategory not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

exports.deleteprojectcategory = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dprojectcategory = await Projectcategory.findByIdAndRemove(id);

    if(!dprojectcategory){
        return next(new ErrorHandler('projectcategory not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})