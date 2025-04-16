const Assetdetail = require('../../../model/modules/account/assetdetails');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


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

//get All Assetdetail =>/api/Assetdetail
exports.getAllAssetdetail = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find()

    // console.log(assetdetails.length, "alalaalal")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})
//get All Assetdetail =>/api/Assetdetail
exports.getTicketAllAssetdetail = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ material: req.bodymaterial, workstation: req.body.workstation })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})
exports.getBoardingAssetdetails = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})
exports.getBranchFloorAssetdetail = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ branch: req.body.branch, floor: req.body.floor, })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})
exports.getAllAssetdetailRepairFilter = catchAsyncErrors(
  async (req, res, next) => {
    let assetdetails;
    try {
      // console.log(req.body, "repari")
      assetdetails = await Assetdetail.updateMany(
        {
          company: req.body.company,
          branch: req.body.branch,
          unit: req.body.unit,
          floor: req.body.floor,
          area: req.body.area,
          location: { $in: req.body.location },
          // location: req.body.location,
          material: req.body.material,
          code: req.body.code,
        },
        {
          $set: {
            status: req.body.status,
            repairproblem: req.body.problem,
          },
        }
      );
      // console.log(assetdetails, "assetdetails")
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    if (!assetdetails) {
      return next(new ErrorHandler("Assetdetail not found!", 404));
    }
    return res.status(200).json({
      assetdetails,
    });
  }
);
exports.getAllRepairedAsset = catchAsyncErrors(async (req, res, next) => {
  let repairedasset;
  try {
    repairedasset = await Assetdetail.find(
      {
        status: "Repair",
      },
      {
        company: 1,
        branch: 1,
        unit: 1,
        floor: 1,
        area: 1,
        location: 1,
        material: 1,
        status: 1,
        assignedthrough: 1,
        repairproblem: 1,
        code: 1,
        ticketid: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!repairedasset) {
    return next(new ErrorHandler("Assetdetail not found!", 404));
  }
  return res.status(200).json({
    repairedasset,
  });
});
exports.getAllDamagedAsset = catchAsyncErrors(async (req, res, next) => {
  let damagedasset;
  try {
    damagedasset = await Assetdetail.find(
      {
        status: "Damage",
      },
      {
        company: 1,
        branch: 1,
        unit: 1,
        floor: 1,
        area: 1,
        location: 1,
        material: 1,
        status: 1,
        assignedthrough: 1,
        repairproblem: 1,
        code: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!damagedasset) {
    return next(new ErrorHandler("Assetdetail not found!", 404));
  }
  return res.status(200).json({
    damagedasset,
  });
});


exports.getAllAssetdetailCountLimited = catchAsyncErrors(async (req, res, next) => {
  let assetdetailslimited;
  try {
    assetdetailslimited = await Assetdetail.find({}, {
      material: 1,
      code: 1,
    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetailslimited) {
    return next(new ErrorHandler('Assetdetail Limited not found!', 404));
  }
  return res.status(200).json({
    assetdetailslimited
  });
})
exports.getAllAssetdetailFilter = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({}, {
      company: 1,
      branch: 1,
      unit: 1,
      countquantity: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      code: 1,
      countquantity: 1,
      rate: 1,
      warranty: 1,
      purchasedate: 1,
      vendor: 1,
      vendorgroup: 1,
      files: 1,
      status: 1,
      assignedthrough: 1,
      repairproblem: 1

    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})

exports.getAllAssetdetailCountFilter = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ material: req.body.material }, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      countquantity: 1,
      location: 1,
      workstation: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      code: 1,
      countquantity: 1,
      rate: 1,
      warranty: 1,
      purchasedate: 1,
      vendor: 1,
      files: 1,
      materialcountcode: 1
    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})


//create new Assetdetail => /api/Assetdetail/new
exports.addAssetdetail = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aAssetdetails = await Assetdetail.create(req.body);
  return res.status(200).json({
    message: 'Successfully added!'
  });
})

// get Single Assetdetail => /api/Assetdetail/:id
exports.getSingleAssetdetail = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sassetdetail = await Assetdetail.findById(id);
  if (!sassetdetail) {
    return next(new ErrorHandler('Assetdetail not found', 404));
  }
  return res.status(200).json({
    sassetdetail
  })
})

