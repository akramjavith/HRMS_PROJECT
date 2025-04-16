import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";


function AcheivedAccuray() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);


    const pathname = window.location.pathname;
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
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSubmitEdit, setIsSubmitEdit] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        acheivedaccuracy: true,
        clientstatus: true,
        internalstatus: true,
        minimumaccuracy: true,
        referencetodo: true,
        // percentage: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [accuracyMasterArray, setAccuracyMasterArray] = useState([]);
    //useEffect
    useEffect(() => {
        addSerialNumber(accuracyMasterArray);
    }, [accuracyMasterArray]);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Achieved Accuracy"),
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

    useEffect(() => {
        fetchEmployee();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const handleCloseModSubmit = () => {
        setIsSubmit(false);
    };
    const handleCloseModSubmitEdit = () => {
        setIsSubmitEdit(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const [upload, setUpload] = useState([]);
    const handleResumeUpload = (event) => {
        const resume = event.target.files;
        for (let i = 0; i < resume.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setUpload((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
    };
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const [uploadEdit, setUploadEdit] = useState([]);
    const handleResumeUploadEdit = (event) => {
        const resume = event.target.files;
        for (let i = 0; i < resume.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setUploadEdit((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
    };
    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteEdit = (index) => {
        setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const [uploadView, setUploadView] = useState([]);
    const renderFilePreviewView = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const [pageNumber, setPageNumber] = useState(1);
    const getDownloadFile = async (data) => {
        const ans = data.filter(item => item?.document?.length < 1).map(d => d?.documentstext)
        // const ansDocuments = data
        const ansType = data.filter(item => item?.document?.length < 1).map(d => d?.label)
        if (ans.length > 0) {
            const pages = ans;
            const numPages = pages.length;
            const pageNumber = 1;
            const goToPrevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
            const goToNextPage = () => setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));
            const handlePageClick = (page) => {
                setPageNumber(page);
            };
            function updatePage() {
                const currentPageContent = pages[pageNumber - 1];
                document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
                document.querySelector('.pdf-content').innerHTML = currentPageContent;
            }
            const doc = new jsPDF();
            // Show the content of the current page
            doc.text(10, 10, pages[pageNumber - 1]);
            // Convert the content to a data URL
            const pdfDataUri = doc.output('datauristring');
            const newTab = window.open();
            newTab.document.write(`
            <html>
              <style>
                body {
                  font-family: 'Arial, sans-serif';
                  margin: 0;
                  padding: 0;
                  background-color: #fff;
                  color: #000;
                }
                .pdf-viewer {
                  display: flex;
                  flex-direction: column;
                }
                .pdf-navigation {
                  display: flex;
                  justify-content: space-between;
                  margin: 20px;
                  align-items: center;
                }
                button {
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px;
                  border: none;
                  cursor: pointer;
                }
                .pdf-content {
                  background-color: #fff;
                  padding: 20px;
                  box-sizing: border-box;
                  flex: 1;
                }
                #pdf-heading {
                  text-align: center;
                }
                .pdf-thumbnails {
                  display: flex;
                  justify-content: center;
                  margin-top: 20px;
                }
                .pdf-thumbnail {
                  cursor: pointer;
                  margin: 0 5px;
                  font-size: 14px;
                  padding: 5px;
                }
              </style>
              <body>
                <div class="pdf-viewer">
                  <div class="pdf-navigation">
                    <button onclick="goToPrevPage()">Prev</button>
                    <span>Page ${pageNumber} of ${numPages}</span>
                    <button onclick="goToNextPage()">Next</button>
                  </div>
                  <h2 id="pdf-heading">${ansType[pageNumber - 1]}</h2> <!-- Add heading here -->
                  <div class="pdf-content">
                  <div class="pdf-content">
                    ${/* Render PDF content directly in the embed tag */ ''}
                    <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
                  </div>
                  <div class="pdf-thumbnails">
                    ${pages.map((_, index) => `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1})">${index + 1}</div>`).join('')}
                  </div>
                </div>
                <script>
                  let pageNumber = ${pageNumber};
                  let numPages = ${numPages};
                  let pagesData = ${JSON.stringify(pages)};
                  let ansType = ${JSON.stringify(ansType)};
                  function goToPrevPage() {
                    if (pageNumber > 1) {
                      pageNumber--;
                      updatePage();
                    }
                  }
                  function goToNextPage() {
                    if (pageNumber < numPages) {
                      pageNumber++;
                      updatePage();
                    }
                  }
                  function updatePage() {
                    document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
                    document.querySelector('.pdf-content').innerHTML = pagesData[pageNumber - 1];
                    document.getElementById('pdf-heading').innerText = ansType[pageNumber - 1]; // Update heading
                  }
                  function handlePageClick(page) {
                    pageNumber = page;
                    updatePage();
                  }
                  // Load initial content
                  updatePage();
                </script>
              </body>
            </html>
          `);
        }
        data.forEach(async (d) => {
            const readExcel = (base64Data) => {
                return new Promise((resolve, reject) => {
                    const bufferArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;
                    const wb = XLSX.read(bufferArray, { type: "buffer" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    resolve(data);
                });
            };
            const fileExtension = getFileExtension(d.name);
            if (fileExtension === "xlsx" || fileExtension === "xls") {
                readExcel(d.data)
                    .then((excelData) => {
                        const newTab = window.open();
                        const htmlTable = generateHtmlTable(excelData);
                        newTab.document.write(htmlTable);
                    })
                    .catch((error) => {
                    });
            } else if (fileExtension === "pdf") {
                // Handle PDF file
                const newTab = window.open();
                newTab.document.write('<iframe width="100%" height="100%" src="' + d.preview + '"></iframe>');
            } else if (fileExtension === "png" || fileExtension === 'jpg') {
                const response = await fetch(d.preview);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                window.open(link, "_blank");
            }
            ;
            // Helper function to extract file extension from a filename
            function getFileExtension(filename) {
                return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
            }
            // Helper function to generate an HTML table from Excel data
            function generateHtmlTable(data) {
                const headers = Object.keys(data[0]);
                const tableHeader = `<tr>${headers.map((header) => `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`).join("")}</tr>`;
                const tableRows = data.map((row, index) => {
                    const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
                    const cells = headers.map((header) => `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`).join("");
                    return `<tr>${cells}</tr>`;
                });
                return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join("")}</table>`;
            }
        })
    };
    const gettingValues = async (newValue) => {
        if (newValue.length < 2) {
            setAcheivedAccuracyDetails((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
        }
        setPageName(!pageName)
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetails.project,
                // vendor: acheivedAccuracyDetails.vendor,
                queue: acheivedAccuracyDetails.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data.data.existinglist.map((data) => {
                if (data.mode === "Client") {
                    setAcheivedAccuracyDetails((prev) => ({
                        ...prev, clientstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetails((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })
        } catch (err) {
            setAcheivedAccuracyDetails((prev) => ({ ...prev, clientstatus: "", internalstatus: "" }))
        }
    }
    const gettingValuesEdit = async (newValue) => {
        if (newValue.length < 2) {
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
        }
        setPageName(!pageName)
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetailsEdit.project,
                // vendor: acheivedAccuracyDetailsEdit.vendor,
                queue: acheivedAccuracyDetailsEdit.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data.data.existinglist.map((data) => {
                if (data.mode === "Client") {
                    setAcheivedAccuracyDetailsEdit((prev) => ({
                        ...prev, clientstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetailsEdit((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })
        } catch (err) {
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
        }
    }

    const [selectedMode, setSelectedMode] = useState("Please Select Mode");
    const [selectedStatusMode, setSelectedStatusMode] = useState("Please Select Status Mode");
    const [acheivedAccuracyDetails, setAcheivedAccuracyDetails] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", minimumaccuracy: ""
    });
    const [selectedModeEdit, setSelectedModeEdit] = useState("Please Select Mode");
    const [selectedStatusModeEdit, setSelectedStatusModeEdit] = useState("Please Select Status Mode");
    const [acheivedAccuracyDetailsEdit, setAcheivedAccuracyDetailsEdit] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", minimumaccuracy: ""
    });
    const [queueOption, setQueueOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);
    const [queueOptionEdit, setQueueOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);
    const [vendorOptEdit, setVendoroptEdit] = useState([]);
    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setProjectopt(companyall);
            setProjectoptEdit(companyall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchVendorDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.vendormaster.filter((d) => d.projectname === e.value);
            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_' + d.name,
                value: d.projectname + '_' + d.name,
            }));
            setVendoropt(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchVendorDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.vendormaster.filter((d) => d.projectname === e);
            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_' + d.name,
                value: d.projectname + '_' + d.name,
            }));
            setVendoroptEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchQueueDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e.value);
            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));
            setQueueOption(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchQueueDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e);
            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));
            setQueueOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchMinimumaccuracy = async (e, project) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));
            setAcheivedAccuracyDetails((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchMinimumaccuracyEdit = async (e, project) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchProjectDropdowns();
    }, []);
    const [accuracyMasterFilterArray, setAccuracyMasterFilterArray] = useState([])
    const fetchAccuracyMasterArray = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ACHEIVEDACCURACYGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyMasterFilterArray(res_freq?.data?.acheivedaccuracy.map((item, index) => ({
                ...item,
                id: item._id,
                date: moment(item.date).format('DD-MM-YYYY'),
            })));
            setLoader(true);
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchAccuracyMasterArray()
    }, [isFilterOpen, isPdfFilterOpen])
    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [totalDatas, setTotalDatas] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)

        try {
            let res_employee = await axios.post(SERVICE.ACHEIVEDACCURACYGETALL_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const ansOveallData = res_employee?.data?.totalProjectsOveallData
                ?.length > 0 ? res_employee?.data?.totalProjectsOveallData?.map((item, index) => ({
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    // serialNumber: index + 1,
                }))
                : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            //   setcheckemployeelist(true);
            setAccuracyMasterArray(itemsWithSerialNumber);
            setOverallFilterdata(ansOveallData);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalDatas(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };
    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);
    //set function to get particular row
    const rowData = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let brandid = acheivedAccuracyDetailsEdit._id;
    const delBrand = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${brandid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //add function
    const sendRequest = async () => {
        handleCloseModSubmit()
        setBtnSubmit(true);
        setPageName(!pageName)
        try {
            await axios.post(SERVICE.ACHEIVEDACCURACY_CREATE, {
                date: String(acheivedAccuracyDetails.date),
                project: String(acheivedAccuracyDetails.project),
                vendor: String(acheivedAccuracyDetails.vendor),
                queue: String(acheivedAccuracyDetails.queue),
                acheivedaccuracy: acheivedAccuracyDetails.acheivedaccuracy,
                clientstatus: acheivedAccuracyDetails.clientstatus,
                internalstatus: acheivedAccuracyDetails.internalstatus,
                minimumaccuracy: acheivedAccuracyDetails.minimumaccuracy,
                files: [...upload],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchEmployee();
            setSelectedMode("Please Select Mode")
            setSelectedStatusMode("Please Select Status Mode")
            setAcheivedAccuracyDetails({ ...acheivedAccuracyDetails, date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", })
            setUpload([]);

            setBtnSubmit(false);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setBtnSubmit(false);
            if (err.response?.data?.message === "This Data is Already Exists!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (acheivedAccuracyDetails.date === "" || acheivedAccuracyDetails.date === undefined) {
            setPopupContentMalert("Please Fill the Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.project === 'Please Select Project') {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.vendor === 'Please Select Vendor') {
            setPopupContentMalert("Please Select Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.acheivedaccuracy === "" || acheivedAccuracyDetails.acheivedaccuracy === undefined) {
            setPopupContentMalert("Please Enter Achieved Accuracy Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setSelectedMode("Please Select Mode")
        setSelectedStatusMode("Please Select Status Mode")
        setAcheivedAccuracyDetails({
            date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", project: "Please Select Project",
            vendor: "Please Select Vendor", queue: "Please Select Queue", minimumaccuracy: ""
        })
        setUpload([]);
        setQueueOption([]);
        setVendoropt([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            fetchQueueDropdownsEdit(res?.data?.sacheivedaccuracy.project);
            fetchVendorDropdownsEdit(res?.data?.sacheivedaccuracy.project);
            setSelectedModeEdit(res?.data?.sacheivedaccuracy.mode)
            setSelectedStatusModeEdit(res?.data?.sacheivedaccuracy.statusmode)
            setUploadEdit(res?.data?.sacheivedaccuracy?.files);
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, date: moment(res?.data?.sacheivedaccuracy.date).format('YYYY-MM-DD'),
                project: res?.data?.sacheivedaccuracy.project, vendor: res?.data?.sacheivedaccuracy.vendor,
                queue: res?.data?.sacheivedaccuracy.queue, clientstatus: res?.data?.sacheivedaccuracy.clientstatus, internalstatus: res?.data?.sacheivedaccuracy.internalstatus, acheivedaccuracy: res.data.sacheivedaccuracy.acheivedaccuracy
            }))
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            setUploadView(res?.data?.sacheivedaccuracy.files);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //frequency master name updateby edit page...
    let updateby = acheivedAccuracyDetailsEdit.updatedby;
    let addedby = acheivedAccuracyDetailsEdit.addedby;
    let frequencyId = acheivedAccuracyDetailsEdit._id;
    //editing the single data...
    const sendEditRequest = async () => {
        // handleCloseModSubmit()       
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${frequencyId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: String(acheivedAccuracyDetailsEdit.date),
                project: String(acheivedAccuracyDetailsEdit.project),
                vendor: String(acheivedAccuracyDetailsEdit.vendor),
                queue: String(acheivedAccuracyDetailsEdit.queue),
                acheivedaccuracy: acheivedAccuracyDetailsEdit.acheivedaccuracy,
                clientstatus: acheivedAccuracyDetailsEdit.clientstatus,
                internalstatus: acheivedAccuracyDetailsEdit.internalstatus,
                minimumaccuracy: acheivedAccuracyDetailsEdit.minimumaccuracy,
                files: [...uploadEdit],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEdit();
            await fetchEmployee();
            handleCloseModSubmitEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            if (err.response?.data?.message === "This Data is Already Exists!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        if (acheivedAccuracyDetailsEdit.date === "" || acheivedAccuracyDetailsEdit.date === undefined) {
            setPopupContentMalert("Please Fill the Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.project === 'Please Select Project') {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.vendor === 'Please Select Vendor') {
            setPopupContentMalert("Please Select Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.acheivedaccuracy === "" || acheivedAccuracyDetailsEdit.acheivedaccuracy === undefined) {
            setPopupContentMalert("Please Enter Achieved Accuracy Value!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    const delAreagrpcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setIsHandleChange(false);
            setPage(1);
            await fetchEmployee();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Achieved Accuracy.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    let exportColumnNames = ["Date", "Project", "Vendor", "Queue", "Minimum Accuracy", "Achieved Accuracy", "Client Status", "Internal Status"];
    let exportRowValues = ["date", "project", "vendor", "queue", "minimumaccuracy", "acheivedaccuracy", "clientstatus", "internalstatus"];
    // get particular columns for export excel
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Achieved Accuracy",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
    };
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
        setPage(1);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerCheckboxSelection: true,
            checkboxSelection: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 200,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "vendor",
            headerName: "Vendor",
            flex: 0,
            width: 200,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "queue",
            headerName: "Queue",
            flex: 0,
            width: 200,
            hide: !columnVisibility.queue,
            headerClassName: "bold-header",
        },
        {
            field: "minimumaccuracy",
            headerName: "Minimum Accuracy",
            flex: 0,
            width: 200,
            hide: !columnVisibility.minimumaccuracy,
            headerClassName: "bold-header",
        },
        {
            field: "acheivedaccuracy",
            headerName: "Achieved Accuracy",
            flex: 0,
            width: 150,
            hide: !columnVisibility.acheivedaccuracy,
            headerClassName: "bold-header",
        },
        {
            field: "clientstatus",
            headerName: "Client Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.clientstatus,
            headerClassName: "bold-header",

        },
        {
            field: "internalstatus",
            headerName: "Internal Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.internalstatus,
            headerClassName: "bold-header",

        },
        {
            field: "referencetodo",
            headerName: "Documents",
            sortable: false,
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.referencetodo,

            cellRenderer: (params) => (
                <Grid>
                    <div className="page-pdf" textAlign={'center'}>
                        {params.data.referencetodo.length !== 0 ? <>
                            <Button variant="contained"
                                onClick={() => {
                                    getDownloadFile(params.data.referencetodo);
                                }}
                                className="next-pdf-btn pdf-button">
                                View
                            </Button>
                        </> : <><Button variant="contained" sx={{ background: "red", color: "white", width: "100%" }}
                            className="next-pdf-btn pdf-button">
                            {"NIL "}
                        </Button></>}
                    </div>
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eacheivedaccuracy") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dacheivedaccuracy") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vacheivedaccuracy") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iacheivedaccuracy") && (
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
            ),
        },
    ];
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            date: moment(item.date).format('DD-MM-YYYY'),
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            acheivedaccuracy: item.acheivedaccuracy + "%",
            clientstatus: item.clientstatus,
            internalstatus: item.internalstatus,
            minimumaccuracy: item.minimumaccuracy + " %",
            referencetodo: item.files

        };
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

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
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
                            {" "}
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
                            {" "}
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
            <Headtitle title={"ACHIEVED ACCURACY"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Achieved Accuracy"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Acheived Accuracy"
                subpagename=""
                subsubpagename=""
            />

            <>
                {isUserRoleCompare?.includes("aacheivedaccuracy") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Achieved Accuracy</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetails.date} onChange={(e) => {
                                            setAcheivedAccuracyDetails((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.project,
                                                value: acheivedAccuracyDetails.project,
                                            }}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor", minimumaccuracy: ""
                                                });
                                                fetchQueueDropdowns(e);
                                                fetchVendorDropdowns(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.vendor,
                                                value: acheivedAccuracyDetails.vendor,
                                            }}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    vendor: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOption}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.queue,
                                                value: acheivedAccuracyDetails.queue,
                                            }}
                                            onChange={(e) => {
                                                fetchMinimumaccuracy(e, acheivedAccuracyDetails.project);
                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetails((prev) => ({ ...prev, acheivedaccuracy: "", clientstatus: "", internalstatus: "" }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Minimum Accuracy
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={acheivedAccuracyDetails.minimumaccuracy}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Achieved Accuracy %<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            inputProps={{
                                                min: 0,
                                                max: 100,
                                                step: 0.01,
                                                pattern: "\\d*\\.?\\d{0,2}"
                                            }}
                                            placeholder="Please Enter Percentage"
                                            value={acheivedAccuracyDetails.acheivedaccuracy}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Check if the new value matches the allowed pattern
                                                const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue); // Update the regex
                                                if (isValid) {
                                                    setAcheivedAccuracyDetails(prev => ({
                                                        ...prev,
                                                        acheivedaccuracy: newValue
                                                    }));
                                                    gettingValues(newValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                lg={2}
                                md={2}
                                xs={12}
                                sm={12}
                                sx={{ marginTop: "20px" }}
                            ><Typography>
                                    Documents
                                </Typography>
                                <br></br>
                                <Button sx={buttonStyles.buttonsubmit} size="small" component="label">
                                    Upload
                                    <input
                                        type="file"
                                        id="resume"
                                        multiple
                                        accept=".pdf, .doc, .txt,.jpg,.png"
                                        name="file"
                                        hidden
                                        onChange={handleResumeUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid
                                item
                                lg={6}
                                md={6}
                                xs={12}
                                sm={12}
                                sx={{ marginTop: "20px" }}
                            >
                                {upload?.length > 0 &&
                                    upload.map((file, index) => (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon
                                                        style={{
                                                            fontsize: "large",
                                                            color: "#357AE8",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => renderFilePreview(file)}
                                                    />
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <Button
                                                        style={{
                                                            fontsize: "large",
                                                            color: "#357AE8",
                                                            cursor: "pointer",
                                                            marginTop: "-5px",
                                                        }}
                                                        onClick={() => handleFileDelete(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                            </Grid>
                            <br />
                            <br />
                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <LoadingButton loading={btnSubmit} sx={buttonStyles.buttonsubmit} loadingIndicator={<LinearProgress color="success" />} variant="contained" color="primary" onClick={handleSubmit}>
                                        Submit
                                    </LoadingButton>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lacheivedaccuracy") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>List Achieved Accuracy</Typography>
                            </Grid>
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
                                            <MenuItem value={totalProjects}>All</MenuItem>
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
                                        {isUserRoleCompare?.includes("excelacheivedaccuracy") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAccuracyMasterArray()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvacheivedaccuracy") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAccuracyMasterArray()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printacheivedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfacheivedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        fetchAccuracyMasterArray()
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageacheivedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={accuracyMasterArray}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={overallFilterdata} />
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
                            {isUserRoleCompare?.includes("bdacheivedaccuracy") && (
                                <>
                                    <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                        Bulk Delete
                                    </Button>
                                </>
                            )}
                            <br />
                            <br />
                            {!loader ? (
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
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
                                        gridRefTable={gridRefTable}
                                        paginated={true}
                                        filteredDatas={filteredDatas}
                                        totalDatas={totalDatas}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={overallFilterdata}
                                    />
                                </>
                            )}
                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )
            }
            {/* ****** Table End ****** */}
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
            {/*Submit ALERT DIALOG */}
            <Dialog open={isSubmit} onClose={handleCloseModSubmit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Submit Edit ALERT DIALOG */}
            <Dialog open={isSubmitEdit} onClose={handleCloseModSubmitEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmitEdit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendEditRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{marginTop:'50px'}}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Achieved Accuracy</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(acheivedAccuracyDetailsEdit.date).format('DD-MM-YYYY')}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Minimum Accuracy</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.minimumaccuracy} %`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Achieved Accuracy</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.acheivedaccuracy} %`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Client Status</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.clientstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Internal Status</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.internalstatus}`}</Typography>
                                </FormControl>
                            </Grid>
                            {uploadView?.length > 0 &&
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    xs={12}
                                    sm={12}
                                    sx={{ marginTop: "20px" }}
                                >
                                    <Typography variant="h6">Documents</Typography>
                                    {uploadView?.length > 0 &&
                                        uploadView.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => renderFilePreviewView(file)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            }
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'auto',
                    },
                    marginTop:'50px'
                }}>
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Achieved Accuracy</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetailsEdit.date} onChange={(e) => {
                                            setAcheivedAccuracyDetailsEdit((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.project,
                                                value: acheivedAccuracyDetailsEdit.project,
                                            }}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor", minimumaccuracy: ""
                                                });
                                                fetchQueueDropdownsEdit(e.value);
                                                fetchVendorDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.vendor,
                                                value: acheivedAccuracyDetailsEdit.vendor,
                                            }}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    vendor: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.queue,
                                                value: acheivedAccuracyDetailsEdit.queue,
                                            }}
                                            onChange={(e) => {
                                                fetchMinimumaccuracyEdit(e, acheivedAccuracyDetailsEdit.project)
                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetailsEdit((prev) => ({
                                                    ...prev, acheivedaccuracy: "", clientstatus: "", internalstatus: ""
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Minimum Accuracy
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={acheivedAccuracyDetailsEdit.minimumaccuracy}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Achieved Accuracy %<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid className="expected-accuracy">
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={acheivedAccuracyDetailsEdit.acheivedaccuracy}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setAcheivedAccuracyDetailsEdit(prev => ({
                                                            ...prev,
                                                            acheivedaccuracy: newValue
                                                        }));
                                                        gettingValuesEdit(newValue)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    lg={2}
                                    md={12}
                                    xs={12}
                                    sm={12}
                                    sx={{ marginTop: "20px" }}
                                >
                                    <Typography>
                                        Documents
                                    </Typography>
                                    <Button sx={buttonStyles.buttonsubmit} size="small" component="label">
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            multiple
                                            accept=".pdf, .doc, .txt,.jpg,.png"
                                            name="file"
                                            hidden
                                            onChange={handleResumeUploadEdit}
                                        />
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    xs={12}
                                    sm={12}
                                    sx={{ marginTop: "10px" }}
                                >
                                    {uploadEdit?.length > 0 &&
                                        uploadEdit.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => renderFilePreviewEdit(file)}
                                                        />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                                marginTop: "-5px",
                                                            }}
                                                            onClick={() => handleFileDeleteEdit(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={accuracyMasterFilterArray ?? []}
                filename={"Achieved Accuracy"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Achieved Accuracy Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delBrand}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAreagrpcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
        </Box >
    );
}

export default AcheivedAccuray;
