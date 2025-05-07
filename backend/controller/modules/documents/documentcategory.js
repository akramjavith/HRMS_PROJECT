const DocumentCategory = require('../../../model/modules/documents/documentcategory');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Document = require('../../../model/modules/documents/adddocument');

// get all documentscategory => /api/documencategories

exports.getAllDocCategory = catchAsyncErrors(async (req, res, next) => {
    let doccategory
    try {
        doccategory = await DocumentCategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!doccategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the doccategory
    const alldoccategory = doccategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        doccategory: alldoccategory
    });

})


exports.addDocCategory = catchAsyncErrors(async (req, res, next) => {
    await DocumentCategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleDocCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sdoccategory = await DocumentCategory.findById(id);
    if (!sdoccategory) {
        return next(new ErrorHandler('document not found'));

    }
    return res.status(200).json({
        sdoccategory
    });

});

exports.updateDocCategory = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    let udoccategory = await DocumentCategory.findByIdAndUpdate(id, req.body);

    if (!udoccategory) {
        return next(new ErrorHandler('document not found'));
    }
    return res.status(200).json({
        message: 'Update Successfully', udoccategory
    });
});



//delete ujobopening by id => /api/jobopening/:id
exports.deleteocumentCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddoccategory = await DocumentCategory.findByIdAndRemove(id);
    if (!ddoccategory) {
        return next(new ErrorHandler('company not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getOverAllEditDocuments = catchAsyncErrors(async (req, res, next) => {
    let documentsall, query, documents, docindex
    try {

        documentsall = await Document.find(query, {});

        documents = documentsall.filter(item => item.categoryname == req.body.oldname && req.body.oldnamesub.includes(item.subcategoryname))

        docindex = documentsall.findIndex(item => req.body.oldnamesub.includes(item.subcategoryname));
       
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }


    return res.status(200).json({
        count: documents.length,

        documents, docindex
    });
});



