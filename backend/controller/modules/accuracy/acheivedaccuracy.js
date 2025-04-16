const AcheivedAccuracy = require('../../../model/modules/accuracy/acheivedaccuracy');
const ExpectedAccuracy = require('../../../model/modules/accuracy/expectedaccuracy');
const Category = require('../../../model/modules/setup/category');
const Subcategory = require('../../../model/modules/setup/subcategory');
const Timepoints = require('../../../model/modules/setup/timepoints');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');



exports.getOverallAchivedAccuracySort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, searchQuery } = req.body;

    let allusers;
    let totalProjects, paginatedData, isEmptyData, result;

    try {
        // const query = searchQuery ? { companyname: { $regex: searchQuery, $options: 'i' } } : {};
        const anse = await AcheivedAccuracy.find()
        const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
        const filteredDatas = anse?.filter((item, index) => {
            const itemString = JSON.stringify(item)?.toLowerCase();
            return searchOverTerms.every((term) => itemString.includes(term));
        })
        isEmptyData = searchOverTerms?.every(item => item.trim() === '');
        const pageSized = parseInt(pageSize);
        const pageNumberd = parseInt(page);

        paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

   

        totalProjects = await AcheivedAccuracy.countDocuments();

        allusers = await AcheivedAccuracy.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        result = isEmptyData ? allusers : paginatedData

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // return res.status(200).json({ count: allusers.length, allusers });
    return res.status(200).json({
        allusers,
        totalProjects,
        paginatedData,
        result,
        currentPage: (isEmptyData ? page : 1),
        totalPages: Math.ceil((isEmptyData ? totalProjects : paginatedData?.length) / pageSize),
    });
});
 

// get All acheivedaccuracy => /api/acheivedaccuracy
exports.getAllAcheivedAccuracy = catchAsyncErrors(async (req, res, next) => {
    let acheivedaccuracy;
    try {
        acheivedaccuracy = await AcheivedAccuracy.find()
    } catch (err) {
        // return next(new ErrorHandler("Records not found!", 404));
    }
    if (!acheivedaccuracy) {
        return next(new ErrorHandler('Expected accuracy not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        acheivedaccuracy
    });
})


exports.addAcheivedAccuracy = catchAsyncErrors(async (req, res, next) => {
    try {
        const { project, vendor, queue,date,clientstatus,internalstatus } = req.body;
        
        const existingRecords = await AcheivedAccuracy.find({ 
            project, 
            vendor, 
            queue, 
            date,
            clientstatus,
            internalstatus
            
        });


        if (existingRecords.length > 0) {
            return res.status(400).json({
                message: 'This Data is Already Exists!'
            });
        }

        const newRecord = await AcheivedAccuracy.create(req.body);

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

exports.getOverallAchivedAccuracySort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects , result , totalPages , currentPage;
  
    const {frequency, page, pageSize } = req.body;
    try {
  
      totalProjects =  await AcheivedAccuracy.countDocuments();
  
  
      result = await AcheivedAccuracy.find()
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

// get Single acheivedaccuracy => /api/acheivedaccuracy/:id
exports.getSingleAcheivedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sacheivedaccuracy = await AcheivedAccuracy.findById(id);

    if (!sacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracy not found!', 404));
    }
    return res.status(200).json({
        sacheivedaccuracy
    })
})

// get Single expectedaccuracy => /api/expectedaccuracy/single
exports.getSingleExpectedAccuracyByDetails = catchAsyncErrors(async (req, res, next) => {
    // const id = req.params.id;
    
    const { project,queue,acheivedaccuracy } = req.body;

    let existinglist = await ExpectedAccuracy.find({
        project,queue,$and: [
            { expectedaccuracyfrom: { $lte: acheivedaccuracy } }, 
            { expectedaccuracyto: { $gte: acheivedaccuracy } }
        ]
    });

    if (existinglist.length >0){
        return res.status(200).json({
            existinglist
        })
     
        }
        
    else {
        return next(new ErrorHandler('Data not found!', 404));
    }

    // if (!sacheivedaccuracy) {
    //     return next(new ErrorHandler('AcheivedAccuracy not found!', 404));
    // }
    // return res.status(200).json({
    //     sacheivedaccuracy
    // })
})

// get Single achievedaccuracy => /api/achievedaccuracy/single
exports.getSingleAchivedAccuracyByDetails = catchAsyncErrors(async (req, res, next) => {
    // const id = req.params.id;
    
    const { project, queue,expectedaccuracyfrom,expectedaccuracyto } = req.body;

    let existinglist = await AcheivedAccuracy.find({
        project,queue,$and: [
            { acheivedaccuracy: { $lte: expectedaccuracyto } }, 
            { acheivedaccuracy: { $gte: expectedaccuracyfrom } }
        ]
    });

    if (existinglist.length >0){

        return res.status(200).json({
            existinglist
        });
    }

       
        
    else {
        return next(new ErrorHandler('Data not found!', 404));
    }

})


// update acheivedaccuracy by id => /api/acheivedaccuracy/:id
exports.updateAcheivedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    try {
        const { project, vendor, queue, acheivedaccuracy,date } = req.body;

        const existingRecords = await AcheivedAccuracy.find({ 
            project, 
            vendor, 
            queue, 
            date, 
            acheivedaccuracy,
            _id: { $ne: id }
            
        });

       
        if (existingRecords.length > 0) {
            return res.status(400).json({
                message: 'This Data is Already Exists!'
            });
        }

        // If no existing records or no duplicate subcategory found, create a new record
        let uacheivedaccuracy = await AcheivedAccuracy.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracy not found!', 404));
        }

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

})

// update acheivedaccuracy by id => /api/acheivedaccuracy/:id
exports.updateAcheivedAccuracyById = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    try {
        // If no existing records or no duplicate subcategory found, create a new record
        let uacheivedaccuracy = await AcheivedAccuracy.findByIdAndUpdate(id, req.body);
        if (!uacheivedaccuracy) {
            return next(new ErrorHandler('AcheivedAccuracy not found!', 404));
        }

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

})

// delete acheivedaccuracy by id => /api/acheivedaccuracy/:id
exports.deleteAcheivedAccuracy = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dacheivedaccuracy = await AcheivedAccuracy.findByIdAndRemove(id);

    if (!dacheivedaccuracy) {
        return next(new ErrorHandler('AcheivedAccuracy not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

