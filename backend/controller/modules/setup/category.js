const Category = require('../../../model/modules/setup/category');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const Subcategory = require('../../../model/modules/setup/subcategory');
const Timepoints = require('../../../model/modules/setup/timepoints');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Category =>/api/categories
exports.getAllCategory = catchAsyncErrors(async (req, res, next) => {
    let categoryexcel;
    try {
        categoryexcel = await Category.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categoryexcel) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({
        categoryexcel
    });
})

//get All Category =>/api/categories
exports.getProjectCategory = catchAsyncErrors(async (req, res, next) => {
    let projectcategory;
    try {
        projectcategory = await Category.find({ project: req.body.project })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projectcategory) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        projectcategory
    });
})


exports.getoverallcategorytmaster = catchAsyncErrors(async (req, res, next) => {
    let subcategory, timepoints, excelmapdata, excelmapresperson;
    try {

        subcategory = await Subcategory.find({ categoryname: req.body.oldname })
        timepoints = await Timepoints.find({ category: req.body.oldname })
        excelmapdata = await Excelmapdata.find({ category: req.body.oldname })
        excelmapresperson = await Excelmaprespersondata.find({ category: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: subcategory.length + timepoints.length + excelmapdata.length + excelmapresperson.length,
        subcategory, timepoints, excelmapdata, excelmapresperson
    });
})


// delete functionality for the vendeor link to category
exports.getAllCategorydelete = catchAsyncErrors(async (req, res, next) => {
    let category;

    try {
        const query = {
            vendorname: {
                $in: [req.body.checkvendor]
            }
        };
        category = await Category.find(query, {
            vendorname: 1,
            name: 1,
            _id: 1,
        });

    }
    catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!category) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({
        category
    });

})

//checking delete
exports.getprojectcheckcategory = catchAsyncErrors(async (req, res, next) => {
    let category;
    try {
        category = await Category.find({ project: req.body.checkproject })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!category) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        category, count: category.length
    });
})


//create new category => /api/category/new
exports.addCategory = catchAsyncErrors(async (req, res, next) => {

    let acategory = await Category.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single category => /api/category/:id
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategory = await Category.findById(id);
    if (!scategory) {
        return next(new ErrorHandler('Category not found', 404));
    }
    return res.status(200).json({
        scategory
    })
})
//update category by id => /api/category/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucategory = await Category.findByIdAndUpdate(id, req.body);
    if (!ucategory) {
        return next(new ErrorHandler('Category not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete category by id => /api/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategory = await Category.findByIdAndRemove(id);
    if (!dcategory) {
        return next(new ErrorHandler('Category not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})