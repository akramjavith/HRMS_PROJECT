const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  userrole: {
    type: String,
    required: false,
  },
  menucompany: {
    type: Boolean,
    required: false,
  },
  company: {
    type: Boolean,
    required: false,
  },
  lcompany: {
    type: Boolean,
    required: false,
  },
  ccompany: {
    type: Boolean,
    required: false,
  },
  ecompany: {
    type: Boolean,
    required: false,
  },
  dcompany: {
    type: Boolean,
    required: false,
  },
  vcompany: {
    type: Boolean,
    required: false,
  },
  icompany: {
    type: Boolean,
    required: false,
  },
  excelcompany: {
    type: Boolean,
    required: false,
  },
  pdfcompany: {
    type: Boolean,
    required: false,
  },
  csvcompany: {
    type: Boolean,
    required: false,
  },
  printcompany: {
    type: Boolean,
    required: false,
  },

  //ROLE PAGE
  role: {
    type: Boolean,
    required: false,
  },
  lrole: {
    type: Boolean,
    required: false,
  },
  crole: {
    type: Boolean,
    required: false,
  },
  erole: {
    type: Boolean,
    required: false,
  },
  drole: {
    type: Boolean,
    required: false,
  },
  vrole: {
    type: Boolean,
    required: false,
  },
  irole: {
    type: Boolean,
    required: false,
  },
  excelrole: {
    type: Boolean,
    required: false,
  },
  pdfrole: {
    type: Boolean,
    required: false,
  },
  csvrole: {
    type: Boolean,
    required: false,
  },
  printrole: {
    type: Boolean,
    required: false,
  },
  checkallsetup: {
    type: Boolean,
    required: false,
  },
  // EXCEL
  excel: {
    type: Boolean,
    required: false,
  },
  excelupload: {
    type: Boolean,
    required: false,
  },
  excelallot: {
    type: Boolean,
    required: false,
  },
  excelreport: {
    type: Boolean,
    required: false,
  },
  attendance: {
    type: Boolean,
    required: false,
  },
  // attendance
  attendancelist: {
    type: Boolean,
    required: false,
  },
  attendancereport: {
    type: Boolean,
    required: false,
  },
  menuprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  projectmasterexcel: {
    type: Boolean,
    required: false,
  },
  lprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  cprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  eprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  dprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  vprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  iprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  excelprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  pdfprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  csvprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  printprojectmasterexcel: {
    type: Boolean,
    required: false,
  },
  menuvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  vendormasterexcel: {
    type: Boolean,
    required: false,
  },
  lvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  cvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  evendormasterexcel: {
    type: Boolean,
    required: false,
  },
  dvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  vvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  ivendormasterexcel: {
    type: Boolean,
    required: false,
  },
  excelvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  pdfvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  csvvendormasterexcel: {
    type: Boolean,
    required: false,
  },
  printvendormasterexcel: {
    type: Boolean,
    required: false,
  },

  //category excel
  menucategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  categorymasterexcel: {
    type: Boolean,
    required: false,
  },
  lcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  ccategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  ecategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  dcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  vcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  icategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  excelcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  pdfcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  csvcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  printcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  importcategoryexcel: {
    type: Boolean,
    required: false,
  },

  //menusubcategory
  menusubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  subcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  lsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  csubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  esubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  dsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  vsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  isubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  excelsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  pdfsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  csvsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  printsubcategorymasterexcel: {
    type: Boolean,
    required: false,
  },
  importsubcategoryexcel: {
    type: Boolean,
    required: false,
  },

  //queue
  menuqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  queuemasterexcel: {
    type: Boolean,
    required: false,
  },
  lqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  cqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  equeuemasterexcel: {
    type: Boolean,
    required: false,
  },
  dqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  vqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  iqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  excelqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  pdfqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  csvqueuemasterexcel: {
    type: Boolean,
    required: false,
  },
  printqueuemasterexcel: {
    type: Boolean,
    required: false,
  },

  //queue grouping
  menuqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  queuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  lqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  cqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  equeuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  dqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  vqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  iqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  excelqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  pdfqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  csvqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },
  printqueuegroupingexcel: {
    type: Boolean,
    required: false,
  },

  //unallotted excel
  menuunallottedexcel: {
    type: Boolean,
    required: false,
  },
  unallottedexcel: {
    type: Boolean,
    required: false,
  },
  lunallottedexcel: {
    type: Boolean,
    required: false,
  },
  cunallottedexcel: {
    type: Boolean,
    required: false,
  },

  excelunallottedexcel: {
    type: Boolean,
    required: false,
  },
  pdfunallottedexcel: {
    type: Boolean,
    required: false,
  },
  csvunallottedexcel: {
    type: Boolean,
    required: false,
  },
  printunallottedexcel: {
    type: Boolean,
    required: false,
  },

  //Allotted
  menuallottedexcel: {
    type: Boolean,
    required: false,
  },
  allottedexcel: {
    type: Boolean,
    required: false,
  },
  lallottedexcel: {
    type: Boolean,
    required: false,
  },
  callottedexcel: {
    type: Boolean,
    required: false,
  },
  eallottedexcel: {
    type: Boolean,
    required: false,
  },
  dallottedexcel: {
    type: Boolean,
    required: false,
  },
  vallottedexcel: {
    type: Boolean,
    required: false,
  },
  iallottedexcel: {
    type: Boolean,
    required: false,
  },
  excelallottedexcel: {
    type: Boolean,
    required: false,
  },
  pdfallottedexcel: {
    type: Boolean,
    required: false,
  },
  csvallottedexcel: {
    type: Boolean,
    required: false,
  },
  printallottedexcel: {
    type: Boolean,
    required: false,
  },

  //unallottedres excel
  menuunallottedresexcel: {
    type: Boolean,
    required: false,
  },
  unallottedresexcel: {
    type: Boolean,
    required: false,
  },
  lunallottedresexcel: {
    type: Boolean,
    required: false,
  },
  cunallottedresexcel: {
    type: Boolean,
    required: false,
  },

  excelunallottedresexcel: {
    type: Boolean,
    required: false,
  },
  pdfunallottedresexcel: {
    type: Boolean,
    required: false,
  },
  csvunallottedresexcel: {
    type: Boolean,
    required: false,
  },
  printunallottedresexcel: {
    type: Boolean,
    required: false,
  },

  //allottedres
  menuallottedresexcel: {
    type: Boolean,
    required: false,
  },
  allottedresexcel: {
    type: Boolean,
    required: false,
  },
  lallottedresexcel: {
    type: Boolean,
    required: false,
  },
  callottedresexcel: {
    type: Boolean,
    required: false,
  },
  eallottedresexcel: {
    type: Boolean,
    required: false,
  },
  dallottedresexcel: {
    type: Boolean,
    required: false,
  },
  vallottedresexcel: {
    type: Boolean,
    required: false,
  },
  iallottedresexcel: {
    type: Boolean,
    required: false,
  },
  excelallottedresexcel: {
    type: Boolean,
    required: false,
  },
  pdfallottedresexcel: {
    type: Boolean,
    required: false,
  },
  csvallottedresexcel: {
    type: Boolean,
    required: false,
  },
  printallottedresexcel: {
    type: Boolean,
    required: false,
  },

  //workorder
  menuworkorderexcel: {
    type: Boolean,
    required: false,
  },

  workorderexcel: {
    type: Boolean,
    required: false,
  },
  lworkorderexcel: {
    type: Boolean,
    required: false,
  },

  excelworkorderexcel: {
    type: Boolean,
    required: false,
  },
  pdfworkorderexcel: {
    type: Boolean,
    required: false,
  },
  csvworkorderexcel: {
    type: Boolean,
    required: false,
  },
  printworkorderexcel: {
    type: Boolean,
    required: false,
  },

  //time and points
  menutimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  timeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  ltimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  ctimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  etimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  dtimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  vtimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  itimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  exceltimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  pdftimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  csvtimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  printtimeandpointsexcel: {
    type: Boolean,
    required: false,
  },
  importtimepointsexcel: {
    type: Boolean,
    required: false,
  },

  //queue report
  //time and points
  menuqueuereportexcel: {
    type: Boolean,
    required: false,
  },
  queuereportexcel: {
    type: Boolean,
    required: false,
  },
  lbranchreportexcel: {
    type: Boolean,
    required: false,
  },
  excelbranchreportexcel: {
    type: Boolean,
    required: false,
  },
  pdfbranchreportexcel: {
    type: Boolean,
    required: false,
  },
  csvbranchreportexcel: {
    type: Boolean,
    required: false,
  },
  printbranchreportexcel: {
    type: Boolean,
    required: false,
  },
  lcategoryreportexcel: {
    type: Boolean,
    required: false,
  },
  excelcategoryreportexcel: {
    type: Boolean,
    required: false,
  },
  pdfcategoryreportexcel: {
    type: Boolean,
    required: false,
  },
  csvcategoryreportexcel: {
    type: Boolean,
    required: false,
  },
  printcategoryreportexcel: {
    type: Boolean,
    required: false,
  },

  lcustomerreportexcel: {
    type: Boolean,
    required: false,
  },
  excelcustomerreportexcel: {
    type: Boolean,
    required: false,
  },
  pdfcustomerreportexcel: {
    type: Boolean,
    required: false,
  },
  csvcustomerreportexcel: {
    type: Boolean,
    required: false,
  },
  printcustomerreportexcel: {
    type: Boolean,
    required: false,
  },
  lqueuereportexcel: {
    type: Boolean,
    required: false,
  },
  excelqueuereportexcel: {
    type: Boolean,
    required: false,
  },
  pdfqueuereportexcel: {
    type: Boolean,
    required: false,
  },
  csvqueuereportexcel: {
    type: Boolean,
    required: false,
  },
  printqueuereportexcel: {
    type: Boolean,
    required: false,
  },

  lresponsiblereportexcel: {
    type: Boolean,
    required: false,
  },
  excelresponsiblereportexcel: {
    type: Boolean,
    required: false,
  },
  pdfresponsiblereportexcel: {
    type: Boolean,
    required: false,
  },
  csvresponsiblereportexcel: {
    type: Boolean,
    required: false,
  },
  printresponsiblereportexcel: {
    type: Boolean,
    required: false,
  },
  lteamreportexcel: {
    type: Boolean,
    required: false,
  },
  excelteamreportexcel: {
    type: Boolean,
    required: false,
  },
  pdfteamreportexcel: {
    type: Boolean,
    required: false,
  },
  csvteamreportexcel: {
    type: Boolean,
    required: false,
  },
  printteamreportexcel: {
    type: Boolean,
    required: false,
  },

  tts: {
    type: Boolean,
    required: false,
  },
  queueallot: {
    type: Boolean,
    required: false,
  },
  queuereports: {
    type: Boolean,
    required: false,
  },
  categorymenuall: {
    type: Boolean,
    required: false,
  },

  //access
  access: {
    type: String,
    required: false,
  },
  setupall: {
    type: Boolean,
    required: false,
  },
  humanresourceall: {
    type: Boolean,
    required: false,
  },
  hrall: {
    type: Boolean,
    required: false,
  },
  empdetails: {
    type: Boolean,
    required: false,
  },
  projectall: {
    type: Boolean,
    required: false,
  },

  //branch....
  branch: {
    type: Boolean,
    required: false,
  },
  lbranch: {
    type: Boolean,
    required: false,
  },
  cbranch: {
    type: Boolean,
    required: false,
  },
  ebranch: {
    type: Boolean,
    required: false,
  },
  dbranch: {
    type: Boolean,
    required: false,
  },
  vbranch: {
    type: Boolean,
    required: false,
  },
  ibranch: {
    type: Boolean,
    required: false,
  },
  excelbranch: {
    type: Boolean,
    required: false,
  },
  pdfbranch: {
    type: Boolean,
    required: false,
  },
  csvbranch: {
    type: Boolean,
    required: false,
  },
  printbranch: {
    type: Boolean,
    required: false,
  },

  //unit....
  unit: {
    type: Boolean,
    required: false,
  },
  lunit: {
    type: Boolean,
    required: false,
  },
  cunit: {
    type: Boolean,
    required: false,
  },
  eunit: {
    type: Boolean,
    required: false,
  },
  dunit: {
    type: Boolean,
    required: false,
  },
  vunit: {
    type: Boolean,
    required: false,
  },
  iunit: {
    type: Boolean,
    required: false,
  },
  excelunit: {
    type: Boolean,
    required: false,
  },
  pdfunit: {
    type: Boolean,
    required: false,
  },
  csvunit: {
    type: Boolean,
    required: false,
  },
  printunit: {
    type: Boolean,
    required: false,
  },

  //area....

  area: {
    type: Boolean,
    required: false,
  },
  larea: {
    type: Boolean,
    required: false,
  },
  carea: {
    type: Boolean,
    required: false,
  },
  earea: {
    type: Boolean,
    required: false,
  },
  darea: {
    type: Boolean,
    required: false,
  },
  varea: {
    type: Boolean,
    required: false,
  },
  iarea: {
    type: Boolean,
    required: false,
  },
  excelarea: {
    type: Boolean,
    required: false,
  },
  pdfarea: {
    type: Boolean,
    required: false,
  },
  csvarea: {
    type: Boolean,
    required: false,
  },
  printarea: {
    type: Boolean,
    required: false,
  },

  //location...

  location: {
    type: Boolean,
    required: false,
  },
  llocation: {
    type: Boolean,
    required: false,
  },
  clocation: {
    type: Boolean,
    required: false,
  },
  elocation: {
    type: Boolean,
    required: false,
  },
  dlocation: {
    type: Boolean,
    required: false,
  },
  vlocation: {
    type: Boolean,
    required: false,
  },
  ilocation: {
    type: Boolean,
    required: false,
  },
  excellocation: {
    type: Boolean,
    required: false,
  },
  pdflocation: {
    type: Boolean,
    required: false,
  },
  csvlocation: {
    type: Boolean,
    required: false,
  },
  printlocation: {
    type: Boolean,
    required: false,
  },

  //floor...

  floor: {
    type: Boolean,
    required: false,
  },
  lfloor: {
    type: Boolean,
    required: false,
  },
  cfloor: {
    type: Boolean,
    required: false,
  },
  efloor: {
    type: Boolean,
    required: false,
  },
  dfloor: {
    type: Boolean,
    required: false,
  },
  vfloor: {
    type: Boolean,
    required: false,
  },
  ifloor: {
    type: Boolean,
    required: false,
  },
  excelfloor: {
    type: Boolean,
    required: false,
  },
  pdffloor: {
    type: Boolean,
    required: false,
  },
  csvfloor: {
    type: Boolean,
    required: false,
  },
  printfloor: {
    type: Boolean,
    required: false,
  },

  //hr facility....

  checkallfacility: {
    type: Boolean,
    required: false,
  },
  hrdetails: {
    type: Boolean,
    required: false,
  },
  checkallhr: {
    type: Boolean,
    required: false,
  },

  //department...
  department: {
    type: Boolean,
    required: false,
  },
  ldepartment: {
    type: Boolean,
    required: false,
  },
  cdepartment: {
    type: Boolean,
    required: false,
  },
  edepartment: {
    type: Boolean,
    required: false,
  },
  ddepartment: {
    type: Boolean,
    required: false,
  },
  vdepartment: {
    type: Boolean,
    required: false,
  },
  idepartment: {
    type: Boolean,
    required: false,
  },
  exceldepartment: {
    type: Boolean,
    required: false,
  },
  pdfdepartment: {
    type: Boolean,
    required: false,
  },
  csvdepartment: {
    type: Boolean,
    required: false,
  },
  printdepartment: {
    type: Boolean,
    required: false,
  },
  //designation Group..

  designationgroup: {
    type: Boolean,
    required: false,
  },
  ldesignationgroup: {
    type: Boolean,
    required: false,
  },
  cdesignationgroup: {
    type: Boolean,
    required: false,
  },
  edesignationgroup: {
    type: Boolean,
    required: false,
  },
  ddesignationgroup: {
    type: Boolean,
    required: false,
  },
  vdesignationgroup: {
    type: Boolean,
    required: false,
  },
  idesignationgroup: {
    type: Boolean,
    required: false,
  },
  exceldesignationgroup: {
    type: Boolean,
    required: false,
  },
  pdfdesignationgroup: {
    type: Boolean,
    required: false,
  },
  csvdesignationgroup: {
    type: Boolean,
    required: false,
  },
  printdesignationgroup: {
    type: Boolean,
    required: false,
  },

  //designation...

  designation: {
    type: Boolean,
    required: false,
  },
  ldesignation: {
    type: Boolean,
    required: false,
  },
  cdesignation: {
    type: Boolean,
    required: false,
  },
  edesignation: {
    type: Boolean,
    required: false,
  },
  ddesignation: {
    type: Boolean,
    required: false,
  },
  vdesignation: {
    type: Boolean,
    required: false,
  },
  idesignation: {
    type: Boolean,
    required: false,
  },
  exceldesignation: {
    type: Boolean,
    required: false,
  },
  pdfdesignation: {
    type: Boolean,
    required: false,
  },
  csvdesignation: {
    type: Boolean,
    required: false,
  },
  printdesignation: {
    type: Boolean,
    required: false,
  },

  //Qualification...

  qualification: {
    type: Boolean,
    required: false,
  },
  lqualification: {
    type: Boolean,
    required: false,
  },
  cqualification: {
    type: Boolean,
    required: false,
  },
  equalification: {
    type: Boolean,
    required: false,
  },
  dqualification: {
    type: Boolean,
    required: false,
  },
  vqualification: {
    type: Boolean,
    required: false,
  },
  iqualification: {
    type: Boolean,
    required: false,
  },
  excelqualification: {
    type: Boolean,
    required: false,
  },
  pdfqualification: {
    type: Boolean,
    required: false,
  },
  csvqualification: {
    type: Boolean,
    required: false,
  },
  printqualification: {
    type: Boolean,
    required: false,
  },

  //team...

  team: {
    type: Boolean,
    required: false,
  },
  lteam: {
    type: Boolean,
    required: false,
  },
  cteam: {
    type: Boolean,
    required: false,
  },
  eteam: {
    type: Boolean,
    required: false,
  },
  dteam: {
    type: Boolean,
    required: false,
  },
  vteam: {
    type: Boolean,
    required: false,
  },
  iteam: {
    type: Boolean,
    required: false,
  },
  excelteam: {
    type: Boolean,
    required: false,
  },
  pdfteam: {
    type: Boolean,
    required: false,
  },
  csvteam: {
    type: Boolean,
    required: false,
  },
  printteam: {
    type: Boolean,
    required: false,
  },

  //Education...

  education: {
    type: Boolean,
    required: false,
  },
  leducation: {
    type: Boolean,
    required: false,
  },
  ceducation: {
    type: Boolean,
    required: false,
  },
  eeducation: {
    type: Boolean,
    required: false,
  },
  deducation: {
    type: Boolean,
    required: false,
  },
  veducation: {
    type: Boolean,
    required: false,
  },
  ieducation: {
    type: Boolean,
    required: false,
  },
  exceleducation: {
    type: Boolean,
    required: false,
  },
  pdfeducation: {
    type: Boolean,
    required: false,
  },
  csveducation: {
    type: Boolean,
    required: false,
  },
  printeducation: {
    type: Boolean,
    required: false,
  },

  //Certifictaions...

  certification: {
    type: Boolean,
    required: false,
  },
  lcertification: {
    type: Boolean,
    required: false,
  },
  ccertification: {
    type: Boolean,
    required: false,
  },
  ecertification: {
    type: Boolean,
    required: false,
  },
  dcertification: {
    type: Boolean,
    required: false,
  },
  vcertification: {
    type: Boolean,
    required: false,
  },
  icertification: {
    type: Boolean,
    required: false,
  },
  excelcertification: {
    type: Boolean,
    required: false,
  },
  pdfcertification: {
    type: Boolean,
    required: false,
  },
  csvcertification: {
    type: Boolean,
    required: false,
  },
  printcertification: {
    type: Boolean,
    required: false,
  },

  //Skillset...
  skillset: {
    type: Boolean,
    required: false,
  },
  lskillset: {
    type: Boolean,
    required: false,
  },
  cskillset: {
    type: Boolean,
    required: false,
  },
  eskillset: {
    type: Boolean,
    required: false,
  },
  dskillset: {
    type: Boolean,
    required: false,
  },
  vskillset: {
    type: Boolean,
    required: false,
  },
  iskillset: {
    type: Boolean,
    required: false,
  },
  excelskillset: {
    type: Boolean,
    required: false,
  },
  pdfskillset: {
    type: Boolean,
    required: false,
  },
  csvskillset: {
    type: Boolean,
    required: false,
  },
  printskillset: {
    type: Boolean,
    required: false,
  },

  //shift...
  shift: {
    type: Boolean,
    required: false,
  },
  lshift: {
    type: Boolean,
    required: false,
  },
  cshift: {
    type: Boolean,
    required: false,
  },
  eshift: {
    type: Boolean,
    required: false,
  },
  dshift: {
    type: Boolean,
    required: false,
  },
  vshift: {
    type: Boolean,
    required: false,
  },
  ishift: {
    type: Boolean,
    required: false,
  },
  excelshift: {
    type: Boolean,
    required: false,
  },
  pdfshift: {
    type: Boolean,
    required: false,
  },
  csvshift: {
    type: Boolean,
    required: false,
  },
  printshift: {
    type: Boolean,
    required: false,
  },

  //employee details...
  //addemployee...
  checkallemployee: {
    type: Boolean,
    required: false,
  },
  addemployee: {
    type: Boolean,
    required: false,
  },
  caddemployee: {
    type: Boolean,
    required: false,
  },
  //list...
  list: {
    type: Boolean,
    required: false,
  },
  llist: {
    type: Boolean,
    required: false,
  },
  elist: {
    type: Boolean,
    required: false,
  },
  dlist: {
    type: Boolean,
    required: false,
  },
  ilist: {
    type: Boolean,
    required: false,
  },
  vlist: {
    type: Boolean,
    required: false,
  },
  excellist: {
    type: Boolean,
    required: false,
  },
  pdflist: {
    type: Boolean,
    required: false,
  },
  csvlist: {
    type: Boolean,
    required: false,
  },
  printlist: {
    type: Boolean,
    required: false,
  },
  // interndetails
  interndetails: {
    type: Boolean,
    required: false,
  },
  intern: {
    type: Boolean,
    required: false,
  },
  interncertificate: {
    type: Boolean,
    required: false,
  },

  //personal contact....
  personalcontact: {
    type: Boolean,
    required: false,
  },
  lpersonalcontact: {
    type: Boolean,
    required: false,
  },
  epersonalcontact: {
    type: Boolean,
    required: false,
  },
  excelpersonalcontact: {
    type: Boolean,
    required: false,
  },
  pdfpersonalcontact: {
    type: Boolean,
    required: false,
  },
  csvpersonalcontact: {
    type: Boolean,
    required: false,
  },
  printpersonalcontact: {
    type: Boolean,
    required: false,
  },

  //contact info...

  contactinfo: {
    type: Boolean,
    required: false,
  },
  lcontactinfo: {
    type: Boolean,
    required: false,
  },
  econtactinfo: {
    type: Boolean,
    required: false,
  },
  excelcontactinfo: {
    type: Boolean,
    required: false,
  },
  pdfcontactinfo: {
    type: Boolean,
    required: false,
  },
  csvcontactinfo: {
    type: Boolean,
    required: false,
  },
  printcontactinfo: {
    type: Boolean,
    required: false,
  },

  //login info...
  logininfo: {
    type: Boolean,
    required: false,
  },
  llogininfo: {
    type: Boolean,
    required: false,
  },
  elogininfo: {
    type: Boolean,
    required: false,
  },
  excellogininfo: {
    type: Boolean,
    required: false,
  },
  pdflogininfo: {
    type: Boolean,
    required: false,
  },
  csvlogininfo: {
    type: Boolean,
    required: false,
  },
  printlogininfo: {
    type: Boolean,
    required: false,
  },

  //Boarding info...
  boardinginfo: {
    type: Boolean,
    required: false,
  },
  lboardinginfo: {
    type: Boolean,
    required: false,
  },
  eboardinginfo: {
    type: Boolean,
    required: false,
  },
  excelboardinginfo: {
    type: Boolean,
    required: false,
  },
  pdfboardinginfo: {
    type: Boolean,
    required: false,
  },
  csvboardinginfo: {
    type: Boolean,
    required: false,
  },
  printboardinginfo: {
    type: Boolean,
    required: false,
  },

  //Document info...

  documentinfo: {
    type: Boolean,
    required: false,
  },
  ldocumentinfo: {
    type: Boolean,
    required: false,
  },
  edocumentinfo: {
    type: Boolean,
    required: false,
  },
  exceldocumentinfo: {
    type: Boolean,
    required: false,
  },
  pdfdocumentinfo: {
    type: Boolean,
    required: false,
  },
  csvdocumentinfo: {
    type: Boolean,
    required: false,
  },
  printdocumentinfo: {
    type: Boolean,
    required: false,
  },

  //Joining info...
  joininginfo: {
    type: Boolean,
    required: false,
  },
  ljoininginfo: {
    type: Boolean,
    required: false,
  },
  ejoininginfo: {
    type: Boolean,
    required: false,
  },
  exceljoininginfo: {
    type: Boolean,
    required: false,
  },
  pdfjoininginfo: {
    type: Boolean,
    required: false,
  },
  csvjoininginfo: {
    type: Boolean,
    required: false,
  },
  printjoininginfo: {
    type: Boolean,
    required: false,
  },

  //Educational info..
  educationalinfo: {
    type: Boolean,
    required: false,
  },
  leducationalinfo: {
    type: Boolean,
    required: false,
  },
  eeducationalinfo: {
    type: Boolean,
    required: false,
  },

  //Additional info..
  additionalinfo: {
    type: Boolean,
    required: false,
  },
  ladditionalinfo: {
    type: Boolean,
    required: false,
  },
  eadditionalinfo: {
    type: Boolean,
    required: false,
  },

  //work history...
  workhistory: {
    type: Boolean,
    required: false,
  },
  lworkhistory: {
    type: Boolean,
    required: false,
  },
  eworkhistory: {
    type: Boolean,
    required: false,
  },

  //project....

  project: {
    type: Boolean,
    required: false,
  },
  lproject: {
    type: Boolean,
    required: false,
  },
  cproject: {
    type: Boolean,
    required: false,
  },
  eproject: {
    type: Boolean,
    required: false,
  },
  dproject: {
    type: Boolean,
    required: false,
  },
  vproject: {
    type: Boolean,
    required: false,
  },
  iproject: {
    type: Boolean,
    required: false,
  },
  excelproject: {
    type: Boolean,
    required: false,
  },
  pdfproject: {
    type: Boolean,
    required: false,
  },
  csvproject: {
    type: Boolean,
    required: false,
  },
  printproject: {
    type: Boolean,
    required: false,
  },

  //subproject...
  subproject: {
    type: Boolean,
    required: false,
  },
  lsubproject: {
    type: Boolean,
    required: false,
  },
  csubproject: {
    type: Boolean,
    required: false,
  },
  esubproject: {
    type: Boolean,
    required: false,
  },
  dsubproject: {
    type: Boolean,
    required: false,
  },
  vsubproject: {
    type: Boolean,
    required: false,
  },
  isubproject: {
    type: Boolean,
    required: false,
  },
  excelsubproject: {
    type: Boolean,
    required: false,
  },
  pdfsubproject: {
    type: Boolean,
    required: false,
  },
  csvsubproject: {
    type: Boolean,
    required: false,
  },
  printsubproject: {
    type: Boolean,
    required: false,
  },

  //Module...
  module: {
    type: Boolean,
    required: false,
  },
  lmodule: {
    type: Boolean,
    required: false,
  },
  cmodule: {
    type: Boolean,
    required: false,
  },
  emodule: {
    type: Boolean,
    required: false,
  },
  dmodule: {
    type: Boolean,
    required: false,
  },
  vmodule: {
    type: Boolean,
    required: false,
  },
  imodule: {
    type: Boolean,
    required: false,
  },
  excelmodule: {
    type: Boolean,
    required: false,
  },
  pdfmodule: {
    type: Boolean,
    required: false,
  },
  csvmodule: {
    type: Boolean,
    required: false,
  },
  printmodule: {
    type: Boolean,
    required: false,
  },

  //submodule...
  submodule: {
    type: Boolean,
    required: false,
  },
  lsubmodule: {
    type: Boolean,
    required: false,
  },
  csubmodule: {
    type: Boolean,
    required: false,
  },
  esubmodule: {
    type: Boolean,
    required: false,
  },
  dsubmodule: {
    type: Boolean,
    required: false,
  },
  vsubmodule: {
    type: Boolean,
    required: false,
  },
  isubmodule: {
    type: Boolean,
    required: false,
  },
  excelsubmodule: {
    type: Boolean,
    required: false,
  },
  pdfsubmodule: {
    type: Boolean,
    required: false,
  },
  csvsubmodule: {
    type: Boolean,
    required: false,
  },
  printsubmodule: {
    type: Boolean,
    required: false,
  },

  //Mainpage...
  mainpage: {
    type: Boolean,
    required: false,
  },
  lmainpage: {
    type: Boolean,
    required: false,
  },
  cmainpage: {
    type: Boolean,
    required: false,
  },
  emainpage: {
    type: Boolean,
    required: false,
  },
  dmainpage: {
    type: Boolean,
    required: false,
  },
  vmainpage: {
    type: Boolean,
    required: false,
  },
  imainpage: {
    type: Boolean,
    required: false,
  },
  excelmainpage: {
    type: Boolean,
    required: false,
  },
  pdfmainpage: {
    type: Boolean,
    required: false,
  },
  csvmainpage: {
    type: Boolean,
    required: false,
  },
  printmainpage: {
    type: Boolean,
    required: false,
  },

  //Subpage1...
  subpage1: {
    type: Boolean,
    required: false,
  },
  lsubpage1: {
    type: Boolean,
    required: false,
  },
  csubpage1: {
    type: Boolean,
    required: false,
  },
  esubpage1: {
    type: Boolean,
    required: false,
  },
  dsubpage1: {
    type: Boolean,
    required: false,
  },
  vsubpage1: {
    type: Boolean,
    required: false,
  },
  isubpage1: {
    type: Boolean,
    required: false,
  },
  excelsubpage1: {
    type: Boolean,
    required: false,
  },
  pdfsubpage1: {
    type: Boolean,
    required: false,
  },
  csvsubpage1: {
    type: Boolean,
    required: false,
  },
  printsubpage1: {
    type: Boolean,
    required: false,
  },

  //subpage2
  subpage2: {
    type: Boolean,
    required: false,
  },
  lsubpage2: {
    type: Boolean,
    required: false,
  },
  csubpage2: {
    type: Boolean,
    required: false,
  },
  esubpage2: {
    type: Boolean,
    required: false,
  },
  dsubpage2: {
    type: Boolean,
    required: false,
  },
  vsubpage2: {
    type: Boolean,
    required: false,
  },
  isubpage2: {
    type: Boolean,
    required: false,
  },
  excelsubpage2: {
    type: Boolean,
    required: false,
  },
  pdfsubpage2: {
    type: Boolean,
    required: false,
  },
  csvsubpage2: {
    type: Boolean,
    required: false,
  },
  printsubpage2: {
    type: Boolean,
    required: false,
  },

  //subpage3...
  subpage3: {
    type: Boolean,
    required: false,
  },
  lsubpage3: {
    type: Boolean,
    required: false,
  },
  csubpage3: {
    type: Boolean,
    required: false,
  },
  esubpage3: {
    type: Boolean,
    required: false,
  },
  dsubpage3: {
    type: Boolean,
    required: false,
  },
  vsubpage3: {
    type: Boolean,
    required: false,
  },
  isubpage3: {
    type: Boolean,
    required: false,
  },
  excelsubpage3: {
    type: Boolean,
    required: false,
  },
  pdfsubpage3: {
    type: Boolean,
    required: false,
  },
  csvsubpage3: {
    type: Boolean,
    required: false,
  },
  printsubpage3: {
    type: Boolean,
    required: false,
  },

  //subpage4..
  subpage4: {
    type: Boolean,
    required: false,
  },
  lsubpage4: {
    type: Boolean,
    required: false,
  },
  csubpage4: {
    type: Boolean,
    required: false,
  },
  esubpage4: {
    type: Boolean,
    required: false,
  },
  dsubpage4: {
    type: Boolean,
    required: false,
  },
  vsubpage4: {
    type: Boolean,
    required: false,
  },
  isubpage4: {
    type: Boolean,
    required: false,
  },
  excelsubpage4: {
    type: Boolean,
    required: false,
  },
  pdfsubpage4: {
    type: Boolean,
    required: false,
  },
  csvsubpage4: {
    type: Boolean,
    required: false,
  },
  printsubpage4: {
    type: Boolean,
    required: false,
  },

  //subpage5...
  subpage5: {
    type: Boolean,
    required: false,
  },
  lsubpage5: {
    type: Boolean,
    required: false,
  },
  csubpage5: {
    type: Boolean,
    required: false,
  },
  esubpage5: {
    type: Boolean,
    required: false,
  },
  dsubpage5: {
    type: Boolean,
    required: false,
  },
  vsubpage5: {
    type: Boolean,
    required: false,
  },
  isubpage5: {
    type: Boolean,
    required: false,
  },
  excelsubpage5: {
    type: Boolean,
    required: false,
  },
  pdfsubpage5: {
    type: Boolean,
    required: false,
  },
  csvsubpage5: {
    type: Boolean,
    required: false,
  },
  printsubpage5: {
    type: Boolean,
    required: false,
  },
  menucategorysubcategory: {
    type: Boolean,
    required: false,
  },
  categorysub: {
    type: Boolean,
    required: false,
  },
  pcategorysub: {
    type: Boolean,
    required: false,
  },
  lcategorysub: {
    type: Boolean,
    required: false,
  },
  ccategorysub: {
    type: Boolean,
    required: false,
  },
  ecategorysub: {
    type: Boolean,
    required: false,
  },
  dcategorysub: {
    type: Boolean,
    required: false,
  },
  vcategorysub: {
    type: Boolean,
    required: false,
  },
  icategorysub: {
    type: Boolean,
    required: false,
  },
  excelcategorysub: {
    type: Boolean,
    required: false,
  },
  pdfcategorysub: {
    type: Boolean,
    required: false,
  },
  csvcategorysub: {
    type: Boolean,
    required: false,
  },
  printcategorysub: {
    type: Boolean,
    required: false,
  },
  menucategorysubcategorygrp: {
    type: Boolean,
    required: false,
  },
  categorysubgrp: {
    type: Boolean,
    required: false,
  },
  pcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  lcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  ccategorysubgrp: {
    type: Boolean,
    required: false,
  },
  ecategorysubgrp: {
    type: Boolean,
    required: false,
  },
  dcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  vcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  icategorysubgrp: {
    type: Boolean,
    required: false,
  },
  excelcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  pdfcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  csvcategorysubgrp: {
    type: Boolean,
    required: false,
  },
  printcategorysubgrp: {
    type: Boolean,
    required: false,
  },

  //priority...
  priority: {
    type: Boolean,
    required: false,
  },
  lpriority: {
    type: Boolean,
    required: false,
  },
  cpriority: {
    type: Boolean,
    required: false,
  },
  epriority: {
    type: Boolean,
    required: false,
  },
  dpriority: {
    type: Boolean,
    required: false,
  },
  vpriority: {
    type: Boolean,
    required: false,
  },
  ipriority: {
    type: Boolean,
    required: false,
  },
  excelpriority: {
    type: Boolean,
    required: false,
  },
  pdfpriority: {
    type: Boolean,
    required: false,
  },
  csvpriority: {
    type: Boolean,
    required: false,
  },
  printpriority: {
    type: Boolean,
    required: false,
  },

  //project details...
  projectdetail: {
    type: Boolean,
    required: false,
  },
  lprojectdetail: {
    type: Boolean,
    required: false,
  },
  cprojectdetail: {
    type: Boolean,
    required: false,
  },
  eprojectdetail: {
    type: Boolean,
    required: false,
  },
  dprojectdetail: {
    type: Boolean,
    required: false,
  },
  vprojectdetail: {
    type: Boolean,
    required: false,
  },
  iprojectdetail: {
    type: Boolean,
    required: false,
  },
  excelprojectdetail: {
    type: Boolean,
    required: false,
  },
  pdfprojectdetail: {
    type: Boolean,
    required: false,
  },
  csvprojectdetail: {
    type: Boolean,
    required: false,
  },
  printprojectdetail: {
    type: Boolean,
    required: false,
  },

  //project estimation...
  projectestimation: {
    type: Boolean,
    required: false,
  },
  lprojectestimation: {
    type: Boolean,
    required: false,
  },
  cprojectestimation: {
    type: Boolean,
    required: false,
  },
  eprojectestimation: {
    type: Boolean,
    required: false,
  },
  dprojectestimation: {
    type: Boolean,
    required: false,
  },
  vprojectestimation: {
    type: Boolean,
    required: false,
  },
  iprojectestimation: {
    type: Boolean,
    required: false,
  },
  excelprojectestimation: {
    type: Boolean,
    required: false,
  },
  pdfprojectestimation: {
    type: Boolean,
    required: false,
  },
  csvprojectestimation: {
    type: Boolean,
    required: false,
  },
  printprojectestimation: {
    type: Boolean,
    required: false,
  },

  //project Allocation...

  checkallproject: {
    type: Boolean,
    required: false,
  },
  projectallocation: {
    type: Boolean,
    required: false,
  },
  lprojectallocation: {
    type: Boolean,
    required: false,
  },
  cprojectallocation: {
    type: Boolean,
    required: false,
  },
  eprojectallocation: {
    type: Boolean,
    required: false,
  },
  dprojectallocation: {
    type: Boolean,
    required: false,
  },
  vprojectallocation: {
    type: Boolean,
    required: false,
  },
  iprojectallocation: {
    type: Boolean,
    required: false,
  },
  excelprojectallocation: {
    type: Boolean,
    required: false,
  },
  pdfprojectallocation: {
    type: Boolean,
    required: false,
  },
  csvprojectallocation: {
    type: Boolean,
    required: false,
  },
  printprojectallocation: {
    type: Boolean,
    required: false,
  },

  //profile...

  profile: {
    type: Boolean,
    required: false,
  },

  checkall: {
    type: Boolean,
    required: false,
  },

  all: {
    type: Boolean,
    required: false,
  },
  Teammember: {
    type: Boolean,
    required: false,
  },

  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    },
  ],
  updatedby: [
    {
      name: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    },
  ],
  //draft....
  draft: {
    type: Boolean,
    required: false,
  },
  ldraft: {
    type: Boolean,
    required: false,
  },
  cdraft: {
    type: Boolean,
    required: false,
  },
  edraft: {
    type: Boolean,
    required: false,
  },
  ddraft: {
    type: Boolean,
    required: false,
  },
  vdraft: {
    type: Boolean,
    required: false,
  },

  exceldraft: {
    type: Boolean,
    required: false,
  },
  pdfdraft: {
    type: Boolean,
    required: false,
  },
  csvdraft: {
    type: Boolean,
    required: false,
  },
  printdraft: {
    type: Boolean,
    required: false,
  },

  //task....
  task: {
    type: Boolean,
    required: false,
  },
  ctask: {
    type: Boolean,
    required: false,
  },
  ltask: {
    type: Boolean,
    required: false,
  },
  taskreport: {
    type: Boolean,
    required: false,
  },
  etask: {
    type: Boolean,
    required: false,
  },
  dtask: {
    type: Boolean,
    required: false,
  },
  vtask: {
    type: Boolean,
    required: false,
  },
  itask: {
    type: Boolean,
    required: false,
  },
  exceltask: {
    type: Boolean,
    required: false,
  },
  pdftask: {
    type: Boolean,
    required: false,
  },
  csvtask: {
    type: Boolean,
    required: false,
  },
  printtask: {
    type: Boolean,
    required: false,
  },
  taskboard: {
    type: Boolean,
    required: false,
  },
  menucompany: {
    type: Boolean,
    required: false,
  },
  menurole: {
    type: Boolean,
    required: false,
  },

  menubranch: {
    type: Boolean,
    required: false,
  },

  menuunit: {
    type: Boolean,
    required: false,
  },

  menuarea: {
    type: Boolean,
    required: false,
  },

  menulocation: {
    type: Boolean,
    required: false,
  },

  menufloor: {
    type: Boolean,
    required: false,
  },

  menudepartment: {
    type: Boolean,
    required: false,
  },

  menudesignationgroup: {
    type: Boolean,
    required: false,
  },

  menudesignation: {
    type: Boolean,
    required: false,
  },

  menuqualification: {
    type: Boolean,
    required: false,
  },

  menuteam: {
    type: Boolean,
    required: false,
  },

  menueducation: {
    type: Boolean,
    required: false,
  },

  menucertification: {
    type: Boolean,
    required: false,
  },

  menuskillset: {
    type: Boolean,
    required: false,
  },

  menushift: {
    type: Boolean,
    required: false,
  },

  menuaddemployee: {
    type: Boolean,
    required: false,
  },

  menudraft: {
    type: Boolean,
    required: false,
  },

  menupersonalcontact: {
    type: Boolean,
    required: false,
  },

  menucontactinfo: {
    type: Boolean,
    required: false,
  },

  menulogininfo: {
    type: Boolean,
    required: false,
  },

  menuboardinginfo: {
    type: Boolean,
    required: false,
  },

  menudocumentinfo: {
    type: Boolean,
    required: false,
  },

  menujoininginfo: {
    type: Boolean,
    required: false,
  },

  menueducationalinfo: {
    type: Boolean,
    required: false,
  },

  menuadditionalinfo: {
    type: Boolean,
    required: false,
  },

  menuworkhistory: {
    type: Boolean,
    required: false,
  },

  menuproject: {
    type: Boolean,
    required: false,
  },

  menusubproject: {
    type: Boolean,
    required: false,
  },

  menumodule: {
    type: Boolean,
    required: false,
  },

  menusubmodule: {
    type: Boolean,
    required: false,
  },

  menumainpage: {
    type: Boolean,
    required: false,
  },

  menusubpage1: {
    type: Boolean,
    required: false,
  },

  menusubpage2: {
    type: Boolean,
    required: false,
  },

  menusubpage3: {
    type: Boolean,
    required: false,
  },

  menusubpage4: {
    type: Boolean,
    required: false,
  },

  menusubpage5: {
    type: Boolean,
    required: false,
  },
  taskdefault: {
    type: Boolean,
    required: false,
  },
  ctaskdefault: {
    type: Boolean,
    required: false,
  },
  ltaskdefault: {
    type: Boolean,
    required: false,
  },

  etaskdefault: {
    type: Boolean,
    required: false,
  },
  dtaskdefault: {
    type: Boolean,
    required: false,
  },
  vtaskdefault: {
    type: Boolean,
    required: false,
  },
  itaskdefault: {
    type: Boolean,
    required: false,
  },
  exceltaskdefault: {
    type: Boolean,
    required: false,
  },
  pdftaskdefault: {
    type: Boolean,
    required: false,
  },
  csvtaskdefault: {
    type: Boolean,
    required: false,
  },
  printtaskdefault: {
    type: Boolean,
    required: false,
  },
  menutaskdefault: {
    type: Boolean,
    required: false,
  },
  menupriority: {
    type: Boolean,
    required: false,
  },

  menuprojectdetails: {
    type: Boolean,
    required: false,
  },

  menuprojectestimation: {
    type: Boolean,
    required: false,
  },

  menuprojectallocation: {
    type: Boolean,
    required: false,
  },

  menutask: {
    type: Boolean,
    required: false,
  },
  checkallintern: {
    type: Boolean,
    required: false,
  },
  interncourse: {
    type: Boolean,
    required: false,
  },
  // remark
  remark: {
    type: Boolean,
    required: false,
  },
  lremark: {
    type: Boolean,
    required: false,
  },
  excelremark: {
    type: Boolean,
    required: false,
  },
  pdfremark: {
    type: Boolean,
    required: false,
  },
  csvremark: {
    type: Boolean,
    required: false,
  },
  printremark: {
    type: Boolean,
    required: false,
  },
  rolenew: {
    type: [String],
    required: false,
  },
  modulename: {
    type: [String],
    required: false,
  },
  submodulename: {
    type: [String],
    required: false,
  },
  mainpagename: {
    type: [String],
    required: false,
  },
  subpagename: {
    type: [String],
    required: false,
  },
  subsubpagename: {
    type: [String],
    required: false,
  },
  controlname: {
    type: [String],
    required: false,
  },
  controlgrouping: {
    type: [String],
    required: false,
  },
  controlgroupingtitles: {
    type: [String],
    required: false,
  },
  controldbname: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Role", roleSchema);