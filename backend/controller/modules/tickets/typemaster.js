const Typemaster = require('../../../model/modules/tickets/typemaster');
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
const TicketMasterType = require("../../../model/modules/tickets/typetickermaster");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Typemaster =>/api/Typemaster
exports.getAllTypemaster = catchAsyncErrors(async (req, res, next) => {
    let typemasters;
    try {
        typemasters = await Typemaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!typemasters) {
        return next(new ErrorHandler('Typemaster not found!', 404));
    }
    return res.status(200).json({
        typemasters
    });
})
//get All Typemaster =>/api/Typemaster
exports.getoverallTypemaster = catchAsyncErrors(async (req, res, next) => {
    let reason, resolver, selfcheck, check, teamgroupmaster, teamgroup, priority, duedate, requiredfield, raiseticket;
    try {
        reason = await Reasonmaster.find({ typereason: req.body.oldname })
        resolver = await Resolverreasonmaster.find({ typereason: req.body.oldname })
        selfcheck = await SelfCheckPointTicketMaster.find({ type: req.body.oldname })
        check = await Checkpointticketmaster.find({ type: req.body.oldname })
        teamgroupmaster = await Teamgrouping.find()
        teamgroup = teamgroupmaster?.filter(data => data?.typefrom?.includes(req.body.oldname))
        priority = await Prioritymaster.find({ type: req.body.oldname })
        duedate = await Duedatemaster.find({ type: req.body.oldname })
        raiseticket = await Raiseticketmaster.find({ type: req.body.oldname })
        typegroup = await Typemaster.find({ nametype: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !priority && !resolver && !typegroup && !selfcheck && !check && !teamgroup && !duedate && !raiseticket) {
        return next(new ErrorHandler('Typemaster not found!', 404));
    }
    return res.status(200).json({
        count: reason?.length + resolver?.length + selfcheck?.length + check?.length + teamgroup?.length + priority?.length + duedate?.length + raiseticket?.length + typegroup?.length,
        reason, resolver, selfcheck, check, teamgroup, priority, duedate, raiseticket, typegroup
    });
})
//get All Typemaster =>/api/Typemaster
exports.getoverallTypemasterDelete = catchAsyncErrors(async (req, res, next) => {
    let id = req.body.id
    let reason, resolver, selfcheck, check, typegroup, teamgroupmaster, teamgroup, priority, duedate, requiredfield, raiseticket;
    try {

        reason = await Reasonmaster.find({ typereason: req.body.oldname })
        resolver = await Resolverreasonmaster.find({ typereason: req.body.oldname })
        selfcheck = await SelfCheckPointTicketMaster.find({ type: req.body.oldname })
        check = await Checkpointticketmaster.find({ type: req.body.oldname })
        teamgroupmaster = await Teamgrouping.find()
        teamgroup = teamgroupmaster?.filter(data => data?.typefrom?.includes(req.body.oldname))
        priority = await Prioritymaster.find({ type: req.body.oldname })
        duedate = await Duedatemaster.find({ type: req.body.oldname })
        raiseticket = await Raiseticketmaster.find({ type: req.body.oldname })
        typegroup = await Typemaster.find({ nametype: req.body.oldname })




    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !priority && !resolver && !typegroup && !selfcheck && !check && !teamgroup && !duedate && !raiseticket) {
        return next(new ErrorHandler('Typemaster not found!', 404));
    }
    return res.status(200).json({
        count: reason?.length + resolver?.length + selfcheck?.length + check?.length + teamgroup?.length + priority?.length + duedate?.length + raiseticket?.length + typegroup?.length,
        reason, resolver, selfcheck, check, teamgroup, priority, duedate, raiseticket, typegroup
    });
})
exports.getoverallBulkTypemasterDelete = catchAsyncErrors(async (req, res, next) => {
    let reason, result, count, typegroup, anscheck, resolver, selfcheck, check, teamgroupmaster, teamgroup, priority, duedate, requiredfield, raiseticket;
    let id = req.body.id
    try {
        anscheck = await TicketMasterType.find();
        const answer = anscheck?.filter(data => id?.includes(data._id?.toString()))



        reason = await Reasonmaster.find()
        resolver = await Resolverreasonmaster.find()
        selfcheck = await SelfCheckPointTicketMaster.find()
        check = await Checkpointticketmaster.find()
        teamgroupmaster = await Teamgrouping.find()
        priority = await Prioritymaster.find()
        duedate = await Duedatemaster.find()
        raiseticket = await Raiseticketmaster.find()
        typegroup = await Typemaster.find()


        const reas = answer.filter(answers => reason?.some(data => data.typereason === answers.typename))?.map(data => data._id?.toString());
        const resol = answer.filter(answers => resolver?.some(data => data.typereason === answers.typename))?.map(data => data._id?.toString());
        const selfch = answer.filter(answers => selfcheck?.some(data => data.type === answers.typename))?.map(data => data._id?.toString());
        const checking = answer.filter(answers => check?.some(data => data.type === answers.typename))?.map(data => data._id?.toString());
        const prior = answer.filter(answers => priority?.some(data => data.type === answers.typename))?.map(data => data._id?.toString());
        const dued = answer.filter(answers => duedate?.some(data => data.type === answers.typename))?.map(data => data._id?.toString());
        const raise = answer.filter(answers => raiseticket?.some(data => data.type === answers.typename))?.map(data => data._id?.toString());
        const typegrp = answer.filter(answers => typegroup?.some(data => data.nametype === answers.typename))?.map(data => data._id?.toString());
        teamgroup = answer.filter(answers => teamgroupmaster?.some(data => data?.typefrom?.includes(answers?.typename)))?.map(data => data._id?.toString());



        const duplicateId = [...reas, ...resol, ...selfch,
        ...checking, ...prior, ...dued,
        ...raise, ...typegrp, ...teamgroup]
        duplicateId

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
//get All Typemaster =>/api/Typemaster
exports.getoverallTypeGroupmaster = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster, reason, resolvermaster, resolverreason, selfchechmaster,
        selfcheck, Checkpointmaster, checkpoint, teamgroupingmaster, teamgroup,
        prioritymaster, priority, duemaster, duedate, typegrpmaster, typegroup, requiredmaster, requiredfield, raisemaster, raiseticket;
    let typeGroup = req.body.oldname
    //categorytype , subcategorytype , subsubcategorytype ,nametype
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
        raiseticket = await Raiseticketmaster.find()
        console.log(typeGroup.subsubcategorytype, 'typeGroup.subsubcategorytype')

        reason = typeGroup.subsubcategorytype?.length > 0 ? reasonmaster?.filter(data =>
            data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryreason.some(item => typeGroup.subsubcategorytype.includes(item))) :
            reasonmaster?.filter(data =>
                data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)))



        resolverreason = typeGroup.subsubcategorytype?.length > 0 ? resolvermaster?.filter(data =>
            data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryreason.some(item => typeGroup.subsubcategorytype.includes(item))) :
            resolvermaster?.filter(data =>
                data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)))

        selfcheck = typeGroup.subsubcategorytype?.length > 0 ? selfchechmaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            selfchechmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        checkpoint = typeGroup.subsubcategorytype?.length > 0 ? Checkpointmaster.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            Checkpointmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        teamgroup = typeGroup.subsubcategorytype?.length > 0 ? teamgroupingmaster?.filter(data =>
            data.categoryfrom?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryfrom?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryfrom.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            teamgroupingmaster?.filter(data =>
                data.categoryfrom?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryfrom?.some(item => typeGroup.subcategorytype.includes(item)))

        priority = typeGroup.subsubcategorytype?.length > 0 ? prioritymaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item))) :
            reasonmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        duedate = typeGroup.subsubcategorytype?.length > 0 ? duemaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item))) :
            duemaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        raisemaster = typeGroup.subsubcategorytype?.length > 0 ? raiseticket?.filter(data =>
            typeGroup.categorytype.includes(data.category) &&
            typeGroup.subcategorytype.includes(data.subcategory) &&
            typeGroup.subsubcategorytype.includes(data?.subsubcategory)) :
            raiseticket?.filter(data =>
                typeGroup.categorytype.includes(data.category) &&
                typeGroup.subcategorytype.includes(data.subcategory))
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !resolverreason && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster) {
        return next(new ErrorHandler("TYPE Group Category details not found", 404));
    }
    return res.status(200).json({
        count: reason.length + resolverreason.length + selfcheck.length + checkpoint.length +
            teamgroup.length + priority.length + duedate.length + raisemaster.length,
        reason, resolverreason, selfcheck, checkpoint, teamgroup, priority, duedate, raisemaster
    });
});

