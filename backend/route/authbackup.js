const express = require("express");
const authRoute = express.Router();

//authorized route
const { isAuthorized } = require("../middleware/routeauthorised");

// connect customer group controller
const { getAllUsers, getAlluserDataFilterLongAbsend, getAlluserDataFilterLongAbsendCompleted, getAllUsersPostergenerate, getAllTheLogUsers, getAlluserDataFilterLongAbsendHierarchy,
    getAllEmployeesForAttendanceFilter, getFilteredUserForShiftAdjusment, getAllNotInEmployees,
    deleteUsersShiftAllot, getAllUsersnewFilter, getIndividualUserLoginStatus, getHierarchyBasedEmployeeStatus,
    undoPayrunListInnerDataUser, updateVerifyUser, getAllUsersAssignbranch, getAllUsersexceldataByAssign,
    getAllUsersexceldataAssignbranch, getAllUsersexceldataAssignbranchHome, dynamicQueryUserController, getUserCredentials, getAllUserTemporaryLoginStatus, checkEmployeeEmptyFields, getAllProfileImage, getAllUserClockinAndClockoutStatusCheckLogin, getAllUserLoginStatusAction,
    getAllUserstatusDepCheck, getAllShiftToUserBulkDelete, deleteShiftAnyLog, getAllUserProductionDayShiftAttendanceFilter, getAllUsersEmployee, getAllUserLoginExpStatus, getAllUserLoginStatus, deleteAnyLog, getAllUserProductionDayShiftFilter, updateAnyLogValues,
    getAllUserClockinAndClockoutStatusLoginCheck, updatePayrunListInnerDataUser, getUserDocumentPrep, getAllUserAttendancePayRun, getAllUsersWithoutStatus, getUserWithStatus, getAllTemplateUsers, getOnBoardingSalaryFix, getFormerUserNames, checkduplicateemployeenameedit,
    getAllFilteredUsers, checkduplicateemployeenamecreate, getAllUsersnew, getAllSalaryFixFilterReport, updateUsersShiftLogLastObjects, getAllSalaryFixFilter, getUsersAllData, getAllEnquieryUsers, getAllDactiveIntern, getAllRemoteuserFilter, getAllUserProduction,
    viewpassword, getAllUserClockinAndClockoutStatusMyIndividual, getAllUserClockinAndClockoutStatusForMontLopCalFilterPayrun, getAllUserClockinAndClockoutStatusForMontLopCalFilterPayRunMasterFetch, getAllUserClockinAndClockoutStatusForMontLopCalFilterMinPointsNew,
    getAllUserClockinAndClockoutStatusForMontLopCalFilterPayRunnew, getAllUserClockinAndClockoutStatusForMontLopCalFilterMinPoints, getAllUserClockinAndClockoutStatusLeave, getAllUserClockinAndClockoutStatusForMontLopCal,
    getAllUserClockinAndClockoutStatusForMontLopCalFilter, getAllUserAttMonthCountFilterLimited, getAllUserAttMonthCount, getAllUserAttMonthCountFilter, getAllIntern, updateIntern, userscheckBranch,
    getAllTheUsers, getSingleUserSignleRole, verifyUserEmail, verifytwofa, verifychecktwofa, usersLimitedEmpcode, usersLimitedEmpcodeCreate, usersLimitedEmpcodeNonmanual, updateUsersShiftAllotObjects,
    updateUsersShiftAllotObjectsStatus, getAllUsersLogin, getAllUserstatus, getAllAddEmployeeLimit, getHrManager, getAttenddancefilter, getAllUserstaskProfile, getAllUsersexceldata, getAllUserslimit, regAuth,
    loginAuth, logincheckAuth, loginOut, forgotPassword, resetPassword, getSingleUser, updateUser, deleteUser, updateUserPwd, getAllUserCheck, getAllSkillToUser, getAllRoleToUser, getAllTeamToUser,
    getAllShiftToUser, getAllUserBranch, getAllQualToUser, getAllDesigToUser, getAllUnitToUser, getAllDepartmentToUser, getAllFloorToUser, getAllUserscompanyname, getAllUserClockinAndClockoutStatus, getAllUserClockinAndClockoutStatusFilter,
    getAlluserDataFilter, employeeCodeAutogenerate, getAllUsersnewFilterMissingfield, getAllTheUsersEmployee, getAllUsersWithXEmployee, getAllUserAaccessibleBranch, getAllUsersCompanyname, getHierarchyBasedEmployeeStatusdefault,
    getAllUserEnquiryLive, getAllUsersVisitorRegister, getAllUserClockinAndClockoutStatusDocumentPreparation, getAllUserClockinAndClockoutStatusForMontLopCalFilterDocPrep, getAllUserClockinAndClockoutStatusForMontLopCalFilterFinalSalary,
    updateUserPwdReset, getAllUserClockinAndClockoutStatusLogin, getAllusersLimitedFinalsalary, deleteUserLogObjects, getAllUserClockinAndClockoutStatusIndividualHierarchyFilter, getAllUsersPayrunexceldataFinal, getAllUserAttMonthCountFilterPayRunMaster,
    getAllUserClockinAndClockoutStatusIndividual, authenticateUser, getAllUsersPayrunexceldata, getAllUserClockinAndClockoutStatusFilterDateWise,
    getAllUserClockinAndClockoutStatusIndividualFilter, getAllUserTotalShiftDays, getAllUserTotalShiftDaysHome,
    getUserWithStatusHomeCount, getAllUserHomeCountReleive, getAllUserHomeCountNotClockIn, getAllUserHomeCountNotClockInList,
    getAlluserDataFilterLongAbsendHierarchyHome,
    //  getAlluserDataFilterLongAbsendHierarchyCompleted
} = require("../controller/login/auth");
authRoute.route("/usersproductiondayshiftfilter").post(getAllUserProductionDayShiftFilter);


