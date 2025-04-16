import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function AchievedAccuracyIndividualReviewClientstatusList() {

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };


    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);
    const pathname = window.location.pathname;
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChange, setIsHandleChange] = useState(false);
    const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(
            UserRoleAccessContext
        );
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth } = useContext(AuthContext);
    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };
    const [isBankdetail, setBankdetail] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updatedFieldEmployee, setUpdatedFieldEmployee] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Achieved Accuracy Individual Review Client Status List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Achieved Accuracy Individual Review Client Status List"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
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
        if ((selectedRows).includes(params.row.editid)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        loginid: true,
        minimumaccuracy: true,
        clientstatus: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        accuracy: true,
        totalfield: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // get single row to view....
    const getinfoCode = async (e) => {
        setOverallList((prev) => ({
            ...prev, ...e
        }))
    };
    const [isEditOpen, setIsEditOpen] = useState(false);
    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
    const [primaryWorkStation, setPrimaryWorkStation] = useState("Select Primary Workstation");
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [empaddform, setEmpaddform] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: "Please Select Work Station",
    });
    let [valueWorkStation, setValueWorkStation] = useState("");
    const [overallList, setOverallList] = useState({
        date: "",
        project: "",
        vendor: "",
        queue: "",
        loginid: "",
        accuracy: "",
        totalfield: "",
        company: "",
        branch: "",
        unit: "",
        team: "",
        employeename: "",
    });
    //get all employees list details
    const fetchAchievedAccuracyIndividual = async () => {
        setPageName(!pageName)

        try {
            // let res_employee = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            // let data_emp = res_employee?.data?.achievedaccuracyindividual.flatMap((data) => {
            //     return data.uploaddata.map((item) => {
            //         return {
            //             id: item._id,
            //             date: item.date,
            //             project: item.project,
            //             vendor: item.vendor,
            //             queue: item.queue,
            //             loginid: item.loginid,
            //             accuracy: item.accuracy,
            //             totalfield: item.totalfield,
            //             projectvendor: item.vendor.replace("_", "-")
            //         }
            //     })
            // });
            // let users = await axios.get(SERVICE.USERALLLIMIT)
            // let definedUsers = users.data.users.map((data) => {
            //     return {
            //         employeename: data.companyname,
            //         company: data.company,
            //         branch: data.branch,
            //         unit: data.unit,
            //         team: data.team,
            //     }
            // })
            // let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
            // let allottedList = res.data.clientuserid.filter((data) => {
            //     return data.allotted === "allotted"
            // })
            // let finalAllottedList = allottedList.map((data) => {
            //     let foundData = definedUsers.find((item) => item.employeename === data.empname)
            //     return {
            //         company: foundData?.company,
            //         branch: foundData?.branch,
            //         unit: foundData?.unit,
            //         team: foundData?.team,
            //         employeename: foundData?.employeename,
            //         date: data?.date,
            //         loginid: data?.userid,
            //         projectvendor: data?.projectvendor
            //     }
            // })
            // console.log(data_emp)
            // console.log(finalAllottedList)
            // // first Data to show
            // let allottedCombinedData = finalAllottedList.map((data) => {
            //     let foundData = data_emp.find((item) =>
            //     (item.loginid === data.loginid
            //         &&
            //         moment(item.date).format("YYYY-MM-DD") === moment(data.date).format("YYYY-MM-DD") &&
            //         item.projectvendor === data.projectvendor
            //     ));
            //     if (foundData) {
            //         return {
            //             id: foundData.id,
            //             date: foundData.date,
            //             project: foundData.project,
            //             vendor: foundData.vendor,
            //             queue: foundData.queue,
            //             loginid: foundData.loginid,
            //             accuracy: foundData.accuracy,
            //             totalfield: foundData.totalfield,
            //             company: data.company,
            //             branch: data.branch,
            //             unit: data.unit,
            //             team: data.team,
            //             employeename: data.employeename,
            //         };
            //     } else {
            //         return null;
            //     }
            // }).filter(item => item !== null);
            // let unAllottedCombinedData = data_emp.filter((data) => {
            //     let notfounddata = allottedCombinedData.some((item) => item.id === data.id);
            //     if (!notfounddata) {
            //         return {
            //             id: data.id,
            //             date: data.date,
            //             project: data.project,
            //             vendor: data.vendor,
            //             queue: data.queue,
            //             loginid: data.loginid,
            //             accuracy: data.accuracy,
            //             totalfield: data.totalfield,
            //             company: null,
            //             branch: null,
            //             unit: null,
            //             team: null,
            //             employeename: null,
            //         };
            //     }
            // });
            // let toShowList = [...allottedCombinedData, ...unAllottedCombinedData].filter(item => {
            //     if (item.company) {
            //         return accessbranch.some(branch =>
            //             branch.company === item.company &&
            //             branch.branch === item.branch &&
            //             branch.unit === item.unit
            //         );
            //     }
            //     return true; // Return the item if company is null
            // });
            // let minAcc = await axios.get(SERVICE.ACCURACYMASTERGETALL);
            // let minimumaccuracyArray = minAcc.data.accuracymaster;
            // let getShowList = toShowList.map((data) => {
            //     let newone = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
            //     if (newone) {
            //         return {
            //             ...data, minimumaccuracy: newone.minimumaccuracy
            //         }
            //     } else {
            //         return {
            //             ...data, minimumaccuracy: ""
            //         }
            //     }
            // })
            // let expectedaccuracyDetails = await axios.get(SERVICE.EXPECTEDACCURACYGETALL);
            // let expArray = expectedaccuracyDetails.data.expectedaccuracy;
            // let finalList = getShowList.map((data) => {
            //     let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));
            //     let object = {};
            //     if (foundData.length > 0) {
            //         foundData.forEach((dataNew) => { // Use forEach instead of map
            //             if (dataNew.mode === "Client") {
            //                 object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
            //             }
            //             if (dataNew.mode === "Internal") {
            //                 object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
            //             }
            //         });
            //         return {
            //             ...data,
            //             ...object
            //         };
            //     }
            //     else {
            //         return {
            //             ...data,
            //             clientstatus: "NIL",
            //             internalstatus: "NIL"
            //         };
            //     }
            // });
            // const filterClientValue = finalList.filter((item) => item.clientstatus !== "NIL" && item.clientstatus !== "" && item.clientstatus !== undefined)
            // Fetch required data
            const [res_employee, users, res, minAcc, expectedaccuracyDetails] = await Promise.all([
                axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
                    headers: { Authorization: `Bearer ${auth.APIToken}` }
                }),
                axios.get(SERVICE.USERALLLIMIT),
                axios.get(SERVICE.ALL_CLIENTUSERIDDATA),
                axios.get(SERVICE.ACCURACYMASTERGETALL),
                axios.get(SERVICE.EXPECTEDACCURACYGETALL)
            ]);

            // Process employee data
            const data_emp = res_employee?.data?.achievedaccuracyindividual.flatMap(data =>
                data.uploaddata.map(item => ({
                    id: item._id,
                    date: item.date,
                    project: item.project,
                    vendor: item.vendor,
                    queue: item.queue,
                    loginid: item.loginid,
                    accuracy: item.accuracy,
                    totalfield: item.totalfield,
                    projectvendor: item.vendor.replace("_", "-")
                }))
            );

            // Process user data
            const definedUsers = users.data.users.map(data => ({
                employeename: data.companyname,
                company: data.company,
                branch: data.branch,
                unit: data.unit,
                team: data.team,
            }));

            // Filter and map allotted client user data
            const allottedList = res.data.clientuserid
                .filter(data => data.allotted === "allotted")
                .map(data => {
                    const foundUser = definedUsers.find(user => user.employeename === data.empname);
                    return foundUser ? {
                        ...foundUser,
                        date: data.date,
                        loginid: data.userid,
                        projectvendor: data.projectvendor
                    } : null;
                }).filter(Boolean);

            // Combine allotted data with employee data
            const allottedCombinedData = allottedList.map(data => {
                const foundData = data_emp.find(emp =>
                    emp.loginid === data.loginid &&
                    moment(emp.date).format("YYYY-MM-DD") === moment(data.date).format("YYYY-MM-DD") &&
                    emp.projectvendor === data.projectvendor
                );
                return foundData ? { ...foundData, ...data } : null;
            }).filter(Boolean);

            // Get unAllotted data by filtering out those present in allottedCombinedData
            const allottedIds = new Set(allottedCombinedData.map(item => item.id));
            const unAllottedCombinedData = data_emp.filter(emp => !allottedIds.has(emp.id))
                .map(data => ({
                    ...data,
                    company: null,
                    branch: null,
                    unit: null,
                    team: null,
                    employeename: null,
                }));

            // Filter and map toShowList based on access branch
            const toShowList = [...allottedCombinedData, ...unAllottedCombinedData]
                .filter(item => !item.company || accessbranch.some(branch =>
                    branch.company === item.company &&
                    branch.branch === item.branch &&
                    branch.unit === item.unit
                ));

            // Add minimum accuracy to toShowList
            const minAccMap = Object.fromEntries(
                minAcc?.data?.accuracymaster?.map(item => [`${item.projectvendor}-${item.queue}`, item.minimumaccuracy])
            );
            // console.log(minAccMap,"minAccMap")
            // console.log(minAcc.data.accuracymaster,"minAcc.data.accuracymaster")
            const getShowList = toShowList.map(data => ({
                ...data,
                minimumaccuracy: minAccMap[`${data.project}-${data.queue}`] || ""
            }));
            console.log(toShowList, "toShowList")

            // Add client and internal status based on accuracy ranges
            const expArray = expectedaccuracyDetails.data.expectedaccuracy;
            const finalList = getShowList.map(data => {
                const matchingAccuracy = expArray.filter(item =>
                    data.project === item.project &&
                    data.queue === item.queue &&
                    data.accuracy >= item.expectedaccuracyfrom &&
                    data.accuracy <= item.expectedaccuracyto
                );

                const statuses = matchingAccuracy.reduce((acc, item) => {
                    if (item.mode === "Client") acc.clientstatus = `${item.statusmode} ${item.percentage} %`;
                    if (item.mode === "Internal") acc.internalstatus = `${item.statusmode} ${item.percentage} %`;
                    return acc;
                }, { clientstatus: "NIL", internalstatus: "NIL" });

                return { ...data, ...statuses };
            });

            // Filter final list for client status
            const filterClientValue = finalList.filter(item => item.clientstatus && item.clientstatus !== "NIL");
            const itemsWithSerialNumber = filterClientValue?.map((item, index) => ({ ...item, serialNumber: index + 1, date: moment(item.date).format('DD-MM-YYYY') }));
            setEmployees(itemsWithSerialNumber);
            setBankdetail(true);
        } catch (err) { setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };
    const [employeesArray, setEmployeesArray] = useState([])
    //get all employees list details
    const fetchAchievedAccuracyIndividualArray = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_emp = res_employee?.data?.achievedaccuracyindividual.flatMap((data) => {
                return data.uploaddata.map((item) => {
                    return {
                        id: item._id,
                        date: item.date,
                        project: item.project,
                        vendor: item.vendor,
                        queue: item.queue,
                        loginid: item.loginid,
                        accuracy: item.accuracy,
                        totalfield: item.totalfield,
                        projectvendor: item.vendor.replace("_", "-")
                    }
                })
            });
            let users = await axios.get(SERVICE.USERALLLIMIT)
            let definedUsers = users.data.users.map((data) => {
                return {
                    employeename: data.companyname,
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                    team: data.team,
                }
            })
            let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
            let allottedList = res.data.clientuserid.filter((data) => {
                return data.allotted === "allotted"
            })
            let finalAllottedList = allottedList.map((data) => {
                let foundData = definedUsers.find((item) => item.employeename === data.empname)
                return {
                    company: foundData?.company,
                    branch: foundData?.branch,
                    unit: foundData?.unit,
                    team: foundData?.team,
                    employeename: foundData?.employeename,
                    date: data?.date,
                    loginid: data?.userid,
                    projectvendor: data?.projectvendor
                }
            })
            // first Data to show
            let allottedCombinedData = finalAllottedList.map((data) => {
                let foundData = data_emp.find((item) =>
                (item.loginid === data.loginid
                    &&
                    moment(item.date).format("YYYY-MM-DD") === moment(data.date).format("YYYY-MM-DD") &&
                    item.projectvendor === data.projectvendor
                ));
                if (foundData) {
                    return {
                        id: foundData.id,
                        date: foundData.date,
                        project: foundData.project,
                        vendor: foundData.vendor,
                        queue: foundData.queue,
                        loginid: foundData.loginid,
                        accuracy: foundData.accuracy,
                        totalfield: foundData.totalfield,
                        company: data.company,
                        branch: data.branch,
                        unit: data.unit,
                        team: data.team,
                        employeename: data.employeename,
                    };
                } else {
                    return null;
                }
            }).filter(item => item !== null);
            let unAllottedCombinedData = data_emp.filter((data) => {
                let notfounddata = allottedCombinedData.some((item) => item.id === data.id);
                if (!notfounddata) {
                    return {
                        id: data.id,
                        date: data.date,
                        project: data.project,
                        vendor: data.vendor,
                        queue: data.queue,
                        loginid: data.loginid,
                        accuracy: data.accuracy,
                        totalfield: data.totalfield,
                        company: null,
                        branch: null,
                        unit: null,
                        team: null,
                        employeename: null,
                    };
                }
            });
            let toShowList = [...allottedCombinedData, ...unAllottedCombinedData]
            let minAcc = await axios.get(SERVICE.ACCURACYMASTERGETALL);
            let minimumaccuracyArray = minAcc.data.accuracymaster;
            let getShowList = toShowList.map((data) => {
                let newone = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
                if (newone) {
                    return {
                        ...data, minimumaccuracy: newone.minimumaccuracy
                    }
                } else {
                    return {
                        ...data, minimumaccuracy: ""
                    }
                }
            })
            let expectedaccuracyDetails = await axios.get(SERVICE.EXPECTEDACCURACYGETALL);
            let expArray = expectedaccuracyDetails.data.expectedaccuracy;
            let finalList = getShowList.map((data) => {
                let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));
                let object = {};
                if (foundData.length > 0) {
                    foundData.forEach((dataNew) => { // Use forEach instead of map
                        if (dataNew.mode === "Client") {
                            object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                        }
                        if (dataNew.mode === "Internal") {
                            object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                        }
                    });
                    return {
                        ...data,
                        ...object
                    };
                }
                else {
                    return {
                        ...data,
                        clientstatus: "NIL",
                        internalstatus: "NIL"
                    };
                }
            });
            const filterClientValue = finalList.filter((item) => item.clientstatus !== "NIL" && item.clientstatus !== "" && item.clientstatus !== undefined)
            const fieldToRemove = 'internalstatus';
            filterClientValue.forEach(obj => delete obj[fieldToRemove]);
            console.log(filterClientValue)
            setEmployeesArray(filterClientValue.map((item, index) => ({

                ...item,
                serialNumber: item.serialNumber,
                id: item.id,
                date: moment(item.date).format("DD-MM-YYYY"),
            })));
            // setBankdetail(true);
        } catch (err) { setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchAchievedAccuracyIndividualArray()
    }, [isFilterOpen])
    const fetchWorkStation = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.locationgroupings.flatMap((item) => {
                return item.combinstation.flatMap((combinstationItem) => {
                    return combinstationItem.subTodos.length > 0
                        ? combinstationItem.subTodos.map(
                            (subTodo) =>
                                subTodo.subcabinname +
                                "(" +
                                item.branch +
                                "-" +
                                item.floor +
                                ")"
                        )
                        : [
                            combinstationItem.cabinname +
                            "(" +
                            item.branch +
                            "-" +
                            item.floor +
                            ")",
                        ];
                });
            });
            setWorkStationOpt(res?.data?.locationgroupings);
            setAllWorkStationOpt(
                result.flat()?.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchWorkStation();
    }, []);

    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;
    let username = isUserRoleAccess.username;
    //edit post call.
    let boredit = empaddform?._id;

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleCloseinfo = () => { setOpeninfo(false); };
    const handleClickOpenInfo = () => {
        setOpenview(true);
    }
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    let exportColumnNames = ["Date", "Project", "Vendor", "Queue", "Minimum Accuracy", "Achieved Accuracy", "Client Status",
        "Loginid", "Company", "Branch", "Unit", "Team", "Employeename", "Totalfield"];
    let exportRowValues = ["date", "project", "vendor", "queue", "minimumaccuracy", "accuracy", "clientstatus", "loginid", "company", "branch", "unit", "team", "employeename", "totalfield"];
    // Excel
    const fileName = "Achieved Accuracy Individual Review Client Status List";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Achieved Accuracy Individual Review Client Status List",
        pageStyle: "print",
    });
    useEffect(() => {
        fetchAchievedAccuracyIndividual();
    }, []);
    //table entries ..,.
    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {

        setItems(datas);
        setOverallItems(datas);
    };
    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
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
    const totalPages = Math.ceil(employees.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );
    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',

        },
        { field: "date", headerName: "Date", flex: 0, width: 200, hide: !columnVisibility.date, headerClassName: "bold-header", pinned: 'left', },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header", pinned: 'left', },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 200, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "minimumaccuracy", headerName: "Minimum Accuracy", flex: 0, width: 100, hide: !columnVisibility.minimumaccuracy, headerClassName: "bold-header" },
        { field: "accuracy", headerName: "Achieved Accuracy", flex: 0, width: 100, hide: !columnVisibility.accuracy, headerClassName: "bold-header" },
        { field: "clientstatus", headerName: "Client Status", flex: 0, width: 150, hide: !columnVisibility.clientstatus, headerClassName: "bold-header" },
        { field: "loginid", headerName: "Login ID", flex: 0, width: 200, hide: !columnVisibility.loginid, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 200, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 100, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 100, hide: !columnVisibility.totalfield, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("vachievedaccuracyindividualreviewclientstatuslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenInfo();
                                getinfoCode(params.data);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    &ensp;
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            serialNumber: item.serialNumber,
            id: item.id,
            date: item.date,
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            loginid: item.loginid,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            accuracy: item.accuracy,
            totalfield: item.totalfield,
            minimumaccuracy: item.minimumaccuracy,
            clientstatus: item.clientstatus,
            internalstatus: item.internalstatus
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
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
   
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
    const [fileFormat, setFormat] = useState('')
    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"ACHIEVED ACCURACY INDIVIDUAL REVIEW CLIENT STATUS LIST"} />
            <PageHeading
                title="Achieved Accuracy Individual Review Client Status List"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Achieved Accuracy Individual Review Client Status List"
                subpagename=""
                subsubpagename=""
            />

            <br />
            {isUserRoleCompare?.includes("lachievedaccuracyindividualreviewclientstatuslist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Achieved Accuracy Individual Review Client Status List</Typography>
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
                                        <MenuItem value={(employees?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelachievedaccuracyindividualreviewclientstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAchievedAccuracyIndividualArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvachievedaccuracyindividualreviewclientstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAchievedAccuracyIndividualArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printachievedaccuracyindividualreviewclientstatuslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfachievedaccuracyindividualreviewclientstatuslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchAchievedAccuracyIndividualArray()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageachievedaccuracyindividualreviewclientstatuslist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={4} xs={6} sm={6}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!isBankdetail ?
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
                                <AggridTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    isHandleChange={isHandleChange}
                                    items={items}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>}
                    </Box>
                </>
            )}
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
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='md'
                sx={{ marginTop: '50px' }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Achieved Accuracy Individual Review Client Status List</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{overallList.date}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl size="small" fullWidth>
                                    <Typography variant="h6"> Project</Typography>
                                    <Typography>{overallList.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{overallList.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{overallList.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Achieved Accuracy</Typography>
                                    <Typography>{overallList.accuracy}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Minimum Accuracy</Typography>
                                    <Typography>{overallList.minimumaccuracy}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Client Status</Typography>
                                    <Typography>{overallList.clientstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Login ID</Typography>
                                    <Typography>{overallList.loginid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{overallList.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{overallList.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{overallList.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{overallList.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{overallList.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Total Field</Typography>
                                    <Typography>{overallList.totalfield}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <Dialog
                open={isErrorOpen}
                onClose={handleCloseerr}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Project</StyledTableCell>
                            <StyledTableCell>Vendor</StyledTableCell>
                            <StyledTableCell>Queue</StyledTableCell>
                            <StyledTableCell>Minimum Accuracy</StyledTableCell>
                            <StyledTableCell>Achieved Accuracy</StyledTableCell>
                            <StyledTableCell>Client Status</StyledTableCell>
                            <StyledTableCell>Login ID</StyledTableCell>
                            <StyledTableCell>Totalfield</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Employeename</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.date} </StyledTableCell>
                                    <StyledTableCell> {row.project}</StyledTableCell>
                                    <StyledTableCell> {row.vendor}</StyledTableCell>
                                    <StyledTableCell> {row.queue}</StyledTableCell>
                                    <StyledTableCell> {row.minimumaccuracy}</StyledTableCell>
                                    <StyledTableCell> {row.accuracy}</StyledTableCell>
                                    <StyledTableCell> {row.clientstatus}</StyledTableCell>
                                    <StyledTableCell> {row.loginid}</StyledTableCell>
                                    <StyledTableCell> {row.totalfield}</StyledTableCell>
                                    <StyledTableCell> {row.company}</StyledTableCell>
                                    <StyledTableCell> {row.branch}</StyledTableCell>
                                    <StyledTableCell> {row.unit}</StyledTableCell>
                                    <StyledTableCell> {row.team}</StyledTableCell>
                                    <StyledTableCell> {row.employeename}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={employeesArray ?? []}
                filename={"Achieved Accuracy Individual Review Client Status List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </Box>
    );
}

export default AchievedAccuracyIndividualReviewClientstatusList;