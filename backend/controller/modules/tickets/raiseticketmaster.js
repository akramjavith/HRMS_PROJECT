const Raiseticketmaster = require("../../../model/modules/tickets/raiseticketmaster");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
//get All Raiseticketmaster =>/api/Raiseticketmaster
exports.getAllRaiseTicket = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});
exports.getAllRaiseTicketOpen = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.find({ raiseself: "Open" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});
exports.getAllRaiseTicketClosed = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.find({ raiseself: { $in: ["Closed", "Resolved"] } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});
exports.getAllRaiseTicketEditDuplication = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.find({ _id: req.body.individualid });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});
exports.getAllRaiseTicketLast = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    const answer = await Raiseticketmaster.find({}, { raiseticketcount: 1 });
    raisetickets = [answer[answer?.length - 1]]
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});

exports.getAllRaiseTicketWithoutClosed = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.find({ raiseself: { $nin: ["Closed", "Reject", "Resolved"] } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});




exports.getAllRaiseTicketFilteredDatas = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects;
  let { value, username, role, page, pageSize } = req.body;

  let type = req.body.type
  try {
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', "username", "role", 'type'].includes(key)) {
        const value = req.body[key];
        if (value !== "" && value !== "ALL" && value?.length > 0) {
          query[key] = value;
        }
      }
    });


    const generateMongoQuery = (query) => {
      const mongoQuery = {};

      // Add company to the query if it exists
      if (query.company && Array.isArray(query.company)) {
        mongoQuery.company = { $in: query.company };
      }
      if (query.branch) {
        mongoQuery.branch = query.branch;
      }
      if (query.unit) {
        mongoQuery.unit = query.unit;
      }
      if (query.team) {
        mongoQuery.team = query.team;
      }
      if (query.category) {
        mongoQuery.category = query.category;
      }
      if (query.subcategory) {
        mongoQuery.subcategory = query.subcategory;
      }
      if (query.subsubcategory) {
        mongoQuery.subsubcategory = query.subsubcategory;
      }
      if (query.value && !query.value?.includes("All Ticket")) {
        mongoQuery.raiseself = query.value;
      }
      // If employeename is an array, use $in to match any of the names
      if (query.employeename && Array.isArray(query.employeename)) {
        mongoQuery.employeename = { $in: query.employeename };
      }

      return mongoQuery;
    };




    const mongoQuery = generateMongoQuery(query);

    totalProjects = role == true
      ? await Raiseticketmaster.find(mongoQuery).countDocuments() :
      await Raiseticketmaster.countDocuments({ employeename: username });

    result = role == true
      ? await Raiseticketmaster.find(mongoQuery).skip((page - 1) * pageSize)
        .limit(parseInt(pageSize)) :
      await Raiseticketmaster.find({ employeename: username }, {})
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


exports.getAllRaiseTicketFilteredIndividualDatas = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects;
  let { value, username, role, page, pageSize } = req.body;

  try {
    totalProjects = await Raiseticketmaster.countDocuments({ employeename: username });
    result = role == true
      ?
      (value == "All Ticket" ? await Raiseticketmaster.find({ employeename: username }).skip((page - 1) * pageSize)
        .limit(parseInt(pageSize)) : await Raiseticketmaster.find({ employeename: username }).skip((page - 1) * pageSize)
          .limit(parseInt(pageSize)))
      :
      await Raiseticketmaster.find({ employeename: username }, {})
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


exports.getAllRaiseTicketFilteredDatasOverall = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects;
  let { value, username, role } = req.body;
  try {
    result = role == true
      ?
      await Raiseticketmaster.find({}, {
        priority: 1, raiseself: 1, workstation: 1, materialname: 1, type: 1, raiseself: 1, textAreaCloseDetails: 1,
        raiseticketcount: 1, raisedby: 1, raiseddate: 1, ticketclosed: 1, resolvedate: 1,
        duedate: 1, title: 1, description: 1, reason: 1, employeename: 1, employeecode: 1, category: 1, subcategory: 1, subsubcategory: 1, _id: 1
      })
      :
      await Raiseticketmaster.find({ raiseself: value, employeename: username }, {
        priority: 1, raiseself: 1, workstation: 1, materialname: 1, type: 1, raiseself: 1, textAreaCloseDetails: 1,
        raiseticketcount: 1, raisedby: 1, raiseddate: 1, ticketclosed: 1, resolvedate: 1,
        duedate: 1, title: 1, description: 1, reason: 1, employeename: 1, employeecode: 1, category: 1, subcategory: 1, subsubcategory: 1, _id: 1
      })



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,

  });
});
exports.getAllTicketsReports = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects;
  let { username, role, page, pageSize } = req.body;
  let type = req.body.type
  try {
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value', "username", "role", 'type'].includes(key)) {
        const value = req.body[key];
        if (value !== "" && value !== "ALL" && value?.length > 0) {
          query[key] = value;
        }
      }
    });
    const generateMongoQuery = (query) => {
      const mongoQuery = {};

      // Add company to the query if it exists
      if (query.company && Array.isArray(query.company)) {
        mongoQuery.company = { $in: query.company };
      }
      if (query.branch) {
        mongoQuery.branch = query.branch;
      }
      if (query.unit) {
        mongoQuery.unit = query.unit;
      }
      if (query.team) {
        mongoQuery.team = query.team;
      }
      if (query.category) {
        mongoQuery.category = query.category;
      }
      if (query.subcategory) {
        mongoQuery.subcategory = query.subcategory;
      }
      if (query.subsubcategory) {
        mongoQuery.subsubcategory = query.subsubcategory;
      }
      // If employeename is an array, use $in to match any of the names
      if (query.employeename && Array.isArray(query.employeename)) {
        mongoQuery.employeename = { $in: query.employeename };
      }

      return mongoQuery;
    };


    const mongoQuery = generateMongoQuery(query);
    console.log(mongoQuery, 'console.log(mongoQuery)')
    totalProjects = role == true
      ?
      await Raiseticketmaster.find(mongoQuery).countDocuments() :
      await Raiseticketmaster.countDocuments({ employeename: username });



    result = role == true
      ?
      await Raiseticketmaster.find(mongoQuery).skip((page - 1) * pageSize)
        .limit(parseInt(pageSize))
      :
      await Raiseticketmaster.find({ employeename: username }, {})
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



