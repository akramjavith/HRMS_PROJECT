import { BASE_URL } from "./Authservice";

export const SERVICE = {
  //App

  // Companies
  COMPANY: `${BASE_URL}/api/companies`,
  COMPANYLIMIT: `${BASE_URL}/api/companieslimit`,
  COMPANY_CREATE: `${BASE_URL}/api/company/new`,
  COMPANY_SINGLE: `${BASE_URL}/api/company`,
  OVERALL_COMPANY: `${BASE_URL}/api/getoverallcompany`,
  COMPANY_OVERALLDELETE: `${BASE_URL}/api/companydelete`,
  BRANCHNAMECHECK: `${BASE_URL}/api/checkbranch`,
  USERCHECK: `${BASE_URL}/api/checkuser`,
  // Branch
  BRANCH: `${BASE_URL}/api/branches`,
  BRANCHLIMIT: `${BASE_URL}/api/brancheslimit`,
  BRANCH_CREATE: `${BASE_URL}/api/branch/new`,
  BRANCH_SINGLE: `${BASE_URL}/api/branch`,
  OVERALL_BRANCH: `${BASE_URL}/api/getoverallbranch`,
  USERCHECKBRANCH: `${BASE_URL}/api/checkuserbranch`,
  UNITCHECK: `${BASE_URL}/api/unitcheck`,
  FLOORCHECK: `${BASE_URL}/api/floorcheck`,
  BRANCHDESIGCHECK: `${BASE_URL}/api/designation/branchcheck`,

  // Unit
  UNIT: `${BASE_URL}/api/units`,
  UNIT_CREATE: `${BASE_URL}/api/unit/new`,
  UNIT_SINGLE: `${BASE_URL}/api/unit`,
  UNITRESULT: `${BASE_URL}/api/unitresult`,
  UNITARRAYLIST: `${BASE_URL}/api/unitarraylist`,
  TEAMRESULT: `${BASE_URL}/api/teamresult`,
  CUSTOMERDROP: `${BASE_URL}/api/custdropdowns`,
  PROCESSDROP: `${BASE_URL}/api/processdropdwons`,
  QUEUEREPORT: `${BASE_URL}/api/queuereports`,
  OVERALL_UNITS: `${BASE_URL}/api/getoverallunits`,
  TEAMUNITCHECK: `${BASE_URL}/api/team/unitcheck`,
  USERUNITCHECK: `${BASE_URL}/api/user/unitcheck`,
  BRANCHUNIT: `${BASE_URL}/api/branchunits`,
  BRANCHQRCODE: `${BASE_URL}/api/branchesqrcode`,

  // Manage unit branch
  MANAGE: `${BASE_URL}/api/manages`,
  MANAGE_CREATE: `${BASE_URL}/api/manage/new`,
  MANAGE_SINGLE: `${BASE_URL}/api/manage`,
  // Manage unit branch
  MANAGECOMPANY: `${BASE_URL}/api/managecompany`,
  MANAGECOMPANY_CREATE: `${BASE_URL}/api/managecompany/new`,
  MANAGECOMPANY_SINGLE: `${BASE_URL}/api/managecompany`,
  MANPOWER_FLOOR_FILTER: `${BASE_URL}/api/floormanpowers`,
  MANPOWERAREAFILTER: `${BASE_URL}/api/manpowerareas`,

  // Area
  AREAS: `${BASE_URL}/api/areas`,
  AREA_CREATE: `${BASE_URL}/api/area/new`,
  AREA_SINGLE: `${BASE_URL}/api/area`,
  OVERALL_AREA: `${BASE_URL}/api/getoverallareas`,

  // Location
  LOCATION: `${BASE_URL}/api/locations`,
  LOCATION_CREATE: `${BASE_URL}/api/location/new`,
  LOCATION_SINGLE: `${BASE_URL}/api/location`,
  // Floor
  FLOOR: `${BASE_URL}/api/floors`,
  FLOOR_CREATE: `${BASE_URL}/api/floor/new`,
  FLOOR_SINGLE: `${BASE_URL}/api/floor`,
  OVERALL_FLOOR: `${BASE_URL}/api/getoverallfloor`,
  USERFLOORCHECK: `${BASE_URL}/api/user/floorcheck`,

  //Department
  DEPARTMENT: `${BASE_URL}/api/departments`,
  DEPARTMENT_CREATE: `${BASE_URL}/api/department/new`,
  DEPARTMENT_SINGLE: `${BASE_URL}/api/department`,
  OVERALL_DEPARTMENT: `${BASE_URL}/api/getoveralldepartments`,
  USERDEPARTMENTCHECK: `${BASE_URL}/api/user/departmentcheck`,
  TEAMDEPARTMENTCHECK: `${BASE_URL}/api/team/departcheck`,

  //Department
  DESIGNATIONGRP: `${BASE_URL}/api/designationgroup`,
  DESIGNATIONGRP_CREATE: `${BASE_URL}/api/designationgroup/new`,
  DESIGNATIONGRP_SINGLE: `${BASE_URL}/api/designationgroup`,
  OVERALL_DESIGNATIONGROUP: `${BASE_URL}/api/getoveralldesignationgroup`,

  //Designation
  DESIGNATION: `${BASE_URL}/api/designation`,
  DESIGNATION_CREATE: `${BASE_URL}/api/designation/new`,
  DESIGNATION_SINGLE: `${BASE_URL}/api/designation`,
  OVERALL_DESIGNATION: `${BASE_URL}/api/getoveralldesignation`,
  GROUPTODESIGNATIONCHECK: `${BASE_URL}/api/designation/groupcheck`,
  USERDESIGCHECK: `${BASE_URL}/api/user/desigcheck`,

  // Qualification
  QUALIFICATIONS: `${BASE_URL}/api/qualifications`,
  QUALIFICATION_CREATE: `${BASE_URL}/api/qualification/new`,
  QUALIFICATION_SINGLE: `${BASE_URL}/api/qualification`,
  USERQUALCHECK: `${BASE_URL}/api/user/qualcheck`,
  OVERALL_QUALIFICATIONS: `${BASE_URL}/api/getoverallqualification`,

  //Teams
  TEAMS: `${BASE_URL}/api/teams`,
  TEAMS_CREATE: `${BASE_URL}/api/team/new`,
  TEAMS_SINGLE: `${BASE_URL}/api/team`,
  OVERALL_TEAMS: `${BASE_URL}/api/getoverallteam`,
  USERTEAMCHECK: `${BASE_URL}/api/user/teamcheck`,
  PROJECTTEAMCHECK: `${BASE_URL}/api/project/teamcheck`,

  //Shifts
  SHIFT: `${BASE_URL}/api/shifts`,
  SHIFT_CREATE: `${BASE_URL}/api/shift/new`,
  SHIFT_SINGLE: `${BASE_URL}/api/shift`,
  OVERALL_SHIFT: `${BASE_URL}/api/getoverallshift`,
  SHIFT_USER: `${BASE_URL}/api/user/shiftchecktime`,
  USERSHIFTCHECK: `${BASE_URL}/api/user/shiftcheck`,

  //Certification
  CERTIFICATION: `${BASE_URL}/api/certifications`,
  CERTIFICATION_CREATE: `${BASE_URL}/api/certification/new`,
  CERTIFICATION_SINGLE: `${BASE_URL}/api/certification`,

  //Educations
  EDUCATION: `${BASE_URL}/api/educations`,
  EDUCATION_CREATE: `${BASE_URL}/api/education/new`,
  EDUCATION_SINGLE: `${BASE_URL}/api/education`,

  //Skill set
  SKILLSET: `${BASE_URL}/api/skillsets`,
  SKILLSET_CREATE: `${BASE_URL}/api/skillset/new`,
  SKILLSET_SINGLE: `${BASE_URL}/api/skillset`,
  OVERALL_SKILLSET: `${BASE_URL}/api/getoverallskillset`,
  USERSKILLCHECK: `${BASE_URL}/api/user/skillcheck`,
  //shiftroaster
  SHIFTROASTER: `${BASE_URL}/api/shiftroasters`,
  SHIFTROASTER_CREATE: `${BASE_URL}/api/shiftroaster/new`,
  SHIFTROASTER_SINGLE: `${BASE_URL}/api/shiftroaster`,
  //shiftallot
  SHIFTALLOT: `${BASE_URL}/api/shiftallots`,
  SHIFTALLOT_CREATE: `${BASE_URL}/api/shiftallot/new`,
  SHIFTALLOT_SINGLE: `${BASE_URL}/api/shiftallot`,

  //USER
  USER: `${BASE_URL}/api/users`,
  ALLUSERENQLIVE: `${BASE_URL}/api/alluserenquierylive`,
  ALLUSERSDATA: `${BASE_URL}/api/getallusersdata`,
  USER_CREATE: `${BASE_URL}/api/auth/new`,
  USER_SINGLE: `${BASE_URL}/api/auth`,
  USERALLLIMIT: `${BASE_URL}/api/usersalllimit`,
  USER_SINGLE_PWD: `${BASE_URL}/api/userpw`,
  USERSEXCELDATA: `${BASE_URL}/api/usersexceldata`,
  USERTASKPROFILE: `${BASE_URL}/api/usertaskprofile`,
  SENDMAIL: `${BASE_URL}/send-email`,
  USER_STATUS: `${BASE_URL}/api/usersstatus`,
  USERS_LOGIN: `${BASE_URL}/api/usersloginallot`,
  USER_SHIFTALLOT_UPDATE: `${BASE_URL}/api/usershiftallotsupdate`,
  USER_SHIFTALLOT_UPDATE_STATUS: `${BASE_URL}/api/usershiftallotsupdatestatus`,
  USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL: `${BASE_URL}/api/userclockinclockoutstatusformontlopcal`,
  USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER: `${BASE_URL}/api/userclockinclockoutstatusformontlopcalfilter`,
  USERSENQUIERY: `${BASE_URL}/api/usersenquirystatus`,
  ALLUSER: `${BASE_URL}/api/allusers`,
  LOGALLUSER: `${BASE_URL}/api/alluserslog`,
  USER_CLOCKIN_CLOCKOUT_STATUS: `${BASE_URL}/api/userclockinclockoutstatus`,
  USER_CLOCKIN_CLOCKOUT_STATUS_FILTER: `${BASE_URL}/api/userclockinclockoutstatusfilter`,
  USER_CLOCKIN_CLOCKOUT_STATUS_INDVL: `${BASE_URL}/api/userclockinclockoutstatusindvl`,
  USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_FILTER: `${BASE_URL}/api/userclockinclockoutstatusindvlfilter`,
  USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_HIERARFILTER: `${BASE_URL}/api/userclockinclockoutstatusindvlhierarchyfilter`,
  USER_CLOCKIN_CLOCKOUT_STATUS_MYINDVL: `${BASE_URL}/api/userclockinclockoutstatusmyindvl`,
  SHIFTUSERSTIMINGFILTER: `${BASE_URL}/api/shiftuserstimingfilter`,
  UPDATE_ATTANDANCESTATUS: `${BASE_URL}/api/updatesingleattendanceatatus`,

  //intern
  INTERN_STATUS: `${BASE_URL}/api/deactiveallinterns`,
  INTERNUPDATE_STATUS: `${BASE_URL}/api/updateinternstatus`,
  UPDATE_INTERN: `${BASE_URL}/api/updateinternstatus`,
  ALL_INTERNS: `${BASE_URL}/api/allinterns`,
  //designation month set
  DESIGNATIONMONTHSET_ALL: `${BASE_URL}/api/designationmonthsets`,
  DESIGNATIONMONTHSET_CREATE: `${BASE_URL}/api/designationmonthset/new`,
  DESIGNATIONMONTHSET_SINGLE: `${BASE_URL}/api/designationmonthset`,

  //process month set
  PROCESSMONTHSET_ALL: `${BASE_URL}/api/processmonthsets`,
  PROCESSMONTHSET_CREATE: `${BASE_URL}/api/processmonthset/new`,
  PROCESSMONTHSET_SINGLE: `${BASE_URL}/api/processmonthset`,


  //users birthday/work anniversary/ wedding anniversary wishes
  BIRTHDAYEMAIL_SENT: `${BASE_URL}/api/schedule-birthdayemail`,
  WEDDINGEMAIL_SENT: `${BASE_URL}/api/schedule-weddingemail`,
  WORKANNIVERSARYEMAIL_SENT: `${BASE_URL}/api/schedule-workanniversaryemail`,

  //Employee Documents
  EMPLOYEEDOCUMENT: `${BASE_URL}/api/employeedocuments`,
  EMPLOYEEDOCUMENT_CREATE: `${BASE_URL}/api/employeedocuments/new`,
  EMPLOYEEDOCUMENT_SINGLE: `${BASE_URL}/api/employeedocument`,
  EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONID: `${BASE_URL}/api/employeedocumentcommonidwithall`,
  EMPLOYEEDOCUMENTPRE: `${BASE_URL}/api/preemployeedocuments`,

  //DRAFTS
  DRAFT: `${BASE_URL}/api/drafts`,
  DRAFT_CREATE: `${BASE_URL}/api/draft/new`,
  DRAFT_SINGLE: `${BASE_URL}/api/draft`,

  //projects
  //PROJECT
  PROJECT: `${BASE_URL}/api/projects`,
  PROJECTLIMIT: `${BASE_URL}/api/projectslimit`,
  PROJECT_CREATE: `${BASE_URL}/api/project/new`,
  PROJECT_SINGLE: `${BASE_URL}/api/project`,
  OVERALL_PROJECT: `${BASE_URL}/api/overallproj`,
  USERPROJECTCHECK: `${BASE_URL}/api/project/checkuser`,
  PROJTOSUBPROJCHECK: `${BASE_URL}/api/subproject/checkproject`,
  PROJTOMODULEPROJCHECK: `${BASE_URL}/api/module/checkproject`,
  PROJTOSUBMODULEPROJCHECK: `${BASE_URL}/api/submodule/checkproject`,
  PROJTOTASKPROJCHECK: `${BASE_URL}/api/task/checkproject`,

  //SUB PROJECT
  SUBPROJECT: `${BASE_URL}/api/subprojects`,
  SUBPROJECTLIMIT: `${BASE_URL}/api/subprojectslimit`,
  SUBPROJECT_CREATE: `${BASE_URL}/api/subproject/new`,
  SUBPROJECT_SINGLE: `${BASE_URL}/api/subproject`,
  OVERALL_SUBPROJECT: `${BASE_URL}/api/overallsubproj`,
  SUBPROJTOMODULESUBPROJCHECK: `${BASE_URL}/api/module/checksubproject`,
  SUBPROJTOSUBMODULESUBPROJCHECK: `${BASE_URL}/api/submodule/checksubproject`,
  SUBPROJTOTASKSUBPROJCHECK: `${BASE_URL}/api/task/checksubproject`,
  SUBPROJTASKCHECK: `${BASE_URL}/api/subprojecttaskcheck`,
  SUBPROJTASKCHECKEDIT: `${BASE_URL}/api/subprojecttaskcheckedit`,
  // CHECKSUBPROJECTINTASK: `${BASE_URL}/api/task/checksubprojectintask`,

  //MODULE
  MODULE: `${BASE_URL}/api/modules`,
  MODULELIMIT: `${BASE_URL}/api/moduleslimit`,
  MODULE_CREATE: `${BASE_URL}/api/module/new`,
  MODULE_SINGLE: `${BASE_URL}/api/module`,
  OVERALL_MODULE: `${BASE_URL}/api/overallmodule`,
  MODULETOSUBMODULEMODULECHECK: `${BASE_URL}/api/submodule/checkmodule`,
  MODULETOTASKMODULECHECK: `${BASE_URL}/api/task/checkmodule`,
  MODULETASKCHECK: `${BASE_URL}/api/moduletaskcheck`,
  MODULETASKCHECKEDIT: `${BASE_URL}/api/moduletaskcheckedit`,

  //SUBMODULE
  SUBMODULE: `${BASE_URL}/api/submodules`,
  SUBMODULELIMIT: `${BASE_URL}/api/submoduleslimit`,
  SUBMODULE_CREATE: `${BASE_URL}/api/submodule/new`,
  SUBMODULETASKCHECK: `${BASE_URL}/api/submoduletaskcheck`,
  SUBMODULETASKCHECKEDIT: `${BASE_URL}/api/submoduletaskcheckedit`,
  SUBMODULE_SINGLE: `${BASE_URL}/api/submodule`,
  OVERALL_SUBMODULE: `${BASE_URL}/api/overallsubmodule`,
  SUBMODULETOTASKSUBMODULECHECK: `${BASE_URL}/api/task/checksubmodule`,

  //PAGE MODEL
  PAGEMODEL: `${BASE_URL}/api/pagemodels`,
  PAGEMODEL_LIMITED: `${BASE_URL}/api/pagemodelslimited`,
  PAGEMODEL_CREATE: `${BASE_URL}/api/pagemodel/new`,
  PAGETYPE_MAIN: `${BASE_URL}/api/pagetypemaindrop`,
  PAGETYPE_MAIN_MULTI: `${BASE_URL}/api/pagetypemaindropmulti`,
  PAGETYPE_SUBPAGE_DROP: `${BASE_URL}/api/pagetypesubpagedrop`,
  PAGETYPE_SUBPAGE_DROP_MULTI: `${BASE_URL}/api/pagetypesubpagedropmulti`,
  PAGETYPE_SUBSUBPAGE_DROP: `${BASE_URL}/api/pagetypesubsubpagedrop`,

  PAGETYPE_MAIN_EST_TIME: `${BASE_URL}/api/pagetypemainEsttime`,
  PAGEMODEL_SINGLE: `${BASE_URL}/api/pagemodel`,
  SUBPROJECTS_DROP: `${BASE_URL}/api/subprojectsDrop`,
  MODULES_DROP: `${BASE_URL}/api/moduleDrop`,
  SUBMODULES_DROP: `${BASE_URL}/api/submoduleDrop`,

  //CHECKPOINT GROUP
  CHECKPOINTGROUP: `${BASE_URL}/api/checkptgroups`,
  CHECKPOINTGROUP_CREATE: `${BASE_URL}/api/checkptgroup/new`,
  CHECKPOINTGROUP_SINGLE: `${BASE_URL}/api/checkptgroup`,
  GETCHECKPOINTANDTIME: `${BASE_URL}/api/checkpointgettime`,
  GETCHECKPOINTANDTIMEUSECASES: `${BASE_URL}/api/checkpointgettimeusecases`,

  //MAINPAGE
  MAINPAGE: `${BASE_URL}/api/mainpages`,
  MAINPAGE_CREATE: `${BASE_URL}/api/mainpage/new`,
  MAINPAGE_SINGLE: `${BASE_URL}/api/mainpage`,

  //SUBPAGE ONE
  SUBPAGESONE: `${BASE_URL}/api/subpagesone`,
  SUBPAGEONE_CREATE: `${BASE_URL}/api/subpageone/new`,
  SUBPAGEONE_SINGLE: `${BASE_URL}/api/subpageone`,

  //SUBPAGE TWO
  SUBPAGESTWO: `${BASE_URL}/api/subpagestwo`,
  SUBPAGETWO_CREATE: `${BASE_URL}/api/subpagetwo/new`,
  SUBPAGETWO_SINGLE: `${BASE_URL}/api/subpagetwo`,

  //SUBPAGE THREE
  SUBPAGESTHREE: `${BASE_URL}/api/subpagesthree`,
  SUBPAGETHREE_CREATE: `${BASE_URL}/api/subpagethree/new`,
  SUBPAGETHREE_SINGLE: `${BASE_URL}/api/subpagethree`,

  //SUBPAGE FOUR
  SUBPAGESFOUR: `${BASE_URL}/api/subpagesfour`,
  SUBPAGEFOUR_CREATE: `${BASE_URL}/api/subpagefour/new`,
  SUBPAGEFOUR_SINGLE: `${BASE_URL}/api/subpagefour`,

  //SUBPAGE FIVE
  SUBPAGESFIVE: `${BASE_URL}/api/subpagesfive`,
  SUBPAGEFIVE_CREATE: `${BASE_URL}/api/subpagefive/new`,
  SUBPAGEFIVE_SINGLE: `${BASE_URL}/api/subpagefive`,

  //SUBCATEGORY_MASTER
  SUBCATEGORY: `${BASE_URL}/api/categories`,
  SUBCATEGORY_CREATE: `${BASE_URL}/api/category/new`,
  SUBCATEGORY_SINGLE: `${BASE_URL}/api/category`,
  CHECKPOINTGROUP_CHECK: `${BASE_URL}/api/checkptgroup/category`,
  OVERALL_SUBCATEGORY: `${BASE_URL}/api/overallcategory`,

  // Page Type
  PAGETYPE: `${BASE_URL}/api/pagetypes`,
  PAGETYPE_CREATE: `${BASE_URL}/api/pagetype/new`,
  PAGETYPE_SINGLE: `${BASE_URL}/api/pagetype`,

  // Componentsgrouping pages
  COMPONENTSGROUPING: `${BASE_URL}/api/componentsgroupings`,
  COMPONENTSGROUPINGLIMIT: `${BASE_URL}/api/componentsgrouplimit`,
  COMPONENTSGROUPING_CREATE: `${BASE_URL}/api/componentsgroup/new`,
  COMPONENTSGROUPING_SINGLE: `${BASE_URL}/api/componentsgroup`,
  // COMPONENTSGROUPING_PROJECTEXCEL: `${BASE_URL}/api/getoverallcomponentsgroup`,
  // COMPONENTSGROUPINGCHECK: `${BASE_URL}/api/vendor/componentsgroupcheck`,

  // COMPONENT AND SUBCOMPONENT
  COMPSUBCOMPONENT: `${BASE_URL}/api/compsubcomponents`,
  COMPSUBCOMPONENT_CREATE: `${BASE_URL}/api/compsubcomponent/new`,
  COMPSUBCOMPONENT_SINGLE: `${BASE_URL}/api/compsubcomponent`,

  //component for COMPONENT MASTER
  COMPONENTMASTER: `${BASE_URL}/api/components`,
  COMPONENT_CREATE: `${BASE_URL}/api/component/new`,
  COMPONENT_SINGLE: `${BASE_URL}/api/component`,
  COMPONENT_EDITOVERALL: `${BASE_URL}/api/componentoverall`,

  //subcomponent for SUBCOMPONENT MASTER
  SUBCOMPONENTMASTER: `${BASE_URL}/api/subcomponents`,
  SUBCOMPONENT_CREATE: `${BASE_URL}/api/subcomponent/new`,
  SUBCOMPONENT_SINGLE: `${BASE_URL}/api/subcomponent`,
  SUBCOMPONENT_CODE: `${BASE_URL}/api/subcomponentCode`,
  SUBCOMPONENT_CODE_EDIT: `${BASE_URL}/api/subcomponentCodeEdit`,

  //PRIORITY TWO
  PRIORITY: `${BASE_URL}/api/priorities`,
  PRIORITY_CREATE: `${BASE_URL}/api/priority/new`,
  PRIORITY_SINGLE: `${BASE_URL}/api/priority`,
  PRIORITYTOTASKPRIORRITYCHECK: `${BASE_URL}/api/task/checkpriority`,
  OVERALL_PRIORITY: `${BASE_URL}/api/overallpriority`,

  //PROJECTDETAILS
  PROJECTDETAILS: `${BASE_URL}/api/projectdetails`,
  PROJECTDETAILS_CREATE: `${BASE_URL}/api/projectdetail/new`,
  PROJECTDETAILS_SINGLE: `${BASE_URL}/api/projectdetail`,

  //PROJECTESTIMATION
  PROJECTESTIMATION: `${BASE_URL}/api/projectestimations`,
  PROJECTESTIMATION_CREATE: `${BASE_URL}/api/projectestimation/new`,
  PROJECTESTIMATION_SINGLE: `${BASE_URL}/api/projectestimation`,

  //PROJECTALLOCATION
  PROJECTALLOCATION: `${BASE_URL}/api/projectallocations`,
  PROJECTALLOCATION_CREATE: `${BASE_URL}/api/projectallocation/new`,
  PROJECTALLOCATION_SINGLE: `${BASE_URL}/api/projectallocation`,

  //ROLE
  ROLE: `${BASE_URL}/api/roles`,
  ROLE_CREATE: `${BASE_URL}/api/role/new`,
  ROLE_SINGLE: `${BASE_URL}/api/role`,
  OVERALL_ROLE: `${BASE_URL}/api/overallrole`,
  ROLEUSERCHECK: `${BASE_URL}/api/user/rolecheck`,
  USER_SINGLE_ROLE: `${BASE_URL}/api/authmultipleroles`,

  // Controls Grouping
  CONTROLSGROUPING: `${BASE_URL}/api/controlsgroupings`,
  CONTROLSGROUPING_CREATE: `${BASE_URL}/api/controlsgrouping/new`,
  CONTROLSGROUPING_SINGLE: `${BASE_URL}/api/controlsgrouping`,

  MANPOWER: `${BASE_URL}/api/allmanpowers`,
  MANPOWER_CREATE: `${BASE_URL}/api/manpower/new`,
  MANPOWER_SINGLE: `${BASE_URL}/api/manpower`,

  //EXCEL
  EXCEL: `${BASE_URL}/api/excels`,
  EXCELFILTERED: `${BASE_URL}/api/excelsfiltered`,
  EXCEL_CREATE: `${BASE_URL}/api/excel/new`,
  EXCEL_SINGLE: `${BASE_URL}/api/excel`,

  //EXCELmapdata
  EXCELMAPDATA: `${BASE_URL}/api/excelmapdatas`,
  EXCELMAPDATA_CREATE: `${BASE_URL}/api/excelmapdata/new`,
  EXCELMAPDATA_SINGLE: `${BASE_URL}/api/excelmapdata`,
  EXCELMAPDATAQUEUECHECK: `${BASE_URL}/api/timpoints/queue`,
  EXCELMAPCATEGORY: `${BASE_URL}/api/categoryexcel`,
  QUEUEMAPCATEGORY: `${BASE_URL}/api/queueexcel`,
  CUSTOMEREXCEL: `${BASE_URL}/api/customerexcel`,
  EXCELMAPDATARESPERSON_INDIVIDUALWORKORDER: `${BASE_URL}/api/individualworkorderlist`,
  EXCELMAP_MAPPERSON_DELETE: `${BASE_URL}/api/excelmapandpersondelete`,
  GETOVERALL_EXCELMAPDATA: `${BASE_URL}/api/getoverallallottedqueue`,
  EXCELMAPDATAFILTERED: `${BASE_URL}/api/excelmapfiltered`,
  EXCELUNALLOTEDFILTERED: `${BASE_URL}/api/unallotedexcelqueuelist`,
  ALLOTTED_QUEUE_LIST_FILTER: `${BASE_URL}/api/allottedqueuelistfilter`,
  EXCELUNALLOTEDFILTERED_OVERALL: `${BASE_URL}/api/unallotedexcelqueuelistOverall`,

  //EXCELmapdata
  EXCELMAPDATARESPERSON: `${BASE_URL}/api/excelmaprespersondatas`,
  EXCELMAPDATARESPERSON_CREATE: `${BASE_URL}/api/excelmaprespersondata/new`,
  EXCELMAPDATARESPERSON_SINGLE: `${BASE_URL}/api/excelmaprespersondata`,
  EXCELMAPDATARESPERSON_TEAMTOTAL: `${BASE_URL}/api/excelteamtotal`,
  EXCELMAPDATARESPERSON_BRANCHTOTAL: `${BASE_URL}/api/excelbranchtotal`,
  EXCELMAPDATARESPERSON_RESPERSONTOTAL: `${BASE_URL}/api/excelrespersontotal`,
  EXCELUNALLOTEDRESPERSONFILTERED: `${BASE_URL}/api/unallotedexcelrespersonlist`,
  ALLOTTED_RESPONSIBLE_QUEUE_LIST_FILTER: `${BASE_URL}/api/allottedresponsiblequeuelist`,

  //WORK ORDER FILTERS
  PROJECTVENDOR: `${BASE_URL}/api/projectvendors`,
  PROJECTCATEGORY: `${BASE_URL}/api/projectcategorys`,
  CATEGORYSUBCATEGORY: `${BASE_URL}/api/categorysubcategorytime`,
  CATEGORYQUEUE: `${BASE_URL}/api/categoryqueuegrouping`,

  // WORKORDERLIVE
  WORKORDERLIVEDATA: `${BASE_URL}/api/workorderlive`,

  // WORKORERREPORTS

  // WORKORERREPORTS
  BRANCHWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelbranchreportocunt`,
  TEAMWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelteamreportocunt`,
  RESPERSONWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelrespersonreportocunt`,
  CATEGORYWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelcategoryreportocunt`,
  QUEUEWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelqueuereportocunt`,
  CUSTOMERWISEREPORTEXCELUPLOAD: `${BASE_URL}/api/excelcustomerreportocunt`,

  // WORK ORDER PRIMARY
  PRIMARYWORKORDEROVERTATDATA: `${BASE_URL}/api/primaryworkorderovertatdata`,
  PRIMARYWORKORDERNEARTATDATA: `${BASE_URL}/api/primaryworkorderneartatdata`,
  PRIMARYWORKORDERALL: `${BASE_URL}/api/primaryworkorderall`,
  SECONDARYWORKORDERALL: `${BASE_URL}/api/secondaryworkorderall`,
  SECONDARYWORKORDERALLUNALLOTED: `${BASE_URL}/api/secondaryworkorderallunalloted`,
  TERTIARYWORKORDERALL: `${BASE_URL}/api/tertiaryworkorderall`,
  OTHERWORKORDERALL: `${BASE_URL}/api/otherworkorderall`,
  OTHERWORKORDERALL_LIST: `${BASE_URL}/api/excelWorkOrderOtherList`,
  CONSWORKORDER_LIST: `${BASE_URL}/api/consworkorderlist`,
  CONSWORKORDER_LIST_FILTER: `${BASE_URL}/api/consworkorderlistFilter`,
  CONSWORKORDER_LIST_ALL: `${BASE_URL}/api/consworkorderlistAll`,
  CONSWORKORDER_LIST_FILTER_ALL: `${BASE_URL}/api/consworkorderlistAllFilter`,

  TERTIARY_INDIVIDUALWORKORDER: `${BASE_URL}/api/exceltertiaryindividual`,
  EXCELINDIVIDUALPRIMARYWORKORDER: `${BASE_URL}/api/excelindividualprimaryworkorder`,
  SECONDARY_INDIVIDUALWORKORDER: `${BASE_URL}/api/excelsecondaryindividual`,
  INDIVIDUAL_WORKORDER_OTHERSLIST: `${BASE_URL}/api/workorderindividual`,
  INDIVIDUAL_WORKORDER_OTHERSFILTER: `${BASE_URL}/api/workorderindividualfilter`,
  CONSOLIDATED_INDIVIDUAL_LIST: `${BASE_URL}/api/consolidatedindividual`,
  CONSOLIDATED_INDIVIDUAL_LISTFILTER: `${BASE_URL}/api/consolidatedindividualfilter`,

  EXCELINDIVIDUALPRIMARYWORKORDER_NEARTAT: `${BASE_URL}/api/excelindividualprimaryneartat`,
  EXCELINDIVIDUALPRIMARYWORKORDER_ALLLIST: `${BASE_URL}/api/excelindividualprimaryalllist`,

  ///WITHOUT SECONDARY CONSOLIDATED
  WITHOUT_SECONDARY_CONSOLIDATED: `${BASE_URL}/api/withoutsecondaryconsolidated`,
  SECONDARY_CONSOLIDATED_WORKORDER_FILTER: `${BASE_URL}/api/secondaryworkorderlistfilter`,
  //WITHOUT TERTIARY CONSOLIDATED
  WITHOUT_TERTIARY_CONSOLIDATED: `${BASE_URL}/api/withouttertiaryconsolidated`,
  TERTIARY_CONSOLIDATED_WORKORDER_FILTER: `${BASE_URL}/api/tertiaryworkorderlistfilter`,

  //all individual old
  EXCELOLDPRIMARYWORKORDER: `${BASE_URL}/api/liveprimaryall`,
  EXCELOLDPRIMARYWORKORDER_ALLLIST: `${BASE_URL}/api/liveworkorderprimaryall`,
  EXCELOLDPRIMARYWORKORDER_NEARTAT: `${BASE_URL}/api/liveworkordernearprimaryall`,
  SECONDARY_OLDWORKORDER: `${BASE_URL}/api/liveworkordersecondary`,
  TERTIARY_OLDWORKORDER: `${BASE_URL}/api/liveworkordertertiary`,

  //INDIVIDUAL WORKORDER
  // INDIVIDUAL_WORKORDER_OTHERSLIST: `${BASE_URL}/api/workorderindividual`,
  // INDIVIDUAL_WORKORDER_OTHERSFILTER: `${BASE_URL}/api/workorderindividualfilter`,
  // CONSOLIDATED_INDIVIDUAL_LIST: `${BASE_URL}/api/consolidatedindividual`,
  // CONSOLIDATED_INDIVIDUAL_LISTFILTER: `${BASE_URL}/api/consolidatedindividualfilter`,
  CONSOLIDATED_INDIVIDUAL_LIST_ALL: `${BASE_URL}/api/consolidatedindividualall`,
  CONSOLIDATED_INDIVIDUAL_LISTFILTER_ALL: `${BASE_URL}/api/consolidatedindividualfilterall`,

  //queue for QueuePriority
  QUEUE: `${BASE_URL}/api/queues`,
  QUEUE_CREATE: `${BASE_URL}/api/queue/new`,
  QUEUE_SINGLE: `${BASE_URL}/api/queue`,
  OVERALLQUEUE: `${BASE_URL}/api/getoverallqueuemasteredit`,
  OVERALLQUEUE_DELETE: `${BASE_URL}/api/getoverallqueuemasterdelete`,
  OVERALLQUEUE_BULK_DELETE: `${BASE_URL}/api/getoverallqueuemasterbulkdelete`,

  //Queue Grouping
  QUEUEGROUP: `${BASE_URL}/api/queuegroups`,
  QUEUEGROUP_CREATE: `${BASE_URL}/api/queuegroup/new`,
  QUEUEGROUP_SINGLE: `${BASE_URL}/api/queuegroup`,
  OVERALLQUEUE_GROUP_EDIT: `${BASE_URL}/api/getoverallqueuegroupdit`,
  OVERALLQUEUE_GROUP_DELETE: `${BASE_URL}/api/getoverallqueuegroupdelete`,
  OVERALLQUEUE_GROUP_BULK_DELETE: `${BASE_URL}/api/getoverallqueuegroupbulkdelete`,

  // Project master pages
  PROJECTMASTER: `${BASE_URL}/api/projectmasters`,
  PROJECTMASTERLIMIT: `${BASE_URL}/api/projectmasterlimit`,
  PROJECTMASTER_CREATE: `${BASE_URL}/api/projectmaster/new`,
  PROJECTMASTER_SINGLE: `${BASE_URL}/api/projectmaster`,
  OVERALL_PROJECTEXCEL: `${BASE_URL}/api/getoverallprojectmaster`,
  OVERALL_PROJECTEXCEL_BULK_DELETE: `${BASE_URL}/api/getoverallbulkdeleteprojectmaster`,

  // Vendor master pages
  VENDORMASTER: `${BASE_URL}/api/vendormasters`,
  VENDORMASTERLIMIT: `${BASE_URL}/api/vendormasterlimit`,
  VENDORMASTER_CREATE: `${BASE_URL}/api/vendormaster/new`,
  VENDORMASTER_SINGLE: `${BASE_URL}/api/vendormaster`,
  OVERALL_VENDORMASTER: `${BASE_URL}/api/getoverallvendormaster`,
  VENDORPROJECTCHECK: `${BASE_URL}/api/vendor/projectcheck`,
  FILTEREDVENDOREXCELUPLOAD: `${BASE_URL}/api/projectvendorsfilteredexcelupload`,
  OVERALLEDIT_VENDOR: `${BASE_URL}/api/getoverallvendormasteredit`,
  OVERALLEDIT_VENDOR_BULKDELETE: `${BASE_URL}/api/getoverallbulkdeletevendormasteredit`,
  OVERALLEDIT_VENDOR_DELETE: `${BASE_URL}/api/getoverallDeletevendormasteredit`,

  //category  excel
  CATEGORYEXCEL: `${BASE_URL}/api/categoriesexcel`,
  CATEGORYEXCEL_CREATE: `${BASE_URL}/api/categoryexcel/new`,
  CATEGORYEXCEL_SINGLE: `${BASE_URL}/api/categoryexcel`,
  CATEGORYPROJECTCHECK: `${BASE_URL}/api/category/projectcheck`,
  OVERALL_CATEGORYEXCEL: `${BASE_URL}/api/getoverallcategorytmaster`,
  CATEGORYEXCEL_CHECK: `${BASE_URL}/api/vendor/categorycheck`,
  CATEGORYEXCEL_BULK_DELETE: `${BASE_URL}/api/categoryexcelbulkdelete`,

  //subcategory  excel
  SUBCATEGORYEXCEL: `${BASE_URL}/api/subcategoriesexcel`,
  SUBCATEGORYEXCEL_CREATE: `${BASE_URL}/api/subcategoryexcel/new`,
  SUBCATEGORYEXCEL_SINGLE: `${BASE_URL}/api/subcategoryexcel`,
  SUBCATEGORYPROJECTCHECK: `${BASE_URL}/api/subcategory/projectcheck`,
  SUBCATEGORY_CATEGORYCHECK: `${BASE_URL}/api/subcategory/categorycheck`,
  OVERALL_SUBCATEGORYEXCEL: `${BASE_URL}/api/getoverallsubcategorytmaster`,
  SUBCATEGORYEXCEL_CHECK: `${BASE_URL}/api/vendor/subcategorycheck`,
  SUBCATEGORYEXCEL_BULK_DELETE: `${BASE_URL}/api/subcategoryexcelbulkdelete`,

  // Time master pages
  TIMEPOINTS: `${BASE_URL}/api/timepoints`,
  TIMEPOINTS_CREATE: `${BASE_URL}/api/timepoint/new`,
  TIMEPOINTS_SINGLE: `${BASE_URL}/api/timepoint`,
  TIMEPOINTSPROJECTCHECK: `${BASE_URL}/api/timepoints/projectcheck`,
  TIMEPOINTSCATEGORYCHECK: `${BASE_URL}/api/timepoints/categorycheck`,
  TIMEPOINTSSUBCATEGORYCHECK: `${BASE_URL}/api/timepoints/subcategorycheck`,
  TIMEPOINTS_CHECK: `${BASE_URL}/api/vendor/timepointcheck`,
  TIMEPOINTS_CHECKEDIT_EXCELDATAS_CATSUBCATE: `${BASE_URL}/api/checkeditexceldatastimepoint`,
  OVERALL_TIMEPOINTS_BULK_DELETE: `${BASE_URL}/api/getoverallbulkdeletetimepoints`,

  //Create TimePoints Master page
  VENDORS_DROPDOWN: `${BASE_URL}/api/vendordropdown`,
  CATEGORY_DROPDOWNS: `${BASE_URL}/api/categorydowns`,
  SUBCATEGORY_DROPDWONS: `${BASE_URL}/api/subcategorydropdowns`,
  //Edit TimePoints Master page
  VENDORS_DROPDOWN_EDIT: `${BASE_URL}/api/vendordropdownedit`,
  CATEGORY_DROPDOWNS_EDIT: `${BASE_URL}/api/categorydownsedit`,
  SUBCATEGORY_DROPDWONS_EDIT: `${BASE_URL}/api/subcategorydropdownsedit`,

  // Intern Courses
  INTERNCOURSE: `${BASE_URL}/api/internCourses`,
  INTERNCOURSE_CREATE: `${BASE_URL}/api/internCourse/new`,
  INTERNCOURSE_SINGLE: `${BASE_URL}/api/internCourse`,

  //TASK...
  TASK: `${BASE_URL}/api/tasks`,
  TASKLIMIT: `${BASE_URL}/api/taskslimit`,
  TASKBOARD: `${BASE_URL}/api/tasksboard`,
  TASKBOARDLIST: `${BASE_URL}/api/taskboardlist`,
  TASKLIST: `${BASE_URL}/api/taskslist`,
  TASK_CREATE: `${BASE_URL}/api/task/new`,
  TASK_SINGLE: `${BASE_URL}/api/task`,
  GETDEVTASKS: `${BASE_URL}/api/usertaskprofile`,
  TASKSLIMITCREATE: `${BASE_URL}/api/allfiltertaskcreatepage`,
  USERTTASKCHECK: `${BASE_URL}/api/user/task`,
  CHECKPOINTGROUPTOTASK: `${BASE_URL}/api/task/checkgroup`,
  USERTASKS: `${BASE_URL}/api/getsingleusertasks`,
  ALLTASKSADMIN: `${BASE_URL}/api/getalltasksadminview`,

  TASKBOARDVIEW_LIST_FILTER: `${BASE_URL}/api/taskboardviewlistsfilter`,

  //  TASK ASSIGN BOARD LIST
  TASKASSIGN_BOARD_LIST: `${BASE_URL}/api/taskassignboardlists`,
  TASKASSIGNBOARDLIST_CREATE: `${BASE_URL}/api/taskassignboardlist/new`,
  TASKASSIGNBOARDLIST_SINGLE: `${BASE_URL}/api/taskassignboardlist`,
  TASKASSIGNBOARDLIST_SINGLE_WORKORDER_DELETE: `${BASE_URL}/api/taskassignboardlistworkorders`,
  TASKASSIGN_BOARD_LIST_FILTER: `${BASE_URL}/api/taskassignboardlistsfilter`,
  TASKASSIGN_BOARD_LIST_LIMITED: `${BASE_URL}/api/taskassignboardlistslimited`,
  TASKASSIGN_BOARD_LIST_TABLEDATA: `${BASE_URL}/api/taskassignboardliststabledata`,
  NOTTASKASSIGN_BOARD_LIST_TABLEDATA: `${BASE_URL}/api/nottaskassignboardliststabledata`,
  TASKASSIGNBOARDLIST_SINGLE_NEW: `${BASE_URL}/api/taskassignboardlistnew`,
  ALLTASKCOMPLETED: `${BASE_URL}/api/getallcompletedtask`,
  GETTASKBOARDIDSTOUPDATE: `${BASE_URL}/api/gettaskidstoupdaterequirements`,

  // TASKBOARDPAGE USERACCESS
  TASKBOARDDEVELOPERINCOMPLETE: `${BASE_URL}/api/taskboardincompleteusers`,
  TASKBOARDDEVELOPERCOMPLETE: `${BASE_URL}/api/taskboardcompleteusers`,
  TASKBOARDTESTERCOMPLETE: `${BASE_URL}/api/taskboardcompletetester`,
  TASKBOARDTESTERINCOMPLETE: `${BASE_URL}/api/taskboardincompletetester`,
  // TASKBOARDPAGE ALLACESS
  TASKBOARDDEVELOPERINCOMPLETEALL: `${BASE_URL}/api/taskboardincompleteusersallaccess`,
  TASKBOARDDEVELOPERCOMPLETEALL: `${BASE_URL}/api/taskboardcompleteusersallaccess`,
  TASKBOARDTESTERCOMPLETEALL: `${BASE_URL}/api/taskboardcompletetesterallaccess`,
  TASKBOARDTESTERINCOMPLETEALL: `${BASE_URL}/api/taskboardincompletetesterallaccess`,

  //TASKREPORT
  TASKREPORTINCOMPLETE: `${BASE_URL}/api/taskreportdevincomplete`,
  TASKREPORTCOMPLETE: `${BASE_URL}/api/taskreportdevcomplete`,
  TASKREPORTTESTCOMPLETE: `${BASE_URL}/api/taskreporttestercomplete`,
  TASKREPORTTESTINCOMPLETE: `${BASE_URL}/api/taskreporttesterincomplete`,
  //TASKCURRENT AND INCOMPLETE...
  TASKCURRENTINCOMPLETE: `${BASE_URL}/api/taskscurrentincomplete`,
  TASKCURRENTCOMPLETE: `${BASE_URL}/api/taskscurrentcomplete`,
  TASKCURRENTTESTERINCOMPLETE: `${BASE_URL}/api/taskstestercurrentincomplete`,
  TASKCURRENTTESTERCOMPLETE: `${BASE_URL}/api/taskstestercurrentcomplete`,

  TASKFIVEINCOMPLETE: `${BASE_URL}/api/tasksfiveincomplete`,
  TASKFIVECOMPLETE: `${BASE_URL}/api/tasksfivecomplete`,
  //TASKHOMEPAGE
  TASKHOMETODAYDEVINCOMPLETE: `${BASE_URL}/api/taskhomepagetodaydevincomplete`,
  TASKHOMETODAYTESTERINCOMPLETE: `${BASE_URL}/api/taskhomepagetodaytesterincomplete`,
  TASKHOMEDEVINCOMPLETE: `${BASE_URL}/api/taskhomepagedevincomplete`,
  TASKHOMETESTERINCOMPLETE: `${BASE_URL}/api/taskhomepagetesterincomplete`,
  TASKHOMEALLCOMPLETE: `${BASE_URL}/api/taskhomepageallcomplete`,
  TASKHOMEDEVINCOMPLETEACCESS: `${BASE_URL}/api/taskhomepagedevincompleteaccess`,
  TASKHOMETESTERINCOMPLETEACCESS: `${BASE_URL}/api/taskhomepagetesterincompleteaccess`,

  //CHECKTIMER
  // TASKCHECKTIMER: `${BASE_URL}/api/taskassignboardchecktimerstatus`,

  TASKASSIGNCHECKTIMER: `${BASE_URL}/api/taskassignchecktimerstatus`,

  //CHECKPOINTMASTER...
  TASKCHECKDEFAULT: `${BASE_URL}/api/taskcheckdefaults`,
  TASKCHECKDEFAULT_CREATE: `${BASE_URL}/api/taskcheckdefault/new`,
  TASKCHECKDEFAULT_SINGLE: `${BASE_URL}/api/taskcheckdefault`,
  OVERALL_DESCRIPTION: `${BASE_URL}/api/overalldescriptions`,

  //CHECKPOINTMASTER...
  TIMER: `${BASE_URL}/api/timers`,
  TIMER_CREATE: `${BASE_URL}/api/timer/new`,
  TIMER_SINGLE: `${BASE_URL}/api/timer`,
  TASKUSERTIME: `${BASE_URL}/api/taskusertime`,

  //NOTIFICATION...
  NOTIFICATION: `${BASE_URL}/api/notifications`,
  NOTIFICATION_CREATE: `${BASE_URL}/api/notification/new`,
  NOTIFICATION_SINGLE: `${BASE_URL}/api/notification`,

  //LOGIN OUT STATUS
  LOGINOUT: `${BASE_URL}/api/attandances`,
  INDUSERSLOGINOUT: `${BASE_URL}/api/userindividualattandances`,
  LOGINOUT_CREATE: `${BASE_URL}/api/attandance/new`,
  LOGINOUT_SINGLE: `${BASE_URL}/api/attandance`,
  ATTENDANCE_FILTER: `${BASE_URL}/api/attendancefilter`,
  ATTENDANCE_COLUMN_FILTER: `${BASE_URL}/api/attendancecolumnfilter`,
  ATTANDANCE_STATUS_DATE: `${BASE_URL}/api/attandancesstatusdates`,
  LOGINOUT_USERID: `${BASE_URL}/api/attandanceid`,
  ATTANDANCE_SINGLE: `${BASE_URL}/api/attandance`,
  USERFILTER: `${BASE_URL}/api/attendfilter`,
  ATTANDANCE_STATUS_USERDATE: `${BASE_URL}/api/attandancesstatususerdates`,
  ATTANDANCE_STATUS: `${BASE_URL}/api/attandancesstatus`,
  LOGINOUT_STATUSFALSE: `${BASE_URL}/api/attandancefalse`,
  LOGINOUT_STATUSTRUE: `${BASE_URL}/api/attandancetrue`,
  ATTENDANCE_HIERARCHYFILTER: `${BASE_URL}/api/attendancehierarchyfilter`,
  ATTENDANCE_HIERARCHYFILTERANOTHER: `${BASE_URL}/api/attendancehierarchyfilteranother`,
  ATTENDANCE_CLOCKIN_CREATE: `${BASE_URL}/api/attandanceclockintimecreate`,
  ATTENDANCE_CLOCKIN_SINGLE: `${BASE_URL}/api/attandanceclockinouttimeedit`,
  OVERALLSORT_ASSET: `${BASE_URL}/api/overallassettablesort`,
  OVERALLSORT_STOCK: `${BASE_URL}/api/stockpurchasesort`,
  //REMARKS
  REMARK_CREATE: `${BASE_URL}/api/remark/new`,
  REMARK: `${BASE_URL}/api/remarks`,

  //JOBOPENINGS
  ALLJOBOPENINGS: `${BASE_URL}/api/alljobopenings`,
  ASSIGNCHECKLISTALLJOBOPENINGS: `${BASE_URL}/api/assignchecklistalljobopenings`,
  CLOSEDALLJOBOPENINGS: `${BASE_URL}/api/withoutclosedjobopenings`,
  ONPROGRESSALLJOBOPENINGS: `${BASE_URL}/api/onprogressjobopenings`,
  JOBOPENING_CREATE: `${BASE_URL}/api/jobopening/new`,
  JOBOPENING_SINGLE: `${BASE_URL}/api/jobopening`,
  JOBOPENINGSDESIGNATION: `${BASE_URL}/api/jobopeningdesignation`,
  BRANCHADDRESS: `${BASE_URL}/api/branchaddress`,
  GETHRMANAGERS: `${BASE_URL}/api/gethrmanagers`,
  JOBOPNEING_FILTER: `${BASE_URL}/api/jobfilters`,
  CANDIDATES_ROLEUPDATE: `${BASE_URL}/api/updatecandidaterole`,

  // vacancy position
  APPROVEDS: `${BASE_URL}/api/approveds`,
  APPROVEDS_CREATE: `${BASE_URL}/api/approved/new`,
  APPROVEDS_SINGLE: `${BASE_URL}/api/approved`,

  // reason of leving
  REASON: `${BASE_URL}/api/addexists`,
  REASON_CREATE: `${BASE_URL}/api/addexist/new`,
  REASON_SINGLE: `${BASE_URL}/api/addexist`,

  // Organisation
  ORGANISATION: `${BASE_URL}/api/addexistworks`,
  ORGANISATION_CREATE: `${BASE_URL}/api/addexistwork/new`,
  ORGANISATION_SINGLE: `${BASE_URL}/api/addexistwork`,

  // reason of leving
  ADDEXISTSALL: `${BASE_URL}/api/addexistalls`,
  ADDEXISTSALL_CREATE: `${BASE_URL}/api/addexistall/new`,
  ADDEXISTSALL_SINGLE: `${BASE_URL}/api/addexitsall`,

  // Notice period reason of leving
  NOTICEREASON: `${BASE_URL}/api/noticereasons`,
  NOTICEREASON_CREATE: `${BASE_URL}/api/noticereason/new`,
  NOTICEREASON_SINGLE: `${BASE_URL}/api/noticereason`,

  // Notice period apply
  NOTICEPERIODAPPLY: `${BASE_URL}/api/noticeperiodapplies`,
  NOTICEPERIODAPPLY_CREATE: `${BASE_URL}/api/noticeperiodapply/new`,
  NOTICEPERIODAPPLY_SINGLE: `${BASE_URL}/api/noticeperiodapply`,
  CHECKLISTNOTICEPERIODAPPLY: `${BASE_URL}/api/checklistnoticeperiodapplies`,

  // Notice period apply
  REFERCANDIDATE: `${BASE_URL}/api/refercandidates`,
  USERREFERCANDIDATE: `${BASE_URL}/api/refercandidates`,
  REFERCANDIDATE_CREATE: `${BASE_URL}/api/refercandidate/new`,
  REFERCANDIDATE_SINGLE: `${BASE_URL}/api/userrefercandidate`,

  //Hirerarchi
  LOCATIONWISE_ALL: `${BASE_URL}/api/locationwiseall`,
  BRANCHWISE_UNIT: `${BASE_URL}/api/branchwiseunit`,
  UNITWISE_TEAM: `${BASE_URL}/api/unitwiseteam`,
  USERWISE_FILTER_ALL: `${BASE_URL}/api/userwisefilter`,
  HIRERARCHI: `${BASE_URL}/api/hirerarchies`,
  HIRERARCHI_CREATE: `${BASE_URL}/api/hirerarchi/new`,
  HIRERARCHI_SINGLE: `${BASE_URL}/api/hirerarchi`,
  CONTROLNAME: `${BASE_URL}/api/designationcontname`,
  CHECKHIERARCHYADDNEWEMP: `${BASE_URL}/api/checkhierarchyaddnewemp`,
  HIRERARCHI_EDIT_MATCHCHECK: `${BASE_URL}/api/hierarchyeditmatchcheck`,
  USERWISE_FILTER_ALL_EDIT: `${BASE_URL}/api/userwisefilteredit`,
  CHECKHIERARCHYEDITEMPDETAILS: `${BASE_URL}/api/checkhierarchyeditempdetails`,
  CHECKHIERARCHYEDITEMPDETAILSDESIGN: `${BASE_URL}/api/checkhierarchyeditempdetailsdesig`,
  NOTASSIGNHIERARCHYLISTDATA: `${BASE_URL}/api/notassignhierarchylistdata`,

  //candidate   
  CANDIDATES: `${BASE_URL}/api/candidates`,
  ACTIVECANDIDATES: `${BASE_URL}/api/activecandidates`,
  TODAYCANDIDATES: `${BASE_URL}/api/todaycandidates`,
  CANDIDATES_CREATE: `${BASE_URL}/api/candidate/new`,
  CANDIDATES_SINGLE: `${BASE_URL}/api/candidate`,

  //Resume Management
  FILTERALLUSER_RESUME: `${BASE_URL}/api/ageandlocationfilter`,
  CANDIDATESALL: `${BASE_URL}/api/allcandidates`,
  VISITORCANDIDATESALL: `${BASE_URL}/api/allvisitorcandidates`,
  INTERVIEWCANDIDATES: `${BASE_URL}/api/allinterviewcandidates`,
  ROLECANDIDATES_ALL: `${BASE_URL}/api/allcandidatesrole`,

  //Use Forms apply
  CUSTOMFORMS: `${BASE_URL}/api/customforms`,
  CUSTOMFORM_CREATE: `${BASE_URL}/api/customform/new`,
  CUSTOMFORM_SINGLE: `${BASE_URL}/api/customform`,

  //Use Form User List
  CUSTOMFORMS_LIST: `${BASE_URL}/api/customformslist`,
  CUSTOMFORM_LIST_CREATE: `${BASE_URL}/api/customformlist/new`,
  CUSTOMFORM_LIST_SINGLE: `${BASE_URL}/api/customformlist`,

  // roles and responsibilities
  ROLEANDRESPONSE: `${BASE_URL}/api/allroleandresponsibilities`,
  ROLEANDRESPONSE_CREATE: `${BASE_URL}/api/roleandresponsibile/new`,
  ROLEANDRESPONSE_SINGLE: `${BASE_URL}/api/roleandresponsibile`,

  BULKOVERALL_ALOTTEDQUEUE_LIST: `${BASE_URL}/api/bulkoveralleditallottedqueuelist`,
  BULKOVERALLDELETE_ALOTTEDQUEUE_LIST: `${BASE_URL}/api/bulkoveralldelete`,

  // Documents
  ALL_DOCUMENT: `${BASE_URL}/api/documents`,
  ALLASSIGNDOCUMENT: `${BASE_URL}/api/alldocumentassigned`,
  DOCUMENT_CREATE: `${BASE_URL}/api/documents/new`,
  DOCUMENT_SINGLE: `${BASE_URL}/api/document`,

  // List of Document
  LISTOFDOCUMENT: `${BASE_URL}/api/listofdocuments`,
  LISTOFDOCUMENT_CREATE: `${BASE_URL}/api/listofdocument/new`,
  LISTOFDOCUMENT_SINGLE: `${BASE_URL}/api/listofdocument`,

  // Document Grouping
  DOCUMENTGROUPING: `${BASE_URL}/api/documentgroupings`,
  DOCUMENTGROUPING_CREATE: `${BASE_URL}/api/documentgrouping/new`,
  DOCUMENTGROUPING_SINGLE: `${BASE_URL}/api/documentgrouping`,

  //category Document
  CATEGORYDOCUMENT: `${BASE_URL}/api/documentcategories`,
  CATEGORYDOCUMENT_CREATE: `${BASE_URL}/api/documentcategory/new`,
  CATEGORYDOCUMENT_SINGLE: `${BASE_URL}/api/documentcategory`,
  CATEGORYDOCUMENT_OVERALLEDIT: `${BASE_URL}/api/overalldocumentedit`,
  CATEGORYDOCUMENT_OVERALLDELETE: `${BASE_URL}/api/documentscategorydelete`,

  // group
  GROUP: `${BASE_URL}/api/groups`,
  GROUP_CREATE: `${BASE_URL}/api/group/new`,
  GROUP_SINGLE: `${BASE_URL}/api/group`,

  // Account group
  ACCOUNTGROUP: `${BASE_URL}/api/accountgroups`,
  ACCOUNTGROUP_CREATE: `${BASE_URL}/api/accountgroup/new`,
  ACCOUNTGROUP_SINGLE: `${BASE_URL}/api/accountgroup`,

  //Account Head
  ACCOUNTHEAD: `${BASE_URL}/api/accounts`,
  ACCOUNTHEAD_CREATE: `${BASE_URL}/api/account/new`,
  ACCOUNTHEAD_SINGLE: `${BASE_URL}/api/account`,

  //Asset Material
  ASSETS: `${BASE_URL}/api/assets`,
  ASSET_CREATE: `${BASE_URL}/api/asset/new`,
  ASSET_SINGLE: `${BASE_URL}/api/asset`,

  OVERALL_ASSET_LIMITED: `${BASE_URL}/api/overallassetlimited`,
  // AssetvCategroy Grouping 
  ASSETCATEGORYGROUPING: `${BASE_URL}/api/assetcategorygroupings`,
  ASSETCATEGORYGROUPING_CREATE: `${BASE_URL}/api/assetcategorygrouping/new`,
  ASSETCATEGORYGROUPING_SINGLE: `${BASE_URL}/api/assetcategorygrouping`,

  STOCKPURCHASELIMITED: `${BASE_URL}/api/stockpurchaselimited`,
  STOCKPURCHASELIMITED_ASSET_DETAILS: `${BASE_URL}/api/stockpurchaselimitedassetdetails`,


  ASSETDETAIL_STOCK_LIMITED: `${BASE_URL}/api/assetdetailsstocklimited`,

  //Control Service Name
  CREATE_CONTROLNAME: `${BASE_URL}/api/controlname/new`,
  ALL_CONTROLNAME: `${BASE_URL}/api/controlnames`,
  CONTROLNAME_SINGLE: `${BASE_URL}/api/controlname`,

  ROLENAME: `${BASE_URL}/api/rolesname`,
  // Asset details
  ASSETDETAIL: `${BASE_URL}/api/assetdetails`,
  TICKETASSETDETAIL: `${BASE_URL}/api/ticketassetdetails`,
  FILTERASSETDETAIL: `${BASE_URL}/api/boardingassetdetails`,
  BRANCHFLOORASSETDETAIL: `${BASE_URL}/api/branchfloorassetdetails`,
  ASSETDETAILFILTER: `${BASE_URL}/api/assetdetailsfilter`,
  ASSETDETAILCOUNTFILTER: `${BASE_URL}/api/assetdetailscountfilter`,
  ASSETDETAIL_CREATE: `${BASE_URL}/api/assetdetail/new`,
  ASSETDETAIL_SINGLE: `${BASE_URL}/api/assetdetail`,
  ASSETDETAIL_LIMITED: `${BASE_URL}/api/assetdetailslimited`,

  // assets uom master base service

  CREATE_VOMMASTERNAME: `${BASE_URL}/api/vommastername/new`,
  ALL_VOMMASTERNAME: `${BASE_URL}/api/vommasternames`,
  SINGLE_VOMMASTERNAME: `${BASE_URL}/api/vommastername`,

  // Employee Asset Distribution register details
  EMPLOYEEASSET: `${BASE_URL}/api/employeeassets`,
  EMPLOYEEASSET_CREATE: `${BASE_URL}/api/employeeasset/new`,
  EMPLOYEEASSET_SINGLE: `${BASE_URL}/api/employeeasset`,

  //vendor details
  ADD_VENDORDETAILS: `${BASE_URL}/api/vendordetails/new`,
  ALL_VENDORDETAILS: `${BASE_URL}/api/allvendordetails`,
  SINGLE_VENDORDETAILS: `${BASE_URL}/api/singlevendordetails`,

  //assest frequency master
  CREATE_FREQUENCYMASTER: `${BASE_URL}/api/frequencymaster/new`,
  ALL_FREQUENCYMASTER: `${BASE_URL}/api/frequencymasters`,
  SINGLE_FREQUENCYMASTER: `${BASE_URL}/api/frequencymaster`,

  //tickets

  // other  payments base servises
  NEW_OTHERPAYMENTS: `${BASE_URL}/api/otherpayment/new`,
  ALL_OTHERPAYMENTS: `${BASE_URL}/api/allotherpayments`,
  SINGLE_OTHERPAYMENTS: `${BASE_URL}/api/otherpayment`,

  //Maintentance Master
  MAINTENTANCE: `${BASE_URL}/api/maintentances`,
  MAINTENTANCE_CREATE: `${BASE_URL}/api/maintentance/new`,
  MAINTENTANCE_SINGLE: `${BASE_URL}/api/maintentance`,

  // add category tickets details
  CATEGORYTICKET: `${BASE_URL}/api/ticketcategories`,
  CATEGORYTICKET_CREATE: `${BASE_URL}/api/ticketcategory/new`,
  CATEGORYTICKET_SINGLE: ` ${BASE_URL}/api/ticketcategory`,

  // Type master
  TYPEMASTER: `${BASE_URL}/api/typemasters`,
  TYPEMASTER_CREATE: ` ${BASE_URL}/api/typemaster/new`,
  TYPEMASTER_SINGLE: `${BASE_URL}/api/typemaster`,

  // add type tickets master details
  TYPETICKETMASTER: `${BASE_URL}/api/ticketmastertypes`,
  TYPETICKETMASTER_CREATE: `${BASE_URL}/api/ticketmastertype/new`,
  TYPETICKETMASTER_SINGLE: ` ${BASE_URL}/api/ticketmastertype`,

  // Reason master
  REASONMASTER: `${BASE_URL}/api/reasonmasters`,
  REASONMASTER_CREATE: ` ${BASE_URL}/api/reasonmaster/new`,
  REASONMASTER_SINGLE: `${BASE_URL}/api/reasonmaster`,

  // Resolver Reason master
  RESOLVERREASONMASTER: `${BASE_URL}/api/resolverreasonmaster`,
  RESOLVERREASONMASTER_CREATE: `${BASE_URL}/api/resolverreasonmaster/new`,
  RESOLVERREASONMASTER_SINGLE: `${BASE_URL}/api/resolverreasonmaster`,
  RESOLVERREASONMASTERCETEGORYFILTER: `${BASE_URL}/api/resolverreasonmasterfilter`,

  // Meeting master
  MEETINGMASTER: `${BASE_URL}/api/meetingmasters`,
  MEETINGMASTER_CREATE: `${BASE_URL}/api/meetingmaster/new`,
  MEETINGMASTER_SINGLE: `${BASE_URL}/api/meetingmaster`,

  //Holiday Base Services
  CREATE_HOLIDAY: `${BASE_URL}/api/holiday/new`,
  ALL_HOLIDAY: `${BASE_URL}/api/holidays`,
  SINGLE_HOLIDAY: `${BASE_URL}/api/holiday`,
  HOLIDAYFILTER: `${BASE_URL}/api/holidayfilter`,
  TODAY_HOLIDAY: `${BASE_URL}/api/todayholidayfilter`,

  GETTODAYSHIFT: `${BASE_URL}/api/todayshifts`,

  //ticket status master
  CREATE_STATUSMASTER: `${BASE_URL}/api/statusmaster/new`,
  ALL_STATUSMASTER: `${BASE_URL}/api/statusmasters`,
  SINGLE_STATUSMASTER: `${BASE_URL}/api/statusmaster`,

  // Subsub Component
  SUBSUBCOMPONENT: `${BASE_URL}/api/subsubcategorytickets`,
  SUBSUBCOMPONENT_CREATE: `${BASE_URL}/api/subsubcategoryticket/new`,
  SUBSUBCOMPONENT_SINGLE: `${BASE_URL}/api/subsubcategoryticket`,


  // Subsub Component
  // SUBSUBCATEGORYTICKET: `${BASE_URL}/api/subsubcategorytickets`,
  // SUBSUBCATEGORYTICKET_CREATE: `${BASE_URL}/api/subsubcategoryticket/new`,
  // SUBSUBCATEGORYTICKET_SINGLE: `${BASE_URL}/api/subsubcategoryticket`,
  //Schedule Meeting Base Service

  DEPT_TEAM: `${BASE_URL}/api/getdeptandteam`,

  // Meeting master
  APPLYLEAVE: `${BASE_URL}/api/applyleaves`,
  ACTIVEAPPLYLEAVE: `${BASE_URL}/api/activeuserapplyleaves`,
  APPLYLEAVE_CREATE: `${BASE_URL}/api/applyleave/new`,
  APPLYLEAVE_SINGLE: `${BASE_URL}/api/applyleave`,

  // Checkpointticket master
  CHECKPOINTTICKET: `${BASE_URL}/api/checkpointtickets`,
  CHECKPOINTTICKET_CREATE: `${BASE_URL}/api/checkpointticket/new`,
  CHECKPOINTTICKET_SINGLE: `${BASE_URL}/api/checkpointticket`,

  //  Stock details
  STOCKPURCHASE: `${BASE_URL}/api/stocks`,
  STOCKPURCHASE_CREATE: `${BASE_URL}/api/stock/new`,
  STOCKPURCHASE_SINGLE: `${BASE_URL}/api/stock`,
  STOCKTRANSFERFILTER: `${BASE_URL}/api/stockmantransferfilter`,

  // Stock details
  STOCKMANAGE: `${BASE_URL}/api/stockmanages`,
  STOCKMANAGE_CREATE: `${BASE_URL}/api/stockmanage/new`,
  STOCKMANAGE_SINGLE: `${BASE_URL}/api/stockmanage`,
  STOCKMANAGEFILTERED: `${BASE_URL}/api/stockfilter`,

  SECONDARY_CONSOLIDATED_HIERARCHY_FILTER: `${BASE_URL}/api/secondaryhierarchyfilter`,
  TERTIARY_CONSOLIDATED_HIERARCHY_FILTER: `${BASE_URL}/api/tertiaryhierarchyfilter`,
  PRIMARY_HIERARCHY_WORKORDEROVERTATDATA: `${BASE_URL}/api/primaryhierarchyworkorderovertatdata`,
  PRIMARY_HIERARCHY_WORKORDERNEARTATDATA: `${BASE_URL}/api/primaryhierarchyworkorderneartatdata`,
  PRIMARY_HIERARCHY_WORKORDERALL: `${BASE_URL}/api/primaryhierarchyworkorderall`,
  OTHER_WORKORDER_HIERARCHY_FILTER: `${BASE_URL}/api/orderhierarchyworkorder`,
  CONSOLIDATED_HIERARCHY_FILTER_PRISECTER: `${BASE_URL}/api/consolidatedheirarchyprimsectert`,
  CONSOLIDATED_HIERARCHY_FILTER_ALL: `${BASE_URL}/api/consolidatedheirarchyall`,

  // Teamgrouping master
  TEAMGROUPING: `${BASE_URL}/api/teamgroupings`,
  TEAMGROUPING_CREATE: `${BASE_URL}/api/teamgrouping/new`,
  TEAMGROUPING_SINGLE: `${BASE_URL}/api/teamgrouping`,

  //Raise Ticket
  RAISETICKET: `${BASE_URL}/api/raisetickets`,
  RAISETICKETOPEN: `${BASE_URL}/api/raiseticketsopen`,
  RAISETICKETCLOSED: `${BASE_URL}/api/raiseticketsclosed`,
  RAISETICKETEDITDUPLICATE: `${BASE_URL}/api/raiseticketseditduplicate`,
  RAISETICKET_CREATE: `${BASE_URL}/api/raiseticket/new`,
  RAISETICKET_SINGLE: `${BASE_URL}/api/raiseticket`,
  RAISETICKET_INDIVIDUALFILTER: `${BASE_URL}/api/raiseticketindividualfilter`,

  RAISE_HIERARCHY_FORWARD: `${BASE_URL}/api/raisehierarchyforward`,

  RAISETICKET_WITHOUT_CLOSED: `${BASE_URL}/api/raiseticketswithoutclosed`,


  SECONDARY_DEFAULT_HIERARCHY_FILTER: `${BASE_URL}/api/secondaryhierarchydefault`,
  TERTIARY_DEFAULT_HIERARCHY_FILTER: `${BASE_URL}/api/tertiaryhierarchydefault`,
  OTHER_WORKORDER_DEFAULT_HIERARCHY_FILTER: `${BASE_URL}/api/orderhierarchyworkorderdefault`,
  CONSOLIDATED_HIERARCHY_DEFAULT_PRISECTER: `${BASE_URL}/api/consolidatedheirarchyprimsectertdefault`,
  CONSOLIDATED_DEFAULT_HIERARCHY_FILTER: `${BASE_URL}/api/consolidatedheirarchyalldefault`,
  PRIMARY_DEFAULT_HIERARCHY_WORKORDEROVERTATDATA: `${BASE_URL}/api/primaryhierarchyworkorderovertatdatadefault`,
  PRIMARY_DEFAULT_HIERARCHY_WORKORDERNEARTATDATA: `${BASE_URL}/api/primaryhierarchyworkorderneartatdatadefault`,
  PRIMARY_DEFAULT_HIERARCHY_WORKORDERALL: `${BASE_URL}/api/primaryhierarchyworkorderalldefault`,
  HIERARCHI_TEAM_DESIGNATION_CHECK: `${BASE_URL}/api/hierarchyteamdesignationcheck`,

  //expense
  EXPENSES_CREATE: `${BASE_URL}/api/expenses/new`,
  EXPENSES_SINGLE: `${BASE_URL}/api/expenses`,
  EXPENSESALL: `${BASE_URL}/api/allexpenses`,
  LOCATIONWISEBRANCH: `${BASE_URL}/api/locationwisebranch`,
  EXPENSESUBCAT: `${BASE_URL}/api/expensesubcat`,
  //  Expense Reminder
  EXPENSEREMINDER: `${BASE_URL}/api/expensereminders`,
  EXPENSEREMINDER_CREATE: `${BASE_URL}/api/expensereminder/new`,
  EXPENSEREMINDER_SINGLE: `${BASE_URL}/api/expensereminder`,

  ALLREMINDER: `${BASE_URL}/api/allreminder`,
  PAYMENTDUEREMINDER: `${BASE_URL}/api/paymentduereminder`,

  //  Expense category
  EXPENSECATEGORY: `${BASE_URL}/api/expensecategories`,
  EXPENSECATEGORY_CREATE: `${BASE_URL}/api/expensecategory/new`,
  EXPENSECATEGORY_SINGLE: `${BASE_URL}/api/expensecategory`,

  // events
  CREATE_EVENT: `${BASE_URL}/api/scheduleevent/new`,
  ALL_EVENT: `${BASE_URL}/api/allscheduleevents`,
  SINGLE_EVENT: `${BASE_URL}/api/scheduleevent`,
  BRANCH_UNIT: `${BASE_URL}/api/getunitbybranch`,
  BRANCH_TEAM: `${BASE_URL}/api/getteambybranchandunit`,
  TEAM_PARTICIPANTS: `${BASE_URL}/api/getparticipants`,
  ALL_EVENTFILTER: `${BASE_URL}/api/eventallfilter`,

  // BAse service:
  // add category interviews details
  CATEGORYINTERVIEW: `${BASE_URL}/api/interviewcategories`,
  CATEGORYINTERVIEW_CREATE: `${BASE_URL}/api/interviewcategory/new`,
  CATEGORYINTERVIEW_SINGLE: ` ${BASE_URL}/api/interviewcategory`,

  // Round master
  ROUNDMASTER: ` ${BASE_URL}/api/roundmasters`,
  ROUNDMASTER_CREATE: ` ${BASE_URL}/api/roundmaster/new`,
  ROUNDMASTER_SINGLE: `${BASE_URL}/api/roundmaster`,

  // Type master
  INTERVIEWTYPEMASTER: `${BASE_URL}/api/interviewtypemasters`,
  INTERVIEWTYPEMASTER_CREATE: `${BASE_URL}/api/interviewtypemaster/new`,
  INTERVIEWTYPEMASTER_SINGLE: `${BASE_URL}/api/interviewtypemaster`,

  //Schedule Meeting Base Service
  CREATE_MEETING: `${BASE_URL}/api/schedulemeeting/new`,
  ALL_MEETING: `${BASE_URL}/api/allschedulemeetings`,
  SINGLE_MEETING: `${BASE_URL}/api/schedulemeeting`,
  BRANCH_DEPT: `${BASE_URL}/api/getdeptbybranch`,
  BRANCH_DEPT_TEAM: `${BASE_URL}/api/getteambybranchanddept`,
  MEETING_PARTICIPANTS: `${BASE_URL}/api/getparticipantsformeeting`,
  SCHEDULEMEETINGFILTER: `${BASE_URL}/api/schedulemeetingfilter`,
  SCHEDULEMEETINGFILTERFPAGE: `${BASE_URL}/api/schedulemeetingfilterpage`,
  SINGLE_NOTICEMEETING: `${BASE_URL}/api/singlenoticeperiodmeeting`,
  // /Areagrouping details
  AREAGROUPING: `${BASE_URL}/api/areagroupings`,
  AREAGROUPING_CREATE: `${BASE_URL}/api/areagrouping/new`,
  AREAGROUPING_SINGLE: `${BASE_URL}/api/areagrouping`,
  //Locationgrouping details
  LOCATIONGROUPING: `${BASE_URL}/api/locationgroupings`,
  LOCATIONGROUPING_CREATE: `${BASE_URL}/api/locationgrouping/new`,
  LOCATIONGROUPING_SINGLE: `${BASE_URL}/api/locationgrouping`,

  //reference category document
  REFCATEGORYDOCUMENT: `${BASE_URL}/api/referencecategories`,
  REFCATEGORYDOCUMENT_CREATE: `${BASE_URL}/api/referencecategory/new`,
  REFCATEGORYDOCUMENT_SINGLE: `${BASE_URL}/api/referencecategory`,
  REFCATEGORYDOCUMENT_OVERALLEDIRT: `${BASE_URL}/api/referencecategoryedit`,
  // add ref category Document
  ALL_REFDOCUMENT: `${BASE_URL}/api/allrefdocuments`,
  REFDOCUMENT_CREATE: `${BASE_URL}/api/refdocuments/new`,
  REFDOCUMENT_SINGLE: `${BASE_URL}/api/refdocument`,
  GET_SUBCAT: `${BASE_URL}/api/getsubcategoryref`,
  REFDOCUMENT_OVERALLDELETE: `${BASE_URL}/api/refdocumentdelete`,

  // Duedate master
  DUEDATE: `${BASE_URL}/api/duedatemasters`,
  DUEDATE_CREATE: `${BASE_URL}/api/duedatemaster/new`,
  DUEDATE_SINGLE: `${BASE_URL}/api/duedatemaster`,

  // Priority master
  PRIORITYMASTER: `${BASE_URL}/api/prioritymastermasters`,
  PRIORITYMASTER_CREATE: `${BASE_URL}/api/prioritymastermaster/new`,
  PRIORITYMASTER_SINGLE: `${BASE_URL}/api/prioritymastermaster`,
  // interview questions master
  INTERVIEWQUESTION: `${BASE_URL}/api/interviewquestions`,
  INTERVIEWQUESTION_CREATE: `${BASE_URL}/api/interviewquestion/new`,
  INTERVIEWQUESTION_SINGLE: `${BASE_URL}/api/interviewquestion`,

  // interview questions grouping master
  INTERVIEWQUESTIONGROUPING: `${BASE_URL}/api/interviewquestiongroupings`,
  INTERVIEWQUESTIONGROUPING_CREATE: `${BASE_URL}/api/interviewquestiongrouping/new`,
  INTERVIEWQUESTIONGROUPING_SINGLE: `${BASE_URL}/api/interviewquestiongrouping`,

  // Manage material details
  GET_INT_FORM_DESIGN: `${BASE_URL}/api/interviewformdesigns`,
  CREATE_INT_FORM_DESIGN: `${BASE_URL}/api/interviewformdesign/new`,
  SINGLE_INT_FORM_DESIGN: `${BASE_URL}/api/interviewformdesign`,

  // interview questions order 
  INTERVIEWQUESTIONSORDER: `${BASE_URL}/api/interviewquestionsorders`,
  INTERVIEWQUESTIONSORDER_CREATE: `${BASE_URL}/api/interviewquestionsorder/new`,
  INTERVIEWQUESTIONSORDER_SINGLE: `${BASE_URL}/api/interviewquestionsorder`,

  // Interview User Responses details
  GET_USER_RESPONSES: `${BASE_URL}/api/interviewuserresponses`,
  CREATE_USER_RESPONSE: `${BASE_URL}/api/interviewuserresponse/new`,
  SINGLE_USER_RESPONSE: `${BASE_URL}/api/interviewuserresponse`,

  //password category
  PASSCATEGORYDOCUMENT: `${BASE_URL}/api/passwordcategories`,
  PASSCATEGORYDOCUMENT_CREATE: `${BASE_URL}/api/passwordcategory/new`,
  PASSCATEGORYDOCUMENT_SINGLE: `${BASE_URL}/api/passwordcategory`,
  CREATE_PASSWORD: `${BASE_URL}/api/password/new`,
  ALL_PASSWORD: `${BASE_URL}/api/allpasswords`,
  ACTIVEALL_PASSWORD: `${BASE_URL}/api/activeallpasswords`,
  SINGLE_PASSWORD: `${BASE_URL}/api/password`,
  EMP_NAME: `${BASE_URL}/api/getemployeename`,
  EMP_DETAILS: `${BASE_URL}/api/getemployeedetails`,
  SUB_CAT: `${BASE_URL}/api/getsubcategory`,

  DEPMONTHSET_ALL: `${BASE_URL}/api/departmentmonthsets`,
  DEPMONTHSET_CREATE: `${BASE_URL}/api/departmentmonthset/new`,
  DEPMONTHSET_SINGLE: `${BASE_URL}/api/departmentmonthset`,
  USEREMP_TEAMGROUP: `${BASE_URL}/api/usersteamgrouping`,
  DEPTMONTHSET_LIMITED: `${BASE_URL}/api/departmentmonthsetslimited`,

  // Leave Crirteria details
  LEAVECRITERIA: `${BASE_URL}/api/leavecriterias`,
  LEAVECRITERIA_CREATE: `${BASE_URL}/api/leavecriteria/new`,
  LEAVECRITERIA_SINGLE: `${BASE_URL}/api/leavecriteria`,

  //assest type grouping
  CREATE_ASSETTYPEGROUPING: `${BASE_URL}/api/assettypegrouping/new`,
  ALL_ASSETTYPEGROUPING: `${BASE_URL}/api/assettypegroupings`,
  SINGLE_ASSETTYPEGROUPING: `${BASE_URL}/api/assettypegrouping`,

  //asset type master baseservice
  CREATE_ASSETTYPEMASTER: ` ${BASE_URL}/api/assettypemaster/new`,
  ALL_ASSETTYPEMASTER: `${BASE_URL}/api/assettypemasters`,
  SINGLE_ASSETTYPEMASTER: `${BASE_URL}/api/assettypemaster`,

  //workstation details
  WORKSTATION: `${BASE_URL}/api/workstations`,
  WORKSTATION_CREATE: `${BASE_URL}/api/workstation/new`,
  WORKSTATION_SINGLE: `${BASE_URL}/api/workstation`,

  //RAISE ISSUE
  RAISEISSUE: `${BASE_URL}/api/raiseissues`,
  RAISEISSUE_CREATE: `${BASE_URL}/api/raiseissue/new`,
  RAISEISSUE_SINGLE: `${BASE_URL}/api/raiseissue`,

  //Asset workstation
  ASSETWORKSTAION: `${BASE_URL}/api/assetworkstations`,
  ASSETWORKSTAION_CREATE: `${BASE_URL}/api/assetworkstation/new`,
  ASSETWORKSTAION_SINGLE: `${BASE_URL}/api/assetworkstation`,

  //brand master baseservice
  CREATE_BRANDMASTER: `${BASE_URL}/api/brandmaster/new`,
  ALL_BRANDMASTER: `${BASE_URL}/api/brandmasters`,
  SINGLE_BRANDMASTER: `${BASE_URL}/api/brandmaster`,

  //Control Crirteria details
  CONTROLCRITERIA: `${BASE_URL}/api/controlcriterias`,
  CONTROLCRITERIA_CREATE: `${BASE_URL}/api/controlcriteria/new`,
  CONTROLCRITERIA_SINGLE: `${BASE_URL}/api/controlcriteria`,

  //asset model baseservice
  CREATE_ASSETMODEL: `${BASE_URL}/api/assetmodel/new`,
  ALL_ASSETMODEL: `${BASE_URL}/api/assetmodels`,
  SINGLE_ASSETMODEL: `${BASE_URL}/api/assetmodel`,

  //asset variant baseservice
  CREATE_ASSETVARIANT: `${BASE_URL}/api/assetvariant/new`,
  ALL_ASSETVARIANT: `${BASE_URL}/api/assetvariants`,
  SINGLE_ASSETVARIANT: `${BASE_URL}/api/assetvariant`,

  //asset size baseservice
  CREATE_ASSETSIZE: `${BASE_URL}/api/assetsize/new`,
  ALL_ASSETSIZE: `${BASE_URL}/api/assetsizes`,
  SINGLE_ASSETSIZE: `${BASE_URL}/api/assetsize`,

  //asset specification tye baseservice
  CREATE_ASSETSPECIFICATIONTYPE: `${BASE_URL}/api/assetspecificationtype/new`,
  ALL_ASSETSPECIFICATIONTYPE: `${BASE_URL}/api/assetspecificationtypes`,
  SINGLE_ASSETSPECIFICATIONTYPE: `${BASE_URL}/api/assetspecificationtype`,

  //Client userid baseservice
  CREATE_CLIENTUSERID: `${BASE_URL}/api/clientuserid/new`,
  ALL_CLIENTUSERID: `${BASE_URL}/api/clientuserids`,
  ALL_CLIENTUSERIDDATA: `${BASE_URL}/api/clientuseridsdata`,
  SINGLE_CLIENTUSERID: `${BASE_URL}/api/clientuserid`,
  CLIENTUSERID_SORT: `${BASE_URL}/api/clientuseridsort`,

  //Process  queue name baseservice
  CREATE_PROCESSQUEUENAME: `${BASE_URL}/api/processqueuename/new`,
  ALL_PROCESSQUEUENAME: `${BASE_URL}/api/processqueuenames`,
  SINGLE_PROCESSQUEUENAME: `${BASE_URL}/api/processqueuename`,
  PROCESSQUEUENAME_SORT: `${BASE_URL}/api/processqueuenamesort`,
  ALL_PROCESS_AND_TEAM_FILTER: `${BASE_URL}/api/processteam_filter`,
  // group
  TARGETPOINTS: `${BASE_URL}/api/targetpoints`,
  TARGETPOINT_CREATE: `${BASE_URL}/api/targetpoint/new`,
  TARGETPOINT_SINGLE: `${BASE_URL}/api/targetpoint`,
  TARGETPOINTS_LIMITED: `${BASE_URL}/api/targetpointslimited`,

  //Production Temp Consolidated baseservice
  ADD_PRODUCTION_TEMP_CONSOLIDATED: `${BASE_URL}/api/productiontempconsolidated/new`,
  GET_PRODUCTION_TEMP_CONSOLIDATED: `${BASE_URL}/api/productiontempconsolidateds`,
  SINGLE_PRODUCTION_TEMP_CONSOLIDATED: `${BASE_URL}/api/productiontempconsolidated`,
  FILTER_PRODUCTION_TEMP_CONSOLIDATED: `${BASE_URL}/api/filterproductiontempconsolidated`,

  //Managecategory 
  MANAGECATEGORY: `${BASE_URL}/api/managecategorys`,
  MANAGECATEGORY_CREATE: `${BASE_URL}/api/managecategory/new`,
  MANAGECATEGORY_SORT: `${BASE_URL}/api/managecategoryssort`,
  MANAGECATEGORY_SINGLE: `${BASE_URL}/api/managecategory`,

  // Paid Status Fix
  PAIDSTATUSFIX: `${BASE_URL}/api/paidstatusfixs`,
  PAIDSTATUSFIX_CREATE: `${BASE_URL}/api/paidstatusfix/new`,
  PAIDSTATUSFIX_SINGLE: `${BASE_URL}/api/paidstatusfix`,
  XEROXMONTHYEARPAIDSTATUS: `${BASE_URL}/api/xeroxpaidstatusfixfilter`,

  // Paid Date Fix
  PAIDDATEFIX: `${BASE_URL}/api/paiddatefixs`,
  PAIDDATEFIX_CREATE: `${BASE_URL}/api/paiddatefix/new`,
  PAIDDATEFIX_SINGLE: `${BASE_URL}/api/paiddatefix`,

  //paid date mode
  PAIDDATEMODE: `${BASE_URL}/api/paiddatemodes`,
  PAIDDATEMODE_CREATE: `${BASE_URL}/api/paiddatemode/new`,
  PAIDDATEMODE_SINGLE: `${BASE_URL}/api/paiddatemode`,
  XEROXMONTHYEARPAIDMODE: `${BASE_URL}/api/xeroxfilterpaiddatemodes`,


  //category process map
  CATEGORYPROCESSMAP: `${BASE_URL}/api/categoryprocessmaps`,
  CATEGORYPROCESSMAP_CREATE: `${BASE_URL}/api/categoryprocessmap/new`,
  CATEGORYPROCESSMAP_SINGLE: `${BASE_URL}/api/categoryprocessmap`,
  CATEGORYPROCESSMAP_BULKDELETE: `${BASE_URL}/api/categoryprocessmapmutidelete`,
  CATEGORYPROCESSMAP_SORT: `${BASE_URL}/api/categoryprocessmapssort`,

  //Temp Points Upload baseservice
  ADD_TEMP_POINTS: `${BASE_URL}/api/temppoint/new`,
  GET_TEMP_POINTS: `${BASE_URL}/api/temppoints`,
  SINGLE_TEMP_POINTS: `${BASE_URL}/api/temppoint`,
  SINGLE_TEMP_POINTS_UPLOAD: `${BASE_URL}/api/singletemppoint`,

  //Professional tax master baseservice
  CREATE_PROFFESIONALTAXMASTER: `${BASE_URL}/api/professionaltaxmaster/new`,
  ALL_PROFFESIONALTAXMASTER: `${BASE_URL}/api/professionaltaxmasters`,
  SINGLE_PROFFESIONALTAXMASTER: `${BASE_URL}/api/professionaltaxmaster`,

  DEPARTMENTGROUPINGS: `${BASE_URL}/api/departmentgroupings`,
  DEPARTMENTGROUPING_CREATE: `${BASE_URL}/api/departmentgrouping/new`,
  DEPARTMENTGROUPING_SINGLE: `${BASE_URL}/api/departmentgrouping`,

  //Lead
  LEAD_CREATE: `${BASE_URL}/api/lead/new`,
  LEADS: `${BASE_URL}/api/leads`,
  LEAD_SINGLE: `${BASE_URL}/api/lead`,

  //settings

  SINGLE_OVERALL_SETTINGS: `${BASE_URL}/api/singleoverallsettings`,
  CREATE_OVERALL_SETTINGS: `${BASE_URL}/api/createoverallsettings`,
  GET_OVERALL_SETTINGS: `${BASE_URL}/api/getoverallsettings`,

  CREATE_INDIVIDUAL_SETTING: `${BASE_URL}/api/individualsettings/new`,
  ALL_INDIVIDUAL_SETTING: `${BASE_URL}/api/allindividualsettings`,
  SINGLE_INDIVIDUAL_SETTING: `${BASE_URL}/api/individualsettings`,

  GET_OVERALL_USERSWITCH_INFO: `${BASE_URL}/api/getoverallusersswitch`,

  //clockinip
  CLOCKINIP: `${BASE_URL}/api/allclockinip`,
  ASSIGNCLOCKINIP: `${BASE_URL}/api/assignallclockinip`,
  CLOCKINIP_CREATE: `${BASE_URL}/api/clockinip/new`,
  CLOCKINIP_SINGLE: `${BASE_URL}/api/clockinip`,
  BRANCH_IP: `${BASE_URL}/api/getipbybranch`,

  //passwordlist
  ALL_USER_PASS: `${BASE_URL}/api/alluserspasswordchange`,
  SINGLE_USER_PASS: `${BASE_URL}/api/singleuserpasswordchange`,

  //CATEGORY AND SUBCATEGORY
  ORGCATEGORYDOCUMENT_CREATE: `${BASE_URL}/api/organizationdocumentcategory/new`,
  ORGCATEGORYDOCUMENT: `${BASE_URL}/api/organizationdocumentcategorys`,
  ORGCATEGORYDOCUMENT_SINGLE: `${BASE_URL}/api/organizationdocumentcategory`,
  ORGCATEGORYDOCUMENT_OVERALLEDIRT: `${BASE_URL}/api/organizationcategorydocumentedit`,

  // organization  Document
  ALL_ORGDOCUMENT: `${BASE_URL}/api/allorgdocuments`,
  IMAGEALL_ORGDOCUMENT: `${BASE_URL}/api/imageorgdocuments`,
  ORGDOCUMENT_CREATE: `${BASE_URL}/api/orgdocuments/new`,
  ORGDOCUMENT_SINGLE: `${BASE_URL}/api/orgdocument`,
  GET_ORGSUBCAT: `${BASE_URL}/api/getorgsubcategoryref`,
  ORGDOCUMENT_OVERALLDELETE: `${BASE_URL}/api/orgdocumentdelete`,

  USER_CLOCKIN_CLOCKOUT_STATUS_LOGIN_CHECK: `${BASE_URL}/api/userclockinclockoutstatuslogincheck`,

  //Document Preparation baseservice

  // Task Category details
  TASKCATEGORY: `${BASE_URL}/api/taskcategories`,
  TASKCATEGORY_CREATE: `${BASE_URL}/api/taskcategory/new`,
  TASKCATEGORY_SINGLE: ` ${BASE_URL}/api/taskcategory`,
  // Task SubCategory details
  TASKSUBCATEGORY: `${BASE_URL}/api/tasksubcategories`,
  TASKSUBCATEGORY_CREATE: `${BASE_URL}/api/tasksubcategory/new`,
  TASKSUBCATEGORY_SINGLE: ` ${BASE_URL}/api/tasksubcategory`,
  // Training Category details
  TRAININGCATEGORY: `${BASE_URL}/api/trainingcategories`,
  TRAININGCATEGORY_CREATE: `${BASE_URL}/api/trainingcategory/new`,
  TRAININGCATEGORY_SINGLE: ` ${BASE_URL}/api/trainingcategory`,

  ALL_NONSCHEDULE_TRAININGDETAILS: `${BASE_URL}/api/nonscheduletrainingdetailss`,
  CREATE_NONSCHEDULE_TRAININGDETAILS: `${BASE_URL}/api/nonscheduletrainingdetails/new`,
  SINGLE_NONSCHEDULE_TRAININGDETAILS: `${BASE_URL}/api/nonscheduletrainingdetails`,

  // Task SubCategory details
  TRAININGSUBCATEGORY: `${BASE_URL}/api/trainingsubcategories`,
  TRAININGSUBCATEGORY_CREATE: `${BASE_URL}/api/trainingsubcategory/new`,
  TRAININGSUBCATEGORY_SINGLE: ` ${BASE_URL}/api/trainingsubcategory`,
  // Source details
  SOURCE: `${BASE_URL}/api/sources`,
  SOURCE_CREATE: `${BASE_URL}/api/source/new`,
  SOURCE_SINGLE: ` ${BASE_URL}/api/source`,

  // Assign Branch
  ASSIGNBRANCH: `${BASE_URL}/api/assignbranches`,
  ASSIGNBRANCH_CREATE: `${BASE_URL}/api/assignbranch/new`,
  ASSIGNBRANCH_SINGLE: `${BASE_URL}/api/assignbranch`,
  GETUSERASSIGNBRANCH: `${BASE_URL}/api/usersassignbranch`,


  // Income details
  INCOME: `${BASE_URL}/api/incomes`,
  INCOME_CREATE: `${BASE_URL}/api/income/new`,
  INCOME_SINGLE: `${BASE_URL}/api/income`,

  // Income details
  REMAINDER: `${BASE_URL}/api/remainders`,
  REMAINDER_CREATE: `${BASE_URL}/api/remainder/new`,
  REMAINDER_SINGLE: `${BASE_URL}/api/remainder`,

  //asset capacity baseservice

  CREATE_ASSETCAPACITY: `${BASE_URL}/api/assetcapacity/new`,
  ALL_ASSETCAPACITY: `${BASE_URL}/api/assetcapacitys`,
  SINGLE_ASSETCAPACITY: `${BASE_URL}/api/assetcapacity`,

  //ERA Amount baseservice
  ERAAMOUNT_CREATE: `${BASE_URL}/api/eraamount/new`,
  ERAAMOUNTS: `${BASE_URL}/api/eraamounts`,
  ERAAMOUNT_SINGLE: `${BASE_URL}/api/eraamount`,
  //Revenue Amount baseservice
  REVENUEAMOUNT_CREATE: `${BASE_URL}/api/revenueamount/new`,
  REVENUEAMOUNTS: `${BASE_URL}/api/revenueamounts`,
  REVENUEAMOUNT_SINGLE: `${BASE_URL}/api/revenueamount`,

  //Salary Slab baseservice
  CREATE_SALARYSLAB: `${BASE_URL}/api/salaryslab/new`,
  ALL_SALARYSLAB: `${BASE_URL}/api/salaryslabs`,
  SINGLE_SALARYSLAB: `${BASE_URL}/api/salaryslab`,
  SALARYSLAB_LIMITED: `${BASE_URL}/api/salaryslablimited`,
  SALARYSLAB_PROCESS_FILTER: `${BASE_URL}/api/salaryslabprocessfilter`,
  REVENUEAMOUNTSLIMITED: `${BASE_URL}/api/revenueamountlimited`,
  //Process team baseservice
  CREATE_PROCESS_AND_TEAM: `${BASE_URL}/api/processteam/new`,
  ALL_PROCESS_AND_TEAM: `${BASE_URL}/api/processteams`,
  PROCESS_AND_TEAM_SORT: `${BASE_URL}/api/processteamsort`,
  SINGLE_PROCESS_AND_TEAM: `${BASE_URL}/api/processteam`,

  // IP master ipmasterdelete
  IPMASTER: `${BASE_URL}/api/ipmasters`,
  IPMASTER_CREATE: ` ${BASE_URL}/api/ipmaster/new`,
  IPMASTER_SINGLE: `${BASE_URL}/api/ipmaster`,
  IPMASTER_UPDATE: `${BASE_URL}/api/ipmasterupdate`,
  IPMASTER_UPDATE_UPDATEBY: `${BASE_URL}/api/ipmasterupdateedby`,
  IPMASTER_DELETE: `${BASE_URL}/api/ipmasterdelete`,
  // IP Category  master
  IPCATEGORY: `${BASE_URL}/api/ipcategories`,
  IP_SUBCAT: `${BASE_URL}/api/ipsubcategory`,
  IPCATEGORY_CREATE: ` ${BASE_URL}/api/ipcategorie/new`,
  IPCATEGORY_SINGLE: `${BASE_URL}/api/ipcategorie`,

  //Day Points Upload baseservice
  ADD_DAY_POINTS: `${BASE_URL}/api/daypoint/new`,
  GET_DAY_POINTS: `${BASE_URL}/api/daypoints`,
  SINGLE_DAY_POINTS: `${BASE_URL}/api/daypoint`,
  SINGLE_DAY_POINTS_UPLOAD: `${BASE_URL}/api/singledaypoint`,

  //Production Consolidated baseservice
  ADD_PRODUCTION_CONSOLIDATED: `${BASE_URL}/api/productionconsolidated/new`,
  GET_PRODUCTION_CONSOLIDATED: `${BASE_URL}/api/productionconsolidateds`,
  SINGLE_PRODUCTION_CONSOLIDATED: `${BASE_URL}/api/productionconsolidated`,
  FILTER_PRODUCTION_CONSOLIDATED: `${BASE_URL}/api/filterproductionconsolidated`,

  //Employee status baseservice
  CREATE_EMPLOYEESTATUS: `${BASE_URL}/api/employeestatus/new`,
  ALL_EMPLOYEESTATUS: `${BASE_URL}/api/employeestatuss`,
  SINGLE_EMPLOYEESTATUS: `${BASE_URL}/api/employeestatus`,

  //Checklist interview baseservice
  CREATE_CHECKLISTINTERVIEW: `${BASE_URL}/api/checklistinterview/new`,
  ALL_CHECKLISTINTERVIEW: `${BASE_URL}/api/checklistinterviews`,
  SINGLE_CHECKLISTINTERVIEW: `${BASE_URL}/api/checklistinterview`,

  ALLINCOMEANDEXPENSE: `${BASE_URL}/api/allincomeandexpenses`,

  // Checklisttype details
  CHECKLISTTYPE: ` ${BASE_URL}/api/checklisttypes`,
  CHECKLISTTYPE_CREATE: ` ${BASE_URL}/api/checklisttype/new`,
  CHECKLISTTYPE_SINGLE: `${BASE_URL}/api/checklisttype`,

  // Checklist category details
  CHECKLISTCATEGORY: `${BASE_URL}/api/checklistcategories`,
  CHECKLISTCATEGORY_CREATE: `${BASE_URL}/api/checklistcategory/new`,
  CHECKLISTCATEGORY_SINGLE: ` ${BASE_URL}/api/checklistcategory`,

  //File Access baseservice
  CREATE_FILEACCESS: `${BASE_URL}/api/fileaccess/new`,
  ALL_FILEACCESS: `${BASE_URL}/api/fileaccesss`,
  SINGLE_FILEACCESS: `${BASE_URL}/api/fileaccess`,

  //File Share baseservice
  CREATE_FILESHARE: `${BASE_URL}/api/fileshare/new`,
  ALL_FILESHARE: `${BASE_URL}/api/fileshares`,
  SINGLE_FILESHARE: `${BASE_URL}/api/singlefilshare`,

  //Announcement Category baseservice
  CREATE_ANNOUNCEMENTCATEGORY: `${BASE_URL}/api/announcementcategory/new`,
  ALL_ANNOUNCEMENTCATEGORY: `${BASE_URL}/api/announcementcategorys`,
  SINGLE_ANNOUNCEMENTCATEGORY: `${BASE_URL}/api/announcementcategory`,


  //Announcement baseservice
  CREATE_ANNOUNCEMENT: `${BASE_URL}/api/announcement/new`,
  ALL_ANNOUNCEMENT: `${BASE_URL}/api/announcements`,
  SINGLE_ANNOUNCEMENT: `${BASE_URL}/api/announcement`,

  // self Check point ticket master
  SELFCHECKPOINTTICKET: `${BASE_URL}/api/selfcheckpointticketmasters`,
  SELFCHECKPOINTTICKET_CREATE: `${BASE_URL}/api/selfcheckpointticketmaster/new`,
  SELFCHECKPOINTTICKET_SINGLE: `${BASE_URL}/api/selfcheckpointticketmaster`,

  //Permission   base service
  PERMISSIONS: `${BASE_URL}/api/persmissions`,
  PERMISSIONS_HOME: `${BASE_URL}/api/persmissionshome`,
  ACTIVEPERMISSIONS: `${BASE_URL}/api/activeuserpersmissions`,
  PERMISSION_CREATE: `${BASE_URL}/api/persmission/new`,
  PERMISSION_SINGLE: `${BASE_URL}/api/persmission`,

  //reqired master
  REQUIREDFIELDS: `${BASE_URL}/api/requiredfields`,
  REQUIREFIELDS_CREATE: `${BASE_URL}/api/requiredfield/new`,
  REQUIREFIELDS_SINGLE: `${BASE_URL}/api/requiredfield`,
  //homepage birthday
  GETUSERDATES: `${BASE_URL}/api/getallusersdates`,
  GET_ALL_DOB: `${BASE_URL}/api/getallusersdob`,
  GET_ALL_DOJ: `${BASE_URL}/api/getallusersdoj`,
  GET_ALL_DOM: `${BASE_URL}/api/getallusersdom`,

  //Task Schedule Grouping team baseservice
  CREATE_TASKSCHEDULEGROUPING: `${BASE_URL}/api/taskschedulegrouping/new`,
  ALL_TASKSCHEDULEGROUPING: `${BASE_URL}/api/taskschedulegroupings`,
  SINGLE_TASKSCHEDULEGROUPING: `${BASE_URL}/api/taskschedulegrouping`,
  NONSCHEDULETASKFORUSER: `${BASE_URL}/api/nonscheduletaskforuserlog`,
  NONSCHEDULLOGREASSIGNTASKFORUSER: `${BASE_URL}/api/nonschedulelogreassignforuser`,

  // /Raise Ticket


  //panel type baseservice
  CREATE_PANELTYPE: `${BASE_URL}/api/paneltype/new`,
  ALL_PANELTYPE: `${BASE_URL}/api/paneltypes`,
  SINGLE_PANELTYPE: `${BASE_URL}/api/paneltype`,

  //screen resolution baseservice
  CREATE_SCREENRESOLUTION: `${BASE_URL}/api/screenresolution/new`,
  ALL_SCREENRESOLUTION: `${BASE_URL}/api/screenresolutions`,
  SINGLE_SCREENRESOLUTION: `${BASE_URL}/api/screenresolution`,

  //connectivity baseservice
  CREATE_CONNECTIVITY: `${BASE_URL}/api/connectivity/new`,
  ALL_CONNECTIVITY: `${BASE_URL}/api/connectivitys`,
  SINGLE_CONNECTIVITY: `${BASE_URL}/api/connectivity`,
  //ASSET SPECIFICATIONS BASE SERVICES

  //data range baseservice
  CREATE_DATARANGE: `${BASE_URL}/api/datarange/new`,
  ALL_DATARANGE: `${BASE_URL}/api/dataranges`,
  SINGLE_DATARANGE: `${BASE_URL}/api/datarange`,

  //compatible devices baseservice
  CREATE_COMPATIBLEDEVICES: `${BASE_URL}/api/compatibledevices/new`,
  ALL_COMPATIBLEDEVICES: `${BASE_URL}/api/compatibledevicess`,
  SINGLE_COMPATIBLEDEVICES: `${BASE_URL}/api/compatibledevices`,

  //output power baseservice
  CREATE_OUTPUTPOWER: `${BASE_URL}/api/outputpower/new`,
  ALL_OUTPUTPOWER: `${BASE_URL}/api/outputpowers`,
  SINGLE_OUTPUTPOWER: `${BASE_URL}/api/outputpower`,

  //cooling fan count baseservice
  CREATE_COOLINGFANCOUNT: `${BASE_URL}/api/coolingfancount/new`,
  ALL_COOLINGFANCOUNT: `${BASE_URL}/api/coolingfancounts`,
  SINGLE_COOLINGFANCOUNT: `${BASE_URL}/api/coolingfancount`,

  //clock speed baseservice
  CREATE_CLOCKSPEED: `${BASE_URL}/api/clockspeed/new`,
  ALL_CLOCKSPEED: `${BASE_URL}/api/clockspeeds`,
  SINGLE_CLOCKSPEED: `${BASE_URL}/api/clockspeed`,

  //core baseservice
  CREATE_CORE: `${BASE_URL}/api/core/new`,
  ALL_CORE: `${BASE_URL}/api/cores`,
  SINGLE_CORE: `${BASE_URL}/api/core`,

  //speed baseservice
  CREATE_SPEED: `${BASE_URL}/api/speed/new`,
  ALL_SPEED: `${BASE_URL}/api/speeds`,
  SINGLE_SPEED: `${BASE_URL}/api/speed`,

  //frequency baseservice
  CREATE_FREQUENCY: `${BASE_URL}/api/frequency/new`,
  ALL_FREQUENCY: `${BASE_URL}/api/frequencys`,
  SINGLE_FREQUENCY: `${BASE_URL}/api/frequency`,

  //output baseservice
  CREATE_OUTPUT: `${BASE_URL}/api/output/new`,
  ALL_OUTPUT: `${BASE_URL}/api/outputs`,
  SINGLE_OUTPUT: `${BASE_URL}/api/output`,

  //ethernet ports baseservice
  CREATE_ETHERNETPORTS: `${BASE_URL}/api/ethernetports/new`,
  ALL_ETHERNETPORTS: `${BASE_URL}/api/ethernetportss`,
  SINGLE_ETHERNETPORTS: `${BASE_URL}/api/ethernetports`,

  //distance baseservice
  CREATE_DISTANCE: `${BASE_URL}/api/distance/new`,
  ALL_DISTANCE: `${BASE_URL}/api/distances`,
  SINGLE_DISTANCE: `${BASE_URL}/api/distance`,

  //length baseservice
  CREATE_LENGTH: `${BASE_URL}/api/length/new`,
  ALL_LENGTH: `${BASE_URL}/api/lengths`,
  SINGLE_LENGTH: `${BASE_URL}/api/length`,

  //slot baseservice
  CREATE_SLOT: `${BASE_URL}/api/slot/new`,
  ALL_SLOT: `${BASE_URL}/api/slots`,
  SINGLE_SLOT: `${BASE_URL}/api/slot`,

  //no of channels baseservice
  CREATE_NOOFCHANNELS: `${BASE_URL}/api/noofchannels/new`,
  ALL_NOOFCHANNELS: `${BASE_URL}/api/noofchannelss`,
  SINGLE_NOOFCHANNELS: `${BASE_URL}/api/noofchannels`,

  //colours baseservice
  CREATE_COLOURS: `${BASE_URL}/api/colours/new`,
  ALL_COLOURS: `${BASE_URL}/api/colourss`,
  SINGLE_COLOURS: `${BASE_URL}/api/colours`,

  // roles and responsibility
  ROLESANDRESPONSECAT: `${BASE_URL}/api/rolesndresponsecategorys`,
  ROLESANDRESPONSECAT_CREATE: `${BASE_URL}/api/rolesndresponsecategory/new`,
  ROLESANDRESPONSECAT_SINGLE: `${BASE_URL}/api/rolesndresponsecategory`,

  // roles of responsibilities
  ROLESANDRES: `${BASE_URL}/api/rolesndresponses`,
  ROLESANDRES_CREATE: `${BASE_URL}/api/rolesndres/new`,
  ROLESANDRES_SINGLE: `${BASE_URL}/api/rolesndres`,

  //Asset Specification Grouping baseservice
  CREATE_ASSETSPECIFICATIONGROUPING: `${BASE_URL}/api/assetspecificationgrouping/new`,
  ALL_ASSETSPECIFICATIONGROUPING: `${BASE_URL}/api/assetspecificationgroupings`,
  SINGLE_ASSETSPECIFICATIONGROUPING: `${BASE_URL}/api/assetspecificationgrouping`,

  // EB servicemaster details
  EBSERVICEMASTER: `${BASE_URL}/api/ebservicemasters`,
  FILTEREBSERVICEMASTER: `${BASE_URL}/api/boardingebservicemasters`,
  EBSERVICEMASTER_CREATE: `${BASE_URL}/api/ebservicemaster/new`,
  EBSERVICEMASTER_SINGLE: `${BASE_URL}/api/ebservicemaster`,
  // Manage material details
  MANAGEMATERIAL: `${BASE_URL}/api/managematerials`,
  MANAGEMATERIAL_CREATE: `${BASE_URL}/api/managematerial/new`,
  MANAGEMATERIAL_SINGLE: `${BASE_URL}/api/managematerial`,

  CHECK_EBREADINGDETAILLIST: `${BASE_URL}/api/ebreadingdetailslistFilter`,

  //vendor master for eb
  VENDOREB_CREATE: `${BASE_URL}/api/vendormasterforeb/new`,
  ALL_VENDOREB: `${BASE_URL}/api/allvendormasterforeb`,
  SINGLE_VENDOREB: `${BASE_URL}/api/singlevendormasterforeb`,

  // Manage material details
  ALL_EBUSEINSTRUMENTS: `${BASE_URL}/api/ebuseinstruments`,
  CREATE_EBUSEINSTRUMENTS: `${BASE_URL}/api/ebuseinstrument/new`,
  SINGLE_EBUSEINSTRUMENTS: `${BASE_URL}/api/ebuseinstrument`,
  CHECK_EBUSE_INSTRUMENTS: `${BASE_URL}/api/ebuseinstrumentsFilter`,

  // EB material  details
  EBMATERIALDETAILS: `${BASE_URL}/api/ebmaterialdetails`,
  EBMATERIALDETAILS_CREATE: `${BASE_URL}/api/ebmaterialdetail/new`,
  EBMATERIALDETAILS_SINGLE: `${BASE_URL}/api/ebmaterialdetail`,

  // Eb Rates  details
  EBRATES: `${BASE_URL}/api/ebrates`,
  EBRATES_CREATE: `${BASE_URL}/api/ebrate/new`,
  EBRATES_SINGLE: `${BASE_URL}/api/ebrate`,

  // Eb Reading  details
  EBREADINGDETAIL: `${BASE_URL}/api/ebreadingdetails`,
  EBREADINGDETAIL_CREATE: `${BASE_URL}/api/ebreadingdetail/new`,
  EBREADINGDETAIL_SINGLE: `${BASE_URL}/api/ebreadingdetail`,
  CHECK_EBREADINGDETAIL: `${BASE_URL}/api/ebreadingdetailsFilter`,
  EB_SERVICEFILTER: `${BASE_URL}/api/ebservicefilter`,

  // minimum points base service
  MINIMUMPOINTS: `${BASE_URL}/api/minimumpointss`,
  MINIMUMPOINT_CREATE: `${BASE_URL}/api/minimumpoints/new`,
  MINIMUMPOINT_SINGLE: `${BASE_URL}/api/minimumpoints`,
  MINIMUMPOINTS_BULKDELETE: `${BASE_URL}/api/minimumpointsbulkdelete`,

  //bankverification details
  GETALLBANKVERIFICATIONUSERS: `${BASE_URL}/api/bankdetailsverfication/all`,
  POSTSINGLEBANKVERIFICATIONUSER: `${BASE_URL}/api/bankdetailsverfication/new`,
  BANKDETAILS_SINGLE: `${BASE_URL}/api/bankdetailsverfication/single`,
  GETSINGLEUSERDETAILSUSINGEMPID: `${BASE_URL}/api/bankdetailsverfication/single/empidbased`,
  GETSINGLEUSERDETAILSUSINGEMPIDARR: `${BASE_URL}/api/bankdetailsverfication/single/empidbasedarr`,


  CREATE_POWERSTATION: `${BASE_URL}/api/powerstation/new`,
  ALL_POWERSTATION: `${BASE_URL}/api/powerstations`,
  SINGLE_POWERTSTATION: `${BASE_URL}/api/powerstation`,
  POWERSTATIONFILTER: `${BASE_URL}/api/powerstationfilter`,


  MANAGESTOCKITEMS: `${BASE_URL}/api/managestockitems`,
  MANAGESTOCKITEMS_CREATE: `${BASE_URL}/api/managestockitems/new`,
  MANAGESTOCKITEMS_SINGLE: `${BASE_URL}/api/managestockitems`,

  //Shift grouping
  GETALLSHIFTGROUPS: `${BASE_URL}/api/shiftgroupings`,
  CREATESINGLESHIFTGROUP: `${BASE_URL}/api/shiftgrouping/new`,
  GETSINGLESHIFTGROUP: `${BASE_URL}/api/shiftgrouping`,

  DESIGNATIONREQUIREMENTS: `${BASE_URL}/api/designationrequirements`,
  DESIGNATIONREQ_CREATE: `${BASE_URL}/api/designationrequirement/new`,
  DESIGNATIONREQUUIREMENTS_SINGLE: `${BASE_URL}/api/designationrequirement`,

  DESIGNATIONREQUIREMENTSFILTER: `${BASE_URL}/api/designationmanpowerfilter`,

  // add education category details
  CATEGORYEDUCATION: `${BASE_URL}/api/educationcategories`,
  CATEGORYEDUCATION_CREATE: `${BASE_URL}/api/educationcategory/new`,
  CATEGORYEDUCATION_SINGLE: `${BASE_URL}/api/educationcategory`,

  // Education Specilization master
  EDUCATIONSPECILIZATION: `${BASE_URL}/api/educationspecilizations`,
  EDUCATIONSPECILIZATION_CREATE: `${BASE_URL}/api/educationspecilization/new`,
  EDUCATIONSPECILIZATION_SINGLE: `${BASE_URL}/api/educationspecilization`,

  //Interactor Type baseservice
  CREATE_INTERACTORTYPE: `${BASE_URL}/api/interactortype/new`,
  ALL_INTERACTORTYPE: `${BASE_URL}/api/interactortype`,
  SINGLE_INTERACTORTYPE: `${BASE_URL}/api/interactortype`,

  //Interactor Mode baseservice
  CREATE_INTERACTORMODE: `${BASE_URL}/api/interactormode/new`,
  ALL_INTERACTORMODE: `${BASE_URL}/api/interactormode`,
  SINGLE_INTERACTORMODE: `${BASE_URL}/api/interactormode`,

  //Interactor Purpose baseservice
  CREATE_INTERACTORPURPOSE: `${BASE_URL}/api/interactorpurpose/new`,
  ALL_INTERACTORPURPOSE: `${BASE_URL}/api/interactorpurpose`,
  SINGLE_INTERACTORPURPOSE: `${BASE_URL}/api/interactorpurpose`,

  //Visitors Base Service
  CREATE_VISITORS: `${BASE_URL}/api/visitors/new`,
  ALL_VISITORS: `${BASE_URL}/api/allvisitors`,
  LASTINDEX_VISITORS: `${BASE_URL}/api/lastindexvisitors`,
  SINGLE_VISITORS: `${BASE_URL}/api/visitors`,

  // interview Round Order 
  INTERVIEWROUNDORDER: `${BASE_URL}/api/interviewroundorders`,
  INTERVIEWROUNDORDER_CREATE: `${BASE_URL}/api/interviewroundorder/new`,
  INTERVIEWROUNDORDER_SINGLE: `${BASE_URL}/api/interviewroundorder`,

  //Production Original
  PRODUCTION_ORGINAL: `${BASE_URL}/api/productionoriginals`,
  PRODUCTION_ORGINAL_LIMITED: `${BASE_URL}/api/productionoriginalslimited`,
  PRODUCTION_ORGINAL_UNIQID: `${BASE_URL}/api/productionoriginalslimiteduniqid`,
  PRODUCTION_ORGINAL_CREATE: `${BASE_URL}/api/productionoriginal/new`,
  PRODUCTION_ORGINAL_SINGLE: `${BASE_URL}/api/productionoriginal`,


  //Production Temp
  PRODUCTION_TEMP: `${BASE_URL}/api/productionstemp`,
  PRODUCTION_TEMP_LIMITED: `${BASE_URL}/api/productiontemplimited`,
  PRODUCTION_TEMP_UNIQID: `${BASE_URL}/api/productiontemplimiteduniqid`,
  PRODUCTION_TEMP_CREATE: `${BASE_URL}/api/productiontemp/new`,
  PRODUCTION_TEMP_SINGLE: `${BASE_URL}/api/productiontemp`,


  //Production Original
  PRODUCTION_UPLOAD: `${BASE_URL}/api/productionuploads`,
  PRODUCTION_UPLOAD_CREATE: `${BASE_URL}/api/productionupload/new`,
  PRODUCTION_UPLOAD_SINGLE: `${BASE_URL}/api/productionupload`,
  PRODUCTION_UPLOAD_FILENAMELIST: `${BASE_URL}/api/productionuploadfilenamelist`,
  PRODUCTION_UPLOAD_FILENAMEONLY: `${BASE_URL}/api/productionuploadfilenameonly`,
  PRODUCTION_UPLOAD_GETDELETEDATAS: `${BASE_URL}/api/productionuploadgetdeletedatas`,
  PRODUCTION_UPLOAD_GETDELETEDATASALL: `${BASE_URL}/api/productionuploadgetdeletedatasall`,
  PRODUCTION_UPLOAD_DELETEMULTI: `${BASE_URL}/api/productionuploaddeletemulti`,
  PRODUCTION_UPLOAD_OVERALL_FETCH_LIMITED: `${BASE_URL}/api/productionuploadoverallfetchlimited`,




  //Production Original TEMP
  PRODUCTION_TEMP_UPLOAD: `${BASE_URL}/api/productiontempuploadsall`,
  PRODUCTION_TEMP_UPLOAD_CREATE: `${BASE_URL}/api/productiontempuploadall/new`,
  PRODUCTION_TEMP_UPLOAD_SINGLE: `${BASE_URL}/api/productiontempuploadall`,
  PRODUCTION_TEMP_UPLOAD_FILENAMELIST: `${BASE_URL}/api/productiontempuploadallfilenamelist`,
  PRODUCTION_TEMP_UPLOAD_FILENAMEONLY: `${BASE_URL}/api/productiontempuploadallfilenameonly`,
  PRODUCTION_TEMP_UPLOAD_GETDELETEDATAS: `${BASE_URL}/api/productiontempuploadallgetdeletedatas`,
  PRODUCTION_TEMP_UPLOAD_GETDELETEDATASALL: `${BASE_URL}/api/productiontempuploadallgetdeletedatasall`,
  PRODUCTION_TEMP_UPLOAD_DELETEMULTI: `${BASE_URL}/api/productiontempuploadalldeletemulti`,
  PRODUCTION_TEMP_UPLOAD_OVERALL_FETCH_LIMITED: `${BASE_URL}/api/productiontempuploadalloverallfetchlimited`,

  PRODUCTION_UPLOAD_OVERALL_FETCH_LIMITEDNEW: `${BASE_URL}/api/productionuploadoverallfetchlimitednew`,
  PRODUCTION_TEMP_UPLOAD_OVERALL_FETCH_LIMITEDNEW: `${BASE_URL}/api/productiontempuploadoverallfetchlimitednew`,

  // minimum points base service
  PRODUCTION_UNITRATE: `${BASE_URL}/api/unitsrate`,
  PRODUCTION_UNITRATE_CREATE: `${BASE_URL}/api/unitrate/new`,
  PRODUCTION_UNITRATE_SINGLE: `${BASE_URL}/api/unitrate`,
  PRODUCTION_UNITRATE_SORT: `${BASE_URL}/api/unitsratesort`,

  CATEGORYPROD: `${BASE_URL}/api/categoriesprod`,
  CATEGORYPROD_CREATE: `${BASE_URL}/api/categoryprod/new`,
  CATEGORYPROD_SORT: `${BASE_URL}/api/categoriesprodsort`,
  CATEGORYPROD_SINGLE: `${BASE_URL}/api/categoryprod`,
  //subcategory  excel
  SUBCATEGORYPROD: `${BASE_URL}/api/subcategoriesprod`,
  SUBCATEGORYPROD_CREATE: `${BASE_URL}/api/subcategoryprod/new`,
  SUBCATEGORYPROD_SINGLE: `${BASE_URL}/api/subcategoryprod`,

  EXCELFILEUPLOADSTORE: `${BASE_URL}/api/upload`,

  USERS_LIMITED_EMPCODE: `${BASE_URL}/api/userslimitedempcode`,
  USERS_LIMITED_EMPCODE_CREATE: `${BASE_URL}/api/userslimitedempcodecreate`,
  USERS_LIMITED_EMPCODE_NONMANUAL: `${BASE_URL}/api/userslimitedempcodenonmanual`,

  // interview assigninterviewer master
  ASSIGNINTERVIEWERS: `${BASE_URL}/api/assigninterviewers`,
  ASSIGNINTERVIEWER_CREATE: `${BASE_URL}/api/assigninterviewer/new`,
  ASSIGNINTERVIEWER_SINGLE: `${BASE_URL}/api/assigninterviewer`,

  VERIFYVIEWPASSWORD: `${BASE_URL}/api/verification/viewpassword`,

  // Assignedby details
  ASSIGNEDBY: `${BASE_URL}/api/assignedby`,
  ASSIGNEDBY_CREATE: `${BASE_URL}/api/assignedby/new`,
  ASSIGNEDBY_SINGLE: `${BASE_URL}/api/assignedby`,
  ALL_ASSIGNEDBY_SORT: `${BASE_URL}/api/assignedbysort`,

  // ManageAssignedmode details
  MANAGEASSIGNEDMODE: `${BASE_URL}/api/manageassignedmode`,
  MANAGEASSIGNED_CREATE: `${BASE_URL}/api/manageassignedmode/new`,
  MANAGEASSIGNED_SINGLE: `${BASE_URL}/api/manageassignedmode`,

  //stock category
  STOCKCATEGORY: `${BASE_URL}/api/stockcategorys`,
  STOCKCATEGORY_CREATE: `${BASE_URL}/api/stockcategory/new`,
  STOCKCATEGORY_SINGLE: `${BASE_URL}/api/stockcategory`,

  //ManagetypeapurposeGroup Base Service 
  CREATE_MANAGETYPEPG: `${BASE_URL}/api/managetypepg/new`,
  ALL_MANAGETYPEPG: `${BASE_URL}/api/managetypepg`,
  SINGLE_MANAGETYPEPG: `${BASE_URL}/api/managetypepg`,

  //Purpose Base Service
  CREATE_PURPOSE: `${BASE_URL}/api/purpose/new`,
  ALL_PURPOSE: `${BASE_URL}/api/purpose`,
  SINGLE_PURPOSE: `${BASE_URL}/api/purpose`,

  MEETING_DELETE: `${BASE_URL}/api/deletemultipleschedulemeeting`,
  SCHEDULE_MEETING_LOG: `${BASE_URL}/api/schedulemeetinglog`,

  // Manageothertask details
  MANAGEOTHERTASK: `${BASE_URL}/api/manageothertasks`,
  MANAGEOTHERTASK_CREATE: `${BASE_URL}/api/manageothertask/new`,
  MANAGEOTHERTASK_SINGLE: `${BASE_URL}/api/manageothertask`,
  ALL_OTHERTASK_SORT: `${BASE_URL}/api/othertasksort`,

  // Assign Branch
  SOURCEOFPAYMENT: `${BASE_URL}/api/sourceofpayment`,
  SOURCEOFPAYMENT_CREATE: `${BASE_URL}/api/sourceofpayment/new`,
  SOURCEOFPAYMENT_SINGLE: `${BASE_URL}/api/sourceofpayment`,

  //Accuracymaster
  ACCURACYMASTERGETALL: `${BASE_URL}/api/accuracymaster`,
  ACCURACYMASTER_CREATE: `${BASE_URL}/api/accuracymaster/new`,
  ACCURACYMASTER_SINGLE: `${BASE_URL}/api/accuracymaster`,

  //Expected Accuracy
  EXPECTEDACCURACYGETALL: `${BASE_URL}/api/expectedaccuracy`,
  EXPECTEDACCURACY_CREATE: `${BASE_URL}/api/expectedaccuracy/new`,
  EXPECTEDACCURACY_SINGLE: `${BASE_URL}/api/expectedaccuracy`,

  //Acheived Accuracy /acheivedaccuracy/single
  ACHEIVEDACCURACYGETALL: `${BASE_URL}/api/acheivedaccuracy`,
  ACHEIVEDACCURACY_CREATE: `${BASE_URL}/api/acheivedaccuracy/new`,
  ACHEIVEDACCURACY_SINGLE: `${BASE_URL}/api/acheivedaccuracy`,
  EXPECTEDACCURACY_SINGLEBYDETAILS: `${BASE_URL}/api/expectedaccuracy/single`,
  ACHEIVEDACCURACY_SINGLEBYDETAILS: `${BASE_URL}/api/acheivedaccuracy/single`,


  // Managepowershutdowntype details 
  MANAGEPOWERSHUTDOWNTYPE: `${BASE_URL}/api/managepowershutdowntype`,
  MANAGEPOWERSHUTDOWNTYPE_CREATE: `${BASE_URL}/api/managepowershutdowntype/new`,
  MANAGEPOWERSHUTDOWNTYPE_SINGLE: `${BASE_URL}/api/managepowershutdowntype`,

  //Production Process Queue
  PRODUCTIONPROCESSQUEUEGETALL: `${BASE_URL}/api/productionprocessqueue`,
  PRODUCTIONPROCESSQUEUE_CREATE: `${BASE_URL}/api/productionprocessqueue/new`,
  PRODUCTIONPROCESSQUEUE_SINGLE: `${BASE_URL}/api/productionprocessqueue`,

  //Penalty Error upload
  PENALTYERRORUPLOADGETALL: `${BASE_URL}/api/errortypes`,
  PENALTYERRORUPLOAD_CREATE: `${BASE_URL}/api/errortype/new`,
  PENALTYERRORUPLOAD_SINGLE: `${BASE_URL}/api/errortype`,

  // payrun control
  PAYRUNCONTROL: `${BASE_URL}/api/payruncontrols`,
  PAYRUNCONTROL_CREATE: `${BASE_URL}/api/payruncontrol/new`,
  PAYRUNCONTROL_SINGLE: `${BASE_URL}/api/payruncontrol`,

  //Experiencebasewavier master 
  EXPERIENCEBASE: `${BASE_URL}/api/expericencebases`,
  EXPERIENCEBASE_CREATE: `${BASE_URL}/api/expericencebase/new`,
  EXPERIENCEBASE_SINGLE: `${BASE_URL}/api/expericencebase`,

  //Master Fieldname
  MASTERFIELDNAME: `${BASE_URL}/api/masterfieldnames`,
  MASTERFIELDNAME_CREATE: `${BASE_URL}/api/masterfieldname/new`,
  MASTERFIELDNAME_SINGLE: `${BASE_URL}/api/masterfieldname`,

  //Other Penaltyname
  OTHERPENALTYCONTROL: `${BASE_URL}/api/otherpenaltycontrols`,
  OTHERPENALTYCONTROL_CREATE: `${BASE_URL}/api/otherpenaltycontrol/new`,
  OTHERPENALTYCONTROL_SINGLE: `${BASE_URL}/api/otherpenaltycontrol`,

  //Penalty Error reason
  PENALTYERRORREASONGETALL: `${BASE_URL}/api/penaltyerrorreason`,
  PENALTYERRORREASON_CREATE: `${BASE_URL}/api/penaltyerrorreason/new`,
  PENALTYERRORREASON_SINGLE: `${BASE_URL}/api/penaltyerrorreason`,

  //Penalty Error control
  PENALTYERRORCONTROLGETALL: `${BASE_URL}/api/penaltyerrorcontrol`,
  PENALTYERRORCONTROL_CREATE: `${BASE_URL}/api/penaltyerrorcontrol/new`,
  PENALTYERRORCONTROL_SINGLE: `${BASE_URL}/api/penaltyerrorcontrol`,

  //Manageidleworks 
  MANAGEIDLEWORK: `${BASE_URL}/api/manageidleworks`,
  MANAGEIDLEWORK_CREATE: `${BASE_URL}/api/manageidlework/new`,
  MANAGEIDLEWORK_SINGLE: `${BASE_URL}/api/manageidlework`,

  //Accuracy Queue Grouping
  ACCURACYQUEUEGROUPING: `${BASE_URL}/api/accuracyqueuegroupings`,
  ACCURACYQUEUEGROUPING_CREATE: `${BASE_URL}/api/accuracyqueuegrouping/new`,
  ACCURACYQUEUEGROUPING_SINGLE: `${BASE_URL}/api/accuracyqueuegrouping`,


  //non production unit rate
  NONPRODUCTIONUNITRATEGETALL: `${BASE_URL}/api/nonproductionunitrate`,
  NONPRODUCTIONUNITRATE_CREATE: `${BASE_URL}/api/nonproductionunitrate/new`,
  NONPRODUCTIONUNITRATE_SINGLE: `${BASE_URL}/api/nonproductionunitrate`,

  //non production unit Allot
  NONPRODUCTIONUNITALLOT: `${BASE_URL}/api/nonproductionunitallot`,
  NONPRODUCTIONUNITALLOT_CREATE: `${BASE_URL}/api/nonproductionunitallot/new`,
  NONPRODUCTIONUNITALLOT_SINGLE: `${BASE_URL}/api/nonproductionunitallot`,

  CATEGORYANDSUBCATEGORYGETALL: `${BASE_URL}/api/categoryandsubcategory`,
  CATEGORYANDSUBCATEGORY_CREATE: `${BASE_URL}/api/categoryandsubcategory/new`,
  CATEGORYANDSUBCATEGORY_SINGLE: `${BASE_URL}/api/categoryandsubcategory`,


  //Manage Category Percentage
  MANAGECATEGORYGETALL: `${BASE_URL}/api/managecategorypercentage`,
  MANAGECATEGORYPERCENTAGE_CREATE: `${BASE_URL}/api/managecategorypercentage/new`,
  MANAGECATEGORYPERCENTAGE_SINGLE: `${BASE_URL}/api/managecategorypercentage`,



  //PRODUCTION
  RAISEPROBLEM: `${BASE_URL}/api/raises`,
  RAISEPROBLEM_CREATE: `${BASE_URL}/api/raise/new`,
  RAISEPROBLEM_SINGLE: `${BASE_URL}/api/raise`,
  OVERALL_RAISEPROBLEM: `${BASE_URL}/api/overallraise`,

  //Production client rate page
  PRODUCTIONCLIENTRATEALL: `${BASE_URL}/api/productionclientrate`,
  PRODUCTIONCLIENTRATE_CREATE: `${BASE_URL}/api/productionclientrate/new`,
  PRODUCTIONCLIENTRATE_SINGLE: `${BASE_URL}/api/productionclientrate`,

  //Acheived Accuracy Internal /acheivedaccuracy/single
  ACHEIVEDACCURACYINTERNALGETALL: `${BASE_URL}/api/acheivedaccuracyinternal`,
  ACHEIVEDACCURACYINTERNAL_CREATE: `${BASE_URL}/api/acheivedaccuracyinternal/new`,
  ACHEIVEDACCURACYINTERNAL_SINGLE: `${BASE_URL}/api/acheivedaccuracyinternal`,
  ACHEIVEDACCURACYINTERNAL_SINGLEBYDETAILS: `${BASE_URL}/api/acheivedaccuracyinternal/single`,

  //Acheived Accuracy Client /acheivedaccuracy/single
  ACHEIVEDACCURACYCLIENTGETALL: `${BASE_URL}/api/acheivedaccuracyclient`,
  ACHEIVEDACCURACYCLIENT_CREATE: `${BASE_URL}/api/acheivedaccuracyclient/new`,
  ACHEIVEDACCURACYCLIENT_SINGLE: `${BASE_URL}/api/acheivedaccuracyclient`,
  ACHEIVEDACCURACYCLIENT_SINGLEBYDETAILS: `${BASE_URL}/api/acheivedaccuracyclient/single`,

  ADD_PENALTY_CLIENT: `${BASE_URL}/api/penaltyclientamount/new`,
  GET_PENALTY_CLIENT: `${BASE_URL}/api/penaltyclientamounts`,
  SINGLE_PENALTY_CLIENT: `${BASE_URL}/api/penaltyclientamount`,


  DAY_POINTS_FILTER: `${BASE_URL}/api/daypointsfilter`,
  DAY_POINTS_DATAS: `${BASE_URL}/api/daypointsdatasfetch`,

  TEMP_DAY_POINTS_FILTER: `${BASE_URL}/api/temppointsfilter`,
  TEMP_DAY_POINTS_DATAS: `${BASE_URL}/api/temppointsdatasfetch`,
  //Penaltyday Upload baseservice
  ADD_PENALTYDAYUPLOAD: `${BASE_URL}/api/penaltydayupload/new`,
  GET_PENALTYDAYUPLOAD: `${BASE_URL}/api/penaltydayuploads`,
  SINGLE_PENALTYDAYUPLOAD: `${BASE_URL}/api/penaltydayupload`,
  SINGLE_PENALTY_UPLOAD: `${BASE_URL}/api/singlepenaltydayupload`,

  //Manege penalty month baseservice
  ADD_MANAGEPENALTYMONTH: `${BASE_URL}/api/managepenaltymonth/new`,
  GET_MANAGEPENALTYMONTH: `${BASE_URL}/api/managepenaltymonths`,
  SINGLE_MANAGEPENALTYMONTH: `${BASE_URL}/api/managepenaltymonth`,
  FILTER_MANAGEPENALTYMONTH: `${BASE_URL}/api/filtermanagepenaltymonth`,

  //Category master
  CATEGORYMASTERGETALL: `${BASE_URL}/api/categorymaster`,
  CATEGORYMASTER_CREATE: `${BASE_URL}/api/categorymaster/new`,
  CATEGORYMASTER_SINGLE: `${BASE_URL}/api/categorymaster`,

  PROFFESIONALTAXMASTER_SORT: `${BASE_URL}/api/professionaltaxmastersort`,

  PAIDDATEFIX_SORT: `${BASE_URL}/api/paiddatefixssort`,
  PAIDSTATUSFIX_SORT: `${BASE_URL}/api/paidstatusfixsort`,

  //Manage Shortage Master
  MANAGESHORTAGEMASTER: `${BASE_URL}/api/manageshortagemasters`,
  MANAGESHORTAGEMASTER_CREATE: `${BASE_URL}/api/manageshortagemaster/new`,
  MANAGESHORTAGEMASTER_SINGLE: `${BASE_URL}/api/manageshortagemaster`,
  MANAGESHORTAGEMASTER_SORT: `${BASE_URL}/api/manageshortagemasterssort`,

  //attendance month status
  USER_ATT_MONTH_STATUS: `${BASE_URL}/api/userattmonthstatus`,
  USER_ATT_MONTH_STATUS_FILTER: `${BASE_URL}/api/userattmonthstatusfilter`,

  USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_DATEWISE: `${BASE_URL}/api/userclockinclockoutstatusfilterdatewise`,
  PENALTYAMOUNTCONSOLIDATED: `${BASE_URL}/api/allpenaltyamountconsolidate`,
  PENALTYAMOUNTCONSOLIDATED_CREATE: `${BASE_URL}/api/penaltyamountconsolidate/new`,
  PENALTYAMOUNTCONSOLIDATED_SINGLE: `${BASE_URL}/api/penaltyamountconsolidate`,
  FILTERED_PENALTYAMOUNTCONSOLIDATED: `${BASE_URL}/api/filterpenaltyamountconsolidated`,

  //Atendance Control Criteria
  SINGLE_ATTENDANCE_CONTROL_CRITERIA: `${BASE_URL}/api/singleattendancecontrolcriteria`,
  CREATE_ATTENDANCE_CONTROL_CRITERIA: `${BASE_URL}/api/createattendancecontrolcriteria`,
  GET_ATTENDANCE_CONTROL_CRITERIA: `${BASE_URL}/api/allattendancecontrolcriteria`,

  ATTENDANCE_STATUS: `${BASE_URL}/api/attendancestatus`,
  ATTENDANCE_STATUS_CREATE: `${BASE_URL}/api/attendancestatus/new`,
  ATTENDANCE_STATUS_SINGLE: `${BASE_URL}/api/attendancestatus`,

  ATTENDANCE_MODE_STATUS: `${BASE_URL}/api/allattendancemodestatus`,
  ATTENDANCE_MODE_STATUS_CREATE: `${BASE_URL}/api/attendancemodestatus/new`,
  ATTENDANCE_MODE_STATUS_SINGLE: `${BASE_URL}/api/attendancemodestatus`,

  //Department and designation grouping
  DEPARTMENTANDDESIGNATIONGROUPING: `${BASE_URL}/api/departmentanddesignationgroupings`,
  DEPARTMENTANDDESIGNATIONGROUPING_CREATE: `${BASE_URL}/api/departmentanddesignationgrouping/new`,
  DEPARTMENTANDDESIGNATIONGROUPING_SINGLE: `${BASE_URL}/api/departmentanddesignationgrouping`,

  // Assign Documents
  ALL_ASSIGNDOCUMENT: `${BASE_URL}/api/allassigndocument`,
  ASSIGNDOCUMENT_CREATE: `${BASE_URL}/api/assigndocument/new`,
  ASSIGNDOCUMENT_SINGLE: `${BASE_URL}/api/assigndocument`,

  //My Creation
  SINGLE_MYCREATION: `${BASE_URL}/api/singlemycreation`,
  CREATE_MYCREATION: `${BASE_URL}/api/createmycreation`,
  GET_MYCREATION: `${BASE_URL}/api/allmycreation`,

  //Task Designation Grouping team baseservice
  CREATE_TASKDESIGNATIONGROUPING: `${BASE_URL}/api/taskdesignationgrouping/new`,
  ALL_TASKDESIGNATIONGROUPING: `${BASE_URL}/api/taskdesignationgroupings`,
  SINGLE_TASKDESIGNATIONGROUPING: `${BASE_URL}/api/taskdesignationgrouping`,

  //DEPMONTHSETAUTO_ALL
  DEPMONTHSETAUTO_ALL: `${BASE_URL}/api/deptmonthsetautos`,
  DEPMONTHSETAUTO_CREATE: `${BASE_URL}/api/deptmonthsetauto/new`,
  DEPMONTHSETAUTO_SINGLE: `${BASE_URL}/api/deptmonthsetauto`,

  //Achieved Accuracy Individual
  ADDACHEIVEDACCURACYINDIVIDUAL: `${BASE_URL}/api/achievedaccuracyindividual/new`,
  GETACHEIVEDACCURACYINDIVIDUAL: `${BASE_URL}/api/achievedaccuracyindividual`,
  SINGLEACHEIVEDACCURACYINDIVIDUAL: `${BASE_URL}/api/achievedaccuracyindividual`,
  SINGLEACHEIVEDACCURACYINDIVIDUALUPLOAD: `${BASE_URL}/api/singleachievedaccuracyindividual`,

  //Production Individual
  PRODUCTION_INDIVIDUAL: `${BASE_URL}/api/productionindividuals`,
  PRODUCTION_INDIVIDUAL_DATEFILTER: `${BASE_URL}/api/productionindividualdatefilter`,
  PRODUCTION_INDIVIDUAL_LIMITED: `${BASE_URL}/api/productionindividuallimited`,
  PRODUCTION_INDIVIDUAL_CREATE: `${BASE_URL}/api/productionindividual/new`,
  PRODUCTION_INDIVIDUAL_SINGLE: `${BASE_URL}/api/productionindividual`,

  PRODUCTION_INDIVIDUAL_HIERARCHYFILTER: `${BASE_URL}/api/productionhierarchyfilter`,
  PRODUCTION_INDIVIDUAL_HIERARCHYFILTERANOTHER: `${BASE_URL}/api/getAllProductionHierarchyListanother`,
  PRODUCTION_INDIVIDUAL_SORT: `${BASE_URL}/api/productionindividualsort`,

  USER_ATT_MONTH_STATUS_FILTER_LIMITED: `${BASE_URL}/api/userattmonthstatusfilterlimited`,

  //penalty client error
  PENALTYCLIENTERROR: `${BASE_URL}/api/penaltyclienterror`,
  PENALTYCLIENTERROR_CREATE: `${BASE_URL}/api/penaltyclienterror/new`,
  PENALTYCLIENTERROR_SINGLE: `${BASE_URL}/api/penaltyclienterror`,

  // interview answer allot
  GET_INT_FORM_ALLOT: `${BASE_URL}/api/interviewanswerallots`,
  CREATE_INT_FORM_ALLOT: `${BASE_URL}/api/interviewanswerallot/new`,
  SINGLE_INT_FORM_ALLOT: `${BASE_URL}/api/interviewanswerallot`,

  ACHIEVEDACCURACYINDIVIDUALFILTER: `${BASE_URL}/api/acheivedaccuracyindividual`,

  //Task Designation Grouping team baseservice
  ALLMANUALALL_TASKFORUSER: `${BASE_URL}/api/allmanualtaskforusers`,
  SINGLE_TASKFORUSER: `${BASE_URL}/api/taskforuser`,
  ALL_TASKDESIGNATIONGROUPING_ACTIVE: `${BASE_URL}/api/taskdesignationgroupingsactive`,
  ALL_TASKFORUSER_REPORTS: `${BASE_URL}/api/taskforuserreports`,
  ALL_TASKFORUSER_REPORTS_OVERALL: `${BASE_URL}/api/taskforuserreportsoverall`,
  TASK_FOR_USER_AUTOGENERATE: `${BASE_URL}/api/taskforuserautogenerate`,
  ALL_TASK_HIERARCHY_REPORTS: `${BASE_URL}/api/taskhierarchyreports`,
  ALL_TRAINING_HIERARCHY_REPORTS: `${BASE_URL}/api/traininghierarchyreports`,
  ALL_MAINTENANCE_HIERARCHY_REPORTS: `${BASE_URL}/api/maintenancehierarchyreports`,
  TASK_FOR_USER_ASSIGNID: `${BASE_URL}/api/taskforuserassignuser`,
  MAINTENANCE_FOR_USER_ASSIGNID: `${BASE_URL}/api/maintenanceforuserassignuser`,
  TRAINING_FOR_USER_ASSIGNID: `${BASE_URL}/api/trainingforuserassignuser`,

  ACPOINTCALCULATION: `${BASE_URL}/api/acpointcalculation`,
  ACPOINTCALCULATION_CREATE: `${BASE_URL}/api/acpointcalculation/new`,
  ACPOINTCALCULATION_SINGLE: `${BASE_URL}/api/acpointcalculation`,
  ACPOINTCALCULATION_SORT: `${BASE_URL}/api/acpointcalculationsort`,

  PRODUCTION_TEMP_FILTER: `${BASE_URL}/api/productiontempfilter`,
  PRODUCTION_TEMP_REPORT_FILTER: `${BASE_URL}/api/productiontempreportfilter`,

  //CATEGORYDATECHANGE
  CATEGORYDATECHANGE: `${BASE_URL}/api/categorydatechange`,
  CATEGORYDATECHANGE_CREATE: `${BASE_URL}/api/categorydatechange/new`,
  CATEGORYDATECHANGE_SINGLE: `${BASE_URL}/api/categorydatechange`,
  CATEGORYDATECHANGE_SORT: `${BASE_URL}/api/categorydatechangesort`,

  //Task Non Schedule Grouping team baseservice
  CREATE_TASK_NONSCHEDULEGROUPING: `${BASE_URL}/api/tasknonschedulegrouping/new`,
  ALL_TASK_NONSCHEDULEGROUPING: `${BASE_URL}/api/tasknonschedulegroupings`,
  SINGLE_TASK_NONSCHEDULEGROUPING: `${BASE_URL}/api/tasknonschedulegrouping`,

  //payrun master 
  USER_PAYRUNDATA_LIMITED: `${BASE_URL}/api/userspayrundatalimited`,

  PENALTY_DAY_FILTERED: `${BASE_URL}/api/penaltydayuploadsfiltered`,

  USER_ATT_MONTH_STATUS_FILTER_PAYRUNMASTER: `${BASE_URL}/api/userattmonthstatusfilterpayrunmaster`,
  DAY_POINTS_MONTH_YEAR_FILTER: `${BASE_URL}/api/daypointsmonthwisefilter`,
  USERDELETELOGOBJECTS: `${BASE_URL}/api/deleteuserlogobjects`,
  PAIDSTATUSFIX_LIMITED: `${BASE_URL}/api/paidstatusfixslimited`,
  DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH: `${BASE_URL}/api/daypointsmonthwisefilternxtmonth`,
  ERAAMOUNTSLIMITED: `${BASE_URL}/api/eraamountslimited`,
  PAYRUNCONTROL_LIMITED: `${BASE_URL}/api/payruncontrolslimited`,

  PRODUCTION_UPLOAD_FILTER: `${BASE_URL}/api/productionuploadfilter`,
  PRODUCTION_REPORT_FILTER: `${BASE_URL}/api/productionreportfilter`,

  //LEAVETYPE
  LEAVETYPE: `${BASE_URL}/api/leavetype`,
  LEAVETYPE_CREATE: `${BASE_URL}/api/leavetype/new`,
  LEAVETYPE_SINGLE: `${BASE_URL}/api/leavetype`,

  INTERVIEWTESTMASTER: `${BASE_URL}/api/interviewtestmaster`,
  INTERVIEWTESTMASTER_CREATE: `${BASE_URL}/api/interviewtestmaster/new`,
  INTERVIEWTESTMASTER_SINGLE: `${BASE_URL}/api/interviewtestmaster`,

  COMPANYDOMAIN: `${BASE_URL}/api/companydomain`,
  COMPANYDOMAIN_CREATE: `${BASE_URL}/api/companydomain/new`,
  COMPANYDOMAIN_SINGLE: `${BASE_URL}/api/companydomain`,


  //WAVIERPERCENTAGE
  WAVIERPERCENTAGE: `${BASE_URL}/api/wavierpercentage`,
  WAVIERPERCENTAGE_CREATE: `${BASE_URL}/api/wavierpercentage/new`,
  WAVIERPERCENTAGE_SINGLE: `${BASE_URL}/api/wavierpercentage`,

  PRODUCTION_UNALLOT_FILTER: `${BASE_URL}/api/productionunallotfilter`,
  PRODUCTION_UNALLOT_FILTER_VIEW: `${BASE_URL}/api/productionunallotfilterview`,
  PRODUCTION_UNALLOT_FILTER_VIEW_Manual: `${BASE_URL}/api/productionunallotfilterviewmanual`,

  PRODUCTION_UNALLOT_FILTER_TEMP: `${BASE_URL}/api/productiontempunallotfiltertemp`,
  PRODUCTION_UNALLOT_FILTER_VIEW_TEMP: `${BASE_URL}/api/productiontempviewfilter`,
  PRODUCTION_UNALLOT_FILTER_VIEW_TEMP_MANUAL: `${BASE_URL}/api/productiontempviewmanualfilter`,

  //NONPRODUCTION
  NONPRODUCTION: `${BASE_URL}/api/nonproduction`,
  NONPRODUCTION_CREATE: `${BASE_URL}/api/nonproduction/new`,
  NONPRODUCTION_SINGLE: `${BASE_URL}/api/nonproduction`,
  GETFILTERDATA: `${BASE_URL}/api/nonproductionfilter`,

  INTERVIEW_LOGIN: `${BASE_URL}/api/interviewlogin`,
  UPDATE_INTERVIEWROUNDSTATUS: `${BASE_URL}/api/updateinterviewrounddata`,
  DELETE_INTERVIEWROUND: `${BASE_URL}/api/deleteinterviewround`,
  CANDIDATE_SCREENING: `${BASE_URL}/api/canidatescreening`,

  //payrun calculation
  USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER_FINALSALARY: `${BASE_URL}/api/userclockinclockoutstatusformontlopcalfilterfinalsalary`,
  USER_PAYRUNDATA_LIMITED_FINAL: `${BASE_URL}/api/userspayrundatalimitedfinal`,
  SHIFTS_LIMITED: `${BASE_URL}/api/shiftslimited`,
  USERS_LIMITED_DROPDOWN_FINALSALARY: `${BASE_URL}/api/userslimitedfinalsalary`,
  USER_ATT_MONTH_STATUS_FILTER_LIMITED_MINPOINTS: `${BASE_URL}/api/userclockinclockoutstatusformontlopcalfilterminpointsnew`,
  USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER_PAYRUN_MASTER_FETCH: `${BASE_URL}/api/userclockinclockoutstatusformontlopcalfilterpayrunmasterfetch`,

  //user leave corrections
  USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE: `${BASE_URL}/api/userclockinclockoutstatusleave`,
  USER_CLOCKIN_CLOCKOUT_STATUS_LOGIN: `${BASE_URL}/api/userclockinclockoutstatuslogin`,
  SUBCATEGORYPROD_LIMITED: `${BASE_URL}/api/subcategoryprodlimited`,
  PRODUCTION_UNITRATE_PRODUPLOAD_LIMITED: `${BASE_URL}/api/productionunitrateproduploadlimited`,

  //Overall Tickets Edit
  OVERALL_SUBSUBCOMPONENT_TICKET: `${BASE_URL}/api/overalleditsubsubcomponent`,
  OVERALL_TYPEMASTER_TICKET: `${BASE_URL}/api/overalledittypemasters`,
  OVERALL_REASONMASTER_TICKET: `${BASE_URL}/api/overalleditreasonmasters`,
  OVERALL_RESOLVER_REASONMASTER_TICKET: `${BASE_URL}/api/overalleditresolverreasonmasters`,
  OVERALL_CATEGORY_TICKET: `${BASE_URL}/api/overalleditcategorymasters`,
  OVERALL_PRIORITY_TICKET: `${BASE_URL}/api/overalleditprioritymasters`,
  OVERALL_DUEDATE_TICKET: `${BASE_URL}/api/overalleditduedatemasters`,
  OVERALL_TYPEGROUP_TICKET: `${BASE_URL}/api/overalledittypegroupmasters`,

  //Overall Tickets Delete
  OVERALL_REASONMASTER_TICKET_DELETE: `${BASE_URL}/api/overalleditreasonmastersdelete`,
  OVERALL_TYPEMASTER_TICKET_DELETE: `${BASE_URL}/api/overalledittypemastersdelete`,
  OVERALL_SUBSUBCOMPONENT_TICKET_DELETE: `${BASE_URL}/api/overallsubsubcomponentdelete`,
  OVERALL_RESOLVER_REASONMASTER_TICKET_DELETE: `${BASE_URL}/api/overallresolverreasonmastersdelete`,
  OVERALL_CATEGORY_TICKET_DELETE: `${BASE_URL}/api/overalldeletecategorymasters`,
  OVERALL_SELFCHECK_TICKET_DELETE: `${BASE_URL}/api/overalldeleteselfcheckmasters`,
  OVERALL_REQUIRED_TICKET_DELETE: `${BASE_URL}/api/overalldeleterequiredmasters`,
  OVERALL_PRIORITY_TICKET_DELETE: `${BASE_URL}/api/overalldeleteprioritymasters`,
  OVERALL_DUEDATE_TICKET_DELETE: `${BASE_URL}/api/overalldeleteduedatemasters`,
  OVERALL_TYPEGROUP_TICKET_DELETE: `${BASE_URL}/api/overalldeletetypegroupmasters`,

  OVERALL_BULK_RESOLVER_REASONMASTER_TICKET_DELETE: `${BASE_URL}/api/overallBulkresolverreasonmastersdelete`,
  OVERALL_BULK_SUBSUBCOMPONENT_TICKET_DELETE: `${BASE_URL}/api/overallBulksubsubcomponentdelete`,
  OVERALL_BULK_PRIORITY_MASTER_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeleteprioritymasters`,
  OVERALL_BULK_REQUIRED_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeleterequiredmasters`,
  OVERALL_BULK_DUEDATE_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeleteduedatemasters`,
  OVERALL_BULK_SELFCHECK_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeleteselfcheckmasters`,
  OVERALL_BULK_CATEGORY_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeletecategorymasters`,
  OVERALL_BULK_TYPEGROUP_TICKET_DELETE: `${BASE_URL}/api/overallBulkdeletetypegroupmasters`,
  OVERALL_BULK_TYPEMASTER_TICKET_DELETE: `${BASE_URL}/api/overalleditBulktypemastersdelete`,
  OVERALL_BULK_REASONMASTER_TICKET_DELETE: `${BASE_URL}/api/overallBulkreasonmastersdelete`,

  //AutoLogout
  SINGLE_AUTOLOGOUT: `${BASE_URL}/api/singleautologout`,
  CREATE_AUTOLOGOUT: `${BASE_URL}/api/createautologout`,
  GET_AUTOLOGOUT: `${BASE_URL}/api/allautologout`,

  //AssetMaterial IP Master
  ASSETMATERIALIP: `${BASE_URL}/api/assetmaterialips`,
  ASSETMATERIALIP_CREATE: `${BASE_URL}/api/assetmaterialip/new`,
  ASSETMATERIALIP_SINGLE: `${BASE_URL}/api/assetmaterialip`,

  //AssetWork Group  Master
  ASSETWORKSTATIONGROUP: `${BASE_URL}/api/assetworkgrps`,
  ASSETWORKSTATIONGROUP_CREATE: `${BASE_URL}/api/assetworkgrp/new`,
  ASSETWORKSTATIONGROUP_SINGLE: `${BASE_URL}/api/assetworkgrp`,

  // Leave Verification
  LEAVEVERIFICATION: `${BASE_URL}/api/leaveverifications`,
  LEAVEVERIFICATION_CREATE: `${BASE_URL}/api/leaveverification/new`,
  LEAVEVERIFICATION_SINGLE: `${BASE_URL}/api/leaveverification`,
  APPLYLEAVE_FILTERED: `${BASE_URL}/api/applyleavesfilter`,

  // schedule payment master
  NEW_SCHEDULEPAYMENTMASTER: `${BASE_URL}/api/schedulepaymentmaster/new`,
  ALL_SCHEDULEPAYMENTMASTER: `${BASE_URL}/api/allschedulepaymentmasters`,
  SINGLE_SCHEDULEPAYMENTMASTER: `${BASE_URL}/api/schedulepaymentmaster`,

  // schedule payment master
  NEW_SCHEDULEPAYMENT_NOTADDEDBILLS: `${BASE_URL}/api/schedulepaymentnotaddedbills/new`,
  ALL_SCHEDULEPAYMENT_NOTADDEDBILLS: `${BASE_URL}/api/allschedulepaymentnotaddedbills`,
  SINGLE_SCHEDULEPAYMENT_NOTADDEDBILLS: `${BASE_URL}/api/schedulepaymentnotaddedbills`,
  IGNORED_SCHEDULEPAYMENT_NOTADDEDBILLS: `${BASE_URL}/api/ignorednotaddedbills`,
  NOTADDED_SCHEDULEPAYMENT_NOTADDEDBILLS: `${BASE_URL}/api/notaddednotaddedbills`,


  //assetproblemmaster  
  ASSETPROBLEMMASTER: `${BASE_URL}/api/assetproblemmaster`,
  ASSETPROBLEMMASTER_CREATE: `${BASE_URL}/api/assetproblemmaster/new`,
  ASSETPROBLEMMASTER_SINGLE: `${BASE_URL}/api/assetproblemmaster`,

  ASSETDETAIL_REPAIR_LIMITED: `${BASE_URL}/api/assetdetailsrepairfilter`,
  ASSETDETAIL_REPAIRED: `${BASE_URL}/api/repairedasset`,
  ASSETDETAIL_DAMAGED: `${BASE_URL}/api/damagedasset`,

  CREATE_TASK_MAINTENANCE_NONSCHEDULEGROUPING: `${BASE_URL}/api/taskmaintenancenonschedulegrouping/new`,
  ALL_TASK_MAINTENANCE_NONSCHEDULEGROUPING: `${BASE_URL}/api/taskmaintenancenonschedulegroupings`,
  SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING: `${BASE_URL}/api/taskmaintenancenonschedulegrouping`,

  //

  CREATE_TASKMAINTENACEFORUSER: `${BASE_URL}/api/taskmaintenanceforusers/new`,
  ALL_TASKMAINTENACEFORUSER: `${BASE_URL}/api/taskmaintenanceforusers`,
  ALL_SORTED_TASKMAINTENACEFORUSER: `${BASE_URL}/api/sortedtaskmaintenanceforusers`,
  SINGLE_TASKMAINTENACEFORUSER: `${BASE_URL}/api/taskmaintenanceforusers`,
  ALL_TASKMAINTENACEFORUSER_REPORTS: `${BASE_URL}/api/taskmaintenanceforusersreports`,
  ALL_TASKMAINTENACEFORUSER_AUTOGENERATE: `${BASE_URL}/api/taskmaintenanceautogenerate`,
  TASKMAINTENACEFORUSER_AUTOGENERATE: `${BASE_URL}/api/taskmaintenanceforusersautogenerate`,
  ALL_TASKMAINTENACEFORUSER_ONPROGRESS: `${BASE_URL}/api/taskmaintenanceonprogress`,
  ALL_TASKMAINTENACEFORUSER_COMPLETED: `${BASE_URL}/api/taskmaintenancecompleted`,

  TEMPMISMATCHFILTER: `${BASE_URL}/api/tempmismatchfilter`,
  TEMPMISMATCHUPDATEFLAGCOUNT: `${BASE_URL}/api/tempmismatchfilter/updateflagcount`,
  TEMPUNMATCHFILTER: `${BASE_URL}/api/tempmismatchfilter`,

  ORIGINALMISMATCHFILTER: `${BASE_URL}/api/originalmismatchfilter`,
  ORIGINALMISMATCHUPDATEFLAGCOUNT: `${BASE_URL}/api/originalmismatchfilter/updateflagcount`,
  ORIGINALUNMATCHFILTER: `${BASE_URL}/api/originalunmatchfilter`,

  //ADVANCE  
  ADVANCE: `${BASE_URL}/api/advance`,
  ADVANCE_CREATE: `${BASE_URL}/api/advance/new`,
  ADVANCE_SINGLE: `${BASE_URL}/api/advance`,

  CANDIDATESALLBYRESTRICTION: `${BASE_URL}/api/candidatesbyrestricted`,

  INTERVIEWQUESTIONGROUPING_FILTER: `${BASE_URL}/api/interviewquestiongroupingsfilter`,

  STOCKPURCHASELIMITED_HAND: `${BASE_URL}/api/stockpurchaselimitedhand`,
  STOCKPURCHASELIMITED_RETURN: `${BASE_URL}/api/stockpurchaselimitedreturn`,
  USERHANDOVER_LIMITED: `${BASE_URL}/api/userhandoverlimited`,
  STOCKPURCHASE_TRANSFER_LIMITED: `${BASE_URL}/api/stockpurchaselimitedtransfer`,
  STOCKPURCHASE_TRANSFER_LOG_LIMITED: `${BASE_URL}/api/stockpurchaselimitedtransferlog`,
  ASSET_LOG_LIMITED: `${BASE_URL}/api/assetdetaillog`,
  STOCKPURCHASELIMITED_HAND_RETURN: `${BASE_URL}/api/stockpurchaselimitedhandreturn`,
  STOCKPURCHASELIMITED_HAND_TODO: `${BASE_URL}/api/stockpurchaselimitedhandtodo`,
  STOCKPURCHASELIMITED_HAND_TODO_RETURN: `${BASE_URL}/api/stockpurchaselimitedhandtodoreturn`,

  ASSETDETAIL_SINGLE_REPAIR: `${BASE_URL}/api/assetdetailsinglerepair`,

  // manual Stock entry details
  MANUAL_STOCKPURCHASE: `${BASE_URL}/api/manualstocks`,
  MANUAL_STOCKPURCHASE_CREATE: `${BASE_URL}/api/manualstock/new`,
  MANUAL_STOCKPURCHASE_SINGLE: `${BASE_URL}/api/manualstock`,
  //GetFilteredRemoteUser
  GETFILTEREMOTEUSER: `${BASE_URL}/api/getfilterremoteuser`,


  PRODUCTION_UNITRATE_FILTER_LIMITED: `${BASE_URL}/api/unitratefilterlimited`,
  PRODUCTION_UNITRATE_FILTER_CATEGORY_LIMITED: `${BASE_URL}/api/unitratefiltercategorylimited`,
  PRODUCTION_UNITRATE_FILTER_CATEGORIES_LIMITED: `${BASE_URL}/api/unitratefiltercategorieslimited`,
  CLIENTUSERID_LIMITED: `${BASE_URL}/api/clientuseridslimited`,

  // Checklistverificationmaster  details
  CHECKLISTVERIFICATIONMASTER: `${BASE_URL}/api/checklistverificationmasters`,
  CHECKLISTVERIFICATIONMASTER_CREATE: `${BASE_URL}/api/checklistverificationmaster/new`,
  CHECKLISTVERIFICATIONMASTER_SINGLE: `${BASE_URL}/api/checklistverificationmaster`,


  //LOAN  
  LOAN: `${BASE_URL}/api/loan`,
  LOAN_CREATE: `${BASE_URL}/api/loan/new`,
  LOAN_SINGLE: `${BASE_URL}/api/loan`,


  //Training Designation Grouping team baseservice
  CREATE_TRAINING_FOR_USER: `${BASE_URL}/api/trainingforuser/new`,
  ALL_TRAINING_FOR_USER: `${BASE_URL}/api/trainingforusers`,
  ALL_TRAINING_FOR_USER_POSTPONED: `${BASE_URL}/api/trainingforuserspostponed`,
  ALL_TRAINING_FOR_USER_ONPROGRESS: `${BASE_URL}/api/trainingforusersonprogress`,
  ALL_TRAINING_FOR_USER_COMPLETED: `${BASE_URL}/api/trainingforuserscompleted`,
  SINGLE_TRAINING_FOR_USER: `${BASE_URL}/api/trainingforuser`,
  ALL_SORTED_TRAININGFORUSER: `${BASE_URL}/api/sortedtrainingforusers`,
  ALL_TRAINIGFORUSER_REPORTS: `${BASE_URL}/api/trainingforuserreports`,
  ALL_TRAINIGFORUSER_REPORTS_OVERALL: `${BASE_URL}/api/trainingforuserreportsoverall`,
  //OnlineTest
  CREATE_ONLINE_TEST_QUESTION: `${BASE_URL}/api/onlinetestquestion/new`,
  ALL_ONLINE_TEST_QUESTION: `${BASE_URL}/api/onlinetestquestions`,
  SINGLE_ONLINE_TEST_QUESTION: `${BASE_URL}/api/onlinetestquestion`,



  //OnlineTestMaster
  CREATE_ONLINE_TEST_MASTER: `${BASE_URL}/api/onlinetestmaster/new`,
  ALL_ONLINE_TEST_MASTER: `${BASE_URL}/api/onlinetestmasters`,
  SINGLE_ONLINE_TEST_MASTER: `${BASE_URL}/api/onlinetestmaster`,

  //Training User Responses baseservice
  CREATE_TRAINING_USER_RESPONSE: `${BASE_URL}/api/createusertrainingresponse/new`,
  ALL_TRAINING_USER_RESPONSE: `${BASE_URL}/api/usertrainingresponses`,
  SINGLE_TRAINING_USER_RESPONSE: `${BASE_URL}/api/usertrainingresponse`,

  //Task Designation Grouping team baseservice
  CREATE_TASKFORUSER: `${BASE_URL}/api/taskforuser/new`,
  ALL_TASKFORUSER: `${BASE_URL}/api/taskforusers`,
  ALL_TASKFORUSER_MANUAL: `${BASE_URL}/api/taskforusersmanuual`,
  ALL_TASKFORUSER_ONPROGRESS: `${BASE_URL}/api/taskforusersonprogress`,
  ALL_TASKFORUSER_COMPLETED: `${BASE_URL}/api/taskforuserscompleted`,
  ALL_SORTED_TASKFORUSER: `${BASE_URL}/api/sortedtasksforusers`,

  MANUALALL_TASKFORUSER: `${BASE_URL}/api/manualtaskforusers`,
  ONPROGRESSALL_TASKFORUSER: `${BASE_URL}/api/onprogresstaskforusers`,
  COMPLETEDALL_TASKFORUSER: `${BASE_URL}/api/completedtaskforusers`,
  INDIVIDUALALL_TASKFORUSER: `${BASE_URL}/api/individualtaskforusers`,



  // training details order 
  ALL_TRAININGDETAILS: `${BASE_URL}/api/trainingdetailss`,
  ALL_TRAININGDETAILS_DOCUMENT: `${BASE_URL}/api/trainingdetailsdocument`,
  CREATE_TRAININGDETAILS: `${BASE_URL}/api/trainingdetails/new`,
  SINGLE_TRAININGDETAILS: `${BASE_URL}/api/trainingdetails`,
  ALL_TRAININGDETAILS_DOCUMENT_ACTIVE: `${BASE_URL}/api/trainingdetailsdocumentactive`,
  ALL_TASKFORUSER_USERNAME: `${BASE_URL}/api/taskforusersusername`,

  // Asset details
  ADDTOPRINTQUEUE: `${BASE_URL}/api/addtoprintqueues`,
  ADDTOPRINTQUEUE_LIMIT: `${BASE_URL}/api/addtoprintqueueslimit`,
  ADDTOPRINTQUEUE_LIMIT_PRINT: `${BASE_URL}/api/addtoprintqueueslimitprint`,
  ADDTOPRINTQUEUEFILTER: `${BASE_URL}/api/addtoprintqueuefilter`,
  ADDTOPRINTQUEUE_CREATE: `${BASE_URL}/api/addtoprintqueue/new`,
  ADDTOPRINTQUEUE_SINGLE: `${BASE_URL}/api/addtoprintqueue`,
  ALLDATATO_ADDTOPRINTQUEUE: `${BASE_URL}/api/alldatatoaddtoprintqueue`,

  INTERVIEW_ROUND: `${BASE_URL}/api/fetchinterviewround`,

  USER_PROD: `${BASE_URL}/api/usersprod`,
  PRODUCTION_UPLOAD_GET_UNITRATEUPDATE_OVERALL_FETCH_LIMITED: `${BASE_URL}/api/productionuploadunitrateoverallfetchlimited`,
  PRODUCTION_UNITRATE_LIMITED_PROD: `${BASE_URL}/api/unitrateprodlimited`,
  CATEGORYPROD_LIMITED: `${BASE_URL}/api/categoryprodlimited`,

  // LABELNAME
  LABELNAME: `${BASE_URL}/api/labelname`,
  LABELNAME_CREATE: `${BASE_URL}/api/labelname/new`,
  LABELNAME_SINGLE: `${BASE_URL}/api/labelname`,

  MYCHECKLIST: `${BASE_URL}/api/mychecklist`,
  MYCHECKLIST_CREATE: `${BASE_URL}/api/mychecklist/new`,
  MYCHECKLIST_SINGLE: `${BASE_URL}/api/mychecklist`,
  MYCHECKLIST_SINGLEBYOBJECTID: `${BASE_URL}/api/mychecklist/usingobjectid`,

  ALL_PROCESS_AND_TEAM_FILTER_LIMITED: `${BASE_URL}/api/processteamfilterlimited`,

  //production day
  PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY: `${BASE_URL}/api/productiondaygetsingledatedataday`,
  DEPTMONTHSET_PROD_LIMITED: `${BASE_URL}/api/departmentmonthsetsprodlimited`,
  CATEGORYPROCESSMAP_LIMITED: `${BASE_URL}/api/categoryprocessmapslimited`,


  USER_BOARDINGLOG_UPDATE: `${BASE_URL}/api/boardinglogupdate`,

  UNITCATSUBCATEGORYPROD: `${BASE_URL}/api/unitratecatsubprod`,


  // Resumemailattachments details
  RESUMEMAILATTACHMENTS: `${BASE_URL}/api/resumemailattachments`,
  RESUMEMAILATTACHMENTS_CREATE: `${BASE_URL}/api/resumemailattachments/new`,
  RESUMEMAILATTACHMENTS_SINGLE: `${BASE_URL}/api/resumemailattachments`,

  SALARY_FIX_FILTER: `${BASE_URL}/api/salaryfixfilter`,

  //vendor grouping
  ADD_VENDORGROUPING: `${BASE_URL}/api/vendorgrouping/new`,
  ALL_VENDORGROUPING: `${BASE_URL}/api/vendorgrouping`,
  SINGLE_VENDORGROUPING: `${BASE_URL}/api/singlevendorgrouping`,

  INTERVIEWROUNDORDER_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewroundorder`,
  INTERVIEWROUNDORDER_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewroundorder`,

  INTERVIEWQUESTIONSORDER_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewquestionorder`,
  INTERVIEWQUESTIONSORDER_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewquestionorder`,

  INTERVIEWANSWERALLOT_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewanswerallot`,
  INTERVIEWANSWERALLOT_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewanswerallot`,

  INTERVIEWSTATUSALLOT_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewstatusallot`,
  INTERVIEWSTATUSALLOT_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewstatusallot`,

  INTERVIEWQUESTIONGROUPING_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewquestiongrouping`,
  INTERVIEWQUESTIONGROUPING_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewquestiongrouping`,


  INTERVIEWQUESTION_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewquestions`,
  INTERVIEWQUESTION_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewquestions`,
  INTERVIEWQUESTION_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewquestions`,


  INTERVIEWTESTMASTER_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewtestmaster`,
  INTERVIEWTESTMASTER_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewtestmaster`,
  INTERVIEWTESTMASTER_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewtestmaster`,

  INTERVIEWTYPEMASTER_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewtypemaster`,
  INTERVIEWTYPEMASTER_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewtypemaster`,
  INTERVIEWTYPEMASTER_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewtypemaster`,

  ROUNDMASTER_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewroundmaster`,
  ROUNDMASTER_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewroundmaster`,
  ROUNDMASTER_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewroundmaster`,

  CATEGORYINTERVIEW_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewcategory`,
  CATEGORYINTERVIEW_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/interviewcategory`,
  CATEGORYINTERVIEW_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/interviewcategory`,


  //PRODUCTIONDAY
  PRODUCTION_DAYS: `${BASE_URL}/api/productiondays`,
  PRODUCTION_DAY_CREATE: `${BASE_URL}/api/productionday/new`,
  PRODUCTION_DAY_SINGLE: `${BASE_URL}/api/productionday`,
  PRODUCTION_DAY_UNIQID: `${BASE_URL}/api/productiondaysuniqid`,
  //PRODUCTIONDAYLIST
  PRODUCTION_DAYS_LIST: `${BASE_URL}/api/productiondaylists`,
  PRODUCTION_DAY_LIST_CREATE: `${BASE_URL}/api/productiondaylist/new`,
  PRODUCTION_DAY_LIST_SINGLE: `${BASE_URL}/api/productiondaylist`,
  PRODUCTION_DAY_LIST_GET_DELETE_LIMITED: `${BASE_URL}/api/productiondaylistgetdeletelimited`,
  PRODUCTION_DAY_LIST_GET_VIEW_LIMITED: `${BASE_URL}/api/productiondaylistgetviewlimited`,
  PRODUCTION_DAY_LIST_DELETE_UNIQID: `${BASE_URL}/api/productiondaylistdeleteuniqud`,
  PRODUCTION_DAYS_GETLIST_BY_DATE: `${BASE_URL}/api/productiondaylistsgetbydate`,
  GET_LOGINALLOT_ID_DETAILS: `${BASE_URL}/api/getloginallotiddetails`,
  GET_DAY_POINTS_LIMITED: `${BASE_URL}/api/daypointslimited`,
  CHECK_ZERO_MISMATCH_PRESENT: `${BASE_URL}/api/checkzeromismatchpresent`,
  GET_PRODUCTION_SINGLE_DAYUSER: `${BASE_URL}/api/getproductionsignledayuser`,

  OVERALL_TASK_CATEGORY_TICKET: `${BASE_URL}/api/taskcategoryOverallEdit`,
  OVERALL_TASK_CATEGORY_TICKET_DELETE: `${BASE_URL}/api/taskcategoryOverallDelete`,
  OVERALL_TASK_SUBCATEGORY_TICKET: `${BASE_URL}/api/tasksubcategoryOverallEdit`,
  OVERALL_TASK_SUBCATEGORY_TICKET_DELETE: `${BASE_URL}/api/tasksubcategoryOverallDelete`,
  RAISETICKET_REPORT_OVERALL: `${BASE_URL}/api/raiseticketsreportsoverall`,
  OVERALL_TRAINING_CATEGORY_TICKET: `${BASE_URL}/api/trainingcategoryOverallEdit`,
  OVERALL_TRAINING_OVERALL_CATEGORY_TICKET: `${BASE_URL}/api/trainingcategoryOverallDelete`,
  OVERALL_TRAINING_SUBCATEGORY_TICKET: `${BASE_URL}/api/trainingsubcategoryOverallEdit`,
  OVERALL_TRAINING_SUBOVERALL_CATEGORY_TICKET: `${BASE_URL}/api/trainingsubcategoryOverallDelete`,
  OVERALL_TRAINING_DETAILS_EDIT: `${BASE_URL}/api/trainingDetailsOverallEdit`,
  ALL_DOCUMENT_TRAINING: `${BASE_URL}/api/documentstraining`,
  ALLINTERVIEWQUESTION: `${BASE_URL}/api/allinterviewquestions`,
  INTERVIEWTYPINGQUESTION: `${BASE_URL}/api/allinterviewtypingquestions`,
  GET_DAY_POINTS_LIMITED_DATE: `${BASE_URL}/api/checkdaypointdate`,
  PRODUCTION_UNITRATE_FILTER_GETMULTI: `${BASE_URL}/api/getprodunitrategetmulti`,

  ALLUSERSWITHOUTSTATUS: `${BASE_URL}/api/userswithoutstatus`,

  FIND_ATTANDANCESTATUS: `${BASE_URL}/api/findattendance`,

  ANNOUNCEMENTCATEGORY_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/announcementcategory`,
  ANNOUNCEMENTCATEGORY_OVERALLDELETE: ` ${BASE_URL}/api/overalldelete/announcementcategory`,
  ANNOUNCEMENTCATEGORY_OVERALLBULKDELETE: ` ${BASE_URL}/api/overallbulkdelete/announcementcategory`,


  ORGCATEGORYDOCUMENT_OVERALLBULKDELETE: `${BASE_URL}/api/overallbulkdelete/organizationcategory`,

  GETDOCUMENTS: `${BASE_URL}/api/employeedocumentcommonid`,
  GETPROFILES: `${BASE_URL}/api/employeeprofile`,
  SUBCATEGORYPROD_LIST_LIMITED: `${BASE_URL}/api/getlistsubcategoryprodlimited`,

  //Document Preparation baseservice
  CREATE_CARD_PREPARATION: `${BASE_URL}/api/cardpreparation/new`,
  ALL_CARDPREPARATION: `${BASE_URL}/api/cardpreparations`,
  SINGLE_CARDPREPARATION: `${BASE_URL}/api/cardpreparation`,

  OVERALL_DELETE_IPCATEGORY: `${BASE_URL}/api/ipcategorieoveralldelete`,
  OVERALL_EDIT_IPCATEGORY: `${BASE_URL}/api/ipcategorieoveralledit`,


  OVERALL_EDIT_PASSWORDCATEGORY: `${BASE_URL}/api/passwordcategoryedit`,
  OVERALL_DELETE_PASSWORDCATEGORY: `${BASE_URL}/api/passwordcategorydelete`,
  OVERALL_DELETE_PASSWORDIPMASTER: `${BASE_URL}/api/overalldeleteip`,


  OVERALL_DELETE_EBUSEINSTRUMENT: `${BASE_URL}/api/ebuseinstrumentoveralldelete`,
  OVERALL_DELETE_EBREADING: `${BASE_URL}/api/ebreadingdetailoveralldelete`,
  OVERALL_DELETE_EBMATERIAL: `${BASE_URL}/api/ebmaterialdetailoverlldelte`,
  OVERALL_EDIT_EBSERVICEMASTER: `${BASE_URL}/api/ebservicemastersoveralledit`,


  OVERALL_EDIT_POWERSTATION: `${BASE_URL}/api/powerstationoveralledit`,
  OVERALL_DELETE_POWERSTATION: `${BASE_URL}/api/powerstationoveralldelete`,

  EB_READING_DATACOUNT: `${BASE_URL}/api/ebreadingdatacount`,

  // Candidate Document details
  CANDIDATEDOCUMENT: `${BASE_URL}/api/candidatedocuments`,
  CANDIDATEDOCUMENT_CREATE: `${BASE_URL}/api/candidatedocument/new`,
  CANDIDATEDOCUMENT_SINGLE: `${BASE_URL}/api/candidatedocument`,
  ORIGINALUNMATCHFILTERCOUNTCHECK: `${BASE_URL}/api/originalunmatchfiltercountcheck`,

  GET_MISMATCH_UPDATEDLIST: `${BASE_URL}/api/getmismatchupdatedlist`,
  UPDATE_UNDO_FIELDNAME: `${BASE_URL}/api/updatefieldundoname`,

  GETDEPARTMENTMONTHSETBYPAGINATION: `${BASE_URL}/api/departmentmonthsetspaginationlimited`,
  GETDESIGNATIONMONTHSETBYPAGINATION: `${BASE_URL}/api/designationmonthsetspaginationlimited`,
  GETPROCESSMONTHSETBYPAGINATION: `${BASE_URL}/api/processmonthsetspaginationlimited`,
  GETDEPARTMENTMONTHSETAUTOBYPAGINATION: `${BASE_URL}/api/deptmonthsetautobypagination`,

  OVERALLSORT_EBREADING: `${BASE_URL}/api/ebreadingdetailpagenationsort`,

  RESUMEMANAGEMENT_CANDIDATE_SORT: ` ${BASE_URL}/api/resumemanagementsortedcandidates`,
  RESUMEMANAGEMENT_CANDIDATE_FILTERED: ` ${BASE_URL}/api/resumemanagementfilteredcandidates`,
  CANDIDATEFILEUPLOAD_LINK: ` ${BASE_URL}/api/candidatefileuploadusinglink`,

  SKIPPED_CANDIDATES: ` ${BASE_URL}/api/skippedcandidates`,

  SKIPPED_INTERVIEWQUESTIONS: ` ${BASE_URL}/api/skippedinterviewquestions`,

  INTERVIEWMAIL_SENT: `${BASE_URL}/api/interviewmail`,
  SKIPPED_VISITORS: `${BASE_URL}/api/skippedvisitors`,
  SKIPPEDALL_VISITORS: `${BASE_URL}/api/skippedallvisitors`,
  SKIPPED_RAISEPROBLEM: `${BASE_URL}/api/skippedraiseproblem`,

  ALL_MANAGEASSIGNED_SORT: `${BASE_URL}/api/manageassignedsort`,
  ACHEIVEDACCURACYINDIVIDUAL_SORT: `${BASE_URL}/api/achievedaccuracyindividualsort`,

  ALL_SALARYSLAB_SORT: `${BASE_URL}/api/salaryslabprocessfiltersort`,
  ALL_ACCURACYMASTER: `${BASE_URL}/api/accuracymastersort`,

  ALL_ACCURACYQUEUEGROUPING_SORT: `${BASE_URL}/api/accuracyqueuegroupingsort`,
  ALL_EXPECTEDACCURACYMASTER: `${BASE_URL}/api/expectedaccuracysort`,
  ACHEIVEDACCURACYGETALL_SORT: `${BASE_URL}/api/acheivedaccuracysort`,

  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION: `${BASE_URL}/api/updatedbulkdatasunitandsection`,

  MAINTENTANCE_ACTIVE: `${BASE_URL}/api/maintentancesactive`,

  DEPTMONTHSET_LIMITED_WITH_DEPT: `${BASE_URL}/api/departmentmonthsetslimitedforleave`,
  PRODUCTION_UPLOAD_CHECKSTATUS: `${BASE_URL}/api/productionuploadcheckstatus`,
  GET_MISMATCH_DATAS_ID: `${BASE_URL}/api/getmismatchdatasid`,
  PRODUCTION_UPLOAD_GETDATAS_BYID: `${BASE_URL}/api/getproductionuploaddatasbyid`,
  PRODUCTION_UPLOAD_GETDATAS_BYID_MANUAL: `${BASE_URL}/api/getproductionuploaddatasbyidmanual`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG: `${BASE_URL}/api/updatedbulkdatasunitandflag`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY: `${BASE_URL}/api/updatedbulkdatasunitonly`,
  PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY: `${BASE_URL}/api/updatedbulkdatasflagonly`,

  // /Weekoff present details
  WEEKOFFPRESENT: `${BASE_URL}/api/weekoffpresents`,
  WEEKOFFPRESENT_CREATE: `${BASE_URL}/api/weekoffpresent/new`,
  WEEKOFFPRESENT_SINGLE: `${BASE_URL}/api/weekoffpresent`,
  WEEKOFFPRESENT_FILTER: `${BASE_URL}/api/weekoffpresentfilter`,
  LEAVECRITERIA_FOR_APPLY_LEAVE: `${BASE_URL}/api/leavecriteriaforapplyleave`,
  NOTICEPERIODAPPLY_FOR_LEAVE: `${BASE_URL}/api/noticeperiodappliesforleave`,
  ATTENDANCE_ID_FILTER: `${BASE_URL}/api/attandanceidfilter`,

  // expenses
  SKIPPEDEXPENSES: `${BASE_URL}/api/skippedexpenses`,
  SKIPPEDINCOME: `${BASE_URL}/api/skippedincomes`,
  SKIPPEDOTHERPAYMENTS: `${BASE_URL}/api/skippedotherpayment`,

  APPLYLEAVE_APPROVED: `${BASE_URL}/api/applyleavesapproved`,
  ASSETMATERIALIP_LIMITED: `${BASE_URL}/api/assetmaterialipslimited`,
  USERNEW: `${BASE_URL}/api/usersnew`,
  GETSINGLEUSERBRANCH: `${BASE_URL}/api/singleassignbranch`,
  //Employee Documents
  EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONIDONE: `${BASE_URL}/api/employeedocumentcommonidwithallnew`,
  CHECKUNITRATE_MANUAL_CREATION: `${BASE_URL}/api/checkunitrateformanualcreation`,
  CHECKSUBCATEGORY_MANUAL_CREATION: `${BASE_URL}/api/checksubcategoryformanualcreation`,
  SUBCATEGORYPROD_LIST_LIMITED_PAGINATION: `${BASE_URL}/api/getlistsubcategoryprodlimitedpagination`,
  OVERALLACHEIVEDACCURACYINDIVIDUAL_SORT: `${BASE_URL}/api/overallachievedaccuracyindividualsort`,
  HIERARCHI_SALARY_FILTER: `${BASE_URL}/api/getallhierarchylistsalary`,

  REVENUEAMOUNT_SORT: `${BASE_URL}/api/revenueamountsort`,
  ERAAMOUNT_SORT: `${BASE_URL}/api/eraamountsort`,
  ALL_TARGETPOINTS_SORT: `${BASE_URL}/api/targetpointsort`,
  PASSWORD_ACTION_EMPLOYEE: `${BASE_URL}/api/allpasswordsactionemployee`,
  DRAFTDUPLICATE: `${BASE_URL}/api/draftduplicatecheck`,
  TARGETPOINTSASSIGNBRANCH: `${BASE_URL}/api/targetpointslimitedassignbranch`,

  RAISETICKET_LAST: `${BASE_URL}/api/raiseticketslast`,

  COMPANYNAME_DUPLICATECHECK_CREATE: `${BASE_URL}/api/checkcompanynamecreate`,
  COMPANYNAME_DUPLICATECHECK_EDIT: `${BASE_URL}/api/checkcompanynameedit`,
  GETALLCHECKLISTBYPAGINATION: `${BASE_URL}/api/mychecklistbypagination`,
  SALARY_FIX_FILTERREPORT: `${BASE_URL}/api/salaryfixfilterreport`,
  USER_CREDENTIALS_MAIL: `${BASE_URL}/api/user-credentials`,
  USER_SINGLE_PWD_RESET: `${BASE_URL}/api/userpwreset`,


  //EMPLOYEE API
  USERCHECKS: `${BASE_URL}/api/maintenancelog`,
  CREATE_USERCHECKS: `${BASE_URL}/api/maintenancelog/new`,
  USERCHECKS_SINGLE: `${BASE_URL}/api/maintenancelogsingle`,
  SKIPPED_EMPLOYEE: `${BASE_URL}/api/skippedemployee`,
  PRODUCTION_ORGINAL_LIMITED_FILTER: `${BASE_URL}/api/productionoriginalslimitedfilter`,
  CHECK_ISPRODDAY_CREATED: `${BASE_URL}/api/checkisproddaycreated`,
  BULK_DELETE_UNITRATE_UNALLOT: `${BASE_URL}/api/bulkdeleteunitrateunallot`,

  CLIENTUSERID_CHECK_USER: `${BASE_URL}/api/clientuseridusercheck`,
  EMPLOYEEDOCUMENTIDCARD: `${BASE_URL}/api/employeedocumentsidcard`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG_TEMP: `${BASE_URL}/api/updatedbulkdatasunitandflagtemp`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY_TEMP: `${BASE_URL}/api/updatedbulkdatasunitonlytemp`,
  PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY_TEMP: `${BASE_URL}/api/updatedbulkdatasflagonlytemp`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION_TEMP: `${BASE_URL}/api/updatedbulkdatasunitandsectiontemp`,
  BULK_DELETE_UNITRATE_UNALLOT_TEMP: `${BASE_URL}/api/bulkdeleteunitrateunallottemp`,

  GET_MISMATCH_DATAS_ID_TEMP: `${BASE_URL}/api/getmismatchdatasidtemp`,

  PRODUCTION_UPLOAD_GETDATAS_BYID_TEMP: `${BASE_URL}/api/getproductionuploaddatasbyidtemp`,
  PRODUCTION_UPLOAD_GETDATAS_BYID_MANUAL_TEMP: `${BASE_URL}/api/getproductionuploaddatasbyidmanualtemp`,

  PRODUCTION_TEMP_LIMITED_FILTER: `${BASE_URL}/api/productiontemplimitedfilter`,

  PRODUCTION_TEMP_UNITRATE_BULK_UPDATECATSUBCATEGORY: `${BASE_URL}/api/bulkproductiontempupdatecategorysubcategory`,
  PRODUCTION_ORIGINAL_UNITRATE_BULK_UPDATECATSUBCATEGORY: `${BASE_URL}/api/bulkproductionorgupdatecategorysubcategory`,

  GET_MISMATCH_UPDATEDLIST_TEMP: `${BASE_URL}/api/getmismatchupdatedlisttemp`,

  UPDATE_UNDO_FIELDNAME_TEMP: `${BASE_URL}/api/updatefieldundonametemp`,
  PRODUCTION_UPLOAD_CHECKSTATUS_TEMP: `${BASE_URL}/api/productionuploadcheckstatustemp`,


  //PRODUCTIONDAYTEMP
  PRODUCTION_DAYS_TEMP: `${BASE_URL}/api/productiondaystemp`,
  PRODUCTION_DAY_CREATE_TEMP: `${BASE_URL}/api/productiondaytemp/new`,
  PRODUCTION_DAY_SINGLE_TEMP: `${BASE_URL}/api/productiondaytemp`,
  PRODUCTION_DAY_UNIQID_TEMP: `${BASE_URL}/api/productiondaysuniqidtemp`,

  //PRODUCTIONDAYLISTTEMP
  PRODUCTION_DAYS_LIST_TEMP: `${BASE_URL}/api/productiondayliststemp`,
  PRODUCTION_DAY_LIST_CREATE_TEMP: `${BASE_URL}/api/productiondaylisttemp/new`,
  PRODUCTION_DAY_LIST_SINGLE_TEMP: `${BASE_URL}/api/productiondaylisttemp`,
  PRODUCTION_DAY_LIST_GET_DELETE_LIMITED_TEMP: `${BASE_URL}/api/productiondaylistgetdeletelimitedtemp`,
  PRODUCTION_DAY_LIST_GET_VIEW_LIMITED_TEMP: `${BASE_URL}/api/productiondaylistgetviewlimitedtemp`,
  PRODUCTION_DAY_LIST_DELETE_UNIQID_TEMP: `${BASE_URL}/api/productiondaylistdeleteuniqudtemp`,

  PRODUCTION_DAYS_GETLIST_BY_DATE_TEMP: `${BASE_URL}/api/productiondaylistsgetbydatetemp`,


  CHECK_ZERO_MISMATCH_PRESENT_TEMP: `${BASE_URL}/api/checkzeromismatchpresenttemp`,

  GET_PRODUCTION_SINGLE_DAYUSER_TEMP: `${BASE_URL}/api/getproductionsignledayusertemp`,


  PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY_TEMP: `${BASE_URL}/api/productiondaygetsingledatedatadaytemp`,

  GET_DAY_POINTS_LIMITED_DATE_TEMP: `${BASE_URL}/api/checkdaypointdatetemp`,


  //Day Points Upload baseservice
  ADD_DAY_POINTS_TEMP: `${BASE_URL}/api/daypointtemp/new`,
  GET_DAY_POINTS_TEMP: `${BASE_URL}/api/daypointstemp`,
  SINGLE_DAY_POINTS_TEMP: `${BASE_URL}/api/daypointtemp`,
  SINGLE_DAY_POINTS_UPLOAD_TEMP: `${BASE_URL}/api/singledaypointtemp`,

  GET_DAY_POINTS_LIMITED_TEMP: `${BASE_URL}/api/daypointslimitedtemp`,

  DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH_TEMP: `${BASE_URL}/api/daypointsmonthwisefilternxtmonthtemp`,

  DAY_POINTS_MONTH_YEAR_FILTER_TEMP: `${BASE_URL}/api/daypointsmonthwisefiltertemp`,

  DAY_POINTS_FILTER_TEMP: `${BASE_URL}/api/daypointsfiltertemp`,
  DAY_POINTS_DATAS_TEMP: `${BASE_URL}/api/daypointsdatasfetchtemp`,
  ALLUSEREMPLOYEE: `${BASE_URL}/api/alluseremployee`,
  GETFILTEREUSERDATA: `${BASE_URL}/api/getfilteralluserdata`,
  FORMERUSERS: `${BASE_URL}/api/formerusernames`,
  ONBOARDING_SALARY_FIX_FILTERREPORT: `${BASE_URL}/api/onboardingsalaryfixfilter`,

  //Document Preparation baseservice
  CREATE_DOCUMENT_PREPARATION: `${BASE_URL}/api/documentpreparation/new`,
  ALL_DOCUMENTPREPARATION: `${BASE_URL}/api/documentpreparations`,
  ACCESIBLEBRANCHALL_DOCUMENTPREPARATION: `${BASE_URL}/api/accessiblebranchdocumentpreparations`,
  SINGLE_DOCUMENTPREPARATION: `${BASE_URL}/api/documentpreparation`,
  DOCUMENT_PREPARATION_CODES: `${BASE_URL}/api/documentpreparationcodes`,
  //MyVerification
  MYVERIFICATION_CREATE: `${BASE_URL}/api/myverification/new`,
  MYVERIFICATION: `${BASE_URL}/api/myverifications`,
  MYVERIFICATION_SINGLE: `${BASE_URL}/api/myverification`,

  MYFIELDVERIFICATION_CREATE: `${BASE_URL}/api/myfieldverification/new`,
  MYFIELDVERIFICATION: `${BASE_URL}/api/myfieldverifications`,
  MYFIELDVERIFICATION_SINGLE: `${BASE_URL}/api/myfieldverification`,

  VERIFIEDLIST_SINGLE: `${BASE_URL}/api/verifiedlist`,

  CANDIDATESTATUS_FILTER: `${BASE_URL}/api/candidatestatusfilter`,
  USERSWITHSTATUS: `${BASE_URL}/api/userwithstatus`,


  //settings
  TEMPLATECONTROLPANEL: `${BASE_URL}/api/templatecontrolpanel`,
  ACCESSIBLETEMPLATECONTROLPANEL: `${BASE_URL}/api/accessibletemplatecontrolpanel`,
  FILTERTEMPLATECONTROLPANEL: `${BASE_URL}/api/filtertemplatecontrolpanel`,
  TEMPLATECONTROLPANEL_CREATE: `${BASE_URL}/api/templatecontrolpanel/new`,
  TEMPLATECONTROLPANEL_SINGLE: `${BASE_URL}/api/templatecontrolpanel`,
  DUPLICATIONTEMPLATECONTROLPANEL: `${BASE_URL}/api/duplicatetemplatecontrolpanel`,
  //Template Creation baseservice
  CREATE_TEMPLATECREATION: `${BASE_URL}/api/templatecreation/new`,
  ALL_TEMPLATECREATION: `${BASE_URL}/api/templatecreations`,
  ACCESSIBLEBRANCHALL_TEMPLATECREATION: `${BASE_URL}/api/accessibletemplatecreations`,
  EMPLOYEE_TEMPLATECREATION: `${BASE_URL}/api/employeetemplatecreations`,
  COMPANY_TEMPLATECREATION: `${BASE_URL}/api/companytemplatecreations`,
  SINGLE_TEMPLATECREATION: `${BASE_URL}/api/templatecreation`,
  OVERALL_TEMPLATE_CREATION: `${BASE_URL}/api/overalledittemplatecreation`,
  OVERALL_TEMPLATE_CREATION_DELETE: `${BASE_URL}/api/overalledittemplatecreationdelete`,
  RAISE_TICKET_FORWARDED_EMPLOYEES: `${BASE_URL}/api/raiseticketforwardedemployee`,
  RAISE_TICKET_USER_FORWARDED_EMPLOYEES: `${BASE_URL}/api/raiseticketuserforwardedemployee`,
  CONTROL_NAMES_BASED_ON_DESIG: `${BASE_URL}/api/controlnamesbasedondesignation`,
  CANDIDATESALLFIELDS_FILTER: `${BASE_URL}/api/candidatesafieldsfilter`,
  CANDIDATESALLFIELDS: `${BASE_URL}/api/candidatesallfields`,
  USERNEWFILTER: `${BASE_URL}/api/usersnewfilter`,
  GETALLFILTEREDUSERS: `${BASE_URL}/api/filteredusers`,



  DOCUMENT_PREPARATION_MAIL: `${BASE_URL}/api/documentpreparationmail`,
  USER_NAME_SEARCH: `${BASE_URL}/api/usernamesearch`,
  TEMPLATECONTROLPANEL_USERFIND: `${BASE_URL}/api/tempcontrolepaneluserfind`,

  PAYRUNLIST: `${BASE_URL}/api/payrunlists`,
  PAYRUNLIST_CREATE: `${BASE_URL}/api/payrunlist/new`,
  PAYRUNLIST_SINGLE: `${BASE_URL}/api/payrunlist`,
  PAYRUNLIST_LIMITED: `${BASE_URL}/api/payrunlistlimited`,
  USER_ATTENDANCE_PAYRUN: `${BASE_URL}/api/getallusersattendancepayrun`,
  UPDATE_INNERDATA_SINGLE_USER_RERUN: `${BASE_URL}/api/updateinnerdatasingleuserrerun`,
  UPDATE_PAYRUNLIST_INNERDATA: `${BASE_URL}/api/updatepayrunlistinnerdata`,
  UNDO_PAYRUNLIST_INNERDATA: `${BASE_URL}/api/undopayrunlistinnerdata`,
  UPDATE_PAYRUNLIST_INNERDATA_USER: `${BASE_URL}/api/updatepayrunlistinnerdatauser`,
  UNDO_PAYRUNLIST_INNERDATA_USER: `${BASE_URL}/api/undopayrunlistinnerdatauser`,
  CHECK_PAYRUN_ISCREATED: `${BASE_URL}/api/checkpayruniscreated`,
  TRAINING_USER_PANEL_ONLINE_TEST: `${BASE_URL}/api/traininguserpanelonlinetest`,
  USER_LOGIN_STATUS: `${BASE_URL}/api/usersloginstatus`,
  INDIVIDUAL_USER_LOGIN_STATUS: `${BASE_URL}/api/individualusersloginstatus`,
  HIERARCHY_BASED_USER_LOGIN_STATUS: `${BASE_URL}/api/hierarchybasedemployeeloginstatus`,
  HIERARCHY_BASED_USER_LOGIN_STATUS_DEFAULT: `${BASE_URL}/api/hierarchybasedemployeeloginstatusdefault`,
  USERS_COMPANYNAMES: `${BASE_URL}/api/getalluserscompanyname`,


  PAYRUNLIST_SENT_FIXSALARYDATE: `${BASE_URL}/api/payrunlistsentsalaryfixdate`,
  UPDATE_INNERDATA_SINGLE_USER_WAIVER: `${BASE_URL}/api/updateinnerdatasingleuserwaiver`,
  PAIDSTATUSFIX_FILTERED: `${BASE_URL}/api/paidstatusfixsfiltered`,
  PAIDDATEFIX_FITLERED: `${BASE_URL}/api/paiddatefixfitlered`,
  ERAAMOUNT_FILEDEL: `${BASE_URL}/api/eraamountbulkdel`,
  TARGETPOINTSDELETE_BULK: `${BASE_URL}/api/targetpointsbulkdelete`,
  REVENUEAMOUNT_BULK: `${BASE_URL}/api/revenueamountbulk`,
  UPDATE_UNDO_FIELDNAME_CONFIRMLIST: `${BASE_URL}/api/undofieldnameconfirmlistfix`,
  FETCH_PAYRUNLIST_MONTHWISE: `${BASE_URL}/api/fetchpayrunlistdatamonthwise`,
  CONFIRM_FIXSALARYDATE: `${BASE_URL}/api/confirmfixsalarydate`,
  CONFIRM_FIXHOLDSALARYDATE: `${BASE_URL}/api/confirmfixholdsalarydate`,
  CONFIRM_FIXHOLDSALARY_LOGUPDATE: `${BASE_URL}/api/confirmfixholdsalarylogupdate`,
  //document production attendance condition
  USER_CLOCKIN_CLOCKOUT_STATUS_DOC_PREPARATION: `${BASE_URL}/api/userclockinclockoutstatusdocprep`,
  USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER_DOCPREP: `${BASE_URL}/api/userclockinclockoutstatusformontlopcalfilterdocprep`,
  PRODUCTION_DATE_FILTER: `${BASE_URL}/api/attendancedatefilter`,
  CLIENTSUPPORT: `${BASE_URL}/api/clientsupport`,
  CLIENTSUPPORT_OVERALLEXPORT: `${BASE_URL}/api/clientsupportoverallexport`,

  // Manage Client Details
  MANAGECLIENTDETAILS: `${BASE_URL}/api/manageclientdetailss`,
  MANAGECLIENTDETAILS_CREATE: `${BASE_URL}/api/manageclientdetails/new`,
  MANAGECLIENTDETAILS_SINGLE: `${BASE_URL}/api/manageclientdetails`,

  //Manage Ticket Grouping

  MANAGETICKETGROUPING: `${BASE_URL}/api/allticketgrouping`,
  MANAGETICKETGROUPING_CREATE: `${BASE_URL}/api/createticketgrouping`,
  MANAGETICKETGROUPING_SINGLE: `${BASE_URL}/api/singleticketgrouping`,

  SINGLE_VISITORS_UPDATEID: `${BASE_URL}/api/visitorsupdateid`,
  ALL_VISITORS_CHECKOUT: `${BASE_URL}/api/allvisitorscheckout`,
  CANDIDATESALLCOUNT: `${BASE_URL}/api/allcandidatescount`,

  USER_VISITOR_REGISTER: `${BASE_URL}/api/uservisitorregister`,
  ALL_VISITORS_FILTEREDID: `${BASE_URL}/api/visitorsfilteredid`,

  VISITORS_GETUNIQUEIDDATA: `${BASE_URL}/api/getuniquedatacandidates`,
  JOB_OPEN_CANDIDATE_REGISTER: `${BASE_URL}/api/jobopenregister`,

  //HICONNECT

  MATTERMOST_TEAM_NAMES: `${BASE_URL}/api/getmattermostteamnames`,
  MATTERMOST_CHANNEL_NAMES: `${BASE_URL}/api/getmattermostchannelnames`,
  MATTERMOST_DEACTIVATE_USER: `${BASE_URL}/api/deactivatemattermostuser`,

  MATTERMOST_CREATE_TEAM: `${BASE_URL}/api/createmattermostteam`,
  MATTERMOST_DELETE_TEAM: `${BASE_URL}/api/deletemattermostteam`,
  MATTERMOST_RESTORE_TEAM: `${BASE_URL}/api/restoremattermostteam`,
  MATTERMOST_UPDATE_TEAM: `${BASE_URL}/api/updatemattermostteam`,

  MATTERMOST_ALL_TEAM_CHANNELS: `${BASE_URL}/api/getmattermostallteamchannels`,
  MATTERMOST_CREATE_CHANNEL: `${BASE_URL}/api/createmattermostchannel`,
  MATTERMOST_DELETE_CHANNEL: `${BASE_URL}/api/deletemattermostchannel`,
  MATTERMOST_RESTORE_CHANNEL: `${BASE_URL}/api/restoremattermostchannel`,
  MATTERMOST_UPDATE_CHANNEL: `${BASE_URL}/api/updatemattermostchannel`,

  ALL_SALARYSLAB_LIST_FILTER: `${BASE_URL}/api/salaryslablistfilter`,

  EMPLOYEENAMEOVERALLUPDATE: `${BASE_URL}/api/employeenameoverallupdate`,
  EMPLOYEECODEOVERALLUPDATE: `${BASE_URL}/api/employeecodeoverallupdate`,

  DELETEANYLOG: `${BASE_URL}/api/deleteanylog`,
  DELETESHIFTANYLOG: `${BASE_URL}/api/deleteshiftanylog`,
  UPDATEANYLOG: `${BASE_URL}/api/updateanylog`,
  TEMPLATEUSERSALL: `${BASE_URL}/api/getalltemplateusers`,

  PRODUCTION_INDIVIDUAL_EXCEL_OVERALL: `${BASE_URL}/api/productionindividualexceloverall`,
  APPROVEDPERMISSIONS: `${BASE_URL}/api/approvedpersmissions`,
  APPROVEDLEAVE: `${BASE_URL}/api/approvedleaves`,

  LOGINALLOTLOG: `${BASE_URL}/api/loginallotlog`,
  RESETCLIENTUSERID: `${BASE_URL}/api/resetclientuserid`,


  USER_PRODUCTION_DAY_SHIFT_FILTER: `${BASE_URL}/api/usersproductiondayshiftfilter`,

  //reqired master
  TOOLTIPDESCRIPTIONS: `${BASE_URL}/api/tooltipdescription`,
  TOOLTIPDESCRIPTIONSAGGREGATION: `${BASE_URL}/api/tooltipdescriptionaggregation`,
  TOOLTIPDESCRIPTION_CREATE: `${BASE_URL}/api/tooltipdescription/new`,
  TOOLTIPDESCRIPTION_SINGLE: `${BASE_URL}/api/tooltipdescription`,

  GET_ALL_USER_EMPLOYEE: `${BASE_URL}/api/getalluseremployee`,

  INTERVIEWANSWERALLOT_OVERALL: ` ${BASE_URL}/api/overalledit/interviewanswerallot`,
  INTERVIEWSTATUSALLOT_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewstatusallot`,
  INTERVIEWQUESTIONGROUPING_OVERALLEDIT: ` ${BASE_URL}/api/overalledit/interviewquestiongrouping`,

  PRODUCTION_DAY_CATEGORY_FILTER: `${BASE_URL}/api/productiondaycategoryidfilter`,
  TEMPLATECONTROLPANEL_SINGLEDELETE: `${BASE_URL}/api/templatecontrolpanelsingle`,
  USER_PRODUCTION_DAY_SHIFT_ATTENDANCE_FILTER: `${BASE_URL}/api/usersproductiondayshiftattendancefilter`,
  GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX: `${BASE_URL}/api/allattendancecontrolcriterialastindex`,
  CHECK_ISPRODDAY_CREATED_TEMP: `${BASE_URL}/api/checkisproddaycreatedtemp`,
  PRODUCTION_DAY_CATEGORY_FILTER_TEMP: `${BASE_URL}/api/productiondaycategoryidfiltertemp`,
  USERSHIFTCHECKBULK: `${BASE_URL}/api/user/shiftcheckbulk`,
  SHIFTBYCONDITION: `${BASE_URL}/api/shiftsbyconditions`,

  GETALLSHIFTGROUPSBYCONDITION: `${BASE_URL}/api/shiftgroupingsbycondition`,
  GETALLSHIFTGROUPSBULK: `${BASE_URL}/api/shiftgroupingsbulk`,

  NOTICE_HIERARCHY_LIST: `${BASE_URL}/api/noticehierarchylist`,
  HIERARCHY_REPORTING_TO: `${BASE_URL}/api/hierarchyreportingtousers`,
  ASSIGNINTERVIEW_FILTER: `${BASE_URL}/api/assigninterviewersfilter`,
  ASSIGNINTERVIEW_FILTER_MANUAL: `${BASE_URL}/api/assigninterviewersfiltermanual`,
  USER_STATUS_DEP_CHECK: `${BASE_URL}/api/usersstatusdepCheck`,


  USER_LOGIN_STATUS_ACTION: `${BASE_URL}/api/usersloginstatusaction`,
  USER_LOGIN_EXPIRED_STATUS: `${BASE_URL}/api/usersloginexpiredstatus`,

  //Raise Ticket
  RAISETICKET_FILTER_OVERALL: `${BASE_URL}/api/raiseticketfilteroverall`,

  USER_PROFILE: `${BASE_URL}/api/getallprofileimages`,
  CANDIDATE_MISSINGFIELDS: `${BASE_URL}/api/candidatesmissingfields`,
  REJECTED_CANDIDATES: `${BASE_URL}/api/rejectedcandidates`,
  CONTROL_SETTINGS_LAST_INDEX: `${BASE_URL}/api/getoverallsettingslastindex`,
  INDIVIDUAL_SETTINGS_LAST_INDEX: `${BASE_URL}/api/userindividuallastindex`,
  INDIVIDUAL_SETTINGS_COMPANY: `${BASE_URL}/api/userindividual`,
  GETALLCHECKLISTBYPAGINATIONNOTASSIGNED: `${BASE_URL}/api/mychecklistbypaginationnotassigned`,


  //CONSOLIDATED SALARY RELEASE
  CONSOLIDATED_SALARY_RELEASE: `${BASE_URL}/api/consolidatedsalaryrelease`,
  CONSOLIDATED_SALARY_RELEASE_CREATE: `${BASE_URL}/api/consolidatedsalaryrelease/new`,
  CONSOLIDATED_SALARY_RELEASE_SINGLE: `${BASE_URL}/api/consolidatedsalaryrelease`,
  CONSOLIDATED_SALARY_RELEASE_MONTHWISE: `${BASE_URL}/api/consolidatedsalaryreleasemonthwise`,

  //HOLDSALARY RELEASE
  HOLD_SALARY_RELEASE: `${BASE_URL}/api/holdsalaryrelease`,
  HOLD_SALARY_RELEASE_CREATE: `${BASE_URL}/api/holdsalaryrelease/new`,
  HOLD_SALARY_RELEASE_SINGLE: `${BASE_URL}/api/holdsalaryrelease`,
  FETCH_HOLD_SALARY_CONFIRMLIST: `${BASE_URL}/api/holdsalaryyettoconfirmlist`,

  CONFIRM_FIX_HOLDSALARYDATE: `${BASE_URL}/api/confirmfixholdsalarydate`,

  CONFIRM_FIXHOLDSALARY_REJECT: `${BASE_URL}/api/fixholdsalaryreject`,

  UPDATE_REMOVE_REJECT: `${BASE_URL}/api/updateRemoveReject`,

  CONFIRM_FIX_HOLDRELEASE_SAVE: `${BASE_URL}/api/confirmholdreleasesave`,

  CONFIRM_CONSOLIDATED_RELEASE_SAVE: `${BASE_URL}/api/confirmconsolidatedreleasesave`,

  //BANK RELEASE
  BANK_RELEASE: `${BASE_URL}/api/bankreleases`,
  BANK_RELEASE_CREATE: `${BASE_URL}/api/bankrelease/new`,
  BANK_RELEASE_SINGLE: `${BASE_URL}/api/bankrelease`,
  BANK_RELEASE_LIMITED: `${BASE_URL}/api/bankreleaselimited`,
  CHECKWITH_BANK_RELEASE: `${BASE_URL}/api/checkwithbankrelease`,


  //PROD UPLOAD
  PRODUCTION_CATEGORY_CHECK_PRODUPLOAD: `${BASE_URL}/api/checkcategoryforprodupload`,
  PRODUCTION_SUBCATEGORY_CHECK_PRODUPLOAD: `${BASE_URL}/api/checksubcategoryforprodupload`,
  PRODUCTION_UNITRATE_CHECK_PRODUPLOAD: `${BASE_URL}/api/checkunitrateforprodupload`,


  PAIDDATEFIX_UPDATE: `${BASE_URL}/api/paiddatefixupdatesingle`,
  PENDING_TASK_COUNT: `${BASE_URL}/api/getpendingtaskcount`,
  FETCH_BANKRELEASE_PAYRUNLIST_MONTHWISE: `${BASE_URL}/api/fetchbankreleasepayrunlistmonthwise`,
  MYCHECKLISTVIEW: `${BASE_URL}/api/checklistview`,
  PENDINGINTERVIEWCHECKLIST: `${BASE_URL}/api/interviewpendingchecklist`,
  CHECKLISTUSERDATAS: `${BASE_URL}/api/fetchuserdatas`,
  PENDINGINTERVIEWCHECKLISTLEAVE: `${BASE_URL}/api/interviewpendingchecklistleave`,
  PENDINGINTERVIEWCHECKLISTPERMISSION: `${BASE_URL}/api/interviewpendingchecklistpermission`,
  CANDIDATEBYIDFORDOCUMENT: `${BASE_URL}/api/candidatefordocument`,

  USER_CLOCKIN_CLOCKOUT_STATUS_CHECKLOGIN: `${BASE_URL}/api/userclockinclockoutstatusloginstatuscheck`,
  REPORTINGTO_PROCESS_USER_HIERARCHY_RELATION: `${BASE_URL}/api/reportingtouserhierarchyrelation`,
  REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION: `${BASE_URL}/api/reportingtodesignationuserhierarchyrelation`,
  //Newly Added Baseservices for HIERARCHY
  HIERARCHY_DEISGNATIONLOG_RELATION: `${BASE_URL}/api/hierarchydesignationlogrelation`,
  HIERARCHY_PROCESSALOOT_TEAM_RELATION: `${BASE_URL}/api/hierarchyprocessteamrelation`,

  GET_EMPLOYEE_PRODUCTION_LAST_THREEMONHTS: `${BASE_URL}/api/getemployeeproductionlastthreemonths`,
  GET_PRODUCTIONDAY_LAST_THREEMONTHS: `${BASE_URL}/api/getempproductiondaylastthreemonths`,
  GET_EMPLOYEE_PRODUCTION_LAST_THREEMONHTS_TEMP: `${BASE_URL}/api/getemployeeproductionlastthreemonthstemp`,
  GET_PRODUCTIONDAY_LAST_THREEMONTHS_TEMP: `${BASE_URL}/api/getempproductiondaylastthreemonthstemp`,

  EMPLOYEE_MISSINGFIELDS: `${BASE_URL}/api/getemployeemissingfields`,
  USER_CREDENTIALS: `${BASE_URL}/api/usercredentials`,
  TEMPORARY_LOGIN_STATUS: `${BASE_URL}/api/temporaryloginstatus`,
  GET_WEEOFF_DAYS_FORUSER: `${BASE_URL}/api/getuserweekoffdays`,
  GET_PRODUCTIONUPDATE_CURRMONTH: `${BASE_URL}/api/getallproductionsbyuserforcurrmonth`,
  GET_PRODUCTIONUPDATE_CURRMONTH_VIEW: `${BASE_URL}/api/getallproductionsbyuserforcurrmonthview`,
  BRANCHOVERALLUPDATE: `${BASE_URL}/api/branchoverallupdate`,
  BRANCHALLCHECK: `${BASE_URL}/api/branchAllCheck`,
  UNITOVERALLUPDATE: `${BASE_URL}/api/unitoverallupdate`,
  OVERALLUNITCHECK: `${BASE_URL}/api/unitoverallcheck`,
  OVERALLAREACHECK: `${BASE_URL}/api/overallareascheck`,
  AREAOVERALLUPDATE: `${BASE_URL}/api/overallareasupdate`,
  LOCATIONOVERALLUPDATE: `${BASE_URL}/api/locationoverallupdate`,
  OVERALLLOCATIONCHECK: `${BASE_URL}/api/locationoverallcheck`,
  FLOOROVERALLUPDATE: `${BASE_URL}/api/flooroverallupdate`,
  FLOOROVERALLCHECK: `${BASE_URL}/api/flooroverallcheck`,
  DYNAMICUSER_CONTROLLER: `${BASE_URL}/api/dynamicqueryuserapi`,
  LOGIN_ALLOT_HIERARCHY_LIST: `${BASE_URL}/api/productionloginallothierarchyfilter`,
  TEAM_DESIGNATION_LOG: `${BASE_URL}/api/teamsdesignationlog`,
  ACTIVEALL_PASSWORD_ACCESS: `${BASE_URL}/api/activeallpasswordsaccess`,
  PASSWORD_ACCESS_CONTROL: `${BASE_URL}/api/allpasswordsaccess`,
  IP_MASTER_ACCESS: `${BASE_URL}/api/ipmastersaccess`,
  ASSET_DATA_FILTER_ACCESS: `${BASE_URL}/api/assetdetailsfilteraccess`,
  ASSET_MATERIALIP_LIMITED_ACCESS: `${BASE_URL}/api/assetmaterialipslimitedaccess`,
  ASSET_WORKSTATION_GRP_ACCESS: `${BASE_URL}/api/assetworkgrpsaccess`,
  WORKSTATION_ACCESS: `${BASE_URL}/api/workstationsaccess`,
  ASSET_DAMAGED_ACCESS: `${BASE_URL}/api/damagedassetaccess`,
  ASSET_REPAIR_ACCESS: `${BASE_URL}/api/repairedassetaccess`,
  MAINTENANCE_ACCESS: `${BASE_URL}/api/maintentancesaccess`,
  EMPLOYEE_ASSET_ACCESS: `${BASE_URL}/api/employeeassetsaccess`,
  TASK_MAINTENANCE_NON_SCHEDULING_ACCESS: `${BASE_URL}/api/taskmaintenancenonschedulegroupingsaccess`,
  STOCK_MANAGE_ACCESS: `${BASE_URL}/api/stockmanagesaccess`,
  STOCK_ACCESS: `${BASE_URL}/api/stocksaccess`,
  MANUAL_STOCK_ACCESS: `${BASE_URL}/api/manualstocksaccess`,
  ADDTOPRINT_QUEUE_LIMITED_ACCESS: `${BASE_URL}/api/addtoprintqueueslimitaccess`,
  ADDTOPRINT_PRINT_LIMITED_ACCESS: `${BASE_URL}/api/addtoprintqueueslimitprintaccess`,
  STOCK_MANAGE_FILTER: `${BASE_URL}/api/stockfilteraccess`,
  GET_PRODUCTIONUPDATE_CURRMONTH_TEMP: `${BASE_URL}/api/getallproductionsbyuserforcurrmonthtemp`,
  GET_PRODUCTIONUPDATE_CURRMONTH_VIEW_TEMP: `${BASE_URL}/api/getallproductionsbyuserforcurrmonthviewtemp`,
  COMPANYACCESS: `${BASE_URL}/api/companyaccess`,
  USERSEXCELDATAASSIGNBRANCH: `${BASE_URL}/api/usersexceldataassignbranch`,
  TARGETPOINTS_LIMITEDASSIGNBRANCH: `${BASE_URL}/api/targetpointslimitedassignbranch`,
  ERAAMOUNTSASSIGNBRANCH: `${BASE_URL}/api/eraamountsassignbranch`,
  REVENUEAMOUNTSASSIGNBRANCH: `${BASE_URL}/api/revenueamountassignbranch`,
  ALL_PROCESS_AND_TEAM_ASSIGNBRANCH: `${BASE_URL}/api/processteamsassignbranch`,
  ACPOINTCALCULATIONASSIGNBRANCH: `${BASE_URL}/api/acpointcalculationassignbranch`,
  MINIMUMPOINTSACCESSBRANCH: `${BASE_URL}/api/minimumpointssaccessbranch`,
  SALARYSLAB_LIMITEDASSIGNBRANCH: `${BASE_URL}/api/salaryslablimitedassignbranch`,
  APPLYLEAVE_APPROVEDASSIGNBRANCH: `${BASE_URL}/api/applyleavesapprovedassignbranch`,
  CATEGORYPROCESSMAPASSIGNBRANCH: `${BASE_URL}/api/categoryprocessmapsassignbranch`,
  PAYRUNCONTROLBYASSIGNBRANCH: `${BASE_URL}/api/payruncontrolsbyassignbranch`,
  ALL_PROFFESIONALTAXMASTERBYASSIGNBRANCH: `${BASE_URL}/api/professionaltaxmastersbyassignbranch`,
  PROFFESIONALTAXMASTER_SORTBYASSIGNBRANCH: `${BASE_URL}/api/professionaltaxmastersortbyassignbranch`,
  ADVANCEBYASSIGNBRANCH: `${BASE_URL}/api/advancebyassignbranch`,
  LOANBYASSIGNBRANCH: `${BASE_URL}/api/loanbyassignbrach`,
  ALL_SALARYSLAB_SORTASSIGNBRANCH: `${BASE_URL}/api/salaryslabprocessfiltersortbyassignbranch`,
  GET_OVERALL_SETTINGSASSIGNBRANCH: `${BASE_URL}/api/getoverallsettingsassignbranch`,
  ALL_USER_PASSASSIGNBRANCH: `${BASE_URL}/api/alluserspasswordchangeassignbranch`,
  GET_ATTENDANCE_CONTROL_CRITERIAASSIGNBRANCH: `${BASE_URL}/api/allattendancecontrolcriteriaassignbranch`,
  GET_AUTOLOGOUTASSIGNBRANCH: `${BASE_URL}/api/allautologoutassignbranch`,
  MYFIELDVERIFICATIONASSIGNBRANCH: `${BASE_URL}/api/myfieldverificationsassignbranch`,
  USERASSIGNBRANCH: `${BASE_URL}/api/usersassignuserbranch`,
  MYVERIFICATIONASSIGNEDBRANCH: `${BASE_URL}/api/myverificationsassignbranchuser`,
  USERSEXCELDATAASSIGNBRANCHSALARYSLAB: `${BASE_URL}/api/usersexceldatabyassignbranch`,
  DOCUMENT_PREPARATION_AUTOID: `${BASE_URL}/api/documentpreparationautoid`,
  ASSIGNINTERVIEW_FILTER_ISSUING_AUTHORITY: `${BASE_URL}/api/assigninterviewersfilterissuingauthority`,
  NOTASSIGN_HIERARCHY_DEISGNATIONLOG: `${BASE_URL}/api/notassignhierarchydata`,
  NOTASSIGN_HIERARCHY_DEISGNATIONLOG_BACKEND: `${BASE_URL}/api/notassignhierarchylistdatabackend`,
  NOTASSIGN_HIERARCHY_DEISGNATIONLOG_FILTERED: `${BASE_URL}/api/notassignhierarchydatafiltered`,
  //Company Document Preparation baseservice
  CREATE_COMPANY_DOCUMENT_PREPARATION: `${BASE_URL}/api/companydocumentpreparation/new`,
  ALL_COMPANY_DOCUMENTPREPARATION: `${BASE_URL}/api/companydocumentpreparations`,
  ACCESSIBLEBRANCHALL_COMPANY_DOCUMENTPREPARATION: `${BASE_URL}/api/accessiblebranchcompanydocumentpreparations`,
  SINGLE_COMPANY_DOCUMENTPREPARATION: `${BASE_URL}/api/companydocumentpreparation`,
  COMPANY_DOCUMENT_PREPARATION_CODES: `${BASE_URL}/api/companydocumentpreparationcodes`,
  COMPANY_DOCUMENT_PREPARATION_AUTOID: `${BASE_URL}/api/companydocumentpreparationautoid`,
  BANK_RELEASE_CLOSED: `${BASE_URL}/api/bankreleaseclosed`,
  UNASSIGNEDBRANCH: ` ${BASE_URL}/api/unassignbranches`,
  GETFILTEREUSERDATALONGABSEND: `${BASE_URL}/api/getfilteralluserdatalongabsend`,
  RAISETICKET_REPORT: `${BASE_URL}/api/raiseticketsreports`,
  RAISETICKET_FILTER: `${BASE_URL}/api/raiseticketfilter`,
  RAISE_TICKET_FORWARDED_EMPLOYEES: `${BASE_URL}/api/raiseticketforwardedemployee`,
  EBREADINGDETAIL_LIST: `${BASE_URL}/api/ebreadingdetailslist`,
  PRODUCTION_TEMP_ATTENDANCES: `${BASE_URL}/api/productiontempattendancesfilter`,
  //Designation and control grouping
  DESIGNATIONCONTROLGROUPINGGROUPING: `${BASE_URL}/api/designationandcontrolgroupings`,
  DESIGNATIONCONTROLGROUPINGGROUPING_CREATE: `${BASE_URL}/api/designationandcontrolgrouping/new`,
  DESIGNATIONCONTROLGROUPINGGROUPING_SINGLE: `${BASE_URL}/api/designationandcontrolgrouping`,
  USERWITHACCESSIBLEBRANCH: `${BASE_URL}/api/userwithaccessiblebranch`,
  USER_X_EMPLOYEES: `${BASE_URL}/api/userswithxemployee`,

  CATEGORYMASTER: `${BASE_URL}/api/themecategorymasters`,
  CATEGORYMASTERS_CREATE: `${BASE_URL}/api/themecategorymaster/new`,
  CATEGORYMASTERS_SINGLE: `${BASE_URL}/api/themecategorymaster`,
  OVERALL_CATEGORYMASTER: `${BASE_URL}/api/overallcategorymaster`,

  // add category tickets details
  SUBCATEGORYMASTER: `${BASE_URL}/api/subcategorymasters`,
  SUBCATEGORYMASTER_CREATE: `${BASE_URL}/api/subcategorymaster/new`,
  SUBCATEGORYMASTER_SINGLE: ` ${BASE_URL}/api/subcategorymaster`,
  OVERALL_SUBCATEGORYMASTER: `${BASE_URL}/api/overallsubcategorymaster`,


  CATEGROYTHEMEGROUPING: `${BASE_URL}/api/categorythemegroupings`,
  CATEGROYTHEMEGROUPING_CREATE: `${BASE_URL}/api/categorythemegrouping/new`,
  CATEGROYTHEMEGROUPING_SINGLE: ` ${BASE_URL}/api/categorythemegrouping`,
  OVERALL_CATEGORYTHEMEGROUPING: ` ${BASE_URL}/api/categorythemegroupingoverall`,

  POSTERGENERATE: `${BASE_URL}/api/postergenerates`,
  POSTERGENERATE_CREATE: `${BASE_URL}/api/postergenerate/new`,
  POSTERGENERATE_SINGLE: ` ${BASE_URL}/api/postergenerate`,
  POSTERGENERATEGROUP: ` ${BASE_URL}/api/postergenerategroup`,

  GET_WEEOFF_DAYS_FORUSER_ATTENDANCE: `${BASE_URL}/api/getuserweekoffdaysattendance`,
  PAIDSTATUSFIX_FILTEREDDATA: `${BASE_URL}/api/filterpaidstatusfixdatas`,

  GET_DAY_POINTS_LIMITED_DATE_ONLY: `${BASE_URL}/api/daypointslimiteddateonly`,
  GET_DAY_POINTS_TEMP_DATE_ONLY: `${BASE_URL}/api/daypointstempdateonly`,

  CHECKLISTMODULE: ` ${BASE_URL}/api/checklistmodule`,
  CHECKLISTMODULE_CREATE: ` ${BASE_URL}/api/checklistmodule/new`,
  CHECKLISTMODULE_SINGLE: `${BASE_URL}/api/checklistmodule`,
  GETALLCHECKLISTMODULEBYPAGINATION: `${BASE_URL}/api/checklistmodulebypagination`,


  // exit interview
  CREATEEXITINTERVIEWQUESTION: `${BASE_URL}/api/exitinterviewquestion/new`,
  ALLEXITINTERVIEWQUESTIONS: `${BASE_URL}/api/exitinterviewquestions`,
  SINGLEEXITINTERVIEWQUESTION: `${BASE_URL}/api/exitinterviewquestion`,


  EXITINTERVIEWTESTMASTER: `${BASE_URL}/api/exitinterviewtestmaster`,
  EXITINTERVIEWTESTMASTER_CREATE: `${BASE_URL}/api/exitinterviewtestmaster/new`,
  EXITINTERVIEWTESTMASTER_SINGLE: `${BASE_URL}/api/exitinterviewtestmaster`,


  EXITINTERVIEW_LOGIN: `${BASE_URL}/api/exitinterviewlogin`,
  ALLNOTINEMPLOYEES: `${BASE_URL}/api/allnotinemployees`,
  NOTICEPERIODAPPLYBYASSIGNBRANCH: `${BASE_URL}/api/noticeperiodappliesbyassignbranch`,


  TRAINING_USER_PANEL_ONLINE_TEST: `${BASE_URL}/api/traininguserpanelonlinetest`,
  TRAINING_USER_PANEL_ONLINE_TEST_BULK_DELETE: `${BASE_URL}/api/traininguserpanelonlinetestbulkdelete`,

  PENDINGLONGABSENTCHECKLIST: `${BASE_URL}/api/pendingchecklistlongabsent`,

  USER_SHIFTALLOT_DELETE: `${BASE_URL}/api/usershiftallotsdelete`,
  ATTENDANCE_STATUS_OVERALL_DELETE: `${BASE_URL}/api/attendancemodestatusoveralldelete`,
  ATTENDANCE_STATUS_OVERALL_EDIT: `${BASE_URL}/api/attendancemodestatusoveralledit`,
  EXPENSECATEGORY_AUTOID: `${BASE_URL}/api/expensecategoriesautoid`,
  EXPENSE_AUTOID: `${BASE_URL}/api/expensesautoid`,
  STOCKCATEGORY_AUTOID: `${BASE_URL}/api/stockcategoryautoid`,
  VENDOR_AUTOID: `${BASE_URL}/api/vendordetailsautoid`,
  ALL_OTHERTASKCOMPANY_SORT: `${BASE_URL}/api/othertasksortcompany`,
  ALL_OTHERTASKEMPLOYEE_SORT: `${BASE_URL}/api/othertasksortemployee`,
  DESIGNATIONOVERALLCHECK: `${BASE_URL}/api/desigoverallcheck`,
  DESIGNATIONOVERALLUPDATE: `${BASE_URL}/api/desigoverallupdate`,
  DEPARTMENTOVERALLUPDATE: `${BASE_URL}/api/departoverallupdate`,
  DEPARTMENTOVERALLCHECK: `${BASE_URL}/api/departoverallcheck`,
  TEAMOVERALLUPDATE: `${BASE_URL}/api/overallupdatecheck`,
  TEAMOVERALLCHECK: `${BASE_URL}/api/overalldelcheck`,
  GET_UNIQID_FROM_DATE_PRODUPLOAD: `${BASE_URL}/api/getuniqidfromdateprodupload`,
  GET_UNIQID_FROM_DATE_PRODUPLOAD_TEMP: `${BASE_URL}/api/getuniqidfromdateproduploadtemp`,

  GET_PAYRUN_BULKDATA_EXCEL: `${BASE_URL}/api/getpayrunbulkdataexcel`,
  DELETE_PAYRUN_BULKDATA: `${BASE_URL}/api/deletepayrunbulkdata`,
  PRODUCTION_MANUAL_FILTER: `${BASE_URL}/api/productionmanualuploadfilter`,

  EMPLOYEE_NAMES_BASES_ON_STATUS_PAYRUN: `${BASE_URL}/api/employeenamesstatuswisepayrun`,
  FILTER_PAY_RUN_REPORT_EMPLOYEE_NAMES: `${BASE_URL}/api/filterpayrunemployeenames`,
  FILTER_PAY_RUN_REPORT_DATA: `${BASE_URL}/api/filterpayrunreportdata`,
  EMPLOYEECODE_AUTOGENERATE: `${BASE_URL}/api/employeecodeautogenerate`,
  FLAG_COUNT_SORT: `${BASE_URL}/api/othertasksortflag`,
  FLAG_COUNT_SORT_VIEW: `${BASE_URL}/api/othertasksortview`,
  GET_DAYPOINT_ID_BYDATE: `${BASE_URL}/api/getdaypointidbydate`,
  GET_DAYPOINT_ID_BYDATE_TEMP: `${BASE_URL}/api/getdaypointidbydatetemp`,
  TEAMSASSIGNBRANCH: `${BASE_URL}/api/teamsassignbranch`,
  SKIPPED_RAISEPROBLEMSTATUS: `${BASE_URL}/api/skippedraiseproblemstatus`,

  USER_FILTER_FOR_SHIFTADJ_PAGE: `${BASE_URL}/api/usershiftadjustmentfilter`,
  USER_FOR_ALL_ATTENDANCE_PAGE: `${BASE_URL}/api/userforallattendancefilter`,
  GETUSE_TOTALSHIFT_DAYS: `${BASE_URL}/api/getalluserstotalshiftdays`,
  // overall delete and edit paid date mode
  CHECKPAIDDATEFIX: `${BASE_URL}/api/checkpaiddatefix`,
  OVERALL_EDITPAIDDATEFIX: `${BASE_URL}/api/getoveralleditpaiddatefix`,
  // overall delete and edit paid status fix in payrun list 
  CHECKPAIDSTATUS_PAYRUN: `${BASE_URL}/api/checkpaidstatuspayrun`,
  OVERALL_EDITPAYRUNLIST: `${BASE_URL}/api/getoveralleditpayrunlist`,
  LISTPAGEACCESSMODES: `${BASE_URL}/api/listpageaccessmode`,
  LISTPAGEACCESSMODESAGGREGATION: `${BASE_URL}/api/listpageaccessmodeaggregation`,
  LISTPAGEACCESSMODE_CREATE: `${BASE_URL}/api/listpageaccessmode/new`,
  LISTPAGEACCESSMODE_SINGLE: `${BASE_URL}/api/listpageaccessmode`,

  //Reporting Header
  REPORTINGHEADER: `${BASE_URL}/api/reportingheaders`,
  REPORTINGHEADER_CREATE: `${BASE_URL}/api/reportingheader/new`,
  REPORTINGHEADER_SINGLE: `${BASE_URL}/api/reportingheader`,

  USERNEWFILTER_MISSINGFIELD: `${BASE_URL}/api/usersnewfiltermissingfield`,
  LONGABSENTRESTRICTION_HIERARCHYLIST: `${BASE_URL}/api/longabsentrestrictionhierarchylist`,


  //POSTER
  POSTERMESSAGESETTINGALL: `${BASE_URL}/api/postermessagesetting`,
  POSTERMESSAGESETTING_CREATE: `${BASE_URL}/api/postermessagesetting/new`,
  POSTERMESSAGESETTING_SINGLE: `${BASE_URL}/api/postermessagesetting`,
  OVERALL_POSTERMESSAGESETTINGOVERALL: `${BASE_URL}/api/postermessagesettingoverall`,

  //Footer
  FOOTERMESSAGESETTINGALL: `${BASE_URL}/api/footermessage`,
  FOOTERMESSAGESETTING_CREATE: `${BASE_URL}/api/footermessage/new`,
  FOOTERMESSAGESETTING_SINGLE: `${BASE_URL}/api/footermessage`,

  POSTERGENERATEGROUP_GETBIRTHDAY: ` ${BASE_URL}/api/postergenerategroupgetbirthday`,
  POSTERGENERATEGROUP_GETWEDDINGANNIVERSARY: ` ${BASE_URL}/api/postergenerategroupgetweddingannivesary`,
  ALL_CLIENTUSERID_REPORT_LIMITED_IDSONLY: `${BASE_URL}/api/clientuseridsreportidsonly`,
  SUBCATEGORYPROD_REPORT_LIMITED: `${BASE_URL}/api/getlistsubcategoryprodlimitedreport`,

  USER_POSTERGENERATE: `${BASE_URL}/api/userspostergenerate`,
  PROJECTMASTER_INDIVIDUAL: `${BASE_URL}/api/projectmasterindividual`,
  FACEDETECTLOGINMODEL: `${BASE_URL}/api/weights`,

  PAIDDATEFIX_FUTUREDATEONLY: `${BASE_URL}/api/paiddatefixedfuturedatesonly`,

  ALL_VISITORS_REGISTER: `${BASE_URL}/api/allvisitorsregister`,

  MY_PRODUCTION_INDIVIDUAL_FILTERED: `${BASE_URL}/api/myproductionindividual`,



  //Dashboared Page   
  LEAVE_HOME: `${BASE_URL}/api/applyleaveshome`,
  LEAVE_HOME_LIST: `${BASE_URL}/api/applyleaveshomelist`,
  EMPLOYEE_HOME_COUNT: `${BASE_URL}/api/userwithstatushomecount`,
  RELEIVE_HOME_COUNT: `${BASE_URL}/api/userhomecountrelieve`,
  NOTCLOCKIN_HOME_COUNT: `${BASE_URL}/api/userhomecountnotclockin`,
  NOTCLOCKIN_HOME_COUNT_LIST: `${BASE_URL}/api/userhomecountnotclockinlist`,
  ALL_VISITORSFORCANDIDATE: `${BASE_URL}/api/allvisitorsforcandidate`,
  CANDIDATES_ALL_COUNT_HOME: `${BASE_URL}/api/allcandidatescounthome`,
  CANDIDATES_ALL_UPCOMING: `${BASE_URL}/api/allcandidatesupcominginterview`,



  //new dashboard

  PRODUCTION_INDIVIDUAL_HIERARCHYFILTER_HOME: `${BASE_URL}/api/productionhierarchyfilterhome`,
  APPLYLEAVE_FILTERED_HOME_COUNT: `${BASE_URL}/api/applyleavesfilterhomecount`,
  PERMISSIONS_HOME: `${BASE_URL}/api/persmissionshome`,
  LONG_ABSENT_HOME: `${BASE_URL}/api/longabsentrestrictionhierarchylistHome`,
  ADVANCE_HOME: `${BASE_URL}/api/advancebyassignbranchhome`,
  LOAN_HOME: `${BASE_URL}/api/loanbyassignbrachhome`,
  ADVANCE_HOME_LIST: `${BASE_URL}/api/advancebyassignbranchhomelist`,

  DAY_POINTS_FILTER_HOME: `${BASE_URL}/api/daypointsfilterhome`,
  TEMP_DAY_POINTS_FILTER_HOME: `${BASE_URL}/api/temppointsfilterhome`,
  ACCURACY_HOME: `${BASE_URL}/api/acheivedaccuracyindividualhome`,
  MINIMUM_HOME: `${BASE_URL}/api/getalluserstotalshiftdayshome`,
  USEREXCELDATA_HOME: `${BASE_URL}/api/usersexceldataassignbranchhome`,
  APPLY_LEAVE_HOME: `${BASE_URL}/api/applyleavesapprovedassignbranchhome`,
  EMP_DISTRIBUTION_HOME: `${BASE_URL}/api/employeeassetsaccesshome`,
  ASSET_HOME: `${BASE_URL}/api/assetdetailsfilteraccesshome`,
  ASSET_DAMAGE_HOME: `${BASE_URL}/api/assetdetailsdamagehome`,
  ASSET_REPAIR_HOME: `${BASE_URL}/api/assetdetailsrepairhome`,
  EXPENSES_HOME: `${BASE_URL}/api/allexpenseshome`,
  INCOME_HOME: `${BASE_URL}/api/incomeshome`,
  ASSIGNED_HOME: `${BASE_URL}/api/taskforassignedhome`,


  // PENDING_HOME: `${BASE_URL}/api/taskforpendinghome`,
  // FINISHED_HOME: `${BASE_URL}/api/taskforfinishedhome`,

  // COMPLETED_HOME: `${BASE_URL}/api/taskforcompletedhome`,
  // APPLICABLE_HOME: `${BASE_URL}/api/taskforapplicablehome`,


  // PAUSED_HOME: `${BASE_URL}/api/taskforpausedhome`,
  // POSTPONED_HOME: `${BASE_URL}/api/taskforpostponedhome`,

  RAISE_TICKET_HOME: `${BASE_URL}/api/raiseticketindividualfilterhome`,


  SALARYSLAB_LIMITEDASSIGNBRANCH_HOME: `${BASE_URL}/api/salaryslablimitedassignbranchhome`,
  REVENUEAMOUNTSLIMITED_HOME: `${BASE_URL}/api/revenueamountlimitedhome`,


  MAINTENANCE_HOME: `${BASE_URL}/api/sortedtaskmaintenanceforusershome`,
  MAINTENANCE_HOME_LIST: `${BASE_URL}/api/sortedtaskmaintenanceforusershomelist`,




  PRODUCTION_INDIVIDUAL_ONPROGRESS: `${BASE_URL}/api/onprogressindividuallimited`,
  PRODUCTION_INDIVIDUAL_COMPLETED: `${BASE_URL}/api/complatedindividuallimited`,
  PRODUCTION_INDIVIDUAL_PENDING: `${BASE_URL}/api/pendingindividuallimited`,
  PRODUCTION_INDIVIDUAL_MANUALSTATUS: `${BASE_URL}/api/manualstatusviceindividualsort`,
  PRODUCTION_INDIVIDUALMANUAL_EXCEL_OVERALL: `${BASE_URL}/api/manualstatusindividualexceloverall`,


  GETFILTEREUSERDATALONGABSEND_COMPLETED: `${BASE_URL}/api/getfilteralluserdatalongabsendcompleted`,
  GETFILTEREUSERDATALONGABSEND_HIRARCHY_COMPLETED: `${BASE_URL}/api/longabsentrestrictionhierarchylistcompleted`,




  //Penaltyerrorupload
  PENALTYERRORUPLOADS: `${BASE_URL}/api/penaltyerroruploads`,
  PENALTYERRORUPLOADS_CREATE: `${BASE_URL}/api/penaltyerroruploads/new`,
  PENALTYERRORUPLOADS_SINGLE: `${BASE_URL}/api/penaltyerroruploads`,
  MULTIPLEPENALTYERRORUPLOAD_SINGLE: `${BASE_URL}/api/multiplepenaltyerroruploads`,





  //Penaltyerrorupload
  BULK_ERROR_UPLOADS: `${BASE_URL}/api/bulkerroruploads`,
  BULK_ERROR_UPLOADS_FILTER: `${BASE_URL}/api/multiplebulkerroruploadsfilter`,
  BULK_ERROR_UPLOADS_CREATE: `${BASE_URL}/api/bulkerroruploads/new`,
  BULK_ERROR_UPLOADS_SINGLE: `${BASE_URL}/api/bulkerroruploadssingle`,
  MULTIPLE_BULK_ERROR_UPLOAD_SINGLE: `${BASE_URL}/api/multiplebulkerroruploads`,

  BULK_ERROR_UPLOADS_FILENAME: `${BASE_URL}/api/bulkerroruploadsfilename`,
  BULK_ERROR_UPLOADS_FILENAME_UNIQUE: `${BASE_URL}/api/bulkerroruploadsunique`,
  BULK_ERROR_UPLOADS_FILTER_LIST: `${BASE_URL}/api/bulkerroruploadsfilterlist`,
  PENALTYERRORUPLOADS_DATE_FILTER: `${BASE_URL}/api/penaltyerroruploadsdatefilter`,
  PENALTYERRORUPLOADS_PROJECT_BASED_FILTER: `${BASE_URL}/api/penaltyerroruploadsprojectbasedfilter`,
  PENALTYERRORUPLOADS_SORT: `${BASE_URL}/api/penaltyerroruploadssort`,






  //Penalty Total Filed Upload
  PENALTYTOTALFIELDUPLOAD: `${BASE_URL}/api/penaltytotalfielduploads`,
  PENALTYTOTALFIELDUPLOAD_LOGIN_PROJECT: `${BASE_URL}/api/penaltytotalfielduploadloginproject`,
  PENALTYTOTALFIELDUPLOAD_DATEFILTER: `${BASE_URL}/api/penaltytotalfielduploaddatefilters`,
  PENALTYTOTALFIELDUPLOAD_CREATE: `${BASE_URL}/api/penaltytotalfieldupload/new`,
  PENALTYTOTALFIELDUPLOAD_SINGLE: `${BASE_URL}/api/penaltytotalfieldupload`,
  MULTIPLEPENALTYTOTALFIELDUPLOAD_SINGLE: `${BASE_URL}/api/multiplepenaltytotalfieldupload`,


  ERROR_UPLOAD_CONFIRM_HIERARCHY: `${BASE_URL}/api/erroruploadconfirmhierarchylist`,

  CHECK_DUPE_BILL_EB: `${BASE_URL}/api/checkdupebill`,
  CHECK_DUPE_DAILY_EB: `${BASE_URL}/api/checkdupedaily`,
  CHECK_DUPE_MONTH_EB: `${BASE_URL}/api/checkdupemonth`,
  CHECK_DUPE_BILL_BEFORE_EB: `${BASE_URL}/api/checkdupebillbefore`,



  CHECK_DUPE_BILL_EB_EDIT: `${BASE_URL}/api/checkdupebilledit`,
  CHECK_DUPE_DAILY_EB_EDIT: `${BASE_URL}/api/checkdupedailyedit`,
  CHECK_DUPE_MONTH_EB_EDIT: `${BASE_URL}/api/checkdupemonthedit`,
  CHECK_DUPE_BILL_BEFORE_EB_EDIT: `${BASE_URL}/api/checkdupebillbeforeedit`,




  PRODUCTION_INDIVIDUAL_EXCEL: `${BASE_URL}/api/productionindividualexcel`,
  PRODUCTION_INDIVIDUAL_OVEALL_EXCEL: `${BASE_URL}/api/productionindividualoveallexcel`,
  PRODUCTION_INDIVIDUAL_OVEALL_EXCEL_PENDING: `${BASE_URL}/api/productionindividualoveallexcelpending`,


  VALIDATION_ERROR_FILTER: `${BASE_URL}/api/validationerrorfilters`,

  VENDORMASTER_LIMITED_NAMEONLY: `${BASE_URL}/api/vendormasterlimitednameonly`,
  PRODUCTIONPROCESSQUEUE_LIMITED_BYPROJECT: `${BASE_URL}/api/productionprocessqueuelimitedbyproject`,

  FETCH_FIELDNAME_BYPROCESS: `${BASE_URL}/api/fetchfieldnamebyprocess`,
  ERRORMODE_UNALLOT_LIST: `${BASE_URL}/api/errormodeunallotlist`,
  GET_ORGIN_DATA: `${BASE_URL}/api/getorgindata`,

  ERRORMODE_UNALLOT_LIST: `${BASE_URL}/api/errormodeunallotlist`,
  ERRORMODE_ALLOTED_LIST: `${BASE_URL}/api/errormodeallotedlist`,
  ERRORMODES: `${BASE_URL}/api/errormodes`,
  ERRORMODE_CREATE: `${BASE_URL}/api/errormode/new`,
  ERRORMODE_SINGLE: `${BASE_URL}/api/errormode`,


  //validation error

  ERROR_TYPE_FILTER: `${BASE_URL}/api/errortypefilter`,
  ERROR_REASON_FILTER: `${BASE_URL}/api/penaltyerrorreasonfilter`,
  ERROR_REASON_FILTER_STATUS: `${BASE_URL}/api/errortypefilterstatus`,
  ERROR_MODE_FILTER: `${BASE_URL}/api/errormodefilter`,


  PENALTY_TOTAL_FIELD_VALIDATION_ENTRY_FILTER: `${BASE_URL}/api/penaltytotalfielduploadsvalidation`,

  INVALID_ERROR_ENTRY_HIERARCHY: `${BASE_URL}/api/invaliderrorentryhierarchy`,
  VALIDATE_ERROR_ENTRY_HIERARCHY: `${BASE_URL}/api/validaterrorentryhierarchy`,

  ASSIGN_INTERVIEWER_VISITOR: `${BASE_URL}/api/assigninterviewervisitor`,

  VISITOR_DATA: `${BASE_URL}/api/visitorsdata`,

  ERAAMOUNT_SORT: `${BASE_URL}/api/eraamountsort`,


  CLIENTUSERID_LIMITED_USER: `${BASE_URL}/api/clientuseridlimiteduser`,


  CLIENTUSERID_LIMITED_BYCOMPNYNAME: `${BASE_URL}/api/clientuseridlimitedtimestudybycompanyname`,

  CATEGORYPROD_LIMITED_REPORT_MULTI: `${BASE_URL}/api/categoryprodlimitedreportsmultiselect`,
  SUBCATEGORYPROD_LIMITED_REPORT_MULTI: `${BASE_URL}/api/subcategoryprodlimitedreportsmultiselect`,


  PRODUCTION_INDIVIDUAL_FILTER_LIST: `${BASE_URL}/api/productionindividuallistfilter`,
  CLIENTUSERID_LIMITED_BYCOMPNYNAME_MULTI: `${BASE_URL}/api/clientuseridlimitedtimestudybycompanynamemulti`,


  MANAGE_STOCK_ITEMS_PAGINATION: `${BASE_URL}/api/managestockitemspagination`,
  MANAGE_STOCK_ACCESS_PAGINATION: `${BASE_URL}/api/stockmanagesaccessstock`,
  STOCK_ACCESS_PAGINATION: `${BASE_URL}/api/stocksaccessstock`,
  MANUAL_STOCK_ACCESS_PAGINATION: `${BASE_URL}/api/manualstocksaccessstock`,

  FILTERED_ASSETMATERIAL_IP: `${BASE_URL}/api/assetmaterialipfilter`,
  FILTERED_WOKRSTATIONGROUPING: `${BASE_URL}/api/assetworkgrpslist`,


  ASSET_DATA_FILTER_ACCESS_OLD: `${BASE_URL}/api/assetdetailsfilteraccessold`,


  CHEKCK_MANAGER_APPROVE_PENALTYTOTAL: `${BASE_URL}/api/checkmanager`,



  //type master production
  PRODUCTION_TYPEMASTER: `${BASE_URL}/api/productiontypemasters`,
  PRODUCTION_TYPEMASTER_CREATE: `${BASE_URL}/api/productiontypemaster/new`,
  PRODUCTION_TYPEMASTER_SINGLE: `${BASE_URL}/api/productiontypemaster`,


  //Queue type master production
  PRODUCTION_QUEUETYPEMASTER: `${BASE_URL}/api/productionqueuequeuetypemasters`,
  PRODUCTION_QUEUETYPEMASTER_UNITRATE: `${BASE_URL}/api/productionqueuemasterunitrate`,
  PRODUCTION_QUEUETYPEMASTER_CREATE: `${BASE_URL}/api/productionqueuetypemaster/new`,
  PRODUCTION_QUEUETYPEMASTER_SINGLE: `${BASE_URL}/api/productionqueuetypemaster`,


  ORATE_VALUE_BY_QUEUEMASTER: `${BASE_URL}/api/orratevaluequeuemaster`,
  PRODUCTION_QUEUETYPEMASTER_DUPLICATE: `${BASE_URL}/api/queuetypemasterduplicate`,



  OTHER_TASK_CONSOLIDATED_REPORT: `${BASE_URL}/api/othertaskconsolidatedreport`,
  OTHER_TASK_INDIVIDUAL_REPORT: `${BASE_URL}/api/othertaskindividualreport`,



  GET_DAY_POINTS_BY_DATE: `${BASE_URL}/api/getdaypointsdate`,
  GET_DAY_POINTS_TEMP_BY_DATE: `${BASE_URL}/api/daypointstempbydate`,
  PAY_RUN_LIST_CONSOLIDATED_DATE: `${BASE_URL}/api/payrunlistsconsolidateddate`,
  PAY_RUN_LIST_CONSOLIDATED_DATE_TEMP: `${BASE_URL}/api/payrunlistsconsolidateddatetemp`,



  UNITRATE_PRODUCTION_ORATE_CATEGORY: `${BASE_URL}/api/unitrateoratecategory`,
  UNITRATE_PRODUCTION_ORATE_SUBCATEGORY: `${BASE_URL}/api/unitsrateoratesubcategory`,
  QUEUE_TYPE_MASTER_CATEGORY_WISE_TYPE: `${BASE_URL}/api/queuetypecategorywisetype`,
  QUEUE_TYPE_MASTER_SUBCATEGORY_WISE_TYPE: `${BASE_URL}/api/queuetypesubcategorywisetype`,
  PRODUCTIONUPLOAD_QUEUE_TYPE_MASTER: `${BASE_URL}/api/productionuploadqueuemasterfilter`,
  CATEGORY_PROD_LIMITED_QUEUE_TYPE_MASTER: `${BASE_URL}/api/categoryprodlimitedproductionqueuetypemaster`,
  QUEUE_TYPE_VENDOR_DROP: `${BASE_URL}/api/queuetypevendordrop`,
  QUEUE_TYPE_CATEGORY_DROP: `${BASE_URL}/api/queuetypecategorydrop`,
  QUEUE_TYPE_TYPE_DROP: `${BASE_URL}/api/queuetypetypedrop`,
  CATEGORY_PROD_LIMITED_NAMEONLY: `${BASE_URL}/api/categorylimitednameonly`,
  SUBCATEGORYPROD_LIMITED_BYPROJ_CATE: `${BASE_URL}/api/subcategoryalllimitedbyprojcate`,
  FETCH_ENABLEPAGES_BASED_PROJ_CATE_SUB: `${BASE_URL}/api/VALIDATION_ERROR_FILTER`,

  PRODUCTION_MANUALENTRY_DUPECHECK: `${BASE_URL}/api/productionmanualentrydupecheck`,

  PROJECTMASTER_LIMITED: `${BASE_URL}/api/projectmasterslimitedname`,

  PENALTYTOTALFIELDUPLOAD_INVALID_REJECTED: `${BASE_URL}/api/penaltytotaluploadinvalidreject`,


  CHECK_PAYRUN_ISCREATED_FOR_PENALTYDAYUPLOAD: `${BASE_URL}/api/checkpayruniscreatedforpenaltydayupload`,

  VALID_OK_ENTRY: `${BASE_URL}/api/validokentry`,
  VALID_OK_ENTRY_ALERT: `${BASE_URL}/api/validokentryalert`,


  PRODUCTIONUPLOAD_QUEUE_TYPE_MASTER_COUNT: `${BASE_URL}/api/productionuploadqueuemasterfiltercount`,

  PRODUCTION_ORGINAL_LIMITED_LASTTHREE: `${BASE_URL}/api/productionoriginallastthree`,
  CHECK_ISDAYPOINT_CREATED: `${BASE_URL}/api/checkdaypointiscreated`,
  PRODUCTION_UPLOAD_FILENAMEONLY_BULKDOWNLOAD: `${BASE_URL}/api/productionuploadfilenameonlybulkdownload`,
  CATEGORYPROD_LIMITED_ORIGINAL: `${BASE_URL}/api/categoryprodlimitedoriginal`,
  CATEGORYPROD_LIMITED_ORIGINAL_FLAGCALC: `${BASE_URL}/api/categoryprodlimitedorgflagcalc`,
  CATEGORYPROD_LIMITED_UPLOAD: `${BASE_URL}/api/categorylimitedkeyword`,

  QUEUE_TYPE_MASTER_VENDOR_MASTER: `${BASE_URL}/api/queuetypevendormasterdrop`,



  //Other Task upload List
  PRODUCTION_UPLOAD_OTHER: `${BASE_URL}/api/productionuploadsother`,
  PRODUCTION_UPLOAD_CREATE_OTHER: `${BASE_URL}/api/productionuploadother/new`,
  PRODUCTION_UPLOAD_SINGLE_OTHER: `${BASE_URL}/api/productionuploadother`,
  PRODUCTION_UPLOAD_FILENAMELIST_OTHER: `${BASE_URL}/api/productionuploadfilenamelistother`,
  PRODUCTION_UPLOAD_FILENAMEONLY_OTHER: `${BASE_URL}/api/productionuploadfilenameonlyother`,
  PRODUCTION_UPLOAD_GETDELETEDATAS_OTHER: `${BASE_URL}/api/productionuploadgetdeletedatasother`,
  PRODUCTION_UPLOAD_GETDELETEDATASALL_OTHER: `${BASE_URL}/api/productionuploadgetdeletedatasallother`,
  PRODUCTION_UPLOAD_DELETEMULTI_OTHER: `${BASE_URL}/api/productionuploaddeletemultiother`,
  PRODUCTION_UPLOAD_OVERALL_FETCH_LIMITED_OTHER: `${BASE_URL}/api/productionuploadoverallfetchlimitedother`,
  GET_PRODUCTION_SINGLE_DAYUSER_OTHER: `${BASE_URL}/api/getproductionsignledayuserother`,

  CHECK_ZERO_MISMATCH_PRESENT_OTHER: `${BASE_URL}/api/checkzeromismatchpresentother`,

  PRODUCTION_UPLOAD_GET_UNITRATEUPDATE_OVERALL_FETCH_LIMITED_OTHER: `${BASE_URL}/api/productionuploadunitrateoverallfetchlimitedother`,

  PRODUCTION_UNALLOT_FILTER_OTHER: `${BASE_URL}/api/productionunallotfilterother`,
  PRODUCTION_UNALLOT_FILTER_VIEW_OTHER: `${BASE_URL}/api/productionunallotfilterviewother`,
  PRODUCTION_UNALLOT_FILTER_VIEW_Manual_OTHER: `${BASE_URL}/api/productionunallotfilterviewmanualother`,
  GET_MISMATCH_UPDATEDLIST_OTHER: `${BASE_URL}/api/getmismatchupdatedlistother`,
  UPDATE_UNDO_FIELDNAME_OTHER: `${BASE_URL}/api/updatefieldundonameother`,
  PRODUCTION_UPLOAD_GETDATAS_BYID_OTHER: `${BASE_URL}/api/getproductionuploaddatasbyidother`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG_OTHER: `${BASE_URL}/api/updatedbulkdatasunitandflagother`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY_OTHER: `${BASE_URL}/api/updatedbulkdatasunitonlyother`,
  PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY_OTHER: `${BASE_URL}/api/updatedbulkdatasflagonlyother`,
  PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION_OTHER: `${BASE_URL}/api/updatedbulkdatasunitandsectionother`,
  PRODUCTION_ORIGINAL_UNITRATE_BULK_UPDATECATSUBCATEGORY_OTHER: `${BASE_URL}/api/bulkproductionorgupdatecategorysubcategoryother`,
  BULK_DELETE_UNITRATE_UNALLOT_OTHER: `${BASE_URL}/api/bulkdeleteunitrateunallotother`,
  PRODUCTION_UPLOAD_FILENAMEONLY_BULKDOWNLOAD_OTHER: `${BASE_URL}/api/productionuploadfilenameonlybulkdownloadother`,



  //OTHER TASK UPLOAD 
  PRODUCTION_ORGINAL_OTHER_OTHER: `${BASE_URL}/api/othertaskuploads`,
  PRODUCTION_ORGINAL_LIMITED_OTHER: `${BASE_URL}/api/othertaskuploadslimited`,
  PRODUCTION_ORGINAL_UNIQID_OTHER: `${BASE_URL}/api/othertaskuploadslimiteduniqid`,
  PRODUCTION_ORGINAL_CREATE_OTHER: `${BASE_URL}/api/othertaskupload/new`,
  PRODUCTION_ORGINAL_SINGLE_OTHER: `${BASE_URL}/api/othertaskupload`,
  GET_UNIQID_FROM_DATE_PRODUPLOAD_OTHER: `${BASE_URL}/api/getuniqidfromdateproduploadother`,
  PRODUCTION_ORGINAL_LIMITED_LASTTHREE_OTHER: `${BASE_URL}/api/othertaskuploadlastthree`,
  PRODUCTION_ORGINAL_LIMITED_FILTER_OTHER: `${BASE_URL}/api/othertaskuploadslimitedfilter`,

  PRODUCTION_UPLOAD_OVERALL_FETCH_LIMITEDNEW_OTHER: `${BASE_URL}/api/productionuploadoverallfetchlimitednewother`,
  PRODUCTION_UPLOAD_CHECKSTATUS_OTHER: `${BASE_URL}/api/productionuploadcheckstatusother`,


  EXCELFILEUPLOADSTORE_OTHERTASK: `${BASE_URL}/api/uploadothertask`,



  MATERIAL_WISE_ASSET_LIST: `${BASE_URL}/api/allmaterialwiseassetlist`,





  //Maintance Details Master
  MAINTENANCEDETAILSMASTER: `${BASE_URL}/api/maintenancedetailsmaster`,
  MAINTENANCEDETAILSMASTER_GETDATA: `${BASE_URL}/api/maintenancedetailsmastergetdata`,
  MAINTENANCEDETAILSMASTER_CREATE: `${BASE_URL}/api/maintenancedetailsmaster/new`,
  MAINTENANCEDETAILSMASTER_SINGLE: `${BASE_URL}/api/maintenancedetailsmaster`,
  MAINTENANCEDETAILSMASTER_SINGLE_GROUP: `${BASE_URL}/api/maintenancedetailsmastergroup`,
  MAINTENANCEDETAILSMASTER_SINGLE_GROUP_DELETE: `${BASE_URL}/api/maintenancedetailsmastergroupdelete`,

  ASSET_MATCHED_SUBCOMPONENT: `${BASE_URL}/api/matchedassetsubcomponent`,
  INDIVIDUAL_EMPLOYEE_ASSET: `${BASE_URL}/api/individualemployeeassets`,


  ASSET_DISTRIBUTION_GROUPED_DATAS: `${BASE_URL}/api/assetdistributiongroupeddatas`,
  ASSET_DISTRIBUTION_LOG_DATAS: `${BASE_URL}/api/assetdistributionlogdatas`,

  ASSET_DISTRIBUTION_STATUS: `${BASE_URL}/api/markassetdistributedstatus`,
  TEAM_ASSET_DISTRIBUTION_LIST: `${BASE_URL}/api/teamemployeeassets`,
  FILTER_DISTRIBUTION_LIST: `${BASE_URL}/api/assetdistributiondetailsfilter`,




  //group overall edit and delete
  OVERALL_DELETE_ACCOUNT_GROUP: `${BASE_URL}/api/groupoveralldeleteaccountgroup`,
  OVERALL_EDIT_ACCOUNT_GROUP: `${BASE_URL}/api/groupoveralleditaccountgroup`,

  //accountgroup overall edit and delete
  OVERALL_DELETE_ACCOUNT_HEAD: `${BASE_URL}/api/accountgroupoveralldelete`,
  OVERALL_EDIT_ACCOUNT_HEAD: `${BASE_URL}/api/accountgroupoveralledit`,

  //accounthead overall edit and delete
  OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA: `${BASE_URL}/api/overalldeleteaccheadlinkeddata`,
  OVERALL_EDIT_ACCOUNT_HEAD_LINKED_DATA: `${BASE_URL}/api/overalleditaccheadlinkeddata`,



  OVERALL_DELETE_TYPE_MASTER_LINKED_DATA: `${BASE_URL}/api/overalldeletetypemasterlinkeddata`,
  OVERALL_EDIT_TYPE_MASTER_LINKED_DATA: `${BASE_URL}/api/overalledittypemasterlinkeddata`,


  OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA: `${BASE_URL}/api/overalldeleteassetmateriallinkeddata`,
  OVERALL_EDIT_ASSET_MATERIAL_LINKED_DATA: `${BASE_URL}/api/overalleditassetmateriallinkeddata`,

  OVERALL_DELETE_ASSET_SPECIFICATION_LINKED_DATA: `${BASE_URL}/api/overalldeleteassetspecificationlinkeddata`,
  OVERALL_DELETE_ASSET_SPECIFICATION_LINKED_DATA_SINGLE: `${BASE_URL}/api/overalldeleteassetspecificationlinkeddatasingle`,

  OVERALL_EDIT_ASSET_SPECIFICATION_LINKED_DATA: `${BASE_URL}/api/overalleditassetspecificationlinkeddata`,

  OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA: `${BASE_URL}/api/overalldeletevendormasterlinkeddata`,
  OVERALL_EDIT_VENDOR_MASTER_LINKED_DATA: `${BASE_URL}/api/overalleditvendormasterlinkeddata`,

  OVERALL_DELETE_VENDOR_GROUPING_LINKED_DATA: `${BASE_URL}/api/overalldeletevendorgroupinglinkeddata`,
  OVERALL_EDIT_VENDOR_GROUPING_LINKED_DATA: `${BASE_URL}/api/overalleditvendorgroupinglinkeddata`,

  OVERALL_DELETE_FREQUENCY_LINKED_DATA: `${BASE_URL}/api/overalldeletefrequencylinkeddata`,
  OVERALL_EDIT_FREQUENCY_LINKED_DATA: `${BASE_URL}/api/overalleditfrequencylinkeddata`,

  OVERALL_DELETE_UOM_LINKED_DATA: `${BASE_URL}/api/overalldeleteuomlinkeddata`,
  OVERALL_EDIT_UOM_LINKED_DATA: `${BASE_URL}/api/overalledituomlinkeddata`,

  OVERALL_DELETE_ASSET_LIST_LINKED_DATA: `${BASE_URL}/api/overalldeleteassetmasterlinkeddata`,
  OVERALL_EDIT_ASSET_LIST_LINKED_DATA: `${BASE_URL}/api/overalleditassetmasterlinkeddata`,

  OVERALL_DELETE_ASSET_SPECIFICATION_GROUPING_LINKED_DATA: `${BASE_URL}/api/overalldeleteassetspecificationgrouping`,
  OVERALL_EDIT_ASSET_SPECIFICATION_GROUPING_LINKED_DATA: `${BASE_URL}/api/overalleditassetspecificationgrouping`,

  OVERALL_EDIT_ASSET_SPECIFICATION_GROUPING_ARRAY_LINKED_DATA: `${BASE_URL}/api/editarrayassetspecification`,




  PRODUCTION_ORIGINAL_SUMMARY_REPORT: `${BASE_URL}/api/productionuploadoriginalsummayreport`,


  PRODUCTION_TEMP_SUMMARY_REPORT: `${BASE_URL}/api/productiontempsummayreport`,
  GET_PENALTYDAYUPLOAD_FILTER: `${BASE_URL}/api/penaltydayuploadsfilter`,
  GET_PENALTYDAYUPLOAD_FILTER_LIST: `${BASE_URL}/api/penaltydayuploadsfilterlist`,
  GET_PENALTYDAYUPLOAD_BY_DATE: `${BASE_URL}/api/penaltydayuploadbydate`,


  //PRODUCITONUPLOAD BULK 
  GET_PRODUCTIONUPLOAD_BULK_ALL: `${BASE_URL}/api/productionuploadbulks`,
  GET_PRODUCTIONUPLOAD_BULK_CREATE: `${BASE_URL}/api/productionuploadbulk/new`,
  GET_PRODUCTIONUPLOAD_BULK_SINGLE: `${BASE_URL}/api/productionuploadbulk`,
  PRODUCTON_SUMMMARY_BULK_UNDO: `${BASE_URL}/api/productionsummarybulkundo`,
  PRODUCTON_SUMMMARY_BULK_FILTER: `${BASE_URL}/api/productionsummaryuploadpbulkfilter`,
  PRODUCTION_ORIGINAL_SUMMARY_REPORT_BULK: `${BASE_URL}/api/productionuploadoriginalsummayreportbulk`,


  //PRODUCITONTEMP BULK 
  GET_PRODUCTIONTEMP_BULK_ALL: `${BASE_URL}/api/productiontempbulks`,
  GET_PRODUCTIONTEMP_BULK_CREATE: `${BASE_URL}/api/productiontempbulk/new`,
  GET_PRODUCTIONTEMP_BULK_SINGLE: `${BASE_URL}/api/productiontempbulk`,
  PRODUCTON_SUMMMARY_TEMP_BULK_UNDO: `${BASE_URL}/api/productionsummarytempbulkundo`,
  PRODUCTON_SUMMMARY_BULK_TEMP_FILTER: `${BASE_URL}/api/productionsummarytempbulkfilter`,

  PRODUCTION_ORIGINAL_SUMMARY_REPORT_VIEW: `${BASE_URL}/api/productionuploadoriginalsummayreportview`,
  PRODUCTION_TEMP_SUMMARY_REPORT_VIEW: `${BASE_URL}/api/productiontempsummayreportview`,





  CREATE_ASSETSOFTWAREGROUPING: `${BASE_URL}/api/assertsoftwaregrouping/new`,
  SINGLE_ASSETSOFTWAREGROUPING: `${BASE_URL}/api/assertsoftwaregrouping`,
  ALL_ASSETSOFTWAREGROUPING: `${BASE_URL}/api/assertsoftwaregroupings`,

  CREATE_SOFTWARESPECIFICATION: `${BASE_URL}/api/softwarespecification/new`,
  SINGLE_SOFTWARESPECIFICATION: `${BASE_URL}/api/softwarespecification`,
  ALL_SOFTWARESPECIFICATION: `${BASE_URL}/api/softwarespecifications`,


  ASSET_CREATE_SOFTWARE: `${BASE_URL}/api/assetsoftwaredetail/new`,
  ASSET_SINGLE_SOFTWARE: `${BASE_URL}/api/assetsoftwaredetail`,
  ALL_ASSET_SOFTWARE: `${BASE_URL}/api/assetsoftwaredetails`,
  ASSETDETAIL_GETVENDOR: `${BASE_URL}/api/assetgetvendor`,
  ASSET_SOFTWARE_DATA_FILTER: `${BASE_URL}/api/assetsoftwaredetaillistfilter`,


  CREATE_STOCK_MANAGEMENT: `${BASE_URL}/api/stockmanagement/new`,
  SINGLE_STOCK_MANAGEMENT: `${BASE_URL}/api/stockmanagement`,
  ALL_STOCK_MANAGEMENT: `${BASE_URL}/api/stockmanagements`,

  STOCKPURCHASELIMITED_USAGE_COUNT: `${BASE_URL}/api/stockpurchaselimitedusagecount`,


  STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION: `${BASE_URL}/api/stockpurchaselimitedusagecountnotification`,


  STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION_LIST: `${BASE_URL}/api/stockpurchaselimitedusagecountnotificationlist`,


  STOCKPURCHASELIMITED_HAND_TODO_NOTIFICATION: `${BASE_URL}/api/stockpurchaselimitedhandtodonotification`,
  STOCKPURCHASELIMITED_HAND_TODO_RETURN_NOTIFICATION: `${BASE_URL}/api/stockpurchaselimitedhandtodoreturnnotification`,
  STOCKMANAGEMENT_VIEW_DATE: `${BASE_URL}/api/stockmanagementviewdate`,
  STOCKMANAGEMENT_VIEW_DATE_STOCK_MATERIAL: `${BASE_URL}/api/stockmanagementviewdatestockmaterial`,
  USAGE_COUNT_CREATE_LIST: `${BASE_URL}/api/stockpurchaselimitedusagecountcreatelist`,
  STOCKMANAGEMENT_VIEW_DATE_INDIVIDUAL: `${BASE_URL}/api/stockmanagementviewdateindividual`,
  STOCK_COUNT: `${BASE_URL}/api/stockcount`,
  STOCK_COUNT_USAGE: `${BASE_URL}/api/stockcountusage`,
  STOCK_OVERALL_REPORT: `${BASE_URL}/api/stockoverallreport`,

  QUEUETYPE_OTHER_TASK_UPLOAD: `${BASE_URL}/api/queuetypeothertaskupload`,
  QUEUETYPE_OTHER_TASK_UPLOAD_MATCHED: `${BASE_URL}/api/queuetypeothertaskuploadmatched`,
  QUEUETYPE_OTHER_TASK_UPLOAD_CATEGORY_WISE_CREATE: `${BASE_URL}/api/queuetypeothertaskuploadcategorycreate`,




  QUEUETYPE_TYPE_UNASSIGNED: `${BASE_URL}/api/productionuploadqueuemasterfilterunassigned`,
  TYPEWITHSOFTWARE: `${BASE_URL}/api/typewithsoftwareasset`,

  ASSETWORKSTAION_LIMITED_BY_WORKSTATION: `${BASE_URL}/api/assetworkstationlimitedbyworkstation`,

  EXCEL_DOWNLOAD_ASSET: `${BASE_URL}/api/exceldownloadasset`,
  EXCEL_DOWNLOAD_STOCK: `${BASE_URL}/api/exceldownloadstock`,
  PDF_DOWNLOAD_ASSET: `${BASE_URL}/api/exceldownloadassetpdf`,



  TASK_MAINTENANCE_OVERALL_REPORT: `${BASE_URL}/api/taskmaintenanceforusersoverallreport`,
  MAINTENANCE_EXCEL_LIMITED: `${BASE_URL}/api/maintentancesaccessexcellimited`,
  TASK_NON_SCHEDULE_GROUPING_MATERIAL_IP: `${BASE_URL}/api/taskmaintenancenonschedulegroupingsassetip`,
  TASK_PANEL_VIEW_LIMITED: `${BASE_URL}/api/taskmaintenanceforuserpanelview`,



  BILLNO_DUPLICATIION: `${BASE_URL}/api/stockbillduplicate`,



  MANUAL_STOCK_LIMITED: `${BASE_URL}/api/manualstocklimited`,
  MANUAL_STOCK_LIMITED_USAGE_COUNT: `${BASE_URL}/api/manualstocklimitedusagecount`,
  MANUAL_STOCK_LIMITED_HANDOVER: `${BASE_URL}/api/manualstocklimitedhandover`,
  MANUAL_STOCK_LIMITED_RETURN: `${BASE_URL}/api/manualstocklimitedreturn`,

  EBSERVICEMASTERLIVE: `${BASE_URL}/api/ebservicemasterlive`,



  MANUAL_STOCK_EXCEL_ASSET: `${BASE_URL}/api/manualstocklimitedexcelasset`,
  MANUAL_STOCK_EXCEL_STOCK: `${BASE_URL}/api/manualstocklimitedexcelstock`,



  STOCK_BALANCE_COUNT: `${BASE_URL}/api/stockpurchaselimitedbalancecount`,

  STOCK_MANAGE_ALERT_COUNT: `${BASE_URL}/api/stockmanagealertcount`,
  STOCK_FILTER_ACCESS_VERIFICATION: `${BASE_URL}/api/stockfilteraccessverification`,

  STOCKMANAGE_SINGLE_UPDATE_MOVE: `${BASE_URL}/api/stockmanagesingleupdatemove`,


  GET_OLD_MATERIAL_QTY: `${BASE_URL}/api/getoldmaterialqty`,
  GET_OLD_MATERIAL_QTY_EDIT: `${BASE_URL}/api/getoldmaterialqtyedit`,


  //REORDER
  STOCK_PURCHASE_LIMITED_REORDER: `${BASE_URL}/api/stockpurchaselimitedreorder`,
  EBREADING_DETAILS_SERVICE_STATUS: `${BASE_URL}/api/ebreadingdetailsservicestatus`,
  EBSERVICE_FILTER: `${BASE_URL}/api/ebservicemastersfilter`,



  IPMASTER_PAGINATION_LIST: `${BASE_URL}/api/ipmastersaccesspaginationlist`,
  IP_MASTER_UPLOAD_EXCELDOWNLOAD: `${BASE_URL}/api/ipmasterexceldownload`,
  IP_MASTER_UPLOAD_CSVDOWNLOAD: `${BASE_URL}/api/ipmastercsvdownload`,
  IP_MASTER_UPLOAD_PDFDOWNLOAD: `${BASE_URL}/api/ipmasterpdfdownload`,


  UNASSIGNEDIPS: `${BASE_URL}/api/getallipconfigunassigned`,

  IP_MASTER_ASSIGNED: `${BASE_URL}/api/ipmastersassigned`,
  IP_MASTER_UNASSIGNED: `${BASE_URL}/api/ipmastersunassigned`,

  ACTIVEALL_PASSWORD_ACCESS_FILTER: `${BASE_URL}/api/activeallpasswordsaccessfilter`,
  PASSWORD_ACCESS_CONTROL_FILTER: `${BASE_URL}/api/allpasswordsaccessfilter`,

  UPLOAD_CHUNK_STOCK: `${BASE_URL}/api/uploadchunkstock`,
  STOCK_TODO_EDIT_FETCH: `${BASE_URL}/api/stocktodoeditfetch`,
  EDIT_OLDDATA_DELETE: `${BASE_URL}/api/stocktododelete`,







};


