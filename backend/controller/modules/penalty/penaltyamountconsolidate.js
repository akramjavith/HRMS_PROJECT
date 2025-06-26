const PenaltyAmountConsolidate = require("../../../model/modules/penalty/penaltyamountconsolidate");
const PenaltyClientErrorUpload = require("../../../model/modules/production/penaltyclienterrorupload");
const PenaltyDayUpload = require("../../../model/modules/penalty/penaltydayupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const PenaltyClientError = require('../../../model/modules/penalty/penaltyclienterror');
const ProductionClientRate = require('../../../model/modules/production/productionclientrate');
const ClientUserID = require("../../../model/modules/production/ClientUserIDModel");

const Managepenaltymonth = require("../../../model/modules/penalty/penaltymonth");
const ClientErrorMonthAmounts = require("../../../model/modules/penalty/clienterrormonthamount");



exports.getAllPenaltyAmountConsolidatedDateBasedRestriction = catchAsyncErrors(
  async (req, res, next) => {
    let penaltymonth,clientamoutmonth;
      const { fromdate,todate } = req.body;
      // console.log(fromdate,todate,"Dats")
    try {
      penaltymonth = await Managepenaltymonth.countDocuments({fromdate:{$gte:fromdate},todate:{$lte:todate}});
      clientamoutmonth = await ClientErrorMonthAmounts.countDocuments({fromdate:{$gte:fromdate},todate:{$lte:todate}});

      // console.log( penaltymonth,clientamoutmonth,"new")
    } catch (error) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
      // count: products.length,
      penaltymonth,clientamoutmonth
    });
  }
);


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

exports.getAllPenaltyAmountConsolidatedList = catchAsyncErrors(
  async (req, res, next) => {
    let penaltyamountconsolidate;
    try {

penaltyamountconsolidate = await PenaltyAmountConsolidate.aggregate([
  {
    $lookup: {
      from: "clienterrormonthamounts",
      let: { from: "$fromdate", to: "$todate" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $lte: ["$fromdate", "$$from"] },
                { $gte: ["$todate", "$$to"] }
              ]
            }
          }
        }
      ],
      as: "matchedClients"
    }
  },
  {
    $lookup: {
      from: "managepenaltymonths",
      let: { from: "$fromdate", to: "$todate" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
             { $lte: ["$fromdate", "$$from"] },
                { $gte: ["$todate", "$$to"] }
              ]
            }
          }
        }
      ],
      as: "matchedPenalties"
    }
  },
  {
    $addFields: {
      matchclient: {
        $cond: [{ $gt: [{ $size: "$matchedClients" }, 0] }, "Created", "Not Created"]
      },
      matchpenalty: {
        $cond: [{ $gt: [{ $size: "$matchedPenalties" }, 0] }, "Created", "Not Created"]
      }
    }
  },
  {
    $project: {
      matchedClients: 0,
      matchedPenalties: 0
    }
  },
  {
    $sort:{ fromdate: -1 }
  }
])

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
    let approvedpenaltyclienterror;
    let penaltyclienterrorrate;
    let clientuserid;
    let filteredData;
    let finalData;
    let aggregatedData;

    const penaltymonthall = await PenaltyDayUpload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })

        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });
        approvedpenaltyclienterror = await PenaltyClientError.find({ date: { $gte:req.body.fromdate, $lte: req.body.todate },
         });
        clientuserid = await ClientUserID.find({ allotted: "allotted" });

        // compare with penaltyrate and get matched data's client rate
        filteredData = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );
            const notApprovedOrEmptyHistory = approvedpenaltyclienterror.filter(entry => {
              const history = entry.history;
              return history.length === 0 || history[history.length - 1].status !== "Approved";
            });
            
            // console.log(notApprovedOrEmptyHistory.length,"cccc"); // Count
            // console.log(notApprovedOrEmptyHistory[0],"lll");  

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData.rate,
                history: matchedItem?.history,
                amount: matchedItem?.amount,
                notapprovedcount: notApprovedOrEmptyHistory.length,
                
            }));
        });


        // find recently used id matched data
        finalData = filteredData?.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
                    (group) => group[group.length - 1]
                );

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return (
                        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
                    );
                });

                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime =
                        lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;

                    // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                    let datevalsplitfinal = item.date;

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item
            };
        });

        // Aggregate clientamount by employeeid
        // aggregatedData = finalData.reduce((acc, item) => {
        //     const existingEmployee = acc.find((entry) => entry.employeeid === item.employeeid);
        //     if (existingEmployee) {
        //         existingEmployee.clientamount += item.clientamount;
        //         existingEmployee.amount += item.amount;
        //     } else {
        //         acc.push({
        //             fromdate: req.body.fromdate,
        //             todate: req.body.todate,
        //             employeeid: item.employeeid,
        //             employeename: item.employeename,
        //             clientamount: item.clientamount,
        //             notapprovedcount:item.notapprovedcount,
        //             amount: item.amount || 0.00,
        //         });
        //     }
        //     return acc;
        // }, []);

        aggregatedData = finalData.reduce((acc, item) => {
          const existingEmployee = acc.find((entry) => entry.employeeid === item.employeeid);
      
          // Calculate if this record should count as "not approved"
          const history = item.history || [];
          // const lastStatus = history.length > 0 ? history[history.length - 1].status?.trim().toLowerCase() : null;
          const lastStatus = history.length > 0 && history[history.length - 1].status !== "Approved"? history.filter(d => d.status !== "Approved").length : null;
          // const isNotApproved = !lastStatus || lastStatus !== "Approved";
      // console.log(lastStatus,"dd")
          if (existingEmployee) {
              existingEmployee.clientamount += item.clientamount;
              existingEmployee.amount += item.amount;
              if (lastStatus) {
                  existingEmployee.notapprovedcount += 1;
              }
          } else {
              acc.push({
                  fromdate: req.body.fromdate,
                  todate: req.body.todate,
                  employeeid: item.employeeid,
                  employeename: item.employeename,
                  clientamount: item.clientamount,
                  notapprovedcount: lastStatus,
                  amount: item.amount || 0.00,
              });
          }
          return acc;
      }, []);
      




    let penaltymonth = penaltymonthall
      .map((data) => data.uploaddata)
      .flat()
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch);

