const Subsubcategoryticket = require('../../../model/modules/tickets/subsubcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const Reasonmaster = require('../../../model/modules/tickets/reasonmaster');
const Resolverreasonmaster = require('../../../model/modules/tickets/resolverreasonmaster');
const SelfCheckPointTicketMaster = require('../../../model/modules/tickets/SelfCheckPointTicketMasterModel');
const Checkpointticketmaster = require('../../../model/modules/tickets/checkpointticketmaster');
const Teamgrouping = require("../../../model/modules/tickets/teamgrouping");
const Prioritymaster = require('../../../model/modules/tickets/prioritymaster');
const Duedatemaster = require('../../../model/modules/tickets/duedatemaster');
const RequiredFields = require('../../../model/modules/tickets/requiredmaster');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
const Typemaster = require('../../../model/modules/tickets/typemaster');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Subsubcategoryticket =>/api/Subsubcategoryticket
exports.getAllSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    let subsubcomponents;
    try {
        subsubcomponents = await Subsubcategoryticket.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subsubcomponents) {
        return next(new ErrorHandler('Subsubcategoryticket not found!', 404));
    }
    return res.status(200).json({
        subsubcomponents
    });
})

exports.getoverallSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster , reason , resolvermaster , resolverreason , selfchechmaster ,
     selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
     prioritymaster , priority ,duemaster , duedate ,typegrpmaster , typegroup, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
    try {
        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raisemaster = await Raiseticketmaster.find({subsubcategory:req?.body?.oldname})


        reason = reasonmaster?.filter(data => data?.subsubcategoryreason?.includes(req?.body?.oldname))
        resolverreason = resolvermaster?.filter(data => data?.subsubcategoryreason?.includes(req?.body?.oldname))
        selfcheck = selfchechmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        checkpoint = Checkpointmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        teamgroup = teamgroupingmaster?.filter(data => data?.subsubcategoryfrom?.includes(req?.body?.oldname))
        priority = prioritymaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        duedate = duemaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        requiredfield = requiredmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        typegroup = typegrpmaster?.filter(data => data?.subsubcategorytype?.includes(req?.body?.oldname))
        

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !resolverreason && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster && !typegroup) {
      return next(new ErrorHandler("subsub Category details not found", 404));
    }
    return res.status(200).json({
      count: reason.length +  resolverreason.length + selfcheck.length + checkpoint.length + 
      teamgroup.length + priority.length + duedate.length + requiredfield.length + raisemaster.length + typegroup.length , 
      reason,resolverreason,selfcheck,checkpoint,teamgroup,priority,duedate,requiredfield,raisemaster,typegroup
    });
  });

//get All SelfCheckPointTicketMaster =>/api/selfcheckpointticketmasters
exports.getoverallBulkSubsubcomponentDelete = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster , reason , resolvermaster , resolverreason , selfchechmaster ,
    selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
    prioritymaster , priority ,duemaster,count , duedate ,typegrpmaster , typegroup,result, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
  
    let id = req.body.id

    try {
        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raisemaster = await Raiseticketmaster.find({subsubcategory:req?.body?.oldname})



        priority = await Subsubcategoryticket.find() 
        const answer = priority?.filter(data => id?.includes(data._id?.toString()))
        const reasonCheck = answer?.filter(answer => 
            reasonmaster?.some(data =>data.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        resolverreason = answer?.filter(answer =>  resolvermaster?.some(data => data?.subsubcategoryreason?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        selfcheck = answer?.filter(answer =>  selfchechmaster?.some(data => data?.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        checkpoint = answer?.filter(answer =>  Checkpointmaster?.some(data => data?.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        teamgroup =  answer?.filter(answer => teamgroupingmaster?.some(data => data?.subsubcategoryfrom?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        priority = answer?.filter(answer =>  prioritymaster?.some(data => data?.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        duedate =  answer?.filter(answer => duemaster?.some(data => data?.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        requiredfield = answer?.filter(answer =>  requiredmaster?.some(data => data?.subsubcategory?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        typegroup =  answer?.filter(answer => typegrpmaster?.some(data => data?.subsubcategorytype?.includes(answer.subsubname)))?.map(data => data._id?.toString());
        


             const duplicateId = [...reasonCheck, ...resolverreason , ...selfcheck , ...checkpoint , ...teamgroup , 
                ...priority , ...duedate , ...requiredfield , ...typegroup
             ]

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

exports.getoverallSubsubcomponentDelete = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster , reason , resolvermaster , resolverreason , selfchechmaster ,
     selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
     prioritymaster , priority ,duemaster , duedate ,typegrpmaster , typegroup, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
    try {
        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raisemaster = await Raiseticketmaster.find({subsubcategory:req?.body?.oldname})


        reason = reasonmaster?.filter(data => data?.subsubcategoryreason?.includes(req?.body?.oldname))
        resolverreason = resolvermaster?.filter(data => data?.subsubcategoryreason?.includes(req?.body?.oldname))
        selfcheck = selfchechmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        checkpoint = Checkpointmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        teamgroup = teamgroupingmaster?.filter(data => data?.subsubcategoryfrom?.includes(req?.body?.oldname))
        priority = prioritymaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        duedate = duemaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        requiredfield = requiredmaster?.filter(data => data?.subsubcategory?.includes(req?.body?.oldname))
        typegroup = typegrpmaster?.filter(data => data?.subsubcategorytype?.includes(req?.body?.oldname))
        

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !resolverreason && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster && !typegroup) {
      return next(new ErrorHandler("subsub Category details not found", 404));
    }
    return res.status(200).json({
      count: reason.length +  resolverreason.length + selfcheck.length + checkpoint.length + 
      teamgroup.length + priority.length + duedate.length + requiredfield.length + raisemaster.length + typegroup.length , 
      reason,resolverreason,selfcheck,checkpoint,teamgroup,priority,duedate,requiredfield,raisemaster,typegroup
    });
  });
//create new Subsubcategoryticket => /api/Subsubcategoryticket/new
exports.addSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aSubsubcomponent = await Subsubcategoryticket.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Subsubcategoryticket => /api/Subsubcategoryticket/:id
exports.getSingleSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssubsubcomponent = await Subsubcategoryticket.findById(id);
    if (!ssubsubcomponent) {
        return next(new ErrorHandler('Subsubcategoryticket not found', 404));
    }
    return res.status(200).json({
        ssubsubcomponent
    })
})

//update Subsubcategoryticket by id => /api/Subsubcategoryticket/:id
exports.updateSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubsubcomponent = await Subsubcategoryticket.findByIdAndUpdate(id, req.body);
    if (!usubsubcomponent) {
        return next(new ErrorHandler('Subsubcategoryticket not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Subsubcategoryticket by id => /api/Subsubcategoryticket/:id
exports.deleteSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsubsubcomponent = await Subsubcategoryticket.findByIdAndRemove(id);
    if (!dsubsubcomponent) {
        return next(new ErrorHandler('Subsubcategoryticket not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
