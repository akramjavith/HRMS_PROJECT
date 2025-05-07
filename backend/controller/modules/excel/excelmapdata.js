const Excelmapdata = require('../../../model/modules/excel/excelmapdata');
const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const Category = require('../../../model/modules/setup/category');
const Queue = require('../../../model/modules/setup/queue');
const Excel = require('../../../model/modules/excel/excel');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All excel => /api/excel
exports.getAllExcelmapdata = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas;
    try {
        excelmapdatas = await Excelmapdata.find();

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excel not found!', 404));
    }
    return res.status(200).json({
        excelmapdatas
    });
})

// get All excel => /api/excel
exports.getAllExcelmapdataFiltered = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapdatasLength;

    const pageNum = parseInt(req.body.page);
    const size = parseInt(req.body.pageSize);

    try {
        excelmapdatasLength = await Excelmapdata.countDocuments();
        excelmapdatas = await Excelmapdata.find()
            .skip((pageNum - 1) * size)
            .limit(size);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excel not found!', 404));
    }

    return res.status(200).json({
        excelmapdatas, excelmapdatasLength
    });
})


// Create new excel => /api/excel/new
exports.addExcelmapdata = catchAsyncErrors(async (req, res, next) => {
    let checkproj = await Excelmapdata.findOne({ $and: [{ customer: req.body.customer }, { process: req.body.process }] });
    if (checkproj) {
        return next(new ErrorHandler('Data already exist!', 400));
    }
    let aexcelmapdata = await Excelmapdata.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

    //    let aexcelmapdata = await Excelmapdata.create(req.body)

    //     return res.status(200).json({ 
    //         message: 'Successfully added!' 
    //     });
})

//allotted Queue List Filter Functionality
exports.getAllallotedQueueListFilter = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapdatasLength, totalProjectsd, totalProjects,excelData, result , totLength;
    let { page, pageSize, value } = req.body;
    const skip = (page - 1) * pageSize; // Calculate the number of items to skip
    const limit = pageSize; // The number of items to take
    try {

        totalProjectsd = await Excelmapdata.countDocuments();
        excelData = await Excelmapdata.find().skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))



        excelmapdatasLength = await Excelmapdata.find()
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if (key !== 'headers' && !["page", 'pageSize', 'value'].includes(key)) {
                const value = req.body[key];
                if (value !== '') {
                    query[key] = value.toString();
                }
            }

        });

       

        excelmapdatas = excelmapdatasLength?.filter(item => {
            for (const key in query) {
                if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        })?.slice(skip, skip + limit);

        result = (["cleared"]?.includes(value)  ||  isEmpty(query) ) ? excelData : excelmapdatas
        totLength = (["cleared"]?.includes(value)  ||  isEmpty(query) ) ? totalProjectsd : excelmapdatasLength?.filter(item => {
            for (const key in query) {
                if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        })?.length;


        function isEmpty(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        }

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        // excelmapdatas, excelmapdatasLength

        result,
        totalProjects : totLength,
        currentPage: page,
        totalPages: Math.ceil(totLength / pageSize),
    });
})

// get all linked excelmap and excelmapped person data's
exports.getAllMappedPersnDelete = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas;
    try {
        excelmapdatas = await Excelmaprespersondata.find({ customer: req.body.customer })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excel not found!', 404));
    }
    return res.status(200).json({
        excelmapdatas
    });
})
// get all linked excelmap and excelmapped person data's
exports.getCategoryOverallDelete = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapData, taskcate , result , count;

    let id = req.body.id
    try {

        taskcate = await Category.find()
        const answer = taskcate?.filter(data => id?.includes(data?._id?.toString()))
  
        excelmapData = await Excelmaprespersondata.find();
        excelmapdatas = await Excelmapdata.find();
        const unmatchedCategory = answer.filter(answers => excelmapData.some(sub => sub.project === answers.project && sub?.category === answers.name))?.map(data => data._id?.toString());
        const unmatchedExcelData = answer.filter(answers => excelmapdatas.some(sub => sub.project === answers.project && sub?.category === answers.name))?.map(data => data._id?.toString());

        const duplicateId = [...unmatchedCategory , ...unmatchedExcelData]
        result = id?.filter(data => !duplicateId?.includes(data))
        count = id?.filter(data => !duplicateId?.includes(data))?.length
      

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        result ,count
    });
})




