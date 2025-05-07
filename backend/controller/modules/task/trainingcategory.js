const Trainingcategory = require('../../../model/modules/task/trainingcategory');
const Trainingsubcategory = require('../../../model/modules/task/trainingsubcategory');
const TrainingDetails = require('../../../model/modules/task/trainingdetails');
const TrainingForUser = require("../../../model/modules/task/trainingforuser");

const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Trainingcategory =>/api/Trainingcategory
exports.getAllTrainingcategory = catchAsyncErrors(async (req, res, next) => {
    let trainingcategorys;
    try {
        trainingcategorys = await Trainingcategory.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!trainingcategorys) {
        return next(new ErrorHandler('Trainingcategory not found!', 404));
    }
    return res.status(200).json({
        trainingcategorys
    });
})



exports.getOverallTrainingEditCategory = catchAsyncErrors(async (req, res, next) => {
    let trainingsubcate, tran , trainingDetails, trainingUsers , trandetails, trandetailslog;
    try {
        trainingsubcate = await Trainingsubcategory.find({ category: req.body.category })
        trainingDetails = await TrainingDetails.find()
         tran= await TrainingForUser.find()
        trandetails = trainingDetails?.filter(data => 
            {
                return data?.trainingdocuments?.some(dat => dat?.category === req.body.category)

            }
        )
        trandetailslog = trainingDetails?.filter(data => 
            {
                return data?.trainingdetailslog?.some(dat => dat?.category === req.body.category)

            }
        )

        trainingUsers = tran?.filter(data => 
            {
                return data?.trainingdocuments?.some(dat => dat?.category === req.body.category)

            }
        )
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!trainingsubcate && !trainingUsers && trandetails && !trandetailslog ) {
        return next(new ErrorHandler('Taskcategory not found!', 404));
    }
    return res.status(200).json({
        count: trainingsubcate?.length + trainingUsers?.length + trandetails?.length + trandetailslog?.length
        , trainingsubcate, trainingUsers, trandetails , trandetailslog,
    });
})

exports.getOverallTrainingDeleteCategory = catchAsyncErrors(async (req, res, next) => {
    let trainsubcate, trainDetails, tasforuser, trainUser, taskcate, result, count;
    let id = req.body.id
    try {

        taskcate = await Trainingcategory.find()
        const answer = taskcate?.filter(data => id?.includes(data._id?.toString()))

        trainsubcate = await Trainingsubcategory.find()
        trainDetails = await TrainingDetails.find()



        const unmatchedSubCate = answer.filter(answers => trainsubcate.some(sub => sub.category === answers.categoryname))?.map(data => data._id?.toString());
        const unmatchedtaskdesig = answer.filter(answers => trainDetails.some(sub => sub.trainingdocuments?.some(ite => ite.category === answers.categoryname)))?.map(data => data._id?.toString());
        const duplicateId = [ ...unmatchedSubCate , ...unmatchedtaskdesig]
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


//create new Trainingcategory => /api/Trainingcategory/new
exports.addTrainingcategory = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTrainingcategory = await Trainingcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Trainingcategory => /api/Trainingcategory/:id
exports.getSingleTrainingcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let strainingcategory = await Trainingcategory.findById(id);
    if (!strainingcategory) {
        return next(new ErrorHandler('Trainingcategory not found', 404));
    }
    return res.status(200).json({
        strainingcategory
    })
})

//update Trainingcategory by id => /api/Trainingcategory/:id
exports.updateTrainingcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utrainingcategory = await Trainingcategory.findByIdAndUpdate(id, req.body);
    if (!utrainingcategory) {
        return next(new ErrorHandler('Trainingcategory not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Trainingcategory by id => /api/Trainingcategory/:id
exports.deleteTrainingcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtrainingcategory = await Trainingcategory.findByIdAndRemove(id);
    if (!dtrainingcategory) {
        return next(new ErrorHandler('Trainingcategory not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})