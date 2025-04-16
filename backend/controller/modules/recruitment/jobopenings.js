const JobOpenings = require('../../../model/modules/recruitment/jobopenings');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All jobopenings =>/api/alljobopenings
exports.getAllJobOpen = catchAsyncErrors(async (req, res, next) => {
    let jobopenings;
    try {
        jobopenings = await JobOpenings.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!jobopenings) {
        return next(new ErrorHandler('Company not found!', 404));
    }

    // Add serial numbers to the jobopenings
    const alljobopenings = jobopenings.map((manpower, index) => ({
        serialNumber: index + 1,
        ...manpower.toObject()
    }));

    return res.status(200).json({
        jobopenings: alljobopenings
    });
})
exports.getAllJobOpenRegister = catchAsyncErrors(async (req, res, next) => {
    let jobopenings;
    try {
        // console.log(req.body.company)
        jobopenings = await JobOpenings.find({ company: req.body.company, branch: req.body.branch }, { _id: 1, recruitmentname: 1 })

    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        jobopenings
    });
})
exports.getAssignChecklistAllJobOpen = catchAsyncErrors(async (req, res, next) => {
    let jobopenings;
    try {
        jobopenings = await JobOpenings.find({status:"OnProgress",company:req.body.company, branch:req.body.branch, designation:req.body.designation})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!jobopenings) {
        return next(new ErrorHandler('Company not found!', 404));
    }

    // Add serial numbers to the jobopenings
    const alljobopenings = jobopenings.map((manpower, index) => ({
        serialNumber: index + 1,
        ...manpower.toObject()
    }));

    return res.status(200).json({
        jobopenings: alljobopenings
    });
})
exports.getWwithoutClosedAllJobOpen = catchAsyncErrors(async (req, res, next) => {
    let jobopenings;
    try {
        jobopenings = await JobOpenings.find({status:{$nin: "closed"}})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!jobopenings) {
        return next(new ErrorHandler('Company not found!', 404));
    }

    // Add serial numbers to the jobopenings
    const alljobopenings = jobopenings.map((manpower, index) => ({
        serialNumber: index + 1,
        ...manpower.toObject()
    }));

    return res.status(200).json({
        jobopenings: alljobopenings
    });
})
exports.getOnprogressAllJobOpen = catchAsyncErrors(async (req, res, next) => {
    let jobopenings;
    try {

        jobopenings = await JobOpenings.find({ status: { $ne: "closed" } });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!jobopenings) {
        return next(new ErrorHandler('Company not found!', 404));
    }

    // Add serial numbers to the jobopenings
    const alljobopenings = jobopenings.map((manpower, index) => ({
        serialNumber: index + 1,
        ...manpower.toObject()
    }));

    return res.status(200).json({
        jobopenings: alljobopenings
    });
})
//get All Filter job openings =>/api/filtered Jonb openingh
exports.Jobfilter = catchAsyncErrors(async (req, res, next) => {
    let jobfilters;
    try {
      let query = {};
      const {company,branch,designation } = req.body;
    //   Object.keys(req.body).forEach((key) => { 
    //     if (key !== "headers") {
    //       const value = req.body[key];
    //       if (value !== "ALL") {
    //         query[key] = value.toString();
    //       }
    //     }
    //   });
      if (company && company.length > 0) {
        query.company = { $in: company };
      }
      if (branch && branch.length > 0) {
        query.branch = { $in: branch };
      }
      if (designation && designation.length > 0) {
        query.designation = { $in: designation };
      }
    jobfilters = await JobOpenings.find(query,{})

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!jobfilters) {
      return next(new ErrorHandler("Company not found!", 404));
    }
    return res.status(200).json({
        jobfilters,
    });
  });


//create new jobopen => /api/jobopening/new
exports.addJobOpen = catchAsyncErrors(async (req, res, next) => {
    await JobOpenings.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single manpower => /api/jobopening/:id
exports.getSingleJobopen = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sjobopening = await JobOpenings.findById(id);
    if (!sjobopening) {
        return next(new ErrorHandler('company not found', 404));
    }
    return res.status(200).json({
        sjobopening
    })
})
//update manpower by id => /api/jobopening/:id
exports.updateJobOpen = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ujobopening = await JobOpenings.findByIdAndUpdate(id, req.body);
    if (!ujobopening) {
        return next(new ErrorHandler('company not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully', ujobopening });
})



//delete ujobopening by id => /api/jobopening/:id
exports.deleteJobOpening = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let djobopening = await JobOpenings.findByIdAndRemove(id);
    if (!djobopening) {
        return next(new ErrorHandler('company not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})