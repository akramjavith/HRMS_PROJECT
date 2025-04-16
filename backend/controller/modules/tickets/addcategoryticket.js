const TicketCategory = require('../../../model/modules/tickets/addcategoryticket');
const ErrorHandler = require('../../../utils/errorhandler');
const Assetcategorygrouping = require('../../../model/modules/tickets/assetcategorygrouping');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
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
const Subsubcategoryticket = require('../../../model/modules/tickets/subsubcategory');
// get all ticketscategory => /api/documencategories

exports.getAllTicketCategory = catchAsyncErrors(async (req, res, next) => {
    let ticketcategory
    try {
        ticketcategory = await TicketCategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404)); 
    }
    if (!ticketcategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the ticketcategory
    const alldoccategory = ticketcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        ticketcategory: alldoccategory
    });

})
exports.getOverallEditCategory = catchAsyncErrors(async (req, res, next) => {

    let categorydata = req.body?.category;
    let subcategorydata = req.body?.subcategory;

    let reasonmaster , reason , resolvermaster , subsubcatMaster , subsubcategory ,resolverreason , selfchechmaster ,
     selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
     prioritymaster , priority ,duemaster , duedate ,assetgroupingdata , assetgrouping , typegrpmaster , typegroup, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
    try {
        reasonmaster = await Reasonmaster.find()
        assetgrouping = await Assetcategorygrouping.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raiseticket = await Raiseticketmaster.find()
        subsubcatMaster = await Subsubcategoryticket.find()


        subsubcategory = subsubcatMaster?.filter(data => data.categoryname?.includes(categorydata)
        //  && data?.subcategoryname?.some(datas => subcategorydata?.includes(datas))
        )
        assetgroupingdata = assetgrouping?.filter(data => data.categoryname?.includes(categorydata)
        //  && data?.subcategoryname?.some(datas => subcategorydata?.includes(datas))
        )
        subsubcategory = subsubcatMaster?.filter(data => data.categoryname?.includes(categorydata)
        //  && data?.subcategoryname?.some(datas => subcategorydata?.includes(datas))
        )
        reason = reasonmaster?.filter(data => data.categoryreason?.includes(categorydata)
        //  && data?.subcategoryreason?.some(datas =>subcategorydata?.includes(datas))
        )
        resolverreason = resolvermaster?.filter(data => data.categoryreason?.includes(categorydata) 
        // && data?.subcategoryreason?.some(datas => subcategorydata?.includes(datas))
    )
        selfcheck = selfchechmaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        checkpoint = Checkpointmaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        teamgroup = teamgroupingmaster?.filter(data => data.categoryfrom?.includes(categorydata) 
        // && data?.subcategoryfrom?.some(datas => subcategorydata?.includes(datas))
    )
        priority = prioritymaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        duedate = duemaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        requiredfield = requiredmaster?.filter(data => data.category?.includes(categorydata) 
        && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        typegroup = typegrpmaster?.filter(data => data.categorytype?.includes(categorydata) 
        // && data?.subcategorytype?.some(datas => subcategorydata?.includes(datas))
    )
        raisemaster = raiseticket?.filter(data => data.category === categorydata 
            // &&  subcategorydata.includes(data?.subcategory)
        )
        

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !subsubcategory && !resolverreason && !assetgroupingdata && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster && !typegroup
         ) {
      return next(new ErrorHandler(" Category details not found", 404));
    }
    return res.status(200).json({
      count: reason.length +subsubcategory.length + assetgroupingdata?.length +  resolverreason.length + selfcheck.length + checkpoint.length + teamgroup.length + priority.length + duedate.length + requiredfield.length + raisemaster.length + typegroup.length , 
      reason, resolverreason,selfcheck , assetgroupingdata , checkpoint,subsubcategory,teamgroup,priority,duedate,requiredfield,raisemaster,typegroup
    });
  });




exports.getOverallDeleteCategory = catchAsyncErrors(async (req, res, next) =>  {

    let categorydata = req.body?.category;
    let subcategorydata = req.body?.subcategory;
   
    let reasonmaster , reason , resolvermaster , assetgrouping , assetgroupingdata , subsubcatMaster , subsubcategory ,resolverreason , selfchechmaster ,
     selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
     prioritymaster , priority ,duemaster , duedate ,typegrpmaster , typegroup, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
    try {
        reasonmaster = await Reasonmaster.find()
        assetgrouping = await Assetcategorygrouping.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raiseticket = await Raiseticketmaster.find()
        subsubcatMaster = await Subsubcategoryticket.find()


        subsubcategory = subsubcatMaster?.filter(data => data.categoryname?.includes(categorydata)
        //  && data?.subcategoryname?.some(datas => subcategorydata?.includes(datas))
    )
    assetgroupingdata = assetgrouping?.filter(data => data.categoryname?.includes(categorydata))

        reason = reasonmaster?.filter(data => data.categoryreason?.includes(categorydata) 
        // && data?.subcategoryreason?.some(datas => subcategorydata?.includes(datas))
    )
        resolverreason = resolvermaster?.filter(data => data.categoryreason?.includes(categorydata) 
        // && data?.subcategoryreason?.some(datas => subcategorydata?.includes(datas))
    )
        selfcheck = selfchechmaster?.filter(data => data.category?.includes(categorydata)
        //  && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
        )
        checkpoint = Checkpointmaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        teamgroup = teamgroupingmaster?.filter(data => data.categoryfrom?.includes(categorydata) 
        // && data?.subcategoryfrom?.some(datas => subcategorydata?.includes(datas))
    )
        priority = prioritymaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        duedate = duemaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        requiredfield = requiredmaster?.filter(data => data.category?.includes(categorydata) 
        // && data?.subcategory?.some(datas => subcategorydata?.includes(datas))
    )
        typegroup = typegrpmaster?.filter(data => data.categorytype?.includes(categorydata) 
        // && data?.subcategorytype?.some(datas => subcategorydata?.includes(datas))
    )
        raisemaster = raiseticket?.filter(data => data.category === categorydata 
            // &&  subcategorydata?.includes(data?.subcategory)
        )
        

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !subsubcategory &&  !assetgroupingdata && !resolverreason && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster && !typegroup
         ) {
      return next(new ErrorHandler(" Category details not found", 404));
    }
    return res.status(200).json({
      count: reason.length +subsubcategory.length + assetgroupingdata.length +  resolverreason.length + selfcheck.length + checkpoint.length + teamgroup.length + priority.length + duedate.length + requiredfield.length + raisemaster.length + typegroup.length , 
      reason, resolverreason,selfcheck,checkpoint,subsubcategory,assetgroupingdata ,teamgroup,priority,duedate,requiredfield,raisemaster,typegroup
    });
  });
exports.getOverallBulkDeleteCategory = catchAsyncErrors(async (req, res, next) =>  {


    let reasonmaster , result , count , anscheck , reason , resolvermaster , subsubcatMaster , subsubcategory ,resolverreason , selfchechmaster ,
     selfcheck ,Checkpointmaster , checkpoint , teamgroupingmaster , teamgroup , 
     prioritymaster , priority ,duemaster, assetgrouping ,assetgroupingdata ,  duedate ,typegrpmaster , typegroup, requiredmaster , requiredfield ,raisemaster , raiseticket  ;
     let id = req.body.id
   

     try {

        anscheck = await TicketCategory.find();
        const answer = anscheck?.filter(data => id?.includes(data._id?.toString()))
        assetgrouping = await Assetcategorygrouping.find()
        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        requiredmaster = await RequiredFields.find()
        typegrpmaster = await Typemaster.find()
        raiseticket = await Raiseticketmaster.find()
        subsubcatMaster = await Subsubcategoryticket.find()


        assetgroupingdata = answer.filter(answers =>  assetgrouping?.some(data => data.categoryname?.includes(answers.category) 
        // && data?.subcategoryname?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        subsubcategory = answer.filter(answers =>  subsubcatMaster?.some(data => data.categoryname?.includes(answers.category) 
        // && data?.subcategoryname?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        reason =answer.filter(answers =>  reasonmaster?.some(data => data.categoryreason?.includes(answers.categoryname) 
        // && data?.subcategoryreason?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        resolverreason =answer.filter(answers =>  resolvermaster?.some(data => data.categoryreason?.includes(answers.categoryname) 
        // && data?.subcategoryreason?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        selfcheck = answer.filter(answers => selfchechmaster?.some(data => data.category?.includes(answers.categoryname) 
        // && data?.subcategory?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        checkpoint = answer.filter(answers =>  Checkpointmaster?.some(data => data.category?.includes(answers.categoryname) 
        // && data?.subcategory?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        teamgroup = answer.filter(answers =>  teamgroupingmaster?.some(data => data.categoryfrom?.includes(answers.categoryname) 
        // && data?.subcategoryfrom?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        priority = answer.filter(answers => prioritymaster?.some(data => data.category?.includes(answers.categoryname)
        //  && data?.subcategory?.some(datas => answer?.subcategoryname?.includes(datas))
        ))?.map(data => data._id?.toString());
        duedate =answer.filter(answers =>  duemaster?.some(data => data.category?.includes(answers.categoryname) 
        // && data?.subcategory?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        requiredfield = answer.filter(answers =>  requiredmaster?.some(data => data.category?.includes(answers.categoryname)
        //  && data?.subcategory?.some(datas => answer?.subcategoryname?.includes(datas))
        ))?.map(data => data._id?.toString());
        typegroup = answer.filter(answers =>  typegrpmaster?.some(data => data.categorytype?.includes(answers.categoryname) 
        // && data?.subcategorytype?.some(datas => answer?.subcategoryname?.includes(datas))
    ))?.map(data => data._id?.toString());
        raisemaster = answer.filter(answers => raiseticket?.some(data => data.category === answers.categoryname 
            &&  answer?.subcategoryname?.includes(data?.subcategory)
        ))?.map(data => data._id?.toString());
        
        const duplicateId = [...reason, ...resolverreason , ...selfcheck ,
            ...checkpoint, ...teamgroup , ...priority ,
            ...duedate, ...raisemaster, ...requiredfield , ...typegroup , ...subsubcategory , assetgroupingdata]

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


exports.addTicketCategory = catchAsyncErrors(async (req, res, next) => {
    await TicketCategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleTicketCategory  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sticketcategory = await TicketCategory.findById(id);
    if(!sticketcategory){
        return next(new ErrorHandler('tickets not found'));

    }
    return res.status(200).json({
        sticketcategory
    });

});

exports.updateTicketCategory = catchAsyncErrors(async (req , res , next)=>{

    const id = req.params.id

    let uticketcategory  = await TicketCategory.findByIdAndUpdate(id , req.body);

    if(!uticketcategory){
        return next( new ErrorHandler('ticket not found'));
    }
return res.status(200).json({
    message :'Update Successfully' , uticketcategory
});
});



//delete ticketcategory by id => /api/delticketcateg/:id
exports.deleteTicketCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dticketcategory = await TicketCategory.findByIdAndRemove(id);
    if (!dticketcategory) {
        return next(new ErrorHandler('ticket not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})