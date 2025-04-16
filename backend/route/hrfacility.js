const express = require("express");
const hrfacilityRoute = express.Router();

// connect Branch controller
const { getAllBranch, addBranch, getBranchAddress,getAllBranchQrCode, updateBranch, getSingleBranch, deleteBranch, getOverAllBranch, getAllBranchCheck } = require("../controller/modules/branch");

hrfacilityRoute.route("/branches").get(getAllBranch);
hrfacilityRoute.route("/branch/new").post(addBranch);
hrfacilityRoute.route("/branchesqrcode").post(getAllBranchQrCode);
hrfacilityRoute.route("/branch/:id").get(getSingleBranch).put(updateBranch).delete(deleteBranch);
hrfacilityRoute.route("/getoverallbranch").post(getOverAllBranch);
hrfacilityRoute.route("/checkbranch").post(getAllBranchCheck);
hrfacilityRoute.route("/branchaddress").post(getBranchAddress);

// connect "Unit" controller
const { getQueueReports, getUnitResult, getCustDropdowns, getAllBranchUnits, getProcessDropdowns, getUnitarrayList, getAllUnit, addUnit, updateUnit, getSingleUnit, deleteUnit, getOverAllUnits, getAllUnitCheck } = require("../controller/modules/unit");

hrfacilityRoute.route("/units").get(getAllUnit);
hrfacilityRoute.route("/unit/new").post(addUnit);
hrfacilityRoute.route("/unit/:id").get(getSingleUnit).put(updateUnit).delete(deleteUnit);
hrfacilityRoute.route("/unitresult").post(getUnitResult);
hrfacilityRoute.route("/unitarraylist").post(getUnitarrayList);
hrfacilityRoute.route("/custdropdowns").post(getCustDropdowns);
hrfacilityRoute.route("/processdropdwons").post(getProcessDropdowns);
hrfacilityRoute.route("/queuereports").post(getQueueReports);
hrfacilityRoute.route("/getoverallunits").post(getOverAllUnits);
hrfacilityRoute.route("/unitcheck").post(getAllUnitCheck);
hrfacilityRoute.route("/branchunits").post(getAllBranchUnits);

// connect Area controller..
const { getAllArea, addArea, updateArea, getSingleArea, deleteArea } = require("../controller/modules/area");
hrfacilityRoute.route("/areas").get(getAllArea);
hrfacilityRoute.route("/area/new").post(addArea);
hrfacilityRoute.route("/area/:id").get(getSingleArea).put(updateArea).delete(deleteArea);
// connect customer group controller
const { getAllLocationDetails, addLocationDetails, updateLocationDetails, getSingleLocationDetails, deleteLocationDetails } = require("../controller/modules/location");

hrfacilityRoute.route("/locations").get(getAllLocationDetails);
hrfacilityRoute.route("/location/new").post(addLocationDetails);
hrfacilityRoute.route("/location/:id").get(getSingleLocationDetails).put(updateLocationDetails).delete(deleteLocationDetails);

// connect Floor controller..

const { getAllFloor, addFloor, updateFloor, getSingleFloor, deleteFloor, getOverAllFloor, getAllFloorCheck } = require("../controller/modules/floor");
hrfacilityRoute.route("/floors").get(getAllFloor);
hrfacilityRoute.route("/floor/new").post(addFloor);
hrfacilityRoute.route("/floor/:id").get(getSingleFloor).put(updateFloor).delete(deleteFloor);
hrfacilityRoute.route("/getoverallfloor").post(getOverAllFloor);
hrfacilityRoute.route("/floorcheck").post(getAllFloorCheck);

// connect Intern Course controller..

const { getAllInternCourse, addInternCourse, updateInternCourse, getSingleInternCourse, deleteInternCourse } = require("../controller/modules/internCourse");
hrfacilityRoute.route("/internCourses").get(getAllInternCourse);
hrfacilityRoute.route("/internCourse/new").post(addInternCourse);
hrfacilityRoute.route("/internCourse/:id").get(getSingleInternCourse).put(updateInternCourse).delete(deleteInternCourse);

const { getAllFilterfloorManpower, getAllManpower, getAllFilterareaManpower, getSingleManpower, addManpower, updateManpower, deleteManpower } = require("../controller/modules/manpower");
hrfacilityRoute.route("/allmanpowers").get(getAllManpower);
hrfacilityRoute.route("/floormanpowers").post(getAllFilterfloorManpower);
hrfacilityRoute.route("/manpowerareas").post(getAllFilterareaManpower);
hrfacilityRoute.route("/manpower/new").post(addManpower);
hrfacilityRoute.route("/manpower/:id").get(getSingleManpower).put(updateManpower).delete(deleteManpower);

