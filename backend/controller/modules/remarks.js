const Remarks = require('../../model/modules/remarks');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All Remarks =>/api/remarks
exports.getAllRemarks = catchAsyncErrors(async (req, res, next) => {
    let remarks;
    try{
        remarks = await Remarks.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!remarks){
        return next(new ErrorHandler('Remarks not found!', 404));
    }
    return res.status(200).json({
        remarks
    });
})


//create new remarks => /api/remark/new
exports.addRemarks = catchAsyncErrors(async (req, res, next) =>{
 
    let aremarks = await Remarks.create(req.body);
    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})


// get Single remarks=> /api/remark/:id
exports.getSingleRemarks = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let sremarks = await Remarks.findById(id);
    if(!sremarks){
        return next(new ErrorHandler('Remarks not found', 404));
    }
    return res.status(200).json({
        sremarks
    })
})



//update remark by id => /api/remark/:id
exports.updateRemarks = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uremarks = await Remarks.findByIdAndUpdate(id, req.body);
    if (!uremarks) {
      return next(new ErrorHandler('Remarks not found', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})


//delete remark by id => /api/remark/:id
exports.deleteRemarks = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dremarks = await Remarks.findByIdAndRemove(id);
    if(!dremarks){
        return next(new ErrorHandler('Remarks not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})
