const express = require("express");
const { getAllAccuracymaster, getOverallAccuracymasterSort, addaccuracymaster, deleteaccuracymaster, getSingleAccuracymaster, updateaccuracymaster } = require("../controller/modules/accuracy/accuracymaster");
const { getAllExpectedAccuracy, addExpectedAccuracy, getOverallExpectedAccuracySort, deleteExpectedAccuracy, getSingleExpectedAccuracy, updateExpectedAccuracy } = require("../controller/modules/accuracy/expectedaccuracy");
const { getAllAcheivedAccuracy, getOverallAchivedAccuracySort, addAcheivedAccuracy, deleteAcheivedAccuracy, getSingleAcheivedAccuracy, updateAcheivedAccuracy, getSingleExpectedAccuracyByDetails, getSingleAchivedAccuracyByDetails, updateAcheivedAccuracyById } = require("../controller/modules/accuracy/acheivedaccuracy");
const accuracyRoute = express.Router();



//Accuracy master route
accuracyRoute.route('/accuracymaster').get(getAllAccuracymaster);
accuracyRoute.route('/accuracymaster/new').post(addaccuracymaster);
accuracyRoute.route('/accuracymaster/:id').delete(deleteaccuracymaster).get(getSingleAccuracymaster).put(updateaccuracymaster);
accuracyRoute.route('/accuracymastersort').post(getOverallAccuracymasterSort);
//Expected Accuracy
accuracyRoute.route('/expectedaccuracy').get(getAllExpectedAccuracy);
accuracyRoute.route('/expectedaccuracy/new').post(addExpectedAccuracy);
accuracyRoute.route('/expectedaccuracy/:id').delete(deleteExpectedAccuracy).get(getSingleExpectedAccuracy).put(updateExpectedAccuracy);
accuracyRoute.route('/expectedaccuracysort').post(getOverallExpectedAccuracySort);
//Achieved Accuracy /expectedaccuracy/single
accuracyRoute.route('/acheivedaccuracy').get(getAllAcheivedAccuracy);
accuracyRoute.route('/acheivedaccuracysort').post(getOverallAchivedAccuracySort);
accuracyRoute.route('/acheivedaccuracy/new').post(addAcheivedAccuracy);
accuracyRoute.route('/acheivedaccuracy/:id').delete(deleteAcheivedAccuracy).get(getSingleAcheivedAccuracy).put(updateAcheivedAccuracy);
accuracyRoute.route('/expectedaccuracy/single').post(getSingleExpectedAccuracyByDetails);
accuracyRoute.route('/acheivedaccuracy/single').post(getSingleAchivedAccuracyByDetails);
accuracyRoute.route('/acheivedaccuracy/single/:id').put(updateAcheivedAccuracyById);


//Accuracy Queue Grouping route
const { getAllAccuracyqueuegrouping, addAccuracyqueuegrouping, getOverallAccuracyQueueGroupingSort, deleteAccuracyqueuegrouping, getSingleAccuracyqueuegrouping, updateAccuracyqueuegrouping } = require("../controller/modules/accuracy/accuracyqueuegrouping");
accuracyRoute.route('/accuracyqueuegroupings').get(getAllAccuracyqueuegrouping);
accuracyRoute.route('/accuracyqueuegrouping/new').post(addAccuracyqueuegrouping);
accuracyRoute.route('/accuracyqueuegrouping/:id').delete(deleteAccuracyqueuegrouping).get(getSingleAccuracyqueuegrouping).put(updateAccuracyqueuegrouping);
accuracyRoute.route('/accuracyqueuegroupingsort').post(getOverallAccuracyQueueGroupingSort);
//Achieved Accuracy Client /expectedaccuracy/single

const { getAllAcheivedAccuracyclient, addAcheivedAccuracyclient, deleteAcheivedAccuracyClient, getSingleAcheivedAccuracyclient, updateAcheivedAccuracyClient, getSingleExpectedAccuracyByDetailsClient, getSingleAchivedAccuracyByDetailsClient, updateAcheivedAccuracyByIdClient } = require("../controller/modules/accuracy/achievedaccuracyclientstatus");

