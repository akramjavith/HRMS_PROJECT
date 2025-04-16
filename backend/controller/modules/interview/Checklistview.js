const mongoose = require('mongoose');
const ChecklistVerificationMaster = require('../../../model/modules/interview/checklistverificationmaster');
const ChecklistType = require('../../../model/modules/interview/checklisttype');
const User = require('../../../model/login/auth');
const InterviewRound = require("../../../model/modules/interview/interviewroundorder");
const Candidate = require("../../../model/modules/recruitment/addcandidate");
const JobOpening = require('../../../model/modules/recruitment/jobopenings');
const Profile = require('../../../model/login/employeedocuments');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const MyChecklist = require('../../../model/modules/interview/Myinterviewchecklist');

const Applyleave = require('../../../model/modules/leave/applyleave');
const Permission = require("../../../model/modules/permission/permission");
//inports
const Holiday = require("../../../model/modules/setup/holidayModel");
const Attendance = require("../../../model/modules/attendance/attendance");
const moment = require("moment");

exports.fetchUnassignedCandidates = catchAsyncErrors(async (req, res) => {


  const { modulename, submodule, mainpage, subpage, subsubpage, aggregationPipeline } = req.body;
  try {

    const [checkVerificationData, checklistTypes] = await Promise.all([
      ChecklistVerificationMaster.find({}).lean(),
      ChecklistType.find({ module: modulename, submodule, mainpage, subpage, subsubpage }).lean()
    ]);

    const findCheckListData = checklistTypes.map(data => {
      const sourceData = checkVerificationData.find(item =>
        item.categoryname === data.category &&
        item.subcategoryname === data.subcategory &&
        item.checklisttype.includes(data.details)
      );

      if (sourceData) {
        return {
          ...data,
          checklisttype: sourceData.checklisttype,
          employee: sourceData.employee,
          categoryname: sourceData.categoryname,
          subcategoryname: sourceData.subcategoryname,
          uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`,
          group: {
            category: data.category,
            subcategory: data.subcategory,
            details: data.details,
            checklist: data.checklist,
            information: data.information,
          },
        };
      }
      return false;
    }).filter(Boolean);

    const uniqueCombinations = countUniqueCombinations(findCheckListData);

    const humanResourcesData = uniqueCombinations?.updatedArray?.filter((data) => {
      return data.modulename == modulename && data.submodule == submodule && data.mainpage == mainpage && data.subpage == subpage && data.subsubpage == subsubpage
    })




    const assignedEmployees = Array.from(new Set(humanResourcesData[0]?.relatedDatas?.flatMap(data => data.employee)));

    const toViewDatas = humanResourcesData.map(data => ({
      ...data,
      category: Array.from(new Set(humanResourcesData[0].relatedDatas.map(item => item.category))),
      subcategory: Array.from(new Set(humanResourcesData[0].relatedDatas.map(item => item.subcategory))),
      details: Array.from(new Set(humanResourcesData[0].relatedDatas.map(item => item.details))),
      groups: humanResourcesData[0].relatedDatas.map(item => ({ ...item.group, employee: item.employee })),
      information: humanResourcesData[0].information,
    }));

    if (mainpage === "Job Openings" && subpage === '' && subsubpage === "") {
      return res.json({
        assignedEmployees,
        toViewDatas,
      });
    }


    const createUsersPipeline = (matchCriteria) => [
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'employeedocuments',
          let: { userId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$commonid', '$$userId'] } } }
          ],
          as: 'profile'
        }
      },
      {
        $lookup: {
          from: 'attandances',
          let: { userId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$userid', '$$userId'] } } }
          ],
          as: 'attandances'
        }
      },
      {
        $unwind: { path: '$profile', preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          currentaddress: {
            $concat: [
              '$pdoorno', ', ', '$pstreet', ', ', '$parea', ', ', '$plandmark', ', ',
              '$ptaluk', ', ', '$ppost', ', ', '$ppincode', ', ', '$pcity', ', ',
              '$pstate', ', ', '$pcountry'
            ]
          },
          profileimage: { $ifNull: ['$profile.profileimage', ''] },
          groups: humanResourcesData[0]?.relatedDatas?.map(item => ({ ...item.group, employee: item.employee }))
        }
      },
      {
        $project: {
          _id: 1,
          name: 1, // Add necessary fields here
          currentaddress: 1,
          profileimage: 1,
          groups: 1,
          company: 1,
          empcode: 1,
          companyname: 1,
          team: 1,
          username: 1,
          unit: 1,
          branch: 1,
          department: 1,
          dob: 1,
          contactpersonal: 1,
          doj: 1,
          reportingto: 1,
          originalpassword: 1,
          email: 1,
          firstname: 1,
          lastname: 1,
          aadhar: 1,
          panno: 1,
          experience: 1,
          reasonname: 1,
          attandances: 1,
          reasondate: 1,
          relieveddetails: 1,
          rejoineddetails: 1,
          resonablestatus: 1
        }
      }
    ];

    let definedRule;

    switch (subsubpage) {
      case "Deactivate Employees List":
        definedRule = createUsersPipeline(aggregationPipeline);
        break;
      case "Rejoined Employee List":
        definedRule = createUsersPipeline(aggregationPipeline);
        break;
      case "Active Intern List":
        definedRule = createUsersPipeline(aggregationPipeline);
        break;
      case "Deactivate Intern List":
        definedRule = createUsersPipeline(aggregationPipeline);
        break;
      default:
        definedRule = createUsersPipeline(aggregationPipeline);
        break;
    }

    const configuredUsers = await User.aggregate(definedRule);
    res.json({
      sourceDatas: uniqueCombinations,
      assignedEmployees,
      toViewDatas,
      configuredUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});


const countUniqueCombinations = (data) => {
  let newData = data;

  const counts = {};
  let uniqueArray = [];
  data.forEach(item => {
    const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;

    if (!uniqueArray.includes(key)) {
      uniqueArray.push(key);
    }
    counts[key] = (counts[key] || 0) + 1;
  });

  const result = Object.keys(counts).map(key => {
    const [modulename, submodule, mainpage, subpage, subsubpage] = key.split('_');
    const relatedDatas = newData.filter(item => item.uniquename === key);

    return {
      modulename,
      submodule,
      mainpage,
      subpage,
      subsubpage,
      uniquename: key,
      count: counts[key],
      relatedDatas,
      _id: uniqueArray.indexOf(key),
    };
  });




  return { result, uniqueArray, updatedArray: result };
};

exports.fetchDataAndProcess = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  try {
    // Fetch data from MongoDB using Mongoose models
    const [interviewRoundData, candidateData, jobOpeningData, checkVerificationData, checklistTypeData, myChecklistData] = await Promise.all([
      InterviewRound.find().lean(),
      Candidate.find({}, {
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
        interviewrounds: 1,
        finalstatus: 1,
      }).lean(),
      JobOpening.find().lean(),
      ChecklistVerificationMaster.find().lean(),
      ChecklistType.find().lean(),
      MyChecklist.find().lean()
    ]);

    let interviewroundorder = interviewRoundData;

    let jobopeningDatas = jobOpeningData;

    let checkverfication = checkVerificationData;

    let checklistAll = checklistTypeData;

    const gotDatas = myChecklistData;

    let notCompletedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() !== "completed";
      let check = data?.groups?.some((item) => {
        if (item.checklist === "Attachments") {
          return (item.files === undefined || item.files === "");
        } else {
          return (item.data === undefined || item.data === "");
        }
      });
      return (checkFirst && check);
    }).filter((datas) => (datas.module === "Human Resources" && datas.submodule === "Recruitment" && datas.mainpage === "Job Openings"));

    let completedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() === "completed";
      let check = data?.groups?.every((item) => {
        if (item.checklist === "Attachments") {
          return (item.files !== undefined && item.files !== "");
        } else {
          return (item.data !== undefined && item.data !== "");
        }
      });
      return (checkFirst || check);
    }).filter((datas) => (datas.module === "Human Resources" && datas.submodule === "Recruitment" && datas.mainpage === "Job Openings"));



    let getAssignedCandidates = candidateData.filter((data) => {
      return data.role && data.role !== "All";
    }).map((item) => {
      let foundData = jobopeningDatas.find((newItem) => newItem._id == item.jobopeningsid);
      if (foundData) {
        return {
          ...item,
          company: foundData.company,
          branch: foundData.branch,
          floor: foundData.floor,
          recruitmentname: foundData.recruitmentname,
          designation: foundData.designation,
          uniquename: `${foundData.company}_${foundData.branch}_${foundData.floor}_${foundData.recruitmentname}`,
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
          roundanswerstatus: ""
        };
      }
    }).filter((data) => data.company !== "");

    let filteredWithInterviewRounds = getAssignedCandidates?.filter((data) => {
      let foundData = interviewroundorder.find((item) => item.designation === data.designation);
      if (foundData) {
        return data.interviewrounds && (data.interviewrounds.length === foundData.round.length) && data.interviewrounds[data.interviewrounds.length - 1].roundanswerstatus === "Selected";
      } else {
        return false;
      }
    });



    let findCheckListData = checklistAll?.map((data) => {
      let foundDataNew = checkverfication?.find((item) => (item.categoryname == data.category && item.subcategoryname == data.subcategory && item.checklisttype.includes(data.details)));

      if (foundDataNew) {
        return {
          ...data, checklisttype: foundDataNew.checklisttype, employee: foundDataNew.employee, categoryname: foundDataNew.categoryname, subcategoryname: foundDataNew.subcategoryname, uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`, assignedtime: foundDataNew?.createdAt, group: { category: data.category, subcategory: data.subcategory, details: data.details, checklist: data.checklist, information: data.information, employee: foundDataNew.employee, estimation: data.estimation, estimationtime: data.estimationtime, assignedtime: foundDataNew?.createdAt }
        }
      } else {
        return false;
      }
    }).filter((data) => (data !== false && data?.mainpage === "Job Openings"));



    function countUniqueCombinations(data) {
      const counts = {};
      let uniqueArray = [];
      data.forEach(item => {
        const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
        if (!uniqueArray.includes(key)) {
          uniqueArray.push(key);
        }
        counts[key] = (counts[key] || 0) + 1;
      });
      const result = Object.keys(counts).map(key => {
        const [modulename, submodule, mainpage, subpage, subsubpage] = key.split('_');
        return {
          modulename,
          submodule,
          mainpage,
          subpage,
          subsubpage,
          uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
          count: counts[key]
        };
      });

      let updatedArray = result.map((data, index) => {
        let foundDatas = findCheckListData
          .filter((item) => item.uniquename === data.uniquename);

        if (foundDatas) {
          return {
            ...data,
            relatedDatas: foundDatas,
            _id: index
          };
        }
      });

      return { result, uniqueArray, updatedArray };
    }

    let showValues = countUniqueCombinations(findCheckListData);

    let toViewDatas = filteredWithInterviewRounds.map((data) => {
      return {
        ...data,
        category: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.category))),
        subcategory: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.subcategory))),
        details: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.details))),
        groups: showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.group).flat(),
        information: showValues?.updatedArray[0]?.information,
        assignedtime: showValues?.updatedArray[0]?.relatedDatas[0]?.assignedtime
      };
    });

    let derivedDatas = toViewDatas?.filter((item) => {
      return !completedCheckList.find((itemnew) => item?._id.toString() === itemnew.commonid);
    }).map((data) => {

      let check = notCompletedCheckList.find((itemnew) => itemnew.commonid === data?._id.toString());
      return {
        ...data,
        groups: check?.groups || data.groups
      };
    }).filter(item =>
      assignbranch.some(branch =>
        branch.company === item.company &&
        branch.branch === item.branch
      )
    )

    return res.status(200).json({ derivedDatas, toViewDatas, notCompletedCheckList, completedCheckList });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Error fetching or processing data', 500));
  }
});