const findClientError = aggregatedData.find(d =>  d.employeename === current.name)

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
            clientamount:findClientError ? findClientError?.clientamount : 0,
            amountclient: findClientError ? findClientError.amount : 0.00,
            notapprovedcount:findClientError ? findClientError.notapprovedcount : 0,
          });
        }
        return acc;
      }, []);
    penaltymonth = penaltymonth.filter(item => item != null && item != undefined)
    // console.log(penaltymonth[3], "dffdf")
    return res.status(200).json({
      penaltymonth,
    });
  } catch (err) {
    console.log(err, "penaltymonth");
    return next(new ErrorHandler("Records not found!", 404));
  }

});


exports.getAllPenaltyMonthAmountConsolidatedViewIndividual = catchAsyncErrors(async (req, res, next) => {
  let approvedpenaltyclienterror;
  let penaltyclienterrorrate;
  let clientuserid;
  let filteredData;
  let finalData;
  let aggregatedData;
  let findClientError;
  let notApprovedOrEmptyHistory 
  try {

    const penaltymonthall = await PenaltyDayUpload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })
    

    penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });
    approvedpenaltyclienterror = await PenaltyClientError.find({ date: { $gte:req.body.fromdate, $lte: req.body.todate },
    // errorstatus: { $eq: "Approved" }, history: { $elemMatch: { mode: "Percentage", status: "Approved" } }, 
     });
    clientuserid = await ClientUserID.find({ allotted: "allotted" });


    // compare with penaltyrate and get matched data's client rate
    filteredData = penaltyclienterrorrate.flatMap((rateData) => {
        // Find all matching approved penalty client errors
        const matchedItems = approvedpenaltyclienterror.filter((item) =>
            rateData.project === item.project &&
            rateData.category === item.category &&
            rateData.subcategory === item.subcategory
        );

        // Map each matched item to include the client amount
        return matchedItems.map((matchedItem) => ({
            _id: matchedItem?._id,
            project: matchedItem?.project,
            category: matchedItem?.category,
            subcategory: matchedItem?.subcategory,
            loginid: matchedItem?.loginid,
            vendor: matchedItem?.vendor,
            company: matchedItem?.company,
            branch: matchedItem?.branch,
            unit: matchedItem?.unit,
            team: matchedItem?.team,
            department: matchedItem?.department,
            employeename: matchedItem?.employeename,
            employeeid: matchedItem?.employeeid,
            date: matchedItem?.date,
            documentnumber: matchedItem?.documentnumber,
            documentlink: matchedItem?.documentlink,
            fieldname: matchedItem?.fieldname,
            line: matchedItem?.line,
            errorvalue: matchedItem?.errorvalue,
            correctvalue: matchedItem?.correctvalue,
            clienterror: matchedItem?.clienterror,
            errorstatus: matchedItem?.errorstatus,
            clientamount: rateData.rate,
            history: matchedItem?.history,
            amount: matchedItem?.amount,
        }));
    });
