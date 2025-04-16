// exports.getOverallOthertaskConsolidatedReport = catchAsyncErrors(async (req, res, next) => {
//     let result, Queuetypemaster;
//     const { project, category, subcategory, fromdate, todate } = req.body;
//     try {
//         let query = {};

//         // Apply filters for other fields
//         if (Array.isArray(project) && project.length > 0) {
//             query.project = { $in: project };
//         }

//         if (Array.isArray(category) && category.length > 0) {
//             query.category = { $in: category };
//         }

//         if (Array.isArray(subcategory) && subcategory.length > 0) {
//             query.subcategory = { $in: subcategory };
//         }

//         // Date filtering
//         if (fromdate && todate) {
//             const fromDateObj = fromdate;
//             const toDateObj = todate;

//             query.date = {
//                 $gte: fromDateObj,
//                 $lte: toDateObj,
//             };
//         } else if (fromdate) {
//             const fromDateObj = fromdate;
//             query.date = {
//                 $gte: fromDateObj,
//             };
//         } else if (todate) {
//             const toDateObj = todate;
//             query.date = {
//                 $lte: toDateObj,
//             };
//         }


//         // let productionunmatched = await Manageothertask.find(query, { project: 1, category: 1, subcategory: 1, date: 1, total: 1 }).lean();
//         // let Queuetypemaster = await QueueTypeMaster.find({}, { category: 1, subcategory: 1, newrate: 1 }).lean();
//         // const QueuetypeMap = new Map(Queuetypemaster.map((item) => [item.category + "-" + item.subcategory, item]));

//         // result = productionunmatched.reduce((acc, current) => {
//         //     const matchQueuetype = QueuetypeMap.get(current.category + "-" + current.subcategory);
//         //     const newrateval = matchQueuetype ? Number(matchQueuetype.newrate) : 0;
//         //     const existingItemIndex = acc.findIndex((d) => {
//         //         // console.log(d.date, current.date, d.project, current.project, d.category, current.category, d.subcategory, current.subcategory, "condition");
//         //         return (
//         //             d.date === current.date &&
//         //             d.project === current.project &&
//         //             d.category === current.category &&
//         //             d.subcategory === current.subcategory
//         //         );
//         //     });

//         //     if (existingItemIndex !== -1) {
//         //         // Update existing item
//         //         const existingItem = acc[existingItemIndex];

//         //         existingItem.total += Number(current.total);
//         //         existingItem.newrate = newrateval;
//         //     } else {
//         //         // Add new item

//         //         acc.push({
//         //             _id: current._id,
//         //             project: current.project,
//         //             category: current.category,
//         //             subcategory: current.subcategory,
//         //             total: Number(current.total),
//         //             newrate: newrateval,
//         //             date: current.date,
//         //         });
//         //     }
//         //     return acc;
//         // }, []);

//         let productionunmatched = await Manageothertask.find(query, { project: 1, category: 1, subcategory: 1, date: 1, total: 1 }).lean();
//         let Queuetypemaster = await QueueTypeMaster.find({ type: "Other task queues" }, { category: 1, subcategory: 1, newrate: 1 }).lean();

//         const QueuetypeMap = new Map(Queuetypemaster.map((item) => [item.category + "-" + item.subcategory, item]));

//         result = productionunmatched.reduce((accumulator, currentEntry) => {
//             const matchQueuetype = QueuetypeMap.get(`${currentEntry.category}-${currentEntry.subcategory}`);
//             const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : 0;

//             const existingIndex = accumulator.findIndex((existingEntry) =>
//                 existingEntry.date === currentEntry.date &&
//                 existingEntry.project === currentEntry.project &&
//                 existingEntry.category === currentEntry.category &&
//                 existingEntry.subcategory === currentEntry.subcategory
//             );

//             if (existingIndex !== -1) {
//                 // Update existing entry
//                 accumulator[existingIndex].total += Number(currentEntry.total);
//                 accumulator[existingIndex].newrate = newrateValue;
//                 accumulator[existingIndex].totalnew += newrateValue * Number(currentEntry.total);
//             } else {
//                 // Add new entry
//                 accumulator.push({
//                     _id: currentEntry._id,
//                     project: currentEntry.project,
//                     category: currentEntry.category,
//                     subcategory: currentEntry.subcategory,
//                     total: Number(currentEntry.total),
//                     newrate: newrateValue,
//                     date: currentEntry.date,
//                     totalnew: (newrateValue * Number(currentEntry.total))
//                 });
//             }

//             return accumulator;
//         }, []);
//         console.log(result[1], "asdrfe")


//     } catch (err) {
//         console.log(err.message);
//     }

//     return res.status(200).json({
//         result,
//     });
// });



// exports.getOverallOthertaskIndividualReport = catchAsyncErrors(async (req, res, next) => {
//     let result, Queuetypemaster;
//     const { project, category, subcategory, fromdate, todate } = req.body;
//     try {
//         let query = {};

//         // Apply filters for other fields
//         if (Array.isArray(project) && project.length > 0) {
//             query.project = { $in: project };
//         }

//         if (Array.isArray(category) && category.length > 0) {
//             query.category = { $in: category };
//         }

//         if (Array.isArray(subcategory) && subcategory.length > 0) {
//             query.subcategory = { $in: subcategory };
//         }

//         // Date filtering
//         if (fromdate && todate) {
//             const fromDateObj = fromdate;
//             const toDateObj = todate;

//             query.date = {
//                 $gte: fromDateObj,
//                 $lte: toDateObj,
//             };
//         } else if (fromdate) {
//             const fromDateObj = fromdate;
//             query.date = {
//                 $gte: fromDateObj,
//             };
//         } else if (todate) {
//             const toDateObj = todate;
//             query.date = {
//                 $lte: toDateObj,
//             };
//         }


//         let productionunmatched = await Manageothertask.find(query, { project: 1, category: 1, subcategory: 1, date: 1, total: 1 }).lean();
//         let Queuetypemaster = await QueueTypeMaster.find({ type: "Other task queues" }, { category: 1, subcategory: 1, newrate: 1 }).lean();

//         const QueuetypeMap = new Map(Queuetypemaster.map((item) => [item.category + "-" + item.subcategory, item]));

//         result = productionunmatched.map((item, index) => {
//             const matchQueuetype = QueuetypeMap.get(`${item.category}-${item.subcategory}`);
//             const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : 0;

//             return {
//                 _id: item._id,
//                 project: item.project,
//                 category: item.category,
//                 subcategory: item.subcategory,
//                 total: Number(item.total),
//                 newrate: newrateValue,
//                 date: item.date,
//                 totalnew: (newrateValue * Number(item.total))
//             }
//         });


//         console.log(result[1], "indivu")


//     } catch (err) {
//         console.log(err.message);
//     }

//     return res.status(200).json({
//         result,
//     });
// });