authRoute.route("/userwithstatushomecount").post(getUserWithStatusHomeCount);
authRoute.route("/userhomecountrelieve").get(getAllUserHomeCountReleive);
authRoute.route("/userhomecountnotclockin").get(getAllUserHomeCountNotClockIn);
authRoute.route("/userhomecountnotclockinlist").get(getAllUserHomeCountNotClockInList);

authRoute.route("/userslimitcompanyname").get(getAllUserscompanyname);
authRoute.route("/getallusersdata").get(getUsersAllData);
authRoute.route("/userclockinclockoutstatuslogincheck").post(getAllUserClockinAndClockoutStatusLoginCheck);
authRoute.route("/usersexceldataassignbranch").post(getAllUsersexceldataAssignbranch);
authRoute.route("/usersexceldataassignbranchhome").get(getAllUsersexceldataAssignbranchHome);
authRoute.route("/usersexceldatabyassignbranch").post(getAllUsersexceldataByAssign);
authRoute.route("/usershiftallotsdelete").post(deleteUsersShiftAllot);
authRoute.route("/individualusersloginstatus").post(getIndividualUserLoginStatus);
authRoute.route("/authenticate").post(authenticateUser);
authRoute.route("/hierarchybasedemployeeloginstatus").post(getHierarchyBasedEmployeeStatus);
authRoute.route("/hierarchybasedemployeeloginstatusdefault").post(getHierarchyBasedEmployeeStatusdefault);
authRoute.route("/getalluserscompanyname").get(getAllUsersCompanyname);
authRoute.route("/usershiftadjustmentfilter").post(getFilteredUserForShiftAdjusment);
authRoute.route("/userforallattendancefilter").post(getAllEmployeesForAttendanceFilter);
authRoute.route("/usersnewfiltermissingfield").post(getAllUsersnewFilterMissingfield);
authRoute.route("/getfilteralluserdatalongabsend").post(getAlluserDataFilterLongAbsend);
authRoute.route("/getfilteralluserdatalongabsendcompleted").post(getAlluserDataFilterLongAbsendCompleted);
authRoute.route("/longabsentrestrictionhierarchylist").post(getAlluserDataFilterLongAbsendHierarchy);
// authRoute.route("/longabsentrestrictionhierarchylistcompleted").post(getAlluserDataFilterLongAbsendHierarchyCompleted);

authRoute.route("/longabsentrestrictionhierarchylistHome").post(getAlluserDataFilterLongAbsendHierarchyHome);


authRoute.route("/usersassignuserbranch").post(getAllUsersAssignbranch);
//log update/delete
authRoute.route("/deleteanylog").delete(deleteAnyLog);
authRoute.route("/deleteshiftanylog").delete(deleteShiftAnyLog);
authRoute.route("/updateanylog").put(updateAnyLogValues);
authRoute.route("/temporaryloginstatus").get(getAllUserTemporaryLoginStatus);

authRoute.route("/usercredentials").post(getUserCredentials);

authRoute.route("/getemployeemissingfields").get(checkEmployeeEmptyFields);

