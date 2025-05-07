const TicketGrouping = require("../../../model/modules/clientSupport/manageTicketGrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TicketGrouping Name => /api/allticketgrouping
exports.getAllTicketGrouping = catchAsyncErrors(async (req, res, next) => {
  let ticketgrouping;

  const { assignbranch } = req.body;

  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    $and: [
      { company: { $elemMatch: { $eq: branchObj.company } } },
      { branch: { $elemMatch: { $eq: branchObj.branch } } },
      { unit: { $elemMatch: { $eq: branchObj.unit } } },
    ],
  }));
  const filterQuery = { $or: branchFilter };
  try {
    ticketgrouping = await TicketGrouping.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  if (!ticketgrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    ticketgrouping,
  });
});

// Create new TicketGrouping=> /api/createticketgrouping
exports.addTicketGrouping = catchAsyncErrors(async (req, res, next) => {
  const {
    clientname,
    modulename,
    submodulename,
    mainpage,
    subpage,
    subsubpage,
    employeedbid,
  } = req.body;

  // Initialize the query array with mandatory fields
  const queryArray = [
    { clientname: clientname },
    { modulename: { $all: modulename } },
    { employeedbid: { $all: employeedbid } },
  ];

  // Conditionally add optional fields if they are not empty
  if (submodulename.length > 0) {
    queryArray.push({ submodulename: { $all: submodulename } });
  }
  if (mainpage.length > 0) {
    queryArray.push({ mainpage: { $all: mainpage } });
  }
  if (subpage.length > 0) {
    queryArray.push({ subpage: { $all: subpage } });
  }
  if (subsubpage.length > 0) {
    queryArray.push({ subsubpage: { $all: subsubpage } });
  }

  // Build the query object with $and
  const queryObject = { $and: queryArray };

  // Execute the query
  let duplicate = await TicketGrouping.findOne(queryObject);

  if (duplicate) {
    return res.status(400).json({
      message: "Data Already Exist!",
    });
  }

  let aticketgrouping = await TicketGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TicketGrouping => /api/singleticketgrouping/:id
exports.getSingleTicketGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sticketgrouping = await TicketGrouping.findById(id);

  if (!sticketgrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sticketgrouping,
  });
});

// update TicketGrouping by id => /api/singleticketgrouping/:id
exports.updateTicketGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const {
    clientname,
    modulename,
    submodulename,
    mainpage,
    subpage,
    subsubpage,
    employeedbid,
  } = req.body;

  // Initialize the query array with mandatory fields
  const queryArray = [
    { clientname: clientname },
    { modulename: { $all: modulename } },
    { employeedbid: { $all: employeedbid } },
    { _id: { $ne: id } },
  ];

  // Conditionally add optional fields if they are not empty
  if (submodulename.length > 0) {
    queryArray.push({ submodulename: { $all: submodulename } });
  }
  if (mainpage.length > 0) {
    queryArray.push({ mainpage: { $all: mainpage } });
  }
  if (subpage.length > 0) {
    queryArray.push({ subpage: { $all: subpage } });
  }
  if (subsubpage.length > 0) {
    queryArray.push({ subsubpage: { $all: subsubpage } });
  }

  // Build the query object with $and
  const queryObject = { $and: queryArray };

  // Execute the query
  let duplicate = await TicketGrouping.findOne(queryObject);
  if (duplicate) {
    return res.status(400).json({
      message: "Data Already Exist!",
    });
  }

  let uticketgrouping = await TicketGrouping.findByIdAndUpdate(id, req.body);
  if (!uticketgrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TicketGrouping by id => /api/singleticketgrouping/:id
exports.deleteTicketGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dticketgrouping = await TicketGrouping.findByIdAndRemove(id);

  if (!dticketgrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});