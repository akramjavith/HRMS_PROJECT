const NonProductionUnitRate = require('../../../model/modules/production/nonproductionunitrate');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get all nonproductionunitrate => /api/nonproductionunitrate

exports.getAllNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    let nonproductionunitrate
    try {
        nonproductionunitrate = await NonProductionUnitRate.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!nonproductionunitrate) {
        return next(new ErrorHandler('category not found', 404));
    }

    return res.status(200).json({
        nonproductionunitrate
    });

})

// exports.getAllNonProductionUnitRateForPagination = catchAsyncErrors(async (req, res, next) => {
//     let nonproductionunitrate

//     try {
//         const {
//             page, pageSize, allFilters, logicOperator, searchQuery,
//         } = req.body;

//         let query = {};

//         // Advanced search filter
//         let conditions = [];
//         if (allFilters?.length > 0) {
//             allFilters.forEach(filter => {
//                 if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
//                     conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
//                 }
//             });
//         }

//         // Apply logicOperator to combine conditions
//         if (conditions.length > 0) {
//             query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
//         }

//         // Search query
//         if (searchQuery) {
//             const regexTerms = searchQuery.split(" ").map(term => new RegExp(term, "i"));
//             query.$or = regexTerms.map(regex => ({
//                 $or: [
//                     { autoid: regex }, { status: regex }, { mode: regex },
//                     { priority: regex }, { module: regex }, { submodule: regex },
//                     { mainpage: regex }, { subsubpage: regex }, { category: regex },
//                     { subcategory: regex }, { createddate: regex }, { createdtime: regex },
//                     { createdby: regex }
//                 ]
//             }));
//         }


//         nonproductionunitrate = await NonProductionUnitRate.find()
//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     if (!nonproductionunitrate) {
//         return next(new ErrorHandler('category not found', 404));
//     }

//     return res.status(200).json({
//         nonproductionunitrate
//     });

// })

exports.getAllNonProductionUnitRateForPagination = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, allFilters, logicOperator, searchQuery } = req.body;


    let query = {};
    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
            }
        });
    }

    if (searchQuery) {
        const searchTermsArray = searchQuery.split(" ");

        const orConditions = searchTermsArray.map((term) => {
            const conditions = [
                { categoryname: new RegExp(term, "i") },
                { subcategory: new RegExp(term, "i") },
                { base: new RegExp(term, "i") },
                { process: new RegExp(term, "i") }
            ];

            // Only add numeric conditions if term is a number
            if (!isNaN(term)) {
                const numTerm = parseFloat(term);
                conditions.push(
                    { mindays: numTerm },
                    { minhours: numTerm },
                    { minminutes: numTerm },
                    { maxdays: numTerm },
                    { maxhours: numTerm },
                    { maxminutes: numTerm },
                    { rate: numTerm }
                );
            }

            return { $or: conditions };
        });

        query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
        if (logicOperator === "AND") {
            query.$and = [...(query.$and || []), ...conditions];
        } else if (logicOperator === "OR") {
            query.$or = [...(query.$or || []), ...conditions];
        }
    }

    try {
        const totalProjects = await NonProductionUnitRate.countDocuments(query);
        const result = await NonProductionUnitRate.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();

        res.status(200).json({
            totalProjects,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize)
        });
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.addNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {


    const { categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate } = req.body;

    let filteredData = await NonProductionUnitRate.findOne({ categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate });
    if (!filteredData) {
        await NonProductionUnitRate.create(req.body);
        return res.status(200).json({
            message: 'Successfully added'
        })
    }

    return next(new ErrorHandler('Data Already Exist!'));
})

exports.getSingleNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let snonproductionunitrate = await NonProductionUnitRate.findById(id);
    if (!snonproductionunitrate) {
        return next(new ErrorHandler('Data not found'));

    }
    return res.status(200).json({
        snonproductionunitrate
    });

});

exports.updateNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    const { categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate } = req.body;

    let filteredData = await NonProductionUnitRate.findOne({ _id: { $ne: id }, categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate });
    if (!filteredData) {

        let unonproductionunitrate = await NonProductionUnitRate.findByIdAndUpdate(id, req.body);
        if (!unonproductionunitrate) {
            return next(new ErrorHandler('Data Not Found!'));
        }
        return res.status(200).json({
            message: 'Update Successfully', unonproductionunitrate
        });

    }
    return next(new ErrorHandler('Data Already Exist!'));


});



//delete ujobopening by id => /api/jobopening/:id
exports.deleteNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategoryandsubcategory = await NonProductionUnitRate.findByIdAndRemove(id);
    if (!dcategoryandsubcategory) {
        return next(new ErrorHandler('Data not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


function createFilterCondition(column, condition, value) {
    console.log(column, condition, value);

    // Map frontend column names to database field names
    const columnMappings = {
        'category': 'categoryname',
        // Add other mappings as needed
    };

    // Get the actual database field name
    const dbField = columnMappings[column] || column;

    // List of numeric fields that shouldn't use regex
    const numericFields = [
        'mindays', 'minhours', 'minminutes',
        'maxdays', 'maxhours', 'maxminutes',
        'rate'
    ];

    // Check if the field is numeric
    const isNumericField = numericFields.includes(dbField);

    switch (condition) {
        case "Contains":
            if (isNumericField) {
                // For numeric fields, look for exact match when "Contains" is selected
                return { [dbField]: parseFloat(value) || 0 };
            }
            return { [dbField]: new RegExp(value, 'i') };
        case "Does Not Contain":
            if (isNumericField) {
                return { [dbField]: { $ne: parseFloat(value) || 0 } };
            }
            return { [dbField]: { $not: new RegExp(value, 'i') } };
        case "Equals":
            return { [dbField]: isNumericField ? parseFloat(value) || 0 : value };
        case "Does Not Equal":
            return { [dbField]: { $ne: isNumericField ? parseFloat(value) || 0 : value } };
        case "Begins With":
            if (isNumericField) {
                // Not really meaningful for numbers, so treat as equals
                return { [dbField]: parseFloat(value) || 0 };
            }
            return { [dbField]: new RegExp(`^${value}`, 'i') };
        case "Ends With":
            if (isNumericField) {
                // Not really meaningful for numbers, so treat as equals
                return { [dbField]: parseFloat(value) || 0 };
            }
            return { [dbField]: new RegExp(`${value}$`, 'i') };
        case "Blank":
            return {
                $or: [
                    { [dbField]: { $exists: false } },
                    { [dbField]: null },
                    { [dbField]: isNumericField ? 0 : "" }
                ]
            };
        case "Not Blank":
            return {
                [dbField]: {
                    $exists: true,
                    $ne: null,
                    $ne: isNumericField ? 0 : ""
                }
            };
        default:
            return {};
    }
}



