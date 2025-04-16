const AssetMaterialIP = require("../../../model/modules/account/assetmaterialip");
const User = require("../../../model/login/auth");
const Assetdetail = require('../../../model/modules/account/assetdetails');
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

//get All AssetMaterialIPs =>/api/assetmaterialip
exports.getAllAssetMaterialIP = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialip;
    try {
        assetmaterialip = await AssetMaterialIP.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetmaterialip) {
        return next(new ErrorHandler("AssetMaterialIP not found!", 404));
    }
    return res.status(200).json({
        assetmaterialip,
    });
});



exports.getAllAssetMaterialIPLimited = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialip;
    try {
        assetmaterialip = await AssetMaterialIP.find({}, {
            company: 1, branch: 1, unit: 1, component: 1, floor: 1,

            location: 1, area: 1, assetmaterial: 1, assetmaterialcheck: 1, subcomponents: 1, ip: 1, ebusage: 1, empdistribution: 1,
            maintenance: 1, uniqueid: 1, operatingsoftware: 1
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetmaterialip) {
        return next(new ErrorHandler("AssetMaterialIP not found!", 404));
    }
    return res.status(200).json({
        assetmaterialip,
    });
});

//create new assetmaterialip => /api/assetmaterialip/new
exports.addAssetMaterialIP = catchAsyncErrors(async (req, res, next) => {
    let aassetmaterialip = await AssetMaterialIP.create(req.body);
    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Single assetmaterialip=> /api/assetmaterialip/:id
exports.getSingleAssetMaterialIP = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetmaterialip = await AssetMaterialIP.findById(id);
    if (!sassetmaterialip) {
        return next(new ErrorHandler("AssetMaterialIP not found", 404));
    }
    return res.status(200).json({
        sassetmaterialip,
    });
});
//update assetmaterialip by id => /api/assetmaterialip/:id
exports.updateAssetMaterialIP = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetmaterialip = await AssetMaterialIP.findByIdAndUpdate(id, req.body);
    if (!uassetmaterialip) {
        return next(new ErrorHandler("AssetMaterialIP not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});
//delete assetmaterialip by id => /api/assetmaterialip/:id
exports.deleteAssetMaterialIP = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dassetmaterialip = await AssetMaterialIP.findByIdAndRemove(id);
    if (!dassetmaterialip) {
        return next(new ErrorHandler("AssetMaterialIP not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});



exports.getAllAssetMaterialIPLimitedAccess = catchAsyncErrors(async (req, res, next) => {
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
                    { subcomponents: regex },
                    // { uniqueid: regex },
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

        const totalProjects = await AssetMaterialIP.countDocuments(query, {
            company: 1, branch: 1, unit: 1, component: 1, floor: 1,
            location: 1, area: 1, assetmaterial: 1, assetmaterialcheck: 1, subcomponents: 1, ip: 1, ebusage: 1, empdistribution: 1,
            maintenance: 1, uniqueid: 1, operatingsoftware: 1
        });

        const totalProjectsData = await AssetMaterialIP.find(queryoverall, {
            company: 1, branch: 1, unit: 1, component: 1, floor: 1,
            location: 1, area: 1, assetmaterial: 1, assetmaterialcheck: 1, subcomponents: 1, ip: 1, ebusage: 1, empdistribution: 1,
            maintenance: 1, uniqueid: 1, operatingsoftware: 1
        });

        const result = await AssetMaterialIP.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        console.log(result.length, 'resultmip')
        res.status(200).json({
            totalProjects,
            totalProjectsData,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});



exports.getAllAssetMaterialIPListFilter = catchAsyncErrors(async (req, res, next) => {
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
        materialipfilter = await AssetMaterialIP.find(query);
        // console.log(materialipfilter.length)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!materialipfilter) {
        return next(new ErrorHandler('AssetMaterialIP not found!', 404));
    }
    return res.status(200).json({
        materialipfilter
    });
})



exports.getAllMaterialWiseAssetList = catchAsyncErrors(async (req, res, next) => {
    let materialip;
    try {
        let materialipall = await AssetMaterialIP.find(query);


        const unitRates = await Assetdetail.find({}, { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1 }).lean();

        // Create a Map for quick lookups by "category-subcategory"
        const unitRateMap = new Map(unitRates.map(item => [`${item.company}-${item.branch}-${item.unit}-${item.floor}-${item.area}-${item.location}`, item]));

        // Map over queuetypemastersall to enrich each object
        materialip = materialipall.map(item => {
            // Find a matching entry in the Map
            const matchUnitrate = unitRateMap.get(`${item.company}-${item.branch}-${item.unit}-${item.floor}-${item.area}-${item.location}`);

            // Extract the orate value (default to null if not found)
            const mrateval = matchUnitrate ? String(matchUnitrate.component) : null;

            // Return the updated object
            return {
                ...item._doc,
                component: mrateval,
            };
        });


        // console.log(queuetypemasters[0], "queuetypemasters")


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!materialip) {
        return next(new ErrorHandler('QueueTypeMaster not found!', 404));
    }
    return res.status(200).json({
        materialip
    });
})
