const ProductionUpload = require("../../../model/modules/production/othertaskoriginalupload");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const ProducionIndividual = require("../../../model/modules/production/productionindividual")
const Users = require("../../../model/login/auth")
const Attendances = require("../../../model/modules/attendance/attendance");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Shift = require("../../../model/modules/shift");
const Unitrate = require("../../../model/modules/production/productionunitrate");
const Categoryprod = require("../../../model/modules/production/categoryprodmodel");
const subCategoryprod = require("../../../model/modules/production/subcategoryprodmodel");
const AttendanceControlCriteria = require("../../../model/modules/settings/Attendancecontrolcriteria");
const fs = require("fs");
const path = require("path");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const moment = require("moment");

// get All ProductionUpload => /api/productionuploads
exports.getAllProductionUploadOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {
        productionupload = await ProductionUpload.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});

// get All ProductionUpload => /api/productionuploads
exports.productionUploadOverAllFetchLimitedNewOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload

    try {
        const query = {

            checkunique: { $in: req.body.checkunique }, // using RegExp for partial match
        };


        productionupload = await ProductionUpload.find(query, { checkunique: 1, _id: 0 }).lean();

    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        productionupload,
    });
});

// get All ProductionUpload => /api/productionuploads
exports.productionUploadOverAllFetchLimitedOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, count;
    const batchSize = 10000; // Adjust as needed
    const page = req.body.page || 1; // Get the page number from the request query

    try {
        const query = {

            dateval: { $in: req.body.datearray.map((date) => new RegExp("^" + date)) }, // using RegExp for partial match
        };
        // Calculate the number of documents to skip
        const skip = (page - 1) * batchSize;

        // Fetch a batch of documents
        productionupload = await ProductionUpload.find(query, { checkunique: 1 })
            .skip(skip)
            .limit(batchSize);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        productionupload,
    });
});

// get All ProductionUpload => /api/productionuploads
exports.productionUploadUnitrateOverallFetchlimitedOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {
        // let checkid = req.body.checkunique.map(item => mongoose.Types.ObjectId(item))
        const query = {
            _id: { $in: req.body.checkunique }, // using RegExp for partial match
        };

        productionupload = await ProductionUpload.find(query, { category: 1, filename: 1, dateval: 1, vendor: 1, unitrate: 1, unitid: 1, flagcount: 1, section: 1, updatedunitrate: 1, updatedflag: 1, updatedsection: 1, });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        productionupload,
    });
});


// Create new ProductionUpload=> /api/productionupload/new
exports.addProductionUploadOther = catchAsyncErrors(async (req, res, next) => {
    let aproductionupload = await ProductionUpload.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle ProductionUpload => /api/productionupload/:id
exports.getSingleProductionUploadOther = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproductionupload = await ProductionUpload.findById(id);

    if (!sproductionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        sproductionupload,
    });
});

exports.getAllProductionUploadFilenamesOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {
        productionupload = await ProductionUpload.find({ filename: req.body.filename, uniqueid: req.body.id });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});

exports.getAllProductionUploadFilenamesonlyOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, matchedData;
    try {
        matchedData = await ProductionUpload.find({ uniqueid: req.body.id }, { dateval: 1, filename: 1, uniqueid: 1, filenamenew: 1, createdAt: 1 }).lean();

        productionupload = matchedData.reduce((acc, current) => {
            const existingItem = acc.find((item) =>
                item.filename === current.filename);

            if (existingItem) {
                existingItem.totaldata += 1;
            } else {
                acc.push({
                    filename: current.filename,
                    filenamenew: current.filenamenew,
                    totaldata: 1,
                    id: current._id,
                    dateval: current.dateval,
                    uniqueid: current.uniqueid,
                    createddate: current.createdAt,
                });
            }

            return acc; // Don't forget to return the accumulator at the end of each iteration
        }, []);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});
exports.getAllProductionUploadGetdeletedatasOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {
        productionupload = await ProductionUpload.find({ filename: req.body.filename, uniqueid: req.body.id }, { _id: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});

exports.getAllProductionUploadGetdeletedatasallOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {
        productionupload = await ProductionUpload.find({ uniqueid: req.body.id }, { _id: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});

// update ProductionUpload by id => /api/productionupload/:id
exports.updateProductionUploadOther = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uproductionupload = await ProductionUpload.findByIdAndUpdate(id, req.body);

    if (!uproductionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionUpload by id => /api/productionupload/:id
exports.deleteProductionUploadOther = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproductionupload = await ProductionUpload.findByIdAndRemove(id);

    if (!dproductionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// Delete ProductionUpload by array of ids => /api/productionupload
exports.deleteProductionUploadsMutliOther = catchAsyncErrors(async (req, res, next) => {
    const ids = req.body.ids; // Assuming you send an array of ids in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new ErrorHandler("Invalid or empty array of IDs", 400));
    }

    const result = await ProductionUpload.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
        return next(new ErrorHandler("No data found for the given IDs", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});




// /unallot
exports.getAllProductionUnAllotFilterOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, mergedData, mergedDataall, producionIndividual;

    try {
        producionIndividual = await ProducionIndividual.find(
            {
                vendor: { $in: req.body.project.map((item) => item.value).map((pro) => new RegExp("^" + pro)) },

                updatedunitrate: { $exists: false },
                unallothide: { $exists: false },
                status: "Approved",
            },
            { vendor: 1, category: 1, mode: 1, filename: 1, section: 1, flagcount: 1, unitrate: 1, fromdate: 1 }
        );

        productionupload = await ProductionUpload.find(
            {
                unitrate: { $eq: 0 },
                unallothide: { $ne: "true" },
                vendor: { $in: req.body.project.map((item) => item.value).map((pro) => new RegExp("^" + pro)) },
                updatedunitrate: { $exists: false, $ne: 0 },
            },
            { dateval: 1, vendor: 1, category: 1, filename: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 }
        );

        mergedDataall = [...productionupload, ...producionIndividual].map((upload) => {
            const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
            const getproject = FindProjectvendor && FindProjectvendor[0];

            if (
                // ((req.body.project != "") ? req.body.project === getproject : true)
                req.body.project && req.body.project.length > 0 ? req.body.project.map((item) => item.value).includes(getproject) : true
            )
                return {
                    user: upload.user,
                    flagcount: upload.flagcount,
                    unitid: upload.unitid,
                    unitrate: upload.unitrate,
                    vendor: upload.vendor,
                    category: upload.category,
                    unallotcategory: upload.unallotcategory,
                    unallotsubcategory: upload.unallotsubcategory,
                    dateval: upload.mode == "Manual" ? upload.fromdate : upload.dateval,
                    filename: upload.filename + ".x",
                    section: upload.section,
                    mode: upload.mode == "Manual" ? "Manual" : "Production",
                    _id: upload._id,
                };
        });

        mergedData = mergedDataall.filter((item) => item != null);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!mergedData) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});

//view
exports.getAllProductionUnAllotFilterViewOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, mergedData, mergedDataall, producionIndividual;
    try {
        // producionIndividual = await ProducionIndividual.find({ unitrate: { $eq: 0 }, unallothide: { $ne: "true" } }, {});
        // const objectIdIds = req.body.ids.map(id => mongoose.Types.ObjectId(id));
        productionupload = await ProductionUpload.find({
            unitrate: { $eq: 0 }, unallothide: { $ne: "true" }, _id: { $in: req.body.ids }
        }, { dateval: 1, vendor: 1, category: 1, filenameupdated: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 });

        mergedDataall = productionupload.map(upload => {
            return {
                user: upload.user,
                flagcount: upload.flagcount,
                unitid: upload.unitid,
                unitrate: upload.unitrate,
                vendor: upload.vendor,
                category: upload.category,
                unallotcategory: upload.unallotcategory,
                unallotsubcategory: upload.unallotsubcategory,
                dateval: upload.dateval,
                section: upload.section,
                filename: upload.filenameupdated,
                mode: "Production",
                _id: upload._id,
            };

        });

        mergedData = mergedDataall.filter(item => item != null)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});

exports.getAllProductionUnAllotFilterViewIDSOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, mergedData, mergedDataall, producionIndividual;
    try {
        // producionIndividual = await ProducionIndividual.find({ unitrate: { $eq: 0 }, unallothide: { $ne: "true" } }, {});
        // const objectIdIds = req.body.ids.map(id => mongoose.Types.ObjectId(id));
        productionupload = await ProductionUpload.find({
            _id: { $in: req.body.ids }
        }, { dateval: 1, vendor: 1, category: 1, filenameupdated: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 });

        mergedDataall = productionupload.map(upload => {
            return {
                user: upload.user,
                flagcount: upload.flagcount,
                unitid: upload.unitid,
                unitrate: upload.unitrate,
                vendor: upload.vendor,
                category: upload.category,
                unallotcategory: upload.unallotcategory,
                unallotsubcategory: upload.unallotsubcategory,
                dateval: upload.dateval,
                section: upload.section,
                filename: upload.filenameupdated,
                mode: "Production",
                _id: upload._id,
            };

        });

        mergedData = mergedDataall.filter((item, index) => item != null && index <= 500)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});

exports.getAllProductionUnAllotFilterViewManualOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, mergedData, mergedDataall, producionIndividual;
    try {
        productionupload = await ProducionIndividual.find({ _id: { $in: req.body.ids } }, {});

        mergedDataall = productionupload.map(upload => {
            return {
                user: upload.user,
                flagcount: upload.flagcount,
                unitid: upload.unitid,
                unitrate: upload.unitrate,
                vendor: upload.vendor,
                category: upload.category,
                unallotcategory: upload.unallotcategory,
                unallotsubcategory: upload.unallotsubcategory,
                dateval: upload.dateval,
                section: upload.section,
                filename: upload.filename,
                mode: "Manual",
                _id: upload._id,
            };

        });

        mergedData = mergedDataall.filter(item => item != null)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});