exports.getCategoryReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const categoryies = await Category.find({}, 'name');


        const categoryTotal = {};

        // Step 3: Initialize totals for each branch
        categoryies.forEach((cat) => {
            categoryTotal[cat.name] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const category = item.category;
            const points = parseFloat(item.points);
            const count = parseInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (categoryTotal.hasOwnProperty(category)) {
                categoryTotal[category].totalCount += count;
                categoryTotal[category].totalPoints += points;

                // Update the time variables
                categoryTotal[category].time.hours += hours;
                categoryTotal[category].time.minutes += minutes;
                categoryTotal[category].time.seconds += seconds;
            }
        });

        // Prepare the response
        const categoryTotalArray = Object.keys(categoryTotal).map((categories) => ({
            categories,
            totalCount: categoryTotal[categories].totalCount,
            totalPoints: parseFloat(categoryTotal[categories].totalPoints.toFixed(4)),
            totalTime: `${categoryTotal[categories].time.hours.toString().padStart(2, '0')}:${categoryTotal[categories].time.minutes.toString().padStart(2, '0')}:${categoryTotal[categories].time.seconds.toString().padStart(2, '0')}`

        }));

        return res.status(200).json({
            categoryTotal: categoryTotalArray
        });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});




exports.getQueueReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const queue = await Queue.find({}, 'name');


        const queueTotal = {};

        // Step 3: Initialize totals for each branch
        queue.forEach((cat) => {
            queueTotal[cat.name] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const queue = item.queue;
            const points = parseFloat(item.points);
            const count = parseInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (queueTotal.hasOwnProperty(queue)) {
                queueTotal[queue].totalCount += count;
                queueTotal[queue].totalPoints += points;

                // Update the time variables
                queueTotal[queue].time.hours += hours;
                queueTotal[queue].time.minutes += minutes;
                queueTotal[queue].time.seconds += seconds;
            }
        });

        // Prepare the response
        const queueTotalArray = Object.keys(queueTotal).map((queues) => ({
            queues,
            totalCount: queueTotal[queues].totalCount,
            totalPoints: parseFloat(queueTotal[queues].totalPoints.toFixed(4)),
            totalTime: `${queueTotal[queues].time.hours.toString().padStart(2, '0')}:${queueTotal[queues].time.minutes.toString().padStart(2, '0')}:${queueTotal[queues].time.seconds.toString().padStart(2, '0')}`

        }));

        return res.status(200).json({
            queueTotal: queueTotalArray
        });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});

exports.getCustomerReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const excel = await Excel.find();
        const customer = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

        const customerTotal = {};

        // Step 3: Initialize totals for each branch
        customer.forEach((cat) => {
            customerTotal[cat.customer] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const customer = item.customer;
            const points = parseFloat(item.points);
            const count = parseInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (customerTotal.hasOwnProperty(customer)) {
                customerTotal[customer].totalCount += count;
                customerTotal[customer].totalPoints += points;

                // Update the time variables
                customerTotal[customer].time.hours += hours;
                customerTotal[customer].time.minutes += minutes;
                customerTotal[customer].time.seconds += seconds;
            }
        });

        // Prepare the response
        const customerTotalArray = Object.keys(customerTotal).map((customers) => ({
            customers,
            totalCount: customerTotal[customers].totalCount,
            totalPoints: parseFloat(customerTotal[customers].totalPoints.toFixed(4)),
            totalTime: `${customerTotal[customers].time.hours.toString().padStart(2, '0')}:${customerTotal[customers].time.minutes.toString().padStart(2, '0')}:${customerTotal[customers].time.seconds.toString().padStart(2, '0')}`

        }));
        return res.status(200).json({
            customerTotal: customerTotalArray
        });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});


