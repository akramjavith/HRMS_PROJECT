const SelfCheckPointTicketMaster = require('../../../model/modules/tickets/SelfCheckPointTicketMasterModel');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getAllSelfCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters;
    try {
        selfcheckpointticketmasters = await SelfCheckPointTicketMaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheckpointticketmasters) {
        return next(new ErrorHandler('SelfCheckPointTicketMaster not found!', 404));
    }
    return res.status(200).json({
        selfcheckpointticketmasters
    });
})
//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getOverallSelfcheckdelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters, selfcheck;
    let self = req.body.oldname
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find()
        selfcheck = self.subsubcategory?.length > 0 ? selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.subsubcategory?.includes(data.subsubcategory) && self.type === data.type && self.reason === data.reason)
            : selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory) && self.type === data.type && self.reason === data.reason)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck) {
        return next(new ErrorHandler('SelfCheckPointTicketMaster not found!', 404));
    }
    return res.status(200).json({
        selfcheck, count: selfcheck.length
    });
})
//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getOverallBulkSelfcheckdelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters, priority, result, count, selfcheck;
    let id = req.body.id
    try {
        priority = await SelfCheckPointTicketMaster.find();
        const answer = priority?.filter(data => id?.includes(data._id?.toString()))
        selfcheckpointticketmasters = await Raiseticketmaster.find()

console.log(answer , 'answer')
selfcheck = answer
  .filter(answers => 
    selfcheckpointticketmasters?.some(data => 
      answers.category?.includes(data.category) &&
      answers.subcategory?.includes(data.subcategory) &&
      (answers.subsubcategory?.length > 0 ? answers.subsubcategory?.includes(data.subsubcategory) : true) &&
      answers.type === data.type &&
      answers.reason === data.reason 
      &&
      data.selfcheckpointsmaster?.some(dat => 
        dat.checkpointgrp?.some(ite => 
          answers.checkpointgrp?.some(dom => dom?.label === ite?.label)
        )
      )
    )
  )
  .map(answers => answers._id?.toString());


              console.log(selfcheck , 'answer')

             const duplicateId = [...selfcheck]

             result = id?.filter(data => !duplicateId?.includes(data))
             count = id?.filter(data => !duplicateId?.includes(data))?.length

    } catch (err) {
        return next(new ErrorHandler("Records not found!" , err, 404));
    }
    return res.status(200).json({
        count: count,
        result
    });
})






//create new SelfCheckPointTicketMaster => /api/selfcheckpointticketmaster/new
exports.addSelfCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aselfcheckpointticketmaster = await SelfCheckPointTicketMaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single SelfCheckPointTicketMaster => /api/selfcheckpointticketmaster/:id
exports.getSingleSelfCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sselfcheckpointticketmasters = await SelfCheckPointTicketMaster.findById(id);
    if (!sselfcheckpointticketmasters) {
        return next(new ErrorHandler('SelfCheckPointTicketMaster not found', 404));
    }
    return res.status(200).json({
        sselfcheckpointticketmasters
    })
})

//update SelfCheckPointTicketMaster by id => /api/selfcheckpointticketmaster/:id
exports.updateSelfCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uselfcheckpointticketmasters = await SelfCheckPointTicketMaster.findByIdAndUpdate(id, req.body);
    if (!uselfcheckpointticketmasters) {
        return next(new ErrorHandler('SelfCheckPointTicketMaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete SelfCheckPointTicketMaster by id => /api/selfcheckpointticketmaster/:id
exports.deleteSelfCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dselfcheckpointticketmasters = await SelfCheckPointTicketMaster.findByIdAndRemove(id);
    if (!dselfcheckpointticketmasters) {
        return next(new ErrorHandler('SelfCheckPointTicketMaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
