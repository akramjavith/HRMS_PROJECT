const Prioritymaster = require('../../../model/modules/tickets/prioritymaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
const Duedatemaster = require('../../../model/modules/tickets/duedatemaster');
//get All Prioritymaster =>/api/Prioritymaster
exports.getAllPrioritymaster = catchAsyncErrors(async (req, res, next) => {
    let prioritymaster;
    try {
        prioritymaster = await Prioritymaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!prioritymaster) {
        return next(new ErrorHandler('Prioritymaster not found!', 404));
    }
    return res.status(200).json({
        prioritymaster
    });
})

//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getOverallPriorityEdit = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters , selfcheck  , duemaster , duedate;
    let self = req.body.oldname
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find() 
        duemaster = await Duedatemaster.find() 
        selfcheck = self.subsubcategory?.length > 0  ? selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.subsubcategory?.includes(data.subsubcategory) && self.type === data.type &&  self.reason === data.reason ) 
        : selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.type === data.type &&  self.reason === data.reason  ) 

        duedate = self.subsubcategory?.length > 0 ? 
        duemaster?.filter(data => self.category?.some(item =>data.category.includes(item)) 
        && self.subcategory?.some(item =>data.subcategory.includes(item)) 
        && self.subsubcategory?.some(item =>data.subsubcategory.includes(item)) 
        && self.type === data.type 
        &&  self.reason === data.reason  
        && self.priority === data.priority ) 
        :      
        duemaster?.filter(data => self.category?.some(item =>data.category.includes(item)) 
        && self.subcategory?.some(item =>data.subcategory.includes(item)) 
        && self.type === data.type 
        &&  self.reason === data.reason  
        && self.priority === data.priority ) 



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck && !duedate) {
        return next(new ErrorHandler('Priority not found!', 404));
    }
    return res.status(200).json({
        selfcheck , duedate, count : selfcheck.length + duedate?.length
    });
})

//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getOverallPrioritydelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters , selfcheck  , duemaster , duedate;
    let self = req.body.oldname
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find() 
        duemaster = await Duedatemaster.find() 
        selfcheck = self.subsubcategory?.length > 0  ? selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.subsubcategory?.includes(data.subsubcategory) && self.type === data.type &&  self.reason === data.reason ) 
        : selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.type === data.type &&  self.reason === data.reason  ) 

        duedate = self.subsubcategory?.length > 0 ? 
        duemaster?.filter(data => self.category?.some(item =>data.category.includes(item)) 
        && self.subcategory?.some(item =>data.subcategory.includes(item)) 
        && self.subsubcategory?.some(item =>data.subsubcategory.includes(item)) 
        && self.type === data.type 
        &&  self.reason === data.reason  
        && self.priority === data.priority ) 
        :      
        duemaster?.filter(data => self.category?.some(item =>data.category.includes(item)) 
        && self.subcategory?.some(item =>data.subcategory.includes(item)) 
        && self.type === data.type 
        &&  self.reason === data.reason  
        && self.priority === data.priority ) 



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck && !duedate) {
        return next(new ErrorHandler('Priority not found!', 404));
    }
    return res.status(200).json({
        selfcheck , duedate, count : selfcheck.length + duedate?.length
    });
})


//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getOverallBulkPrioritydelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters ,priority,result, selfcheck  , duemaster , duedate;
    let id = req.body.id
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find() 
        priority = await Prioritymaster.find() 
        duemaster = await Duedatemaster.find() 
        const answer = priority?.filter(data => id?.includes(data._id?.toString()))

        const unmatchedtaskdesig = answer.filter(answers => 
            selfcheckpointticketmasters.some(data => answers.category?.includes(data.category)
             && answers.subcategory?.includes(data.subcategory) 
             && (answers.subsubcategory?.length > 0 ? answers.subsubcategory?.includes(data.subsubcategory) : true) 
             && answers.type === data.type &&  answers.reason === data.reason ))
             ?.map(data => data._id?.toString());

             const unmatchedselfCheck = answer.filter(answers => 
                selfcheckpointticketmasters?.some(data => answers.category?.includes(data.category)
                && answers.subcategory?.includes(data.subcategory) 
                && (answers.subsubcategory?.length > 0 ? answers.subsubcategory?.includes(data.subsubcategory) : true) 
                && answers.type === data.type 
                &&  answers.reason === data.reason ) 
             )

             const duplicateId = [...unmatchedtaskdesig, ...unmatchedselfCheck]

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




//create new Prioritymaster => /api/Prioritymaster/new
exports.addPrioritymaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aPrioritymaster = await Prioritymaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Prioritymaster => /api/Prioritymaster/:id
exports.getSinglePrioritymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sprioritymaster = await Prioritymaster.findById(id);
    if (!sprioritymaster) {
        return next(new ErrorHandler('Prioritymaster not found', 404));
    }
    return res.status(200).json({
        sprioritymaster
    })
})

//update Prioritymaster by id => /api/Prioritymaster/:id
exports.updatePrioritymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uprioritymaster = await Prioritymaster.findByIdAndUpdate(id, req.body);
    if (!uprioritymaster) {
        return next(new ErrorHandler('Prioritymaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Prioritymaster by id => /api/Prioritymaster/:id
exports.deletePrioritymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dprioritymaster = await Prioritymaster.findByIdAndRemove(id);
    if (!dprioritymaster) {
        return next(new ErrorHandler('Prioritymaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