authRoute.route("/getallprofileimages").get(getAllProfileImage);
authRoute.route("/user/shiftcheckbulk").post(getAllShiftToUserBulkDelete);
//expiry data
//emplogin status
authRoute.route("/usersloginstatus").get(getAllUserLoginStatus);
authRoute.route("/usersloginexpiredstatus").get(getAllUserLoginExpStatus);

authRoute.route("/usersstatusdepCheck").post(getAllUserstatusDepCheck);

authRoute.route("/employeecodeautogenerate").post(employeeCodeAutogenerate);

authRoute.route("/usersproductiondayshiftattendancefilter").post(getAllUserProductionDayShiftAttendanceFilter);
authRoute.route("/alluserenquierylive").get(getAllUserEnquiryLive);
authRoute.route("/usersbranchcheck").get(userscheckBranch);
authRoute.route("/userpwreset/:id").put(updateUserPwdReset);
authRoute.route("/formerusernames").get(getFormerUserNames);
authRoute.route("/onboardingsalaryfixfilter").post(getOnBoardingSalaryFix);
authRoute.route("/userwithstatus").post(getUserWithStatus);
authRoute.route("/getalltemplateusers").get(getAllTemplateUsers);
authRoute.route("/verifiedlist/:id").put(updateVerifyUser);
authRoute.route("/checkcompanynamecreate").post(checkduplicateemployeenamecreate);
authRoute.route("/checkcompanynameedit").post(checkduplicateemployeenameedit);
authRoute.route("/userspostergenerate").get(getAllUsersPostergenerate);
authRoute.route("/alluseremployee").get(getAllTheUsersEmployee);
authRoute.route("/getfilteralluserdata").post(getAlluserDataFilter);
authRoute.route('/:id/verify/:token').get(verifyUserEmail);
authRoute.route("/usersenquirystatus").get(getAllEnquieryUsers);
authRoute.route("/allusers").get(getAllTheUsers);
authRoute.route("/alluserslog").get(getAllTheLogUsers);
authRoute.route("/verification/viewpassword").post(viewpassword);
authRoute.route("/userwithaccessiblebranch").post(getAllUserAaccessibleBranch);
authRoute.route("/userswithxemployee").get(getAllUsersWithXEmployee);
authRoute.route("/users").get(getAllUsers); // this is for get all users
authRoute.route("/usersloginallot").get(getAllUsersLogin);
authRoute.route("/usersloginstatusaction").get(getAllUserLoginStatusAction);
authRoute.route("/userslimit").get(getAllAddEmployeeLimit);
authRoute.route("/usersalllimit").get(getAllUserslimit);
authRoute.route("/usersexceldata").get(getAllUsersexceldata);
authRoute.route("/getalluseremployee").get(getAllUsersEmployee);
authRoute.route("/auth/new").post(regAuth); // this is for signup create
authRoute.route("/dynamicqueryuserapi").post(dynamicQueryUserController);
authRoute.route("/usersnewfilter").post(getAllUsersnewFilter);
// authRoute.route('/password/forgot').post(forgotPassword);
// authRoute.route('/password/reset/:token'api/user/teamcheck).put(resetPassword);
authRoute.route("/usertaskprofile").post(getAllUserstaskProfile); //get task with user profile
authRoute.route("/auth/:id").get(getSingleUser).put(updateUser).delete(deleteUser);
authRoute.route("/userpw/:id").put(updateUserPwd);
authRoute.route("/authlog").post(loginAuth);
authRoute.route("/authlogcheck").post(logincheckAuth);
authRoute.route("/authout").get(loginOut);
authRoute.route("/userswithoutstatus").get(getAllUsersWithoutStatus);
authRoute.route("/attendfilter").post(getAttenddancefilter); // this is for get all attendaance filter
authRoute.route("/checkuser").post(getAllUserCheck); // this is for get all users
authRoute.route("/checkuserbranch").post(getAllUserBranch); // this is for get all branchuser
authRoute.route("/user/unitcheck").post(getAllUnitToUser); // this is for get all unituser
authRoute.route("/user/floorcheck").post(getAllFloorToUser); // this is for get all flooruser
authRoute.route("/user/departmentcheck").post(getAllDepartmentToUser);
authRoute.route("/userattmonthstatusfilterlimited").post(getAllUserAttMonthCountFilterLimited);
authRoute.route("/user/desigcheck").post(getAllDesigToUser);
authRoute.route("/user/teamcheck").post(getAllTeamToUser);
authRoute.route("/user/qualcheck").post(getAllQualToUser);
authRoute.route("/user/skillcheck").post(getAllSkillToUser);
authRoute.route("/user/shiftcheck").post(getAllShiftToUser);
authRoute.route("/filteredusers").post(getAllFilteredUsers);
authRoute.route("/gethrmanagers").get(getHrManager);
authRoute.route("/authmultipleroles/:id").get(getSingleUserSignleRole);
authRoute.route("/usersstatus").get(getAllUserstatus); // this is for get all users
authRoute.route("/verifytwofa").post(verifytwofa);
authRoute.route("/verifytwofacheck").post(verifychecktwofa);
authRoute.route("/usershiftallotsupdate").post(updateUsersShiftAllotObjects);
authRoute.route("/usershiftallotsupdatestatus").post(updateUsersShiftAllotObjectsStatus);
authRoute.route("/userslimitedempcode").post(usersLimitedEmpcode);
authRoute.route("/userslimitedempcodecreate").post(usersLimitedEmpcodeCreate);
authRoute.route("/userslimitedempcodenonmanual").get(usersLimitedEmpcodeNonmanual);
authRoute.route("/userclockinclockoutstatus").post(getAllUserClockinAndClockoutStatus);
authRoute.route("/userclockinclockoutstatusfilter").post(getAllUserClockinAndClockoutStatusFilter);
authRoute
    .route("/userclockinclockoutstatusfilterdatewise")
    .post(getAllUserClockinAndClockoutStatusFilterDateWise);
