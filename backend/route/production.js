const express = require("express");
const productionRoute = express.Router();
//Client User ID route

const { addClientUserID, deleteClientUserID, getAllClientUserCheck, clientUseridsReportIdsOnly, updateLoginAllotLogValues, deleteLoginAllotLog,
  resetClientUserIdData, getClientUserSort, getAllClientUserIDData, clientUseridsLimitedUser,
  getLoginAllotidDetails, getAllClientUserID, getAllClientUserIDLimited,
  getSingleClientUserID, updateClientUserID, clientUserIdLimitedTimestudyByCompnyname, clientUserIdLimitedTimestudyByCompnynameMulti
} = require("../controller/modules/production/ClientUserIDController");
productionRoute.route("/clientuserids").get(getAllClientUserID);
productionRoute.route("/clientuseridsdata").get(getAllClientUserIDData);
productionRoute.route('/clientuseridlimiteduser').post(clientUseridsLimitedUser);
productionRoute.route("/clientuseridsort").post(getClientUserSort);
productionRoute.route("/loginallotlog").delete(deleteLoginAllotLog).put(updateLoginAllotLogValues);
productionRoute.route("/resetclientuserid").put(resetClientUserIdData);
productionRoute.route("/clientuseridusercheck").post(getAllClientUserCheck);
productionRoute.route("/clientuserid/new").post(addClientUserID);
productionRoute.route("/clientuseridslimited").get(getAllClientUserIDLimited);
productionRoute.route("/clientuserid/:id").delete(deleteClientUserID).get(getSingleClientUserID).put(updateClientUserID);
productionRoute.route("/getloginallotiddetails").post(getLoginAllotidDetails);
productionRoute.route("/clientuseridsreportidsonly").get(clientUseridsReportIdsOnly);
productionRoute.route("/clientuseridlimitedtimestudybycompanyname").post(clientUserIdLimitedTimestudyByCompnyname);
productionRoute.route("/clientuseridlimitedtimestudybycompanynameMulti").post(clientUserIdLimitedTimestudyByCompnynameMulti);






//Process Queue Name route

const { addProcessQueueName, deleteProcessQueueName, getAllProcessQueueName, processQueueNameSort, getSingleProcessQueueName, updateProcessQueueName } = require("../controller/modules/production/ProcessQueueNameController");
productionRoute.route("/processqueuenames").get(getAllProcessQueueName);
productionRoute.route("/processqueuename/new").post(addProcessQueueName);
productionRoute.route("/processqueuenamesort").post(processQueueNameSort);
productionRoute.route("/processqueuename/:id").delete(deleteProcessQueueName).get(getSingleProcessQueueName).put(updateProcessQueueName);

const { addtargetpoints, deletetargetpoints, getOverallTargetpointsSort, getTargetpointslimitedAssignedbranch, targetpointsbulkdelete, getTargetpointslimited, getAlltargetpoints, getSingletargetpoints, updatetargetpoints } = require("../controller/modules/production/targetpoints");
productionRoute.route("/targetpoints").get(getAlltargetpoints);
productionRoute.route("/targetpoint/new").post(addtargetpoints);
productionRoute.route("/targetpointsbulkdelete").post(targetpointsbulkdelete);
productionRoute.route("/targetpointsort").post(getOverallTargetpointsSort);
productionRoute.route("/targetpoint/:id").delete(deletetargetpoints).get(getSingletargetpoints).put(updatetargetpoints);
productionRoute.route("/targetpointslimited").get(getTargetpointslimited);
productionRoute.route("/targetpointslimitedassignbranch").post(getTargetpointslimitedAssignedbranch);

//ERA Amount route
const { addEraAmount, deleteEraAmount, getAllEraAmount, getAllEraAmountAssignBranch, getAllEraAmountLimited, getOverallERAAmountBySort, getSingleEraAmount, updateEraAmount } = require("../controller/modules/production/EraAmountController");
productionRoute.route("/eraamounts").get(getAllEraAmount);
productionRoute.route("/eraamount/new").post(addEraAmount);
productionRoute.route("/eraamount/:id").delete(deleteEraAmount).get(getSingleEraAmount).put(updateEraAmount);
productionRoute.route("/eraamountslimited").get(getAllEraAmountLimited);
productionRoute.route("/eraamountsort").post(getOverallERAAmountBySort);
productionRoute.route("/eraamountsassignbranch").post(getAllEraAmountAssignBranch);
//Revenue Amount route
const { addRevenueAmount, deleteRevenueAmount, getRevenueamountLimited, getRevenueamountLimitedHome, getAllRevenueAmountAssignBranch, revenueAmountfileDel, getOverallRevenueAmountSort, getAllRevenueAmount, getSingleRevenueAmount, updateRevenueAmount } = require("../controller/modules/production/RevenueAmountController");
productionRoute.route("/revenueamounts").get(getAllRevenueAmount);
productionRoute.route("/revenueamount/new").post(addRevenueAmount);
productionRoute.route("/revenueamountbulk").post(revenueAmountfileDel);
productionRoute.route("/revenueamountlimited").get(getRevenueamountLimited);
productionRoute.route("/revenueamountlimitedhome").post(getRevenueamountLimitedHome);
productionRoute.route("/revenueamountsort").post(getOverallRevenueAmountSort);
productionRoute.route("/revenueamount/:id").delete(deleteRevenueAmount).get(getSingleRevenueAmount).put(updateRevenueAmount);
productionRoute.route("/revenueamountassignbranch").post(getAllRevenueAmountAssignBranch);

//Process Team route
const { addProcessTeam, getFilterProcessNames, deleteProcessTeam, getAllProcessTeamAssignbranch, processTeamSort, getFilterProcessNamesLimited, getAllProcessTeam, getSingleProcessTeam, updateProcessTeam } = require("../controller/modules/production/ProcessTeamController");
productionRoute.route("/processteams").get(getAllProcessTeam);
productionRoute.route("/processteam/new").post(addProcessTeam);
productionRoute.route("/processteamsort").post(processTeamSort);
productionRoute.route("/processteam_filter").post(getFilterProcessNames);
productionRoute.route("/processteamfilterlimited").get(getFilterProcessNamesLimited);
productionRoute.route("/processteam/:id").delete(deleteProcessTeam).get(getSingleProcessTeam).put(updateProcessTeam);
productionRoute.route("/processteamsassignbranch").post(getAllProcessTeamAssignbranch);

const { getAllProductionConsolidated, addProductionConsolidated, getFilterProductionConsolidated, getSingleProductionConsolidated, updateProductionConsolidated, deleteProductionConsolidated } = require("../controller/modules/production/productionConsolidated");
productionRoute.route("/productionconsolidateds").get(getAllProductionConsolidated);
productionRoute.route("/productionconsolidated/new").post(addProductionConsolidated);
productionRoute.route("/filterproductionconsolidated").post(getFilterProductionConsolidated);
productionRoute.route("/productionconsolidated/:id").delete(deleteProductionConsolidated).get(getSingleProductionConsolidated).put(updateProductionConsolidated);

const { addDayPointsUpload, getAllDayPointsUpload, getDayPointIdByDate, getCheckDaypointIsCreated, getAllDayPointByDate, getAllDayPointsUploadLimitedDateOnly, getSingleDayPointsUpload, getEmployeeProductionLastThreeMonths, getDocumentPrepProductionDate, checkDayPointdate, getAllDayPointsUploadLimited, updateDayPointsUpload, dayPointsMonthYearFilterNxtMonth, deleteDayPointsUpload, updateDayPointsSingleUpload, dayPointsfilter, dayPointsfilterHome, dayPointsDatasFetch, dayPointsMonthYearFilter } = require("../controller/modules/production/dayPointsUpload");
productionRoute.route("/daypoints").get(getAllDayPointsUpload);
productionRoute.route("/checkdaypointiscreated").post(getCheckDaypointIsCreated);
productionRoute.route("/getdaypointsdate").post(getAllDayPointByDate);
productionRoute.route("/getemployeeproductionlastthreemonths").post(getEmployeeProductionLastThreeMonths);
productionRoute.route("/daypoint/new").post(addDayPointsUpload);
productionRoute.route("/attendancedatefilter").post(getDocumentPrepProductionDate);
productionRoute.route("/daypoint/:id").delete(deleteDayPointsUpload).get(getSingleDayPointsUpload).put(updateDayPointsUpload);
productionRoute.route("/daypointsmonthwisefilter").post(dayPointsMonthYearFilter);
productionRoute.route("/singledaypoint/:id").put(updateDayPointsSingleUpload);
productionRoute.route("/checkdaypointdate").post(checkDayPointdate);
productionRoute.route("/daypointsfilter").post(dayPointsfilter);
productionRoute.route("/daypointsfilterhome").post(dayPointsfilterHome);
productionRoute.route("/daypointsdatasfetch").post(dayPointsDatasFetch);
productionRoute.route("/daypointsmonthwisefilternxtmonth").post(dayPointsMonthYearFilterNxtMonth);
productionRoute.route("/daypointslimited").get(getAllDayPointsUploadLimited);
productionRoute.route("/daypointslimiteddateonly").get(getAllDayPointsUploadLimitedDateOnly);
productionRoute.route("/getdaypointidbydate").post(getDayPointIdByDate);


const {
  addTempPointsUpload,
  getAllTempPointsUpload,
  getSingleTempPointsUpload,
  updateTempPointsUpload,
  deleteTempPointsUpload,
  updateTempPointsSingleUpload,
  tempPointsfilter,
  tempPointsfilterHome,
  tempPointsDatasFetch
} = require("../controller/modules/production/tempPointsUpload");
productionRoute.route("/temppoints").get(getAllTempPointsUpload);
productionRoute.route("/temppoint/new").post(addTempPointsUpload);
productionRoute.route("/singletemppoint/:id").put(updateTempPointsSingleUpload);
productionRoute
  .route("/temppoint/:id")
  .delete(deleteTempPointsUpload)
  .get(getSingleTempPointsUpload)
  .put(updateTempPointsUpload);
productionRoute.route("/temppointsfilter").post(tempPointsfilter);
productionRoute.route("/temppointsfilterhome").post(tempPointsfilterHome);
productionRoute.route("/temppointsdatasfetch").post(tempPointsDatasFetch);
const { getAllProductionTempConsolidated, addProductionTempConsolidated, getFilterProductionTempConsolidated, getSingleProductionTempConsolidated, updateProductionTempConsolidated, deleteProductionTempConsolidated } = require("../controller/modules/production/productionTempConsolidated");
productionRoute.route("/productiontempconsolidateds").get(getAllProductionTempConsolidated);
productionRoute.route("/productiontempconsolidated/new").post(addProductionTempConsolidated);
productionRoute.route("/filterproductiontempconsolidated").post(getFilterProductionTempConsolidated);
productionRoute.route("/productiontempconsolidated/:id").delete(deleteProductionTempConsolidated).get(getSingleProductionTempConsolidated).put(updateProductionTempConsolidated);

