const Employeeasset = require("../../../model/modules/account/employeeassetdistribution");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");
const Hirerarchi = require('../../../model/modules/setup/hierarchy');
const Designation = require("../../../model/modules/designation");
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

//get All Employeeasset =>/api/Employeeasset
exports.getAllEmployeeasset = catchAsyncErrors(async (req, res, next) => {
  let employeeassets;
  try {
    employeeassets = await Employeeasset.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!employeeassets) {
    return next(new ErrorHandler("Employeeasset not found!", 404));
  }
  return res.status(200).json({
    employeeassets,
  });
});

// exports.getAllEmployeeassetAccess = catchAsyncErrors(async (req, res, next) => {
//   let employeeassets;
//   try {
//     const { assignbranch } = req.body;
//     let filterQuery = {};
//     // Construct the filter query based on the assignbranch array
//     const branchFilter = assignbranch.map((branchObj) => ({
//       branch: branchObj.branch,
//       company: branchObj.company,
//       unit: branchObj.unit,
//     }));
//     const branchFilterTo = assignbranch.map((branchObj) => ({
//       branchto: branchObj.branch,
//       companyto: branchObj.company,
//       unitto: branchObj.unit,
//     }));

//     if (branchFilter.length > 0 || branchFilterTo.length > 0) {
//       filterQuery = {
//         $or: [...branchFilter, ...branchFilterTo],
//       };
//     }
//     employeeassets = await Employeeasset.find(filterQuery);
//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }
//   if (!employeeassets) {
//     return next(new ErrorHandler("Employeeasset not found!", 404));
//   }
//   return res.status(200).json({
//     employeeassets,
//   });
// });