const getWeekOffDay = (column, boardingLog, department, overAllDepartment) => {
    if (boardingLog.length > 0) {

        // Remove duplicate entries with recent entry
        const uniqueEntries = {};
        boardingLog.forEach(entry => {
            const key = entry.startdate;
            if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                uniqueEntries[key] = entry;
            }
        });
        const uniqueBoardingLog = Object.values(uniqueEntries);

        const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
        const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

        // Find the relevant log entry for the given date     
        const relevantLogEntry = uniqueBoardingLog
            .filter(log => log.startdate <= finalDate)
            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

        if (relevantLogEntry) {

            // Daily
            if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                // If shift type is 'Daily', return the same shift timing for each day
                //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
            }

            // 1 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === 'Daily') {
                for (const data of relevantLogEntry.todo) {
                    const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                    if (data.week === columnWeek && data.day === column.dayName) {
                        return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                    }
                }
            }

            // 2 Week Rotation 2nd try working code  
            if (relevantLogEntry.shifttype === '1 Week Rotation') {
                const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                // Get the day name of the start date
                const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                // Calculate the day count until the next Sunday
                let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                // Calculate the week number based on the day count
                let weekNumber = Math.ceil((7 - dayCount) / 7);

                // Adjust the week number considering the two-week rotation
                const logStartDate = new Date(relevantLogEntry.startdate);
                const currentDate = new Date(finalDate);

                const diffTime = Math.abs(currentDate - logStartDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                // Determine the final week based on the calculated week number                    
                const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                for (const data of relevantLogEntry.todo) {
                    // Check if the adjusted week matches the column week and day
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                    }
                }
            }

            //just 2wk rotation
            if (relevantLogEntry.shifttype === '2 Week Rotation') {

                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find(
                    (dep) =>
                        dep.department === department &&
                        new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                        new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                );

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment
                    ? new Date(matchingDepartment.fromdate)
                    : new Date(relevantLogEntry.startdate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                const currentDate = new Date(finalDate);

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                // Calculate total days for 1-month rotation based on the effective month
                let totalDays = monthLengths[effectiveMonth];

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    // Set startDate to the next matchingDepartment.fromdate for each cycle
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = monthLengths[effectiveMonth];

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days correctly
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                // Calculate the week number within the rotation month based on 7-day intervals from start date
                // const weekNumber = Math.ceil(diffDays / 7);
                let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                const weekNames = [
                    "1st Week",
                    "2nd Week",
                    "3rd Week",
                    "4th Week",
                    "5th Week",
                    "6th Week",
                    "7th Week",
                    "8th Week",
                    "9th Week",
                ];
                const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            //just 1mont rota             
            if (relevantLogEntry.shifttype === '1 Month Rotation') {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find(
                    (dep) =>
                        dep.department === department &&
                        new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                        new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                );

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment
                    ? new Date(matchingDepartment.fromdate)
                    : new Date(relevantLogEntry.startdate);

                const currentDate = new Date(finalDate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                let totalDays = 0;

                // Calculate total days for 2-month rotation based on the effective month
                for (let i = 0; i < 2; i++) {
                    const monthIndex = (effectiveMonth + i) % 12;
                    totalDays += monthLengths[monthIndex];
                }

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        totalDays += monthLengths[monthIndex];
                    }

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days including the start date
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                // Define week names for first and second month of the cycle
                const weekNamesFirstMonth = [
                    "1st Week",
                    "2nd Week",
                    "3rd Week",
                    "4th Week",
                    "5th Week",
                    "6th Week"
                ];

                const weekNamesSecondMonth = [
                    "7th Week",
                    "8th Week",
                    "9th Week",
                    "10th Week",
                    "11th Week",
                    "12th Week"
                ];

                // Determine which month we are in
                const daysInFirstMonth = monthLengths[effectiveMonth];
                let finalWeek;

                if (diffDays <= daysInFirstMonth) {
                    // We're in the first month of the cycle
                    weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                    finalWeek = weekNamesFirstMonth[weekNumber - 1];
                } else {
                    // We're in the second month of the cycle
                    const daysInSecondMonth = totalDays - daysInFirstMonth;
                    const secondMonthDay = diffDays - daysInFirstMonth;

                    // Calculate week number based on Monday-Sunday for the second month
                    const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                    const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                    const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                    const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                    finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                }

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }
        }
    }
}

function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
}




// Compare manual date with with formattedDate
const formatDate = (inputDate) => {
    if (!inputDate) {
        return "";
    }
    // Assuming inputDate is in the format "dd-mm-yyyy"
    const [day, month, year] = inputDate?.split("/");

    // Use padStart to add leading zeros
    const formattedDay = String(day)?.padStart(2, "0");
    const formattedMonth = String(month)?.padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
};