//  training details backend route
const { addMinimumPoints, deleteMultipleMinimumPoints, deleteMinimumPoints, getAllMinimumPointsAcessbranch, getAllMinimumPoints, getSingleMinimumPoints, updateMinimumPoints } = require("../controller/modules/production/minimumpoints");
productionRoute.route("/minimumpointss").get(getAllMinimumPoints);
productionRoute.route("/minimumpoints/new").post(addMinimumPoints);
productionRoute.route("/minimumpointssaccessbranch").post(getAllMinimumPointsAcessbranch);
productionRoute.route("/minimumpoints/:id").get(getSingleMinimumPoints).put(updateMinimumPoints).delete(deleteMinimumPoints);
productionRoute
  .route("/minimumpointsbulkdelete")
  .post(deleteMultipleMinimumPoints);


// Paid Status fix route
const {
  getpaidstatusListExcelDownload, getpaidstatusListCsvDownload, getAllpaidstatusListPdflDownload,
  addPaidstatusfix, deletePaidstatusfix, getAllPaidstatusfix, getOverAllEditPayrunList, getAllPayrunCheck,
  getAllFilterPaidStatusfixDatas, getAllPaidstatusfixFiltered, PaidstatusfixSort, getPaidstatusfixLimited, xeroxPaidStatusFixFilter,
  getSinglePaidstatusfix, updatePaidstatusfix } = require("../controller/modules/production/paidstatusfix");
productionRoute.route("/paidstatusfixs").get(getAllPaidstatusfix);
productionRoute.route("/paidstatusfixsort").post(PaidstatusfixSort);
productionRoute.route("/paidstatusfix/new").post(addPaidstatusfix);
productionRoute.route("/xeroxpaidstatusfixfilter").post(xeroxPaidStatusFixFilter);
productionRoute.route("/paidstatusfixsfiltered").post(getAllPaidstatusfixFiltered);
productionRoute.route("/paidstatusfixslimited").post(getPaidstatusfixLimited);
productionRoute.route("/filterpaidstatusfixdatas").post(getAllFilterPaidStatusfixDatas);
productionRoute.route("/paidstatusfix/:id").get(getSinglePaidstatusfix).put(updatePaidstatusfix).delete(deletePaidstatusfix);
productionRoute.route("/checkpaidstatuspayrun").post(getAllPayrunCheck);
productionRoute.route("/getoveralleditpayrunlist").post(getOverAllEditPayrunList);
//exports
productionRoute.route("/paidstatuslistexcel").post(getpaidstatusListExcelDownload);
productionRoute.route("/paidstatuslistcsv").post(getpaidstatusListCsvDownload);
productionRoute.route("/paidstatuslistpdf").post(getAllpaidstatusListPdflDownload);

// Paid Date fix route
const {
  getAllpaiddatefixPdflDownload, getpaiddatefixCsvDownload, getpaiddatefixExcelDownload,
  addPaiddatefix, deletePaiddatefix, getAllPaiddatefix, paidDateFixedFutureDatesOnly, getAllPaiddatefixFiltered, PaiddatefixSort, getSinglePaiddatefix, updatePaiddatefix } = require("../controller/modules/production/paiddatefix");
productionRoute.route("/paiddatefixs").get(getAllPaiddatefix);
productionRoute.route("/paiddatefix/new").post(addPaiddatefix);
productionRoute.route("/paiddatefixssort").post(PaiddatefixSort);
productionRoute.route("/paiddatefixedfuturedatesonly").get(paidDateFixedFutureDatesOnly);
productionRoute.route("/paiddatefixfitlered").post(getAllPaiddatefixFiltered);
productionRoute.route("/paiddatefix/:id").get(getSinglePaiddatefix).put(updatePaiddatefix).delete(deletePaiddatefix);


//exports
productionRoute.route("/paiddateexcel").get(getpaiddatefixExcelDownload);
productionRoute.route("/paiddatecsv").get(getpaiddatefixCsvDownload);
productionRoute.route("/paiddatepdf").get(getAllpaiddatefixPdflDownload);


// Paid Date mode route
const { addPaiddatemode, deletePaiddatemode, getOverAllEditPaiddatefix, getAllPaiddatefixCheck, getAllPaiddatemode, getXeoxFilterPaiddatemode, getSinglePaiddatemode, updatePaiddatemode } = require("../controller/modules/production/paiddatemode");
productionRoute.route("/paiddatemodes").get(getAllPaiddatemode);
productionRoute.route("/paiddatemode/new").post(addPaiddatemode);
productionRoute.route("/xeroxfilterpaiddatemodes").post(getXeoxFilterPaiddatemode);
productionRoute.route("/paiddatemode/:id").get(getSinglePaiddatemode).put(updatePaiddatemode).delete(deletePaiddatemode);
productionRoute.route("/checkpaiddatefix").post(getAllPaiddatefixCheck);
productionRoute.route("/getoveralleditpaiddatefix").post(getOverAllEditPaiddatefix);

//  production original backend route
//  production original backend route


const { addProductionOriginal, deleteProductionOriginal, productionOriginalLastThree, getUniqidFromDateProdupload, getAllProductionOriginalLimitedFilter, getAllProductionOriginal, getAllProductionOriginalLimited, getAllProductionOriginalLimitedUniqid, getSingleProductionOriginal, updateProductionOriginal } = require("../controller/modules/production/productionoriginal");
productionRoute.route("/productionoriginals").get(getAllProductionOriginal);
productionRoute.route("/productionoriginal/new").post(addProductionOriginal);
productionRoute.route("/productionoriginal/:id").get(getSingleProductionOriginal).put(updateProductionOriginal).delete(deleteProductionOriginal);
productionRoute.route("/productionoriginalslimited").get(getAllProductionOriginalLimited);
productionRoute.route("/productionoriginalslimiteduniqid").get(getAllProductionOriginalLimitedUniqid);
productionRoute.route("/productionoriginalslimitedfilter").post(getAllProductionOriginalLimitedFilter);
productionRoute.route("/getuniqidfromdateprodupload").post(getUniqidFromDateProdupload);
productionRoute.route("/productionoriginallastthree").get(productionOriginalLastThree);

// //  production temp backend route
// const { addProductionTemp,deleteProductionTemp,getAllProductionTemp,getAllProductionTempLimited,getAllProductionTempLimitedUniqid,getSingleProductionTemp,updateProductionTemp } = require("../controller/modules/production/productiontemp");
// productionRoute.route("/productionstemp").get(getAllProductionTemp);
// productionRoute.route("/productiontemp/new").post(addProductionTemp);
// productionRoute.route("/productiontemp/:id").get(getSingleProductionTemp).put(updateProductionTemp).delete(deleteProductionTemp); 
// productionRoute.route("/productiontemplimited").get(getAllProductionTempLimited);
// productionRoute.route("/productiontemplimiteduniqid").get(getAllProductionTempLimitedUniqid);

//  production upload backend route
const { getAllProductionUploadFilenames, productionDayCategoryIdFilter, bulkProductionOrgUpdateCategorySubcategory,
  bulkDeleteUnitRateUnallot, updateBulkDatasUnitandFlag, updateBulkDatasUnitandSection, updateBulkDatasFlagOnly,
  updateBulkDatasUnitOnly, getProductionUploadDatasById, undoFieldName, productionUploadCheckMismatchPresentFilter,
  productionUploadCheckStatus, getMismatchUpdatedList, getAllProductionUnAllotFilterViewManual, getProductionSingleDayUser,
  productionUploadCheckZeroMismatchPresent, getSingleDateDataforprodDay, getAllProductionUnAllotFilter, getAllProductionUnAllotFilterView,
  getAllProductionUploadFilter, getAllProductionReportFilter, productionUploadOverAllFetchLimited, productionUploadOverAllFetchLimitedNew,
  getAllProductionUploadGetdeletedatasall, getAllProductionUploadGetdeletedatas, deleteProductionUploadsMutli, getAllProductionUploadFilenamesonly, addProductionUpload, deleteProductionUpload, getAllProductionUpload, getSingleProductionUpload, updateProductionUpload,
  productionUploadUnitrateOverallFetchlimited, getAllProductionUploadQueueMasterFilter, getAllProductionUploadOriginalSummaryReport, getAllProductionUploadOriginalSummaryReportBulk,
  getAllProductionUploadQueueMasterFilterCount, getAllProductionUploadFilenamesonlyBulkDownload, getAllProductionTempSummaryReport,
  getAllProductionUploadOriginalSummaryReportView, getAllProductionTempSummaryReportView, getAllProductionUploadQueueMasterFilterUnAssigned
}
  = require("../controller/modules/production/productionupload");
productionRoute.route("/productionuploads").get(getAllProductionUpload);
productionRoute.route("/productionuploadfilenameonlybulkdownload").post(getAllProductionUploadFilenamesonlyBulkDownload);
productionRoute.route("/productionupload/new").post(addProductionUpload);
productionRoute.route("/productionuploadqueuemasterfilter").post(getAllProductionUploadQueueMasterFilter);
productionRoute.route("/productionuploadqueuemasterfilterunassigned").post(getAllProductionUploadQueueMasterFilterUnAssigned);
productionRoute.route("/productionuploadoriginalsummayreport").post(getAllProductionUploadOriginalSummaryReport);
productionRoute.route("/productionuploadoriginalsummayreportview").post(getAllProductionUploadOriginalSummaryReportView);
productionRoute.route("/productiontempsummayreportview").post(getAllProductionTempSummaryReportView);
productionRoute.route("/productionuploadoriginalsummayreportbulk").post(getAllProductionUploadOriginalSummaryReportBulk);
productionRoute.route("/productiontempsummayreport").post(getAllProductionTempSummaryReport);
productionRoute.route("/productionuploadqueuemasterfiltercount").post(getAllProductionUploadQueueMasterFilterCount);
productionRoute.route("/productionupload/:id").get(getSingleProductionUpload).put(updateProductionUpload).delete(deleteProductionUpload);
productionRoute.route("/productionuploadfilenamelist").post(getAllProductionUploadFilenames);
productionRoute.route("/productionuploadfilenameonly").post(getAllProductionUploadFilenamesonly);
productionRoute.route("/productiondaygetsingledatedataday").post(getSingleDateDataforprodDay);
productionRoute.route("/productionuploadgetdeletedatas").post(getAllProductionUploadGetdeletedatas);
productionRoute.route("/productionuploadgetdeletedatasall").post(getAllProductionUploadGetdeletedatasall);
productionRoute.route("/productionuploaddeletemulti").post(deleteProductionUploadsMutli);
productionRoute.route("/productionuploadoverallfetchlimited").post(productionUploadOverAllFetchLimited);
productionRoute.route("/productionuploadoverallfetchlimitednew").post(productionUploadOverAllFetchLimitedNew);
productionRoute.route("/productionuploadfilter").post(getAllProductionUploadFilter)
productionRoute.route("/productionreportfilter").post(getAllProductionReportFilter);
productionRoute.route("/getproductionsignledayuser").post(getProductionSingleDayUser);
productionRoute.route("/checkzeromismatchpresent").post(productionUploadCheckZeroMismatchPresent);
productionRoute.route("/productionuploadunitrateoverallfetchlimited").post(productionUploadUnitrateOverallFetchlimited);
productionRoute.route("/productionunallotfilter").post(getAllProductionUnAllotFilter);
productionRoute.route("/productionunallotfilterview").post(getAllProductionUnAllotFilterView);
productionRoute.route("/productionunallotfilterviewmanual").post(getAllProductionUnAllotFilterViewManual);
productionRoute.route("/getmismatchupdatedlist").post(getMismatchUpdatedList);
productionRoute.route("/updatefieldundoname").post(undoFieldName);
productionRoute.route("/productionuploadcheckstatus").post(productionUploadCheckStatus);
productionRoute.route("/getmismatchdatasid").post(productionUploadCheckMismatchPresentFilter);
productionRoute.route("/getproductionuploaddatasbyid").post(getProductionUploadDatasById);
productionRoute.route("/updatedbulkdatasunitandflag").post(updateBulkDatasUnitandFlag);
productionRoute.route("/updatedbulkdatasunitonly").post(updateBulkDatasUnitOnly);
productionRoute.route("/updatedbulkdatasflagonly").post(updateBulkDatasFlagOnly);
productionRoute.route("/updatedbulkdatasunitandsection").post(updateBulkDatasUnitandSection);
productionRoute.route("/bulkdeleteunitrateunallot").post(bulkDeleteUnitRateUnallot);
productionRoute.route("/bulkproductionorgupdatecategorysubcategory").post(bulkProductionOrgUpdateCategorySubcategory);

