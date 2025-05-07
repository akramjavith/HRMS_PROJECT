import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { MultiSelect } from "react-multi-select-component";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import 'jspdf-autotable';
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from '../../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from "@mui/lab/LoadingButton";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import { AUTH, BASE_URL } from "../../../services/Authservice";
import InfoPopup from "../../../components/InfoPopup.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function ApprovalDocumentsForUser() {
    const pathname = window.location.pathname;
    const gridRefTable = useRef(null);
    const [searchedString, setSearchedString] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [loader, setLoader] = useState(false);
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
    };

    let exportColumnNames = [
        'Approval Status',
        'Approved Date',
        'Approved By',
        'Approved Sent Date',
        'Date ',
        'Reference No',
        'Template No',
        'Template',
        'EmployeeMode',
        'Department',
        'Company',
        'Branch',
        'Unit',
        'Team',
        'Person',
        'Issued Person Details',
        'Issuing Authority'
    ];
    let exportRowValues = [
        'approval',
        'approveddate',
        'approvedby',
        'approvalsentdate',
        'date',
        'referenceno',
        'templateno',
        'template',
        'employeemode',
        'department',
        'company',
        'branch',
        'unit',
        'team',
        'person',
        'issuedpersondetails',
        'issuingauthority'
    ];
    const [approvalTemplates, setApprovalTemplates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [isBtn, setIsBtn] = useState(false);
    const [overallExcelDatas, setOverallExcelDatas] = useState([])
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('');


    const [templateValues, setTemplateValues] = useState([]);
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
        setTemplateValues([]);
        setValueTemplate([]);
        setSelectedOptionsApproveStatus([])
        setValueApproveStatus([])
        setSelectedOptionsTemplate([]);
        setSelectedOptionsBranch([]);
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
        const values = options.map((a, index) => {
            return a.value;
        })
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueTemplate([]);
        setSelectedOptionsTemplate([]);
        TemplateDropdowns(valueCompanyCat, values)
    };
    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };


    //branch multiselect
    const [selectedOptionsTemplate, setSelectedOptionsTemplate] = useState([]);
    let [valueTemplate, setValueTemplate] = useState([]);
    const handleTemplateChange = (options) => {
        const values = options.map((a, index) => {
            return a.tempname;
        })
        setValueTemplate(values);
        setSelectedOptionsTemplate(options);

    };
    const customValueRendererTemplate = (valueTemplate, _categoryname) => {
        return valueTemplate?.length
            ? valueTemplate?.map(({ label }) => label)?.join(", ")
            : "Please Select Document";
    };

    const [selectedOptionsApproveStatus, setSelectedOptionsApproveStatus] = useState([]);
    let [valueApproveStatus, setValueApproveStatus] = useState([]);
    const handleApproveStatusChange = (options) => {
        setValueApproveStatus(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsApproveStatus(options);
    };
    const customValueRendererApproveStatus = (valueApproveStatus, _categoryname) => {
        return valueApproveStatus?.length
            ? valueApproveStatus.map(({ label }) => label)?.join(", ")
            : "Please Select Approve Status";
    };
    const handleAutoSelect = async () => {
        setPageName(!pageName);
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
            TemplateDropdowns(selectedCompany, selectedBranch);

        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    const TemplateDropdowns = async (company, branch) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.APPROVAL_EMPLOYEE_TEMPLATECREATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch
            });
            const templateValues = res?.data?.templates?.length > 0 ? res?.data?.templates : [];
            setTemplateValues(
                templateValues?.map((data) => ({
                    label: `${data.documentname}--(${data.company}--${data.branch})`,
                    value: `${data.documentname}--(${data.company}--${data.branch})`,
                    tempname: `${data.name}--(${data.company}--${data.branch})`,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Human Resource/HR Documents/Approval User Documents"),
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

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Approval Documents For User.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
            setRowIdPassing([])
            setIsDeleteOpencheckbox(false);
            setIsDeleteOpenalert(false);
        } else {
            const itemsId = items
                ?.filter(data =>
                    selectedRows?.includes(data.id) &&
                    !["Sent to Approval", "Approved"]?.includes(data.approval)
                )
                .map(data => data.id);
            if (itemsId?.length === 0) {
                setIsDeleteOpenalert(true);
                setIsDeleteOpencheckbox(false);
                setRowIdPassing([])
            } else {
                setSelectedRows(itemsId)
                setRowIdPassing(itemsId)
                setIsDeleteOpencheckbox(true);
            }

        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
        setRowIdPassing([])
        setIsDeleteOpencheckbox(false);
    };


    //Delete model]
    const today = new Date().toISOString().split('T')[0];
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [rowIdPassing, setRowIdPassing] = useState([]);
    const [endDate, setEndDate] = useState("");

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
        setStartDate("")
        setEndDate("")
    };

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        if (selectedStartDate < today) {
            alert('Start date should be greater than today’s date.');
            return;
        }
        setStartDate(selectedStartDate);

        // Ensure end date is always greater than start date
        if (endDate && selectedStartDate >= endDate) {
            setEndDate('');  // Reset end date if invalid
        }
    };

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        if (selectedEndDate <= startDate) {
            alert('End date should be greater than start date.');
            return;
        }
        setEndDate(selectedEndDate);
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

    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        referenceno: true,
        templateno: true,
        template: true,
        employeemode: true,
        department: true,
        company: true,
        printingstatus: true,
        branch: true,
        unit: true,
        team: true,
        person: true,
        head: true,
        foot: true,
        headvaluetext: true,
        email: true,
        document: true,
        issuedpersondetails: true,
        issuingauthority: true,
        actions: true,
        approval: true,
        approveddate: true,
        approvedby: true,
        approvalsentdate: true,
        viewdocument: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteControlgrp, setControlgrp] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.CONTROLSGROUPING_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setControlgrp(res?.data?.scontrolsgrouping);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsCompany?.length < 1) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsBranch?.length < 1) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsTemplate?.length < 1) {
            setPopupContentMalert("Please Select Document");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsApproveStatus?.length < 1) {
            setPopupContentMalert("Please Select Approval Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            // sendRequest();
            fetchAppprovalTemplateDocuments();
        }
    }
    const handleSubmitDates = (e) => {
        e.preventDefault();

        if (startDate === "" || startDate === undefined) {
            setPopupContentMalert("Please Select Start Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (endDate === "" || endDate === undefined) {
            setPopupContentMalert("Please Select End Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            getApprovalDocument(rowIdPassing);
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setApprovalTemplates([]);
        setSelectedOptionsTemplate([]);
        setSelectedOptionsBranch([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setValueCompanyCat([]);
        setSelectedOptionsApproveStatus([]);
        setValueApproveStatus([]);
        setValueTemplate([]);
        setTemplateValues([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //get all Sub vendormasters.
    const fetchAppprovalTemplateDocuments = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.post(SERVICE.APPROVAL_EMPLOYEE_DOCUMENTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                template: valueTemplate,
                approval: valueApproveStatus
            });
            setLoader(true);
            const answer = res_vendor?.data?.documentPreparation?.length > 0 ? res_vendor?.data?.documentPreparation?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item?._id,
                department: item?.department === "Please Select Department" ? "" : item?.department,
                company: item.company === "Please Select Company" ? "" : item.company,
                branch: item.branch === "Please Select Branch" ? "" : item.branch,
                unit: item.unit === "Please Select Unit" ? "" : item.unit,
                team: item.team === "Please Select Team" ? "" : item.team,
                date: moment(item.date).format("DD-MM-YYYY"),
                approveddate: item?.approval === "approved" ? moment(item.approveddate).format("DD-MM-YYYY hh:mm:ss a") : "-",
                approvalsentdate: item?.approval === "sentforapproval" ? moment(item.approvalsentdate).format("DD-MM-YYYY") : "-",
                approval: item?.approval === "sentforapproval" ? "Sent to Approval" : item?.approval === "approved" ? "Approved" : "Not yet sent",

            })) : [];
            setApprovalTemplates(answer);
            setLoader(false);
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Approval Documents For User',
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
    useEffect(() => {
        addSerialNumber(approvalTemplates);
    }, [approvalTemplates]);



    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        const itemsWithSerialNumber = data?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }



    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setRowIdPassing([])
        setSelectAllChecked(false)
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setRowIdPassing([])
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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );

    const checkingData = (selectedIds) => {
        const itemsId = items
            ?.filter(data =>
                selectedIds?.includes(data.id) &&
                !["Sent to Approval", "Approved"]?.includes(data.approval)
            )
            .map(data => data.id);
        if (itemsId?.length > 0) {
            setIsDeleteOpencheckbox(true);
            setRowIdPassing(itemsId)
        } else {
            setRowIdPassing([])
            setIsDeleteOpencheckbox(false);
        }


    }

    //get single row to edit....
    const getApprovalDocument = async (selectedIds) => {
        setPageName(!pageName);
        setLoader(true)
        try {
            if (selectedIds?.length > 0) {
                // Create an array of axios PUT requests
                const updateRequests = selectedIds.map(data =>
                    axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${data}`, {
                        approval: "sentforapproval",
                        approvalstartdate: startDate,
                        approvalenddate: endDate,
                        approvalsentdate: new Date(),
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    })
                );

                // Wait for all requests to complete
                await Promise.all(updateRequests);
                await fetchAppprovalTemplateDocuments();
                setLoader(false)
                handleCloseModcheckbox();
                setSelectedRows([]);
                setRowIdPassing([])
                setStartDate("");
                setEndDate("");

            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const getViewFile = async (id) => {

        let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const fileUrl = `${BASE_URL}/uploadsDocuments/${response?.data?.sdocumentPreparation.approvedfilename}`;
        window.open(fileUrl, '_blank');
    }
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            //lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            //lockPinned: true,
        },
        {
            field: "approval",
            headerName: "Approval Status",
            flex: 0,
            width: 220,
            minHeight: "40px",
            hide: !columnVisibility.approval,
            pinned: "left",
            cellRenderer: (params) => (
                <Grid>
                    {
                        params?.data?.approval === "Sent to Approval" ?
                            <Typography color="#009688" marginTop={1.5}>Sent to approval</Typography>
                            :
                            params?.data?.approval === "Approved" ?
                                <Typography color="#4caf50" marginTop={1.5}>Approved</Typography> :
                                <Button
                                    variant="contained"
                                    color={"warning"}
                                    onClick={() => {
                                        checkingData([params.data.id])
                                    }}
                                    sx={userStyle.buttonview}
                                >
                                    Send to Acceptance
                                </Button>
                    }

                </Grid>
            ),
        },
        {
            field: "approveddate",
            headerName: "Approved Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.approveddate,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "approvedby",
            headerName: "Approved By",
            flex: 0,
            width: 100,
            hide: !columnVisibility.approvedby,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "viewdocument",
            headerName: "View Document",
            flex: 0,
            width: 220,
            minHeight: "40px",
            hide: !columnVisibility.viewdocument,
            pinned: "left",
            cellRenderer: (params) => (
                <Grid>
                    {
                        params?.data?.approval === "Approved" &&
                        <Button
                            variant="contained"
                            color={"warning"}
                            onClick={() => {
                                // checkingData([params.data.id])
                                getViewFile(params?.data?.id)
                            }}
                            sx={userStyle.buttonview}
                        >
                            View
                        </Button>
                    }

                </Grid>
            ),
        },
        {
            field: "approvalsentdate",
            headerName: "Approval Sent Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.approvalsentdate,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "referenceno",
            headerName: "Reference No",
            flex: 0,
            width: 150,
            hide: !columnVisibility.referenceno,
            headerClassName: "bold-header",
        },
        {
            field: "templateno",
            headerName: "Template No",
            flex: 0,
            width: 150,
            hide: !columnVisibility.templateno,
            headerClassName: "bold-header",
        },
        {
            field: "template",
            headerName: "Template",
            flex: 0,
            width: 150,
            hide: !columnVisibility.template,
            headerClassName: "bold-header",
        },
        {
            field: "employeemode",
            headerName: "Employee Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeemode,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "person",
            headerName: "Person",
            flex: 0,
            width: 150,
            hide: !columnVisibility.person,
            headerClassName: "bold-header",
        },
        {
            field: "issuedpersondetails",
            headerName: "Issued Person Details",
            flex: 0,
            width: 150,
            hide: !columnVisibility.issuedpersondetails,
            headerClassName: "bold-header",
        },
        {
            field: "issuingauthority",
            headerName: "Issuing Authority",
            flex: 0,
            width: 150,
            hide: !columnVisibility.issuingauthority,
            headerClassName: "bold-header",
        },
    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            date: item.date,
            approval: item.approval,
            approvalsentdate: item.approvalsentdate,
            approveddate: item.approveddate,
            approvedby: item.approvedby,
            referenceno: item.referenceno,
            templateno: item.templateno,
            template: item.template,
            mail: item.mail,
            printingstatus: item.printingstatus,
            employeemode: item.employeemode,
            department: item.department,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            person: item.person,
            issuedpersondetails: item.issuedpersondetails,
            issuingauthority: item.issuingauthority,
            daystatus: item.daystatus,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
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
    // controls
    const controls = [
        { label: "Menu", value: "Menu" },
        { label: "Add", value: "Add" },
        { label: "Edit", value: "Edit" },
        { label: "List", value: "List" },
        { label: "Info", value: "Info" },
        { label: "Delete", value: "Delete" },
        { label: "View", value: "View" },
        { label: "PDF", value: "PDF" },
        { label: "Print", value: "Print" },
        { label: "Excel", value: "Excel" },
        { label: "CSV", value: "CSV" },
        { label: "Image", value: "Image" },
        { label: "BulkEdit", value: "BulkEdit" },
        { label: "BulkDelete", value: "BulkDelete" },
    ];

    return (
        <Box>
            <Headtitle title={'APPROVAL USER DOCUMENTS'} />
            <PageHeading
                title="Approval User Documents"
                modulename="Human Resources"
                submodulename="HR Documents"
                mainpagename="Employee Documents"
                subpagename="Approval User Documents"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lapprovaluserdocuments")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Approval User Documents List</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
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
                                                                    i.label === item.label &&
                                                                    i.value === item.value
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
                                    {/* Branch Unit Team */}
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
                                                Document Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={templateValues}
                                                value={selectedOptionsTemplate}
                                                onChange={(e) => {
                                                    handleTemplateChange(e);
                                                }}
                                                valueRenderer={customValueRendererTemplate}
                                                labelledBy="Please Select Document"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Approval Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl size="small" fullWidth>
                                            <MultiSelect
                                                options={[
                                                    { label: "Sent For Approval", value: "sentforapproval" },
                                                    { label: "Not Yet Sent", value: "notyetsent" },
                                                    { label: "Approved", value: "approved" },
                                                ]}
                                                value={selectedOptionsApproveStatus}
                                                onChange={(e) => {
                                                    handleApproveStatusChange(e);
                                                }}
                                                valueRenderer={customValueRendererApproveStatus}
                                                labelledBy="Please Select Approval Status"
                                            />
                                        </FormControl>
                                    </Grid>








                                    <Grid item md={4} xs={12} sm={12} sx={{ marginTop: "25px" }}>
                                        <Grid container spacing={3}>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <LoadingButton loading={isBtn} onClick={(e) => handleSubmit(e)} variant='contained' sx={buttonStyles.buttonsubmit} >Filter</LoadingButton>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </>
                        </Box>
                    </>
                )}

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lapprovaluserdocuments") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Approval User Documents List</Typography>
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
                                        <MenuItem value={items?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelapprovaluserdocuments") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvapprovaluserdocuments") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printapprovaluserdocuments") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfapprovaluserdocuments") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}

                                    {isUserRoleCompare?.includes("imageapprovaluserdocuments") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={approvalTemplates}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={items}
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
                        {isUserRoleCompare?.includes("beapprovaluserdocuments") && (
                            <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
                                Send to Acceptance
                            </Button>
                        )}
                        &ensp;
                        <br />
                        <br />
                        {loader ?
                            <>
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
                            </>
                            :
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                        // totalDatas={totalProjects}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={items}
                                    />

                                    {/* <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick /> */}
                                </Box>
                            </>
                        }

                    </Box>
                </>
            )}
            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "450px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange", }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            The documents have been sent for employee approval. Please select a start and end date for notifications.
                        </Typography>
                        <br />
                    </DialogContent>
                    <DialogContent sx={{ alignItems: "center" }}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" type="date" value={startDate} onChange={handleStartDateChange} inputProps={{ min: today }} />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" type="date" value={endDate} onChange={handleEndDateChange} inputProps={{ min: startDate || today }} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained"
                            onClick={(e) => handleSubmitDates(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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


            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={approvalTemplates ?? []}
                filename={"Approval Documents For User"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />
        </Box>
    );
}


export default ApprovalDocumentsForUser;