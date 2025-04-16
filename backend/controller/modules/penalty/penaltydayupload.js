const Penaltydayupload = require("../../../model/modules/penalty/penaltydayupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");




exports.getAllPenaltydayuploadcheckcreated = catchAsyncErrors(async (req, res, next) => {

  let penaltydayupload;
  try {
    const { date } = req.body;
    penaltydayupload = await Penaltydayupload.countDocuments({ date: date });
    return res.status(200).json({
      penaltydayupload
    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllPenaltydayuploadcheckcreatedUploadWise = catchAsyncErrors(async (req, res, next) => {

  let penaltydayupload;
  try {
    const { fromdate, todate } = req.body;
    penaltydayupload = await Penaltydayupload.countDocuments({ date: { $gte: fromdate, $lte: todate } });
    return res.status(200).json({
      penaltydayupload
    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});


// get All Penaltydayupload Name => /api/Penaltydayupload
exports.getAllPenaltydayupload = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  let penaltydayupload, penaltydayuploadoverall;
  try {
    penaltydayuploadoverall = await Penaltydayupload.find();

    penaltydayupload = penaltydayuploadoverall.map(doc => {
      // Filter the `uploaddata` array within the document
      const filteredUploadData = doc?.uploaddata.filter(item =>
        assignbranch.some(branch =>
          branch.company === item.company &&
          branch.branch === item.branch &&
          branch.unit === item.unit
        )
      );

      // If no items in `uploaddata` match, set `uploaddata` to an empty array
      if (filteredUploadData.length === 0) {
        return { ...doc._doc, uploaddata: [] };
      }

      // Otherwise, return the document with the filtered `uploaddata`
      return { ...doc._doc, uploaddata: filteredUploadData };
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltydayupload) {
    return next(new ErrorHandler("Penaltydayupload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    penaltydayupload, penaltydayuploadoverall
  });
});




exports.getAllPenaltyDayByDate = catchAsyncErrors(async (req, res, next) => {
  let penaltydayupload;
  try {


    let penaltydayuploadall = await Penaltydayupload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 });

    console.log(req.body.fromdate, "formdate")
    penaltydayupload = penaltydayuploadall.map(data => data.uploaddata).flat()
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) =>
            item.name === current.name
          // && 
          // item.companyname === current.companyname && item.branch === current.branch &&
          //   item.unit === current.unit && item.team === current.team &&
          //   item.empcode === current.empcode
        );


        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.totalfield += Number(current.totalfield);
          existingItem.autoerror += Number(current.autoerror);
          existingItem.manualerror += Number(current.manualerror);


          // const dateObjects = existingItem.date.map((date) => new Date(date));


          // const fromDate = new Date(Math.min(...dateObjects));
          // const toDate = new Date(Math.max(...dateObjects));

          // existingItem.startDate = fromDate;
          // existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            ...current._doc,
            companyname: current.companyname,
            manual: current.manual,
            totalfield: Number(current.totalfield),
            autoerror: Number(current.autoerror),
            manualerror: Number(current.manualerror),
            _id: current.id,

            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,


          });
        }
        return acc;
      }, []);



    // console.log(daypointsupload[0])


  } catch (err) {
    console.log(err, "penaltydayupload")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    penaltydayupload,
  });
});






exports.getAllPenaltydayuploadFilterList = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch, fromdate, todate } = req.body;
  let penaltydayupload, penaltydayuploadoverall;
  try {
    const pipeline = [
      {
        $match: {
          date: {
            $gte: fromdate,
            $lte: todate,
          },
        },

      }, {
        $sort: {
          date: -1,
        },
      },
      {
        $project: {
          _id: 1, // Include `_id` or any other fields you want
          date: 1, // Include `date` or other top-level fields
          uploaddata: 1,
          filename: 1,
          document: 1,
          addedby: 1
        },
      },
    ];
    // Execute the aggregation
    penaltydayuploadoverall = await Penaltydayupload.aggregate(pipeline);
    // penaltydayuploadoverall = await Penaltydayupload.find()?.lean();

    penaltydayupload = penaltydayuploadoverall.map(doc => {
      // Filter the `uploaddata` array within the document
      const filteredUploadData = doc?.uploaddata.filter(item =>
        assignbranch.some(branch =>
          branch.company === item.company &&
          branch.branch === item.branch &&
          branch.unit === item.unit
        )
      );

      // If no items in `uploaddata` match, set `uploaddata` to an empty array
      if (filteredUploadData.length === 0) {
        return { ...doc, uploaddata: [] };
      }

      // Otherwise, return the document with the filtered `uploaddata`
      return { ...doc, uploaddata: filteredUploadData };
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    penaltydayupload, penaltydayuploadoverall
  });
});

