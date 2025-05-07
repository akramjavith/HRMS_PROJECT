const CategoryThemeGrouping = require('../../../model/modules/greetinglayout/categorythemegrouping');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const PosterMessage = require("../../../model/modules/greetinglayout/postermessage");
const PosterGenerate = require('../../../model/modules/greetinglayout/postergenerate');

//get All CategoryThemeGrouping =>/api/CategoryThemeGrouping
exports.getAllCategoryThemeGrouping = catchAsyncErrors(async (req, res, next) => {
    let categorythemegroupings;
    try {
        categorythemegroupings = await CategoryThemeGrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categorythemegroupings) {
        return next(new ErrorHandler('CategoryThemeGrouping not found!', 404));
    }
    return res.status(200).json({
        categorythemegroupings
    });
})


//create new CategoryThemeGrouping => /api/CategoryThemeGrouping/new
exports.addCategoryThemeGrouping = catchAsyncErrors(async (req, res, next) => {

    let aCategoryThemeGrouping = await CategoryThemeGrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single CategoryThemeGrouping => /api/CategoryThemeGrouping/:id
exports.getSingleCategoryThemeGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategorythemegrouping = await CategoryThemeGrouping.findById(id);
    if (!scategorythemegrouping) {
        return next(new ErrorHandler('CategoryThemeGrouping not found', 404));
    }
    return res.status(200).json({
        scategorythemegrouping
    })
})

//update CategoryThemeGrouping by id => /api/CategoryThemeGrouping/:id
exports.updateCategoryThemeGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucategorythemegrouping = await CategoryThemeGrouping.findByIdAndUpdate(id, req.body);
    if (!ucategorythemegrouping) {
        return next(new ErrorHandler('CategoryThemeGrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete CategoryThemeGrouping by id => /api/CategoryThemeGrouping/:id
exports.deleteCategoryThemeGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategorythemegrouping = await CategoryThemeGrouping.findByIdAndRemove(id);
    if (!dcategorythemegrouping) {
        return next(new ErrorHandler('CategoryThemeGrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.categoryThemeGroupingOverall = catchAsyncErrors(async (req, res, next) => {
    let  postermessage, postergenerate;

    try {

        postermessage = await PosterMessage.find({
            categoryname: req.body.catname,
            subcategoryname: req.body.subcat 
        });
        postergenerate = await PosterGenerate.find({
            categoryname: req.body.catname,
            subcategoryname: req.body.subcat });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: postergenerate?.length + postermessage.length ,
        postergenerate,
        postermessage
    });
});
