const Trainingsubcategory = require('../../../model/modules/task/trainingsubcategory');
const TrainingDetails = require('../../../model/modules/task/trainingdetails');
const TrainingForUser = require("../../../model/modules/task/trainingforuser");
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Trainingsubcategory =>/api/Trainingsubcategory
exports.getAllTrainingsubcategory = catchAsyncErrors(async (req, res, next) => {
    let trainingsubcategorys;
    try {
        trainingsubcategorys = await Trainingsubcategory.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!trainingsubcategorys) {
        return next(new ErrorHandler('Trainingsubcategory not found!', 404));
    }
    return res.status(200).json({
        trainingsubcategorys
    });
})


exports.getOverallTrainingEditSubCategory = catchAsyncErrors(async (req, res, next) => {
    let  tran , trainingDetails, trainingUsers , trandetails,trandetailslog;
    try {
        trainingDetails = await TrainingDetails.find()
         tran= await TrainingForUser.find()
        trandetails = trainingDetails?.filter(data => 
            {
                return data?.trainingdocuments?.some(dat => dat?.subcategory === req.body.subcategory)

            }
        )
        trandetailslog = trainingDetails?.filter(data => 
            {
                return data?.trainingdetailslog?.some(dat => dat?.subcategory === req.body.subcategory)

            }
        )
        trainingUsers = tran?.filter(data => 
            {
                return data?.trainingdocuments?.some(dat => dat?.subcategory === req.body.subcategory)

            }
        )
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if ( !trainingUsers && !trandetails && !trandetailslog  ) {
        return next(new ErrorHandler('Taskcategory not found!', 404));
    }
    return res.status(200).json({
        count:trainingUsers?.length + trandetails?.length + trandetailslog.length
        , trainingUsers, trandetails,trandetailslog
    });
})

exports.getOverallTrainingDeleteSubCategory = catchAsyncErrors(async (req, res, next) => {
    let  trainDetails, tasforuser, trainUser, taskcate, result, count;
    let id = req.body.id
    try {
        taskcate =  await Trainingsubcategory.find() 
        const answer = taskcate?.filter(data => id?.includes(data._id?.toString()))
        trainDetails = await TrainingDetails.find()
        const unmatchedtaskdesig = answer.filter(answers => trainDetails.some(sub => sub.trainingdocuments?.some(ite => ite.subcategory === answers.subcategoryname)))?.map(data => data._id?.toString());
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





//create new Trainingsubcategory => /api/Trainingsubcategory/new
exports.addTrainingsubcategory = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTrainingsubcategory = await Trainingsubcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Trainingsubcategory => /api/Trainingsubcategory/:id
exports.getSingleTrainingsubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let strainingsubcategory = await Trainingsubcategory.findById(id);
    if (!strainingsubcategory) {
        return next(new ErrorHandler('Trainingsubcategory not found', 404));
    }
    return res.status(200).json({
        strainingsubcategory
    })
})

//update Trainingsubcategory by id => /api/Trainingsubcategory/:id
exports.updateTrainingsubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utrainingsubcategory = await Trainingsubcategory.findByIdAndUpdate(id, req.body);
    if (!utrainingsubcategory) {
        return next(new ErrorHandler('Trainingsubcategory not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Trainingsubcategory by id => /api/Trainingsubcategory/:id
exports.deleteTrainingsubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtrainingsubcategory = await Trainingsubcategory.findByIdAndRemove(id);
    if (!dtrainingsubcategory) {
        return next(new ErrorHandler('Trainingsubcategory not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})