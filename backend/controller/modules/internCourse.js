const InternCourse = require('../../model/modules/internCourse');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get All internCourse => /api/internCourses
exports.getAllInternCourse = catchAsyncErrors(async (req, res, next) => {
    let internCourses;
    try{
        internCourses = await InternCourse.find()
    }catch(err){
        return next(new ErrorHandler("Records not found!", 404));
    }
    if(!internCourses){
        return next(new ErrorHandler('Interncourse not found!', 404));
    }
    return res.status(200).json({
        internCourses
    });
})
// Create new internCourse => /api/internCourse/new
exports.addInternCourse = catchAsyncErrors(async (req, res, next) =>{

   let checkloc = await InternCourse.findOne({ code: req.body.code });

   if(checkloc){
       return next(new ErrorHandler('Code already exist!', 400));
   }
   let checklocname = await InternCourse.findOne({ name: req.body.name });

   if(checklocname){
       return next(new ErrorHandler('Name already exist!', 400));
   }
   
   let aproduct = await InternCourse.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Single InternCourse => /api/internCourse/:id
exports.getSingleInternCourse = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sinternCourse = await InternCourse.findById(id);

    if(!sinternCourse){
        return next(new ErrorHandler('Intern Course not found!', 404));
    }
    return res.status(200).json({
        sinternCourse
    })
})
// update internCourse by id => /api/internCourse/:id
exports.updateInternCourse = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uinternCourse = await InternCourse.findByIdAndUpdate(id, req.body);

    if (!uinternCourse) {
      return next(new ErrorHandler('Intern Course not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete internCourse by id => /api/internCourse/:id
exports.deleteInternCourse = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dinternCourse = await InternCourse.findByIdAndRemove(id);

    if(!dinternCourse){
        return next(new ErrorHandler('Intern Course not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})