// get Single excel => /api/excel/:id
exports.getSingleExcelmapdata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sexcelmapdata = await Excelmapdata.findById(id);
    if (!sexcelmapdata) {
        return next(new ErrorHandler('Excelmapdata not found!', 404));
    }
    return res.status(200).json({
        sexcelmapdata
    })
})


exports.getoverallallottedqueue = catchAsyncErrors(async (req, res, next) => {
    let category, subcategory, queue;
    try {
        category = await Excelmaprespersondata.find({
            customer: req.body.oldnamecustomer,
            process: req.body.oldnameprocess,
        })
        subcategory = await Excelmaprespersondata.find({
            customer: req.body.oldnamecustomer,
            process: req.body.oldnameprocess
        })
        queue = await Excelmaprespersondata.find({
            customer: req.body.oldnamecustomer,
            process: req.body.oldnameprocess
        })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        categorycount: category.length,
        subcategorycount: subcategory.length,
        queuecount: queue.length,
        category, subcategory, queue
    });
})

// get overall delete functionlity 
exports.getAllQueueCheck = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas;
    try {
        let query = {

            time: req.body.checkqueuetime,
            points: req.body.checkqueuepoints,
            project: req.body.checkqueueproject,
            category: req.body.checkqueuecategory,
        };
        excelmapdatas = await Excelmapdata.find(query, {
            project: 1,
            category: 1,
            time: 1,
            points: 1,
            _id: 1,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excelmapdata not found!', 404));
    }
    return res.status(200).json({
        excelmapdatas
    });
})

// get All excel => /api/excel
exports.getOverallBulkEditList = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapData, filtered, resultData;
    let selectedid = req.body.selectedId
    try {
        excelmapdatas = await Excelmapdata.find();
        filterexcel = excelmapdatas.filter((data) => (selectedid).includes(data._id.toString()));
        excelmapData = await Excelmaprespersondata.find();
        resultData = excelmapData?.filter((item2) =>
            filterexcel.some((item1) => item1.customer === item2.customer && item1.process === item2.process));
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excel not found!', 404));
    }
    return res.status(200).json({
        resultData, count: resultData.length
    });
})

exports.getOverallBulkDeleteList = catchAsyncErrors(async (req, res, next) => {
    let excelmapdatas, excelmapDataPerson, filterexcel, notmatcheddata, matcheddata, resultDataDelete;
    let selectedid = req.body.selectedId
    try {
        excelmapdatas = await Excelmapdata.find();
        excelmapDataPerson = await Excelmaprespersondata.find();
        filterexcel = excelmapdatas.filter((data) => (selectedid).includes(data._id.toString()));
        // Find matching records in mappeddata based on customer and process
        resultDataDelete = filterexcel.filter((item) => {
            return excelmapDataPerson.some(
                (mappedItem) =>
                    mappedItem.customer === item.customer && mappedItem.process === item.process
            );
        });
        // Find IDs in selectedRows that do not have a match in data
        notmatcheddata = selectedid.filter((selectedId) => {
            return !resultDataDelete.some((item) => item._id == selectedId);
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmapdatas) {
        return next(new ErrorHandler('excel not found!', 404));
    }
    return res.status(200).json({
        resultDataDelete, notmatcheddata
    });
})



// update excel by id => /api/excel/:id
exports.updateExcelmapdata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uexcelmapdata = await Excelmapdata.findByIdAndUpdate(id, req.body);

    if (!uexcelmapdata) {
        return next(new ErrorHandler('Excel not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})



// delete excel by id => /api/excel/:id
exports.deleteExcelmapdata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dexcelmapdata = await Excelmapdata.findByIdAndRemove(id);

    if (!dexcelmapdata) {
        return next(new ErrorHandler('Excel not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})
