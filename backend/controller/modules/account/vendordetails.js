const VendorDetails = require("../../../model/modules/account/vendordetails");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const faceapi = require('face-api.js');

exports.duplicateVendorDetectorVisitor = catchAsyncErrors(
  async (req, res, next) => {

    try {
      const { faceDescriptor, id } = req.body;

      // Ensure faceDescriptor is an array of numbers
      if (
        !Array.isArray(faceDescriptor) ||
        !faceDescriptor.every((num) => typeof num === "number")
      ) {
        throw new Error("Invalid face descriptor format.");
      }

      // Fetch all user face descriptors from MongoDB
      const query = id ? { _id: { $ne: id } } : {};

      const [vendorcheck] = await Promise.all([
        VendorDetails.find(
          {},
          {
            faceDescriptor: 1,
          }
        ).lean(),
      ]);

      let authenticated = false;
      let allData = vendorcheck;

      // Compare face descriptors
      for (const data of allData) {
        const storedDescriptor = data?.faceDescriptor;

        if (
          !Array.isArray(storedDescriptor) ||
          storedDescriptor.length !== faceDescriptor.length
        ) {
          continue; // Skip mismatched descriptors
        }

        const distance = faceapi.euclideanDistance(
          faceDescriptor,
          storedDescriptor
        );

        if (distance < 0.4) {
          authenticated = true;
          break; // Exit loop once fond
        }
      }

      return res.status(200).json({ matchfound: authenticated });
    } catch (err) {
      console.error("Error:", err);
      return next(new ErrorHandler("Records not found!", 404));
    }
  }
);
// Create new VendorDetails=> /api/vendordetails/new
exports.addVendorDetails = catchAsyncErrors(async (req, res, next) => {
  let addVendorDetails = await VendorDetails.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get All VendorDetails => /api/allvendordetails
exports.getAllVendormaster = catchAsyncErrors(async (req, res, next) => {
  let vendordetails;
  try {
    vendordetails = await VendorDetails.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!vendordetails) {
    return next(new ErrorHandler("vendordetails not found!", 404));
  }
  return res.status(200).json({
    vendordetails,
  });
});

// get Single VendorDetails => /api/singlevendordetails/:id
exports.getSinglevendordetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let svendordetails = await VendorDetails.findById(id);

  if (!svendordetails) {
    return next(new ErrorHandler("VendorDetails not found!", 404));
  }
  return res.status(200).json({
    svendordetails,
  });
});

// update VendorDetails by id => /api/singlevendordetails/:id
exports.updatevendordetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uvendordetails = await VendorDetails.findByIdAndUpdate(id, req.body);

  if (!uvendordetails) {
    return next(new ErrorHandler("VendorDetails not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Vendordetail by id => /api/singlevendordetails/:id
exports.deletevendordetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dvendorDetails = await VendorDetails.findByIdAndRemove(id);

  if (!dvendorDetails) {
    return next(new ErrorHandler("VendorDeatils not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


exports.VendorAutoId = catchAsyncErrors(async (req, res, next) => {
  let autoid;
  try {
    // Find the last expense category document sorted by _id in descending order
    const vendor = await VendorDetails.findOne().sort({ _id: -1 });

    // Check if there's any document in the collection
    if (!vendor) {
      // If no document found, start with EC0001
      autoid = "VEN0001";
    } else {
      // If a document is found, get the last generated autoid
      let lastAutoId = vendor.vendorid; // Assuming you have 'autoid' field in the document

      // Extract the numeric part from the last autoid
      let codenum = lastAutoId ? lastAutoId.split("VEN")[1] : "0000";
      // Increment the numeric part by 1
      let nextIdNum = parseInt(codenum, 10) + 1;

      // Convert the number back to a string and pad it with leading zeros
      let nextIdStr = String(nextIdNum).padStart(4, "0");

      // Form the next autoid
      autoid = "VEN" + nextIdStr;
    }
  } catch (err) {
    return next(new ErrorHandler("Record not found!", 404));
  }
  return res.status(200).json({
    autoid,
  });
});