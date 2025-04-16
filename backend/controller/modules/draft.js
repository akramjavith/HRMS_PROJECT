const Draft = require("../../model/modules/draft");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const bcrypt = require("bcryptjs");
const sendToken = require("../../utils/jwttokentocookie");
const sendEmail = require("../../utils/pwdresetmail");
const crypto = require("crypto");

// get All Draft => /api/drafts
exports.getAllDrafts = catchAsyncErrors(async (req, res, next) => {
  let drafts;

  try {
    drafts = await Draft.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!drafts) {
    return next(new ErrorHandler("Draft not found", 400));
  }

  return res.status(200).json({ drafts });
});

// / register adraft => api/auth/new
exports.regAuth = catchAsyncErrors(async (req, res, next) => {
  const {
    prefix,
    firstname,
    lastname,
    legalname,
    callingname,
    fromwhere,
    fathername,
    mothername,
    gender,
    maritalstatus,
    dob,
    username,
    usernameautogenerate,
    workmode,
    password,
    autogeneratepassword,
    status,
    percentage,
    bloodgroup,
    profileimage,
    accessiblecompany,
    accessiblebranch,
    accessibleunit,
    location,
    email,
    contactpersonal,
    contactfamily,
    emergencyno,
    doj,
    dot,
    referencetodo,
    contactno,
    details,
    companyname,
    pdoorno,
    pstreet,
    parea,
    plandmark,
    ptaluk,
    ppost,
    ppincode,
    pcountry,
    pstate,
    aadhar,
    panno,
    panstatus,
    panrefno,
    pcity,
    cdoorno,
    cstreet,
    carea,
    clandmark,
    ctaluk,
    cpost,
    cpincode,
    ccountry,
    cstate,
    ccity,
    branch,
    unit,
    samesprmnt,
    addedby,
    updatedby,
    floor,
    company,
    experience,
    department,
    team,
    designation,
    shifttiming,
    shiftgrouping,
    reportingto,
    empcode,
    remark,
    dom,
    accesslocation,
    workstation,
    weekoff,
    assignExpMode,
    assignExpvalue,
    assignExpDate,
    esideduction,
    pfdeduction,
    uan,
    pfmembername,
    insurancenumber,
    ipname,
    pfesifromdate,
    isenddate,
    pfesienddate,
    originalpassword,
    enquirystatus,
    area,
    enableworkstation,
    wordcheck,
    shiftallot,
    files,
    eduTodo,
    addAddQuaTodo,
    workhistTodo,
    //draft,
    modeOfInt,
    intDuration,
    intCourse,
    intStartDate,
    intEndDate,
    clickedGenerate,
    role,
    bankname,
    bankbranchname,
    accountholdername,
    accountnumber,
    ifsccode,
    assignExpLog,
    departmentlog,
    designationlog,
    boardingLog,
    processlog,
    employeecount,
    systemmode,
    companyemail,
    accessibletodo,
    salarycode,
    salarysetup,
    basic,
    hra,
    conveyance,
    medicalallowance,
    productionallowance,
    otherallowance,
    productionallowancetwo,
    ctc,
    mode,
    rejoin,
    shifttype,
    reasonablestatusremarks,
    endexp,
    endtardate,
    endtar,
    assignEndExp,

    assignEndExpDate,
    assignEndTar,
    assignEndTarDate,
    process,
    processtype,
    processduration,
    date,
    time,

    grosssalary,
    timemins,
    modeexperience,
    targetexperience,
    expval,
    expmode,
    targetpts,
    workstationofficestatus,
    workstationinput,
    bankdetails,
  } = req.body;
  // if (!username || !password) {
  //   return next(new ErrorHandler("Please fill all fields", 400));
  // }
  // encrypt password before saving
  //   const salt = await bcrypt.genSalt(10);
  //   const hashPassword = await bcrypt.hash(password, salt);
  const user = await Draft.create({
    prefix,
    username,
    usernameautogenerate,
    workmode,
    lastname,
    email,
    bankdetails,
    firstname,
    legalname,
    callingname,
    accessiblecompany,
    accessiblebranch,
    accessibleunit,
    fathername,
    mothername,
    fromwhere,
    gender,
    maritalstatus,
    dob,
    dom,
    //draft,
    status,
    percentage,
    bloodgroup,
    profileimage,
    location,
    email,
    contactpersonal,
    contactfamily,
    emergencyno,
    doj,
    rejoin,
    reasonablestatusremarks,
    dot,
    referencetodo,
    contactno,
    details,
    companyname,
    pdoorno,
    pstreet,
    parea,
    plandmark,
    ptaluk,
    ppost,
    ppincode,
    pcountry,
    pstate,
    aadhar,
    panno,
    panstatus,
    panrefno,
    pcity,
    cdoorno,
    cstreet,
    carea,
    clandmark,
    ctaluk,
    cpost,
    cpincode,
    ccountry,
    cstate,
    ccity,
    branch,
    unit,
    floor,
    samesprmnt,
    experience,
    addedby,
    updatedby,
    department,
    team,
    //draft,
    designation,
    shifttiming,
    shiftgrouping,
    reportingto,
    empcode,
    remark,
    accesslocation,
    workstation,
    weekoff,
    assignExpMode,
    assignExpvalue,
    assignExpDate,
    esideduction,
    pfdeduction,
    uan,
    pfmembername,
    insurancenumber,
    ipname,
    pfesifromdate,
    isenddate,
    pfesienddate,
    originalpassword,
    enquirystatus,
    area,
    enableworkstation,
    wordcheck,
    shiftallot,
    files,
    eduTodo,
    company,
    addAddQuaTodo,
    workhistTodo,
    modeOfInt,
    intDuration,
    intCourse,
    intStartDate,
    intEndDate,
    clickedGenerate,
    role,
    bankname,
    bankbranchname,
    accountholdername,
    accountnumber,
    ifsccode,
    password,
    autogeneratepassword,
    assignExpLog,
    departmentlog,
    designationlog,
    boardingLog,
    processlog,
    employeecount,
    systemmode,
    companyemail,
    accessibletodo,
    salarycode,
    salarysetup,
    basic,
    hra,
    conveyance,
    medicalallowance,
    productionallowance,
    otherallowance,
    productionallowancetwo,
    ctc,
    mode,
    assignExpMode,
    assignExpvalue,
    assignExpDate,
    shifttype,
    endexp,
    endtardate,
    endtar,
    assignEndExp,

    assignEndExpDate,
    assignEndTar,
    assignEndTarDate,
    process,
    processtype,
    processduration,
    date,
    time,

    grosssalary,
    timemins,
    modeexperience,
    targetexperience,
    expval,
    expmode,
    targetpts,
    workstationofficestatus,
    workstationinput,
  });
  return res.status(201).json({
    success: true,
    user,
  });
});

