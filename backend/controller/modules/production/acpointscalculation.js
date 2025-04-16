const AcpointcalculationModel = require('../../../model/modules/production/acpointscalculation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All AcpointcalculationModel =>/api/AcpointcalculationModel
exports.getAllAcpointCalculation = catchAsyncErrors(async (req, res, next) => {
    let acpointcalculation;
    try {
        acpointcalculation = await AcpointcalculationModel.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!acpointcalculation) {
        return next(new ErrorHandler('AcpointcalculationModel not found!', 404));
    }
  
    return res.status(200).json({
        acpointcalculation
    });
})

exports.acpointCalculationSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, result, totalPages, currentPage;
  
    const { page, pageSize } = req.body;
    try {
  
        totalProjects = await AcpointcalculationModel.countDocuments();
  
        result = await AcpointcalculationModel.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));
  
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
        totalProjects,
        result,
        currentPage: page,
        totalPages: Math.ceil(totalProjects / pageSize),
    });
  });
  
//create new AcpointcalculationModel => /api/AcpointcalculationModel/new
exports.addAcpointCalculation= catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }

    let acpointcalculation = await AcpointcalculationModel.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single AcpointcalculationModel => /api/AcpointcalculationModel/:id
exports.getSingleAcpointCalculation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let acpointcalculation = await AcpointcalculationModel.findById(id);
    if (!acpointcalculation) {
        return next(new ErrorHandler('AcpointcalculationModel not found', 404));
    }
    return res.status(200).json({
        acpointcalculation
    })
})

//update AcpointcalculationModel by id => /api/AcpointcalculationModel/:id
exports.updateAcpointCalculation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let acpointcalculation = await AcpointcalculationModel.findByIdAndUpdate(id, req.body);
    if (!acpointcalculation) {
        return next(new ErrorHandler('AcpointcalculationModel not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete AcpointcalculationModel by id => /api/AcpointcalculationModel/:id
exports.deleteAcpointCalculation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let acpointcalculation = await AcpointcalculationModel.findByIdAndRemove(id);
    if (!acpointcalculation) {
        return next(new ErrorHandler('AcpointcalculationModel not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.acpointCalculationAssignBranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;
  
    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
      }))
    };

    let acpointcalculation;
    try {
        acpointcalculation = await AcpointcalculationModel.find(query) 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!acpointcalculation) {
        return next(new ErrorHandler('AcpointcalculationModel not found!', 404));
    }
  
    return res.status(200).json({
        acpointcalculation
    });
})