const getShiftForDate = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment) => {

    // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

    // if (selectedDateIndex === -1) {
    //     return !isWeekOff ? actualShiftTiming : "Week Off";
    // }

    if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
        return 'Pending'
    }
    else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === 'Shift Weekoff Swap') {
        return matchingDoubleShiftItem?._doc?.todateshiftmode;
    }
    else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === 'WeekOff Adjustment') {
        return matchingDoubleShiftItem?._doc?.todateshiftmode;
    }
    else if (matchingItem && matchingItem?._doc?.adjstatus === 'Approved') {

        if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === 'Shift Adjustment' || matchingItem?._doc?.adjustmenttype === 'Shift Weekoff Swap') {
            if (column.shiftMode === 'Main Shift') {
                return `${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`
            } else if (column.shiftMode === 'Second Shift') {
                return `${matchingItem?._doc?.pluseshift.split(' - ')[0]}to${matchingItem?._doc?.pluseshift.split(' - ')[1]}`
            }
        }
        else {
            return (isWeekOffWithAdjustment ? (`${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`));
        }
    }
    else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
        return isWeekOffWithManual ? (`${matchingItemAllot._doc?.firstshift.split(' - ')[0]}to${matchingItemAllot?._doc?.firstshift.split(' - ')[1]} `) :
            (`${matchingItemAllot?._doc?.firstshift.split(' - ')[0]}to${matchingItemAllot?._doc?.firstshift.split(' - ')[1]} `);
    }
    else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
        return 'Week Off';
    }
    else if (matchingItem && matchingItem?._doc?.adjstatus === 'Reject' && isWeekOff) {
        // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
        return 'Week Off';
    }
    // before add shifttype condition working code
    // else if (boardingLog?.length > 0) {

    //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    //     // Filter boardingLog entries for the same start date
    //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

    //     // If there are entries for the date, return the shift timing of the second entry
    //     if (entriesForDate.length > 1) {
    //         return entriesForDate[1].shifttiming;
    //     }

    //     // Find the most recent boarding log entry that is less than or equal to the selected date
    //     const recentLogEntry = boardingLog
    //         .filter(log => log.startdate < finalDate)
    //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //     // If a recent log entry is found, return its shift timing
    //     if (recentLogEntry) {
    //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
    //     } else {
    //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
    //         return !isWeekOff ? actualShiftTiming : "Week Off";
    //     }
    // } 
    else if (boardingLog.length > 0) {
        // Remove duplicate entries with recent entry
        const uniqueEntries = {};
        boardingLog.forEach(entry => {
            const key = entry.startdate;
            if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                uniqueEntries[key] = entry;
            }
        });
        const uniqueBoardingLog = Object.values(uniqueEntries);

        const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
        const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

        // Find the relevant log entry for the given date     
        const relevantLogEntry = uniqueBoardingLog
            .filter(log => log.startdate <= finalDate)
            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

        if (relevantLogEntry) {

            // Daily
            if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                // If shift type is 'Daily', return the same shift timing for each day
                //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
            }

            // 1 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === 'Daily') {
                for (const data of relevantLogEntry.todo) {
                    const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                    if (data.week === columnWeek && data.day === column.dayName) {
                        return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                    }
                }
            }

            // 2 Week Rotation 2nd try working code  
            if (relevantLogEntry.shifttype === '1 Week Rotation') {
                const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                // Get the day name of the start date
                const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                // Calculate the day count until the next Sunday
                let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                // Calculate the week number based on the day count
                let weekNumber = Math.ceil((7 - dayCount) / 7);

                // Adjust the week number considering the two-week rotation
                const logStartDate = new Date(relevantLogEntry.startdate);
                const currentDate = new Date(finalDate);

                const diffTime = Math.abs(currentDate - logStartDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                // Determine the final week based on the calculated week number                    
                const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                for (const data of relevantLogEntry.todo) {
                    // Check if the adjusted week matches the column week and day
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                    }
                }
            }

            //just 2wk rotation
            if (relevantLogEntry.shifttype === '2 Week Rotation') {

                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find(
                    (dep) =>
                        dep.department === department &&
                        new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                        new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                );

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment
                    ? new Date(matchingDepartment.fromdate)
                    : new Date(relevantLogEntry.startdate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                const currentDate = new Date(finalDate);

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                // Calculate total days for 1-month rotation based on the effective month
                let totalDays = monthLengths[effectiveMonth];

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    // Set startDate to the next matchingDepartment.fromdate for each cycle
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = monthLengths[effectiveMonth];

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days correctly
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                // Calculate the week number within the rotation month based on 7-day intervals from start date
                // const weekNumber = Math.ceil(diffDays / 7);
                let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                const weekNames = [
                    "1st Week",
                    "2nd Week",
                    "3rd Week",
                    "4th Week",
                    "5th Week",
                    "6th Week",
                    "7th Week",
                    "8th Week",
                    "9th Week",
                ];
                const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            if (relevantLogEntry.shifttype === '1 Month Rotation') {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find(
                    (dep) =>
                        dep.department === department &&
                        new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                        new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                );

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment
                    ? new Date(matchingDepartment.fromdate)
                    : new Date(relevantLogEntry.startdate);

                const currentDate = new Date(finalDate);

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                // Calculate month lengths with leap year check for a given year
                const calculateMonthLengths = (year) => {
                    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                };

                // Determine the effective month and year for the start date
                let effectiveMonth = startDate.getMonth();
                let effectiveYear = startDate.getFullYear();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                    if (effectiveMonth === 0) {
                        effectiveYear += 1; // Move to the next year if month resets
                    }
                }

                // Calculate total days for the current two-month cycle
                let totalDays = 0;
                for (let i = 0; i < 2; i++) {
                    const monthIndex = (effectiveMonth + i) % 12;
                    const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                    const currentYear = effectiveYear + yearAdjustment;
                    const monthLengthsForYear = calculateMonthLengths(currentYear);
                    totalDays += monthLengthsForYear[monthIndex];
                }

                // Set the endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                // Recalculate if currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month and year for the next cycle
                    effectiveMonth = startDate.getMonth();
                    effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1;
                        }
                    }

                    totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                }

                console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                // Calculate the difference in days including the start date
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                // Define week names for first and second month of the cycle
                const weekNamesFirstMonth = [
                    "1st Week",
                    "2nd Week",
                    "3rd Week",
                    "4th Week",
                    "5th Week",
                    "6th Week"
                ];

                const weekNamesSecondMonth = [
                    "7th Week",
                    "8th Week",
                    "9th Week",
                    "10th Week",
                    "11th Week",
                    "12th Week"
                ];

                // Determine which month we are in
                const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                let finalWeek;

                if (diffDays <= daysInFirstMonth) {
                    // We're in the first month of the cycle
                    weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                    finalWeek = weekNamesFirstMonth[weekNumber - 1];
                } else {
                    // We're in the second month of the cycle
                    const secondMonthDay = diffDays - daysInFirstMonth;

                    // Calculate week number based on Monday-Sunday for the second month
                    const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                    const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                    const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                    const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                    finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                }

                console.log({
                    startDate,
                    currentDate,
                    endDate,
                    diffTime,
                    diffDays,
                    weekNumber,
                    finalWeek,
                });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }
        }
    }

};

// get All ProductionUpload => /api/productionuploads
exports.getProductionSingleDayUserOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, productionuploadManual;
    try {
        const [firstDate, secondDate] = req.body.date.split("$");
        const [fromDateonly, fromTime] = firstDate.split("T");
        const [toDateonly, toTime] = secondDate.split("T");

        const query = {
            $or: [
                { dateval: { $regex: fromDateonly } },
                { dateval: { $regex: toDateonly } }
            ],
            user: { $in: req.body.users },
        };

        productionupload = await ProductionUpload.find(query, { filename: 1, dateval: 1, unitid: 1, user: 1, category: 1, updatedunitrate: 1, flagcount: 1, updatedflag: 1, unitrate: 1, vendor: 1 });

        const query1 = {
            $or: [
                { fromdate: fromDateonly },
                { fromdate: toDateonly }
            ],
            user: { $in: req.body.users },
        };

        productionuploadManual = await ProducionIndividual.find(query1, { filename: 1, time: 1, fromdate: 1, unitid: 1, mode: 1, user: 1, category: 1, updatedunitrate: 1, updatedflag: 1, flagcount: 1, unitrate: 1, vendor: 1 }).lean();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
        productionuploadManual
    });
});

