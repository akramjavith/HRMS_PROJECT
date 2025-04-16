const MyVerification = require("../../../model/modules/settings/Myverification");
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
// Create 
exports.addMyverification = catchAsyncErrors(async (req, res, next) => {
    let amyverification = await MyVerification.create(req.body)
    return res.status(200).json({
        message: 'Successfully added!'
    });
})
//Get
exports.getAllMyverification = catchAsyncErrors(async (req, res, next) => {
    let myverification;
    try {
        myverification = await MyVerification.find()
    } catch (err) {
        console.log(err.message);
    }
    if (!myverification) {
        return next(new ErrorHandler('MyVerification not found!', 404));
    }
    return res.status(200).json({
        myverification
    });
})
//Get Single
exports.getSingleMyverification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smyverification = await MyVerification.find({ employeeid: id });
    if (!smyverification) {
        return next(new ErrorHandler("MyVerification not found!", 404));
    }
    return res.status(200).json({
        smyverification,
    });
});
// update Single
exports.updateMyverification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umyverification = await MyVerification.findByIdAndUpdate(id, req.body);
    if (!umyverification) {
        return next(new ErrorHandler("MyVerification not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});
// update Single status

exports.updateMyverificationstatus = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id;

    // Assuming req.body contains the fields to update in the MyVerification document
    let umyverification = await MyVerification.findByIdAndUpdate(id, req.body, { new: true });

    if (!umyverification) {
        console.log("abcd")
        return next(new ErrorHandler("MyVerification not found!", 404));
    }

    return res.status(200).json({ message: "Updated successfully", data: umyverification });
});

exports.getAllMyverificationAssignbranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;

    // Create a query array for company and branch
    const query = assignbranch.map(item => ({
      company: item.company,
      branch: item.branch, // Assuming `branch` is an array in `assignbranch`
      unit: item.unit, // Assuming `branch` is an array in `assignbranch`
    }));

    let Myverification;
    try {
        Myverification = await MyVerification.find()
    } catch (err) {
        console.log(err.message);
    }
    if (!Myverification) {
        return next(new ErrorHandler('MyVerification not found!', 404));
    }

    const myverification = Myverification.map(setting => {
        return {
          ...setting._doc, // Spread the existing setting properties
          designationlog: setting.designationlog.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
          departmentlog: setting.departmentlog.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
          departmentlogdates: setting.departmentlogdates.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
          processlog: setting.processlog.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
          boardingLog: setting.boardingLog.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
          shiftallot: setting.shiftallot.filter(todo =>
            query.some(q => q.company === todo.company && q.branch === todo.branch)
          ),
        };
      });



    return res.status(200).json({
        myverification
    });
})