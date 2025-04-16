const AnnouncementCategory = require("../../../../model/modules/setup/announcement/AnnouncementCategoryModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");

const Announcement = require("../../../../model/modules/setup/announcement/AnnouncementModel");

//get All Expensecategories =>/api/announcementcategorys
exports.getAllAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    try {
      let announcementcategory = await AnnouncementCategory.find();
      if (!announcementcategory) {
        return next(new ErrorHandler("AnnouncementCategory not found!", 404));
      }
      // Add serial numbers to the announcementcategory
      const allexpcategory = announcementcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject(),
      }));
      return res.status(200).json({
        announcementcategory: allexpcategory,
      });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
  }
);

//create new announcementcategory => /api/announcementcategory/new
exports.addAnnouncementCategory = catchAsyncErrors(async (req, res, next) => {
  let aannouncementcategory = await AnnouncementCategory.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single announcementcategory => /api/announcementcategory/:id
exports.getSingleAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sannouncementcategory = await AnnouncementCategory.findById(id);
    if (!sannouncementcategory) {
      return next(new ErrorHandler("AnnouncementCategory not found", 404));
    }
    return res.status(200).json({
      sannouncementcategory,
    });
  }
);
//update announcementcategory by id => /api/announcementcategory/:id
exports.updateAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uannouncementcategory = await AnnouncementCategory.findByIdAndUpdate(
      id,
      req.body
    );
    if (!uannouncementcategory) {
      return next(new ErrorHandler("AnnouncementCategory not found", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

//delete announcementcategory by id => /api/announcementcategory/:id
exports.deleteAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let dannouncementcategory = await AnnouncementCategory.findByIdAndRemove(
      id
    );
    if (!dannouncementcategory) {
      return next(new ErrorHandler("AnnouncementCategory not found", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);

//overall delete category  => /api/overalldelete/announcementcategory
exports.overallDeleteAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    const { category } = req.body;
    let announcement;
    announcement = await Announcement.countDocuments({
      category,
    });

    if (announcement) {
      return next(
        new ErrorHandler(
          `This Category and Sub Category already used in Announcement Page`,
          404
        )
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete category  => /api/overallbulkdelete/announcementcategory
exports.overallBulkDeleteAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    let announcement, announcementcategory, result, count;
    let id = req.body.id;
    try {
      announcementcategory = await AnnouncementCategory.find();
      const answerQuestion = announcementcategory?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      announcement = await Announcement.find();

      const unmatchedAnnouncement = answerQuestion
        .filter((answers) =>
          announcement.some((sub) => sub.category === answers.categoryname)
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [...unmatchedAnnouncement];
      result = id?.filter((data) => !duplicateId?.includes(data));
      count = id?.filter((data) => duplicateId?.includes(data))?.length;
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      count: count,
      result,
    });
  }
);

//overall edit category  => /api/overalledit/announcementcategory
// exports.overallEditAnnouncementCategory = catchAsyncErrors(
//   async (req, res, next) => {
//     const { oldcategory, newcategory ,oldsubcategoryarray,newsubcategoryarray} = req.body;

//     await Announcement.updateMany(
//       { category: oldcategory },
//       { $set: { category: newcategory } }
//     );

//     return res.status(200).json({ updated: true });
//   }
// );

exports.overallEditAnnouncementCategory = catchAsyncErrors(
  async (req, res, next) => {
    const {
      oldcategory,
      newcategory,
      oldsubcategoryarray,
      newsubcategoryarray,
    } = req.body;
    let announcement = await Announcement.countDocuments({
      category: oldcategory,
      subcategory: { $in: oldsubcategoryarray },
    });
    // Check if the lengths of both subcategory arrays are the same
    if (
      announcement &&
      oldsubcategoryarray.length > newsubcategoryarray.length
    ) {
      return next(
        new ErrorHandler(
          "You Can Not Delete any Subcategory it maybe already used in Announcement page",
          404
        )
      );
    }

    // Update the category
    await Announcement.updateMany(
      { category: oldcategory },
      { $set: { category: newcategory } }
    );

    // Iterate through the subcategory arrays and update each corresponding subcategory
    for (let i = 0; i < oldsubcategoryarray.length; i++) {
      const oldSubcategory = oldsubcategoryarray[i];
      const newSubcategory = newsubcategoryarray[i];

      if (oldSubcategory !== newSubcategory) {
        await Announcement.updateMany(
          { category: newcategory, subcategory: oldSubcategory },
          { $set: { subcategory: newSubcategory } }
        );
      }
    }

    return res.status(200).json({ updated: true });
  }
);