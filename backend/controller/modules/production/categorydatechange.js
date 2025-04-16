const CategoryDateChange = require('../../../model/modules/production/categorydatechange');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Categorydatechange =>/api/Categorydatechange
exports.getAllCategorydatechange = catchAsyncErrors(async (req, res, next) => {
    let categorydatechange;
    try {
        categorydatechange = await CategoryDateChange.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categorydatechange) {
        return next(new ErrorHandler('Timesheet not found!', 404));
    }

    return res.status(200).json({
        categorydatechange
    });
})


//create new categorydatechange => /api/categorydatechange/new
exports.addCategorydatechange = catchAsyncErrors(async (req, res, next) => {
   
    let categorydatechange = await CategoryDateChange.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single categorydatechange => /api/categorydatechange/:id
exports.getSingleCategorydatechange = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let categorydatechange = await CategoryDateChange.findById(id);
    if (!categorydatechange) {
        return next(new ErrorHandler('Timesheet not found', 404));
    }
    return res.status(200).json({
        categorydatechange
    })
})

//update categorydatechange by id => /api/categorydatechange/:id
exports.updateCategorydatechange = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let categorydatechange = await CategoryDateChange.findByIdAndUpdate(id, req.body);
    if (!categorydatechange) {
        return next(new ErrorHandler('Timesheet not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete categorydatechange by id => /api/categorydatechange/:id
exports.deleteCategorydatechange = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let categorydatechange = await CategoryDateChange.findByIdAndRemove(id);
    if (!categorydatechange) {
        return next(new ErrorHandler('Timesheet not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.categorydatechangeSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, result, totalPages, currentPage;
  
    const { page, pageSize } = req.body;
    try {
  
        totalProjects = await CategoryDateChange.countDocuments();
  
        result = await CategoryDateChange.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));
  
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
        totalProjects,
        result,
        currentPage: page,
        totalPages: Math.ceil(totalProjects / pageSize),
    });
  });