const Checklisttype = require('../../../model/modules/interview/checklisttype');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Checklisttype =>/api/Checklisttype
exports.getAllChecklisttype = catchAsyncErrors(async (req, res, next) => {
    let checklisttypes;
    try {
        checklisttypes = await Checklisttype.find({})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checklisttypes) {
        return next(new ErrorHandler('Checklisttype not found!', 404));
    }
    return res.status(200).json({
        checklisttypes
    });
})

exports.getAllChecklistByPagination = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, searchQuery } = req.body;

  let checklisttypes;
  let totalDatas, paginatedData, isEmptyData, result;

  try {
    const anse = await Checklisttype.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

    totalDatas = await Checklisttype.countDocuments();
    checklisttypes = await Checklisttype.find().skip((page - 1) * pageSize)
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



//create new Checklisttype => /api/Checklisttype/new
exports.addChecklisttype = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aChecklisttype = await Checklisttype.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Checklisttype => /api/Checklisttype/:id
exports.getSingleChecklisttype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let schecklisttype = await Checklisttype.findById(id);
    if (!schecklisttype) {
        return next(new ErrorHandler('Checklisttype not found', 404));
    }
    return res.status(200).json({
        schecklisttype
    })
})

//update Checklisttype by id => /api/Checklisttype/:id
exports.updateChecklisttype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uchecklisttype = await Checklisttype.findByIdAndUpdate(id, req.body);
    if (!uchecklisttype) {
        return next(new ErrorHandler('Checklisttype not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Checklisttype by id => /api/Checklisttype/:id
exports.deleteChecklisttype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dchecklisttype = await Checklisttype.findByIdAndRemove(id);
    if (!dchecklisttype) {
        return next(new ErrorHandler('Checklisttype not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getAllChecklistNotAssignedByPagination = catchAsyncErrors(async (req, res, next) => {

    let checklisttypes;

    try {
        checklisttypes = await Checklisttype.aggregate([
            {
                $lookup: {
                    from: 'checklistverificationmasters',
                    let: {
                        currentCategory: "$category",
                        currentSubcategory: "$subcategory",
                        currentChecklist: "$details"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$categoryname", "$$currentCategory"] },
                                        { $eq: ["$subcategoryname", "$$currentSubcategory"] },
                                        { $in: ["$$currentChecklist", "$checklisttype"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'result'
                }
            },
            {
                $addFields: {
                    hasResult: { $gt: [{ $size: "$result" }, 0] } // Add 'hasResult' field
                }
            },
            {
                $match: {
                    hasResult: false // Filter for documents where result array is empty
                }
            }
        ]);

        console.log(checklisttypes.length)



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!checklisttypes) {
        return next(new ErrorHandler("Checklists not found", 404));
    }

    return res.status(200).json({
        checklisttypes,

    });
})
