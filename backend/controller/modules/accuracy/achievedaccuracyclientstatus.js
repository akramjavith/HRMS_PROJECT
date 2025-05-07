const AcheivedAccuracyClient = require('../../../model/modules/accuracy/achievedaccuracyclientstatus');
const ExpectedAccuracy = require('../../../model/modules/accuracy/expectedaccuracy');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All acheivedaccuracy => /api/acheivedaccuracyclient
exports.getAllAcheivedAccuracyclient = catchAsyncErrors(async (req, res, next) => {
    let acheivedaccuracy;
    try {
        acheivedaccuracy = await AcheivedAccuracyClient.find()
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


exports.addAcheivedAccuracyclient = catchAsyncErrors(async (req, res, next) => {
    try {
        const { project, vendor, queue,date,clientstatus } = req.body;
        
        const existingRecords = await AcheivedAccuracyClient.find({ 
            project, 
            vendor, 
            queue, 
            date,
            clientstatus,
            
        });


        if (existingRecords.length > 0) {
            return res.status(400).json({
                message: 'This Data is Already Exists!'
            });
        }

        const newRecord = await AcheivedAccuracyClient.create(req.body);

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
 
// get Single acheivedaccuracy => /api/acheivedaccuracyclient/:id
exports.getSingleAcheivedAccuracyclient = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sacheivedaccuracy = await AcheivedAccuracyClient.findById(id);

    if (!sacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracyClient not found!', 404));
    }
    return res.status(200).json({
        sacheivedaccuracy
    })
})

// get Single expectedaccuracy => /api/expectedaccuracy/single
exports.getSingleExpectedAccuracyByDetailsClient = catchAsyncErrors(async (req, res, next) => {
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

    // if (!sacheivedaccuracy) {
    //     return next(new ErrorHandler('AcheivedAccuracyClient not found!', 404));
    // }
    // return res.status(200).json({
    //     sacheivedaccuracy
    // })
})

// get Single achievedaccuracy => /api/acheivedaccuracyclient/single
exports.getSingleAchivedAccuracyByDetailsClient = catchAsyncErrors(async (req, res, next) => {
    // const id = req.params.id;
    
    const { project, queue,expectedaccuracyfrom,expectedaccuracyto } = req.body;

    let existinglist = await AcheivedAccuracyClient.find({
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


// update acheivedaccuracy by id => /api/acheivedaccuracyclient/:id
exports.updateAcheivedAccuracyClient = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    try {
        const { project, vendor, queue, acheivedaccuracy,date } = req.body;

        const existingRecords = await AcheivedAccuracyClient.find({ 
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
        let uacheivedaccuracy = await AcheivedAccuracyClient.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracyClient not found!', 404));
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

// update acheivedaccuracy by id => /api/acheivedaccuracyclient/:id
exports.updateAcheivedAccuracyByIdClient = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    try {
        // If no existing records or no duplicate subcategory found, create a new record
        let uacheivedaccuracy = await AcheivedAccuracyClient.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracyClient not found!', 404));
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

// delete acheivedaccuracy by id => /api/acheivedaccuracyclient/:id
exports.deleteAcheivedAccuracyClient = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dacheivedaccuracy = await AcheivedAccuracyClient.findByIdAndRemove(id);

    if (!dacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracyClient not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

