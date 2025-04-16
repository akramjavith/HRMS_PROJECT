const AssetWorkGrp = require("../../../model/modules/account/assetworkstationgrouping");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");



function createFilterCondition(column, condition, value) {
    switch (condition) {
        case "Contains":
            return { [column]: new RegExp(value, 'i') };
        case "Does Not Contain":
            return { [column]: { $not: new RegExp(value, 'i') } };
        case "Equals":
            return { [column]: value };
        case "Does Not Equal":
            return { [column]: { $ne: value } };
        case "Begins With":
            return { [column]: new RegExp(`^${value}`, 'i') };
        case "Ends With":
            return { [column]: new RegExp(`${value}$`, 'i') };
        case "Blank":
            return { [column]: { $exists: false } };
        case "Not Blank":
            return { [column]: { $exists: true } };
        default:
            return {};
    }
}

//get All AssetWorkGrps =>/api/assetworkstationgrouping
exports.getAllAssetWorkGrp = catchAsyncErrors(async (req, res, next) => {
    let assetworkstationgrouping;
    try {
        assetworkstationgrouping = await AssetWorkGrp.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetworkstationgrouping) {
        return next(new ErrorHandler("AssetWorkGrp not found!", 404));
    }
    return res.status(200).json({
        assetworkstationgrouping,
    });
});

//create new assetworkstationgrouping => /api/assetworkstationgrouping/new
exports.addAssetWorkGrp = catchAsyncErrors(async (req, res, next) => {
    let aassetworkstationgrouping = await AssetWorkGrp.create(req.body);
    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Single assetworkstationgrouping=> /api/assetworkstationgrouping/:id
exports.getSingleAssetWorkGrp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetworkstationgrouping = await AssetWorkGrp.findById(id);
    if (!sassetworkstationgrouping) {
        return next(new ErrorHandler("AssetWorkGrp not found", 404));
    }
    return res.status(200).json({
        sassetworkstationgrouping,
    });
});
//update assetworkstationgrouping by id => /api/assetworkstationgrouping/:id
exports.updateAssetWorkGrp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetworkstationgrouping = await AssetWorkGrp.findByIdAndUpdate(id, req.body);
    if (!uassetworkstationgrouping) {
        return next(new ErrorHandler("AssetWorkGrp not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});
//delete assetworkstationgrouping by id => /api/assetworkstationgrouping/:id
exports.deleteAssetWorkGrp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dassetworkstationgrouping = await AssetWorkGrp.findByIdAndRemove(id);
    if (!dassetworkstationgrouping) {
        return next(new ErrorHandler("AssetWorkGrp not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});


// exports.getAllAssetWorkGrpAcces = catchAsyncErrors(async (req, res, next) => {
//     let assetworkstationgrouping;
//     try {
//         const { assignbranch } = req.body;
//         let filterQuery = {};
//         // Construct the filter query based on the assignbranch array
//         const branchFilter = assignbranch.map((branchObj) => ({
//             branch: branchObj.branch,
//             company: branchObj.company,
//             unit: branchObj.unit,
//         }));

//         // Use $or to filter incomes that match any of the branch, company, and unit combinations
//         if (branchFilter.length > 0) {
//             filterQuery = { $or: branchFilter };
//         }
//         assetworkstationgrouping = await AssetWorkGrp.find(filterQuery);
//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     if (!assetworkstationgrouping) {
//         return next(new ErrorHandler("AssetWorkGrp not found!", 404));
//     }
//     return res.status(200).json({
//         assetworkstationgrouping,
//     });
// });


exports.getAllAssetWorkGrpAcces = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

    let query = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
        unit: branchObj.unit,
    }));

    query = { $or: branchFilter };

    let queryoverall = {};
    // Construct the filter query based on the assignbranch array
    const branchFilterOverall = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
        unit: branchObj.unit,
    }));

    queryoverall = { $or: branchFilterOverall };

    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            console.log(filter, "filter")
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                // if (filter.column == "purchasedate") {
                //   const [day, month, year] = filter.value.split("/")
                //   let formattedValue = `${year}-${month}-${day}`
                //   conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
                // }
                // else {

                conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                // }
            }
        });
    }

    if (searchQuery && searchQuery !== undefined) {
        const searchTermsArray = searchQuery.split(" ");
        const regexTerms = searchTermsArray.map((term) => {

            if (!isNaN(term)) {
                return parseInt(term, 10); // Convert to Number
            }

            // Check if the term is in the date format DD/MM/YYYY
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateRegex.test(term)) {
                // Convert DD/MM/YYYY to YYYY-MM-DD
                const [day, month, year] = term.split("/");
                const formattedDate = `${year}-${month}-${day}`;
                return new RegExp(formattedDate, "i");
            }
            return new RegExp(term, "i");
        });
        // console.log(regexTerms, "regexTerms")
        const orConditions = regexTerms.map((regex) => {
            if (typeof regex === "number") {
                // Special case for numeric values
                return {
                    $or: [
                        { uniqueid: regex }, // Match numeric fields
                    ],
                };
            }

            // General regex case
            return {
                $or: [
                    { company: regex },
                    { branch: regex },
                    { unit: regex },
                    { floor: regex },
                    { area: regex },
                    { location: regex },
                    { component: regex },
                    { assetmaterial: regex },
                    { workstation: regex },
                    { subcomponents: regex },
                ],
            };
        });
        // console.log(searchQuery, "searchQuery")
        query = {
            $and: [
                {
                    $or: assignbranch.map((branchObj) => ({
                        branch: branchObj.branch,
                        company: branchObj.company,
                        unit: branchObj.unit,
                    }))
                },
                ...orConditions,
            ],
        };
    }


    // console.log(query, "query")

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
        if (logicOperator === "AND") {
            query.$and = conditions;
        } else if (logicOperator === "OR") {
            query.$or = conditions;
        }
    }
    // console.log(conditions, "conditions")
    try {

        const totalProjects = await AssetWorkGrp.countDocuments(query);

        const totalProjectsData = await AssetWorkGrp.find(queryoverall);

        const result = await AssetWorkGrp.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        console.log(result.length, 'resultmwork')
        res.status(200).json({
            totalProjects,
            totalProjectsData,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
        });
    } catch (err) {
        console.log(err, "workgro")
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getAllEmployeeassetAccess = catchAsyncErrors(async (req, res, next) => {
    let employeeassets;
    try {
        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));
        const branchFilterTo = assignbranch.map((branchObj) => ({
            branchto: branchObj.branch,
            companyto: branchObj.company,
            unitto: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0 || branchFilterTo.length > 0) {
            filterQuery = {
                $or: [...branchFilter, ...branchFilterTo],
            };
        }
        employeeassets = await Employeeasset.find(filterQuery);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!employeeassets) {
        return next(new ErrorHandler("Employeeasset not found!", 404));
    }
    return res.status(200).json({
        employeeassets,
    });
});


exports.getAllAssetWorkstationgroupingListFilter = catchAsyncErrors(async (req, res, next) => {
    let materialipfilter;
    try {
        const { company, branch, unit } = req.body;
        let query = {};

        if (company && company.length > 0) {
            query.company = { $in: company };
        }

        if (branch && branch.length > 0) {
            query.branch = { $in: branch };
        }

        if (unit && unit.length > 0) {
            query.unit = { $in: unit };
        }
        materialipfilter = await AssetWorkGrp.find(query);
        console.log(materialipfilter.length)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!materialipfilter) {
        return next(new ErrorHandler('AssetWorkGrp not found!', 404));
    }
    return res.status(200).json({
        materialipfilter
    });
})