exports.overallProdFinalFilterLimitedOther = catchAsyncErrors(async (req, res, next) => {
    let count, attendances;
    const page = req.body.page || 1; // Default to page 1 if not specified
    const pageSize = req.body.pageSize || 10000; // Default page size to 10 if not specified

    let filteredDatas = [];
    let totalCount = 0;
    let totalPages = 0;

    try {
        function createDateArray(fromDateStr, toDateStr) {
            const fromDate = new Date(fromDateStr);
            const toDate = new Date(toDateStr);

            // Ensure the toDate includes the whole day
            toDate.setHours(23, 59, 59, 999);

            const dateArray = [];
            let currentDate = new Date(fromDate);

            while (currentDate <= toDate) {
                dateArray.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dateArray;
        }
        let fromDate = new Date(req.body.fromdate);
        let toDate = new Date(req.body.todate);
        toDate.setDate(toDate.getDate() + 1);

        const dateArray = createDateArray(fromDate, toDate);

        const dateObj = new Date(fromDate);

        // Extract day, month, and year components
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();

        // Format the date components into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        const dateObjto = new Date(toDate);

        // Extract day, month, and year components
        const dayto = String(dateObjto.getDate()).padStart(2, "0");
        const monthto = String(dateObjto.getMonth() + 1).padStart(2, "0");
        const yearto = dateObjto.getFullYear();

        // Format the date components into the desired format
        const formattedDateTo = `${dayto}-${monthto}-${yearto}`;

        attendances = await Attendances.find({ date: { $gte: formattedDate, $lte: formattedDateTo } }, { clockintime: 1, date: 1, username: 1 });

        const filter = {
            dateval: { $in: dateArray.map((date) => new RegExp("^" + date)) },
            filename: { $in: req.body.filename.map((name) => `${name.value}.xlsx`) },
            category: { $in: req.body.category.map((name) => name.value) },
        };

        // Calculate total count only for the first request
        // if (page === 1) {
        totalCount = await ProductionUpload.countDocuments(filter);
        totalPages = Math.ceil(totalCount / pageSize);
        // }

        // Perform the query with pagination
        filteredDatas = await ProductionUpload.find(filter)
            .select("category filename dateval vendor unitrate unitid flagcount section updatedunitrate updatedflag updatedsection") // Only select specific fields
            .skip((page - 1) * pageSize) // Skip documents based on page number
            .limit(pageSize); // Limit number of documents per page
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!mergedData) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        filteredDatas,
        attendances,
    });
});

exports.getMismatchUpdatedListOther = catchAsyncErrors(async (req, res, next) => {
    const page = req.body.page || 1; // Default to page 1 if not specified
    const pageSize = req.body.pageSize || 10000; // Default page size to 10 if not specified

    let filteredDatas = [];
    let totalCount = 0;
    let totalPages = 0;

    try {
        // Build the filter object
        const filter = {
            dateval: new RegExp("^" + req.body.date),

            $or: [{ updatedunitrate: { $exists: true } }, { updatedflag: { $exists: true } }, { updatedsection: { $exists: true } }],
        };

        totalCount = await ProductionUpload.countDocuments(filter);
        totalPages = Math.ceil(totalCount / pageSize);

        // Perform the query with pagination
        filteredDatas = await ProductionUpload.find(filter)
            .select("category filename dateval vendor unitrate user unitid flagcount section updatedunitrate updatedflag updatedsection")
            .skip((page - 1) * pageSize) // Skip documents based on page number
            .limit(pageSize); // Limit number of documents per page


        return res.status(200).json({
            filteredDatas: filteredDatas,
            totalCount: totalCount,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// delete ProductionUpload by id => /api/productionupload/:id
exports.undoFieldNameOther = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.id;
    let dproductionupload;
    try {
        dproductionupload = await ProductionUpload.updateOne({ _id: id }, { $unset: { updatedunitrate: 1, updatedflag: 1, updatedsection: 1 } });
        if (!dproductionupload) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// get All ProductionUpload => /api/productionuploads
exports.productionUploadCheckStatusOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;

    try {
        const query = {
            uniqueid: { $in: req.body.id }, // using RegExp for partial match
        };

        productionupload = await ProductionUpload.countDocuments(query, {});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        productionupload,
    });
});

// /unallot
exports.productionUploadCheckMismatchPresentFilterOther = catchAsyncErrors(async (req, res, next) => {
    let count;
    let filteredDatas = [];
    let filteredDatasManual = [];

    try {
        const { date, project, fromtime, totime } = req.body;

        // const producionIndividualManual = await ProducionIndividual.find(
        //   {
        //     fromdate: new RegExp("^" + req.body.date),
        //     updatedunitrate: { $exists: true, $ne: 0 },
        //     flagcount: { $exists: true, $gt: 0 },
        //     vendor: new RegExp("^" + req.body.project),
        //     unallothide: { $ne: "true" },
        //     status: "Approved",
        //   },
        //   {}
        // ).lean();

        const productionunmatched = await ProductionUpload.find(
            {
                dateobjformatdate: { $gte: new Date(`${date}T${fromtime}Z`), $lte: new Date(`${date}T${totime}Z`) },
                unitrate: { $exists: true, $ne: 0 },
                // flagcount: { $exists: true, $gt: 0 },

                unallothide: { $ne: "true" },
                vendor: new RegExp("^" + project),
            },
            { dateval: 1, filename: 1, category: 1, vendor: 1, unitrate: 1, flagcount: 1, updatedunitrate: 1, updatedflag: 1 }
        ).lean(); // Use lean() to get plain JavaScript objects and reduce memory overhead

        const unitRates = await Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1 }).lean();

        const subCategoryOpt = await subCategoryprod.find({}, { name: 1, categoryname: 1, project: 1, mismatchmode: 1 }).lean();

        const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
        const subCategoryMap = new Map(subCategoryOpt.map((item) => [item.project + "-" + item.categoryname + "-" + item.name, item]));
        // && matchCategory.mismatchmode.includes("Flag") && matchCategory.mismatchmode.includes("Unit + Flag")
        filteredDatas = productionunmatched.reduce((acc, obj) => {
            const [filenameupdated] = obj.filename.split(".x");

            const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
            const matchSubCategory = subCategoryMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);

            const mrateval = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
            const mflagcount = matchUnitrate ? Number(matchUnitrate.flagcount) : 0;
            const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);
            const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);
            // const unitflagstatus = matchUnitrate ? (matchUnitrate.flagstatus) : "";
            const subMismatchModes = matchSubCategory ? (matchSubCategory.mismatchmode) : [];
            // const unitrateval = matchCategory && matchCategory.flagstatus === "Yes" && matchCategory.mismatchmode.includes("Flag") && matchCategory.mismatchmode.includes("Unit + Flag") ? finalunitrate / finalflag : finalunitrate;
            const unitrateval = finalunitrate;
            // console.log(unitflagstatus, 'unitflagstatus')
            // const isMisMatch = (mrateval !== unitrateval || finalflag != mflagcount);
            const isMisMatch = (Number(mrateval) !== Number(unitrateval) || (Number(mflagcount) > 1 && Number(finalflag) != Number(mflagcount)) || (Number(mrateval) == Number(unitrateval) && Number(finalflag) != Number(mflagcount) && subMismatchModes.includes("Flag Mismatched")));

            if (isMisMatch) {
                acc.push({ _id: obj._id });
            }

            return acc;
        }, []);

        // filteredDatasManual = producionIndividualManual.reduce((acc, obj) => {
        //   const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + obj.filename + "-" + obj.category);
        //   // const matchCategory = categoryMap.get(obj.vendor.split("-")[0] + "-" + obj.filename);

        //   const mrateval = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
        //   const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);
        //   // const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);

        //   // const unitrateval = matchCategory && matchCategory.flagstatus === "Yes" && matchCategory.mismatchmode.includes("Flag") && matchCategory.mismatchmode.includes("Unit + Flag") ? finalunitrate / finalflag : finalunitrate;
        //   const unitrateval = finalunitrate;
        //   const isMisMatch = mrateval !== unitrateval;

        //   if (isMisMatch) {
        //     acc.push({ _id: obj._id });
        //   }
        //   return acc;
        // }, []);

        // console.log(filteredDatasManual.length, "manujhgjh");

        count = filteredDatas.length
        console.log(count, "vt");
    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        filteredDatas,
        filteredDatasManual,
        count,
    });
});
// get All ProductionUpload => /api/productionuploads
exports.getProductionUploadDatasByIdOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;

    try {
        const query = {
            _id: { $in: req.body.ids }, // using RegExp for partial match

        };

        let productionunmatched = await ProductionUpload.find(query, { category: 1, updatedflag: 1, updatedunitrate: 1, filenameupdated: 1, formatteddate: 1, vendor: 1, unitrate: 1, unitid: 1, flagcount: 1, section: 1 }).lean();

        const unitRates = await Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1, flagstatus: 1 }).lean();
        const subcategoryOpt = await subCategoryprod.find({}, { name: 1, mismatchmode: 1, categoryname: 1, project: 1 }).lean();

        const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
        const subcategoryMap = new Map(subcategoryOpt.map((item) => [item.project + "-" + item.categoryname + "-" + item.name, item]));

        productionupload = productionunmatched.reduce((acc, obj) => {


            const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + obj.filenameupdated + "-" + obj.category);
            const matchSubCategory = subcategoryMap.get(obj.vendor.split("-")[0] + "-" + obj.filenameupdated + "-" + obj.category);

            const mrateval = matchUnitrate && Number(matchUnitrate.mrate);
            const unitflag = matchUnitrate && Number(matchUnitrate.flagcount);
            // const unitflagstatus = matchUnitrate ? (matchUnitrate.flagstatus) : "";
            const mismatchmodeval = matchSubCategory ? matchSubCategory.mismatchmode : [];

            const mratevalcheck = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
            const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);

            const mflagalcheck = matchUnitrate ? Number(matchUnitrate.flagcount) : 0;
            const finalflagcount = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);


            // if (matchUnitrate || matchSubCategory) {
            if ((Number(finalunitrate) != Number(mratevalcheck) || (Number(mflagalcheck) > 1 && (Number(mflagalcheck) != Number(finalflagcount))) || (Number(mrateval) == Number(finalunitrate) && Number(finalflagcount) != Number(mflagalcheck) && mismatchmodeval.includes("Flag Mismatched"))) && (matchUnitrate || matchSubCategory)) {
                acc.push({ _id: obj._id, vendor: obj.vendor, mode: "Production", flagcount: obj.flagcount, user: obj.user, unitid: obj.unitid, category: obj.category, filename: obj.filenameupdated, unitrate: finalunitrate, mismatchmodestatus: mismatchmodeval.includes("Flag Mismatched") ? "Yes" : "No", dateval: obj.formatteddate, section: obj.section, mrate: mrateval, mismatchmode: mismatchmodeval, unitflag: unitflag });
            }
            return acc;
        }, []);

    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        productionupload,
    });
});
// get All ProductionUpload => /api/productionuploads
exports.getProductionUploadDatasByIdManualOther = catchAsyncErrors(async (req, res, next) => {
    let productionindividual;

    try {
        const query = {
            _id: { $in: req.body.ids }, // using RegExp for partial match
        };

        const productionunmatched = await ProducionIndividual.find(query, { category: 1, fromdate: 1, filename: 1, dateval: 1, vendor: 1, unitrate: 1, unitid: 1, flagcount: 1, section: 1, updatedunitrate: 1, updatedflag: 1, updatedsection: 1 }).lean();
        const unitRates = await Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1 }).lean();
        const categoryOpt = await Categoryprod.find({}, { name: 1, flagstatus: 1, mismatchmode: 1, project: 1 }).lean();

        const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
        const categoryMap = new Map(categoryOpt.map((item) => [item.project + "-" + item.name, item]));

        productionindividual = productionunmatched.reduce((acc, obj) => {
            const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + obj.filename + "-" + obj.category);
            const matchCategory = categoryMap.get(obj.vendor.split("-")[0] + "-" + obj.filename);

            const mrateval = matchUnitrate && Number(matchUnitrate.mrate);
            const unitflag = matchUnitrate && Number(matchUnitrate.flagcount);
            const mismatchmodeval = matchCategory && matchCategory.mismatchmode;
            if (matchUnitrate || matchCategory) {
                acc.push({ _id: obj._id, vendor: obj.vendor, mode: "Manual", fromdate: obj.fromdate, user: obj.user, unitid: obj.unitid, flagcount: obj.flagcount, category: obj.category, filename: obj.filename, unitrate: obj.updatedunitrate, dateval: obj.dateval, section: obj.section, mrate: mrateval, mismatchmode: mismatchmodeval, unitflag: unitflag });
            }

            return acc;
        }, []);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        productionindividual,
    });
});

