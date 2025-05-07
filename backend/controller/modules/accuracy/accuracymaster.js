const Accuracymaster = require('../../../model/modules/accuracy/accuracymaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All accuracymaster => /api/accuracymaster
exports.getAllAccuracymaster = catchAsyncErrors(async (req, res, next) => {
    let accuracymaster;
    try {
        accuracymaster = await Accuracymaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!accuracymaster) {
        return next(new ErrorHandler('vendormaster not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        accuracymaster
    });
})

//create new accuracymaster => /api/accuracymaster/new
exports.addaccuracymaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAccuracymaster = await Accuracymaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})


exports.getOverallAccuracymasterSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects , result , totalPages , currentPage;
  
    const {frequency, page, pageSize } = req.body;
    try {
  
      totalProjects =  await Accuracymaster.countDocuments();
  
  
      result = await Accuracymaster.find()
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
  





// get Signle accuracymaster => /api/accuracymaster/:id
exports.getSingleAccuracymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let singleaccuracymaster = await Accuracymaster.findById(id);

    if (!singleaccuracymaster) {
        return next(new ErrorHandler('Accuracymaster not found!', 404));
    }
    return res.status(200).json({
        singleaccuracymaster
    })
})


//update Accuracymaster by id => /api/Accuracymaster/:id
exports.updateaccuracymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaccuracymaster = await Accuracymaster.findByIdAndUpdate(id, req.body);
    if (!uaccuracymaster) {
        return next(new ErrorHandler('Accuracymaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})


// delete accuracymaster by id => /api/accuracymaster/:id
exports.deleteaccuracymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let daccuracymaster = await Accuracymaster.findByIdAndRemove(id);

    if (!daccuracymaster) {
        return next(new ErrorHandler('Accuracymaster not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