// connect Areagrouping controller..

const { getAllAreagrouping, addAreagrouping, updateAreagrouping, getSingleAreagrouping, deleteAreagrouping } = require("../controller/modules/areagrouping");
hrfacilityRoute.route("/areagroupings").get(getAllAreagrouping);
hrfacilityRoute.route("/areagrouping/new").post(addAreagrouping);
hrfacilityRoute.route("/areagrouping/:id").get(getSingleAreagrouping).put(updateAreagrouping).delete(deleteAreagrouping);

// connect Locationgrouping controller..

const { getAllLocationgrouping, addLocationgrouping, updateLocationgrouping, getSingleLocationgrouping, deleteLocationgrouping } = require("../controller/modules/locationgrouping");
hrfacilityRoute.route("/locationgroupings").get(getAllLocationgrouping);
hrfacilityRoute.route("/locationgrouping/new").post(addLocationgrouping);
hrfacilityRoute.route("/locationgrouping/:id").get(getSingleLocationgrouping).put(updateLocationgrouping).delete(deleteLocationgrouping);

// connect work Station controller..
const { addWorkStation, deleteWorkStation, getAllWorkStation,getAllWorkStationAccess, getSingleWorkStation, updateWorkStation } = require("../controller/modules/workstationcontroller");
hrfacilityRoute.route("/workstations").get(getAllWorkStation);
hrfacilityRoute.route("/workstationsaccess").post(getAllWorkStationAccess);
hrfacilityRoute.route("/workstation/new").post(addWorkStation);
hrfacilityRoute.route("/workstation/:id").get(getSingleWorkStation).put(updateWorkStation).delete(deleteWorkStation);

// connect Assign Branch controller..
const { getAllAssignBranch, addAssignBranch,getAllUnAssignBranch, usersAssignBranch,getSingleUserbranch, getSingleAssignBranch, updateAssignBranch, deleteAssignBranch } = require("../controller/modules/assignbranch");
hrfacilityRoute.route("/assignbranches").get(getAllAssignBranch);
hrfacilityRoute.route("/assignbranch/new").post(addAssignBranch);
hrfacilityRoute.route("/unassignbranches").post(getAllUnAssignBranch);
hrfacilityRoute.route("/assignbranch/:id").get(getSingleAssignBranch).put(updateAssignBranch).delete(deleteAssignBranch);
hrfacilityRoute.route("/usersassignbranch").post(usersAssignBranch);
hrfacilityRoute.route("/singleassignbranch").post(getSingleUserbranch);

// connect Weekoffpresent controller..
const { getAllWeekoffpresent, addWeekoffpresent, updateWeekoffpresent, getSingleWeekoffpresent, deleteWeekoffpresent, getAllWeekoffpresentFilter } = require("../controller/modules/weekoffcontrolpanel");
hrfacilityRoute.route("/weekoffpresents").get(getAllWeekoffpresent);
hrfacilityRoute.route("/weekoffpresent/new").post(addWeekoffpresent);
hrfacilityRoute.route("/weekoffpresent/:id").get(getSingleWeekoffpresent).put(updateWeekoffpresent).delete(deleteWeekoffpresent);
hrfacilityRoute.route("/weekoffpresentfilter").post(getAllWeekoffpresentFilter);

const { updateOverallUnitname, getAllCheckDeleteUnit } = 
    require("../controller/login/OverallUnitnameUpdate");
hrfacilityRoute.route("/unitoverallupdate").put(updateOverallUnitname);
hrfacilityRoute.route("/unitoverallcheck").post(getAllCheckDeleteUnit);

const { updateOverallAreaname, getAllCheckDeleteArea } = 
    require("../controller/login/OverallAreaUpdate");
hrfacilityRoute.route("/overallareasupdate").put(updateOverallAreaname);
hrfacilityRoute.route("/overallareascheck").post(getAllCheckDeleteArea);

const { updateOverallLocationname,
    getAllCheckDeleteLocation 
} = 
    require("../controller/login/OverallLocationUpdate");
hrfacilityRoute.route("/locationoverallupdate").put(updateOverallLocationname);
hrfacilityRoute.route("/locationoverallcheck").post(getAllCheckDeleteLocation);

const { updateOverallFloorname,
    getAllCheckDeleteFloor 
} = 
    require("../controller/login/OverallFloorUpdate");
hrfacilityRoute.route("/flooroverallupdate").put(updateOverallFloorname);
hrfacilityRoute.route("/flooroverallcheck").post(getAllCheckDeleteFloor);

module.exports = hrfacilityRoute;
