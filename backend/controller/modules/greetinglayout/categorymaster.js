const Categorymaster = require("../../../model/modules/greetinglayout/categorymaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const CategoryThemeGrouping = require('../../../model/modules/greetinglayout/categorythemegrouping');
const PosterMessage = require("../../../model/modules/greetinglayout/postermessage");
const PosterGenerate = require('../../../model/modules/greetinglayout/postergenerate');
const Subcategorymaster = require('../../../model/modules/greetinglayout/subcategorymaster');


//get All Categorymaster =>/api/Categorymaster
exports.getAllCategorymaster = catchAsyncErrors(async (req, res, next) => {
    let categorymasters;
    try {
        categorymasters = await Categorymaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categorymasters) {
        return next(new ErrorHandler('Categorymaster not found!', 404));
    }
    return res.status(200).json({
        count: categorymasters.length,
        categorymasters
    });
})


//create new Categorymaster => /api/Categorymaster/new
exports.addCategorymaster = catchAsyncErrors(async (req, res, next) => {
    let aCategorymaster = await Categorymaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Categorymaster => /api/Categorymaster/:id
exports.getSingleCategorymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategorymaster = await Categorymaster.findById(id);
    if (!scategorymaster) {
        return next(new ErrorHandler('Categorymaster not found', 404));
    }
    return res.status(200).json({
        scategorymaster
    })
})

//update Categorymaster by id => /api/Categorymaster/:id
exports.updateCategorymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucategorymaster = await Categorymaster.findByIdAndUpdate(id, req.body);
    if (!ucategorymaster) {
        return next(new ErrorHandler('Categorymaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Categorymaster by id => /api/Categorymaster/:id
exports.deleteCategorymaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategorymaster = await Categorymaster.findByIdAndRemove(id);
    if (!dcategorymaster) {
        return next(new ErrorHandler('Categorymaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.getoverallCategorymaster = catchAsyncErrors(async (req, res, next) => {
    let categorythemegrouping, subcategorymaster, postermessage, postergenerate;
    try {
      categorythemegrouping = await CategoryThemeGrouping.find({ categoryname: req.body.oldname });
      subcategorymaster = await Subcategorymaster.find({ categoryname: req.body.oldname });
      postermessage = await PosterMessage.find({ categoryname: req.body.oldname});
      postergenerate = await PosterGenerate.find({ categoryname: req.body.oldname });
   
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      count: postergenerate?.length + postermessage.length + subcategorymaster.length + categorythemegrouping.length,
      categorythemegrouping,
      subcategorymaster,
      postergenerate,
      postermessage
    });
  });
  