//  production temp backend route
const { addProductionTemp, deleteProductionTemp, getUniqidFromDateProduploadTemp, getAllProductionTempLimitedFilter, getAllProductionTemp, getAllProductionTempLimited, getAllProductionTempLimitedUniqid, getSingleProductionTemp, updateProductionTemp } = require("../controller/modules/production/productiontemp");
productionRoute.route("/productionstemp").get(getAllProductionTemp);
productionRoute.route("/productiontemp/new").post(addProductionTemp);
productionRoute.route("/productiontemp/:id").get(getSingleProductionTemp).put(updateProductionTemp).delete(deleteProductionTemp);
productionRoute.route("/productiontemplimited").get(getAllProductionTempLimited);
productionRoute.route("/productiontemplimiteduniqid").get(getAllProductionTempLimitedUniqid);
productionRoute.route("/productiontemplimitedfilter").post(getAllProductionTempLimitedFilter);
productionRoute.route("/productiondaycategoryidfilter").post(productionDayCategoryIdFilter);
productionRoute.route("/getuniqidfromdateproduploadtemp").post(getUniqidFromDateProduploadTemp);

//  production upload backend route
const { getAllProductionTempUploadAllFilenames, getAllproductiontempFilter, getAllproductionAttendancesFilter, getSingleDateDataforprodDayTemp, getAllProductionTempReportFilter, productionDayCategoryIdFilterTemp, getProductionSingleDayUserTemp, productionUploadCheckZeroMismatchPresentTemp, undoFieldNameTemp, productionUploadCheckStatusTemp, getMismatchUpdatedListTemp, getProductionUploadDatasByIdManualTemp, bulkProductionTempUpdateCategorySubcategory, getProductionUploadDatasByIdTemp, productionTempCheckMismatchPresentFilter, bulkDeleteUnitRateUnallottemp, updateBulkDatasUnitandSectiontemp, updateBulkDatasFlagOnlytemp, updateBulkDatasUnitandFlagtemp, updateBulkDatasUnitOnlytemp, productionTempUploadOverAllFetchLimited, getAllProductionUnAllotFilterTemp, getAllProductionUnAllotFilterViewTemp, getAllProductionUnAllotFilterViewTempManual, productionTempUploadOverAllFetchLimitedNew, getAllProductionTempUploadAllGetdeletedatasall, getAllProductionTempUploadAllGetdeletedatas, deleteProductionTempUploadAllsMutli, getAllProductionTempUploadAllFilenamesonly, addProductionTempUploadAll, deleteProductionTempUploadAll, getAllProductionTempUploadAll, getSingleProductionTempUploadAll, updateProductionTempUploadAll } = require("../controller/modules/production/productiontempuploadall");
productionRoute.route("/productiontempuploadsall").get(getAllProductionTempUploadAll);
productionRoute.route("/productiontempuploadall/new").post(addProductionTempUploadAll);
productionRoute.route("/productiontempreportfilter").post(getAllProductionTempReportFilter);
productionRoute.route("/productiontempfilter").post(getAllproductiontempFilter);
productionRoute.route("/productiondaycategoryidfiltertemp").post(productionDayCategoryIdFilterTemp);
productionRoute.route("/productiontempuploadall/:id").get(getSingleProductionTempUploadAll).put(updateProductionTempUploadAll).delete(deleteProductionTempUploadAll);
productionRoute.route("/productiontempuploadallfilenamelist").post(getAllProductionTempUploadAllFilenames);
productionRoute.route("/productiontempuploadallfilenameonly").post(getAllProductionTempUploadAllFilenamesonly);
productionRoute.route("/productiontempuploadallgetdeletedatas").post(getAllProductionTempUploadAllGetdeletedatas);
productionRoute.route("/productiontempuploadallgetdeletedatasall").post(getAllProductionTempUploadAllGetdeletedatasall);
productionRoute.route("/productiontempuploadalldeletemulti").post(deleteProductionTempUploadAllsMutli);
productionRoute.route("/productiontempuploadalloverallfetchlimited").post(productionTempUploadOverAllFetchLimited);
productionRoute.route("/productiontempuploadoverallfetchlimitednew").post(productionTempUploadOverAllFetchLimitedNew);

productionRoute.route("/productiontempunallotfiltertemp").post(getAllProductionUnAllotFilterTemp);
productionRoute.route("/productiontempviewfilter").post(getAllProductionUnAllotFilterViewTemp);
productionRoute.route("/productiontempviewmanualfilter").post(getAllProductionUnAllotFilterViewTempManual);

productionRoute.route("/updatedbulkdatasunitandflagtemp").post(updateBulkDatasUnitandFlagtemp);
productionRoute.route("/updatedbulkdatasunitonlytemp").post(updateBulkDatasUnitOnlytemp);
productionRoute.route("/updatedbulkdatasflagonlytemp").post(updateBulkDatasFlagOnlytemp);
productionRoute.route("/updatedbulkdatasunitandsectiontemp").post(updateBulkDatasUnitandSectiontemp);
productionRoute.route("/bulkdeleteunitrateunallottemp").post(bulkDeleteUnitRateUnallottemp);

productionRoute.route("/getmismatchdatasidtemp").post(productionTempCheckMismatchPresentFilter);
productionRoute.route("/getproductionuploaddatasbyidtemp").post(getProductionUploadDatasByIdTemp);
productionRoute.route("/getproductionuploaddatasbyidmanualtemp").post(getProductionUploadDatasByIdManualTemp);
productionRoute.route("/bulkproductiontempupdatecategorysubcategory").post(bulkProductionTempUpdateCategorySubcategory);

productionRoute.route("/getmismatchupdatedlisttemp").post(getMismatchUpdatedListTemp);
productionRoute.route("/updatefieldundonametemp").post(undoFieldNameTemp);
productionRoute.route("/productionuploadcheckstatustemp").post(productionUploadCheckStatusTemp);
productionRoute.route("/checkzeromismatchpresenttemp").post(productionUploadCheckZeroMismatchPresentTemp);
productionRoute.route("/getproductionsignledayusertemp").post(getProductionSingleDayUserTemp);
productionRoute.route("/productiondaygetsingledatedatadaytemp").post(getSingleDateDataforprodDayTemp);
productionRoute.route("/productiontempattendancesfilter").post(getAllproductionAttendancesFilter);
//  training details backend route
const { addUnitrate, deleteUnitrate, getAllUnitrate, getSingleUnitrate, getAllUnitrateOrateSubCategory, getAllUnitrateOrateCategory, checkUnitRateForProdUpload, unitrateSort, checkUnitrateForManualCreation, getprodunitrategetmulti, getAllUnitrateProdLimited, getProductionUnitrateProUploadLimited, updateUnitrate, unitrateFilterCategoriesLimited, unitrateFilterCategoryLimited, unitrateFilterLimited } = require("../controller/modules/production/productionunitrate");
productionRoute.route("/unitsrate").get(getAllUnitrate);
productionRoute.route("/unitrate/new").post(addUnitrate);
productionRoute.route("/unitsratesort").post(unitrateSort);


productionRoute.route("/unitrateoratecategory").post(getAllUnitrateOrateCategory);
productionRoute.route("/unitsrateoratesubcategory").post(getAllUnitrateOrateSubCategory);



productionRoute.route("/unitrate/:id").get(getSingleUnitrate).put(updateUnitrate).delete(deleteUnitrate);
productionRoute.route("/unitratefilterlimited").post(unitrateFilterLimited);
productionRoute.route("/getprodunitrategetmulti").post(getprodunitrategetmulti);
productionRoute.route("/checkunitrateformanualcreation").post(checkUnitrateForManualCreation);
productionRoute.route("/unitratefiltercategorylimited").post(unitrateFilterCategoryLimited);
productionRoute.route("/unitratefiltercategorieslimited").post(unitrateFilterCategoriesLimited);
productionRoute.route("/unitrateprodlimited").get(getAllUnitrateProdLimited);
productionRoute.route("/productionunitrateproduploadlimited").get(getProductionUnitrateProUploadLimited);
productionRoute.route("/checkunitrateforprodupload").post(checkUnitRateForProdUpload);
//  training details backend route
const { addCategoryprod, deleteCategoryprod, getAllCategoryprodLimited, fetchEnbalePagesBasedProjCateSub, checkCategoryForProdUpload, CategoryprodSort, getAllCategoryprod,
  getSingleCategoryprod, updateCategoryprod, categoryProdLimitedReportsMulti,
  getAllCategoryprodLimitedOriginal, categoryProdLimitedOrgFlagCalc,
  categoryProdLimitedProductionQueueType, categoryLimitedNameonly, categoryLimitedKeyword } = require("../controller/modules/production/categoryprod");
productionRoute.route("/categoriesprod").get(getAllCategoryprod);
productionRoute.route("/categoryprod/new").post(addCategoryprod);
productionRoute.route("/categorylimitedkeyword").get(categoryLimitedKeyword);
productionRoute.route("/categoryprodlimitedoriginal").get(getAllCategoryprodLimitedOriginal);
productionRoute.route("/categoryprodlimited").get(getAllCategoryprodLimited);
productionRoute.route("/categoryprodlimitedorgflagcalc").get(categoryProdLimitedOrgFlagCalc);
productionRoute.route("/categoriesprodsort").post(CategoryprodSort);
productionRoute.route("/categoryprod/:id").get(getSingleCategoryprod).put(updateCategoryprod).delete(deleteCategoryprod);
productionRoute.route("/checkcategoryforprodupload").post(checkCategoryForProdUpload);
productionRoute.route("/categoryprodlimitedreportsmultiselect").post(categoryProdLimitedReportsMulti);
productionRoute.route("/categoryprodlimitedproductionqueuetypemaster").post(categoryProdLimitedProductionQueueType);
productionRoute.route("/categorylimitednameonly").post(categoryLimitedNameonly);
productionRoute.route("/fetchenbalepagesbasedprojcatesub").post(fetchEnbalePagesBasedProjCateSub);

//  training details backend route
const { addSubCategoryprod, deleteSubCategoryprod, checkSubCategoryForProdUpload, getListSubcategoryProdLimitedReport, subCategoryProdLimitedUnallot,
  getListSubcaegoryprodLimited, getListSubcaegoryprodLimitedPagination, checkSubCategoryForManualCreation, subcategoryAllLimitedByProjCate,
  getUnitrateAllSubCategoryprod, getAllSubCategoryprod, getAllSubCategoryprodLimited, getSingleSubCategoryprod, subCategoryProdLimitedReportsMulti,
  updateSubCategoryprod } = require("../controller/modules/production/subcategoryprod");
