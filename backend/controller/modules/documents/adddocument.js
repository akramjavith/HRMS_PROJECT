const Document = require('../../../model/modules/documents/adddocument');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const AssignDocument = require("../../../model/modules/documents/assigndocuments");


exports.getAllDocument = catchAsyncErrors(async (req, res, next) => {
    let document
    try {
        document = await Document.find({},{categoryname:1,subcategoryname:1,type:1,module:1,customer:1,queue:1,process:1,form:1,addedby:1,updatedby:1,_id:1, document:1,});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!document) {
        return next(new ErrorHandler('Document not found', 404));
    }
    // Add serial numbers to the doccategory
    const alldoccategory = document.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        document: alldoccategory
    });

})
exports.getAllassignedDocument = catchAsyncErrors(async (req, res, next) => {
    try {
        const [documents, assignedDocs] = await Promise.all([
            Document.find({}, { categoryname: 1, subcategoryname: 1, type: 1, module: 1, customer: 1, queue: 1, process: 1, form: 1, addedby: 1, updatedby: 1, _id: 1, document: 1 }),
            AssignDocument.find({ employeedbid: { $in: req.body.userid } }) // Corrected model name and query syntax
        ]);    
         return res.status(200).json({
            documents,
            assignedDocs
        });    } catch (err) {

        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getAllDocumentTraining = catchAsyncErrors(async (req, res, next) => {
    let document
    try {
        document = await Document.find({type : "Training Document"},{})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!document) {
        return next(new ErrorHandler('Document not found', 404));
    }
    // Add serial numbers to the doccategory
    const alldoccategory = document.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        document: alldoccategory
    });

})

exports.addDocument = catchAsyncErrors(async (req, res, next) => {
    await Document.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleDocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sdocument = await Document.findById(id);
    if (!sdocument) {
        return next(new ErrorHandler('Document not found'));

    }
    return res.status(200).json({
        sdocument
    });

});

exports.updateDocument = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    let udocument = await Document.findByIdAndUpdate(id, req.body);

    if (!udocument) {
        return next(new ErrorHandler('Document not found'));
    }
    return res.status(200).json({
        message: 'Update Successfully', udocument
    });
});



//delete ujobopening by id => /api/jobopening/:id
exports.deleteDocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddocument = await Document.findByIdAndRemove(id);
    if (!ddocument) {
        return next(new ErrorHandler('Document not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


// get overall delete functionlity
exports.getAllDocumentcategoryCheck = catchAsyncErrors(async (req, res, next) => {
    let documnetcat;
    try {
        documnetcat = await Document.find();
        let query = {
            categoryname: req.body.checkcat,
        };
        documnetcat = await Document.find(query, {
            categorycode: 1,
            _id: 1,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!documnetcat) {
        return next(new ErrorHandler("Document not found!", 404));
    }
    return res.status(200).json({
        documnetcat,
    });
});