const ProjectEstimation = require('../../../model/modules/project/projectestimation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Project Estimation => /api/projectestimation
exports.getAllProjectEstimation = catchAsyncErrors(async (req, res, next) => {
    let projectestimation;
    try{
        projectestimation = await ProjectEstimation.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!projectestimation){
        return next(new ErrorHandler('Project Estimation not found!', 404));
    }
    return res.status(200).json({
        projectestimation
    });
})


// Create new manage Project Estimation => /api/projectestimation/new
exports.addProjectEstimation = catchAsyncErrors(async (req, res, next) =>{
    
   let aprojectestimation = await ProjectEstimation.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})



// get Single Project Estimation => /api/projectestimation/:id
exports.getSingleProjectEstimation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sprojectestimation = await ProjectEstimation.findById(id);

    if(!sprojectestimation){
        return next(new ErrorHandler('Project Estimation not found!', 404));
    }
    return res.status(200).json({
        sprojectestimation
    })
})



// update Project Estimation by id => /api/projectestimation/:id
exports.updateProjectEstimation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojectestimation = await ProjectEstimation.findByIdAndUpdate(id, req.body);

    if (!uprojectestimation) {
      return next(new ErrorHandler('Project Estimation not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})



// delete Project Estimation by id => /api/projectestimation/:id
exports.deleteProjectEstimation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dprojectestimation = await ProjectEstimation.findByIdAndRemove(id);

    if(!dprojectestimation){
        return next(new ErrorHandler('Project Estimation not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})