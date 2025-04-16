const Resolverreasonmaster = require('../../../model/modules/tickets/resolverreasonmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 
const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");



//get All Resolverreasonmaster =>/api/resolverreasonmaster
exports.getAllResolverReasonmaster = catchAsyncErrors(async (req, res, next) => {
    let reasonmasters;
    try {
        reasonmasters = await Resolverreasonmaster.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reasonmasters) {
        return next(new ErrorHandler('Resolverreasonmaster not found!', 404));
    }
    return res.status(200).json({
        reasonmasters
    });
})
//get All Resolverreasonmaster =>/api/resolverreasonmaster
exports.getoverallResolverReasonmasterEdit = catchAsyncErrors(async (req, res, next) => {
    let raiseticket;
    try {
        raiseticket = await Raiseticketmaster.find({resolverreason : req.body.oldname}) 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!raiseticket) {
        return next(new ErrorHandler('Resolverreasonmaster not found!', 404));
    }
    return res.status(200).json({
        count : raiseticket?.length ,
        raiseticket
    });
})
//get All Resolverreasonmaster =>/api/resolverreasonmaster
exports.getoverallResolverReasonmasterDelete = catchAsyncErrors(async (req, res, next) => {
    let raiseticket;
    try {
        raiseticket = await Raiseticketmaster.find({resolverreason : req.body.oldname}) 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!raiseticket) {
        return next(new ErrorHandler('Resolverreasonmaster not found!', 404));
    }
    return res.status(200).json({
        count : raiseticket?.length ,
        raiseticket
    });
})
//get All Resolverreasonmaster =>/api/resolverreasonmaster
exports.getoverallBulkResolverReasonmasterDelete = catchAsyncErrors(async (req, res, next) => {
    let raiseticket, priority , result , count;
    let id = req.body.id;
    try {
        raiseticket = await Raiseticketmaster.find() 

        priority = await Resolverreasonmaster.find() 
        const answer = priority?.filter(data => id?.includes(data._id?.toString()))
        const selfcheck = answer?.filter(answer => 
            raiseticket?.some(data => answer.namereason === data.resolverreason))?.map(data => data._id?.toString());

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




exports.getAllResolverReasonFilter = catchAsyncErrors(async (req, res, next) => {
    let reasonmasters,result;
    try {
        query = {
            categoryreason: {
                $in: req.body.category
            },
            subcategoryreason: {
                $in: req.body.subcategory
            },
        }

    reasonmasters = await Resolverreasonmaster.find(query,{})

result = reasonmasters.filter((data, index) =>{
    if(req.body.subsubcategory != "" && req.body.type != ""){
   if(data.subsubcategoryreason.includes(req.body.subsubcategory) && data.typereason === req.body.type){
       return data.namereason
   }else if(data.subsubcategoryreason.includes(req.body.subsubcategory)){
    return data.namereason    
   }else if(data.typereason === req.body.type){
      return data.namereason
    }
}else{
    return data.namereason
}
})
 
} catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
}
if (!reasonmasters) {
    return next(new ErrorHandler('Data not found!', 404));
}
return res.status(200).json({
    result,reasonmasters
});
})





//create new Resolverreasonmaster => /api/resolverreasonmaster/new
exports.addResolverReasonmaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aReasonmaster = await Resolverreasonmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Resolverreasonmaster => /api/Resolverreasonmaster/:id
exports.getSingleResolverReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sreasonmaster = await Resolverreasonmaster.findById(id);
    if (!sreasonmaster) {
        return next(new ErrorHandler('Resolverreasonmaster not found', 404));
    }
    return res.status(200).json({
        sreasonmaster
    })
})

//update Resolverreasonmaster by id => /api/Resolverreasonmaster/:id
exports.updateResolverReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ureasonmaster = await Resolverreasonmaster.findByIdAndUpdate(id, req.body);
    if (!ureasonmaster) {
        return next(new ErrorHandler('Resolverreasonmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Resolverreasonmaster by id => /api/Resolverreasonmaster/:id
exports.deleteResolverReasonmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dreasonmaster = await Resolverreasonmaster.findByIdAndRemove(id);
    if (!dreasonmaster) {
        return next(new ErrorHandler('Resolverreasonmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
