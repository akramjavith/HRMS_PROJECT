const express = require("express");
const hrmoduleRoute = express.Router();

// connect Department controller
const { getAllAddlDepartmentLimit, getAllDepartmentDetails, addDepartmentDetails, updateDepartmentDetails, getSingleDepartmentDetails, deleteDepartmentDetails, getOverallDepartmentDetails } = require("../controller/modules/department");

hrmoduleRoute.route("/departments").get(getAllDepartmentDetails);
hrmoduleRoute.route("/departmentslimit").get(getAllAddlDepartmentLimit);
hrmoduleRoute.route("/department/new").post(addDepartmentDetails);
hrmoduleRoute.route("/department/:id").get(getSingleDepartmentDetails).put(updateDepartmentDetails).delete(deleteDepartmentDetails);
hrmoduleRoute.route("/getoveralldepartments").post(getOverallDepartmentDetails);

const { addLead, getAllLead, deleteLead, getSingleLead, updateLead } = require("../controller/modules/lead");
hrmoduleRoute.route("/leads").get(getAllLead);
hrmoduleRoute.route("/lead/new").post(addLead);
hrmoduleRoute.route("/lead/:id").get(getSingleLead).put(updateLead).delete(deleteLead);
// connect designationgroup controller
const { getAllDesiggroup, adddesiggroup, updatedesiggroup, getSingledesiggroup, deletedesiggroup, getOverallDesignationgroupDetails } = require("../controller/modules/designationgroup");

hrmoduleRoute.route("/designationgroup").get(getAllDesiggroup);
hrmoduleRoute.route("/designationgroup/new").post(adddesiggroup);
hrmoduleRoute.route("/designationgroup/:id").get(getSingledesiggroup).put(updatedesiggroup).delete(deletedesiggroup);
hrmoduleRoute.route("/getoveralldesignationgroup").post(getOverallDesignationgroupDetails);

// connect designation controller
const { getAllDesignation, adddesignation, updatedesignation, getSingledesignation, deletedesignation, getOverallDesignationDetails, getCheckDesignationToGroup, getCheckDesignationToBranch } = require("../controller/modules/designation");

hrmoduleRoute.route("/designation").get(getAllDesignation);
hrmoduleRoute.route("/designation/new").post(adddesignation);
hrmoduleRoute.route("/designation/:id").get(getSingledesignation).put(updatedesignation).delete(deletedesignation);
hrmoduleRoute.route("/getoveralldesignation").post(getOverallDesignationDetails);
hrmoduleRoute.route("/designation/groupcheck").post(getCheckDesignationToGroup);
hrmoduleRoute.route("/designation/branchcheck").post(getCheckDesignationToBranch);

// connect Qualification controller
const { getAllQualificationDetails, addQualificationDetails, getOverallQulalificationDetails, updateQualificationDetails, getSingleQualificationDetails, deleteQualificationDetails } = require("../controller/modules/qualification");

hrmoduleRoute.route("/qualifications").get(getAllQualificationDetails);
hrmoduleRoute.route("/qualification/new").post(addQualificationDetails);
hrmoduleRoute.route("/qualification/:id").get(getSingleQualificationDetails).put(updateQualificationDetails).delete(deleteQualificationDetails);
hrmoduleRoute.route("/getoverallqualification").post(getOverallQulalificationDetails);

// connect Teams group controller
const { getAllTeamsDetails, getTeamResults, addTeamsDetails, getAllTeamsDetailsAssignBranch, getNotAsssignHierarchyListFiltered, getNotAsssignHierarchyList, getAllTeamsDetailsDesignationLog, updateTeamsDetails, getSingleTeamsDetails, deleteTeamsDetails, getOverallTeamDetails, getAllTeamsToUnit, getAllTeamsToDepartment } = require("../controller/modules/teams");