//update Assetdetail by id => /api/Assetdetail/:id
exports.updateAssetdetail = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetdetails = await Assetdetail.findByIdAndUpdate(id, req.body);
  if (!uassetdetails) {
    return next(new ErrorHandler('Assetdetail not found', 404));
  }

  return res.status(200).json({ message: 'Updated successfully' });
})

//delete Assetdetail by id => /api/Assetdetail/:id
exports.deleteAssetdetail = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dgroup = await Assetdetail.findByIdAndRemove(id);
  if (!dgroup) {
    return next(new ErrorHandler('Assetdetail not found', 404));
  }

  return res.status(200).json({ message: 'Deleted successfully' });
})
exports.getAllAssetdetailStockLimited = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ status: "Assign" }, {
      company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, material: 1, countquantity: 1, status: 1,

      assettype: 1, asset: 1, component: 1
    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})



exports.getAllAssetdetailStockLimitedLog = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {




    assetdetails = await Assetdetail.find({
      status: "Assign", company: req.body.company,
      material: req.body.productname, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
      location: req.body.location
    }, {
      company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, material: 1, status: 1, countquantity: 1, addedby: 1

    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})

exports.getAllAssetdetailStockLimited = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({ status: "Assign" }, {
      company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, material: 1, countquantity: 1, status: 1,

      assettype: 1, asset: 1, component: 1
    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})
exports.makeSingleAssetRepair = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.updateMany(
      {
        code: req.body.materialcode,
      },
      {
        $set: {
          status: req.body.status,
          assignedthrough: req.body.assignedthrough,
          ticketid: req.body.ticketid,
        },
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!assetdetails) {
    return next(new ErrorHandler("Assetdetail not found!", 404));
  }
  return res.status(200).json({
    assetdetails,
  });
});

exports.getAllAssetdetailOverallAssetLimited = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    assetdetails = await Assetdetail.find({}, {
      material: 1, code: 1

    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})




exports.getOverallassetTableSort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let allusers;
  let totalProjects, paginatedData, isEmptyData, result;

  try {
    // const query = searchQuery ? { companyname: { $regex: searchQuery, $options: 'i' } } : {};
    const anse = await Assetdetail.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);



    totalProjects = await Assetdetail.countDocuments();

    allusers = await Assetdetail.find()
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


exports.getAllRepairedAssetAccess = catchAsyncErrors(async (req, res, next) => {
  let repairedasset, query;
  try {

    const { assignbranch } = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = { $or: branchFilter };
    }


    query = {
      status: "Repair",
      ...filterQuery
    }

    repairedasset = await Assetdetail.find(
      query,
      {
        company: 1,
        branch: 1,
        unit: 1,
        floor: 1,
        area: 1,
        location: 1,
        material: 1,
        status: 1,
        assignedthrough: 1,
        repairproblem: 1,
        code: 1,
        ticketid: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!repairedasset) {
    return next(new ErrorHandler("Assetdetail not found!", 404));
  }
  return res.status(200).json({
    repairedasset,
  });
});


exports.getAllDamagedAssetAccess = catchAsyncErrors(async (req, res, next) => {
  let damagedasset, query;
  try {
    const { assignbranch } = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = { $or: branchFilter };
    }

    query = {
      status: "Damage",
      ...filterQuery
    }

    damagedasset = await Assetdetail.find(
      query,
      {
        company: 1,
        branch: 1,
        unit: 1,
        floor: 1,
        area: 1,
        location: 1,
        material: 1,
        status: 1,
        assignedthrough: 1,
        repairproblem: 1,
        code: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!damagedasset) {
    return next(new ErrorHandler("Assetdetail not found!", 404));
  }
  return res.status(200).json({
    damagedasset,
  });
});

exports.getAllAssetdetailFilterAccessOld = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    const { assignbranch } = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    // if (branchFilter.length > 0) {
    filterQuery = { $or: branchFilter };
    // }

    assetdetails = await Assetdetail.find(filterQuery, {
      company: 1,
      branch: 1,
      unit: 1,
      countquantity: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      code: 1,
      rate: 1,
      warranty: 1,
      purchasedate: 1,
      vendor: 1,
      vendorgroup: 1,
      files: 1,
      status: 1,
      assignedthrough: 1,
      repairproblem: 1

    })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})


