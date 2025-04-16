import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Backdrop, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PageHeading from "../../components/PageHeading";


const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};
function VerifiedList() {



    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [isFilterOpenCrt, setIsFilterOpenCrt] = useState(false);
    const [isPdfFilterOpenCrt, setIsPdfFilterOpenCrt] = useState(false);
    // page refersh reload
    const handleCloseFilterModCrt = () => {
        setIsFilterOpenCrt(false);
    };
    const handleClosePdfFilterModCrt = () => {
        setIsPdfFilterOpenCrt(false);
    };
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    }
    const [employees, setEmployees] = useState([]);
    const [employeesCrt, setEmployeesCrt] = useState([]);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [loadingCrt, setLoadingCrt] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingdots, setLoadingDots] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const [tableStatus, setTableStatus] = useState("")
    setTimeout(() => {
        setIsUpdateOpen(false)
        setCorrect(false)
    }, 2500)
    const [isCorrect, setCorrect] = useState(false)
    const [allInformation, setAllInformation] = useState({})
    const [employeecodenew, setEmployeecodenew] = useState("");
    const [profileImg, setProfileImg] = useState('');
    const [croppedImage, setCroppedImage] = useState("");
    const [third, setThird] = useState("");
    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [name, setUserNameEmail] = useState("");
    const [errmsg, setErrmsg] = useState("");
    const [files, setFiles] = useState([]);
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    let sno = 1;
    let snowv = 1;
    const [eduTodo, setEduTodo] = useState([]);
    let eduno = 1;
    const [addAddQuaTodo, setAddQuaTodo] = useState("");
    let skno = 1;
    const [workhistTodo, setWorkhistTodo] = useState("");
    useEffect(() => {
        ShowErrMess();
        // fetchUserName();
        setThird(first + second.slice(0, 1));
        setUserNameEmail(first + second.slice(0, 1));
    }, [first, second, name]);
    //ERROR MESSAGESE
    const ShowErrMess = () => {
        if (first.length == "" || second.length == 0) {
            setErrmsg("Unavailable");
        } else if (third.length >= 1) {
            setErrmsg("Available");
        }
    };
    //Edit Popups
    const [referenceTodo, setReferenceTodo] = useState([]);
    const [documentID, setDocumentID] = useState("");
    const id = useParams().id;
    const { id: newId } = useParams();
    let today = new Date();
    //Datatable
    const [page, setPage] = useState(1);
    const [pageCrt, setPageCrt] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageSizeCrt, setPageSizeCrt] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryCrt, setSearchQueryCrt] = useState("");
    //Datatable Info
    const { auth, setAuth } = useContext(AuthContext);
    const [companyOption, setCompanyOption] = useState([]);
    const [companyValueAdd, setCompanyValueAdd] = useState([]);
    let [valueCompanyAdd, setValueCompanyAdd] = useState("");
    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAdd(options);
        fetchBranch(options);
        setBranchOption([]);
        setBranchValueAdd([]);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setEmployeeOption([]);
        setTeamValueAdd([]);
        setEmployeeValueAdd([]);
    }
    // Fetching Companies
    const fetchCompanies = async () => {
        setPageName(!pageName)
        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOption(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong11!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    useEffect(() => {
        fetchCompanies();
    }, [])
    const [branchOption, setBranchOption] = useState([]);
    const [branchValueAdd, setBranchValueAdd] = useState([]);
    let [valueBranchAdd, setValueBranchAdd] = useState("");
    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAdd(options);
        fetchUnits(options);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeValueAdd([]);
    };
    //Fetching Branches
    const fetchBranch = async (company) => {
        setPageName(!pageName)
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branch?.data?.branch.map((t) => {
                company.forEach((d) => {
                    if (d.value == t.company) {
                        arr.push(t.name);
                    }
                });
            });
            setBranchOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong10!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const [unitOption, setUnitOption] = useState([]);
    const [unitValueAdd, setUnitValueAdd] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("");
    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAdd(options);
        fetchTeams(options);
    }
    //Fetching Units
    const fetchUnits = async (branch) => {
        setPageName(!pageName)
        try {
            let res_branchunit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branchunit?.data?.units.map((t) => {
                branch.forEach((d) => {
                    if (d.value == t.branch) {
                        arr.push(t.name);
                    }
                });
            });
            setUnitOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong9!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    const [teamOption, setTeamOption] = useState([]);
    const [teamValueAdd, setTeamValueAdd] = useState([]);
    let [valueTeamAdd, setValueTeamAdd] = useState("");
    const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect
    const handleTeamChangeAdd = (options) => {
        setValueTeamAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setTeamValueAdd(options);
        fetchEmployee(options)
    }
    //Fetching Teams
    const fetchTeams = async (unit) => {
        setPageName(!pageName)
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_team?.data?.teamsdetails?.map((t) => {
                unit.forEach((d) => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname);
                    }
                });
            });
            setTeamOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong8!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    // const [empcodeValueAdd, setEmpcodeValueAdd] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [employeeValueAdd, setEmployeeValueAdd] = useState([]);
    let [valueEmployeeAdd, setValueEmployeeAdd] = useState("");
    const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAdd = (options) => {
        setValueEmployeeAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAdd(options);
    }
    //Fetching allInformation
    const fetchEmployee = async (team) => {
        let teamsnew = team.map((item) => item.value);
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = res_employee?.data?.users.filter((t) => {
                return teamsnew.includes(t.team)
            });
            setEmployeeOption(
                arr.map((t) => ({
                    label: t.companyname,
                    value: t.companyname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong7!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    const handleFilter = async () => {
        const accessbranch = isAssignBranch
            ? isAssignBranch.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }))
            : [];
        setLoadingDots(true)
        setPageName(!pageName)
        try {
            let res = await axios.post(`${SERVICE.MYFIELDVERIFICATIONASSIGNBRANCH}`, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let myverification = res?.data?.myverification;

            let result = await axios.post(SERVICE.USERASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })


            let users = result.data.users;
            let filterArray = [];
            myverification?.forEach(verifyUser => {
                // Verify if employeename is a string and not an array
                if (typeof verifyUser.employeename === 'string') {
                    users?.forEach(user => {
                        if (user.companyname === verifyUser.employeename) {
                            let extendedUser = {
                                // ...user,
                                id: user?._id,
                                templateId: verifyUser?._id,
                                verified: verifyUser?.verifiedInfo,
                                updatedstatus: verifyUser?.updatestatus,
                                company: user?.company,
                                branch: user?.branch,
                                unit: user?.unit,
                                team: user?.team,
                                employeename: user?.companyname,
                                filename: verifyUser?.filename,
                                information: verifyUser?.informationstring,
                                verifyInfo: verifyUser?.verifiedInfo,
                            };
                            filterArray.push(extendedUser);
                        }
                    });
                }
            });


            // let needToVerify = filterArray.filter(data =>
            //     isUserRoleAccess.companyname === data.employeename
            // )
            const transformArray = (array) => {
                let result = [];
                array?.forEach((obj) => {
                    obj.verifyInfo?.forEach((info, index) => {
                        if (info.edited) {
                            // Create a new object for each information value
                            const newObject = {
                                ...obj,
                                information: info.name,
                                updateedited: obj?.updatedstatus?.find(data => data.name === info.name)?.edited,
                                updatecorrected: obj?.updatedstatus?.find(data => data.name === info.name)?.corrected,
                                verificationverified: obj?.updatedstatus?.find(data => data.name === info.name)?.verificationverified === undefined ? false :
                                    obj?.updatedstatus?.find(data => data.name === info.name)?.verificationverified,
                                // Assign a single value from the information array
                            };
                            result.push(newObject);
                        }
                    })
                });
                return result;
            };
            const transformedArray = transformArray(filterArray);
            const generateNewIds = async (array) => {
                return array.map(item => {
                    return {
                        ...item,
                        commonid: uuidv4() // Generate a new UUID for each object
                    };
                });
            };
            const arrayWithNewIds = await generateNewIds(transformedArray);
            setEmployees(arrayWithNewIds);
            setLoadingDots(false)
        }
        catch (err) {
            setemployeedetail(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong6!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    useEffect(() => {
        handleFilter();
    }, [])
    const validateFilter = () => {
        let compdatas = companyValueAdd?.map((item) => item.value);
        if (compdatas?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            handleFilterCrt();
        }
    }
    const handleFilterCrt = async () => {
        setLoadingCrt(true)
        let compdatas = companyValueAdd?.map((item) => item.value);
        let branchdatas = branchValueAdd?.map((item) => item.value);
        let unitdatas = unitValueAdd?.map((item) => item.value);
        let teamdatas = teamValueAdd?.map((item) => item.value);
        let employeedatas = employeeValueAdd?.map((item) => item.value);
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MYFIELDVERIFICATION}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let myverification = res?.data?.myverification;
            let result = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let users = result.data.users;
            let filterUser = users.filter((item) => {
                // Case 1: compdatas have values
                if (compdatas.length > 0 && branchdatas.length === 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company);
                }
                // Case 2: compdatas and branchdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch);
                }
                // Case 3: compdatas, branchdatas, and unitdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit);
                }
                // Case 4: compdatas, branchdatas, unitdatas, and teamdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team);
                }
                // Case 5: All arrays have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length > 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team) && employeedatas.includes(item.companyname);
                }
                // Default: No match
                else {
                    return false;
                }
            })
            let filterArray = [];
            myverification?.forEach(verifyUser => {
                // Verify if employeename is a string and not an array
                if (typeof verifyUser.employeename === 'string') {
                    filterUser?.forEach(user => {
                        if (user.companyname === verifyUser.employeename) {
                            let extendedUser = {
                                // ...user,
                                id: user?._id,
                                templateId: verifyUser?._id,
                                verified: verifyUser?.verifiedInfo,
                                company: user?.company,
                                branch: user?.branch,
                                unit: user?.unit,
                                team: user?.team,
                                employeename: user?.companyname,
                                filename: verifyUser?.filename,
                                information: verifyUser?.informationstring,
                                verifyInfo: verifyUser?.verifiedInfo
                            };
                            filterArray.push(extendedUser);
                        }
                    });
                }
            });

            // let needToVerify = filterArray.filter(data =>
            //     isUserRoleAccess.companyname === data.employeename
            // )
            const transformArrayCrt = (array) => {
                let result = [];
                array?.forEach((obj) => {
                    obj.verifyInfo?.forEach((info) => {
                        if (info.corrected) {
                            // Create a new object for each information value
                            const newObject = {
                                ...obj,
                                information: info.name // Assign a single value from the information array
                            };
                            result.push(newObject);
                        }
                    })
                });
                return result;
            };
            const transformedArrayCrt = transformArrayCrt(filterArray);
            const generateNewIds = async (array) => {
                return array.map(item => {
                    return {
                        ...item,
                        commonid: uuidv4() // Generate a new UUID for each object
                    };
                });
            };
            const arrayWithNewIdsCrt = await generateNewIds(transformedArrayCrt);
            setEmployeesCrt(arrayWithNewIdsCrt)
            setLoadingCrt(false)
        }
        catch (err) {
            setLoadingCrt(false)
            setemployeedetail(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong5!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    const handleClearCrt = (e) => {
        e.preventDefault();
        setCompanyValueAdd([]);
        setBranchValueAdd([]);
        setUnitValueAdd([]);
        setTeamValueAdd([]);
        setEmployeeValueAdd([]);
        setBranchOption([]);
        setUnitOption([]);
        setTeamOption([]);
        setEmployeeOption([]);
        setEmployeesCrt([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    const [isemployeedetail, setemployeedetail] = useState(false);
    let username = isUserRoleAccess.username;
    const gridRef = useRef(null);
    const gridRefCrt = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsCrt, setSelectedRowsCrt] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQueryManageCrt, setSearchQueryManageCrt] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [copiedDataCrt, setCopiedDataCrt] = useState("");
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "MyVerificationVerified.png");
                });
            });
        }
    };
    const handleCaptureImageCrt = () => {
        if (gridRefCrt.current) {
            html2canvas(gridRefCrt.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "MyVerificationCorrected.png");
                });
            });
        }
    };
    const [fileFormat, setFormat] = useState("");
    let exportColumnNamescrt = ["Company", "Branch", "Unit", "Team", "EmployeeName", "Information"];
    let exportRowValuescrt = ["company", "branch", "unit", "team", "employeename", "information"];
    let exportColumnNames = ["Company", "Branch", "Unit", "Team", "EmployeeName", "Information"];
    let exportRowValues = ["company", "branch", "unit", "team", "employeename", "information"];
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const handleSelectionChangeCrt = (newSelection) => {
        setSelectedRowsCrt(newSelection.selectionModel);
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isManageColumnsOpenCrt, setManageColumnsOpenCrt] = useState(false);
    const [anchorElCrt, setAnchorElCrt] = useState(null);
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleOpenManageColumnsCrt = (event) => {
        setAnchorElCrt(event.currentTarget);
        setManageColumnsOpenCrt(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    const handleCloseManageColumnsCrt = () => {
        setManageColumnsOpenCrt(false);
        setSearchQueryManageCrt("");
    };
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const getRowClassNameCrt = (params) => {
        if (selectedRowsCrt.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: " bold !important ",
        },
        "& .custom-id-row": {
            backgroundColor: "#1976d22b !important",
        },
        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
        "&:hover": {
            "& .custom-ago-row:hover": {
                backgroundColor: "#ff00004a !important",
            },
            "& .custom-in-row:hover": {
                backgroundColor: "#ffff0061 !important",
            },
            "& .custom-others-row:hover": {
                backgroundColor: "#0080005e !important",
            },
        },
    }));
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        filename: true,
        information: true,
        actions: true,
    };
    // Show All Columns & Manage Columns
    const initialColumnVisibilityCrt = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        filename: true,
        information: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [columnVisibilityCrt, setColumnVisibilityCrt] = useState(initialColumnVisibilityCrt);
    const { v4: uuidv4 } = require('uuid');
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    //Boardingupadate updateby edit page...
    let updateby = username.updatedby;
    //print...
    const componentRef = useRef();
    const componentRefCrt = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "MyVerification",
        pageStyle: "print",
    });
    const handleprintCrt = useReactToPrint({
        content: () => componentRefCrt.current,
        documentTitle: "MyVerification",
        pageStyle: "print",
    });
    //table entries ..,.
    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
    }, [employees]);
    const [itemsCrt, setItemsCrt] = useState([]);
    const addSerialNumberCrt = () => {
        const itemsWithSerialNumber = employeesCrt?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsCrt(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumberCrt();
    }, [employeesCrt]);
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const handlePageChangeCrt = (newPage) => {
        setPageCrt(newPage);
        setSelectedRowsCrt([]);
        setSelectAllCheckedCrt(false);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    const handlePageSizeChangeCrt = (event) => {
        setPageSizeCrt(Number(event.target.value));
        setSelectedRowsCrt([]);
        setSelectAllCheckedCrt(false);
        setPageCrt(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSearchChangeCrt = (event) => {
        setSearchQueryCrt(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchTermsCrt = searchQueryCrt.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredDatasCrt = itemsCrt?.filter((item) => {
        return searchTermsCrt.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const filteredDataCrt = filteredDatasCrt?.slice((pageCrt - 1) * pageSizeCrt, pageCrt * pageSizeCrt);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const totalPagesCrt = Math.ceil(filteredDatasCrt?.length / pageSizeCrt);
    const visiblePages = Math.min(totalPages, 3);
    const visiblePagesCrt = Math.min(totalPagesCrt, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const firstVisiblePageCrt = Math.max(1, pageCrt - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const lastVisiblePageCrt = Math.min(firstVisiblePageCrt + visiblePagesCrt - 1, totalPagesCrt);
    const pageNumbers = [];
    const pageNumbersCrt = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    for (let i = firstVisiblePageCrt; i <= lastVisiblePageCrt; i++) {
        pageNumbersCrt.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectAllCheckedCrt, setSelectAllCheckedCrt] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const CheckboxHeaderCrt = ({ selectAllCheckedCrt, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedCrt} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable?.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows?.length === filteredData?.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "company", headerName: "Company", flex: 0, width: 140, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 160, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "information", headerName: "Information", flex: 0, width: 180, hide: !columnVisibility.information, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 180,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex", gap: "10px" }}>
                    {isUserRoleCompare?.includes("emyverification") && (
                        <>

                            <Button
                                variant="contained"
                                sx={{ backgroundColor: params.row.verificationverified ? "green" : "secondary" }}
                                onClick={() => {
                                    handleClickOpenVerify(params.row.information, params.row.empid, params.row);
                                    setTableStatus("Table2");
                                    setLoading(true);
                                    setLoadingMessage("Updating...");
                                }}
                            >
                                {params.row.verificationverified ? "Verified" : "Verified View"}
                            </Button>
                        </>

                    )
                    }

                    {/* ) : (
                                <Button variant="contained">
                                    Updated
                                </Button>
                            )} */}



                </Grid >
            ),
        },
    ];
    const columnDataTableCrt = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeaderCrt
                    selectAllCheckedCrt={selectAllCheckedCrt}
                    onSelectAll={() => {
                        if (rowDataTableCrt?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllCheckedCrt) {
                            setSelectedRowsCrt([]);
                        } else {
                            const allRowIds = rowDataTableCrt?.map((row) => row.id);
                            setSelectedRowsCrt(allRowIds);
                        }
                        setSelectAllCheckedCrt(!selectAllCheckedCrt);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsCrt.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsCrt.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsCrt.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRowsCrt, params.row.id];
                        }
                        setSelectedRowsCrt(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedCrt(updatedSelectedRows?.length === filteredDataCrt?.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibilityCrt.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibilityCrt.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "company", headerName: "Company", flex: 0, width: 140, hide: !columnVisibilityCrt.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 160, hide: !columnVisibilityCrt.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityCrt.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilityCrt.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibilityCrt.employeename, headerClassName: "bold-header" },
        { field: "information", headerName: "Information", flex: 0, width: 180, hide: !columnVisibilityCrt.information, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 180,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityCrt.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex", gap: "10px" }}>
                    {isUserRoleCompare?.includes("emyverification") && (
                        <>
                            {/* {params.row.correctedited ? ( */}
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "green" }}
                                onClick={() => {
                                    handleClickOpenVerify(params.row.information, params.row.empid, params.row)
                                    setTableStatus("Table1")
                                    setLoading(true);
                                    setLoadingMessage("Updating...");
                                }}
                            >
                                Corrected View
                            </Button>
                            {/* ) : (<Button variant="contained">
                                Updated
                            </Button>)
                            } */}
                        </>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredData?.map((item, index) => {

        return {
            id: item.commonid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            filename: item.filename,
            information: item.information,
            empid: item.id,
            updateedited: item.updateedited,
            updatecorrected: item.updatecorrected,
            verifiedinfo: item.verifiedInfo,
            verificationverified: item.verificationverified

        };
    });
    const rowDataTableCrt = filteredDataCrt?.map((item, index) => {
        return {
            id: item.commonid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            filename: item.filename,
            information: item.information,
            empid: item.id,
            verifiedinfo: item.verifiedInfo,
            updateedited: item.updateedited,
            updatecorrected: item.updatecorrected,
        };
    });
    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const rowsWithCheckboxesCrt = rowDataTableCrt?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsCrt.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Show All Columns functionality Crt
    const handleShowAllColumnsCrt = () => {
        const updatedVisibility = { ...columnVisibilityCrt };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityCrt(updatedVisibility);
    };
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityCrt");
        if (savedVisibility) {
            setColumnVisibilityCrt(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityCrt", JSON.stringify(columnVisibilityCrt));
    }, [columnVisibilityCrt]);
    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    const filteredColumnsCrt = columnDataTableCrt.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageCrt.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Manage Columns functionality Crt
    const toggleColumnVisibilityCrt = (field) => {
        setColumnVisibilityCrt((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
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
    const manageColumnsContentCrt = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsCrt}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageCrt} onChange={(e) => setSearchQueryManageCrt(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsCrt?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityCrt[column.field]} onChange={() => toggleColumnVisibilityCrt(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityCrt(initialColumnVisibilityCrt)}>
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTableCrt.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityCrt(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    const [age, setAge] = useState({})
    const [panstatus, setPanstatus] = useState({})
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }
    const [bankTodo, setBankTodo] = useState([]);
    const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState("");
    const [isReferenceOpen, setIsReferenceOpen] = useState("");
    const [isPermanantAddressOpen, setIsPermanantAddressOpen] = useState("");
    const [isCurrentAddressOpen, setIsCurrentAddressOpen] = useState("");
    const [isDocumentListOpen, setIsDocumentListOpen] = useState("");
    const [isEducationalQualifyOpen, setIsEducationalQualifyOpen] = useState("");
    const [isAdditionalQualifyOpen, setIsAdditionalQualifyOpen] = useState("");
    const [isWorkHistoryOpen, setIsWorkHistoryOpen] = useState("");
    const [isBankDetailsOpen, setIsBankDetailsOpen] = useState("");
    const [userId, setUserId] = useState("")
    const [updateStatus, setUpdateStatus] = useState({});
    const [statusInfo, setStatusInfo] = useState({});
    const verifyUpdateStatus = async () => {
        setPageName(!pageName)
        try {
            let updateEdit = updateStatus?.map(item => item.name === infoname ? { ...item, edited: true, verificationverified: true } : item)
            await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${userId}`,
                { updatestatus: updateEdit }, // Request body should be here
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            // await handleClickOpenVerify();
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong4!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }

    }
    const verifyUpdateStatusCrt = async () => {
        setPageName(!pageName)
        try {
            let updateEdit = [updateStatus].map(item => item.name === statusInfo.information ? { ...item, corrected: true } : item)
            await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${userId}`,
                { updatestatus: updateEdit }, // Request body should be here
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            // await handleClickOpenVerify();
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong3!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }

    const [infoname, setInfoname] = useState([])
    const handleClickOpenVerify = async (params, emp, status) => {
        setInfoname(params)
        setStatusInfo(status)
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${emp}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let responsenew = await axios.post(
                SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONID,
                {
                    commonid: emp,
                }
            );
            setAllInformation(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0] : {})
            setUserId(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0]._id : "")
            setUpdateStatus(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0]?.updatestatus : {})
            setAge({
                ...(
                    response?.data?.smyverification?.length > 0 && response.data.smyverification[0].dob
                        ? { age: calculateAge(response.data.smyverification[0].dob) }
                        : { age: "" }
                ),
            });
            setPanstatus({
                ...(
                    response?.data?.smyverification?.length > 0 && response.data.smyverification[0]
                        ? {
                            panstatus: response.data.smyverification[0].panno ? "Have PAN" :
                                response.data.smyverification[0].panrefno ? "Applied" : "Yet to Apply",
                        }
                        : { panstatus: "" }
                ),
            })
            setReferenceTodo(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].referencetodo : [])
            setEduTodo(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].eduTodo : []);
            setAddQuaTodo(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].addAddQuaTodo : []);
            setWorkhistTodo(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].workhistTodo : []);
            setBankTodo(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].bankdetails : []);
            setProfileImg(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].userprofile : "")
            setDocumentID(responsenew?.data?.semployeedocument?._id);
            // setDocumentID(responsenew?.data?.semployeedocument?._id === undefined ? allInformation?._id : responsenew?.data?.semployeedocument?._id );
            setFiles(response?.data?.smyverification.length > 0 ? response?.data?.smyverification[0].files : "");
            if (params === "Personal Information") {
                setIsPersonalInfoOpen(true)
            }
            else if (params === "Reference Details") {
                setIsReferenceOpen(true)
            }
            else if (params === "Permanent Address") {
                setIsPermanantAddressOpen(true)
            }
            else if (params === "Current Address") {
                setIsCurrentAddressOpen(true)
            }
            else if (params === "Document List") {
                setIsDocumentListOpen(true)
            }
            else if (params === "Educational qualification") {
                setIsEducationalQualifyOpen(true)
            }
            else if (params === "Additional qualification") {
                setIsAdditionalQualifyOpen(true)
            }
            else if (params === "Work History") {
                setIsWorkHistoryOpen(true)
            }
            else if (params === "Bank Details") {
                setIsBankDetailsOpen(true)
            }
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong2!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleCloseVerify = () => {
        setTableStatus("")
        setIsPersonalInfoOpen(false)
        setIsReferenceOpen(false)
        setIsPermanantAddressOpen(false)
        setIsCurrentAddressOpen(false)
        setIsDocumentListOpen(false)
        setIsEducationalQualifyOpen(false)
        setIsAdditionalQualifyOpen(false)
        setIsWorkHistoryOpen(false)
        setIsBankDetailsOpen(false)
    };

    let final = croppedImage ? croppedImage : profileImg;
    const handleClickupdate = async () => {
        setLoading(true);
        setLoadingMessage("Updating...");

        setPageName(!pageName)
        try {
            // Prepare the payload for the main update
            const mainPayload = {
                ...(isPersonalInfoOpen && {
                    firstname: String(allInformation?.firstname),
                    prefix: String(allInformation?.prefix),
                    lastname: String(allInformation?.lastname),
                    legalname: String(allInformation?.legalname),
                    callingname: String(allInformation?.callingname),
                    fathername: String(allInformation?.fathername),
                    mothername: String(allInformation?.mothername),
                    gender: String(allInformation?.gender),
                    maritalstatus: String(allInformation?.maritalstatus),
                    dom: String(allInformation?.dom),
                    dob: String(allInformation?.dob),
                    location: String(allInformation?.location),
                    bloodgroup: String(allInformation?.bloodgroup),
                    email: String(allInformation?.email),
                    contactpersonal: String(allInformation?.contactpersonal),
                    contactfamily: String(allInformation?.contactfamily),
                    emergencyno: String(allInformation?.emergencyno),
                    panno: String(allInformation?.panstatus === "Have PAN" ? allInformation?.panno : ""),
                    aadhar: String(allInformation?.aadhar),
                    panstatus: String(allInformation?.panstatus),
                    panrefno: String(allInformation?.panstatus === "Applied" ? allInformation?.panrefno : ""),
                    userprofile: String(final),
                    personalinfoproof: String(allInformation.personalinfoproof),
                }),

                ...(isReferenceOpen && {
                    referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
                    referenceproof: String(allInformation.referenceproof),
                }),

                ...(isPermanantAddressOpen && {
                    pdoorno: String(allInformation?.pdoorno),
                    pstreet: String(allInformation?.pstreet),
                    parea: String(allInformation?.parea),
                    plandmark: String(allInformation?.plandmark),
                    ptaluk: String(allInformation?.ptaluk),
                    ppost: String(allInformation?.ppost),
                    ppincode: String(allInformation?.ppincode),
                    pcountry: String(allInformation?.pcountry),
                    pstate: String(allInformation?.pstate),
                    pcity: String(allInformation?.pcity),
                    paddressproof: String(allInformation.paddressproof),
                }),

                ...(isCurrentAddressOpen && {
                    cdoorno: String(allInformation?.cdoorno),
                    cstreet: String(allInformation?.cstreet),
                    carea: String(allInformation?.carea),
                    clandmark: String(allInformation?.clandmark),
                    ctaluk: String(allInformation?.ctaluk),
                    cpost: String(allInformation?.cpost),
                    cpincode: String(allInformation?.cpincode),
                    ccountry: String(allInformation?.ccountry),
                    cstate: String(allInformation?.cstate),
                    ccity: String(allInformation?.ccity),
                    caddressproof: String(allInformation.caddressproof),
                }),

                ...(isDocumentListOpen && {
                    files: files ?? [],
                    documentproof: String(allInformation.documentproof),
                }),

                ...(isEducationalQualifyOpen && {
                    eduTodo: [...eduTodo],
                    eduqualiproof: String(allInformation.eduqualiproof),
                }),

                ...(isAdditionalQualifyOpen && {
                    addAddQuaTodo: [...addAddQuaTodo],
                    addqualiproof: String(allInformation.addqualiproof),
                }),

                ...(isWorkHistoryOpen && {
                    workhistTodo: [...workhistTodo],
                    workhistproof: String(allInformation.workhistproof),
                }),

                ...(isBankDetailsOpen && {
                    bankdetails: [...bankTodo],
                    bankdetailsproof: String(allInformation.bankdetailsproof),
                }),

                location: String(allInformation.location),
                empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
                wordcheck: Boolean(allInformation.wordcheck),
                contactno: String(allInformation.contactno),
                details: String(allInformation.details),
                updatedate: String(allInformation.updatedate),
                date: String(new Date()),
                updatedby: [
                    ...isUserRoleAccess.updatedby,
                    {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                    },
                ],
            };

            // If documentID is undefined, add profile image and files
            if (documentID === undefined) {
                mainPayload.profileimage = String(final);
                mainPayload.files = [...files];
                mainPayload.commonid = id;
                mainPayload.empcode = String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode);
                mainPayload.companyname = allInformation.companyname;
            }



            // Main update request
            const verifiedListResponse = await axios.put(`${SERVICE.VERIFIEDLIST_SINGLE}/${isUserRoleAccess?._id}`, mainPayload, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            const userUpdatePayload = {
                ...(isPersonalInfoOpen && {
                    firstname: String(allInformation?.firstname),
                    prefix: String(allInformation?.prefix),
                    lastname: String(allInformation?.lastname),
                    legalname: String(allInformation?.legalname),
                    callingname: String(allInformation?.callingname),
                    fathername: String(allInformation?.fathername),
                    mothername: String(allInformation?.mothername),
                    gender: String(allInformation?.gender),
                    maritalstatus: String(allInformation?.maritalstatus),
                    dom: String(allInformation?.dom),
                    dob: String(allInformation?.dob),
                    location: String(allInformation?.location),
                    bloodgroup: String(allInformation?.bloodgroup),
                    email: String(allInformation?.email),
                    contactpersonal: String(allInformation?.contactpersonal),
                    contactfamily: String(allInformation?.contactfamily),
                    emergencyno: String(allInformation?.emergencyno),
                    panno: String(allInformation?.panno),
                    aadhar: String(allInformation?.aadhar),
                    panstatus: String(allInformation?.panstatus),
                    panrefno: String(allInformation?.panstatus === "Applied" ? allInformation?.panrefno : ""),
                    userprofile: String(final),
                    // personalinfoproof: String(allInformation.personalinfoproof),
                }),

                ...(isReferenceOpen && {
                    referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
                    // referenceproof: String(allInformation.referenceproof),
                }),

                ...(isPermanantAddressOpen && {
                    pdoorno: String(allInformation?.pdoorno),
                    pstreet: String(allInformation?.pstreet),
                    parea: String(allInformation?.parea),
                    plandmark: String(allInformation?.plandmark),
                    ptaluk: String(allInformation?.ptaluk),
                    ppost: String(allInformation?.ppost),
                    ppincode: String(allInformation?.ppincode),
                    pcountry: String(allInformation?.pcountry),
                    pstate: String(allInformation?.pstate),
                    pcity: String(allInformation?.pcity),
                    // paddressproof: String(allInformation.paddressproof),
                }),

                ...(isCurrentAddressOpen && {
                    cdoorno: String(allInformation?.cdoorno),
                    cstreet: String(allInformation?.cstreet),
                    carea: String(allInformation?.carea),
                    clandmark: String(allInformation?.clandmark),
                    ctaluk: String(allInformation?.ctaluk),
                    cpost: String(allInformation?.cpost),
                    cpincode: String(allInformation?.cpincode),
                    ccountry: String(allInformation?.ccountry),
                    cstate: String(allInformation?.cstate),
                    ccity: String(allInformation?.ccity),
                    // caddressproof: String(allInformation.caddressproof),
                }),

                ...(isDocumentListOpen && {
                    files: files ?? [],
                    // documentproof: String(allInformation.documentproof),
                }),

                ...(isEducationalQualifyOpen && {
                    eduTodo: [...eduTodo],
                    // eduqualiproof: String(allInformation.eduqualiproof),
                }),

                ...(isAdditionalQualifyOpen && {
                    addAddQuaTodo: [...addAddQuaTodo],
                    // addqualiproof: String(allInformation.addqualiproof),
                }),

                ...(isWorkHistoryOpen && {
                    workhistTodo: [...workhistTodo],
                    // workhistproof: String(allInformation.workhistproof),
                }),

                ...(isBankDetailsOpen && {
                    bankdetails: [...bankTodo],
                    // bankdetailsproof: String(allInformation.bankdetailsproof),
                }),

                ...(isBankDetailsOpen && {
                    bankdetails: bankTodo.map(({ _id, ...rest }) => rest),
                }),
                ...(isWorkHistoryOpen && {
                    workhistTodo: [...workhistTodo],
                }),
            };




            let employees_data = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${isUserRoleAccess?._id}`, userUpdatePayload, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // If documentID is defined, update the employee document
            if (documentID !== undefined) {
                const employeeDocumentPayload = {
                    profileimage: String(final),
                    files: [...files],
                    commonid: id,
                    empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
                    companyname: allInformation.companyname,
                    type: String("Employee"),
                    updatedby: [
                        ...mainPayload.updatedby,
                        {
                            name: String(isUserRoleAccess?.username),
                            date: String(new Date()),
                        },
                    ],
                };

                await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`, employeeDocumentPayload, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            }

            // Update the status based on tableStatus
            if (tableStatus === "Table1") {
                await verifyUpdateStatusCrt();
            } else {

                await verifyUpdateStatus();
            }

            // Set the loading state and update the UI accordingly
            setLoading(false);
            setIsUpdateOpen(true);
            setIsWorkHistoryOpen(false);
            setIsAdditionalQualifyOpen(false);
            setIsDocumentListOpen(false);
            setIsCurrentAddressOpen(false);
            setIsPermanantAddressOpen(false);
            setIsReferenceOpen(false);
            setIsPersonalInfoOpen(false);
            setIsEducationalQualifyOpen(false);
            setIsBankDetailsOpen(false);
            await handleFilter();

        }


        catch (err) {

            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong1!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    return (
        <Box>
            <Headtitle title={"Verified List"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Verified List"
                modulename="Settings"
                submodulename="Verified List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br />
            <br />
            <Box sx={userStyle.dialogbox}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Company <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect size="small"
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
                                value={companyValueAdd}
                                valueRenderer={customValueRendererCompanyAdd}
                                onChange={handleCompanyChangeAdd}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Branch
                            </Typography>
                            <MultiSelect size="small"
                                options={isAssignBranch
                                    ?.filter((comp) => companyValueAdd?.some((item) => item?.value === comp.company))
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
                                // options={branchOption}
                                value={branchValueAdd}
                                valueRenderer={customValueRendererBranchAdd}
                                onChange={handleBranchChangeAdd}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Unit
                            </Typography>
                            <MultiSelect size="small"
                                options={isAssignBranch
                                    ?.filter((comp) => branchValueAdd?.some((item) => item?.value === comp.branch))
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
                                // options={unitOption}
                                value={unitValueAdd}
                                valueRenderer={customValueRendererUnitAdd}
                                onChange={handleUnitChangeAdd}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Team
                            </Typography>
                            <MultiSelect size="small"
                                options={teamOption}
                                value={teamValueAdd}
                                valueRenderer={customValueRendererTeamAdd}
                                onChange={handleTeamChangeAdd}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Employee Name
                            </Typography>
                            <MultiSelect size="small"
                                options={employeeOption}
                                value={employeeValueAdd}
                                valueRenderer={customValueRendererEmployeeAdd}
                                onChange={handleEmployeeChangeAdd}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} >
                        <FormControl fullWidth size="small">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={validateFilter}
                                sx={{ marginTop: "23px", width: "100px" }}
                            >
                                {" "}
                                Filter{" "}
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small" sx={{ marginTop: "23px", width: "100px" }}>
                            <Button sx={userStyle.btncancel} onClick={handleClearCrt}>
                                {" "}
                                Clear{" "}
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <br /> <br />
            <Box sx={userStyle.dialogbox}>
                <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>My Verification Corrected List</Typography>
                </Grid>
                <br />
                {isUserRoleCompare?.includes("lverifiedlist") && (
                    <>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeCrt}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeCrt}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={employeesCrt?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenCrt(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenCrt(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyverification") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintCrt}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyverification") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenCrt(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyverification") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImageCrt}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryCrt} onChange={handleSearchChangeCrt} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsCrt}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsCrt}>
                            Manage Columns
                        </Button>
                        &ensp;
                        <br />
                        <br />
                        {!isemployeedetail ? (
                            <>
                                {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box> */}
                            </>
                        ) : (
                            ""
                        )}
                        {loadingCrt ?
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    // minHeight: "350px",
                                }}
                            >
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
                            :
                            (
                                <>
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }} ref={gridRefCrt}
                                    >
                                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedDataCrt(copiedString)} rows={rowsWithCheckboxesCrt} columns={columnDataTableCrt.filter((column) => columnVisibilityCrt[column.field])} onSelectionModelChange={handleSelectionChangeCrt} selectionModel={selectedRowsCrt} autoHeight={true} density="compact" hideFooter getRowClassNameCrt={getRowClassNameCrt} disableRowSelectionOnClick />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredDataCrt?.length > 0 ? (pageCrt - 1) * pageSizeCrt + 1 : 0} to {Math.min(pageCrt * pageSizeCrt, filteredDatasCrt?.length)} of {filteredDatasCrt?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageCrt(1)} disabled={pageCrt === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeCrt(pageCrt - 1)} disabled={pageCrt === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersCrt?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeCrt(pageNumber)} className={pageCrt === pageNumber ? "active" : ""} disabled={pageCrt === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePageCrt < totalPagesCrt && <span>...</span>}
                                            <Button onClick={() => handlePageChangeCrt(pageCrt + 1)} disabled={pageCrt === totalPagesCrt} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageCrt(totalPagesCrt)} disabled={pageCrt === totalPagesCrt} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                    </>
                )}
            </Box >
            <br />
            <Box sx={userStyle.dialogbox}>
                {isUserRoleCompare?.includes("lverifiedlist") && (
                    <>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>My Verification Verified List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={employees?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyverification") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyverification") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyverification") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        <br />
                        <br />
                        {loadingdots ?
                            <Box sx={userStyle.container}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        // minHeight: "350px",
                                    }}
                                >
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
                            </Box> :
                            (
                                <>
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }} ref={gridRef}
                                    >
                                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(pageCrt * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeCrt(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                    </>
                )}
                {/* Manage Column */}
                <Popover
                    id={id}
                    open={isManageColumnsOpen}
                    anchorEl={anchorEl}
                    onClose={handleCloseManageColumns}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {manageColumnsContent}
                </Popover>
                <Popover
                    id={id}
                    open={isManageColumnsOpenCrt}
                    anchorEl={anchorElCrt}
                    onClose={handleCloseManageColumnsCrt}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {manageColumnsContentCrt}
                </Popover>
                {/* Submit DIALOG */}
                <Dialog open={isUpdateOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <Typography variant="h6">
                            <b>Updated Successfully👍</b>
                        </Typography>
                    </DialogContent>
                </Dialog>
                <Box>
                </Box>
                <Box>
                    <Dialog
                        // open={isErrorOpen}
                        onClose={handleCloseerr}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                            <Typography variant="h6"></Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error">
                                ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <Box>
                    <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                            <Typography variant="h6">{showAlert}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleCloseerr}>
                                ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                {/* Popups For View */}
                {/* Personal Information Popup For View*/}
                <Dialog
                    open={isPersonalInfoOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                >
                    <Box sx={userStyle.selectcontainer}>
                        <Typography sx={userStyle.SubHeaderText}>
                            Personal Information{" "}
                        </Typography>
                        <br />
                        <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Typography>First Name</Typography>
                                    <Grid container sx={{ display: "flex" }}>
                                        <Grid item md={3} sm={3} xs={3}>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput value={allInformation.prefix} readOnly={true} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={9} sm={9} xs={9}>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    readOnly={true}
                                                    value={allInformation.firstname}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Last Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={allInformation.lastname}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Legal Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            readOnly
                                            value={allInformation.legalname}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Calling Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            readOnly
                                            value={allInformation.callingname}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Father Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            readOnly
                                            value={allInformation.fathername}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Mother Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={allInformation.mothername}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid container spacing={2}> */}
                                <Grid item md={9} sm={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Gender</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={allInformation.gender}
                                                    readOnly
                                                    type="text"
                                                    size="small"
                                                    name="dom"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Marital Status</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={allInformation.maritalstatus}
                                                    readOnly
                                                    type="text"
                                                    size="small"
                                                    name="dom"
                                                />
                                            </FormControl>
                                        </Grid>
                                        {allInformation.maritalstatus === "Married" && (
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Date Of Marriage</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        value={
                                                            allInformation.dom
                                                                ? moment(allInformation.dom)?.format("DD-MM-YYYY")
                                                                : ""
                                                        }
                                                        readOnly
                                                        type="text"
                                                        size="small"
                                                        name="dom"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Date Of Birth</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={
                                                        allInformation.dob
                                                            ? moment(allInformation.dob)?.format("DD-MM-YYYY")
                                                            : ""
                                                    }
                                                    readOnly
                                                    type="text"
                                                    size="small"
                                                    name="dob"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Age</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={allInformation.dob === "" ? "" : age.age}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Blood Group</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="bloodgroup"
                                                    value={allInformation.bloodgroup}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Email</Typography>
                                                <TextField
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    value={allInformation.email}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Location</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Location"
                                                    value={allInformation.location}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Contact No (personal)</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    placeholder="Contact No (personal)"
                                                    value={allInformation.contactpersonal}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Contact No (Family)</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    placeholder="Contact No (Family)"
                                                    value={allInformation.contactfamily}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Emergency No</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    placeholder="Emergency No (Emergency)"
                                                    value={allInformation.emergencyno}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>DOT</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={
                                                        allInformation.dot
                                                            ? moment(allInformation.dot)?.format("DD-MM-YYYY")
                                                            : ""
                                                    }
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>DOJ</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={
                                                        allInformation.doj
                                                            ? moment(allInformation.doj)?.format("DD-MM-YYYY")
                                                            : ""
                                                    }
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid> */}
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Aadhar No</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="Number"
                                                    sx={userStyle.input}
                                                    placeholder="Aadhar No"
                                                    value={allInformation.aadhar}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>PAN Card Status</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    // type="Number"
                                                    sx={userStyle.input}
                                                    placeholder="PAN Status"
                                                    value={panstatus.panstatus}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        {allInformation?.panno?.length > 0 && (
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Pan No</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Pan No"
                                                        value={allInformation.panno}
                                                        readOnly
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                        {allInformation?.panrefno?.length > 0 && (
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Application Ref No</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Pan No"
                                                        value={allInformation.panrefno}
                                                        readOnly
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }} >Profile Image</InputLabel>
                                    <div style={{ display: "flex" }}>
                                        <img style={{ height: 120 }} src={profileImg} alt="" />
                                        {/* <Typography onClick={() => renderFilePreview(file)}>View</Typography> */}
                                    </div>
                                </Grid>
                                {allInformation.verifiedInfo?.some(e => e.name === "Personal Information" && e.edited) && (
                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                        <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                        <>
                                            <img style={{ height: 120, width: 170 }} src={allInformation.personalinfoproof} alt="" />
                                        </>
                                    </Grid>
                                )}
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCloseVerify}
                                            type="button"
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </FormControl>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleClickupdate}
                                            type="button"
                                            disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                        <br />
                    </Box>
                </Dialog>
                {/* Reference Detail Popup For View*/}
                <Dialog
                    open={isReferenceOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box
                        sx={userStyle.selectcontainer}
                    >
                        <Grid item xs={8}>
                            <Typography sx={userStyle.SubHeaderText}>
                                Reference Details{" "}
                            </Typography>
                            <br />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                {" "}
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{ minWidth: 700 }}
                                        aria-label="customized table"
                                        id="usertable"
                                    >
                                        <TableHead sx={{ fontWeight: "600" }}>
                                            <StyledTableRow>
                                                <StyledTableCell>SNo</StyledTableCell>
                                                <StyledTableCell>Name</StyledTableCell>
                                                <StyledTableCell>Relationship</StyledTableCell>
                                                <StyledTableCell>Occupation</StyledTableCell>
                                                <StyledTableCell>Contact</StyledTableCell>
                                                <StyledTableCell>Details</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {referenceTodo?.length > 0 ? (
                                                referenceTodo?.map((row, index) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                                        <StyledTableCell>{row?.name}</StyledTableCell>
                                                        <StyledTableCell>{row.relationship}</StyledTableCell>
                                                        <StyledTableCell>{row.occupation}</StyledTableCell>
                                                        <StyledTableCell>{row.contact}</StyledTableCell>
                                                        <StyledTableCell>{row.details}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            ) : (
                                                <StyledTableRow>
                                                    {" "}
                                                    <StyledTableCell colSpan={8} align="center">
                                                        No Data Available
                                                    </StyledTableCell>{" "}
                                                </StyledTableRow>
                                            )}
                                            <StyledTableRow></StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            {allInformation.verifiedInfo?.some(e => e.name === "Reference Details" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.referenceproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>{" "}
                        <br />
                    </Box>
                </Dialog>
                {/* Permanent Address Popup For View*/}
                <Dialog
                    open={isPermanantAddressOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.selectcontainer}>
                        <Typography sx={userStyle.SubHeaderText}>
                            {" "}
                            Permanent Address
                        </Typography>
                        <br />
                        <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Door/Flat No</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={allInformation.pdoorno}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Street/Block</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.pstreet}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Area/village</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.parea}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Landmark</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.plandmark}
                                        />
                                    </FormControl>
                                </Grid>
                                <br />
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Taluk</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.ptaluk}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Post</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={allInformation?.ppost}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Pincode</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            readOnly
                                            value={allInformation?.ppincode}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Country</Typography>
                                        <OutlinedInput
                                            value={allInformation?.pcountry}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>State</Typography>
                                        <OutlinedInput value={allInformation?.pstate} readOnly={true} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>City</Typography>
                                        <OutlinedInput value={allInformation?.pcity} readOnly={true} />
                                    </FormControl>
                                </Grid>
                                <br />
                                {allInformation.verifiedInfo?.some(e => e.name === "Permanent Address" && e.edited) && (
                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                        <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                        <>
                                            <img style={{ height: 120, width: 170 }} src={allInformation.paddressproof} alt="" />
                                        </>
                                    </Grid>
                                )}
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCloseVerify}
                                            type="button"
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </FormControl>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleClickupdate}

                                            disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                            type="button"
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                        <br />
                    </Box>
                </Dialog>
                {/* Current Address Popup For View*/}
                <Dialog
                    open={isCurrentAddressOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.SubHeaderText}>Current Address</Typography>
                        <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Door/Flat No</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.cdoorno}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Street/Block</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.cstreet}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Area/village</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.carea}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Landmark</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.clandmark}
                                        />
                                    </FormControl>
                                </Grid>
                                <br />
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Taluk</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.ctaluk}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Post</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={allInformation.cpost}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Pincode</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            readOnly
                                            value={allInformation.cpincode}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Country</Typography>
                                        <OutlinedInput value={allInformation?.ccountry} readOnly={true} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>State</Typography>
                                        <OutlinedInput value={allInformation?.cstate} readOnly={true} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>City</Typography>
                                        <OutlinedInput value={allInformation?.ccity} readOnly={true} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {allInformation.verifiedInfo?.some(e => e.name === "Current Address" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.caddressproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        type="button"
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* Document List Popup For View*/}
                <Dialog
                    open={isDocumentListOpen}
                    // onClose={handleCloseVerify}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.SubHeaderText}> Document List </Typography>
                        <br />
                        <br />
                        <br />
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table" id="branch">
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">Document</StyledTableCell>
                                        <StyledTableCell align="center">Remarks</StyledTableCell>
                                        <StyledTableCell align="center">View</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {files &&
                                        files.map((file, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">{sno++}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {file.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <FormControl>
                                                        <OutlinedInput
                                                            sx={{
                                                                height: "30px !important",
                                                                background: "white",
                                                                border: "1px solid rgb(0 0 0 / 48%)",
                                                            }}
                                                            size="small"
                                                            type="text"
                                                            readOnly
                                                            value={file.remark}
                                                        />
                                                    </FormControl>
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                    align="center"
                                                >
                                                    <a
                                                        style={{ color: "#357ae8" }}
                                                        href={`data:application/octet-stream;base64,${file.data}`}
                                                        download={file.name}
                                                    >
                                                        Download
                                                    </a>
                                                    <a
                                                        style={{ color: "#357ae8" }}
                                                        //   href={`data:application/octet-stream;base64,${file}`}
                                                        onClick={() => renderFilePreview(file)}
                                                    >
                                                        {/* <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} /> */}
                                                        View
                                                    </a>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br /> <br />
                        {/* // <button onClick={handleDownloadAll}>download All</button> */}
                        <Grid container>
                            {allInformation.verifiedInfo?.some(e => e.name === "Document List" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.documentproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        type="button"
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
                {/* Educational Qualification Popup For View*/}
                <Dialog
                    open={isEducationalQualifyOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.dialogbox}>
                        <br /> <br />
                        <Typography sx={userStyle.SubHeaderText}>
                            {" "}
                            Educational Details{" "}
                        </Typography>
                        <br />
                        <br />
                        <br />
                        <Grid container>
                            {/* ****** Table start ****** */}
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" id="branch">
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell align="center">SI.NO</StyledTableCell>
                                            <StyledTableCell align="center">Category</StyledTableCell>
                                            <StyledTableCell align="center">Sub Category</StyledTableCell>
                                            <StyledTableCell align="center">
                                                Specialization
                                            </StyledTableCell>
                                            <StyledTableCell align="center">Institution</StyledTableCell>
                                            <StyledTableCell align="center">Passed Year</StyledTableCell>
                                            <StyledTableCell align="center">% or cgpa</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {eduTodo &&
                                            eduTodo?.map((todo, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="center">
                                                        {eduno++}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {todo.categoryedu}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {todo.subcategoryedu}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {todo.specialization}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.institution}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.passedyear}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.cgpa}
                                                    </StyledTableCell>

                                                </StyledTableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {allInformation.verifiedInfo?.some(e => e.name === "Educational qualification" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.eduqualiproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
                {/* Additional Qualification Popup For View*/}
                <Dialog
                    open={isAdditionalQualifyOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.SubHeaderText}>
                            Additional Qualification{" "}
                        </Typography>
                        <br />
                        <br />
                        {/* ****** Table start ****** */}
                        <TableContainer component={Paper}>
                            <Table
                                aria-label="simple table"
                                id="branch"
                            // ref={tableRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Addl. Qualification
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Institution</StyledTableCell>
                                        <StyledTableCell align="center">Duration</StyledTableCell>
                                        <StyledTableCell align="center">Remarks</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {addAddQuaTodo &&
                                        addAddQuaTodo.map((addtodo, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">{skno++}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.addQual}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.addInst}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.duration}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.remarks}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container>
                            {allInformation.verifiedInfo?.some(e => e.name === "Additional qualification" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.addqualiproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
                {/* Work History Popup For View*/}
                <Dialog
                    open={isWorkHistoryOpen}
                    // onClose={handleCloseVerify}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.SubHeaderText}>
                            {" "}
                            Work History Details{" "}
                        </Typography>
                        <br />
                        <br />
                        <br />
                        {workhistTodo?.length === 0 ?
                            (
                                <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no Work History Details</Typography>) :
                            <TableContainer component={Paper}>
                                <Table
                                    aria-label="simple table"
                                    id="branch"
                                // ref={tableRef}
                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell align="center">SI.NO</StyledTableCell>
                                            <StyledTableCell align="center">
                                                Employee Name
                                            </StyledTableCell>
                                            <StyledTableCell align="center">Designation</StyledTableCell>
                                            <StyledTableCell align="center">Joined On</StyledTableCell>
                                            <StyledTableCell align="center">Leave On</StyledTableCell>
                                            <StyledTableCell align="center">Duties</StyledTableCell>
                                            <StyledTableCell align="center">
                                                Reason for Leaving
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workhistTodo &&
                                            workhistTodo.map((todo, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="center">{snowv++}</StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {todo.empNameTodo}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.desigTodo}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.joindateTodo
                                                            ? moment(todo.joindateTodo)?.format("DD-MM-YYYY")
                                                            : ""}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.leavedateTodo
                                                            ? moment(todo.leavedateTodo)?.format("DD-MM-YYYY")
                                                            : ""}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.dutiesTodo}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {todo.reasonTodo}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                        <Grid conatiner>
                            {allInformation.verifiedInfo?.some(e => e.name === "Work History" && e.edited) && (
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                    <>
                                        <img style={{ height: 120, width: 170 }} src={allInformation.workhistproof} alt="" />
                                    </>
                                </Grid>
                            )}
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleClickupdate}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
                {/* Bank Details Popup For View*/}
                {/* {bankTodo?.length > 0 && ( */}
                <Dialog
                    open={isBankDetailsOpen}
                    // onClose={handleCloseVerify}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="lg"
                >
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.SubHeaderText}  >Bank Details </Typography>
                        <br />
                        <br />
                        {bankTodo?.map((data, index) => (
                            <div key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${index + 1
                                            }`}</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Bank Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.bankname}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Bank Branch Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.bankbranchname}
                                                placeholder="Please Enter Bank Branch Name"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Account Holder Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountholdername}
                                                placeholder="Please Enter Account Holder Name"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Account Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountnumber}
                                                placeholder="Please Enter Account Number"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>IFSC Code</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.ifsccode}
                                                placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Type of Account</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accounttype}
                                                placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Status</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountstatus}
                                                // placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    {data?.proof?.length > 0 && (
                                        <Grid
                                            item
                                            md={5}
                                            sm={8}
                                            xs={8}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                // marginTop: "10%",
                                            }}
                                        >
                                            {data?.proof?.length > 0 &&
                                                data?.proof.map((file) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={8} xs={8}>
                                                                <Typography
                                                                    style={{
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        maxWidth: "100%",
                                                                    }}
                                                                    title={file.name}
                                                                >
                                                                    {file.name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
                                                                <VisibilityOutlinedIcon
                                                                    style={{
                                                                        fontsize: "large",
                                                                        color: "#357AE8",
                                                                        cursor: "pointer",
                                                                        marginLeft: "-7px",
                                                                    }}
                                                                    onClick={() => renderFilePreview(file)}
                                                                />
                                                            </Grid>
                                                            <br />
                                                            <br />

                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    )}
                                </Grid>
                                <br />
                            </div>
                        ))}
                        {allInformation.verifiedInfo?.some(e => e.name === "Bank Details" && e.edited) && (
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <InputLabel sx={{ m: 1 }}>Proof</InputLabel>
                                <>
                                    <img style={{ height: 120, width: 170 }} src={allInformation.bankdetailsproof} alt="" />
                                </>
                            </Grid>
                        )}
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleClickupdate}
                                    type="button"
                                    disabled={allInformation?.updatestatus?.some((item) => item.name == infoname && item.verificationverified == true) || tableStatus === "Table1"}
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Update
                                </Button>
                            </FormControl>
                        </Grid>
                    </Box>
                </Dialog>
            </Box >
            <Loader loading={loading} message={loadingMessage} />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpenCrt}
                handleCloseFilterMod={handleCloseFilterModCrt}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenCrt}
                isPdfFilterOpen={isPdfFilterOpenCrt}
                setIsPdfFilterOpen={setIsPdfFilterOpenCrt}
                handleClosePdfFilterMod={handleClosePdfFilterModCrt}
                filteredDataTwo={filteredDataCrt ?? []}
                itemsTwo={employeesCrt ?? []}
                filename={"My Verification Corrected List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRefCrt}
            />
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={employees ?? []}
                filename={"My Verification Verified List "}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box >
    );
}
export default VerifiedList;