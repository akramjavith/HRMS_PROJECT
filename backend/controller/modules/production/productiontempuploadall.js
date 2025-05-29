const ProductionTempUploadAll = require("../../../model/modules/production/productiontempuploadall");
const ProducionIndividual = require("../../../model/modules/production/productionindividual");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel");
const Attendances = require("../../../model/modules/attendance/attendance");
const Users = require("../../../model/login/auth");
const Unitrate = require("../../../model/modules/production/productionunitrate");
const Categoryprod = require("../../../model/modules/production/categoryprodmodel");
const subCategoryprod = require("../../../model/modules/production/subcategoryprodmodel");
const Shift = require("../../../model/modules/shift");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const AttendanceControlCriteria = require("../../../model/modules/settings/Attendancecontrolcriteria");
const fs = require("fs");
const path = require("path");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const moment = require("moment");
// get All ProductionTempUploadAll => /api/productiontempuploadalls
exports.getAllProductionTempUploadAll = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall;
  try {
    productiontempuploadall = await ProductionTempUploadAll.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiontempuploadall,
  });
});



// get All ProductionTempUploadAll => /api/productiontempuploadalls
exports.productionTempUploadOverAllFetchLimited = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall, count;
  const batchSize = 10000; // Adjust as needed
  const page = req.body.page || 1; // Get the page number from the request query

  try {
    const query = {

      dateval: { $in: req.body.datearray.map((date) => new RegExp("^" + date)) }, // using RegExp for partial match
    };
    // Calculate the number of documents to skip
    const skip = (page - 1) * batchSize;

    // Fetch a batch of documents
    productiontempuploadall = await ProductionTempUploadAll.find(query, { checkunique: 1 })
      .skip(skip)
      .limit(batchSize);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    productiontempuploadall,
  });
});
// get All ProductionTempUploadAll => /api/productiontempuploadalls
exports.productionTempUploadOverAllFetchLimitedNew = catchAsyncErrors(async (req, res, next) => {
  let productionuploadtemp

  try {
    const query = {

      checkunique: { $in: req.body.checkunique }, // using RegExp for partial match
    };


    productionuploadtemp = await ProductionTempUploadAll.find(query, { checkunique: 1, filename: 1 })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    productionuploadtemp,
  });
});

// Create new ProductionTempUploadAll=> /api/productiontempuploadall/new
exports.addProductionTempUploadAll = catchAsyncErrors(async (req, res, next) => {
  let aproductiontempuploadall = await ProductionTempUploadAll.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionTempUploadAll => /api/productiontempuploadall/:id
exports.getSingleProductionTempUploadAll = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductiontempuploadall = await ProductionTempUploadAll.findById(id);

  if (!sproductiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductiontempuploadall,
  });
});

exports.getAllProductionTempUploadAllFilenames = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall;
  try {
    productiontempuploadall = await ProductionTempUploadAll.find({ filename: req.body.filename, uniqueid: req.body.id });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiontempuploadall,
  });
});

exports.getAllProductionTempUploadAllFilenamesonly = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall, matchedData;
  try {
    matchedData = await ProductionTempUploadAll.find({ uniqueid: req.body.id }, { dateval: 1, filename: 1, uniqueid: 1, filenamenew: 1, createdAt: 1 });

    productiontempuploadall = matchedData.reduce((acc, current) => {
      const existingItem = acc.find((item) => item.filename === current.filename);

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
  if (!productiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiontempuploadall,
  });
});
exports.getAllProductionTempUploadAllGetdeletedatas = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall;
  try {
    productiontempuploadall = await ProductionTempUploadAll.find({ filename: req.body.filename, uniqueid: req.body.id }, { _id: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiontempuploadall,
  });
});

exports.getAllProductionTempUploadAllGetdeletedatasall = catchAsyncErrors(async (req, res, next) => {
  let productiontempuploadall;
  try {
    productiontempuploadall = await ProductionTempUploadAll.find({ uniqueid: req.body.id }, { _id: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiontempuploadall,
  });
});

// update ProductionTempUploadAll by id => /api/productiontempuploadall/:id
exports.updateProductionTempUploadAll = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductiontempuploadall = await ProductionTempUploadAll.findByIdAndUpdate(id, req.body);

  if (!uproductiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionTempUploadAll by id => /api/productiontempuploadall/:id
exports.deleteProductionTempUploadAll = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductiontempuploadall = await ProductionTempUploadAll.findByIdAndRemove(id);

  if (!dproductiontempuploadall) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// Delete ProductionTempUploadAll by array of ids => /api/productiontempuploadall
exports.deleteProductionTempUploadAllsMutli = catchAsyncErrors(async (req, res, next) => {
  const ids = req.body.ids; // Assuming you send an array of ids in the request body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new ErrorHandler("Invalid or empty array of IDs", 400));
  }

  const result = await ProductionTempUploadAll.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    return next(new ErrorHandler("No data found for the given IDs", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
// 
// temp upload unallot
// temp upload unallot
exports.getAllProductionUnAllotFilterTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload, mergedData, mergedDataall, producionIndividual;


  try {
    // producionIndividual = await ProducionIndividual.find({
    //   vendor: { $in: req.body.project.map((item) => item.value).map((pro) => new RegExp("^" + pro)) },

    //   updatedunitrate: { $exists: false },
    //   unallothide: { $exists: false },
    //   status: "Approved",
    // }, {});
    let query = {
      unitrate: { $eq: 0 },
      unallothide: { $ne: "true" },

      // vendor: { $in: req.body.project.map((item) => item.value).map((pro) => new RegExp("^" + pro)) },
      updatedunitrate: { $exists: false }
    };
    console.log(query, 'query')
    productionupload = await ProductionTempUploadAll.find(query, { formatteddatetime: 1, formatteddate: 1, vendor: 1, category: 1, filename: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 });

    mergedDataall = productionupload.map(upload => {

      const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
      const getproject = FindProjectvendor && FindProjectvendor[0];

      // if (
      //   // ((req.body.project != "") ? req.body.project === getproject : true)
      //   (req.body.project && req.body.project.length > 0 ? req.body.project.map((item) => item.value).includes(getproject) : true)
      // )

      return {
        user: upload.user,
        flagcount: upload.flagcount,
        unitid: upload.unitid,
        unitrate: upload.unitrate,
        vendor: upload.vendor,
        category: upload.category,
        unallotcategory: upload.unallotcategory,
        unallotsubcategory: upload.unallotsubcategory,
        dateval: upload.formatteddatetime.split(" ")[0],
        formatteddatetime: upload.formatteddatetime.split(" ")[0],
        filename: upload.filename,
        section: upload.section,
        mode: "Production",
        _id: upload._id,
      };

    });

    mergedData = mergedDataall.filter(item => item != null)
  } catch (err) {
    console.log(err.message);
  }
  if (!productionupload) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    mergedData,
  });
});


//view
exports.getAllProductionUnAllotFilterViewTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload, mergedData, mergedDataall, producionIndividual;

  try {

    productionupload = await ProductionTempUploadAll.find({
      _id: { $in: req.body.ids }
    }, { formatteddate: 1, vendor: 1, category: 1, filename: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 });

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
        dateval: upload.formatteddate,
        section: upload.section,
        filename: upload.filename,
        mode: "Production",
        _id: upload._id,
      };

    });

    mergedData = mergedDataall.filter(item => item != null)
  } catch (err) {
    console.log(err.message);
  }
  if (!productionupload) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    mergedData,
  });
});