exports.getAllPenaltydayuploadFilter = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch, fromdate, todate, company, branch, unit, team, employeenames } = req.body;
  let penaltydayupload, penaltydayuploadoverall, penaltydayuploadTesting;
  try {

    const matchConditions = {};
    const filterConditions = [];

    if (company?.length > 0) {
      matchConditions.company = { $in: company };
      filterConditions.push({ $in: ["$$item.company", company] });
    }

    if (branch?.length > 0) {
      matchConditions.branch = { $in: branch };
      filterConditions.push({ $in: ["$$item.branch", branch] });
    }

    if (unit?.length > 0) {
      matchConditions.unit = { $in: unit };
      filterConditions.push({ $in: ["$$item.unit", unit] });
    }

    if (team?.length > 0) {
      matchConditions.team = { $in: team };
      filterConditions.push({ $in: ["$$item.team", team] });
    }

    if (employeenames?.length > 0) {
      matchConditions.name = { $in: employeenames };
      filterConditions.push({ $in: ["$$item.name", employeenames] });
    }

    const pipeline = [
      {
        $match: {
          date: {
            $gte: fromdate,
            $lte: todate,
          },
          uploaddata: {
            $elemMatch: matchConditions,
          },
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          filename: 1,
          document: 1,
          addedby: 1,
          uploaddata: {
            $filter: {
              input: "$uploaddata",
              as: "item",
              cond: {
                $and: filterConditions,
              },
            },
          },
        },
      },
    ];

    // Execute the aggregation
    penaltydayuploadTesting = await Penaltydayupload.aggregate(pipeline);
  } catch (err) {
    console.log(err, 'err')
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!penaltydayupload) {
  //   return next(new ErrorHandler("Penaltydayupload not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    penaltydayuploadTesting
  });
});

// get All Penaltydayupload Name => /api/Penaltydayupload
exports.getPenaltydayuploadLimited = catchAsyncErrors(async (req, res, next) => {
  let penaltydayupload, answer;
  try {
    //   penaltydayupload = await Penaltydayupload.find({},{uploaddata:1});
    //   answer = penaltydayupload.flatMap((data) =>
    //   data.uploaddata.filter(item => item).map((upload) => ({
    //     companyname: upload.companyname,
    //     name: upload.name,
    //     empcode: upload.empcode,
    //     branch: upload.branch,
    //     unit: upload.unit,
    //     team: upload.team,
    //     date: upload.date,
    //     amount: upload.amount,
    //     id: upload._id,
    //   }))
    // );
    const { ismonth, isyear, } = req.body;

    const from_date = new Date(isyear, ismonth - 1, 1);

    // Calculate the last day of the previous month
    const last_day_prev_month = new Date(from_date.getFullYear(), from_date.getMonth(), 0);

    // Get the 15th day of the previous month
    const before_month_date = new Date(last_day_prev_month.getFullYear(), last_day_prev_month.getMonth(), 20);

    // Get the 15th day of the next month
    const next_month = new Date(from_date.getFullYear(), from_date.getMonth() + 1, 10);

    let fromdate = before_month_date.toISOString().split('T')[0];
    let todate = next_month.toISOString().split('T')[0];

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
    }


    const cond = {
      $and: conditions,
    };

    // daypointsupload = await Penaltydayupload.aggregate([
    //   {
    //     $project: {
    //       uploaddata: {
    //         $filter: {
    //           input: "$uploaddata",
    //           as: "upload",
    //           cond: cond,
    //         },
    //       },
    //     },
    //   },
    // ]);
    penaltydayupload = await Penaltydayupload.aggregate([
      {
        $project: {
          // Specify the fields you want to include in the uploaddata array
          uploaddata: {
            $map: {
              input: "$uploaddata",
              as: "upload",
              in: {
                // Specify the fields you want to include
                company: "$$upload.company",
                name: "$$upload.name",
                branch: "$$upload.branch",
                unit: "$$upload.unit",
                team: "$$upload.team",
                empcode: "$$upload.empcode",
                amount: "$$upload.amount",
                date: "$$upload.date",
                _id: "$$upload._id",
              }
            }
          }
        }
      },
      {
        $project: {
          uploaddata: {
            $filter: {
              input: "$uploaddata",
              as: "upload",
              cond: cond,
            },
          },
        },
      },
    ]);

    answer = penaltydayupload.flatMap((data) => data.uploaddata);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltydayupload) {
    return next(new ErrorHandler("Penaltydayupload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    answer,
  });
});

// Create new Penaltydayupload=> /api/Penaltydayupload/new
exports.addPenaltydayupload = catchAsyncErrors(async (req, res, next) => {
  let aPenaltydayupload = await Penaltydayupload.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Penaltydayupload => /api/Penaltydayupload/:id
exports.getSinglePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spenaltydayupload = await Penaltydayupload.findById(id);

  if (!spenaltydayupload) {
    return next(new ErrorHandler("Penaltydayupload not found!", 404));
  }
  return res.status(200).json({
    spenaltydayupload,
  });
});

// update Penaltydayupload by id => /api/Penaltydayupload/:id
exports.updatePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upenaltydayupload = await Penaltydayupload.findByIdAndUpdate(id, req.body);
  if (!upenaltydayupload) {
    return next(new ErrorHandler("Penaltydayupload not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// exports.updateDayPointsSingleUpload = catchAsyncErrors(
exports.updatePenaltydaySingleupload = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    req.body.id = subid;
    try {
      const uploaddata = await Penaltydayupload.findOneAndUpdate(
        { "uploaddata._id": subid },
        { $set: { "uploaddata.$": req.body } },
        { new: true }
      );

      if (uploaddata) {
        return res.status(200).json({ message: "Updated successfully" });
      } else {
        return next(new ErrorHandler("Something went wrong", 500));
      }
    } catch (err) {
      return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
    }
  }
);

// delete Penaltydayupload by id => /api/Penaltydayupload/:id
exports.deletePenaltydayupload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpenaltydayupload = await Penaltydayupload.findByIdAndRemove(id);

  if (!dpenaltydayupload) {
    return next(new ErrorHandler("Penaltydayupload not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});