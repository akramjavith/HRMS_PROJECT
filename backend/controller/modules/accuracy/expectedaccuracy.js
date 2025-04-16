const ExpectedAccuracy = require('../../../model/modules/accuracy/expectedaccuracy');
const Category = require('../../../model/modules/setup/category');
const Subcategory = require('../../../model/modules/setup/subcategory');
const Timepoints = require('../../../model/modules/setup/timepoints');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');

 
// get All expectedaccuracy => /api/expectedaccuracy
exports.getAllExpectedAccuracy = catchAsyncErrors(async (req, res, next) => {
    let expectedaccuracy;
    try {
        expectedaccuracy = await ExpectedAccuracy.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!expectedaccuracy) {
        return next(new ErrorHandler('Expected accuracy not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        expectedaccuracy
    });
})

exports.addExpectedAccuracy = catchAsyncErrors(async (req, res, next) => {
    try {
        const { project, mode,queue, statusmode, expectedaccuracyfrom, expectedaccuracyto } = req.body;

        const existingRecords = await ExpectedAccuracy.find({
            project,
            queue,
            mode,
            // statusmode,
            $or: [
                {
                    $and: [
                        { expectedaccuracyfrom: { $lte: expectedaccuracyto } },
                        { expectedaccuracyto: { $gte: expectedaccuracyfrom } }
                    ]
                },
                {
                    $and: [
                        { expectedaccuracyfrom: { $gte: expectedaccuracyfrom } },
                        { expectedaccuracyto: { $lte: expectedaccuracyto } }
                    ]
                }
            ]
        });

        // if (existingRecords.length > 0) {
        //     const duplicateSubcategories = existingRecords.some(record => {
        //         return record.subcategory.some(existingSubcategory => subcategory.includes(existingSubcategory));
        //     });

        //     if (duplicateSubcategories) {
        //         // If any subcategory already exists, return a duplicate error
        //         return res.status(400).json({
        //             message: 'This Data Already Exists!'
        //         });
        //     }
        // }
        if (existingRecords.length > 0) {
            
            return res.status(400).json({
                message: 'This Data Already Exist!'
            });
        }

        const newRecord = await ExpectedAccuracy.create(req.body);

        return res.status(200).json({
            message: 'Successfully added!',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

exports.getOverallExpectedAccuracySort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects , result , totalPages , currentPage;
  
    const {frequency, page, pageSize } = req.body;
    try {
  
      totalProjects =  await ExpectedAccuracy.countDocuments();
  
  
      result = await ExpectedAccuracy.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));
  
  
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
       totalProjects,
      result,
      currentPage:  page ,
      totalPages: Math.ceil( totalProjects / pageSize),
    });
  });
  




// get Signle expectedaccuracy => /api/expectedaccuracy/:id
exports.getSingleExpectedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sexpectedaccuracy = await ExpectedAccuracy.findById(id);

    if (!sexpectedaccuracy) {
        return next(new ErrorHandler('ExpectedAccuracy not found!', 404));
    }
    return res.status(200).json({
        sexpectedaccuracy
    })
})

// update expectedaccuracy by id => /api/expectedaccuracy/:id
exports.updateExpectedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    try {
        const { project, queue, mode, statusmode, expectedaccuracyfrom, expectedaccuracyto } = req.body;

        const existingRecords = await ExpectedAccuracy.find({
            _id: { $ne: id },
            project,
            queue,
            mode,
            // statusmode,
            $or: [
                {
                    $and: [
                        { expectedaccuracyfrom: { $lte: expectedaccuracyto } },
                        { expectedaccuracyto: { $gte: expectedaccuracyfrom } }
                    ]
                },
                {
                    $and: [
                        { expectedaccuracyfrom: { $gte: expectedaccuracyfrom } },
                        { expectedaccuracyto: { $lte: expectedaccuracyto } }
                    ]
                }
            ]
        });


        if (existingRecords.length > 0) {
            
            return res.status(400).json({
                message: 'This Data Already Exist!'
            });
        }

        // If no existing records or no duplicate subcategory found, create a new record
        let uexpectedaccuracy = await ExpectedAccuracy.findByIdAndUpdate(id, req.body);
        if (!uexpectedaccuracy) {
            return next(new ErrorHandler('ExpectedAccuracy not found!', 404));
        }

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

    // let uaccuracymaster = await ExpectedAccuracy.findByIdAndUpdate(id, req.body);

    // if (!uaccuracymaster) {
    //     return next(new ErrorHandler('ExpectedAccuracy not found!', 404));
    // }
    // return res.status(200).json({ message: 'Updated successfully' });
})

// delete accuracymaster by id => /api/accuracymaster/:id
exports.deleteExpectedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dexpectedaccuracy = await ExpectedAccuracy.findByIdAndRemove(id);

    if (!dexpectedaccuracy) {
        return next(new ErrorHandler('ExpectedAccuracy not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

// exports.getoverallvendormasteredit = catchAsyncErrors(async (req, res, next) => {
//     let excelmapdata, excelmapresperson;
//     try {

//         excelmapdata = await Excelmapdata.find({ vendor: req.body.oldname })
//         excelmapresperson = await Excelmaprespersondata.find({ vendor: req.body.oldname })
//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }

//     return res.status(200).json({
//         count: excelmapdata.length + excelmapresperson.length,
//         excelmapdata, excelmapresperson
//     });
// })