//get All Typemaster =>/api/Typemaster
exports.getoverallTypeGroupDelete = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster, reason, resolvermaster, resolverreason, selfchechmaster,
        selfcheck, Checkpointmaster, checkpoint, teamgroupingmaster, teamgroup,
        prioritymaster, priority, duemaster, duedate, typegrpmaster, typegroup, requiredmaster, requiredfield, raisemaster, raiseticket;
    let typeGroup = req.body.oldname
    //categorytype , subcategorytype , subsubcategorytype ,nametype
    try {
        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()

        typegrpmaster = await Typemaster.find()
        raiseticket = await Raiseticketmaster.find()


        reason = typeGroup.subsubcategorytype?.length > 0 ? reasonmaster?.filter(data =>
            data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryreason.some(item => typeGroup.subsubcategorytype.includes(item))) :
            reasonmaster?.filter(data =>
                data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)))



        resolverreason = typeGroup.subsubcategorytype?.length > 0 ? resolvermaster?.filter(data =>
            data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryreason.some(item => typeGroup.subsubcategorytype.includes(item))) :
            resolvermaster?.filter(data =>
                data.categoryreason?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryreason?.some(item => typeGroup.subcategorytype.includes(item)))

        selfcheck = typeGroup.subsubcategorytype?.length > 0 ? selfchechmaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            selfchechmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        checkpoint = typeGroup.subsubcategorytype?.length > 0 ? Checkpointmaster.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            Checkpointmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        teamgroup = typeGroup.subsubcategorytype?.length > 0 ? teamgroupingmaster?.filter(data =>
            data.categoryfrom?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategoryfrom?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategoryfrom.some(item => typeGroup.subsubcategorytype.includes(item)))
            :
            teamgroupingmaster?.filter(data =>
                data.categoryfrom?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategoryfrom?.some(item => typeGroup.subcategorytype.includes(item)))

        priority = typeGroup.subsubcategorytype?.length > 0 ? prioritymaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item))) :
            reasonmaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        duedate = typeGroup.subsubcategorytype?.length > 0 ? duemaster?.filter(data =>
            data.category?.some(item => typeGroup.categorytype.includes(item)) &&
            data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)) &&
            data?.subsubcategory.some(item => typeGroup.subsubcategorytype.includes(item))) :
            duemaster?.filter(data =>
                data.category?.some(item => typeGroup.categorytype.includes(item)) &&
                data.subcategory?.some(item => typeGroup.subcategorytype.includes(item)))

        raisemaster = typeGroup.subsubcategorytype?.length > 0 ? raiseticket?.filter(data =>
            typeGroup.categorytype.includes(data.category) &&
            typeGroup.subcategorytype.includes(data.subcategory) &&
            typeGroup.subsubcategorytype.includes(data?.subsubcategory)) :
            raiseticket?.filter(data =>
                typeGroup.categorytype.includes(data.category) &&
                typeGroup.subcategorytype.includes(data.subcategory))
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!reason && !resolverreason && !selfcheck && !checkpoint && !teamgroup && !priority && !duedate && !requiredfield && !raisemaster) {
        return next(new ErrorHandler("TYPE Group Category details not found", 404));
    }
    return res.status(200).json({
        count: reason.length + resolverreason.length + selfcheck.length + checkpoint.length +
            teamgroup.length + priority.length + duedate.length + raisemaster.length,
        reason, resolverreason, selfcheck, checkpoint, teamgroup, priority, duedate, raisemaster
    });
});
//get All Typemaster =>/api/Typemaster
exports.getoverallBulkTypeGroupDelete = catchAsyncErrors(async (req, res, next) => {
    let reasonmaster, reason, resolvermaster, resolverreason, selfchechmaster,
        selfcheck, Checkpointmaster, checkpoint, teamgroupingmaster, teamgroup,
        prioritymaster, priority, duemaster, duedate, typegrpmaster, result, priorityDelete, count, typegroup, requiredmaster, requiredfield, raisemaster, raiseticket;
    let id = req.body.id

    //categorytype , subcategorytype , subsubcategorytype ,nametype
    try {
        priorityDelete = await Typemaster.find()
        const answer = priorityDelete?.filter(data => id?.includes(data._id?.toString()))


        reasonmaster = await Reasonmaster.find()
        resolvermaster = await Resolverreasonmaster.find()
        selfchechmaster = await SelfCheckPointTicketMaster.find()
        Checkpointmaster = await Checkpointticketmaster.find()
        teamgroupingmaster = await Teamgrouping.find()
        prioritymaster = await Prioritymaster.find()
        duemaster = await Duedatemaster.find()
        typegrpmaster = await Typemaster.find()
        raiseticket = await Raiseticketmaster.find()


        reason = answer.filter(answers =>
            reasonmaster?.some(data =>
                data.categoryreason?.some(item => answers.categorytype.includes(item)) &&
                data.subcategoryreason?.some(item => answers.subcategorytype.includes(item)) &&
                answers?.nametype === data?.typereason &&
                (answers.subsubcategorytype?.length > 0 ? data?.subsubcategoryreason.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());;


        resolverreason = answer.filter(answers => resolvermaster?.some(data =>
            data.categoryreason?.some(item => answers.categorytype.includes(item)) &&
            data.subcategoryreason?.some(item => answers.subcategorytype.includes(item)) &&
            answers?.nametype === data?.typereason &&
            (answers.subsubcategorytype?.length > 0 ? data?.subsubcategoryreason.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());

        selfcheck = answer.filter(answers => 
            selfchechmaster?.some(data =>
            data.category?.some(item => answers.categorytype.includes(item)) &&
            data.subcategory?.some(item => answers.subcategorytype.includes(item)) &&
            answers?.nametype === data?.type &&
            (answers.subsubcategorytype?.length > 0 ? data?.subsubcategory.some(item => answers.subsubcategorytype.includes(item)) 
            : true)))?.map(data => data._id?.toString());

        checkpoint = answer.filter(answers => Checkpointmaster.some(data =>
            data.category?.some(item => answers.categorytype.includes(item)) &&
            data.subcategory?.some(item => answers.subcategorytype.includes(item)) &&
            answers?.nametype === data?.type &&
            (answers.subsubcategorytype?.length > 0 ? data?.subsubcategory.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());


        teamgroup = answer.filter(answers =>
            teamgroupingmaster?.some(data =>
                data.categoryfrom?.some(item => answers.categorytype.includes(item)) &&
                data.subcategoryfrom?.some(item => answers.subcategorytype.includes(item)) &&
                data?.typefrom.includes(answers?.nametype) &&
                (answers.subsubcategorytype?.length > 0 ? data?.subsubcategoryfrom.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());


        priority = answer.filter(answers => prioritymaster?.some(data =>
            data.category?.some(item => answers.categorytype.includes(item)) &&
            data.subcategory?.some(item => answers.subcategorytype.includes(item)) &&
            answers?.nametype === data?.type &&
            (answers.subsubcategorytype?.length > 0 ? data?.subsubcategory.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());

        duedate = answer.filter(answers => duemaster?.some(data =>
            data.category?.some(item => answers.categorytype.includes(item)) &&
            data.subcategory?.some(item => answers.subcategorytype.includes(item)) &&
            answers?.nametype === data?.type &&
            (answers.subsubcategorytype?.length > 0 ? data?.subsubcategory.some(item => answers.subsubcategorytype.includes(item)) : true)))?.map(data => data._id?.toString());

        raisemaster = answer.filter(answers => raiseticket?.some(data =>
            answers.categorytype.includes(data.category) &&
            answers.subcategorytype.includes(data.subcategory) &&
            answers?.nametype === data?.type &&
            (answers.subsubcategorytype?.length > 0 ? answers.subsubcategorytype.includes(data?.subsubcategory) : true)))?.map(data => data._id?.toString());




        const duplicateId = [...reason, ...resolverreason, ...selfcheck,
        ...checkpoint, ...teamgroup, ...priority,
        ...duedate, ...raisemaster]


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

//create new Typemaster => /api/Typemaster/new
exports.addTypemaster = catchAsyncErrors(async (req, res, next) => {

    let aTypemaster = await Typemaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Typemaster => /api/Typemaster/:id
exports.getSingleTypemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stypemaster = await Typemaster.findById(id);
    if (!stypemaster) {
        return next(new ErrorHandler('Typemaster not found', 404));
    }
    return res.status(200).json({
        stypemaster
    })
})

//update Typemaster by id => /api/Typemaster/:id
exports.updateTypemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utypemaster = await Typemaster.findByIdAndUpdate(id, req.body);
    if (!utypemaster) {
        return next(new ErrorHandler('Typemaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Typemaster by id => /api/Typemaster/:id
exports.deleteTypemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtypemaster = await Typemaster.findByIdAndRemove(id);
    if (!dtypemaster) {
        return next(new ErrorHandler('Typemaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})