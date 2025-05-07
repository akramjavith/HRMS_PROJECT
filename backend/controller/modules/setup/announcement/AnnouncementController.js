const Announcement = require("../../../../model/modules/setup/announcement/AnnouncementModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");

// get All Announcement => /api/announcements
// get All Announcement => /api/announcements
exports.getAllAnnouncement = catchAsyncErrors(async (req, res, next) => {
  let announcement;
  try { 
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        {company: branchObj.company },
        { branch: { $elemMatch: { $eq: branchObj.branch } } },   
        { unit: { $elemMatch: { $eq: branchObj.unit } } },       
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    announcement = await Announcement.find(filterQuery);
    // announcement = await Announcement.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!announcement) {
    return next(new ErrorHandler("Announcement not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    announcement,
  });
});


// Create new Announcement=> /api/announcement/new
exports.addAnnouncement = catchAsyncErrors(async (req, res, next) => {
  let aannouncement = await Announcement.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Announcement => /api/announcement/:id
exports.getSingleAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sannouncement = await Announcement.findById(id);

  if (!sannouncement) {
    return next(new ErrorHandler("Announcement not found!", 404));
  }
  return res.status(200).json({
    sannouncement,
  });
});

// update Announcement by id => /api/announcement/:id
exports.updateAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uannouncement = await Announcement.findByIdAndUpdate(id, req.body);
  if (!uannouncement) {
    return next(new ErrorHandler("Announcement not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Announcement by id => /api/announcement/:id
exports.deleteAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dannouncement = await Announcement.findByIdAndRemove(id);

  if (!dannouncement) {
    return next(new ErrorHandler("Announcement not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