// get All ProductionUpload => /api/productionuploads
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitandFlagOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        // if(updates)
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");

        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedflag: update.updatedflag,
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedflag: update.updatedflag,
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitOnlyOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");

        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasFlagOnlyOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");
        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedflag: update.updatedflag,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedflag: update.updatedflag,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitandSectionOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");

        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedsection: update.updatedsection,
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            updatedsection: update.updatedsection,
                            updatedunitrate: update.updatedunitrate,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});


exports.bulkDeleteUnitRateUnallotOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        // if(updates)
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");

        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            unallothide: "true",
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            unallothide: "true",
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});

// get All ProductionUpload => /api/productionuploads
exports.bulkProductionOrgUpdateCategorySubcategoryOther = catchAsyncErrors(async (req, res, next) => {
    const { updates } = req.body;

    try {
        let prodManual = updates.filter((item) => item.mode === "Manual");
        let prodUploads = updates.filter((item) => item.mode === "Production");

        if (prodManual.length > 0) {
            const bulkOps = prodManual.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            unallotcategory: update.unallotcategory,
                            unallotsubcategory: update.unallotsubcategory,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProducionIndividual.bulkWrite(bulkOps);
        }
        if (prodUploads.length > 0) {
            const bulkOps = prodUploads.map((update) => ({
                updateOne: {
                    filter: { _id: update._id },
                    update: {
                        $set: {
                            unallotcategory: update.unallotcategory,
                            unallotsubcategory: update.unallotsubcategory,
                        },
                    },
                },
            }));

            // Perform bulk write operation
            await ProductionUpload.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: "Bulk update successful" });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});


exports.getSingleDateDataforprodDayOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, depMonthSet;
    let finaluser = []

    const { date, userDates, batchNumber, batchSize } = req.body;

    try {
        let dateoneafter = new Date(date);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        let datebefore = new Date(date);
        datebefore.setDate(datebefore.getDate() - 1);
        let newDateOneMinus = datebefore.toISOString().split("T")[0];

        const query = {
            dateobjformatdate: { $gte: new Date(`${date}T00:00:00Z`), $lte: new Date(`${newDateOnePlus}T18:00:00Z`) },
            dupe: "No",

        }

        let dateNow = new Date(date);
        let datevalue = dateNow.toISOString().split("T")[0];

        let deptMonthQuery = {
            fromdate: { $lte: datevalue },
            todate: { $gte: datevalue },
        }

        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();
        let attendenceControlCriteria = await AttendanceControlCriteria.findOne().sort({ createdAt: -1 }).exec();
        depMonthSet = await DepartmentMonth.find(deptMonthQuery, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 });

        let dayShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshifthourday) : 4;
        let dayShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshiftminday) : 0;
        let nightShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshifthournight) : 4;
        let nightShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshiftminnight) : 0;

        let users = await Users.find(
            {
                enquirystatus: {
                    $nin: ["Enquiry Purpose"],
                },

            },

            { companyname: 1, empcode: 1, company: 1, unit: 1, branch: 1, team: 1, username: 1, processlog: 1, shifttiming: 1, department: 1, doj: 1, assignExpLog: 1, shiftallot: 1, boardingLog: 1 })

        let shift = await Shift.find({}, { name: 1, fromhour: 1, tohour: 1, frommin: 1, tomin: 1, fromtime: 1, totime: 1, isallowance: 1 }).lean();


        const skip = (batchNumber - 1) * batchSize;
        const limit = batchSize;

        let producionIndividual = await ProducionIndividual.find({
            $or: [
                { fromdate: { $eq: date } },
                { fromdate: { $eq: newDateOnePlus } },
            ],

            status: "Approved", updatedunitrate: { $exists: true }
        }, { vendor: 1, fromdate: 1, time: 1, category: 1, filename: 1, unitid: 1, user: 1, section: 1, flagcount: 1, mode: 1, updatedflag: 1, updatedsection: 1, updatedunitrate: 1 })
            .skip(skip)
            .limit(limit)
            .lean();


        let mergedDataallfirst = await ProductionUpload.find(query, { unitid: 1, user: 1, formatteddate: 1, formattedtime: 1, filenameupdated: 1, category: 1, flagcount: 1, vendor: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 }).skip(skip).limit(limit).lean();


        const allData = [...mergedDataallfirst, ...producionIndividual];


        productionupload = allData.map((upload) => {

            const loginInfo = loginids.find((login) => login.userid === upload.user);

            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

            let filteredDataDateTime = null;

            if (loginallot.length > 0) {
                const groupedByDateTime = {};

                // Group items by date and time
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time;
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                });

                // Find the first item in the sorted array that meets the criteria
                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
                    // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
                    let datevalsplitfinal = upload.mode == "Manual" ? `${upload.fromdate}T${upload.time}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            let logininfoname = (loginallot.length > 0 && filteredDataDateTime) ? filteredDataDateTime.empname : (loginInfo ? loginInfo.empname : "");


            const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
            const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : [];


            const comparedate = upload.mode == "Manual" ? upload.fromdate : upload.formatteddate;
            const comparetime = upload.mode == "Manual" ? upload.time : upload.formattedtime;


            let dateSelectedFormat = moment(date).format("DD/MM/YYYY");
            let dateSelectedFormatOnePlus = moment(newDateOnePlus).format("DD/MM/YYYY");
            let dateSelectedFormatOneMinus = moment(newDateOneMinus).format("DD/MM/YYYY");

            let shiftEndTime = `${date}T00:00:00.000Z`;
            let shiftFromTime = `${date}T00:00:00.000Z`;
            let shiftOnlyFromTime = `${date}T00:00:00.000Z`;
            let shiftOnlyEndTime = `${date}T00:00:00.000Z`;

            let userShiftTimings = {}
            if (userArray && userArray.length > 0) {
                finaluser = userArray && userArray.length > 0 &&
                    userArray?.flatMap((item, index) => {
                        const findShiftTiming = (shiftName) => {
                            const foundShift = shift?.find((d) => d.name === shiftName);
                            return foundShift ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime}to${foundShift.tohour}:${foundShift.tomin}${foundShift.totime} ` : "";
                        };
                        const findShiftTimingsts = (shiftName) => {
                            const foundShift = shift?.find((d) => d.name === shiftName);
                            return foundShift ? `${foundShift.isallowance}` : "";
                        };

                        const filteredMatchingDoubleShiftItem = item?._doc?.shiftallot?.filter((val) => val && val?._doc?.empcode === item?._doc?.empcode && val?._doc?.adjstatus === "Approved");

                        // Filter out the dates that have matching 'Shift Adjustment' todates
                        let removedUserDates = userDates.filter((date) => {
                            // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
                            const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem?.find((item) => item && item?._doc?.todate === date.formattedDate && item?._doc?.adjustmenttype === "Shift Adjustment");

                            // If there is no matching 'Shift Adjustment', keep the date
                            return !matchingShiftAdjustmentToDate;
                        });

                        // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
                        let uniqueEntries = new Set();

                        // Iterate over removedUserDates and add unique entries to the Set
                        removedUserDates.forEach((date) => {
                            uniqueEntries.add(
                                JSON.stringify({
                                    formattedDate: date.formattedDate,
                                    dayName: date.dayName,
                                    dayCount: date.dayCount,
                                    shiftMode: "Main Shift",
                                    weekNumberInMonth: date.weekNumberInMonth,
                                })
                            );
                        });

                        // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
                        filteredMatchingDoubleShiftItem && filteredMatchingDoubleShiftItem?.forEach((item) => {
                            const [day, month, year] = item._doc.adjdate?.split("/");
                            let newFormattedDate = new Date(`${year}-${month}-${day}`);

                            if (item._doc.adjustmenttype === "Shift Adjustment" || item._doc.adjustmenttype === "Add On Shift" || item._doc.adjustmenttype === "Shift Weekoff Swap") {
                                uniqueEntries.add(
                                    JSON.stringify({
                                        formattedDate: item._doc.adjdate,
                                        dayName: moment(item._doc.adjdate, "DD/MM/YYYY").format("dddd"),
                                        dayCount: parseInt(moment(item._doc.adjdate, "DD/MM/YYYY").format("DD")),
                                        shiftMode: "Second Shift",
                                        weekNumberInMonth:
                                            getWeekNumberInMonth(newFormattedDate) === 1
                                                ? `${getWeekNumberInMonth(newFormattedDate)}st Week`
                                                : getWeekNumberInMonth(newFormattedDate) === 2
                                                    ? `${getWeekNumberInMonth(newFormattedDate)}nd Week`
                                                    : getWeekNumberInMonth(newFormattedDate) === 3
                                                        ? `${getWeekNumberInMonth(newFormattedDate)}rd Week`
                                                        : getWeekNumberInMonth(newFormattedDate) > 3
                                                            ? `${getWeekNumberInMonth(newFormattedDate)}th Week`
                                                            : "",
                                    })
                                );
                            }
                        });

                        // Convert Set back to an array of objects
                        let createdUserDatesUnique = Array.from(uniqueEntries).map((entry) => JSON.parse(entry));

                        function sortUserDates(dates) {
                            return dates.sort((a, b) => {
                                if (a.formattedDate === b.formattedDate) {
                                    // If dates are the same, sort by shift mode
                                    if (a.shiftMode < b.shiftMode) return -1;
                                    if (a.shiftMode > b.shiftMode) return 1;
                                    return 0;
                                } else {
                                    // Otherwise, sort by date
                                    const dateA = new Date(a.formattedDate.split("/").reverse().join("/"));
                                    const dateB = new Date(b.formattedDate.split("/").reverse().join("/"));
                                    return dateA - dateB;
                                }
                            });
                        }

                        // Sort the array
                        const sortedCreatedUserDates = sortUserDates(createdUserDatesUnique);
                        const createdUserDates = sortedCreatedUserDates?.filter((d) => {
                            const filterData = userDates.some((val) => val.formattedDate === d.formattedDate);
                            if (filterData) {
                                return d;
                            }
                        });

                        // Map each user date to a row
                        const userRows = createdUserDates?.map((date) => {
                            let filteredRowData = item?._doc?.shiftallot?.filter((val) => val?._doc?.empcode == item?._doc?.empcode);
                            const matchingItem = filteredRowData?.find((item) => item && item?._doc?.adjdate == date.formattedDate);
                            const matchingItemAllot = filteredRowData?.find((item) => item && formatDate(item?._doc?.date) == date.formattedDate);
                            const matchingDoubleShiftItem = filteredRowData?.find((item) => item && item?._doc?.todate === date.formattedDate);
                            const filterBoardingLog = item?._doc?.boardingLog && item?._doc?.boardingLog?.filter((item) => {
                                // return item.logcreation === "user" || item.logcreation === "shift";
                                return item;
                            });

                            // Check if the dayName is Sunday or Monday
                            // const isWeekOff = item?._doc?.weekoff?.includes(date.dayName);
                            const isWeekOff = getWeekOffDay(date, filterBoardingLog, item?._doc?.department, depMonthSet) === "Week Off" ? true : false;
                            const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                            const isWeekOffWithManual = isWeekOff && matchingItemAllot;

                            const actualShiftTiming = findShiftTiming(item?._doc?.shifttiming);

                            const row = {
                                company: item?._doc?.company,
                                branch: item?._doc?.branch,
                                unit: item?._doc?.unit,
                                team: item?._doc?.team,
                                companyname: item?._doc?.companyname,
                                empcode: item?._doc?.empcode,
                                username: item?._doc?.username,
                                shifttiming: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?._doc?.department, depMonthSet),
                                date: date.formattedDate,
                                shiftmode: date.shiftMode,
                                shiftsts: findShiftTimingsts(getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?._doc?.department, depMonthSet)),
                            };

                            return row;
                        });
                        return userRows;
                    });

                // console.log(finaluser, 'finaluser')
                function filterData(data) {

                    const previousEntry = data.find(d => d.date === dateSelectedFormatOneMinus);
                    const firstEntry = data.find(d => d.date === dateSelectedFormat);
                    const secondEntry = data.find(d => d.date === dateSelectedFormatOnePlus);
                    if (!firstEntry) return [];
                    const ispreviousShiftWeekoff = previousEntry.shifttiming && previousEntry.shifttiming !== "" && previousEntry.shifttiming == "Week Off";
                    const isFirstShiftWeekoff = firstEntry.shifttiming && firstEntry.shifttiming !== "" && firstEntry.shifttiming == "Week Off";
                    const isSecondShiftWeekoff = secondEntry.shifttiming && secondEntry.shifttiming !== "" && secondEntry.shifttiming == "Week Off";
                    const isFirstShiftPM = firstEntry.shifttiming && firstEntry.shifttiming !== "" && firstEntry.shifttiming != "Week Off" ? firstEntry.shifttiming.split("to")[0].includes("PM") : "";
                    const isPreviousShiftPM = previousEntry.shifttiming && previousEntry.shifttiming !== "" && previousEntry.shifttiming != "Week Off" ? previousEntry.shifttiming.split("to")[0].includes("PM") : "";

                    const isMainShift = firstEntry.shiftmode === "Main Shift";
                    const isPlusShift = firstEntry.plusshift && firstEntry.plusshift != "";

                    // function convertTo24Hour(time12h) {
                    //   // Extract the AM/PM part
                    //   const modifier = time12h.slice(-2); // Last two characters "AM" or "PM"
                    //   const time = time12h.slice(0, -2); // Rest of the string, e.g., "06:00"

                    //   let [hours, minutes] = time.split(':');

                    //   if (modifier === 'PM' && hours !== '12') {
                    //     hours = parseInt(hours, 10) + 12;
                    //   }
                    //   if (modifier === 'AM' && hours === '12') {
                    //     hours = '00';
                    //   }

                    //   return `${hours}:${minutes}`;
                    // }
                    function convertTo24Hour(time) {
                        // Remove any extra spaces or unexpected characters
                        time = time.trim();

                        // Use regular expression to capture time and AM/PM
                        const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
                        if (!match) return null; // Return null if the format is incorrect

                        let hours = parseInt(match[1], 10);
                        const minutes = match[2];
                        const period = match[3];

                        // Convert to 24-hour format
                        if (period === "PM" && hours < 12) {
                            hours += 12;
                        }
                        if (period === "AM" && hours === 12) {
                            hours = 0;
                        }

                        // Format the time as 'HH:MM'
                        return `${hours.toString().padStart(2, '0')}:${minutes}`;
                    }

                    if (isFirstShiftWeekoff) {

                        let newFromTime = isPreviousShiftPM ? new Date(`${date}T10:00:00Z`) : new Date(`${date}T01:00:00Z`)
                        let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`)

                        shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
                        shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);


                        let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                        let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
                        shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + ((finalMin + 1) * 60 * 1000)));
                        shiftFromTime = new Date(newFromTime.getTime() + (60 * 1000));

                        shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));


                        data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime }
                        // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime')
                    } else if (isSecondShiftWeekoff) {

                        let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                        let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T10:00:00Z`) : new Date(`${newDateOnePlus}T01:00:00Z`)

                        shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                        shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`)


                        let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                        let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
                        shiftEndTime = new Date(newEndTime);
                        shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin * 60 * 1000)));
                        shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                        data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime }
                        // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTimesec')
                    }
                    else {

                        // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
                        let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                        let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`)

                        shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                        shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`)


                        let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                        let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
                        shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + ((finalMin + 1) * 60 * 1000)));
                        shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin * 60 * 1000)));

                        shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                        // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
                        data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime }
                    }

                    return data; // Return the original data if conditions are not met
                }
                userShiftTimings = filterData(finaluser.filter(d => d.shifttiming != undefined))
            }

            const dateTime = new Date(`${comparedate}T${comparetime}Z`);

            let filteredItem = null;

            if (userInfo && userInfo.processlog) {
                const groupedByMonthProcs = {};

                // Group items by month
                // userInfo.processlog &&
                userInfo.processlog.forEach((d) => {
                    const monthYear = d.date?.split("-").slice(0, 2).join("-");
                    if (!groupedByMonthProcs[monthYear]) {
                        groupedByMonthProcs[monthYear] = [];
                    }
                    groupedByMonthProcs[monthYear].push(d);
                });

                // Extract the last item of each group
                const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                // Filter the data array based on the month and year
                lastItemsForEachMonthPros.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });
                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                    const date = lastItemsForEachMonthPros[i].date;

                    if (req.body.date >= date) {
                        filteredItem = lastItemsForEachMonthPros[i];
                    } else {
                        break;
                    }
                }
            }
            let getprocessCode = filteredItem != undefined || filteredItem != null ? filteredItem.process : "";
            const filenamespiliteed = upload.mode == "Manual" ? upload.filename : upload.filenameupdated;

            // const datesplited = upload.mode == "Manual" ? upload.fromdate + " " + upload.time + ":00" : upload.dateval?.split(" IST")[0]

            let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
            let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

            function compareDateTimes(dateT, shiftFrom, shiftEnd) {
                // Parse the datetime strings into Date objects
                const dateTimeObj = new Date(dateT);
                const shiftFromTimeObj = new Date(shiftFrom);
                const shiftEndTimeObj = new Date(shiftEnd);
                // Perform the comparisons
                const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

                return isWithinShift;
            }

            if (compareDateTimes(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime)) {
                return {
                    user: upload.user,
                    fromtodate: `${(userShiftTimings.shiftFromTime).toISOString()}$${(userShiftTimings.shiftEndTime).toISOString()}`,
                    // todate: upload.todate,
                    vendor: upload.vendor,
                    category: upload.category,
                    dateval: upload.mode == "Manual" ? `${upload.fromdate} ${upload.time}:00` : `${upload.formatteddate} ${upload.formattedtime}`,
                    // time: upload.time,
                    filename: filenamespiliteed,
                    mode: upload.mode == "Manual" ? "Manual" : "Production",
                    empname: userInfo ? userInfo.companyname : "",
                    empcode: userInfo ? userInfo.empcode : "",
                    company: userInfo ? userInfo.company : "",
                    unit: userInfo ? userInfo.unit : "",
                    branch: userInfo ? userInfo.branch : "",
                    doj: userInfo ? userInfo.doj : "",
                    team: userInfo ? userInfo.team : "",
                    // shifttiming:userInfo2 ?  "07:00PMto03:00AM" : "",
                    // team: userInfo && userInfo._id,
                    weekoff: userShiftTimings && userShiftTimings?.shifttiming ? userShiftTimings?.shifttiming : "",
                    shiftsts: userShiftTimings && userShiftTimings.shiftsts ? userShiftTimings.shiftsts : "",

                    department: userInfo ? userInfo.department : "",
                    assignExpLog: userInfo ? userInfo.assignExpLog : [],
                    // username: userInfo && userInfo.username,
                    // empcode: userInfo && userInfo.empcode,
                    // _id: upload._id,
                    shiftpoints:
                        new Date(dateTime) >= shiftOnlyFromTime && new Date(dateTime) <= shiftOnlyEndTime
                            ? upload.mode == "Manual" ? finalunitrate * 8.333333333333333 : finalunitrate * finalflag * 8.333333333333333
                            // ((upload.filename === "Non Standard Indexing Data Entry Queue.xlsx" || upload.filename == "Non Standard Indexing Data Entry Queue" || upload.filename == "Snippet Verification.xlsx" || upload.filename == "Snippet Verification") ? finalunitrate * finalflag * 8.333333333333333 : finalunitrate * 8.333333333333333)
                            : 0,
                    processcode: getprocessCode,
                    unitid: upload.unitid,
                    // filename: upload.filename,
                    // points: finalunitrate * 8.333333333333333,
                    // points: (upload.filename === "Member Submitted CMS1500 Data Entry Queue.xlsx" || upload.filename == "Member Submitted CMS1500 Data Entry Queue") ? finalunitrate * 8.333333333333333 : (upload.mode == "Manual" ? (Number(upload.updatedunitrate) * 8.333333333333333) : finalpoints),
                    // points: upload.mode == "Manual" ? finalunitrate * 8.333333333333333 : finalunitrate * finalflag * 8.333333333333333,
                    points: finalunitrate * finalflag * 8.333333333333333,
                    //  (upload.filename === "Non Standard Indexing Data Entry Queue.xlsx" || upload.filename == "Non Standard Indexing Data Entry Queue" || upload.filename == "Snippet Verification.xlsx" || upload.filename == "Snippet Verification") ? finalunitrate * finalflag * 8.333333333333333 : finalunitrate * 8.333333333333333,
                    // unitrate: Number(upload.unitrate),
                    unitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate),
                    flag: upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount),
                };
            }
        });
    } catch (err) {
        console.log(err)
        const errorMessage = err.message === "Cannot read properties of undefined (reading 'shifttiming')" ? "shifttiming" : "Records not found";

        // Create a new ErrorHandler instance
        const error = new ErrorHandler(errorMessage, 404);

        // Send the response to the frontend
        return res.status(404).json({
            success: false,
            message: errorMessage,
        });

    }

    return res.status(200).json({
        productionupload,
    });
});


exports.productionUploadCheckZeroMismatchPresentOther = catchAsyncErrors(async (req, res, next) => {
    let count = 0;

    try {
        const { date, project } = req.body;

        // Step 1: Count initial zero-unitrate documents
        const [producionIndividualZeroCount, productionUploadZeroCount] = await Promise.all([
            ProducionIndividual.countDocuments({
                fromdate: new RegExp("^" + date),
                // unitrate: { $eq: 0 },
                unallothide: { $ne: "true" },
                status: { $eq: "Approved" },
                updatedunitrate: { $exists: false }
            }),
            ProductionUpload.countDocuments({
                dateval: new RegExp("^" + date),
                unitrate: { $eq: 0 },
                updatedunitrate: { $exists: false },
                unallothide: { $ne: "true" },



            }),


        ]);

        const zeroCount = producionIndividualZeroCount + productionUploadZeroCount;
        console.log(zeroCount, producionIndividualZeroCount, productionUploadZeroCount, 'zeroCount')

        // if (zeroCount === 0) {

        //   const [unitRates, categoryOpt] = await Promise.all([
        //      Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1 }).lean(),
        //      Categoryprod.find({}, { name: 1, flagstatus: 1, project: 1 }).lean()
        //     ]);

        //    const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
        //     const categoryMap = new Map(categoryOpt.map((item) => [item.project + "-" + item.name, item]));

        //    const mismatchedCount = await Promise.all([
        //     ProductionUpload.find({
        //        dateval: new RegExp("^" + date),
        //        unitrate: { $exists: true, $gt: 0 },
        //        flagcount: { $exists: true, $gt: 0 },
        //        unallothide: { $ne: "true" },

        //      }, { unitrate: 1, updatedunitrate: 1, flagcount: 1, updatedflag: 1, filename: 1, category: 1, vendor: 1 }).lean(),
        //      ProducionIndividual.find({
        //        fromdate: new RegExp("^" + date),
        //        updatedunitrate: { $exists: true, $ne: 0 },
        //        unallothide: { $ne: "true" },
        //       flagcount: { $exists: true, $gt: 0 },
        //       status: "Approved"
        //     }, { unitrate: 1, updatedunitrate: 1, flagcount: 1, updatedflag: 1, filename: 1, category: 1, vendor: 1 }).lean()
        //    ]).then(([productionUnmatched, producionIndividualManual]) => {
        //      const calculateMismatchCount = (data) => {
        //        return data.reduce((count, obj) => {
        //          const [filenameupdated] = obj.filename.split(".x");
        //          const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
        //         const matchCategory = categoryMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated);

        //         const mrateval = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
        //        const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);
        //        const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);

        //         const unitrateval = matchCategory && matchCategory.flagstatus === "Yes" ? finalunitrate / finalflag : finalunitrate;

        //         return mrateval !== unitrateval ? count + 1 : count;
        //       }, 0);
        //      };

        //     const productionUnmatchedMismatchCount = calculateMismatchCount(productionUnmatched);
        //      const producionIndividualManualMismatchCount = calculateMismatchCount(producionIndividualManual);

        //      return productionUnmatchedMismatchCount + producionIndividualManualMismatchCount;
        //     });

        count = zeroCount
        //+ mismatchedCount;
        // } else {
        //   count = zeroCount;
        //  }
        // console.log(count,zeroCount,"count,zeroCount")
    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({ count });
});

// get All ProductionUpload => /api/productionuploads
exports.productionDayCategoryIdFilterOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload;
    try {

        const { userid, category, startdate, enddate, mode } = req.body;

        const startDateSplitted = startdate.split('T')[0];
        const endDateSplited = enddate.split('T')[0];

        let query = {
            user: userid, filename: `${category}.xlsx`,
            dateobjformatdate: { $gte: new Date(startdate), $lte: new Date(enddate) },
        }
        let queryManual = {
            user: userid, filename: category, fromdate: { $in: [startDateSplitted, endDateSplited] },
        }

        if (mode == "Manual") {
            productionupload = await ProducionIndividual.find(queryManual, { fromdate: 1, time: 1, vendor: 1, user: 1, unitid: 1, filename: 1, category: 1, flagcount: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 });
        } else {
            productionupload = await ProductionUpload.find(query, { dateval: 1, vendor: 1, user: 1, unitid: 1, filename: 1, category: 1, flagcount: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 });
        }

        console.log(productionupload.length)
    } catch (err) {
        console.log(err.message);
    }
    // if (!productionupload) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});


exports.getAllProductionUploadFilenamesonlyBulkDownloadOther = catchAsyncErrors(async (req, res, next) => {
    let productionupload, matchedData;
    try {
        matchedData = await ProductionUpload.find({ uniqueid: req.body.id }, { filenamenew: 1 }).lean();

        productionupload = matchedData.reduce((acc, current) => {
            const existingItem = acc.find((item) => item.filenamenew === current.filenamenew);

            if (existingItem) {
                existingItem.totaldata += 1;
            } else {
                acc.push({
                    // filename: current.filename,
                    filenamenew: current.filenamenew,
                    totaldata: 1,
                });
            }

            return acc; // Don't forget to return the accumulator at the end of each iteration
        }, []);
    } catch (err) {
        console.log(err.message);
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionupload,
    });
});




