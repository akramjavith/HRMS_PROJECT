const Deptmonthsetauto = require("../../model/modules/departmentmonthsetauto");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All Deptmonthsetauto Details => /api/Departments

exports.getAllDeptmonthsetauto = catchAsyncErrors(async (req, res, next) => {
    let deptmonthsetauto;

    try {
        deptmonthsetauto = await Deptmonthsetauto.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!deptmonthsetauto) {
        return next(new ErrorHandler("Deptmonthsetauto details not found", 404));
    }

    return res.status(200).json({
        deptmonthsetauto,
    });
});

// Create new Deptmonthsetauto => /api/department/new
exports.addDeptmonthsetauto = catchAsyncErrors(async (req, res, next) => {
    let adeptmonthsetauto = await Deptmonthsetauto.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle Deptmonthsetauto => /api/department/:id

exports.getSingleDeptmonthsetauto = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sdeptmonthsetauto = await Deptmonthsetauto.findById(id);

    if (!sdeptmonthsetauto) {
        return next(new ErrorHandler("Deptmonthsetauto not found", 404));
    }

    return res.status(200).json({
        sdeptmonthsetauto,
    });
});

// update Deptmonthsetauto by id => /api/customer/:id

exports.updateDeptmonthsetauto = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let updeptmonthsetauto = await Deptmonthsetauto.findByIdAndUpdate(id, req.body);

    if (!updeptmonthsetauto) {
        return next(new ErrorHandler("Deptmonthsetauto Details not found", 404));
    }

    return res.status(200).json({ message: "Updates successfully" });
});
exports.deleteDeptmonthsetauto = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddeptmonthsetauto = await Deptmonthsetauto.findByIdAndRemove(id);
    if (!ddeptmonthsetauto) {
        return next(new ErrorHandler("Deptmonthsetauto Month Set not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllDepMonthAutoByPagination = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, searchQuery } = req.body;

    let deptmonthsetauto;
    let totalDatas, paginatedData, isEmptyData, result;

    try {
        const anse = await Deptmonthsetauto.find()
        const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
        const filteredDatas = anse?.filter((item, index) => {
            const itemString = JSON.stringify(item)?.toLowerCase();
            return searchOverTerms.every((term) => itemString.includes(term));
        })
        isEmptyData = searchOverTerms?.every(item => item.trim() === '');
        const pageSized = parseInt(pageSize);
        const pageNumberd = parseInt(page);

        paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

        totalDatas = await Deptmonthsetauto.countDocuments();
        deptmonthsetauto = await Deptmonthsetauto.find().skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        result = isEmptyData ? deptmonthsetauto : paginatedData
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!deptmonthsetauto) {
        return next(new ErrorHandler("Deptmonthsetauto details not found", 404));
    }

    return res.status(200).json({
        deptmonthsetauto,
        totalDatas,
        paginatedData,
        result,
        currentPage: (isEmptyData ? page : 1),
        totalPages: Math.ceil((isEmptyData ? totalDatas : paginatedData?.length) / pageSize),
    });
});