const express = require("express");
const accountRoute = express.Router();

//Operatingsystem backend route
const { addOperatingsystem, getSingleOperatingsystem, deleteOperatingsystem, getAllOperatingsystem, updateOperatingsystem } = require("../controller/modules/account/OperatingsystemController");
accountRoute.route("/operatingsystems").get(getAllOperatingsystem);
accountRoute.route("/operatingsystem/new").post(addOperatingsystem);
accountRoute.route("/operatingsystem/:id").delete(deleteOperatingsystem).get(getSingleOperatingsystem).put(updateOperatingsystem);

//Applicationname backend route
const { addApplicationname, deleteApplicationname, getAllApplicationname, getSingleApplicationname, updateApplicationname } = require("../controller/modules/account/ApplicationNamecontroller");
accountRoute.route("/applicationnames").get(getAllApplicationname);
accountRoute.route("/applicationname/new").post(addApplicationname);
accountRoute.route("/applicationname/:id").delete(deleteApplicationname).get(getSingleApplicationname).put(updateApplicationname);


//Softwarespecification backend route
const { addSoftwarespecification, deleteSoftwarespecification, getAllSoftwarespecification, getTypeSoftwarespecification, getSingleSoftwarespecification, updateSoftwarespecification } = require("../controller/modules/account/Softwarespecificationcontroller");
accountRoute.route("/softwarespecifications").get(getAllSoftwarespecification);
accountRoute.route("/typewithsoftwareasset").post(getTypeSoftwarespecification);
accountRoute.route("/softwarespecification/new").post(addSoftwarespecification);
accountRoute.route("/softwarespecification/:id").delete(deleteSoftwarespecification).get(getSingleSoftwarespecification).put(updateSoftwarespecification);

//Assertsoftwaregrouping backend route
const { addAssertsoftwaregrouping, deleteAssertsoftwaregrouping, updateAssertsoftwaregrouping, getAllAssertsoftwaregrouping, getSingleAssertsoftwaregrouping } = require("../controller/modules/account/AssetSoftwaregrouping");
accountRoute.route("/assertsoftwaregroupings").get(getAllAssertsoftwaregrouping);
accountRoute.route("/assertsoftwaregrouping/new").post(addAssertsoftwaregrouping);
accountRoute.route("/assertsoftwaregrouping/:id").delete(deleteAssertsoftwaregrouping).get(getSingleAssertsoftwaregrouping).put(updateAssertsoftwaregrouping);


// Asset Module overall edit and delete controller
const { getOverAllDeleteAccHeadLinkedData, getOverAllEditAccHeadLinkedData, getOverAllDeleteTypeMasterLinkedData,
  getOverAllEditAssetTypeMasterLinkedData, getOverAllDeleteAssetMaterialLinkedData, getOverAllEditAssetMaterialLinkedData,
  getOverAllDeleteAssetSpecificationLinkedData, getOverAllEditAssetSpecificationLinkedData,
  getOverAllDeleteAssetSpecificationLinkedDataSingle, getOverAllEditVendorMasterLinkedData,
  getOverAllDeleteVendorMasterLinkedData, getOverAllDeleteVendorGroupingLinkedData,
  getOverAllEditVendorGroupingLinkedData, getOverAllDeleteFrequencyLinkedData, getOverAllEditFrequencyLinkedData,
  getOverAllDeleteUOMLinkedData, getOverAllEditUOMLinkedData, getOverAllDeleteAssetMasterLinkedData,
  getOverAllEditAssetMasterLinkedData, getOverAllEditAssetSpecificationGroupingLinkedData, getOverAllDeleteAssetSpecificationGroupingLinkedData,
  getAllEditArrayAssetspecification

} = require("../controller/modules/AssetoverallEditDelete");
accountRoute.route("/overalldeleteaccheadlinkeddata").post(getOverAllDeleteAccHeadLinkedData);
accountRoute.route("/overalleditaccheadlinkeddata").post(getOverAllEditAccHeadLinkedData);
accountRoute.route("/overalldeletetypemasterlinkeddata").post(getOverAllDeleteTypeMasterLinkedData);
accountRoute.route("/overalledittypemasterlinkeddata").post(getOverAllEditAssetTypeMasterLinkedData);

accountRoute.route("/overalldeleteassetmateriallinkeddata").post(getOverAllDeleteAssetMaterialLinkedData);
accountRoute.route("/overalleditassetmateriallinkeddata").post(getOverAllEditAssetMaterialLinkedData);

accountRoute.route("/overalldeleteassetspecificationlinkeddata").post(getOverAllDeleteAssetSpecificationLinkedData);
accountRoute.route("/overalldeleteassetspecificationlinkeddatasingle").post(getOverAllDeleteAssetSpecificationLinkedDataSingle);
accountRoute.route("/overalleditassetspecificationlinkeddata").post(getOverAllEditAssetSpecificationLinkedData);

accountRoute.route("/overalldeletevendormasterlinkeddata").post(getOverAllDeleteVendorMasterLinkedData);
accountRoute.route("/overalleditvendormasterlinkeddata").post(getOverAllEditVendorMasterLinkedData);

accountRoute.route("/overalldeletevendorgroupinglinkeddata").post(getOverAllDeleteVendorGroupingLinkedData);
accountRoute.route("/overalleditvendorgroupinglinkeddata").post(getOverAllEditVendorGroupingLinkedData);

accountRoute.route("/overalldeletefrequencylinkeddata").post(getOverAllDeleteFrequencyLinkedData);
accountRoute.route("/overalleditfrequencylinkeddata").post(getOverAllEditFrequencyLinkedData);

