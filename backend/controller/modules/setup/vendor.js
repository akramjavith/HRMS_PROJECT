const Vendormaster = require('../../../model/modules/setup/vendor');
const Category = require('../../../model/modules/setup/category');
const Subcategory = require('../../../model/modules/setup/subcategory');
const Timepoints = require('../../../model/modules/setup/timepoints');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');


// get All Vendormaster => /api/vendormaster
exports.getAllVendormaster = catchAsyncErrors(async (req, res, next) => {
    let vendormaster;
    try {
        vendormaster = await Vendormaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!vendormaster) {
        return next(new ErrorHandler('vendormaster not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        vendormaster
    });
})


// get All Vendormaster => /api/vendormaster
exports.getFilteredVendorsExcelUpload = catchAsyncErrors(async (req, res, next) => {
    let vendormaster, filteredvendors, filteredvendorsexcel;
    try {
        vendormaster = await Vendormaster.find();
        filteredvendorsexcel = vendormaster?.filter((vendor) => {
            if (vendor.projectname === req.body.project) {
                return vendor
            }
        }
        );
        filteredvendors = vendormaster?.filter((vendor) =>
            vendor.projectname === req.body.project
        ).map((d) => ({
            projectname: d.projectname,
            name: d.name,
            label: d.name,
            value: d.name,
        }));

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!vendormaster) {
        return next(new ErrorHandler('vendormaster not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        vendormaster, filteredvendors, filteredvendorsexcel
    });
})

//  get All Vendormaster => /api/vendormaster
exports.getProjectsVendor = catchAsyncErrors(async (req, res, next) => {
    let projectvendor;
    try {
        projectvendor = req.body.project === "ALL" ? await Vendormaster.find() : await Vendormaster.find({ projectname: req.body.project })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projectvendor) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        projectvendor
    });
})

exports.getoverallvendormaster = catchAsyncErrors(async (req, res, next) => {
    let category, subcategory, timepoints;
    try {
        const query = {
            vendorname: {
                $in: [req.body.oldname]
            }
        };
        const query1 = {
            vendor: {
                $in: [req.body.oldname]
            }
        };

        category = await Category.find(query, {
            vendorname: 1,
            name: 1,
            _id: 1,
        });

        subcategory = await Subcategory.find(query, {
            vendorname: 1,
            name: 1,
            _id: 1,
        });

        timepoints = await Timepoints.find(query1, {
            vendor: 1,
            time: 1
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: category.length + subcategory.length + timepoints.length,
        category, subcategory, timepoints
    });
})
exports.getoverallBulkDeletevendormaster = catchAsyncErrors(async (req, res, next) => {
    let vendors, category, subcategory, taskcate, timepoints, excelmapdata, excelmapresperson, result, count;
    let id = req.body.id

    try {

        category = await Category.find()
        subcategory = await Subcategory.find()
        excelmapdata = await Excelmapdata.find()
        excelmapresperson = await Excelmaprespersondata.find()


        taskcate = await Vendormaster.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))
        // answer.projectname , answer.name

        const unmatchedCategory = answer.filter(answers => category.some(sub => sub.project === answers.projectname && sub?.vendorname?.includes(answer.name)))?.map(data => data._id?.toString());
        const unmatchedSubCategory = answer.filter(answers => subcategory.some(sub => sub.project === answers.projectname && sub?.vendorname?.includes(answer.name)))?.map(data => data._id?.toString());
        const unmatchedExcelMap = answer.filter(answers => excelmapdata.some(sub => sub.project === answers.projectname && sub.vendor === answers?.name))?.map(data => data._id?.toString());
        const unmatchedExcelMapPerson = answer.filter(answers => excelmapresperson.some(sub => sub.project === answers.projectname && sub.vendor === answers?.name))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedCategory, ...unmatchedSubCategory, ...unmatchedExcelMap, ...unmatchedExcelMapPerson]
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



//checking delete
exports.getprojectcheckvendor = catchAsyncErrors(async (req, res, next) => {
    let vendors;
    try {
        vendors = await Vendormaster.find({ projectname: req.body.checkproject })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!vendors) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        vendors, count: vendors.length
    });
})


// Create new Vendormaster=> /api/vendormaster/new
exports.addvendormaster = catchAsyncErrors(async (req, res, next) => {

    let aproduct = await Vendormaster.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'

    });
})

// get Signle Vendormaster => /api/vendormaster/:id
exports.getSinglevendormaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let svendormaster = await Vendormaster.findById(id);

    if (!svendormaster) {
        return next(new ErrorHandler('Vendormaster not found!', 404));
    }
    return res.status(200).json({
        svendormaster
    })
})

// update Vendormaster by id => /api/vendormaster/:id
exports.updatevendormaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uvendormaster = await Vendormaster.findByIdAndUpdate(id, req.body);

    if (!uvendormaster) {
        return next(new ErrorHandler('Vendormaster not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Vendormaster by id => /api/projectmaster/:id
exports.deletevendormaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dvendormaster = await Vendormaster.findByIdAndRemove(id);

    if (!dvendormaster) {
        return next(new ErrorHandler('Vendormaster not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getoverallvendormasteredit = catchAsyncErrors(async (req, res, next) => {
    let excelmapdata, excelmapresperson;
    let answer = req.body.oldname
    try {
        excelmapdata = await Excelmapdata.find({ vendor: answer.name, project: answer.projectname })
        excelmapresperson = await Excelmaprespersondata.find({ vendor: answer.name, project: answer.projectname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: excelmapdata.length + excelmapresperson.length,
        excelmapdata, excelmapresperson
    });
})
exports.getoverallDeletevendormaster = catchAsyncErrors(async (req, res, next) => {
    let excelmapdata, excelmapresperson;
    let answer = req.body.oldname
    try {
        excelmapdata = await Excelmapdata.find({ vendor: answer.name, project: answer.projectname })
        excelmapresperson = await Excelmaprespersondata.find({ vendor: answer.name, project: answer.projectname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: excelmapdata.length + excelmapresperson.length, excelmapdata, excelmapresperson
    });
})

// get All Vendormaster => /api/vendormaster
exports.getOverallVendorMasterNameOnly = catchAsyncErrors(async (req, res, next) => {
    let vendormaster;
    try {
        vendormaster = await Vendormaster.find({}, { name: 1, projectname: 1, _id: 0 });

    } catch (err) {
        console.log(err.message);
    }
    if (!vendormaster) {
        return next(new ErrorHandler('vendormaster not found!', 404));
    }
    return res.status(200).json({
        vendormaster
    });
})