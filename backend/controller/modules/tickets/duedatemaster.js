const Duedatemaster = require('../../../model/modules/tickets/duedatemaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
//get All Duedatemaster =>/api/Duedatemaster
exports.getAllDuedatemaster = catchAsyncErrors(async (req, res, next) => {
    let duedatemasters;
    try {
        duedatemasters = await Duedatemaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!duedatemasters) {
        return next(new ErrorHandler('Duedatemaster not found!', 404));
    }
    return res.status(200).json({
        duedatemasters
    });
})

//get All SelfCheckPointTicketMaster =>/api/raiseticketmaster
exports.getOverallDuedateEdit = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters, selfcheck;
    let self = req.body.oldname
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find()

        selfcheck = self.subsubcategory?.length > 0 ? selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory)
        && self.subsubcategory?.includes(data.subsubcategory)
        && self.type === data.type
        && self.reason === data.reason && self.priority === data.priority)
        : 
        selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category)
            && self.subcategory?.includes(data.subcategory)
            && self.type === data.type
            && self.reason === data.reason
            && self.priority === data.priority)


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck) {
        return next(new ErrorHandler('Priority not found!', 404));
    }
    return res.status(200).json({
        selfcheck, count: selfcheck.length
    });
})
//get All getOverallDuedateDelete =>/api/raiseticketmaster
exports.getOverallDuedateDelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters, selfcheck;
    let self = req.body.oldname
    try {
        selfcheckpointticketmasters = await Raiseticketmaster.find()

        selfcheck = self.subsubcategory?.length > 0 ? selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category) && self.subcategory?.includes(data.subcategory)
            && self.subsubcategory?.includes(data.subsubcategory)
            && self.type === data.type
            && self.reason === data.reason && self.priority === data.priority)
            : 
            selfcheckpointticketmasters?.filter(data => self.category?.includes(data.category)
                && self.subcategory?.includes(data.subcategory)
                && self.type === data.type
                && self.reason === data.reason
                && self.priority === data.priority)




    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!selfcheck) {
        return next(new ErrorHandler('Priority not found!', 404));
    }
    return res.status(200).json({
        selfcheck, count: selfcheck.length
    });
})
//get All getOverallDuedateDelete =>/api/raiseticketmaster
exports.getOverallBulkDuedateDelete = catchAsyncErrors(async (req, res, next) => {
    let selfcheckpointticketmasters, priority,result , count;
    let id = req.body.id

    try {
        priority = await Duedatemaster.find() 
        const answer = priority?.filter(data => id?.includes(data._id?.toString()))
        selfcheckpointticketmasters = await Raiseticketmaster.find()

       const selfcheck = answer?.filter(answer => 
            selfcheckpointticketmasters?.some(data => answer.category?.includes(data.category) 
            && answer.subcategory?.includes(data.subcategory)
            && ( answer.subsubcategory?.length > 0? answer.subsubcategory?.includes(data.subsubcategory) : true)
            && answer.type === data.type
            && answer.reason === data.reason && answer.priority === data.priority)
            
            )?.map(data => data._id?.toString());

                const duplicateId = [ ...selfcheck]
    
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


//create new Duedatemaster => /api/Duedatemaster/new
exports.addDuedatemaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aDuedatemaster = await Duedatemaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Duedatemaster => /api/Duedatemaster/:id
exports.getSingleDuedatemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sduedatemasters = await Duedatemaster.findById(id);
    if (!sduedatemasters) {
        return next(new ErrorHandler('Duedatemaster not found', 404));
    }
    return res.status(200).json({
        sduedatemasters
    })
})

//update Duedatemaster by id => /api/Duedatemaster/:id
exports.updateDuedatemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uduedatemasters = await Duedatemaster.findByIdAndUpdate(id, req.body);
    if (!uduedatemasters) {
        return next(new ErrorHandler('Duedatemaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Duedatemaster by id => /api/Duedatemaster/:id
exports.deleteDuedatemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dduedatemasters = await Duedatemaster.findByIdAndRemove(id);
    if (!dduedatemasters) {
        return next(new ErrorHandler('Duedatemaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
