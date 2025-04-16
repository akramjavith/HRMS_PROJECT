const Subcategorymaster = require('../../../model/modules/greetinglayout/subcategorymaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const CategoryThemeGrouping = require('../../../model/modules/greetinglayout/categorythemegrouping');
const PosterMessage = require("../../../model/modules/greetinglayout/postermessage");
const PosterGenerate = require('../../../model/modules/greetinglayout/postergenerate');

// get all Subcategorymaster => /api/Subcategorymaster
exports.getAllSubcategorymaster = catchAsyncErrors(async (req, res, next) => {
    let subcategorymaster
    try {
        subcategorymaster = await Subcategorymaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subcategorymaster) {
        return next(new ErrorHandler('Subcategorymaster not found', 404));
    }
    // // Add serial numbers to the subcategorymaster
    // const alldoccategory = Subcategorymaster.map((data, index) => ({
    //     serialNumber: index + 1,
    //     ...data.toObject()
    // }));

    // return res.status(200).json({
    //     subcategorymaster: alldoccategory
    // });
    return res.status(200).json({
        count: subcategorymaster.length,
        subcategorymaster
    });

})


// //add Subcategorymaster by id => /api/Subcategorymaster
// exports.addSubcategorymaster = catchAsyncErrors(async (req, res, next) => {
//     await aSubcategorymaster.create(req.body);
//     return res.status(200).json({
//         message: 'Successfully added'
//     })
// })
//create new Subcategorymaster => /api/Subcategorymaster/new
exports.addSubcategorymaster = catchAsyncErrors(async (req, res, next) => {
    let aSubcategorymaster = await Subcategorymaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})


//get single Subcategorymaster by id => /api/Subcategorymaster/:id
exports.getSingleSubcategorymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssubcategorymaster = await Subcategorymaster.findById(id);
    if (!ssubcategorymaster) {
        return next(new ErrorHandler('Subcategorymaster not found'));

    }
    return res.status(200).json({
        ssubcategorymaster
    });

});

//Update Subcategorymaster by id => /api/Subcategorymaster/:id
exports.updateSubcategorymaster = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    let usubcategorymaster = await Subcategorymaster.findByIdAndUpdate(id, req.body);

    if (!usubcategorymaster) {
        return next(new ErrorHandler('Subcategorymaster not found'));
    }
    return res.status(200).json({
        message: 'Update Successfully', usubcategorymaster
    });
});



//delete Subcategorymaster by id => /api/Subcategorymaster/:id
exports.deleteSubcategorymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsubcategorymaster = await Subcategorymaster.findByIdAndRemove(id);
    if (!dsubcategorymaster) {
        return next(new ErrorHandler('Subcategorymaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.getoverallSubCategorymaster = catchAsyncErrors(async (req, res, next) => {
    let categorythemegrouping, postermessage, postergenerate;

    try {
        categorythemegrouping = await CategoryThemeGrouping.find({
            categoryname: req.body.catname,
            subcategoryname: { $in: req.body.subcatarr }
        });
        postermessage = await PosterMessage.find({
            categoryname: req.body.catname,
            subcategoryname: { $in: req.body.subcatarr }
        });
        postergenerate = await PosterGenerate.find({
            categoryname: req.body.catname,
            subcategoryname: { $in: req.body.subcatarr }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: postergenerate?.length + postermessage.length + categorythemegrouping.length,
        categorythemegrouping,
        postergenerate,
        postermessage
    });
});
