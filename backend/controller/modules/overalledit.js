const AssetTypeGrouping = require("../../model/modules/account/assetTypeGroupingModel");
const Assetmaterial = require('../../model/modules/account/assetmaterial');
const Assetdetail = require('../../model/modules/account/assetdetails');
const Stockmanage = require("../../model/modules/stockpurchase/stockmanage");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const Stock = require("../../model/modules/stockpurchase/stock");
const Manualstock = require("../../model/modules/stockpurchase/manualstockentry");
const SchedulePaymentMaster = require("../../model/modules/expense/SchedulePaymentMaster");
const Expenses = require("../../model/modules/expense/expenses");
const VendorGrouping = require("../../model/modules/account/vendorgrouping");
const AssetSpecification = require("../../model/modules/account/assetworkstation");
const AssetSpecificationGrouping = require("../../model/modules/account/assetspecificationgrouping");
const AssetMaterialIP = require("../../model/modules/account/assetmaterialip");
const Maintenance = require("../../model/modules/account/maintenance");
const AssetWorkGrp = require("../../model/modules/account/assetworkstationgrouping");
const AssetProblemmaster = require('../../model/modules/account/Assetproblemmaster');
const MaintenanceDetailsmaster = require('../../model/modules/account/MaintanceDetailsmaster');
const Employeeasset = require("../../model/modules/account/employeeassetdistribution");
const Remainder = require('../../model/modules/task/remainder');
const EmployeeAssetReturn = require("../../model/modules/account/employeeAssetReturnRegister.js");
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');





//overall delete accouthead
exports.getOverAllDeleteAccHeadLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry;
    console.log(req.body.accountheadassetmaterial, "assetmaterial")
    try {
        let querytypegrouping = {
            accounthead: { $in: req.body.accountheadtypegrouping },
        };

        // console.log(querytypegrouping, "querytypegrouping")
        let queryassetmaterial = {
            assethead: { $in: req.body.accountheadassetmaterial },
        };
        let queryassetdetail = {
            asset: { $in: req.body.accountheadassetdetail },
        };

        // let querystockmanage = {
        //     asset: { $in: req.body.accountheadstockmanage },
        //     producthead: { $in: req.body.accountheadstockmanageproduct },
        // };
        let querystockmanage = {
            // $or: [
            //     {
            //         $and: [
            //             { asset: { $in: req.body.accountheadstockmanage } },
            //             { producthead: { $in: req.body.accountheadstockmanageproduct } },
            //         ],
            //     },
            //     { asset: { $in: req.body.accountheadstockmanage } },
            //     { producthead: { $in: req.body.accountheadstockmanageproduct } },
            // ],
            asset: { $in: req.body.accountheadstockmanage }
        };


        let querystock = {
            asset: { $in: req.body.accountheadstock },
        };

        // let querymanaulstock = {
        //     asset: { $in: req.body.accountheadmanual },
        //     producthead: { $in: req.body.accountheadmanualproduct },
        // };

        let querymanaulstock = {
            // $or: [
            //     {
            //         $and: [
            //             { asset: { $in: req.body.accountheadmanual } },
            //             { producthead: { $in: req.body.accountheadmanualproduct } },
            //         ],
            //     },
            //     { asset: { $in: req.body.accountheadmanual } },
            //     { producthead: { $in: req.body.accountheadmanualproduct } },
            // ],

            producthead: { $in: req.body.accountheadmanualproduct },
        };

        assettypegrouping = await AssetTypeGrouping.find(querytypegrouping, {
            accounthead: 1,
            _id: 0,
        });
        assetmaterial = await Assetmaterial.find(queryassetmaterial, {
            assethead: 1,
            _id: 0,
        });
        assetdetail = await Assetdetail.find(queryassetdetail, {
            asset: 1,
            _id: 0,
        });


        stockmanage = await Stockmanage.find(querystockmanage, {
            asset: 1,
            producthead: 1,
            _id: 0,
        });

        stock = await Stock.find(querystock, {
            asset: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            producthead: 1,
            _id: 0,
        });


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry,
    });
});


