const projectDetails = require('../../../model/modules/project/projectdetails');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

exports.getAllProjectDetails = catchAsyncErrors(async (req, res, next) => {
    let projectdetails;
    try {
        projectdetails = await projectDetails.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projectdetails) {
        return next(new ErrorHandler('Project Details not found!', 404));
    }
    return res.status(200).json({
        projectdetails
    });
})


// Create new manage Project Details => /api/projectdetails/new
exports.addProjectDetails = catchAsyncErrors(async (req, res, next) =>{
    let checkmain = await projectDetails.findOne({ taskname: req.body.taskname });
    if(checkmain){
        return next(new ErrorHandler('Name already exist!', 400));
    }
   let aprojectdetails = await projectDetails.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})



// get Single Project Details => /api/projectdetails/:id
exports.getSingleProjectDetails = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sprojectdetails = await projectDetails.findById(id);

    if(!sprojectdetails){
        return next(new ErrorHandler('Project Details not found!', 404));
    }
    return res.status(200).json({
        sprojectdetails
    })
})



// update Project Details by id => /api/projectdetails/:id
exports.updateProjectDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojectdetails = await projectDetails.findByIdAndUpdate(id, req.body);

    if (!uprojectdetails) {
      return next(new ErrorHandler('Project Details not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})



// delete Project Details by id => /api/projectdetails/:id
exports.deleteProjectDetails = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dprojectdetails = await projectDetails.findByIdAndRemove(id);

    if(!dprojectdetails){
        return next(new ErrorHandler('Project Details not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})