hrmoduleRoute.route("/teams").get(getAllTeamsDetails);
hrmoduleRoute.route("/teamsdesignationlog").post(getAllTeamsDetailsDesignationLog);
hrmoduleRoute.route("/team/new").post(addTeamsDetails);
hrmoduleRoute.route("/teamresult").post(getTeamResults);
hrmoduleRoute.route("/team/:id").get(getSingleTeamsDetails).put(updateTeamsDetails).delete(deleteTeamsDetails);
hrmoduleRoute.route("/getoverallteam").post(getOverallTeamDetails);
hrmoduleRoute.route("/team/unitcheck").post(getAllTeamsToUnit);
hrmoduleRoute.route("/team/departcheck").post(getAllTeamsToDepartment);
hrmoduleRoute.route("/notassignhierarchydata").post(getNotAsssignHierarchyList);
hrmoduleRoute.route("/notassignhierarchydatafiltered").post(getNotAsssignHierarchyListFiltered);
hrmoduleRoute.route("/teamsassignbranch").post(getAllTeamsDetailsAssignBranch);


// connect Qualification controller
const { getAllEducation, addEducation, updateEducation, getSingleEducation, deleteEducation } = require("../controller/modules/education");

hrmoduleRoute.route("/educations").get(getAllEducation);
hrmoduleRoute.route("/education/new").post(addEducation);
hrmoduleRoute.route("/education/:id").get(getSingleEducation).put(updateEducation).delete(deleteEducation);

// connect Qualification controller
const { getAllCertification, addCertification, updateCertification, getSingleCertification, deleteCertification } = require("../controller/modules/certification");

hrmoduleRoute.route("/certifications").get(getAllCertification);
hrmoduleRoute.route("/certification/new").post(addCertification);
hrmoduleRoute.route("/certification/:id").get(getSingleCertification).put(updateCertification).delete(deleteCertification);

// connect Qualification controller
const { getAllSkillset, addSkillset, updateSkillset, getSingleSkillset, deleteSkillset, getOverallSkillsetDetails } = require("../controller/modules/skillset");

hrmoduleRoute.route("/skillsets").get(getAllSkillset);
hrmoduleRoute.route("/skillset/new").post(addSkillset);
hrmoduleRoute.route("/skillset/:id").get(getSingleSkillset).put(updateSkillset).delete(deleteSkillset);
hrmoduleRoute.route("/getoverallskillset").post(getOverallSkillsetDetails);

// connect Shift controller..
const { getAllShift, addShift, updateShift, getTodayShift, getAllShiftByCondition, getAllShiftLimited, getSingleShift, deleteShift, getOverallShiftDetails, getSingleusershiftime } = require("../controller/modules/shift");
hrmoduleRoute.route("/shifts").get(getAllShift);
hrmoduleRoute.route("/shift/new").post(addShift);
hrmoduleRoute.route("/todayshifts").post(getTodayShift);
hrmoduleRoute.route("/shift/:id").get(getSingleShift).put(updateShift).delete(deleteShift);
hrmoduleRoute.route("/getoverallshift").post(getOverallShiftDetails);
hrmoduleRoute.route("/user/shiftchecktime").post(getSingleusershiftime);
hrmoduleRoute.route("/shiftslimited").get(getAllShiftLimited);
hrmoduleRoute.route("/shiftsbyconditions").get(getAllShiftByCondition);

// connect Shift Roaster controller..
const { getAllShiftRoaster, addShiftRoaster, updateShiftRoaster, getSingleShiftRoaster, deleteShiftRoaster } = require("../controller/modules/shiftroaster");
hrmoduleRoute.route("/shiftroasters").get(getAllShiftRoaster);
hrmoduleRoute.route("/shiftroaster/new").post(addShiftRoaster);
hrmoduleRoute.route("/shiftroaster/:id").get(getSingleShiftRoaster).put(updateShiftRoaster).delete(deleteShiftRoaster);

//control name route
const { getAllControlName, addcontrolname, deletecontrolname, getSingleControlName, updatecontrolname } = require("../controller/modules/controlName");
hrmoduleRoute.route("/controlnames").get(getAllControlName);
hrmoduleRoute.route("/controlname/new").post(addcontrolname);
hrmoduleRoute.route("/controlname/:id").delete(deletecontrolname).get(getSingleControlName).put(updatecontrolname);