exports.getAllEmployeeassetAccess = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

  let query = {};
  // Construct the filter query based on the assignbranch array
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

  query = { $or: [...branchFilter, ...branchFilterTo] };

  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));
  const branchFilterToOverall = assignbranch.map((branchObj) => ({
    branchto: branchObj.branch,
    companyto: branchObj.company,
    unitto: branchObj.unit,
  }));

  queryoverall = { $or: [...branchFilterOverall, ...branchFilterToOverall] };

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      console.log(filter, "filter")
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        if (filter.column == "assigndate") {
          const [day, month, year] = filter.value.split("/")
          let formattedValue = `${year}-${month}-${day}`
          conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
        }
        else {

          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      }
    });
  }

  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => {

      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }
      return new RegExp(term, "i");
    });
    // console.log(regexTerms, "regexTerms")
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { company: regex },
        { branch: regex },
        { unit: regex },
        { floor: regex },
        { area: regex },
        { location: regex },
        { assetmaterial: regex },
        { assetmaterialcode: regex },
        { subcomponents: regex },
        { assigntime: regex },
        { assigndate: regex },
        { companyto: regex },
        { branchto: regex },
        { unitto: regex },
        { teamto: regex },
        { employeenameto: regex },
      ],

    }));
    // console.log(searchQuery, "searchQuery")
    query = {
      $and: [

        { $or: [...branchFilterOverall, ...branchFilterToOverall] },

        ...orConditions,
      ],
    };
  }


  // console.log(query, "query")

  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  // console.log(conditions, "conditions")
  try {

    const totalProjects = await Employeeasset.countDocuments(query);

    const totalProjectsData = await Employeeasset.find(queryoverall);

    const result = await Employeeasset.find(query)
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    // console.log(result.length, 'result')
    res.status(200).json({
      totalProjects,
      totalProjectsData,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//create new Employeeasset => /api/Employeeasset/new
exports.addEmployeeasset = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aEmployeeasset = await Employeeasset.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Employeeasset => /api/Employeeasset/:id
exports.getSingleEmployeeasset = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let semployeeasset = await Employeeasset.findById(id);
  if (!semployeeasset) {
    return next(new ErrorHandler("Employeeasset not found", 404));
  }
  return res.status(200).json({
    semployeeasset,
  });
});

//update Employeeasset by id => /api/Employeeasset/:id
exports.updateEmployeeasset = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uemployeeasset = await Employeeasset.findByIdAndUpdate(id, req.body);
  if (!uemployeeasset) {
    return next(new ErrorHandler("Employeeasset not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Employeeasset by id => /api/Employeeasset/:id
exports.deleteEmployeeasset = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let demployeeasset = await Employeeasset.findByIdAndRemove(id);
  if (!demployeeasset) {
    return next(new ErrorHandler("Employeeasset not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllEmployeeassetAccessHome = catchAsyncErrors(async (req, res, next) => {
  let employeeassets;
  try {


    employeeassets = await Employeeasset.countDocuments();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!employeeassets) {
    return next(new ErrorHandler("Employeeasset not found!", 404));
  }
  return res.status(200).json({
    employeeassets,
  });
});

exports.getIndividualUserDistributionDetails = catchAsyncErrors(async (req, res, next) => {
  let singleuserdata;
  try {
    const { employeename } = req.query;
    console.log(employeename)
    // Using aggregation to process and filter the data
    const result = await Employeeasset.find(
      {
        employeenameto: { $in: [employeename] }, // Match documents where the top-level code matches
      });

    singleuserdata = result;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    singleuserdata, // Respond with the concatenated array of subcomponents
  });
});

exports.getLogDistributionDetails = catchAsyncErrors(async (req, res, next) => {
  let logdata;
  try {
    const { assetmaterialcode } = req.body;
    console.log(assetmaterialcode, "assetmaterialcode")
    // Using aggregation to process and filter the data
    const result = await Employeeasset.find(
      {
        assetmaterialcode: assetmaterialcode, // Match documents where the top-level code matches
      });

    logdata = result;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    logdata, // Respond with the concatenated array of subcomponents
  });
});

exports.getAllDistributionDetailsGrouping = catchAsyncErrors(async (req, res, next) => {
  try {
    const { assignbranch } = req.body;
    // Prepare the branch filter conditions
    const branchFilterOverall = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    const branchFilterToOverall = assignbranch.map((branchObj) => ({
      branchto: branchObj.branch,
      companyto: branchObj.company,
      unitto: branchObj.unit,
    }));
    const branchFilterConditions = { $or: [...branchFilterOverall, ...branchFilterToOverall] };
    const result = await Employeeasset.aggregate([
      {
        $match: {
          $and: [
            branchFilterConditions, // Include branch filter conditions
          ],
        },
      },

      // Sort by createdAt in descending order
      { $sort: { assetmaterialcode: 1, createdAt: -1 } },

      // Group by assetmaterialcode
      {
        $group: {
          _id: "$assetmaterialcode",
          mostRecent: { $first: "$$ROOT" }, // Get the most recent document
          count: { $sum: 1 }, // Count occurrences of each assetmaterialcode
        },
      },

      // Add the log field
      {
        $addFields: {
          "mostRecent.log": {
            $cond: { if: { $gt: ["$count", 1] }, then: true, else: false },
          },
        },
      },



      // Replace the root to include only the mostRecent document
      { $replaceRoot: { newRoot: "$mostRecent" } },
    ]);
    console.log(result.length)

    return res.status(200).json({
      groupedData: result, // Respond with the processed data
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});



exports.getTeamAssetAcceptanceList = catchAsyncErrors(
  async (req, res, next) => {
    let user,
      result1,
      ans1D,
      result2,
      result3,
      result4,
      result5,
      result6,
      userFilter,
      result,
      hierarchyFilter,
      answerDef,
      hierarchyFinal,
      hierarchyDefList,
      resultAccessFilter,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      uniqueDataresult,
      uniqueData,
      myallTotalNames, count;
    try {
      // console.log( req.body, "req.body")
      let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]
      let answer = await Hirerarchi.aggregate([
        {
          $match: {
            supervisorchoose:
              req?.body?.username, // Match supervisorchoose with username
            level: { $in: levelFinal } // Corrected unmatched quotation mark
          }
        },
        {
          $lookup: {
            from: "reportingheaders",
            let: {
              teamControlsArray: {
                $ifNull: ["$pagecontrols", []]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$name",
                          "$$teamControlsArray"
                        ]
                      }, // Check if 'name' is in 'teamcontrols' array
                      {
                        $in: [
                          req?.body?.pagename,
                          "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                        ]
                      } // Additional condition for reportingnew array
                    ]
                  }
                }
              }
            ],
            as: "reportData" // The resulting matched documents will be in this field
          }
        },
        {
          $project: {
            supervisorchoose: 1,
            employeename: 1,
            reportData: 1
          }
        }
      ]);
      let restrictList = answer?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
      const users = await User.find(
        {
          resonablestatus: {
            $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
          },
        },
        {
          employeename: 1,
          companyname: 1,
        }
      );
      let companyname = users.map(d => d.companyname);
      result = await Employeeasset.find({ employeenameto: { $in: companyname } }).lean();
      console.log(req.body, 'req.body')
      // Accordig to sector and list filter process
      hierarchyFilter = await Hirerarchi.find({ level: req.body.sector }).lean();
      userFilter = hierarchyFilter
        .filter((data) => data.supervisorchoose.includes(req.body.username))
        .map((data) => data.employeename);
      hierarchyDefList = await Hirerarchi.find().lean();;
      user = await User.find({ companyname: req.body.username }, { designation: 1 }).lean();
      const userFilt = user.length > 0 && user[0].designation;
      const desiGroup = await Designation.find().lean();;
      let HierarchyFilt =
        req.body.sector === "all"
          ? hierarchyDefList
            .filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            .map((data) => data.designationgroup)
          : hierarchyFilter
            .filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            .map((data) => data.designationgroup);
      const DesifFilter = desiGroup.filter((data) =>
        HierarchyFilt.includes(data.group)
      );
      const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
      const SameDesigUser = HierarchyFilt.includes("All")
        ? true
        : userFilt === desigName;
      //Default Loading of List
      answerDef = hierarchyDefList
        .filter((data) => data.supervisorchoose.includes(req.body.username))
        .map((data) => data.employeename);
      hierarchyFinal =
        req.body.sector === "all"
          ? answerDef.length > 0
            ? [].concat(...answerDef)
            : []
          : hierarchyFilter.length > 0
            ? [].concat(...userFilter)
            : [];
      hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];
      //solo
      ans1D =
        req.body.sector === "all"
          ? answerDef.length > 0
            ? hierarchyDefList.filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            : []
          : hierarchyFilter.length > 0
            ? hierarchyFilter.filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            : [];
      result1 =
        ans1D.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = ans1D.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                //   return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      resulted = result1;
      //team
      let branches = [];
      hierarchySecond = await Hirerarchi.find().lean();;
      const subBranch =
        hierarchySecond.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) =>
                hierarchyMap.includes(name)
              )
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel =
        hierarchySecond.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => hierarchyMap.includes(name))
          )
          : [];
      result2 =
        answerFilterExcel.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...subBranch);
      const ans =
        subBranch.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => subBranch.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel2 =
        subBranch.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => subBranch.includes(name))
          )
          : [];
      result3 =
        answerFilterExcel2.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel2.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                // If a match is found, inject the control property into the corresponding item in an1
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...ans);
      const loop3 =
        ans.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => ans.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel3 =
        ans.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => ans.includes(name))
          )
          : [];
      result4 =
        answerFilterExcel3.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel3?.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                // If a match is found, inject the control property into the corresponding item in an1
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop3);
      const loop4 =
        loop3.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => loop3.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : [];
      const answerFilterExcel4 =
        loop3.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => loop3.includes(name))
          )
          : [];
      result5 =
        answerFilterExcel4.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel4?.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                // If a match is found, inject the control property into the corresponding item in an1
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop4);
      const loop5 =
        loop4.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => loop4.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel5 =
        loop4.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => loop4.includes(name))
          )
          : [];
      result6 =
        answerFilterExcel5.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel5?.find((item2) =>
                item2.employeename.includes(item1.employeenameto[0])
              );
              if (matchingItem2) {
                const plainItem1 = item1.toObject ? item1.toObject() : item1;
                return {
                  ...plainItem1,
                  level: req.body.sector + "-" + matchingItem2.control,
                };
                // If a match is found, inject the control property into the corresponding item in an1
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop5);
      resultedTeam = [
        ...result2,
        ...result3,
        ...result4,
        ...result5,
        ...result6,
      ];
      //overall Teams List
      myallTotalNames = [...hierarchyMap, ...branches];
      overallMyallList = [...resulted, ...resultedTeam];
      const restrictTeam = await Hirerarchi.aggregate([
        {
          $match: {
            supervisorchoose:
              { $in: myallTotalNames }, // Match supervisorchoose with username
            level: { $in: levelFinal } // Corrected unmatched quotation mark
          }
        },
        {
          $lookup: {
            from: "reportingheaders",
            let: {
              teamControlsArray: {
                $ifNull: ["$pagecontrols", []]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$name",
                          "$$teamControlsArray"
                        ]
                      }, // Check if 'name' is in 'teamcontrols' array
                      {
                        $in: [
                          req?.body?.pagename,
                          "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                        ]
                      } // Additional condition for reportingnew array
                    ]
                  }
                }
              }
            ],
            as: "reportData" // The resulting matched documents will be in this field
          }
        },
        {
          $project: {
            supervisorchoose: 1,
            employeename: 1,
            reportData: 1
          }
        }
      ]);
      let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename);
      let overallRestrictList = req.body.hierachy === "myhierarchy" ? restrictList : req.body.hierachy === "allhierarchy" ? restrictListTeam : [...restrictList, ...restrictListTeam];
      let resultAccessFiltered =
        req.body.hierachy === "myhierarchy"
          ? resulted
          : req.body.hierachy === "allhierarchy"
            ? resultedTeam
            : req.body.hierachy === "myallhierarchy"
              ? overallMyallList
              : result;
      resultAccessFilter = overallRestrictList?.length > 0 ? resultAccessFiltered?.filter(data => overallRestrictList?.includes(data?.employeenameto[0])) : [];
      uniqueDataresult = resultedTeam?.filter((item, index, self) =>
        index === self.findIndex(obj => obj._id === item._id)
      );
      uniqueData = resultAccessFilter?.filter((item, index, self) =>
        index === self.findIndex(obj => obj._id === item._id)
      );
    } catch (err) {
      console.log(err)
      return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
      resultedTeam: uniqueDataresult,
      resultAccessFilter: uniqueData,
      count: uniqueData?.length
      // hierarchyFilter,
      // myallTotalNames,
    });
  }
);

exports.getDistributionDetailsFilter = catchAsyncErrors(async (req, res, next) => {
  let distributiondatas;
  try {

    const {
      company,
      branch,
      unit,
      team,
      employee,
      status
    } = req.body;
    console.log(req.body)
    let filterQuery = {

      ...(status.length && { status: { $in: status } }),

      // Conditional company filter
      ...(company.length && { companyto: { $in: company } }),
      // Conditional branch filter
      ...(branch.length && { branchto: { $in: branch } }),
      // Conditional unit filter
      ...(unit.length && { unitto: { $in: unit } }),
      // Conditional team filter
      ...(team.length && { teamto: { $in: team } }),
      // Conditional department filter
      // Conditional employee filter
      ...(employee.length && { employeenameto: { $in: employee } }),
    };
    // Using aggregation to process and filter the data
    const result = await Employeeasset.find(filterQuery);

    distributiondatas = result;
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    distributiondatas, // Respond with the concatenated array of subcomponents
  });
});