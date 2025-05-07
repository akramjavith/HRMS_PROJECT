const AssetSoftwareDetails = require("../../../model/modules/account/assetsoftwaredetails");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");




//get All AssetSoftwareDetailss =>/api/assetsoftwaredetails
exports.getAllAssetSoftwareDetails = catchAsyncErrors(async (req, res, next) => {
    let assetsoftwaredetails;
    try {
        assetsoftwaredetails = await AssetSoftwareDetails.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetsoftwaredetails) {
        return next(new ErrorHandler("AssetSoftwareDetails not found!", 404));
    }
    return res.status(200).json({
        assetsoftwaredetails,
    });
});





//create new assetsoftwaredetails => /api/assetsoftwaredetails/new
exports.addAssetSoftwareDetails = catchAsyncErrors(async (req, res, next) => {
    let aassetsoftwaredetails = await AssetSoftwareDetails.create(req.body);
    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Single assetsoftwaredetails=> /api/assetsoftwaredetails/:id
exports.getSingleAssetSoftwareDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetsoftwaredetails = await AssetSoftwareDetails.findById(id);
    if (!sassetsoftwaredetails) {
        return next(new ErrorHandler("AssetSoftwareDetails not found", 404));
    }
    return res.status(200).json({
        sassetsoftwaredetails,
    });
});
//update assetsoftwaredetails by id => /api/assetsoftwaredetails/:id
exports.updateAssetSoftwareDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetsoftwaredetails = await AssetSoftwareDetails.findByIdAndUpdate(id, req.body);
    if (!uassetsoftwaredetails) {
        return next(new ErrorHandler("AssetSoftwareDetails not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});
//delete assetsoftwaredetails by id => /api/assetsoftwaredetails/:id
exports.deleteAssetSoftwareDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dassetsoftwaredetails = await AssetSoftwareDetails.findByIdAndRemove(id);
    if (!dassetsoftwaredetails) {
        return next(new ErrorHandler("AssetSoftwareDetails not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllAssetSoftwaredetailFilterAccess = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, material } = req.body;
    console.log(material, "material")
    let query = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
        unit: branchObj.unit,
    }));

    query = { $or: branchFilter };

    if (company && company?.length > 0) {
        query.company = { $in: company }
    }

    if (branch && branch?.length > 0) {
        query.branch = { $in: branch }
    }
    if (unit && unit?.length > 0) {
        query.unit = { $in: unit }
    }
    if (material && material?.length > 0) {
        query.assetmaterialcode = { $in: material.flat() }
    }

    let queryoverall = {};
    // Construct the filter query based on the assignbranch array
    const branchFilterOverall = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
        unit: branchObj.unit,
    }));

    queryoverall = { $or: branchFilterOverall };

    if (branchFilter.length > 0) {
        queryoverall = { $or: branchFilter };
    }
    if (company && company?.length > 0) {
        queryoverall.company = { $in: company }
    }

    if (branch && branch?.length > 0) {
        queryoverall.branch = { $in: branch }
    }
    if (unit && unit?.length > 0) {
        queryoverall.unit = { $in: unit }
    }
    if (material && material?.length > 0) {
        queryoverall.assetmaterialcode = { $in: material.flat() }
    }

    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            console.log(filter, "filter")
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                if (filter.column == "purchasedate") {
                    const [day, month, year] = filter.value.split("/")
                    let formattedValue = `${year}-${month}-${day}`
                    conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
                }
                else {

                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
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
        const orConditions = regexTerms.map((regex) => ({
            $or: [
                { company: regex },
                { branch: regex },
                { unit: regex },
                { floor: regex },
                { area: regex },
                { location: regex },
                { subcomponent: regex },
                { assetmaterialcode: regex },
                { type: regex },
                { warranty: regex },
                { purchasedate: regex },
                { vendor: regex },
                { vendorgroup: regex },
                { address: regex },
                { phonenumber: regex },
                { options: regex },
                { status: regex },
                { materialvendor: regex },
                { materialvendorgroup: regex },
                { materialaddress: regex },
                { materialphonenumber: regex },
            ],

        }));
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

        const totalProjects = await AssetSoftwareDetails.countDocuments(query, {
            company: 1,
            branch: 1,
            unit: 1,
            countquantity: 1,
            floor: 1,
            area: 1,
            location: 1,
            assetmaterialcode: 1,
            address: 1,
            phonenumber: 1,
            type: 1,
            Options: 1,
            status: 1,
            subcomponent: 1,
            warranty: 1,
            purchasedate: 1,
            vendor: 1,
            vendorgroup: 1,

        });

        const totalProjectsData = await AssetSoftwareDetails.find(queryoverall, {
            company: 1,
            branch: 1,
            unit: 1,
            countquantity: 1,
            floor: 1,
            area: 1,
            location: 1,
            assetmaterialcode: 1,
            address: 1,
            phonenumber: 1,
            type: 1,
            Options: 1,
            status: 1,
            subcomponent: 1,
            warranty: 1,
            purchasedate: 1,
            vendor: 1,
            vendorgroup: 1,
        });

        const result = await AssetSoftwareDetails.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        // console.log(result.length, 'result')
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