// connect Departmentmontset controller
const { getAllDepartmentmonth, getSingleDepartmentDetailsmonth, getAllDepartmentmonthByPagination, getAllDepartmentmonthProdLimited, getAllDepartmentmonthLimitedForLeave, getAllDepartmentmonthLimited, addDepartmentDetailsmonth, updateDepartmentDetailsmonth, deleteDepartmentDetailsmonth } = require("../controller/modules/departmentmonthset");
hrmoduleRoute.route("/departmentmonthsets").get(getAllDepartmentmonth);
hrmoduleRoute.route("/departmentmonthsetslimited").post(getAllDepartmentmonthLimited);
hrmoduleRoute.route("/departmentmonthsetspaginationlimited").post(getAllDepartmentmonthByPagination);
hrmoduleRoute.route("/departmentmonthset/new").post(addDepartmentDetailsmonth);
hrmoduleRoute.route("/departmentmonthset/:id").get(getSingleDepartmentDetailsmonth).put(updateDepartmentDetailsmonth).delete(deleteDepartmentDetailsmonth);
hrmoduleRoute.route("/departmentmonthsetsprodlimited").post(getAllDepartmentmonthProdLimited);
hrmoduleRoute.route("/departmentmonthsetslimitedforleave").post(getAllDepartmentmonthLimitedForLeave);
//Template Creation backendroute
const { addTemplate, deleteTemplate, getAccssibleAllTemplate, getEmployeeAllTemplate, getCompanyAllTemplate, getAllTemplate, getOverallEditTemplate, getOverallEditTemplatedelete, getSingleTemplate, updateTemplate } = require("../controller/modules/TemplateCreationController");
hrmoduleRoute.route("/templatecreations").get(getAllTemplate);
hrmoduleRoute.route("/accessibletemplatecreations").post(getAccssibleAllTemplate);
hrmoduleRoute.route("/employeetemplatecreations").post(getEmployeeAllTemplate);
hrmoduleRoute.route("/companytemplatecreations").get(getCompanyAllTemplate);
hrmoduleRoute.route("/templatecreation/new").post(addTemplate);
hrmoduleRoute.route("/overalledittemplatecreation").post(getOverallEditTemplate);
hrmoduleRoute.route("/overalledittemplatecreationdelete").post(getOverallEditTemplatedelete);
hrmoduleRoute.route("/templatecreation/:id").delete(deleteTemplate).get(getSingleTemplate).put(updateTemplate);

//Document Preparation backendroute
const { getAllDocumentPreparation, addDocumentPreparation, getLastAutoIdDocumentPrep, getAccessibleBranchAllDocumentPreparation, getSingleDocumentPreparation, getALLUserAttendanceDateStatus, getDocumentPreparationCodes, updateDocumentPreparation, deleteDocumentPreparation } = require("../controller/modules/documentpreparation");
hrmoduleRoute.route("/documentpreparations").get(getAllDocumentPreparation);
hrmoduleRoute.route("/accessiblebranchdocumentpreparations").post(getAccessibleBranchAllDocumentPreparation);
hrmoduleRoute.route("/documentpreparation/new").post(addDocumentPreparation);
hrmoduleRoute.route("/attendancedocumentdate").post(getALLUserAttendanceDateStatus);
hrmoduleRoute.route("/documentpreparationautoid").get(getLastAutoIdDocumentPrep);
hrmoduleRoute.route("/documentpreparationcodes").post(getDocumentPreparationCodes);
hrmoduleRoute.route("/documentpreparation/:id").delete(deleteDocumentPreparation).get(getSingleDocumentPreparation).put(updateDocumentPreparation);