// authRoute.route("/userclockinclockoutstatusformontlopcal").post(getAllUserClockinAndClockoutStatusForMontLopCal);
authRoute.route("/userclockinclockoutstatusformontlopcalfilter").post(getAllUserClockinAndClockoutStatusForMontLopCalFilter);
authRoute.route("/usersprod").get(getAllUserProduction);
//att month status
//authRoute.route("/userattmonthstatus").post(getAllUserAttMonthCount);
//authRoute.route("/userattmonthstatusfilter").post(getAllUserAttMonthCountFilter);

//boarding llog last entry update
authRoute.route("/boardinglogupdate").post(updateUsersShiftLogLastObjects);

// att indvl status
authRoute.route("/userclockinclockoutstatusindvl").post(getAllUserClockinAndClockoutStatusIndividual);
authRoute.route("/userclockinclockoutstatusindvlfilter").post(getAllUserClockinAndClockoutStatusIndividualFilter);
authRoute.route("/userclockinclockoutstatusmyindvl").post(getAllUserClockinAndClockoutStatusMyIndividual);
authRoute.route("/userclockinclockoutstatusindvlhierarchyfilter").post(getAllUserClockinAndClockoutStatusIndividualHierarchyFilter);

authRoute.route("/salaryfixfilterreport").post(getAllSalaryFixFilterReport);
//inter changes
authRoute.route("/updateinternstatus/:id").put(updateIntern);
authRoute.route("/allinterns").get(getAllIntern); // this is for get all interns
authRoute.route("/deactiveallinterns").get(getAllDactiveIntern); // this is for get all interns
//emplogin status

//payrunmaster
authRoute.route("/userspayrundatalimited").get(getAllUsersPayrunexceldata);
authRoute.route("/userattmonthstatusfilterpayrunmaster").post(getAllUserAttMonthCountFilterPayRunMaster);
authRoute.route("/deleteuserlogobjects").post(deleteUserLogObjects);
authRoute.route("/getallusersattendancepayrun").post(getAllUserAttendancePayRun);
authRoute.route("/updatepayrunlistinnerdatauser").post(updatePayrunListInnerDataUser);
authRoute.route("/undopayrunlistinnerdatauser").post(undoPayrunListInnerDataUser);
//payrun final salary
authRoute.route("/userclockinclockoutstatusformontlopcalfilterfinalsalary").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterFinalSalary);
authRoute.route("/userspayrundatalimitedfinal").post(getAllUsersPayrunexceldataFinal);
authRoute.route("/userslimitedfinalsalary").get(getAllusersLimitedFinalsalary);
authRoute.route("/usernamesearch").post(getUserDocumentPrep);
// authRoute.route("/userclockinclockoutstatusformontlopcalfilterpayrun").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterPayrun);
// authRoute.route("/userclockinclockoutstatusformontlopcalfilterminpoints").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterMinPoints);
// authRoute.route("/userclockinclockoutstatusformontlopcalfilterpayrunnew").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterPayRunnew);
authRoute.route("/userclockinclockoutstatusformontlopcalfilterminpointsnew").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterMinPointsNew);
authRoute.route("/userclockinclockoutstatusformontlopcalfilterpayrunmasterfetch").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterPayRunMasterFetch);
authRoute.route("/allnotinemployees").get(getAllNotInEmployees);
//apply leave section  
authRoute.route("/userclockinclockoutstatusleave").post(getAllUserClockinAndClockoutStatusLeave);

