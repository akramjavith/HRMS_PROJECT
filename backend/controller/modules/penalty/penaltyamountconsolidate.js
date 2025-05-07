const PenaltyAmountConsolidate = require("../../../model/modules/penalty/penaltyamountconsolidate");
const PenaltyClientErrorUpload = require("../../../model/modules/production/penaltyclienterrorupload");
const PenaltyDayUpload = require("../../../model/modules/penalty/penaltydayupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All PenaltyAmountConsolidate Name => /api/allpenaltyamountconsolidate
exports.getAllPenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    let penaltyamountconsolidate;
    try {
      penaltyamountconsolidate = await PenaltyAmountConsolidate.find().sort({ fromdate: -1 });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyamountconsolidate) {
      return next(new ErrorHandler("Data  not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      penaltyamountconsolidate,
    });
  }
);

// get All PenaltyAmountConsolidate view => /api/productionconsolidateds

exports.getFilterPenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    const { assignbranch } = req.body;
    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
        unit: item.unit
      }))
    };

    let productionconsolidated,
      clienterrorupload,
      ans,
      penaltydayupload,
      overallData,
      finalData;
    try {
      productionconsolidated = await PenaltyAmountConsolidate.find({
        _id: req.body.id,
      });

      clienterrorupload = await PenaltyClientErrorUpload.find();
      penaltydayupload = await PenaltyDayUpload.find();

      if (!clienterrorupload && !penaltydayupload) {
        return next(new ErrorHandler("No not found!", 404));
      }

      const filteredDataClientError = clienterrorupload.filter((item) => {
        const itemFromDate = new Date(item?.fromdate);
        const itemToDate = new Date(item?.todate);
        const productionFrom = new Date(productionconsolidated[0]?.fromdate);
        const productionTo = new Date(productionconsolidated[0]?.todate);

        return (
          (productionFrom >= itemFromDate && productionFrom <= itemToDate) ||
          (productionTo >= itemFromDate && productionTo <= itemToDate)
        );
      });

      let finalclient = filteredDataClientError
        .map((data) => data.uploaddata)
        .flat();

      const filteredDataPenalty = penaltydayupload.filter((item) => {
        const itemDate = new Date(item?.date);
        const fromDate = new Date(productionconsolidated[0]?.fromdate);
        const toDate = new Date(productionconsolidated[0]?.todate);
        return itemDate >= fromDate && itemDate <= toDate;
      });

      let finalpenalty = filteredDataPenalty
        .map((data) => data.uploaddata)
        .flat();

      ans = [...finalpenalty, ...finalclient];

      finalData = ans.map((item) => {
        return {
          _id: item?._id,
          name: item?.name,
          empcode: item?.empcode,
          fromdate: productionconsolidated[0].fromdate,
          todate: productionconsolidated[0].todate,
          company: item?.company,
          branch: item?.branch,
          unit: item?.unit,
          team: item?.team,
          editedone: item?.edited1,
          editedtwo: item?.edited2,
          editedthree: item?.edited3,
          editedfour: item?.edited4,
          notapproved: 0,
          amount: item?.amount,
          clientamount: item?.clientamount,
          netamount: item?.totalamount,
        };
      }).filter(item =>
        assignbranch.some(branch =>
          branch.company === item.company &&
          branch.branch === item.branch &&
          branch.unit === item.unit
        )
      );

      overallData = ans.map((item) => {
        return {
          _id: item?._id,
          name: item?.name,
          empcode: item?.empcode,
          fromdate: productionconsolidated[0].fromdate,
          todate: productionconsolidated[0].todate,
          company: item?.company,
          branch: item?.branch,
          unit: item?.unit,
          team: item?.team,
          editedone: item?.edited1,
          editedtwo: item?.edited2,
          editedthree: item?.edited3,
          editedfour: item?.edited4,
          notapproved: 0,
          amount: item?.amount,
          clientamount: item?.clientamount,
          netamount: item?.totalamount,
        };
      })
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
      productionconsolidated,
      ans: finalData,
      overallData
    });
  }
);


// Create new PenaltyAmountConsolidate=> /api/penaltyamountconsolidate/new
exports.addPenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    let apenaltyamountconsolidate = await PenaltyAmountConsolidate.create(
      req.body
    );

    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Signle PenaltyAmountConsolidate => /api/penaltyamountconsolidate/:id
exports.getSinglePenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let spenaltyamountconsolidate = await PenaltyAmountConsolidate.findById(id);

    if (!spenaltyamountconsolidate) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
      spenaltyamountconsolidate,
    });
  }
);