//overall edit accounthead
exports.getOverAllEditAccHeadLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry;
    try {

        assettypegrouping = await AssetTypeGrouping.find({ accounthead: { $in: req.body.oldname } })
        assetmaterial = await Assetmaterial.find({ assethead: { $in: req.body.oldname } })
        assetdetail = await Assetdetail.find({ asset: { $in: req.body.oldname } })
        stockmanage = await Stockmanage.find({ asset: { $in: req.body.oldname } })
        stock = await Stock.find({ asset: { $in: req.body.oldname } })
        manualstockentry = await Manualstock.find({ producthead: { $in: req.body.oldname } })
        console.log(req.body.oldname, "oldname")

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assettypegrouping.length + assetmaterial.length + assetdetail.length +
            stockmanage.length + stock.length + manualstockentry.length,

        assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry,

    });
});



//overall delete assettypemaster
exports.getOverAllDeleteTypeMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry;

    try {
        let querytypegrouping = {
            name: { $in: req.body.accountheadtypegrouping },
        };

        // console.log(querytypegrouping, "querytypegrouping")
        let queryassetmaterial = {
            assettype: { $in: req.body.accountheadassetmaterial },
        };
        let queryassetdetail = {
            assettype: { $in: req.body.accountheadassetdetail },
        };


        let querystockmanage = {

            assettype: { $in: req.body.accountheadstockmanage }
        };


        let querystock = {
            assettype: { $in: req.body.accountheadstock },
        };

        let querymanaulstock = {

            assettype: { $in: req.body.accountheadmanualproduct },
        };

        assettypegrouping = await AssetTypeGrouping.find(querytypegrouping, {
            name: 1,
            _id: 0,
        });
        assetmaterial = await Assetmaterial.find(queryassetmaterial, {
            assettype: 1,
            _id: 0,
        });
        assetdetail = await Assetdetail.find(queryassetdetail, {
            assettype: 1,
            _id: 0,
        });


        stockmanage = await Stockmanage.find(querystockmanage, {
            assettype: 1,
            _id: 0,
        });

        stock = await Stock.find(querystock, {
            assettype: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            assettype: 1,
            _id: 0,
        });


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry,
    });
});


//overall edit assettypemaster
exports.getOverAllEditAssetTypeMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry;
    try {

        assettypegrouping = await AssetTypeGrouping.find({ name: { $in: req.body.oldname } })
        assetmaterial = await Assetmaterial.find({ assettype: { $in: req.body.oldname } })
        assetdetail = await Assetdetail.find({ assettype: { $in: req.body.oldname } })
        stockmanage = await Stockmanage.find({ assettype: { $in: req.body.oldname } })
        stock = await Stock.find({ assettype: { $in: req.body.oldname } })
        manualstockentry = await Manualstock.find({ assettype: { $in: req.body.oldname } })


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assettypegrouping.length + assetmaterial.length + assetdetail.length +
            stockmanage.length + stock.length + manualstockentry.length,

        assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry,

    });
});