// console.log(filteredData,"filteredData")
    // find recently used id matched data
    finalData = filteredData?.map((item) => {
        let concatProjectVendor = `${item.project}-${item.vendor}`;

        const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

        let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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
            const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
                (group) => group[group.length - 1]
            );

            // Sort the last items by date and time
            lastItemsForEachDateTime.sort((a, b) => {
                return (
                    new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
                );
            });

            // Find the first item in the sorted array that meets the criteria

            for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                const dateTime =
                    lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;

                // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                let datevalsplitfinal = item.date;

                if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                    filteredDataDateTime = lastItemsForEachDateTime[i];
                } else {
                    break;
                }
            }
        }
        // const history = item.history || [];
        // const lastStatus = history.length > 0 ? history[history.length - 1].status?.trim().toLowerCase() : null;
        // const isNotApproved = !lastStatus || lastStatus !== "Approved";
        
        return {
            ...item,
            clientamount: item.clientamount,
            amountclient: item.amount || 0.00,
        };
    });

    

    let penaltymonth = penaltymonthall
      .map((data) => data.uploaddata)
      .flat().filter(t => t.name === req.body.name).map(current => {
        findClientError = finalData.find(d =>  d.employeename === req.body.name 
          && d.date === current.date
        )
        // const notApprovedOrEmptyHistory = finalData.filter(entry =>
        //   entry.employeename === req.body.name &&
        //   entry.date === current.date &&
        //   (
        //     !entry.history || 
        //     entry.history.length === 0 ||
        //     entry.history[entry.history.length - 1].status?.trim().toLowerCase() !== "approved"
        //   )
        // );

        const history =findClientError ? findClientError.history : 0;
        // const lastStatus = history.length > 0 ? history[history.length - 1].status?.trim().toLowerCase() : null;
        const lastStatus = history.length > 0 && history[history.length - 1].status !== "Approved"? history.filter(d => d.status !== "Approved").length : null;
  
        return {
        ...current,
        company: current.company,
        branch: current.branch,
        unit: current.unit,
        team: current.team,
        empcode: current.empcode,
        name: current.name,
        processcode: current.processcode,
        vendorname: current.vendorname,
        process: current.process,
        date:current.date,
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
        clientamount:findClientError ? findClientError?.clientamount : 0,
        amountclient: findClientError ? findClientError.amountclient : 0.00,
        notapprovedcount: lastStatus,        }

      }
    )

// console.log(penaltymonth,"penaltymonth")
      

    return res.status(200).json({
      penaltymonth,
    });
  } catch (err) {
    console.log(err, "penaltymonth");
    return next(new ErrorHandler("Records not found!", 404));
  }

});