exports.fetchUserDatas = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch data from MongoDB using Mongoose models
    let Users = await User.find({}, {
      empcode: 1,
      companyname: 1,
      email: 1,
      firstname: 1,
      lastname: 1,
      aadhar: 1,
      panno: 1,
      originalpassword: 1,
      username: 1,
      dob: 1,
      contactpersonal: 1,

      pdoorno: 1,
      pstreet: 1,
      parea: 1,
      plandmark: 1,
      ptaluk: 1,
      ppost: 1,
      ppincode: 1,
      pcity: 1,
      pstate: 1,
      pcountry: 1,

      _id: 1,
      relieveddetails: 1,
      rejoineddetails: 1,


    })

    return res.status(200).json({ Users });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Error fetching or processing data', 500));
  }
});


exports.fetchLeaveDatas = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  try {

    let applyleaves;
    let users;

    users = await User.find(
      {

        resonablestatus: {
          $in: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        },
      },
      {

        companyname: 1,
      }
    ).lean();

    let companyname = users.map(d => d.companyname)
    applyleaves = await Applyleave.find({ employeename: { $nin: companyname }, status: "Applied" }, {}).lean();
    // Fetch data from MongoDB using Mongoose models
    const [checkVerificationData, checklistTypeData, myChecklistData] = await Promise.all([

      ChecklistVerificationMaster.find().lean(),
      ChecklistType.find().lean(),
      MyChecklist.find().lean()
    ]);

    let checkverfication = checkVerificationData;

    let checklistAll = checklistTypeData;

    const gotDatas = myChecklistData;

    let notCompletedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() !== "completed";
      let check = data?.groups?.some((item) => {
        if (item.checklist === "Attachments") {
          return (item.files === undefined || item.files === "");
        } else {
          return (item.data === undefined || item.data === "");
        }
      });
      return (checkFirst && check);
    }).filter((datas) => (datas.module === "Leave&Permission" && datas.submodule === "Leave" && datas.mainpage === "Apply Leave"));

    let completedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() === "completed";
      return (checkFirst);
    }).filter((datas) => (datas.module === "Leave&Permission" && datas.submodule === "Leave" && datas.mainpage === "Apply Leave"));







    let findCheckListData = checklistAll?.map((data) => {
      let foundDataNew = checkverfication?.find((item) => (item.categoryname == data.category && item.subcategoryname == data.subcategory && item.checklisttype.includes(data.details)));

      if (foundDataNew) {
        return {
          ...data, checklisttype: foundDataNew.checklisttype, employee: foundDataNew.employee, categoryname: foundDataNew.categoryname, subcategoryname: foundDataNew.subcategoryname, uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`, assignedtime: foundDataNew?.createdAt, group: { category: data.category, subcategory: data.subcategory, details: data.details, checklist: data.checklist, information: data.information, employee: foundDataNew.employee, estimation: data.estimation, estimationtime: data.estimationtime, assignedtime: foundDataNew?.createdAt }
        }
      } else {
        return false;
      }
    }).filter((data) => (data !== false && data?.mainpage === "Apply Leave"));



    function countUniqueCombinations(data) {
      const counts = {};
      let uniqueArray = [];
      data.forEach(item => {
        const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
        if (!uniqueArray.includes(key)) {
          uniqueArray.push(key);
        }
        counts[key] = (counts[key] || 0) + 1;
      });
      const result = Object.keys(counts).map(key => {
        const [modulename, submodule, mainpage, subpage, subsubpage] = key.split('_');
        return {
          modulename,
          submodule,
          mainpage,
          subpage,
          subsubpage,
          uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
          count: counts[key]
        };
      });

      let updatedArray = result.map((data, index) => {
        let foundDatas = findCheckListData
          .filter((item) => item.uniquename === data.uniquename);

        if (foundDatas) {
          return {
            ...data,
            relatedDatas: foundDatas,
            _id: index
          };
        }
      });

      return { result, uniqueArray, updatedArray };
    }

    let showValues = countUniqueCombinations(findCheckListData);

    let toViewDatas = applyleaves.map((data) => {
      return {
        ...data,
        category: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.category))),
        subcategory: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.subcategory))),
        details: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.details))),
        groups: showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.group).flat(),
        information: showValues?.updatedArray[0]?.information,
        assignedtime: showValues?.updatedArray[0]?.relatedDatas[0]?.assignedtime
      };
    });

    let derivedDatas = toViewDatas?.filter((item) => {
      return !completedCheckList.find((itemnew) => item?._id?.toString() === itemnew.commonid);
    }).map((data) => {

      let check = notCompletedCheckList.find((itemnew) => itemnew?.commonid === data?._id?.toString());
      return {
        ...data,
        groups: check?.groups || data.groups
      };
    }).filter(item =>
      assignbranch.some(branch =>
        item?.company?.includes(branch.company) &&
        item?.branch?.includes(branch.branch) &&
        item?.unit?.includes(branch.unit)
      )
    )

    return res.status(200).json({ derivedDatas, toViewDatas });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Error fetching or processing data', 500));
  }
});


exports.fetchPermissionDatas = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  try {

    let permissions;
    let users;

    users = await User.find(
      {

        resonablestatus: {
          $in: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        },
      },
      {

        companyname: 1,
      }
    ).lean();
    let companyname = users.map(d => d.companyname)
    permissions = await Permission.find({ employeename: { $nin: companyname }, status: "Applied" }, {}).lean();
    // Fetch data from MongoDB using Mongoose models
    const [checkVerificationData, checklistTypeData, myChecklistData] = await Promise.all([

      ChecklistVerificationMaster.find().lean(),
      ChecklistType.find().lean(),
      MyChecklist.find().lean()
    ]);

    let checkverfication = checkVerificationData;

    let checklistAll = checklistTypeData;

    const gotDatas = myChecklistData;

    let notCompletedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() !== "completed";
      let check = data?.groups?.some((item) => {
        if (item.checklist === "Attachments") {
          return (item.files === undefined || item.files === "");
        } else {
          return (item.data === undefined || item.data === "");
        }
      });
      return (checkFirst && check);
    }).filter((datas) => (datas.module === "Leave&Permission" && datas.submodule === "Permission" && datas.mainpage === "Apply Permission"));

    let completedCheckList = gotDatas?.filter((data) => {
      let checkFirst = data?.status?.toLowerCase() === "completed";
      return (checkFirst);
    }).filter((datas) => (datas.module === "Leave&Permission" && datas.submodule === "Permission" && datas.mainpage === "Apply Permission"));







    let findCheckListData = checklistAll?.map((data) => {
      let foundDataNew = checkverfication?.find((item) => (item.categoryname == data.category && item.subcategoryname == data.subcategory && item.checklisttype.includes(data.details)));

      if (foundDataNew) {
        return {
          ...data, checklisttype: foundDataNew.checklisttype, employee: foundDataNew.employee, categoryname: foundDataNew.categoryname, subcategoryname: foundDataNew.subcategoryname, uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`, assignedtime: foundDataNew?.createdAt, group: { category: data.category, subcategory: data.subcategory, details: data.details, checklist: data.checklist, information: data.information, employee: foundDataNew.employee, estimation: data.estimation, estimationtime: data.estimationtime, assignedtime: foundDataNew?.createdAt }
        }
      } else {
        return false;
      }
    }).filter((data) => (data !== false && data?.mainpage === "Apply Permission"));



    function countUniqueCombinations(data) {
      const counts = {};
      let uniqueArray = [];
      data.forEach(item => {
        const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
        if (!uniqueArray.includes(key)) {
          uniqueArray.push(key);
        }
        counts[key] = (counts[key] || 0) + 1;
      });
      const result = Object.keys(counts).map(key => {
        const [modulename, submodule, mainpage, subpage, subsubpage] = key.split('_');
        return {
          modulename,
          submodule,
          mainpage,
          subpage,
          subsubpage,
          uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
          count: counts[key]
        };
      });

      let updatedArray = result.map((data, index) => {
        let foundDatas = findCheckListData
          .filter((item) => item.uniquename === data.uniquename);

        if (foundDatas) {
          return {
            ...data,
            relatedDatas: foundDatas,
            _id: index
          };
        }
      });

      return { result, uniqueArray, updatedArray };
    }

    let showValues = countUniqueCombinations(findCheckListData);

    let toViewDatas = permissions.map((data) => {
      return {
        ...data,
        category: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.category))),
        subcategory: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.subcategory))),
        details: Array.from(new Set(showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.details))),
        groups: showValues?.updatedArray[0]?.relatedDatas?.map((item) => item.group).flat(),
        information: showValues?.updatedArray[0]?.information,
        assignedtime: showValues?.updatedArray[0]?.relatedDatas[0]?.assignedtime
      };
    });

    let derivedDatas = toViewDatas?.filter((item) => {
      return !completedCheckList.find((itemnew) => item?._id?.toString() === itemnew.commonid);
    }).map((data) => {

      let check = notCompletedCheckList.find((itemnew) => itemnew?.commonid === data?._id?.toString());
      return {
        ...data,
        groups: check?.groups || data.groups
      };
    }).filter(item =>
      assignbranch.some(branch =>
        branch.company === item.companyname &&
        branch.branch === item.branch &&
        branch.unit === item.unit
      )
    )


    return res.status(200).json({ derivedDatas, toViewDatas });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Error fetching or processing data', 500));
  }
});