//Company Document Preparation backendroute
const { getAllCompanyDocumentPreparation,
    getLastAutoIdCompanyDocumentPrep,
    getCompanyDocumentPreparationCodes,
    addCompanyDocumentPreparation,
    getSingleCompanyDocumentPreparation,
    updateCompanyDocumentPreparation,
    deleteCompanyDocumentPreparation, getAccessibleBranchAllCompanyDocumentPreparation
} = require("../controller/modules/companyDocumentPreparation");
hrmoduleRoute.route("/companydocumentpreparations").get(getAllCompanyDocumentPreparation);
hrmoduleRoute.route("/accessiblebranchcompanydocumentpreparations").post(getAccessibleBranchAllCompanyDocumentPreparation);
hrmoduleRoute.route("/companydocumentpreparation/new").post(addCompanyDocumentPreparation);
hrmoduleRoute.route("/companydocumentpreparationcodes").post(getCompanyDocumentPreparationCodes);
hrmoduleRoute.route("/companydocumentpreparationautoid").get(getLastAutoIdCompanyDocumentPrep);
hrmoduleRoute.route("/companydocumentpreparation/:id").delete(deleteCompanyDocumentPreparation).get(getSingleCompanyDocumentPreparation).put(updateCompanyDocumentPreparation);

const { getAllTemplatecontrolpanelModel, getAllDuplicateTemplatecontrolpanel, getAaccessibleBranchAllTemplatecontrolpanelModel, deleteSingleObject, getAllFilterTemplatecontrolpanelModel, getSingleTemplatecontrolpanelModel, getAllUserDetailsDocuments, updateTemplatecontrolpanelModel, createTemplatecontrolpanelModel, deleteTemplatecontrolpanelModel } = require("../controller/modules/documents/Templatecontrolpanel");
hrmoduleRoute.route("/templatecontrolpanel").get(getAllTemplatecontrolpanelModel);
hrmoduleRoute.route("/accessibletemplatecontrolpanel").post(getAaccessibleBranchAllTemplatecontrolpanelModel);
hrmoduleRoute.route("/filtertemplatecontrolpanel").post(getAllFilterTemplatecontrolpanelModel);
hrmoduleRoute.route("/duplicatetemplatecontrolpanel").get(getAllDuplicateTemplatecontrolpanel);
hrmoduleRoute.route("/tempcontrolepaneluserfind").post(getAllUserDetailsDocuments);
hrmoduleRoute.route("/templatecontrolpanel/new").post(createTemplatecontrolpanelModel);
hrmoduleRoute.route("/templatecontrolpanelsingle/:parentId/:itemId").delete(deleteSingleObject);
hrmoduleRoute.route("/templatecontrolpanel/:id").put(updateTemplatecontrolpanelModel).get(getSingleTemplatecontrolpanelModel).delete(deleteTemplatecontrolpanelModel);;

// connect Designation month set controller
const { addDesignationMonthSet, deleteDesignationMonthSet, getAllDesignationMonthSet, getAllDesignationmonthByPagination, getSingleDesignationMonthSet, updateDesignationMonthSet } = require("../controller/modules/DesignationMonthSetController");
hrmoduleRoute.route("/designationmonthsets").get(getAllDesignationMonthSet);
hrmoduleRoute.route("/designationmonthset/new").post(addDesignationMonthSet);
hrmoduleRoute.route("/designationmonthsetspaginationlimited").post(getAllDesignationmonthByPagination);
hrmoduleRoute.route("/designationmonthset/:id").get(getSingleDesignationMonthSet).put(updateDesignationMonthSet).delete(deleteDesignationMonthSet);

// connect Process month set controller
const { addProcessMonthSet, deleteProcessMonthSet, getAllProcessMonthSet, getAllProcessmonthByPagination, getSingleProcessMonthSet, updateProcessMonthSet } = require("../controller/modules/ProcessMonthSetController");
hrmoduleRoute.route("/processmonthsets").get(getAllProcessMonthSet);
hrmoduleRoute.route("/processmonthset/new").post(addProcessMonthSet);
hrmoduleRoute.route("/processmonthsetspaginationlimited").post(getAllProcessmonthByPagination);
hrmoduleRoute.route("/processmonthset/:id").get(getSingleProcessMonthSet).put(updateProcessMonthSet).delete(deleteProcessMonthSet);