//overall delete assetmaterial
exports.getOverAllDeleteAssetMaterialLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        assetproblem, maintenancemaster, assetempdistribution, stockmanage, stock, manualstockentry,
        maintenancenonschedule, employeeassetreturn;

    try {
        let nonschedule = req.body.name || []
        let queryempassetreturn = {
            assetmaterial: { $in: req.body.name },
        };

        let querymaintenancenonschedule = {
            assetmaterial: { $in: nonschedule.map(item => new RegExp("^" + item)) },
        };
        // console.log(querymaintenancenonschedule, req.body, "querymaintenancenonschedule")

        let queryassetspecification = {
            workstation: { $in: req.body.name },
        };

        let queryassetspecificationgrp = {
            assetmaterial: { $in: req.body.name },
        };

        let queryassetdetail = {
            material: { $in: req.body.name },
        };


        let queryassetmaterialip = {
            assetmaterial: { $in: req.body.name },
        };
        let querymaintenancedetailsmaster = {
            assetmaterial: { $in: req.body.name },
        };

        let queryassetworkgrp = {
            assetmaterial: { $in: req.body.name },
        };
        let queryassetproblem = {
            material: { $in: req.body.name },
        };
        // let querymaintenances = {

        //     assetmaterial: { $in: req.body.matmaintenances.map(item => new RegExp("^" + item, "i")) }
        // };

        let matmaintenances = req.body.name || [];
        let querymaintenances = {
            assetmaterial: {
                $in: matmaintenances.map(item => new RegExp("^" + item))
            }
        };
        // console.log(req.body.matmaintenances, "body")


        let queryempdistribution = {
            assetmaterial: { $in: req.body.name },
        };


        let querystockmanage = {

            material: { $in: req.body.name }
        };


        let querystock = {
            productname: { $in: req.body.name },
        };

        let querymanaulstock = {

            productname: { $in: req.body.name },
        };



        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find(querymaintenancenonschedule, {
            assetmaterial: 1,
            _id: 0,
        });
        employeeassetreturn = await EmployeeAssetReturn.find(queryempassetreturn, {
            assetmaterial: 1,
            assetmaterialcode: 1,
            _id: 0,
        });

        assetspecification = await AssetSpecification.find(queryassetspecification, {
            workstation: 1,
            _id: 0,
        });
        assetspecificationgrp = await AssetSpecificationGrouping.find(queryassetspecificationgrp, {
            assetmaterial: 1,
            _id: 0,
        });
        assetdetail = await Assetdetail.find(queryassetdetail, {
            material: 1,
            _id: 0,
        });

        assetmaterialip = await AssetMaterialIP.find(queryassetmaterialip, {
            assetmaterial: 1,
            _id: 0,
        });

        maintenancedetailsmaster = await MaintenanceDetailsmaster.find(querymaintenancedetailsmaster, {
            assetmaterial: 1,
            _id: 0,
        });

        assetworkstationgrouping = await AssetWorkGrp.find(queryassetworkgrp, {
            assetmaterial: 1,
            _id: 0,
        });

        assetproblem = await AssetProblemmaster.find(queryassetproblem, {
            material: 1,
            _id: 0,
        });

        maintenancemaster = await Maintenance.find(querymaintenances, {
            assetmaterial: 1,
            _id: 0,
        });


        assetempdistribution = await Employeeasset.find(queryempdistribution, {
            assetmaterial: 1,
            _id: 0,
        });

        stockmanage = await Stockmanage.find(querystockmanage, {
            material: 1,
            _id: 0,
        });

        stock = await Stock.find(querystock, {
            productname: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            productname: 1,
            _id: 0,
        });


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        assetproblem, maintenancemaster, assetempdistribution, stockmanage, stock, manualstockentry, maintenancenonschedule, employeeassetreturn
    });
});




//overall edit assetmaterial
exports.getOverAllEditAssetMaterialLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        assetproblem, maintenancemaster,
        assetempdistribution, stockmanage, stock,
        manualstockentry, maintenancenonschedule, employeeassetreturn;
    try {
        let matmaintenances = req.body.oldname || [];
        assetspecification = await AssetSpecification.find({ workstation: { $in: req.body.oldname } });
        assetspecificationgrp = await AssetSpecificationGrouping.find({ assetmaterial: { $in: req.body.oldname } });
        assetdetail = await Assetdetail.find({ material: { $in: req.body.oldname } });
        assetmaterialip = await AssetMaterialIP.find({ assetmaterial: { $in: req.body.oldname } });
        maintenancedetailsmaster = await MaintenanceDetailsmaster.find({ assetmaterial: { $in: req.body.oldname } });
        assetworkstationgrouping = await AssetWorkGrp.find({ assetmaterial: { $in: req.body.oldname } });
        assetproblem = await AssetProblemmaster.find({ material: { $in: req.body.oldname } });
        maintenancemaster = await Maintenance.find({
            assetmaterial:
                new RegExp("^" + req.body.oldname)

        });
        assetempdistribution = await Employeeasset.find({ assetmaterial: { $in: req.body.oldname } });
        stockmanage = await Stockmanage.find({ material: { $in: req.body.oldname } });
        stock = await Stock.find({ productname: { $in: req.body.oldname } });
        manualstockentry = await Manualstock.find({ productname: { $in: req.body.oldname } });

        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find({
            assetmaterial:
                new RegExp("^" + req.body.oldname)
        });

        employeeassetreturn = await EmployeeAssetReturn.find({
            assetmaterial: { $in: req.body.oldname }
        });


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assetspecification.length + assetdetail.length + assetspecificationgrp.length + assetmaterialip.length +
            maintenancedetailsmaster.length + assetworkstationgrouping.length + assetproblem.length +
            maintenancemaster.length + assetempdistribution.length +
            stockmanage.length + stock.length + manualstockentry.length +
            maintenancenonschedule.length + employeeassetreturn.length
        ,

        assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        assetproblem, maintenancemaster, assetempdistribution, stockmanage, stock,
        manualstockentry, maintenancenonschedule, employeeassetreturn

    });
});





