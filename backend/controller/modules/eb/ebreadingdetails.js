const Ebreadingdetails = require('../../../model/modules/eb/ebreadingdetails');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const EbserviceMaster = require('../../../model/modules/eb/ebservicemaster');

//get All Ebreadingdetails =>/api/Ebreadingdetails
exports.getAllEbreadingdetails = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0) {
            filterQuery = { $or: branchFilter };
        }
        ebreadingdetails = await Ebreadingdetails.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebreadingdetails) {
        return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    }
    return res.status(200).json({
        ebreadingdetails
    });
})

exports.getAllEbreadingdetailsServiceStatus = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {


        // ebreadingdetails = await EbserviceMaster.countDocuments({

        //     "servicelog.servicenumber": req.body.servicenumber,
        //     "servicelog.status": "CLOSED",
        //     "servicelog.startdate": { $lte: req.body.startdate },
        //     "servicelog.enddate": { $gte: req.body.enddate }

        // }
        // );
        ebreadingdetails = await EbserviceMaster.countDocuments({
            servicelog: {
                $elemMatch: {
                    servicenumber: req.body.servicenumber,
                    status: { $in: ["CLOSED", "HOLD"] },
                    startdate: { $lte: req.body.startdate },
                    enddate: { $gte: req.body.enddate }
                }
            }
        });

        // console.log(req.body, "dfsf")
        // console.log("Query result:", ebreadingdetails);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        ebreadingdetails
    });
})

exports.getOverAllEbReadingdatacount = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        ebreadingdetails = await Ebreadingdetails.countDocumnets()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebreadingdetails) {
        return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    }
    return res.status(200).json({
        ebreadingdetails
    });
})

//OVERALL DELTE
exports.getOverAllEbReading = catchAsyncErrors(async (req, res, next) => {
    let ebread;
    try {
        let query = {
            servicenumber: { $in: req.body.checkebread },

        };
        ebread = await Ebreadingdetails.find(query, {
            servicenumber: 1,
            _id: 0,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebread) {
        return next(new ErrorHandler("Eb Reading not found!", 404));
    }
    return res.status(200).json({
        ebread,
    });
});

// Filter data functionality
exports.getAllEbreadingdetailsFilter = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetailsfilter, resulted;
    try {
        const { company, branch, floor, servicenumber } = req.body
        let query = {};
        // Object.keys(req.body).forEach((key) => {
        //     if (key !== "headers") {
        //         const value = req.body[key];
        //         if (value !== "") {
        //             query[key] = value.toString();
        //         }
        //     }
        // })
        if (company && company.length > 0) {
            query.company = { $in: company };
        }

        if (branch && branch.length > 0) {
            query.branch = { $in: branch };
        }

        if (servicenumber && servicenumber.length > 0) {
            query.servicenumber = { $in: servicenumber };
        }

        if (floor && floor.length > 0) {
            query.floor = { $in: floor };
        }

        query.readingmode = { $ne: "Open Entry" };
        // console.log(query, "query")
        resulted = await Ebreadingdetails.find(query, {});
        // resulted = ebreadingdetailsfilter.filter((item) => {
        //     for (const key in query) {
        //         if (item[key] !== query[key]) {
        //             return false;
        //         }
        //     }
        //     return true;
        // });
        // console.log(resulted, "resulter")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resulted) {
        return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    }
    return res.status(200).json({
        resulted
    });
})

// Filter data functionality

