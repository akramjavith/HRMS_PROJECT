const AchievedAccuracyIndividual = require("../../../model/modules/accuracy/achievedaccuracyindividualmodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const { ObjectId } = require("mongodb");
const MinimumPoints = require("../../../model/modules/production/minimumpoints");
const Department = require("../../../model/modules/department");
const User = require("../../../model/login/auth");

// get All Achieved accuracy individual => /api/achievedaccuracyindividual
exports.getAllAchievedAccuracyIndividual = catchAsyncErrors(async (req, res, next) => {
  let achievedaccuracyindividual;
  try {
    achievedaccuracyindividual = await AchievedAccuracyIndividual.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!achievedaccuracyindividual) {
    return next(new ErrorHandler("Achieved Accuracy Individual not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    achievedaccuracyindividual,
  });
});

// get All ClientUserID Name => /api/clientuserids

exports.dayPointsfilter = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, less, greater, compare, betweenfrom, betweento, company, unit, team, branch, empnames } = req.body;
    minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    departments = await Department.find({}, { deptname: 1, prod: 1 });
    users = await User.find({}, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1 });
    const conditions = [];

if (fromdate && todate) {
  conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
}

if (company && company.length > 0) {
  conditions.push({ $in: ["$$upload.companyname", company] });
}

if (branch && branch.length > 0) {
  conditions.push({ $in: ["$$upload.branch", branch] });
}

if (unit && unit.length > 0) {
  conditions.push({ $in: ["$$upload.unit", unit] });
}

if (team && team.length > 0) {
  conditions.push({ $in: ["$$upload.team", team] });
}

if (empnames && empnames.length > 0) {
  conditions.push({ $in: ["$$upload.name", empnames] });
}

const cond = {
  $and: conditions,
};

daypointsupload = await AchievedAccuracyIndividual.aggregate([
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

let answer = daypointsupload.flatMap((data) =>
  data.uploaddata.map((upload) => ({
    companyname: upload.companyname,
    name: upload.name,
    empcode: upload.empcode,
    branch: upload.branch,
    unit: upload.unit,
    team: upload.team,
    date: upload.date,
    target: upload.target,
    point: upload.point,
    avgpoint: upload.avgpoint,
    id: upload._id,
    mainid: data._id,
  }))
);

const filteredArray = answer.map((obj1) => {
  const splitDate = obj1.date.split("-");
  const oldyear = splitDate[0];
  const oldmonth = splitDate[1];

  const matchingMinpoint = minpoints.find((obj2) => {
    return (
      obj1.name === obj2.name &&
      obj1.branch === obj2.branch &&
      // obj1.companyname === obj2.company
      // && obj1.empcode === obj2.empcode
      // &&
      obj1.unit === obj2.unit &&
      Number(oldmonth) === Number(obj2.month) &&
      Number(oldyear) === Number(obj2.year) &&
      obj1.team === obj2.team
    );
  });

  if (matchingMinpoint) {
    obj1.daypoint = matchingMinpoint.daypoint;
  }

  const matchingMinpointuser = users.find((obj2) => {
    return (
      obj1.name === obj2.companyname &&
      obj1.branch === obj2.branch &&
      // obj1.companyname === obj2.company
      //  && obj1.empcode === obj2.empcode
      // &&
      obj1.unit === obj2.unit &&
      obj1.team === obj2.team
    );
  });

  if (matchingMinpointuser) {
    obj1.department = matchingMinpointuser.department;
  }

  const matchingMinpointdept = departments.find((obj2) => {
    return obj1.department === obj2.deptname;
  });

  if (matchingMinpointdept) {
    obj1.prod = matchingMinpointdept.prod;
  }

  return obj1;
});

// let filtereary = filteredArray.map(item => item[0])
let belowMin = filteredArray.reduce((acc, current) => {
  const existingItemIndex = acc.findIndex(
    (item) =>
      item.name === current.name &&
      // && item.companyname === current.companyname
      item.branch === current.branch &&
      item.unit === current.unit &&
      item.team === current.team &&
      item.empcode === current.empcode
  );

  if (existingItemIndex !== -1) {
    // Update existing item
    const existingItem = acc[existingItemIndex];

    existingItem.point += Number(current.point);
    existingItem.daypoint += Number(current.daypoint);
    existingItem.target += Number(current.target);
    existingItem.date.push(current.date);

    existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

    // Convert the dates array to Date objects
    const dateObjects = existingItem.date.map((date) => new Date(date));

    // Find the earliest (from) and latest (to) dates
    const fromDate = new Date(Math.min(...dateObjects));
    const toDate = new Date(Math.max(...dateObjects));

    // Format the dates as strings in "YYYY-MM-DD" format
    const formattedFromDate = fromDate.toISOString().split("T")[0];
    const formattedToDate = toDate.toISOString().split("T")[0];

    // Update start and end date
    existingItem.startDate = fromDate;
    existingItem.endDate = toDate;
  } else {
    // Add new item
    acc.push({
      // companyname: current.companyname,
      name: current.name,
      daypoint: Number(current.daypoint),
      avgpoint: Number(current.point) / Number(current.target),
      point: Number(current.point),
      target: Number(current.target),
      _id: current.id,
      branch: current.branch,
      date: [current.date],
      unit: current.unit,
      team: current.team,
      empcode: current.empcode,
      department: current.department,
      prod: current.prod,
      startDate: current.date, // Initial start date
      endDate: current.date, // Initial end date
    });
  }
  return acc;
}, []);

if (compare == "Below Minimum Points") {
  productionupload = belowMin.filter((item) => Number(item.daypoint) > Number(item.point) && item.prod === true);
} else if (compare == "Below Target Points") {
  productionupload = belowMin.filter((item) => Number(item.target) > Number(item.point) && item.prod === true);
} else if (compare == "Less than") {
  productionupload = belowMin.filter((item) => Number(item.avgpoint) < Number(less) && item.prod === true);
} else if (compare == "Greater than") {
  productionupload = belowMin.filter((item) => Number(item.avgpoint) > Number(greater) && item.prod === true);
} else if (compare == "Between") {
  productionupload = belowMin.filter((item) => Number(item.avgpoint) >= Number(betweenfrom) && Number(item.avgpoint) <= Number(betweento) && item.prod === true);
} else {
  productionupload = belowMin.filter((item) => item.prod === true);
}
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Internal Server Error", 500));
  }
  if (!productionupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json(productionupload);
});

