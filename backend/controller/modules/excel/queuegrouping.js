const Queuegrouping = require('../../../model/modules/excel/queuegrouping');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require("../../../model/modules/excel/excelmapdata");
const Excelmaprespersondata = require("../../../model/modules/excel/excelmapresperson");
// get All Queuegrouping  Details => /api/queue
exports.getAllQueuegrouping = catchAsyncErrors(async (req, res, next) => {
    let queuegroups;
    try {
        queuegroups = await Queuegrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!queuegroups) {
        return next(new ErrorHandler('Queuegrouping not found', 404));
    }
    return res.status(200).json({
        queuegroups
    });

})
exports.getOverallQueueGroupingEdit = catchAsyncErrors(async (req, res, next) => {
    let excel , excelmap , excelmapdata , excelmapresperson ;
    let answer = req.body.oldname
    try {
        excel = await Excelmapdata.find()
        excelmap = await Excelmaprespersondata.find()

        excelmapdata = excel?.filter(data => answer.categories?.includes(data.category) && data.queue === answer.queuename)
        excelmapresperson = excelmap?.filter(data => answer.categories?.includes(data.category) && data.queue === answer.queuename)



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count : excelmapdata.length + excelmapresperson.length ,excelmapdata , excelmapresperson
    });

})
exports.getOverallQueueGroupingDelete = catchAsyncErrors(async (req, res, next) => {
    let excel , excelmap , excelmapdata , excelmapresperson ;
    let answer = req.body.oldname
    try {
        excel = await Excelmapdata.find()
        excelmap = await Excelmaprespersondata.find()

        excelmapdata = excel?.filter(data => answer.categories?.includes(data.category) && data.queue === answer.queuename)
        excelmapresperson = excelmap?.filter(data => answer.categories?.includes(data.category) && data.queue === answer.queuename)

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count : excelmapdata.length + excelmapresperson.length ,excelmapdata , excelmapresperson
    });

})



exports.getOverallQueueGroupingBulkDelete = catchAsyncErrors(async (req, res, next) => {
   let excelmapData ,excelmapdatas ,  taskcate,result, count;
    let id = req.body.id
    try {

        taskcate = await Queuegrouping.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))
  
        excelmapData = await Excelmaprespersondata.find();
        excelmapdatas = await Excelmapdata.find();
        const unmatchedCategory = answer.filter(answers => excelmapData.some(sub => sub?.queue === answers.queuename && answers?.categories?.includes(sub?.category)))?.map(data => data._id?.toString());
        const unmatchedExcelData = answer.filter(answers => excelmapdatas.some(sub => sub?.queue === answers.queuename && answers?.categories?.includes(sub?.category)))?.map(data => data._id?.toString());

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

// Create new Queuegrouping => /api/queue/new
exports.addQueuegrouping = catchAsyncErrors(async (req, res, next) => {
    // let queuegroup = await Queuegrouping.findOne({ name: req.body.name });
    // if (queuegroup) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aqueuegroup = await Queuegrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Queuegrouping => /api/queue/:id
exports.getSingleQueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let squeuegroup = await Queuegrouping.findById(id);
    if (!squeuegroup) {
        return next(new ErrorHandler('Queuegrouping not found', 404));
    }
    return res.status(200).json({
        squeuegroup
    })
})

// update Queuegrouping by id => /api/queue/:id
exports.updateQueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uqueuegroup = await Queuegrouping.findByIdAndUpdate(id, req.body);
    if (!uqueuegroup) {
        return next(new ErrorHandler('Queuegrouping Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Queuegrouping by id => /api/queue/:id
exports.deleteQueuegrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dqueuegroup = await Queuegrouping.findByIdAndRemove(id);
    if (!dqueuegroup) {
        return next(new ErrorHandler('Queuegrouping Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})