productionRoute.route("/subcategoriesprod").get(getAllSubCategoryprod);
productionRoute.route("/subcategoryprod/new").post(addSubCategoryprod);
productionRoute.route("/subcategoryprodlimitedunallot").post(subCategoryProdLimitedUnallot);

productionRoute.route("/subcategoryalllimitedbyprojcate").post(subcategoryAllLimitedByProjCate);

productionRoute.route("/unitratecatsubprod").post(getUnitrateAllSubCategoryprod);
productionRoute.route("/subcategoryprod/:id").get(getSingleSubCategoryprod).put(updateSubCategoryprod).delete(deleteSubCategoryprod);
productionRoute.route("/subcategoryprodlimited").get(getAllSubCategoryprodLimited);
productionRoute.route("/getlistsubcategoryprodlimited").get(getListSubcaegoryprodLimited);
productionRoute.route("/checksubcategoryformanualcreation").post(checkSubCategoryForManualCreation);
productionRoute.route("/getlistsubcategoryprodlimitedpagination").post(getListSubcaegoryprodLimitedPagination);
productionRoute.route("/checksubcategoryforprodupload").post(checkSubCategoryForProdUpload);
productionRoute.route("/getlistsubcategoryprodlimitedreport").get(getListSubcategoryProdLimitedReport);
productionRoute.route("/subcategoryprodlimitedreportsmultiselect").post(subCategoryProdLimitedReportsMulti);

const {
  addCategoryprocessmap,
  deleteCategoryprocessmap,
  getAllCategoryprocessmap,
  getSingleCategoryprocessmap,
  updateCategoryprocessmap,
  deleteMultipleCategoryprocessmap,
  categoryprocessmapSort,
  getAllcategoryprocessmapslimited, getAllCategoryprocessmapAssignBranch
} = require("../controller/modules/production/categoryprocessmap");
productionRoute.route("/categoryprocessmaps").get(getAllCategoryprocessmap);
productionRoute.route("/categoryprocessmapssort").post(categoryprocessmapSort);
productionRoute.route("/categoryprocessmap/new").post(addCategoryprocessmap);
productionRoute.route("/categoryprocessmapsassignbranch").post(getAllCategoryprocessmapAssignBranch);
productionRoute.route("/categoryprocessmapslimited").get(getAllcategoryprocessmapslimited);
productionRoute
  .route("/categoryprocessmapmutidelete")
  .post(deleteMultipleCategoryprocessmap);
productionRoute
  .route("/categoryprocessmap/:id")
  .get(getSingleCategoryprocessmap)
  .put(updateCategoryprocessmap)
  .delete(deleteCategoryprocessmap);

const { getAllManagecategory, getSingleManagecategory, ManagecategorySort, updateManagecategory, addManagecategory, deleteManagecategory } = require("../controller/modules/production/managecategory");
productionRoute.route("/managecategorys").get(getAllManagecategory);
productionRoute.route("/managecategoryssort").post(ManagecategorySort);
productionRoute.route("/managecategory/new").post(addManagecategory);
productionRoute.route("/managecategory/:id").delete(deleteManagecategory).get(getSingleManagecategory).put(updateManagecategory);

//Production process queue
const { getAllProductionProcessQueue, productionProcessQueueLimitedByProject, addProductionProcessQueue, getSingleProductionProcessQueue, updateProductionProcessQueue, deleteProductionProcessQueue } = require("../controller/modules/penalty/productionprocessqueue");
productionRoute.route("/productionprocessqueue").get(getAllProductionProcessQueue);
productionRoute.route("/productionprocessqueue/new").post(addProductionProcessQueue);
productionRoute.route("/productionprocessqueuelimitedbyproject").post(productionProcessQueueLimitedByProject);

productionRoute.route("/productionprocessqueue/:id").get(getSingleProductionProcessQueue).put(updateProductionProcessQueue).delete(deleteProductionProcessQueue);

//for penalty error upload
const { getAllPenaltyErrorUpload, addPenaltyErrorUpload, getSinglePenaltyErrorUpload, updatePenaltyErrorUpload, deletePenaltyErrorUpload,
  getAllPenaltyErrorUploadFilter, getAllPenaltyErrorUploadFilterStatus, getAllPenaltyErrorUploadInvalidEntry } = require("../controller/modules/penalty/errortype");
productionRoute.route("/errortypes").get(getAllPenaltyErrorUpload);
productionRoute.route("/errortypeinvaliderrorentry").post(getAllPenaltyErrorUploadInvalidEntry);
productionRoute.route("/errortype/new").post(addPenaltyErrorUpload);
productionRoute.route("/errortypefilter").post(getAllPenaltyErrorUploadFilter);
productionRoute.route("/errortypefilterstatus").post(getAllPenaltyErrorUploadFilterStatus);
productionRoute.route("/errortype/:id").get(getSinglePenaltyErrorUpload).put(updatePenaltyErrorUpload).delete(deletePenaltyErrorUpload);


const { addpayruncontrol, deletepayruncontrol, getAllpayruncontrol, getUserNamesbasedOnStatusPayRun, getFilterPayRunreportData, getFilterPayRunEmployeenamesData, getAllpayruncontrolByAssignBranch, getAllpayruncontrolLimited, getSinglepayruncontrol, updatepayruncontrol } = require("../controller/modules/production/payruncontrol");
productionRoute.route("/payruncontrols").get(getAllpayruncontrol);
productionRoute.route("/payruncontrol/new").post(addpayruncontrol);
productionRoute.route("/employeenamesstatuswisepayrun").post(getUserNamesbasedOnStatusPayRun);
productionRoute.route("/filterpayrunemployeenames").post(getFilterPayRunEmployeenamesData);
productionRoute.route("/filterpayrunreportdata").post(getFilterPayRunreportData);
productionRoute.route("/payruncontrolslimited").get(getAllpayruncontrolLimited);
productionRoute.route("/payruncontrol/:id").delete(deletepayruncontrol).get(getSinglepayruncontrol).put(updatepayruncontrol);
productionRoute.route("/payruncontrolsbyassignbranch").post(getAllpayruncontrolByAssignBranch);




//Experience BAsewavier master
const { getAllExperiencebase, addExperiencebase, getSingleExperiencebase, updateExperiencebase, deleteExperiencebase } = require("../controller/modules/production/experiencebasewavier");
productionRoute.route("/expericencebases").get(getAllExperiencebase);
productionRoute.route("/expericencebase/new").post(addExperiencebase);
productionRoute.route("/expericencebase/:id").get(getSingleExperiencebase).put(updateExperiencebase).delete(deleteExperiencebase);

//Master Filed name
const { getAllMasterfieldname, addMasterfieldname, getSingleMasterfieldname, updateMasterfieldname, deleteMasterfieldname } = require("../controller/modules/production/masterfieldname");
productionRoute.route("/masterfieldnames").get(getAllMasterfieldname);
productionRoute.route("/masterfieldname/new").post(addMasterfieldname);
productionRoute.route("/masterfieldname/:id").get(getSingleMasterfieldname).put(updateMasterfieldname).delete(deleteMasterfieldname);

//Other Penaltyname
const { getAllOtherpenaltycontrol, addOtherpenaltycontrol, getSingleOtherpenaltycontrol, updateOtherpenaltycontrol, deleteOtherpenaltycontrol } = require("../controller/modules/production/otherpenaltycontrol");
productionRoute.route("/otherpenaltycontrols").get(getAllOtherpenaltycontrol);
productionRoute.route("/otherpenaltycontrol/new").post(addOtherpenaltycontrol);
productionRoute.route("/otherpenaltycontrol/:id").get(getSingleOtherpenaltycontrol).put(updateOtherpenaltycontrol).delete(deleteOtherpenaltycontrol);

//for error reason
const { getAllPenaltyErrorReason, addPenaltyErrorReason, getSinglePenaltyErrorReason, updatePenaltyErrorReason, deletePenaltyErrorReason, getAllPenaltyErrorReasonFilter } = require("../controller/modules/production/errorreason");
productionRoute.route("/penaltyerrorreason").get(getAllPenaltyErrorReason);
productionRoute.route("/penaltyerrorreason/new").post(addPenaltyErrorReason);

productionRoute.route("/penaltyerrorreason/:id").get(getSinglePenaltyErrorReason).put(updatePenaltyErrorReason).delete(deletePenaltyErrorReason);
productionRoute.route("/penaltyerrorreasonfilter").post(getAllPenaltyErrorReasonFilter);

//for error control
const { getAllPenaltyErrorControl, addPenaltyErrorControl, getSinglePenaltyErrorControl, updatePenaltyErrorControl, deletePenaltyErrorControl } = require("../controller/modules/production/errorcontrol");

productionRoute.route("/penaltyerrorcontrol").get(getAllPenaltyErrorControl);
productionRoute.route("/penaltyerrorcontrol/new").post(addPenaltyErrorControl);
productionRoute.route("/penaltyerrorcontrol/:id").get(getSinglePenaltyErrorControl).put(updatePenaltyErrorControl).delete(deletePenaltyErrorControl);


const { getAllManageidlework, getSingleManageidlework, updateManageidlework, addManageidlework, deleteManageidlework } = require("../controller/modules/production/idlework");
productionRoute.route("/manageidleworks").get(getAllManageidlework);
productionRoute.route("/manageidlework/new").post(addManageidlework);
productionRoute.route("/manageidlework/:id").delete(deleteManageidlework).get(getSingleManageidlework).put(updateManageidlework);


const { getAllNonProductionUnitRate, addNonProductionUnitRate, getSingleNonProductionUnitRate, updateNonProductionUnitRate, deleteNonProductionUnitRate } = require("../controller/modules/production/nonproductionunitrate");
productionRoute.route("/nonproductionunitrate").get(getAllNonProductionUnitRate);
productionRoute.route("/nonproductionunitrate/new").post(addNonProductionUnitRate);
productionRoute.route("/nonproductionunitrate/:id").get(getSingleNonProductionUnitRate).put(updateNonProductionUnitRate).delete(deleteNonProductionUnitRate);

//for category and subcategory
const { getAllCategoryAndSubcategory, addCategoryAndSubcategory, getSingleCategoryAndSubcategory, updateCategoryAndSubcategory, deleteCategoryAndSubcategory } = require("../controller/modules/production/categoryandsubcategory");
productionRoute.route("/categoryandsubcategory").get(getAllCategoryAndSubcategory);
productionRoute.route("/categoryandsubcategory/new").post(addCategoryAndSubcategory);
productionRoute.route("/categoryandsubcategory/:id").get(getSingleCategoryAndSubcategory).put(updateCategoryAndSubcategory).delete(deleteCategoryAndSubcategory);



const { getAllManageCategoryPercentage, addManageCategoryPercentage, getSingleManageCategoryPercentage, updateManageCategoryPercentage, deleteManageCategoryPercentage } = require("../controller/modules/production/categorypercentage");
productionRoute.route("/managecategorypercentage").get(getAllManageCategoryPercentage);
productionRoute.route("/managecategorypercentage/new").post(addManageCategoryPercentage);
productionRoute.route("/managecategorypercentage/:id").get(getSingleManageCategoryPercentage).put(updateManageCategoryPercentage).delete(deleteManageCategoryPercentage);

