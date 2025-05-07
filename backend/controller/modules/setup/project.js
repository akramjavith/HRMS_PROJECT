const Projectmaster = require('../../../model/modules/setup/project');
const Vendor = require('../../../model/modules/setup/vendor');
const Category = require('../../../model/modules/setup/category');
const Subcategory = require('../../../model/modules/setup/subcategory');
const Timepoints = require('../../../model/modules/setup/timepoints');
// const Designation = require('../../model/modules/designation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');


// get All Projectmaster => /api/Projectmaster
exports.getAllProjmaster = catchAsyncErrors(async (req, res, next) => {
    let projmaster;
    try {
        projmaster = await Projectmaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projmaster) {
        return next(new ErrorHandler('Project not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        projmaster
    });
})

exports.getAllProjmasterProductionIndividual = catchAsyncErrors(async (req, res, next) => {
    let projmaster;
    try {
        projmaster = await Projectmaster.findOne({ name: req.body.name }, { enablepage: 1 })
        console.log(projmaster, "projmaster")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projmaster) {
        return next(new ErrorHandler('Project not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        projmaster
    });
})

exports.getoverallprojectmaster = catchAsyncErrors(async (req, res, next) => {
    let vendors, category, subcategory, timepoints, excelmapdata, excelmapresperson;
    try {
        vendors = await Vendor.find({ projectname: req.body.oldname })
        category = await Category.find({ project: req.body.oldname })
        subcategory = await Subcategory.find({ project: req.body.oldname })
        timepoints = await Timepoints.find({ project: req.body.oldname })
        excelmapdata = await Excelmapdata.find({ project: req.body.oldname })
        excelmapresperson = await Excelmaprespersondata.find({ project: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: vendors.length + category.length + subcategory.length + timepoints.length + excelmapdata.length + excelmapresperson.length,
        vendors, category, subcategory, timepoints, excelmapdata, excelmapresperson
    });
})

exports.getoverallBulkDeleteprojectmaster = catchAsyncErrors(async (req, res, next) => {
    let vendors, category, subcategory, timepoints, excelmapdata, excelmapresperson, result, count;
    let id = req.body.id

    try {
        vendors = await Vendor.find()
        category = await Category.find()
        subcategory = await Subcategory.find()
        timepoints = await Timepoints.find()
        excelmapdata = await Excelmapdata.find()
        excelmapresperson = await Excelmaprespersondata.find()


        taskcate = await Projectmaster.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))


        const unmatchedVendors = answer.filter(answers => vendors.some(sub => sub.projectname === answers.name))?.map(data => data._id?.toString());
        const unmatchedCategory = answer.filter(answers => category.some(sub => sub.project === answers.name))?.map(data => data._id?.toString());
        const unmatchedSubCategory = answer.filter(answers => subcategory.some(sub => sub.project === answers.name))?.map(data => data._id?.toString());
        const unmatchedtimePoints = answer.filter(answers => timepoints.some(sub => sub.project === answers.name))?.map(data => data._id?.toString());
        const unmatchedExcelMap = answer.filter(answers => excelmapdata.some(sub => sub.project === answers.name))?.map(data => data._id?.toString());
        const unmatchedExcelMapPerson = answer.filter(answers => excelmapresperson.some(sub => sub.project === answers.name))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedVendors, ...unmatchedCategory, ...unmatchedSubCategory,
        ...unmatchedtimePoints, ...unmatchedExcelMap, ...unmatchedExcelMapPerson]
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


// Create new Projectmaster=> /api/projectmaster/new
exports.addprojmaster = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Projectmaster.findOne({ name: req.body.name });

    if (checkloc) {
        return next(new ErrorHandler('Project already exist!', 400));
    }

    let aproduct = await Projectmaster.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'

    });
})

// get Signle Projectmaster => /api/projectmaster/:id
exports.getSingleprojmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sprojmaster = await Projectmaster.findById(id);

    if (!sprojmaster) {
        return next(new ErrorHandler('Project not found!', 404));
    }
    return res.status(200).json({
        sprojmaster
    })
})

// update Projectmaster by id => /api/projmaster/:id
exports.updateprojmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojmaster = await Projectmaster.findByIdAndUpdate(id, req.body);

    if (!uprojmaster) {
        return next(new ErrorHandler('Project not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Projectmaster by id => /api/projectmaster/:id
exports.deleteprojmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dprojmaster = await Projectmaster.findByIdAndRemove(id);

    if (!dprojmaster) {
        return next(new ErrorHandler('Project not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})


// get All Projectmaster => /api/Projectmaster
exports.getAllProjmasterLimitedName = catchAsyncErrors(async (req, res, next) => {
    let projmaster;
    try {
        projmaster = await Projectmaster.find({}, { name: 1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!projmaster) {
        return next(new ErrorHandler("Project not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        projmaster,
    });
});