import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import domtoimage from 'dom-to-image';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import SignatureCanvas from "react-signature-canvas";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

const ExportXLWithImages = ({ csvData, fileName }) => {
    const exportToExcel = async (csvData, fileName) => {
        if (!csvData || !csvData.length) {
            console.error("No data provided for export.");
            return;
        }

        if (!fileName) {
            console.error("No file name provided.");
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Data");

            // Define columns
            worksheet.columns = [
                { header: "S.No", key: "serial", width: 10 },
                { header: "Empcode", key: "empcode", width: 15 },
                { header: "Employeename", key: "employeename", width: 30 },
                { header: "Email", key: "email", width: 30 },
                { header: "Image", key: "image", width: 30 },
            ];

            // Add rows and images
            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const row = worksheet.addRow({
                    serial: i + 1,
                    empcode: item.empcode,
                    employeename: item.companyname,
                    email: item.email,

                });

                // Center align the text in each cell of the row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                });

                if (item.imageBase64) {
                    const base64Image = item.imageBase64.split(",")[1];
                    const imageId = workbook.addImage({
                        base64: base64Image,
                        extension: "png",
                    });

                    const rowIndex = row.number;

                    // Adjust row height to fit the image
                    worksheet.getRow(rowIndex).height = 80;

                    // Add image to the worksheet
                    worksheet.addImage(imageId, {
                        tl: { col: 4, row: rowIndex - 1 },
                        ext: { width: 100, height: 80 },
                    });

                    // Center align the image cell
                    worksheet.getCell(`H${rowIndex}`).alignment = {
                        vertical: "middle",
                        horizontal: "center",
                    };
                }
            }

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            FileSaver.saveAs(blob, `${fileName}.xlsx`);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    return (
        <Button
            onClick={() => exportToExcel(csvData, fileName)}
            sx={userStyle.buttongrp}
        >
            <FaFileExcel /> &ensp;Export to Excel&ensp;
        </Button>
    );
};

const ExportCSVWithImages = ({ csvData, fileName }) => {
    const exportToCSV = async (csvData, fileName) => {
        if (!csvData || !csvData.length) {
            console.error("No data provided for export.");
            return;
        }

        if (!fileName) {
            console.error("No file name provided.");
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Data");

            // Define columns
            worksheet.columns = [
                { header: "S.No", key: "serial", width: 10 },
                { header: "Empcode", key: "empcode", width: 15 },
                { header: "Employeename", key: "employeename", width: 30 },
                { header: "Email", key: "email", width: 30 },
                { header: "Image", key: "image", width: 30 },
            ];

            // Add rows and images
            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const row = worksheet.addRow({
                    serial: i + 1,
                    empcode: item.empcode,
                    employeename: item.companyname,
                    email: item.email,
                });

                // Center align the text in each cell of the row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                });

                if (item.imageBase64) {
                    const base64Image = item.imageBase64.split(",")[1];
                    const imageId = workbook.addImage({
                        base64: base64Image,
                        extension: "png",
                    });

                    const rowIndex = row.number;

                    // Adjust row height to fit the image
                    worksheet.getRow(rowIndex).height = 80;

                    // Add image to the worksheet
                    worksheet.addImage(imageId, {
                        tl: { col: 4, row: rowIndex - 1 },
                        ext: { width: 100, height: 80 },
                    });

                    // Center align the image cell
                    worksheet.getCell(`H${rowIndex}`).alignment = {
                        vertical: "middle",
                        horizontal: "center",
                    };
                }
            }

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            FileSaver.saveAs(blob, `${fileName}.csv`);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    return (
        <Button
            onClick={() => exportToCSV(csvData, fileName)}
            sx={userStyle.buttongrp}
        >
            <FaFileExcel /> &ensp;Export to CSV&ensp;
        </Button>
    );
};


function AddEmployeeSignature() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);


    let exportColumnNames = [
        'SNo',
        'Emp code',
        'Name',
        'Email',
        'Image'
    ];
    let exportRowValues = [
        'serialNumber',
        'empcode',
        'companyname',
        'email',
        'imageBase64'
    ];

    // This is signature code
    const signatureRef = useRef(null);
    const [signatureData, setSignatureData] = useState(null);

    const clearSignature = () => {
        signatureRef.current.clear();
        setSignatureData(null);
    };

    const saveSignature = () => {
        if (signatureRef.current.isEmpty()) {
            setPopupContentMalert('⚠️ Please provide a signature before updating.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }
        else if (signatureRef.current) {
            const dataUrl = signatureRef.current.toDataURL(); // Convert signature to base64
            setEmpaddform((prev) => ({ ...prev, signatureimage: dataUrl })); // Store in form state
            clearSignature(); // Clear canvas after saving
        }
    };


    const deleteSavedSignature = () => {
        setEmpaddform((prev) => ({ ...prev, signatureimage: null }));
    };

    const [isEraseMode, setIsEraseMode] = useState(false);

    const toggleEraseMode = () => {
        // Check if the signature is empty when trying to disable erase mode
        if (signatureRef.current.isEmpty() && !isEraseMode) {
            setPopupContentMalert('⚠️ Please provide a signature before disabling Erase Mode.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }

        setIsEraseMode((prevMode) => !prevMode);
    };

    const handleErase = (event) => {
        if (!isEraseMode || !signatureRef.current) return;

        const ctx = signatureRef.current.getCanvas().getContext("2d");
        const rect = signatureRef.current.getCanvas().getBoundingClientRect();

        // Get mouse position relative to canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.clearRect(x, y, 10, 10); // Clears a small square (10x10 pixels) at the cursor position
    };


    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setBtnUpdate(false);
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
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");
    const [empaddform, setEmpaddform] = useState({
        prefix: "",
        firstname: "",
        lastname: "",
        email: "",
        signatureimage: "",
    });

    // Country city state datas

    const [getrowid, setRowGetid] = useState([]);
    const [employees, setEmployees] = useState([]);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        allUsersData,
        allTeam,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
        allUsersLimit
    } = useContext(UserRoleAccessContext);

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

    const { auth } = useContext(AuthContext);

    const [file, setFile] = useState("");

    const [isContact, setIsContact] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {

        getapi();

    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Employee Signature Update"),
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


    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Employee Signature Update.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        setPageName(!pageName)
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchDepartments();
    }, []);

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //empaddform multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        companyname: true,
        email: true,
        signatureimage: true,
        imageBase64: true,
        workmode: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);

        setColor('#FFFFFF');


        setFile(null);
        setImage("");
    };

    const [image, setImage] = useState("")
    const [color, setColor] = useState('#FFFFFF');

    const [profileAvailed, setProfileAvailed] = useState(false);
    const [docID, setDocID] = useState("");

    const getCode = async (e) => {
        setPageName(!pageName);
        setPageName(!pageName)
        try {
            const [res, resNew] = await Promise.all([
                axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.GETSIGNATURES, {
                    commonsignatureid: e,
                }),
            ]);

            let availedData = Object.keys(resNew?.data)?.length;

            if (availedData != 0) {
                setProfileAvailed(true);
                let profile = resNew?.data?.semployeesignature?.signatureimage;
                setEmpaddform({ ...res?.data?.suser, signatureimage: profile });
                setDocID(resNew?.data?.semployeesignature?._id);
            } else {
                setProfileAvailed(false);
                setEmpaddform({ ...res?.data?.suser, signatureimage: "" });
                setDocID("");
            }

            setRowGetid(res?.data?.suser);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmpaddform(res?.data?.suser);
            setRowGetid(res?.data?.suser);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnUpload(false);
        setBtnUpdate(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    //Contactupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;

    //EDIT POST CALL
    let logedit = getrowid._id;
    const sendRequestt = async () => {
        const starttime = performance.now();
        setPageName(!pageName);
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logedit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                signatureimage: String(empaddform.signatureimage),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            let res1;
            if (profileAvailed) {
                res1 = await axios.put(`${SERVICE.EMPLOYEESIGNATURE_SINGLE}/${docID}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    signatureimage: String(empaddform.signatureimage),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            } else {
                res1 = await axios.post(SERVICE.EMPLOYEESIGNATURE_CREATE, {
                    commonsignatureid: logedit,
                    signatureimage: String(empaddform.signatureimage),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            }

            setEmpaddform((prev) => ({ ...prev, signatureimage: "" }));

            const endTime = performance.now(); // End timing here
            const timeTaken = endTime - starttime; // Calculate the time taken in milliseconds

            await fetchHandler();
            setColor('#FFFFFF');
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEdit();
            setBtnUpdate(false);
        } catch (err) {
            setBtnUpdate(false);
            console.log(err, "err");
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    //get all employees list details
    const fetchHandler = async () => {
        setPageName(!pageName);
        setIsContact(true);
        setPageName(!pageName)
        try {
            const aggregationPipeline = [
                {
                    $match: {
                        $and: [
                            // Bank details filter
                            // Enquiry status filter
                            {
                                enquirystatus: {
                                    $nin: ["Enquiry Purpose"],
                                },
                            },
                            // Reasonable status filter
                            {
                                resonablestatus: {
                                    $nin: [
                                        "Not Joined",
                                        "Postponed",
                                        "Rejected",
                                        "Closed",
                                        "Releave Employee",
                                        "Absconded",
                                        "Hold",
                                        "Terminate",
                                    ],
                                },
                            },
                            // Conditional company filter
                            ...(valueCompanyCat.length > 0
                                ? [
                                    {
                                        company: { $in: valueCompanyCat },
                                    },
                                ]
                                : [
                                    {
                                        company: { $in: allAssignCompany },
                                    },
                                ]),
                            // Conditional branch filter
                            ...(valueBranchCat.length > 0
                                ? [
                                    {
                                        branch: { $in: valueBranchCat },
                                    },
                                ]
                                : [
                                    {
                                        branch: { $in: allAssignBranch },
                                    },
                                ]),
                            // Conditional unit filter
                            ...(valueUnitCat.length > 0
                                ? [
                                    {
                                        unit: { $in: valueUnitCat },
                                    },
                                ]
                                : [
                                    {
                                        unit: { $in: allAssignUnit },
                                    },
                                ]),
                            // Conditional team filter
                            ...(valueTeamCat.length > 0
                                ? [
                                    {
                                        team: { $in: valueTeamCat },
                                    },
                                ]
                                : []),
                            // Conditional department filter
                            ...(valueTeamCat.length > 0
                                ? [
                                    {
                                        team: { $in: valueTeamCat },
                                    },
                                ]
                                : []),
                            // Conditional department filter
                            ...(valueDepartmentCat.length > 0
                                ? [
                                    {
                                        department: { $in: valueDepartmentCat },
                                    },
                                ]
                                : []),
                            // Conditional Employee filter
                            ...(valueEmployeeCat.length > 0
                                ? [
                                    {
                                        companyname: { $in: valueEmployeeCat },
                                    },
                                ]
                                : []),
                        ],
                    },
                },
                {
                    $addFields: {
                        userIdStr: { $toString: "$_id" }, // Convert the ObjectId to string
                    },
                },
                {
                    $lookup: {
                        from: "employeesignatures",
                        localField: "userIdStr", // Use the string version of _id
                        foreignField: "commonsignatureid", // Match against the string commonid
                        as: "signatureimage",
                    },
                },
                {
                    $addFields: {
                        signatureimage: {
                            $ifNull: [
                                { $arrayElemAt: ["$signatureimage.signatureimage", 0] },
                                "",
                            ],
                        },
                    },
                },
                {
                    $project: {
                        empcode: 1,
                        companyname: 1,
                        email: 1,
                        signatureimage: 1,
                        workmode: 1,
                    },
                },
            ];
            let response = await axios.post(
                SERVICE.DYNAMICUSER_CONTROLLER,
                {
                    aggregationPipeline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setEmployees(response.data.users?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
            })));

            setIsContact(false);
        } catch (err) {
            console.log(err);
            setIsContact(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnUpdate(true);

        if (!empaddform.signatureimage) {
            setPopupContentMalert('⚠️ Please provide a signature before updating.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            setBtnUpdate(false);
            return;
        }
        else {
            sendRequestt();
        }

    };

    //  PDF
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Emp code", field: "empcode" },
        { title: "Name", field: "companyname" },
        { title: "Email", field: "email" },
        { title: "Work Mode", field: "workmode" },
        { title: "Image", field: "imageBase64" },
    ];

    const downloadPdf = async () => {
        const doc = new jsPDF();
        const tableColumn = columns.map((col) => col.title);
        const tableRows = [];
        const imagesToLoad = [];

        rowDataTable.forEach((item, index) => {
            const rowData = [
                index + 1,
                item.empcode,
                item.companyname,
                item.email,
                item.workmode,
                "", // Placeholder for the image column
            ];

            tableRows.push(rowData);

            if (item.imageBase64) {
                imagesToLoad.push({ index, imageBase64: item.imageBase64 });
            }
        });

        const loadImage = (imageBase64) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = imageBase64;
            });
        };

        const loadedImages = await Promise.all(
            imagesToLoad.map((item) =>
                loadImage(item.imageBase64).then((img) => ({ ...item, img }))
            )
        );

        // Calculate the required row height based on image height
        const rowHeight = 20; // Set desired row height

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            didDrawCell: (data) => {
                // Ensure that the cell belongs to the body section and it's the image column
                if (
                    data.section === "body" &&
                    data.column.index === columns.length - 1
                ) {
                    const imageInfo = loadedImages.find(
                        (image) => image.index === data.row.index
                    );
                    if (imageInfo) {
                        const imageHeight = 20; // Desired image height
                        const imageWidth = 20; // Desired image width
                        const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
                        const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

                        doc.addImage(
                            imageInfo.img,
                            "PNG",
                            data.cell.x + xOffset,
                            data.cell.y + yOffset,
                            imageWidth,
                            imageHeight
                        );

                        // Adjust cell styles to increase height
                        data.cell.height = rowHeight; // Set custom height
                    }
                }
            },
            headStyles: {
                minCellHeight: 5, // Set minimum cell height for header cells
                fontSize: 4, // You can adjust the font size if needed
                cellPadding: { top: 2, right: 5, bottom: 2, left: 5 }, // Adjust padding for header cells
            },
            bodyStyles: {
                fontSize: 4,
                minCellHeight: rowHeight, // Set minimum cell height for body cells
                cellPadding: { top: 7, right: 1, bottom: 0, left: 1 }, // Adjust padding for body cells
            },
        });

        doc.save("Employee Signature Update.pdf");
    };

    // Excel
    const fileName = "Employee Signature Update";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Employee Signature Update",
        pageStyle: "print",
    });


    const [btnUpload, setBtnUpload] = useState(false);
    const [btnUpdate, setBtnUpdate] = useState(false);
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas;
        setItems(itemsWithSerialNumber);
        setOverallItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
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

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
            pinned: 'left',
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Emp Code!");
                            }}
                            options={{ message: "Copied Emp Code!" }}
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 230,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Company Name!");
                            }}
                            options={{ message: "Copied Company Name!" }}
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 0,
            width: 200,
            hide: !columnVisibility.email,
            headerClassName: "bold-header",
        },
        {
            field: "workmode",
            headerName: "Work Mode",
            flex: 0,
            width: 200,
            hide: !columnVisibility.workmode,
            headerClassName: "bold-header",
        },
        {
            field: "imageBase64",
            headerName: "Signature",
            flex: 0,
            width: 250,
            hide: !columnVisibility.signatureimage,
            headerClassName: "bold-header",
            cellRenderer: (params) => {

                return params.value !== "" ? (
                    <img
                        src={params.value}
                        // alt="Profile"
                        alt="Signature"
                        style={{ width: "100%", height: "auto" }}
                    />
                ) : (
                    <></>
                );
            },
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <>
                    {isUserRoleCompare.includes("Manager") ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item>
                                    {isUserRoleCompare?.includes("iemployeesignatureupdate") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttonedit}
                                                onClick={() => {
                                                    handleClickOpeninfo();
                                                    getinfoCode(params.data.id);
                                                }}
                                            >
                                                <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid sx={{ display: "flex" }}>
                                {isUserRoleCompare?.includes("eemployeesignatureupdate") && (
                                    <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => {

                                            getCode(params.data.id);
                                        }}
                                    >
                                        <EditIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                                    </Button>
                                )}

                                {isUserRoleCompare?.includes("iemployeesignatureupdate") && (
                                    <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => {

                                            getinfoCode(params.data.id);
                                        }}
                                    >
                                        <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                                    </Button>
                                )}
                            </Grid>
                        </>
                    )}
                </>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item) => {
        return {
            // id: item._id,
            id: item.id,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            companyname: item.companyname,
            email: item.email,
            workmode: item.workmode,
            imageBase64: item?.signatureimage,
        };
    });



    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
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


    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setEmployees([]);
        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
    };


    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const [valueEmp, setValueEmp] = React.useState([]); // State for employees
    const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


    const [searchInputValue, setSearchInputValue] = useState('');

    const handlePasteForEmp = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Process the pasted text
        const pastedNames = pastedText
            .split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name !== "");

        // Update the state
        updateEmployees(pastedNames);

        // Clear the search input after paste
        setSearchInputValue('');

        // Refocus the element
        e.target.focus();
    };



    useEffect(() => {
        updateEmployees([]); // Pass an empty array instead of an empty string
    }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

    const updateEmployees = (pastedNames) => {
        // Your existing update logic...
        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersData
            ?.filter(
                (comp) =>
                    valueCompanyCat?.includes(comp.company) &&
                    valueBranchCat?.includes(comp.branch) &&
                    valueUnitCat?.includes(comp.unit) &&
                    valueTeamCat?.includes(comp.team) &&
                    comp.workmode !== "Internship"
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        // Update selected options
        const newOptions = matchedValues.map(value => ({
            label: value,
            value: value
        }));

        setSelectedOptionsEmployee(prev => {
            const newValues = newOptions.filter(
                newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
            );
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
        setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
        setValueEmp((current) => current.filter(empValue => empValue !== value));
        setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
    };

    //MULTISELECT ONCHANGE END

    const handleFilter = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSearchQuery("")
            fetchHandler();
        }
    };

    //auto select all dropdowns
    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {
            let selectedValues = accessbranch
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
            //----------------------------
            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
            setValueEmp(mappedemployees?.map((item) => item?.value));
            //-----------------
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    return (
        <Box>
            <NotificationContainer />
            {/* ****** Header Content ****** */}
            <Headtitle title={"Employee Signature Update"} />
            <PageHeading
                title="Employee Signature Update"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee Update Details"
                subsubpagename="Employee Signature Update"
            />
            <br />
            {isUserRoleCompare?.includes("lemployeesignatureupdate") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: filterState.type ?? "Please Select Type",
                                                value: filterState.type ?? "Please Select Type",
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
                                                setValueCompanyCat([]);
                                                setSelectedOptionsCompany([]);
                                                setValueBranchCat([]);
                                                setSelectedOptionsBranch([]);
                                                setValueUnitCat([]);
                                                setSelectedOptionsUnit([]);
                                                setValueTeamCat([]);
                                                setSelectedOptionsTeam([]);
                                                setValueDepartmentCat([]);
                                                setSelectedOptionsDepartment([]);
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                                setValueEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch
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
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyCat?.includes(comp.company) &&
                                                                valueBranchCat?.includes(comp.branch)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsUnit}
                                                    onChange={(e) => {
                                                        handleUnitChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Department"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartment}
                                                    onChange={(e) => {
                                                        handleDepartmentChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyCat?.includes(comp.company) &&
                                                                valueBranchCat?.includes(comp.branch)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsUnit}
                                                    onChange={(e) => {
                                                        handleUnitChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual"]?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <div
                                                onPaste={handlePasteForEmp}
                                                style={{ position: 'relative' }}
                                            >
                                                <MultiSelect
                                                    options={allUsersData
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team) &&
                                                                u.workmode !== "Internship"
                                                        )
                                                        .map((u) => ({
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsEmployee}
                                                    onChange={(e) => {
                                                        handleEmployeeChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererEmployee}
                                                    labelledBy="Please Select Employee"
                                                    // Add these props if your MultiSelect supports them
                                                    inputValue={searchInputValue} // Add this state if needed
                                                    onInputChange={(newValue) => setSearchInputValue(newValue)}
                                                />
                                            </div>
                                        </FormControl>
                                    </Grid>
                                )}
                                {["Individual"]?.includes(filterState.type) &&
                                    <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Selected Employees</Typography>
                                            <div
                                                id="paste-box" // Add an ID to the Box
                                                tabIndex={0} // Make the div focusable
                                                style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '3.75px',
                                                    height: '110px',
                                                    overflow: 'auto',
                                                }}
                                                onPaste={handlePasteForEmp}
                                                onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                                                onBlur={(e) => {
                                                    if (isBoxFocused) {
                                                        e.target.focus(); // Refocus only if the Box was previously focused
                                                    }
                                                }}
                                            >
                                                {valueEmp.map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        clickable
                                                        sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                                                        onDelete={(e) => handleDelete(e, value)}
                                                        onClick={() => console.log("clicked chip")}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                    </Grid>
                                }
                            </>
                        </Grid>
                        <br></br>
                        <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button
                                    sx={buttonStyles.buttonsubmit}
                                    variant="contained"
                                    onClick={handleFilter}
                                >
                                    {" "}
                                    Filter{" "}
                                </Button>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                                    {" "}
                                    Clear{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <br />
            {isUserRoleCompare?.includes("lemployeesignatureupdate") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Employee Signature List
                            </Typography>
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
                                        <MenuItem value={employees?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeesignatureupdate") && (
                                        <>
                                            <ExportXLWithImages
                                                csvData={rowDataTable}
                                                fileName={fileName}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeesignatureupdate") && (
                                        <>
                                            <ExportCSVWithImages
                                                csvData={rowDataTable}
                                                fileName={fileName}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeesignatureupdate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeesignatureupdate") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => downloadPdf()}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeesignatureupdate") && (
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
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}
                                />
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
                        {isContact ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                        ) : (
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
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                    rowHeight={80}
                                />
                            </>
                        )}
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
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>

            <Box>
                {/* Edit Dialog */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="md"
                    sx={{ marginTop: "50px" }}
                >
                    <DialogContent sx={userStyle.dialogbox}>
                        <Box>
                            <form onSubmit={handleSubmit}>
                                <Box>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Update Employee Signature
                                    </Typography>

                                    <Grid container spacing={2} mt={3}>
                                        <Grid item md={6} sm={12} xs={12} display="flex">
                                            <Typography sx={{ fontWeight: "600", marginRight: "5px" }}>
                                                Employee Name:
                                            </Typography>
                                            <Typography>{empaddform.companyname}</Typography>
                                        </Grid>
                                        <Grid item md={6} sm={12} xs={12} display="flex">
                                            <Typography sx={{ fontWeight: "600", marginRight: "5px" }}>
                                                Emp Code:
                                            </Typography>
                                            <Typography>{empaddform.empcode}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} mt={3}>
                                        <Grid item md={8} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                                                >
                                                    Signature <b style={{ color: "red" }}>*</b>
                                                </Typography>

                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        border: "2px dashed #1976D2",
                                                        padding: "10px",
                                                        background: "#f9f9f9",
                                                    }}
                                                >
                                                    <SignatureCanvas
                                                        ref={signatureRef}
                                                        penColor={isEraseMode ? "rgba(0,0,0,0)" : "black"} // Transparent when erasing
                                                        backgroundColor="transparent"
                                                        canvasProps={{
                                                            width: 550,
                                                            height: 120,
                                                            className: "signatureCanvas",
                                                            onMouseDown: (e) => handleErase(e), // Handle erasing when mouse is down
                                                            onMouseMove: (e) => handleErase(e), // Handle erasing when moving
                                                        }}
                                                    />

                                                </Paper>

                                                <Box mt={2} display="flex" gap={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={saveSignature}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            padding: "8px 15px",
                                                            fontWeight: "bold",
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        Save Signature
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={clearSignature}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            padding: "8px 15px",
                                                            fontWeight: "bold",
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        Clear
                                                    </Button>
                                                    {/* <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={deleteSavedSignature}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            padding: "8px 15px",
                                                            fontWeight: "bold",
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        Delete Signature
                                                    </Button> */}
                                                    {/* <Button
                                                        variant="outlined"
                                                        color={isEraseMode ? "error" : "warning"}
                                                        onClick={toggleEraseMode}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            padding: "8px 15px",
                                                            fontWeight: "bold",
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        {isEraseMode ? "Disable Erase Mode" : "Enable Erase Mode"}
                                                    </Button> */}

                                                </Box>

                                                {empaddform.signatureimage && (
                                                    <Box mt={3} textAlign="center">
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{ fontWeight: "bold", color: "#555" }}
                                                        >
                                                            Saved Signature:
                                                        </Typography>
                                                        <Paper
                                                            elevation={3}
                                                            sx={{
                                                                padding: "5px",
                                                                borderRadius: "8px",
                                                                display: "inline-block",
                                                                border: "1px solid #ccc",
                                                                background: "#fff",
                                                                position: "relative",
                                                            }}
                                                        >
                                                            <img
                                                                src={empaddform.signatureimage}
                                                                alt="Signature"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "80px",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                            {/* Delete Button on Top Right of Image */}
                                                            <IconButton
                                                                onClick={deleteSavedSignature}
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: "-5px",
                                                                    right: "-5px",
                                                                    background: "#ff4d4d",
                                                                    color: "#fff",
                                                                    width: "24px",
                                                                    height: "24px",
                                                                    "&:hover": { background: "#d43f3f" },
                                                                }}
                                                            >
                                                                <CloseIcon fontSize="small" />
                                                            </IconButton>
                                                        </Paper>
                                                    </Box>
                                                )}


                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <br />

                                    {/* Buttons */}
                                    <Grid
                                        container
                                        spacing={2}
                                        sx={{
                                            textAlign: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Grid item md={1}></Grid>

                                        <LoadingButton
                                            type="submit"
                                            variant="contained"
                                            loading={btnUpdate || btnUpload}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Update
                                        </LoadingButton>
                                        <Grid item md={1}></Grid>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleCloseModEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Box>
                            </form>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
            <Box></Box>
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                          /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: '50px' }}
            >
                <Box sx={{ width: "550px", padding: "20px 30px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            Employee Signature Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Emp code</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Work Mode</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.empcode}</StyledTableCell>
                                    <StyledTableCell> {row.companyname}</StyledTableCell>
                                    <StyledTableCell>{row.email}</StyledTableCell>
                                    <StyledTableCell>{row.workmode}</StyledTableCell>
                                    <StyledTableCell>{row?.imageBase64 ? <img src={row?.imageBase64} style={{ height: "100px", width: "100px" }} /> : ""}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </Box>
    );
}

export default AddEmployeeSignature;