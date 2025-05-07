const ProductionDayListTemp = require("../../../model/modules/production/productiondaylisttemp");
const ProductionDay = require("../../../model/modules/production/productiondaytemp");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const moment = require("moment");
const ProductionTempUploadAll = require("../../../model/modules/production/productiontempuploadall");
const ProducionIndividual = require("../../../model/modules/production/productionindividual")



// get All ProductionDayList => /api/productiondaylistss
exports.getAllProductionDayListTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayListTemp.find();
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// get All ProductionDayListBy Date => /api/productiondaylistss
exports.getAllProductionDayListByDateTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists = [];
  let result = [];
  try {
    const query1 = {
      date: new RegExp("^" + req.body.date), // using RegExp for partial match
    };
    findUniqIdDay = await ProductionDay.findOne(query1);
    const query = {
      uniqueid: findUniqIdDay.uniqueid, // using RegExp for partial match
    };
    productiondaylists = await ProductionDayListTemp.find(query);

    console.log(productiondaylists[0], "productiondaylists");

    result = productiondaylists.reduce((acc, current) => {
      const [dateCurr] = current.dateval?.split(" ");
      const existingItemIndex = acc.findIndex((item) => {
        return item.empname === current.empname && item.empcode === current.empcode && item.company === current.company && item.branch === current.branch;
      });

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.count += 1;
        existingItem.production += current.mode === "Production" ? Number(current.conpoints) : 0;
        existingItem.manual += current.mode === "Manual" ? Number(current.conpoints) : 0;

        existingItem.empname = current.empname;
        existingItem.processcode = current.processcode;
        existingItem.fromtodate = current.fromtodate;
        existingItem.target = current.target;
        existingItem.shiftsts = current.shiftsts;
        existingItem.points += Number(current.conpoints);
        existingItem.conshiftpoints += Number(current.conshiftpoints);
        existingItem.shiftpoints += Number(current.shiftpoints);

        // existingItem.users.push(new Set(current.user));
        // Ensure existingItem.users is always an array
        if (!Array.isArray(existingItem.users)) {
          existingItem.users = [];
        }

        // Add current user to the set to remove duplicates
        const uniqueUsersSet = new Set(existingItem.users);
        uniqueUsersSet.add(current.user);
        existingItem.users = Array.from(uniqueUsersSet);
      } else {
        // Add new item

        acc.push({
          empname: current.empname,
          empcode: current.empcode,
          company: current.company,
          fromtodate: current.fromtodate,
          unit: current.unit,
          team: current.team,
          dateval: current.dateval,
          processcode: current.processcode,
          date: dateCurr,
          exper: current.experience,
          target: current.target,
          branch: current.branch,
          shiftsts: current.shiftsts,
          production: current.mode === "Production" ? Number(current.conpoints) : 0,
          manual: current.mode === "Manual" ? Number(current.conpoints) : 0,
          points: Number(current.conpoints),
          shiftpoints: Number(current.shiftpoints),
          conshiftpoints: Number(current.conshiftpoints),
          users: [current.user],

          count: Number(1),
        });
      }
      return acc;
    }, []);

    console.log(result.length);
    // SUDARVIZHI.ASAITHAMBI
  } catch (err) {
    console.log(err.message);
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result,
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.productionDayListGetDeleteLimitedTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayListTemp.find({ uniqueid: req.body.uniqid }, { _id: 1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.productionDayListGetViewLimitedTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayListTemp.find({ uniqueid: req.body.uniqid }, {
      company: 1, branch: 1, unit: 1, team: 1, doj: 1, processcode: 1, experience: 1, target: 1, avgpoint: 1, project: 1, department: 1,
      category: 1, filename: 1, empname: 1, fromtodate: 1, empcode: 1, user: 1, unitid: 1, unitrate: 1, dateval: 1, vendor: 1, points: 1, aprocess: 1, sprocess: 1, contarget: 1, conpoints: 1,
      conavg: 1, mode: 1
    });
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// Create new ProductionDayList=> /api/productiondaylists/new
exports.addProductionDayListTemp = catchAsyncErrors(async (req, res, next) => {
  let aproductiondaylists = await ProductionDayListTemp.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.getSingleProductionDayListTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductiondaylists = await ProductionDayListTemp.findById(id);

  if (!sproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductiondaylists,
  });
});

// update ProductionDayList by id => /api/productiondaylists/:id
exports.updateProductionDayListTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductiondaylists = await ProductionDayListTemp.findByIdAndUpdate(id, req.body);
  if (!uproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionDayList by id => /api/productiondaylists/:id
exports.deleteProductionDayListTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductiondaylists = await ProductionDayListTemp.findByIdAndRemove(id);

  if (!dproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// delete ProductionDay by unid matching unitidval => /api/productiondays/:unitidval
exports.deleteProductionDayByUnidTemp = catchAsyncErrors(async (req, res, next) => {
  const unitidval = req.body.uniqid; // Assuming unitidval is passed in the URL params

  // Delete documents with matching unid
  let result = await ProductionDayListTemp.deleteMany({ uniqueid: unitidval });
  console.log(result);
  // Check if any documents were deleted
  if (result.deletedCount === 0) {
    return next(new ErrorHandler("Data not found!", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


// // get All ClientUserID Name => /api/clientuserids
// exports.getEmpProductionDayLastThreeMonthsTemp = catchAsyncErrors(async (req, res, next) => {
//   let productiondaylists = [];
//   try {

//     const { empname, department } = req.body;

//     let dateNow = new Date();
//     let datevalue = dateNow.toISOString().split("T")[0];

//     const findCurrdeptMonthSets = await DepartmentMonth.find({
//       fromdate: { $lte: datevalue },
//       todate: { $gte: datevalue },
//       year: dateNow.getFullYear(),
//       department: department,
//     }, { monthname: 1, year: 1, fromdate: 1, todate: 1 });


//     let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].fromdate : "";
//     let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].todate : "";

//     let productionDayid = await ProductionDay.find({ date: { $gte: currMonthFromdate, $lte: currMonthTodate } }, { uniqueid: 1 });
//     let productionUniqIds = productionDayid.map(item => item.uniqueid);


//     productiondaylists = await ProductionDayListTemp.find({ uniqueid: { $in: productionUniqIds }, empname: empname }, {});
//     console.log(productiondaylists.length, 'productiondaylists')

//     return res.status(200).json({

//       productiondaylists
//     });
//   } catch (err) {
//     console.log(err.message);
//   }


// });


// get All ClientUserID Name => /api/clientuserids
exports.getEmpProductionDayLastThreeMonthsTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists = [];
  try {

    const { empname, department } = req.body;

    let dateNow = new Date();
    let datevalue = dateNow.toISOString().split("T")[0];

    const findCurrdeptMonthSets = await DepartmentMonth.find({
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
      year: dateNow.getFullYear(),
      department: department,
    }, { monthname: 1, year: 1, fromdate: 1, todate: 1 });


    let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].fromdate : "";
    let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].todate : "";

    let productionDayid = await ProductionDay.find({ date: { $gte: currMonthFromdate, $lte: currMonthTodate } }, { uniqueid: 1 });

    let productionUniqIds = productionDayid.map(item => item.uniqueid);


    productiondaylists = await ProductionDayListTemp.find({ uniqueid: { $in: productionUniqIds }, empname: empname }, {});


    console.log(productiondaylists.length, 'productiondaylists')

    return res.status(200).json({

      productiondaylists
    });
  } catch (err) {
    console.log(err.message, 'SDFSD12');
  }


});



exports.getAllProductionsByUserForCurrMonthTemp = catchAsyncErrors(async (req, res, next) => {
  try {
    const { empname, department, user } = req.body;
    console.log(user)
    let dateNow = new Date();
    let datevalue = dateNow.toISOString().split("T")[0];

    // Fetch the department month range
    const findCurrdeptMonthSets = await DepartmentMonth.findOne({
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
      year: dateNow.getFullYear(),
      department: department,
    }, { fromdate: 1, todate: 1 });

    // Get the fromdate and todate from the department month
    let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets.fromdate : "";
    let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets.todate : "";

    if (!currMonthFromdate || !currMonthTodate) {
      return next(new ErrorHandler("Current month range not found", 404));
    }

    // Define query objects with optimized date range filters
    const query = {
      user: { $in: user },
      fromdate: { $gte: currMonthFromdate, $lte: currMonthTodate }
    };

    const queryManual = {
      user: { $in: user },
      status: "Approved",
      fromdate: { $gte: currMonthFromdate, $lte: currMonthTodate }
    };
    console.log(queryManual, 'query');

    // Use Promise.all to execute queries in parallel
    const [productions, productionsManual] = await Promise.all([
      ProductionTempUploadAll.find(query, { filename: 1, formatteddatetime: 1, user: 1 }).lean(),
      ProducionIndividual.find(queryManual, { filename: 1, fromdate: 1, time: 1, user: 1, mode: 1 }).lean()
    ]);
    console.log(productionsManual.length, '[RPDICOOH');

    return res.status(200).json({
      productions,
      productionsManual
    });

  } catch (err) {
    console.log(err.message);
    return next(new ErrorHandler("Failed to fetch data", 500));
  }
});



exports.getAllProductionsByUserForCurrMonthViewTemp = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists, productiondaylistsManual;
  try {

    const { ids } = req.body;

    productiondaylists = await ProductionTempUploadAll.find({ _id: { $in: ids } }, {
      project: 1,
      category: 1, filename: 1, fromtodate: 1, user: 1, unitid: 1, unitrate: 1, formatteddatetime: 1, vendor: 1, points: 1,
      flagcount: 1, section: 1,
    });
    productiondaylistsManual = await ProducionIndividual.find({ _id: { $in: ids }, status: "Approved" }, {
      project: 1,
      category: 1, filename: 1, fromtodate: 1, user: 1, unitid: 1, unitrate: 1, fromdate: 1, time: 1, vendor: 1, points: 1,
      mode: 1, flagcount: 1, section: 1,
    });


  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    // count: products.length,
    productiondaylists, productiondaylistsManual
  });
});