accountRoute.route("/overalldeleteuomlinkeddata").post(getOverAllDeleteUOMLinkedData);
accountRoute.route("/overalledituomlinkeddata").post(getOverAllEditUOMLinkedData);

accountRoute.route("/overalldeleteassetmasterlinkeddata").post(getOverAllDeleteAssetMasterLinkedData);
accountRoute.route("/overalleditassetmasterlinkeddata").post(getOverAllEditAssetMasterLinkedData);

accountRoute.route("/overalleditassetspecificationgrouping").post(getOverAllEditAssetSpecificationGroupingLinkedData);
accountRoute.route("/overalldeleteassetspecificationgrouping").post(getOverAllDeleteAssetSpecificationGroupingLinkedData);

accountRoute.route("/editarrayassetspecification").post(getAllEditArrayAssetspecification);








// connect group  form controller
const { getAllGroup, addGroup, updateGroup, getSingleGroup, deleteGroup, getOverAllDeleteAccountGroup, getOverAllEditAccountGroup } = require("../controller/modules/account/group");
accountRoute.route("/groups").get(getAllGroup);
accountRoute.route("/group/new").post(addGroup);
accountRoute.route("/group/:id").get(getSingleGroup).put(updateGroup).delete(deleteGroup);
accountRoute.route("/groupoveralldeleteaccountgroup").post(getOverAllDeleteAccountGroup);
accountRoute.route("/groupoveralleditaccountgroup").post(getOverAllEditAccountGroup);


// connect accountgroup form controller
const { getAllAccountgroup, addAccountgroup, updateAccountgroup, getSingleAccountgroup, deleteAccountgroup, getOverAllDeleteAccountHead, getOverAllEditAccountHead } = require("../controller/modules/account/accountgroup");
accountRoute.route("/accountgroups").get(getAllAccountgroup);
accountRoute.route("/accountgroup/new").post(addAccountgroup);
accountRoute.route("/accountgroup/:id").get(getSingleAccountgroup).put(updateAccountgroup).delete(deleteAccountgroup);
accountRoute.route("/accountgroupoveralldelete").post(getOverAllDeleteAccountHead);
accountRoute.route("/accountgroupoveralledit").post(getOverAllEditAccountHead);

// connect Account Head controller
const { getAllAccount, addAccount, getSingleAccount, updateAccount, deleteAccount } = require("../controller/modules/account/accounthead");

accountRoute.route("/accounts").get(getAllAccount);
accountRoute.route("/account/new").post(addAccount);
accountRoute.route("/account/:id").get(getSingleAccount).put(updateAccount).delete(deleteAccount);

// connect Asset Material controller
const { getAllAssetmaterial, addAssetmaterial, getSingleAssetmaterial, updateAssetmaterial, deleteAssetmaterial } = require("../controller/modules/account/assetmaterial");

accountRoute.route("/assets").get(getAllAssetmaterial);
accountRoute.route("/asset/new").post(addAssetmaterial);
accountRoute.route("/asset/:id").get(getSingleAssetmaterial).put(updateAssetmaterial).delete(deleteAssetmaterial);

// connect assetdetail form controller
const { getAllAssetdetail, getAllAssetdetailFilter, getAllAssetdetailRepairedHome, getAllAssetdetailDamageHome, getAllAssetdetailFilterAccessHome, getBranchFloorAssetdetail, getAllAssetdetailRepairFilter, getAllDamagedAssetAccess,
  getAllDamagedAsset, getAllAssetdetailFilterAccess, getAllRepairedAssetAccess, getAllAssetdetailFilterAccessOld, getAllAssetdetailGetVendor,
  getAllRepairedAsset, getAllAssetdetailCountLimited, getTicketAllAssetdetail, getBoardingAssetdetails, getOverallassetTableSort, getAllAssetdetailOverallAssetLimited, getAllAssetdetailStockLimited, makeSingleAssetRepair, getAllAssetdetailStockLimitedLog, getAllAssetdetailCountFilter, addAssetdetail, updateAssetdetail, getSingleAssetdetail, deleteAssetdetail } = require("../controller/modules/account/assetdetails");
accountRoute.route("/assetdetails").get(getAllAssetdetail);
accountRoute.route("/ticketassetdetails").post(getTicketAllAssetdetail);
accountRoute.route("/branchfloorassetdetails").post(getBranchFloorAssetdetail);
accountRoute.route("/overallassettablesort").post(getOverallassetTableSort);
accountRoute.route("/assetdetailsfilteraccesshome").get(getAllAssetdetailFilterAccessHome);
accountRoute.route("/assetdetailsdamagehome").get(getAllAssetdetailDamageHome);
accountRoute.route("/assetdetailsrepairhome").post(getAllAssetdetailRepairedHome);
accountRoute.route("/boardingassetdetails").post(getBoardingAssetdetails);
accountRoute.route("/assetdetailsfilter").get(getAllAssetdetailFilter);
accountRoute.route("/assetdetailscountfilter").post(getAllAssetdetailCountFilter);
accountRoute.route("/assetdetail/new").post(addAssetdetail);
accountRoute.route("/repairedasset").get(getAllRepairedAsset);
accountRoute.route("/damagedasset").get(getAllDamagedAsset);
accountRoute.route("/assetdetailsrepairfilter").post(getAllAssetdetailRepairFilter);
accountRoute.route("/assetdetail/:id").get(getSingleAssetdetail).put(updateAssetdetail).delete(deleteAssetdetail);
accountRoute.route("/assetdetailslimited").get(getAllAssetdetailCountLimited);
accountRoute.route("/assetdetailsstocklimited").get(getAllAssetdetailStockLimited);
accountRoute.route("/assetdetaillog").post(getAllAssetdetailStockLimitedLog);
accountRoute.route("/assetdetailsinglerepair").put(makeSingleAssetRepair);
accountRoute.route("/overallassetlimited").get(getAllAssetdetailOverallAssetLimited);
accountRoute.route("/assetdetailsfilteraccess").post(getAllAssetdetailFilterAccess);
accountRoute.route("/assetdetailsfilteraccessold").post(getAllAssetdetailFilterAccessOld);
accountRoute.route("/repairedassetaccess").post(getAllRepairedAssetAccess);
accountRoute.route("/damagedassetaccess").post(getAllDamagedAssetAccess);
accountRoute.route("/assetgetvendor").post(getAllAssetdetailGetVendor);



