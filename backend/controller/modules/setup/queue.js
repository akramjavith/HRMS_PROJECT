const Queue = require('../../../model/modules/setup/queue');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const Queuegrouping = require('../../../model/modules/excel/queuegrouping');


// get All Queue  Details => /api/queue
exports.getAllQueue = catchAsyncErrors(async (req, res, next) => {
    let queues;
    try {
        queues = await Queue.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!queues) {
        return next(new ErrorHandler('Queue not found', 404));
    }
    return res.status(200).json({
        // count: queues.length,
        queues
    });

})

// Create new Queue => /api/queue/new
exports.addQueue = catchAsyncErrors(async (req, res, next) => {
    let queue = await Queue.findOne({ name: req.body.name });
    if (queue) {
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let aqueue = await Queue.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Queue => /api/queue/:id
exports.getSingleQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let squeue = await Queue.findById(id);
    if (!squeue) {
        return next(new ErrorHandler('Queue not found', 404));
    }
    return res.status(200).json({
        squeue
    })
})

// update Queue by id => /api/queue/:id
exports.updateQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upqueue = await Queue.findByIdAndUpdate(id, req.body);
    if (!upqueue) {
        return next(new ErrorHandler('Queue Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Queue by id => /api/queue/:id
exports.deleteQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dqueue = await Queue.findByIdAndRemove(id);
    if (!dqueue) {
        return next(new ErrorHandler('Queue Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getoverallqueuemasteredit = catchAsyncErrors(async (req, res, next) => {
    let excelmapdata, excelmapresperson, queuegrouping;
    try {

        excelmapdata = await Excelmapdata.find({ queue: req.body.oldname })
        excelmapresperson = await Excelmaprespersondata.find({ queue: req.body.oldname })
        queuegrouping = await Queuegrouping.find({ queuename: req.body.oldname })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        count: excelmapdata.length + excelmapresperson.length + queuegrouping.length,
        excelmapdata, excelmapresperson, queuegrouping
    });
})
exports.getoverallqueuemasterDelete = catchAsyncErrors(async (req, res, next) => {
    let excelmapdata, excelmapresperson, queuegrouping;
    try {

        excelmapdata = await Excelmapdata.find({ queue: req.body.oldname })
        excelmapresperson = await Excelmaprespersondata.find({ queue: req.body.oldname })
        queuegrouping = await Queuegrouping.find({ queuename: req.body.oldname })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        count: excelmapdata.length + excelmapresperson.length + queuegrouping.length,
        excelmapdata, excelmapresperson, queuegrouping
    });
})
exports.getoverallqueuemasterBulkDelete = catchAsyncErrors(async (req, res, next) => {
    let excelmapData, excelmapdatas, queuegrouping;
    
    let id = req.body.id
    try {

        taskcate = await Queue.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))
  
        excelmapData = await Excelmaprespersondata.find();
        excelmapdatas = await Excelmapdata.find();
        queuegrouping = await Queuegrouping.find();
        const unmatchedCategory = answer.filter(answers => excelmapData.some(sub => sub?.queue === answers.name))?.map(data => data._id?.toString());
        const unmatchedExcelData = answer.filter(answers => excelmapdatas.some(sub => sub?.queue === answers.name))?.map(data => data._id?.toString());
        const unmatchedQueueGroup= answer.filter(answers => queuegrouping.some(sub => sub?.queuename === answers.name))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedCategory , ...unmatchedExcelData  , ...unmatchedQueueGroup]
        result = id?.filter(data => !duplicateId?.includes(data))
        count = id?.filter(data => !duplicateId?.includes(data))?.length

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        result ,count
    });
})