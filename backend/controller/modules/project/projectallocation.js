const ProjectAllocation = require('../../../model/modules/project/projectallocation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Project allocation => /api/projectallocation
exports.getAllProjectAllocation = catchAsyncErrors(async (req, res, next) => {
    let projectallocation;
    try{
        projectallocation = await ProjectAllocation.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!projectallocation){
        return next(new ErrorHandler('Project Allocation not found!', 404));
    }
    return res.status(200).json({
        projectallocation
    });
})


// Create new manage Project Allocation => /api/projectallocation/new
exports.addProjectAllocation = catchAsyncErrors(async (req, res, next) =>{
 
   let aprojectallocation = await ProjectAllocation.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})



// get Single Project Allocation => /api/projectallocation/:id
exports.getSingleProjectAllocation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sprojectallocation = await ProjectAllocation.findById(id);

    if(!sprojectallocation){
        return next(new ErrorHandler('Project Allocation not found!', 404));
    }
    return res.status(200).json({
        sprojectallocation
    })
})



// update Project Allocationn by id => /api/projectallocation/:id
exports.updateProjectAllocation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojectallocation = await ProjectAllocation.findByIdAndUpdate(id, req.body);

    if (!uprojectallocation) {
      return next(new ErrorHandler('Project Allocationn not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})



// delete Project Allocationn by id => /api/projectallocation/:id
exports.deleteProjectAllocation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dprojectallocation = await ProjectAllocation.findByIdAndRemove(id);

    if(!dprojectallocation){
        return next(new ErrorHandler('Project Allocation not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})