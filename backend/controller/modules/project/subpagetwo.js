const Subpagetwo = require('../../../model/modules/project/subpagetwo');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


//get All Subpagetwo =>/api/Subpagetwos
exports.getAllSubpagetwo = catchAsyncErrors(async (req, res, next) => {
    let subpagestwo;
    try{
        subpagestwo = await Subpagetwo.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!subpagestwo){
        return next(new ErrorHandler('Subpagetwo not found!', 404));
    }
    return res.status(200).json({
        subpagestwo
    });
})
//create new Subpagetwo => /api/Subpagetwo/new
exports.addSubpagetwo = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Subpagetwo.findOne({ name: req.body.name });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let asubpagetwo = await Subpagetwo.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single Subpagetwo => /api/Subpagetwo/:id
exports.getSingleSubpagetwo = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let ssubpagetwo = await Subpagetwo.findById(id);
    if(!ssubpagetwo){
        return next(new ErrorHandler('Subpagetwo not found', 404));
    }
    return res.status(200).json({
        ssubpagetwo
    })
})

//update Subpagetwo by id => /api/Subpagetwo/:id
exports.updateSubpagetwo = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubpagetwo = await Subpagetwo.findByIdAndUpdate(id, req.body);
    if (!usubpagetwo) {
      return next(new ErrorHandler('Subpagetwo not found', 404));
    }
    
    return res.status(200).json({message: 'Updated successfully' });
})
//delete Subpagetwo by id => /api/Subpagetwo/:id
exports.deleteSubpagetwo = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsubpagetwo = await Subpagetwo.findByIdAndRemove(id);
    if(!dsubpagetwo){
        return next(new ErrorHandler('Subpagetwo not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})