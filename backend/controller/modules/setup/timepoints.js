const TimePoints = require('../../../model/modules/setup/timepoints');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const Queuegrouping = require('../../../model/modules/excel/queuegrouping');
const Vendormaster = require('../../../model/modules/setup/vendor');
const Queue = require('../../../model/modules/setup/queue');
const Projectmaster = require('../../../model/modules/setup/project');
const Category = require('../../../model/modules/setup/category');
const Subcategory = require('../../../model/modules/setup/subcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Time Points =>/api/timepoints
exports.getAllTimePoints = catchAsyncErrors(async (req, res, next) => {
    let timepoints;
    try {
        timepoints = await TimePoints.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timepoints) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        timepoints
    });
})
exports.getOverallBulkDelete = catchAsyncErrors(async (req, res, next) => {
    let excelmapData ,excelmapdatas , taskcate, result, count;
    let id = req.body.id
    try {

        taskcate = await TimePoints.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))

        excelmapData = await Excelmaprespersondata.find();
        excelmapdatas = await Excelmapdata.find();
        const unmatchedCategory = answer.filter(answers => excelmapData.some(sub => sub?.project === answers.project && (["ALL" , "Please Select SubCategory"].includes(answers?.subcategory) ? true : answers?.subcategory === sub?.subcategory) && answers?.category === sub?.category))?.map(data => data._id?.toString());
        const unmatchedExcelData = answer.filter(answers => excelmapdatas.some(sub => sub?.queue === answers.queuename && (["ALL" , "Please Select SubCategory"].includes(answers?.subcategory) ? true : answers?.subcategory === sub?.subcategory)&& answers?.category === sub?.category))?.map(data => data._id?.toString());

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

//get time and point based on exceldatamap's category and subcategory for Edit 
exports.getCategorySubcategoryEdit = catchAsyncErrors(async (req, res, next) => {

    try {
        excelmaptimepoints = await Excelmapdata.find({
            $and: [
                { category: req.body.checkcategory },
                { subcategory: req.body.checksubcategory === undefined ? "ALL" : req.body.checksubcategory },
            ]
        })
        excelmappeopletimepoints = await Excelmaprespersondata.find({
            $and: [
                { category: req.body.checkcategory },
                { subcategory: req.body.checksubcategory === undefined ? "ALL" : req.body.checksubcategory },
            ]
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmaptimepoints) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        count: excelmaptimepoints.length + excelmappeopletimepoints.length,
        excelmaptimepoints, excelmappeopletimepoints
    });
})

//checking delete
exports.getprojectchecktimepoints = catchAsyncErrors(async (req, res, next) => {
    let timepoints;
    try {
        timepoints = await TimePoints.find({ project: req.body.checkproject })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timepoints) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        timepoints, count: timepoints.length
    });
})

// delete functionality for the vendeor link to Timepoints
exports.getAllTimepointsdelete = catchAsyncErrors(async (req, res, next) => {
    let timepoints;

    try {
        const query = {
            vendorname: {
                $in: [req.body.checkvendor]
            }
        };


        timepoints = await TimePoints.find(query, {
            vendor: 1,
            name: 1,
            _id: 1,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timepoints) {
        return next(new ErrorHandler('TimePoints not found!', 404));
    }
    return res.status(200).json({
        timepoints
    });

})

//checking delete category
exports.getcategorychecktimepoints = catchAsyncErrors(async (req, res, next) => {
    let timepoints;
    try {
        timepoints = await TimePoints.find({ category: req.body.checkcate })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timepoints) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        timepoints, count: timepoints.length
    });
})

//checking delete category
exports.getsubcategorychecktimepoints = catchAsyncErrors(async (req, res, next) => {
    let timepoints;
    try {
        timepoints = await TimePoints.find({ subcategory: req.body.checksub })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!timepoints) {
        return next(new ErrorHandler('SubProject data Linked with Task not found!', 404));
    }
    return res.status(200).json({
        timepoints, count: timepoints.length
    });
})