// Login user => api/drafts
exports.loginAuth = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email & password entered by user
  if (!username || !password) {
    return next(new ErrorHandler("Please enter username and password", 400));
  }

  // Finding if user exists in database
  const draft = await Draft.findOne({ username }).select("+password");

  if (!draft) {
    return next(new ErrorHandler("Invalid Username or Password", 401));
  }

  // If checks password is correct or not
  const isPwdMatched = await bcrypt.compare(password, user.password);

  if (!isPwdMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  sendToken(user, 200, res);
});

// Logout user => api/authout
exports.loginOut = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out!",
  });
});

// get Signle draft => /api/auth/:id
exports.getSingleDraft = catchAsyncErrors(async (req, res, next) => {
  const sdraft = await Draft.findById(req.params.id);

  if (!sdraft) {
    return next(new ErrorHandler("Draft not found", 404));
  }

  return res.status(200).json({
    success: true,
    sdraft,
  });
});

// update draft by id => /api/auth/:id
exports.updateDraft = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const updraft = await Draft.findByIdAndUpdate(id, req.body);

  if (!updraft) {
    return next(new ErrorHandler("Draft not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully!" });
});

// delete draft by id => /api/auth/:id
exports.deleteDraft = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const ddraft = await Draft.findByIdAndRemove(id);

  if (!ddraft) {
    return next(new ErrorHandler("Draft not found", 404));
  }

  res.status(200).json({ message: "Deleted successfully" });
});

exports.checkduplicatedraft = catchAsyncErrors(async (req, res, next) => {
  const {
    firstname,
    lastname,
    legalname,
    dob,
    aadhar,
    emergencyno,
    fromwhere,
  } = req.body;

  const existingUser = await Draft.findOne({
    $and: [
      { firstname },
      { lastname },
      { legalname: { $regex: new RegExp(legalname, "i") } },
      { dob },
      { aadhar },
      { emergencyno },
      { fromwhere },
    ],
  });

  if (existingUser) {
    return next(new ErrorHandler("Data already exists in Draft", 404));
  }

  res.status(200).json({ success: true });
});