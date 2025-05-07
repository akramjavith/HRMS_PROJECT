const Subpagethree = require('../../../model/modules/project/subpagethree');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


//get All Subpagethree =>/api/Subpagethrees
exports.getAllSubpagethree = catchAsyncErrors(async (req, res, next) => {
    let subpagesthree;
    try{
        subpagesthree = await Subpagethree.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!subpagesthree){
        return next(new ErrorHandler('Subpagethree not found!', 404));
    }
    return res.status(200).json({
        subpagesthree
    });
})
//create new Subpagethree => /api/Subpagethree/new
exports.addSubpagethree = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Subpagethree.findOne({ name: req.body.name });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let asubpagethree = await Subpagethree.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single Subpagethree => /api/Subpagethree/:id
exports.getSingleSubpagethree = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let ssubpagethree = await Subpagethree.findById(id);
    if(!ssubpagethree){
        return next(new ErrorHandler('Subpagethree not found', 404));
    }
    return res.status(200).json({
        ssubpagethree
    })
})

//update Subpagethree by id => /api/Subpagethree/:id
exports.updateSubpagethree = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubpagethree = await Subpagethree.findByIdAndUpdate(id, req.body);
    if (!usubpagethree) {
      return next(new ErrorHandler('Subpagethree not found', 404));
    }
    
    return res.status(200).json({message: 'Updated successfully' });
})
//delete Subpagethree by id => /api/Subpagethree/:id
exports.deleteSubpagethree = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsubpagethree = await Subpagethree.findByIdAndRemove(id);
    if(!dsubpagethree){
        return next(new ErrorHandler('Subpagethree not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})