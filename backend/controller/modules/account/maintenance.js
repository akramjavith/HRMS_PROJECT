const Maintenance = require("../../../model/modules/account/maintenance");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
const mime = require('mime-types');


// Helper function to create filter condition
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

//get All Maintenances =>/api/maintenances
exports.getAllMaintenance = catchAsyncErrors(async (req, res, next) => {
  let maintenances;
  try {
    maintenances = await Maintenance.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!maintenances) {
    return next(new ErrorHandler("Maintenance not found!", 404));
  }
  return res.status(200).json({
    maintenances,
  });
});


exports.getAllMaintenanceExcelLimited = catchAsyncErrors(async (req, res, next) => {
  let maintenances;
  try {
    maintenances = await Maintenance.find({}, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      duration: 1,
      breakup: 1,
      monthdate: 1,
      breakupcount: 1,
      required: 1,
      area: 1,
      location: 1,
      assetmaterial: 1,
      maintenancedetails: 1,
      assetmaterialcode: 1,
      frequency: 1,
      schedule: 1,
      companyto: 1,
      branchtolist: 1,
      unittolist: 1,
      teamtolist: 1,
      employeenametolist: 1,
      vendor: 1,
      priority: 1,
      address: 1,
      emailid: 1,
      phonenumberone: 1,
      timetodo: 1,
      weekdays: 1,
      annumonth: 1,
      vendorgroup: 1,
      companyto: 1,
      branchto: 1,
      unitto: 1,
      teamto: 1,
      employeenameto: 1,
      phone: 1
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!maintenances) {
    return next(new ErrorHandler("Maintenance not found!", 404));
  }
  return res.status(200).json({
    maintenances,
  });
});



exports.getAllMaintenanceActive = catchAsyncErrors(async (req, res, next) => {
  let maintenances;
  try {
    maintenances = await Maintenance.find({ schedulestatus: "Active" }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!maintenances) {
    return next(new ErrorHandler("Maintenance not found!", 404));
  }
  return res.status(200).json({
    maintenances,
  });
});

//create new maintenance => /api/maintenance/new
exports.addMaintenance = catchAsyncErrors(async (req, res, next) => {
  let amaintenance = await Maintenance.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single maintenance=> /api/maintenance/:id
exports.getSingleMaintenance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let smaintenance = await Maintenance.findById(id);
  if (!smaintenance) {
    return next(new ErrorHandler("Maintenance not found", 404));
  }
  return res.status(200).json({
    smaintenance,
  });
});
//update maintenance by id => /api/maintenance/:id
exports.updateMaintenance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umaintenance = await Maintenance.findByIdAndUpdate(id, req.body);
  if (!umaintenance) {
    return next(new ErrorHandler("Maintenance not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete maintenance by id => /api/maintenance/:id
exports.deleteMaintenance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dmaintenance = await Maintenance.findByIdAndRemove(id);
  if (!dmaintenance) {
    return next(new ErrorHandler("Maintenance not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});



exports.getAllMaintenanceAccess = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, material } = req.body;

  let query = {};

  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));
  const branchFilterTo = assignbranch.map((branchObj) => ({
    branchto: branchObj.branch,
    companyto: branchObj.company,
    unitto: branchObj.unit,
  }));


  query = {
    $or: [...branchFilter, ...branchFilterTo],
  };
  if (company && company?.length > 0) {
    query.company = { $in: company }
  }

  if (branch && branch?.length > 0) {
    query.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    query.unit = { $in: unit }
  }
  if (material && material?.length > 0) {
    query.assetmaterial = { $in: material }
  }

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
      }
    });
  }


  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { company: regex },
        { branch: regex },
        { unit: regex },
        { duration: regex },
        { breakup: regex },
        { assetmaterialcode: regex },
        { monthdate: regex },
        { breakupcount: regex },
        { required: regex },
        { area: regex },
        { location: regex },
        { assetmaterial: regex },
        { maintenancedetails: regex },
        { frequency: regex },
        { schedule: regex },
        { companyto: regex },
        { branchtolist: regex },
        { unittolist: regex },
        { teamtolist: regex },
        { employeenametolist: regex },
        { vendor: regex },
        { priority: regex },
        { address: regex },
        { emailid: regex },
        { phonenumberone: regex },
        { timetodo: regex },
        { weekdays: regex },
        { annumonth: regex },
        { monthdate: regex },
        { vendorgroup: regex },
      ],
    }));

    query = {
      $and: [
        {
          $or: [...branchFilter, ...branchFilterTo]

        },
        // {
        //   $or: assignbranch.map((branchObj) => ({
        //     branch: branchObj.branch,
        //     company: branchObj.company,
        //     unit: branchObj.unit,
        //   }))
        // }, {
        //   $or: assignbranch.map((branchObj) => ({
        //     branchto: branchObj.branch,
        //     companyto: branchObj.company,
        //     unitto: branchObj.unit,
        //   }))
        // },
        ...orConditions,
      ],
    };
  }
  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  try {

    const totalProjects = await Maintenance.countDocuments(query);

    const result = await Maintenance.find(query, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      duration: 1,
      breakup: 1,
      monthdate: 1,
      breakupcount: 1,
      required: 1,
      area: 1,
      location: 1,
      assetmaterial: 1,
      maintenancedetails: 1,
      assetmaterialcode: 1,
      frequency: 1,
      schedule: 1,
      companyto: 1,
      branchtolist: 1,
      unittolist: 1,
      teamtolist: 1,
      employeenametolist: 1,
      vendor: 1,
      priority: 1,
      address: 1,
      emailid: 1,
      phonenumberone: 1,
      timetodo: 1,
      weekdays: 1,
      annumonth: 1,
      vendorgroup: 1,
      companyto: 1,
      branchto: 1,
      unitto: 1,
      teamto: 1,
      employeenameto: 1,
      phone: 1

    }).select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();

    // console.log(result[0], "red")
    res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});