exports.getAllEbreadingdetailsListFilter = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetailsfilter, resultedlist;
    try {
        const { company, branch, unit, floor, servicenumber, readingmode, fromdate, todate, currentstatus } = req.body;
        let query = {};

        if (company && company.length > 0) {
            query.company = { $in: company };
        }

        if (branch && branch.length > 0) {
            query.branch = { $in: branch };
        }

        if (unit && unit.length > 0) {
            query.unit = { $in: unit };
        }

        if (servicenumber && servicenumber.length > 0) {
            query.servicenumber = { $in: servicenumber };
        }

        if (floor && floor.length > 0) {
            query.floor = { $in: floor };
        }

        if (readingmode && readingmode.length > 0) {
            query.$and = [
                { readingmode: { $in: readingmode } },
                { readingmode: { $ne: "Open Entry" } }]
        }

        if (currentstatus && currentstatus.length > 0) {
            query.currentstatus = { $in: currentstatus };
        }

        if (fromdate && todate) {
            query.date = { $gte: fromdate, $lte: todate };
        }

        ebreadingdetailsfilter = await Ebreadingdetails.find(query, {
            date: 1,
            time: 1,
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            servicenumber: 1,
            readingmode: 1,
            openkwh: 1,
            kvah: 1,
            kvahunit: 1,
            kwhunit: 1,
            pfyphase: 1,
            pfbphase: 1,
            pfrphase: 1,
            pfcurrent: 1,
            pfaverage: 1,
            pf: 1,
            mdrphase: 1,
            mdyphase: 1,
            mdbphase: 1,
            mdcurrent: 1,
            mdaverage: 1,
            md: 1
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebreadingdetailsfilter) {
        return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    }
    return res.status(200).json({
        ebreadingdetailsfilter
    });
})


//create new Ebreadingdetails => /api/Ebreadingdetails/new
exports.addEbreadingdetails = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aEbreadingdetails = await Ebreadingdetails.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Ebreadingdetails => /api/Ebreadingdetails/:id
exports.getSingleEbreadingdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sebreadingdetail = await Ebreadingdetails.findById(id);
    // if (!sebreadingdetail) {
    //     return next(new ErrorHandler('Ebreadingdetails not found', 404));
    // }
    return res.status(200).json({
        sebreadingdetail
    })
})

//update Ebreadingdetails by id => /api/Ebreadingdetails/:id
exports.updateEbreadingdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uebreadingdetail = await Ebreadingdetails.findByIdAndUpdate(id, req.body);
    // if (!uebreadingdetail) {
    //     return next(new ErrorHandler('Ebreadingdetails not found', 404));
    // }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Ebreadingdetails by id => /api/Ebreadingdetails/:id
