const Company = require("../../../model/modules/setup/company");
const Branch = require("../../../model/modules/branch");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");

//get All company =>/api/companys
exports.getAllCompany = catchAsyncErrors(async (req, res, next) => {
  let companies;
  try {
    companies = await Company.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404)); 
  }
  if (!companies) {
    return next(new ErrorHandler("company not found!", 404));
  }
  return res.status(200).json({
    companies,
  });
});


exports.getOverallAllCompany = catchAsyncErrors(async (req, res, next) => {
  let users, branch, hierarchy;
  try {
    users = await User.find({ enquirystatus:{
      $nin: ["Enquiry Purpose"]
     },company: req.body.oldname },{company:1, branch:1,unit:1});
    branch = await Branch.find({ company: req.body.oldname });
    hierarchy = await Hirerarchi.find({ company: req.body.oldname }); 
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler("company not found!", 404));
  }
  return res.status(200).json({
    users,
    branch,
    hierarchy,
    count: users.length + branch.length + hierarchy.length,
  });
});


// get overall delete functionlity
exports.getAllAllCompanyCheck = catchAsyncErrors(async (req, res, next) => {
  let company,branch,ans,filteredArray,final;
  let id = req.body.id
  try {
    company = await Company.find();
    ans = company.filter((data)=> (id).includes(data._id.toString()));

    branch = await Branch.find();
    filteredArray = ans.filter((obj1) => {
      return branch.some((obj2) => obj2.company === obj1.name);
    });

   let filteredArrayto = filteredArray.map((data)=> data._id.toString())
     final = id.filter((data)=> !filteredArrayto.includes(data))
      
    
  } catch (err) {}
  if (!filteredArray) {
    return next(new ErrorHandler("company not found!", 404));
  }
  return res.status(200).json({
    filteredArray,final
  });
});


exports.getAllAddCompanyLimit = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 1, sizename, sort, search } = req.query;

  const filters = {};
  if (sizename) {
    filters.sizename = sizename;
  }

  const query = Company.find(filters);

  if (search) {
    query.where({ name: { $regex: search, $options: "i" } });
  }

  if (sort) {
    const [field, order] = sort.split(":");
    query.sort({ [field]: order === "desc" ? -1 : 1 });
  }
  try {
    const items = await query.skip((page - 1) * limit).limit(+limit);
    const totalCount = await Company.countDocuments(filters);

    if (!items) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
      items,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//create new company => /api/company/new
exports.addCompany = catchAsyncErrors(async (req, res, next) => {
  let acompany = await Company.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single company => /api/company/:id
exports.getSingleCompany = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let scompany = await Company.findById(id);
  if (!scompany) {
    return next(new ErrorHandler("company not found", 404));
  }
  return res.status(200).json({
    scompany,
  });
});
//update company by id => /api/company/:id
exports.updateCompany = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucompany = await Company.findByIdAndUpdate(id, req.body);
  if (!ucompany) {
    return next(new ErrorHandler("company not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully", ucompany });
});
//delete company by id => /api/company/:id
exports.deleteCompany = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dcompany = await Company.findByIdAndRemove(id);
  if (!dcompany) {
    return next(new ErrorHandler("company not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
//get All company =>/api/companys
exports.getAllCompanyAccess = catchAsyncErrors(async (req, res, next) => {
  let companies;
  try {
    const { assignbranch, role } = req.body;
    // console.log(assignbranch,'assignbranch')
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      name: branchObj.company,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };
    if (role.includes("Manager")) {
      companies = await Company.find();
    }
    else {
      // companies = await Company.find();
      companies = await Company.find(filterQuery);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!companies) {
    return next(new ErrorHandler("company not found!", 404));
  }
  return res.status(200).json({
    companies,
  });
});
