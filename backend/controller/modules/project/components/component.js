const ComponentMaster = require('../../../../model/modules/project/components/component');
const SubComponent = require('../../../../model/modules/project/components/subcomponent');
const ErrorHandler = require('../../../../utils/errorhandler');
const catchAsyncErrors = require('../../../../middleware/catchAsyncError');
// get All Component  Details => /api/component
exports.getAllComponent = catchAsyncErrors(async (req, res, next) => {
    let component;
    try {
        component = await ComponentMaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!component) {
        return next(new ErrorHandler('Component not found', 404));
    }
    return res.status(200).json({
        // count: queues.length,
        component
    });

})

exports.getAllComponentEdit = catchAsyncErrors(async (req, res, next) => {
    let component;
    try {
        component = await SubComponent.find({ componentname: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!component) {
        return next(new ErrorHandler('Component not found', 404));
    }
    return res.status(200).json({
        count: component.length,
        component
    });

})
// Create new Component => /api/component/new
exports.addComponent = catchAsyncErrors(async (req, res, next) => {
    let acomponent = await ComponentMaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Component => /api/component/:id
exports.getSingleComponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scomponent = await ComponentMaster.findById(id);
    if (!scomponent) {
        return next(new ErrorHandler('Component Master not found', 404));
    }
    return res.status(200).json({
        scomponent
    })
})

// update Component by id => /api/component/:id
exports.updateComponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upcomponent = await ComponentMaster.findByIdAndUpdate(id, req.body);
    if (!upcomponent) {
        return next(new ErrorHandler('Component Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Component by id => /api/component/:id
exports.deleteComponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcomponent = await ComponentMaster.findByIdAndRemove(id);
    if (!dcomponent) {
        return next(new ErrorHandler('Component Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})