//vom master name route
const { addVomMasterName, deleteVomMasterName, getSingleVomMasterName, getAllVomMasterName, updateVomMasterName } = require("../controller/modules/account/vommaster");
accountRoute.route("/vommasternames").get(getAllVomMasterName);
accountRoute.route("/vommastername/new").post(addVomMasterName);
accountRoute.route("/vommastername/:id").delete(deleteVomMasterName).get(getSingleVomMasterName).put(updateVomMasterName);

// connect employee asset distribution form controller
// connect employee asset distribution form controller
const { getAllEmployeeasset, addEmployeeasset, getAllEmployeeassetAccess, getAllEmployeeassetAccessHome, updateEmployeeasset, getSingleEmployeeasset, deleteEmployeeasset, getIndividualUserDistributionDetails, getAllDistributionDetailsGrouping, getLogDistributionDetails, getTeamAssetAcceptanceList, getDistributionDetailsFilter } = require("../controller/modules/account/employeeassetdistribution");
accountRoute.route("/assetdistributiongroupeddatas").post(getAllDistributionDetailsGrouping);
accountRoute.route("/assetdistributionlogdatas").post(getLogDistributionDetails);
accountRoute.route("/teamemployeeassets").post(getTeamAssetAcceptanceList);
accountRoute.route("/assetdistributiondetailsfilter").post(getDistributionDetailsFilter);
accountRoute.route("/individualemployeeassets").get(getIndividualUserDistributionDetails);
accountRoute.route("/employeeassets").get(getAllEmployeeasset);
accountRoute.route("/employeeassetsaccess").post(getAllEmployeeassetAccess);
accountRoute.route("/employeeasset/new").post(addEmployeeasset);
accountRoute.route("/employeeasset/:id").get(getSingleEmployeeasset).put(updateEmployeeasset).delete(deleteEmployeeasset);
accountRoute.route("/employeeassetsaccesshome").get(getAllEmployeeassetAccessHome);


// Vendor Details backend route

// Vendor Details
const { addVendorDetails, getAllVendormaster, VendorAutoId, deletevendordetails, updatevendordetails, getSinglevendordetails, duplicateVendorDetectorVisitor } = require("../controller/modules/account/vendordetails");
accountRoute.route("/vendordetails/new").post(addVendorDetails);
accountRoute.route("/allvendordetails/").get(getAllVendormaster);
accountRoute.route("/singlevendordetails/:id").delete(deletevendordetails).put(updatevendordetails).get(getSinglevendordetails);
accountRoute.route("/vendordetailsautoid").get(VendorAutoId);

//newly added 12.12.2024
accountRoute.route("/vendorduplicatefacedetection").post(duplicateVendorDetectorVisitor);

//frequency master name route
const { addFrequencyMaster, getSingleFrequencyMaster, getAllFrequencyMaster, deleteFrequencyMaster, updateFrequencyMaster } = require("../controller/modules/account/frequencymastercontroller");
accountRoute.route("/frequencymasters").get(getAllFrequencyMaster);
accountRoute.route("/frequencymaster/new").post(addFrequencyMaster);
accountRoute.route("/frequencymaster/:id").delete(deleteFrequencyMaster).get(getSingleFrequencyMaster).put(updateFrequencyMaster);

//otherpayments

//otherpayments
const {
  getAllOtherPayments,
  addOtherPayments,
  getSingleotherpayment,
  updatesOtherpayment,
  deletesOtherpayment,
  skippedOtherPayments,
} = require("../controller/modules/account/otherpayment");
accountRoute.route("/allotherpayments").post(getAllOtherPayments);
accountRoute.route("/otherpayment/new").post(addOtherPayments);
accountRoute.route("/skippedotherpayment").post(skippedOtherPayments);
accountRoute.route("/otherpayment/:id").get(getSingleotherpayment).put(updatesOtherpayment).delete(deletesOtherpayment);
// connect Maintentance controller
// connect Maintentance controller
const { getAllMaintenance, addMaintenance, getAllMaintenanceAccess, getAllMaintenanceExcelLimited, updateMaintenance, getAllMaintenanceActive, getSingleMaintenance, deleteMaintenance } = require("../controller/modules/account/maintenance");
accountRoute.route("/maintentances").get(getAllMaintenance);
accountRoute.route("/maintentancesaccess").post(getAllMaintenanceAccess);
accountRoute.route("/maintentancesaccessexcellimited").get(getAllMaintenanceExcelLimited);
accountRoute.route("/maintentance/new").post(addMaintenance);
accountRoute.route("/maintentancesactive").get(getAllMaintenanceActive);
accountRoute.route("/maintentance/:id").get(getSingleMaintenance).put(updateMaintenance).delete(deleteMaintenance);

//asset type master route
const { addAssetTypeMaster, deleteAssetTypeMaster, getAllAssetTypeMaster, getSingleAssetTypeMaster, updateAssetTypeMaster } = require("../controller/modules/account/assetTypeMasterController");
accountRoute.route("/assettypemasters").get(getAllAssetTypeMaster);
accountRoute.route("/assettypemaster/new").post(addAssetTypeMaster);
accountRoute.route("/assettypemaster/:id").delete(deleteAssetTypeMaster).get(getSingleAssetTypeMaster).put(updateAssetTypeMaster);