//for production client rate
const { getAllProductionClientRate, addProductionClientRate, getSingleProductionClientRate, deleteProductionClientRate, updateProductionClientRate } = require("../controller/modules/production/productionclientrate");
productionRoute.route("/productionclientrate").get(getAllProductionClientRate);
productionRoute.route("/productionclientrate/new").post(addProductionClientRate);
productionRoute.route("/productionclientrate/:id").get(getSingleProductionClientRate).put(updateProductionClientRate).delete(deleteProductionClientRate);


const { getAllNonproductionunitallot, deleteNonproductionunitallot, updateNonproductionunitallot, getSingleNonproductionunitallot, addNonproductionunitallot } = require("../controller/modules/production/nonproduction/NonproductionunitallotController");
productionRoute.route("/nonproductionunitallot").get(getAllNonproductionunitallot);
productionRoute.route("/nonproductionunitallot/new").post(addNonproductionunitallot);
productionRoute.route("/nonproductionunitallot/:id").get(getSingleNonproductionunitallot).put(updateNonproductionunitallot).delete(deleteNonproductionunitallot);

const { addPenaltyClientAmountUpload, updatePenaltyClientAmountUpload, deletePenaltyClientAmountUpload, getAllPenaltyClientAmountUpload, getSinglePenaltyClientAmountUpload, updatePenaltyClientAmountSingleUpload } = require("../controller/modules/production/penaltyclienterrorupload");
productionRoute.route("/penaltyclientamounts").get(getAllPenaltyClientAmountUpload);
productionRoute.route("/penaltyclientamount/new").post(addPenaltyClientAmountUpload);
productionRoute
  .route("/penaltyclientamount/:id")
  .delete(deletePenaltyClientAmountUpload)
  .get(getSinglePenaltyClientAmountUpload)
  .put(updatePenaltyClientAmountUpload);
productionRoute.route("/singlepenaltyclientamount/:id").put(updatePenaltyClientAmountSingleUpload);

// Penalty day upload
const { addPenaltydayupload, getAllPenaltydayupload, getPenaltydayuploadLimited, getAllPenaltydayuploadFilterList,
  getAllPenaltydayuploadFilter, getSinglePenaltydayupload, updatePenaltydayupload, deletePenaltydayupload,
  updatePenaltydaySingleupload, getAllPenaltyDayByDate, getAllPenaltydayuploadcheckcreated, getAllPenaltydayuploadcheckcreatedUploadWise
} = require("../controller/modules/penalty/penaltydayupload");
productionRoute.route("/penaltydayuploads").post(getAllPenaltydayupload);
productionRoute.route("/checkpeanltydaycreated").post(getAllPenaltydayuploadcheckcreated);
productionRoute.route("/checkpeanltydaycreateduploadwise").post(getAllPenaltydayuploadcheckcreatedUploadWise);
productionRoute.route("/penaltydayupload/new").post(addPenaltydayupload);
productionRoute.route("/penaltydayuploadsfilter").post(getAllPenaltydayuploadFilter);
productionRoute.route("/penaltydayuploadsfilterlist").post(getAllPenaltydayuploadFilterList);
productionRoute.route("/penaltydayuploadbydate").post(getAllPenaltyDayByDate);
productionRoute.route("/penaltydayupload/:id").delete(deletePenaltydayupload).get(getSinglePenaltydayupload).put(updatePenaltydayupload);
productionRoute.route("/singlepenaltydayupload/:id").put(updatePenaltydaySingleupload);
productionRoute.route("/penaltydayuploadsfiltered").post(getPenaltydayuploadLimited);


// manage penalty month 
const { getAllManagepenaltymonth, getAllPenaltyMonthView, getAllPenaltyMonthViewIndividual, addManagepenaltymonth, getFilterManagepenaltymonth, getSingleManagepenaltymonth, updateManagepenaltymonth, deleteManagepenaltymonth } = require("../controller/modules/penalty/penaltymonth");
productionRoute.route("/managepenaltymonths").get(getAllManagepenaltymonth);
productionRoute.route("/managepenaltymonthsview").post(getAllPenaltyMonthView);
productionRoute.route("/managepenaltymonthsviewindividual").post(getAllPenaltyMonthViewIndividual);
productionRoute.route("/managepenaltymonth/new").post(addManagepenaltymonth);
productionRoute.route("/filtermanagepenaltymonth").post(getFilterManagepenaltymonth);
productionRoute.route("/managepenaltymonth/:id").delete(deleteManagepenaltymonth).get(getSingleManagepenaltymonth).put(updateManagepenaltymonth);

//Manage shortage master controller
const { addManageshortagemaster, deleteManageshortagemaster, getAllManageshortagemaster, ManageshortagemasterSOrt, getSingleManageshortagemaster, updateManageshortagemaster } = require("../controller/modules/production/shortagemaster");
productionRoute.route("/manageshortagemasters").get(getAllManageshortagemaster);
productionRoute.route("/manageshortagemaster/new").post(addManageshortagemaster);
productionRoute.route("/manageshortagemasterssort").post(ManageshortagemasterSOrt);
productionRoute.route("/manageshortagemaster/:id").delete(deleteManageshortagemaster).get(getSingleManageshortagemaster).put(updateManageshortagemaster);


const {
  addPenaltyAmountConsolidated,
  getAllPenaltyAmountConsolidatedMonthView,
  getAllPenaltyMonthAmountConsolidatedViewIndividual,
  deletePenaltyAmountConsolidated,
  getAllPenaltyAmountConsolidated,
  getSinglePenaltyAmountConsolidated,
  updatePenaltyAmountConsolidated,
  getFilterPenaltyAmountConsolidated,
} = require("../controller/modules/penalty/penaltyamountconsolidate");
productionRoute
  .route("/allpenaltyamountconsolidate")
  .get(getAllPenaltyAmountConsolidated);
productionRoute
  .route("/penaltyamountconsolidate/new")
  .post(addPenaltyAmountConsolidated);
productionRoute.route("/filterpenaltyamountconsolidated").post(getFilterPenaltyAmountConsolidated);
productionRoute.route("/filterpenaltyamountconsolidatedmonthview").post(getAllPenaltyAmountConsolidatedMonthView);
productionRoute.route("/filterpenaltyamountconsolidatedmonthviewindividual").post(getAllPenaltyMonthAmountConsolidatedViewIndividual);
productionRoute
  .route("/penaltyamountconsolidate/:id")
  .delete(deletePenaltyAmountConsolidated)
  .get(getSinglePenaltyAmountConsolidated)
  .put(updatePenaltyAmountConsolidated);

//  production individual backend route
//  production individual backend route
//  production individual backend route
const {
  getAllProductionHierarchyList, getAllProductionHierarchyListHome, getAllPendingIndividualLimited,
  getAllOnprogressIndividualLimited, getAllCompleteIndividualLimited, ProductionIndividualSort, productionManaulDupeCheck,
  ManualStatusviceIndividualSort, ManualstatusviceIndividualExcelOverall, getAllManualUploadFilter,
  getUserIdManual, getAllProductionHierarchyListanother, getAllProductionLoginAllotHierarchyList,
  ProductionIndividualExcelOverall, getAllProductionIndividualLimited, getAllProductionIndividualDateFilter,
  addProductionIndividual, deleteProductionIndividual, getAllProductionIndividual, getAllProductionIndividualListFilter,
  getSingleProductionIndividual, updateProductionIndividual, productionIndividualCreateBulk,
  productionIndividualDupeCheck, getAllProductionIndividualLimitedExcel, getAllProductionIndividualLimitedOverallExcel,
  getAllProductionIndividualManualOverallExcel, productionIndividualPDFDownload,
} = require("../controller/modules/production/productionindividual");
productionRoute.route("/productionindividuals").get(getAllProductionIndividual);
productionRoute.route("/productionindividual/new").post(addProductionIndividual);
productionRoute.route("/productionindividualoverallpdfdownload").post(productionIndividualPDFDownload);
productionRoute.route("/productionindividualdupecheck").post(productionIndividualDupeCheck);
productionRoute.route("/productionindividualcreatebulk").post(productionIndividualCreateBulk);
productionRoute.route("/productionhierarchyfilterhome").post(getAllProductionHierarchyListHome);
productionRoute.route("/productionindividualexceloverall").post(ProductionIndividualExcelOverall);
productionRoute.route("/manualstatusviceindividualsort").post(ManualStatusviceIndividualSort);
productionRoute.route("/productionloginallothierarchyfilter").post(getAllProductionLoginAllotHierarchyList);
productionRoute.route("/manualstatusindividualexceloverall").post(ManualstatusviceIndividualExcelOverall);
productionRoute.route("/productionindividualsort").post(ProductionIndividualSort);
productionRoute.route("/productionindividuallimited").post(getAllProductionIndividualLimited);
productionRoute.route("/productionindividualdatefilter").post(getAllProductionIndividualDateFilter);
productionRoute.route("/onprogressindividuallimited").post(getAllOnprogressIndividualLimited);
productionRoute.route("/pendingindividuallimited").post(getAllPendingIndividualLimited);
productionRoute.route("/complatedindividuallimited").post(getAllCompleteIndividualLimited);
productionRoute.route("/productionindividual/:id").get(getSingleProductionIndividual).put(updateProductionIndividual).delete(deleteProductionIndividual);
productionRoute.route("/productionhierarchyfilter").post(getAllProductionHierarchyList);
productionRoute.route("/productionhierarchyfilteranother").post(getAllProductionHierarchyListanother);
productionRoute.route("/productionmanualuploadfilter").post(getAllManualUploadFilter)
productionRoute.route("/myproductionindividual").post(getUserIdManual);
productionRoute.route("/productionindividualexcel").post(getAllProductionIndividualLimitedExcel);
productionRoute.route("/productionindividualoveallexcel").get(getAllProductionIndividualLimitedOverallExcel);
productionRoute.route("/productionindividualoveallexcelpending").post(getAllProductionIndividualManualOverallExcel);
productionRoute.route("/productionindividuallistfilter").post(getAllProductionIndividualListFilter);
productionRoute.route('/productionmanualentrydupecheck').post(productionManaulDupeCheck);



// penalty client error
const { getAllPenaltyClientError, addPenaltyClientError, deletePenaltyClientError, getSinglePenaltyClientError, updatePenaltyClientError } = require("../controller/modules/penalty/penaltyclienterror");
productionRoute.route("/penaltyclienterror").post(getAllPenaltyClientError);
productionRoute.route("/penaltyclienterror/new").post(addPenaltyClientError);
productionRoute.route("/penaltyclienterror/:id").delete(deletePenaltyClientError).get(getSinglePenaltyClientError).put(updatePenaltyClientError);


const { getAllAcpointCalculation, acpointCalculationSort, updateAcpointCalculation, acpointCalculationAssignBranch, deleteAcpointCalculation, getSingleAcpointCalculation, addAcpointCalculation } = require("../controller/modules/production/acpointscalculation");
productionRoute.route("/acpointcalculation").get(getAllAcpointCalculation);
productionRoute.route("/acpointcalculationsort").post(acpointCalculationSort);
productionRoute.route("/acpointcalculation/new").post(addAcpointCalculation);
productionRoute.route("/acpointcalculation/:id").get(getSingleAcpointCalculation).put(updateAcpointCalculation).delete(deleteAcpointCalculation);
productionRoute.route("/acpointcalculationassignbranch").post(acpointCalculationAssignBranch);

