const ProductionUpload = require("../../../model/modules/production/productionupload");
const ProductionTempUpload = require("../../../model/modules/production/productiontempuploadall");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const ProducionIndividual = require("../../../model/modules/production/productionindividual")
const Users = require("../../../model/login/auth")
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const { startOfDay, endOfDay } = require('date-fns');
const moment = require('moment');
const Unitrate = require("../../../model/modules/production/productionunitrate");
const Categoryprods = require("../../../model/modules/production/categoryprodmodel");

//production original mismatch filter /api/originalmismatchfilter
exports.getOriginalMismatchFilteredData = catchAsyncErrors(async (req, res, next) => {
   
    let filteredDatas;

    // Destructuring req.body with default values
    const { category = '', subcategory = '', projectvendor = '', employee = '', user = '', identifier = '', date = '', fromTime = '', toTime = '' } = req.body; 	

   
    const allEmpty = !category && !subcategory && !projectvendor  && !identifier && !user && !date && !fromTime && !toTime;
    // Constructing the query
    
    if (allEmpty) {
        filteredDatas = await ProductionUpload.find({});
        return res.status(200).json({
            lenth: filteredDatas.length, filteredDatas,
        });
    }
    const filter = {};
  
    // // Adding conditions to the query if search parameters are not empty
    // if (category) query.filename = { $regex: `${category}.*`, $options: 'i' };
    // if (subcategory) query.category = { $regex: subcategory, $options: 'i' };
    // if (projectvendor) query.vendor = { $regex: projectvendor, $options: 'i' };
    // // if (employee) query.employee = { $regex: employee, $options: 'i' };
    // if (user) query.user = { $regex: user, $options: 'i' };
    // if (identifier) query.unitid = { $regex: identifier, $options: 'i' };
    // // if (date) {

    // //     query.dateval = { $regex: `^${date}`, $options: 'i' };
    // // }

    if (category != "") {
        filter.filename = { $in: [`${category}.xlsx`, `${category}.xlx`]};
    }
    
    if (subcategory != "") {
        filter.category = { $eq: subcategory };
    }
    
    if (projectvendor != "") {
        filter.vendor = { $eq: projectvendor };
    }
    
    if (employee != "") {
        filter.user = { $in: employee };
    }
    
    if (user != "") {
        filter.user = { $eq: user };
    }
    
    if (identifier != "") {
        filter.unitid = { $eq: identifier };
    }

    

    if (fromTime || toTime) {
        const timeQuery = {};
        if (date && fromTime) {
            const [fromHour, fromMinute] = fromTime.split(':').map(Number);
            if (!isNaN(fromHour) && !isNaN(fromMinute) && fromHour >= 0 && fromHour <= 23 && fromMinute >= 0 && fromMinute <= 59) {
                timeQuery.$gte = new Date(`${date}T${fromTime}:00`);
            } else {
                return next(new ErrorHandler("Invalid fromTime format!", 400));
            }
        }
        if (date && toTime) {
            const [toHour, toMinute] = toTime.split(':').map(Number);
            if (!isNaN(toHour) && !isNaN(toMinute) && toHour >= 0 && toHour <= 23 && toMinute >= 0 && toMinute <= 59) {
                timeQuery.$lte = new Date(`${date}T${toTime}:59`);
            } else {
                return next(new ErrorHandler("Invalid toTime format!", 400));
            }
        }
        if (Object.keys(timeQuery).length > 0) {
            filter.dateval = timeQuery;
        }
    }

    try {
        // Performing the query
        filteredDatas = await ProductionUpload.find(filter,{filename:1,vendor:1, category:1, user:1, unitid:1, unitrate:1, flagcount:1, dateval:1});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
        return next(new ErrorHandler("Internal Server Error", 500));
    }

    // Checking if any data found
    if (!filteredDatas ) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    // Sending the response
    return res.status(200).json({
        lenth: filteredDatas.length, filteredDatas,
    });
});


