const Checkgroup = require('../../../model/modules/project/checkpointgroup');
const Categorysub = require('../../../model/modules/project/categorysub');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Group =>/api/groups
exports.getAllCheckptGroup = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups;
    try {
        checkptgroups = await Checkgroup.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Checkgroup not found!', 404));
    }
    return res.status(200).json({
        checkptgroups
    });
})

// get overAll edit functionality
exports.getOverAllCategoryDetails = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups
    try {
        checkptgroups = await Checkgroup.find({ category: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Checkgroup not found', 404));
    }
    return res.status(200).json({
        count: checkptgroups.length,
        checkptgroups
    });
})

// get overAll edit functionality
exports.getCheckpointsandtime = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups;
    let matchingitem;
    let checkpointsArray;
    let timevalue = null;
    try {
        checkptgroups = await Checkgroup.find();
        categorySub = await Categorysub.find();

        matchingitem = checkptgroups?.find(item =>
            item.category === req.body.selectedcategory && item.subcategory === req.body.selectedsubcategory
        );

        checkpointsArray = matchingitem ? matchingitem?.checkpointgrp : [];

        if (matchingitem) {
            const matchingCheckpoint = matchingitem.checkpointgrp.find(checkpoint =>
                checkpoint.label === req.body.selectedcheckpoint
            );
            if (matchingCheckpoint) {
                timevalue = matchingCheckpoint.time;
            }
        }

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Checkgroup not found', 404));
    }
    return res.status(200).json({
        checkpointsArray, timevalue,
        count: checkptgroups.length,
        checkptgroups
    });
})

// get overAll edit functionality
exports.getCheckpointsandtimeusecases = catchAsyncErrors(async (req, res, next) => {
    let checkptgroups;
    let matchingitem;
    let checkpointsArray;
    let timevalue = null;
    try {
        checkptgroups = await Checkgroup.find();
        categorySub = await Categorysub.find();

        matchingitem = checkptgroups?.find(item =>
            item.category === req.body.selectedcategory && item.subcategory === req.body.selectedsubcategory
        );

        checkpointsArray = matchingitem ? matchingitem?.checkpointgrp : [];

        if (matchingitem) {
            const matchingCheckpoint = matchingitem.checkpointgrp.find(checkpoint =>
                checkpoint.label === req.body.selectedcheckpoint
            );
            if (matchingCheckpoint) {
                timevalue = matchingCheckpoint.time;
            }
        }

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkptgroups) {
        return next(new ErrorHandler('Checkgroup not found', 404));
    }
    return res.status(200).json({
        checkpointsArray, timevalue,
        count: checkptgroups.length,
        checkptgroups
    });
})



//create new group => /api/group/new
exports.addCheckptGroup = catchAsyncErrors(async (req, res, next) => {

    let agroup = await Checkgroup.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single group => /api/group/:id
exports.getSingleCheckptGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sgroup = await Checkgroup.findById(id);
    if (!sgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }
    return res.status(200).json({
        sgroup
    })
})
//update group by id => /api/group/:id
exports.updateCheckptGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ugroup = await Checkgroup.findByIdAndUpdate(id, req.body);
    if (!ugroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete group by id => /api/group/:id
exports.deleteCheckptGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dgroup = await Checkgroup.findByIdAndRemove(id);
    if (!dgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})