//view Manual
exports.getAllProductionUnAllotFilterViewTempManual = catchAsyncErrors(async (req, res, next) => {
  let productionupload, mergedData, mergedDataall, producionIndividual;

  try {
    productionupload = await ProducionIndividual.find({ unitrate: { $eq: 0 }, unallothide: { $ne: "true" }, _id: { $in: req.body.ids } }, {});
    // const objectIdIds = req.body.ids.map(id => mongoose.Types.ObjectId(id));
    // productionupload = await ProductionUpload.find({
    //   unitrate: { $eq: 0 }, unallothide: { $ne: "true" }, _id: { $in: req.body.ids }
    // }, { dateval: 1, vendor: 1, category: 1, filename: 1, section: 1, flagcount: 1, unitrate: 1, unallothide: 1, unallotcategory: 1, unallotsubcategory: 1 });

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
        filename: upload.filename,
        section: upload.section,
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


// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitandFlagtemp = catchAsyncErrors(async (req, res, next) => {
  const { updates } = req.body;

  try {
    // if(updates)
    let prodManual = updates.filter((item) => item.mode === "Manual");
    let prodUploads = updates.filter((item) => item.mode === "Production");

    if (prodManual.length > 0) {
      const manualBulkOps = prodManual.map((update) => ({
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
      await ProducionIndividual.bulkWrite(manualBulkOps);
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found", 404));
  }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitOnlytemp = catchAsyncErrors(async (req, res, next) => {
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasFlagOnlytemp = catchAsyncErrors(async (req, res, next) => {
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});
// get All ProductionUpload => /api/productionuploads
exports.updateBulkDatasUnitandSectiontemp = catchAsyncErrors(async (req, res, next) => {
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.bulkDeleteUnitRateUnallottemp = catchAsyncErrors(async (req, res, next) => {
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

// /unallot
exports.productionTempCheckMismatchPresentFilterold = catchAsyncErrors(async (req, res, next) => {
  let count;
  let filteredDatas = [];
  let filteredDatasManual = [];

  try {
    const { date, project, fromtime, totime } = req.body;

    // const producionIndividualManual = await ProducionIndividual.find(
    //   {
    //     // fromdate: new RegExp("^" + req.body.date),
    //     fromdate: {
    //       $eq: date
    //     },
    //     time: {
    //       $gte: fromtime,
    //       $lte: totime
    //     },
    //     updatedunitrate: { $exists: true, $ne: 0 },
    //     flagcount: { $exists: true, $gt: 0 },
    //     vendor: new RegExp("^" + req.body.project),
    //     unallothide: { $ne: "true" },
    //     status: "Approved",
    //   },
    //   {}
    // ).lean();

    const productionunmatched = await ProductionTempUploadAll.find(
      {

        // formatteddate: {
        //   $eq: date
        // },
        dateobjformatdate: { $gte: new Date(`${date}T${fromtime}Z`), $lte: new Date(`${date}T${totime}Z`) },

        unitrate: { $exists: true, $ne: 0 },
        flagcount: { $exists: true, $gt: 0 },
        unallothide: { $ne: "true" },
        vendor: new RegExp("^" + project),

      },
      { filename: 1, category: 1, vendor: 1, unitrate: 1, flagcount: 1, updatedunitrate: 1, formatteddatetime: 1, updatedflag: 1 }
    ).lean(); // Use lean() to get plain JavaScript objects and reduce memory overhead



    const unitRates = await Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1, }).lean();

    const subCategoryOpt = await subCategoryprod.find({}, { name: 1, categoryname: 1, project: 1, mismatchmode: 1 }).lean();

    const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
    const subCategoryMap = new Map(subCategoryOpt.map((item) => [item.project + "-" + item.categoryname + "-" + item.name, item]));
    // && matchCategory.mismatchmode.includes("Flag") && matchCategory.mismatchmode.includes("Unit + Flag")
    filteredDatas = productionunmatched.reduce((acc, obj) => {
      const [filenameupdated] = obj.filename.split(".x");

      const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
      const matchSubCategory = subCategoryMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
      // console.log(matchUnitrate, 'matchUnitrate')
      const mrateval = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
      const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);
      // const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);
      const mflagcount = matchUnitrate ? Number(matchUnitrate.flagcount) : 0;

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

    count = filteredDatas.length;

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


exports.productionTempCheckMismatchPresentFilter = catchAsyncErrors(async (req, res, next) => {
  let count;
  let filteredDatas = [];
  let filteredDatasManual = [];

  try {
    const { date, project, fromtime, totime } = req.body;

  console.log(date,'unmatch')

    const [producionIndividualManual, productionunmatched, unitRates, subCategoryOpt] = await Promise.all([
      ProducionIndividual.find(
        {
          fromdate: req.body.date,
          time: {
            $gte: fromtime,
            $lte: totime,
          },
          updatedunitrate: { $exists: true, $ne: 0 },
          vendor: new RegExp("^" + req.body.project),
          unallothide: { $ne: "true" },
          status: "Approved",
        },
        {
          filename: 1,
          category: 1,
          vendor: 1,
          unitrate: 1,
          flagcount: 1,
          updatedunitrate: 1,
          updatedflag: 1,
        }
      ).lean(),
 ProductionTempUploadAll.aggregate([
  {
    $match: {
      formatteddate: date,
      unitrate: { $exists: true, $ne: 0 },
      $or: [
        { updatedunitrate: { $exists: false } },
        { updatedunitrate: { $exists: true, $ne: 0 } },
      ],
      flagcount: { $exists: true, $gt: 0 },
      unallothide: { $ne: "true" },
    }
  },
  {
    $addFields: {
      vendorPrefix: {
        $arrayElemAt: [{ $split: ["$vendor", "_"] }, 0]
      }
    }
  },
  {
    $lookup: {
      from: "Unitrate",
      let: {
        vendor: "$vendorPrefix",
        filenameupdated: "$filenameupdated",
        category: "$category"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$project", "$$vendor"] },
                { $eq: ["$category", "$$filenameupdated"] },
                { $eq: ["$subcategory", "$$category"] }
              ]
            }
          }
        }
      ],
      as: "unitrateData"
    }
  },
  {
    $unwind: {
      path: "$unitrateData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "subCategoryprod",
      let: {
        vendor: "$vendorPrefix",
        filenameupdated: "$filenameupdated",
        category: "$category"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$project", "$$vendor"] },
                { $eq: ["$categoryname", "$$filenameupdated"] },
                { $eq: ["$name", "$$category"] }
              ]
            }
          }
        }
      ],
      as: "subCategoryData"
    }
  },
  {
    $unwind: {
      path: "$subCategoryData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      _id: 1,
      filename: 1,
      category: 1,
      vendor: 1,
      vendorPrefix: 1,
      unitrate: 1,
      flagcount: 1,
      updatedunitrate: 1,
      updatedflag: 1,
      unitrateData: 1,
      subCategoryData: 1
    }
  },
  {
    $match: {
      $expr: {
        $or: [
          { $ne: ["$unitrateData.mrate", "$updatedunitrate"] },
          {
            $and: [
              { $gt: ["$unitrateData.flagcount", 1] },
              { $ne: ["$updatedflag", "$unitrateData.flagcount"] },
              { $in: ["Flag Mismatched", "$subCategoryData.mismatchmode"] }
            ]
          },
          {
            $and: [
              { $eq: ["$unitrateData.mrate", "$updatedunitrate"] },
              { $ne: ["$updatedflag", "$unitrateData.flagcount"] },
              { $in: ["Flag Mismatched", "$subCategoryData.mismatchmode"] }
            ]
          }
        ]
      }
    }
  }
], { allowDiskUse: true }),

      Unitrate.find(
        {},
        {
          category: 1,
          project: 1,
          flagcount: 1,
          subcategory: 1,
          mrate: 1,
          trate: 1,
        }
      ).lean(),
    
      subCategoryprod.find(
        {},
        {
          name: 1,
          categoryname: 1,
          project: 1,
          mismatchmode: 1,
        }
      ).lean(),
    ]);
    
console.log(productionunmatched.length,producionIndividualManual.length, 'unmatch')

    const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
    const subCategoryMap = new Map(subCategoryOpt.map((item) => [item.project + "-" + item.categoryname + "-" + item.name, item]));
    
    const productionunmatchedFiltered = productionunmatched.filter(d => d.vendor.split("-")[0] == project && d.dateobjformatdate >= new Date(`${date}T${fromtime}Z`) && d.dateobjformatdate <= new Date(`${date}T${totime}Z`) )

    filteredDatas = productionunmatchedFiltered.reduce((acc, obj) => {
      const [filenameupdated] = obj.filename.split(".x");

      const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
      const matchSubCategory = subCategoryMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);

      const mrateval = matchUnitrate && (matchUnitrate.mrate ? Number(matchUnitrate.mrate) : Number(matchUnitrate.trate));
      const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);

      // console.log(mrateval, 'mrateval');

      const mflagcount = matchUnitrate && Number(matchUnitrate.flagcount);

      const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);

      const subMismatchModes = matchSubCategory ? matchSubCategory.mismatchmode : [];
      const unitrateval = finalunitrate;

      const isMisMatch =
        Number(mrateval) !== Number(unitrateval) ||
        (Number(mflagcount) > 1 && Number(finalflag) != Number(mflagcount)) ||
        (Number(mrateval) == Number(unitrateval) && Number(finalflag) != Number(mflagcount) && subMismatchModes.includes("Flag Mismatched"));

      if (isMisMatch) {
        acc.push({ _id: obj._id });
      }

      return acc;
    }, []);

    filteredDatasManual = producionIndividualManual.reduce((acc, obj) => {
      const filenameupdated = obj.filename;

      const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);
      const matchSubCategory = subCategoryMap.get(obj.vendor.split("-")[0] + "-" + filenameupdated + "-" + obj.category);

      const mrateval = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
      const mflagcount = matchUnitrate ? Number(matchUnitrate.flagcount) : 0;
      const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);
      const finalflag = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);
      // const unitflagstatus = matchUnitrate ? (matchUnitrate.flagstatus) : "";
      const subMismatchModes = matchSubCategory ? matchSubCategory.mismatchmode : [];
      // const unitrateval = matchCategory && matchCategory.flagstatus === "Yes" && matchCategory.mismatchmode.includes("Flag") && matchCategory.mismatchmode.includes("Unit + Flag") ? finalunitrate / finalflag : finalunitrate;
      const unitrateval = finalunitrate;
      // const isMisMatch = (mrateval !== unitrateval || finalflag != mflagcount);

      const isMisMatch =
        Number(mrateval) !== Number(unitrateval) ||
        (Number(mflagcount) > 1 && Number(finalflag) != Number(mflagcount) && subMismatchModes.includes("Flag Mismatched")) ||
        (Number(mrateval) == Number(unitrateval) && Number(finalflag) != Number(mflagcount) && subMismatchModes.includes("Flag Mismatched"));

      if (isMisMatch) {
        acc.push({ _id: obj._id });
      }

      return acc;
    }, []);

    count = filteredDatas.length + filteredDatasManual.length;

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
exports.getProductionUploadDatasByIdTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload;

  try {
    const query = {

      _id: { $in: req.body.ids }, // using RegExp for partial match
    };

    let productionunmatched = await ProductionTempUploadAll.find(query, {
      category: 1, formatteddate: 1, filenameupdated: 1, vendor: 1, updatedunitrate: 1, updatedflag: 1, unitrate: 1, unitid: 1, flagcount: 1, section: 1
    }).lean();

    const unitRates = await Unitrate.find({}, { category: 1, project: 1, flagcount: 1, subcategory: 1, mrate: 1, flagstatus: 1 }).lean();
    const subcategoryOpt = await subCategoryprod.find({}, { name: 1, mismatchmode: 1, categoryname: 1, project: 1 }).lean();

    const unitRateMap = new Map(unitRates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));
    const subcategoryMap = new Map(subcategoryOpt.map((item) => [item.project + "-" + item.categoryname + "-" + item.name, item]));

    productionupload = productionunmatched.reduce((acc, obj) => {


      const matchUnitrate = unitRateMap.get(obj.vendor.split("-")[0] + "-" + obj.filenameupdated + "-" + obj.category);
      const matchSubCategory = subcategoryMap.get(obj.vendor.split("-")[0] + "-" + obj.filenameupdated + "-" + obj.category);

      const mrateval = matchUnitrate && Number(matchUnitrate.mrate);
      const unitflag = matchUnitrate && Number(matchUnitrate.flagcount);
      const mismatchmodeval = matchSubCategory && matchSubCategory.mismatchmode;
      const unitflagstatus = matchUnitrate ? (matchUnitrate.flagstatus) : "";

      const mratevalcheck = matchUnitrate ? Number(matchUnitrate.mrate) : 0;
      const finalunitrate = obj.updatedunitrate ? Number(obj.updatedunitrate) : Number(obj.unitrate);

      const mflagalcheck = matchUnitrate ? Number(matchUnitrate.flagcount) : 0;
      const finalflagcount = obj.updatedflag ? Number(obj.updatedflag) : Number(obj.flagcount);

      // if (matchUnitrate || matchSubCategory) {
      if ((Number(finalunitrate) != Number(mratevalcheck) || (Number(mflagalcheck) > 1 && (Number(mflagalcheck) != Number(finalflagcount))) || (Number(mrateval) == Number(finalunitrate) && Number(finalflagcount) != Number(mflagalcheck) && mismatchmodeval.includes("Flag Mismatched"))) && (matchUnitrate || matchSubCategory)) {
        acc.push({ _id: obj._id, vendor: obj.vendor, mode: "Production", flagcount: obj.flagcount, user: obj.user, unitid: obj.unitid, category: obj.category, filename: obj.filenameupdated, unitrate: finalunitrate, mismatchmodestatus: mismatchmodeval.includes("Flag Mismatched") ? "Yes" : "No", formatteddatetime: obj.formatteddate, section: obj.section, mrate: mrateval, mismatchmode: mismatchmodeval, unitflag: unitflag });
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
exports.getProductionUploadDatasByIdManualTemp = catchAsyncErrors(async (req, res, next) => {
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
        acc.push({
          _id: obj._id,
          vendor: obj.vendor,
          mode: "Manual",
          fromdate: obj.fromdate,
          user: obj.user,
          unitid: obj.unitid,
          flagcount: obj.flagcount,
          category: obj.category,
          filename: obj.filename,
          unitrate: obj.updatedunitrate,
          dateval: obj.dateval,
          section: obj.section,
          mrate: mrateval,
          mismatchmode: mismatchmodeval,
          unitflag: unitflag,
        });
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


//overallreport
exports.getAllproductiontempFilter = catchAsyncErrors(async (req, res, next) => {
  let productionupload = [],
    mergedData,
    producionIndividual;
  let finaluser = [];
  let mergedDataall = [];
  try {
    const { empname, username, user, projectvendor, category, subcategory, mode, fromtime, totime, selecteddupe, company, branch, unit, team, users } = req.body;
    const dateObj = new Date(req.body.fromdate);
    const date = req.body.fromdate;

    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    // Format the date components into the desired format
    const formattedDate = `${day}-${month}-${year}`;

    let dateoneafter = new Date(req.body.fromdate);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split('T')[0];

    let datebefore = new Date(req.body.fromdate);
    datebefore.setDate(datebefore.getDate() - 1);
    let newDateOneMinus = datebefore.toISOString().split('T')[0];

    const useridsall = users.flatMap((item) => item.userids);
    let logidQuery = {
      loginallotlog: { $exists: true, $ne: [] },
      // allotted: 'allotted',
      'loginallotlog.empname': { $in: users.map((item) => item.companyname) },
      userid: { $in: useridsall },
    };
    if (user.length > 0) {
      logidQuery.userid = { $in: user };
    }
    let userQuery = {
      enquirystatus: {
        $nin: ['Enquiry Purpose'],
      },
      companyname: { $in: users.map((item) => item.companyname) },

      $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: '' } }, { reasondate: { $gte: date } }],
    };

    if (empname.length > 0) {
      userQuery.companyname = { $in: empname };
    }

    let query = {};
    let queryManual = {};

    if (user.length > 0) {
      query.user = { $in: user };
      queryManual.user = { $in: user };
    }
    if (user.length === 0) {
      query.user = { $in: useridsall };
      queryManual.user = { $in: useridsall };
    }
    if (projectvendor.length > 0) {
      query.vendor = { $in: projectvendor };
      queryManual.vendor = { $in: projectvendor };
    }

    if (selecteddupe === 'Without Duplicate') {
      query.dupe = 'No';
    }

    queryManual.status = 'Approved';

    if (req.body.shift == 'Shift Based') {
      queryManual.$or = [{ fromdate: { $eq: req.body.fromdate } }, { fromdate: { $eq: newDateOnePlus } }];
    } else {
      queryManual.fromdate = { $eq: date };
    }
    console.log(users.length, 'USERLENGTHuplosadFILTER');

    const { minStart, maxEnd } = users
      .filter((d) => d.userShiftTimings.shiftFromTime && d.userShiftTimings.shiftFromTime !== '')
      .reduce(
        (acc, obj) => {
          const startTime = new Date(obj.userShiftTimings.shiftFromTime);
          const endTime = new Date(obj.userShiftTimings.shiftEndTime);

          // console.log('Comparing:', startTime, endTime);

          // Update minimum start time
          if (!acc.minStart || startTime < acc.minStart) {
            acc.minStart = startTime;
          }

          // Update maximum end time
          if (!acc.maxEnd || endTime > acc.maxEnd) {
            acc.maxEnd = endTime;
          }

          return acc;
        },
        { minStart: null, maxEnd: null } // Proper initialization
      );

    query.dateobjformatdate = { $gte: minStart, $lte: maxEnd };
    console.log(query.dateobjformatdate, 'query');

    const [loginids, producionIndividual, productionupload, attendances] = await Promise.all([
      ClientUserid.find(logidQuery, { empname: 1, userid: 1, projectvendor: 1, loginallotlog: 1 }).lean(),
      mode.includes('Manual Production')
        ? ProducionIndividual.find(queryManual, {
            user: 1,
            fromdate: 1,
            time: 1,
            filename: 1,
            vendor: 1,
            mode: 1,
            category: 1,
            section: 1,
            unitid: 1,
            lateentrystatus: 1,
            updatedunitrate: 1,
            updatedflag: 1,
            updatedsection: 1,
            unallotcategory: 1,
            unallotsubcategory: 1,
          })
        : Promise.resolve([]),
      mode.includes('Production')
        ? ProductionTempUploadAll.find(query, {
            unitid: 1,
            user: 1,
            formatteddate: 1,
            formattedtime: 1,
            filenameupdated: 1,
            category: 1,
            flagcount: 1,
            vendor: 1,
            unitrate: 1,
            updatedunitrate: 1,
            updatedflag: 1,
            unallotcategory: 1,
            unallotsubcategory: 1,
          })
        : Promise.resolve([]),
      Attendances.find({ date: formattedDate, username: { $in: username } }, { clockintime: 1, date: 1, username: 1 }),
    ]);

    let allData = [...producionIndividual, ...productionupload];

    console.log(allData.length, 'aalldata');

    // Function to subtract hours and minutes from a date
    function subtractTime(date, hours, minutes) {
      // Subtract hours
      date.setHours(date.getHours() - hours);
      // Subtract minutes
      date.setMinutes(date.getMinutes() - minutes);
      return date;
    }

    // Format the result to "YYYY-MM-DD HH:MM:SS"
    function formatDateCst(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function compareDateTimes(dateT, shiftFrom, shiftEnd) {
      // Parse the datetime strings into Date objects
      const dateTimeObj = new Date(dateT);
      const shiftFromTimeObj = new Date(shiftFrom);
      const shiftEndTimeObj = new Date(shiftEnd);
      // Perform the comparisons
      const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

      return isWithinShift;
    }

    // Step 1: Flatten the loginallotlog array and include user info
    let logs = loginids.flatMap((user) =>
      user.loginallotlog.map((log) => ({
        userid: user.userid,
        projectvendor: user.projectvendor,
        date: log.date,
        time: log.time,
        empname: log.empname,
        empcode: log.empcode,
        enddate: log.enddate ? log.enddate : null,
      }))
    );

    // Step 2: Sort logs by date and time (ascending order)
    logs.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return new Date(a.date) - new Date(b.date);
    });

    // Step 3: Calculate the enddate for each log (except the last log for each userid)
    const userLogsMap = {};

    logs.forEach((log) => {
      if (!userLogsMap[log.userid]) {
        userLogsMap[log.userid] = {};
      }

      if (!userLogsMap[log.userid][log.projectvendor]) {
        userLogsMap[log.userid][log.projectvendor] = [];
      }

      userLogsMap[log.userid][log.projectvendor].push(log);
    });

    Object.values(userLogsMap).forEach((userLogs) => {
      Object.values(userLogs).forEach((logsArray) => {
        logsArray.forEach((log, idx) => {
          if (idx < logsArray.length - 1) {
            log.enddate = logsArray[idx + 1].date;
          }
        });
      });
    });

    // Step 4: Filter logs based on input date
    const filteredLogs = logs.filter((log) => {
      return new Date(log.date) <= new Date(req.body.date) && (!log.enddate || new Date(log.enddate) >= new Date(req.body.date));
    });

    // Step 5: Sort the filtered logs by date and time (descending order)
    filteredLogs.sort((a, b) => {
      if (a.date === b.date) {
        return b.time.localeCompare(a.time);
      }
      return new Date(b.date) - new Date(a.date);
    });

    if (req.body.shift == 'Shift Based') {
      try {
        let mergedDataallfirst = allData.map((upload, index) => {
          const loginInfo = filteredLogs.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);

          let loginallot = loginInfo ? loginInfo : [];
          let filteredDataDateTime = null;

          if (loginallot.length > 0) {
            const groupedByDateTime = {};

            loginallot.forEach((item) => {
              const dateTime = item.date + ' ' + item.time;
              if (!groupedByDateTime[dateTime]) {
                groupedByDateTime[dateTime] = [];
              }
              groupedByDateTime[dateTime].push(item);
            });

            // Extract the last item of each group
            const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

            // Sort the last items by date and time
            lastItemsForEachDateTime.sort((a, b) => {
              return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
            });

            // Find the first item in the sorted array that meets the criteria
            for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
              const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
              // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
              let datevalsplitfinal = upload.mode == 'Manual' ? `${upload.fromdate}T${uploadtime}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
              if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                filteredDataDateTime = lastItemsForEachDateTime[i];
              } else {
                break;
              }
            }
          }

          let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : '';
          // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
          const comparedate = upload.mode == 'Manual' ? upload.fromdate : upload.formatteddate;
          const comparetime = upload.mode == 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime;
          // console.log(logininfoname,'logininfoname')

          const dateTime = `${comparedate}T${comparetime}Z`;

          // const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : '';
          const userInfo = users.find((user) => logininfoname === user.companyname && new Date(dateTime) >= new Date(user.userShiftTimings.shiftFromTime) && new Date(dateTime) <= new Date(user.userShiftTimings.shiftEndTime));
          //  console.log(userInfo,'userInfo')
          let shiftEndTime = `${req.body.fromdate}T00:00:00.000Z`;
          let shiftFromTime = `${req.body.fromdate}T00:00:00.000Z`;

          // console.log(dateSelectedFormat, dateSelectedFormatOnePlus, dateSelectedFormatOneMinus, 'sdfd')
          if (userInfo) {
            userShiftTimings = userInfo.userShiftTimings;
          } else {
            userShiftTimings = { shiftFromTime: shiftFromTime, shiftEndTime: shiftEndTime, shiftsts: '' };
          }

          let getprocessCode = userInfo ? userInfo.process : '';

          const finalcategory = upload.unallotcategory ? upload.unallotcategory : upload.mode == 'Manual' ? upload.filename : upload.filenameupdated;

          const finalsubcategory = upload.unallotsubcategory ? upload.unallotsubcategory : upload.category;

          let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
          let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

          let unitrateold = Number(upload.unitrate);
          let flagold = Number(upload.flagcount);

          let LateEntryPointsDeduct = upload.mode == 'Manual' && upload.lateentrystatus === 'Late Entry';

          const istDate = new Date(`${comparedate}T${comparetime}Z`);
          // Subtract 10 hours and 30 minutes
          const resultDate = addTimeBasedOnDST(`${comparedate} ${comparetime}`);
          // const formattedResult = formatDateCst(resultDate);

          if (
            compareDateTimes(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime) &&
            (category.length === 0 || category.includes(finalcategory)) &&
            (subcategory.length === 0 || subcategory.includes(finalsubcategory)) &&
            (company.length === 0 || company.includes(userInfo?.company)) &&
            (branch.length === 0 || branch.includes(userInfo?.branch)) &&
            (unit.length === 0 || unit.includes(userInfo?.unit)) &&
            (team.length === 0 || team.includes(userInfo?.team)) &&
            (empname.length === 0 || empname.includes(userInfo?.companyname))
          ) {
            return {
              user: upload.user,
              fromdate: upload.fromdate,
              todate: upload.todate,
              vendor: upload.vendor,
              category: finalsubcategory,
              dateval: upload.mode === 'Manual' ? `${upload.fromdate} ${convertTo24HourFormat(upload.time)}` : `${upload.formatteddate} ${upload.formattedtime}`,
              olddateval: upload.mode === 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`,
              // time: upload.mode === 'Manual' ?convertTo24HourFormat(upload.time) : upload.formattedtime,
              filename: finalcategory,
              mode: upload.mode === 'Manual' ? 'Manual' : 'Production',
              empname: userInfo && userInfo.companyname,
              empcode: userInfo && userInfo.empcode,
              company: userInfo && userInfo.company,
              unit: userInfo && userInfo.unit,
              branch: userInfo && userInfo.branch,
              team: userInfo && userInfo.team,
              shifttiming: userShiftTimings ? userShiftTimings.shifttiming : '',
              username: userInfo && userInfo.username,
              empcode: userInfo && userInfo.empcode,
              _id: upload._id,
              section: upload.section,
              flagcount: upload.flagcount,
              unitrate: upload.unitrate,

              csection: upload.updatedsection ? upload.updatedsection : '',
              cflagcount: upload.updatedflag ? upload.updatedflag : '',
              cunitrate: upload.updatedunitrate ? upload.updatedunitrate : '',

              unitid: upload.unitid,
              worktook: upload.worktook,
              lateentry: LateEntryPointsDeduct,
              points: LateEntryPointsDeduct ? 0 : (unitrateold * 8.333333333333333).toFixed(5),
              cpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * 8.333333333333333).toFixed(5),
              totalpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * finalflag * 8.333333333333333).toFixed(5),
              cstist: String(resultDate),
              // points: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : Number(upload.unitrate) * 8.333333333333333,
            };
          }
        });

        function getTimeDifference(start, end) {
          // console.log(start, end, "startend");
          if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
              return '00:00:00';
            } else {
              const diff = new Date(endDate - startDate);
              return diff.toISOString().substr(11, 8);
            }
          }
        }

        let lastTimes = {};

        mergedDataallfirst = mergedDataallfirst.filter((d) => d !== null && d !== undefined);

        mergedDataall = mergedDataallfirst.sort((a, b) => {
          // First sort by empname
          if (a.empname < b.empname) return -1;
          if (a.empname > b.empname) return 1;
          // If empnames are equal, sort by dateval
          //  return a.dateval.localeCompare(b.dateval);
          return new Date(a.olddateval) - new Date(b.olddateval);
        });

             const empFirstLastIndex = {};
mergedDataall.forEach((item, idx) => {
  if (!empFirstLastIndex[item.empname]) {
    empFirstLastIndex[item.empname] = { first: idx, last: idx };
  } else {
    empFirstLastIndex[item.empname].last = idx;
  }
});

        mergedDataall.forEach((item, index) => {
           const {first,last} = empFirstLastIndex[item.empname]
          const originalDatetime = item.dateval;
          // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
          const finddatevalue = originalDatetime && originalDatetime?.split(' ');
          const findtime = finddatevalue && finddatevalue[1];
          const finddate = finddatevalue && finddatevalue[0];

          const formattedTimeshift = findtime;

          const clockindate = attendances.find((d) => {
            const [day, month, year] = d.date.split('-'); // Split the date string from the attendance record
            const dateObject = new Date(year, month - 1, day); // Create a new Date object
            const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`; // Format the date
            //  console.log(formattedDateString, date , item.username == d.username)
            return formattedDateString === date && item.username == d.username;
          });

          // const [timePart, ampm] = clockindate ? clockindate.clockintime.split(' ') : ''; // Split the time and AM/PM
          // const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : ''; // Split hours, minutes, and seconds
          // let formattedHours = hours;
          // if (ampm === 'PM' && hours < 12) {
          //   formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
          // } else if (ampm === 'AM' && hours === 12) {
          //   formattedHours = 0; // Convert 12 AM to 0 hours
          // }
          const formattedTime = clockindate ? convertTo24HourFormat(clockindate.clockintime) : '';
          //  `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          // return formattedTime;

          if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
            if (item) {
              if (!lastTimes.hasOwnProperty(item.empname)) {
                lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
              }
item.claimstatus ="first";
              item.worktook = getTimeDifference(`${finddate}T${lastTimes[item.empname]}Z`, `${finddate}T${findtime}Z`);
            }
          } else if (item.empname == mergedDataall[index - 1].empname) {
            // item.empname = loginInfo.empname;
            item.worktook = getTimeDifference(mergedDataall[index - 1].olddateval, item.olddateval);
            // lastTimes[loginInfo.empname] = findtime;
            //  productionResult.push(item);
              item.claimstatus = "";
                         if (index === last) {
                  item.claimstatus = "last";
                }
          }
        });
      } catch (err) {
        console.log(err, 'err');
        // return next(new ErrorHandler("Records not found", 404));
      }
    } else if (req.body.shift == 'Date Based') {
      try {
        let mergedDataallfirst = allData.map((upload) => {
          const loginInfo = filteredLogs.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);

          let loginallot = loginInfo ? loginInfo : [];
          let filteredDataDateTime = null;
          if (loginallot.length > 0) {
            const groupedByDateTime = {};

            loginallot.forEach((item) => {
              const dateTime = item.date + ' ' + item.time;
              if (!groupedByDateTime[dateTime]) {
                groupedByDateTime[dateTime] = [];
              }
              groupedByDateTime[dateTime].push(item);
            });

            // Extract the last item of each group
            const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

            // Sort the last items by date and time
            lastItemsForEachDateTime.sort((a, b) => {
              return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
            });

            // Find the first item in the sorted array that meets the criteria
            for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
              const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
              // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
              let datevalsplitfinal = upload.mode == 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
              if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                filteredDataDateTime = lastItemsForEachDateTime[i];
              } else {
                break;
              }
            }
          }

          let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : '';

          const comparedate = upload.mode == 'Manual' ? upload.fromdate : upload.formatteddate;
          const comparetime = upload.mode == 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime;

          const fromdatetime = `${date}T${fromtime}Z`;
          const todatetime = `${date}T${totime}Z`;

          const dateTime = `${comparedate}T${comparetime}Z`;
          // console.log(users[0].userShiftTimings.shiftFromTime,'user.userShiftTimings.shiftFromTime')
          // const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : '';
          const userInfo = users.find((user) => logininfoname === user.companyname);

          // let userShiftTimings = {};

          if (userInfo) {
            userShiftTimings = userInfo.userShiftTimings;
          } else {
            userShiftTimings = { shiftFromTime: new Date(shiftFromTime), shiftEndTime: new Date(shiftEndTime), shiftOnlyFromTime, shiftOnlyEndTime, shiftsts: '' };
          }

          let getprocessCode = userInfo ? userInfo.process : '';

          const finalcategory = upload.unallotcategory ? upload.unallotcategory : upload.mode == 'Manual' ? upload.filename : upload.filenameupdated;

          const finalsubcategory = upload.unallotsubcategory ? upload.unallotsubcategory : upload.category;

          let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
          let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

          let LateEntryPointsDeduct = upload.mode == 'Manual' && upload.lateentrystatus === 'Late Entry';

          let unitrateold = Number(upload.unitrate);
          let flagold = Number(upload.flagcount);

          const istDate = new Date(`${comparedate}T${comparetime}Z`);
          // Subtract 10 hours and 30 minutes
          // const resultDate = subtractTime(istDate, 10, 30);
          const resultDate = addTimeBasedOnDST(`${comparedate} ${comparetime}`);

          // const formattedResult = formatDateCst(resultDate);
          // console.log(todatetime,'todatetime')
          if (
            compareDateTimes(dateTime, fromdatetime, todatetime) &&
            (category.length === 0 || category.includes(finalcategory)) &&
            (subcategory.length === 0 || subcategory.includes(finalsubcategory)) &&
            (company.length === 0 || company.includes(userInfo?.company)) &&
            (branch.length === 0 || branch.includes(userInfo?.branch)) &&
            (unit.length === 0 || unit.includes(userInfo?.unit)) &&
            (team.length === 0 || team.includes(userInfo?.team)) &&
            (empname.length === 0 || empname.includes(userInfo?.companyname))
          ) {
            return {
              user: upload.user,
              fromdate: upload.fromdate,
              todate: upload.todate,
              vendor: upload.vendor,
              category: finalsubcategory,
              dateval: upload.mode === 'Manual' ? `${upload.fromdate} ${convertTo24HourFormat(upload.time)}` : `${upload.formatteddate} ${upload.formattedtime}`,
              olddateval: upload.mode === 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`,
              filename: finalcategory,
              // time: upload.mode === 'Manual' ?convertTo24HourFormat(upload.time) : upload.formattedtime,
              mode: upload.mode === 'Manual' ? 'Manual' : 'Production',
              empname: userInfo && userInfo.companyname,
              empcode: userInfo && userInfo.empcode,
              company: userInfo && userInfo.company,
              unit: userInfo && userInfo.unit,
              branch: userInfo && userInfo.branch,
              team: userInfo && userInfo.team,
              shifttiming: userShiftTimings && userShiftTimings?.shifttiming ? userShiftTimings?.shifttiming : '',

              username: userInfo && userInfo.username,
              empcode: userInfo && userInfo.empcode,
              _id: upload._id,
              section: upload.section,
              flagcount: upload.flagcount,
              unitrate: upload.unitrate,

              csection: upload.updatedsection ? upload.updatedsection : '',
              cflagcount: upload.updatedflag ? upload.updatedflag : '',
              cunitrate: upload.updatedflag ? upload.updatedflag : '',

              unitid: upload.unitid,
              worktook: upload.worktook,
              lateentry: LateEntryPointsDeduct,
              points: LateEntryPointsDeduct ? 0 : (unitrateold * 8.333333333333333).toFixed(3),
              cpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * 8.333333333333333).toFixed(3),
              totalpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * finalflag * 8.333333333333333).toFixed(3),
              cstist: String(resultDate),
            };
          }
        });

        function getTimeDifference(start, end, id) {
          if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
              return '00:00:00';
            } else {
              const diff = new Date(endDate - startDate);
              return diff.toISOString().substr(11, 8);
            }
          }
        }

        let lastTimes = {};

        mergedDataallfirst = mergedDataallfirst.filter((d) => d !== null && d !== undefined);

        mergedDataall = mergedDataallfirst.sort((a, b) => {
          // First sort by empname
          if (a.empname < b.empname) return -1;
          if (a.empname > b.empname) return 1;
          // If empnames are equal, sort by dateval
          //  return a.dateval.localeCompare(b.dateval);
          return new Date(a.olddateval) - new Date(b.olddateval);
        });

         const empFirstLastIndex = {};
mergedDataall.forEach((item, idx) => {
  if (!empFirstLastIndex[item.empname]) {
    empFirstLastIndex[item.empname] = { first: idx, last: idx };
  } else {
    empFirstLastIndex[item.empname].last = idx;
  }
});

        mergedDataall.forEach((item, index) => {
             const {first,last} = empFirstLastIndex[item.empname]
          const originalDatetime = item.dateval;

          // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
          const finddatevalue = originalDatetime && originalDatetime?.split(' ');
          const findtime = finddatevalue && finddatevalue[1];
          const finddate = finddatevalue && finddatevalue[0];

          // const loginInfo = loginids.find((login) => login.userid === item.user && login.projectvendor == item.vendor);

          // const userInfo = loginInfo ? users.find((user) => user.companyname === loginInfo.empname) : '';

          // const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split('to');

          const formattedTimeshift = findtime;

          const clockindate = attendances.find((d) => {
            const [day, month, year] = d.date.split('-'); // Split the date string from the attendance record
            const dateObject = new Date(year, month - 1, day); // Create a new Date object
            const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`; // Format the date

            return formattedDateString === finddate && item.username == d.username;
          });

          // const [timePart, ampm] = clockindate ? clockindate.clockintime.split(' ') : ''; // Split the time and AM/PM
          // const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : ''; // Split hours, minutes, and seconds
          // let formattedHours = hours;
          // if (ampm === 'PM' && hours < 12) {
          //   formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
          // } else if (ampm === 'AM' && hours === 12) {
          //   formattedHours = 0; // Convert 12 AM to 0 hours
          // }
          // const formattedTime = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          // return formattedTime;
          const formattedTime = clockindate ? convertTo24HourFormat(clockindate.clockintime) : '';
          if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
            if (item) {
              if (!lastTimes.hasOwnProperty(item.empname)) {
                // console.log(clockindate,formattedTime,formattedTimeshift, 'formattedTimeshift'  )
                lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
              }
item.claimstatus ="first";
              item.worktook = getTimeDifference(`${finddate}T${lastTimes[item.empname]}Z`, `${finddate}T${findtime}Z`, '1');
            }
          } else if (item.empname == mergedDataall[index - 1].empname) {
            // item.empname = loginInfo.empname;
            item.worktook = getTimeDifference(mergedDataall[index - 1].olddateval, item.olddateval, '2');
            // lastTimes[loginInfo.empname] = findtime;
            //  productionResult.push(item);
             item.claimstatus = "";
             if (index === last) {
      item.claimstatus = "last";
    }
          }
        });
      } catch (err) {
        console.log(err, 'err');
        return next(new ErrorHandler('Records not found', 404));
      }
    }

    mergedData = mergedDataall.filter((item) => item != null);
  } catch (err) {
    console.log(err, 'err');
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({
    mergedData,
  });
});