//asset type grouping route
const { addAssetTypeGrouping, deleteAssetTypeGrouping, getAllAssetTypeGrouping, getSingleAssetTypeGrouping, updateAssetTypeGrouping } = require("../controller/modules/account/assetTypeGroupingController");
accountRoute.route("/assettypegroupings").get(getAllAssetTypeGrouping);
accountRoute.route("/assettypegrouping/new").post(addAssetTypeGrouping);
accountRoute.route("/assettypegrouping/:id").delete(deleteAssetTypeGrouping).get(getSingleAssetTypeGrouping).put(updateAssetTypeGrouping);

const { getAllAssetWorkstation, getSingleAssetWorkstation, addAssetWorkstation,
  updateAssetWorkstation, deleteAssetWorkstation, getAllAssetWorkstationLimitedByWorkstaion } = require("../controller/modules/account/assetworkstation");
accountRoute.route("/assetworkstations").get(getAllAssetWorkstation);
accountRoute.route("/assetworkstation/new").post(addAssetWorkstation);
accountRoute.route("/assetworkstationlimitedbyworkstation").post(getAllAssetWorkstationLimitedByWorkstaion);
accountRoute.route("/assetworkstation/:id").get(getSingleAssetWorkstation).put(updateAssetWorkstation).delete(deleteAssetWorkstation);



// Maintance Details Master
const { getAllMaintenanceDetailsmaster, getSingleMaintenanceDetailsmasterGroup, getSingleMaintenanceDetailsmasterGroupDelete, getMaintenanceDetailsmaster, getSingleMaintenanceDetailsmaster, deleteMaintenanceDetailsmaster, addMaintenanceDetailsmaster, updateMaintenanceDetailsmaster } = require("../controller/modules/account/MaintanceDetailsMaster");

accountRoute.route("/maintenancedetailsmaster").get(getAllMaintenanceDetailsmaster);
accountRoute.route("/maintenancedetailsmaster/new").post(addMaintenanceDetailsmaster);
accountRoute.route("/maintenancedetailsmastergetdata").post(getMaintenanceDetailsmaster);
accountRoute.route("/maintenancedetailsmastergroup").post(getSingleMaintenanceDetailsmasterGroup);
accountRoute.route("/maintenancedetailsmastergroupdelete").post(getSingleMaintenanceDetailsmasterGroupDelete);
accountRoute.route("/maintenancedetailsmaster/:id").get(getSingleMaintenanceDetailsmaster).put(updateMaintenanceDetailsmaster).delete(deleteMaintenanceDetailsmaster);


//brand master backend route
const { addBrandMaster, deleteBrandMaster, getAllBrandMaster, getSingleBrandMaster, updateBrandMaster } = require("../controller/modules/account/BrandMasterController");
accountRoute.route("/brandmasters").get(getAllBrandMaster);
accountRoute.route("/brandmaster/new").post(addBrandMaster);
accountRoute.route("/brandmaster/:id").delete(deleteBrandMaster).get(getSingleBrandMaster).put(updateBrandMaster);

//asset Model route
const { addAssetModel, deleteAssetModel, getAllAssetModel, getSingleAssetModel, updateAssetModel } = require("../controller/modules/account/AssetModelController");
accountRoute.route("/assetmodels").get(getAllAssetModel);
accountRoute.route("/assetmodel/new").post(addAssetModel);
accountRoute.route("/assetmodel/:id").delete(deleteAssetModel).get(getSingleAssetModel).put(updateAssetModel);

//asset Variant route
const { addAssetVariant, deleteAssetVariant, getAllAssetVariant, getSingleAssetVariant, updateAssetVariant } = require("../controller/modules/account/AssetVariantController");
accountRoute.route("/assetvariants").get(getAllAssetVariant);
accountRoute.route("/assetvariant/new").post(addAssetVariant);
accountRoute.route("/assetvariant/:id").delete(deleteAssetVariant).get(getSingleAssetVariant).put(updateAssetVariant);

//asset Size route
const { addAssetSize, deleteAssetSize, getAllAssetSize, getSingleAssetSize, updateAssetSize } = require("../controller/modules/account/AssetSizeController");
accountRoute.route("/assetsizes").get(getAllAssetSize);
accountRoute.route("/assetsize/new").post(addAssetSize);
accountRoute.route("/assetsize/:id").delete(deleteAssetSize).get(getSingleAssetSize).put(updateAssetSize);

//asset Specification Type route
const { addAssetSpecificationType, deleteAssetSpecificationType, getAllAssetSpecificationType, getSingleAssetSpecificationType, updateAssetSpecificationType } = require("../controller/modules/account/AssetSpecificationTypeController");
accountRoute.route("/assetspecificationtypes").get(getAllAssetSpecificationType);
accountRoute.route("/assetspecificationtype/new").post(addAssetSpecificationType);
accountRoute.route("/assetspecificationtype/:id").delete(deleteAssetSpecificationType).get(getSingleAssetSpecificationType).put(updateAssetSpecificationType);

//asset capacity backend route

const { addAssetCapacity, deleteAssetCapacity, getAllAssetCapacity, getSingleAssetCapacity, updateAssetCapacity } = require("../controller/modules/account/AssetCapacityController");
accountRoute.route("/assetcapacitys").get(getAllAssetCapacity);
accountRoute.route("/assetcapacity/new").post(addAssetCapacity);
accountRoute.route("/assetcapacity/:id").delete(deleteAssetCapacity).get(getSingleAssetCapacity).put(updateAssetCapacity);

