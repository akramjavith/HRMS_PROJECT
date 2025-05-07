const ChecklistCategory = require('../../../model/modules/interview/checklistcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get all ChecklistCategory => /api/ChecklistCategory

exports.getAllChecklistCategory = catchAsyncErrors(async (req, res, next) => {
    let checklistcategory
    try {
        checklistcategory = await ChecklistCategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404)); 
    }
    if (!checklistcategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the checklistcategory
    const alldoccategory = checklistcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        checklistcategory: alldoccategory
    });

})


exports.addChecklistCategory = catchAsyncErrors(async (req, res, next) => {
    await ChecklistCategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleChecklistCategory  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let schecklistcategory = await ChecklistCategory.findById(id);
    if(!schecklistcategory){
        return next(new ErrorHandler('checklists not found'));

    }
    return res.status(200).json({
        schecklistcategory
    });

});

exports.updateChecklistCategory = catchAsyncErrors(async (req , res , next)=>{

    const id = req.params.id

    let uchecklistcategory  = await ChecklistCategory.findByIdAndUpdate(id , req.body);

    if(!uchecklistcategory){
        return next( new ErrorHandler('checklists not found'));
    }
return res.status(200).json({
    message :'Update Successfully' , uchecklistcategory
});
});



//delete ChecklistCategory by id => /api/ChecklistCategory/:id
exports.deleteChecklistCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dchecklistcategory = await ChecklistCategory.findByIdAndRemove(id);
    if (!dchecklistcategory) {
        return next(new ErrorHandler('checklists not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})



