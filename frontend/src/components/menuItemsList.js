export const menuItems = [

  {
    title: "Dashboard",
    dbname: "menudashboard",
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
            title: "Minimum Points",
            dbname: "menuminimumpoints",
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
          // {
          //   title: "Approvals",
          //   dbname: "menuapprovals",
          //   // url: "passwordcategory",
          // },
          {
            title: "Production Approved",
            dbname: "menuproductionapproved",
            // url: "passwordcategory",
          },
          {
            title: "Leave",
            dbname: "menuleave",
            // url: "addpassword",
          },
          {
            title: "Permission",
            dbname: "menupermission",
            // url: "addpassword",
          },
          {
            title: "Long Absent",
            dbname: "menulongabsent",
            // url: "addpassword",
          },
          {
            title: "Advance",
            dbname: "menuadvance",
            // url: "addpassword",
          },
          {
            title: "Loan",
            dbname: "menuloan",
            // url: "addpassword",
          },
          {
            title: "Tickets & Checklist",
            dbname: "menuticketes&checklist",
            // url: "",
          },
        ],
      },

      {
        title: "Asset & Maintenance",
        dbname: "menuassetmaintenance",
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
    ]
  },


  {
    title: "Setup",
    dbname: "menusetup",
    url: "",
    submenu: [
      {
        title: "Company",
        dbname: "menucompany",
        url: "/company",
      },
      {
        title: "Company Domain",
        dbname: "menucompanydomain",
        url: "/updatepages/companydomain",
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
        title: "Hierarchy",
        dbname: "menuhierarchy",
        url: "",
        submenu: [
          {
            title: "Hierarchy Create",
            dbname: "menuhierarchycreate",
            url: "/setup/hierarchy",
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
          },
        ],
      },

    ],
  },
  {
    title: "Human Resources",
    dbname: "menuhumanresources",
    url: "",
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
          },
          {
            title: "Accessible Company/Branch/Unit",
            dbname: "menuaccessiblecompany/branch/unit",
            url: "/assignbranch",
          },
          {
            title: "Unassigned Accessible Company/Branch/Unit",
            dbname: "menuunassignedaccessiblecompany/branch/unit",
            url: "/hr/unassignbranchreport",
          },
          {
            title: "Unit",
            dbname: "menuunit",
            url: "/unit",
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
          },
          {
            title: "Floor",
            dbname: "menufloor",
            url: "/floor",
          },
          {
            title: "WorkStation",
            dbname: "menuworkstation",
            url: "/workstation",
          },
          {
            title: "WorkStation SystemName",
            dbname: "lworkstationsystemname",
            url: "/updatepages/workstationsystemname",
          },
          // {
          //   title: "UnAllotted Remote System Name",
          //   dbname: "lunallottedremotesystemname",
          //   url: "/updatepages/unallottedremotesystemname",
          // },
          // {
          //   title: "Allotted Remote System Name",
          //   dbname: "lallottedremotesystemname",
          //   url: "/updatepages/allottedremotesystemname",
          // },

          {
            title: "Man Power",
            dbname: "menumanpower",
            url: "/manpower",
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
                  },
                  {
                    title: "List",
                    dbname: "menulist",
                    url: "/list",
                  },
                  {
                    title: "Employee MissingField List",
                    dbname: "menuemployeemissingfieldlist",
                    url: "/hrdocuments/empmissfield",
                  },
                  {
                    title: "Draft List",
                    dbname: "menudraftlist",
                    url: "/draftlist",
                  },
                  {
                    title: "Enquiry Purpose Users List",
                    dbname: "menuenquirypurposeuserslist",
                    url: "/enquirypurposelist",
                  },
                  {
                    title: "Employee Prevalues List",
                    dbname: "menuemployeeprevalueslist",
                    url: "/Employeeprevalueslist",
                  },
                  {
                    title: "Remote Employee List",
                    dbname: "menuremoteemployeelist",
                    url: "/remoteemployeelist",
                  },
                  {
                    title: "Remote Employee Details List",
                    dbname: "menuremoteemployeedetailslist",
                    url: "/remoteemployeedetailslist",
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
                  },
                  {
                    title: "Assigned Role Update",
                    dbname: "menuassignedroleupdate",
                    url: "/updatepages/assignedrole",
                  },
                  {
                    title: "Assign Experience",
                    dbname: "menuassignexperience",
                    url: "/updatepages/assignexperience",
                  },
                  {
                    title: "Assign Experience Filter",
                    dbname: "menuassignexperiencefilter",
                    url: "/updatepages/assignexperiencefilter",
                  },
                  {
                    title: "Assign Work Station",
                    dbname: "menuassignworkstation",
                    url: "/updatepages/assignworkstation",
                  },
                  {
                    title: "WorkStation Assigned Report",
                    dbname: "menuworkstationassignedreport",
                    url: "/updatepages/workstationassignedreport",
                  },
                  {
                    title: "WorkStation UnAssigned Report",
                    dbname: "menuworkstationunassignedreport",
                    url: "/updatepages/workstationunassignedreport",
                  },

                  {
                    title: "Personal Info update",
                    dbname: "menupersonalinfoupdate",
                    url: "/updatepages/personalupdate",
                  },
                  {
                    title: "Contact Info update",
                    dbname: "menucontactinfoupdate",
                    url: "/updatepages/contactupdate",
                  },

                  {
                    title: "Login Info update",
                    dbname: "menulogininfoupdate",
                    url: "/updatepages/loginupdate",
                  },
                  {
                    title: "Boarding Info update",
                    dbname: "menuboardinginfoupdate",
                    url: "/updatepages/boardingupdate",
                  },
                  {
                    title: "Assigned Bank Details",
                    dbname: "menuassignedbankdetails",
                    url: "/updatepages/bankdetailinfo",
                  },
                  {
                    title: "Document Info update",
                    dbname: "menudocumentinfoupdate",
                    url: "/updatepages/documentupdate",
                  },
                  {
                    title: "Joining Info update",
                    dbname: "menujoininginfoupdate",
                    url: "/updatepages/Joiningupdate",
                  },
                  {
                    title: "Educational Detail update",
                    dbname: "menueducationaldetailupdate",
                    url: "/updatepages/educationalupdate",
                  },
                  {
                    title: "Additional Qualification Update",
                    dbname: "menuadditionalqualificationupdate",
                    url: "/updatepages/addlqualificationupdate",
                  },
                  {
                    title: "Work History Info update",
                    dbname: "menuworkhistoryinfoupdate",
                    url: "/updatepages/workhistoryupdate",
                  },

                ]
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
                  },
                  {
                    title: "Live Employee List",
                    dbname: "menuliveemployeelist",
                    url: "/liveemployeelist",
                  },
                  {
                    title: "Employee Intern Live List",
                    dbname: "menuemployeeinternlivelist",
                    url: "/employeeinternlivelist",
                  },
                  {
                    title: "Employee Login Status",
                    dbname: "menuemployeeloginstatus",
                    url: "/employee/loginstatus",
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
                  },
                  {
                    title: "Long Absent Restriction Completed List",
                    dbname: "menulongabsentrestrictioncompletedlist",
                    url: "/updatedpages/employeestatuscompleted",
                  },
                  {
                    title: "Team Long Absent Restriction List",
                    dbname: "menuteamlongabsentrestrictionlist",
                    url: "/employee/longabsentrestrictionhierarchylist",
                  },

                  {
                    title: "Temporary Login",
                    dbname: "menutemporarylogin",
                    url: "/updatedpages/temploginstatus",
                  },
                  {
                    title: "Employee System Allot Details",
                    dbname: "menuemployeesystemallotdetails",
                    url: "/employeesystemallot",
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
                  },
                  {
                    title: "Deactivate Employees List",
                    dbname: "menudeactivateemployeeslist",
                    url: "/updatepages/deactivateemployeeslist",
                  },
                  {
                    title: "Deactivate Employees List View",
                    dbname: "menudeactivateemployeeslistview",
                    url: "/updatepages/deactivateemployeeslistview",
                  },
                  {
                    title: "Rejoined Employee List",
                    dbname: "menurejoinedemployeelist",
                    url: "/updatepages/rejoinemployeelist",
                  },

                ]
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
                  },
                  {
                    title: "Intern List",
                    dbname: "menuinternlist",
                    url: "/internlist",
                  },
                  {
                    title: "Intern Live List",
                    dbname: "linternlivelist",
                    url: "/internlivelist",
                  },
                  {
                    title: "Intern Draft List",
                    dbname: "menuinterndraftlist",
                    url: "/interndraftlist",
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
                    dbname: "lactiveinternlist",
                    url: "/activeinternlist",
                  },
                  {
                    title: "Deactivate Intern List",
                    dbname: "ldeactivateinternlist",
                    url: "/deactivateinternlist",
                  },
                  {
                    title: "Deactivate Intern List View",
                    dbname: "ldeactivateinternlistview",
                    url: "/deactivateinternlistview",
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
                  },
                  {
                    title: "Designation Log",
                    dbname: "menudesignationlog",
                    url: "/updatepages/designationlog",
                  },
                  {
                    title: "Department Log",
                    dbname: "menudepartmentlog",
                    url: "updatepages/departmentlog",
                  },
                  {
                    title: "Boarding Log",
                    dbname: "menuboardinglog",
                    url: "/updatepages/boardinglog",
                  },
                  {
                    title: "Shift Log",
                    dbname: "menushiftlog",
                    url: "/updatepages/shiftlog",
                  },
                  {
                    title: "Assign Manual Salary Details",
                    dbname: "menuassignmanualsalarydetails",
                    url: "/assignmanualsalarydetails",
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
                  },
                  {
                    title: "Assign PF-ESI",
                    dbname: "menuassignpf-esi",
                    url: "/updatepages/assignpfesi",
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
                  },
                  {
                    title: "Notice Period Status",
                    dbname: "menunoticeperiodstatus",
                    url: "/updatepages/noticeperiodlist",
                  },
                  {
                    title: "Notice Period Approve",
                    dbname: "menunoticeperiodapprove",
                    url: "/updatepages/noticeperiodstatuslist",
                  },
                  {
                    title: "Notice Period List Hierarchy",
                    dbname: "menunoticeperiodlisthierarchy",
                    url: "/hr/noticeperiodhierarchy",
                  },
                  {
                    title: "Exit List",
                    dbname: "menuexitlist",
                    url: "/updatepages/exitlist",
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
                title: "Department Month Set Auto",
                dbname: "menudepartmentmonthsetauto",
                url: "updatepages/departmentmonthsetauto",
              },
              {
                title: "Department Month Set",
                dbname: "menudepartmentmonthset",
                url: "updatepages/departmentmonthset",
              },
              {
                title: "Designation Month Set",
                dbname: "menudesignationmonthset",
                url: "updatepages/designationmonthset",
              },
              {
                title: "Process Month Set",
                dbname: "menuprocessmonthset",
                url: "updatepages/processmonthset",
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
            title: "Attendance",
            dbname: "menuattendance",
            url: "",
            submenu: [

              {
                title: "Attendance Mode Master",
                dbname: "lattendancemodemaster",
                url: "/attendance/modemaster",
              },
              {
                title: "Attendance Status Master",
                dbname: "lattendancestatusmaster",
                url: "/attendancestatusmaster",
              },
              {
                title: "Weekoff Controlpanel",
                dbname: "menuweekoffcontrolpanel",
                url: "/weekoffpresent",
              },
              {
                title: "Attendance Day Shift",
                dbname: "menuattendancedayshift",
                url: "/attendancedayshift",
              },
              {
                title: "User Shift Roaster",
                dbname: "menuusershiftroaster",
                url: "/usershiftroaster",
              },
              {
                title: "User Shift Weekoff Present",
                dbname: "menuusershiftweekoffpresent",
                url: "/attendance/usershiftweekoffpresent",
              },
              {
                title: "Attendance Individual",
                dbname: "menuattendanceindividual",
                url: "",
                submenu: [
                  {
                    title: "Overall Individual Status",
                    dbname: "menuoverallindividualstatus",
                    url: "/attendance/individualstatuslist",
                  },
                  {
                    title: "Team Attendance Status",
                    dbname: "menuteamattendancestatus",
                    url: "/setup/attendanceindividualhierarchy",
                  },
                  {
                    title: "My Attendance Status",
                    dbname: "menumyattendancestatus",
                    url: "/attendance/myindividualstatuslist",
                  }
                ],
              },
              {
                title: "Attendance Checklist",
                dbname: "menuattendancechecklist",
                url: "/attendance/checklist",
              },
              {
                title: "Attendance Month Status",
                dbname: "menuattendancemonthstatus",
                url: "/attendance/monthstatuslist",
              },

              {
                title: "Attendance Review",
                dbname: "menuattendancereview",
                url: "/attendance/review",
              },

              {
                title: "Attendance Report",
                dbname: "menuattendancereport",
                url: "/attendancereport",
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
                url: "setup/holiday",
              },
              {
                title: "Holiday Filter",
                dbname: "menuholidayfilter",
                url: "/setup/holidayfilter",
              },
              {
                title: "HolidayCalendar View",
                dbname: "menuholidaycalendarview",
                url: "setup/holidaycalendar",
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
                url: "setup/schedulemeeting",
              },
              {
                title: "Schedule Meeting Filter",
                dbname: "menuschedulemeetingfilter",
                url: "/setup/schedulemeetingfilter",
              },
              {
                title: "Schedule Meeting Calendar View",
                dbname: "menuschedulemeetingcalendarview",
                url: "setup/meetingcalendar",
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
                url: "setup/events",
              },
              {
                title: "Event Filter",
                dbname: "menueventfilter",
                url: "setup/eventsfilter",
              },
              {
                title: "Event Calendar View",
                dbname: "menueventcalendarview",
                url: "setup/eventscalendar",
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
              //   dbname: "lshiftroaster",
              //   url: "/shiftroaster",
              // },
              {
                title: "Shift Roaster",
                dbname: "menushiftroaster",
                url: "shiftfilterview",
              },
              {
                title: "Shift Adjustment",
                dbname: "menushiftadjustment",
                url: "/shiftadjustment",
              },
              // {
              //   title: "User Shift",
              //   dbname: "lshiftadjustment",
              //   url: "/usershiftlist",
              // },

              {
                title: "My Shift Roaster",
                dbname: "menumyshiftroaster",
                url: "/myshiftadjustment",
              },



            ]
          },
        ],
      },
      {
        title: "HR Documents",
        dbname: "menuhrdocuments",
        submenu: [
          {
            title: "Keyword Instructions",
            dbname: "menukeywordinstructions",
            url: "/hrdocuments/keywordinstructions",
          },
          {
            title: "Template Control Panel",
            dbname: "ltemplatecontrolpanel",
            url: "/settings/templatecontrolpanel",
          },
          {
            title: "Template Creation",
            dbname: "menutemplatecreation",
            url: "/hrdocuments/templatecreation",
          },
          {
            title: "Employee Document Preparation",
            dbname: "menuemployeedocumentpreparation",
            url: "/hrdocuments/documentpreparation",
          },
          {
            title: "Company Document Preparation",
            dbname: "menucompanydocumentpreparation",
            url: "/hrdocuments/companydocuments",
          },
          {
            title: "Idcard Preparation",
            dbname: "menuidcardpreparation",
            url: "/hrdocuments/createidcard",
          },
          {
            title: "Document Preparation Mail",
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
          },
          {
            title: "Recruitment Planning",
            dbname: "menurecruitmentplanning",
            url: "/recruitment/recruitmentplanning",
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
          },
          {
            title: "Job Openings",
            dbname: "menujobopenings",
            url: "/recruitment/jobopenlist",
          },
          {
            title: "Interview Status Count Report Page",
            dbname: "menuinterviewstatuscountreportpage",
            url: "/recruitment/interviewstatuscountreportpage",
          },
          {
            title: "Overall Not Response Report",
            dbname: "menuoverallnotresponsereport",
            url: "/recruitment/overallnotresponsereport",
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
          },

          // {
          //   title: "Roles and Responsibilities Category",
          //   dbname: "menurolesandresponsibilitiescategory",
          //   url: "/recruitment/rolesandresponsecategory",
          // },
          // {
          //   title: "Roles and Responsibilities",
          //   dbname: "lrolesandresponsibilities",
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
            ]
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
          //   dbname: "linterviewform",
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
        title: "Sub Module",
        dbname: "menusubmodule",
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
          },
          {
            title: "Task Assigned Board",
            dbname: "menutaskassignedboard",
            url: "/project/taskassignboard",
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
          },
          {
            title: "Secondary Work Order List",
            dbname: "menusecondaryworkorderlist",
            url: "/excel/secondaryworkorderlist",
          },
          {
            title: "Tertiary Work Order List",
            dbname: "menutertiaryworkorderlist",
            url: "/excel/tertiaryworkorderlist",
          },
          {
            title: "Others Work Order List",
            dbname: "menuothersworkorderlist",
            url: "/excel/othersworkorderlist",
          },
          {
            title: "Consolidated(primary/secondary/tertiary) Work Order List",
            dbname: "menuconsolidated(primary/secondary/tertiary)workorderList",
            url: "/excel/consolidatedprimaryworkorderlist",
          },
          {
            title: "Consolidated All Work Order List",
            dbname: "menuconsolidatedallworkorderlist",
            url: "/excel/consolidatedallworkorderlist",
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
          },
          {
            title: "Consolidated(primary/secondary/tertiary) Individual Work Order List",
            dbname: "menuconsolidated(primary/secondary/tertiary)individualworkorderlist",
            url: "/excel/consolidatedindividualprimarysecondarytertiary",
          },
          {
            title: "Consolidated All Individual Work Order List",
            dbname: "menuconsolidatedallindividualworkorderlist",
            url: "/excel/consolidatedindividualall",
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
          },
          {
            title: "Allotted Responsible List",
            dbname: "menuallottedresponsiblelist",
            url: "/excel/allotlist/allottedresponsiblelist",
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
            title: "Queue Type Report",
            dbname: "menuqueuetypereport",
            url: "/production/queuetypereport",
          },
          {
            title: "Queue Type Unassigned Report",
            dbname: "menuqueuetypeunassignedreport",
            url: "/production/queuetypeunassignedreport",
          },
          {
            title: "Queue Type Summary",
            dbname: "menuqueuetypesummary",
            url: "/production/queuetypereportsummary",
          },
          {
            title: "Production Original Summary",
            dbname: "menuproductionoriginalsummary",
            url: "/production/productionoriginalsummary",
          },
          // {
          //   title: "Production Original Summary Bulk Update",
          //   dbname: "menuproductionoriginalsummarybulkupdate",
          //   url: "/production/productionoriginalsummarybulkupdate",
          // },
          {
            title: "Production Temp Summary",
            dbname: "menuproductiontempsummary",
            url: "/production/productiontempsummary",
          },
          {
            title: "Client User ID",
            dbname: "menuclientuserid",
            url: "/production/clientuserid",
          },
          {
            title: "Production Process Queue",
            dbname: "menuproductionprocessqueue",
            url: "/production/productionprocessqueue",
          },
          {
            title: "Process Queue Name",
            dbname: "menuprocessqueuename",
            url: "/production/processqueuename",
          },
          {
            title: "Login Allot",
            dbname: "menuloginallot",
            url: "/updatepages/loginallot",
          },
          {
            title: "Target Points",
            dbname: "menutargetpoints",
            url: "/production/targetpoints",
          },
          {
            title: "Target Points Filter",
            dbname: "menutargetpointsfilter",
            url: "/production/targetpointsfilter",
          },
          {
            title: "ERA Amount",
            dbname: "menueraamount",
            url: "/production/eraamount",
          },
          {
            title: "Revenue Amount",
            dbname: "menurevenueamount",
            url: "/production/revenueamount",
          },
          {
            title: "Process Team Mapping",
            dbname: "menuprocessteammapping",
            url: "/production/processteam",
          },
          {
            title: "Ac-Point Calculation",
            dbname: "menuac-pointcalculation",
            url: "/acpointcalculation",
          },
          {
            title: "Minimum Points",
            dbname: "menuminimumpoints",
            url: "/production/minimumpoints",
          },
          {
            title: "Minimum Points Calculation",
            dbname: "menuminimumpointscalculation",
            url: "/production/minimumpointscalculation",
          },
          {
            title: "Category Date Change",
            dbname: "menucategorydatechange",
            url: "/categorydatechange",
          },
          {
            title: "Category Process Map",
            dbname: "menucategoryprocessmap",
            url: "/production/categoryprocessmap",
          },
          {
            title: "Production Day Shift",
            dbname: "menuproductiondayshift",
            url: "/production/productiondayshift",
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
            title: "Manage Category",
            dbname: "menumanagecategory",
            url: "/managecategory",
          },
        ]
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
                title: "Original Mismatch",
                dbname: "menuoriginalmismatch",
                url: "/production/checklist/originalmismatch",
              },

              {
                title: "Day Points Upload",
                dbname: "menudaypointsupload",
                url: "/production/daypointsupload",
              },
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

            ]

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
                title: "Temp Points Upload",
                dbname: "menutemppointsupload",
                url: "/production/temppointsupload",
              },
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
            ],
          },
        ]
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
            dbname: "menumanualovrallreport",
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
          }
          ,
        ]
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
                title: "Overal Report",
                dbname: "menuoverallreport",
                url: "/production/overallreport",
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
            ]
          },
          {
            title: "Temp",
            dbname: "menutemp",
            submenu: [

              {
                title: "Overall Temp Report",
                dbname: "menuoveralltempreport",
                url: "/production/tempoverallreport",
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
              },
            ],
          },
        ]
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
              },
              {
                title: "Non-production Unit Allot",
                dbname: "menunon-productionunitallot",
                url: "/production/nonproductionunitallot",
              },
              {
                title: "Idle Work Master",
                dbname: "menuidleworkmaster",
                url: "/production/manageidlework",
              },
            ]

          },
        ]
      }

    ],
  },


  // {
  //   title: "Quality",
  //   dbname: "menuquality",
  //   url: "",
  //   submenu: [
  //     {
  //       title: "Penalty",
  //       dbname: "menupenalty",
  //       url: "",
  //       submenu: [
  //         {
  //           title: "Penalty Setup",
  //           dbname: "menupenaltysetup",
  //           submenu: [
  //             {
  //               title: "Penalty Calculation",
  //               dbname: "menupenaltycalculation",
  //               submenu: [

  //                 {
  //                   title: "Penalty Day Upload",
  //                   dbname: "menupenaltydayupload",
  //                   url: "/production/penalty/penaltydayupload",
  //                 },
  //                 {
  //                   title: "Penalty Day List",
  //                   dbname: "menupenaltydaylist",
  //                   url: "/production/penalty/penaltydayuploadlist",
  //                 },
  //                 {
  //                   title: "Penalty Month List",
  //                   dbname: "menupenaltymonthlist",
  //                   url: "/production/penalty/managepenaltymonth",
  //                 },
  //                 {
  //                   title: "Client Error Upload",
  //                   dbname: "menuclienterrorupload",
  //                   url: "/production/penaltyclienterrorupload",
  //                 },
  //                 {
  //                   title: "Client Error List",
  //                   dbname: "menuclienterrorlist",
  //                   url: "/production/penaltyclienterrorlist",
  //                 },
  //                 {
  //                   title: "Penalty Client Error",
  //                   dbname: "menupenaltyclienterror",
  //                   url: "/production/penaltyclienterror",
  //                 },
  //                 {
  //                   title: "Penalty Error Upload ",
  //                   dbname: "menupenaltyerrorupload",
  //                   url: "/production/penaltyerrorupload",

  //                 },
  //                 {
  //                   title: "Bulk Error Upload ",
  //                   dbname: "menubulkerrorupload",
  //                   url: "/production/penalty/bulkerrorupload",
  //                 },
  //                 {
  //                   title: "Manual Error Update ",
  //                   dbname: "menumanualerrorupdate",
  //                   url: "/production/manualerrorupdate",
  //                 },
  //                 {
  //                   title: "Error Upload Confirm",
  //                   dbname: "menuerroruploadconfirm",
  //                   url: "/production/erroruploadconfirm",
  //                 },
  //                 {
  //                   title: "Penalty Total Field Upload",
  //                   dbname: "menupenaltytotalfieldupload",
  //                   url: "/production/penaltytotalfieldupload",
  //                 },
  //                 {
  //                   title: "Penalty Amount Consolidate",
  //                   dbname: "menupenaltyamountconsolidate",
  //                   url: "/penalty/penaltyamountconsolidate",
  //                 },
  //                 {
  //                   title: "Waiver Percentage",
  //                   dbname: "menuwaiverpercentage",
  //                   url: "/production/waiverpercentage",
  //                 },

  //               ]
  //             },
  //             {
  //               title: "Production Process Queue",
  //               dbname: "menuproductionprocessqueue",
  //               url: "/production/penalty/productionprocessqueue",
  //             },
  //             {
  //               title: "Error Type",
  //               dbname: "menuerrortype",
  //               url: "/production/penalty/penaltyerrortype",
  //               tooltip: ""
  //             },
  //             {
  //               title: "Error Reason",
  //               dbname: "menuerrorreason",
  //               url: "/production/penalty/errorreason",
  //             },
  //             // {
  //             //   title: "Error Mode",
  //             //   dbname: "lerrormode",
  //             //   // url: "/production/penalty/errorcontrol",
  //             // },
  //             {
  //               title: "Error Control",
  //               dbname: "menuerrorcontrol",
  //               url: "/production/penalty/errorcontrol",
  //             },
  //             {
  //               title: "Category Penalty Percentage",
  //               dbname: "menucategorypenaltypercentage",
  //               url: "/production/penalty/categorypercentage",
  //             },

  //             {
  //               title: "Other Penalty Control",
  //               dbname: "menuotherpenaltycontrol",
  //               url: "/production/penalty/otherpenaltycontrol",
  //             },
  //             {
  //               title: "Master Field Name",
  //               dbname: "menumasterfieldname",
  //               url: "/production/penalty/masterfieldname",
  //             },
  //             {
  //               title: "Experience Base Waiver Master",
  //               dbname: "menuexperiencebasewaivermaster",
  //               url: "/production/penalty/experiencebasewaviermaster",
  //             },
  //             // {
  //             //   title: "Penalty Amount Creation",
  //             //   dbname: "menupenaltyamountcreation",
  //             //   url: "/production/penaltyamountcreation",
  //             // },
  //             // {
  //             //   title: "Penalty",
  //             //   dbname: "menupenalty",
  //             //   url: "/production/penalty",
  //             // },
  //           ]
  //         },
  //         {
  //           title: "Process Penalty",
  //           dbname: "menuprocesspenalty",
  //           url: "",
  //           submenu: [
  //             {
  //               title: "Client Error Rate",
  //               dbname: "menuclienterrorrate",
  //               url: "/production/penalty/productionclientrate",
  //             },
  //             {
  //               title: "Client Error",
  //               dbname: "menuclienterror",
  //               // url: "quality/accuracy/accuracymaster",
  //             },

  //           ],
  //         },
  //       ],


  //     },
  //     {
  //       title: "Accuracy",
  //       dbname: "menuaccuracy",
  //       url: "",
  //       submenu: [
  //         {
  //           title: "Accuracy Master",
  //           dbname: "menuaccuracymaster",
  //           url: "/quality/accuracy/accuracymaster",
  //         },
  //         {
  //           title: "Accuracy Queue Grouping",
  //           dbname: "menuaccuracyqueuegrouping",
  //           url: "/quality/accuracy/accuracyqueuegrouping",
  //         },
  //         {
  //           title: "Expected Accuracy",
  //           dbname: "menuexpectedaccuracy",
  //           url: "/quality/accuracy/expectedaccuracy",
  //         },
  //         {
  //           title: "Acheived Accuracy",
  //           dbname: "menuacheivedaccuracy",
  //           url: "/quality/accuracy/acheivedaccuracy",
  //         },
  //         {
  //           title: "Acheived Accuracy Individual",
  //           dbname: "menuacheivedaccuracyindividual",
  //           url: "/quality/accuracy/acheivedaccuracyindividual",
  //         },
  //         {
  //           title: "Overall Acheived Accuracy Individual List",
  //           dbname: "menuoverallacheivedaccuracyindividuallist",
  //           url: "/quality/accuracy/overallacheivedaccuracyindividuallist",
  //         },
  //         {
  //           title: "Acheived Accuracy Individual Review List",
  //           dbname: "menuacheivedaccuracyindividualreviewlist",
  //           url: "/quality/accuracy/acheivedaccuracyindividualreviewlist",
  //         },
  //         {
  //           title: "Achieved Accuracy Individual Review Client Status List ",
  //           dbname: "menuachievedaccuracyindividualreviewclientstatuslist",
  //           url: "/quality/accuracy/achievedaccuracyindividualreviewclientstatuslist",
  //         },
  //         {
  //           title: "Achieved Accuracy Individual Review Internal Status List",
  //           dbname: "menuachievedaccuracyindividualreviewinternalstatuslist",
  //           url: "/quality/accuracy/achievedaccuracyindividualreviewinternalstatuslist",
  //         },
  //         {
  //           title: "Client Status List",
  //           dbname: "menuclientstatuslist",
  //           url: "/quality/accuracy/acheivedaccuracy/clientstatuslist",
  //         },
  //         {
  //           title: "Internal Status List",
  //           dbname: "menuinternalstatuslist",
  //           url: "/quality/accuracy/acheivedaccuracy/internalstatuslist",
  //         },
  //         // {
  //         //   title: "Acheived Accuracy Client Status",
  //         //   dbname: "menuacheivedaccuracyclientstatus",
  //         //   url: "/quality/accuracy/acheivedaccuracy/clientstatus",
  //         // },
  //         // {
  //         //   title: "Acheived Accuracy Internal Status",
  //         //   dbname: "menuacheivedaccuracyinternalstatus",
  //         //   url: "/quality/accuracy/acheivedaccuracy/internalstatus",
  //         // },
  //       ],
  //     },
  //   ],
  // },

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
            ]
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
                title: "Validation Error Entry",
                dbname: "menuvalidationerrorentry",
                url: "/production/validationerrorentry",
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
                title: "Error Upload Confirm",
                dbname: "menuerroruploadconfirm",
                url: "/production/erroruploadconfirm",
              },
              {
                title: "Manual Error Update",
                dbname: "menumanualerrorupdate",
                url: "/production/manualerrorupdate",
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


            ]
          },
          {
            title: "Penalty Waiver",
            dbname: "menupenaltycalculation",
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
                title: "Client Error Waiver Approval",
                dbname: "menuclienterrorwaiverapproval",
                url: "/production/clienterrorwaiverapproval",
              },

            ]
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
          },
          {
            title: "Acheived Accuracy Individual Review List",
            dbname: "menuacheivedaccuracyindividualreviewlist",
            url: "/quality/accuracy/acheivedaccuracyindividualreviewlist",
          },
          {
            title: "Achieved Accuracy Individual Review Client Status List ",
            dbname: "menuachievedaccuracyindividualreviewclientstatuslist",
            url: "/quality/accuracy/achievedaccuracyindividualreviewclientstatuslist",
          },
          {
            title: "Achieved Accuracy Individual Review Internal Status List",
            dbname: "menuachievedaccuracyindividualreviewinternalstatuslist",
            url: "/quality/accuracy/achievedaccuracyindividualreviewinternalstatuslist",
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
        title: "Other Task & Manual Entry Flag Report",
        dbname: "menuothertask&manualentryflagreport",
        url: "/flagcountothertasklist",
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
        title: "Other Task Consolidated Report",
        dbname: "menuothertaskconsolidatedreport",
        url: "/production/othertaskconsolidatedreport",
      },
      {
        title: "Other Task Individual Report",
        dbname: "menuothertaskindividualreport",
        url: "/production/otherindividualreport",
      },
    ]
  },
  {
    title: "PayRoll",
    dbname: "menupayroll",
    url: "",
    submenu: [
      {
        title: "PayRoll Setup",
        dbname: "menupayrollsetup",
        submenu: [
          {
            title: "Pay Run Control",
            dbname: "menupayruncontrol",
            url: "/production/paycontrol",
          },
          {
            title: "Pay Run Control Report",
            dbname: "menupayruncontrolreport",
            url: "/production/payrunreport",
          },
          {
            title: "Pay Run Master",
            dbname: "menupayrunmaster",
            url: "/production/payroll/payrunmaster",
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
            title: "Paid Date Fix",
            dbname: "menupaiddatefix",
            url: "/production/paiddatefix",
          },
          {
            title: "Paid Date Mode",
            dbname: "menupaiddatemode",
            url: "/production/paiddatemode",
          },
          {
            title: "Professional Tax Master",
            dbname: "menuprofessionaltaxmaster",
            url: "/professionaltaxmaster",
          },
          {
            title: "Shortage Master",
            dbname: "lshortagemaster",
            url: "/production/payroll/manageshortagemaster",
          },
        ]
      },
      {
        title: "PayRoll Creation",
        dbname: "menupayrollcreation",
        submenu: [
          {
            title: "Pay Run",
            dbname: "menupayrun",
            url: "/production/payroll/payrun",
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
          },
          {
            title: "Fixed Salary List",
            dbname: "menufixedsalarylist",
            url: "/production/payroll/fixedsalary",
          },
          {
            title: "Production Salary List",
            dbname: "menuproductionsalarylist",
            url: "/production/payroll/productionsalary",
          },
          {
            title: "Consolidated Salary List",
            dbname: "menuconsolidatedsalarylist",
            url: "/production/consolidatedsalarylist",
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
        ]
      },
      {
        title: "Loan & Advance",
        dbname: "menuloan&advance",
        submenu: [
          {
            title: "Advance",
            dbname: "menuadvance",
            url: "/advance",
          },
          {
            title: "Assign Advance"
          },
          {
            title: "Loan",
            dbname: "menuloan",
            url: "/loan",
          },
          {
            title: "Assign Loan"
          },
          {
            title: "Loan Request",
            dbname: "menuloanrequest",
            url: "/loanrequest",
          },
          {
            title: "Approved Loan",
            dbname: "menuapprovedloan",
            url: "/approvedloan",
          },
        ],
      },
      {
        title: "Salary Slab",
        dbname: "menusalaryslab",
        url: "",
        submenu: [
          {
            title: "Salary Slab Add",
            dbname: "menusalaryslabadd",
            url: "/setup/salaryslab/salaryslabadd",
          },
          {
            title: "Salary Slab List",
            dbname: "menusalaryslablist",
            url: "/setup/salaryslab/salaryslablist",
          },
          {
            title: "Salary Slab Filter",
            dbname: "menusalaryslabfilter",
            url: "/payroll/salaryslabfilter",
          },
          {
            title: "Salary Process Search Report",
            dbname: "menusalaryprocesssearchreport",
            url: "/payroll/salaryprocessreport",
          },
          {
            title: "My Target&Salary",
            dbname: "menumytarget&salary",
            url: "/payroll/targetsalary",
          },
        ],
      },

    ],
  },
  {
    title: "Documents",
    dbname: "menudocuments",
    url: "",
    submenu: [
      {
        title: "Documents Category",
        dbname: "menudocumentscategory",
        url: "/addcategorydoc",
      },
      {
        title: "Assign Document",
        dbname: "menuassigndocument",
        url: "/assigndocument",
      },
      {
        title: "Document",
        dbname: "menudocument",
        url: "/documents",
      },
      {
        title: "Document List",
        dbname: "ldocumentlist",
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
        dbname: "lreferencelist",
        url: "/listrefcategoryref",
      },
    ],
  },
  {
    title: "Expenses",
    dbname: "menuexpenses",
    url: "",
    submenu: [
      {
        title: "Expense Category",
        dbname: "menuexpensecategory",
        url: "/expense/expensecategory",
      },
      {
        title: "Expense",
        dbname: "menuexpense",
        url: "/expense/expenselist",
      },
      {
        title: "Assign Expense Others",
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
      {
        title: "Income",
        dbname: "menuincome",
        url: "/expense/income",
      },
      {
        title: "Remainder",
        dbname: "menuremainder",
        url: "",
        submenu: [
          {
            title: "Remainder Master",
            dbname: "menuremaindermaster",
            url: "/expense/remainder",
          },
          {
            title: "Payment Due Reminder",
            dbname: "menupaymentduereminder",
            url: "/expense/paymentduereminder",
          },
          {
            title: "All Remainder",
            dbname: "menuallremainder",
            url: "/expense/allreminder",
          },
        ],
      },
      {
        title: "Payment",
        dbname: "menupayment",
        url: "",
        submenu: [
          {
            title: "Purpose",
            dbname: "menupurpose",
            url: "/purpose",
          },
          {
            title: "Schedule Payment Bills",
            dbname: "menuschedulepaymentbills",
            url: "/account/otherpayments",
          },
          {
            title: "Schedule Payment Master",
            dbname: "menuschedulepaymentmaster",
            url: "/expense/schedulepaymentmaster",
          },
          {
            title: "Not Added Bills",
            dbname: "menunotaddedbills",
            url: "/expense/schedulepaymentnotaddedbills",
          },
        ],
      },

      {
        title: "All Income and Expenses",
        dbname: "menuallincomeandexpenses",
        url: "/expense/allincomeandexpenses",
      },
      {
        title: "Paid List",
        dbname: "menupaidlist",
        url: "/expense/paidlist",
      },
      {
        title: "Not Paid List",
        dbname: "menunotpaidlist",
        url: "/expense/notpaidlist",
      },
    ],
  },
  {
    title: "Asset",
    dbname: "menuasset",
    url: "",
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

        ],
      },
      {
        title: "Software",
        dbname: "menusoftware",
        url: "",
        submenu: [
          {
            title: "Operating System",
            dbname: "menuoperatingsystem",
            url: "/assetspecification/software/operatingsystem",
          },
          {
            title: "Software Specification",
            dbname: "menusoftwarespecification",
            url: "/assetspecification/software/softwarespecification",
          },
          {
            title: "Asset Software Grouping",
            dbname: "menuassetsoftwaregrouping",
            url: "/assetspecification/software/assetsoftwaregrouping",
          },
        ]
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
          },
          {
            title: "Asset Master List",
            dbname: "menuassetmasterlist",
            url: "/asset/assetlist",
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
          // {
          //   title: "Asset Material IP",
          //   dbname: "menuassetmaterialip",
          //   url: "/asset/assetmaterialip",
          // },
          {
            title: "Dynamic Asset Materials",
            dbname: "menudynamicassetmaterials",
            url: "/asset/assetmaterialip",
          },
          {
            title: "Maintenance Details Master",
            dbname: "menumaintenancedetailsmaster",
            url: "/asset/maintenancedetailsmaster",

          },
          {
            title: "Asset WorkStation Grouping",
            dbname: "menuassetworkstationgrouping",
            url: "/asset/assetworkstationgrouping",
          },
          {
            title: "Asset WorkStation Grouping Report",
            dbname: "menuassetworkstationgroupingreport",
            url: "/asset/assetworkstationgroupingreport",
          },
          {
            title: "Asset Problem Master",
            dbname: "menuassetproblemmaster",
            url: "/assetproblemmaster",
          },

          {
            title: "Manage Asset",
            dbname: "menumanageasset",
            url: "/asset/manageasset",
          },
          {
            title: "Damage Asset",
            dbname: "menudamageasset",
            url: "/asset/damageasset",
          },
          {
            title: "Repair Asset",
            dbname: "menurepairasset",
            url: "/asset/repairasset",
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
            url: "/expense/managestockitems"
          },
          {
            title: "Stock Request",
            dbname: "menustockrequest",
            url: "/stockpurchase/stockmanagerequest",
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
          },
          {
            title: "Manual Stock Entry",
            dbname: "menumanualstockentry",
            url: "/stockpurchase/manualstock",
          },
          {
            title: "Stock Reorder",
            dbname: "menustockreorder",
            url: "/stockpurchase/stockreorder",
          },
          {
            title: "Stock Management",
            dbname: "menustockmanagement",
            url: "/stockpurchase/stockmanagement",
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
          },
          {
            title: "Stock Manage Transfer",
            dbname: "menustockmanagetransfer",
            url: "/stockpurchase/managestocktransfer",
          },
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
    submenu: [
      {
        title: "Eb Service Master",
        dbname: "menuebservicemaster",
        url: "/eb/ebservicemaster",
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
      },
      {
        title: "EB Rates",
        dbname: "menuebrates",
        url: "/eb/ebrates",
      },
      {
        title: "EB Reading Details",
        dbname: "menuebreadingdetails",
        url: "/eb/ebreadingdetails",
      },
      {
        title: "EB Reading Details List",
        dbname: "menuebreadingdetailslist",
        url: "/eb/ebreadingdetailslist",
      },
      {

        title: "EB Reading Report",
        dbname: "lebreadingreport",
        url: "/eb/ebreadingreport",
      },
      {
        title: "EB Material Usage Details",
        dbname: "menuebmaterialusagedetails",
        url: "/eb/ebmaterialusagedetails",
      },
      {
        title: "Eb Reading Analysis Review",
        dbname: "lebreadinganalysisreview",
        url: "/eb/ebreadinganalysisreview",
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
            url: "setup/managepowershutdowntype",
          },
          {
            title: "Manage Power ShutDown",
            dbname: "menumanagepowershutdown",
            url: "setup/powerstation",
          },
          {
            title: "Power ShutDown Filter",
            dbname: "menupowershutdownfilter",
            url: "/setup/powerstationfilter",
          },
          {
            title: "Power ShutDown Calendar",
            dbname: "menupowershutdowncalendar",
            url: "setup/powerstationcalendar",
          },
        ],
      },

    ],
  },
  {
    title: "Task",
    dbname: "menutask",
    url: "",
    submenu: [
      {
        title: "Task Category",
        dbname: "menutaskcategory",
        url: "task/master/taskcategory",
      },
      {
        title: "Task Subcategory",
        dbname: "menutasksubcategory",
        url: "task/master/tasksubcategory",
      },
      {
        title: "Task Schedule Grouping",
        dbname: "menutaskschedulegrouping",
        url: "task/taskschedulegrouping",
      },
      {
        title: "Task Non Schedule Grouping",
        dbname: "menutasknonschedulegrouping",
        url: "task/tasknonschedulegrouping",
      },
      {
        title: "Task Assign Grouping",
        dbname: "menutaskassigngrouping",
        url: "task/taskdesignationgrouping",
      },
      {
        title: "Task Manual Creation",
        dbname: "menutaskmanualcreation",
        url: "task/taskmanualcreation",
      },
      {
        title: "Task Hierarchy Reports",
        dbname: "menutaskhierarchyreports",
        url: "task/taskhierarchyreport",
      },
      {
        title: "Task User Panel",
        dbname: "menutaskuserpanel",
        url: "task/taskforuser",
      },
      {
        title: "Completed Task",
        dbname: "menucompletedtask",
        url: "task/completedtasks",
      },
      {
        title: "Tasks Allocation",
        dbname: "menutasksallocation",
        url: "task/userstaskallocation",
      },
      {
        title: "Task Users Report",
        dbname: "menutaskusersreport",
        url: "task/taskforuserreport",
      },
    ],
  },
  {
    title: "Traning",
    dbname: "menutraning",
    url: "",
    submenu: [
      {
        title: "Training Category",
        dbname: "menutrainingcategory",
        url: "task/traning/master/trainingcategory",
      },
      {
        title: "Training Subcategory",
        dbname: "menutrainingsubcategory",
        url: "task/traning/master/trainingsubcategory",
      },
      {
        title: "Online Test Master",
        dbname: "menuonlinetestmaster",
        url: "task/traning/onlinetest/onlinetestmaster",
      },
      {
        title: "Training Details",
        dbname: "menutrainingdetails",
        url: "task/traning/master/trainingdetails",
      },
      {
        title: "Training Hierarchy Reports",
        dbname: "menutraininghierarchyreports",
        url: "training/master/traininghierarchyreport",
      },
      {
        title: "Training User Panel",
        dbname: "menutraininguserpanel",
        url: "task/training/master/traininguserpanel",
      },
      {
        title: "Training Postponed User Panel",
        dbname: "menutrainingpostponeduserpanel",
        url: "task/training/master/trainingpostponedlist",
      },
      {
        title: "Training Users Report",
        dbname: "menutrainingusersreport",
        url: "task/training/master/traininguserreport",
      },
      {
        title: "Training Users Allocation",
        dbname: "menutrainingusersallocation",
        url: "task/training/master/traininguserallocation",
      },
    ],
  },
  {
    title: "Network Administration",
    dbname: "menunetworkadministration",
    url: "",
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
            url: "passwordcategory",
          },
          {
            title: "Password",
            dbname: "menupassword",
            url: "addpassword",
          },
        ],
      },

    ],
  },

  {
    title: "Tickets",
    dbname: "menutickets",
    url: "",
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
            title: "Type  Master",
            dbname: "menutypemaster",
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
          },
          {
            title: "Consolidated Ticket List",
            dbname: "menuconsolidatedticketlist",
            url: "/tickets/listtickets",
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
              },
              {
                title: "Individual Ticket Report",
                dbname: "menuindividualticketreport",
                url: "/tickets/individualreport",
              },
            ]
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
    submenu: [
      {
        title: "Leave",
        dbname: "menuleave",
        url: "",
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
          },

          {
            title: "Team Leave Verification",
            dbname: "menuteamleaveverification",
            url: "/leave/teamleaveverification",
          },

          {
            title: "Approved Leave",
            dbname: "menuapprovedleave",
            url: "/leave/approveleave",
          },
          {
            title: "Leave Report",
            dbname: "menuleavereport",
            url: "/leave/leavereport",
          },
          {
            title: "Assign Leave Apply ",
          },
        ],
      },
      {
        title: "Permission",
        dbname: "menupermission",
        url: "",
        submenu: [
          {
            title: "Apply Permission",
            dbname: "menuapplypermission",
            url: "/permission/applypermission",
          },
          {
            title: "Team Permission Verification",
            dbname: "menuteampermissionverification",
            url: "/permission/teampermissionverification",
          },
          {
            title: "Approved Permission",
            dbname: "menuapprovedpermission",
            url: "/permission/approvedlist",
          },
          {
            title: "Assign Apply Permission",
          },
        ],
      },
      {
        title: "Leave/Permission Verification",
        dbname: "menuleave/permissionverification",
        url: "/leave/leaveandpermissionverification",
      },
    ],
  },

  {
    title: "Interview",
    dbname: "menuinterview",
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
            url: "task/traning/onlinetest/onlinetestquestion",
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
          },
        ]
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
        ]
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
          },
          {
            title: "Asset Status Recovery List",
            dbname: "menuassetstatusrecoverylist",
            url: "/assets/assetstatusrecoverylist",
          },
          {
            title: "exitinterviewdropdown",
          },

        ]
      },


    ],
  },
  {
    title: "Checklist",
    dbname: "menuchecklist",
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
      },
      {
        title: "All Pending Checklist",
        dbname: "menuallpendingchecklist",
        url: "/interview/allpendingchecklist",
      },

      {
        title: "All Completed Checklist",
        dbname: "menuallcompletedchecklist",
        url: "/interview/allassignedchecklist",
      },


    ],
  },
  {
    title: "Refer & Earn",
    dbname: "menurefer&earn",
    url: "",
    submenu: [
      {
        title: "Refer a candidate",
        dbname: "menureferacandidate",
        url: "/updatepages/refercandidatepage",
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

        ]

      },

      {
        title: "Visitor",
        dbname: "menuvisitor",
        url: "",
        submenu: [

          {
            title: "Add Visitors",
            dbname: "menuaddvisitors",
            url: "interactor/master/addvisitors",
          },
          {
            title: "List Visitors",
            dbname: "menulistvisitors",
            url: "interactor/master/listvisitors",
          },
          {
            title: "All Visitors",
            dbname: "menuallvisitors",
            url: "interactor/allvisitorlist",
          },
          {
            title: "Visitors Datewise Filter",
            dbname: "menuvisitorsdatewisefilter",
            url: "interactor/master/visitorsdatefilter",
          },
          {
            title: "Visitors Followup Filter",
            dbname: "menuvisitorsfollowupfilter",
            url: "interactor/master/visitorsfollowupfilter",
          },
        ]

      },

    ],
  },
  {
    title: "Settings",
    dbname: "menusettings",
    url: "",
    submenu: [
      {
        title: "Control Panel",
        dbname: "menucontrolpanel",
        url: "/settings/controlpanel",
      },
      {
        title: "Individual Settings",
        dbname: "menuindividualsettings",
        url: "/settings/individualsettings",
      },
      {
        title: "Clockin IP",
        dbname: "menuclockinip",
        url: "/settings/clockinip",
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
      },
      {
        title: "Auto Logout Update",
        dbname: "menuautologoutupdate",
        url: "/settings/autologout",
      },
      {
        title: "Template List",
        dbname: "menutemplatelist",
        url: "/settings/templatelist",
      },
      {
        title: "My Verification",
      },
      {
        title: "Verified List",
        dbname: "menuverifiedlist",
        url: "/settings/verifiedlist",
      },

      {
        title: "Maintanence Log",
        dbname: "menumaintanencelog",
        url: "/maintanencelog",
      },
      {
        title: "List Page Access Mode",
        dbname: "menulistpageaccessmode",
        url: "/listpageaccessmode",
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
      },
      {
        title: "File",
        dbname: "menufile",
        url: "",
        submenu: [
          {
            title: "File Creation",
            dbname: "menufilecreation",
            url: "/announcement/fileaccess",
          },
          {
            title: "File Share",
            dbname: "menufileshare",
            url: "fileshare",
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
            url: "settings/organizationdocumentcategory"
          },
          {
            title: "Organization Document",
            dbname: "menuorganizationdocument",
            url: "settings/addorganizationdocument"
          }
        ]
      },

    ],
  },

  {
    title: "Support",
    dbname: "menusupport",
    url: "",
    submenu: [
      {
        title: "Category Master",
        dbname: "lcategorymaster",
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
            dbname: "lraiseproblemopen",
            url: "/support/raiseproblem/open",
          },
          {
            title: "Raise Problem On Progress",
            dbname: "lraiseproblemonprogress",
            url: "/support/raiseproblem/onprogress",
          },
          {
            title: "Raise Problem Closed",
            dbname: "lraiseproblemclosed",
            url: "/support/raiseproblem/closed",
          },
        ],
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
        dbname: "lcategorymaster",
        url: "/clientsupport/clientsupportlist",
      },
      {
        title: "Manage Ticket Grouping",
        dbname: "menumanageticketgrouping",
        url: "/clientsupport/manageticketgrouping",
      },
    ],
  },
  {
    title: "Hi-Connect",
    dbname: "menuhiconnect",
    url: "",
    submenu: [
      {
        title: "Create Team",
        dbname: "menucreateteam",
        url: "/hiconnect/createteam",
      },
      {
        title: "Create Channel",
        dbname: "menucreatechannel",
        url: "/hiconnect/createchannel",
      },
    ],
  },

  {
    title: "Poster",
    dbname: "menutemplate",
    url: "",
    submenu: [
      {
        title: "Master",
        dbname: "menumaster",
        url: "",
        submenu: [
          {
            title: "Category Master",
            dbname: "menucategorymaster",
            url: "/poster/master/categorymaster",
          },
          {
            title: "Subcategory Master",
            dbname: "menusubcategorymaster",
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
        title: "Poster Generate",
        dbname: "menupostergenerate",
        url: "/poster/postergenerate",
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