accuracyRoute.route('/acheivedaccuracyclient').get(getAllAcheivedAccuracyclient);
accuracyRoute.route('/acheivedaccuracyclient/new').post(addAcheivedAccuracyclient);
accuracyRoute.route('/acheivedaccuracyclient/:id').delete(deleteAcheivedAccuracyClient).get(getSingleAcheivedAccuracyclient).put(updateAcheivedAccuracyClient);
accuracyRoute.route('/expectedaccuracy/single').post(getSingleExpectedAccuracyByDetailsClient);
accuracyRoute.route('/acheivedaccuracyclient/single').post(getSingleAchivedAccuracyByDetailsClient);
accuracyRoute.route('/acheivedaccuracyclient/single/:id').put(updateAcheivedAccuracyByIdClient);


//Achieved Accuracy Internal /expectedaccuracy/single
const { getAllAcheivedAccuracyinternal, addAcheivedAccuracyinternal, deleteAcheivedAccuracyInternal, getSingleAcheivedAccuracyinternal, updateAcheivedAccuracyInternal, getSingleExpectedAccuracyByDetailsinternal, getSingleAchivedAccuracyByDetailsinternal, updateAcheivedAccuracyByIdInternal } = require("../controller/modules/accuracy/achievedaccuracyinternalstatus");
accuracyRoute.route('/acheivedaccuracyinternal').get(getAllAcheivedAccuracyinternal);
accuracyRoute.route('/acheivedaccuracyinternal/new').post(addAcheivedAccuracyinternal);
accuracyRoute.route('/acheivedaccuracyinternal/:id').delete(deleteAcheivedAccuracyInternal).get(getSingleAcheivedAccuracyinternal).put(updateAcheivedAccuracyInternal);
accuracyRoute.route('/expectedaccuracy/single').post(getSingleExpectedAccuracyByDetailsinternal);
accuracyRoute.route('/acheivedaccuracyinternal/single').post(getSingleAchivedAccuracyByDetailsinternal);
accuracyRoute.route('/acheivedaccuracyinternal/single/:id').put(updateAcheivedAccuracyByIdInternal);

//Achieved Accuracy Individual 
const { getAllAchievedAccuracyIndividual, addAchievedAccuracyIndividual, getOverallAchievedAccuracyIndividualSort, getOverallAchievedIndividualSort, deleteAchievedAccuracyIndividual, getSingleAchievedAccuracyIndividual, updateAchievedAccuracyIndividual, updateAchievedAccuracyIndividualSingleUpload } = require("../controller/modules/accuracy/achievedaccuracyindividual");

accuracyRoute.route("/achievedaccuracyindividual").get(getAllAchievedAccuracyIndividual);
accuracyRoute.route("/achievedaccuracyindividual/new").post(addAchievedAccuracyIndividual);
accuracyRoute.route("/achievedaccuracyindividualsort").post(getOverallAchievedAccuracyIndividualSort);

accuracyRoute
    .route("/achievedaccuracyindividual/:id")
    .delete(deleteAchievedAccuracyIndividual)
    .get(getSingleAchievedAccuracyIndividual)
    .put(updateAchievedAccuracyIndividual);
accuracyRoute.route("/singleachievedaccuracyindividual/:id").put(updateAchievedAccuracyIndividualSingleUpload);
accuracyRoute.route("/overallachievedaccuracyindividualsort").post(getOverallAchievedIndividualSort);
//filtered data
const { getAchievedAccuracyFilteredData, getAchievedAccuracyFilteredDataHome } = require("../controller/modules/accuracy/achievedaccuracyfilter");
accuracyRoute.route('/acheivedaccuracyindividual').post(getAchievedAccuracyFilteredData);
accuracyRoute.route('/acheivedaccuracyindividualhome').post(getAchievedAccuracyFilteredDataHome);


module.exports = accuracyRoute;