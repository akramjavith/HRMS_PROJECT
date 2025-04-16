const EducationCategory = require('../../model/modules/educationcategory');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get all EducationCategory => /api/EducationCategory

exports.getAllEducationCategory = catchAsyncErrors(async (req, res, next) => {
    let educationcategory
    try {
        educationcategory = await EducationCategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404)); 
    }
    if (!educationcategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the educationcategory
    const alldoccategory = educationcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        educationcategory: alldoccategory
    });

})


exports.addEducationCategory = catchAsyncErrors(async (req, res, next) => {
    await EducationCategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleEducationCategory  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let seducationcategory = await EducationCategory.findById(id);
    if(!seducationcategory){
        return next(new ErrorHandler('educations not found'));

    }
    return res.status(200).json({
        seducationcategory
    });

});

exports.updateEducationCategory = catchAsyncErrors(async (req , res , next)=>{

    const id = req.params.id

    let ueducationcategory  = await EducationCategory.findByIdAndUpdate(id , req.body);

    if(!ueducationcategory){
        return next( new ErrorHandler('education not found'));
    }
return res.status(200).json({
    message :'Update Successfully' , ueducationcategory
});
});



//delete EducationCategory by id => /api/deleducationcateg/:id
exports.deleteEducationCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let deducationcategory = await EducationCategory.findByIdAndRemove(id);
    if (!deducationcategory) {
        return next(new ErrorHandler('education not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})