const { addShiftgrouping, getAllShiftgrouping, getAllShiftgroupingByCondition, getAllShiftgroupingToDelete, getSingleShiftGrouping, updateShiftGrouping, deleteShiftGrouping } = require("../controller/modules/shiftgrouping");
//add shift grouping to db
hrmoduleRoute.route("/shiftgrouping/new").post(addShiftgrouping);
hrmoduleRoute.route("/shiftgroupings").get(getAllShiftgrouping);
hrmoduleRoute.route("/shiftgrouping/:id").get(getSingleShiftGrouping).put(updateShiftGrouping).delete(deleteShiftGrouping);
hrmoduleRoute.route("/shiftgroupings").get(getAllShiftgrouping);
hrmoduleRoute.route("/shiftgroupingsbycondition").get(getAllShiftgroupingByCondition);
hrmoduleRoute.route("/shiftgroupingsbulk").post(getAllShiftgroupingToDelete);

// connect add education category form controller

const { getAllEducationCategory, getSingleEducationCategory, addEducationCategory, updateEducationCategory, deleteEducationCategory } = require("../controller/modules/educationcategory");
hrmoduleRoute.route("/educationcategories").get(getAllEducationCategory);
hrmoduleRoute.route("/educationcategory/new").post(addEducationCategory);
hrmoduleRoute.route("/educationcategory/:id").get(getSingleEducationCategory).put(updateEducationCategory).delete(deleteEducationCategory);

// connect education specilization form controller

const { getAllEducationspecilization, getSingleEducationspecilization, addEducationspecilization, updateEducationspecilization, deleteEducationspecilization } = require("../controller/modules/educationspecilization");
hrmoduleRoute.route("/educationspecilizations").get(getAllEducationspecilization);
hrmoduleRoute.route("/educationspecilization/new").post(addEducationspecilization);
hrmoduleRoute.route("/educationspecilization/:id").get(getSingleEducationspecilization).put(updateEducationspecilization).delete(deleteEducationspecilization);


const { addAdvance, deleteAdvance, getAllAdvance, getAllAdvanceByAssignBranch, getAllAdvanceByAssignBranchHomeList, getAllAdvanceByAssignBranchHome, getSingleAdvance, updateAdvance } = require("../controller/modules/advance");
hrmoduleRoute.route("/advance").get(getAllAdvance);
hrmoduleRoute.route("/advance/new").post(addAdvance);
hrmoduleRoute.route("/advancebyassignbranch").post(getAllAdvanceByAssignBranch);
hrmoduleRoute.route("/advancebyassignbranchhome").get(getAllAdvanceByAssignBranchHome);
hrmoduleRoute.route("/advancebyassignbranchhomelist").post(getAllAdvanceByAssignBranchHomeList);
hrmoduleRoute.route("/advance/:id").get(getSingleAdvance).put(updateAdvance).delete(deleteAdvance);

const { addLoan, deleteLoan, updateLoan, getAllLoan, getAllLoanByAssignBranch, getSingleLoan, getAllLoanByAssignBranchHome } = require("../controller/modules/loan");
hrmoduleRoute.route("/loan").get(getAllLoan);
hrmoduleRoute.route("/loan/new").post(addLoan);
hrmoduleRoute.route("/loanbyassignbrach").post(getAllLoanByAssignBranch);
hrmoduleRoute.route("/loanbyassignbrachhome").get(getAllLoanByAssignBranchHome);
hrmoduleRoute.route("/loan/:id").get(getSingleLoan).put(updateLoan).delete(deleteLoan);

//IDcard Preparation backendroute
const { getAllCardPreparation, addCardPreparation, getSingleCardPreparation, updateCardPreparation, deleteCardPreparation } = require("../controller/modules/documents/Idcardtemplate");
hrmoduleRoute.route("/cardpreparations").get(getAllCardPreparation);
hrmoduleRoute.route("/cardpreparation/new").post(addCardPreparation);
hrmoduleRoute.route("/cardpreparation/:id").delete(deleteCardPreparation).get(getSingleCardPreparation).put(updateCardPreparation);


module.exports = hrmoduleRoute;
