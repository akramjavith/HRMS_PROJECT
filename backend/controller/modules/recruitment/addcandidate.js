const Addcandidate = require("../../../model/modules/recruitment/addcandidate");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Jobopenings = require("../../../model/modules/recruitment/jobopenings");
const Visitor = require("../../../model/modules/interactors/visitor");
const moment = require("moment");

// Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;

// get All Addcandidate  Details => /api/queue

exports.getAllDatabyAge_location = async (req, res) => {
  try {
    let filteredUsers;
    const {
      age,
      to,
      fromexp,
      toexp,
      education,
      skill,
      location,
      educationcategory,
      educationsubcategory,
      expectedsalary,
      expectedsalaryto,
      joiningindays,
      certification,
      expectedsalaryvalidation,
      overallstatus,
      roleback,
      rolebackto,
      role,
    } = req.body;
    const filterQuery = {};

    if (role !== "") {
      filterQuery.role = { $eq: role };
    }

    if (age !== "" && to !== "") {
      filterQuery.age = { $gte: Number(age), $lte: Number(to) };
    }

    if (expectedsalary !== "") {
      if (expectedsalaryvalidation === "Less Than") {
        filterQuery.expectedsalary = { $lt: expectedsalary };
      } else if (expectedsalaryvalidation === "Less Than or Equal to") {
        filterQuery.expectedsalary = { $lte: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than") {
        filterQuery.expectedsalary = { $gt: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than or Equal to") {
        filterQuery.expectedsalary = { $gte: expectedsalary };
      } else if (expectedsalaryvalidation === "Equal to") {
        filterQuery.expectedsalary = { $eq: expectedsalary };
      } else if (expectedsalaryvalidation === "Between") {
        filterQuery.expectedsalary = {
          $gte: Number(expectedsalary),
          $lte: Number(expectedsalaryto),
        };
      }
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length === 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length !== 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
          specialization: { $in: education },
        },
      };
    }

    if (fromexp !== "" && toexp !== "") {
      filterQuery.experience = { $gte: Number(fromexp), $lte: Number(toexp) };
    }

    if (skill?.length !== 0) {
      filterQuery.skill = { $in: skill };
    }
    if (location?.length !== 0) {
      filterQuery.city = { $in: location };
    }

    if (certification?.length !== 0) {
      filterQuery.certification = { $in: certification };
    }
    if (joiningindays !== "") {
      filterQuery.joinbydays = { $eq: joiningindays };
    }
    if (!overallstatus?.includes("ALL") && overallstatus?.length > 0) {
      filterQuery.overallstatus = { $in: overallstatus };
    }

    // Execute the filter query on the User model
    filteredUsers = await Addcandidate.find(filterQuery, {
      role: 1,
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      adharnumber: 1,
      jobopeningsid: 1,
      dateofbirth: 1,
      skill: 1,
      city: 1,
      experience: 1,
      qualification: 1,
      expectedsalary: 1,
      educationdetails: 1,
      joiningindays: 1,
      noticeperiod: 1,
      certification: 1,
      gender: 1,
      // interviewrounds: 1,
      screencandidate: 1,
      username: 1,
      password: 1,
      overallstatus: 1,
      roleback: 1,
      rolebackto: 1,
      rolebacktocompany: 1,
      rolebacktobranch: 1,
      status: 1,
      candidatestatus: 1,
      finalstatus: 1,
    });
    return res.status(200).json({ candidates: filteredUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//visitor candidate
exports.getAllCandidateCount = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {
    // excel = await Excel.find();
    candidates = await Visitor.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    candidates,
  });
});

// get Signle Addcandidate => /api/queue/:id
exports.getUniqueDataCandidates = catchAsyncErrors(async (req, res, next) => {
  const id = req.body.id;
  // let scandidates = await Addcandidate.find({
  let scandidates = await Visitor.find({
    unique: id
  }, {});

  return res.status(200).json({
    scandidates,
  });
});

exports.candidateScreening = async (req, res) => {
  try {
    let filteredUsers;
    const {
      age,
      to,
      fromexp,
      toexp,
      education,
      skill,
      location,
      role,
      educationcategory,
      educationsubcategory,
      expectedsalary,
      expectedsalaryto,
      joiningindays,
      certification,
      expectedsalaryvalidation,
    } = req.body;
    const filterQuery = {};

    filterQuery.role = { $eq: role };
    filterQuery.overallstatus = { $eq: "Applied" };
    if (age !== "" && to !== "") {
      filterQuery.age = { $gte: Number(age), $lte: Number(to) };
    }

    if (expectedsalary !== "") {
      if (expectedsalaryvalidation === "Less Than") {
        filterQuery.expectedsalary = { $lt: expectedsalary };
      } else if (expectedsalaryvalidation === "Less Than or Equal to") {
        filterQuery.expectedsalary = { $lte: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than") {
        filterQuery.expectedsalary = { $gt: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than or Equal to") {
        filterQuery.expectedsalary = { $gte: expectedsalary };
      } else if (expectedsalaryvalidation === "Equal to") {
        filterQuery.expectedsalary = { $eq: expectedsalary };
      } else if (expectedsalaryvalidation === "Between") {
        filterQuery.expectedsalary = {
          $gte: Number(expectedsalary),
          $lte: Number(expectedsalaryto),
        };
      }
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length === 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length !== 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
          specialization: { $in: education },
        },
      };
    }

    if (fromexp !== "" && toexp !== "") {
      filterQuery.experience = { $gte: Number(fromexp), $lte: Number(toexp) };
    }

    if (skill?.length !== 0) {
      filterQuery.skill = { $in: skill };
    }
    if (location?.length !== 0) {
      filterQuery.city = { $in: location };
    }

    if (certification?.length !== 0) {
      filterQuery.certification = { $in: certification };
    }
    if (joiningindays !== "") {
      filterQuery.joinbydays = { $eq: joiningindays };
    }

    const updateQuery = {
      $set: { screencandidate: "Screened", overallstatus: "Screened" },
    };

    filteredUsers = await Addcandidate.updateMany(filterQuery, updateQuery);

    let filteredUsersreturn = await Addcandidate.find(filterQuery, {
      role: 1,
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      adharnumber: 1,
      jobopeningsid: 1,
      dateofbirth: 1,
      skill: 1,
      city: 1,
      experience: 1,
      qualification: 1,
      expectedsalary: 1,
      educationdetails: 1,
      joiningindays: 1,
      noticeperiod: 1,
      certification: 1,
      gender: 1,
      interviewrounds: 1,
      screencandidate: 1,
      username: 1,
      password: 1,
      overallstatus: 1,
      roleback: 1,
      rolebackto: 1,
      rolebacktocompany: 1,
      rolebacktobranch: 1,
      status: 1,
      candidatestatus: 1,
      finalstatus: 1,
    });
    return res
      .status(200)
      .json({ message: "Updated successfully", filteredUsersreturn });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getcandidatesAllByRestricted = catchAsyncErrors(
  async (req, res, next) => {
    let candidates;
    try {
      candidates = await Addcandidate.find(
        {},
        {
          today: 1,
          expectedsalaryopts: 1,
          joiningbydaysopts: 1,
          role: 1,
          screencandidate: 1,
          candidatestatus: 1,
          prefix: 1,
          firstname: 1,
          lastname: 1,
          fullname: 1,
          email: 1,
          mobile: 1,
          whatsapp: 1,
          phonecheck: 1,
          adharnumber: 1,
          pannumber: 1,
          age: 1,
          jobopeningsid: 1,
          otherqualification: 1,
          skill: 1,
          dateofbirth: 1,
          street: 1,
          city: 1,
          state: 1,
          postalcode: 1,
          country: 1,
          experience: 1,
          fromexp: 1,
          toexp: 1,
          category: 1,
          subcategory: 1,
          qualification: 1,
          currentjobtitle: 1,
          currentemployer: 1,
          expectedsalary: 1,
          currentsalary: 1,
          skillset: 1,
          additionalinfo: 1,
          linkedinid: 1,
          status: 1,
          interviewdate: 1,
          time: 1,
          sourcecandidate: 1,
          source: 1,
          education: 1,
          educationdetails: 1,
          experiencedetails: 1,
          addedby: 1,
          updatedby: 1,
          createdAt: 1,
          domainexperience: 1,
          domainexperience: 1,
          joinbydays: 1,
          noticeperiod: 1,
          certification: 1,
          finalstatus: 1,
          gender: 1,
          username: 1,
          password: 1,
          overallstatus: 1,
          roleback: 1,
          rolebackto: 1,
          rolebacktocompany: 1,
          rolebacktobranch: 1,
          interviewrounds: 1,
          finalstatus: 1,
        }
      );
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    if (!candidates) {
      return next(new ErrorHandler("Addcandidate not found", 404));
    }
    return res.status(200).json({
      candidates,
    });
  }
);

exports.getcandidatesAll = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {
    candidates = await Addcandidate.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!candidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }
  return res.status(200).json({
    candidates,
  });
});
exports.getVisitorcandidatesAll = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {
    candidates = await Addcandidate.find({}, {
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      phonecheck: 1,
      adharnumber: 1,
      pannumber: 1,
      uploadedimage: 1, uploadedimagename: 1,
      age: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!candidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }
  return res.status(200).json({
    candidates,
  });
});

exports.getinterviewcandidatesAll = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {
    candidates = await Addcandidate.find(
      {},
      {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        interviewrounds: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
        createdAt: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!candidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }
  return res.status(200).json({
    candidates,
  });
});


exports.getAllCandidates = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {
    const { jobopeningsid } = req.body;

    let filter = {};

    // Set filter based on jobopeningsid
    if (jobopeningsid) {
      filter.jobopeningsid = jobopeningsid;
    }

    candidates = await Addcandidate.find(filter, {
      role: 1,
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      adharnumber: 1,
      jobopeningsid: 1,
      dateofbirth: 1,
      skill: 1,
      city: 1,
      experience: 1,
      qualification: 1,
      expectedsalary: 1,
      educationdetails: 1,
      joiningindays: 1,
      noticeperiod: 1,
      certification: 1,
      gender: 1,
      interviewrounds: 1,
      screencandidate: 1,
      username: 1,
      password: 1,
      overallstatus: 1,
      roleback: 1,
      rolebackto: 1,
      rolebacktocompany: 1,
      rolebacktobranch: 1,
      status: 1,
      candidatestatus: 1,
      finalstatus: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!candidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }

  const todaycandidate = candidates.filter((item, index) => {
    return (
      (item?.interviewrounds == undefined ||
        item?.interviewrounds?.length === 0) &&
      (item?.screencandidate === "" || item?.screencandidate == undefined) &&
      (item?.candidatestatus === "" || item?.candidatestatus == undefined) &&
      item?.overallstatus === "Applied"
    );
  });

  // Add serial numbers
  const allcandidateWithSerial = candidates.map((candidate, index) => {
    return { ...candidate.toObject(), serialNumber: index + 1 };
  });

  const todaycandidateWithSerial = todaycandidate.map((candidate, index) => {
    return { ...candidate.toObject(), serialNumber: index + 1 };
  });

  return res.status(200).json({
    count: candidates.length,
    allcandidate: allcandidateWithSerial,
    todaycandidates: todaycandidateWithSerial,
  });
});

exports.getTodayAllCandidates = catchAsyncErrors(async (req, res, next) => {
  const jobid = req.body.jobopeningsid;
  let todaycandidateWithSerial;
  try {
    todaycandidateWithSerial = await Addcandidate.find(
      {
        jobopeningsid: jobid,
        $and: [
          {
            $or: [
              { interviewrounds: { $exists: false } },
              { interviewrounds: { $size: 0 } },
            ],
          },
          {
            $or: [
              { screencandidate: { $exists: false } },
              { screencandidate: "" },
            ],
          },
          {
            $or: [
              { candidatestatus: { $exists: false } },
              { candidatestatus: "" },
            ],
          },
          { overallstatus: "Applied" },
        ],
      },
      {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        interviewrounds: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!todaycandidateWithSerial) {
    return next(new ErrorHandler("Candidate not found", 404));
  }


  return res.status(200).json({
    todaycandidates: todaycandidateWithSerial,
  });
});

exports.getActiveAllCandidates = catchAsyncErrors(async (req, res, next) => {
  const jobid = req.body.jobopeningsid;
  let candidates;
  try {
    candidates = await Addcandidate.find(
      {
        jobopeningsid: jobid,
        "interviewrounds.roundanswerstatus": { $nin: ["Rejected"] },
      },
      {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        interviewrounds: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!candidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }

  const todaycandidate = candidates.filter((item, index) => {
    return (
      (item?.interviewrounds == undefined ||
        item?.interviewrounds?.length === 0) &&
      (item?.screencandidate === "" || item?.screencandidate == undefined) &&
      (item?.candidatestatus === "" || item?.candidatestatus == undefined) &&
      item?.overallstatus === "Applied"
    );
  });

  // Add serial numbers
  const allcandidateWithSerial = candidates.map((candidate, index) => {
    return { ...candidate.toObject(), serialNumber: index + 1 };
  });

  const todaycandidateWithSerial = todaycandidate.map((candidate, index) => {
    return { ...candidate.toObject(), serialNumber: index + 1 };
  });

  return res.status(200).json({
    count: candidates.length,
    allcandidate: allcandidateWithSerial,
    todaycandidates: todaycandidateWithSerial,
  });
});

exports.updateCandidatesRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const ucandidatesrole = await Addcandidate.updateMany(
    { jobopeningsid: id },
    { $set: req.body },
    { new: true }
  );
  if (!ucandidatesrole) {
    return next(new ErrorHandler("Addcandidate Details not found", 404));
  }
  return res.status(200).json({ message: "Updates successfully" });
});

// Create new Addcandidate => /api/queue/new
exports.addCandidates = catchAsyncErrors(async (req, res, next) => {
  let acandidates = await Addcandidate.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Addcandidate => /api/queue/:id
exports.getSingleCandidates = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let scandidates = await Addcandidate.findById(id);
  if (!scandidates) {
    return next(new ErrorHandler("Addcandidate not found", 404));
  }
  return res.status(200).json({
    scandidates,
  });
});

// update Addcandidate by id => /api/queue/:id
exports.updateCandidates = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucandidates = await Addcandidate.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!ucandidates) {
    return next(new ErrorHandler("Addcandidate Details not found", 404));
  }
  return res.status(200).json({
    message: "Updates successfully",
    interviewrounds: ucandidates.interviewrounds,
    candidateemail: ucandidates.email,
  });
});

// delete Addcandidate by id => /api/queue/:id
exports.deleteCandidates = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dcandidates = await Addcandidate.findByIdAndRemove(id);
  if (!dcandidates) {
    return next(new ErrorHandler("Addcandidate Details not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

//Resume Management Pagination API's

exports.resumeManagementAllCandiate = catchAsyncErrors(
  async (req, res, next) => {
    try {
      let filteredUsers;
      const {
        age,
        to,
        fromexp,
        toexp,
        education,
        skill,
        location,
        educationcategory,
        educationsubcategory,
        expectedsalary,
        expectedsalaryto,
        joiningindays,
        certification,
        expectedsalaryvalidation,
        overallstatus,
        roleback,
        rolebackto,
        role,
        type,
      } = req.body;
      const filterQuery = {};

      if (role !== "") {
        filterQuery.role = { $eq: role };
      }

      if (age !== "" && to !== "") {
        filterQuery.age = { $gte: Number(age), $lte: Number(to) };
      }

      if (expectedsalary !== "") {
        if (expectedsalaryvalidation === "Less Than") {
          filterQuery.expectedsalary = { $lt: expectedsalary };
        } else if (expectedsalaryvalidation === "Less Than or Equal to") {
          filterQuery.expectedsalary = { $lte: expectedsalary };
        } else if (expectedsalaryvalidation === "Greater Than") {
          filterQuery.expectedsalary = { $gt: expectedsalary };
        } else if (expectedsalaryvalidation === "Greater Than or Equal to") {
          filterQuery.expectedsalary = { $gte: expectedsalary };
        } else if (expectedsalaryvalidation === "Equal to") {
          filterQuery.expectedsalary = { $eq: expectedsalary };
        } else if (expectedsalaryvalidation === "Between") {
          filterQuery.expectedsalary = {
            $gte: Number(expectedsalary),
            $lte: Number(expectedsalaryto),
          };
        }
      }

      if (
        educationcategory?.length !== 0 &&
        educationsubcategory?.length === 0 &&
        education?.length === 0
      ) {
        filterQuery.educationdetails = {
          $elemMatch: {
            categoryedu: { $in: educationcategory },
          },
        };
      }

      if (
        educationcategory?.length !== 0 &&
        educationsubcategory?.length !== 0 &&
        education?.length === 0
      ) {
        filterQuery.educationdetails = {
          $elemMatch: {
            categoryedu: { $in: educationcategory },
            subcategoryedu: { $in: educationsubcategory },
          },
        };
      }

      if (
        educationcategory?.length !== 0 &&
        educationsubcategory?.length !== 0 &&
        education?.length !== 0
      ) {
        filterQuery.educationdetails = {
          $elemMatch: {
            categoryedu: { $in: educationcategory },
            subcategoryedu: { $in: educationsubcategory },
            specialization: { $in: education },
          },
        };
      }

      if (fromexp !== "" && toexp !== "") {
        filterQuery.experience = { $gte: Number(fromexp), $lte: Number(toexp) };
      }

      if (skill?.length !== 0) {
        filterQuery.skill = { $in: skill };
      }
      if (location?.length !== 0) {
        filterQuery.city = { $in: location };
      }

      if (certification?.length !== 0) {
        filterQuery.certification = { $in: certification };
      }
      if (joiningindays !== "") {
        filterQuery.joinbydays = { $eq: joiningindays };
      }
      if (
        !overallstatus?.includes("ALL") &&
        overallstatus?.length > 0 &&
        type !== "Screening"
      ) {
        filterQuery.overallstatus = { $in: overallstatus };
      }
      if (type == "Screening") {
        filterQuery.overallstatus = { $in: "Screened" };
      }

      // Execute the filter query on the User model
      filteredUsers = await Addcandidate.find(filterQuery, {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        // interviewrounds: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
      });
      return res.status(200).json({ candidates: filteredUsers });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

exports.resumeManagementFilterWithPagination = async (req, res) => {
  try {
    let filteredUsers;
    let totalProjects, result, locationdropdown, roledropdown;
    const {
      age,
      to,
      fromexp,
      toexp,
      education,
      skill,
      location,
      educationcategory,
      educationsubcategory,
      expectedsalary,
      expectedsalaryto,
      joiningindays,
      certification,
      expectedsalaryvalidation,
      overallstatus,
      roleback,
      rolebackto,
      role,
      page,
      pageSize,
      type,
    } = req.body;
    const filterQuery = {};

    if (role !== "") {
      filterQuery.role = { $eq: role };
    }

    if (age !== "" && to !== "") {
      filterQuery.age = { $gte: Number(age), $lte: Number(to) };
    }

    if (expectedsalary !== "") {
      if (expectedsalaryvalidation === "Less Than") {
        filterQuery.expectedsalary = { $lt: expectedsalary };
      } else if (expectedsalaryvalidation === "Less Than or Equal to") {
        filterQuery.expectedsalary = { $lte: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than") {
        filterQuery.expectedsalary = { $gt: expectedsalary };
      } else if (expectedsalaryvalidation === "Greater Than or Equal to") {
        filterQuery.expectedsalary = { $gte: expectedsalary };
      } else if (expectedsalaryvalidation === "Equal to") {
        filterQuery.expectedsalary = { $eq: expectedsalary };
      } else if (expectedsalaryvalidation === "Between") {
        filterQuery.expectedsalary = {
          $gte: Number(expectedsalary),
          $lte: Number(expectedsalaryto),
        };
      }
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length === 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length === 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
        },
      };
    }

    if (
      educationcategory?.length !== 0 &&
      educationsubcategory?.length !== 0 &&
      education?.length !== 0
    ) {
      filterQuery.educationdetails = {
        $elemMatch: {
          categoryedu: { $in: educationcategory },
          subcategoryedu: { $in: educationsubcategory },
          specialization: { $in: education },
        },
      };
    }

    if (fromexp !== "" && toexp !== "") {
      filterQuery.experience = { $gte: Number(fromexp), $lte: Number(toexp) };
    }

    if (skill?.length !== 0) {
      filterQuery.skill = { $in: skill };
    }
    if (location?.length !== 0) {
      filterQuery.city = { $in: location };
    }

    if (certification?.length !== 0) {
      filterQuery.certification = { $in: certification };
    }
    if (joiningindays !== "") {
      filterQuery.joinbydays = { $eq: joiningindays };
    }
    if (
      !overallstatus?.includes("ALL") &&
      overallstatus?.length > 0 &&
      type !== "Screening"
    ) {
      filterQuery.overallstatus = { $in: overallstatus };
    }
    if (type === "Screening") {
      filterQuery.overallstatus = { $eq: "Applied" };
      const updateQuery = {
        $set: { screencandidate: "Screened", overallstatus: "Screened" },
      };

      await Addcandidate.updateMany(filterQuery, updateQuery);
      filterQuery.overallstatus = { $eq: "Screened" };
    }

    const anse = await Addcandidate.find(
      {},
      {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        interviewrounds: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
        createdAt: 1,
      }
    );

    const uniqueNames = new Set();
    anse.forEach((d) => {
      uniqueNames.add(d.city);
    });
    locationdropdown = [...uniqueNames]
      ?.map((city) => {
        if (city?.trim() !== "") {
          return {
            label: city,
            value: city,
          };
        }
        return null;
      })
      ?.filter(Boolean);

    const uniqueNamesRole = new Set();
    anse.forEach((d) => {
      uniqueNamesRole.add(d.role);
    });
    roledropdown = [...uniqueNamesRole]
      ?.map((role) => {
        if (role?.trim() !== "") {
          return {
            label: role,
            value: role,
          };
        }
        return null;
      })
      ?.filter(Boolean);

    totalProjects = await Addcandidate.countDocuments(filterQuery, {
      role: 1,
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      adharnumber: 1,
      jobopeningsid: 1,
      dateofbirth: 1,
      skill: 1,
      city: 1,
      experience: 1,
      qualification: 1,
      expectedsalary: 1,
      educationdetails: 1,
      joiningindays: 1,
      noticeperiod: 1,
      certification: 1,
      gender: 1,
      screencandidate: 1,
      username: 1,
      password: 1,
      overallstatus: 1,
      roleback: 1,
      rolebackto: 1,
      rolebacktocompany: 1,
      rolebacktobranch: 1,
      status: 1,
      candidatestatus: 1,
      finalstatus: 1,
    });

    // Execute the filter query on the User model
    allusers = await Addcandidate.find(filterQuery, {
      role: 1,
      prefix: 1,
      firstname: 1,
      lastname: 1,
      fullname: 1,
      email: 1,
      mobile: 1,
      whatsapp: 1,
      adharnumber: 1,
      jobopeningsid: 1,
      dateofbirth: 1,
      skill: 1,
      city: 1,
      experience: 1,
      qualification: 1,
      expectedsalary: 1,
      educationdetails: 1,
      joiningindays: 1,
      noticeperiod: 1,
      certification: 1,
      gender: 1,
      screencandidate: 1,
      username: 1,
      password: 1,
      overallstatus: 1,
      roleback: 1,
      rolebackto: 1,
      rolebacktocompany: 1,
      rolebacktobranch: 1,
      status: 1,
      candidatestatus: 1,
      finalstatus: 1,
    })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
      locationdropdown,
      roledropdown,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.skipedCandidates = async (req, res) => {
  try {
    let totalProjects, result, locationdropdown, roledropdown;
    const { page, pageSize } = req.body;

    totalProjects = await Addcandidate.countDocuments();

    // Execute the filter query on the User model
    allusers = await Addcandidate.find(
      {},
      {
        role: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        adharnumber: 1,
        jobopeningsid: 1,
        dateofbirth: 1,
        skill: 1,
        city: 1,
        experience: 1,
        qualification: 1,
        expectedsalary: 1,
        educationdetails: 1,
        joiningindays: 1,
        noticeperiod: 1,
        certification: 1,
        gender: 1,
        screencandidate: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        status: 1,
        candidatestatus: 1,
        finalstatus: 1,
      }
    )
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
      locationdropdown,
      roledropdown,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.candidateFileUpload = async (req, res) => {
  try {
    const { uniqueid, count, filename } = req.body;

    // Use the $elemMatch operator to find the document where candidatedatafile contains an object with the specified uniqueid
    let matchedCandidate = await Addcandidate.findOne(
      { candidatedatafile: { $elemMatch: { uniqueid: uniqueid } } },
      { candidatedatafile: 1, firstname: 1, lastname: 1 } // You can include other fields if needed
    );

    if (!matchedCandidate) {
      return next(new ErrorHandler("Candidate not found", 404));
    }

    let result;
    if (count === "all") {
      result = matchedCandidate.candidatedatafile.filter(
        (file) => file.linkname === "All Files Upload Link" && file.name === ""
      );
    } else if (count === "single") {
      result = matchedCandidate.candidatedatafile.filter(
        (file) => file.csfilname === filename && file.name === ""
      );
      if (result.length === 0) {
        return next(new ErrorHandler("File not found", 404));
      }
    } else {
      return next(new ErrorHandler("Invalid count value", 404));
    }

    return res.status(200).json({
      result,
      candidateid: matchedCandidate?._id,
      totalarray: matchedCandidate.candidatedatafile,
      firstname: matchedCandidate.firstname,
      lastname: matchedCandidate.lastname,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.canidateStatusFilter = async (req, res) => {
  try {
    const { overallstatus, checked } = req.body;

    let jobopeningDatas = await Jobopenings.find(
      {},
      {
        company: 1,
        branch: 1,
        floor: 1,
        recruitmentname: 1,
        designation: 1,
      }
    ).lean();

    let candidates = await Addcandidate.find(
      {},
      {
        today: 1,
        expectedsalaryopts: 1,
        joiningbydaysopts: 1,
        role: 1,
        screencandidate: 1,
        candidatestatus: 1,
        prefix: 1,
        firstname: 1,
        lastname: 1,
        fullname: 1,
        email: 1,
        mobile: 1,
        whatsapp: 1,
        phonecheck: 1,
        adharnumber: 1,
        pannumber: 1,
        age: 1,
        jobopeningsid: 1,
        otherqualification: 1,
        skill: 1,
        dateofbirth: 1,
        street: 1,
        city: 1,
        state: 1,
        postalcode: 1,
        country: 1,
        experience: 1,
        fromexp: 1,
        toexp: 1,
        category: 1,
        subcategory: 1,
        qualification: 1,
        currentjobtitle: 1,
        currentemployer: 1,
        expectedsalary: 1,
        currentsalary: 1,
        skillset: 1,
        additionalinfo: 1,
        linkedinid: 1,
        status: 1,
        interviewdate: 1,
        time: 1,
        sourcecandidate: 1,
        source: 1,
        education: 1,
        educationdetails: 1,
        experiencedetails: 1,
        addedby: 1,
        updatedby: 1,
        createdAt: 1,
        domainexperience: 1,
        domainexperience: 1,
        joinbydays: 1,
        noticeperiod: 1,
        certification: 1,
        finalstatus: 1,
        gender: 1,
        username: 1,
        password: 1,
        overallstatus: 1,
        roleback: 1,
        rolebackto: 1,
        rolebacktocompany: 1,
        rolebacktobranch: 1,
        interviewrounds: 1,
        finalstatus: 1,
        createdAt: 1,
      }
    ).lean();

    let getAssignedCandidates = candidates
      ?.filter((data) => {
        return data.role && data.role != "All";
      })
      ?.map((item) => {
        let foundData = jobopeningDatas?.find(
          (newItem) =>
            newItem._id?.toString() === item?.jobopeningsid?.toString()
        );

        let recentRound =
          item?.interviewrounds && item.interviewrounds.length > 0
            ? item.interviewrounds[item.interviewrounds.length - 1]
            : null;

        if (foundData) {
          return {
            ...item,
            company: foundData.company,
            branch: foundData.branch,
            floor: foundData.floor,
            recruitmentname: foundData.recruitmentname,
            designation: foundData.designation,
            uniquename: `${foundData.company}_${foundData.branch}_${foundData.floor}_${foundData.recruitmentname}`,
            recentroundname: recentRound?.roundname || "",
            recentroundstatus: recentRound?.roundstatus || "",
            roundanswerstatus: recentRound?.roundanswerstatus || "",
          };
        } else {
          return {
            ...item,
            company: "",
            branch: "",
            floor: "",
            recruitmentname: "",
            uniquename: "",
            designation: "",
            recentroundname: "",
            recentroundstatus: "",
            roundanswerstatus: "",
          };
        }
      })
      ?.filter((data) => {
        return data.company !== "";
      });

    let considerValue = getAssignedCandidates?.map((item) => {
      if (item.candidatestatus !== undefined && item.candidatestatus !== "") {
        return { ...item, considerValue: item.candidatestatus };
      } else if (item.interviewrounds && item.interviewrounds.length === 0) {
        return { ...item, considerValue: item.overallstatus };
      } else if (item.interviewrounds && item.interviewrounds.length == 1) {
        let status =
          item.interviewrounds[0].rounduserstatus !== undefined &&
          item.interviewrounds[0].rounduserstatus !== "";
        if (status) {
          const fieldToCheck = "rounduserstatus";
          const foundObject = item.interviewrounds?.find(
            (obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
          );
          return { ...item, considerValue: foundObject.rounduserstatus };
        } else {
          let status =
            item.interviewrounds[0].roundanswerstatus !== undefined &&
            item.interviewrounds[0].roundanswerstatus !== "";
          if (status) {
            const fieldToCheck = "roundanswerstatus";
            const foundObject = item.interviewrounds?.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject.roundanswerstatus };
          } else {
            return { ...item, considerValue: "" };
          }
        }
      } else {
        let status = item.interviewrounds?.some(
          (item1) =>
            item1.rounduserstatus !== undefined && item1.rounduserstatus !== ""
        );
        if (status) {
          const fieldToCheck = "rounduserstatus";
          const foundObject = item.interviewrounds?.find(
            (obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
          );
          return { ...item, considerValue: foundObject.rounduserstatus };
        } else {
          let status = item.interviewrounds?.some(
            (item1) =>
              item1.roundanswerstatus !== undefined &&
              item1.roundanswerstatus !== ""
          );
          if (status) {
            const fieldToCheck = "roundanswerstatus";
            const reversedInterviewRounds = item.interviewrounds
              ?.slice()
              ?.reverse();
            const foundObject = reversedInterviewRounds?.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject.roundanswerstatus };
          } else {
            return { ...item, considerValue: "" };
          }
        }
      }
    });

    let finalOutput = getAssignedCandidates?.map((data) => {
      let foundDataNew = considerValue?.find((item) => item._id == data._id);
      if (foundDataNew) {
        return {
          ...data,
          consolidatedvalue: foundDataNew.considerValue,
        };
      } else {
        return {
          ...data,
          consolidatedvalue: "",
        };
      }
    });

    let stats = overallstatus?.map((item) => {
      if (item == "Hired") {
        return "added";
      } else {
        return item?.toLowerCase()?.replace(" ", "");
      }
    });
    stats = stats.length == 0 ? "" : stats;

    let filteredData = finalOutput?.filter((entry) => {
      // const companyMatch = !comps || comps.includes(entry.company); // Check if company is included in the filter or if no company filter is applied
      // const branchMatch = !branchs || branchs.includes(entry.branch);
      // const desigsMatch = !desigs || desigs.includes(entry.designation);
      // const roundsMatch = !rounds || rounds.includes(entry.recentroundname);
      let statusMatch;
      if (checked) {
        statusMatch =
          !stats ||
          stats.includes(entry?.finalstatus?.toLowerCase().replace(" ", ""));
      } else {
        statusMatch =
          !stats ||
          stats.includes(
            entry?.consolidatedvalue?.toLowerCase().replace(" ", "")
          );
      }
      return (
        // companyMatch &&
        // branchMatch &&
        // desigsMatch &&
        // candsMatch &&
        // roundsMatch &&
        statusMatch
      );
    });

    return res.status(200).json({ candidates: filteredData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.checkCandidateEmptyFields = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the document by ID
    const document = await Addcandidate.findById(id).lean();

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const emptyFields = [];
    const emptyDocumentFields = [];

    const checkEmpty = (obj, prefix = "") => {
      for (const key in obj) {
        if (
          obj[key] === "" || // Check for empty string
          obj[key] === "undefined" || // Check for empty string
          obj[key] === undefined || // Check for undefined
          (Array.isArray(obj[key]) && obj[key].length === 0) || // Check for empty array
          (typeof obj[key] === "number" && obj[key] === 0) // Check for number equal to 0
        ) {
          emptyFields.push(prefix + key);
        } else if (Array.isArray(obj[key]) && key === "candidatedatafile") {
          // Special handling for candidatedatafile array
          if (obj[key].length === 0) {
            emptyFields.push(prefix + key);
          } else {
            obj[key].forEach((file) => {
              if (!file.uploadedby || !file.name) {
                // Push the candidatefilename into emptyFields if any field is empty
                emptyDocumentFields.push(prefix + file.candidatefilename);
              }
            });
          }
        } else if (key === "expectedsalary" && obj[key] === "0") {
          emptyFields.push(prefix + key);
        } else if (key === "sourcecandidate" && obj[key] === "Choose Source") {
          emptyFields.push(prefix + key);
        } else if (
          key === "expectedsalaryopts" &&
          obj[key] === "Please Select Expected Salary"
        ) {
          emptyFields.push(prefix + key);
        } else if (
          key === "joiningbydaysopts" &&
          obj[key] === "Please Select Joining By Days"
        ) {
          emptyFields.push(prefix + key);
        } else if (
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key]) &&
          obj[key] !== null
        ) {
          // Recursively check nested objects
          checkEmpty(obj[key], `${prefix}${key}.`);
        }
      }
    };

    checkEmpty(document);

    return res.status(200).json({
      message: "Check completed",
      emptyFields: emptyFields.length > 0 ? emptyFields : [],
      emptyDocumentFields:
        emptyDocumentFields.length > 0 ? emptyDocumentFields : [],
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getRejectedCandidates = catchAsyncErrors(async (req, res) => {
  try {
    const { jobopeningsid } = req.query;
    const rejectedCandidates = await Addcandidate.aggregate([
      {
        $match: { jobopeningsid: jobopeningsid }, // Replace with your filtering condition
      },
      {
        $addFields: {
          lastRound: { $arrayElemAt: ["$interviewrounds", -1] }, // Get the last element of the interviewrounds array
        },
      },
      {
        $match: {
          $or: [
            { finalstatus: "Rejected" },
            {
              $and: [
                { finalstatus: { $exists: false } },
                { "lastRound.roundanswerstatus": "Rejected" },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          role: 1,
          prefix: 1,
          firstname: 1,
          lastname: 1,
          fullname: 1,
          email: 1,
          mobile: 1,
          whatsapp: 1,
          adharnumber: 1,
          jobopeningsid: 1,
          dateofbirth: 1,
          skill: 1,
          city: 1,
          experience: 1,
          qualification: 1,
          expectedsalary: 1,
          educationdetails: 1,
          joiningindays: 1,
          noticeperiod: 1,
          certification: 1,
          gender: 1,
          username: 1,
          password: 1,
          overallstatus: 1,
          roleback: 1,
          rolebackto: 1,
          rolebacktocompany: 1,
          rolebacktobranch: 1,
          status: 1,
          candidatestatus: 1,
          finalstatus: 1,
          "lastRound.roundname": 1, // Extract roundname
          "lastRound.rescheduleafterreject": 1, // Extract rescheduleafterreject
          "lastRound._id": 1, // Extract lastround _id
        },
      },
    ]);

    res.status(200).json({ rejectedCandidates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.checkAllCandidatesEmptyFields = async (req, res) => {
  try {
    const { missingfield } = req.body;

    // Find all documents in the Addcandidate collection
    const documents = await Addcandidate.find({}).lean();

    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    const allEmptyField = [];
    const allEmptyDocumentFields = [];

    const checkEmpty = (obj, prefix = "") => {
      const emptyFields = [];
      const emptyDocumentFields = [];

      for (const key in obj) {
        if (
          obj[key] === "" || // Check for empty string
          obj[key] === "undefined" || // Check for "undefined" string
          obj[key] === undefined || // Check for undefined
          (Array.isArray(obj[key]) && obj[key].length === 0) || // Check for empty array
          (typeof obj[key] === "number" && obj[key] === 0) // Check for number equal to 0
        ) {
          emptyFields.push(prefix + key);
        } else if (Array.isArray(obj[key]) && key === "candidatedatafile") {
          // Special handling for candidatedatafile array
          if (obj[key].length === 0) {
            emptyFields.push(prefix + key);
          } else {
            obj[key].forEach((file) => {
              if (!file.uploadedby || !file.name) {
                // Push the candidatefilename into emptyDocumentFields if any field is empty
                emptyDocumentFields.push(prefix + file.candidatefilename);
              }
            });
          }
        } else if (key === "expectedsalary" && obj[key] === "0") {
          emptyFields.push(prefix + key);
        } else if (key === "sourcecandidate" && obj[key] === "Choose Source") {
          emptyFields.push(prefix + key);
        } else if (
          key === "expectedsalaryopts" &&
          obj[key] === "Please Select Expected Salary"
        ) {
          emptyFields.push(prefix + key);
        } else if (
          key === "joiningbydaysopts" &&
          obj[key] === "Please Select Joining By Days"
        ) {
          emptyFields.push(prefix + key);
        } else if (
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key]) &&
          obj[key] !== null
        ) {
          // Recursively check nested objects
          const nestedResult = checkEmpty(obj[key], `${prefix}${key}.`);
          emptyFields.push(...nestedResult.emptyFields);
          emptyDocumentFields.push(...nestedResult.emptyDocumentFields);
        }
      }

      return { emptyFields, emptyDocumentFields };
    };

    documents.forEach((document) => {
      const { emptyFields, emptyDocumentFields } = checkEmpty(document);

      // Filter emptyFields by checking against missingfield array
      const matchedFields = emptyFields.filter((field) =>
        missingfield.some((mf) => mf.actualvalue === field)
      );

      // Include both matched fields and all actual empty fields
      const matchedEmptyFields = [...new Set([...emptyFields, ...matchedFields])].filter(
        (fieldName) =>
          fieldName !== "_id" &&
          fieldName !== "__v" &&
          fieldName !== "rolebacktoid" &&
          fieldName !== 'addedby' &&
          fieldName !== 'updatedby' &&
          fieldName !== 'createdAt' &&
          fieldName !== 'rolebackto' &&
          fieldName !== 'roleback' &&
          fieldName !== 'company' &&
          fieldName !== 'branch' &&
          fieldName !== 'today' &&
          fieldName !== 'finalstatus' &&
          fieldName !== 'role' &&
          fieldName !== 'screencandidate' &&
          fieldName !== 'candidatestatus' &&
          fieldName !== 'prefix' &&
          fieldName !== 'firstname' &&
          fieldName !== 'lastname' &&
          fieldName !== 'fullname' &&
          fieldName !== 'email' &&
          fieldName !== 'mobile' &&
          fieldName !== 'phonecheck' &&
          fieldName !== 'jobopeningsid' &&
          fieldName !== 'otherqualification' &&
          fieldName !== 'fromexp' &&
          fieldName !== 'toexp' &&
          fieldName !== 'category' &&
          fieldName !== 'subcategory' &&
          fieldName !== 'qualification' &&
          fieldName !== 'currentsalary' &&
          fieldName !== 'status' &&
          fieldName !== 'source' &&
          fieldName !== 'resumefile' &&
          fieldName !== 'uploadedimagename' &&
          fieldName !== 'gender' &&
          fieldName !== 'files' &&
          fieldName !== 'username' &&
          fieldName !== 'coverlettertext' &&
          fieldName !== 'password' &&
          fieldName !== 'overallstatus' &&
          fieldName !== 'interviewrounds'
      );

      if (matchedEmptyFields.length > 0) {
        allEmptyField.push({
          _id: document._id,
          role: document.role,
          prefix: document.prefix,
          firstname: document.firstname,
          lastname: document.lastname,
          fullname: document.fullname,
          email: document.email,
          mobile: document.mobile,
          whatsapp: document.whatsapp,
          adharnumber: document.adharnumber,
          jobopeningsid: document.jobopeningsid,
          dateofbirth: document.dateofbirth,
          skill: document.skill,
          city: document.city,
          experience: document.experience,
          qualification: document.qualification,
          expectedsalary: document.expectedsalary,
          educationdetails: document.educationdetails,
          joiningindays: document.joiningindays,
          noticeperiod: document.noticeperiod,
          certification: document.certification,
          gender: document.gender,
          interviewrounds: document.interviewrounds,
          screencandidate: document.sourcecandidate,
          username: document.username,
          password: document.password,
          overallstatus: document.overallstatus,
          roleback: document.roleback,
          rolebackto: document.rolebackto,
          rolebacktocompany: document.rolebacktocompany,
          rolebacktobranch: document.rolebacktobranch,
          status: document.status,
          candidatestatus: document.candidatestatus,
          finalstatus: document.finalstatus,
          emptyFields: matchedEmptyFields,
          missingFields: matchedFields, // Show only matched fields
        });
      }

      const matchedEmptyDocumentFields = emptyDocumentFields.filter((field) =>
        missingfield.some((mf) => mf.actualvalue?.toLowerCase() === field)
      );

      if (matchedEmptyDocumentFields.length > 0) {
        allEmptyDocumentFields.push({
          documentId: document._id,
          emptyDocumentFields: matchedEmptyDocumentFields,
        });
      }
    });

    const allEmptyFields = allEmptyField?.filter((item) => missingfield?.some((val) => item.emptyFields?.includes(val.actualvalue)))

    console.log(missingfield)
    console.log(allEmptyFields.length)

    return res.status(200).json({
      message: "Check completed",
      allEmptyFields,
      allEmptyDocumentFields,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};



exports.getAllFieldNames = async (req, res) => {
  try {
    // Get the schema paths of the Addcandidate model
    const schemaPaths = Addcandidate.schema.paths;

    // Extract all field names
    const allFieldNames = Object.keys(schemaPaths)
      .filter(
        (fieldName) =>
          fieldName !== "_id" &&
          fieldName !== "__v" &&
          fieldName !== "rolebacktoid" &&
          fieldName !== 'addedby' &&
          fieldName !== 'updatedby' &&
          fieldName !== 'createdAt' &&
          fieldName !== 'rolebackto' &&
          fieldName !== 'roleback' &&
          fieldName !== 'company' &&
          fieldName !== 'branch' &&
          fieldName !== 'today' &&
          fieldName !== 'finalstatus' &&
          fieldName !== 'role' &&
          fieldName !== 'screencandidate' &&
          fieldName !== 'candidatestatus' &&
          fieldName !== 'prefix' &&
          fieldName !== 'firstname' &&
          fieldName !== 'lastname' &&
          fieldName !== 'fullname' &&
          fieldName !== 'email' &&
          fieldName !== 'mobile' &&
          fieldName !== 'phonecheck' &&
          fieldName !== 'jobopeningsid' &&
          fieldName !== 'otherqualification' &&
          fieldName !== 'fromexp' &&
          fieldName !== 'toexp' &&
          fieldName !== 'category' &&
          fieldName !== 'subcategory' &&
          fieldName !== 'qualification' &&
          fieldName !== 'currentsalary' &&
          fieldName !== 'status' &&
          fieldName !== 'source' &&
          fieldName !== 'resumefile' &&
          fieldName !== 'uploadedimagename' &&
          fieldName !== 'gender' &&
          fieldName !== 'files' &&
          fieldName !== 'username' &&
          fieldName !== 'coverlettertext' &&
          fieldName !== 'password' &&
          fieldName !== 'overallstatus' &&
          fieldName !== 'interviewrounds' &&
          fieldName !== 'education' &&
          fieldName !== 'domainexperience' &&
          fieldName !== 'domainexperienceestimation' &&
          fieldName !== 'experiencedetails' &&
          fieldName !== 'experience' &&
          fieldName !== 'experienceestimation'

      )
    // .map((fieldName) => fieldName.charAt(0).toUpperCase() + fieldName.slice(1));

    console.log(allFieldNames)
    return res.status(200).json({
      message: "Field names retrieved successfully",
      allFieldNames,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