//get vendors based on project master
exports.getvendorDropdwons = catchAsyncErrors(async (req, res, next) => {
    let vendors;
    try {
        vendors = await Vendormaster.find({ projectname: req.body.projectName })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!vendors) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        vendors
    });
})
//get category based on vendor master
exports.getCategoryDropdwons = catchAsyncErrors(async (req, res, next) => {
    let category;
    let vendMaster;
    let projectname = req.body.projectName
    let vendorname = req.body.vendorName
    try {
        vendMaster = await Category.find()
        category = vendMaster.filter(item => item.vendorname.some(val => vendorname.includes(val)) && item.project === projectname);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!category) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        category
    });
})
//get subcategory based on category master
exports.getSubCategoryDropdwons = catchAsyncErrors(async (req, res, next) => {
    let subcategory;
    let subcatMaster;
    let categoryName = req.body.categoryName;
    let vendorName = req.body.vendorName;
    let projectName = req.body.projectName;

    try {
        subcategory = await Subcategory.find();

        subcatMaster = subcategory.filter(item => item.vendorname.some(val => vendorName.includes(val)) && item.project === projectName && categoryName === item.categoryname);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategory) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        subcatMaster
    });
})



//get vendors based on project master for Edit 
exports.getvendorDropdwonsEdit = catchAsyncErrors(async (req, res, next) => {
    let vendors;
    try {
        vendors = await Vendormaster.find({ projectname: req.body.projectName })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!vendors) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        vendors
    });
})
//get category based on vendor master for edit 
exports.getCategoryDropdwonsEdit = catchAsyncErrors(async (req, res, next) => {
    let category;
    let vendMaster;
    let projectname = req.body.projectName
    let vendorname = req.body.vendorName
    try {
        vendMaster = await Category.find()
        category = vendMaster.filter(item => item.vendorname.some(val => vendorname.includes(val)) && item.project === projectname);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!category) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        category
    });
})
//get subcategory based on category master for edit
exports.getSubCategoryDropdwonsEdit = catchAsyncErrors(async (req, res, next) => {
    let subcategory;
    let subcatMaster;
    let categoryName = req.body.categoryName;
    let vendorName = req.body.vendorName;
    let projectName = req.body.projectName;

    try {
        subcategory = await Subcategory.find();

        subcatMaster = subcategory.filter(item => item.vendorname.some(val => vendorName.includes(val)) && item.project === projectName && categoryName === item.categoryname);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategory) {
        return next(new ErrorHandler('Time and Points not found!', 404));
    }
    return res.status(200).json({
        subcatMaster
    });
})


//get All Time Points =>/api/timepoints
exports.getAllCategorySubCategory = catchAsyncErrors(async (req, res, next) => {
    let catsubtime, queuegrouping, queueCheck, queue;
    let answer;
    try {
        answer = await TimePoints.find();
        catsubtime =req.body.project === "ALL" ?await TimePoints.find({category: req.body.category }) :   await TimePoints.find({ project: req.body.project, category: req.body.category });
        queuegrouping = await Queuegrouping.find()
        queueCheck = queuegrouping.filter((d) => d.categories.includes(req.body.category));

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!catsubtime) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        catsubtime, queueCheck
    });
})


//create new timepoint => /api/timepoint/new
exports.addTimePoint = catchAsyncErrors(async (req, res, next) => {
    // let checkTimePoint = await subcategory.findOne({ name: req.body.name });

    // if (checkTimePoint) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let atimepoint = await TimePoints.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single timepoint => /api/timepoint/:id
exports.getSingleTimePoint = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stimepoint = await TimePoints.findById(id);
    if (!stimepoint) {
        return next(new ErrorHandler('Time Point not found', 404));
    }
    return res.status(200).json({
        stimepoint
    })
})

//update timepoint by id => /api/timepoint/:id
exports.updateTimePoint = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utimepoint = await TimePoints.findByIdAndUpdate(id, req.body);
    if (!utimepoint) {
        return next(new ErrorHandler('Time Points not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully', utimepoint });
})

//delete timepoint by id => /api/timepoint/:id
exports.deleteTimePoint = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtimepoint = await TimePoints.findByIdAndRemove(id);
    if (!dtimepoint) {
        return next(new ErrorHandler('Time Points not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})