const RequiredFields = require('../../../model/modules/tickets/requiredmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
//get All RequiredFields =>/api/requiredfields
exports.getAllRequiredFields = catchAsyncErrors(async (req, res, next) => {
    let required;
    try {
        required = await RequiredFields.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!required) {
        return next(new ErrorHandler('RequiredFields not found!', 404));
    }
    return res.status(200).json({
        required
    });
})


//get All SelfCheckPointTicketMaster =>/api/requiredfieldmasters
exports.getOverallRequireddelete = catchAsyncErrors(async (req, res, next) => {
    let requiredfieldmasters , requiredfield ;
    let self = req.body.oldname

    try {
        requiredfieldmasters = await Raiseticketmaster.find() 
        requiredfield = self.subsubcategory?.length > 0  ? 
        
        requiredfieldmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.subsubcategory?.includes(data.subsubcategory)) 
        : requiredfieldmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory)) 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!requiredfield) {
        return next(new ErrorHandler('Raise Ticket Master not found!', 404));
    }
    return res.status(200).json({
        requiredfield , count : requiredfield.length
    });
})
//get All SelfCheckPointTicketMaster =>/api/requiredfieldmasters
exports.getOverallBulkRequireddelete = catchAsyncErrors(async (req, res, next) => {
    let requiredfieldmasters ,priority,duemaster , result , count, requiredfield ;
    let id = req.body.id

    try {
        requiredfieldmasters = await Raiseticketmaster.find() 
 
        duemaster = await RequiredFields.find() 
        const answer = duemaster?.filter(data => id?.includes(data._id?.toString()))


        const unmatchedtaskdesig = answer.filter(answers => 
            requiredfieldmasters.some(data => answers.category?.includes(data.category) 
            && answers.subcategory?.includes(data.subcategory) 
            && (answers?.subsubcategory?.length > 0 ?  answers.subsubcategory?.includes(data.subsubcategory) : true)
            && (answers?.overalldetails?.some(item => 
                data?.requiredfields?.length > 0 ?  
                data?.requiredfields?.some(ans => ans?.options === item.options && ans?.details === item?.details)
                 : true))
                ))
             ?.map(data => data._id?.toString());
           
        const duplicateId = [...unmatchedtaskdesig]

        result = id?.filter(data => !duplicateId?.includes(data))
        count = id?.filter(data => !duplicateId?.includes(data))?.length


} catch (err) {
   return next(new ErrorHandler("Records not found!", 404));
}
return res.status(200).json({
   count: count,
   result
});
})

//create new RequiredFields => /api/requiredfields/new
exports.addRequiredFields = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aReasonmaster = await RequiredFields.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single RequiredFields => /api/requiredfields/:id
exports.getSingleRequiredFields = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let srequired = await RequiredFields.findById(id);
    if (!srequired) {
        return next(new ErrorHandler('RequiredFields not found', 404));
    }
    return res.status(200).json({
        srequired
    })
})

//update RequiredFields by id => /api/requiredfields/:id
exports.updateRequiredFields = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let urequired = await RequiredFields.findByIdAndUpdate(id, req.body);
    if (!urequired) {
        return next(new ErrorHandler('RequiredFields not found', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

//delete RequiredFields by id => /api/requiredfields/:id
exports.deleteRequiredFields = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let drequired = await RequiredFields.findByIdAndRemove(id);
    if (!drequired) {
        return next(new ErrorHandler('RequiredFields not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})