import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, FormGroup, FormControlLabel,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import StyledDataGrid from "../../../components/TableStyle";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { MultiSelect } from "react-multi-select-component";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Backdrop } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";

const LoadingBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                position: "fixed", // Changed to absolute
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: (theme) => theme.zIndex.drawer + 1000
            }}
            open={open}
        >
            <div className="pulsating-circle">
                <CircularProgress color="inherit" className="loading-spinner" />
            </div>
            <Typography variant="h6" sx={{ marginLeft: 2, color: '#fff', fontWeight: 'bold' }}>
                Loading, please wait...
            </Typography>
        </Backdrop>
    );
};

const ExportXLWithImages = ({ csvData, fileName, columnVisibility, exportFields, setIsFilterOpen, setIsLoading, fileFormat }) => {
    const exportToExcel = async (csvData, fileName) => {
        if (!csvData || !csvData.length) {
            setIsLoading(false)
            return;
        }
    
        if (!fileName) {
            console.error("No file name provided.");
            return;
        }
    
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
    
            // Filter exportFields based on columnVisibility
            const visibleExportFields = exportFields.filter(field => columnVisibility[field.key]);
    
            // Define columns based on visible exportFields
            worksheet.columns = visibleExportFields.map(field => ({
                header: field.label,
                key: field.label,
                width: field.width || 20 // Default width if not provided
            }));
    
            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
    
                // Clone the item to avoid modifying the original data
                const rowItem = { ...item };
    
                // Remove the base64 string from the Profile property before adding the row
                if (rowItem.Profile) {
                    delete rowItem.Profile;
                }
    
                const row = worksheet.addRow(rowItem);
    
                // Center align the text in each cell of the row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
    
                // Add image if Profile property exists
                if (item.Profile) {
                    const base64Data = item.Profile.split(',')[1];
                    const base64Header = item.Profile.split(',')[0];
    
                    // Ensure the base64 string is valid
                    if (!base64Data || !base64Header) {
                        continue;
                    }
    
                    let extension = 'png'; // Default to PNG
    
                    if (base64Header.includes('jpeg')) {
                        extension = 'jpeg';
                    } else if (base64Header.includes('png')) {
                        extension = 'png';
                    } else {
                        continue;
                    }
    
                    try {
                        const imageId = workbook.addImage({
                            base64: base64Data,
                            extension: extension,
                        });
    
                        const rowIndex = row.number;
    
                        // Adjust row height to fit the image
                        worksheet.getRow(rowIndex).height = 80;
    
                        // Add image to the worksheet
                        worksheet.addImage(imageId, {
                            tl: { col: visibleExportFields.length - 1, row: rowIndex - 1 },
                            ext: { width: 100, height: 80 },
                        });
    
                        // Align the cell containing the image
                        worksheet.getCell(`${String.fromCharCode(64 + visibleExportFields.length)}${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    } catch (error) {
                        continue;
                    }
                }
            }
    
            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            setIsFilterOpen(false);
            setIsLoading(false)
            FileSaver.saveAs(blob, `${fileName}.${fileFormat === 'xl' ? "xlsx" : "csv"}`);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };
    exportToExcel(csvData, fileName)
};


function EmployeePrevaluesList() {

    const [isLoading, setIsLoading] = useState(false);
    const [fileFormat, setFormat] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const { isUserRoleCompare, isAssignBranch, allTeam, allUsersData
    } = useContext(UserRoleAccessContext);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [participantsOption, setParticipantsOption] = useState([]);


    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [valueCate, setValueCate] = useState("");

    const handleCompanyChangeValue = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedOptionsBranch([])
        setValueBranchCat([])
        setValueUnitCat([])
        setValueTeamCat([])
        setValueCate([])    };

    const handleBranchChangeValue = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setValueUnitCat([])
        setValueTeamCat([])
        setValueCate([])
    };

    const handleUnitChangeValue = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        setValueCate([])
    };

    const handleTeamChangeValue = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        handleTeamChange(options);
        setValueCate([])

    };


    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };
    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };
    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };
    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

        setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

        setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

        setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);
        setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      let selectedUser = allUsersData
      ?.filter(
        (u) =>
          selectedCompany?.includes(u.company) &&
          selectedBranch?.includes(u.branch) &&
          selectedUnit?.includes(u.unit) &&
          selectedTeam?.includes(u.team)
      )
      .map((u) => ({
        label: u.companyname,
        value: u.companyname,
      }));
      setSelectedOptionsCate(selectedUser);
      setParticipantsOption(selectedUser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

    const handleTeamChange = async (e) => {

        try {
            let res_location = await axios.get(SERVICE.USERALLLIMIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let filteredData = res_location?.data?.users?.filter((data) => {
                return selectedOptionsCompany?.some((comp) => comp?.value === data.company) &&
                    selectedOptionsBranch?.some((bran) => bran?.value === data.branch) &&
                    selectedOptionsUnit?.some((unit) => unit?.value === data.unit) &&
                    e?.some((team) => team?.value === data.team)
            }).map((item) => ({ label: item.companyname, value: item.companyname }));


            // data.company == datas.company && data.branch == datas.branch && data.unit == datas.unit && e.value == data.team

            setParticipantsOption(filteredData);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };
    const customValueRendererCate = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employees";
    };

    const handleclear = async () => {
        setValueCompanyCat([])
        setValueBranchCat([])
        setValueUnitCat([])
        setValueTeamCat([])
        setValueCate([])
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setParticipantsOption([]);
        setSelectedOptionsCate([]);
        setEmployeelists([]);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

    const handleFilter = async (e, from) => {
        setEmployeecheck(false);
        e.preventDefault();

        if (selectedOptionsCompany?.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Company!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {

            try {

                let datas = await axios.post(SERVICE.GETALLFILTEREDUSERS, {
                    companyname: valueCompanyCat,
                    branchname: valueBranchCat,
                    unitname: valueUnitCat,
                    teamname: valueTeamCat,
                    employeename: valueCate
                })

                if (datas?.data?.users?.length > 0) {
                    setEmployeelists(datas?.data?.users.map((item, index) => {
                        return {
                            _id: item._id,
                            serialNumber: item.serialNumber,
                            firstname: item.firstname,
                            lastname: item.lastname,
                            legalname: item.legalname,
                            fathername: item.fathername,
                            mothername: item.mothername,
                            gender: item.gender,
                            maritalstatus: item.maritalstatus,
                            dom: (item.dom && item.maritalstatus == "Married") ? moment(item.dom).format("DD-MM-YYYY") : "",
                            dob: item.dob ? moment(item.dob).format("DD-MM-YYYY") : "",
                            bloodgroup: item.bloodgroup,
                            email: item.email,
                            location: item.location,
                            contactpersonal: item.contactpersonal,
                            contactfamily: item.contactfamily,
                            emergencyno: item.emergencyno,
                            dot: item.dot ? moment(item.dot).format("DD-MM-YYYY") : "",
                            doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
                            aadhar: item.aadhar,
                            panno: item.panno,
                            username: item.username,
                            password: item.password,
                            companyname: item.companyname,
                            enquirystatus: item.enquirystatus,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            floor: item.floor,
                            area: item.area,
                            department: item.department,
                            workmode: item.workmode,
                            team: item.team,
                            designation: item.designation,
                            shiftgrouping: item.shiftgrouping == "Please Select Shift Group" ? "" : item.shiftgrouping,
                            shifttiming: item.shifttiming == "Please Select Shift" ? "" : item.shifttiming,
                            weekoff: item.weekoff?.join(",")?.toString(),
                            reportingto: item.reportingto,
                            empcode: item.empcode,
                            workstation: item.workstation?.includes("Please Select Primary Work Station") ? "" : Array.isArray(item.workstation) ? item.workstation?.join(",")?.toString() : item.workstation,
                            pdoorno: item.pdoorno,
                            pstreet: item.pstreet,
                            parea: item.parea,
                            plandmark: item.plandmark,
                            ptaluk: item.ptaluk,
                            ppost: item.ppost,
                            ppincode: item.ppincode,
                            pcountry: item.pcountry,
                            pstate: item.pstate,
                            pcity: item.pcity,
                            profileimage: item?.profileimage,
                
                            cdoorno: item.cdoorno,
                            cstreet: item.cstreet,
                            carea: item.carea,
                            clandmark: item.clandmark,
                            ctaluk: item.ctaluk,
                            cpost: item.cpost,
                            cpincode: item.cpincode,
                            ccountry: item.ccountry,
                            cstate: item.cstate,
                            ccity: item.ccity,
                            bankname: item.bankname,
                            bankbranchname: item.bankbranchname,
                            accountholdername: item.accountholdername,
                            accountnumber: item.accountnumber,
                            ifsccode: item.ifsccode,
                            accounttype: item.accounttype
                        }
                    }));
                } else {
                    setEmployeelists([]);
                }


                setEmployeecheck(true)

            } catch (err) { setEmployeelists([]); setEmployeecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
        }



    };

    const exportFields = [
        { key: 'serialNumber', label: 'Sno', generate: (t, index) => index + 1 },

        { key: 'firstname', label: 'First Name' },
        { key: 'lastname', label: 'Last Name' },
        { key: 'legalname', label: 'Legal Name' },
        { key: 'fathername', label: 'Father Name' },
        { key: 'mothername', label: 'Mother Name' },
        { key: 'gender', label: 'Gender' },
        { key: 'maritalstatus', label: 'Marital Status' },
        { key: 'dom', label: 'Date Of Marriage' },
        { key: 'dob', label: 'Date Of Birth' },
        { key: 'bloodgroup', label: 'Blood Group' },
        { key: 'email', label: 'Email' },
        { key: 'location', label: 'Location' },
        { key: 'contactpersonal', label: 'Contact Personal' },
        { key: 'contactfamily', label: 'Contact Family' },
        { key: 'emergencyno', label: 'Emergency No' },
        { key: 'dot', label: 'DOT' },
        { key: 'doj', label: 'DOJ' },
        { key: 'aadhar', label: 'Aadhar No' },
        { key: 'panno', label: 'Pan No' },
        { key: 'username', label: 'Login Name' },
        { key: 'password', label: 'Password' },
        { key: 'companyname', label: 'Company Name' },
        { key: 'enquirystatus', label: 'Status' },
        { key: 'company', label: 'Company' },
        { key: 'branch', label: 'Branch' },
        { key: 'unit', label: 'Unit' },
        { key: 'floor', label: 'Floor' },
        { key: 'area', label: 'Area' },
        { key: 'department', label: 'Department' },
        { key: 'workmode', label: 'Work Mode' },
        { key: 'team', label: 'Team' },
        { key: 'designation', label: 'Designation' },
        { key: 'shiftgrouping', label: 'Shift Grouping' },
        { key: 'shifttiming', label: 'Shift Timing' },
        { key: 'weekoff', label: 'Week Off' },
        { key: 'reportingto', label: 'Reporting To' },
        { key: 'empcode', label: 'Empcode' },
        { key: 'workstation', label: 'Workstation' },
        { key: 'pdoorno', label: 'Permanent Door/Flat No' },
        { key: 'pstreet', label: 'Permanent Street/Block' },
        { key: 'parea', label: 'Permanent Area/village' },
        { key: 'plandmark', label: 'Permanent Landmark' },
        { key: 'ptaluk', label: 'Permanent Taluk' },
        { key: 'ppost', label: 'Permanent Post' },
        { key: 'ppincode', label: 'Permanent Pincode' },
        { key: 'pcountry', label: 'Permanent Country' },
        { key: 'pstate', label: 'Permanent State' },
        { key: 'pcity', label: 'Permanent City' },
        { key: 'cdoorno', label: 'Current Door/Flat No' },
        { key: 'cstreet', label: 'Current Street/Block' },
        { key: 'carea', label: 'Current Area/village' },
        { key: 'clandmark', label: 'Current Landmark' },
        { key: 'ctaluk', label: 'Current Taluk' },
        { key: 'cpost', label: 'Current Post' },
        { key: 'cpincode', label: 'Current Pincode' },
        { key: 'ccountry', label: 'Current Country' },
        { key: 'cstate', label: 'Current State' },
        { key: 'ccity', label: 'Current City' },
        { key: 'bankname', label: 'Bank Name' },
        { key: 'bankbranchname', label: 'Bank Branch Name' },
        { key: 'accountholdername', label: 'Account Holder Name' },
        { key: 'accountnumber', label: 'Account Number' },
        { key: 'ifsccode', label: 'IFSC Code' },
        { key: 'accounttype', label: 'Account Type' },
        { key: 'profileimage', label: 'Profile' },
    ];

    const tableColumns = [
        { key: 'serialNumber', label: 'SI.No' },
        { key: 'firstname', label: 'First Name' },
        { key: 'lastname', label: 'Last Name' },
        { key: 'legalname', label: 'Legal Name' },
        { key: 'fathername', label: 'Father Name' },
        { key: 'mothername', label: 'Mother Name' },
        { key: 'gender', label: 'Gender' },
        { key: 'maritalstatus', label: 'Marital Status' },
        { key: 'dom', label: 'Date Of Marriage' },
        { key: 'dob', label: 'Date Of Birth' },
        { key: 'bloodgroup', label: 'Blood Group' },
        { key: 'email', label: 'Email' },
        { key: 'location', label: 'Location' },
        { key: 'contactpersonal', label: 'Contact Personal' },
        { key: 'contactfamily', label: 'Contact Family' },
        { key: 'emergencyno', label: 'Emergency No' },
        { key: 'dot', label: 'DOT' },
        { key: 'doj', label: 'DOJ' },
        { key: 'aadhar', label: 'Aadhar No' },
        { key: 'panno', label: 'Pan No' },
        { key: 'username', label: 'Login Name' },
        { key: 'password', label: 'Password' },
        { key: 'companyname', label: 'Company Name' },
        { key: 'enquirystatus', label: 'Status' },
        { key: 'company', label: 'Company' },
        { key: 'branch', label: 'Branch' },
        { key: 'unit', label: 'Unit' },
        { key: 'floor', label: 'Floor' },
        { key: 'area', label: 'Area' },
        { key: 'department', label: 'Department' },
        { key: 'workmode', label: 'Work Mode' },
        { key: 'team', label: 'Team' },
        { key: 'designation', label: 'Designation' },
        { key: 'shiftgrouping', label: 'Shift Grouping' },
        { key: 'shifttiming', label: 'Shift Timing' },
        { key: 'weekoff', label: 'Week Off' },
        { key: 'reportingto', label: 'Reporting To' },
        { key: 'empcode', label: 'Empcode' },
        { key: 'workstation', label: 'Work Station' },
        { key: 'pdoorno', label: 'Permanent Door/Flat No' },
        { key: 'pstreet', label: 'Permanent Street/Block' },
        { key: 'parea', label: 'Permanent Area/village' },
        { key: 'plandmark', label: 'Permanent Landmark' },
        { key: 'ptaluk', label: 'Permanent Taluk' },
        { key: 'ppost', label: 'Permanent Post' },
        { key: 'ppincode', label: 'Permanent Pincode' },
        { key: 'pcountry', label: 'Permanent Country' },
        { key: 'pstate', label: 'Permanent State' },
        { key: 'pcity', label: 'Permanent City' },
        { key: 'cdoorno', label: 'Current Door/Flat No' },
        { key: 'cstreet', label: 'Current Street/Block' },
        { key: 'carea', label: 'Current Area/village' },
        { key: 'clandmark', label: 'Current Landmark' },
        { key: 'ctaluk', label: 'Current Taluk' },
        { key: 'cpost', label: 'Current Post' },
        { key: 'cpincode', label: 'Current Pincode' },
        { key: 'ccountry', label: 'Current Country' },
        { key: 'cstate', label: 'Current State' },
        { key: 'ccity', label: 'Current City' },
        { key: 'bankname', label: 'Bank Name' },
        { key: 'bankbranchname', label: 'Bank Branch Name' },
        { key: 'accountholdername', label: 'Account Holder Name' },
        { key: 'accountnumber', label: 'Account Number' },
        { key: 'ifsccode', label: 'IFSC Code' },
        { key: 'profileimage', label: 'Profile' },
    ];

    const [employeelists, setEmployeelists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

   
    const { auth } = useContext(AuthContext);
    const [employeeCheck, setEmployeecheck] = useState(true);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [checked, setChecked] = useState(true);
    const handleChange = (event) => {

        Object.keys(columnVisibility).forEach((key) => {
            columnVisibility[key] = event.target.checked;
        });
        setChecked(event.target.checked);

    };



    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const handleToggleColumnVisibility = (columnName) => {
        if (columnName === "checkbox") {
            // Special handling for checkbox column
            setSelectedCheckboxes((prevCheckboxes) => {
                return Object.keys(columnVisibility).filter((column) => columnVisibility[column]);
            });
        } else {
            setColumnVisibility({ ...columnVisibility, [columnName]: !columnVisibility[columnName] });

        }
    };



    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Employee Pre-Values List.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };


    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);



    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setEmployeecheck(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };


    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        // checkbox: true,
        firstname: true,
        lastname: true,
        legalname: true,
        fathername: true,
        mothername: true,
        gender: true,
        maritalstatus: true,
        dom: true,
        dob: true,
        bloodgroup: true,
        email: true,
        location: true,
        contactpersonal: true,
        contactfamily: true,
        emergencyno: true,
        dot: true,
        doj: true,
        aadhar: true,
        panno: true,
        username: true,
        password: true,
        companyname: true,
        enquirystatus: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        department: true,
        workmode: true,
        team: true,
        designation: true,
        shiftgrouping: true,
        shifttiming: true,
        weekoff: true,
        reportingto: true,
        empcode: true,
        workstation: true,
        pdoorno: true,
        pstreet: true,
        parea: true,
        plandmark: true,
        ptaluk: true,
        ppost: true,
        ppincode: true,
        pcountry: true,
        pstate: true,
        pcity: true,
        cdoorno: true,
        cstreet: true,
        carea: true,
        clandmark: true,
        ctaluk: true,
        cpost: true,
        cpincode: true,
        ccountry: true,
        cstate: true,
        ccity: true,

        bankname: true,
        bankbranchname: true,
        accountholdername: true,
        accountnumber: true,
        ifsccode: true,
        profileimage: true,
        accounttype: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const filteredColumnsNew = tableColumns.filter(column => columnVisibility[column.key]);

    useEffect(() => {
        const allTrue = Object.values(columnVisibility).every(value => value === true);
        if (allTrue) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [columnVisibility]);

    const [pdfColumns, setPdfColumns] = useState([]);

    let columnData = [
        { title: "Sno", dataKey: "serialNumber" },
        { title: "First Name", dataKey: "firstname" },
        { title: "Last Name", dataKey: "lastname" },
        { title: "Legal Name", dataKey: "legalname" },
        { title: "Father Name", dataKey: "fathername" },
        { title: "Mother Name", dataKey: "mothername" },
        { title: "Gender", dataKey: "gender" },
        { title: "Marital Status", dataKey: "maritalstatus" },
        { title: "Date Of Marriage", dataKey: "dom" },
        { title: "Date Of Birth", dataKey: "dob" },
        { title: "Blood Group", dataKey: "bloodgroup" },
        { title: "Email", dataKey: "email" },
        { title: "Location", dataKey: "location" },
        { title: "Contact Personal", dataKey: "contactpersonal" },
        { title: "Contact Family", dataKey: "contactfamily" },
        { title: "Emergency No", dataKey: "emergencyno" },
        { title: "DOT", dataKey: "dot" },
        { title: "DOJ", dataKey: "doj" },
        { title: "Aadhar No", dataKey: "aadhar" },
        { title: "Pan No", dataKey: "panno" },
        { title: "Login Name", dataKey: "username" },
        { title: "Password", dataKey: "password" },
        { title: "Company Name", dataKey: "companyname" },
        { title: "Status", dataKey: "enquirystatus" },
        { title: "Company", dataKey: "company" },
        { title: "Branch", dataKey: "branch" },
        { title: "Unit", dataKey: "unit" },
        { title: "Floor", dataKey: "floor" },
        { title: "Area", dataKey: "area" },
        { title: "Department", dataKey: "department" },
        { title: "Work Mode", dataKey: "workmode" },
        { title: "Team", dataKey: "team" },
        { title: "Designation", dataKey: "designation" },
        { title: "Shift Grouping", dataKey: "shiftgrouping" },
        { title: "Shift Timing", dataKey: "shifttiming" },
        { title: "Week Off", dataKey: "weekoff" },
        { title: "Reporting To", dataKey: "reportingto" },
        { title: "Empcode", dataKey: "empcode" },
        { title: "Work Station", dataKey: "workstation" },
        { title: "Permanent Door/Flat No", dataKey: "pdoorno" },
        { title: "Permanent Street/Block", dataKey: "pstreet" },
        { title: "Permanent Area/village", dataKey: "parea" },
        { title: "Permanent Landmark", dataKey: "plandmark" },
        { title: "Permanent Taluk", dataKey: "ptaluk" },
        { title: "Permanent Post", dataKey: "ppost" },
        { title: "Permanent Pincode", dataKey: "ppincode" },
        { title: "Permanent Country", dataKey: "pcountry" },
        { title: "Permanent State", dataKey: "pstate" },
        { title: "Permanent City", dataKey: "pcity" },

        { title: "Current Door/Flat No", dataKey: "cdoorno" },
        { title: "Current Street/Block", dataKey: "cstreet" },
        { title: "Current Area/village", dataKey: "carea" },
        { title: "Current Landmark", dataKey: "clandmark" },
        { title: "Current Taluk", dataKey: "ctaluk" },
        { title: "Current Post", dataKey: "cpost" },
        { title: "Current Pincode", dataKey: "cpincode" },
        { title: "Current Country", dataKey: "ccountry" },
        { title: "Current State", dataKey: "cstate" },
        { title: "Current City", dataKey: "ccity" },

        { title: "Bank Name", dataKey: "bankname" },
        { title: "Bank Branch Name", dataKey: "bankbranchname" },
        { title: "Account Holder Name", dataKey: "accountholdername" },
        { title: "Account Number", dataKey: "accountnumber" },
        { title: "IFSC Code", dataKey: "ifsccode" },
        { title: "Account Type", dataKey: "accounttype" },
        { title: 'Profile', dataKey: 'profileimage' },

    ]

    useEffect(() => {
        let filteredDatas = columnData.filter((data) => {
            return columnVisibility[data?.dataKey]
        })
        setPdfColumns(filteredDatas);
    }, [columnVisibility, checked])

    const downloadPdf = async (Exports) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        const maxColumnsPerPage = 10; // Set max columns per page

        const imagesToLoad = [];

        const tableRows = Exports === "filtered" ?
            rowDataTable.map((item, index) => {
                const rowData = pdfColumns.map((col) => {
                    if (col.dataKey === 'profileimage') {
                        return ''; // Placeholder for the image column
                    }
                    return item[col.dataKey] || '';
                });
                if (item.profileimage && item.profileimage !== "undefined") {
                    const base64Image = item.profileimage.startsWith("data:image/") ? item.profileimage : `data:image/png;base64,${item.profileimage}`;
                    imagesToLoad.push({ index, imageBase64: base64Image });
                } else {
                    console.warn(`Missing or invalid profile image for index ${index}. Skipping image.`);
                }
                return rowData;
            }) :
            items.map((item, index) => {
                const rowData = pdfColumns.map((col) => {
                    if (col.dataKey === 'profileimage') {
                        return ''; // Placeholder for the image column
                    }
                    return item[col.dataKey] || '';
                });
                if (item.profileimage && item.profileimage !== "undefined") {
                    const base64Image = item.profileimage.startsWith("data:image/") ? item.profileimage : `data:image/png;base64,${item.profileimage}`;
                    imagesToLoad.push({ index, imageBase64: base64Image });
                } else {
                    console.warn(`Missing or invalid profile image for index ${index}. Skipping image.`);
                }
                return rowData;
            });

        const loadImage = (imageBase64) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (error) => {
                    reject(error);
                };
                img.src = imageBase64;
            });
        };

        const loadedImages = await Promise.all(
            imagesToLoad.map((item) =>
                loadImage(item.imageBase64).then((img) => ({ ...item, img }))
            )
        );

        const totalPages = Math.ceil(pdfColumns.length / maxColumnsPerPage);

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, pdfColumns.length);

            const currentPageColumns = pdfColumns.slice(startIdx, endIdx);
            const currentPageColumnTitles = currentPageColumns.map(col => col.title);

            doc.autoTable({
                head: [currentPageColumnTitles],
                body: tableRows.map(row => row.slice(startIdx, endIdx)),
                startY: currentPage === 1 ? 20 : 10,
                didDrawCell: (data) => {
                    if (data.section === 'body' && currentPageColumns[data.column.index].dataKey === 'profileimage') {
                        const imageInfo = loadedImages.find((image) => image.index === data.row.index);
                        if (imageInfo) {
                            const imageHeight = 20;
                            const imageWidth = 20;
                            const xOffset = (data.cell.width - imageWidth) / 2;
                            const yOffset = (data.cell.height - imageHeight) / 2;

                            doc.addImage(
                                imageInfo.img,
                                'PNG',
                                data.cell.x + xOffset,
                                data.cell.y + yOffset,
                                imageWidth,
                                imageHeight
                            );

                            data.cell.height = 20;
                        }
                    }
                },
                headStyles: {
                    minCellHeight: 5,
                    fontSize: 4,
                    cellPadding: { top: 2, right: 5, bottom: 2, left: 0 },
                },
                bodyStyles: {
                    fontSize: 4,
                    minCellHeight: 20,
                    cellPadding: { top: 7, right: 1, bottom: 0, left: 1 },
                },
            });

            if (currentPage < totalPages) {
                doc.addPage();
            }
        }
        setIsPdfFilterOpen(false);
        setIsLoading(false)
        doc.save('Employee Pre-Values List.pdf');
    };

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    // Excel
    const fileName = "Employee Pre-Values List";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Employee Pre-Values List',
        pageStyle: 'print'
    });


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = employeelists?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            bankname: item?.bankdetails?.map((t, i) => t?.bankname)
                ?.join(",")
                .toString(),
            bankbranchname: item?.bankdetails?.map((t, i) => t?.bankbranchname)
                ?.join(",")
                .toString(),
            accountholdername: item?.bankdetails?.map((t, i) => t?.accountholdername)
                ?.join(",")
                .toString(),
            accountnumber: item?.bankdetails?.map((t, i) => t?.accountnumber)
                ?.join(",")
                .toString(),
            ifsccode: item?.bankdetails?.map((t, i) => t?.ifsccode)
                ?.join(",")
                .toString(),
            accounttype: item?.bankdetails?.map((t, i) => t?.accounttype)
                ?.join(",")
                .toString(),
        }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [employeelists])


    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);

    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };



    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];



    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }




    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },

        { field: "firstname", headerName: "First Name", flex: 0, width: 100, hide: !columnVisibility.firstname, headerClassName: "bold-header" },
        { field: "lastname", headerName: "Last Name", flex: 0, width: 100, hide: !columnVisibility.lastname, headerClassName: "bold-header" },
        { field: "legalname", headerName: "Legal Name", flex: 0, width: 100, hide: !columnVisibility.legalname, headerClassName: "bold-header" },
        { field: "fathername", headerName: "Father Name", flex: 0, width: 100, hide: !columnVisibility.fathername, headerClassName: "bold-header" },
        { field: "mothername", headerName: "Mother Name", flex: 0, width: 100, hide: !columnVisibility.mothername, headerClassName: "bold-header" },
        { field: "gender", headerName: "Gender", flex: 0, width: 100, hide: !columnVisibility.gender, headerClassName: "bold-header" },
        { field: "maritalstatus", headerName: "Marital Status", flex: 0, width: 100, hide: !columnVisibility.maritalstatus, headerClassName: "bold-header" },
        { field: "dom", headerName: "Date Of Marriage", flex: 0, width: 100, hide: !columnVisibility.dom, headerClassName: "bold-header" },
        { field: "dob", headerName: "Date Of Birth", flex: 0, width: 100, hide: !columnVisibility.dob, headerClassName: "bold-header" },
        { field: "bloodgroup", headerName: "Blood Group", flex: 0, width: 100, hide: !columnVisibility.bloodgroup, headerClassName: "bold-header" },
        { field: "email", headerName: "Email", flex: 0, width: 100, hide: !columnVisibility.email, headerClassName: "bold-header" },
        { field: "location", headerName: "Location", flex: 0, width: 100, hide: !columnVisibility.location, headerClassName: "bold-header" },
        { field: "contactpersonal", headerName: "Contact Personal", flex: 0, width: 100, hide: !columnVisibility.contactpersonal, headerClassName: "bold-header" },
        { field: "contactfamily", headerName: "Contact Family", flex: 0, width: 100, hide: !columnVisibility.contactfamily, headerClassName: "bold-header" },
        { field: "emergencyno", headerName: "Emergency No", flex: 0, width: 100, hide: !columnVisibility.emergencyno, headerClassName: "bold-header" },
        { field: "dot", headerName: "DOT", flex: 0, width: 100, hide: !columnVisibility.dot, headerClassName: "bold-header" },
        { field: "doj", headerName: "DOJ", flex: 0, width: 100, hide: !columnVisibility.doj, headerClassName: "bold-header" },
        { field: "aadhar", headerName: "Aadhar No", flex: 0, width: 100, hide: !columnVisibility.aadhar, headerClassName: "bold-header" },
        { field: "panno", headerName: "Pan No", flex: 0, width: 100, hide: !columnVisibility.panno, headerClassName: "bold-header" },
        { field: "username", headerName: "Login Name", flex: 0, width: 100, hide: !columnVisibility.username, headerClassName: "bold-header" },
        { field: "password", headerName: "Password", flex: 0, width: 100, hide: !columnVisibility.password, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Company Name", flex: 0, width: 100, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "enquirystatus", headerName: "Status", flex: 0, width: 100, hide: !columnVisibility.enquirystatus, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "floor", headerName: "Floor", flex: 0, width: 100, hide: !columnVisibility.floor, headerClassName: "bold-header" },
        { field: "area", headerName: "Area", flex: 0, width: 100, hide: !columnVisibility.area, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 100, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "workmode", headerName: "Work Mode", flex: 0, width: 100, hide: !columnVisibility.workmode, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 100, hide: !columnVisibility.designation, headerClassName: "bold-header" },
        { field: "shiftgrouping", headerName: "Shift Grouping", flex: 0, width: 100, hide: !columnVisibility.shiftgrouping, headerClassName: "bold-header" },
        { field: "shifttiming", headerName: "Shift Timing", flex: 0, width: 100, hide: !columnVisibility.shifttiming, headerClassName: "bold-header" },
        { field: "weekoff", headerName: "Week Off", flex: 0, width: 100, hide: !columnVisibility.weekoff, headerClassName: "bold-header" },
        { field: "reportingto", headerName: "Reporting To", flex: 0, width: 100, hide: !columnVisibility.reportingto, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Empcode", flex: 0, width: 100, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "workstation", headerName: "Work Station", flex: 0, width: 100, hide: !columnVisibility.workstation, headerClassName: "bold-header" },
        { field: "pdoorno", headerName: "Permanent Door/Flat No ", flex: 0, width: 100, hide: !columnVisibility.pdoorno, headerClassName: "bold-header" },
        { field: "pstreet", headerName: "Permanent Street/Block ", flex: 0, width: 100, hide: !columnVisibility.pstreet, headerClassName: "bold-header" },
        { field: "parea", headerName: "Permanent Area/village ", flex: 0, width: 100, hide: !columnVisibility.parea, headerClassName: "bold-header" },
        { field: "plandmark", headerName: "Permanent Landmark ", flex: 0, width: 100, hide: !columnVisibility.plandmark, headerClassName: "bold-header" },
        { field: "ptaluk", headerName: "Permanent Taluk ", flex: 0, width: 100, hide: !columnVisibility.ptaluk, headerClassName: "bold-header" },
        { field: "ppost", headerName: "Permanent Post ", flex: 0, width: 100, hide: !columnVisibility.ppost, headerClassName: "bold-header" },
        { field: "ppincode", headerName: "Permanent Pincode ", flex: 0, width: 100, hide: !columnVisibility.ppincode, headerClassName: "bold-header" },
        { field: "pcountry", headerName: "Permanent Country ", flex: 0, width: 100, hide: !columnVisibility.pcountry, headerClassName: "bold-header" },
        { field: "pstate", headerName: "Permanent State ", flex: 0, width: 100, hide: !columnVisibility.pstate, headerClassName: "bold-header" },
        { field: "pcity", headerName: "Permanent City ", flex: 0, width: 100, hide: !columnVisibility.pcity, headerClassName: "bold-header" },

        { field: "cdoorno", headerName: "Current Door/Flat No ", flex: 0, width: 100, hide: !columnVisibility.cdoorno, headerClassName: "bold-header" },
        { field: "cstreet", headerName: "Current Street/Block ", flex: 0, width: 100, hide: !columnVisibility.cstreet, headerClassName: "bold-header" },
        { field: "carea", headerName: "Current Area/village ", flex: 0, width: 100, hide: !columnVisibility.carea, headerClassName: "bold-header" },
        { field: "clandmark", headerName: "Current Landmark ", flex: 0, width: 100, hide: !columnVisibility.clandmark, headerClassName: "bold-header" },
        { field: "ctaluk", headerName: "Current Taluk ", flex: 0, width: 100, hide: !columnVisibility.ctaluk, headerClassName: "bold-header" },
        { field: "cpost", headerName: "Current Post ", flex: 0, width: 100, hide: !columnVisibility.cpost, headerClassName: "bold-header" },
        { field: "cpincode", headerName: "Current Pincode ", flex: 0, width: 100, hide: !columnVisibility.cpincode, headerClassName: "bold-header" },
        { field: "ccountry", headerName: "Current Country ", flex: 0, width: 100, hide: !columnVisibility.ccountry, headerClassName: "bold-header" },
        { field: "cstate", headerName: "Current State ", flex: 0, width: 100, hide: !columnVisibility.cstate, headerClassName: "bold-header" },
        { field: "ccity", headerName: "Current City ", flex: 0, width: 100, hide: !columnVisibility.ccity, headerClassName: "bold-header" },

        { field: "bankname", headerName: "Bank Name ", flex: 0, width: 100, hide: !columnVisibility.bankname, headerClassName: "bold-header" },
        { field: "bankbranchname", headerName: "Bank Branch Name ", flex: 0, width: 100, hide: !columnVisibility.bankbranchname, headerClassName: "bold-header" },
        { field: "accountholdername", headerName: "Account Holder Name ", flex: 0, width: 100, hide: !columnVisibility.accountholdername, headerClassName: "bold-header" },
        { field: "accountnumber", headerName: "Account Number", flex: 0, width: 100, hide: !columnVisibility.accountnumber, headerClassName: "bold-header" },
        { field: "ifsccode", headerName: "IFSC Code", flex: 0, width: 100, hide: !columnVisibility.ifsccode, headerClassName: "bold-header" },
        { field: "accounttype", headerName: "Account Type", flex: 0, width: 100, hide: !columnVisibility.accounttype, headerClassName: "bold-header" },
        {
            field: "profileimage",
            headerName: "Profile",
            flex: 0,
            width: 100,
            hide: !columnVisibility.profileimage,
            headerClassName: "bold-header",
            renderCell: (params) => {
                // Define how you want to render the cell here
                // Example: return an image

                return (
                    params.value !== "" ?
                        <img
                            src={params.value}
                            alt="Profile"
                            style={{ width: '100%', height: 'auto' }}
                        /> : <></>
                );
            }
        },


    ]

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            firstname: item.firstname,
            lastname: item.lastname,
            legalname: item.legalname,
            fathername: item.fathername,
            mothername: item.mothername,
            gender: item.gender,
            maritalstatus: item.maritalstatus,
            dom: item.dom ,
            dob: item.dob ,
            bloodgroup: item.bloodgroup,
            email: item.email,
            location: item.location,
            contactpersonal: item.contactpersonal,
            contactfamily: item.contactfamily,
            emergencyno: item.emergencyno,
            dot: item.dot ,
            doj: item.doj ,
            aadhar: item.aadhar,
            panno: item.panno,
            username: item.username,
            password: item.password,
            companyname: item.companyname,
            enquirystatus: item.enquirystatus,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            department: item.department,
            workmode: item.workmode,
            team: item.team,
            designation: item.designation,
            shiftgrouping: item.shiftgrouping ,
            shifttiming: item.shifttiming ,
            weekoff: item.weekoff,
            reportingto: item.reportingto,
            empcode: item.empcode,
            workstation: item.workstation,
            pdoorno: item.pdoorno,
            pstreet: item.pstreet,
            parea: item.parea,
            plandmark: item.plandmark,
            ptaluk: item.ptaluk,
            ppost: item.ppost,
            ppincode: item.ppincode,
            pcountry: item.pcountry,
            pstate: item.pstate,
            pcity: item.pcity,
            profileimage: item?.profileimage,

            cdoorno: item.cdoorno,
            cstreet: item.cstreet,
            carea: item.carea,
            clandmark: item.clandmark,
            ctaluk: item.ctaluk,
            cpost: item.cpost,
            cpincode: item.cpincode,
            ccountry: item.ccountry,
            cstate: item.cstate,
            ccity: item.ccity,
            bankname: item.bankname,
            bankbranchname: item.bankbranchname,
            accountholdername: item.accountholdername,
            accountnumber: item.accountnumber,
            ifsccode: item.ifsccode,
            accounttype: item.accounttype
        }
    });


    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));


    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {

        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));

    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}

                        >
                            Hide All
                        </Button>

                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    return (
        <Box>
            <Headtitle title={'Employee Pre-Values List'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Employee Pre-Values List</Typography>
            {isUserRoleCompare?.includes("aemployeeprevalueslist")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2} sx={{ display: 'flex' }}>
                                    <Grid item xs={10}>
                                        <Typography sx={userStyle.importheadtext}>Manage Employee Pre-Values List</Typography>
                                    </Grid>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={handleChange}
                                                name="myCheckbox"
                                                color="primary"
                                                size="small"
                                                indeterminate={checked === undefined}
                                            />
                                        }
                                        label="Select All"
                                    />
                                </Grid><br />
                                <Grid container spacing={2}>
                                    {/* Checkbox Grid */}
                                    {columnDataTable.map((column) => (
                                        <Grid key={column.field} item md={2}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={columnVisibility[column.field] || (column.field === 'checkbox' && selectedCheckboxes.length > 0)}
                                                        onChange={() => handleToggleColumnVisibility(column.field)}
                                                    />}
                                                    label={column.headerName
                                                        .split(' ')
                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                                                        .join(' ')} // Join the capitalized words with a space
                                                />
                                            </FormGroup>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        </Box>
                        <br />
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2} sx={{ display: 'flex' }}>
                                    <Grid item xs={10}>
                                        <Typography sx={userStyle.importheadtext}>Manage Employee Pre-Values List</Typography>
                                    </Grid>

                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsCompany}
                                                onChange={(e) => {
                                                    handleCompanyChangeValue(e);
                                                    
                                                    setParticipantsOption([]);
                                                    setSelectedOptionsCate([]);
                                                }}
                                                valueRenderer={customValueRendererCompany}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.filter((comp) => {
                                                        let datas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        return datas?.includes(comp.company);
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsBranch}
                                                onChange={(e) => {
                                                    handleBranchChangeValue(e);
                                                    setParticipantsOption([]);
                                                    setSelectedOptionsCate([]);
                                                }}
                                                valueRenderer={customValueRendererBranch}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.filter((comp) => {
                                                        let compdatas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        let branchdatas = selectedOptionsBranch?.map(
                                                            (item) => item?.value
                                                        );
                                                        return (
                                                            compdatas?.includes(comp.company) &&
                                                            branchdatas?.includes(comp.branch)
                                                        );
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsUnit}
                                                onChange={(e) => {
                                                    handleUnitChangeValue(e);
                                                    setParticipantsOption([]);
                                                    setSelectedOptionsCate([]);
                                                }}
                                                valueRenderer={customValueRendererUnit}
                                                labelledBy="Please Select Unit"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>
                                            <MultiSelect
                                                options={allTeam
                                                    ?.filter((comp) => {
                                                        let compdatas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        let branchdatas = selectedOptionsBranch?.map(
                                                            (item) => item?.value
                                                        );
                                                        let unitdatas = selectedOptionsUnit?.map(
                                                            (item) => item?.value
                                                        );
                                                        return (
                                                            compdatas?.includes(comp.company) &&
                                                            branchdatas?.includes(comp.branch) &&
                                                            unitdatas?.includes(comp.unit)
                                                        );
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.teamname,
                                                        value: data.teamname,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsTeam}
                                                onChange={(e) => {
                                                    handleTeamChangeValue(e);
                                                    setSelectedOptionsCate([]);
                                                }}
                                                valueRenderer={customValueRendererTeam}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee
                                            </Typography>
                                            <MultiSelect
                                                options={participantsOption}
                                                value={selectedOptionsCate}
                                                onChange={(e) => {
                                                    handleCategoryChange(e);
                                                }}
                                                valueRenderer={customValueRendererCate}
                                                labelledBy="Please Select Employees"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <br />
                                <Grid container>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
                                        >
                                            {" "}
                                            Filter{" "}
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            {" "}
                                            Clear{" "}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </>
                )}

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lemployeeprevalueslist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Employee Pre-Values List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>

                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelemployeeprevalueslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                                // fetchEmployeeSystemArray()
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeeprevalueslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchEmployeeSystemArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeeprevalueslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeeprevalueslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    // fetchEmployeeSystemArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeeprevalueslist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!employeeCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots
                                        height="80"
                                        width="80"
                                        radius="9"
                                        color="#1976d2"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName=""
                                        visible={true}
                                    />
                                </Box>
                            </>
                            :
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        ref={gridRef}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                        rowHeight={150}
                                    />


                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>}
                    </Box>
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>


            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            {/* print layout */}
            <TableContainer component={Paper} ref={componentRef} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            {filteredColumnsNew.map((column) => (
                                <TableCell key={column.key}>{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    {filteredColumnsNew.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.key === 'serialNumber' ? index + 1 :
                                                column.key === 'profileimage' ?
                                                    row[column.key] !== "" ? <img src={row[column.key]} alt="Profile" style={{ width: '50px', height: '50px' }} /> : <></> :
                                                    row[column.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={() => {
                            const exportData = rowDataTable?.map((t, index) => {
                                const row = {};
                                exportFields.forEach(field => {
                                    if (columnVisibility[field.key]) {
                                        row[field.label] = field.generate ? field.generate(t, index) : t[field.key];
                                    }
                                });
                                return row;
                            });

                            ExportXLWithImages({
                                csvData: exportData,
                                fileName: fileName,
                                columnVisibility: columnVisibility,
                                exportFields: exportFields,
                                setIsFilterOpen: setIsFilterOpen,
                                setIsLoading: setIsLoading,
                                fileFormat: fileFormat
                            });
                        }}
                    >
                        Export Filtered Data
                    </Button>

                    <Button autoFocus variant="contained"
                    onClick={() => {
                        const exportData = items?.map((t, index) => {
                            const row = {};
                            exportFields.forEach(field => {
                                if (columnVisibility[field.key]) {
                                    row[field.label] = field.generate ? field.generate(t, index) : t[field.key];
                                }
                            });
                            return row;
                        });

                        ExportXLWithImages({
                            csvData: exportData,
                            fileName: fileName,
                            columnVisibility: columnVisibility,
                            exportFields: exportFields,
                            setIsFilterOpen: setIsFilterOpen,
                            setIsLoading: setIsLoading,
                            fileFormat: fileFormat
                        });
                        setIsLoading(true)
                    }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsLoading(true)
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <LoadingBackdrop open={isLoading} />
        </Box >
    );
}


export default EmployeePrevaluesList;