//overall delete assetspecificaton
exports.getOverAllDeleteAssetSpecificationLinkedDataSingle = catchAsyncErrors(async (req, res, next) => {
    let assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry;

    try {

        let queryassetspecificationgrp = {
            // component: { $in: req.body.matassetspecificationgrp },
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.matassetspecificationgrp } },
                        { subcomponent: { $in: req.body.matassetspecificationgrpsub } },
                    ],
                },
                { component: { $in: req.body.matassetspecificationgrp } },
                { subcomponent: { $in: req.body.matassetspecificationgrpsub } },
            ],
        };

        // console.log(queryassetspecificationgrp, "queryassetspecificationgrp")

        let queryassetdetail = {
            // component: { $in: req.body.matassetdetail },
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.matassetdetail } },
                        { "subcomponent.subname": { $in: req.body.matassetdetailsub } },
                    ],
                },
                { component: { $in: req.body.matassetdetail } },
                { "subcomponent.subname": { $in: req.body.matassetdetailsub } },
            ],
        };
        // console.log(queryassetdetail, "queryassetdetail")

        let querystockmanage = {

            // component: { $in: req.body.matstockmanage }
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.matstockmanage } },
                        { subcomponent: { $in: req.body.matstockmanagesub } },
                    ],
                },
                { component: { $in: req.body.matstockmanage } },
                { subcomponent: { $in: req.body.matstockmanagesub } },
            ],
        };

        // console.log(querystockmanage, "querystockmanage")
        let querystock = {
            // component: { $in: req.body.matstock },
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.matstock } },
                        { "subcomponent.subname": { $in: req.body.matstocksub } },
                    ],
                },
                { component: { $in: req.body.matstock } },
                { "subcomponent.subname": { $in: req.body.matstocksub } },
            ],
        };
        // console.log(querystock, "querystock")
        let querymanaulstock = {

            // component: { $in: req.body.matproduct },
            // subcomponent: { $in: req.body.matproductsub } 
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.matstock } },
                        { "subcomponent.subname": { $in: req.body.matstocksub } },
                    ],
                },
                { component: { $in: req.body.matproduct } },
                { "subcomponent.subname": { $in: req.body.matproductsub } },
            ],
        };

        // console.log(querymanaulstock, "querymanaulstock")
        assetspecificationgrp = await AssetSpecificationGrouping.find(queryassetspecificationgrp, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });
        assetdetail = await Assetdetail.find(queryassetdetail, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });


        stockmanage = await Stockmanage.find(querystockmanage, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        stock = await Stock.find(querystock, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        console.log(assetspecificationgrp.length, "assetspecificationgrp")
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry
    });
});

//overall bulkdelete assetspecification

exports.getOverAllDeleteAssetSpecificationLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry;

    try {
        // console.log(req.body)
        const { data } = req.body

        let queryassetspecificationgrp = {
            $or: data.map(item => {
                if (item.subcomponent && item.subcomponent.length > 0) {
                    return {
                        component: item.component,
                        // subcomponent: { $in: item.subcomponent },
                    };
                } else {
                    return { component: item.component };
                }
            }),
        };





        console.log(queryassetspecificationgrp, "queryassetspecificationgrp")

        let queryassetdetail = {
            // component: { $in: req.body.matassetdetail },
            // $or: data.map(item => ({ component: item.component, "subcomponent.subname": { $in: item.subcomponent }, })),

            $or: data.map(item => {
                if (item.subcomponent && item.subcomponent.length > 0) {
                    return {
                        component: item.component,
                        // "subcomponent.subname": { $in: item.subcomponent },
                    };
                } else {
                    return { component: item.component };
                }
            }),
        };
        // console.log(queryassetdetail, "queryassetdetail")

        let querystockmanage = {

            // component: { $in: req.body.matstockmanage }
            $or: data.map(item => {
                if (item.subcomponent && item.subcomponent.length > 0) {
                    return {
                        component: item.component,
                        // subcomponent: { $in: item.subcomponent },
                    };
                } else {
                    return { component: item.component };
                }
            }),
        };

        // console.log(querystockmanage, "querystockmanage")
        let querystock = {
            $or: data.map(item => {
                if (item.subcomponent && item.subcomponent.length > 0) {
                    return {
                        component: item.component,
                        // "subcomponent.subname": { $in: item.subcomponent },
                    };
                } else {
                    return { component: item.component };
                }
            }),
        };
        // console.log(querystock, "querystock")
        let querymanaulstock = {

            $or: data.map(item => {
                if (item.subcomponent && item.subcomponent.length > 0) {
                    return {
                        component: item.component,
                        // "subcomponent.subname": { $in: item.subcomponent },
                    };
                } else {
                    return { component: item.component };
                }
            }),
        };

        // console.log(querymanaulstock, "querymanaulstock")
        assetspecificationgrp = await AssetSpecificationGrouping.find(queryassetspecificationgrp, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });
        assetdetail = await Assetdetail.find(queryassetdetail, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });


        stockmanage = await Stockmanage.find(querystockmanage, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        stock = await Stock.find(querystock, {
            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            component: 1,
            subcomponent: 1,
            _id: 0,
        });

        // console.log(assetspecificationgrp.length, "assetspecificationgrp")
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry
    });
});



exports.getOverAllEditAssetSpecificationLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry;
    try {
        // console.log(req.body.oldname, "oldname")
        let query = {

            $or: [
                {
                    $and: [
                        { component: { $in: req.body.oldname } },
                        { "subcomponent.subname": { $in: req.body.oldnamesub } },
                    ],
                },
                { component: { $in: req.body.oldname } },
                // { "subcomponent.subname": { $in: req.body.oldnamesub } },
            ],
        };

        let queryasset = {

            $or: [
                {
                    $and: [
                        { component: { $in: req.body.oldname } },
                        { "subcomponent.subname": { $in: req.body.oldnamesub } },
                    ],
                },
                { component: { $in: req.body.oldname } },
                // { "subcomponent.subname": { $in: req.body.oldnamesub } },
            ],
        };

        let querymanual = {

            $or: [
                {
                    $and: [
                        { component: { $in: req.body.oldname } },
                        { "subcomponent.subname": { $in: req.body.oldnamesub } },
                    ],
                },
                { component: { $in: req.body.oldname } },
                // { "subcomponent.subname": { $in: req.body.oldnamesub } },
            ],
        };



        let querymanage = {
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.oldname } },
                        { subcomponent: { $in: req.body.oldnamesub } },
                    ],
                },
                { component: { $in: req.body.oldname } },
                // { subcomponent: { $in: req.body.oldnamesub } },
            ],
        }

        assetspecificationgrp = await AssetSpecificationGrouping.find({
            $or: [
                {
                    $and: [
                        { component: { $in: req.body.oldname } },
                        { subcomponent: { $in: req.body.oldnamesub } },
                    ],
                },
                { component: { $in: req.body.oldname } },
                // { subcomponent: { $in: req.body.oldnamesub } },
            ],
        });


        assetdetail = await Assetdetail.find(queryasset);


        stockmanage = await Stockmanage.find(querymanage);
        stock = await Stock.find(query);
        manualstockentry = await Manualstock.find(querymanual);

        // console.log(manualstockentry, "manualstockentry")

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assetspecificationgrp.length + assetdetail.length + stockmanage.length + stock.length + manualstockentry.length
        ,
        assetspecificationgrp, assetdetail, stockmanage, stock, manualstockentry,

    });
});


