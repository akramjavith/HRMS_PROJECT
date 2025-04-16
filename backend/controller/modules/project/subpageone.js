const Subpageone = require('../../../model/modules/project/subpageone');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


//get All Subpageone =>/api/Subpageones
exports.getAllSubpageone = catchAsyncErrors(async (req, res, next) => {
    let subpagesone;
    try{
        subpagesone = await Subpageone.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!subpagesone){
        return next(new ErrorHandler('Subpageone not found!', 404));
    }
    return res.status(200).json({
        subpagesone
    });
})
//create new Subpageone => /api/Subpageone/new
exports.addSubpageone = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Subpageone.findOne({ name: req.body.name });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let asubpageone = await Subpageone.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single Subpageone => /api/Subpageone/:id
exports.getSingleSubpageone = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let ssubpageone = await Subpageone.findById(id);
    if(!ssubpageone){
        return next(new ErrorHandler('Subpageone not found', 404));
    }
    return res.status(200).json({
        ssubpageone
    })
})

//update Subpageone by id => /api/Subpageone/:id
exports.updateSubpageone = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubpageone = await Subpageone.findByIdAndUpdate(id, req.body);
    if (!usubpageone) {
      return next(new ErrorHandler('Subpageone not found', 404));
    }
    
    return res.status(200).json({message: 'Updated successfully' });
})
//delete Subpageone by id => /api/Subpageone/:id
exports.deleteSubpageone = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsubpageone = await Subpageone.findByIdAndRemove(id);
    if(!dsubpageone){
        return next(new ErrorHandler('Subpageone not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})