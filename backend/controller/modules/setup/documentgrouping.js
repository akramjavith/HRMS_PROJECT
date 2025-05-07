const Documentgrouping = require("../../../model/modules/setup/documentgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


//get All Documentgrouping =>/api/Documentgrouping
exports.getAllDocumentgrouping = catchAsyncErrors(async (req, res, next) => {
    let documentgroupings;
    try {
        documentgroupings = await Documentgrouping.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!documentgroupings) {
        return next(new ErrorHandler('Documentgrouping not found!', 404));
    }
    return res.status(200).json({
        documentgroupings
    });
})


//create new Documentgrouping => /api/Documentgrouping/new
exports.addDocumentgrouping = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aDocumentgrouping = await Documentgrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Documentgrouping => /api/Documentgrouping/:id
exports.getSingleDocumentgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sdocumentgrouping = await Documentgrouping.findById(id);
    if (!sdocumentgrouping) {
        return next(new ErrorHandler('Documentgrouping not found', 404));
    }
    return res.status(200).json({
        sdocumentgrouping
    })
})

//update Documentgrouping by id => /api/Documentgrouping/:id
exports.updateDocumentgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let udocumentgrouping = await Documentgrouping.findByIdAndUpdate(id, req.body);
    if (!udocumentgrouping) {
        return next(new ErrorHandler('Documentgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Documentgrouping by id => /api/Documentgrouping/:id
exports.deleteDocumentgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddocumentgrouping = await Documentgrouping.findByIdAndRemove(id);
    if (!ddocumentgrouping) {
        return next(new ErrorHandler('Documentgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