//production original mismatch filter /api/originalmismatchfilter/updateflagcount
exports.getUpdateFlagCount = catchAsyncErrors(async (req, res, next) => {
    try {
        const { ids, newFlagCount } = req.body;

        // Retrieve documents based on IDs
        const documents = await ProductionUpload.find({ _id: { $in: ids } });

        // Update flag count for each document
        documents.forEach(doc => {
            if (doc.flagcount) {
                doc.originalflagcount = doc.flagcount; // Move existing flag count to originalFlagCount
            }
            doc.flagcount = newFlagCount; // Set new flag count
        });

        // Save the updated documents
        await Promise.all(documents.map(doc => doc.save()));

        res.status(200).json({ message: 'Flag count updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

);


exports.getOriginalUnmatchedData = catchAsyncErrors(async (req, res, next) => {
  const page = req.body.page || 1; // Default to page 1 if not specified
  const pageSize = req.body.pageSize || 10000; // Default page size to 10 if not specified

  let filteredDatas = [];
  let totalCount = 0;
  let totalPages = 0;

  try {
    // Build the filter object
    const filter = {
      dateval: new RegExp("^" + req.body.date),
      unitrate: { $exists: true, $ne: 0 },
      flagcount: { $exists: true, $gt: 0 },
      vendor: new RegExp("^" + req.body.project),
    };


      totalCount = await ProductionUpload.countDocuments(filter);
      totalPages = Math.ceil(totalCount / pageSize);
 
    // Perform the query with pagination
    filteredDatas = await ProductionUpload.find(filter)
      .select('category filename dateval vendor unitrate unitid flagcount section updatedunitrate updatedflag updatedsection') 
      .skip((page - 1) * pageSize) // Skip documents based on page number
      .limit(pageSize); // Limit number of documents per page
  
    return res.status(200).json({
      filteredDatas: filteredDatas,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});



exports.getOriginalUnmatchedDataCountCheck = catchAsyncErrors(async (req, res, next) => {


  let count = [];


  try {
    // Build the filter object
    const filter = {
      dateval: new RegExp("^" + req.body.date),
      unitrate: { $exists: true, $ne: 0 },
      flagcount: { $exists: true, $gt: 0 },
      vendor: new RegExp("^" + req.body.project),
    };


    count = await ProductionUpload.countDocuments(filter);

    return res.status(200).json({
      count: count,
      // totalCount: totalCount,
      // totalPages: totalPages,
      // currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});




//production Temp mismatch filter /api/originalmismatchfilter
exports.getTempMismatchFilteredData = catchAsyncErrors(async (req, res, next) => {
   
    let filteredDatas;

    // Destructuring req.body with default values
    const { category = '', subcategory = '', projectvendor = '', employee = '', user = '', identifier = '', date = '', fromTime = '', toTime = '' } = req.body;


    const allEmpty = !category && !subcategory && !projectvendor  && !identifier && !user && !date && !fromTime && !toTime;
    // Constructing the query

    if (allEmpty) {
        filteredDatas = await ProductionTempUpload.find({});
        return res.status(200).json({
            lenth: filteredDatas.length, filteredDatas,
        });
    }
    const query = {};

    // Adding conditions to the query if search parameters are not empty
    if (category) query.filename = { $regex: `${category}.*`, $options: 'i' };
    if (subcategory) query.category = { $regex: subcategory, $options: 'i' };
    if (projectvendor) query.vendor = { $regex: projectvendor, $options: 'i' };
    // if (employee) query.employee = { $regex: employee, $options: 'i' };
    if (user) query.user = { $regex: user, $options: 'i' };
    if (identifier) query.unitid = { $regex: identifier, $options: 'i' };
    if (date) {

        query.dateval = { $regex: `^${date}`, $options: 'i' };
    }
    // Constructing the time range query
    if (fromTime || toTime) {
        const timeQuery = {};
        if (date && fromTime) {
            const [fromHour, fromMinute] = fromTime.split(':').map(Number);
            if (!isNaN(fromHour) && !isNaN(fromMinute) && fromHour >= 0 && fromHour <= 23 && fromMinute >= 0 && fromMinute <= 59) {
                timeQuery.$gte = new Date(`${date}T${fromTime}:00`);
            } else {
                return next(new ErrorHandler("Invalid fromTime format!", 400));
            }
        }
        if (date && toTime) {
            const [toHour, toMinute] = toTime.split(':').map(Number);
            if (!isNaN(toHour) && !isNaN(toMinute) && toHour >= 0 && toHour <= 23 && toMinute >= 0 && toMinute <= 59) {
                timeQuery.$lte = new Date(`${date}T${toTime}:59`);
            } else {
                return next(new ErrorHandler("Invalid toTime format!", 400));
            }
        }
        if (Object.keys(timeQuery).length > 0) {
            query.dateval = timeQuery;
        }
    }


    try {
        // Performing the query
        filteredDatas = await ProductionTempUpload.find(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
        return next(new ErrorHandler("Internal Server Error", 500));
    }

    // Checking if any data found
    if (!filteredDatas || filteredDatas.length === 0) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    // Sending the response
    return res.status(200).json({
        lenth: filteredDatas.length, filteredDatas,
    });
});


//production original mismatch filter /api/originalmismatchfilter/updateflagcount
exports.getUpdateTempFlagCount = catchAsyncErrors(async (req, res, next) => {
    try {
        const { ids, newFlagCount } = req.body;

        // Retrieve documents based on IDs
        const documents = await ProductionTempUpload.find({ _id: { $in: ids } });

        // Update flag count for each document
        documents.forEach(doc => {
            if (doc.flagcount) {
                doc.originalflagcount = doc.flagcount; // Move existing flag count to originalFlagCount
            }
            doc.flagcount = newFlagCount; // Set new flag count
        });

        // Save the updated documents
        await Promise.all(documents.map(doc => doc.save()));

        res.status(200).json({ message: 'Flag count updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

);


exports.getTempUnmatchedData = catchAsyncErrors(async (req, res, next) => {
    let filteredDatas;
    const { project = '', date = '' } = req.body;

    const allEmpty = !project;
    const query = {};

    if (allEmpty && !date) {

        try {
            const getDatas = await Unitrate.aggregate([
                {
                    $match: {
                        $expr: {
                            $ne: ["$orate", "$mrate"]
                        }
                    }
                }
            ]);

            const categories = getDatas.map(item => item.category);
            const subcategories = getDatas.map(item => item.subcategory);
            const projectsFromData = getDatas.map(item => item.project);

            if (categories.length > 0) query.filename = { $in: categories.map(cat => new RegExp(`^${cat}`, 'i')) };
            if (subcategories.length > 0) query.category = { $in: subcategories.map(sub => new RegExp(`^${sub}`, 'i')) };
            if (projectsFromData.length > 0) {
                const regexPatterns = projectsFromData.map(proj => new RegExp(`^${proj}`, 'i'));
                query.vendor = { $in: regexPatterns };
            }

            filteredDatas = await ProductionTempUpload.find(query);
        } catch (err) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }

        return res.status(200).json({
            length: filteredDatas.length,
            filteredDatas,
        });
    } else if (allEmpty && date) {

        try {
            const getDatas = await Unitrate.aggregate([
                {
                    $match: {
                        $expr: {
                            $ne: ["$orate", "$mrate"]
                        }
                    }
                }
            ]);

            const categories = getDatas.map(item => item.category);
            const subcategories = getDatas.map(item => item.subcategory);
            const projectsFromData = getDatas.map(item => item.project);

            if (categories.length > 0) query.filename = { $in: categories.map(cat => new RegExp(`^${cat}`, 'i')) };
            if (subcategories.length > 0) query.category = { $in: subcategories.map(sub => new RegExp(`^${sub}`, 'i')) };
            if (projectsFromData.length > 0) {
                const regexPatterns = projectsFromData.map(proj => new RegExp(`^${proj}`, 'i'));
                query.vendor = { $in: regexPatterns };
            }
            if (date) {

                query.dateval = { $regex: `^${date}`, $options: 'i' };
            }

            filteredDatas = await ProductionTempUpload.find(query);
        } catch (err) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }

        return res.status(200).json({
            length: filteredDatas.length,
            filteredDatas,
        });
    } else if (project && !date) {

        try {
            const getDatas = await Unitrate.aggregate([
                {
                    $match: {
                        $expr: {
                            $ne: ["$orate", "$mrate"]
                        }
                    }
                },
                {
                    $match: {
                        project: project
                    }
                }
            ]);



            const categories = getDatas.map(item => item.category);
            const subcategories = getDatas.map(item => item.subcategory);
            const projectsFromData = getDatas.map(item => item.project);


            if (categories.length > 0) query.filename = { $in: categories.map(cat => new RegExp(`^${cat}`, 'i')) };
            if (subcategories.length > 0) query.category = { $in: subcategories.map(sub => new RegExp(`^${sub}`, 'i')) };
            if (projectsFromData.length > 0) {
                const regexPatterns = projectsFromData.map(proj => new RegExp(`^${proj}`, 'i'));
                query.vendor = { $in: regexPatterns };
            }



            filteredDatas = await ProductionTempUpload.find(query);
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }
        return res.status(200).json({
            length: filteredDatas.length,
            filteredDatas,
        });
    }
    else if (project && date) {

        try {
            const getDatas = await Unitrate.aggregate([
                {
                    $match: {
                        $expr: {
                            $ne: ["$orate", "$mrate"]
                        }
                    }
                },
                {
                    $match: {
                        project: project
                    }
                }
            ]);



            const categories = getDatas.map(item => item.category);
            const subcategories = getDatas.map(item => item.subcategory);
            const projectsFromData = getDatas.map(item => item.project);

            if (categories.length > 0) query.filename = { $in: categories.map(cat => new RegExp(`^${cat}`, 'i')) };
            if (subcategories.length > 0) query.category = { $in: subcategories.map(sub => new RegExp(`^${sub}`, 'i')) };
            if (projectsFromData.length > 0) {
                const regexPatterns = projectsFromData.map(proj => new RegExp(`^${proj}`, 'i'));
                query.vendor = { $in: regexPatterns };
            }
            if (date) {

                query.dateval = { $regex: `^${date}`, $options: 'i' };
            }


            filteredDatas = await ProductionTempUpload.find(query);
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }
        return res.status(200).json({
            length: filteredDatas.length,
            filteredDatas,
        });
    }


});