//overall delete vendor master
exports.getOverAllDeleteVendorMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let vendorgrouping, assetdetail, expense, schedulepayment, stock, manualstockentry;

    try {

        let queryvendorgrouping = {
            vendor: { $in: req.body.vgroup },
        };

        let queryexpense = {
            vendorname: { $in: req.body.expense },
        };

        let queryschedulepayment = {
            vendor: { $in: req.body.schedule },
        };
        // console.log(req.body.schedule, queryschedulepayment, "queryschedulepayment")


        let queryassetdetail = {
            vendor: { $in: req.body.matassetdetail },
        };




        let querystock = {
            vendor: { $in: req.body.matstock },
        };

        let querymanaulstock = {

            vendorname: { $in: req.body.matproduct },
        };


        vendorgrouping = await VendorGrouping.find(queryvendorgrouping, {
            vendor: 1,
            _id: 0,
        });

        expense = await Expenses.find(queryexpense, {
            vendorname: 1,
            _id: 0,
        });
        schedulepayment = await SchedulePaymentMaster.find(queryschedulepayment, {
            vendor: 1,
            _id: 0,
        });


        assetdetail = await Assetdetail.find(queryassetdetail, {
            vendor: 1,
            _id: 0,
        });



        stock = await Stock.find(querystock, {
            vendor: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            vendorname: 1,
            _id: 0,
        });


    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        vendorgrouping, assetdetail, expense, schedulepayment, stock, manualstockentry
    });
});




//overall edit vendor master
exports.getOverAllEditVendorMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let vendorgrouping, assetdetail, expense, schedulepayment, stock, manualstockentry
    try {
        vendorgrouping = await VendorGrouping.find({ vendor: { $in: req.body.oldname } });
        expense = await Expenses.find({ vendorname: { $in: req.body.oldname } });
        assetdetail = await Assetdetail.find({ vendor: { $in: req.body.oldname } });
        schedulepayment = await SchedulePaymentMaster.find({ vendor: { $in: req.body.oldname } });

        stock = await Stock.find({ vendor: { $in: req.body.oldname } });
        manualstockentry = await Manualstock.find({ vendorname: { $in: req.body.oldname } });



    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: vendorgrouping.length + assetdetail.length + expense.length + schedulepayment.length +
            stock.length + manualstockentry.length
        ,

        vendorgrouping, expense, assetdetail, schedulepayment, stock, manualstockentry,

    });
});


//overall edit vendor master
exports.getOverAllEditVendorMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let vendorgrouping, assetdetail, expense, schedulepayment, stock, manualstockentry
    try {
        vendorgrouping = await VendorGrouping.find({ vendor: { $in: req.body.oldname } });
        expense = await Expenses.find({ vendorname: { $in: req.body.oldname } });
        assetdetail = await Assetdetail.find({ vendor: { $in: req.body.oldname } });
        schedulepayment = await SchedulePaymentMaster.find({ vendor: { $in: req.body.oldname } });

        stock = await Stock.find({ vendor: { $in: req.body.oldname } });
        manualstockentry = await Manualstock.find({ vendorname: { $in: req.body.oldname } });



    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: vendorgrouping.length + assetdetail.length + expense.length + schedulepayment.length +
            stock.length + manualstockentry.length
        ,

        vendorgrouping, expense, assetdetail, schedulepayment, stock, manualstockentry,

    });
});



//overall delete vendor grouping
exports.getOverAllDeleteVendorGroupingLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetdetail, expense, schedulepayment, stock, manualstockentry;

    try {


        let queryexpense = {
            vendorgrouping: { $in: req.body.expense },
        };

        let queryschedulepayment = {
            vendorgrouping: { $in: req.body.schedule },
        };


        let queryassetdetail = {
            vendorgroup: { $in: req.body.matassetdetail },
        };




        let querystock = {
            vendorgroup: { $in: req.body.matstock },
        };

        let querymanaulstock = {

            vendorgroup: { $in: req.body.matproduct },
        };




        expense = await Expenses.find(queryexpense, {
            vendorgrouping: 1,
            _id: 0,
        });
        schedulepayment = await SchedulePaymentMaster.find(queryschedulepayment, {
            vendorgrouping: 1,
            _id: 0,
        });


        assetdetail = await Assetdetail.find(queryassetdetail, {
            vendorgroup: 1,
            _id: 0,
        });



        stock = await Stock.find(querystock, {
            vendorgroup: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(querymanaulstock, {

            vendorgroup: 1,
            _id: 0,
        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assetdetail, expense, schedulepayment, stock, manualstockentry
    });
});


//overall edit vendor grouping
exports.getOverAllEditVendorGroupingLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetdetail, expense, schedulepayment, stock, manualstockentry
    try {
        expense = await Expenses.find({ vendorgrouping: { $in: req.body.oldname } });
        assetdetail = await Assetdetail.find({ vendorgroup: { $in: req.body.oldname } });
        schedulepayment = await SchedulePaymentMaster.find({ vendorgrouping: { $in: req.body.oldname } });

        stock = await Stock.find({ vendorgroup: { $in: req.body.oldname } });
        manualstockentry = await Manualstock.find({ vendorgroup: { $in: req.body.oldname } });



    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assetdetail.length + expense.length + schedulepayment.length +
            stock.length + manualstockentry.length
        ,

        expense, assetdetail, schedulepayment, stock, manualstockentry,

    });
});