//CategoryDateChange Route
const { getAllCategorydatechange, updateCategorydatechange, categorydatechangeSort, addCategorydatechange, deleteCategorydatechange, getSingleCategorydatechange } = require("../controller/modules/production/categorydatechange");
productionRoute.route("/categorydatechange").get(getAllCategorydatechange);
productionRoute.route("/categorydatechange/new").post(addCategorydatechange);
productionRoute.route("/categorydatechangesort").post(categorydatechangeSort);
productionRoute.route("/categorydatechange/:id").get(getSingleCategorydatechange).put(updateCategorydatechange).delete(deleteCategorydatechange);

//Penaltyerroruploadpoints Route

//Penaltyerroruploadpoints Route
const { getAllPenaltyerroruploadpoints, getAllPenaltyerroruploadpointsduplicatewithbulkerrorupload,
  getAllBulkerroruploadpointsduplicatewithbulkerrorupload, getAllBulkerroruploadpointsduplicatewithbulkerroruploadFile,
  getAllPenaltyerroruploadpointsduplicatewithbulkerroruploadFile, PenaltyErrorUploadSort, updatePenaltyerroruploadpoints, getAllPenaltyerroruploadpointsProjectBasedFilter, getAllPenaltyerroruploadpointsDateFilter, deletePenaltyerroruploadpoints, deleteMultiplePenaltyErrorUpload, getSinglePenaltyerroruploadpoints, addPenaltyerroruploadpoints } = require("../controller/modules/penalty/penaltyerrorupload");
productionRoute.route("/penaltyerroruploads").get(getAllPenaltyerroruploadpoints);
productionRoute.route("/peanltyerroruploadduplicatecheckwithbulkerrorupload").post(getAllPenaltyerroruploadpointsduplicatewithbulkerrorupload);
productionRoute.route("/peanltyerroruploadduplicatecheckwithbulkerroruploadfile").post(getAllPenaltyerroruploadpointsduplicatewithbulkerroruploadFile);

productionRoute.route("/bulkerroruploadduplicatecheckwithpeanltyerrorupload").post(getAllBulkerroruploadpointsduplicatewithbulkerrorupload);
productionRoute.route("/bulkerroruploadduplicatecheckwithpeanltyerroruploadfile").post(getAllBulkerroruploadpointsduplicatewithbulkerroruploadFile);


productionRoute.route("/penaltyerroruploads/new").post(addPenaltyerroruploadpoints);
productionRoute.route("/multiplepenaltyerroruploads").post(deleteMultiplePenaltyErrorUpload);
productionRoute.route("/penaltyerroruploadssort").post(PenaltyErrorUploadSort);
productionRoute.route("/penaltyerroruploads/:id").get(getSinglePenaltyerroruploadpoints).put(updatePenaltyerroruploadpoints).delete(deletePenaltyerroruploadpoints);
productionRoute.route("/penaltyerroruploadsdatefilter").post(getAllPenaltyerroruploadpointsDateFilter);
productionRoute.route("/penaltyerroruploadsprojectbasedfilter").post(getAllPenaltyerroruploadpointsProjectBasedFilter);

//Bulkerroruploadpoints Route
const { getAllBulkErrorUploadpoints, PenaltyDayCreateBulkDelete, getAllBulkErrorUploadpointsFilename, getAllBulkErrorUploadListFilter, getAllBulkErrorIploadUniqid, updateBulkErrorUploadpoints, deleteBulkErrorUploadpoints, getAllBulkErrorUploadpointsFilter, getSingleBulkErrorUploadpoints, addBulkErrorUploadpoints, deleteMultipleBulkErrorUpload } = require("../controller/modules/penalty/bulkerrorupload");
productionRoute.route("/bulkerroruploads").get(getAllBulkErrorUploadpoints);
productionRoute.route("/bulkerroruploadsbulkdelete").post(PenaltyDayCreateBulkDelete);
productionRoute.route("/bulkerroruploadsfilterlist").post(getAllBulkErrorUploadListFilter);
productionRoute.route("/bulkerroruploads/new").post(addBulkErrorUploadpoints);
productionRoute.route("/bulkerroruploadsunique").get(getAllBulkErrorIploadUniqid);
productionRoute.route("/bulkerroruploadsfilename").post(getAllBulkErrorUploadpointsFilename);
productionRoute.route("/multiplebulkerroruploads").post(deleteMultipleBulkErrorUpload);
productionRoute.route("/multiplebulkerroruploadsfilter").post(getAllBulkErrorUploadpointsFilter);
productionRoute.route("/bulkerroruploadssingle/:id").get(getSingleBulkErrorUploadpoints).put(updateBulkErrorUploadpoints).delete(deleteBulkErrorUploadpoints);


//Penaltytotalfieldupload Route 
const { getAllPenaltytotalfieldupload, updatePenaltytotalfieldupload, deletePenaltytotalfieldupload, getPenaltyTotalFieldLoginProject,
  getAllPenaltytotalfielduploadFilter, deleteMultiplePenaltytotalfieldupload, getSinglePenaltytotalfieldupload,
  getAllErrorUploadHierarchyList, getAllValidationErrorFilter, getAllPenaltytotalfielduploadValidationEntry,
  getAllInvalidErrorEntryHierarchyList, getAllValidateErrorEntryHierarchyList, getAllCheckManagerPenaltyTotal, getAllValidOkEntry,
  addPenaltytotalfieldupload, getAllPenaltytotalfielduploadInvalidReject, getAllValidOkEntryAlert } = require("../controller/modules/penalty/penaltytotalfieldupload");
productionRoute.route("/penaltytotalfielduploads").get(getAllPenaltytotalfieldupload);
productionRoute.route("/penaltytotalfieldupload/new").post(addPenaltytotalfieldupload);
productionRoute.route("/multiplepenaltytotalfieldupload").post(deleteMultiplePenaltytotalfieldupload);
productionRoute.route("/penaltytotalfieldupload/:id").get(getSinglePenaltytotalfieldupload).put(updatePenaltytotalfieldupload).delete(deletePenaltytotalfieldupload);
productionRoute.route("/penaltytotalfielduploaddatefilters").post(getAllPenaltytotalfielduploadFilter);
productionRoute.route("/penaltytotalfielduploadloginproject").post(getPenaltyTotalFieldLoginProject);
productionRoute.route("/erroruploadconfirmhierarchylist").post(getAllErrorUploadHierarchyList);
productionRoute.route("/validationerrorfilters").post(getAllValidationErrorFilter);
productionRoute.route("/penaltytotalfielduploadsvalidation").get(getAllPenaltytotalfielduploadValidationEntry);
productionRoute.route("/invaliderrorentryhierarchy").post(getAllInvalidErrorEntryHierarchyList);
productionRoute.route("/validaterrorentryhierarchy").post(getAllValidateErrorEntryHierarchyList);
productionRoute.route("/checkmanager").post(getAllCheckManagerPenaltyTotal);
productionRoute.route("/penaltytotaluploadinvalidreject").post(getAllPenaltytotalfielduploadInvalidReject);
productionRoute.route("/validokentry").post(getAllValidOkEntry);
productionRoute.route("/validokentryalert").post(getAllValidOkEntryAlert);



//Wavier Percentage Route
const { getAllWavierpercentage, updateWavierpercentage, addWavierpercentage, getSingleWavierpercentage, deleteWavierpercentage } = require("../controller/modules/penalty/wavierpercentage");
productionRoute.route("/wavierpercentage").get(getAllWavierpercentage);
productionRoute.route("/wavierpercentage/new").post(addWavierpercentage);
productionRoute.route("/wavierpercentage/:id").get(getSingleWavierpercentage).put(updateWavierpercentage).delete(deleteWavierpercentage);

//for non production 
const { getAllNonproduction, deleteNonproduction, getSingleNonproduction, updateNonproduction, addNonproduction, getAllNonProductionFilter } = require("../controller/modules/production/nonproduction/nonproduction");
productionRoute.route("/nonproduction").get(getAllNonproduction);
productionRoute.route("/nonproduction/new").post(addNonproduction);
productionRoute.route("/nonproductionfilter").post(getAllNonProductionFilter);
productionRoute.route("/nonproduction/:id").get(getSingleNonproduction).put(updateNonproduction).delete(deleteNonproduction);

const { getOriginalMismatchFilteredData, getUpdateFlagCount, getOriginalUnmatchedData, getOriginalUnmatchedDataCountCheck, getTempMismatchFilteredData, getUpdateTempFlagCount, getTempUnmatchedData } = require("../controller/modules/production/originalmismatchfiltercontroller");
productionRoute.route("/originalmismatchfilter").post(getOriginalMismatchFilteredData);
productionRoute.route("/originalmismatchfilter/updateflagcount").put(getUpdateFlagCount);
productionRoute.route("/originalunmatchfilter").post(getOriginalUnmatchedData);

productionRoute.route("/tempmismatchfilter").post(getTempMismatchFilteredData);
productionRoute.route("/tempmismatchfilter/updateflagcount").put(getUpdateTempFlagCount);
productionRoute.route("/tempunmatchfilter").post(getTempUnmatchedData);
productionRoute.route("/originalunmatchfiltercountcheck").post(getOriginalUnmatchedDataCountCheck);

const { addProductionDay, deleteProductionDay, checkIsProdDayCreated, getAllProductionDay, getAllProductionDayUniqid, getSingleProductionDay, updateProductionDay } = require("../controller/modules/production/productionday");
productionRoute.route("/productiondays").get(getAllProductionDay);
productionRoute.route("/productionday/new").post(addProductionDay);
productionRoute.route("/productionday/:id").get(getSingleProductionDay).put(updateProductionDay).delete(deleteProductionDay);
productionRoute.route("/productiondaysuniqid").get(getAllProductionDayUniqid);
productionRoute.route("/checkisproddaycreated").post(checkIsProdDayCreated);

//  PROD Day list backend route
const { addProductionDayList, deleteProductionDayList, getUserWeekOffDays, getUserWeekOffDaysAttendance, getAllProductionsByUserForCurrMonthView, getAllProductionsByUserForCurrMonth, deleteProductionDayByUnid, getEmpProductionDayLastThreeMonths, getAllProductionDayListByDate, productionDayListGetDeleteLimited, productionDayListGetViewLimited, getAllProductionDayList, getAllProductionDayListUniqid, getSingleProductionDayList, updateProductionDayList } = require("../controller/modules/production/productiondaylist");
productionRoute.route("/productiondaylists").get(getAllProductionDayList);
productionRoute.route("/productiondaylist/new").post(addProductionDayList);
productionRoute.route("/productiondaylist/:id").get(getSingleProductionDayList).put(updateProductionDayList).delete(deleteProductionDayList);
productionRoute.route("/productiondaylistgetdeletelimited").post(productionDayListGetDeleteLimited);
productionRoute.route("/productiondaylistgetviewlimited").post(productionDayListGetViewLimited);
productionRoute.route("/productiondaylistdeleteuniqud").post(deleteProductionDayByUnid);
productionRoute.route("/productiondaylistsgetbydate").post(getAllProductionDayListByDate);
productionRoute.route("/getempproductiondaylastthreemonths").post(getEmpProductionDayLastThreeMonths);
productionRoute.route("/getuserweekoffdays").post(getUserWeekOffDays);
productionRoute.route("/getallproductionsbyuserforcurrmonth").post(getAllProductionsByUserForCurrMonth);
productionRoute.route("/getallproductionsbyuserforcurrmonthview").post(getAllProductionsByUserForCurrMonthView);
productionRoute.route("/getuserweekoffdaysattendance").post(getUserWeekOffDaysAttendance);

