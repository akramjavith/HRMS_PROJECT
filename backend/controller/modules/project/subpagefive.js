const Subpagefive = require('../../../model/modules/project/subpagefive');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


//get All Subpagefive =>/api/Subpagefives
exports.getAllSubpagefive = catchAsyncErrors(async (req, res, next) => {
    let subpagesfive;
    try{
        subpagesfive = await Subpagefive.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!subpagesfive){
        return next(new ErrorHandler('Subpagefive not found!', 404));
    }
    return res.status(200).json({
        subpagesfive
    });
})
//create new Subpagefive => /api/Subpagefive/new
exports.addSubpagefive = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Subpagefive.findOne({ name: req.body.name });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let asubpagefive = await Subpagefive.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single Subpagefive => /api/Subpagefive/:id
exports.getSingleSubpagefive = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let ssubpagefive = await Subpagefive.findById(id);
    if(!ssubpagefive){
        return next(new ErrorHandler('Subpagefive not found', 404));
    }
    return res.status(200).json({
        ssubpagefive
    })
})

//update Subpagefive by id => /api/Subpagefive/:id
exports.updateSubpagefive = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubpagefive = await Subpagefive.findByIdAndUpdate(id, req.body);
    if (!usubpagefive) {
      return next(new ErrorHandler('Subpagefive not found', 404));
    }
    
    return res.status(200).json({message: 'Updated successfully' });
})
//delete Subpagefive by id => /api/Subpagefive/:id
exports.deleteSubpagefive = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsubpagefive = await Subpagefive.findByIdAndRemove(id);
    if(!dsubpagefive){
        return next(new ErrorHandler('Subpagefive not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})