//overall delete Frequency
exports.getOverAllDeleteFrequencyLinkedData = catchAsyncErrors(async (req, res, next) => {
    let remainder;
    try {
        let queryremainder = {
            frequency: { $in: req.body.remainder },
        };
        remainder = await Remainder.find(queryremainder, {
            frequency: 1,
            _id: 0,
        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        remainder
    });
});


//overall edit Frequency master
exports.getOverAllEditFrequencyLinkedData = catchAsyncErrors(async (req, res, next) => {
    let remainder
    try {
        remainder = await Remainder.find({ frequency: { $in: req.body.oldname } });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: remainder.length,

        remainder

    });
});





//overall delete uom 
exports.getOverAllDeleteUOMLinkedData = catchAsyncErrors(async (req, res, next) => {
    let stockmanage, stock, manualstockentry;

    try {

        let query = {
            $or: [{ uom: { $in: req.body.data } },

            { "stockmaterialarray.uomnew": { $in: req.body.data } }
            ]
        }

        stockmanage = await Stockmanage.find(query, {
            uom: 1,
            stockmaterialarray: 1,
            requestmode: 1,
            _id: 0,
        });



        stock = await Stock.find(query, {
            uom: 1,
            stockmaterialarray: 1,
            requestmode: 1,
            _id: 0,
        });

        manualstockentry = await Manualstock.find(query, {

            uom: 1,
            stockmaterialarray: 1,
            requestmode: 1,
            _id: 0,
        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        stockmanage, stock, manualstockentry
    });
});


//overall edit uom 
exports.getOverAllEditUOMLinkedData = catchAsyncErrors(async (req, res, next) => {
    let stockmanage, stock, manualstockentry
    try {

        let query = {
            $or: [{ uom: { $in: req.body.oldname } },

            { "stockmaterialarray.uomnew": { $in: req.body.oldname } }
            ]
        }

        stockmanage = await Stockmanage.find(query);
        stock = await Stock.find(query);
        manualstockentry = await Manualstock.find(query);


        // console.log(stockmanage, stock, manualstockentry, "edit")
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: stockmanage.length + stock.length + manualstockentry.length
        ,

        stockmanage, stock, manualstockentry,

    });
});