//  training details backend route
const { addProductionDayTemp, deleteProductionDayTemp, getAllProductionDayTemp, checkIsProdDayCreatedTemp, getAllProductionDayUniqidTemp, getSingleProductionDayTemp, updateProductionDayTemp } = require("../controller/modules/production/productiondaytemp");
productionRoute.route("/productiondaystemp").get(getAllProductionDayTemp);
productionRoute.route("/productiondaytemp/new").post(addProductionDayTemp);
productionRoute.route("/productiondaytemp/:id").get(getSingleProductionDayTemp).put(updateProductionDayTemp).delete(deleteProductionDayTemp);
productionRoute.route("/productiondaysuniqidtemp").get(getAllProductionDayUniqidTemp);
productionRoute.route("/checkisproddaycreatedtemp").post(checkIsProdDayCreatedTemp);

//  PROD Day list backend route
const { addProductionDayListTemp, getAllProductionDayListByDateTemp, deleteProductionDayListTemp, getAllProductionsByUserForCurrMonthTemp, getAllProductionsByUserForCurrMonthViewTemp, getEmpProductionDayLastThreeMonthsTemp, deleteProductionDayByUnidTemp, productionDayListGetDeleteLimitedTemp, productionDayListGetViewLimitedTemp, getAllProductionDayListTemp, getAllProductionDayListUniqidTemp, getSingleProductionDayListTemp, updateProductionDayListTemp } = require("../controller/modules/production/productiondaylisttemp");
productionRoute.route("/productiondayliststemp").get(getAllProductionDayListTemp);
productionRoute.route("/productiondaylisttemp/new").post(addProductionDayListTemp);
productionRoute.route("/getempproductiondaylastthreemonthstemp").post(getEmpProductionDayLastThreeMonthsTemp);
productionRoute.route("/getallproductionsbyuserforcurrmonthtemp").post(getAllProductionsByUserForCurrMonthTemp);
productionRoute.route("/getallproductionsbyuserforcurrmonthviewtemp").post(getAllProductionsByUserForCurrMonthViewTemp);
productionRoute.route("/productiondaylisttemp/:id").get(getSingleProductionDayListTemp).put(updateProductionDayListTemp).delete(deleteProductionDayListTemp);
productionRoute.route("/productiondaylistgetdeletelimitedtemp").post(productionDayListGetDeleteLimitedTemp);
productionRoute.route("/productiondaylistgetviewlimitedtemp").post(productionDayListGetViewLimitedTemp);
productionRoute.route("/productiondaylistdeleteuniqudtemp").post(deleteProductionDayByUnidTemp);
productionRoute.route("/productiondaylistsgetbydatetemp").post(getAllProductionDayListByDateTemp);

const { addDayPointsUploadTemp, getDayPointIdByDateTemp, getAllDayPointsUploadTemp, getAllDayPointsUploadTempDateOnly, getAllDayPointTempByDate, getSingleDayPointsUploadTemp, getEmployeeProductionLastThreeMonthsTemp, checkDayPointdateTemp, getAllDayPointsUploadLimitedTemp, updateDayPointsUploadTemp, dayPointsMonthYearFilterNxtMonthTemp, deleteDayPointsUploadTemp, updateDayPointsSingleUploadTemp, dayPointsfilterTemp, dayPointsDatasFetchTemp, dayPointsMonthYearFilterTemp } = require("../controller/modules/production/daypointsuploadtemp");
productionRoute.route("/daypointstemp").get(getAllDayPointsUploadTemp);
productionRoute.route("/daypointtemp/new").post(addDayPointsUploadTemp);
productionRoute.route("/daypointstempdateonly").get(getAllDayPointsUploadTempDateOnly);
productionRoute.route("/daypointstempbydate").post(getAllDayPointTempByDate);
productionRoute.route("/getemployeeproductionlastthreemonthstemp").post(getEmployeeProductionLastThreeMonthsTemp);
productionRoute.route("/daypointtemp/:id").delete(deleteDayPointsUploadTemp).get(getSingleDayPointsUploadTemp).put(updateDayPointsUploadTemp);
productionRoute.route("/daypointsmonthwisefiltertemp").post(dayPointsMonthYearFilterTemp);
productionRoute.route("/singledaypointtemp/:id").put(updateDayPointsSingleUploadTemp);
productionRoute.route("/checkdaypointdatetemp").post(checkDayPointdateTemp);
productionRoute.route("/daypointsfiltertemp").post(dayPointsfilterTemp);
productionRoute.route("/daypointsdatasfetchtemp").post(dayPointsDatasFetchTemp);
productionRoute.route("/daypointsmonthwisefilternxtmonthtemp").post(dayPointsMonthYearFilterNxtMonthTemp);
productionRoute.route("/daypointslimitedtemp").get(getAllDayPointsUploadLimitedTemp);
productionRoute.route("/getdaypointidbydatetemp").post(getDayPointIdByDateTemp);

//payrunlist
//  training details backend route
const { addPayrunList, deletePayrunList, updateInnerDataSingleUserRerun, getAllPayrunListConsolidatedDate, getAllPayrunListConsolidatedDateTemp,
  deletePayrunBulkData, getPayrunBulkDataExcel, getBankReleasePayrunListMonthwise, checkPayRunIsCreatedForPenaltyDayUpload, checkIsPayRunGeneratedFromTo,
  payRunListSentSalaryFixDate, confirmConsolidatedReleaseSave, confirmHoldReleaseSave, updateRemoveReject, fixHoldSalaryReject, undoFieldNameConfirmListFix, confirmFixHoldSalaryLogUpdate, confirmFixHoldSalaryDate, confirmFixSalaryDate, fetchPayRunListDataMonthwise, updateInnerDataSingleUserWaiver, updatePayrunListInnerData, checkPayRunIsCreated, undoPayrunListInnerData, getAllPayrunList, getAllPayrunListLimited, getSinglePayrunList, updatePayrunList } = require("../controller/modules/production/payrunlist");
productionRoute.route("/payrunlists").get(getAllPayrunList);
productionRoute.route("/payrunlistsconsolidateddate").post(getAllPayrunListConsolidatedDate);
productionRoute.route("/payrunlistsconsolidateddatetemp").post(getAllPayrunListConsolidatedDateTemp);
productionRoute.route("/payrunlist/new").post(addPayrunList);
productionRoute.route("/fetchbankreleasepayrunlistmonthwise").post(getBankReleasePayrunListMonthwise);
productionRoute.route("/payrunlist/:id").get(getSinglePayrunList).put(updatePayrunList).delete(deletePayrunList);
productionRoute.route("/payrunlistlimited").get(getAllPayrunListLimited);
productionRoute.route("/updatepayrunlistinnerdata").post(updatePayrunListInnerData);
productionRoute.route("/undopayrunlistinnerdata").post(undoPayrunListInnerData);
productionRoute.route("/checkpayruniscreated").post(checkPayRunIsCreated);
productionRoute.route("/confirmfixsalarydate").post(confirmFixSalaryDate);
productionRoute.route("/fixholdsalaryreject").post(fixHoldSalaryReject);
productionRoute.route("/updateremovereject").post(updateRemoveReject);
productionRoute.route("/confirmholdreleasesave").post(confirmHoldReleaseSave);
productionRoute.route("/confirmconsolidatedreleasesave").post(confirmConsolidatedReleaseSave);
productionRoute.route("/undofieldnameconfirmlistfix").post(undoFieldNameConfirmListFix);
productionRoute.route("/confirmfixholdsalarydate").post(confirmFixHoldSalaryDate);
productionRoute.route("/confirmfixholdsalarylogupdate").post(confirmFixHoldSalaryLogUpdate);
productionRoute.route("/updateinnerdatasingleuserrerun").post(updateInnerDataSingleUserRerun);
productionRoute.route("/updateinnerdatasingleuserwaiver").post(updateInnerDataSingleUserWaiver);
productionRoute.route("/payrunlistsentsalaryfixdate").post(payRunListSentSalaryFixDate);
productionRoute.route("/fetchpayrunlistdatamonthwise").post(fetchPayRunListDataMonthwise);
productionRoute.route("/getpayrunbulkdataexcel").post(getPayrunBulkDataExcel);
productionRoute.route("/deletepayrunbulkdata").post(deletePayrunBulkData);
productionRoute.route("/checkpayruniscreatedforpenaltydayupload").post(checkPayRunIsCreatedForPenaltyDayUpload);
productionRoute.route("/checkpayruniscreatedfromto").post(checkIsPayRunGeneratedFromTo);

//Wavier Percentage Route
const { getAllConsolidatedSalaryRelease, updateConsolidatedSalaryRelease, addConsolidatedSalaryRelease, consolidatedSalaryReleaseMonthWise, getSingleConsolidatedSalaryRelease, deleteConsolidatedSalaryRelease } = require("../controller/modules/production/consolidatedsalaryrelease");
productionRoute.route("/consolidatedsalaryrelease").get(getAllConsolidatedSalaryRelease);
productionRoute.route("/consolidatedsalaryrelease/new").post(addConsolidatedSalaryRelease);
productionRoute.route("/consolidatedsalaryrelease/:id").get(getSingleConsolidatedSalaryRelease).put(updateConsolidatedSalaryRelease).delete(deleteConsolidatedSalaryRelease);
productionRoute.route("/consolidatedsalaryreleasemonthwise").post(consolidatedSalaryReleaseMonthWise);

//Wavier Percentage Route
const { getAllHoldSalaryRelease, updateHoldSalaryRelease, holdSalaryYetToConfirmList, addHoldSalaryRelease, getSingleHoldSalaryRelease, deleteHoldSalaryRelease } = require("../controller/modules/production/holdsalaryrelease");
productionRoute.route("/holdsalaryrelease").get(getAllHoldSalaryRelease);
productionRoute.route("/holdsalaryrelease/new").post(addHoldSalaryRelease);
productionRoute.route("/holdsalaryrelease/:id").get(getSingleHoldSalaryRelease).put(updateHoldSalaryRelease).delete(deleteHoldSalaryRelease);
productionRoute.route("/holdsalaryyettoconfirmlist").post(holdSalaryYetToConfirmList);


//Wavier Percentage Route
const { getAllBankRelease, updateBankRelease, addBankRelease, bankReleaseLimited, checkWithBankRelease, getSingleBankRelease, deleteBankRelease } = require("../controller/modules/production/bankrelease");
productionRoute.route("/bankrelease").get(getAllBankRelease);
productionRoute.route("/bankrelease/new").post(addBankRelease);
productionRoute.route("/bankrelease/:id").get(getSingleBankRelease).put(updateBankRelease).delete(deleteBankRelease);
productionRoute.route("/checkwithbankrelease").post(checkWithBankRelease)
productionRoute.route("/bankreleaselimited").get(bankReleaseLimited)