authRoute.route("/getfilterremoteuser").post(getAllRemoteuserFilter);
authRoute.route("/userclockinclockoutstatuslogin").post(getAllUserClockinAndClockoutStatusLogin);
authRoute.route("/userclockinclockoutstatusloginstatuscheck").post(getAllUserClockinAndClockoutStatusCheckLogin);
authRoute.route("/usersnew").get(getAllUsersnew);
//document production/att condition
authRoute.route("/userclockinclockoutstatusdocprep").post(getAllUserClockinAndClockoutStatusDocumentPreparation);
authRoute.route("/userclockinclockoutstatusformontlopcalfilterdocprep").post(getAllUserClockinAndClockoutStatusForMontLopCalFilterDocPrep);

//visitor scan
authRoute.route("/uservisitorregister").post(getAllUsersVisitorRegister);


authRoute.route("/salaryfixfilter").post(getAllSalaryFixFilter);
//for employeedocuments
const { getAllEmployeeDocuments, getAllPreEmployeeDocuments, getAllEmployeeDocumentsforidcard, getSingleEmployeeDocumentByCommonidWithAllnew, getAllEmployeeProfile, getSingleEmployeeDocument, updateEmployeeDocument, deleteEmployeeDocument, addEmployeeDocuments, getSingleEmployeeDocumentByCommonid, getSingleEmployeeDocumentByCommonidWithAll } = require("../controller/login/employeedocuments");
authRoute.route("/employeedocuments").get(getAllEmployeeDocuments);
authRoute.route("/employeedocuments/new").post(addEmployeeDocuments);
authRoute.route("/employeedocument/:id").get(getSingleEmployeeDocument).put(updateEmployeeDocument).delete(deleteEmployeeDocument);
authRoute.route("/employeedocumentcommonid").post(getSingleEmployeeDocumentByCommonid)
authRoute.route("/employeedocumentcommonidwithall").post(getSingleEmployeeDocumentByCommonidWithAll)
authRoute.route("/employeeprofile").get(getAllEmployeeProfile)
authRoute.route("/preemployeedocuments").get(getAllPreEmployeeDocuments);
authRoute.route("/employeedocumentsidcard").get(getAllEmployeeDocumentsforidcard);
authRoute.route("/employeedocumentcommonidwithallnew").post(getSingleEmployeeDocumentByCommonidWithAllnew);
authRoute.route("/getalluserstotalshiftdays").post(getAllUserTotalShiftDays);
authRoute.route("/getalluserstotalshiftdayshome").post(getAllUserTotalShiftDaysHome);

const {
    updateOverallEmployeename,
    updateOverallEmployeeCode,
} = require("../controller/login/OverallEmployeenameUpdate");

authRoute.route("/employeenameoverallupdate").put(updateOverallEmployeename);
authRoute.route("/employeecodeoverallupdate").put(updateOverallEmployeeCode);


const {
    updateOverallBranchname,
    getAllBranchCheck
} = require("../controller/login/OverallBranchnameUpdate");
authRoute.route("/branchoverallupdate").put(updateOverallBranchname);
authRoute.route("/branchAllCheck").post(getAllBranchCheck);

const {
    updateOverallTeamname,
    getAllTeamCheck
} = require("../controller/login/OverallTeamUpdate");

authRoute.route("/overallupdatecheck").put(updateOverallTeamname);
authRoute.route("/overalldelcheck").post(getAllTeamCheck);

const {
    updateOverallDepartmentname,
    getAllDepartmentCheck
} = require("../controller/login/OverallDepatmentUpdate");

authRoute.route("/departoverallupdate").put(updateOverallDepartmentname);
authRoute.route("/departoverallcheck").post(getAllDepartmentCheck);


const {
    updateOverallDesignationname,
    getAllDesignationCheck
} = require("../controller/login/OverallDesignationUpdate");

authRoute.route("/desigoverallupdate").put(updateOverallDesignationname);
authRoute.route("/desigoverallcheck").post(getAllDesignationCheck);



module.exports = authRoute;