//panel type  route
const { addPanelType, deletePanelType, getAllPanelType, getSinglePanelType, updatePanelType } = require('../controller/modules/account/PanelTypeController');
accountRoute.route('/paneltypes').get(getAllPanelType);
accountRoute.route('/paneltype/new').post(addPanelType);
accountRoute.route('/paneltype/:id').delete(deletePanelType).get(getSinglePanelType).put(updatePanelType);

//screen resolution  route
const { addScreenResolution, deleteScreenResolution, getAllScreenResolution, getSingleScreenResolution, updateScreenResolution } = require('../controller/modules/account/ScreenresolutionController');
accountRoute.route('/screenresolutions').get(getAllScreenResolution);
accountRoute.route('/screenresolution/new').post(addScreenResolution);
accountRoute.route('/screenresolution/:id').delete(deleteScreenResolution).get(getSingleScreenResolution).put(updateScreenResolution);

//connectivity  route
const { addConnectivity, deleteConnectivity, getAllConnectivity, getSingleConnectivity, updateConnectivity } = require('../controller/modules/account/ConnectivityController');
accountRoute.route('/connectivitys').get(getAllConnectivity);
accountRoute.route('/connectivity/new').post(addConnectivity);
accountRoute.route('/connectivity/:id').delete(deleteConnectivity).get(getSingleConnectivity).put(updateConnectivity);


const { getipsubcategory, updateIpObjects, getAllIpMasterAssigned, getAllIpMasterUnAssigned, getAllIpConfigunAssigned, updateIpObjectsupdatedby, getAllIpMasterPaginationList, IpMasterEXCELDownload, IpMasterCSVDownload, IpMasterPDFDownload, getAllIpMasterAccess, deleteIpObjects, addIpMaster, deleteIpMaster, getOverAllDeleteIP, getAllIpMaster, getSingleIpMaster, updateIpMaster } = require("../controller/modules/account/ipcontroller");
accountRoute.route("/ipmasters").get(getAllIpMaster);
accountRoute.route("/ipmastersassigned").post(getAllIpMasterAssigned);
accountRoute.route("/ipmastersunassigned").post(getAllIpMasterUnAssigned);
accountRoute.route("/ipmasterexceldownload").get(IpMasterEXCELDownload);
accountRoute.route("/ipmastercsvdownload").get(IpMasterCSVDownload);
accountRoute.route("/ipmasterpdfdownload").get(IpMasterPDFDownload);
accountRoute.route("/getallipconfigunassigned").get(getAllIpConfigunAssigned);
accountRoute.route("/ipmastersaccesspaginationlist").post(getAllIpMasterPaginationList);
accountRoute.route("/ipmastersaccess").post(getAllIpMasterAccess);

accountRoute.route("/ipsubcategory").post(getipsubcategory);
accountRoute.route("/overalldeleteip").post(getOverAllDeleteIP);
accountRoute.route("/ipmaster/new").post(addIpMaster);
accountRoute.route("/ipmasterupdate").post(updateIpObjects);
accountRoute.route("/ipmasterupdateedby").post(updateIpObjectsupdatedby);
accountRoute.route("/ipmasterdelete").post(deleteIpObjects);
accountRoute.route("/ipmaster/:id").delete(deleteIpMaster).get(getSingleIpMaster).put(updateIpMaster);

//ipcategory route
const { getAllipCategory, addipCategory, getOverAllIpCategoryCheck, getOverAllEditIpcategory, getSingleipCategory, updateipCategory, deleteipCategory } = require("../controller/modules/account/ipcategory");
accountRoute.route("/ipcategories").get(getAllipCategory);
accountRoute.route("/ipcategorie/new").post(addipCategory);
accountRoute.route("/ipcategorieoveralldelete").post(getOverAllIpCategoryCheck);
accountRoute.route("/ipcategorieoveralledit").post(getOverAllEditIpcategory);
accountRoute.route("/ipcategorie/:id").get(getSingleipCategory).put(updateipCategory).delete(deleteipCategory);


//ASSET SPECIFICATION

//data range backend route
const { addDataRange, deleteDataRange, getAllDataRange, getSingleDataRange, updateDataRange } = require('../controller/modules/account/DataRangeController');
accountRoute.route('/dataranges').get(getAllDataRange);
accountRoute.route('/datarange/new').post(addDataRange);
accountRoute.route('/datarange/:id').delete(deleteDataRange).get(getSingleDataRange).put(updateDataRange);

//compatible devices backend  route
const { addCompatibleDevices, deleteCompatibleDevices, getAllCompatibleDevices, getSingleCompatibleDevices, updateCompatibleDevices } = require('../controller/modules/account/CompatibleDevicesController');
accountRoute.route('/compatibledevicess').get(getAllCompatibleDevices);
accountRoute.route('/compatibledevices/new').post(addCompatibleDevices);
accountRoute.route('/compatibledevices/:id').delete(deleteCompatibleDevices).get(getSingleCompatibleDevices).put(updateCompatibleDevices);

//output power backend  route
const { addOutputPower, deleteOutputPower, getAllOutputPower, getSingleOutputPower, updateOutputPower } = require('../controller/modules/account/OutputPowerController');
accountRoute.route('/outputpowers').get(getAllOutputPower);
accountRoute.route('/outputpower/new').post(addOutputPower);
accountRoute.route('/outputpower/:id').delete(deleteOutputPower).get(getSingleOutputPower).put(updateOutputPower);

