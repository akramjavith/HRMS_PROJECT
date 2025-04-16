const Subcategory = require('../../../model/modules/setup/subcategory');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const Timepoints = require('../../../model/modules/setup/timepoints');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Category =>/api/categories
exports.getAllSubcategory = catchAsyncErrors(async (req, res, next) => {
    let subcategoryexcel;
    try {
        subcategoryexcel = await Subcategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategoryexcel) {
        return next(new ErrorHandler('Subcategory not found!', 404));
    }
    return res.status(200).json({
        subcategoryexcel
    });
})
exports.getOverallBulkDeleteSubCategory = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapData, taskcate , result , count;

    let id = req.body.id
    try {

        taskcate = await Subcategory.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))
  
        excelmapData = await Excelmaprespersondata.find();
        excelmapdatas = await Excelmapdata.find();
        const unmatchedCategory = answer.filter(answers => excelmapData.some(sub => sub.project === answers.project && sub?.category === answers.categoryname && sub?.subcategory === answers.name))?.map(data => data._id?.toString());
        const unmatchedExcelData = answer.filter(answers => excelmapdatas.some(sub => sub.project === answers.project && sub?.category === answers.categoryname && sub?.subcategory === answers.name))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedCategory , ...unmatchedExcelData]
        result = id?.filter(data => !duplicateId?.includes(data))
        count = id?.filter(data => !duplicateId?.includes(data))?.length

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        result ,count
    });
})

//checking delete project
exports.getprojectchecksubcategory = catchAsyncErrors(async (req, res, next) => {
    let subcategory;
    try {
        subcategory = await Subcategory.find({ project: req.body.checkproject })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategory) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        subcategory, count: subcategory.length
    });
})

//checking delete category
exports.getcategorychecksubcategory = catchAsyncErrors(async (req, res, next) => {
    let subcategory;
    try {
        subcategory = await Subcategory.find({ categoryname: req.body.checkcate })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategory) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        subcategory, count: subcategory.length
    });
})

// delete functionality for the vendeor link to subcategory
exports.getAllSubCategorydelete = catchAsyncErrors(async (req, res, next) => {
    let subcategory;

    try {
        const query = {
            vendorname: {
                $in: [req.body.checkvendor]
            }
        };


        subcategory = await Subcategory.find(query, {
            vendorname: 1,
            name: 1,
            _id: 1,
        });

    }
    catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategory) {
        return next(new ErrorHandler('Subcategory not found!', 404));
    }
    return res.status(200).json({
        subcategory
    });

})


exports.getoverallsubcategorytmaster = catchAsyncErrors(async (req, res, next) => {
    let timepoints, excelmapdata, excelmapresperson;
    try {

        timepoints = await Timepoints.find({ subcategory: req.body.oldname })
        excelmapdata = await Excelmapdata.find({ subcategory: req.body.oldname })
        excelmapresperson = await Excelmaprespersondata.find({ subcategory: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: timepoints.length + excelmapdata.length + excelmapresperson.length,
        timepoints, excelmapdata, excelmapresperson
    });
})

//create new subcategory => /api/subcategory/new
exports.addSubcategory = catchAsyncErrors(async (req, res, next) => {

    let asubcategory = await Subcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single subcategory => /api/subcategory/:id
exports.getSingleSubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssubcategory = await Subcategory.findById(id);
    if (!ssubcategory) {
        return next(new ErrorHandler('Subcategory not found', 404));
    }
    return res.status(200).json({
        ssubcategory
    })
})
//update subcategory by id => /api/subcategory/:id
exports.updateSubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubcategory = await Subcategory.findByIdAndUpdate(id, req.body);
    if (!usubcategory) {
        return next(new ErrorHandler('Subcategory not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete subcategory by id => /api/subcategory/:id
exports.deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dssubcategory = await Subcategory.findByIdAndRemove(id);
    if (!dssubcategory) {
        return next(new ErrorHandler('Subcategory not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})