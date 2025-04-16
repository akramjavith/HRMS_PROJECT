const express = require("express");
const ebRoute = express.Router();


// connect Eb service master form controller

const { getAllEbservicemaster, getSingleEbservicemaster, getAllEbservicemasterFilter, getAallBoardingEbservicemaster, getAllLiveEbservicemaster, getOverAllEditEBServiceCheck, addEbservicemaster, updateEbservicemaster, deleteEbservicemaster } = require("../controller/modules/eb/ebservicemaster");
ebRoute.route("/ebservicemasters").post(getAllEbservicemaster);
ebRoute.route("/ebservicemastersfilter").post(getAllEbservicemasterFilter);
ebRoute.route("/ebservicemasterlive").post(getAllLiveEbservicemaster);
ebRoute.route("/boardingebservicemasters").post(getAallBoardingEbservicemaster);
ebRoute.route("/ebservicemastersoveralledit").post(getOverAllEditEBServiceCheck);
ebRoute.route("/ebservicemaster/new").post(addEbservicemaster);
ebRoute.route("/ebservicemaster/:id").get(getSingleEbservicemaster).put(updateEbservicemaster).delete(deleteEbservicemaster);

// connect Managematerial form controller

const { getAllManagematerial, getSingleManagematerial, addManagematerial, updateManagematerial, deleteManagematerial } = require("../controller/modules/eb/managematerial");
ebRoute.route("/managematerials").get(getAllManagematerial);
ebRoute.route("/managematerial/new").post(addManagematerial);
ebRoute.route("/managematerial/:id").get(getSingleManagematerial).put(updateManagematerial).delete(deleteManagematerial);


// Vendor Master for EB Backend route
const { addVendorEB, deleteVendorEB, getAllVendorEB, getSingleVendorEB, updateVendorEB } = require("../controller/modules/eb/vendormaster");
ebRoute.route("/vendormasterforeb/new").post(addVendorEB);
ebRoute.route("/allvendormasterforeb/").get(getAllVendorEB);
ebRoute.route("/singlevendormasterforeb/:id").delete(deleteVendorEB).put(updateVendorEB).get(getSingleVendorEB);

const { getAllEbUseInstrument, getOverAllEbuseintrument, getSingleEbUseInstrument, getAllEbUseInstrumentFilter, addEbUseInstrument, updateEbUseInstrument, deleteEbUseInstrument } = require("../controller/modules/eb/ebuseinstrument");
ebRoute.route("/ebuseinstruments").post(getAllEbUseInstrument);
ebRoute.route("/ebuseinstrument/new").post(addEbUseInstrument);
ebRoute.route("/ebuseinstrumentoveralldelete").post(getOverAllEbuseintrument);
ebRoute.route("/ebuseinstrumentsFilter").post(getAllEbUseInstrumentFilter);
ebRoute.route("/ebuseinstrument/:id").get(getSingleEbUseInstrument).put(updateEbUseInstrument).delete(deleteEbUseInstrument);

// connect Eb material details form controller

const { getAllEbmaterialdetails, getSingleEbmaterialdetails, getOverAllEbMaterialdetails, addEbmaterialdetails, updateEbmaterialdetails, deleteEbmaterialdetails } = require("../controller/modules/eb/ebmaterialdetails");
ebRoute.route("/ebmaterialdetails").post(getAllEbmaterialdetails);
ebRoute.route("/ebmaterialdetail/new").post(addEbmaterialdetails);
ebRoute.route("/ebmaterialdetailoverlldelte").post(getOverAllEbMaterialdetails);
ebRoute.route("/ebmaterialdetail/:id").get(getSingleEbmaterialdetails).put(updateEbmaterialdetails).delete(deleteEbmaterialdetails);


