const ClientUserID = require("../../../model/modules/production/ClientUserIDModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ClientUserID Name => /api/clientuserids
exports.getAllClientUserID = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    clientuserid = await ClientUserID.find({}, { userid: 1, empname: 1, empcode: 1, loginallotlog: 1, projectvendor: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});

exports.getClientUserSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

    totalProjects = await ClientUserID.countDocuments();

    result = await ClientUserID.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects,
    result,
    currentPage: page,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});


exports.getAllClientUserCheck = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;

  let user = req.body.empname;
  try {
    clientuserid = await ClientUserID.find({ empname: user?.companyname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});



// get All ClientUserID Name => /api/clientuserids
exports.getLoginAllotidDetails = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    clientuserid = await ClientUserID.find({ empname: req.body.name, date: { $gte: req.body.date } }, { _id: 0, userid: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});

// get All ClientUserID Name => /api/clientuserids
exports.getAllClientUserIDData = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    clientuserid = await ClientUserID.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});




// get All ClientUserID Name => /api/clientuserids
exports.getAllClientUserIDLimited = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    clientuserid = await ClientUserID.find({}, { userid: 1, empname: 1, empcode: 1, loginallotlog: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});
// Create new ClientUserID=> /api/clientuserid/new
exports.addClientUserID = catchAsyncErrors(async (req, res, next) => {
  let aclientuserid = await ClientUserID.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ClientUserID => /api/clientuserid/:id
exports.getSingleClientUserID = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sclientuserid = await ClientUserID.findById(id);

  if (!sclientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({
    sclientuserid,
  });
});

// update ClientUserID by id => /api/clientuserid/:id
exports.updateClientUserID = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uclientuserid = await ClientUserID.findByIdAndUpdate(id, req.body);
  if (!uclientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ClientUserID by id => /api/clientuserid/:id
exports.deleteClientUserID = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dclientuserid = await ClientUserID.findByIdAndRemove(id);

  if (!dclientuserid) {
    return next(new ErrorHandler("Client User ID not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});



//update loginallotlog log
exports.updateLoginAllotLogValues = catchAsyncErrors(async (req, res, next) => {
  const { logid, logname } = req.query;
  const updateFields = req.body;

  try {
    const query = {};
    query[`${logname}._id`] = logid;

    const updateObj = { $set: {} };
    for (const key in updateFields) {
      updateObj.$set[`${logname}.$.${key}`] = updateFields[key];
    }

    const uploaddata = await ClientUserID.findOneAndUpdate(query, updateObj, {
      new: true,
    });

    if (uploaddata) {
      return res
        .status(200)
        .json({ message: "Updated successfully", succcess: true });
    } else {
      return next(new ErrorHandler("Something went wrong", 500));
    }
  } catch (err) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

//delete loginallotlog log
exports.deleteLoginAllotLog = catchAsyncErrors(async (req, res, next) => {
  const { logid, logname, mainid } = req.query;
  try {
    const query = {};
    query[`${logname}._id`] = logid;

    const update = {
      $pull: {
        [logname]: { _id: logid },
      },
    };

    const deletedata = await ClientUserID.findOneAndUpdate(query, update, {
      new: true,
    });

    if (deletedata) {
      // Check the length of the loginallotlog array
      const loginallotlog = deletedata.loginallotlog || [];
      let externalUpdate;
      if (loginallotlog.length === 0) {
        // If the array is empty, set fields to empty values and update allotted status
        externalUpdate = {
          company: "",
          branch: "",
          unit: "",
          team: "",
          empname: "",
          empcode: "",
          date: "",
          time: "",
          allotted: "unallotted",
        };
      } else {
        // If the array is not empty, use the last item's values
        const lastItem = loginallotlog[loginallotlog.length - 1];
        externalUpdate = {
          company: lastItem.company,
          branch: lastItem.branch,
          unit: lastItem.unit,
          team: lastItem.team,
          empname: lastItem.empname,
          empcode: lastItem.empcode,
          date: lastItem.date,
          time: lastItem.time,
          allotted: "allotted",
        };
      }
      // Update the external fields in the document using mainid
      await ClientUserID.findByIdAndUpdate(mainid, { $set: externalUpdate });

      return res
        .status(200)
        .json({ message: "Deleted successfully", success: true });
    } else {
      return next(new ErrorHandler("Something went wrong", 500));
    }
  } catch (err) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

exports.resetClientUserIdData = catchAsyncErrors(async (req, res, next) => {
  const { empname, empcode } = req.query;
  try {
    // Find the documents that match the given empname and empcode
    const updatedData = await ClientUserID.updateMany(
      { empname, empcode },
      {
        $set: {
          company: "",
          branch: "",
          unit: "",
          team: "",
          empname: "",
          empcode: "",
          date: "",
          time: "",
          allotted: "unallotted",
        },
      }
    );

    res.status(200).json({
      message: `${updatedData.nModified} records updated successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

// get All ClientUserID Name => /api/clientuserids
exports.clientUseridsReportIdsOnly = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    clientuserid = await ClientUserID.find({}, { userid: 1, projectvendor: 1 }).lean();
  } catch (err) {
    console.log(err.message);
  }
  // if (!clientuserid) {
  //   return next(new ErrorHandler("Client User ID not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});

exports.clientUserIdLimitedTimestudyByCompnyname = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    console.log(["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((role) => req.body.role.includes(role)), "req.body.role");
    if (["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((role) => req.body.role.includes(role))) {
      clientuserid = await ClientUserID.find({ allotted: "allotted", projectvendor: req.body.project }, { userid: 1 });
    } else {
      clientuserid = await ClientUserID.aggregate([
        { $unwind: "$loginallotlog" },

        {
          $match: {
            allotted: "allotted",
            projectvendor: { $in: req.body.project },
            "loginallotlog.empname": req.body.companyname,
            "loginallotlog.date": { $lte: req.body.date },
          },
        },
        { $sort: { userid: 1, "loginallotlog.date": -1 } },
        {
          $group: {
            _id: "$userid",
            latestLog: { $first: "$loginallotlog" },
          },
        },

        {
          $project: {
            userid: "$_id",
            _id: 0,
          },
        },
      ]);
    }
    console.log(clientuserid.length, "clientuserid")

  } catch (err) {
    console.log(err.message);
  }
  // if (!clientuserid) {
  //   return next(new ErrorHandler("Client User ID not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});



exports.clientUserIdLimitedTimestudyByCompnynameMulti = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {
    // console.log(["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((role) => req.body.role.includes(role)), "req.body.role");
    if (["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((role) => req.body.role.includes(role))) {
      clientuserid = await ClientUserID.find({ allotted: "allotted", projectvendor: req.body.project }, { userid: 1 });
    } else {
      clientuserid = await ClientUserID.aggregate([
        { $unwind: "$loginallotlog" },

        {
          $match: {
            allotted: "allotted",
            projectvendor: { $in: req.body.project },
            "loginallotlog.empname": req.body.companyname,
            "loginallotlog.date": { $lte: req.body.date },
          },
        },
        { $sort: { userid: 1, "loginallotlog.date": -1 } },
        {
          $group: {
            _id: "$userid",
            latestLog: { $first: "$loginallotlog" },
          },
        },

        {
          $project: {
            userid: "$_id",
            _id: 0,
          },
        },
      ]);
    }
    // console.log(clientuserid.length, "clientuserid")

  } catch (err) {
    console.log(err.message);
  }
  // if (!clientuserid) {
  //   return next(new ErrorHandler("Client User ID not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});


exports.clientUseridsLimitedUser = catchAsyncErrors(async (req, res, next) => {
  let clientuserid;
  try {

    clientuserid = await ClientUserID.aggregate([
      { $unwind: '$loginallotlog' },
      {
        $sort: {
          'loginallotlog.date': 1,
          'loginallotlog.time': 1,
        },
      },

      {
        $group: {
          _id: {
            userid: '$userid',
            projectvendor: '$projectvendor',
          },
          logs: { $push: '$loginallotlog' },
        },
      },
      {
        $project: {
          userid: '$_id.userid',

          logs: {
            $map: {
              input: { $range: [0, { $size: '$logs' }] },
              as: 'idx',
              in: {
                currentLog: { $arrayElemAt: ['$logs', '$$idx'] },
                endDate: {
                  $cond: {
                    if: { $lt: ['$$idx', { $subtract: [{ $size: '$logs' }, 1] }] },
                    then: { $arrayElemAt: ['$logs.date', { $add: ['$$idx', 1] }] },
                    else: null,
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: '$logs' },
      {
        $replaceRoot: { newRoot: { $mergeObjects: ['$logs.currentLog', { endDate: '$logs.endDate' }] } },
      },
      {
        $match: {
          empname: req.body.companyname,
          date: { $lte: req.body.date },
          $or: [
            { endDate: null },
            { endDate: { $gt: req.body.date } },
          ],
        },
      },
      {
        $sort: { date: -1, time: -1 },
      },
    ]);
    // console.log(clientuserid, 'clientuserid')
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    clientuserid,
  });
});

