const Subpagefour = require('../../../model/modules/project/subpagefour');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


//get All Subpagefour =>/api/Subpagefours
exports.getAllSubpagefour = catchAsyncErrors(async (req, res, next) => {
    let subpagesfour;
    try{
        subpagesfour = await Subpagefour.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!subpagesfour){
        return next(new ErrorHandler('Subpagefour not found!', 404));
    }
    return res.status(200).json({
        subpagesfour
    });
})
//create new Subpagefour => /api/Subpagefour/new
exports.addSubpagefour = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Subpagefour.findOne({ name: req.body.name });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let asubpagefour = await Subpagefour.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single Subpagefour => /api/Subpagefour/:id
exports.getSingleSubpagefour = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let ssubpagefour = await Subpagefour.findById(id);
    if(!ssubpagefour){
        return next(new ErrorHandler('Subpagefour not found', 404));
    }
    return res.status(200).json({
        ssubpagefour
    })
})

//update Subpagefour by id => /api/Subpagefour/:id
exports.updateSubpagefour = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubpagefour = await Subpagefour.findByIdAndUpdate(id, req.body);
    if (!usubpagefour) {
      return next(new ErrorHandler('Subpagefour not found', 404));
    }
    
    return res.status(200).json({message: 'Updated successfully' });
})
//delete Subpagefour by id => /api/Subpagefour/:id
exports.deleteSubpagefour = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsubpagefour = await Subpagefour.findByIdAndRemove(id);
    if(!dsubpagefour){
        return next(new ErrorHandler('Subpagefour not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})