// connect Eb Reading Deatails form controller
const { getAllEbreadingdetails, getAllEbServiceFilter, getAllEbreadingdetailsList, getAllEbreadingdetailsServiceStatus,
    getAllCheckDupeBillBeforeEdit, getAllCheckDupeDailyEdit, getAllCheckDupeMonthEdit, getAllCheckDupeBillEdit,
    getAllCheckDupeBillBefore, getAllCheckDupeBill, getAllCheckDupeDaily, getAllCheckDupeMonth, getOverallTableSort, getOverAllEbReading, getOverAllEbReadingdatacount, getAllEbreadingdetailsListFilter, getAllEbreadingdetailsFilter, getSingleEbreadingdetails, addEbreadingdetails, updateEbreadingdetails, deleteEbreadingdetails } = require("../controller/modules/eb/ebreadingdetails");
ebRoute.route("/ebreadingdetails").post(getAllEbreadingdetails);
ebRoute.route("/ebreadingdetailsservicestatus").post(getAllEbreadingdetailsServiceStatus);
ebRoute.route("/ebreadingdetail/new").post(addEbreadingdetails);

ebRoute.route("/ebreadingdetailpagenationsort").post(getOverallTableSort);

ebRoute.route("/ebreadingdetailsFilter").post(getAllEbreadingdetailsFilter);
ebRoute.route("/ebreadingdetailslist").get(getAllEbreadingdetailsList);
ebRoute.route("/ebreadingdetail/:id").get(getSingleEbreadingdetails).put(updateEbreadingdetails).delete(deleteEbreadingdetails);
ebRoute.route("/ebservicefilter").post(getAllEbServiceFilter);
ebRoute.route("/ebreadingdatacount").get(getOverAllEbReadingdatacount);
ebRoute.route("/ebreadingdetailslistFilter").post(getAllEbreadingdetailsListFilter);
ebRoute.route("/ebreadingdetailoveralldelete").post(getOverAllEbReading);

ebRoute.route("/checkdupedaily").post(getAllCheckDupeDaily);
ebRoute.route("/checkdupemonth").post(getAllCheckDupeMonth);
ebRoute.route("/checkdupebill").post(getAllCheckDupeBill);
ebRoute.route("/checkdupebillbefore").post(getAllCheckDupeBillBefore);

ebRoute.route("/checkdupedailyedit").post(getAllCheckDupeDailyEdit);
ebRoute.route("/checkdupemonthedit").post(getAllCheckDupeMonthEdit);
ebRoute.route("/checkdupebilledit").post(getAllCheckDupeBillEdit);
ebRoute.route("/checkdupebillbeforeedit").post(getAllCheckDupeBillBeforeEdit);

// connect Eb Rates  form controller

const { getAllEbrates, getSingleEbrates, addEbrates, updateEbrates, deleteEbrates } = require("../controller/modules/eb/ebrates");
ebRoute.route("/ebrates").post(getAllEbrates);
ebRoute.route("/ebrate/new").post(addEbrates);
ebRoute.route("/ebrate/:id").get(getSingleEbrates).put(updateEbrates).delete(deleteEbrates);

const { addPowerStation, deletePowerStation, getAllPowerStation, getOverAllDeletePower, getSinglePowerStation, updatePowerStation, PowerStationFilter } = require("../controller/modules/eb/powerstation");
ebRoute.route("/powerstations").post(getAllPowerStation);
ebRoute.route("/powerstation/new").post(addPowerStation);
ebRoute.route("/powerstationoveralldelete").post(getOverAllDeletePower);

ebRoute.route("/powerstation/:id").delete(deletePowerStation).get(getSinglePowerStation).put(updatePowerStation);
ebRoute.route("/powerstationfilter").post(PowerStationFilter);

// connect Managepowershutdowntypename form controller

const { getAllManagepowershutdowntypename, addManagepowershutdowntypename, getOverAllEditPower, getSingleManagepowershutdowntypename, updateManagepowershutdowntypename, deleteManagepowershutdowntypename } = require("../controller/modules/eb/powershutdowntype");
ebRoute.route("/managepowershutdowntype").get(getAllManagepowershutdowntypename);
ebRoute.route("/powerstationoveralledit").post(getOverAllEditPower);
ebRoute.route("/managepowershutdowntype/new").post(addManagepowershutdowntypename);
ebRoute.route("/managepowershutdowntype/:id").get(getSingleManagepowershutdowntypename).put(updateManagepowershutdowntypename).delete(deleteManagepowershutdowntypename);


module.exports = ebRoute;
