const SubComponent = require('../../../../model/modules/project/components/subcomponent');
const ComponentMaster = require('../../../../model/modules/project/components/component')
const ErrorHandler = require('../../../../utils/errorhandler');
const catchAsyncErrors = require('../../../../middleware/catchAsyncError');


//get All subComponent =>/api/subcomponent
exports.getAllSubComp = catchAsyncErrors(async (req, res, next) => {
    let subcomponent;
    try {
        subcomponent = await SubComponent.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcomponent) {
        return next(new ErrorHandler('subcomponent not found!', 404));
    }
    return res.status(200).json({
        subcomponent
    });
})

//get All subComponent =>/api/subcomponent
exports.getAllSubCompCode = catchAsyncErrors(async (req, res, next) => {
    let compCode;
    try {
        compCode = await ComponentMaster.find({ componentname: req.body.compname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!compCode) {
        return next(new ErrorHandler('component Code not found!', 404));
    }
    return res.status(200).json({
        compCode
    });
})
//get All subComponent =>/api/subcomponent
exports.getAllSubCompCodeEdit = catchAsyncErrors(async (req, res, next) => {
    let compCode;
    try {
        compCode = await ComponentMaster.find({ componentname: req.body.compname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!compCode) {
        return next(new ErrorHandler('component Code not found!', 404));
    }
    return res.status(200).json({
        compCode
    });
})
//create new compsubComponent => /api/compsubcomp/new
exports.addSubComponent = catchAsyncErrors(async (req, res, next) => {

    let asubcomp = await SubComponent.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single subcomponent => /api/subcomp/:id
exports.getSinglesubComp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssubcomp = await SubComponent.findById(id);
    if (!ssubcomp) {
        return next(new ErrorHandler('Sub Component not found', 404));
    }
    return res.status(200).json({
        ssubcomp
    })
})


//update subcomponent by id => /api/subcomp/:id
exports.updateSubComp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubcomp = await SubComponent.findByIdAndUpdate(id, req.body);
    if (!usubcomp) {
        return next(new ErrorHandler('SubComponent not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete subcomponent by id => /api/compsubcomp/:id
exports.deleteSubComp = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsubcomp = await SubComponent.findByIdAndRemove(id);
    if (!dsubcomp) {
        return next(new ErrorHandler('SubComponent not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})