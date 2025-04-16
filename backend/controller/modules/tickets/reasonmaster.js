const Reasonmaster = require('../../../model/modules/tickets/reasonmaster');
const ErrorHandler = require('../../../utils/errorhandler');

const SelfCheckPointTicketMaster = require('../../../model/modules/tickets/SelfCheckPointTicketMasterModel');
const Checkpointticketmaster = require('../../../model/modules/tickets/checkpointticketmaster');
const Prioritymaster = require('../../../model/modules/tickets/prioritymaster');
const Duedatemaster = require('../../../model/modules/tickets/duedatemaster');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");

// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Reasonmaster =>/api/Reasonmaster
exports.getAllReasonmaster = catchAsyncErrors(async (req, res, next) => {
    let reasonmasters;
    try {
        reasonmasters = await Reasonmaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reasonmasters) {
        return next(new ErrorHandler('Reasonmaster not found!', 404));
    }
    return res.status(200).json({
        reasonmasters
    });
})

//get All Typemaster =>/api/Typemaster
exports.getoverallReasonmaster = catchAsyncErrors(async (req, res, next) => {
    let selfcheck, check, priority, duedate, raiseticket;
    try {
        selfcheck = await SelfCheckPointTicketMaster.find({ reason: req.body.oldname })
        check = await Checkpointticketmaster.find({ reason: req.body.oldname })
        priority = await Prioritymaster.find({ reason: req.body.oldname })
        duedate = await Duedatemaster.find({ reason: req.body.oldname })
        raiseticket = await Raiseticketmaster.find({ reason: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck && !check && !priority && !duedate && !raiseticket) {
        return next(new ErrorHandler('Typemaster not found!', 404));
    }
    return res.status(200).json({
        count: selfcheck?.length + check?.length + priority?.length + duedate?.length + raiseticket?.length,
        selfcheck, check, priority, duedate, raiseticket
    });
})
//get All Typemaster =>/api/Typemaster
exports.getoverallReasonmasterDelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheck, check, priority, duedate, raiseticket;
    try {
        selfcheck = await SelfCheckPointTicketMaster.find({ reason: req.body.oldname })
        check = await Checkpointticketmaster.find({ reason: req.body.oldname })
        priority = await Prioritymaster.find({ reason: req.body.oldname })
        duedate = await Duedatemaster.find({ reason: req.body.oldname })
        raiseticket = await Raiseticketmaster.find({ reason: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck && !check && !priority && !duedate && !raiseticket) {
        return next(new ErrorHandler('Typemaster not found!', 404));
    }
    return res.status(200).json({
        count: selfcheck?.length + check?.length + priority?.length + duedate?.length + raiseticket?.length,
        selfcheck, check, priority, duedate, raiseticket
    });
})
//get All Typemaster =>/api/Typemaster
exports.overallBulkreasonmastersdelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheck, check, anscheck, priority, duedate, raiseticket, result, count;
    let id = req.body.id;

    try {

        anscheck = await Reasonmaster.find();
        const answer = anscheck?.filter(data => id?.includes(data._id?.toString()))


        selfcheck = await SelfCheckPointTicketMaster.find()
        check = await Checkpointticketmaster.find()
        priority = await Prioritymaster.find()
        duedate = await Duedatemaster.find()
        raiseticket = await Raiseticketmaster.find()




        const selfch = answer.filter(answers => selfcheck?.some(data =>
            data.category.some(item => answers?.categoryreason?.includes(item)) &&
            data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) &&
            (answers?.subsubcategoryreason?.length > 0 ? data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) : true) && data.reason === answers.namereason))?.map(data => data._id?.toString());


        const checking = answer.filter(answers => check?.some(data =>
            data.category.some(item => answers?.categoryreason?.includes(item)) &&
            data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) &&
            (answers?.subsubcategoryreason?.length > 0 ? data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) : true) && data.reason === answers.namereason))?.map(data => data._id?.toString());

        const prior = answer.filter(answers => priority?.some(data =>
            data.category.some(item => answers?.categoryreason?.includes(item)) &&
            data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) &&
            (answers?.subsubcategoryreason?.length > 0 ? data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) : true) && data.reason === answers.namereason))?.map(data => data._id?.toString());


        const dued = answer.filter(answers => duedate?.some(data =>
            data.category.some(item => answers?.categoryreason?.includes(item)) &&
            data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) &&
            (answers?.subsubcategoryreason?.length > 0 ? data.subcategory.some(item => answers?.subcategoryreason?.includes(item)) : true) && data.reason === answers.namereason))?.map(data => data._id?.toString());


        const raise = answer.filter(answers => raiseticket?.some(data =>
            answers?.categoryreason?.includes(data.category)
            && answers?.subcategoryreason?.includes(data.subcategory)
            && (answers?.subsubcategoryreason?.length > 0 ? answers?.subcategoryreason?.includes(data.subcategory) : true)
            && data.reason === answers.namereason))?.map(data => data._id?.toString());



        const duplicateId = [...selfch,
        ...checking, ...prior, ...dued,
        ...raise,]


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



//create new Reasonmaster => /api/Reasonmaster/new
exports.addReasonmaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aReasonmaster = await Reasonmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Reasonmaster => /api/Reasonmaster/:id
exports.getSingleReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sreasonmaster = await Reasonmaster.findById(id);
    if (!sreasonmaster) {
        return next(new ErrorHandler('Reasonmaster not found', 404));
    }
    return res.status(200).json({
        sreasonmaster
    })
})

//update Reasonmaster by id => /api/Reasonmaster/:id
exports.updateReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ureasonmaster = await Reasonmaster.findByIdAndUpdate(id, req.body);
    if (!ureasonmaster) {
        return next(new ErrorHandler('Reasonmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Reasonmaster by id => /api/Reasonmaster/:id
exports.deleteReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dreasonmaster = await Reasonmaster.findByIdAndRemove(id);
    if (!dreasonmaster) {
        return next(new ErrorHandler('Reasonmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
