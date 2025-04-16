const express = require("express");
const stockRoute = express.Router();
// connect stock controller..
const { getAllStock, getAllStockAccess, addStock, getSingleStock, getOverallStockTableSort,
    getAllStockPurchaseLimitedUsageCount, getAllStockPurchaseLimitedUsageCountNotification, getAllStockPurchaseLimitedUsageCountNotificationList,
    getAllStockAccessStock, getAllStockPurchaseLimitedHandoverTodo, getAllStockPurchaseLimitedHandoverTodoReturn,
    getAllStockPurchaseLimitedHandoverandReturn, updateStock, getAllStockPurchaseLimitedTransfer, getAllStockPurchaseLimitedTransferLog,
    getAllStockPurchaseLimitedReturn, getAllStockPurchaseLimitedHandover, deleteStock, Stocktrasnferfilter, getAllStockPurchaseLimited,
    getAllStockPurchaseLimitedHandoverTodoNotification, getAllStockPurchaseLimitedHandoverTodoReturnNotification, getAllStockManagementViewDate,
    getAllStockManagementViewDateStockMaterial, getAllStockPurchaseLimitedUsageCountCreateList, getAllStockManagementViewDateIndividual,
    getAllStockManagementViewDateStockMaterialIndividual, getAllStockPurchaseStockCount,
    getAllStockPurchaseLimitedOverallReport, getAllStockPurchaseStockCountUsage, getAllStockPurchaseLimitedBalanceCount,
    getAllStockExcelDownloadStock, getAllStockExcelDownloadAsset, getAllStockPdfDownloadAssetPDF, getAllStockBillno,
    getAllStockPurchaseLimitedAssetDetails, getAllStockPurchaseLimitedReorder, uploadChunkStock, getAllStockTodoDelete, getAllStockTodoEditFetch,
} = require("../controller/modules/stockpurchase/stock");
stockRoute.route("/stocks").get(getAllStock);
stockRoute.route("/uploadchunkstock").post(uploadChunkStock);
stockRoute.route("/stocktododelete").post(getAllStockTodoDelete);
stockRoute.route("/stocktodoeditfetch").post(getAllStockTodoEditFetch);

stockRoute.route("/stockpurchaselimitedbalancecount").post(getAllStockPurchaseLimitedBalanceCount);

stockRoute.route("/stocksaccess").post(getAllStockAccess);
stockRoute.route("/stocksaccessstock").post(getAllStockAccessStock);
stockRoute.route("/stock/new").post(addStock);
stockRoute.route("/stockpurchasesort").post(getOverallStockTableSort);
stockRoute.route("/stockpurchaselimited").post(getAllStockPurchaseLimited);
stockRoute.route("/stockpurchaselimitedassetdetails").post(getAllStockPurchaseLimitedAssetDetails);
stockRoute.route("/stockpurchaselimitedhand").get(getAllStockPurchaseLimitedHandover);
stockRoute.route("/stockpurchaselimitedusagecount").get(getAllStockPurchaseLimitedUsageCount);
stockRoute.route("/stockpurchaselimitedusagecountcreatelist").post(getAllStockPurchaseLimitedUsageCountCreateList);
stockRoute.route("/stockpurchaselimitedusagecountnotification").post(getAllStockPurchaseLimitedUsageCountNotification);
stockRoute.route("/stockpurchaselimitedusagecountnotificationlist").post(getAllStockPurchaseLimitedUsageCountNotificationList);
stockRoute.route("/stockpurchaselimitedhandreturn").post(getAllStockPurchaseLimitedHandoverandReturn);
stockRoute.route("/stockpurchaselimitedtransfer").get(getAllStockPurchaseLimitedTransfer);
stockRoute.route("/stockpurchaselimitedtransferlog").post(getAllStockPurchaseLimitedTransferLog);
stockRoute.route("/stockpurchaselimitedreturn").get(getAllStockPurchaseLimitedReturn);
stockRoute.route("/stock/:id").get(getSingleStock).put(updateStock).delete(deleteStock);
stockRoute.route("/stockmantransferfilter").post(Stocktrasnferfilter);
stockRoute.route("/stockpurchaselimitedhandtodo").post(getAllStockPurchaseLimitedHandoverTodo);
stockRoute.route("/stockpurchaselimitedhandtodoreturn").post(getAllStockPurchaseLimitedHandoverTodoReturn)
stockRoute.route("/stockpurchaselimitedhandtodonotification").post(getAllStockPurchaseLimitedHandoverTodoNotification);
stockRoute.route("/stockpurchaselimitedhandtodoreturnnotification").post(getAllStockPurchaseLimitedHandoverTodoReturnNotification)
stockRoute.route("/stockmanagementviewdate").post(getAllStockManagementViewDate)
stockRoute.route("/stockmanagementviewdatestockmaterial").post(getAllStockManagementViewDateStockMaterial)
stockRoute.route("/stockmanagementviewdateindividual").post(getAllStockManagementViewDateIndividual)
stockRoute.route("/stockcount").post(getAllStockPurchaseStockCount)
stockRoute.route("/stockoverallreport").post(getAllStockPurchaseLimitedOverallReport)
stockRoute.route("/stockcountusage").post(getAllStockPurchaseStockCountUsage)

