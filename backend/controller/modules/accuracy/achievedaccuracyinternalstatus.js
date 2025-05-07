const AcheivedAccuracyInternal = require('../../../model/modules/accuracy/achievedaccuracyinternalstatus');
const ExpectedAccuracy = require('../../../model/modules/accuracy/expectedaccuracy');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All acheivedaccuracy => /api/acheivedaccuracyinternal
exports.getAllAcheivedAccuracyinternal = catchAsyncErrors(async (req, res, next) => {
    let acheivedaccuracy;
    try {
        acheivedaccuracy = await AcheivedAccuracyInternal.find()
    } catch (err) {
    }
    if (!acheivedaccuracy) {
        return next(new ErrorHandler('Expected accuracy not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        acheivedaccuracy
    });
})


exports.addAcheivedAccuracyinternal = catchAsyncErrors(async (req, res, next) => {
    try {
        const { project, vendor, queue,date,internalstatus } = req.body;
        
        const existingRecords = await AcheivedAccuracyInternal.find({ 
            project, 
            vendor, 
            queue, 
            date,
            internalstatus,
            
        });


        if (existingRecords.length > 0) {
            return res.status(400).json({
                message: 'This Data is Already Exists!'
            });
        }

        const newRecord = await AcheivedAccuracyInternal.create(req.body);

        return res.status(200).json({
            message: 'Successfully added!',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});
 
// get Single acheivedaccuracy => /api/acheivedaccuracyinternal/:id
exports.getSingleAcheivedAccuracyinternal = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sacheivedaccuracy = await AcheivedAccuracyInternal.findById(id);

    if (!sacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracyInternal not found!', 404));
    }
    return res.status(200).json({
        sacheivedaccuracy
    })
})

// get Single expectedaccuracy => /api/expectedaccuracy/single
exports.getSingleExpectedAccuracyByDetailsinternal = catchAsyncErrors(async (req, res, next) => {
    // const id = req.params.id;
    
    const { project,queue,acheivedaccuracy } = req.body;

    let existinglist = await ExpectedAccuracy.find({
        project,queue,$and: [
            { expectedaccuracyfrom: { $lte: acheivedaccuracy } }, 
            { expectedaccuracyto: { $gte: acheivedaccuracy } }
        ]
    });

    if (existinglist.length >0){
        return res.status(200).json({
            existinglist
        })
     
        }
        
    else {
        return next(new ErrorHandler('Data not found!', 404));
    }

   
})

// get Single achievedaccuracy => /api/acheivedaccuracyinternal/single
exports.getSingleAchivedAccuracyByDetailsinternal = catchAsyncErrors(async (req, res, next) => {
    // const id = req.params.id;
    
    const { project, queue,expectedaccuracyfrom,expectedaccuracyto } = req.body;

    let existinglist = await AcheivedAccuracyInternal.find({
        project,queue,$and: [
            { acheivedaccuracy: { $lte: expectedaccuracyto } }, 
            { acheivedaccuracy: { $gte: expectedaccuracyfrom } }
        ]
    });

    if (existinglist.length >0){

        return res.status(200).json({
            existinglist
        });
    }

       
        
    else {
        return next(new ErrorHandler('Data not found!', 404));
    }

})


// update acheivedaccuracy by id => /api/acheivedaccuracyinternal/:id
exports.updateAcheivedAccuracyInternal = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    try {
        const { project, vendor, queue, acheivedaccuracy,date } = req.body;

        const existingRecords = await AcheivedAccuracyInternal.find({ 
            project, 
            vendor, 
            queue, 
            date, 
            acheivedaccuracy,
            _id: { $ne: id }
            
        });

       
        if (existingRecords.length > 0) {
            return res.status(400).json({
                message: 'This Data is Already Exists!'
            });
        }

        // If no existing records or no duplicate subcategory found, create a new record
        let uacheivedaccuracy = await AcheivedAccuracyInternal.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracyInternal not found!', 404));
        }

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

})

// update acheivedaccuracy by id => /api/acheivedaccuracyinternal/:id
exports.updateAcheivedAccuracyByIdInternal = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    try {
        // If no existing records or no duplicate subcategory found, create a new record
        let uacheivedaccuracy = await AcheivedAccuracyInternal.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracyInternal not found!', 404));
        }

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

})

// delete acheivedaccuracy by id => /api/acheivedaccuracyinternal/:id
exports.deleteAcheivedAccuracyInternal = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dacheivedaccuracy = await AcheivedAccuracyInternal.findByIdAndRemove(id);

    if (!dacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracyInternal not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