//multer upload

const mergeChunksMaintenance = async (fileName, totalChunks) => {
  const parentDir = path.join(__dirname, ".."); // C:/Users/backend
  const chunkDir = path.join(parentDir, "..", "..", "mergeChunks");
  const mergedFilePath = path.join(parentDir, "..", "..", "maintenance_files");

  // console.log(parentDir, mergedFilePath, "parentDir")
  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
    fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
  }

  writeStream.end();
  console.log("Chunks merged successfully");
};

exports.uploadChunkMaintenance = [
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    // console.log("Upload hit", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const chunk = req.file.buffer;
    const chunkNumber = Number(req.body.chunkNumber);
    const totalChunks = Number(req.body.totalChunks);
    const fileName = req.body.originalname;
    const parentDir = path.join(__dirname, ".."); // C:/Users/backend
    const chunkDir = path.join(parentDir, "..", "..", "mergeChunks");
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

    try {
      await fs.promises.writeFile(chunkFilePath, chunk);

      if (chunkNumber === totalChunks - 1) {
        await mergeChunksMaintenance(fileName, totalChunks);
        console.log("File merged successfully");
      }

      res.status(200).json({ message: "Chunk uploaded successfully" });
    } catch (error) {
      console.error("Error saving chunk:", error);
      res.status(500).json({ error: "Error saving chunk" });
    }
  }),
];

exports.getAllMaintenanceTodoDelete = catchAsyncErrors(async (req, res, next) => {
  const { filenames } = req.body; // Expect an array of filenames

  try {
    if (!filenames || filenames.length === 0) {
      return res.status(400).json({ error: "No filenames provided." });
    }
    // console.log(filenames.length, filenames[0], __dirname, "filename");
    let deletedFiles = [];
    let notFoundFiles = [];

    filenames.forEach((file) => {
      const parentDir = path.join(__dirname, ".."); // C:/Users/backend
      const filePath = path.join(parentDir, "..", "..", "maintenance_files", file);
      // const filePath = path.join(__dirname, "../../../merged_files", file);
      console.log(filePath, "filePath");
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
        deletedFiles.push(file);
      } else {
        notFoundFiles.push(file);
      }
    });

    res.json({
      message: "Deletion process completed.",
      deletedFiles,
      notFoundFiles,
    });
  } catch (err) {
    console.log(err, "errDEL");
  }
});

exports.getAllMaintenanceTodoEditFetch = catchAsyncErrors(async (req, res, next) => {
  try {
    const { filename } = req.body;

    const parentDir = path.join(__dirname, ".."); // C:/Users/backend
    const filePath = path.join(parentDir, "..", "..", "maintenance_files", filename);
    console.log(filePath, "filePath");
    if (!fs.existsSync(filePath)) {
      console.log("File not found");
      //  return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", mime.lookup(filename));
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.log(err, "erredtifetch");
  }
});