//cooling fan count backend  route
const { addCoolingFanCount, deleteCoolingFanCount, getAllCoolingFanCount, getSingleCoolingFanCount, updateCoolingFanCount } = require('../controller/modules/account/CoolingFanCountController');
accountRoute.route('/coolingfancounts').get(getAllCoolingFanCount);
accountRoute.route('/coolingfancount/new').post(addCoolingFanCount);
accountRoute.route('/coolingfancount/:id').delete(deleteCoolingFanCount).get(getSingleCoolingFanCount).put(updateCoolingFanCount);

//clock speed backend  route
const { addClockSpeed, deleteClockSpeed, getAllClockSpeed, getSingleClockSpeed, updateClockSpeed } = require('../controller/modules/account/ClockSpeedController');
accountRoute.route('/clockspeeds').get(getAllClockSpeed);
accountRoute.route('/clockspeed/new').post(addClockSpeed);
accountRoute.route('/clockspeed/:id').delete(deleteClockSpeed).get(getSingleClockSpeed).put(updateClockSpeed);

//core backend  route
const { addCore, deleteCore, getAllCore, getSingleCore, updateCore } = require('../controller/modules/account/CoreController');
accountRoute.route('/cores').get(getAllCore);
accountRoute.route('/core/new').post(addCore);
accountRoute.route('/core/:id').delete(deleteCore).get(getSingleCore).put(updateCore);

//speed backend  route
const { addSpeed, deleteSpeed, getAllSpeed, getSingleSpeed, updateSpeed } = require('../controller/modules/account/SpeedController');
accountRoute.route('/speeds').get(getAllSpeed);
accountRoute.route('/speed/new').post(addSpeed);
accountRoute.route('/speed/:id').delete(deleteSpeed).get(getSingleSpeed).put(updateSpeed);

//frequency backend  route
const { addFrequency, deleteFrequency, getAllFrequency, getSingleFrequency, updateFrequency } = require('../controller/modules/account/FrequencyController');
accountRoute.route('/frequencys').get(getAllFrequency);
accountRoute.route('/frequency/new').post(addFrequency);
accountRoute.route('/frequency/:id').delete(deleteFrequency).get(getSingleFrequency).put(updateFrequency);

//output backend  route
const { addOutput, deleteOutput, getAllOutput, getSingleOutput, updateOutput } = require('../controller/modules/account/OutputController');
accountRoute.route('/outputs').get(getAllOutput);
accountRoute.route('/output/new').post(addOutput);
accountRoute.route('/output/:id').delete(deleteOutput).get(getSingleOutput).put(updateOutput);

//ethernet ports backend  route
const { addEthernetPorts, deleteEthernetPorts, getAllEthernetPorts, getSingleEthernetPorts, updateEthernetPorts } = require('../controller/modules/account/EthernetPortsController');
accountRoute.route('/ethernetportss').get(getAllEthernetPorts);
accountRoute.route('/ethernetports/new').post(addEthernetPorts);
accountRoute.route('/ethernetports/:id').delete(deleteEthernetPorts).get(getSingleEthernetPorts).put(updateEthernetPorts);

//distance backend  route
const { addDistance, deleteDistance, getAllDistance, getSingleDistance, updateDistance } = require('../controller/modules/account/DistanceController');
accountRoute.route('/distances').get(getAllDistance);
accountRoute.route('/distance/new').post(addDistance);
accountRoute.route('/distance/:id').delete(deleteDistance).get(getSingleDistance).put(updateDistance);

//length backend  route
const { addLength, deleteLength, getAllLength, getSingleLength, updateLength } = require('../controller/modules/account/LengthController');
accountRoute.route('/lengths').get(getAllLength);
accountRoute.route('/length/new').post(addLength);
accountRoute.route('/length/:id').delete(deleteLength).get(getSingleLength).put(updateLength);

//slot backend  route
const { addSlot, deleteSlot, getAllSlot, getSingleSlot, updateSlot } = require('../controller/modules/account/SlotController');
accountRoute.route('/slots').get(getAllSlot);
accountRoute.route('/slot/new').post(addSlot);
accountRoute.route('/slot/:id').delete(deleteSlot).get(getSingleSlot).put(updateSlot);

//no of channels backend  route
const { addNoOfChannels, deleteNoOfChannels, getAllNoOfChannels, getSingleNoOfChannels, updateNoOfChannels } = require('../controller/modules/account/NoOfChannelsController');
accountRoute.route('/noofchannelss').get(getAllNoOfChannels);
accountRoute.route('/noofchannels/new').post(addNoOfChannels);
accountRoute.route('/noofchannels/:id').delete(deleteNoOfChannels).get(getSingleNoOfChannels).put(updateNoOfChannels);

//colours backend  route
const { addColours, deleteColours, getAllColours, getSingleColours, updateColours } = require('../controller/modules/account/ColoursController');
accountRoute.route('/colourss').get(getAllColours);
accountRoute.route('/colours/new').post(addColours);
accountRoute.route('/colours/:id').delete(deleteColours).get(getSingleColours).put(updateColours);

//asset specification grouping backend route
const { addAssetSpecificationGrping, deleteAssetSpecificationGrping, getAllAssetSpecificationGrping, getSingleAssetSpecificationGrping, updateAssetSpecificationGrping } = require("../controller/modules/account/assetspecificationgrouping");
accountRoute.route("/assetspecificationgroupings").get(getAllAssetSpecificationGrping);
accountRoute.route("/assetspecificationgrouping/new").post(addAssetSpecificationGrping);
accountRoute.route("/assetspecificationgrouping/:id").delete(deleteAssetSpecificationGrping).get(getSingleAssetSpecificationGrping).put(updateAssetSpecificationGrping);

