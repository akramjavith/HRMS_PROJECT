const express = require('express');
const draftRoute = express.Router();

//authorized route
const { isAuthorized } = require('../middleware/routeauthorised');

// connect customer group controller
const { getAllDrafts, regAuth, getSingleDraft, checkduplicatedraft, updateDraft, deleteDraft } = require('../controller/modules/draft');

draftRoute.route('/drafts').get(getAllDrafts); 
draftRoute.route('/draft/new').post(regAuth); 
draftRoute.route("/draftduplicatecheck").post(checkduplicatedraft);
draftRoute.route('/draft/:id').get(getSingleDraft).put(updateDraft).delete(deleteDraft);

module.exports = draftRoute;