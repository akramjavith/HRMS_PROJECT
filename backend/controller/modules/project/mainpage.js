const Mainpage = require('../../../model/modules/project/mainpage')
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
// get All Main page Details => /api/Mainpage
exports.getAllMain = catchAsyncErrors(async (req, res, next) => {
    let mains;
    try{
        mains = await Mainpage.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!mains){
        return next(new ErrorHandler('Mainpage details not found', 404));
    }
    return res.status(200).json({
        // count: Main.length,
        mains
    });
})
// Create new Mainpage => /api/mainpage/new
exports.addMain = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await Mainpage.findOne({ name: req.body.name });
   if(checkmain){
       return next(new ErrorHandler('Name already exist!', 400));
   }
    let amain = await Mainpage.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Mainpage => /api/mainpage/:id
exports.getSingleMainpage = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let smains = await Mainpage.findById(id);
    if(!smains){
        return next(new ErrorHandler('Mainpage not found', 404));
    }
    return res.status(200).json({
        smains
    })
})
// update Mainpage by id => /api/mainpage/:id
exports.updateMain = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upmains = await Mainpage.findByIdAndUpdate(id, req.body);
    if (!upmains) {
      return next(new ErrorHandler('Mainpage Details not found', 404));
    }
    return res.status(200).json({message: 'Updates successfully' });
})
// delete Mainpage by id => /api/mainpage/:id
exports.deleteMain = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dmains = await Mainpage.findByIdAndRemove(id);
    if(!dmains){
        return next(new ErrorHandler('Mainpage Details not found', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})