exports.getAllAssetdetailFilterAccess = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, material } = req.body;

  let query = {};

  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));

  if (branchFilter.length > 0) {
    query = { $or: branchFilter };
  }
  const status = ["In Working", "Repair", "Damage"];
  if (company && company?.length > 0) {
    query.company = { $in: company }
  }
  if (status && status?.length > 0) {
    query.status = { $in: status }
  }
  if (branch && branch?.length > 0) {
    query.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    query.unit = { $in: unit }
  }
  if (material && material?.length > 0) {
    query.material = { $in: material }
  }

  let queryoverall = {};

  if (branchFilter.length > 0) {
    queryoverall = { $or: branchFilter };
  }

  if (status && status?.length > 0) {
    queryoverall.status = { $in: status }
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
    queryoverall.material = { $in: material }
  }



  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
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
        { countquantity: regex },
        { floor: regex },
        { area: regex },
        { location: regex },
        { workstation: regex },
        { asset: regex },
        { assettype: regex },
        { material: regex },
        { component: regex },
        { subcomponent: regex },
        { code: regex },
        { rate: regex },
        { warranty: regex },
        { purchasedate: regex },
        { vendor: regex },
        { vendorgroup: regex },
        { files: regex },
        { status: regex },
        { assignedthrough: regex },
        { repairproblem: regex },
      ],

    }));
    // console.log(searchQuery, "searchQuery")
    query = {
      $and: [
        query,
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

    const totalProjects = await Assetdetail.countDocuments(query, {
      company: 1,
      branch: 1,
      unit: 1,
      countquantity: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      code: 1,
      rate: 1,
      warranty: 1,
      purchasedate: 1,
      vendor: 1,
      vendorgroup: 1,
      files: 1,
      status: 1,
      assignedthrough: 1,
      repairproblem: 1
    });

    const totalProjectsData = await Assetdetail.find(queryoverall, {
      company: 1,
      branch: 1,
      unit: 1,
      countquantity: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      code: 1,
      rate: 1,
      warranty: 1,
      purchasedate: 1,
      vendor: 1,
      vendorgroup: 1,
      files: 1,
      status: 1,
      assignedthrough: 1,
      repairproblem: 1
    });

    const result = await Assetdetail.find(query)
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

exports.getAllAssetdetailFilterAccessHome = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {

    assetdetails = await Assetdetail.countDocuments()
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})

exports.getAllAssetdetailDamageHome = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {

    assetdetails = await Assetdetail.countDocuments({ status: "Damage" }, {})
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    assetdetails
  });
})


// exports.getAllAssetdetailRepairedHome = catchAsyncErrors(async (req, res, next) => {
//   let assetdetails;
//   try {

//     assetdetails = await Assetdetail.countDocuments({ status: "Repair" }, {})
//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     assetdetails
//   });
// })

exports.getAllAssetdetailRepairedHome = catchAsyncErrors(async (req, res, next) => {
  let assetdetails, query;
  try {
    const { assignbranch } = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    // if (branchFilter.length > 0) {
    filterQuery = { $or: branchFilter };
    // }


    query = {
      status: "Repair",
      ...filterQuery
    }
    assetdetails = await Assetdetail.countDocuments(query)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})



exports.getAllStockmanageAccess = catchAsyncErrors(async (req, res, next) => {
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
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { company: regex },
        { branch: regex },
        { unit: regex },
        { floor: regex },
        { area: regex },
        { location: regex },
        { workstation: regex },
        { requestmode: regex },
        { asset: regex },
        { assettype: regex },
        { material: regex },
        { component: regex },
        { productdetails: regex },
        { uom: regex },
        { quantity: regex },
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

    const totalProjects = await Stockmanage.countDocuments(query);

    const totalProjectsData = await Stockmanage.find(queryoverall);

    const result = await Stockmanage.find(query)
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


exports.getAllAssetdetailGetVendor = catchAsyncErrors(async (req, res, next) => {
  let assetdetails;
  try {
    const { code } = req.body;

    assetdetails = await Assetdetail.findOne({ code: code }, { vendor: 1, address: 1, phonenumber: 1 })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetdetails) {
    return next(new ErrorHandler('Assetdetail not found!', 404));
  }
  return res.status(200).json({
    assetdetails
  });
})







