const ChecklistModuleSelection = require('../../../model/modules/interview/checklistmoduleselection');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All ChecklistModuleSelection =>/api/ChecklistModuleSelection
exports.getAllChecklistModule = catchAsyncErrors(async (req, res, next) => {
    let checklisttypes;
    try {
        checklisttypes = await ChecklistModuleSelection.find({})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checklisttypes) {
        return next(new ErrorHandler('ChecklistModuleSelection not found!', 404));
    }
    return res.status(200).json({
        checklisttypes
    });
})

exports.getAllChecklistModuleByPagination = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, searchQuery } = req.body;

    let checklisttypes;
    let totalDatas, paginatedData, isEmptyData, result;

    try {
        const anse = await ChecklistModuleSelection.find()
        const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
        const filteredDatas = anse?.filter((item, index) => {
            const itemString = JSON.stringify(item)?.toLowerCase();
            return searchOverTerms.every((term) => itemString.includes(term));
        })
        isEmptyData = searchOverTerms?.every(item => item.trim() === '');
        const pageSized = parseInt(pageSize);
        const pageNumberd = parseInt(page);

        paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

        totalDatas = await ChecklistModuleSelection.countDocuments();
        checklisttypes = await ChecklistModuleSelection.find().skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        result = isEmptyData ? checklisttypes : paginatedData
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!checklisttypes) {
        return next(new ErrorHandler("Checklists not found", 404));
    }

    return res.status(200).json({
        checklisttypes,
        totalDatas,
        paginatedData,
        result,
        currentPage: (isEmptyData ? page : 1),
        totalPages: Math.ceil((isEmptyData ? totalDatas : paginatedData?.length) / pageSize),
    });
})

//create new ChecklistModuleSelection => /api/ChecklistModuleSelection/new
exports.addChecklistModule = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    let aChecklisttype = await ChecklistModuleSelection.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single ChecklistModuleSelection => /api/ChecklistModuleSelection/:id
exports.getSingleChecklistModule = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let schecklisttype = await ChecklistModuleSelection.findById(id);
    if (!schecklisttype) {
        return next(new ErrorHandler('ChecklistModuleSelection not found', 404));
    }
    return res.status(200).json({
        schecklisttype
    })
})

//update ChecklistModuleSelection by id => /api/ChecklistModuleSelection/:id
exports.updateChecklistModule = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uchecklisttype = await ChecklistModuleSelection.findByIdAndUpdate(id, req.body);
    if (!uchecklisttype) {
        return next(new ErrorHandler('ChecklistModuleSelection not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete ChecklistModuleSelection by id => /api/ChecklistModuleSelection/:id
exports.deleteChecklistModule = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dchecklisttype = await ChecklistModuleSelection.findByIdAndRemove(id);
    if (!dchecklisttype) {
        return next(new ErrorHandler('ChecklistModuleSelection not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})