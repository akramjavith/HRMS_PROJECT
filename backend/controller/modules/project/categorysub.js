const Categorysub = require('../../../model/modules/project/categorysub');
const Checkgroup = require('../../../model/modules/project/checkpointgroup');
const ErrorHandler = require('../../../utils/errorhandler');
const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All SubCategory =>/api/subcategories
exports.getAllCategorysub = catchAsyncErrors(async (req, res, next) => {
    let category;
    try {
        category = await Categorysub.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!category) {
        return next(new ErrorHandler('Priority not found!', 404));
    }
    return res.status(200).json({
        category
    });
})

// get overAll edit functionality
exports.getOverAllCategoryDetails = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups
    try {
        checkptgroups = await Checkgroup.find({ category: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Checkgroup not found', 404));
    }
    return res.status(200).json({
        count: checkptgroups.length,
        checkptgroups
    });
})

//create new SubCategory => /api/category/new
exports.addCategorysub = catchAsyncErrors(async (req, res, next) => {
    let checkCategory = await Categorysub.findOne({ categoryname: req.body.categoryname });
    if (checkCategory) {
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let acategory = await Categorysub.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// Subcategory: controller:
// get overall delete functionality for categoryname
exports.getCategorysubToCheckgroup = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups;
    try {
        checkptgroups = await Checkgroup.find()
        let query = {
            category: req.body.checkgroupname,
        };
        checkptgroups = await Checkgroup.find(query, {
            _id: 1,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Group not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        checkptgroups
    });
})


// get Single Category => /api/category/:id
exports.getSingleCategorysub = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategory = await Categorysub.findById(id);
    if (!scategory) {
        return next(new ErrorHandler('Category not found', 404));
    }
    return res.status(200).json({
        scategory
    })
})

//update Category by id => /api/category/:id
exports.updateCategorysub = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucategory = await Categorysub.findByIdAndUpdate(id, req.body);
    if (!ucategory) {
        return next(new ErrorHandler('Category not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Category by id => /api/category/:id
exports.deleteCategorysub = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategory = await Categorysub.findByIdAndRemove(id);
    if (!dcategory) {
        return next(new ErrorHandler('Category not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})