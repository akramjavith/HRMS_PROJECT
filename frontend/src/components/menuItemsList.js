export const menuItems = [
  {
    title: "Dashboard",
    // dbname: "menudashboard",
    url: "",
    submenu: [
      {
        title: "Employee",
        dbname: "menuemployee",
        url: "",
        submenu: [
          {
            title: "Total Employee",
            dbname: "menutotalemployee",
            // url: "/manageipcategory",
          },
          {
            title: "Today Leave",
            dbname: "menutodayleave",
            // url: "/manageip",
          },
          {
            title: "Notice Period Emp",
            dbname: "menunoticeperiodemp",
            // url: "/manageiplist",
          },
          {
            title: "Releive Employee",
            dbname: "menureleiveemployee",
            // url: "/assignediplist",
          },
          {
            title: "Not CheckIn Emp",
            dbname: "menunotcheckinemp",
            // url: "/assignediplist",
          },
        ],
      },

      {
        title: "Meeting & Events",
        dbname: "menumeeting&events",
        url: "",
        submenu: [
          {
            title: "Today Meeting",
            dbname: "menutodaymeeting",
            // url: "passwordcategory",
          },
          {
            title: "News & Events",
            dbname: "menunews&events",
            // url: "addpassword",
          },
        ],
      },
      {
        title: "Expense & Income",
        dbname: "menuexpense&income",
        // url: "",
      },
      {
        title: "Task Status",
        dbname: "menutaskstatus",
        // url: "",
      },
      {
        title: "Quick Actions",
        dbname: "menuquickactions",
        url: "",
      },

      {
        title: "Productions",
        dbname: "menuproductions",
        url: "",
        submenu: [
          {
            title: "Productions",
            dbname: "menuproductions",
            // url: "",
          },
          {
            title: "Accuracy",
            dbname: "menuaccuracy",
            // url: "",
          },
          {
            title: "Minimum Points Dashboard",
            dbname: "menuminimumpointsdashboard",
            // url: "",
          },
          {
            title: "My Login Allot",
            dbname: "menumyloginallot",
            // url: "",
          },
        ],
      },
      {
        title: "Interview",
        dbname: "menuinterview",
        url: "",
        submenu: [
          {
            title: "Recent Job Applications",
            dbname: "menurecentjobapplications",
            url: "",
          },
          {
            title: "Upcoming Interviews",
            dbname: "menuupcominginterviews",
            url: "",
          },
          {
            title: "Interview Status",
            dbname: "menuinterviewstatus",
            // url: "",
          },
        ],
      },

      {
        title: "Approvals",
        dbname: "menuapprovals",
        url: "",
        submenu: [
          {
            title: "Approvals",
            dbname: "menuapprovals",
            // url: "passwordcategory",
          },
          {
            title: "Production Approved",
            dbname: "menuproductionapproved",
            // url: "passwordcategory",
          },
          {
            title: "Leavedashboard",
            dbname: "menuleavedashboard",
            // url: "addpassword",
          },
          {
            title: "Permissiondashboard",
            dbname: "menupermissiondashboard",
            // url: "addpassword",
          },
          {
            title: "Long Absent",
            dbname: "menulongabsent",
            // url: "addpassword",
          },
          {
            title: "Advancedashboard",
            dbname: "menuadvancedashboard",
            // url: "addpassword",
          },
          {
            title: "Loandashboard",
            dbname: "menuloandashboard",
            // url: "addpassword",
          },
          {
            title: "Tickets & Checklist",
            dbname: "menutickets&checklist",
            // url: "",
          },
        ],
      },

      {
        title: "Asset & Maintenance",
        dbname: "menuasset&maintenance",
        url: "",
        submenu: [
          {
            title: "Assets",
            dbname: "menuassets",
            // url: "",
          },
          {
            title: "Maintenances",
            dbname: "menumaintenances",
            // url: "",
          },
        ],
      },
    ],
  },
  {
    title: "Setup",
    dbname: "menusetup",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Company",
        dbname: "menucompany",
        url: "/company",
        access: true,
      },
      {
        title: "Company Domain",
        dbname: "menucompanydomain",
        url: "/updatepages/companydomain",
        access: true,
      },
      {
        title: "Controls Grouping",
        dbname: "menucontrolsgrouping",
        url: "/controlsgrouping",
      },
      {
        title: "Designation and Control Grouping",
        dbname: "menudesignationandcontrolgrouping",
        url: "/designationandcontrolgrouping",
      },
      {
        title: "Role",
        dbname: "menurole",
        url: "/createrole",
      },
      {
        title: "Tool Tip Description",
        dbname: "menutooltipdescription",
        url: "/tooltipdescription",
      },

      {
        title: "Control Name",
        dbname: "menucontrolname",
        url: "/controlname",
      },
      {
        title: "Reporting Header",
        dbname: "menureportingheader",
        url: "/reportingheadercreate",
      },
      {
        title: "Reporting Header ModuleList",
        dbname: "menureportingheadermodulelist",
        url: "/reportingtoheadermodulelist",
      },
      {
        title: "Hierarchy",
        dbname: "menuhierarchy",
        url: "",
        submenu: [
          {
            title: "Hierarchy Create",
            dbname: "menuhierarchycreate",
            url: "/setup/hierarchy",
            access: true,
          },
          {
            title: "Hierarchy Group List",
            dbname: "menuhierarchygrouplist",
            url: "/setup/grouplist",
          },
          {
            title: "Hierarchy Group Individual",
            dbname: "menuhierarchygroupindividual",
            url: "/setup/groupindividual",
          },
          {
            title: "Not Assign Hierarchy list",
            dbname: "menunotassignhierarchylist",
            url: "/setup/notassignhierarchylist",
            access: true,
          },
        ],
      },
    ],
  },
  {
    title: "Human Resources",
    dbname: "menuhumanresources",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Facility",
        dbname: "menufacility",
        url: "",
        submenu: [
          {
            title: "Branch",
            dbname: "menubranch",
            url: "/branch",
            access: true,
          },
          {
            title: "Accessible Company/Branch/Unit",
            dbname: "menuaccessiblecompany/branch/unit",
            url: "/assignbranch",
            access: true,
          },
          {
            title: "Accessible Branch Filter",
            dbname: "menuaccessiblebranchfilter",
            url: "/accessiblebranchfilter",
            access: true,
          },
          {
            title: "Accessible Branch Module List",
            dbname: "menuaccessiblebranchmodulelist",
            url: "/assignbranchmodulelist",
          },
          {
            title: "Team Accessible",
            dbname: "menuteamaccessible",
            url: "/teamaccessible",
          },
          {
            title: "Unassigned Accessible Company/Branch/Unit",
            dbname: "menuunassignedaccessiblecompany/branch/unit",
            url: "/hr/unassignbranchreport",
            access: true,
          },
          {
            title: "Unit",
            dbname: "menuunit",
            url: "/unit",
            access: true,
          },

          {
            title: "Area",
            dbname: "menuarea",
            url: "/area",
          },
          {
            title: "Area Grouping",
            dbname: "menuareagrouping",
            url: "/areagrouping",
            access: true,
          },
          {
            title: "Location",
            dbname: "menulocation",
            url: "/location",
          },
          {
            title: "Location Grouping",
            dbname: "menulocationgrouping",
            url: "/locationgrouping",
            access: true,
          },
          {
            title: "Floor",
            dbname: "menufloor",
            url: "/floor",
            access: true,
          },
          {
            title: "WorkStation",
            dbname: "menuworkstation",
            url: "/workstation",
            access: true,
          },
          {
            title: "WorkStation SystemName",
            dbname: "menuworkstationsystemname",
            url: "/updatepages/workstationsystemname",
            access: true,
          },
          // {
          //   title: "UnAllotted Remote System Name",
          //   dbname: "menuunallottedremotesystemname",
          //   url: "/updatepages/unallottedremotesystemname",
          // },
          // {
          //   title: "Allotted Remote System Name",
          //   dbname: "menuallottedremotesystemname",
          //   url: "/updatepages/allottedremotesystemname",
          // },

          {
            title: "Man Power",
            dbname: "menumanpower",
            url: "/manpower",
            access: true,
          },
        ],
      },
      {
        title: "HR",
        dbname: "menuhr",
        url: "",
        submenu: [
          {
            title: "Employee",
            dbname: "menuemployee",
            url: "",
            submenu: [
              {
                title: "Employee details",
                dbname: "menuemployeedetails",
                url: "",
                submenu: [
                  {
                    title: "Add Employee",
                    dbname: "menuaddemployee",
                    url: "/addemployee",
                    access: true,
                  },

                  {
                    title: "List",
                    dbname: "menulist",
                    url: "/list",
                    access: true,
                  },
                  {
                    title: "Employee MissingField List",
                    dbname: "menuemployeemissingfieldlist",
                    url: "/hrdocuments/empmissfield",
                    access: true,
                  },
                  {
                    title: "Draft List",
                    dbname: "menudraftlist",
                    url: "/draftlist",
                    access: true,
                  },
                  {
                    title: "Enquiry Purpose Users List",
                    dbname: "menuenquirypurposeuserslist",
                    url: "/enquirypurposelist",
                    access: true,
                  },
                  {
                    title: "Employee Prevalues List",
                    dbname: "menuemployeeprevalueslist",
                    url: "/Employeeprevalueslist",
                    access: true,
                  },
                  {
                    title: "Employee Facility Report",
                    dbname: "menuemployeefacilityreport",
                    url: "/employeefacilityreport",
                    access: true,
                  },
                  {
                    title: "Remote Employee List",
                    dbname: "menuremoteemployeelist",
                    url: "/remoteemployeelist",
                  },
                  {
                    title: "Individual Remote Employee List",
                    dbname: "menuindividualremoteemployeelist",
                    url: "/individualremoteemployeelist",
                  },
                  {
                    title: "Hierarchy Remote Employee List",
                    dbname: "menuhierarchyremoteemployeelist",
                    url: "/hierarchyremoteemployeelist",
                  },
                  {
                    title: "Remote Employee Details List",
                    dbname: "menuremoteemployeedetailslist",
                    url: "/remoteemployeedetailslist",
                    access: true,
                  },

                ],
              },
              {
                title: "Employee Update Details",
                dbname: "menuemployeeupdatedetails",
                url: "",
                submenu: [
                  {
                    title: "UnAssigned Bank Details",
                    dbname: "menuunassignedbankdetails",
                    url: "/updatepages/assignbankdetail",
                    access: true,
                  },
                  {
                    title: "Assigned Role Update",
                    dbname: "menuassignedroleupdate",
                    url: "/updatepages/assignedrole",
                    access: true,
                  },
                  {
                    title: "Assign Experience",
                    dbname: "menuassignexperience",
                    url: "/updatepages/assignexperience",
                    access: true,
                  },
                  {
                    title: "Assign Experience Filter",
                    dbname: "menuassignexperiencefilter",
                    url: "/updatepages/assignexperiencefilter",
                    access: true,
                  },
                  {
                    title: "Employee Signature Update",
                    dbname: "menuemployeesignatureupdate",
                    url: "/updatepages/addemployeesignature",
                    access: true,
                  },
                  {
                    title: "Assign Username",
                    dbname: "menuassignusername",
                    url: "/updatepages/assignusername",
                    access: true,
                  },
                  {
                    title: "Company Email Users List",
                    dbname: "menucompanyemailuserslist",
                    url: "/employeestatus/companyemailuserslist",
                    access: true,
                  },
                  {
                    title: "Assign Work Station",
                    dbname: "menuassignworkstation",
                    url: "/updatepages/assignworkstation",
                    access: true,
                  },
                  {
                    title: "WorkStation Assigned Report",
                    dbname: "menuworkstationassignedreport",
                    url: "/updatepages/workstationassignedreport",
                    access: true,
                  },
                  {
                    title: "WorkStation UnAssigned Report",
                    dbname: "menuworkstationunassignedreport",
                    url: "/updatepages/workstationunassignedreport",
                    access: true,
                  },
                  {
                    title: "Individual Workstation",
                    dbname: "menuindividualworkstation",
                    url: "/updatepages/individualworkstation",
                  },
                  {
                    title: "Team Workstation",
                    dbname: "menuteamworkstation",
                    url: "/updatepages/hierarchyworkstationstatus",
                  },
                  {
                    title: "Personal Info update",
                    dbname: "menupersonalinfoupdate",
                    url: "/updatepages/personalupdate",
                    access: true,
                  },
                  {
                    title: "Contact Info update",
                    dbname: "menucontactinfoupdate",
                    url: "/updatepages/contactupdate",
                    access: true,
                  },

                  {
                    title: "Login Info update",
                    dbname: "menulogininfoupdate",
                    url: "/updatepages/loginupdate",
                    access: true,
                  },
                  {
                    title: "Boarding Info update",
                    dbname: "menuboardinginfoupdate",
                    url: "/updatepages/boardingupdate",
                    access: true,
                  },
                  {
                    title: "Assigned Bank Details",
                    dbname: "menuassignedbankdetails",
                    url: "/updatepages/bankdetailinfo",
                    access: true,
                  },
                  {
                    title: "Document Info update",
                    dbname: "menudocumentinfoupdate",
                    url: "/updatepages/documentupdate",
                    access: true,
                  },
                  {
                    title: "Joining Info update",
                    dbname: "menujoininginfoupdate",
                    url: "/updatepages/Joiningupdate",
                    access: true,
                  },
                  {
                    title: "Educational Detail update",
                    dbname: "menueducationaldetailupdate",
                    url: "/updatepages/educationalupdate",
                    access: true,
                  },
                  {
                    title: "Additional Qualification Update",
                    dbname: "menuadditionalqualificationupdate",
                    url: "/updatepages/addlqualificationupdate",
                    access: true,
                  },
                  {
                    title: "Work History Info update",
                    dbname: "menuworkhistoryinfoupdate",
                    url: "/updatepages/workhistoryupdate",
                    access: true,
                  },
                ],
              },
              {
                title: "Employee Status Details",
                dbname: "menuemployeestatusdetails",
                url: "",
                submenu: [
                  {
                    title: "Employee Status",
                    dbname: "menuemployeestatus",
                    url: "/interview/employeestatus",
                    access: true,
                  },
                  {
                    title: "Live Employee List",
                    dbname: "menuliveemployeelist",
                    url: "/liveemployeelist",
                    access: true,
                  },
                  {
                    title: "Employee Intern Live List",
                    dbname: "menuemployeeinternlivelist",
                    url: "/employeeinternlivelist",
                    access: true,
                  },
                  {
                    title: "Employee Login Status",
                    dbname: "menuemployeeloginstatus",
                    url: "/employee/loginstatus",
                    access: true,
                  },
                  {
                    title: "Individual Login Status",
                    dbname: "menuindividualloginstatus",
                    url: "/hr/individualloginsttaus",
                  },
                  {
                    title: "Team Login Status",
                    dbname: "menuteamloginstatus",
                    url: "/hr/hierarchyloginsttaus",
                  },
                  {
                    title: "Long Absent Restriction List",
                    dbname: "menulongabsentrestrictionlist",
                    url: "/employee/longabsentrestrictionlist",
                    access: true,
                  },
                  {
                    title: "Long Absent Restriction Completed List",
                    dbname: "menulongabsentrestrictioncompletedlist",
                    url: "/updatedpages/employeestatuscompleted",
                    access: true,
                  },
                  {
                    title: "Team Long Absent Restriction List",
                    dbname: "menuteamlongabsentrestrictionlist",
                    url: "/employee/longabsentrestrictionhierarchylist",
                  },
                  {
                    title: "Team Auto Clockout Restriction List",
                    dbname: "menuteamautoclockoutrestrictionlist",
                    url: "/employee/teamautoclockoutrestrictionlist",
                  },

                  {
                    title: "Temporary Login",
                    dbname: "menutemporarylogin",
                    url: "/updatedpages/temploginstatus",
                    access: true,
                  },
                  {
                    title: "Employee System Allot Details",
                    dbname: "menuemployeesystemallotdetails",
                    url: "/employeesystemallot",
                    access: true,
                  },
                  {
                    title: "Desktop Login Report",
                    dbname: "menudesktoploginreport",
                    url: "/employeestatus/desktoploginreport",
                    access: true,
                  },
                  {
                    title: "HRMS Idle Time Report",
                    dbname: "menuhrmsidletimereport",
                    url: "/hrmsidletimereport",
                    access: true,
                  },
                  {
                    title: "Pending HiTracker Installations Report",
                    dbname: "menupendinghitrackerinstallationsreport",
                    url: "/pendinghitrackerinstallationsreport",
                    access: true,
                  },
                  {
                    title: "Employee Monitor Log",
                    dbname: "menuemployeemonitorlog",
                    url: "/employeemonitorlog",
                    access: true,
                  },
                  {
                    title: "Employee Monitor Log Screenshot",
                    dbname: "menuemployeemonitorlogscreenshot",
                    url: "/employeemonitorlogscreenshot",
                    access: true,
                  },
                  {
                    title: "Employee Monitor Live Screen",
                    dbname: "menuemployeemonitorlivescreen",
                    url: "/employeemonitorlivescreen",
                    access: true,
                  },
                ],
              },
              {
                title: "Employee Action Details",
                dbname: "menuemployeeactiondetails",
                url: "",
                submenu: [
                  {
                    title: "Action Employee List",
                    dbname: "menuactionemployeelist",
                    url: "/updatepages/noticeperiodactionemployeelist",
                    access: true,
                  },
                  {
                    title: "Deactivate Employees List",
                    dbname: "menudeactivateemployeeslist",
                    url: "/updatepages/deactivateemployeeslist",
                    access: true,
                  },
                  {
                    title: "Deactivate Employees List View",
                    dbname: "menudeactivateemployeeslistview",
                    url: "/updatepages/deactivateemployeeslistview",
                    access: true,
                  },
                  {
                    title: "Rejoined Employee List",
                    dbname: "menurejoinedemployeelist",
                    url: "/updatepages/rejoinemployeelist",
                    access: true,
                  },
                ],
              },
              {
                title: "Intern details",
                dbname: "menuinterndetails",
                url: "",
                submenu: [
                  {
                    title: "Add Intern",
                    dbname: "menuaddintern",
                    url: "/intern/create",
                    access: true,
                  },
                  {
                    title: "Intern List",
                    dbname: "menuinternlist",
                    url: "/internlist",
                    access: true,
                  },
                  {
                    title: "Intern Live List",
                    dbname: "menuinternlivelist",
                    url: "/internlivelist",
                    access: true,
                  },
                  {
                    title: "Intern Draft List",
                    dbname: "menuinterndraftlist",
                    url: "/interndraftlist",
                    access: true,
                  },
                  // {
                  //   title: "Intern",
                  //   dbname: "menuintern",
                  //   url: "/intern",
                  // },
                  // {
                  //   title: "InternCourse",
                  //   dbname: "menuinterncourse",
                  //   url: "/interncourse",
                  // },
                  {
                    title: "Active Intern List",
                    dbname: "menuactiveinternlist",
                    url: "/activeinternlist",
                    access: true,
                  },
                  {
                    title: "Deactivate Intern List",
                    dbname: "menudeactivateinternlist",
                    url: "/deactivateinternlist",
                    access: true,
                  },
                  {
                    title: "Deactivate Intern List View",
                    dbname: "menudeactivateinternlistview",
                    url: "/deactivateinternlistview",
                    access: true,
                  },
                ],
              },
              {
                title: "Employee Log Details",
                dbname: "menuemployeelogdetails",
                submenu: [
                  {
                    title: "Process Log",
                    dbname: "menuprocesslog",
                    url: "/updatepages/processallot",
                    access: true,
                  },
                  {
                    title: "Designation Log",
                    dbname: "menudesignationlog",
                    url: "/updatepages/designationlog",
                    access: true,
                  },
                  {
                    title: "Department Log",
                    dbname: "menudepartmentlog",
                    url: "/updatepages/departmentlog",
                    access: true,
                  },
                  {
                    title: "Boarding Log",
                    dbname: "menuboardinglog",
                    url: "/updatepages/boardinglog",
                    access: true,
                  },
                  {
                    title: "Shift Log",
                    dbname: "menushiftlog",
                    url: "/updatepages/shiftlog",
                    access: true,
                  },
                  {
                    title: "Assign Manual Salary Details",
                    dbname: "menuassignmanualsalarydetails",
                    url: "/assignmanualsalarydetails",
                    access: true,
                  },
                  // {
                  //   title: "Assigned Manual Salary Details",
                  //   dbname: "menuassignedmanualsalarydetails",
                  //   url: "/assignednmanualsalarydetails",
                  // },
                  {
                    title: "Assigned PF-ESI",
                    dbname: "menuassignedpf-esi",
                    url: "/updatepages/assignedpfesi",
                    access: true,
                  },
                  {
                    title: "Assign PF-ESI",
                    dbname: "menuassignpf-esi",
                    url: "/updatepages/assignpfesi",
                    access: true,
                  },
                ],
              },

              {
                title: "Notice Period",
                dbname: "menunoticeperiod",
                url: "",
                submenu: [
                  {
                    title: "Notice Period Apply",
                    dbname: "menunoticeperiodapply",
                    url: "/updatepages/noticeperiodapply",
                    access: true,
                  },
                  {
                    title: "Notice Period Status",
                    dbname: "menunoticeperiodstatus",
                    url: "/updatepages/noticeperiodlist",
                    access: true,
                  },
                  {
                    title: "Notice Period Approve",
                    dbname: "menunoticeperiodapprove",
                    url: "/updatepages/noticeperiodstatuslist",
                    access: true,
                  },
                  {
                    title: "Notice Period Scheduled Meeting List",
                    dbname: "menunoticeperiodscheduledmeetinglist",
                    url: "/updatepages/noticeperiodscheduledmeetinglist",
                  },
                  {
                    title: "Notice Period List Hierarchy",
                  },
                  {
                    title: "Exit List",
                    dbname: "menuexitlist",
                    url: "/updatepages/exitlist",
                    access: true,
                  },
                  {
                    title: "Pending Releave Exit List",
                    dbname: "menupendingreleaveexitlist",
                    url: "/updatepages/pendingreleaveexitlist",
                  },
                ],
              },
              // {
              //   title: "Exit Detail",
              //   dbname: "menuexitdetail",
              //   url: "",
              //   submenu: [
              //     {
              //       title: "Add Exit Details",
              //       dbname: "menuaddexitdetails",
              //       url: "/updatepages/addexists",
              //     },
              //     {
              //       title: "Exists Details List",
              //       dbname: "menuexistsdetailslist",
              //       url: "/updatepages/exitdetaillist",
              //     },
              //     {
              //       title: "Deactive Employee List",
              //       dbname: "menudeactiveemployeelist",
              //       url: "/updatepages/deactivateemployeeslist",
              //     },

              //   ],
              // },
            ],
          },
          {
            title: "HR Setup",
            dbname: "menuhrsetup",
            url: "",
            submenu: [
              {
                title: "Department",
                dbname: "menudepartment",
                url: "/department",
              },
              {
                title: 'Employee Designation Requirements',
                dbname: 'menuemployeedesignationrequirements',
                url: '/employeedesignationrequirements',
              },
              {
                title: 'My Roles & Responsibilities',
                dbname: 'menumyroles&responsibilities',
                url: '/myrolesandresponsibilities',
              },
              {
                title: "Department Month Set Auto",
                dbname: "menudepartmentmonthsetauto",
                url: "/updatepages/departmentmonthsetauto",
              },
              {
                title: "Department Month Set",
                dbname: "menudepartmentmonthset",
                url: "/updatepages/departmentmonthset",
              },
              {
                title: "Designation Month Set",
                dbname: "menudesignationmonthset",
                url: "/updatepages/designationmonthset",
              },
              {
                title: "Process Month Set",
                dbname: "menuprocessmonthset",
                url: "/updatepages/processmonthset",
              },

              {
                title: "Designation Group",
                dbname: "menudesignationgroup",
                url: "/designationgroup",
              },
              {
                title: "Department&Designation Grouping",
                dbname: "menudepartment&designationgrouping",
                url: "/departmentanddesignationgrouping",
              },
              {
                title: "Boarding Grouping",
                dbname: "menuboardinggrouping",
                url: "/updatepages/designationloggrouping",
                access: true,
              },
              {
                title: "Designation",
                dbname: "menudesignation",
                url: "/designation",
              },

              {
                title: "Qualification",
                dbname: "menuqualification",
                url: "/qualification",
              },
              {
                title: "Teams",
                dbname: "menuteams",
                url: "/teams",
                access: true,
              },
              {
                title: "Education",
                dbname: "menueducation",
                url: "/education",
              },
              {
                title: "Education Category",
                dbname: "menueducationcategory",
                url: "/educationcategory",
              },
              {
                title: "Education Specilization",
                dbname: "menueducationspecilization",
                url: "/educationspecilization",
              },
              {
                title: "Certification",
                dbname: "menucertification",
                url: "/certification",
              },
              {
                title: "Skillset",
                dbname: "menuskillset",
                url: "/skillset",
              },
              {
                title: "Shift Break Hours",
                dbname: "menushiftbreakhours",
                url: "/shiftbreakhours",
              },
              {
                title: "Shift",
                dbname: "menushift",
                url: "/shift",
              },
              {
                title: "Shift Grouping",
                dbname: "menushiftgrouping",
                url: "/shiftgrouping",
              },
            ],
          },
          {
            title: 'Attendance',
            dbname: 'menuattendance',
            url: '',
            submenu: [
              {
                title: 'Attendance Setup',
                dbname: 'menuattendancesetup',
                url: '',
                submenu: [
                  {
                    title: 'Attendance Mode Master',
                    dbname: 'menuattendancemodemaster',
                    url: '/attendance/modemaster',
                  },
                  {
                    title: 'Attendance Status Master',
                    dbname: 'menuattendancestatusmaster',
                    url: '/attendancestatusmaster',
                  },
                  {
                    title: 'Weekoff Controlpanel',
                    dbname: 'menuweekoffcontrolpanel',
                    url: '/weekoffpresent',
                    access: true,
                  },
                ],
              },
              {
                title: 'Attendance Update',
                dbname: 'menuattendanceupdate',
                url: '',
                submenu: [
                  {
                    title: 'Holiday/Weekoff Login',
                    dbname: 'menuholiday/weekofflogin',
                    url: '/holidayweekofflogin',
                    access: true,
                  },
                  {
                    title: 'Overall Individual Status',
                    dbname: 'menuoverallindividualstatus',
                    url: '/attendance/individualstatuslist',
                    access: true,
                  },
                  {
                    title: 'Team Attendance Status',
                    dbname: 'menuteamattendancestatus',
                    url: '/setup/attendanceindividualhierarchy',
                  },
                  {
                    title: 'Attendance Checklist',
                    dbname: 'menuattendancechecklist',
                    url: '/attendance/checklist',
                    access: true,
                  },
                  {
                    title: 'Attendance Bulk Update',
                    dbname: 'menuattendancebulkupdate',
                    url: '/attendancebulkupdate',
                    access: true,
                  },

                  {
                    title: 'User Shift Weekoff Present',
                    dbname: 'menuusershiftweekoffpresent',
                    url: '/attendance/usershiftweekoffpresent',
                    access: true,
                  },
                ],
              },
              {
                title: 'Attendance Reports',
                dbname: 'menuattendancereports',
                url: '',
                submenu: [
                  {
                    title: 'Attendance Day Shift',
                    dbname: 'menuattendancedayshift',
                    url: '/attendancedayshift',
                    access: true,
                  },
                  {
                    title: 'Attendance Short Time',
                    dbname: 'menuattendanceshorttime',
                    url: '/attendanceshorttime',
                    access: true,
                  },

                  {
                    title: 'Attendance Bulk Update Report',
                    dbname: 'menuattendancebulkupdatereport',
                    url: '/attendancebulkupdatereport',
                    access: true,
                  },
                  {
                    title: 'User Shift Roaster',
                    dbname: 'menuusershiftroaster',
                    url: '/usershiftroaster',
                    access: true,
                  },

                  {
                    title: 'Individual User Shift Weekoff Present',
                    dbname: 'menuindividualusershiftweekoffpresent',
                    url: '/attendance/individualusershiftweekoffpresent',
                  },

                  {
                    title: 'Attendance Month Status',
                    dbname: 'menuattendancemonthstatus',
                    url: '/attendance/monthstatuslist',
                    access: true,
                  },

                  {
                    title: 'Attendance Review',
                    dbname: 'menuattendancereview',
                    url: '/attendance/review',
                    access: true,
                  },

                  {
                    title: 'Attendance Report',
                    dbname: 'menuattendancereport',
                    url: '/attendancereport',
                    access: true,
                  },
                  {
                    title: 'Attendance With Production Overall Review',
                    dbname: 'menuattendancewithproductionoverallreview',
                    url: '/attendancewithproductionoverallreview',
                    access: true,
                  },
                  {
                    title: 'Attendance With Production Individual Review',
                    dbname: 'menuattendancewithproductionindividualreview',
                    url: '/attendancewithproductionoverallreviewindv',
                  },
                  {
                    title: 'My Attendance Status',
                    dbname: 'menumyattendancestatus',
                    url: '/attendance/myindividualstatuslist',
                  },
                ],
              },
              {
                title: 'Biometric Device',
                dbname: 'menubiometricdevice',
                url: '',
                submenu: [
                  {
                    title: 'Assign Biometric Device Card Number',
                    dbname: 'menuassignbiometricdevicecardnumber',
                    url: '/assignbiometricdevicelist',
                    access: true,
                  },
                  {
                    title: 'Assigned Biometric Device Card Number',
                    dbname: 'menuassignedbiometricdevicecardnumber',
                    url: '/assignedbiometricdevicelist',
                    access: true,
                  },
                  {
                    title: 'Biometric Attendance Report',
                    dbname: 'menubiometricattendancereport',
                    url: '/employeestatus/biometricattendancereport',
                  },
                ],
              },
            ],
          },
          {
            title: "BX-Biometric Device",
            dbname: "menubx-biometricdevice",
            url: "",
            submenu: [
              {
                title: 'Biometric Brand-Model',
                dbname: 'menubiometricbrand-model',
                url: '/biometric/brandmodel',
                access: false,
              },
              {
                title: 'Biometric Device Master',
                dbname: 'menubiometricdevicemaster',
                url: '/biometric/biometricdevicemaster',
                access: false,
              },
              {
                title: "Biometric Device Management",
                dbname: "menubiometricdevicemanagement",
                url: "/biometricdevicemanagement",
                access: true,
              },
              {
                title: "Biometric Status List",
                dbname: "menubiometricstatuslist",
                url: "/biometricstatuslist",
                access: true,
              },
              {
                title: "Biometric Users Pending Report",
                dbname: "menubiometricuserspendingreport",
                url: "/biometricuserspendingreport",
              },
            ],
          },
          {
            title: "Holiday",
            dbname: "menuholiday",
            submenu: [
              {
                title: "Manage Holiday",
                dbname: "menumanageholiday",
                url: "/setup/holiday",
                access: true,
              },
              {
                title: "Holiday Filter",
                dbname: "menuholidayfilter",
                url: "/setup/holidayfilter",
              },
              {
                title: "HolidayCalendar View",
                dbname: "menuholidaycalendarview",
                url: "/setup/holidaycalendar",
              },
            ],
          },
          {
            title: "Meeting",
            dbname: "menumeeting",
            url: "",
            submenu: [
              {
                title: "Meeting Master",
                dbname: "menumeetingmaster",
                url: "/tickets/meetingmaster",
              },
              {
                title: "Schedule Meeting",
                dbname: "menuschedulemeeting",
                url: "/setup/schedulemeeting",
                access: true,
              },
              {
                title: "Schedule Meeting Filter",
                dbname: "menuschedulemeetingfilter",
                url: "/setup/schedulemeetingfilter",
              },
              {
                title: "Schedule Meeting Calendar View",
                dbname: "menuschedulemeetingcalendarview",
                url: "/setup/meetingcalendar",
              },
            ],
          },
          {
            title: "Events",
            dbname: "menuevents",
            url: "/dashboard",
            submenu: [
              {
                title: "Manage Events",
                dbname: "menumanageevents",
                url: "/setup/events",
                access: true,
              },
              {
                title: "Event Filter",
                dbname: "menueventfilter",
                url: "/setup/eventsfilter",
              },
              {
                title: "Event Calendar View",
                dbname: "menueventcalendarview",
                url: "/setup/eventscalendar",
              },
            ],
          },
          {
            title: "Announcement",
            dbname: "menuannouncement",
            url: "",
            submenu: [
              {
                title: "Announcement Category",
                dbname: "menuannouncementcategory",
                url: "/announcement/announcementcategory",
              },
              {
                title: "Announcement",
                dbname: "menuannouncement",
                url: "/announcement",
                access: true,
              },
            ],
          },
          {
            title: "Shift Details",
            dbname: "menushiftdetails",
            url: "",
            submenu: [
              // {
              //   title: "Shift Roaster",
              //   dbname: "menushiftroaster",
              //   url: "/shiftroaster",
              // },
              // {
              //   title: "Shift Roaster",
              //   dbname: "menushiftroaster",
              //   url: "/shiftfilterview",
              //   access: true,
              // },
              {
                title: "Shift Adjustment",
                dbname: "menushiftadjustment",
                url: "/shiftadjustment",
                access: true,
              },
              {
                title: "Shift Adjustment Filter",
                dbname: "menushiftadjustmentfilter",
                url: "/shiftadjustmentfilter",
                access: true,
              },
              {
                title: "Shift Adjustment Weekoff Filter",
                dbname: "menushiftadjustmentweekofffilter",
                url: "/shiftadjustmentweekofffilter",
                access: true,
              },
              // {
              //   title: "User Shift",
              //   dbname: "menushiftadjustment",
              //   url: "/usershiftlist",
              // },

              {
                title: "My Shift Roaster",
                dbname: "menumyshiftroaster",
                url: "/myshiftadjustment",
              },
              {
                title: "Team Shift Verification",
                dbname: "menuteamshiftverification",
                url: "/teamshiftverification",
              },
            ],
          },
        ],
      },
      {
        title: 'HR Documents',
        dbname: 'menuhrdocuments',
        submenu: [
          {
            title: 'Documents Setup',
            dbname: 'menudocumentssetup',
            url: '',
            submenu: [
              {
                title: 'Template Control Panel',
                dbname: 'menutemplatecontrolpanel',
                url: '/settings/templatecontrolpanel',
                access: true,
              },
              {
                title: 'Terms and Condition',
                dbname: 'menutermsandcondition',
                url: '/hrdocuments/termsandcondition',
              },
              {
                title: 'Employee Documents keywords',
                dbname: 'menuemployeedocumentskeywords',
                url: '/hrdocuments/employeedocumentskeywords',
              },
              {
                title: 'Company Documents keywords',
                dbname: 'menucompanydocumentskeywords',
                url: '/hrdocuments/companydocumentskeywords',
              },
              {
                title: 'Candidate Documents keywords',
                dbname: 'menucandidatedocumentskeywords',
                url: '/hrdocuments/candidatedocumentskeywords',
              },

              {
                title: 'Template Creation',
                dbname: 'menutemplatecreation',
                url: '/hrdocuments/templatecreation',
                access: true,
              },
            ],
          },
          {
            title: 'Employee Documents',
            dbname: 'menuemployeedocuments',
            url: '',
            submenu: [
              {
                title: 'Employee Document Preparation',
                dbname: 'menuemployeedocumentpreparation',
                url: '/hrdocuments/documentpreparation',
                access: true,
              },
              {
                title: 'Employee Document Printed Status List',
                dbname: 'menuemployeedocumentprintedstatuslist',
                url: '/hrdocuments/documentprintedfilterlist',
                access: true,
              },
              {
                title: 'Approval User Documents',
                dbname: 'menuapprovaluserdocuments',
                url: '/hrdocuments/approvaluserdocuments',
                access: true,
              },
              {
                title: 'Hierarchy Approval Employee Documents',
                dbname: 'menuhierarchyapprovalemployeedocuments',
                url: '/hrdocuments/hierarchyapprovalemployeedocuments',
                access: true,
              },
              {
                title: 'PaySlip Document Preparation',
                dbname: 'menupayslipdocumentpreparation',
                url: '/hrdocuments/payslippreparation',
                access: true,
              },
              {
                title: 'Idcard Preparation',
                dbname: 'menuidcardpreparation',
                url: '/hrdocuments/createidcard',
                access: true,
              },
              {
                title: 'Employee Document Preparation Mail',
              },
            ],
          },
          {
            title: 'Company Documents',
            dbname: 'menucompanydocuments',
            url: '',
            submenu: [
              {
                title: 'Company Document Preparation',
                dbname: 'menucompanydocumentpreparation',
                url: '/hrdocuments/companydocuments',
                access: true,
              },
            ],
          },
          {
            title: 'Candidate Documents',
            dbname: 'menucandidatedocuments',
            url: '',
            submenu: [
              {
                title: 'Candidate Document Preparation',
                dbname: 'menucandidatedocumentpreparation',
                url: '/hrdocuments/candidatedocuments',
                access: true,
              },
              {
                title: 'Candidate Document Printed List',
                dbname: 'menucandidatedocumentprintedlist',
                url: '/hrdocuments/candidatedocumentprintedlist',
                access: true,
              },
              {
                title: 'Approval Candidate Documents',
                dbname: 'menuapprovalcandidatedocuments',
                url: '/hrdocuments/approvalcandidatedocuments',
                access: true,
              },
            ],
          },
        ],
      },
      {
        title: "Recruitment",
        dbname: "menurecruitment",
        submenu: [
          {
            title: "Department Grouping",
            dbname: "menudepartmentgrouping",
            url: "/departmentgrouping",
          },
          {
            title: "Designation Requirements",
            dbname: "menudesignationrequirements",
            url: "/recruitment/designationrequirements",
          },

          {
            title: "Vacancy Posting",
            dbname: "menuvacancyposting",
            url: "/recruitment/vacancyposting",
            access: true,
          },
          {
            title: "Recruitment Planning",
            dbname: "menurecruitmentplanning",
            url: "/recruitment/recruitmentplanning",
            access: true,
          },
          {
            title: "Candidate Document",
            dbname: "menucandidatedocument",
            url: "/candidatedocument",
          },
          {
            title: "Candidate Missing Fields",
            dbname: "menucandidatemissingfields",
            url: "/candidatemissingfields",
          },
          {
            title: "Onboading Pending Checklist",
            dbname: "menuonboadingpendingchecklist",
            url: "/interview/allinterviewpendingchecklist",
            access: true,
          },
          {
            title: "Job Openings",
            dbname: "menujobopenings",
            url: "/recruitment/jobopenlist",
            access: true,
          },
          {
            title: "Interview Status Count Report Page",
            dbname: "menuinterviewstatuscountreportpage",
            url: "/recruitment/interviewstatuscountreportpage",
            access: true,
          },
          {
            title: "Overall Not Response Report",
            dbname: "menuoverallnotresponsereport",
            url: "/recruitment/overallnotresponsereport",
            access: true,
          },
          {
            title: "My Interview",
            dbname: "menumyinterview",
            url: "/interview/myinterview",
          },

          {
            title: "Interview/Candidates Report Page",
            dbname: "menuinterview/candidatesreportpage",
            url: "/interview/interviewcandidatesreportpage",
            access: true,
          },

          // {
          //   title: "Roles and Responsibilities Category",
          //   dbname: "menurolesandresponsibilitiescategory",
          //   url: "/recruitment/rolesandresponsecategory",
          // },
          // {
          //   title: "Roles and Responsibilities",
          //   dbname: "menurolesandresponsibilities",
          //   url: "/recruitment/rolesandresponse",
          // },
          // {
          //   title: "Roles of Responsibilities",
          //   dbname: "menurolesofresponsibilities",
          //   url: "/recruitment/rolesandres",
          // },
          {
            title: "Resume",
            dbname: "menuresume",
            url: "",
            submenu: [
              {
                title: "Resume Management",
                dbname: "menuresumemanagement",
                url: "/resumemanagement",
              },
              {
                title: "Resume Mail Attachments",
                dbname: "menuresumemailattachments",
                url: "/resumemailattachments",
              },
              {
                title: "Add Resume",
                dbname: "menuaddresume",
                url: "/recruitment/addresume",
              },
              {
                title: "Assigned Candidates",
                dbname: "menuassignedcandidates",
                url: "/recruitment/assignedcandidates",
              },
              {
                title: "Unassigned Candidates",
                dbname: "menuunassignedcandidates",
                url: "/recruitment/unassignedcandidates",
              },
            ],
          },

          // {
          //   title: "Document Grouping",
          //   dbname: "menudocumentgrouping",
          //   url: "/documentgrouping",
          // },
          // {
          //   title: "List of Document",
          //   dbname: "menulistofdocument",
          //   url: "/listofdocument",
          // },
          // {
          //   title: "Interview Form",
          //   dbname: "menuinterviewform",
          //   url: "/hr/recruitment/useform",
          // },
        ],
      },
    ],
  },
  {
    title: "Projects",
    dbname: "menuprojects",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Project",
        dbname: "menuproject",
        url: "/project/project",
      },
      {
        title: "Sub Project",
        dbname: "menusubproject",
        url: "/project/subproject",
      },
      {
        title: "Module",
        dbname: "menumodule",
        url: "/project/module",
      },
      {
        title: "Sub Modules",
        dbname: "menusubmodules",
        url: "",
        submenu: [
          {
            title: "Sub Module",
            dbname: "menusubmodule",
            url: "/project/submodule",
          },
          {
            title: "Submodule List view",
            dbname: "menusubmodulelistview",
            url: "/project/submodulelistview",
          },
          {
            title: "Requirements",
            dbname: "menurequirements",
            url: "/project/requirements",
          },
          {
            title: "Raise Issue",
            dbname: "menuraiseissue",
            url: "/project/raiseissue",
          },
        ],
      },
      {
        title: "Page Model",
        dbname: "menupagemodel",
        url: "/project/pagemodel",
      },
      {
        title: "Components",
        dbname: "menucomponents",
        url: "",
        submenu: [
          {
            title: "Component Master",
            dbname: "menucomponentmaster",
            url: "/excel/components/componentlist",
          },
          {
            title: "SubComponent Master",
            dbname: "menusubcomponentmaster",
            url: "/excel/components/subcomponentlist",
          },
          {
            title: "Component Group",
            dbname: "menucomponentgroup",
            url: "/excel/components/componentgroup",
          },
        ],
      },
      {
        title: "Page Type",
        dbname: "menupagetype",
        url: "/project/pagetype",
      },
      {
        title: "Priority",
        dbname: "menupriority",
        url: "/project/priority",
      },
      // {
      //   title: 'Category',
      //   dbname: 'lcategory',
      //   url: '',
      //   submenu: [

      //     {
      //       title: 'Category subcategory master',
      //       dbname: 'lcategorysubcategorymaster',
      //       url: '/project/categorysubmaster',
      //     },
      //     {
      //       title: 'Checkpoint Group',
      //       dbname: 'lcheckpointgroup',
      //       url: '/checkpointgroup',
      //     },
      //   ],
      // },
      {
        title: "Tasks",
        dbname: "menutasks",
        url: "",
        submenu: [
          {
            title: "Not Yet Task Assign Board",
            dbname: "menunotyettaskassignboard",
            url: "/project/nottaskassignboard",
            access: true,
          },
          {
            title: "Task Assigned Board",
            dbname: "menutaskassignedboard",
            url: "/project/taskassignboard",
            access: true,
          },
          {
            title: "Task Board",
            dbname: "menutaskboard",
            url: "/project/tasklist",
          },
          {
            title: "Task Report",
            dbname: "menutaskreport",
            url: "/project/taskreport",
          },
          {
            title: "Task Remarks",
            dbname: "menutaskremarks",
            url: "/remark",
          },
        ],
      },
    ],
  },
  {
    title: "Queue Priorities",
    dbname: "menuqueuepriorities",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Queue Priorities Data Upload",
        dbname: "menuqueueprioritiesdataupload",
        url: "/cropper",
      },
      {
        title: "Excel Data",
        dbname: "menuexceldata",
        url: "/todo",
      },
      {
        title: "Work Order Live",
        dbname: "menuworkorderlive",
        url: "/excel/workorderlive",
      },
      {
        title: "Work Order Consolidated",
        dbname: "menuworkorderconsolidated",
        submenu: [
          {
            title: "Primary Work Order List",
            dbname: "menuprimaryworkorderlist",
            url: "/excel/primaryworkorderlist",
            access: true,
          },
          {
            title: "Secondary Work Order List",
            dbname: "menusecondaryworkorderlist",
            url: "/excel/secondaryworkorderlist",
            access: true,
          },
          {
            title: "Tertiary Work Order List",
            dbname: "menutertiaryworkorderlist",
            url: "/excel/tertiaryworkorderlist",
            access: true,
          },
          {
            title: "Others Work Order List",
            dbname: "menuothersworkorderlist",
            url: "/excel/othersworkorderlist",
            access: true,
          },
          {
            title: "Consolidated(primary/secondary/tertiary) Work Order List",
            dbname: "menuconsolidated(primary/secondary/tertiary)workorderList",
            url: "/excel/consolidatedprimaryworkorderlist",
            access: true,
          },
          {
            title: "Consolidated All Work Order List",
            dbname: "menuconsolidatedallworkorderlist",
            url: "/excel/consolidatedallworkorderlist",
            access: true,
          },
        ],
      },
      {
        title: "Work Order Consolidated Hierarchy",
        dbname: "menuworkorderconsolidatedhierarchy",
        submenu: [
          {
            title: "Primary Hierarchy WorkOrder List",
            dbname: "menuprimaryhierarchyworkorderlist",
            url: "/excel/primaryworkorderhierarchylist",
          },
          {
            title: "Secondary Hierarchy WorkOrder List",
            dbname: "menusecondaryhierarchyworkorderlist",
            url: "/excel/secondaryworkorderhierarchylist",
          },
          {
            title: "Tertiary Hierarchy WorkOrder List",
            dbname: "menutertiaryhierarchyworkorderlist",
            url: "/excel/tertiaryworkorderhierarchylist",
          },
          {
            title: "Other Hierarchy WorkOrder List",
            dbname: "menuotherhierarchyworkorderlist",
            url: "/excel/otherworkorderhierarchylist",
          },
          {
            title: "Consolidated(primary/secondary/tertiary) Hierarchy WorkOrder List",
            dbname: "menuconsolidated(primary/secondary/tertiary)hierarchyworkorderlist",
            url: "/excel/consolidatedworkorderhierarchylist",
          },
          {
            title: "Consolidated All Hierarchy WorkOrder List",
            dbname: "menuconsolidatedallhierarchyworkorderlist",
            url: "/excel/consolidatedallhierarchylist",
          },
        ],
      },

      {
        title: "Work Order Individual",
        dbname: "menuworkorderindividual",
        submenu: [
          {
            title: "Primary Individual Work Order List",
            dbname: "menuprimaryindividualworkorderlist",
            url: "/excel/primaryindividualworkorder",
          },
          {
            title: "Secondary Individual Work Order List",
            dbname: "menusecondaryindividualworkorderlist",
            url: "/excel/secondaryindividualworkorder",
          },
          {
            title: "Tertiary Individual Work Order List",
            dbname: "menutertiaryindividualworkorderlist",
            url: "/excel/tertiaryindividualworkorder",
          },
          {
            title: "Other Individual Work Order List",
            dbname: "menuotherindividualworkorderlist",
            url: "/excel/otherindividualworkorder",
            access: true,
          },
          {
            title: "Consolidated(primary/secondary/tertiary) Individual Work Order List",
            dbname: "menuconsolidated(primary/secondary/tertiary)individualworkorderlist",
            url: "/excel/consolidatedindividualprimarysecondarytertiary",
            access: true,
          },
          {
            title: "Consolidated All Individual Work Order List",
            dbname: "menuconsolidatedallindividualworkorderlist",
            url: "/excel/consolidatedindividualall",
            access: true,
          },
        ],
      },

      {
        title: "Queue Allot",
        dbname: "menuqueueallot",
        url: "",
        submenu: [
          {
            title: "UnAllotted Queue List",
            dbname: "menuunallottedqueuelist",
            url: "/excel/allotlist/unallotqueuelist",
          },
          {
            title: "Alloted Queue List",
            dbname: "menuallotedqueuelist",
            url: "/excel/allotlist/allotqueuelist",
          },
          {
            title: "UnAllotted Responsible List",
            dbname: "menuunallottedresponsiblelist",
            url: "/excel/allotlist/unallottedresponsiblelist",
            access: true,
          },
          {
            title: "Allotted Responsible List",
            dbname: "menuallottedresponsiblelist",
            url: "/excel/allotlist/allottedresponsiblelist",
            access: true,
          },
        ],
      },

      {
        title: "Queue Report",
        dbname: "menuqueuereport",
        url: "",
        submenu: [
          {
            title: "Branch Wise Report",
            dbname: "menubranchwisereport",
            url: "/excel/reports/branchwise",
          },
          {
            title: "Category Wise Report",
            dbname: "menucategorywisereport",
            url: "/excel/reports/categorywise",
          },
          {
            title: "Customer Wise Report",
            dbname: "menucustomerwisereport",
            url: "/excel/reports/customerwise",
          },
          {
            title: "Queue Wise Report",
            dbname: "menuqueuewisereport",
            url: "/excel/reports/queuewise",
          },
          {
            title: "Responsible Person Wise Report",
            dbname: "menuresponsiblepersonwisereport",
            url: "/excel/reports/responsibleperson",
          },
          {
            title: "Team Wise Report",
            dbname: "menuteamwisereport",
            url: "/excel/reports/teamwise",
          },
        ],
      },
      {
        title: "Master",
        dbname: "menumaster",
        url: "",
        submenu: [
          {
            title: "Project Master",
            dbname: "menuprojectmaster",
            url: "/excel/projectexcel",
          },
          {
            title: "Vendor Master",
            dbname: "menuvendormaster",
            url: "/excel/vendorexcel",
          },
          {
            title: "Category",
            dbname: "menucategory",
            url: "",
            submenu: [
              {
                title: "Category Master",
                dbname: "menucategorymaster",
                url: "/excel/categoryexcel",
              },
              {
                title: "Import Category ",
                dbname: "menuimportcategory",
                url: "/excel/importcategoryexcel",
              },
            ],
          },
          {
            title: "Sub Category",
            dbname: "menusubcategory",
            url: "",
            submenu: [
              {
                title: "Subcategory Master",
                dbname: "menusubcategorymaster",
                url: "/excel/subcategoryexcel",
              },
              {
                title: "Import Subcategory",
                dbname: "menuimportsubcategory",
                url: "/excel/importsubcategoryexcel",
              },
            ],
          },
          {
            title: "Queue",
            dbname: "menuqueue",
            url: "",
            submenu: [
              {
                title: "Queue Master",
                dbname: "menuqueuemaster",
                url: "/excel/queuemasterexcel",
              },
              {
                title: "Queue Grouping",
                dbname: "menuqueuegrouping",
                url: "/excel/queuegrouping",
              },
            ],
          },
          {
            title: "Time and Points",
            dbname: "menutimeandpoints",
            url: "",
            submenu: [
              {
                title: "Time & Points",
                dbname: "menutime&points",
                url: "/excel/timeandpoints",
              },
              {
                title: "Import Time & Points",
                dbname: "menuimporttime&points",
                url: "/excel/importtimeandpoints",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Production",
    dbname: "menuproduction",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "SetUp",
        dbname: "menusetup",
        url: "",
        submenu: [
          {
            title: "Type Master",
            dbname: "menutypemaster",
            url: "/production/typemaster",
          },
          {
            title: "Queue Type Master",
            dbname: "menuqueuetypemaster",
            url: "/production/queuetypemaster",
          },
          {
            title: "Queue Type Unassigned Report",
            dbname: "menuqueuetypeunassignedreport",
            url: "/production/queuetypeunassignedreport",
          },
          {
            title: "Queue Type Report",
            dbname: "menuqueuetypereport",
            url: "/production/queuetypereport",
          },
          {
            title: "Queue Type Summary",
            dbname: "menuqueuetypesummary",
            url: "/production/queuetypereportsummary",
          },
          {
            title: "Target Points",
            dbname: "menutargetpoints",
            url: "/production/targetpoints",
            access: true,
          },
          {
            title: "Target Points List",
            dbname: "menutargetpointslist",
            url: "/production/targetpointslist",
            access: true,
          },
          {
            title: "UnAssigned Report List",
            dbname: "menuunassignedreportlist",
            url: "/production/unassignedreportlist",
            access: true,
          },
          {
            title: "Target Points Filter",
            dbname: "menutargetpointsfilter",
            url: "/production/targetpointsfilter",
            access: true,
          },
          {
            title: "ERA Amount",
            dbname: "menueraamount",
            url: "/production/eraamount",
            access: true,
          },
          {
            title: "ERA Amount List",
            dbname: "menueraamountlist",
            url: "/production/eraamountlist",
            access: true,
          },
          {
            title: "Revenue Amount",
            dbname: "menurevenueamount",
            url: "/production/revenueamount",
            access: true,
          },
          {
            title: "Revenue Amount List",
            dbname: "menurevenueamountlist",
            url: "/production/revenueamountlist",
            access: true,
          },
          {
            title: "Ac-Point Calculation",
            dbname: "menuac-pointcalculation",
            url: "/acpointcalculation",
            access: true,
          },
          {
            title: "Minimum Points",
            dbname: "menuminimumpoints",
            url: "/production/minimumpoints",
            access: true,
          },
          {
            title: "Minimum Points Calculation",
            dbname: "menuminimumpointscalculation",
            url: "/production/minimumpointscalculation",
            access: true,
          },
          {
            title: "Category Date Change",
            dbname: "menucategorydatechange",
            url: "/categorydatechange",
          },

          {
            title: "Sheet Name",
            dbname: "menusheetname",
            url: "/production/sheetname",
          },

          {
            title: "Manage Category",
            dbname: "menumanagecategory",
            url: "/managecategory",
          },
        ],
      },
      {
        title: "Report SetUp",
        dbname: "menureportsetup",
        url: "",
        submenu: [
          {
            title: "Client User ID",
            dbname: "menuclientuserid",
            url: "/production/clientuserid",
          },
          {
            title: "Process Queue Name",
            dbname: "menuprocessqueuename",
            url: "/production/processqueuename",
            access: true,
          },
          {
            title: "Login Allot",
            dbname: "menuloginallot",
            url: "/updatepages/loginallot",
            access: true,
          },
          {
            title: "Process Team Mapping",
            dbname: "menuprocessteammapping",
            url: "/production/processteam",
            access: true,
          },
          {
            title: "Category Process Map",
            dbname: "menucategoryprocessmap",
            url: "/production/categoryprocessmap",
            access: true,
          },
          {
            title: "Production Day Shift",
            dbname: "menuproductiondayshift",
            url: "/production/productiondayshift",
            access: true,
          },
          {
            title: "Production Unit Rate",
            dbname: "menuproductionunitrate",
            url: "/production/productionunitrate",
          },
          {
            title: "Production Category",
            dbname: "menuproductioncategory",
            url: "/production/productioncategory",
          },
          {
            title: "Production Sub Category",
            dbname: "menuproductionsubcategory",
            url: "/production/productionsubcategory",
          },
          {
            title: "Unit Rate UnAllotted List",
            dbname: "menuunitrateunallottedlist",
            url: "/production/productionunitrateunallottedlist",
          },

          {
            title: "Unitrate Manual Approval",
            dbname: "menuunitratemanualapproval",
            url: "/production/manualunitrateapproval",
          },
        ],
      },
      {
        title: "Upload",
        dbname: "menuupload",
        url: "",
        submenu: [
          {
            title: "Original",
            dbname: "menuoriginal",
            submenu: [
              {
                title: "Production Original Upload",
                dbname: "menuproductionoriginalupload",
                url: "/production/productionoriginalupload",
              },
              {
                title: "Production Upload List",
                dbname: "menuproductionuploadlist",
                url: "/production/productionupload",
              },
              {
                title: "Zero Unit Rate UnAllot",
                dbname: "menuzerounitrateunallot",
                url: "/production/productionunitrateunallot",
              },
              {
                title: 'Zero Unitrate Master assigned/unassigned',
                dbname: 'menuzerounitratemasterassigned/unassigned',
                url: '/production/zerounitrateassignedunassigned',
              },
              {
                title: 'Zero Unit Newrate Overall report',
                dbname: 'menuzerounitnewrateoverallreport',
                url: '/production/newrateoverallreport',
              },
              {
                title: "Original Mismatch",
                dbname: "menuoriginalmismatch",
                url: "/production/checklist/originalmismatch",
              },
              {
                title: "Mismatch Status",
                dbname: "menumismatchstatus",
                url: "/production/mismatchstatus",
              },
              // {
              //   title: "Day Points Upload",
              //   dbname: "menudaypointsupload",
              //   url: "/production/daypointsupload",
              // },
              {
                title: "List Production Points",
                dbname: "menulistproductionpoints",
                url: "/production/listproductionpoints",
              },
              {
                title: "Production Day",
                dbname: "menuproductionday",
                url: "/production/productionday",
              },
              {
                title: "Production Day Points",
                dbname: "menuproductiondaypoints",
                url: "/production/daypoints",
              },
              {
                title: "Production Original Summary",
                dbname: "menuproductionoriginalsummary",
                url: "/production/productionoriginalsummary",
              },
              {
                title: 'Production Month Upload',
                dbname: 'menuproductionmonthupload',
                url: '/production/productionmonthoriginalupload',
              },
              {
                title: "Production Month Upload List",
                dbname: "menuproductionmonthuploadlist",
                url: "/production/productionmonthupload",
              },
            ],
          },
          {
            title: "Temp",
            dbname: "menutemp",
            submenu: [
              {
                title: "Temp Production Upload",
                dbname: "menutempproductionupload",
                url: "/production/productiontempupload",
              },
              {
                title: "Production Temp Upload List",
                dbname: "menuproductiontempuploadlist",
                url: "/production/productiontempuploadall",
              },
              {
                title: "Zero Unit Rate Unallot Temp",
                dbname: "menuzerounitrateunallottemp",
                url: "/production/zerounitrateunallottemp",
              },

              {
                title: "Temp Mismatch",
                dbname: "menutempmismatch",
                url: "/production/checklist/tempmismatch",
              },
              {
                title: "Mismatch Status Temp",
                dbname: "menumismatchstatustemp",
                url: "/production/mismatchstatustemp",
              },

              // {
              //   title: "Temp Points Upload",
              //   dbname: "menutemppointsupload",
              //   url: "/production/temppointsupload",
              // },
              {
                title: "List Temp Production Points",
                dbname: "menulisttempproductionpoints",
                url: "/production/listtempproductionpoints",
              },
              {
                title: "Production Day Temp",
                dbname: "menuproductiondaytemp",
                url: "/production/productiondaytemp",
              },
              {
                title: "Temp Day Points",
                dbname: "menutempdaypoints",
                url: "/production/temppointsupload",
              },
              {
                title: "Production Temp Summary",
                dbname: "menuproductiontempsummary",
                url: "/production/productiontempsummary",
              },
            ],
          },
        ],
      },

      {
        title: "Manual Entry",
        dbname: "menumanualentry",
        url: "",
        submenu: [
          {
            title: "Production Manual Entry",
            dbname: "menuproductionmanualentry",
            url: "/production/productionindividual",
          },
          {
            title: "Production Manual Bulk Entry",
            dbname: "menuproductionmanualbulkentry",
            url: "/production/productionindividualbulk",
          },
          {
            title: "Production Manual Entry List",
            dbname: "menuproductionmanualentrylist",
            url: "/production/productionindividuallist",
          },
          {
            title: "Pending Manual Entry List",
            dbname: "menupendingmanualentrylist",
            url: "/production/pendingmanualentrylist",
          },
          {
            title: "Manual Overall Report",
            dbname: "menumanualoverallreport",
            url: "/manualovrallreport",
            access: true,
          },
          {
            title: "Production Manual Entry Filter",
            dbname: "menuproductionmanualentryfilter",
            url: "/production/productionindividualfilter",
          },
          {
            title: "My Production Manual Entry",
            dbname: "menumyproductionmanualentry",
            url: "/myproductionindividual",
          },
          {
            title: "Manual Entry Time Study",
            dbname: "menumanualentrytimestudy",
            url: "/production/manualentrytimestudy",
          },
          {
            title: "Manual Entry Time Study List",
            dbname: "menumanualentrytimestudylist",
            url: "/production/manualentrytimestudylist",
          },
          {
            title: "Pending Manual Entry Time Study List",
            dbname: "menupendingmanualentrytimestudylist",
            url: "/production/pendingmanualentrytimestudylist",
          },

          {
            title: "Manual Entry Time Study Overall Report",
            dbname: "menumanualentrytimestudyoverallreport",
            url: "/production/manualentrytimestudyoverallreport",
          },
          {
            title: "Manual Entry Time Study Self Report",
            dbname: "menumanualentrytimestudyselfreport",
            url: "/production/manualentrytimestudyselfreport",
          },

          {
            title: "Approve List",
            dbname: "menuapprovelist",
            url: "/production/approvelist",
          },
          {
            title: "Reject List",
            dbname: "menurejectlist",
            url: "/production/rejectlist",
          },
          {
            title: "Production Individual Users",
          },
        ],
      },

      {
        title: "Reports",
        dbname: "menureports",
        url: "",
        submenu: [
          {
            title: "Original",
            dbname: "menuoriginal",
            submenu: [
              {
                title: 'Overall Report',
                dbname: 'menuoverallreport',
                url: '/production/overallreport',
              },
              {
                title: "Individual Production Report",
                dbname: "menuindividualproductionreport",
                url: "/production/productionreport",
              },
              {
                title: "Employee Points",
                dbname: "menuemployeepoints",
                url: "/production/employeepoints",
              },
              {
                title: "Production Consolidated List",
                dbname: "menuproductionconsolidatedlist",
                url: "/production/reportsconsolidated",
              },
              {
                title: "Production Review",
                dbname: "menuproductionreview",
                url: "/production/listproductionpointsfilter",
                access: true,
              },
              {
                title: "Individual Login Allot",
                dbname: "menuindividualloginallot",
                url: "/updatepages/individualloginallotlist",
              },
              {
                title: "Team Login Allot",
                dbname: "menuteamloginallot",
                url: "/updatepages/hierarchyallotlist",
              },
            ],
          },
          {
            title: "Temp",
            dbname: "menutemp",
            submenu: [
              {
                title: "Overall Temp Report",
                dbname: "menuoveralltempreport",
                url: "/production/tempoverallreport",
                access: true,
              },
              {
                title: "Individual Temp Report",
                dbname: "menuindividualtempreport",
                url: "/production/productiontempreport",
              },
              {
                title: "Employee Temp Points",
                dbname: "menuemployeetemppoints",
                url: "/production/employeetemppoints",
              },
              {
                title: "Production Temp Consolidated List",
                dbname: "menuproductiontempconsolidatedlist",
                url: "/productiontemp/reportsconsolidated",
              },
              {
                title: "Temp Review",
                dbname: "menutempreview",
                url: "/production/tempproductionreviewew",
                access: true,
              },
            ],
          },
        ],
      },
      {
        title: "Non Production",
        dbname: "menunonproduction",
        url: "",
        submenu: [
          {
            title: "Non-production Setup",
            dbname: "menunon-productionsetup",
            submenu: [
              {
                title: "Category & Subcategory",
                dbname: "menucategory&subcategory",
                url: "/production/nonproductioncategorysubcategory",
              },
              {
                title: "Non Production Unit Rate",
                dbname: "menunonproductionunitrate",
                url: "/production/nonproductionunitrate",
              },
              // {
              //   title: "Non Production Unit Rate Allot",
              //   dbname: "menunonproductionunitrateallot",
              //   // url: "/production/listproductionpoints",
              // },
              {
                title: "Non Productions",
                dbname: "menunonproductions",
                url: "/production/nonproduction",
              },
              {
                title: "Non Production List",
                dbname: "menunonproductionlist",
                url: "/production/nonproductionlist",
              },
              {
                title: "Non Production Filter List",
                dbname: "menunonproductionfilterlist",
                url: "/production/nonproductionfilterlist",
                access: true,
              },
              {
                title: "Non-production Unit Allot",
                dbname: "menunon-productionunitallot",
                url: "/production/nonproductionunitallot",
                access: true,
              },
              {
                title: "Idle Work Master",
                dbname: "menuidleworkmaster",
                url: "/production/manageidlework",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    title: "Quality",
    dbname: "menuquality",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Penalty",
        dbname: "menupenalty",
        url: "",
        submenu: [
          {
            title: "Penalty Setup",
            dbname: "menupenaltysetup",
            submenu: [
              {
                title: "Production Process Queue",
                dbname: "menuproductionprocessqueue",
                url: "/production/penalty/productionprocessqueue",
              },
              {
                title: "Error Type",
                dbname: "menuerrortype",
                url: "/production/penalty/penaltyerrortype",
              },
              {
                title: "Error Reason",
                dbname: "menuerrorreason",
                url: "/production/penalty/errorreason",
              },
              {
                title: "Error Mode",
                dbname: "menuerrormode",
                url: "/production/penalty/errormode",
              },
              {
                title: "Error Control",
                dbname: "menuerrorcontrol",
                url: "/production/penalty/errorcontrol",
              },
              {
                title: "Category Penalty Percentage",
                dbname: "menucategorypenaltypercentage",
                url: "/production/penalty/categorypercentage",
              },

              {
                title: "Other Penalty Control",
                dbname: "menuotherpenaltycontrol",
                url: "/production/penalty/otherpenaltycontrol",
              },
              {
                title: "Master Field Name",
                dbname: "menumasterfieldname",
                url: "/production/penalty/masterfieldname",
              },
              {
                title: "Experience Base Waiver Master",
                dbname: "menuexperiencebasewaivermaster",
                url: "/production/penalty/experiencebasewaviermaster",
              },
              {
                title: "Client Error Upload",
                dbname: "menuclienterrorupload",
                url: "/production/penaltyclienterrorupload",
              },
              {
                title: "Client Error List",
                dbname: "menuclienterrorlist",
                url: "/production/penaltyclienterrorlist",
              },
              {
                title: "Penalty Waiver Month Set",
                dbname: "menupenaltywaivermonthset",
                url: "/production/penaltywaivermonthset",
              },
              {
                title: "Penalty Waiver Master",
                dbname: "menupenaltywaivermaster",
                url: "/production/penaltywaivermaster",
              },
              // {
              //   title: "Penalty Amount Creation",
              //   dbname: "menupenaltyamountcreation",
              //   url: "/production/penaltyamountcreation",
              // },
              // {
              //   title: "Penalty",
              //   dbname: "menupenalty",
              //   url: "/production/penalty",
              // },
            ],
          },
          {
            title: "Process Penalty",
            dbname: "menuprocesspenalty",
            url: "",
            submenu: [
              {
                title: "Penalty Total Field Upload",
                dbname: "menupenaltytotalfieldupload",
                url: "/production/penaltytotalfieldupload",
              },

              {
                title: "Error Upload",
                dbname: "menuerrorupload",
                url: "/production/penaltyerrorupload",
              },
              {
                title: "Penalty Over All Report",
                dbname: "menupenaltyoverallreport",
                url: "/production/penaltyoverallreport",
              },
              {
                title: "Validation Error Entry",
                dbname: "menuvalidationerrorentry",
                url: "/production/validationerrorentry",
                access: true,
              },
              {
                title: "Error Invalid Approval",
                dbname: "menuerrorinvalidapproval",
                url: "/production/invaliderrorentry",
              },
              {
                title: "Error Valid Approval",
                dbname: "menuerrorvalidapproval",
                url: "/production/validateerrorentry",
              },
              // {
              //   title: "Invalid Error Entry",
              //   dbname: "menuinvaliderrorentry",
              //   url: "/production/invaliderrorentry",
              // },
              // {
              //   title: "Valid Error Entry",
              //   dbname: "menuvaliderrorentry",
              //   url: "/production/validateerrorentry",
              // },
              // {
              //   title: "Error InValid Approval",
              //   dbname: "menuerrorinValidapproval",
              //   url: "/production/errorinvalidapproval",
              // },
              // {
              //   title: "Error Valid Approval",
              //   dbname: "menuerrorvalidapproval",
              //   url: "/production/errorvalidapproval",
              // },
              {
                title: "Client Error",
                dbname: "menuclienterror",
                url: "/production/penaltyclienterror",
                access: true,
              },
              {
                title: "Client Error Rate",
                dbname: "menuclienterrorrate",
                url: "/production/penalty/productionclientrate",
              },
              {
                title: "Client Error CheckList",
                dbname: "menuclienterrorchecklist",
                url: "/production/clienterrorchecklist",
              },
              {
                title: "Client Error Status",
                dbname: "menuclienterrorstatus",
                url: "/production/clienterrorstatus",
              },
              {
                title: "Bulk Error Upload",
                dbname: "menubulkerrorupload",
                url: "/production/penalty/bulkerrorupload",
              },
              {
                title: "Error Upload Confirm Supervisor Edit",
              
              },
              {
                title: "Error Upload Confirm",
                dbname: "menuerroruploadconfirm",
                url: "/production/erroruploadconfirm",
              },
              {
                title: "Error Upload Confirm User List",
                dbname: "menuerroruploadconfirmuserlist",
                url: "/production/erroruploadconfirmlist",
              },
              {
                title: "Manual Error Update",
                dbname: "menumanualerrorupdate",
                url: "/production/manualerrorupdate",
              },
              {
                title: "Invalid Valid Overall Report",
                dbname: "menuinvalidvalidoverallreport",
                url: "/production/penalty/invalidvalidoverallreport",
              },
            ],
          },
          {
            title: "Penalty Calculation",
            dbname: "menupenaltycalculation",
            submenu: [
              {
                title: "Penalty Day",
                dbname: "menupenaltyday",
                url: "/production/penalty/penaltydayupload",
              },
              {
                title: "Penalty Day List",
                dbname: "menupenaltydaylist",
                url: "/production/penalty/penaltydayuploadlist",
              },
              {
                title: "Penalty Month",
                dbname: "menupenaltymonth",
                url: "/production/penalty/managepenaltymonth",
              },
              {
                title: "Penalty Amount Consolidate",
                dbname: "menupenaltyamountconsolidate",
                url: "/penalty/penaltyamountconsolidate",
              },
              {
                title: "Client Error Month Amount",
                dbname: "menuclienterrormonthamount",
                url: "/production/clienterrormonthamount",
              },
            ],
          },
          {
            title: "Penalty Waiver",
            dbname: "menupenaltywaiver",
            submenu: [
              {
                title: "Waiver Percentage Upload",
                dbname: "menuwaiverpercentageupload",
                url: "/production/waiverpercentage",
              },
              {
                title: "Waiver Employee Forward",
                dbname: "menuwaiveremployeeforward",
                url: "/production/waiveremployeeforward",
              },
              {
                title: "Approval Employee Waiver",
                dbname: "menuapprovalemployeewaiver",
                url: "/production/approvalemployeeforward",
              },
              {
                title: "Client Error Waiver",
                dbname: "menuclienterrorwaiver",
                url: "/production/clienterrorwaiver",
              },
              {
                title: "Client Error Forward",
                dbname: "menuclienterrorforward",
                url: "/production/clienterrorforward",
              },
              {
                title: "Client Error Waiver Approval",
                dbname: "menuclienterrorwaiverapproval",
                url: "/production/clienterrorwaiverapproval",
              },
              {
                title: "Client Error Overall Report",
                dbname: "menuclienterroroverallreport",
                url: "/production/clienterroroverallreport",
              },
            ],
          },
        ],
      },
      {
        title: "Accuracy",
        dbname: "menuaccuracy",
        url: "",
        submenu: [
          {
            title: "Accuracy Master",
            dbname: "menuaccuracymaster",
            url: "/quality/accuracy/accuracymaster",
          },
          {
            title: "Accuracy Queue Grouping",
            dbname: "menuaccuracyqueuegrouping",
            url: "/quality/accuracy/accuracyqueuegrouping",
          },
          {
            title: "Expected Accuracy",
            dbname: "menuexpectedaccuracy",
            url: "/quality/accuracy/expectedaccuracy",
          },
          {
            title: "Acheived Accuracy",
            dbname: "menuacheivedaccuracy",
            url: "/quality/accuracy/acheivedaccuracy",
          },
          {
            title: "Acheived Accuracy Individual",
            dbname: "menuacheivedaccuracyindividual",
            url: "/quality/accuracy/acheivedaccuracyindividual",
          },
          {
            title: "Overall Acheived Accuracy Individual List",
            dbname: "menuoverallacheivedaccuracyindividuallist",
            url: "/quality/accuracy/overallacheivedaccuracyindividuallist",
            access: true,
          },
          {
            title: "Acheived Accuracy Individual Review List",
            dbname: "menuacheivedaccuracyindividualreviewlist",
            url: "/quality/accuracy/acheivedaccuracyindividualreviewlist",
            access: true,
          },
          {
            title: "Achieved Accuracy Individual Review Client Status List",
            dbname: "menuachievedaccuracyindividualreviewclientstatuslist",
            url: "/quality/accuracy/achievedaccuracyindividualreviewclientstatuslist",
            access: true,
          },
          {
            title: "Achieved Accuracy Individual Review Internal Status List",
            dbname: "menuachievedaccuracyindividualreviewinternalstatuslist",
            url: "/quality/accuracy/achievedaccuracyindividualreviewinternalstatuslist",
            access: true,
          },
          {
            title: "Achieved Accuracy Individual Review Internal Status Summary List",
            dbname: "menuachievedaccuracyindividualreviewinternalstatussummarylist",
            url: "/quality/accuracy/achievedaccuracyindividualreviewinternalstatussummarylist",
          },
          {
            title: "Individual Employee Internal Status List",
            dbname: "menuindividualemployeeinternalstatuslist",
            url: "/quality/accuracy/individualemployeeinternalstatuslist",
          },
          {
            title: "Client Status List",
            dbname: "menuclientstatuslist",
            url: "/quality/accuracy/acheivedaccuracy/clientstatuslist",
          },
          {
            title: "Internal Status List",
            dbname: "menuinternalstatuslist",
            url: "/quality/accuracy/acheivedaccuracy/internalstatuslist",
          },
          // {
          //   title: "Acheived Accuracy Client Status",
          //   dbname: "menuacheivedaccuracyclientstatus",
          //   url: "/quality/accuracy/acheivedaccuracy/clientstatus",
          // },
          // {
          //   title: "Acheived Accuracy Internal Status",
          //   dbname: "menuacheivedaccuracyinternalstatus",
          //   url: "/quality/accuracy/acheivedaccuracy/internalstatus",
          // },
        ],
      },
    ],
  },

  {
    title: "Other Tasks",
    dbname: "menuothertasks",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Assigned By",
        dbname: "menuassignedby",
        url: "/assignedby",
      },
      {
        title: "Assigned Mode",
        dbname: "menuassignedmode",
        url: "/manageassignedmode",
      },
      {
        title: "Other Task",
        dbname: "menuothertask",
        url: "/manageothertask",
      },
      {
        title: "Other Task List",
        dbname: "menuothertasklist",
        url: "/othertasklist",
      },
      {
        title: "Company Other Task Report",
        dbname: "menucompanyothertaskreport",
        url: "/reportcompanyothertasklist",
      },
      {
        title: "Employee Other Task Report",
        dbname: "menuemployeeothertaskreport",
        url: "/reportemployeeothertasklist",
      },
      {
        title: "Other Task Upload",
        dbname: "menuothertaskupload",
        url: "/production/othertaskupload",
      },
      {
        title: "Other Task Upload List",
        dbname: "menuothertaskuploadlist",
        url: "/production/othertaskuploadlist",
      },
      {
        title: "Other Task & Manual Entry Flag Report",
        dbname: "menuothertask&manualentryflagreport",
        url: "/flagcountothertasklist",
      },
      {
        title: "Other Task Consolidated Report",
        dbname: "menuothertaskconsolidatedreport",
        url: "/production/othertaskconsolidatedreport",
      },
      {
        title: "Other Task Consolidated Report Summary",
        dbname: "menuothertaskconsolidatedreportsummary",
        url: "/production/othertaskconsolidatedreportsummary",
      },
      {
        title: "Other Task Individual Report",
        dbname: "menuothertaskindividualreport",
        url: "/production/otherindividualreport",
      },
    ],
  },
  {
    title: "PayRoll",
    dbname: "menupayroll",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "PayRoll Setup",
        dbname: "menupayrollsetup",
        submenu: [
          {
            title: "Pay Run Control",
            dbname: "menupayruncontrol",
            url: "/production/paycontrol",
            access: true,
          },
          {
            title: "Pay Run Control Report",
            dbname: "menupayruncontrolreport",
            url: "/production/payrunreport",
            access: true,
          },
          {
            title: "Paid Date Mode",
            dbname: "menupaiddatemode",
            url: "/production/paiddatemode",
          },
          {
            title: "Paid Date Fix",
            dbname: "menupaiddatefix",
            url: "/production/paiddatefix",
          },

          {
            title: "Paid Status Fix Month Set",
            dbname: "menupaidstatusfixmonthset",
            url: "/production/paidstatusfixmonthset",
          },
          {
            title: "Paid Status Fix",
            dbname: "menupaidstatusfix",
            url: "/production/paidstatusfix",
          },
          {
            title: "Paid Status Fix List",
            dbname: "menupaidstatusfixlist",
            url: "/production/paidstatusfixlist",
          },

          {
            title: "Professional Tax Master",
            dbname: "menuprofessionaltaxmaster",
            url: "/professionaltaxmaster",
            access: true,
          },
          {
            title: "Shortage Master",
            dbname: "menushortagemaster",
            url: "/production/payroll/manageshortagemaster",
          },
        ],
      },
      {
        title: "PayRoll Creation",
        dbname: "menupayrollcreation",
        submenu: [
          {
            title: "Pay Run Master",
            dbname: "menupayrunmaster",
            url: "/production/payroll/payrunmaster",
            access: true,
          },
          {
            title: "Pay Run",
            dbname: "menupayrun",
            url: "/production/payroll/payrun",
          },
          {
            title: "Pay Slip (last 3 month)",
            dbname: "menupayslip(last3month)",
            url: "/production/payroll/userpayslip",
          },
          {
            title: "Loss Payrun",
            dbname: "menulosspayrun",
            url: "/production/payroll/losspayrun",
          },
          {
            title: "Final Salary List",
            dbname: "menufinalsalarylist",
            url: "/production/payroll/finalsalary",
            access: true,
          },
          {
            title: "Fixed Salary List",
            dbname: "menufixedsalarylist",
            url: "/production/payroll/fixedsalary",
            access: true,
          },
          {
            title: "Production Salary List",
            dbname: "menuproductionsalarylist",
            url: "/production/payroll/productionsalary",
            access: true,
          },
          {
            title: "Consolidated Salary List",
            dbname: "menuconsolidatedsalarylist",
            url: "/production/consolidatedsalarylist",
            access: true,
          },
          {
            title: "Fix Salary Date",
            dbname: "menufixsalarydate",
            url: "/production/payroll/fixsalarydate",
          },

          {
            title: "Fix Hold Salary Date",
            dbname: "menufixholdsalarydate",
            url: "/production/payroll/fixholdsalarydate",
          },
          {
            title: "Hold Salary Confirm",
            dbname: "menuholdsalaryconfirm",
            url: "/production/payroll/holdsalaryconfirm",
          },
          {
            title: "Consolidated Salary",
            dbname: "menuconsolidatedsalary",
            url: "/production/payroll/consolidatedsalaryrelease",
          },
          {
            title: "Bank Release",
            dbname: "menubankrelease",
            url: "/production/payroll/bankrelease",
          },
        ],
      },
      {
        title: "Loan & Advance",
        dbname: "menuloan&advance",
        submenu: [
          {
            title: "Advance",
            dbname: "menuadvance",
            url: "/advance",
            access: true,
          },
          {
            title: "Advance Request",
            dbname: "menuadvancerequest",
            url: "/advancerequest",
            access: true,
          },
          {
            title: "Approved Advance",
            dbname: "menuapprovedadvance",
            url: "/approvedadvance",
            access: true,
          },
          {
            title: "Assign Advance",
          },
          {
            title: "Loan",
            dbname: "menuloan",
            url: "/loan",
            access: true,
          },
          {
            title: "Assign Loan",
          },
          {
            title: "Loan Request",
            dbname: "menuloanrequest",
            url: "/loanrequest",
            access: true,
          },
          {
            title: "Approved Loan",
            dbname: "menuapprovedloan",
            url: "/approvedloan",
            access: true,
          },
        ],
      },
      {
        title: "Salary Slab",
        dbname: "menusalaryslab",
        url: "",
        submenu: [
          {
            title: "Esi Formula",
            dbname: "menusalaryslab",
            url: "/esiformulamaster",
            access: true,
          },
          {
            title: "Salary Pf Master",
            dbname: "menusalarypfmaster",
            url: "/salarypfmaster",
            access: true,
          },
          {
            title: "Salary Slab Add",
            dbname: "menusalaryslabadd",
            url: "/setup/salaryslab/salaryslabadd",
            access: true,
          },
          {
            title: "Salary Slab List",
            dbname: "menusalaryslablist",
            url: "/setup/salaryslab/salaryslablist",
            access: true,
          },
          {
            title: "Salary Slab Filter",
            dbname: "menusalaryslabfilter",
            url: "/payroll/salaryslabfilter",
            access: true,
          },
          {
            title: "Salary Process Search Report",
            dbname: "menusalaryprocesssearchreport",
            url: "/payroll/salaryprocessreport",
            access: true,
          },
          {
            title: "My Target&Salary",
            dbname: "menumytarget&salary",
            url: "/payroll/targetsalary",
            access: true,
          },
        ],
      },
    ],
  },
  {
    title: "Documents",
    dbname: "menudocuments",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Type Master Document",
        dbname: "menutypemasterdocument",
        url: "/typemasterdocument",
      },
      {
        title: "Documents Category",
        dbname: "menudocumentscategory",
        url: "/addcategorydoc",
      },
      {
        title: "Assign Document",
        dbname: "menuassigndocument",
        url: "/assigndocument",
        access: true,
      },
      {
        title: "Document",
        dbname: "menudocument",
        url: "/documents",
      },
      {
        title: "Document List",
        dbname: "menudocumentlist",
        url: "/listdocument",
      },

      {
        title: "Overall Document List",
        dbname: "menuoveralldocumentlist",
        url: "/overalllistdocument",
      },
    ],
  },
  {
    title: "References",
    dbname: "menureferences",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Reference Category",
        dbname: "menureferencecategory",
        url: "/addcategoryref",
      },
      {
        title: "Reference",
        dbname: "menureference",
        url: "/addrefcategoryref",
      },
      {
        title: "Reference List",
        dbname: "menureferencelist",
        url: "/listrefcategoryref",
      },
    ],
  },
  {
    title: "Expenses",
    dbname: "menuexpenses",
    url: "",
    navmenu: true,
    navlimit: true,
    submenu: [
      {
        title: "Expense Setup",
        dbname: "menuexpensesetup",
        url: "",
        submenu: [
          {
            title: "Expense Category",
            dbname: "menuexpensecategory",
            url: "/expense/expensecategory",
          },
          {
            title: "Purpose",
            dbname: "menupurpose",
            url: "/purpose",
          },
          {
            title: "Payment Mode",
            dbname: "menupaymentmode",
            url: "/expense/source",
          },
          {
            title: "Source of Payments",
            dbname: "menusourceofpayments",
            url: "/expense/sourceofpayments",
          },


        ],
      },
      {
        title: "Add Expense",
        dbname: "menuaddexpense",
        url: "/expense/addexpanse",
        access: true,
        navlimit: true,
      },
      {
        title: "List Expense",
        dbname: "menulistexpense",
        url: "/expense/expenselist",
        access: true,
      },
      {
        title: "Assign Expense Others",
      },

      {
        title: "Add Income",
        dbname: "menuaddincome",
        url: "/expense/addincome",
        access: true,
      },
      {
        title: "List Income",
        dbname: "menulistincome",
        url: "/expense/listincome",
        access: true,
      },
      {
        title: "Remainder",
        dbname: "menuremainder",
        url: "",
        submenu: [
          // {
          //   title: "Remainder Master",
          //   dbname: "menuremaindermaster",
          //   url: "/expense/remainder",
          // },
          {
            title: "Payment Due Reminder",
            dbname: "menupaymentduereminder",
            url: "/expense/paymentduereminder",
            access: true,
          },
          {
            title: "All Remainder",
            dbname: "menuallremainder",
            url: "/expense/allreminder",
            access: true,
          },
        ],
      },
      {
        title: "Payment",
        dbname: "menupayment",
        url: "",
        submenu: [
          {
            title: "Add Schedule Payment Bills",
            dbname: "menuaddschedulepaymentbills",
            url: "/account/addotherpayments",
            access: true,
          },
          {
            title: "List Schedule Payment Bills",
            dbname: "menulistschedulepaymentbills",
            url: "/account/listotherpayments",
            access: true,
          },
          {
            title: "Schedule Payment Master",
            dbname: "menuschedulepaymentmaster",
            url: "/expense/schedulepaymentmaster",
            access: true,
          },
          {
            title: "Not Added Bills",
            dbname: "menunotaddedbills",
            url: "/expense/schedulepaymentnotaddedbills",
            access: true,
          },
        ],
      },

      {
        title: "All Income and Expenses",
        dbname: "menuallincomeandexpenses",
        url: "/expense/allincomeandexpenses",
        access: true,
      },
      {
        title: "Paid Report",
        dbname: "menupaidreport",
        url: "/expense/paidlist",
        access: true,
      },
      {
        title: "Not Paid Report",
        dbname: "menunotpaidreport",
        url: "/expense/notpaidlist",
        access: true,
      },
    ],
  },
  {
    title: "Asset",
    dbname: "menuasset",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Master",
        dbname: "menumaster",
        url: "",
        submenu: [
          {
            title: "Group Master",
            dbname: "menugroupmaster",
            url: "/account/group",
          },
          {
            title: "Account Group",
            dbname: "menuaccountgroup",
            url: "/account/accountgroup",
          },
          {
            title: "Account Head",
            dbname: "menuaccounthead",
            url: "/account/accounthead",
          },
          {
            title: "Asset Type Master",
            dbname: "menuassettypemaster",
            url: "/asset/assettype",
          },
          {
            title: "Asset Type Grouping",
            dbname: "menuassettypegrouping",
            url: "/assettypegrouping",
          },

          {
            title: "Asset Material",
            dbname: "menuassetmaterial",
            url: "/account/assetmaterial",
          },
          {
            title: "Asset Specification",
            dbname: "menuassetspecification",
            url: "/asset/assetworkstation",
          },
          {
            title: "Vendor Master",
            dbname: "menuvendormaster",
            url: "/vendordetails",
          },
          {
            title: "Vendor Grouping",
            dbname: "menuvendorgrouping",
            url: "/vendorgrouping",
          },
          {
            title: "UOM Master",
            dbname: "menuuommaster",
            url: "/uommaster",
          },
          {
            title: "Frequency Master",
            dbname: "menufrequencymaster",
            url: "/frequencymaster",
          },
        ],
      },
      {
        title: "Asset Specifications",
        dbname: "menuassetspecifications",
        url: "",
        submenu: [
          {
            title: "Hardware",
            dbname: "menuhardware",
            url: "",
            submenu: [
              {
                title: "Asset Specification Type",
                dbname: "menuassetspecificationtype",
                url: "/assetspecification/assetspecificationtype",
              },
              {
                title: "Asset Model",
                dbname: "menuassetmodel",
                url: "/assetspecification/assetmodel",
              },
              {
                title: "Asset Size",
                dbname: "menuassetsize",
                url: "/assetspecification/assetsize",
              },
              {
                title: "Asset Variant",
                dbname: "menuassetvariant",
                url: "/assetspecification/assetvariant",
              },
              {
                title: "Asset Capacity",
                dbname: "menuassetcapacity",
                url: "/assetspecification/assetcapacity",
              },
              {
                title: "Brand Master",
                dbname: "menubrandmaster",
                url: "/assetspecification/brandmaster",
              },
              {
                title: "Panel Type",
                dbname: "menupaneltype",
                url: "/assetspecification/paneltype",
              },
              {
                title: "Screen Resolution",
                dbname: "menuscreenresolution",
                url: "/assetspecification/screenresolution",
              },
              {
                title: "Connectivity",
                dbname: "menuconnectivity",
                url: "/assetspecification/connectivity",
              },
              {
                title: "Data Range",
                dbname: "menudatarange",
                url: "/assetspecification/datarange",
              },
              {
                title: "Compatible Devices",
                dbname: "menucompatibledevices",
                url: "/assetspecification/compatibledevices",
              },
              {
                title: "Output Power",
                dbname: "menuoutputpower",
                url: "/assetspecification/outputpower",
              },
              {
                title: "Cooling Fan Count",
                dbname: "menucoolingfancount",
                url: "/assetspecification/coolingfancount",
              },
              {
                title: "Clock Speed",
                dbname: "menuclockspeed",
                url: "/assetspecification/clockspeed",
              },
              {
                title: "Core",
                dbname: "menucore",
                url: "/assetspecification/core",
              },
              {
                title: "Speed",
                dbname: "menuspeed",
                url: "/assetspecification/speed",
              },
              {
                title: "Frequency",
                dbname: "menufrequency",
                url: "/assetspecification/frequency",
              },
              {
                title: "Output",
                dbname: "menuoutput",
                url: "/assetspecification/output",
              },
              {
                title: "Ethernet Ports",
                dbname: "menuethernetports",
                url: "/assetspecification/ethernetports",
              },
              {
                title: "Distance",
                dbname: "menudistance",
                url: "/assetspecification/distance",
              },
              {
                title: "Length",
                dbname: "menulength",
                url: "/assetspecification/length",
              },
              {
                title: "Slot",
                dbname: "menuslot",
                url: "/assetspecification/slot",
              },
              {
                title: "Number Of Channels",
                dbname: "menunumberofchannels",
                url: "/assetspecification/numberofchannels",
              },
              {
                title: "Colours",
                dbname: "menucolours",
                url: "/assetspecification/colours",
              },
            ]
          },
          {
            title: "Software Specification",
            dbname: "menusoftwarespecification",
            url: "/assetspecification/software/softwarespecification",
          },
          {
            title: "Hardware Specification",
            dbname: "menuhardwarespecification",
            url: "/assetspecification/hardwarespecification",
          },
          //       {
          //         title: "Asset Software Grouping",
          //         dbname: "menuassetsoftwaregrouping",
          //         url: "/assetspecification/software/assetsoftwaregrouping",
          // },

        ],
      },
      {
        title: "Asset Details",
        dbname: "menuassetdetails",
        url: "",
        submenu: [
          {
            title: "Asset Specification Grouping",
            dbname: "menuassetspecificationgrouping",
            url: "/asset/assetspecificationgrouping",
          },
          {
            title: "Asset Master",
            dbname: "menuassetmaster",
            url: "/asset/assetdetails",
            access: true,
          },
          {
            title: "Asset Master List",
            dbname: "menuassetmasterlist",
            url: "/asset/assetlist",
            access: true,
          },
          {
            title: "Dynamic Asset Materials",
            dbname: "menudynamicassetmaterials",
            url: "/asset/assetmaterialip",
            access: true,
          },
          {
            title: "Software Asset Master",
            dbname: "menusoftwareassetmaster",
            url: "/asset/assetsoftwaredetails",
          },
          {
            title: "Software Asset Master List",
            dbname: "menusoftwareassetmasterlist",
            url: "/asset/assetsoftwarelist",
          },

          {
            title: "Asset WorkStation Grouping",
            dbname: "menuassetworkstationgrouping",
            url: "/asset/assetworkstationgrouping",
            access: true,
          },
          {
            title: "Asset WorkStation Grouping Report",
            dbname: "menuassetworkstationgroupingreport",
            url: "/asset/assetworkstationgroupingreport",
            access: true,
          },
          {
            title: "Asset Problem Master",
            dbname: "menuassetproblemmaster",
            url: "/assetproblemmaster",
          },

          // {
          //   title: "Manage Asset",
          //   dbname: "menumanageasset",
          //   url: "/asset/manageasset",
          //   access: true,
          // },
          {
            title: "Repair Asset",
            dbname: "menurepairasset",
            url: "/asset/repairasset",
            access: true,
          },
          {
            title: "Damage Asset",
            dbname: "menudamageasset",
            url: "/asset/damageasset",
            access: true,
          },
        ],
      },
      {
        title: "Maintenance",
        dbname: "menumaintenance",
        url: "",
        submenu: [
          {
            title: "Maintenance Master",
            dbname: "menumaintenancemaster",
            url: "/asset/maintenance",
            access: true,
          },
          {
            title: "Maintenance Details Master",
            dbname: "menumaintenancedetailsmaster",
            url: "/asset/maintenancedetailsmaster",
            access: true,
          },
          {
            title: "Task Maintenance Non Schedule Grouping",
            dbname: "menutaskmaintenancenonschedulegrouping",
            url: "/asset/taskmaintenancenonschedulegrouping",
            access: true,
          },
          {
            title: "Maintenance Service",
            dbname: "menumaintenanceservice",
            url: "/asset/maintenanceservice",
          },
          {
            title: "Task Maintenace User Panel",
            dbname: "menutaskmaintenaceuserpanel",
            url: "/asset/taskmaintenaceforuser",
          },
          {
            title: "Maintenance Hierarchy Reports",
            dbname: "menumaintenancehierarchyreports",
            url: "/asset/maintenancehierarchyreport",
          },

          {
            title: "Ticket Maintenance Report",
            dbname: "menuticketmaintenancereport",
            url: "/asset/ticketmaintenancereport",
          },
          {
            title: "Task Maintenance Overall Report",
            dbname: "menutaskmaintenanceoverallreport",
            url: "/asset/overalltaskmaintenancereport",
          },
        ],
      },
      {
        title: "Asset Register",
        dbname: "menuassetregister",
        url: "",
        submenu: [
          {
            title: "Employee Asset Distribution Register",
            dbname: "menuemployeeassetdistributionregister",
            url: "/asset/employeeassetdistribution",
            access: true,
          },
          {
            title: "Individual Asset Acceptance List",
            dbname: "menuindividualassetacceptancelist",
            url: "/asset/inidividualemployeeassetdistribution",
          },
          {
            title: "Team Asset Acceptance List",
            dbname: "menuteamassetacceptancelist",
            url: "/asset/teamemployeeassetacceptancelist",
          },
          {
            title: "Employee Asset Return/Transfer Register",
            dbname: "menuemployeeassetreturn/transferregister",
            url: "/asset/employeeassettransferorreturn",
          },
          {
            title: "Employee Asset Return Register",
            dbname: "menuemployeeassetreturnregister",
            url: "/asset/employeeassetreturnregister",
          },
          // {
          //   title: "Complaint Asset Movement Register",
          //   dbname: "menucomplaintassetmovementregister",
          //   url: "/assets/complaintassetmovementregister",
          // },
        ],
      },

      // {
      //   title: "Complaint Register",
      //   dbname: "menucomplaintregister",
      //   url: "",
      //   submenu: [
      //     {
      //       title: "IT Asset Complaint Register",
      //       dbname: "menuitassetcomplaintregister",
      //       url: "/asset/itassetcomplaintregister",
      //     },
      //   ],
      // },
      {
        title: "Stock",
        dbname: "menustock",
        url: "",
        submenu: [
          {
            title: "Stock Category",
            dbname: "menustockcategory",
            url: "/stockcategory",
          },
          {
            title: "Manage Stock Items",
            dbname: "menumanagestockitems",
            url: "/expense/managestockitems",
          },
          {
            title: "Stock Request",
            dbname: "menustockrequest",
            url: "/stockpurchase/stockmanagerequest",
            // access: true,
          },
          {
            title: "Stock Verification",
            dbname: "menustockverification",
            url: "/stock/stockverification",
          },
          {
            title: "Stock Purchase Request",
            dbname: "menustockpurchaserequest",
            url: "/stockpurchase/stockpurchaserequest",
          },
          {
            title: "Stock Purchase",
            dbname: "menustockpurchase",
            url: "/stockpurchase/stock",
            access: true,
          },
          {
            title: "Stock Reorder",
            dbname: "menustockreorder",
            url: "/stockpurchase/stockreorder",
          },
          {
            title: "Manual Stock Entry",
            dbname: "menumanualstockentry",
            url: "/stockpurchase/manualstock",
            access: true,
          },

          {
            title: "Stock Management",
            dbname: "menustockmanagement",
            url: "/stockpurchase/stockmanagement",
            access: true,
          },
          {
            title: "Stock Management Report",
            dbname: "menustockmanagementreport",
            url: "/stockpurchase/stockmanagementreport",
          },
          {
            title: "Overall Asset Report",
            dbname: "menuoverallassetreport",
            url: "/asset/overallassetreport",
            access: true,
          },
          // {
          //   title: "Stock Manage Transfer",
          //   dbname: "menustockmanagetransfer",
          //   url: "/stockpurchase/managestocktransfer",
          //   access: true,
          // },
          {
            title: "All stock details",
            dbname: "menuallstockdetails",
            url: "/asset/overassetdetails",
          },
        ],
      },
      {
        title: "Stock Label",
        dbname: "menustocklabel",
        url: "",
        submenu: [
          {
            title: "Label Name",
            dbname: "menulabelname",
            url: "/asset/labelname",
          },
          {
            title: "All Label List",
            dbname: "menualllabellist",
            url: "/asset/assetprintlabel",
          },
          {
            title: "Queue Label List",
            dbname: "menuqueuelabellist",
            url: "/asset/addtoprintqueue",
          },
          {
            title: "Printed Label List",
            dbname: "menuprintedlabellist",
            url: "/asset/addtoprintqueueprint",
          },
        ],
      },
    ],
  },
  {
    title: "EB",
    dbname: "menueb",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Eb Service Master",
        dbname: "menuebservicemaster",
        url: "/eb/ebservicemaster",
        access: true,
      },
      {
        title: "Manage Material",
        dbname: "menumanagematerial",
        url: "/eb/managematerial",
      },
      {
        title: "EB Use Instrument",
        dbname: "menuebuseinstrument",
        url: "/eb/ebuseinstrument",
        access: true,
      },
      {
        title: "EB Rates",
        dbname: "menuebrates",
        url: "/eb/ebrates",
        access: true,
      },
      {
        title: "EB Reading Details",
        dbname: "menuebreadingdetails",
        url: "/eb/ebreadingdetails",
        access: true,
      },
      {
        title: "EB Reading Details List",
        dbname: "menuebreadingdetailslist",
        url: "/eb/ebreadingdetailslist",
        access: true,
      },
      {
        title: "EB Reading Report",
        dbname: "menuebreadingreport",
        url: "/eb/ebreadingreport",
        access: true,
      },
      {
        title: "EB Material Usage Details",
        dbname: "menuebmaterialusagedetails",
        url: "/eb/ebmaterialusagedetails",
        access: true,
      },
      {
        title: "Eb Reading Analysis Review",
        dbname: "menuebreadingreport",
        url: "/eb/ebreadinganalysisreview",
        access: true,
      },
      {
        title: "EB Vendor Master",
        dbname: "menuebvendormaster",
        url: "/eb/vendormastereb",
      },
      {
        title: "Power ShutDown",
        dbname: "menupowershutdown",
        url: "",
        submenu: [
          {
            title: "Power ShutDown Type",
            dbname: "menupowershutdowntype",
            url: "/setup/managepowershutdowntype",
          },
          {
            title: "Manage Power ShutDown",
            dbname: "menumanagepowershutdown",
            url: "/setup/powerstation",
            access: true,
          },
          {
            title: "Power ShutDown Filter",
            dbname: "menupowershutdownfilter",
            url: "/setup/powerstationfilter",
          },
          {
            title: "Power ShutDown Calendar",
            dbname: "menupowershutdowncalendar",
            url: "/setup/powerstationcalendar",
          },
        ],
      },
    ],
  },
  {
    title: "Task",
    dbname: "menutask",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Task Category",
        dbname: "menutaskcategory",
        url: "/task/master/taskcategory",
      },
      {
        title: "Task Subcategory",
        dbname: "menutasksubcategory",
        url: "/task/master/tasksubcategory",
      },
      {
        title: "Task Schedule Grouping",
        dbname: "menutaskschedulegrouping",
        url: "/task/taskschedulegrouping",
      },
      {
        title: "Task Non Schedule Grouping",
        dbname: "menutasknonschedulegrouping",
        url: "/task/tasknonschedulegrouping",
        access: true,
      },
      {
        title: "Task Assign Grouping",
        dbname: "menutaskassigngrouping",
        url: "/task/taskdesignationgrouping",
        access: true,
      },
      {
        title: "Task Manual Creation",
        dbname: "menutaskmanualcreation",
        url: "/task/taskmanualcreation",
      },
      {
        title: "Task Hierarchy Reports",
        dbname: "menutaskhierarchyreports",
        url: "task/taskhierarchyreport",
      },
      {
        title: "Task Hierarchy Summary Reports",
        dbname: "menutaskhierarchysummaryreports",
        url: "task/taskhierarchysummaryreport",
      },
      {
        title: "Task User Panel",
        dbname: "menutaskuserpanel",
        url: "/task/taskforuser",
      },
      {
        title: "Completed Task",
        dbname: "menucompletedtask",
        url: "/task/completedtasks",
      },
      {
        title: "Tasks Allocation",
        dbname: "menutasksallocation",
        url: "task/userstaskallocation",
      },
      {
        title: "Task Users Report",
        dbname: "menutaskusersreport",
        url: "/task/taskforuserreport",
      },
      {
        title: "Overall Task Users Report",
        dbname: "menuoveralltaskusersreport",
        url: "/task/overalltaskforuserreport",
      },
    ],
  },
  {
    title: "Training",
    dbname: "menutraining",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Training Category",
        dbname: "menutrainingcategory",
        url: "/task/training/master/trainingcategory",
      },
      {
        title: "Training Subcategory",
        dbname: "menutrainingsubcategory",
        url: "/task/training/master/trainingsubcategory",
      },
      {
        title: "Online Test Master",
        dbname: "menuonlinetestmaster",
        url: "/task/training/onlinetest/onlinetestmaster",
      },
      {
        title: "Training Details",
        dbname: "menutrainingdetails",
        url: "/task/training/master/trainingdetails",
        access: true,
      },
      {
        title: "Training Hierarchy Reports",
        dbname: "menutraininghierarchyreports",
        url: "/training/master/traininghierarchyreport",
      },
      {
        title: "Training User Panel",
        dbname: "menutraininguserpanel",
        url: "/task/training/master/traininguserpanel",
      },
      {
        title: "Training Postponed User Panel",
        dbname: "menutrainingpostponeduserpanel",
        url: "/task/training/master/trainingpostponedlist",
      },
      {
        title: "Training Users Report",
        dbname: "menutrainingusersreport",
        url: "/task/training/master/traininguserreport",
      },
      {
        title: "Overall Training Users Report",
        dbname: "menuoveralltrainingusersreport",
        url: "/task/training/master/overalltraininguserreport",
      },
      {
        title: "Training Users Allocation",
        dbname: "menutrainingusersallocation",
        url: "/task/training/master/traininguserallocation",
      },
    ],
  },
  {
    title: "Network Administration",
    dbname: "menunetworkadministration",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "IP",
        dbname: "menuip",
        url: "",
        submenu: [
          {
            title: "IP Category",
            dbname: "menuipcategory",
            url: "/manageipcategory",
          },
          {
            title: "IP Master",
            dbname: "menuipmaster",
            url: "/manageip",
          },
          {
            title: "UnAssigned IP",
            dbname: "menuunassignedip",
            url: "/manageiplist",
          },
          {
            title: "Assigned IP ",
            dbname: "menuassignedip",
            url: "/assignediplist",
          },
        ],
      },
      {
        title: "Passwords",
        dbname: "menupasswords",
        url: "",
        submenu: [
          {
            title: "Password Category",
            dbname: "menupasswordcategory",
            url: "/passwordcategory",
          },
          {
            title: "Password",
            dbname: "menupassword",
            url: "/addpassword",
            access: true,
          },
        ],
      },
      {
        title: "Mikrotik",
        dbname: "menumikrotik",
        url: "",
        submenu: [
          {
            title: "Mikrotik Master",
            dbname: "menumikrotikmaster",
            url: "/mikrotik/master",
            access: true,
          },
          {
            title: "Interfaces",
            dbname: "menuinterfaces",
            url: "/mikrotik/interfaces",
            access: true,
          },
          {
            title: "Logs",
            dbname: "menulogs",
            url: "/mikrotik/logs",
            access: true,
          },
          {
            title: "PPP",
            dbname: "menuppp",
            url: "",
            submenu: [
              {
                title: "PPP Interface",
                dbname: "menupppinterface",
                url: "/mikrotik/ppp/interface",
                access: true,
              },
              {
                title: "L2TP Server",
                dbname: "menul2tpserver",
                url: "/mikrotik/ppp/l2tpserver",
                access: true,
              },
              {
                title: "PPTP Server",
                dbname: "menupptpserver",
                url: "/mikrotik/ppp/pptpserver",
                access: true,
              },
              {
                title: "Profiles",
                dbname: "menuprofiles",
                url: "/mikrotik/ppp/profiles",
                access: true,
              },
              {
                title: "Secrets",
                dbname: "menusecrets",
                url: "/mikrotik/ppp/secrets",
                access: true,
              },
              {
                title: "Secrets List",
                dbname: "menusecretslist",
                url: "/mikrotik/ppp/secretslist",
                access: true,
              },
              {
                title: "Active Connections",
                dbname: "menuactiveconnections",
                url: "/mikrotik/ppp/activeconnections",
                access: true,
              },
            ],
          },
          {
            title: "IPs ",
            dbname: "menuip",
            url: "",
            submenu: [
              {
                title: "Pool",
                dbname: "menupool",
                url: "",
                submenu: [
                  {
                    title: "IP Pools",
                    dbname: "menuippools",
                    url: "/mikrotik/ip/pool/pools",
                  },
                  {
                    title: "IP Pool Used Addresses",
                    dbname: "menuippoolusedaddresses",
                    url: "/mikrotik/ip/pool/usedaddresses",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Tickets",
    dbname: "menutickets",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Master",
        dbname: "menumaster",
        url: "",
        submenu: [
          {
            title: "Ticket Category Master",
            dbname: "menuticketcategorymaster",
            url: "/tickets/addcategoryticket",
          },
          {
            title: "Subsub Category",
            dbname: "menusubsubcategory",
            url: "/tickets/subsubcomponent",
          },
          {
            title: "Material Category Grouping",
            dbname: "menumaterialcategorygrouping",
            url: "/tickets/assetcategorygrouping",
          },
          {
            title: "Ticket Type Master",
            dbname: "menutickettypemaster",
            url: "/tickets/typemaster",
          },
          {
            title: "Type Group Master",
            dbname: "menutypegroupmaster",
            url: "/tickets/typegroupmaster",
          },
          {
            title: "Reason Master",
            dbname: "menureasonmaster",
            url: "/tickets/reasonmaster",
          },
          {
            title: "Resolver Reason Master",
            dbname: "menuresolverreasonmaster",
            url: "/tickets/resolverreasonmaster",
          },
          {
            title: "Self Checkpoint Ticket Master",
            dbname: "menuselfcheckpointticketmaster",
            url: "/tickets/selfcheckpointticketmaster",
          },
          {
            title: "Checkpoint Ticket Master",
            dbname: "menucheckpointticketmaster",
            url: "/tickets/chekpointticketmaster",
          },

          {
            title: "Team Grouping",
            dbname: "menuteamgrouping",
            url: "/tickets/teamgrouping",
            access: true,
          },
          {
            title: "Priority Master",
            dbname: "menuprioritymaster",
            url: "/tickets/prioritymaster",
          },
          {
            title: "Duedate Master",
            dbname: "menuduedatemaster",
            url: "/tickets/duedate",
          },
          {
            title: "Required Master",
            dbname: "menurequiredmaster",
            url: "/tickets/requiredmaster",
          },
        ],
      },
      {
        title: "Raise Ticket",
        dbname: "menuraiseticket",
        url: "",
        submenu: [
          {
            title: "Raise Ticket",
            dbname: "menuraiseticket",
            url: "/tickets/raiseticketmaster",
            access: true,
          },
          {
            title: "Consolidated Ticket List",
            dbname: "menuconsolidatedticketlist",
            url: "/tickets/listtickets",
            access: true,
          },
          {
            title: "Individual Ticket List",
            dbname: "menuindividualticketlist",
            url: "/tickets/individuallist",
          },
          {
            title: "My Actionable Ticket",
            dbname: "menumyactionableticket",
            url: "/tickets/raiseticketteam",
          },
          {
            title: "Reports",
            dbname: "menureports",
            url: "",
            submenu: [
              {
                title: "Consolidated Ticket Report",
                dbname: "menuconsolidatedticketreport",
                url: "/tickets/raiseticketreport",
                access: true,
              },
              {
                title: "Individual Ticket Report",
                dbname: "menuindividualticketreport",
                url: "/tickets/individualreport",
              },
            ],
          },

          {
            title: "Assign Raise Ticket User",
          },
          {
            title: "Self/Other Raise Ticket User",
          },
        ],
      },
    ],
  },
  {
    title: "Leave&Permission",
    dbname: "menuleave&permission",
    url: "",
    navmenu: true,
    navlimit: true,
    submenu: [
      {
        title: "Leave",
        dbname: "menuleave",
        url: "",
        navlimit: true,
        submenu: [
          {
            title: "Leave Type",
            dbname: "menuleavetype",
            url: "/leave/leavetype",
          },
          {
            title: "Leave Criteria",
            dbname: "menuleavecriteria",
            url: "/leave/leavecriteria",
            access: true,
          },
          {
            title: "Block Days List",
            dbname: "menublockdayslist",
            url: "/leave/blockdayslist",
          },
          {
            title: "Apply Leave",
            dbname: "menuapplyleave",
            url: "/leave/applyleave",
            access: true,
            navlimit: true,
          },

          {
            title: "Team Leave Verification",
            dbname: "menuteamleaveverification",
            url: "/leave/teamleaveverification",
            access: true,
          },

          {
            title: "Approved Leave",
            dbname: "menuapprovedleave",
            url: "/leave/approveleave",
            access: true,
          },
          {
            title: "Leave Report",
            dbname: "menuleavereport",
            url: "/leave/leavereport",
            access: true,
          },
          {
            title: "Assign Leave Apply",
          },
        ],
      },
      {
        title: "Permission",
        dbname: "menupermission",
        url: "",
        navlimit: true,
        submenu: [
          {
            title: "Apply Permission",
            dbname: "menuapplypermission",
            url: "/permission/applypermission",
            access: true,
            navlimit: true,
          },
          {
            title: "Team Permission Verification",
            dbname: "menuteampermissionverification",
            url: "/permission/teampermissionverification",
            access: true,
          },
          {
            title: "Approved Permission",
            dbname: "menuapprovedpermission",
            url: "/permission/approvedlist",
            access: true,
          },
          {
            title: "Assign Apply Permission",
          },
        ],
      },
      {
        title: "Work From Home",
        dbname: "menuworkfromhome",
        url: "",
        submenu: [
          {
            title: "Assign Work From Home",
            dbname: "menuassignworkfromhome",
            url: "/assignworkfromhome",
            access: true,
          },
          {
            title: "Apply Work From Home",
            dbname: "menuapplyworkfromhome",
            url: "/applyworkfromhome",
            access: true,
          },
          {
            title: "Team Work From Home Verification",
            dbname: "menuteamworkfromhomeverification",
            url: "/workfromhome/teamworkfromhomeverification",
            access: true,
          },
        ],
      },
      // {
      //   title: "Leave/Permission Verification",
      //   dbname: "menuleave/permissionverification",
      //   url: "/leave/leaveandpermissionverification",
      //   access: true,
      // },
    ],
  },

  {
    title: "Interview",
    dbname: "menuinterview",
    navmenu: true,
    submenu: [
      {
        title: "Interview Setup",
        dbname: "menuinterviewsetup",
        url: "",
        submenu: [
          {
            title: "Category Interview",
            dbname: "menucategoryinterview",
            url: "/interview/addcategoryinterview",
          },
          {
            title: "Round Master",
            dbname: "menuroundmaster",
            url: "/interview/roundmaster",
          },
          {
            title: "Interview Type Master",
            dbname: "menuinterviewtypemaster",
            url: "/interview/interviewtypemaster",
          },
          {
            title: "Online/Interview Test Master",
            dbname: "menuonline/interviewtestmaster",
            url: "/task/training/onlinetest/onlinetestquestion",
          },
          {
            title: "Interview Question Master",
            dbname: "menuinterviewquestionmaster",
            url: "/interview/interviewquestions",
          },
          {
            title: "Interview Typingtest Master",
            dbname: "menuinterviewtypingtestmaster",
            url: "/interview/interviewtypingquestions",
          },
          {
            title: "Interview Test Master",
            dbname: "menuinterviewtestmaster",
            url: "/interview/interviewtestmaster",
          },
          {
            title: "Interview Verification Master",
            dbname: "menuinterviewverificationmaster",
            url: "/interview/interviewverificationmaster",
          },
          {
            title: "Interview Answer Allot",
            dbname: "menuinterviewanswerallot",
            url: "/interview/interviewanswerallot",
          },
          {
            title: "Interview Status Allot",
            dbname: "menuinterviewstatusallot",
            url: "/interview/interviewformgenerate",
          },
          {
            title: "Assign Interviewer",
            dbname: "menuassigninterviewer",
            url: "/interview/assigninterviewer",
            access: true,
          },
        ],
      },
      {
        title: "Interview Creation",
        dbname: "menuinterviewcreation",
        url: "",
        submenu: [
          {
            title: "Interview Questions Grouping",
            dbname: "menuinterviewquestionsgrouping",
            url: "/interview/interviewquestionsgrouping",
          },
          {
            title: "Interview Questions Order",
            dbname: "menuinterviewquestionsorder",
            url: "/interview/interviewquestionsorder",
          },
          {
            title: "Interview Round Order",
            dbname: "menuinterviewroundorder",
            url: "/interview/interviewroundorder",
          },
          {
            title: "Interview Rounds Test Verification",
            dbname: "menuinterviewroundstestverification",
            url: "/interview/interviewroundstestverification",
          },
          {
            title: "Interview Rounds Test Verification Results",
            dbname: "menuinterviewroundstestverificationresults",
            url: "/interview/interviewroundstestverificationresults",
          },
        ],
      },

      {
        title: "Exit Interview",
        dbname: "menuexitinterview",
        url: "",
        submenu: [
          {
            title: "Exit Interview Question Master",
            dbname: "menuexitinterviewquestionmaster",
            url: "/exitlist/exitinterviewquestionmaster",
          },
          {
            title: "Exit Interview Test Master",
            dbname: "menuexitinterviewtestmaster",
            url: "/exitlist/exitinterviewtestmaster",
          },
          {
            title: "Exit Confirmation List",
            dbname: "menuexitconfirmationlist",
            url: "/recruitment/exitconfirmationlist",
            access: true,
          },
          // {
          //   title: "Asset Status Recovery List",
          //   dbname: "menuassetstatusrecoverylist",
          //   url: "/assets/assetstatusrecoverylist",
          //   access: true,
          // },
          {
            title: "exitinterviewdropdown",
          },
        ],
      },
    ],
  },
  {
    title: "Typing Practice",
    dbname: "menutypingpractice",
    navmenu: true,
    url: "",
    submenu: [
      {
        title: "Practice Questions",
        dbname: "menupracticequestions",
        url: "/interview/typingtestpracticequestions",
      },
      {
        title: "Practice Questions Grouping",
        dbname: "menupracticequestionsgrouping",
        url: "/interview/typingtestpracticequestionsgrouping",
      },
      {
        title: "Practice Session",
        dbname: "menupracticesession",
        url: "/interview/typingtestpracticesession",
      },
      {
        title: "Overall Response",
        dbname: "menuoverallresponse",
        url: "/interview/overalltypingpracticeresponse",
      },
    ],
  },
  {
    title: "Checklist",
    dbname: "menuchecklist",
    navmenu: true,
    submenu: [
      {
        title: "Checklist Category",
        dbname: "menuchecklistcategory",
        url: "/interview/checklistcategory",
      },
      {
        title: "Checklist Module Selection",
        dbname: "menuchecklistmoduleselection",
        url: "/interview/checklistmoduleselection",
      },
      {
        title: "Checklists",
        dbname: "menuchecklists",
        url: "/interview/checklisttype",
      },
      {
        title: "Assign Checklist",
        dbname: "menuassignchecklist",
        url: "/interview/checklistverificationmaster",
        access: true,
      },
      {
        title: "Unallotted Checklist",
        dbname: "menuunallottedchecklist",
        url: "/interview/unallottedchecklist",
      },
      {
        title: "My Check List",
        dbname: "menumychecklist",
        url: "/interview/myinterviewchecklist",
        access: true,
      },
      {
        title: "All Pending Checklist",
        dbname: "menuallpendingchecklist",
        url: "/interview/allpendingchecklist",
        access: true,
      },

      {
        title: "All Completed Checklist",
        dbname: "menuallcompletedchecklist",
        url: "/interview/allassignedchecklist",
        access: true,
      },
    ],
  },
  {
    title: "Refer & Earn",
    dbname: "menurefer&earn",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Refer a candidate",
        dbname: "menureferacandidate",
        url: "/updatepages/refercandidatepage",
        access: true,
      },
      {
        title: "Career",
        dbname: "menucareer",
        url: "/appcareer/jobroles",
      },
    ],
  },

  {
    title: "Interactors",
    dbname: "menuinteractors",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Master",
        dbname: "menumaster",
        url: "",
        submenu: [
          {
            title: "Interactor Type",
            dbname: "menuinteractortype",
            url: "interactor/master/interactortype",
          },
          {
            title: "Interactor Mode",
            dbname: "menuinteractormode",
            url: "interactor/master/interactormode",
          },
          {
            title: "Type & Purpose Grouping",
            dbname: "menutype&purposegrouping",
            url: "interactor/master/managetype&purposegrouping",
          },
          {
            title: "Interactor Purpose",
            dbname: "menuinteractorpurpose",
            url: "interactor/master/interactorpurpose",
          },
        ],
      },
      {
        title: "Visitor",
        dbname: "menuvisitor",
        url: "",
        submenu: [
          {
            title: "Add Visitor (in/out)",
            dbname: "menuaddvisitor(in/out)",
            url: "interactor/master/addvisitors",
            access: true,
          },
          {
            title: "Visitor Enquiery",
            dbname: "menuvisitorenquiery",
            url: "interactor/master/visitorenquiery",
            access: true,
          },
          {
            title: "Visitor In",
            dbname: "menuvisitorin",
            url: "interactor/addvisitorin",
            access: true,
          },
          {
            title: "Visitor Out",
            dbname: "menuvisitorout",
            url: "interactor/visitoryoutentry",
            access: true,
          },
          {
            title: "List Visitors",
            dbname: "menulistvisitors",
            url: "interactor/master/listvisitors",
            access: true,
          },
          {
            title: "All Visitors",
            dbname: "menuallvisitors",
            url: "interactor/allvisitorlist",
            access: true,
          },
          {
            title: "Visitor Overall History",
            dbname: "menuvisitoroverallhistory",
            url: "interactor/viewoverallhistoryvisitor",
            access: true,
          },
          {
            title: "Visitors Details Log",
            dbname: "menuvisitorsdetailslog",
            url: "interactor/visitorsdetailslog",
            access: true,
          },
          {
            title: "Visitors Datewise Filter",
            dbname: "menuvisitorsdatewisefilter",
            url: "interactor/master/visitorsdatefilter",
            access: true,
          },
          {
            title: "Visitors Followup Filter",
            dbname: "menuvisitorsfollowupfilter",
            url: "interactor/master/visitorsfollowupfilter",
            access: true,
          },
          {
            title: 'Request Visitor Followup',
            dbname: 'menurequestvisitorfollowup',
            url: 'interactor/master/requestvisitorfollowup',
            access: true,
          },

        ],
      },
    ],
  },
  {
    title: "Settings",
    dbname: "menusettings",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Control Panel",
        dbname: "menucontrolpanel",
        url: "/settings/controlpanel",
        access: true,
      },
      {
        title: "Individual Settings",
        dbname: "menuindividualsettings",
        url: "/settings/individualsettings",
        access: true,
      },
      {
        title: "Clockin IP",
        dbname: "menuclockinip",
        url: "/settings/clockinip",
        access: true,
      },
      {
        title: "Password List",
        dbname: "menupasswordlist",
        url: "/settings/passwordlist",
      },

      {
        title: "My Credentials",
        dbname: "menumycredentials",
        url: "/settings/mypasswordcredentials",
      },
      {
        title: "Team Credentials",
        dbname: "menuteamcredentials",
        url: "/settings/myteampassword",
      },
      {
        title: "Attendance Control Criteria",
        dbname: "menuattendancecontrolcriteria",
        url: "/settings/attendancecontrolcriteria",
        access: true,
      },
      {
        title: "Auto Logout Update",
        dbname: "menuautologoutupdate",
        url: "/settings/autologout",
        access: true,
      },
      {
        title: "Limit Control Setting",
        dbname: "menulimitcontrolsetting",
        url: "/settings/limitcontrolsetting",
        access: true,
      },
      {
        title: "Template List",
        dbname: "menutemplatelist",
        url: "/settings/templatelist",
        access: true,
      },
      {
        title: "My Verification",
      },
      {
        title: "Verified List",
        dbname: "menuverifiedlist",
        url: "/settings/verifiedlist",
        access: true,
      },

      {
        title: "Maintanence Log",
        dbname: "menumaintanencelog",
        url: "/maintanencelog",
        access: true,
      },
      {
        title: "List Page Access Mode",
        dbname: "menulistpageaccessmode",
        url: "/listpageaccessmode",
      },
      {
        title: "Mail Configuration",
        dbname: "menumailconfiguration",
        url: "/settings/mailconfiguration",
      },
      {
        title: "Meeting Configuration",
        dbname: "menumeetingconfiguration",
        url: "/settings/meetingconfiguration",
      },
      {
        title: "Chat Configuration",
        dbname: "menuchatconfiguration",
        url: "/settings/chatconfiguration",
      },
      // {
      //   title: "Control Criteria",
      //   dbname: "menucontrolcriteria",
      //   url: "/setup/controlcriteria",
      // },
      {
        title: "Visitor Login",
        dbname: "menuvisitorlogin",
        url: "settings/visitorqr",
        access: true,
      },
      {
        title: "File",
        dbname: "menufile",
        url: "",
        submenu: [
          {
            title: "Download File",
            dbname: "menudownloadfile",
            url: "",
            submenu: [
              {
                title: "Compress Pdf",
                dbname: "menucompresspdf",
                url: "/compresspdf",
              },
              {
                title: "Merge Pdf",
                dbname: "menumergepdf",
                url: "/mergepdf",
              },
              {
                title: "View Pdf",
                dbname: "menuviewpdf",
                url: "/viewpdf",
              },
              {
                title: "Split Pdf",
                dbname: "menusplitpdf",
                url: "/splitpdf",
              },
              {
                title: "Organized Pdf",
                dbname: "menuorganizedpdf",
                url: "/organizedpdf",
              },
              {
                title: "Excel to Pdf",
                dbname: "menuexceltopdf",
                url: "/exceltopdf",
              },
              {
                title: "JPG to Pdf",
                dbname: "menujpgtopdf",
                url: "/jpgtopdf",
              },
            ],
          },
          {
            title: "File Creation",
            dbname: "menufilecreation",
            url: "/announcement/fileaccess",
          },
          {
            title: "File Share",
            dbname: "menufileshare",
            url: "fileshare",
            access: true,
          },
        ],
      },
      {
        title: "Organization Document",
        dbname: "menuorganizationdocument",
        url: "",
        submenu: [
          {
            title: "Organization Document Category",
            dbname: "menuorganizationdocumentcategory",
            url: "settings/organizationdocumentcategory",
          },
          {
            title: "Organization Document",
            dbname: "menuorganizationdocument",
            url: "settings/addorganizationdocument",
          },
        ],
      },
    ],
  },

  {
    title: "Support",
    dbname: "menusupport",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Support Category Master",
        dbname: "menusupportcategorymaster",
        url: "/support/master/categorymaster",
      },
      {
        title: "Raise Problem",
        dbname: "menuraiseproblem",
        url: "/production/raiseproblem",
      },
      {
        title: "Raise Problem List",
        dbname: "menuraiseproblemlist",
        url: "/production/raiseproblemlist",
      },
      {
        title: "Raise Problem Filter",
        dbname: "menuraiseproblemfilter",
        url: "",
        submenu: [
          {
            title: "Raise Problem Open",
            dbname: "menuraiseproblemopen",
            url: "/support/raiseproblem/open",
          },
          {
            title: "Raise Problem On Progress",
            dbname: "menuraiseproblemonprogress",
            url: "/support/raiseproblem/onprogress",
          },
          {
            title: "Raise Problem Closed",
            dbname: "menuraiseproblemclosed",
            url: "/support/raiseproblem/closed",
          },
        ],
      },
      {
        title: "Client Support",
        dbname: "menuclientsupport",
        url: "",
        submenu: [
          {
            title: "Manage Client Details",
            dbname: "menumanageclientdetails",
            url: "clientsupport/manageclientdetails",
          },
          {
            title: "Client Support List",
            dbname: "menuclientsupportlist",
            url: "/clientsupport/clientsupportlist",
          },
          {
            title: "Manage Ticket Grouping",
            dbname: "menumanageticketgrouping",
            url: "/clientsupport/manageticketgrouping",
            access: true,
          },
        ],
      },
    ],
  },

  {
    title: "connecTTS",
    dbname: "menuconnectts",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Create Team",
        dbname: "menucreateteam",
        url: "/connections/createteam",
      },
      {
        title: "Create Channel",
        dbname: "menucreatechannel",
        url: "/connections/createchannel",
      },
      {
        title: "Team & Channel Grouping",
        dbname: "menuteam&channelgrouping",
        url: "/connections/teamchannelgrouping",
        access: true,
      },
      {
        title: "ConnecTTS Users List",
        dbname: "menuconnecttsuserslist",
        url: "/connections/userslist",
      },
      {
        title: "ConnecTTS UnAssigned Users List",
        dbname: "menuconnecttsuserslist",
        url: "/connections/unassigneduserslist",
      },
      {
        title: "Members List",
        dbname: "menumemberslist",
        url: "/connections/memberslist",
        access: true,
      },
    ],
  },
  {
    title: "LDAP",
    dbname: "menuldap",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "LDAP Setting",
        dbname: "menuldapsetting",
        url: "/ldap/ldapsetting",
      },
      {
        title: "Organizational Unit",
        dbname: "menuorganizationalunit",
        url: "/ldap/organizationalunit",
      },
      {
        title: "Organizational Unit Grouping",
        dbname: "menuorganizationalunitgrouping",
        url: "/ldap/organizationalunitgrouping",
      },
      {
        title: "Domain Users List",
        dbname: "menudomainuserslist",
        url: "/ldap/domainuserslist",
      },
      {
        title: "Locked Users List",
        dbname: "menulockeduserslist",
        url: "/ldap/lockeduserslist",
      },
      {
        title: "Disabled Users List",
        dbname: "menudisableduserslist",
        url: "/ldap/disableduserslist",
      },
      {
        title: 'Hierarchy Disabled Users List',
        dbname: 'menuhierarchydisableduserslist',
        url: '/ldap/hierarchydisableduserslist',
      },
      {
        title: 'Hierarchy Domain Users List',
        dbname: 'menuhierarchydomainuserslist',
        url: '/ldap/hierarchydomainuserslist',
      },
      {
        title: 'Hierarchy Locked Users List',
        dbname: 'menuhierarchylockeduserslist',
        url: '/ldap/hierarchylockeduserslist',
      },
    ],
  },
  {
    title: "Poster",
    dbname: "menuposter",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Poster Master",
        dbname: "menupostermaster",
        url: "",
        submenu: [
          {
            title: "Poster Category Master",
            dbname: "menupostercategorymaster",
            url: "/poster/master/categorymaster",
          },
          {
            title: "Poster Subcategory Master",
            dbname: "menupostersubcategorymaster",
            url: "/poster/master/subcategorymaster",
          },
          {
            title: "Category Theme Grouping",
            dbname: "menucategorythemegrouping",
            url: "/poster/master/categorythemegrouping",
          },

          {
            title: "Poster Settings",
            dbname: "menupostersettings",
            url: "/poster/master/postermessagesetting",
          },
        ],
      },
      {
        title: "PPT",
        dbname: "menuppt",
        url: "",
        submenu: [
          {
            title: "PPT Category & Subcategory",
            dbname: "menupptcategory&subcategory",
            url: "/pptcategory&subcategory",
          },
          {
            title: "Power Point",
            dbname: "menupowerpoint",
            url: "/powerpoint",
          },
          {
            title: "Power Point List",
            dbname: "menupowerpointlist",
            url: "/powerpointlist",
          },
        ],
      },
      {
        title: "Poster Generate",
        dbname: "menupostergenerate",
        url: "/poster/postergenerate",
        access: true,
      },
      {
        title: "Screen Saver",
        dbname: "menuscreensaver",
        url: "/screensaver",
      },
      {
        title: "Theme Layout List",
        dbname: "menuthemelayoutlist",
        url: "/settings/themelayoutlist",
      },
    ],
  },
  {
    title: "All-Template-Cards",
    // dbname: "menualltemplatecards",
    url: "",
    navmenu: true,
    submenu: [
      {
        title: "Birthday Template",
        dbname: "menubirthdaytemplate",
        url: "/birthdaycard",
      },
      {
        title: "Birthday Template 2",
        dbname: "menubirthdaytemplate2",
        url: "/birthdaycardtwo",
      },
      {
        title: "Birthday 2NOS Template 2",
        dbname: "menubirthday2nostemplate2",
        url: "/birthdaycardtwo2nos",
      },
      {
        title: "Birthday 3NOS Template 2",
        dbname: "menubirthday3nostemplate2",
        url: "/birthdaycardtwo3nos",
      },
      {
        title: "Wedding Template",
        dbname: "menuweddingtemplate",
        url: "/weddingcard",
      },
      {
        title: "Wedding 2NOS Template",
        dbname: "menuwedding2nostemplate",
        url: "/weddingcard2nos",
      },
      {
        title: "Wedding 3NOS Template",
        dbname: "menuwedding3nostemplate",
        url: "/weddingcard3nos",
      },
    ],
  },
];