exports.deleteEbreadingdetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let debreadingdetail = await Ebreadingdetails.findByIdAndRemove(id);
    // if (!debreadingdetail) {
    //     return next(new ErrorHandler('Ebreadingdetails not found', 404));
    // }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getAllEbServiceFilter = catchAsyncErrors(async (req, res, next) => {
    let ebreadingfilter, ebreadingfiltertime1, ebreadingfiltergt, ebreadingfiltertime, ebreadingfiltertimefuture, ebreadingfiltertimeold = [],
        ebreadingwithoutlogoldentry = []
        ;

    try {
        if (req.body.readingmode != "Session Closing") {
            let querytime = {
                company: req.body.company,
                branch: req.body.branch,
                unit: req.body.unit,
                floor: req.body.floor,
                area: req.body.area,
                servicenumber: req.body.servicenumber,
                date: { $eq: req.body.date },
                time: { $lt: req.body.time },
                ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
            };
            // Handling readingmode condition properly
            if (req.body.readingmode) {
                querytime.$and = [
                    { readingmode: { $ne: "Open Entry" } },
                    { readingmode: req.body.readingmode }
                ];
            } else {
                querytime.readingmode = { $ne: "Open Entry" };
            }

            ebreadingfiltertime = await Ebreadingdetails.find(querytime, {
                company: 1, branch: 1, unit: 1, floor: 1, area: 1, servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1, enddate: 1,
                kwhunit: 1, kvahunit: 1, readingmode: 1
            }).sort({ time: -1 }).limit(2);

            //   console.log(ebreadingfiltertime, "ebreadingfiltertime00")

            if (ebreadingfiltertime.length === 0 && (req.body.readingmode === "Daily Closing" || req.body.readingmode === "Month Closing" ||
                req.body.readingmode === "Bill Closing")) {
                let querytimesupdate = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    // readingmode: req.body.readingmode,
                    readingmode: req.body.readingmode,
                    date: { $lt: req.body.date },
                    servicenumber: req.body.servicenumber,
                    ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
                }


                let querytimesupdateopenentry = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    // readingmode: req.body.readingmode,
                    readingmode: "Open Entry", date: { $lte: req.body.date }, enddate: { $gte: req.body.date },
                    servicenumber: req.body.servicenumber,
                }

                ebreadingfiltertime1 = await Ebreadingdetails.find(querytimesupdate, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
                }).sort({ date: -1 }).limit(2);

                let ebreadingfiltertime2 = await Ebreadingdetails.find(querytimesupdateopenentry, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
                }).sort({ date: -1 }).limit(2);
                ebreadingfiltertime1 = [...ebreadingfiltertime1, ...ebreadingfiltertime2]
                // console.log(ebreadingfiltertime1, "ebreadingfiltertime1")

                let queryold = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    servicedate: { $lte: req.body.date },
                    servicenumber: req.body.servicenumber,

                }

                ebreadingfiltertimeold = await EbserviceMaster.find(queryold, {
                    openkwh: 1, kvah: 1, servicelog: 1, createdAt: 1, servicedate: 1
                }).sort({ servicedate: -1 }).limit(2)

                ebreadingwithoutlogoldentry = await Ebreadingdetails.find(querytimesupdate, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
                }).sort({ date: -1 });



                ebreadingfiltertime = ebreadingfiltertime1.length > 0 ? ebreadingfiltertime1 : ebreadingfiltertimeold
            }
            // if (ebreadingfiltertime.length === 0 && req.body.readingmode === "Session Closing") {
            //     let querytimesupdate = {
            //         company: req.body.company,
            //         branch: req.body.branch,
            //         unit: req.body.unit,
            //         floor: req.body.floor,
            //         area: req.body.area,
            //         readingmode: req.body.readingmode,
            //         date: { $lt: req.body.date },
            //         servicenumber: req.body.servicenumber,
            //         ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
            //     }
            //     ebreadingfiltertime1 = await Ebreadingdetails.find(querytimesupdate, {
            //         company: 1, branch: 1, unit: 1, floor: 1, area: 1,
            //         servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
            //         kwhunit: 1, kvahunit: 1, readingmode: 1
            //     }).sort({ date: -1, time: -1 }).limit(2);


            //     let queryold = {
            //         company: req.body.company,
            //         branch: req.body.branch,
            //         unit: req.body.unit,
            //         floor: req.body.floor,
            //         area: req.body.area,
            //         servicenumber: req.body.servicenumber,
            //     }

            //     ebreadingfiltertimeold = await EbserviceMaster.find(queryold, {
            //         openkwh: 1, kvah: 1, servicelog: 1
            //     })

            //     ebreadingfiltertime = ebreadingfiltertime1.length > 0 ? ebreadingfiltertime1 : ebreadingfiltertimeold
            // }

            let querytimefuture = {
                company: req.body.company,
                branch: req.body.branch,
                unit: req.body.unit,
                floor: req.body.floor,
                area: req.body.area,
                servicenumber: req.body.servicenumber,
                readingmode: req.body.readingmode,
                date: { $eq: req.body.date },
                time: { $gt: req.body.time },
                ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
            };


            ebreadingfiltertimefuture = await Ebreadingdetails.find(querytimefuture, {
                company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                kwhunit: 1, kvahunit: 1, readingmode: 1
            }).sort({ date: 1, time: 1 }).limit(2);

            if (ebreadingfiltertimefuture.length === 0) {
                let querytimefuture = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    readingmode: req.body.readingmode,
                    servicenumber: req.body.servicenumber,
                    date: { $gt: req.body.date },
                    ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
                }
                ebreadingfiltertimefuture = await Ebreadingdetails.find(querytimefuture, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1, enddate: 1,
                    servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1
                }).sort({ date: 1, time: -1 }).limit(2);
            }
        }
        else if (req.body.readingmode == "Session Closing") {
            let querytime = {
                company: req.body.company,
                branch: req.body.branch,
                unit: req.body.unit,
                floor: req.body.floor,
                area: req.body.area,
                servicenumber: req.body.servicenumber,
                readingmode: { $in: ["Session Closing", "Daily Closing"] },
                date: { $eq: req.body.date },
                time: { $lt: req.body.time },
                ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
            };
            let querytimeopenentry = {
                company: req.body.company,
                branch: req.body.branch,
                unit: req.body.unit,
                floor: req.body.floor,
                area: req.body.area,
                servicenumber: req.body.servicenumber,
                readingmode: "Open Entry", date: { $lte: req.body.date }, enddate: { $gte: req.body.date },
                // date: { $eq: req.body.date },
                // time: { $lt: req.body.time },
            };
            // querytime.$or = [{ readingmode: "Open Entry", date: { $lte: req.body.date }, enddate: { $gte: req.body.date } },
            // ],

            let ebreadingfiltertime3 = await Ebreadingdetails.find(querytime, {
                company: 1, branch: 1, unit: 1, floor: 1, area: 1, servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1, enddate: 1,
                kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
            }).sort({ time: -1 }).limit(2);

            let ebreadingfiltertime2 = await Ebreadingdetails.find(querytimeopenentry, {
                company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
            }).sort({ date: -1 }).limit(2);

            ebreadingfiltertime = [...ebreadingfiltertime3, ...ebreadingfiltertime2]


            if (ebreadingfiltertime3.length === 0) {
                let querytimesupdate = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    readingmode: { $in: ["Session Closing", "Daily Closing"] },
                    date: { $lt: req.body.date },
                    servicenumber: req.body.servicenumber,
                    ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
                }
                let querytimesupdateopenentry = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    readingmode: "Open Entry", date: { $lte: req.body.date }, enddate: { $gte: req.body.date },

                    servicenumber: req.body.servicenumber,
                }


                ebreadingfiltertime1 = await Ebreadingdetails.find(querytimesupdate, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1,
                }).sort({ date: -1 }).limit(2);


                let ebreadingfiltertime2 = await Ebreadingdetails.find(querytimesupdateopenentry, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, enddate: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1
                }).sort({ date: -1 }).limit(2);

                ebreadingfiltertime1 = [...ebreadingfiltertime1, ...ebreadingfiltertime2]

                console.log(ebreadingfiltertime1.length, "ppp")
                let queryold = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    servicedate: { $lte: req.body.date },
                    // readingmode: req.body.readingmode,
                    servicenumber: req.body.servicenumber,
                }

                ebreadingfiltertimeold = await EbserviceMaster.find(queryold, {
                    openkwh: 1, kvah: 1, servicelog: 1, createdAt: 1, servicedate: 1
                }).sort({ servicedate: -1 }).limit(2)

                ebreadingwithoutlogoldentry = await Ebreadingdetails.find(querytimesupdate, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1,
                    servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1, createdAt: 1,
                }).sort({ date: -1 });

                ebreadingfiltertime = ebreadingfiltertime1.length > 0 ? ebreadingfiltertime1 : ebreadingfiltertimeold
            }
            let querytimefuture = {
                company: req.body.company,
                branch: req.body.branch,
                unit: req.body.unit,
                floor: req.body.floor,
                area: req.body.area,
                servicenumber: req.body.servicenumber,
                readingmode: req.body.readingmode,
                date: { $eq: req.body.date },
                time: { $gt: req.body.time },
                ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
            };
            ebreadingfiltertimefuture = await Ebreadingdetails.find(querytimefuture, {
                company: 1, branch: 1, unit: 1, floor: 1, area: 1, enddate: 1,
                servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
                kwhunit: 1, kvahunit: 1, readingmode: 1
            }).sort({ time: 1 }).limit(2);


            if (ebreadingfiltertimefuture.length === 0) {
                let querytimefuture = {
                    company: req.body.company,
                    branch: req.body.branch,
                    unit: req.body.unit,
                    floor: req.body.floor,
                    area: req.body.area,
                    readingmode: req.body.readingmode,
                    servicenumber: req.body.servicenumber,
                    date: { $gt: req.body.date },
                    ...(req.body.id ? { _id: { $ne: req.body.id } } : {})
                }
                ebreadingfiltertimefuture = await Ebreadingdetails.find(querytimefuture, {
                    company: 1, branch: 1, unit: 1, floor: 1, area: 1, enddate: 1,
                    servicenumber: 1, date: 1, time: 1, openkwh: 1, kvah: 1,
                    kwhunit: 1, kvahunit: 1, readingmode: 1
                }).sort({ date: -1, time: -1 }).limit(2);

            }

        }

    } catch (err) {
        console.log(err, "errlro")
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        ebreadingfilter, ebreadingfiltertimeold, ebreadingfiltergt, ebreadingfiltertime, ebreadingfiltertimefuture, ebreadingwithoutlogoldentry
    });
})