//overall delete asset master
exports.getOverAllDeleteAssetMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialip, assetworkstationgrouping, maintenancemaster,
        maintenancedetailsmaster, assetempdistribution, maintenancenonschedulegrouping


    try {
        // console.log(req.body, "body")
        let assetips = req.body.matassetip.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            component: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetipsworkstation = req.body.matassetip.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            workstation: item.workstation,
            location: item.location,
            component: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetnonschedule = req.body.matassetip.map((item) => ({
            companyto: item.company,
            branchto: item.branch,
            unitto: item.unit,
            floorto: item.floor,
            areato: item.area,
            locationto: item.location,
            assetmaterial: `${item.assetmaterial}-${item.code}`
        }));

        let assetmaintenance = req.body.matassetip.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            assetmaterialcode: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetemployeeasset = req.body.matassetip.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            assetmaterialcode: `${item.assetmaterial}-${item.code}`
        }));




        let queryassetmaterialip = {
            $or: assetips
        };


        let queryassetemployeeasset = {
            $or: assetemployeeasset
        };

        let queryassetnonschedule = {
            $or: assetnonschedule
        };

        let queryassetmaintenance = {
            $or: assetmaintenance
        };






        assetmaterialip = await AssetMaterialIP.find(queryassetmaterialip, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            location: 1,
            area: 1,
            assetmaterial: 1,
            component: 1,
            _id: 0,
        });



        assetworkstationgrouping = await AssetWorkGrp.find(queryassetmaterialip, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            location: 1,
            workstation: 1,
            assetmaterial: 1,
            component: 1,
            _id: 0,
        });



        assetempdistribution = await Employeeasset.find(queryassetemployeeasset, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            location: 1,
            assetmaterial: 1,
            assetmaterialcode: 1,

            _id: 0,
        });


        maintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.find(queryassetnonschedule, {
            companyto: 1,
            branchto: 1,
            unitto: 1,
            floorto: 1,
            areato: 1,
            locationto: 1,
            assetmaterial: 1,
            _id: 0,
        });


        maintenancemaster = await Maintenance.find(queryassetmaintenance, {
            company: 1,
            branch: 1,
            unit: 1,
            location: 1,
            floor: 1,
            area: 1,
            assetmaterial: 1,
            assetmaterialcode: 1,
            _id: 0,
        });



    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
    // console.log(assettypegrouping, "condition")
    return res.status(200).json({
        assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        maintenancemaster, assetempdistribution, maintenancenonschedulegrouping
    });
});




//overall edit asset master
exports.getOverAllEditAssetMasterLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialip, assetworkstationgrouping, maintenancemaster,
        maintenancedetailsmaster, assetempdistribution, maintenancenonschedulegrouping
    try {
        let assetips = req.body.oldname.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            component: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetipsworkstation = req.body.oldname.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            workstation: item.workstation,
            location: item.location,
            component: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetnonschedule = req.body.oldname.map((item) => ({
            companyto: item.company,
            branchto: item.branch,
            unitto: item.unit,
            floorto: item.floor,
            areato: item.area,
            locationto: item.location,
            assetmaterial: `${item.assetmaterial}-${item.code}`
        }));

        let assetmaintenance = req.body.oldname.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            assetmaterialcode: { $elemMatch: { $regex: `.*${item.code.replace(/[$^.*+?()[\]{}|\\]/g, '\\$&')}.*`, $options: "i" } },
        }));

        let assetemployeeasset = req.body.oldname.map((item) => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            assetmaterialcode: `${item.assetmaterial}-${item.code}`
        }));




        let queryassetmaterialip = {
            $or: assetips
        };


        let queryassetemployeeasset = {
            $or: assetemployeeasset
        };

        let queryassetnonschedule = {
            $or: assetnonschedule
        };

        let queryassetmaintenance = {
            $or: assetmaintenance
        };






        assetmaterialip = await AssetMaterialIP.find(queryassetmaterialip, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            location: 1,
            area: 1,
            assetmaterial: 1,
            component: 1,

        });



        assetworkstationgrouping = await AssetWorkGrp.find(queryassetmaterialip, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            location: 1,
            workstation: 1,
            assetmaterial: 1,
            component: 1,

        });



        assetempdistribution = await Employeeasset.find(queryassetemployeeasset, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            location: 1,
            assetmaterial: 1,
            assetmaterialcode: 1,


        });


        maintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.find(queryassetnonschedule, {
            companyto: 1,
            branchto: 1,
            unitto: 1,
            floorto: 1,
            areato: 1,
            locationto: 1,
            assetmaterial: 1,

        });


        maintenancemaster = await Maintenance.find(queryassetmaintenance, {
            company: 1,
            branch: 1,
            unit: 1,
            location: 1,
            floor: 1,
            area: 1,
            assetmaterial: 1,
            assetmaterialcode: 1,

        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: assetmaterialip.length + assetworkstationgrouping.length +
            maintenancemaster.length + assetempdistribution.length + maintenancenonschedulegrouping.length
        ,

        assetmaterialip, assetworkstationgrouping, maintenancemaster,
        maintenancedetailsmaster, assetempdistribution, maintenancenonschedulegrouping

    });
});


