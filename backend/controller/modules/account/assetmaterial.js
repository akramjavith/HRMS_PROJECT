const Assetmaterial = require('../../../model/modules/account/assetmaterial');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get Allassetmaterial => /api/assetes
exports.getAllAssetmaterial = catchAsyncErrors(async (req, res, next) => {
    let assetmaterial;
    try {
        assetmaterial = await Assetmaterial.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetmaterial) {
        return next(new ErrorHandler('Assetmaterial not found!', 404));
    }
    return res.status(200).json({
        assetmaterial
    });
})


exports.getAssetmaterialAddress = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialaddress
    try {
        assetmaterialaddress = await Assetmaterial.find({ name: req.body.assetmaterial })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetaddress) {
        return next(new ErrorHandler('Assetmaterial not found!', 404));
    }
    return res.status(200).json({
        assetmaterialaddress
    });
})





// Create newassetmaterial => /api/assetmaterial/new
exports.addAssetmaterial = catchAsyncErrors(async (req, res, next) => {



    let aasset = await Assetmaterial.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Assetmaterial => /api/assetmaterial/:id
exports.getSingleAssetmaterial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sasset = await Assetmaterial.findById(id);

    if (!sasset) {
        return next(new ErrorHandler('Assetmaterial not found!', 404));
    }
    return res.status(200).json({
        sasset
    })
})
// updateassetmaterial by id => /api/assetmaterial/:id
exports.updateAssetmaterial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uasset = await Assetmaterial.findByIdAndUpdate(id, req.body);

    if (!uasset) {
        return next(new ErrorHandler('Assetmaterial not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// deleteassetmaterial by id => /api/assetmaterial/:id
exports.deleteAssetmaterial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dasset = await Assetmaterial.findByIdAndRemove(id);

    if (!dasset) {
        return next(new ErrorHandler('Assetmaterial not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})