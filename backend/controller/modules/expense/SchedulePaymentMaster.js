const SchedulePaymentMaster = require("../../../model/modules/expense/SchedulePaymentMaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All  =>/api/allschedulepaymentmasters
exports.getAllSchedulePaymentMaster = catchAsyncErrors(
  async (req, res, next) => {
    let schedulepaymentmaster;
    try {
      const { assignbranch } = req.body;

      // Construct the filter query based on the assignbranch array
      const branchFilter = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
      }));

      // Use $or to filter incomes that match any of the branch, company, and unit combinations
      const filterQuery = { $or: branchFilter };

      schedulepaymentmaster = await SchedulePaymentMaster.find(filterQuery);
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!schedulepaymentmaster) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    // Add serial numbers to the schedulepaymentmaster
    const allschedulepaymentmaster = schedulepaymentmaster.map(
      (payments, index) => ({
        serialNumber: index + 1,
        ...payments.toObject(),
      })
    );

    return res.status(200).json({
      schedulepaymentmaster: allschedulepaymentmaster,
    });
  }
);

//create new schedulepaymentmaster => /api/schedulepaymentmaster/new
exports.addSchedulePaymentMaster = catchAsyncErrors(async (req, res, next) => {
  let aschedulepaymentmaster = await SchedulePaymentMaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single schedulepaymentmaster => /api/schedulepaymentmaster/:id
exports.getSingleSchedulePaymentMaster = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sschedulepaymentmaster = await SchedulePaymentMaster.findById(id);
    if (!sschedulepaymentmaster) {
      return next(new ErrorHandler("Data not found", 404));
    }
    return res.status(200).json({
      sschedulepaymentmaster,
    });
  }
);
//update schedulepaymentmaster by id => /api/schedulepaymentmaster/:id
exports.updateSchedulePaymentMaster = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uschedulepaymentmaster = await SchedulePaymentMaster.findByIdAndUpdate(
      id,
      req.body
    );
    if (!uschedulepaymentmaster) {
      return next(new ErrorHandler("Data not found", 404));
    }

    return res
      .status(200)
      .json({ message: "Updated successfully", uschedulepaymentmaster });
  }
);

//delete schedulepaymentmaster by id => /api/schedulepaymentmaster/:id
exports.deleteSchedulePaymentMaster = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let dschedulepaymentmaster = await SchedulePaymentMaster.findByIdAndRemove(
      id
    );
    if (!dschedulepaymentmaster) {
      return next(new ErrorHandler("Data not found", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);