exports.getAllTicketsReportsOverall = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects;
  let { username, role } = req.body;
  try {
    result = role == true
      ?
      await Raiseticketmaster.find({}, { employeename: 1, employeecode: 1, createdAt: 1, raiseself: 1, ticketclosed: 1, _id: 1 })
      :
      await Raiseticketmaster.find({ employeename: username }, { employeename: 1, employeecode: 1, createdAt: 1, raiseself: 1, ticketclosed: 1, _id: 1 })



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,

  });
});

exports.getAllRaiseHierarchyFilter = catchAsyncErrors(async (req, res, next) => {
  let raisetickets, hierarchyDefList, hierarchyMap, result, conditionCheck, Supervisorchoose, EmployeeNames, controlNames, controlNamesSplice;
  try {

    hierarchyDefList = await Hirerarchi.find();
    hierarchyMap = hierarchyDefList.find(item => item.employeename.includes(req.body.empname))?.control

    controlNames = hierarchyMap ? [`${hierarchyMap?.slice(0, -1)}1`, `${hierarchyMap?.slice(0, -1)}2`, `${hierarchyMap?.slice(0, -1)}3`, `${hierarchyMap?.slice(0, -1)}4`] : []
    if (hierarchyMap) {
      result = hierarchyMap[hierarchyMap?.length - 1]?.toString();
      switch (result) {
        case "0":
          conditionCheck = hierarchyMap ? hierarchyDefList?.filter(data => [`${hierarchyMap?.slice(0, -1)}1`, `${hierarchyMap?.slice(0, -1)}2`, `${hierarchyMap?.slice(0, -1)}3`, `${hierarchyMap?.slice(0, -1)}4`].includes(data.control)) : [];
          break;
        case "1":
          conditionCheck = hierarchyMap ? hierarchyDefList?.filter(data => [`${hierarchyMap?.slice(0, -1)}2`, `${hierarchyMap?.slice(0, -1)}3`, `${hierarchyMap?.slice(0, -1)}4`].includes(data.control)) : [];
          break;
        case "2":
          conditionCheck = hierarchyMap ? hierarchyDefList?.filter(data => [`${hierarchyMap?.slice(0, -1)}3`, `${hierarchyMap?.slice(0, -1)}4`].includes(data.control)) : [];
          break;
        case "3":
          conditionCheck = hierarchyMap ? hierarchyDefList?.filter(data => [`${hierarchyMap?.slice(0, -1)}3`].includes(data.control)) : [];
          break;
      }


      Supervisorchoose = conditionCheck?.flatMap(item => item.supervisorchoose)
      EmployeeNames = conditionCheck?.flatMap(item => item.employeename)

    }

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hierarchyDefList) {
    return next(new ErrorHandler("Raise Tickets Hierarchies  not found!", 404));
  }
  return res.status(200).json({
    raisetickets: [...(Supervisorchoose?.length > 0 ? Supervisorchoose : []), ...(EmployeeNames?.length > 0 ? EmployeeNames : [])],
  });
});

//create new Raiseticketmaster => /api/Raiseticketmaster/new
exports.addRaiseTicket = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let araiseticket = await Raiseticketmaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Raiseticketmaster => /api/Raiseticketmaster/:id
exports.getSingleRaiseTicket = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sraiseticket = await Raiseticketmaster.findById(id);
  if (!sraiseticket) {
    return next(new ErrorHandler("Raise Ticket not found", 404));
  }
  return res.status(200).json({
    sraiseticket,
  });
});

//update Raiseticketmaster by id => /api/Raiseticketmaster/:id
exports.updateRaiseTicket = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uraiseticket = await Raiseticketmaster.findByIdAndUpdate(id, req.body);
  if (!uraiseticket) {
    return next(new ErrorHandler("Raise Ticket not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Raiseticketmaster by id => /api/Raiseticketmaster/:id
exports.deleteRaiseTicket = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let draiseticket = await Raiseticketmaster.findByIdAndRemove(id);
  if (!draiseticket) {
    return next(new ErrorHandler("Raise Ticket not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});






exports.getAllRaiseTicketForwardedEmployee = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.aggregate([
      {
        $match: {
          raiseself: "Forwarded",
          forwardedemployee: {
            $elemMatch: {
              $eq: req?.body?.username
            }
          }
        }
      }
    ])

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({ raisetickets });
});
exports.getAllRaiseTicketUserForwardedEmployee = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  try {
    raisetickets = await Raiseticketmaster.aggregate([
      {
        $match: {
          "forwardedlog.forwardedby":
            req.body.username,
          raiseself: {
            $in: [
              "Hold",
              "Details Needed",
              "Reject",
              "In-Reapir",
              "Forwarded"
            ]
          }
        }
      }
    ])

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({ raisetickets });
});


exports.getAllRaiseTicketFilteredIndividualDatasHome = catchAsyncErrors(async (req, res, next) => {
  let result;
  let { username } = req.body;

  try {
    result = await Raiseticketmaster.countDocuments({ employeename: username });
    // console.log(result, "resultindividual")

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,
  });
});




