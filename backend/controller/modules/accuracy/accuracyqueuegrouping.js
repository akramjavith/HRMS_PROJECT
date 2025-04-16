const Accuracyqueuegrouping = require('../../../model/modules/accuracy/accuracyqueuegrouping');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Accuracyqueuegrouping => /api/Accuracyqueuegrouping
exports.getAllAccuracyqueuegrouping = catchAsyncErrors(async (req, res, next) => {
    let accuracyqueuegroupings;
    try {
        accuracyqueuegroupings = await Accuracyqueuegrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!accuracyqueuegroupings) {
        return next(new ErrorHandler('Accuracyqueuegrouping not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        accuracyqueuegroupings
    });
})

//create new Accuracyqueuegrouping => /api/Accuracyqueuegrouping/new
exports.addAccuracyqueuegrouping = catchAsyncErrors(async (req, res, next) => {
  
    let aAccuracyqueuegrouping = await Accuracyqueuegrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

exports.getOverallAccuracyQueueGroupingSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects , result , totalPages , currentPage;
  
    const {frequency, page, pageSize } = req.body;
    try {
  
      totalProjects =  await Accuracyqueuegrouping.countDocuments();
  
  
      result = await Accuracyqueuegrouping.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));
  
  
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
       totalProjects,
      result,
      currentPage:  page ,
      totalPages: Math.ceil( totalProjects / pageSize),
    });
  });
  

// get Signle Accuracyqueuegrouping => /api/Accuracyqueuegrouping/:id
exports.getSingleAccuracyqueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let saccuracyqueuegrouping = await Accuracyqueuegrouping.findById(id);

    if (!saccuracyqueuegrouping) {
        return next(new ErrorHandler('Accuracyqueuegrouping not found!', 404));
    }
    return res.status(200).json({
        saccuracyqueuegrouping
    })
})


//update Accuracyqueuegrouping by id => /api/Accuracyqueuegrouping/:id
exports.updateAccuracyqueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaccuracyqueuegrouping = await Accuracyqueuegrouping.findByIdAndUpdate(id, req.body);
    if (!uaccuracyqueuegrouping) {
        return next(new ErrorHandler('Accuracyqueuegrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})


// delete Accuracyqueuegrouping by id => /api/Accuracyqueuegrouping/:id
exports.deleteAccuracyqueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let daccuracyqueuegrouping = await Accuracyqueuegrouping.findByIdAndRemove(id);

    if (!daccuracyqueuegrouping) {
        return next(new ErrorHandler('Accuracyqueuegrouping not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