exports.getOverallTableSort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, searchQuery } = req.body;

    let allusers;
    let totalProjects, paginatedData, isEmptyData, result;

    try {
        // const query = searchQuery ? { companyname: { $regex: searchQuery, $options: 'i' } } : {};
        const anse = await Ebreadingdetails.find()
        const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
        const filteredDatas = anse?.filter((item, index) => {
            const itemString = JSON.stringify(item)?.toLowerCase();
            return searchOverTerms.every((term) => itemString.includes(term));
        })
        isEmptyData = searchOverTerms?.every(item => item.trim() === '');
        const pageSized = parseInt(pageSize);
        const pageNumberd = parseInt(page);

        paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);


        totalProjects = await Ebreadingdetails.countDocuments();

        allusers = await Ebreadingdetails.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        result = isEmptyData ? allusers : paginatedData

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // return res.status(200).json({ count: allusers.length, allusers });
    return res.status(200).json({
        allusers,
        totalProjects,
        paginatedData,
        result,
        currentPage: (isEmptyData ? page : 1),
        totalPages: Math.ceil((isEmptyData ? totalProjects : paginatedData?.length) / pageSize),
    });
});




exports.getAllEbreadingdetailsList = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {

        ebreadingdetails = await Ebreadingdetails.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebreadingdetails) {
        return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    }
    return res.status(200).json({
        ebreadingdetails
    });
})