//Stock Category route
const {
  addStockCategory,
  deleteStockCategory,
  getAllStockCategory,
  getSingleStockCategory,
  updateStockCategory, StockCategoryAutoId
} = require("../controller/modules/account/stockcategory");
accountRoute.route("/stockcategorys").get(getAllStockCategory);
accountRoute.route("/stockcategory/new").post(addStockCategory);
accountRoute.route("/stockcategoryautoid").get(StockCategoryAutoId);
accountRoute
  .route("/stockcategory/:id")
  .delete(deleteStockCategory)
  .get(getSingleStockCategory)
  .put(updateStockCategory);

const { getAllManagestockitems, addManagestockitems, getSingleManagestockitems, deleteManagestockitems, updateManagestockitems, getAllManagestockitemsPagination } = require("../controller/modules/stockpurchase/managestockitems");
accountRoute.route("/managestockitems").get(getAllManagestockitems);
accountRoute.route("/managestockitems/new").post(addManagestockitems);
accountRoute.route("/managestockitemspagination").post(getAllManagestockitemsPagination);
accountRoute.route("/managestockitems/:id").get(getSingleManagestockitems).put(updateManagestockitems).delete(deleteManagestockitems);


// connect Assetmaterialip controller
const { getAllAssetMaterialIP, addAssetMaterialIP, getAllAssetMaterialIPLimited, getAllMaterialWiseAssetList,
  getAllAssetMaterialIPLimitedAccess, getAllAssetMaterialIPListFilter, updateAssetMaterialIP, getSingleAssetMaterialIP, deleteAssetMaterialIP } = require("../controller/modules/account/assetmaterialip");
accountRoute.route("/assetmaterialips").get(getAllAssetMaterialIP);
accountRoute.route("/assetmaterialip/new").post(addAssetMaterialIP);
accountRoute.route("/assetmaterialip/:id").get(getSingleAssetMaterialIP).put(updateAssetMaterialIP).delete(deleteAssetMaterialIP)
accountRoute.route("/assetmaterialipslimited").get(getAllAssetMaterialIPLimited);
accountRoute.route("/assetmaterialipslimitedaccess").post(getAllAssetMaterialIPLimitedAccess);
accountRoute.route("/assetmaterialipfilter").post(getAllAssetMaterialIPListFilter);
accountRoute.route("/allmaterialwiseassetlist").get(getAllMaterialWiseAssetList);


// connect AssetWrokstation Grouping controller
const { getAllAssetWorkGrp, addAssetWorkGrp, updateAssetWorkGrp, getAllAssetWorkGrpAcces, getAllAssetWorkstationgroupingListFilter, getSingleAssetWorkGrp, deleteAssetWorkGrp } = require("../controller/modules/account/assetworkstationgrouping");
accountRoute.route("/assetworkgrps").get(getAllAssetWorkGrp);
accountRoute.route("/assetworkgrp/new").post(addAssetWorkGrp);
accountRoute.route("/assetworkgrp/:id").get(getSingleAssetWorkGrp).put(updateAssetWorkGrp).delete(deleteAssetWorkGrp)
accountRoute.route("/assetworkgrpsaccess").post(getAllAssetWorkGrpAcces);
accountRoute.route("/assetworkgrpslist").post(getAllAssetWorkstationgroupingListFilter);


// Employee Status Assetproblemmaster
const { getAllAssetProblemmaster, deleteAssetProblemmaster, addAssetProblemmaster, updateAssetProblemmaster, getSingleAssetProblemmaster } = require("../controller/modules/account/Assetproblemmaster");
accountRoute.route("/assetproblemmaster").get(getAllAssetProblemmaster);
accountRoute.route("/assetproblemmaster/new").post(addAssetProblemmaster);
accountRoute.route("/assetproblemmaster/:id").get(getSingleAssetProblemmaster).put(updateAssetProblemmaster).delete(deleteAssetProblemmaster);

//connect Task For an User controller



//connect Task For an User controller
const { addTaskMaintenanceForUser, getAllTaskMaintenanceUserOverallReports, deleteTaskMaintenanceForUser,
  getAllSortedTaskMaintenanceForUserHome, getAllSortedTaskMaintenanceForUserHomeList, getAllMaintenanceForUserAssignId,
  getAllHierarchyMaintenanceReports, addTaskMaintenanceForUserOnProgress, addTaskMaintenanceForUserCompleted, addTaskMaintenanceForUserAutoGenerate,
  getAllTaskMaintenanceForUser, getAllTaskUserReports, getAllTaskMaintenanceForUserAutoGenerate, getAllSortedTaskMaintenanceForUser,
  getSingleTaskMaintenanceForUser, updateTaskMaintenanceForUser, getAllTaskMaintenanceForUserPanelView } = require("../controller/modules/account/taskmaintenanceforuser");
accountRoute.route("/taskmaintenanceforusers").get(getAllTaskMaintenanceForUser);
accountRoute.route("/taskmaintenanceforusersoverallreport").post(getAllTaskMaintenanceUserOverallReports);
accountRoute.route("/taskmaintenanceforusers/new").post(addTaskMaintenanceForUser);
accountRoute.route("/sortedtaskmaintenanceforusershome").post(getAllSortedTaskMaintenanceForUserHome);
accountRoute.route("/sortedtaskmaintenanceforusershomelist").post(getAllSortedTaskMaintenanceForUserHomeList);
accountRoute.route("/maintenanceforuserassignuser").post(getAllMaintenanceForUserAssignId);
accountRoute.route("/maintenancehierarchyreports").post(getAllHierarchyMaintenanceReports);
accountRoute.route("/taskmaintenanceautogenerate").post(addTaskMaintenanceForUserAutoGenerate);
accountRoute.route("/taskmaintenanceonprogress").post(addTaskMaintenanceForUserOnProgress);
accountRoute.route("/taskmaintenancecompleted").post(addTaskMaintenanceForUserCompleted);
accountRoute.route("/sortedtaskmaintenanceforusers").post(getAllSortedTaskMaintenanceForUser);
accountRoute.route("/taskmaintenanceforusersreports").post(getAllTaskUserReports);
accountRoute.route("/taskmaintenanceforusersautogenerate").post(getAllTaskMaintenanceForUserAutoGenerate);