// update PenaltyAmountConsolidate by id => /api/penaltyamountconsolidate/:id
exports.updatePenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    if (!upenaltyamountconsolidate) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

// delete PenaltyAmountConsolidate by id => /api/penaltyamountconsolidate/:id
exports.deletePenaltyAmountConsolidated = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyamountconsolidate =
      await PenaltyAmountConsolidate.findByIdAndRemove(id);

    if (!dpenaltyamountconsolidate) {
      return next(new ErrorHandler("Data  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);



exports.getAllPenaltyAmountConsolidatedMonthView = catchAsyncErrors(async (req, res, next) => {

  try {
    const penaltymonthall = await PenaltyDayUpload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })


    let penaltymonth = penaltymonthall
      .map((data) => data.uploaddata)
      .flat()
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch);

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];
          existingItem.totalfield += Number(current.totalfield);
          existingItem.autoerror += Number(current.autoerror);
          existingItem.manualerror += Number(current.manualerror);
          existingItem.uploaderror += Number(current.uploaderror);
          existingItem.moved += Number(current.moved);
          existingItem.notupload += Number(current.notupload);
          existingItem.penalty += Number(current.penalty);
          existingItem.nonpenalty += Number(current.nonpenalty);
          existingItem.bulkupload += Number(current.bulkupload);
          existingItem.bulkkeying += Number(current.bulkkeying);
          existingItem.edited1 += Number(current.edited1);
          existingItem.edited2 += Number(current.edited2);
          existingItem.edited3 += Number(current.edited3);
          existingItem.edited4 += Number(current.edited4);
          existingItem.reject1 += Number(current.reject1);
          existingItem.reject2 += Number(current.reject2);
          existingItem.reject3 += Number(current.reject3);
          existingItem.reject4 += Number(current.reject4);
          existingItem.notvalidate += Number(current.notvalidate);
          existingItem.validateerror += Number(current.validateerror);
          existingItem.waivererror += Number(current.waivererror);
          existingItem.neterror += Number(current.neterror);
          existingItem.percentage += Number(current.percentage);
          existingItem.amount += Number(current.amount);
          existingItem.fromdate = req.body.fromdate;
          existingItem.todate = req.body.todate;


        } else {
          // Add new item
          acc.push({


            company: current.company,
            branch: current.branch,
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            name: current.name,
            processcode: current.processcode,
            vendorname: current.vendorname,
            process: current.process,

            totalfield: Number(current.totalfield),
            autoerror: Number(current.autoerror),
            manualerror: Number(current.manualerror),
            uploaderror: Number(current.uploaderror),
            moved: Number(current.moved),
            notupload: Number(current.notupload),
            penalty: Number(current.penalty),
            nonpenalty: Number(current.nonpenalty),
            bulkupload: Number(current.bulkupload),

            bulkkeying: Number(current.bulkkeying),
            edited1: Number(current.edited1),
            edited2: Number(current.edited2),
            edited3: Number(current.edited3),
            edited4: Number(current.edited4),


            reject1: Number(current.reject1),
            reject2: Number(current.reject2),
            reject3: Number(current.reject3),
            reject4: Number(current.reject4),
            notvalidate: Number(current.notvalidate),

            validateerror: Number(current.validateerror),
            waivererror: Number(current.waivererror),
            neterror: Number(current.neterror),
            percentage: Number(current.percentage),
            amount: Number(current.amount),
            fromdate: req.body.fromdate,
            todate: req.body.todate,

          });
        }
        return acc;
      }, []);
    penaltymonth = penaltymonth.filter(item => item != null && item != undefined)
    console.log(penaltymonth.length, "dffdf")
    return res.status(200).json({
      penaltymonth,
    });
  } catch (err) {
    console.log(err, "penaltymonth");
    return next(new ErrorHandler("Records not found!", 404));
  }

});


exports.getAllPenaltyMonthAmountConsolidatedViewIndividual = catchAsyncErrors(async (req, res, next) => {

  try {
    const penaltymonthall = await PenaltyDayUpload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })
    //console.log(penaltymonthall, "penaltymonthall")

    let penaltymonth = penaltymonthall
      .map((data) => data.uploaddata)
      .flat().filter(t => t.name === req.body.name)

    return res.status(200).json({
      penaltymonth,
    });
  } catch (err) {
    console.log(err, "penaltymonth");
    return next(new ErrorHandler("Records not found!", 404));
  }

});

