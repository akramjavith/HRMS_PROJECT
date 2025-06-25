
//overall delete assetmaterial
exports.getOverAllDeleteAssetMaterialLinkedData = catchAsyncErrors(async (req, res, next) => {
    let assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
        assetproblem, maintenancemaster, assetempdistribution, stockmanage, stock, manualstockentry,
        maintenancenonschedule, employeeassetreturn,maintenancedetails,assetsoftwaredetails;

    try {
        let nonschedule = req.body.name || []
        let queryempassetreturn = {
            assetmaterial: { $in: req.body.name },
        };

        let querymaintenancenonschedule = {
            assetmaterial: { $in: nonschedule.map(item => new RegExp("^" + item)) },
        };
        

         let querysoftwareassetmaster = {
            assetmaterialcode: { $in: nonschedule.map(item => new RegExp("^" + item)) },
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


           maintenancedetails = await MaintenanceDetailsmaster.find(querymaintenancedetailsmaster, {
            assetmaterial: 1,
            assetmaterialcode: 1,
            _id: 0,
        });


           assetsoftwaredetails = await AssetSoftwareDetails.find(querysoftwareassetmaster, {
       
            assetmaterialcode: 1,
            _id: 0,
        });



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

        maintenancemaster = await Maintenance.find(querymaintenances, {
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