accountRoute.route("/taskmaintenanceforuserpanelview").post(getAllTaskMaintenanceForUserPanelView);

accountRoute.route("/taskmaintenanceforusers/:id").delete(deleteTaskMaintenanceForUser).get(getSingleTaskMaintenanceForUser).put(updateTaskMaintenanceForUser);

const { addTaskMaintenanceNonScheduleGrouping, deleteTaskMaintenanceNonScheduleGrouping, getAllTaskMaintenanceNonScheduleGroupingAssetIP, getAllTaskMaintenanceNonScheduleGroupingAccess, getAllTaskMaintenanceNonScheduleGrouping, getSingleTaskMaintenanceNonScheduleGrouping, updateTaskMaintenanceNonScheduleGrouping } = require("../controller/modules/account/taskmaintenancenongrouping");
accountRoute.route("/taskmaintenancenonschedulegroupings").get(getAllTaskMaintenanceNonScheduleGrouping);
accountRoute.route("/taskmaintenancenonschedulegroupingsassetip").get(getAllTaskMaintenanceNonScheduleGroupingAssetIP);
accountRoute.route("/taskmaintenancenonschedulegrouping/new").post(addTaskMaintenanceNonScheduleGrouping);
accountRoute.route("/taskmaintenancenonschedulegroupingsaccess").post(getAllTaskMaintenanceNonScheduleGroupingAccess);
accountRoute.route("/taskmaintenancenonschedulegrouping/:id").delete(deleteTaskMaintenanceNonScheduleGrouping).get(getSingleTaskMaintenanceNonScheduleGrouping).put(updateTaskMaintenanceNonScheduleGrouping);

//add to printqueue
const { getAllAddtoprintqueue, getAllAddtoprintqueueFilter, getAllAddtoprintqueueLimitedPrinted, getAllAddtoprintqueueLimitedPrintedAccess, getAllAddtoprintqueueLimitedAccess,
  addAddtoprintqueue, updateAddtoprintqueue, getSingleAddtoprintqueue, deleteAddtoprintqueue, getAllAddtoprintqueueLimited, getAllDataAddtoprintqueue } = require("../controller/modules/account/addtoprintqueue");
accountRoute.route("/addtoprintqueues").get(getAllAddtoprintqueue);
accountRoute.route("/addtoprintqueueslimitaccess").post(getAllAddtoprintqueueLimitedAccess);
accountRoute.route("/addtoprintqueueslimitprintaccess").post(getAllAddtoprintqueueLimitedPrintedAccess);
accountRoute.route("/addtoprintqueueslimit").get(getAllAddtoprintqueueLimited);
accountRoute.route("/addtoprintqueueslimitprint").get(getAllAddtoprintqueueLimitedPrinted);
accountRoute.route("/addtoprintqueuefilter").get(getAllAddtoprintqueueFilter);
accountRoute.route("/addtoprintqueue/new").post(addAddtoprintqueue);
accountRoute.route("/alldatatoaddtoprintqueue").post(getAllDataAddtoprintqueue);

accountRoute.route("/addtoprintqueue/:id").get(getSingleAddtoprintqueue).put(updateAddtoprintqueue).delete(deleteAddtoprintqueue);

//labelname backend  route
const { getAllLabelName, deleteLabelName, addLabelName, getSingleLabelName, updateLabelName } = require('../controller/modules/account/labelname');
accountRoute.route('/labelname').get(getAllLabelName);
accountRoute.route('/labelname/new').post(addLabelName);
accountRoute.route('/labelname/:id').delete(deleteLabelName).get(getSingleLabelName).put(updateLabelName);

//vendor grouping
const { addVendorGrouping, getAllVendorGrouping, deletevendorGrouping, updatevendorGrouping, getSinglevendorGrouping } = require("../controller/modules/account/vendorgrouping");
accountRoute.route("/vendorgrouping/new").post(addVendorGrouping);
accountRoute.route("/vendorgrouping").get(getAllVendorGrouping);
accountRoute.route("/singlevendorgrouping/:id").delete(deletevendorGrouping).put(updatevendorGrouping).get(getSinglevendorGrouping);

const { createScreenSaver, getProgress } = require("../controller/modules/account/screensaver");
accountRoute.route("/creatingscreensaver").post(createScreenSaver);
accountRoute.route("/getprogresscount/:requestId").get(getProgress);




// connect Assetsoftware controller
const { getAllAssetSoftwareDetails, addAssetSoftwareDetails, getSingleAssetSoftwareDetails, updateAssetSoftwareDetails,
  deleteAssetSoftwareDetails, getAllAssetSoftwaredetailFilterAccess } = require("../controller/modules/account/assetsoftwaredetails");
accountRoute.route("/assetsoftwaredetails").get(getAllAssetSoftwareDetails);
accountRoute.route("/assetsoftwaredetail/new").post(addAssetSoftwareDetails);
accountRoute.route("/assetsoftwaredetail/:id").get(getSingleAssetSoftwareDetails).put(updateAssetSoftwareDetails).delete(deleteAssetSoftwareDetails)
accountRoute.route("/assetsoftwaredetaillistfilter").post(getAllAssetSoftwaredetailFilterAccess);






module.exports = accountRoute;
