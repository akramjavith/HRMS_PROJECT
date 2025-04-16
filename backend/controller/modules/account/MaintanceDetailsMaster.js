const MaintenanceDetailsmaster = require('../../../model/modules/account/MaintanceDetailsmaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

exports.getAllMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {
    let maintenancedetailsmaster, smaintenancedetailsmasterGroup, smaintenancedetailsmasterGroupMatch;

    try {
        maintenancedetailsmaster = await MaintenanceDetailsmaster.find();

        smaintenancedetailsmasterGroup = await MaintenanceDetailsmaster.aggregate([
            {
                $group: {
                    _id: "$assetmaterial__$assetmaterialcode__$maintenancedescriptionmaster",
                    matchedData: { $push: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: { matchedData: "$matchedData" } }
            }
        ]);

        smaintenancedetailsmasterGroupMatch = await MaintenanceDetailsmaster.aggregate([
            {
                $group: {
                    _id: {
                        assetmaterial: "$assetmaterial",
                        maintenancedescriptionmaster: "$maintenancedescriptionmaster"
                    },
                    assetmaterialcode: { $addToSet: "$assetmaterialcode" }, // Group assetmaterialcode into an array
                    _ids: { $addToSet: "$_id" }, // Group _ids into an array
                    matchedData: { $push: "$$ROOT" } // Push all matching documents into matchedData
                }
            },
            {
                $addFields: {
                    uniqueId: { $concat: [{ $toString: "$_id.assetmaterial" }, "-", { $toString: "$_id.maintenancedescriptionmaster" }, "-", { $toString: { $rand: {} } }] } // Create a unique string ID by adding a random value to the concatenation
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    assetmaterial: "$_id.assetmaterial", // Include assetmaterial
                    maintenancedescriptionmaster: "$_id.maintenancedescriptionmaster", // Include maintenancedescriptionmaster
                    ids: "$_ids", // Include ids from _ids array
                    assetmaterialcode: 1, // Include assetmaterialcodes as array
                    matchedData: 1, // Include matchedData
                    uniqueId: 1 // Include the generated uniqueId
                }
            }
        ]);

        return res.status(200).json({
            maintenancedetailsmaster,
            smaintenancedetailsmasterGroup,
            smaintenancedetailsmasterGroupMatch
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});


// Create newMaintenancedetailsmaster => /api/Maintenancedetailsmaster/new
exports.addMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {

    let amaintenancedetailsmaster = await MaintenanceDetailsmaster.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Maintenancedetailsmaster => /api/Maintenancedetailsmaster/:id
exports.getSingleMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smaintenancedetailsmaster = await MaintenanceDetailsmaster.findById(id);

    if (!smaintenancedetailsmaster) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }
    return res.status(200).json({
        smaintenancedetailsmaster
    })
})

// get Single Maintenancedetailsmaster => /api/Maintenancedetailsmaster/:id
exports.getMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;

    let smaintenancedetailsmaster = await MaintenanceDetailsmaster.find({
        '_id': { $in: id } // Use $in to match any of the IDs in the array
    });

    if (!smaintenancedetailsmaster) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }
    return res.status(200).json({
        smaintenancedetailsmaster
    })
})


// get Single Maintenancedetailsmaster => /api/Maintenancedetailsmaster/:id
exports.getSingleMaintenanceDetailsmasterGroup = catchAsyncErrors(async (req, res, next) => {
    const { id, groupid } = req.body;

    let smaintenancedetailsmaster = await MaintenanceDetailsmaster.findById(id);

    let smaintenancedetailsmasterGroup = await MaintenanceDetailsmaster.aggregate([
        {
            $group: {
                _id: "$groupid", // Group by 'groupid'
                matchedData: { $push: "$$ROOT" } // Collect all documents in the group
            }
        },
        {
            $match: {
                _id: groupid // Match the specific groupid
            }
        },
        {
            $unwind: "$matchedData" // Flatten the array of matched data
        },
        {
            $replaceRoot: { newRoot: "$matchedData" } // Replace the root with matched data
        }
    ]);

    if (!smaintenancedetailsmaster) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }
    return res.status(200).json({
        smaintenancedetailsmaster,
        smaintenancedetailsmasterGroup
    })
})

// updateMaintenancedetailsmaster by id => /api/Maintenancedetailsmaster/:id
exports.updateMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let umaintenancedetailsmaster = await MaintenanceDetailsmaster.findByIdAndUpdate(id, req.body);

    if (!umaintenancedetailsmaster) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// deleteMaintenanceDetailsmaster by id => /api/Maintenancedetailsmaster/:id
exports.deleteMaintenanceDetailsmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dmaintenancedetailsmaster = await MaintenanceDetailsmaster.findByIdAndRemove(id);

    if (!dmaintenancedetailsmaster) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getSingleMaintenanceDetailsmasterGroupDelete = catchAsyncErrors(async (req, res, next) => {
    const { groupids } = req.body;
    // Delete documents with the provided IDs
    const result = await MaintenanceDetailsmaster.deleteMany({
        _id: { $in: groupids }
    });

    if (result.deletedCount === 0) {
        return next(new ErrorHandler('MaintenanceDetailsmaster not found!', 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});