// get All ClientUserID Name => /api/clientuserids
exports.dayPointsDatasFetch = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minpoints, productionupload;
  try {
    const { fromdate, todate } = req.body;
    minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    departments = await Department.find({}, { deptname: 1, prod: 1 });
    users = await User.find({}, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1 });

const conditions = [];

if (fromdate && todate) {
  conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
}

const cond = {
  $and: conditions,
};

daypointsupload = await AchievedAccuracyIndividual.aggregate([
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

let answer = daypointsupload.flatMap((data) =>
  data.uploaddata.map((upload) => ({
    companyname: upload.companyname,
    name: upload.name,
    empcode: upload.empcode,
    branch: upload.branch,
    unit: upload.unit,
    team: upload.team,
    date: upload.date,
    target: upload.target,
    point: upload.point,
    avgpoint: upload.avgpoint,
    id: upload._id,
    mainid: data._id,
  }))
);

const filteredArray = answer.map((obj1) => {
  const splitDate = obj1.date.split("-");
  const oldyear = splitDate[0];
  const oldmonth = splitDate[1];

  const matchingMinpoint = minpoints.find((obj2) => {
    return obj1.name === obj2.name && obj1.branch === obj2.branch && obj1.companyname === obj2.company && obj1.empcode === obj2.empcode && obj1.unit === obj2.unit && Number(oldmonth) === Number(obj2.month) && Number(oldyear) === Number(obj2.year) && obj1.team === obj2.team;
  });

  if (matchingMinpoint) {
    obj1.daypoint = matchingMinpoint.daypoint;
  }

  const matchingMinpointuser = users.find((obj2) => {
    return obj1.name === obj2.companyname && obj1.branch === obj2.branch && obj1.companyname === obj2.company && obj1.unit === obj2.unit && obj1.team === obj2.team;
  });

  if (matchingMinpointuser) {
    obj1.department = matchingMinpointuser.department;
  }

  const matchingMinpointdept = departments.find((obj2) => {
    return obj1.department === obj2.deptname;
  });

  if (matchingMinpointdept) {
    obj1.prod = matchingMinpointdept.prod;
  }

  return obj1;
});

productionuploads = filteredArray.reduce((acc, current) => {
  const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

  if (existingItemIndex !== -1) {
    // Update existing item
    const existingItem = acc[existingItemIndex];
    existingItem.daypoint += Number(current.daypoint);
    // existingItem.avgpoint += Number(current.avgpoint);
    existingItem.point += Number(current.point);
    existingItem.target += Number(current.target);
    existingItem.date.push(current.date);

    // Convert the dates array to Date objects
    const dateObjects = existingItem.date.map((date) => new Date(date));

    // Find the earliest (from) and latest (to) dates
    const fromDate = new Date(Math.min(...dateObjects));
    const toDate = new Date(Math.max(...dateObjects));

    // Format the dates as strings in "YYYY-MM-DD" format
    const formattedFromDate = fromDate.toISOString().split("T")[0];
    const formattedToDate = toDate.toISOString().split("T")[0];

    // Update start and end date
    existingItem.startDate = fromDate;
    existingItem.endDate = toDate;
    existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;
  } else {
    // Add new item
    acc.push({
      companyname: current.companyname,
      name: current.name,
      daypoint: Number(current.daypoint),
      avgpoint: Number(current.avgpoint),
      point: Number(current.point),
      target: Number(current.target),
      date: [current.date], // Store date as an array
      _id: current.id,
      branch: current.branch,
      unit: current.unit,
      team: current.team,
      empcode: current.empcode,
      department: current.department,
      startDate: current.date, // Initial start date
      endDate: current.date, // Initial end date
    });
  }

  return acc;
}, []);
productionupload = productionuploads.filter((item) => item.prod === true);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionupload,
  });
});
// Create new AchievedAccuracyIndividual=> /api/achievedaccuracyindividual/new
exports.addAchievedAccuracyIndividual = catchAsyncErrors(async (req, res, next) => {
  let aachievedaccuracyindividual = await AchievedAccuracyIndividual.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AchievedAccuracyIndividual => /api/achievedaccuracyindividual/:id
exports.getSingleAchievedAccuracyIndividual = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sachievedaccuracyindividual = await AchievedAccuracyIndividual.findById(id);

  if (!sachievedaccuracyindividual) {
    return next(new ErrorHandler("Achieved Accuracy Individual not found!", 404));
  }
  return res.status(200).json({
    sachievedaccuracyindividual,
  });
});