const { getAllErrorMode, updateErrorMode, addErrorMode, getOrginData, ErrorModeUnallotList, ErrorModeAllotedList, getSingleErrorMode, deleteErrorMode, getAllErrorModeFilter } = require("../controller/modules/penalty/errormode");
productionRoute.route("/errormodes").get(getAllErrorMode);
productionRoute.route("/errormode/new").post(addErrorMode);
productionRoute.route("/errormode/:id").get(getSingleErrorMode).put(updateErrorMode).delete(deleteErrorMode);
productionRoute.route("/errormodeunallotlist").post(ErrorModeUnallotList);
productionRoute.route("/errormodeallotedlist").post(ErrorModeAllotedList);
productionRoute.route("/getorgindata").post(getOrginData);
productionRoute.route("/errormodefilter").post(getAllErrorModeFilter);



//Type MAster

const { addTypeMaster, deleteTypeMaster, getAllTypeMaster, getSingleTypeMaster, updateTypeMaster } = require("../controller/modules/production/typemaster");
productionRoute.route("/productiontypemasters").get(getAllTypeMaster);
productionRoute.route("/productiontypemaster/new").post(addTypeMaster);
productionRoute.route("/productiontypemaster/:id").delete(deleteTypeMaster).get(getSingleTypeMaster).put(updateTypeMaster);


//queue Type MAster



const { addQueueTypeMaster, deleteQueueTypeMaster, getAllQueueTypeMaster, getSingleQueueTypeMaster, getAllQueueTypeMasterSubCatetoryWiseType,
  getAllQueueTypeMasterCatetoryWiseType, getAllQueueTypeMasterVendorDrop, getAllQueueTypeMasterCategoryDrop, getAllQueueTypeMasterTypeDrop,
  getAllQueueTypeMasterDuplicate, fetchORateValueQueuemaster, updateQueueTypeMaster, getAllQueueTypeMasterUnitRate, checkQueueTypeForProdUpload, checkQueueTypeForProdUploadMatched,
  checkQueueTypeForProdUploadCategoryCreate,
  getAllQueueTypeMasterVendorMasterDrop } = require("../controller/modules/production/queuetypemaster");
productionRoute.route("/productionqueuequeuetypemasters").get(getAllQueueTypeMaster);
productionRoute.route("/productionqueuemasterunitrate").get(getAllQueueTypeMasterUnitRate);
productionRoute.route("/orratevaluequeuemaster").post(fetchORateValueQueuemaster);
productionRoute.route("/queuetypemasterduplicate").post(getAllQueueTypeMasterDuplicate);
productionRoute.route("/queuetypesubcategorywisetype").post(getAllQueueTypeMasterSubCatetoryWiseType);
productionRoute.route("/productionqueuetypemaster/new").post(addQueueTypeMaster);
productionRoute.route("/productionqueuetypemaster/:id").delete(deleteQueueTypeMaster).get(getSingleQueueTypeMaster).put(updateQueueTypeMaster);
productionRoute.route("/queuetypecategorywisetype").post(getAllQueueTypeMasterCatetoryWiseType);
productionRoute.route("/queuetypevendormasterdrop").post(getAllQueueTypeMasterVendorMasterDrop);
productionRoute.route("/queuetypevendordrop").get(getAllQueueTypeMasterVendorDrop);
productionRoute.route("/queuetypecategorydrop").post(getAllQueueTypeMasterCategoryDrop);
productionRoute.route("/queuetypetypedrop").post(getAllQueueTypeMasterTypeDrop);
productionRoute.route("/queuetypeothertaskupload").post(checkQueueTypeForProdUpload);
productionRoute.route("/queuetypeothertaskuploadmatched").post(checkQueueTypeForProdUploadMatched);
productionRoute.route("/queuetypeothertaskuploadcategorycreate").post(checkQueueTypeForProdUploadCategoryCreate);






//production upload bulk controller
const { getAllProductionuploadBulk, addProductionuploadBulk, getSingleProductionuploadBulk, getAllProductionuploadBulkFilter, updateProductionuploadBulk, deleteProductionuploadBulk, getAllProductionuploadBulkUndo } = require("../controller/modules/production/productionuploadbulk");
productionRoute.route("/productionuploadbulks").get(getAllProductionuploadBulk);
productionRoute.route("/productionsummaryuploadpbulkfilter").post(getAllProductionuploadBulkFilter);
productionRoute.route("/productionsummarybulkundo").post(getAllProductionuploadBulkUndo);
productionRoute.route("/productionuploadbulk/new").post(addProductionuploadBulk);
productionRoute.route("/productionuploadbulk/:id").get(getSingleProductionuploadBulk).put(updateProductionuploadBulk).delete(deleteProductionuploadBulk);




//production temp bulk controller
const { getAllProductiontempBulk, addProductiontempBulk, getSingleProductiontempBulk, updateProductiontempBulk,
  deleteProductiontempBulk, getAllProductiontempBulkUndo, getAllProductiontempBulkFilter } = require("../controller/modules/production/productiontempbulk");
productionRoute.route("/productiontempbulks").get(getAllProductiontempBulk);
productionRoute.route("/productionsummarytempbulkfilter").post(getAllProductiontempBulkFilter);
productionRoute.route("/productionsummarytempbulkundo").post(getAllProductiontempBulkUndo);
productionRoute.route("/productiontempbulk/new").post(addProductiontempBulk);
productionRoute.route("/productiontempbulk/:id").get(getSingleProductiontempBulk).put(updateProductiontempBulk).delete(deleteProductiontempBulk);





//othertask upload controller
const { addOtherTaskUpload, deleteOtherTaskUpload, OtherTaskUploadLastThree, getUniqidFromDateOtherTaskupload, getAllOtherTaskUploadLimitedFilter, getAllOtherTaskUpload, getAllOtherTaskUploadLimited, getAllOtherTaskUploadLimitedUniqid, getSingleOtherTaskUpload, updateOtherTaskUpload } = require("../controller/modules/production/othertaskupload");
productionRoute.route("/othertaskuploads").get(getAllOtherTaskUpload);
productionRoute.route("/othertaskupload/new").post(addOtherTaskUpload);
productionRoute.route("/othertaskupload/:id").get(getSingleOtherTaskUpload).put(updateOtherTaskUpload).delete(deleteOtherTaskUpload);
productionRoute.route("/othertaskuploadslimited").get(getAllOtherTaskUploadLimited);
productionRoute.route("/othertaskuploadslimiteduniqid").get(getAllOtherTaskUploadLimitedUniqid);
productionRoute.route("/othertaskuploadslimitedfilter").post(getAllOtherTaskUploadLimitedFilter);
productionRoute.route("/getuniqidfromdateproduploadother").post(getUniqidFromDateOtherTaskupload);
productionRoute.route("/othertaskuploadlastthree").get(OtherTaskUploadLastThree);




//othertask original upload backend route
const { getAllProductionUploadFilenamesOther, bulkProductionOrgUpdateCategorySubcategoryOther,
  bulkDeleteUnitRateUnallotOther, updateBulkDatasUnitandFlagOther, updateBulkDatasUnitandSectionOther, updateBulkDatasFlagOnlyOther,
  updateBulkDatasUnitOnlyOther, getProductionUploadDatasByIdOther, undoFieldNameOther, productionUploadCheckMismatchPresentFilterOther,
  productionUploadCheckStatusOther, getMismatchUpdatedListOther, getAllProductionUnAllotFilterViewManualOther, getProductionSingleDayUserOther,
  productionUploadCheckZeroMismatchPresentOther, getSingleDateDataforprodDayOther, getAllProductionUnAllotFilterOther,
  getAllProductionUnAllotFilterViewOther, productionUploadOverAllFetchLimitedOther,
  productionUploadOverAllFetchLimitedNewOther,
  getAllProductionUploadGetdeletedatasallOther, getAllProductionUploadGetdeletedatasOther, deleteProductionUploadsMutliOther,
  getAllProductionUploadFilenamesonlyOther, addProductionUploadOther, deleteProductionUploadOther, getAllProductionUploadOther,
  getSingleProductionUploadOther, updateProductionUploadOther,
  productionUploadUnitrateOverallFetchlimitedOther,
  getAllProductionUploadFilenamesonlyBulkDownloadOther
}
  = require("../controller/modules/production/othertaskoriginalupload");
productionRoute.route("/productionuploadsother").get(getAllProductionUploadOther);
productionRoute.route("/productionuploadfilenameonlybulkdownloadother").post(getAllProductionUploadFilenamesonlyBulkDownloadOther);
productionRoute.route("/productionuploadother/new").post(addProductionUploadOther);
productionRoute.route("/productionuploadother/:id").get(getSingleProductionUploadOther).put(updateProductionUploadOther).delete(deleteProductionUploadOther);
productionRoute.route("/productionuploadfilenamelistother").post(getAllProductionUploadFilenamesOther);
productionRoute.route("/productionuploadfilenameonlyother").post(getAllProductionUploadFilenamesonlyOther);
productionRoute.route("/productiondaygetsingledatedatadayother").post(getSingleDateDataforprodDayOther);
productionRoute.route("/productionuploadgetdeletedatasother").post(getAllProductionUploadGetdeletedatasOther);
productionRoute.route("/productionuploadgetdeletedatasallother").post(getAllProductionUploadGetdeletedatasallOther);
productionRoute.route("/productionuploaddeletemultiother").post(deleteProductionUploadsMutliOther);
productionRoute.route("/productionuploadoverallfetchlimitedother").post(productionUploadOverAllFetchLimitedOther);
productionRoute.route("/productionuploadoverallfetchlimitednewother").post(productionUploadOverAllFetchLimitedNewOther);
productionRoute.route("/getproductionsignledayuserother").post(getProductionSingleDayUserOther);
productionRoute.route("/checkzeromismatchpresentother").post(productionUploadCheckZeroMismatchPresentOther);
productionRoute.route("/productionuploadunitrateoverallfetchlimitedother").post(productionUploadUnitrateOverallFetchlimitedOther);
productionRoute.route("/productionunallotfilterother").post(getAllProductionUnAllotFilterOther);
productionRoute.route("/productionunallotfilterviewother").post(getAllProductionUnAllotFilterViewOther);
productionRoute.route("/productionunallotfilterviewmanualother").post(getAllProductionUnAllotFilterViewManualOther);
productionRoute.route("/getmismatchupdatedlistother").post(getMismatchUpdatedListOther);
productionRoute.route("/updatefieldundonameother").post(undoFieldNameOther);
productionRoute.route("/productionuploadcheckstatusother").post(productionUploadCheckStatusOther);
productionRoute.route("/getmismatchdatasidother").post(productionUploadCheckMismatchPresentFilterOther);
productionRoute.route("/getproductionuploaddatasbyidother").post(getProductionUploadDatasByIdOther);
productionRoute.route("/updatedbulkdatasunitandflagother").post(updateBulkDatasUnitandFlagOther);
productionRoute.route("/updatedbulkdatasunitonlyother").post(updateBulkDatasUnitOnlyOther);
productionRoute.route("/updatedbulkdatasflagonlyother").post(updateBulkDatasFlagOnlyOther);
productionRoute.route("/updatedbulkdatasunitandsectionother").post(updateBulkDatasUnitandSectionOther);
productionRoute.route("/bulkdeleteunitrateunallotother").post(bulkDeleteUnitRateUnallotOther);
productionRoute.route("/bulkproductionorgupdatecategorysubcategoryother").post(bulkProductionOrgUpdateCategorySubcategoryOther);











module.exports = productionRoute;