exports.getCandidateById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Extract ID from request parameters
  let candidate;
  const projection = {
    fullname: 1,
    email: 1,
    candidatedatafile: 1,
    _id: 1
  };
  try {
    candidate = await Candidate.findById(id).select(projection);
  } catch (err) {
    return next(new ErrorHandler("Invalid ID format", 400)); // Handle invalid ID format
  }

  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404)); // Handle candidate not found
  }

  return res.status(200).json({
    candidate,
  });
});

//function
exports.fetchPendingLongAbsentCheckList = catchAsyncErrors(
  async (req, res, next) => {
    try {
      let filteredUsers;

      const { assignbranch } = req.body;

      const branchFilter = assignbranch.map((branchObj) => ({
        company: branchObj.company,
        branch: branchObj.branch,
        unit: branchObj.unit,
      }));
      const today = moment();
      const pastThreeDaysISO = [
        today.clone().format("YYYY-MM-DD"),
        today.clone().subtract(1, "days").format("YYYY-MM-DD"),
        today.clone().subtract(2, "days").format("YYYY-MM-DD"),
        today.clone().subtract(3, "days").format("YYYY-MM-DD"),
      ];

      const filterQuery = {
        $and: [
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
          },
          {
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
          },
          {
            doj: {
              $nin: pastThreeDaysISO, // Exclude users whose date of joining falls in the last three days
            },
          },
          {
            $or: branchFilter,
          },
        ],
      };

      let result = await User.find(filterQuery, {
        resonablestatus: 1,
        company: 1,
        branch: 1,
        unit: 1,
        team: 1,
        empcode: 1,
        companyname: 1,
        longleaveabsentaprooveddate: 1,
        boardingLog: 1, // Include boardingLog in the result

        username: 1,
        originalpassword: 1,
        firstname: 1,
        lastname: 1,
        aadhar: 1,
        panno: 1,
        dob: 1,
        doj: 1,
        pstreet: 1,
        pcity: 1,
        ppincode: 1,
        pstate: 1,
        pcountry: 1,
        relieveddetails: 1,
        rejoineddetails: 1,
      }).lean();

      filteredUsers = result;

      const pastThreeAttendaysDays = [
        today.clone().format("DD-MM-YYYY"),
        today.clone().subtract(1, "days").format("DD-MM-YYYY"),
        today.clone().subtract(2, "days").format("DD-MM-YYYY"),
        today.clone().subtract(3, "days").format("DD-MM-YYYY"),
      ];
      const pastThreeLeaveDays = [
        today.clone().format("DD/MM/YYYY"),
        today.clone().subtract(1, "days").format("DD/MM/YYYY"),
        today.clone().subtract(2, "days").format("DD/MM/YYYY"),
        today.clone().subtract(3, "days").format("DD/MM/YYYY"),
      ];

      const [attendance, allLeaveStatus, holidays] = await Promise.all([
        Attendance.find(
          {
            date: {
              $in: pastThreeAttendaysDays,
            },
          },
          { date: 1, userid: 1 }
        ).lean(),

        Applyleave.find(
          {
            date: { $in: pastThreeLeaveDays },
          },
          { employeename: 1, employeeid: 1, date: 1 }
        ).lean(),

        Holiday.find(
          {
            date: { $in: pastThreeDaysISO },
          },
          {
            date: 1,
            employee: 1,
            company: 1,
            applicablefor: 1,
            unit: 1,
            team: 1,
          }
        ).lean(),
      ]);

      const attendanceMap = attendance.reduce((acc, item) => {
        const userId = item.userid.toString();
        const date = moment(item.date, "DD-MM-YYYY").format("DD/MM/YYYY");
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(date);
        return acc;
      }, {});

      const leaveMap = allLeaveStatus.reduce((acc, item) => {
        const userKey = `${item.employeeid}_${item.employeename}`;
        const leaveDates = item.date.map((date) =>
          moment(date, "DD/MM/YYYY").format("DD/MM/YYYY")
        );
        if (!acc[userKey]) {
          acc[userKey] = [];
        }
        acc[userKey].push(...leaveDates);
        return acc;
      }, {});

      const employeeMatchesUser = (user, holiday) => {
        return (
          holiday.company.includes(user.company) &&
          holiday.applicablefor.includes(user.branch) &&
          holiday.unit.includes(user.unit) &&
          holiday.team.includes(user.team) &&
          (holiday.employee.includes(user.companyname) ||
            holiday.employee.includes("ALL"))
        );
      };

      const holidayMap = holidays.reduce((acc, item) => {
        const date = moment(item.date).format("DD/MM/YYYY");

        filteredUsers.forEach((user) => {
          if (employeeMatchesUser(user, item)) {
            if (!acc[user.empcode]) {
              acc[user.empcode] = [];
            }
            acc[user.empcode].push(date);
          }
        });

        return acc;
      }, {});

      const checkStatusForPast3Days = (
        userId,
        empcode,
        employeename,
        weekOffDays
      ) => {
        const userKey = `${empcode}_${employeename}`;
        let absentDays = 0;
        let leaveDays = 0;
        let holidayDays = 0;

        for (let date of pastThreeLeaveDays) {
          // const dayOfWeek = moment(date, "DD/MM/YYYY").format("dddd"); // Get day of the week

          // if (weekOffDays.includes(dayOfWeek)) {
          //   continue; // Skip week off days
          // }

          if (attendanceMap[userId] && attendanceMap[userId].includes(date)) {
            continue; // User was present on this date
          } else if (leaveMap[userKey] && leaveMap[userKey].includes(date)) {
            leaveDays++; // User was on leave on this date
          } else if (
            holidayMap[empcode] &&
            holidayMap[empcode].includes(date)
          ) {
            holidayDays++; // Holiday on this date
          } else {
            absentDays++; // User was absent on this date
          }
        }

        let status = null;
        if (absentDays >= 4) {
          status = "Long Absent";
        } else if (leaveDays >= 4) {
          status = "Long Leave";
        }

        return { status, absentDays, leaveDays, holidayDays };
      };

      const determineStatus = (attendanceStatus) => {
        return attendanceStatus ? attendanceStatus : null;
      };

      const enrichedLeaveAttendanceUsers = filteredUsers
        ?.map((user) => {
          const userId = user._id.toString();

          let weekOffDays = [];
          if (user.boardingLog && user.boardingLog.length > 0) {
            const lastBoardingLog =
              user.boardingLog[user.boardingLog.length - 1];
            weekOffDays = lastBoardingLog.weekoff || [];
          }

          const { status, absentDays, leaveDays } = checkStatusForPast3Days(
            userId,
            user.empcode,
            user.companyname,
            weekOffDays
          );

          return {
            ...user,
            attendanceStatus: !!status,
            noticePeriodStatus: false,
            livestatus: status ? false : null,
            userstatus: determineStatus(status),
            longAbsentCount: absentDays, // Long absent count
            longLeaveCount: leaveDays, // Long leave count
          };
        })
        .filter((user) => user.userstatus && user.userstatus !== "Long Leave"); // Filter out users without attendance status

      // Fetch data from MongoDB using Mongoose models
      const [checkVerificationData, checklistTypeData, myChecklistData] =
        await Promise.all([
          ChecklistVerificationMaster.find().lean(),
          ChecklistType.find().lean(),
          MyChecklist.find().lean(),
        ]);

      let checkverfication = checkVerificationData;

      let checklistAll = checklistTypeData;

      const gotDatas = myChecklistData;

      let notCompletedCheckList = gotDatas
        ?.filter((data) => {
          let checkFirst = data?.status?.toLowerCase() !== "completed";
          let check = data?.groups?.some((item) => {
            if (item.checklist === "Attachments") {
              return item.files === undefined || item.files === "";
            } else {
              return item.data === undefined || item.data === "";
            }
          });
          return checkFirst && check;
        })
        .filter(
          (datas) =>
            datas.module == "Human Resources" &&
            datas.submodule == "HR" &&
            datas.mainpage == "Employee" &&
            datas.subpage == "Employee Status Details" &&
            datas.subsubpage == "Long Absent Restriction List"
        );

      let completedCheckList = gotDatas
        ?.filter((data) => {
          let checkFirst = data?.status?.toLowerCase() === "completed";
          let check = data?.groups?.every((item) => {
            if (item.checklist === "Attachments") {
              return item.files !== undefined && item.files !== "";
            } else {
              return item.data !== undefined && item.data !== "";
            }
          });
          return checkFirst || check;
        })
        .filter(
          (datas) =>
            datas.module == "Human Resources" &&
            datas.submodule == "HR" &&
            datas.mainpage == "Employee" &&
            datas.subpage == "Employee Status Details" &&
            datas.subsubpage == "Long Absent Restriction List"
        );

      let findCheckListData = checklistAll
        ?.map((data) => {
          let foundDataNew = checkverfication?.find(
            (item) =>
              item.categoryname == data.category &&
              item.subcategoryname == data.subcategory &&
              item.checklisttype.includes(data.details)
          );

          if (foundDataNew) {
            return {
              ...data,
              checklisttype: foundDataNew.checklisttype,
              employee: foundDataNew.employee,
              categoryname: foundDataNew.categoryname,
              subcategoryname: foundDataNew.subcategoryname,
              uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`,
              assignedtime: foundDataNew?.createdAt,
              group: {
                category: data.category,
                subcategory: data.subcategory,
                details: data.details,
                checklist: data.checklist,
                information: data.information,
                employee: foundDataNew.employee,
                estimation: data.estimation,
                estimationtime: data.estimationtime,
                assignedtime: foundDataNew?.createdAt,
              },
            };
          } else {
            return false;
          }
        })
        .filter(
          (data) =>
            data !== false &&
            data?.subsubpage === "Long Absent Restriction List"
        );

      function countUniqueCombinations(data) {
        const counts = {};
        let uniqueArray = [];
        data.forEach((item) => {
          const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
          if (!uniqueArray.includes(key)) {
            uniqueArray.push(key);
          }
          counts[key] = (counts[key] || 0) + 1;
        });
        const result = Object.keys(counts).map((key) => {
          const [modulename, submodule, mainpage, subpage, subsubpage] =
            key.split("_");
          return {
            modulename,
            submodule,
            mainpage,
            subpage,
            subsubpage,
            uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
            count: counts[key],
          };
        });

        let updatedArray = result.map((data, index) => {
          let foundDatas = findCheckListData.filter(
            (item) => item.uniquename === data.uniquename
          );

          if (foundDatas) {
            return {
              ...data,
              relatedDatas: foundDatas,
              _id: index,
            };
          }
        });

        return { result, uniqueArray, updatedArray };
      }

      let showValues = countUniqueCombinations(findCheckListData);

      let toViewDatas = enrichedLeaveAttendanceUsers.map((data) => {
        return {
          ...data,
          category: Array.from(
            new Set(
              showValues?.updatedArray[0]?.relatedDatas?.map(
                (item) => item.category
              )
            )
          ),
          subcategory: Array.from(
            new Set(
              showValues?.updatedArray[0]?.relatedDatas?.map(
                (item) => item.subcategory
              )
            )
          ),
          details: Array.from(
            new Set(
              showValues?.updatedArray[0]?.relatedDatas?.map(
                (item) => item.details
              )
            )
          ),
          groups: showValues?.updatedArray[0]?.relatedDatas
            ?.map((item) => item.group)
            .flat(),
          information: showValues?.updatedArray[0]?.information,
          assignedtime:
            showValues?.updatedArray[0]?.relatedDatas[0]?.assignedtime,
        };
      });

      let derivedDatas = toViewDatas
        ?.filter((item) => {
          return !completedCheckList.find(
            (itemnew) => item?._id?.toString() === itemnew.commonid
          );
        })
        .map((data) => {
          let check = notCompletedCheckList.find(
            (itemnew) => itemnew?.commonid === data?._id?.toString()
          );
          return {
            ...data,
            groups: check?.groups || data.groups,
          };
        });
      return res.status(200).json({ derivedDatas, toViewDatas });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Error fetching or processing data", 500));
    }
  }
);