// update AchievedAccuracyIndividual by id => /api/achievedaccuracyindividual/:id
exports.updateAchievedAccuracyIndividual= catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uachievedaccuracyindividual = await AchievedAccuracyIndividual.findByIdAndUpdate(id, req.body);
  if (!uachievedaccuracyindividual) {
    return next(new ErrorHandler("Achieved Accuracy Individual not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

exports.updateAchievedAccuracyIndividualSingleUpload = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    req.body.id = subid;
    try {
      const uploaddata = await AchievedAccuracyIndividual.findOneAndUpdate(
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

// delete AchievedAccuracyIndividual by id => /api/clientuserid/:id
exports.deleteAchievedAccuracyIndividual = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dachievedaccuracyindividual = await AchievedAccuracyIndividual.findByIdAndRemove(id);

  if (!dachievedaccuracyindividual) {
    return next(new ErrorHandler("Achieved Accuracy Individual not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


exports.getOverallAchievedAccuracyIndividualSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects , result , totalPages , currentPage;

  const {frequency, page, pageSize } = req.body;
  try {

    totalProjects =  await AchievedAccuracyIndividual.countDocuments();


    result = await AchievedAccuracyIndividual.find()
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize));


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
     totalProjects,
    result,
    currentPage:  page ,
    totalPages: Math.ceil( totalProjects / pageSize),
  });
});




exports.getOverallAchievedIndividualSort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let allusers;
  let totalProjects, paginatedData, isEmptyData, result;

  try {
      // const query = searchQuery ? { companyname: { $regex: searchQuery, $options: 'i' } } : {};
      const anse = await AchievedAccuracyIndividual.find()
      const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
      const filteredDatas = anse?.filter((item, index) => {
          const itemString = JSON.stringify(item)?.toLowerCase();
          return searchOverTerms.every((term) => itemString.includes(term));
      })
      isEmptyData = searchOverTerms?.every(item => item.trim() === '');
      const pageSized = parseInt(pageSize);
      const pageNumberd = parseInt(page);

      paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

      totalProjects = await AchievedAccuracyIndividual.countDocuments();

      allusers = await AchievedAccuracyIndividual.find()
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