//individual report
exports.getAllProductionTempReportFilter = catchAsyncErrors(async (req, res, next) => {
  let productionupload = [],
    mergedData,
    producionIndividual;
  let finaluser = [];
  let mergedDataall = [];
  try {
    const { companyname, username, user, projectvendor, category, filename, mode, fromtime, totime } = req.body;
    const dateObj = new Date(req.body.fromdate);

    const date = req.body.fromdate;

    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    // Format the date components into the desired format
    const formattedDate = `${day}-${month}-${year}`;

    let dateoneafter = new Date(req.body.fromdate);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split('T')[0];

    let datebefore = new Date(req.body.fromdate);
    datebefore.setDate(datebefore.getDate() - 1);
    let newDateOneMinus = datebefore.toISOString().split('T')[0];

    let dateNow = new Date(date);
    let datevalue = dateNow.toISOString().split('T')[0];

    let deptMonthQuery = {
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
    };
    let logidQuery = {
      loginallotlog: { $exists: true, $ne: [] },
      // allotted: 'allotted',
      userid: { $in: user },
    };

    let userQuery = {
      enquirystatus: {
        $nin: ['Enquiry Purpose'],
      },
      companyname: companyname,
      $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: '' } }, { reasondate: { $gte: date } }],
    };
    let startMonthDateMinus = new Date(date);
    let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
    let startMonthDate = new Date(startdate);

    let firstDate = new Date(date);
    let enddate = firstDate.setDate(firstDate.getDate() + 2);
    let endMonthDate = new Date(enddate);

    let query = {};
    let queryManual = {};

    if (filename.length > 0) {
      query.filenameupdated = { $in: filename };
      queryManual.filename = { $in: filename.map((item) => `${item}`) };
    }
    if (category.length > 0) {
      query.category = { $in: category };
      queryManual.category = { $in: category };
    }
    if (user.length > 0) {
      query.user = { $in: user };
      queryManual.user = { $in: user };
    }
    if (projectvendor.length > 0) {
      query.vendor = { $in: projectvendor };
      queryManual.vendor = { $in: projectvendor };
    }

    // query.dateobjformatdate = { $gte: new Date(`${date}T00:00:00Z`), $lte: new Date(`${newDateOnePlus}T18:00:00Z`) };
    query.dupe = 'No';

    queryManual.status = 'Approved';

    if (req.body.shift == 'Shift Based') {
      queryManual.$or = [{ fromdate: { $eq: req.body.fromdate } }, { fromdate: { $eq: newDateOnePlus } }];
    } else {
      queryManual.fromdate = { $eq: date };
    }

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayCount = startMonthDate.getDate();
      const shiftMode = 'Main Shift';
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
          ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
          : getWeekNumberInMonth(startMonthDate) === 3
          ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
          : getWeekNumberInMonth(startMonthDate) > 3
          ? `${getWeekNumberInMonth(startMonthDate)}th Week`
          : '';

      daysArray.push({
        formattedDate,
        dayName,
        dayCount,
        shiftMode,
        weekNumberInMonth,
      });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }
    const userDates = daysArray;

    const [attendenceControlCriteria, depMonthSet, usersAll, shift, loginids, producionIndividual, attendances] = await Promise.all([
      AttendanceControlCriteria.findOne().sort({ createdAt: -1 }).exec(),
      DepartmentMonth.find(deptMonthQuery, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 }),
      Users.find(userQuery, {
        companyname: 1,
        empcode: 1,
        company: 1,
        departmentlog: 1,
        unit: 1,
        branch: 1,
        team: 1,
        username: 1,
        processlog: 1,
        shifttiming: 1,
        department: 1,
        doj: 1,
        assignExpLog: 1,
        shiftallot: 1,
        boardingLog: 1,
        intStartDate: 1,
      }),
      Shift.find({}, { name: 1, fromhour: 1, tohour: 1, frommin: 1, tomin: 1, fromtime: 1, totime: 1, isallowance: 1 }).lean(),
      ClientUserid.find(logidQuery, { empname: 1, userid: 1, projectvendor: 1, loginallotlog: 1 }).lean(),
      mode.includes('Manual Production')
        ? ProducionIndividual.find(queryManual, {
            user: 1,
            fromdate: 1,
            time: 1,
            filename: 1,
            vendor: 1,
            mode: 1,
            category: 1,
            section: 1,
            unitid: 1,
            lateentrystatus: 1,
            updatedunitrate: 1,
            updatedflag: 1,
            updatedsection: 1,
            unallotcategory: 1,
            unallotsubcategory: 1,
          })
        : Promise.resolve([]),
      Attendances.find({ date: formattedDate, username: username }, { clockintime: 1, date: 1, username: 1 }),
    ]);
    let dayShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshifthourday) : 4;
    let dayShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshiftminday) : 0;
    let nightShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshifthournight) : 4;
    let nightShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshiftminnight) : 0;

    let users1 = usersAll.map((item) => {
      let findUserDepartment = item.department;
      let findUserTeam = item.team;
      let findUserProcess = item.process;
      let findexpval = item.experience;
      let userids = [];

      const loginallot = loginids.filter((login) => login.loginallotlog.some((d) => d.empname === item.companyname)).map((data) => data.userid);

      const dojDate = item.boardingLog.length > 0 ? item.boardingLog[0].startdate : item.doj;

      // Handling team change with boardingLog
      if (item.boardingLog && item.boardingLog.length > 0) {
        // Check if there's any team change
        const teamChangeLog = item.boardingLog.filter((log) => log.logcreation !== 'shift' && log.ischangeteam === true);

        if (teamChangeLog.length > 0) {
          // Sort by startdate descending
          const sortedTeamLog = teamChangeLog.sort((a, b) => {
            // First, compare startdate
            const startDateComparison = new Date(b.startdate) - new Date(a.startdate);
            if (startDateComparison !== 0) {
              return startDateComparison;
            }

            // If startdate is the same, compare createdat
            return b.updateddatetime - a.updateddatetime;
          });

          // Find the relevant team change based on the 'date'
          const findTeam = sortedTeamLog.find((log) => new Date(date) >= new Date(log.startdate));
          findUserTeam = findTeam ? findTeam.team : item.team;
        }
      }

      // Handling department change with departmentlog
      if (item.departmentlog && item.departmentlog.length > 0) {
        if (item.departmentlog.length > 1) {
          // Sort department logs by startdate descending
          const sortedDepartmentLog = item.departmentlog.sort((a, b) => {
            // First, compare startdate
            const startDateComparison = new Date(b.startdate) - new Date(a.startdate);
            if (startDateComparison !== 0) {
              return startDateComparison;
            }

            // If startdate is the same, compare createdat
            return b.updateddatetime - a.updateddatetime;
          });

          // Find the relevant department change based on the 'date'
          const findDept =
            sortedDepartmentLog.length > 1 && sortedDepartmentLog.map((item) => item.department).includes('Internship')
              ? sortedDepartmentLog.filter((item) => item.department != 'Internship').find((dept) => new Date(date) >= new Date(dept.startdate))
              : sortedDepartmentLog.find((dept) => new Date(date) >= new Date(dept.startdate));
          findUserDepartment = findDept ? findDept.department : item.department;
        } else if (item.departmentlog.length === 1) {
          findUserDepartment = new Date(date) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : item.department;
        } else {
          findUserDepartment = item.department;
        }
      }

      if (item && item.processlog) {
        const groupedByMonthProcs = {};

        // Group items by month
        item.processlog &&
          item.processlog
            ?.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })
            ?.forEach((d) => {
              const monthYear = d.date?.split('-').slice(0, 2).join('-');
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

          if (new Date(req.body.date) >= new Date(date)) {
            findUserProcess = lastItemsForEachMonthPros[i];
          } else {
            break;
          }
        }
      }
      const groupedByMonth = {};
      if (item.assignExpLog && item.assignExpLog.length > 0) {
        const findMonthStartDate = depMonthSet.find((data) => new Date(date) >= new Date(data.fromdate) && new Date(date) <= new Date(data.todate) && data.department == findUserDepartment);
        let findDate = findMonthStartDate ? findMonthStartDate.fromdate : date;
        item.assignExpLog &&
          item.assignExpLog.length > 0 &&
          item.assignExpLog
            .filter((d) => d.expmode != 'Auto' && d.expmode != 'Manual')
            .sort((a, b) => {
              return new Date(a.updatedate) - new Date(b.updatedate);
            })
            .forEach((item) => {
              const monthYear = item.updatedate?.split('-').slice(0, 2).join('-');
              if (!groupedByMonth[monthYear]) {
                groupedByMonth[monthYear] = [];
              }
              groupedByMonth[monthYear].push(item);
            });

        // Extract the last item of each group
        const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

        // Find the first item in the sorted array that meets the criteria

        // Find the first item in the sorted array that meets the criteria
        let filteredItem = null;

        for (let i = 0; i < lastItemsForEachMonth.length; i++) {
          const date1 = lastItemsForEachMonth[i].updatedate;

          if (date >= date1) {
            filteredItem = lastItemsForEachMonth[i];
          } else {
            break;
          }
        }

        let modevalue = filteredItem;

        const calculateMonthsBetweenDates = (startDate, endDate) => {
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            // Convert years to months
            months += years * 12;

            // Adjust for negative days
            if (days < 0) {
              months -= 1; // Subtract a month
              days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
            }

            // Adjust for days 15 and above
            if (days >= 15) {
              months += 1; // Count the month if 15 or more days have passed
            }

            return months <= 0 ? 0 : months;
          }

          return 0; // Return 0 if either date is missing
        };

        // Calculate difference in months between findDate and item.doj
        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
        if (modevalue) {
          //findexp end difference yes/no
          if (modevalue.endexp === 'Yes') {
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
            //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === 'Add') {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Minus') {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Fix') {
              differenceInMonthsexp = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
            // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === 'Add') {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Minus') {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Fix') {
              differenceInMonthsexp = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
            }
          }

          //findtar end difference yes/no
          if (modevalue.endtar === 'Yes') {
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
            //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === 'Add') {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Minus') {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Fix') {
              differenceInMonthstar = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
            if (modevalue.expmode === 'Add') {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Minus') {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === 'Fix') {
              differenceInMonthstar = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
            }
          }

          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
          if (modevalue.expmode === 'Add') {
            differenceInMonths += parseInt(modevalue.expval);
          } else if (modevalue.expmode === 'Minus') {
            differenceInMonths -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === 'Fix') {
            differenceInMonths = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        }
        // console.log(differenceInMonthstar, modevalue, 'differenceInMonthstar');
        findexpval = differenceInMonthstar < 1 ? '00' : differenceInMonthstar <= 9 ? '0' + differenceInMonthstar : differenceInMonthstar;
      }
      let findUserProcessFinal = findUserProcess ? findUserProcess.process : item.process;

      return {
        ...item._doc,
        department: findUserDepartment,
        team: findUserTeam,
        process: findUserProcessFinal,
        exp: findexpval,
        dojDate: dojDate,
        userids: loginallot,
      };
    });

    let userShifts = users1;
    finaluser =
      userShifts &&
      userShifts.length > 0 &&
      userShifts?.flatMap((item, index) => {
        const findShiftTiming = (shiftName) => {
          const foundShift = shift?.find((d) => d.name === shiftName);
          return foundShift ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime}to${foundShift.tohour}:${foundShift.tomin}${foundShift.totime} ` : '';
        };
        const findShiftTimingsts = (shiftName) => {
          const foundShift = shift?.find((d) => d.name === shiftName);
          return foundShift ? `${foundShift.isallowance}` : '';
        };

        const filteredMatchingDoubleShiftItem = item.shiftallot?.filter((val) => val && val.empcode === item.empcode && val.adjstatus === 'Approved');

        // Filter out the dates that have matching 'Shift Adjustment' todates
        let removedUserDates = userDates.filter((date) => {
          // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
          const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem?.find((item) => item && item.todate === date.formattedDate && item.adjustmenttype === 'Shift Adjustment');

          // If there is no matching 'Shift Adjustment', keep the date
          return !matchingShiftAdjustmentToDate;
        });

        // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
        let uniqueEntries = new Set();

        // Iterate over removedUserDates and add unique entries to the Set
        userDates.forEach((date) => {
          uniqueEntries.add(
            JSON.stringify({
              formattedDate: date.formattedDate,
              dayName: date.dayName,
              dayCount: date.dayCount,
              shiftMode: 'Main Shift',
              weekNumberInMonth: date.weekNumberInMonth,
            })
          );
        });

        // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
        filteredMatchingDoubleShiftItem &&
          filteredMatchingDoubleShiftItem?.forEach((item) => {
            const [day, month, year] = item.adjdate?.split('/');
            let newFormattedDate = new Date(`${year}-${month}-${day}`);

            if (item.adjustmenttype === 'Shift Adjustment' || item.adjustmenttype === 'Add On Shift' || item.adjustmenttype === 'Shift Weekoff Swap') {
              uniqueEntries.add(
                JSON.stringify({
                  formattedDate: item.adjdate,
                  dayName: moment(item.adjdate, 'DD/MM/YYYY').format('dddd'),
                  dayCount: parseInt(moment(item.adjdate, 'DD/MM/YYYY').format('DD')),
                  shiftMode: 'Second Shift',
                  weekNumberInMonth:
                    getWeekNumberInMonth(newFormattedDate) === 1
                      ? `${getWeekNumberInMonth(newFormattedDate)}st Week`
                      : getWeekNumberInMonth(newFormattedDate) === 2
                      ? `${getWeekNumberInMonth(newFormattedDate)}nd Week`
                      : getWeekNumberInMonth(newFormattedDate) === 3
                      ? `${getWeekNumberInMonth(newFormattedDate)}rd Week`
                      : getWeekNumberInMonth(newFormattedDate) > 3
                      ? `${getWeekNumberInMonth(newFormattedDate)}th Week`
                      : '',
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
              const dateA = new Date(a.formattedDate.split('/').reverse().join('/'));
              const dateB = new Date(b.formattedDate.split('/').reverse().join('/'));
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
          let filteredRowData = item.shiftallot?.filter((val) => val.empcode == item.empcode);
          const matchingItem = filteredRowData.find((item) => item && item.adjdate == date.formattedDate);
          const matchingItemAllot = filteredRowData?.find((item) => item && formatDate(item.date) == date.formattedDate);
          const matchingDoubleShiftItem = filteredRowData?.find((item) => item && item.todate === date.formattedDate);
          const matchingRemovedItem = filteredRowData.find((item) => item.removedshiftdate === date.formattedDate);
          const matchingAssignShiftItem = filteredRowData?.find((item) => item?._doc?.adjdate === date.formattedDate && item?._doc?.adjstatus === 'Approved' && item?._doc?.adjustmenttype === 'Assign Shift');

          const filterBoardingLog =
            item.boardingLog &&
            item.boardingLog?.filter((item) => {
              return item.logcreation === 'user' || item.logcreation === 'shift';
            });

          // Check if the dayName is Sunday or Monday
          // const isWeekOff = item.weekoff?.includes(date.dayName);

          const isWeekOff = getWeekOffDay(date, filterBoardingLog, item.department, depMonthSet) === 'Week Off' ? true : false;
          const isWeekOffWithAdjustment = isWeekOff && matchingItem;
          const isWeekOffWithManual = isWeekOff && matchingItemAllot;

          const actualShiftTiming = findShiftTiming(item.shifttiming);
          const row = {
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            companyname: item.companyname,
            empcode: item.empcode,
            username: item.username,
            shifttiming: getShiftForDateProdDay(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem),
            date: date.formattedDate,
            shiftmode: date.shiftMode,
            shiftsts: findShiftTimingsts(getShiftForDateProdDay(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem)),
          };

          return row;
        });
        return userRows;
      });

    let dateSelectedFormat = moment(date).format('DD/MM/YYYY');
    let dateSelectedFormatOnePlus = moment(newDateOnePlus).format('DD/MM/YYYY');
    let dateSelectedFormatOneMinus = moment(newDateOneMinus).format('DD/MM/YYYY');
    // let dateSelectedFormatTwoPlus = moment(newDateTwoPlus).format('DD/MM/YYYY');

    let shiftEndTime = `${date}T00:00:00.000Z`;
    let shiftFromTime = `${date}T00:00:00.000Z`;
    let shiftOnlyFromTime = `${date}T00:00:00.000Z`;
    let shiftOnlyEndTime = `${date}T00:00:00.000Z`;

    let users = users1
      .flatMap((item) => {
        let finaluserFiltered = finaluser.filter((d) => d.shifttiming != undefined && d.companyname === item.companyname);
        // console.log(finaluserFiltered,'finaluserFiltered')
        function filterData(data) {
          // console.log(data, dateSelectedFormatOneMinus, dateSelectedFormat, dateSelectedFormatOnePlus, 'data')
          const previousEntry = data.find((d) => d.date === dateSelectedFormatOneMinus);
          const firstEntry = data.find((d) => d.date === dateSelectedFormat);
          const secondEntry = data.find((d) => d.date === dateSelectedFormatOnePlus);
          const firstEntryDoubleShift = data.find((d) => d.date === dateSelectedFormat && d.shiftmode === 'Second Shift' && d.shifttiming != undefined);
          const firstEntryDoubleShiftPM = data.find((d) => d.date === dateSelectedFormat && d.shiftmode === 'Second Shift' && d.shifttiming != undefined && d.shifttiming.split('to')[0].includes('PM'));
          // const thirdEntry = data.find((d) => d.date === dateSelectedFormatTwoPlus);
          // console.log(firstEntry, firstEntryDoubleShift, 'firstEntryDoubleShift');
          const isBeforeDayDoubleShift = data.find((d) => d.date === dateSelectedFormatOneMinus && d.shiftmode === 'Second Shift' && d.shifttiming != undefined);
          const isBeforeDayDoubleShiftPM = isBeforeDayDoubleShift && isBeforeDayDoubleShift.shifttiming.split('to')[0].includes('PM');

          // if (!firstEntry) return [];
          const ispreviousShiftWeekoff = previousEntry && previousEntry.shifttiming !== '' && previousEntry.shifttiming == 'Week Off';
          const isFirstShiftWeekoff = firstEntry && firstEntry.shifttiming !== '' && firstEntry.shifttiming == 'Week Off';
          const isSecondShiftWeekoff = secondEntry && secondEntry.shifttiming !== '' && secondEntry.shifttiming == 'Week Off';
          const isFirstShiftPM = firstEntry && firstEntry.shifttiming !== '' && firstEntry.shifttiming != 'Week Off' ? firstEntry.shifttiming.split('to')[0].includes('PM') : '';
          const isPreviousShiftPM = previousEntry && previousEntry.shifttiming !== '' && previousEntry.shifttiming != 'Week Off' ? previousEntry.shifttiming.split('to')[0].includes('PM') : '';
          const isSecondShiftPM = secondEntry && secondEntry.shifttiming !== '' && secondEntry.shifttiming != 'Week Off' ? secondEntry.shifttiming.split('to')[0].includes('PM') : '';
          // console.log(firstEntry,secondEntry, 'firstEntry');
          const isMainShift = firstEntry && firstEntry.shiftmode === 'Main Shift';
          const isPlusShift = firstEntry && firstEntry.plusshift && firstEntry.plusshift != '';

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
            if (period === 'PM' && hours < 12) {
              hours += 12;
            }
            if (period === 'AM' && hours === 12) {
              hours = 0;
            }

            // Format the time as 'HH:MM'
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
          }
          if (isFirstShiftWeekoff && isSecondShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${date}T10:00:00Z`) : new Date(`${date}T01:00:00Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
            shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
          } else if (isFirstShiftWeekoff && ispreviousShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${date}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
            shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() - 1));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
          } else if (isFirstShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${date}T10:00:00Z`) : new Date(`${date}T01:00:00Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
            shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime')
          } else if (isSecondShiftWeekoff) {
            let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T10:00:00Z`) : new Date(`${newDateOnePlus}T01:00:00Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime);
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTimesec')
          } else if (firstEntryDoubleShift && secondEntry.shifttiming === 'Not Allotted') {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);

            let newFromTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            let newEndTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            const shiftOnlyFromTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            const shiftOnlyEndTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`);

            const finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            const finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            let shiftEndTimeFirstShift = newEndTime;

            const shiftFromTimeSecondShift = new Date(newFromTimeSecondShift.setSeconds(newFromTimeSecondShift.getSeconds() + 1));
            let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift);
            // shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = [
              { shiftFromTime, shiftEndTime: shiftEndTimeFirstShift, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime },
              { shiftFromTime: shiftFromTimeSecondShift, shiftEndTime: shiftEndTimeSecondShift, shiftsts: 'Disable', shifttiming: firstEntryDoubleShift.shifttiming, shiftOnlyFromTime: shiftOnlyFromTimeSecondShift, shiftOnlyEndTime: shiftOnlyEndTimeSecondShift },
            ];
          } else if (firstEntryDoubleShift && secondEntry.shifttiming != 'Not Allotted') {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);

            let newFromTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            let newEndTimeSecondShift = isSecondShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            const shiftOnlyFromTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            const shiftOnlyEndTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`);

            const finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            const finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            let shiftEndTimeFirstShift = newEndTime;

            const shiftFromTimeSecondShift = new Date(newFromTimeSecondShift.setSeconds(newFromTimeSecondShift.getSeconds() + 1));
            //  let shiftEndTimeFirstShift = newEndTime;

            //   const shiftFromTimeSecondShift = new Date(newFromTimeSecondShift.setSeconds(newFromTimeSecondShift.getSeconds() + 1));
            //   let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift);
            // shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = [
              { shiftFromTime, shiftEndTime: shiftEndTimeFirstShift, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime },
              { shiftFromTime: shiftFromTimeSecondShift, shiftEndTime: shiftEndTimeSecondShift, shiftsts: 'Disable', shifttiming: firstEntryDoubleShift.shifttiming, shiftOnlyFromTime: shiftOnlyFromTimeSecondShift, shiftOnlyEndTime: shiftOnlyEndTimeSecondShift },
            ];
          } else if (isBeforeDayDoubleShift && firstEntry.shifttiming === 'Not Allotted' && secondEntry) {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isBeforeDayDoubleShiftPM ? new Date(`${date}T${convertTo24Hour(isBeforeDayDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(isBeforeDayDoubleShift.shifttiming.split('to')[1])}Z`);
            let newEndTime = isBeforeDayDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${'00:00:00'}Z`) : new Date(`${date}T${'00:00:00'}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${date}T${'00:00:00'}Z`) : new Date(`${date}T${'00:00:00'}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            // shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);
            shiftFromTime = new Date(shiftFromTime.setSeconds(shiftFromTime.getSeconds() - 59));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: 'Not Allot', shiftOnlyFromTime, shiftOnlyEndTime };
          } else if (firstEntry.shifttiming === 'Not Allotted' && secondEntry && previousEntry) {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isPreviousShiftPM ? new Date(`${date}T${convertTo24Hour(previousEntry.shifttiming.split('to')[1])}Z`) : new Date(`${newDateOneMinus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[1])}Z`);
            let newEndTime = isSecondShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${'00:00:00'}Z`) : new Date(`${date}T${'00:00:00'}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${date}T${'00:00:00'}Z`) : new Date(`${date}T${'00:00:00'}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            // shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);
            shiftFromTime = new Date(shiftFromTime.setSeconds(shiftFromTime.getSeconds() - 59));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: 'Not Allot', shiftOnlyFromTime, shiftOnlyEndTime };
          } else if (firstEntry && secondEntry.shifttiming === 'Not Allotted') {
            // console.log("secondshiftnotallot")
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            // shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            // shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));
            shiftEndTime = newEndTime;

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
          } else if (firstEntry && secondEntry) {
            // console.log("thislastelseif")
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming, shiftOnlyFromTime, shiftOnlyEndTime };
          } else {
            data = { shiftFromTime: new Date(shiftFromTime), shiftEndTime: new Date(shiftEndTime), shiftOnlyFromTime, shiftOnlyEndTime, shiftsts: 'Disable' };
          }

          return data; // Return the original data if conditions are not met
        }

        userShiftTimings = finaluserFiltered.length >= 3 ? filterData(finaluserFiltered) : { shiftFromTime: new Date(shiftFromTime), shiftEndTime: new Date(shiftEndTime), shiftOnlyFromTime, shiftOnlyEndTime, shiftsts: 'Disable' };

        if (finaluserFiltered.find((d) => d.date === dateSelectedFormat && d.shiftmode === 'Second Shift' && d.shifttiming != undefined)) {
          return [
            {
              companyname: item.companyname,
              empcode: item.empcode,
              company: item.company,
              unit: item.unit,
              branch: item.branch,
              team: item.team,
              username: item.username,
              department: item.department,
              doj: item.doj,
              exp: item.exp,
              process: item.process,
              dojDate: item.dojDate,
              userids: item.userids,
              userShiftTimings: userShiftTimings[0],
            },
            {
              companyname: item.companyname,
              empcode: item.empcode,
              company: item.company,
              unit: item.unit,
              branch: item.branch,
              team: item.team,
              username: item.username,
              department: item.department,
              doj: item.doj,
              exp: item.exp,
              process: item.process,
              dojDate: item.dojDate,
              userids: item.userids,
              userShiftTimings: userShiftTimings[1],
            },
          ];
        } else {
          return {
            companyname: item.companyname,
            empcode: item.empcode,
            company: item.company,
            unit: item.unit,
            branch: item.branch,
            team: item.team,
            username: item.username,
            department: item.department,
            doj: item.doj,
            exp: item.exp,
            process: item.process,
            dojDate: item.dojDate,
            userids: item.userids,
            //  assignExpLog: item.assignExpLog.filter((d) => d.expmode != 'Auto' && d.expmode != 'Manual').sort((a, b) => new Date(a.updatedate) - new Date(b.updatedate)),
            userShiftTimings: userShiftTimings,
          };
        }
      })
      .sort((a, b) => new Date(a.userShiftTimings.shiftFromTime) - new Date(b.userShiftTimings.shiftFromTime));

    const { minStart, maxEnd } = users
      .filter((d) => d.userShiftTimings.shiftFromTime && d.userShiftTimings.shiftFromTime !== '')
      .reduce(
        (acc, obj) => {
          const startTime = new Date(obj.userShiftTimings.shiftFromTime);
          const endTime = new Date(obj.userShiftTimings.shiftEndTime);

          // console.log('Comparing:', startTime, endTime);

          // Update minimum start time
          if (!acc.minStart || startTime < acc.minStart) {
            acc.minStart = startTime;
          }

          // Update maximum end time
          if (!acc.maxEnd || endTime > acc.maxEnd) {
            acc.maxEnd = endTime;
          }

          return acc;
        },
        { minStart: null, maxEnd: null } // Proper initialization
      );
    if (req.body.shift == 'Shift Based') {
      query.dateobjformatdate = { $gte: minStart, $lte: maxEnd };
    } else {
      query.dateobjformatdate = { $gte: new Date(`${date}T${fromtime}Z`), $lte: new Date(`${date}T${totime}Z`) };
    }

    console.log(query, 'query');

    if (mode.includes('Production')) {
      // console.log("123")
      productionupload = await ProductionTempUploadAll.find(query, {
        user: 1,
        formatteddate: 1,
        formattedtime: 1,
        dupe: 1,
        filenameupdated: 1,
        vendor: 1,
        category: 1,
        section: 1,
        flagcount: 1,
        unitid: 1,
        unitrate: 1,
        updatedunitrate: 1,
        updatedflag: 1,
        updatedsection: 1,
        unallotcategory: 1,
        unallotsubcategory: 1,
      });
    }

    console.log(users.length, shift.length, loginids.length, productionupload.length, 'individialreport');

    let allData = mode.includes('Production') && mode.includes('Manual Production') ? [...producionIndividual, ...productionupload] : mode.includes('Production') ? productionupload : producionIndividual;

    function compareDateTimes(dateT, shiftFrom, shiftEnd) {
      // Parse the datetime strings into Date objects
      const dateTimeObj = dateT;
      const shiftFromTimeObj = shiftFrom;
      const shiftEndTimeObj = shiftEnd;
      // Perform the comparisons
      const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

      return isWithinShift;
    }

    // Step 1: Flatten the loginallotlog array and include user info
    let logs = loginids.flatMap((user) =>
      user.loginallotlog.map((log) => ({
        userid: user.userid,
        projectvendor: user.projectvendor,
        date: log.date,
        time: log.time,
        empname: log.empname,
        empcode: log.empcode,
        enddate: log.enddate ? log.enddate : null,
      }))
    );

    // Step 2: Sort logs by date and time (ascending order)
    logs.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return new Date(a.date) - new Date(b.date);
    });

    // Step 3: Calculate the enddate for each log (except the last log for each userid)
    const userLogsMap = {};

    logs.forEach((log) => {
      if (!userLogsMap[log.userid]) {
        userLogsMap[log.userid] = {};
      }

      if (!userLogsMap[log.userid][log.projectvendor]) {
        userLogsMap[log.userid][log.projectvendor] = [];
      }

      userLogsMap[log.userid][log.projectvendor].push(log);
    });

    Object.values(userLogsMap).forEach((userLogs) => {
      Object.values(userLogs).forEach((logsArray) => {
        logsArray.forEach((log, idx) => {
          if (idx < logsArray.length - 1) {
            log.enddate = logsArray[idx + 1].date;
          }
        });
      });
    });

    // Step 4: Filter logs based on input date
    const filteredLogs = logs.filter((log) => {
      return new Date(log.date) <= new Date(req.body.date) && (!log.enddate || new Date(log.enddate) >= new Date(req.body.date));
    });

    // Step 5: Sort the filtered logs by date and time (descending order)
    filteredLogs.sort((a, b) => {
      if (a.date === b.date) {
        return b.time.localeCompare(a.time);
      }
      return new Date(b.date) - new Date(a.date);
    });

    if (req.body.shift == 'Shift Based') {
      try {
        let mergedDataallfirst = allData.map((upload) => {
          const loginInfo = filteredLogs.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);

          let loginallot = loginInfo ? loginInfo : [];
          let filteredDataDateTime = null;

          if (loginallot.length > 0) {
            const groupedByDateTime = {};

            loginallot.forEach((item) => {
              const dateTime = item.date + ' ' + item.time;
              if (!groupedByDateTime[dateTime]) {
                groupedByDateTime[dateTime] = [];
              }
              groupedByDateTime[dateTime].push(item);
            });

            // Extract the last item of each group
            const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

            // Sort the last items by date and time
            lastItemsForEachDateTime.sort((a, b) => {
              return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
            });

            // Find the first item in the sorted array that meets the criteria
            for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
              const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
              // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
              let datevalsplitfinal = upload.mode == 'Manual' ? `${upload.fromdate}T${uploadtime}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
              if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                filteredDataDateTime = lastItemsForEachDateTime[i];
              } else {
                break;
              }
            }
          }

          let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : '';
          // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
          const comparedate = upload.mode == 'Manual' ? upload.fromdate : upload.formatteddate;
          const comparetime = upload.mode == 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime;

          const dateTime = new Date(`${comparedate}T${comparetime}Z`);

          // const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : '';
          const userInfo = users.find((user) => logininfoname === user.companyname && dateTime >= user.userShiftTimings.shiftFromTime && dateTime <= user.userShiftTimings.shiftEndTime);

          // console.log(dateSelectedFormat, dateSelectedFormatOnePlus, dateSelectedFormatOneMinus, 'sdfd')
          if (userInfo) {
            userShiftTimings = userInfo.userShiftTimings;
          } else {
            userShiftTimings = { shiftFromTime: shiftFromTime, shiftEndTime: shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, shiftsts: '' };
          }

          let getprocessCode = userInfo ? userInfo.process : '';

          const finalcategory = upload.unallotcategory ? upload.unallotcategory : upload.mode == 'Manual' ? upload.filename : upload.filenameupdated;

          const filenamespiliteed = finalcategory;
          const finalsubcategory = upload.unallotsubcategory ? upload.unallotsubcategory : upload.category;

          // const datesplited = upload.mode == "Manual" ? upload.fromdate + " " + uploadtime + ":00" : upload.dateval?.split(" IST")[0]

          let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
          let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

          let LateEntryPointsDeduct = upload.mode == 'Manual' && upload.lateentrystatus === 'Late Entry';

          //  console.log(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime,'check')

          if (compareDateTimes(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime)) {
            return {
              user: upload.user,
              fromdate: upload.fromdate,
              todate: upload.todate,
              vendor: upload.vendor,
              category: finalsubcategory,
              dateval: upload.mode === 'Manual' ? `${upload.fromdate} ${convertTo24HourFormat(upload.time)}` : `${upload.formatteddate} ${upload.formattedtime}`,
              olddateval: upload.mode === 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`,
              time: upload.mode === 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime,
              filename: finalcategory,
              mode: upload.mode === 'Manual' ? 'Manual' : 'Production',
              empname: userInfo && userInfo.companyname,
              empcode: userInfo && userInfo.empcode,
              company: userInfo && userInfo.company,
              unit: userInfo && userInfo.unit,
              branch: userInfo && userInfo.branch,
              team: userInfo && userInfo.team,
              shifttiming: userShiftTimings ? userShiftTimings.shifttiming : '',
              username: userInfo && userInfo.username,
              empcode: userInfo && userInfo.empcode,
              _id: upload._id,
              section: upload.updatedsection ? upload.updatedsection : upload.section,
              flagcount: upload.updatedflag ? upload.updatedflag : upload.flagcount,
              unitid: upload.unitid,
              worktook: upload.worktook,
              lateentry: LateEntryPointsDeduct,
              points: LateEntryPointsDeduct ? 0 : (finalunitrate * 8.333333333333333).toFixed(3),
              totalpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * finalflag * 8.333333333333333).toFixed(3),

              // points: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : Number(upload.unitrate) * 8.333333333333333,
            };
          }
        });

        function getTimeDifference(start, end) {
          // console.log(start, end, "startend");
          if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
              return '00:00:00';
            } else {
              const diff = new Date(endDate - startDate);
              return diff.toISOString().substr(11, 8);
            }
          }
        }

        let lastTimes = {};

        mergedDataallfirst = mergedDataallfirst.filter((d) => d !== null && d !== undefined);

        mergedDataall = mergedDataallfirst.sort((a, b) => {
          // First sort by empname
          if (a.empname < b.empname) return -1;
          if (a.empname > b.empname) return 1;
          // If empnames are equal, sort by dateval
          //  return a.dateval.localeCompare(b.dateval);
          return new Date(a.olddateval) - new Date(b.olddateval);
        });

           const empFirstLastIndex = {};
mergedDataall.forEach((item, idx) => {
  if (!empFirstLastIndex[item.empname]) {
    empFirstLastIndex[item.empname] = { first: idx, last: idx };
  } else {
    empFirstLastIndex[item.empname].last = idx;
  }
});

        mergedDataall.forEach((item, index) => {
            const {first,last} = empFirstLastIndex[item.empname]
          const originalDatetime = item.dateval;
          // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
          const finddatevalue = originalDatetime && originalDatetime?.split(' ');
          const findtime = finddatevalue && finddatevalue[1];
          const finddate = finddatevalue && finddatevalue[0];

          // const loginInfo = loginids.find((login) => login.userid === item.user && login.projectvendor == item.vendor);

          // const userInfo = loginInfo ? users.find((user) => user.companyname === loginInfo.empname) : '';

          // const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split('to');

          // const getshift = item.shifttiming == 'Week Off' || item.shifttiming == 'Not Allotted' ? findtime : item.shifttiming  && item.shifttiming.split('to')[0];
          // let hours24 = '';
          // const [time, period] = getshift?.includes('AM') ? getshift.split('AM') : getshift.split('PM');
          // let [hoursshift, minutesshift] = time.split(':');

          // if (item.shifttiming != 'Week Off' &&  item.shifttiming !== 'Not Allotted' ) {
          //   // Converting hours to 24-hour format if the period is "PM" and not "12"
          //   hours24 = parseInt(hoursshift, 10);
          //   if (getshift.includes('PM') && hoursshift !== '12') {
          //     hours24 += 12;
          //   }
          // } else {
          //   hours24 = parseInt(getshift.split(':')[0], 10);
          //   minutesshift = getshift.split(':')[1];
          // }
          // let secondssets = item.shifttiming == 'Week Off' || item.shifttiming == 'Not Allotted' ? 0 : getshift.split(':')[0];
          // // Creating a new Date object with the updated hours
          // const date1 = new Date(finddate);
          // date1.setHours(hours24);
          // date1.setMinutes(parseInt(minutesshift, 10));
          // date1.setSeconds(secondssets);

          // Formatting the date to "hh:mm:ss" format
          const formattedTimeshift = findtime;

          const clockindate = attendances.find((d) => {
            const [day, month, year] = d.date.split('-'); // Split the date string from the attendance record
            const dateObject = new Date(year, month - 1, day); // Create a new Date object
            const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`; // Format the date

            return formattedDateString === finddate && item.username == d.username;
          });

          const [timePart, ampm] = clockindate ? clockindate.clockintime.split(' ') : ''; // Split the time and AM/PM
          const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : ''; // Split hours, minutes, and seconds
          let formattedHours = hours;
          if (ampm === 'PM' && hours < 12) {
            formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
          } else if (ampm === 'AM' && hours === 12) {
            formattedHours = 0; // Convert 12 AM to 0 hours
          }
          const formattedTime = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          // return formattedTime;

          if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
            if (item) {
              if (!lastTimes.hasOwnProperty(item.empname)) {
                lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
              }
item.claimstatus ="first";
              item.worktook = getTimeDifference(`${finddate}T${lastTimes[item.empname]}Z`, `${finddate}T${findtime}Z`);
            }
          } else if (item.empname == mergedDataall[index - 1].empname) {
            // item.empname = loginInfo.empname;
            item.worktook = getTimeDifference(mergedDataall[index - 1].olddateval, item.olddateval);
            // lastTimes[loginInfo.empname] = findtime;
            //  productionResult.push(item);
             item.claimstatus = "";
                         if (index === last) {
                  item.claimstatus = "last";
                }
          }
        });
      } catch (err) {
        console.log(err, 'err');
        // return next(new ErrorHandler("Records not found", 404));
      }
    } else if (req.body.shift == 'Date Based') {
      try {
        let mergedDataallfirst = allData.map((upload) => {
          const loginInfo = filteredLogs.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);

          let loginallot = loginInfo ? loginInfo : [];
          let filteredDataDateTime = null;
          if (loginallot.length > 0) {
            const groupedByDateTime = {};

            loginallot.forEach((item) => {
              const dateTime = item.date + ' ' + item.time;
              if (!groupedByDateTime[dateTime]) {
                groupedByDateTime[dateTime] = [];
              }
              groupedByDateTime[dateTime].push(item);
            });

            // Extract the last item of each group
            const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

            // Sort the last items by date and time
            lastItemsForEachDateTime.sort((a, b) => {
              return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
            });

            // Find the first item in the sorted array that meets the criteria
            for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
              const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
              // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
              let datevalsplitfinal = upload.mode == 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
              if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                filteredDataDateTime = lastItemsForEachDateTime[i];
              } else {
                break;
              }
            }
          }

          let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : '';

          const comparedate = upload.mode == 'Manual' ? upload.fromdate : upload.formatteddate;
          const comparetime = upload.mode == 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime;

          const fromdatetime = new Date(`${date}T${fromtime}Z`);
          const todatetime = new Date(`${date}T${totime}Z`);

          const dateTime = new Date(`${comparedate}T${comparetime}Z`);
          // console.log(users[0].userShiftTimings.shiftFromTime,'user.userShiftTimings.shiftFromTime')
          // const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : '';
          const userInfo = users.find((user) => logininfoname === user.companyname);

          // let userShiftTimings = {};

          if (userInfo) {
            userShiftTimings = userInfo.userShiftTimings;
          } else {
            userShiftTimings = { shiftFromTime: new Date(shiftFromTime), shiftEndTime: new Date(shiftEndTime), shiftOnlyFromTime, shiftOnlyEndTime, shiftsts: '' };
          }

          let getprocessCode = userInfo ? userInfo.process : '';

          const finalcategory = upload.unallotcategory ? upload.unallotcategory : upload.mode == 'Manual' ? upload.filename : upload.filenameupdated;

          const finalsubcategory = upload.unallotsubcategory ? upload.unallotsubcategory : upload.category;

          let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
          let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

          let LateEntryPointsDeduct = upload.mode == 'Manual' && upload.lateentrystatus === 'Late Entry';
          // console.log(todatetime,'todatetime')
          if (compareDateTimes(dateTime, fromdatetime, todatetime)) {
            return {
              user: upload.user,
              fromdate: upload.fromdate,
              todate: upload.todate,
              vendor: upload.vendor,
              category: finalsubcategory,
              dateval: upload.mode === 'Manual' ? `${upload.fromdate} ${convertTo24HourFormat(upload.time)}` : `${upload.formatteddate} ${upload.formattedtime}`,
              olddateval: upload.mode === 'Manual' ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`,

              time: upload.mode === 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime,
              mode: upload.mode === 'Manual' ? 'Manual' : 'Production',
              empname: userInfo && userInfo.companyname,
              empcode: userInfo && userInfo.empcode,
              company: userInfo && userInfo.company,
              unit: userInfo && userInfo.unit,
              branch: userInfo && userInfo.branch,
              team: userInfo && userInfo.team,
              shifttiming: userShiftTimings && userShiftTimings?.shifttiming ? userShiftTimings?.shifttiming : '',

              username: userInfo && userInfo.username,
              empcode: userInfo && userInfo.empcode,
              _id: upload._id,
              section: upload.updatedsection ? upload.updatedsection : upload.section,
              flagcount: upload.updatedflag ? upload.updatedflag : upload.flagcount,
              unitid: upload.unitid,
              filename: finalcategory,
              worktook: upload.worktook,
              // points: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : Number(upload.unitrate) * 8.333333333333333,
              points: LateEntryPointsDeduct ? 0 : (finalunitrate * 8.333333333333333).toFixed(3),
              totalpoints: LateEntryPointsDeduct ? 0 : (finalunitrate * finalflag * 8.333333333333333).toFixed(3),
            };
          }
        });

        function getTimeDifference(start, end, id) {
          if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
              return '00:00:00';
            } else {
              const diff = new Date(endDate - startDate);
              return diff.toISOString().substr(11, 8);
            }
          }
        }

        let lastTimes = {};

        mergedDataallfirst = mergedDataallfirst.filter((d) => d !== null && d !== undefined);

        mergedDataall = mergedDataallfirst.sort((a, b) => {
          // First sort by empname
          if (a.empname < b.empname) return -1;
          if (a.empname > b.empname) return 1;
          // If empnames are equal, sort by dateval
          //  return a.dateval.localeCompare(b.dateval);
          return new Date(a.olddateval) - new Date(b.olddateval);
        });

          const empFirstLastIndex = {};
mergedDataall.forEach((item, idx) => {
  if (!empFirstLastIndex[item.empname]) {
    empFirstLastIndex[item.empname] = { first: idx, last: idx };
  } else {
    empFirstLastIndex[item.empname].last = idx;
  }
});

        mergedDataall.forEach((item, index) => {
            const {first,last} = empFirstLastIndex[item.empname]
          const originalDatetime = item.dateval;

          // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
          const finddatevalue = originalDatetime && originalDatetime?.split(' ');
          const findtime = finddatevalue && finddatevalue[1];
          const finddate = finddatevalue && finddatevalue[0];

          // const loginInfo = loginids.find((login) => login.userid === item.user && login.projectvendor == item.vendor);

          // const userInfo = loginInfo ? users.find((user) => user.companyname === loginInfo.empname) : '';

          // const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split('to');

          const formattedTimeshift = findtime;

          const clockindate = attendances.find((d) => {
            const [day, month, year] = d.date.split('-'); // Split the date string from the attendance record
            const dateObject = new Date(year, month - 1, day); // Create a new Date object
            const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`; // Format the date

            return formattedDateString === finddate && item.username == d.username;
          });

          const [timePart, ampm] = clockindate ? clockindate.clockintime.split(' ') : ''; // Split the time and AM/PM
          const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : ''; // Split hours, minutes, and seconds
          let formattedHours = hours;
          if (ampm === 'PM' && hours < 12) {
            formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
          } else if (ampm === 'AM' && hours === 12) {
            formattedHours = 0; // Convert 12 AM to 0 hours
          }
          const formattedTime = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          // return formattedTime;

          if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
            if (item) {
              if (!lastTimes.hasOwnProperty(item.empname)) {
                // console.log(clockindate,formattedTime,formattedTimeshift, 'formattedTimeshift'  )
                lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
              }
item.claimstatus ="first";
              item.worktook = getTimeDifference(`${finddate}T${lastTimes[item.empname]}Z`, `${finddate}T${findtime}Z`, '1');
            }
          } else if (item.empname == mergedDataall[index - 1].empname) {
            // item.empname = loginInfo.empname;
            item.worktook = getTimeDifference(mergedDataall[index - 1].olddateval, item.olddateval, '2');
            // lastTimes[loginInfo.empname] = findtime;
            //  productionResult.push(item);
             item.claimstatus = "";
                         if (index === last) {
                  item.claimstatus = "last";
                }
          }
        });
      } catch (err) {
        console.log(err, 'err');
        return next(new ErrorHandler('Records not found', 404));
      }
    }

    mergedData = mergedDataall.filter((item) => item != null);
  } catch (err) {
    console.log(err, 'err');
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({
    mergedData,
  });
});