stockRoute.route("/exceldownloadstock").get(getAllStockExcelDownloadStock)
stockRoute.route("/exceldownloadasset").post(getAllStockExcelDownloadAsset)
stockRoute.route("/exceldownloadassetpdf").post(getAllStockPdfDownloadAssetPDF)
stockRoute.route("/stockbillduplicate").post(getAllStockBillno)

//reorder
stockRoute.route("/stockpurchaselimitedreorder").post(getAllStockPurchaseLimitedReorder)



// connect stockmanage controller..
const { getAllStockmanage, addStockmanage, getAllStockmanageAlertCount, getAllStockmanageOldQty, getAllStockmanageOldQtyEdit, getAllStockmanageAccess, getAllStockmanageFilteredUpdateMove, getAllStockmanageFilteredAccess, getAllStockmanageFilteredAccessVerification, getAllStockmanageAccessStock, getSingleStockmanage, updateStockmanage, deleteStockmanage, getAllStockmanageFiltered } = require("../controller/modules/stockpurchase/stockmanage");
stockRoute.route("/stockmanages").get(getAllStockmanage);
stockRoute.route("/stockmanagealertcount").post(getAllStockmanageAlertCount);
stockRoute.route("/getoldmaterialqty").post(getAllStockmanageOldQty);
stockRoute.route("/getoldmaterialqtyedit").post(getAllStockmanageOldQtyEdit);
stockRoute.route("/stockmanagesingleupdatemove").post(getAllStockmanageFilteredUpdateMove);
stockRoute.route("/stockmanagesaccess").post(getAllStockmanageAccess);
stockRoute.route("/stockmanagesaccessstock").post(getAllStockmanageAccessStock);
stockRoute.route("/stockfilteraccess").post(getAllStockmanageFilteredAccess);
stockRoute.route("/stockfilteraccessverification").post(getAllStockmanageFilteredAccessVerification);
stockRoute.route("/stockfilter").get(getAllStockmanageFiltered);
stockRoute.route("/stockmanage/new").post(addStockmanage);
stockRoute.route("/stockmanage/:id").get(getSingleStockmanage).put(updateStockmanage).delete(deleteStockmanage);


const { getAllManualstock, addManualstock, getSingleManualstock, getAllManualstockAccess, getAllManualstockAccessStock, getAllManualstockLimited,
    getAllManualstockLimitedUsageCount, getAllManualstockHandover, getAllManualstockLimitedReturn, getAllManualstockExcelLimitedAsset, getAllManualstockExcelLimitedStock,
    updateManualstock, deleteManualstock, Manualstocktrasnferfilter } = require("../controller/modules/stockpurchase/manualstockentry");
stockRoute.route("/manualstocks").get(getAllManualstock);
stockRoute.route("/manualstocklimitedexcelasset").get(getAllManualstockExcelLimitedAsset);
stockRoute.route("/manualstocklimitedexcelstock").get(getAllManualstockExcelLimitedStock);
stockRoute.route("/manualstocklimited").post(getAllManualstockLimited);
stockRoute.route("/manualstocklimitedusagecount").get(getAllManualstockLimitedUsageCount);
stockRoute.route("/manualstocklimitedreturn").get(getAllManualstockLimitedReturn);
stockRoute.route("/manualstocklimitedhandover").get(getAllManualstockHandover);
stockRoute.route("/manualstocksaccess").post(getAllManualstockAccess);
stockRoute.route("/manualstocksaccessstock").post(getAllManualstockAccessStock);
stockRoute.route("/manualstock/new").post(addManualstock);
stockRoute.route("/manualstock/:id").get(getSingleManualstock).put(updateManualstock).delete(deleteManualstock);
stockRoute.route("/manualstockmantransferfilter").post(Manualstocktrasnferfilter);



const { getAllStockManagement, addStockManagement, getSingleStockManagement, updateStockManagement, deleteStockManagement,
} = require("../controller/modules/stockpurchase/stockmanagement");
stockRoute.route("/stockmanagements").get(getAllStockManagement);
stockRoute.route("/stockmanagement/new").post(addStockManagement);
stockRoute.route("/stockmanagement/:id").get(getSingleStockManagement).put(updateStockManagement).delete(deleteStockManagement);

module.exports = stockRoute;