exports.getAllCheckDupeDaily = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            date } = req.body

        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            date
        })

        // console.log(ebreadingdetails, "ebreadingdetails")

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }
    return res.status(200).json({
        ebreadingdetails
    });
})


exports.getAllCheckDupeMonth = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode, company, branch, unit, servicenumber, floor, area, date } = req.body;
        // Extract year and month from the request date
        const [year, month] = date.split('-').map(Number);
        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            $expr: {
                $and: [
                    { $eq: [{ $year: { $toDate: "$date" } }, year] },
                    { $eq: [{ $month: { $toDate: "$date" } }, month] }
                ]
            }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});

exports.getAllCheckDupeBill = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode, company, branch, unit, servicenumber, floor, area, date } = req.body;
        // Extract year and month from the request date
        const [year, month] = date.split('-').map(Number);
        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            $expr: {
                $and: [
                    { $eq: [{ $year: { $toDate: "$date" } }, year] },
                    { $eq: [{ $month: { $toDate: "$date" } }, month] }
                ]
            }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});


exports.getAllCheckDupeBillBefore = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode, company, branch, unit, servicenumber, floor, area, date } = req.body;

        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            date: { $gt: date }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});

exports.getAllCheckDupeDailyEdit = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            date, id } = req.body

        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            date,
            _id: { $ne: id }
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }
    return res.status(200).json({
        ebreadingdetails
    });
})


exports.getAllCheckDupeMonthEdit = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {

        const { readingmode, company, branch, unit, servicenumber, floor, area, date, id } = req.body;
        // Extract year and month from the request date
        const [year, month] = date.split('-').map(Number);
        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            _id: { $ne: id },
            $expr: {
                $and: [
                    { $eq: [{ $year: { $toDate: "$date" } }, year] },
                    { $eq: [{ $month: { $toDate: "$date" } }, month] }
                ]
            }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});

exports.getAllCheckDupeBillEdit = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode, company, branch, unit, servicenumber, floor, area, date, id } = req.body;
        // Extract year and month from the request date
        const [year, month] = date.split('-').map(Number);

        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            _id: { $ne: id },
            $expr: {
                $and: [
                    { $eq: [{ $year: { $toDate: "$date" } }, year] },
                    { $eq: [{ $month: { $toDate: "$date" } }, month] }
                ]
            }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});


exports.getAllCheckDupeBillBeforeEdit = catchAsyncErrors(async (req, res, next) => {
    let ebreadingdetails;
    try {
        const { readingmode, company, branch, unit, servicenumber, floor, area, date, id } = req.body;

        // Query to find documents with matching year and month
        ebreadingdetails = await Ebreadingdetails.countDocuments({
            readingmode,
            company,
            branch,
            unit,
            servicenumber,
            floor,
            area,
            _id: { $ne: id },
            date: { $gt: date }
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    // if (!ebreadingdetails) {
    //     return next(new ErrorHandler('Ebreadingdetails not found!', 404));
    // }

    return res.status(200).json({
        ebreadingdetails
    });
});