// get All ProductionUpload => /api/productionuploads
exports.bulkProductionTempUpdateCategorySubcategory = catchAsyncErrors(async (req, res, next) => {
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
      await ProductionTempUploadAll.bulkWrite(bulkOps);
    }

    res.status(200).send({ message: "Bulk update successful" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getMismatchUpdatedListTemp = catchAsyncErrors(async (req, res, next) => {
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

    totalCount = await ProductionTempUploadAll.countDocuments(filter);
    totalPages = Math.ceil(totalCount / pageSize);
    // Perform the query with pagination
    filteredDatas = await ProductionTempUploadAll.find(filter)
      .select("category filename dateval formatteddatetime vendor unitrate user unitid flagcount section updatedunitrate updatedflag updatedsection")
      .skip((page - 1) * pageSize) // Skip documents based on page number
      .limit(pageSize); // Limit number of documents per page

    return res.status(200).json({
      filteredDatas: filteredDatas,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});


// delete ProductionUpload by id => /api/productionupload/:id
exports.undoFieldNameTemp = catchAsyncErrors(async (req, res, next) => {
  const id = req.body.id;
  let dproductionupload;
  try {
    dproductionupload = await ProductionTempUploadAll.updateOne({ _id: id }, { $unset: { updatedunitrate: 1, updatedflag: 1, updatedsection: 1 } });
    if (!dproductionupload) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// get All ProductionUpload => /api/productionuploads
exports.productionUploadCheckStatusTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload;

  try {
    const query = {
      uniqueid: { $in: req.body.id }, // using RegExp for partial match
    };

    productionupload = await ProductionTempUploadAll.countDocuments(query, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    productionupload,
  });
});

exports.productionUploadCheckZeroMismatchPresentTemp = catchAsyncErrors(async (req, res, next) => {
  let count = 0;

  try {
    const { date, project } = req.body;

    let dateoneafter = new Date(date);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

    // Step 1: Count initial zero-unitrate documents
    const [producionIndividualZeroCount, productionUploadZeroCount] = await Promise.all([
      ProducionIndividual.countDocuments({

        // fromdate: new RegExp("^" + date),
        $or: [
          { fromdate: { $regex: req.body.date } },
          { fromdate: { $regex: newDateOnePlus } }
        ],

        // unitrate: { $eq: 0 },
        unallothide: { $ne: "true" },
        updatedunitrate: { $exists: false },
        status: "Approved",
      }),
      ProductionTempUploadAll.countDocuments({

        $or: [
          { formatteddatetime: { $regex: req.body.date } },
          { formatteddatetime: { $regex: newDateOnePlus } }
        ],
        unitrate: { $eq: 0 },
        updatedunitrate: { $exists: false },
        unallothide: { $ne: "true" },
      }),
    ]);

    const zeroCount = producionIndividualZeroCount + productionUploadZeroCount;
    console.log(zeroCount, producionIndividualZeroCount, productionUploadZeroCount, "zeroCount");


    count = zeroCount;

  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({ count });
});

// get All ProductionUpload => /api/productionuploads
exports.getProductionSingleDayUserTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload, productionuploadManual;
  try {
    const [firstDate, secondDate] = req.body.date.split("$");
    const [fromDateonly, fromTime] = firstDate.split("T");
    const [toDateonly, toTime] = secondDate.split("T");
    // console.log(fromDateonly, toDateonly)

    const query = {
      $or: [
        { formatteddatetime: { $regex: fromDateonly } },
        { formatteddatetime: { $regex: toDateonly } }
      ],
      user: { $in: req.body.users },
    };

    productionupload = await ProductionTempUploadAll.find(query, { filename: 1, formatteddatetime: 1, unitid: 1, user: 1, category: 1, updatedunitrate: 1, flagcount: 1, updatedflag: 1, unitrate: 1, vendor: 1 });
    console.log(productionupload.length)

    const query1 = {
      $or: [
        { fromdate: fromDateonly },
        { fromdate: toDateonly }
      ],
      user: { $in: req.body.users },
    };

    productionuploadManual = await ProducionIndividual.find(query1, { filename: 1, time: 1, fromdate: 1, unitid: 1, mode: 1, user: 1, category: 1, updatedunitrate: 1, updatedflag: 1, flagcount: 1, unitrate: 1, vendor: 1 }).lean();
    // console.log(productionupload.length)
  } catch (err) {
    console.log(err.message);
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

// get All ProductionUpload => /api/productionuploads
exports.getProductionSingleDayUserTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload, productionuploadManual;
  try {
    const [firstDate, secondDate] = req.body.date.split("$");
    const [fromDateonly, fromTime] = firstDate.split("T");
    const [toDateonly, toTime] = secondDate.split("T");
    const query = {
      $or: [
        { formatteddatetime: { $regex: fromDateonly } },
        { formatteddatetime: { $regex: toDateonly } }
      ],
      user: { $in: req.body.users },
    };

    productionupload = await ProductionTempUploadAll.find(query, { filename: 1, formatteddatetime: 1, unitid: 1, user: 1, category: 1, updatedunitrate: 1, flagcount: 1, updatedflag: 1, unitrate: 1, vendor: 1 });

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

const getShiftForDate = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment) => {

  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
    return 'Pending...'
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
exports.getSingleDateDataforprodDayTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload;
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
      dupe: "No"
    }

    let dateNow = new Date(date);
    let datevalue = dateNow.toISOString().split("T")[0];

    let deptMonthQuery = {
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
    }


    let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();

    let attendenceControlCriteria = await AttendanceControlCriteria.findOne().sort({ createdAt: -1 }).exec();

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
    let depMonthSet = await DepartmentMonth.find(deptMonthQuery, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 });

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

    let mergedDataallfirst = await ProductionTempUploadAll.find(query, { unitid: 1, user: 1, formatteddatetime: 1, formatteddate: 1, formattedtime: 1, filenameupdated: 1, category: 1, flagcount: 1, vendor: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 }).skip(skip).limit(limit).lean();

    console.log(mergedDataallfirst.length, 'first');

    const allData = [...mergedDataallfirst, ...producionIndividual];
    console.log(allData.length, 'allData');

    productionupload = allData.map((upload) => {
      // console.log(upload.user, 'upload')
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
          let datevalsplitfinal = upload.mode == "Manual" ? `${upload.fromdate}T${upload.time}:00Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
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
            console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime')
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
            console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTimesec')
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

            console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
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
          vendor: upload.vendor,
          category: upload.category,
          formatteddatetime: upload.mode == "Manual" ? `${upload.fromdate} ${upload.time}:00` : upload.formatteddatetime,
          dateval: upload.mode == "Manual" ? `${upload.fromdate} ${upload.time}:00` : upload.formatteddatetime,
          filename: filenamespiliteed,
          mode: upload.mode == "Manual" ? "Manual" : "Production",
          empname: userInfo ? userInfo.companyname : "",
          empcode: userInfo ? userInfo.empcode : "",
          company: userInfo ? userInfo.company : "",
          unit: userInfo ? userInfo.unit : "",
          branch: userInfo ? userInfo.branch : "",
          doj: userInfo ? userInfo.doj : "",
          team: userInfo ? userInfo.team : "",

          weekoff: userShiftTimings && userShiftTimings?.shifttiming ? userShiftTimings?.shifttiming : "",
          shiftsts: userShiftTimings && userShiftTimings.shiftsts ? userShiftTimings.shiftsts : "",
          department: userInfo ? userInfo.department : "",
          assignExpLog: userInfo ? userInfo.assignExpLog : [],

          shiftpoints: new Date(dateTime) >= shiftOnlyFromTime && new Date(dateTime) <= shiftOnlyEndTime ? finalunitrate * finalflag * 8.333333333333333 : 0,
          processcode: getprocessCode,
          unitid: upload.unitid, points: finalunitrate * finalflag * 8.333333333333333,
          unitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate),
          flag: upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount),
        };
      }
    });
  } catch (err) {

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

// get All ProductionUpload => /api/productionuploads
exports.productionDayCategoryIdFilterTemp = catchAsyncErrors(async (req, res, next) => {
  let productionupload;
  try {

    const { userid, category, startdate, enddate, mode } = req.body;

    const startDateSplitted = startdate.split('T')[0];
    const endDateSplited = enddate.split('T')[0];

    let query = {
      user: userid, filenameupdated: category,
      dateobjformatdate: { $gte: new Date(startdate), $lte: new Date(enddate) },
    }
    console.log(query)
    let queryManual = {
      user: userid, filename: category, fromdate: { $in: [startDateSplitted, endDateSplited] },
    }
    console.log(queryManual)
    if (mode == "Manual") {
      productionupload = await ProducionIndividual.find(queryManual, { fromdate: 1, time: 1, vendor: 1, user: 1, unitid: 1, filename: 1, category: 1, flagcount: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 });
    } else {
      productionupload = await ProductionTempUploadAll.find(query, { formatteddatetime: 1, vendor: 1, user: 1, unitid: 1, filename: 1, category: 1, flagcount: 1, unitrate: 1, updatedunitrate: 1, updatedflag: 1 });
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
exports.getAllproductionAttendancesFilter = catchAsyncErrors(async (req, res, next) => {

  let attendances;

  try {

    const dateObj = new Date(req.body.fromdate);
    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    // Format the date components into the desired format
    const formattedDate = `${day}-${month}-${year}`;

    const dateObjto = new Date(req.body.todate);

    // Extract day, month, and year components
    const dayto = String(dateObjto.getDate()).padStart(2, "0");
    const monthto = String(dateObjto.getMonth() + 1).padStart(2, "0");
    const yearto = dateObjto.getFullYear();

    // Format the date components into the desired format
    const formattedDateTo = `${dayto}-${monthto}-${yearto}`;
    attendances = await Attendances.find({ date: { $gte: formattedDate, $lte: formattedDateTo } }, { clockintime: 1, date: 1, username: 1 });

  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    attendances,
  });
});
