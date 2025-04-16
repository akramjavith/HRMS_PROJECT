const EmployeeDocuments = require('../../model/login/employeedocuments');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get All EmployeeDocuments => /api/employeedocuments
exports.getAllEmployeeDocuments = catchAsyncErrors(async (req, res, next) => {
    let alldocuments;

    try {
        alldocuments = await EmployeeDocuments.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!alldocuments) {
        return next(new ErrorHandler('EmployeeDocuments not found', 400));
    }

    return res.status(200).json({ alldocuments });
})

// get All EmployeeDocuments => /api/employeedocuments
exports.getAllPreEmployeeDocuments = catchAsyncErrors(async (req, res, next) => {
    let alldocuments;

    try {
        alldocuments = await EmployeeDocuments.find({}, { companyname: 1, empcode: 1, commonid: 1, profileimage: 1, type: 1, _id: 1 })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!alldocuments) {
        return next(new ErrorHandler('EmployeeDocuments not found', 400));
    }

    return res.status(200).json({ alldocuments });
})

// / register employeeDocument => api/employeedocuments/new
exports.addEmployeeDocuments = catchAsyncErrors(async (req, res, next) => {
    let employeeDocument = await EmployeeDocuments.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!', employeedocument: employeeDocument
    });
})


// get Single employeeDocument => /api/employeedocument/:id
exports.getSingleEmployeeDocument = catchAsyncErrors(async (req, res, next) => {

    const semployeedocument = await EmployeeDocuments.findById(req.params.id);


    if (!semployeedocument) {
        return next(new ErrorHandler('EmployeeDocuments not found', 404));
    }

    return res.status(200).json({
        success: true,
        semployeedocument
    })
})


// get Single employeeDocument => /api/employeedocumentcommonid/:id
exports.getSingleEmployeeDocumentByCommonid = catchAsyncErrors(async (req, res, next) => {
    const { commonid } = req.body;
    const semployeedocument = await EmployeeDocuments.findOne({ commonid }, { profileimage: 1 });

    if (!semployeedocument) {
        return res.status(200).json({});
    }

    return res.status(200).json({
        success: true,
        semployeedocument
    })
})

// get Single employeeDocument => /api/employeedocumentcommonidwithall
exports.getSingleEmployeeDocumentByCommonidWithAll = catchAsyncErrors(async (req, res, next) => {
    const { commonid } = req.body;
    const semployeedocument = await EmployeeDocuments.findOne({ commonid });

    if (!semployeedocument) {
        return next(new ErrorHandler('EmployeeDocuments not found', 404));
    }

    return res.status(200).json({
        success: true,
        semployeedocument
    })
})

// update employeedocuments by id => /api/employeedocument/:id
exports.updateEmployeeDocument = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id;

    const updateemployeedocument = await EmployeeDocuments.findByIdAndUpdate(id, req.body);

    if (!updateemployeedocument) {
        return next(new ErrorHandler('EmployeeDocuments not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully!' })
})

// delete EmployeeDocument by id => /api/employeedocument/:id
exports.deleteEmployeeDocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const dempdoc = await EmployeeDocuments.findByIdAndRemove(id);

    if (!dempdoc) {
        return next(new ErrorHandler('EmployeeDocuments not found', 404));
    }

    res.status(200).json({ message: 'Deleted successfully' })
})

exports.getAllEmployeeProfile = catchAsyncErrors(async (req, res, next) => {
    let alldocuments;

    try {
        alldocuments = await EmployeeDocuments.find({}, { profileimage: 1, commonid: 1 })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!alldocuments) {
        return next(new ErrorHandler('EmployeeDocuments not found', 400));
    }

    return res.status(200).json({ alldocuments });
})

// get Single employeeDocument => /api/employeedocumentcommonidwithallnew
exports.getSingleEmployeeDocumentByCommonidWithAllnew = catchAsyncErrors(async (req, res, next) => {
    const { commonid } = req.body;
    const semployeedocument = await EmployeeDocuments.findOne({ commonid }, { profileimage: 1, files: 1 });
    if (!semployeedocument) {
        return res.status(200).json({});
    }

    return res.status(200).json({
        success: true,
        semployeedocument
    })
})

//employee documents 
exports.getAllEmployeeDocumentsforidcard = catchAsyncErrors(async (req, res, next) => {
    let alldocuments;

    try {
        alldocuments = await EmployeeDocuments.find({}, { commonid: 1, profileimage: 1, _id: 1 })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!alldocuments) {
        return next(new ErrorHandler('EmployeeDocuments not found', 400));
    }

    return res.status(200).json({ alldocuments });
})