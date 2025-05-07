import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Badge, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../../components/SearchbarEbList';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function ShiftFinalListTable({ allUsersShiftFinal, allFinalAdj, daysArray, overAllDepartment, valueDep }) {

    const gridRefTableFinalAdj = useRef(null);
    const gridRefImageFinalAdj = useRef(null);

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [items, setItems] = useState([]);

    // State to track advanced filter
    const [advancedFilterFinalAdj, setAdvancedFilterFinalAdj] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItemsFinalAdjLast, setFilteredDataItemsFinalAdjLast] = useState(allUsersShiftFinal);
    const [filteredRowDataFinalAdj, setFilteredRowData] = useState([]);

    // Datatable Set Table
    const [pageFinalAdj, setPageFinalAdj] = useState(1);
    const [pageSizeFinalAdj, setPageSizeFinalAdj] = useState(10);
    const [searchQueryFinalAdj, setSearchQueryFinalAdj] = useState("");
    const [totalPagesFinalAdj, setTotalPagesFinalAdj] = useState(1);

    const [isFilterOpenFinalAdj, setIsFilterOpenFinalAdj] = useState(false);
    const [isPdfFilterOpenFinalAdj, setIsPdfFilterOpenFinalAdj] = useState(false);
    // page refersh reload
    const handleCloseFilterModFinalAdj = () => { setIsFilterOpenFinalAdj(false); };
    const handleClosePdfFilterModFinalAdj = () => { setIsPdfFilterOpenFinalAdj(false); };

    // Manage Columns
    const [searchQueryManageFinalAdj, setSearchQueryManageFinalAdj] = useState("");
    const [isManageColumnsOpenFinalAdj, setManageColumnsOpenFinalAdj] = useState(false);
    const [anchorElFinalAdj, setAnchorElFinalAdj] = useState(null);

    const handleOpenManageColumnsFinalAdj = (event) => {
        setAnchorElFinalAdj(event.currentTarget);
        setManageColumnsOpenFinalAdj(true);
    };
    const handleCloseManageColumnsFinalAdj = () => {
        setManageColumnsOpenFinalAdj(false);
        setSearchQueryManageFinalAdj("");
    };

    const openFinalAdj = Boolean(anchorElFinalAdj);
    const idFinalAdj = openFinalAdj ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchFinalAdj, setAnchorElSearchFinalAdj] = React.useState(null);
    const handleClickSearchFinalAdj = (event) => {
        setAnchorElSearchFinalAdj(event.currentTarget);
    };
    const handleCloseSearchFinalAdj = () => {
        setAnchorElSearchFinalAdj(null);
        setSearchQueryFinalAdj("");
    };

    const openSearchFinalAdj = Boolean(anchorElSearchFinalAdj);
    const idSearchFinalAdj = openSearchFinalAdj ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    const getRowHeight = (params) => {
        // Find the item with adjstatus === 'Double Shift' in params.days array
        const doubleShiftDay = params.node.data.shiftallot && params.node.data.shiftallot.find(allot => allot.adjustmenttype === 'Add On Shift' || allot.adjustmenttype === 'Shift Adjustment');

        // If found, return the desired row height
        if (doubleShiftDay) {
            return 70; // Adjust this value as needed
        }

        // Return null to use default row height for other rows
        return 50;
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

    const formatDate = (inputDate) => {
        if (!inputDate) {
            return "";
        }
        // Assuming inputDate is in the format "dd-mm-yyyy"
        const [day, month, year] = inputDate?.split('/');

        // // Use padStart to add leading zeros
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    // shiftfinallist
    const getShiftForDateFinal = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, matchingRemovedItem, matchingAssignShiftItem) => {

        // if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
        //     return (
        //         <Box sx={{
        //             textTransform: 'capitalize',
        //             borderRadius: '4px',
        //             boxShadow: 'none',
        //             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //             fontWeight: '400',
        //             fontSize: '0.675rem',
        //             lineHeight: '1.43',
        //             letterSpacing: '0.01071em',
        //             display: 'flex',
        //             padding: '3px 10px',
        //             color: 'white',
        //             backgroundColor: 'red',
        //         }}>{"Pending..."}</Box>
        //     );
        // }
        // else
        if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="success" badgeContent={"Adjusted"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(156 239 156)',
                        }}>
                            {matchingDoubleShiftItem.todateshiftmode}
                        </Box>
                    </Badge>
                </Box>
            )
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="success" badgeContent={"Adjusted"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(156 239 156)',
                        }}>
                            {matchingDoubleShiftItem.todateshiftmode}
                        </Box>
                    </Badge>
                </Box>
            )
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
            // return '';
            if (matchingAssignShiftItem && matchingDoubleShiftItem.todate === matchingAssignShiftItem.adjdate) {
                return (
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                        }
                    }}>
                        <Badge color="success" badgeContent={"Adjusted"}
                            anchorOrigin={{
                                vertical: 'top', horizontal: 'right',
                            }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.575rem',
                                lineHeight: '1.2',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#052106',
                                backgroundColor: 'rgb(156 239 156)',
                            }}>
                                {`${matchingDoubleShiftItem.adjchangeshiftime.split(' - ')[0]}to${matchingDoubleShiftItem.adjchangeshiftime.split(' - ')[1]}`}
                            </Box>
                        </Badge>
                    </Box>
                )
            }
            else {
                return (
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                        }
                    }}>
                        <Badge color="success" badgeContent={"Adjusted"}
                            anchorOrigin={{
                                vertical: 'top', horizontal: 'right',
                            }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: 'white',
                                backgroundColor: 'red',
                            }}>{"Not Allotted"}</Box>
                        </Badge>
                    </Box>
                )
            }
        }
        else if (matchingRemovedItem && matchingRemovedItem.adjstatus === 'Not Allotted') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="error" badgeContent={"Removed"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: 'white',
                            backgroundColor: 'red',
                        }}>{"Not Allotted"}</Box>
                    </Badge>
                </Box>
            )
        }
        else if (matchingItem && matchingItem.adjstatus === 'Approved' && matchingItem.adjustmenttype === "Assign Shift") {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                    }
                }}>
                    <Badge color="success" badgeContent={"Adjusted"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.575rem',
                            lineHeight: '1.2',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(156 239 156)',
                        }}>
                            {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                        </Box>
                    </Badge>
                </Box>
            )
        }
        // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
        //     return (
        //         isWeekOffWithAdjustment ?
        //             <>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                     }
        //                 }}>
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.675rem',
        //                             lineHeight: '1.43',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //             </>
        //             :
        //             <>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                     }
        //                 }}>
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.675rem',
        //                             lineHeight: '1.43',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //             </>
        //     )
        // }

        // before add bulk update based condition 
        else if (matchingItem && matchingItem.adjstatus === 'Approved') {
            return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
                (
                    <>
                        <Box sx={{
                            '& .MuiBadge-badge': {
                                right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                            }
                        }}> <b>Main Shift :</b><br />
                            <Badge color="success" badgeContent={"Adjusted"}
                                anchorOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                            >
                                <Box sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.2',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: '3px 8px',
                                    color: '#052106',
                                    backgroundColor: 'rgb(156 239 156)',
                                }}>
                                    {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                </Box>
                            </Badge>
                        </Box>
                        <Box sx={{
                            '& .MuiBadge-badge': {
                                right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                            }
                        }}><b>{`${matchingItem.secondmode} :`}</b><br />
                            <Badge color="success" badgeContent={"Adjusted"}
                                anchorOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                            >
                                <Box sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.2',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: '3px 8px',
                                    color: '#052106',
                                    backgroundColor: 'rgb(156 239 156)',
                                }}>
                                    {`${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
                                </Box>
                            </Badge>
                        </Box>
                    </>
                ) :
                (
                    isWeekOffWithAdjustment ?
                        <>
                            <Box sx={{
                                '& .MuiBadge-badge': {
                                    right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                                }
                            }}>
                                <Badge color="success" badgeContent={"Adjusted"}
                                    anchorOrigin={{
                                        vertical: 'top', horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#052106',
                                        backgroundColor: 'rgb(156 239 156)',
                                    }}>
                                        {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                    </Box>
                                </Badge>
                            </Box>
                        </>
                        :
                        <>
                            <Box sx={{
                                '& .MuiBadge-badge': {
                                    right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                                }
                            }}>
                                <Badge color="success" badgeContent={"Adjusted"}
                                    anchorOrigin={{
                                        vertical: 'top', horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#052106',
                                        backgroundColor: 'rgb(156 239 156)',
                                    }}>
                                        {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                    </Box>
                                </Badge>
                            </Box>

                        </>
                )
        }

        // // after add bulk update based on the change shift option
        // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
        //     const adjShiftTime = matchingItem.adjchangeshiftime === "Week Off"
        //         ? "Week Off"
        //         : matchingItem.adjchangeshiftime.includes(' - ')
        //             ? `${matchingItem.adjchangeshiftime.split(' - ')[0]} to ${matchingItem.adjchangeshiftime.split(' - ')[1]}`
        //             : matchingItem.adjchangeshiftime;

        //     const plusShiftTime = matchingItem.pluseshift && matchingItem.pluseshift.includes(' - ')
        //         ? `${matchingItem.pluseshift.split(' - ')[0]} to ${matchingItem.pluseshift.split(' - ')[1]}`
        //         : matchingItem.pluseshift || '';

        //     return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap')
        //         ? (
        //             <>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
        //                     }
        //                 }}> <b>Main Shift :</b><br />
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.575rem',
        //                             lineHeight: '1.2',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {adjShiftTime}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
        //                     }
        //                 }}><b>{`${matchingItem.secondmode} :`}</b><br />
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.575rem',
        //                             lineHeight: '1.2',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {plusShiftTime}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //             </>
        //         ) : (
        //             isWeekOffWithAdjustment
        //                 ? (
        //                     <>
        //                         <Box sx={{
        //                             '& .MuiBadge-badge': {
        //                                 right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                             }
        //                         }}>
        //                             <Badge color="success" badgeContent={"Adjusted"}
        //                                 anchorOrigin={{
        //                                     vertical: 'top', horizontal: 'right',
        //                                 }}
        //                             >
        //                                 <Box sx={{
        //                                     textTransform: 'capitalize',
        //                                     borderRadius: '4px',
        //                                     boxShadow: 'none',
        //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                                     fontWeight: '400',
        //                                     fontSize: '0.675rem',
        //                                     lineHeight: '1.43',
        //                                     letterSpacing: '0.01071em',
        //                                     display: 'flex',
        //                                     padding: '3px 8px',
        //                                     color: '#052106',
        //                                     backgroundColor: 'rgb(156 239 156)',
        //                                 }}>
        //                                     {adjShiftTime}
        //                                 </Box>
        //                             </Badge>
        //                         </Box>
        //                     </>
        //                 ) : (
        //                     <>
        //                         <Box sx={{
        //                             '& .MuiBadge-badge': {
        //                                 right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                             }
        //                         }}>
        //                             <Badge color="success" badgeContent={"Adjusted"}
        //                                 anchorOrigin={{
        //                                     vertical: 'top', horizontal: 'right',
        //                                 }}
        //                             >
        //                                 <Box sx={{
        //                                     textTransform: 'capitalize',
        //                                     borderRadius: '4px',
        //                                     boxShadow: 'none',
        //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                                     fontWeight: '400',
        //                                     fontSize: '0.675rem',
        //                                     lineHeight: '1.43',
        //                                     letterSpacing: '0.01071em',
        //                                     display: 'flex',
        //                                     padding: '3px 8px',
        //                                     color: '#052106',
        //                                     backgroundColor: 'rgb(156 239 156)',
        //                                 }}>
        //                                     {adjShiftTime}
        //                                 </Box>
        //                             </Badge>
        //                         </Box>
        //                     </>
        //                 )
        //         );
        // }

        else if (matchingItemAllot && matchingItemAllot.status === 'Manual') {
            return (
                isWeekOffWithManual ?
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                        }
                    }}>
                        <Badge color="warning" badgeContent={"Manual"}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#052106',
                                backgroundColor: 'rgb(243 203 117)',
                            }}>
                                {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
                            </Box>
                        </Badge>
                    </Box>
                    :
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                        }
                    }}>
                        <Badge color="warning" badgeContent={"Manual"}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#052106',
                                backgroundColor: 'rgb(243 203 117)',
                            }}>
                                {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
                            </Box>
                        </Badge>
                    </Box>
            )
        }
        else if (matchingItemAllot && matchingItemAllot.status === 'Week Off') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="warning" badgeContent={"Manual"}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 10px',
                            color: '#892a23',
                            backgroundColor: 'rgb(243 174 174)',
                        }}>{"Week Off"}</Box>
                    </Badge>
                </Box>
            );
        }

        // else if (boardingLog.length > 0) {
        //     if (!recentShiftTimingDate) {
        //         return '';
        //     }

        //     const [year, month, day] = recentShiftTimingDate?.split('-');


        //     // Map through each column and compare dates
        //     const shifts = daysArray.map((currentColumn) => {

        //         // const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
        //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
        //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
        //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
        //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);
        //         // if (year >= year1 && month >= month1 && day > day1) {
        //         if (shiftFormattedDate >= columnFormattedDate) {
        //             return (
        //                 !isWeekOff ?
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 8px',
        //                         color: '#183e5d',
        //                         backgroundColor: 'rgb(166 210 245)',
        //                     }}>{shifttiming}</Box>
        //                     :
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 10px',
        //                         color: '#892a23',
        //                         backgroundColor: 'rgb(243 174 174)',
        //                     }}>{"Week Off"}</Box>
        //             )
        //         } else {
        //             return (
        //                 !isWeekOff ?
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 8px',
        //                         color: '#183e5d',
        //                         backgroundColor: 'rgb(166 210 245)',
        //                     }}>{recentShiftTiming}</Box>
        //                     :
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 10px',
        //                         color: '#892a23',
        //                         backgroundColor: 'rgb(243 174 174)',
        //                     }}>{"Week Off"}</Box>
        //             )
        //         }
        //     });

        //     // Return the shift value for the current column
        //     return shifts[column.dayCount - 1];
        // } 
        // before add shifttype condition working code
        // else if (boardingLog?.length > 0) {
        //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
        //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

        //     // Filter boardingLog entries for the same start date
        //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

        //     // If there are entries for the date, return the shift timing of the second entry
        //     if (entriesForDate.length > 1) {
        //         return (
        //             <Box sx={{
        //                 textTransform: 'capitalize',
        //                 borderRadius: '4px',
        //                 boxShadow: 'none',
        //                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                 fontWeight: '400',
        //                 fontSize: '0.675rem',
        //                 lineHeight: '1.43',
        //                 letterSpacing: '0.01071em',
        //                 display: 'flex',
        //                 padding: '3px 8px',
        //                 color: '#183e5d',
        //                 backgroundColor: 'rgb(166 210 245)',
        //             }}>{entriesForDate[1].shifttiming}</Box>
        //         )
        //     }

        //     // Find the most recent boarding log entry that is less than or equal to the selected date
        //     const recentLogEntry = boardingLog
        //         .filter(log => log.startdate < finalDate)
        //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        //     // If a recent log entry is found, return its shift timing
        //     if (recentLogEntry) {
        //         return (
        //             !isWeekOff ?
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 8px',
        //                     color: '#183e5d',
        //                     backgroundColor: 'rgb(166 210 245)',
        //                 }}>{recentLogEntry.shifttiming}</Box>
        //                 :
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 10px',
        //                     color: '#892a23',
        //                     backgroundColor: 'rgb(243 174 174)',
        //                 }}>{"Week Off"}</Box>
        //         )
        //     } else {
        //         return (
        //             !isWeekOff ?
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 8px',
        //                     color: '#183e5d',
        //                     backgroundColor: 'rgb(166 210 245)',
        //                 }}>{shifttiming}</Box>
        //                 :
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 10px',
        //                     color: '#892a23',
        //                     backgroundColor: 'rgb(243 174 174)',
        //                 }}>{"Week Off"}</Box>
        //         )
        //     }
        // }


        else if (boardingLog.length > 0) {

            // Remove duplicate entries with recent entry
            const uniqueEntries = {};
            boardingLog.forEach(entry => {
                const key = entry.startdate;
                if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                    uniqueEntries[key] = entry;
                }
            });
            const uniqueBoardingLog = Object.values(uniqueEntries);

            const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
            const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;


            // Find the relevant log entry for the given date     
            const relevantLogEntry = uniqueBoardingLog
                .filter(log => log.startdate <= finalDate)
                .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

            const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

            if (relevantLogEntry) {
                // Daily
                if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                    // If shift type is 'Daily', return the same shift timing for each day                    
                    return (
                        !logWeekOff ?
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#183e5d',
                                backgroundColor: 'rgb(166 210 245)',
                            }}>{relevantLogEntry.shifttiming}</Box>
                            :
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 10px',
                                color: '#892a23',
                                backgroundColor: 'rgb(243 174 174)',
                            }}>{"Week Off"}</Box>
                    )
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === 'Daily') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

                // 2 Week Rotation 2nd try working code  
                if (relevantLogEntry.shifttype === '1 Week Rotation') {
                    const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                    // Get the day name of the start date
                    const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                    // Calculate the day count until the next Sunday
                    let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                    // Calculate the week number based on the day count
                    let weekNumber = Math.ceil((7 - dayCount) / 7);

                    // Adjust the week number considering the two-week rotation
                    const logStartDate = new Date(relevantLogEntry.startdate);
                    const currentDate = new Date(finalDate);

                    const diffTime = Math.abs(currentDate - logStartDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                    // Determine the final week based on the calculated week number                    
                    const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

                // 1 Month Rotation 1st try working code
                if (relevantLogEntry.shifttype === '2 Week Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    // Calculate month lengths
                    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    const currentDate = new Date(finalDate);

                    // Determine the effective month for the start date
                    let effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    // Calculate total days for 1-month rotation based on the effective month
                    let totalDays = monthLengths[effectiveMonth];

                    // Set the initial endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }

                    // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        // Set startDate to the next matchingDepartment.fromdate for each cycle
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month for the next cycle
                        effectiveMonth = startDate.getMonth();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                        }

                        totalDays = monthLengths[effectiveMonth];

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                        // Adjust February for leap years
                        if (isLeapYear(endDate.getFullYear())) {
                            monthLengths[1] = 29;
                        }
                    }

                    // Calculate the difference in days correctly
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                    // Calculate the week number within the rotation month based on 7-day intervals from start date
                    // const weekNumber = Math.ceil(diffDays / 7);
                    let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                    const weekNames = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week",
                        // "7th Week",
                        // "8th Week",
                        // "9th Week",
                    ];
                    const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

                // 2 Month Rotation               
                if (relevantLogEntry.shifttype === '1 Month Rotation') {
                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    const currentDate = new Date(finalDate);

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    // Calculate month lengths with leap year check for a given year
                    const calculateMonthLengths = (year) => {
                        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    };

                    // Determine the effective month and year for the start date
                    let effectiveMonth = startDate.getMonth();
                    let effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1; // Move to the next year if month resets
                        }
                    }

                    // Calculate total days for the current two-month cycle
                    let totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Recalculate if currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month and year for the next cycle
                        effectiveMonth = startDate.getMonth();
                        effectiveYear = startDate.getFullYear();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                            if (effectiveMonth === 0) {
                                effectiveYear += 1;
                            }
                        }

                        totalDays = 0;
                        for (let i = 0; i < 2; i++) {
                            const monthIndex = (effectiveMonth + i) % 12;
                            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                            const currentYear = effectiveYear + yearAdjustment;
                            const monthLengthsForYear = calculateMonthLengths(currentYear);
                            totalDays += monthLengthsForYear[monthIndex];
                        }

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                    }

                    // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                    // Calculate the difference in days including the start date
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                    let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                    // Define week names for first and second month of the cycle
                    const weekNamesFirstMonth = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week"
                    ];

                    const weekNamesSecondMonth = [
                        "7th Week",
                        "8th Week",
                        "9th Week",
                        "10th Week",
                        "11th Week",
                        "12th Week"
                    ];

                    // Determine which month we are in
                    const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                    let finalWeek;

                    if (diffDays <= daysInFirstMonth) {
                        // We're in the first month of the cycle
                        weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                        finalWeek = weekNamesFirstMonth[weekNumber - 1];
                    } else {
                        // We're in the second month of the cycle
                        const secondMonthDay = diffDays - daysInFirstMonth;

                        // Calculate week number based on Monday-Sunday for the second month
                        const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                        const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                        const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                        const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                        finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                    }

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

            }
        }
    };

    const getWeekOffDay = (column, boardingLog, department) => {
        if (boardingLog.length > 0) {

            // Remove duplicate entries with recent entry
            const uniqueEntries = {};
            boardingLog.forEach(entry => {
                const key = entry.startdate;
                if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                    uniqueEntries[key] = entry;
                }
            });
            const uniqueBoardingLog = Object.values(uniqueEntries);

            const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
            const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

            // Find the relevant log entry for the given date     
            const relevantLogEntry = uniqueBoardingLog
                .filter(log => log.startdate <= finalDate)
                .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

            const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

            if (relevantLogEntry) {

                // Daily
                if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                    // If shift type is 'Daily', return the same shift timing for each day
                    //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                    return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === 'Daily') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 2 Week Rotation 2nd try working code  
                if (relevantLogEntry.shifttype === '1 Week Rotation') {
                    const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                    // Get the day name of the start date
                    const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                    // Calculate the day count until the next Sunday
                    let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                    // Calculate the week number based on the day count
                    let weekNumber = Math.ceil((7 - dayCount) / 7);

                    // Adjust the week number considering the two-week rotation
                    const logStartDate = new Date(relevantLogEntry.startdate);
                    const currentDate = new Date(finalDate);

                    const diffTime = Math.abs(currentDate - logStartDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                    // Determine the final week based on the calculated week number                    
                    const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                //just 2wk rotation
                if (relevantLogEntry.shifttype === '2 Week Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    // Calculate month lengths
                    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    const currentDate = new Date(finalDate);

                    // Determine the effective month for the start date
                    let effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    // Calculate total days for 1-month rotation based on the effective month
                    let totalDays = monthLengths[effectiveMonth];

                    // Set the initial endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }

                    // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        // Set startDate to the next matchingDepartment.fromdate for each cycle
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month for the next cycle
                        effectiveMonth = startDate.getMonth();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                        }

                        totalDays = monthLengths[effectiveMonth];

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                        // Adjust February for leap years
                        if (isLeapYear(endDate.getFullYear())) {
                            monthLengths[1] = 29;
                        }
                    }

                    // Calculate the difference in days correctly
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                    // Calculate the week number within the rotation month based on 7-day intervals from start date
                    // const weekNumber = Math.ceil(diffDays / 7);
                    let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                    const weekNames = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week",
                        "7th Week",
                        "8th Week",
                        "9th Week",
                    ];
                    const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }

                //just 1mont rota             
                // if (relevantLogEntry.shifttype === '1 Month Rotation') {
                //     // Find the matching department entry
                //     const matchingDepartment = overAllDepartment.find(
                //         (dep) =>
                //             dep.department === department &&
                //             new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                //             new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                //     );

                //     // Use the fromdate of the matching department as the startDate
                //     let startDate = matchingDepartment
                //         ? new Date(matchingDepartment.fromdate)
                //         : new Date(relevantLogEntry.startdate);

                //     const currentDate = new Date(finalDate);

                //     // Calculate month lengths
                //     const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                //     // Function to determine if a year is a leap year
                //     const isLeapYear = (year) => {
                //         return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                //     };

                //     // Determine the effective month for the start date
                //     let effectiveMonth = startDate.getMonth();
                //     if (startDate.getDate() > 15) {
                //         // Consider the next month if the start date is after the 15th
                //         effectiveMonth = (effectiveMonth + 1) % 12;
                //     }

                //     let totalDays = 0;

                //     // Calculate total days for 2-month rotation based on the effective month
                //     for (let i = 0; i < 2; i++) {
                //         const monthIndex = (effectiveMonth + i) % 12;
                //         totalDays += monthLengths[monthIndex];
                //     }

                //     // Set the initial endDate by adding totalDays to the startDate
                //     let endDate = new Date(startDate);
                //     endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                //     // Adjust February for leap years
                //     if (isLeapYear(endDate.getFullYear())) {
                //         monthLengths[1] = 29;
                //     }

                //     // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                //     while (currentDate > endDate) {
                //         startDate = new Date(endDate);
                //         startDate.setDate(startDate.getDate() + 1); // Move to the next day

                //         // Determine the new effective month for the next cycle
                //         effectiveMonth = startDate.getMonth();
                //         if (startDate.getDate() > 15) {
                //             effectiveMonth = (effectiveMonth + 1) % 12;
                //         }

                //         totalDays = 0;
                //         for (let i = 0; i < 2; i++) {
                //             const monthIndex = (effectiveMonth + i) % 12;
                //             totalDays += monthLengths[monthIndex];
                //         }

                //         // Set the new endDate by adding totalDays to the new startDate
                //         endDate = new Date(startDate);
                //         endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                //         // Adjust February for leap years
                //         if (isLeapYear(endDate.getFullYear())) {
                //             monthLengths[1] = 29;
                //         }
                //     }

                //     // Calculate the difference in days including the start date
                //     const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                //     // Determine the start day of the first week
                //     let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                //     // Adjust the start day so that Monday is considered the start of the week
                //     let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                //     // Calculate the week number based on Monday to Sunday cycle
                //     let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                //     let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                //     // Define week names for first and second month of the cycle
                //     const weekNamesFirstMonth = [
                //         "1st Week",
                //         "2nd Week",
                //         "3rd Week",
                //         "4th Week",
                //         "5th Week",
                //         "6th Week"
                //     ];

                //     const weekNamesSecondMonth = [
                //         "7th Week",
                //         "8th Week",
                //         "9th Week",
                //         "10th Week",
                //         "11th Week",
                //         "12th Week"
                //     ];

                //     // Determine which month we are in
                //     const daysInFirstMonth = monthLengths[effectiveMonth];
                //     let finalWeek;

                //     if (diffDays <= daysInFirstMonth) {
                //         // We're in the first month of the cycle
                //         weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                //         finalWeek = weekNamesFirstMonth[weekNumber - 1];
                //     } else {
                //         // We're in the second month of the cycle
                //         const daysInSecondMonth = totalDays - daysInFirstMonth;
                //         const secondMonthDay = diffDays - daysInFirstMonth;

                //         // Calculate week number based on Monday-Sunday for the second month
                //         const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                //         const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                //         const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                //         const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                //         finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                //     }

                //     // console.log({
                //     //     startDate,
                //     //     currentDate,
                //     //     endDate,
                //     //     diffTime,
                //     //     diffDays,
                //     //     weekNumber,
                //     //     finalWeek,
                //     // });

                //     for (const data of relevantLogEntry.todo) {
                //         if (data.week === finalWeek && data.day === column.dayName) {
                //             return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                //         }
                //     }
                // }
                if (relevantLogEntry.shifttype === '1 Month Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    const currentDate = new Date(finalDate);

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    // Calculate month lengths with leap year check for a given year
                    const calculateMonthLengths = (year) => {
                        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    };

                    // Determine the effective month and year for the start date
                    let effectiveMonth = startDate.getMonth();
                    let effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1; // Move to the next year if month resets
                        }
                    }

                    // Calculate total days for the current two-month cycle
                    let totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Recalculate if currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month and year for the next cycle
                        effectiveMonth = startDate.getMonth();
                        effectiveYear = startDate.getFullYear();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                            if (effectiveMonth === 0) {
                                effectiveYear += 1;
                            }
                        }

                        totalDays = 0;
                        for (let i = 0; i < 2; i++) {
                            const monthIndex = (effectiveMonth + i) % 12;
                            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                            const currentYear = effectiveYear + yearAdjustment;
                            const monthLengthsForYear = calculateMonthLengths(currentYear);
                            totalDays += monthLengthsForYear[monthIndex];
                        }

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                    }

                    // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                    // Calculate the difference in days including the start date
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                    let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                    // Define week names for first and second month of the cycle
                    const weekNamesFirstMonth = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week"
                    ];

                    const weekNamesSecondMonth = [
                        "7th Week",
                        "8th Week",
                        "9th Week",
                        "10th Week",
                        "11th Week",
                        "12th Week"
                    ];

                    // Determine which month we are in
                    const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                    let finalWeek;

                    if (diffDays <= daysInFirstMonth) {
                        // We're in the first month of the cycle
                        weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                        finalWeek = weekNamesFirstMonth[weekNumber - 1];
                    } else {
                        // We're in the second month of the cycle
                        const secondMonthDay = diffDays - daysInFirstMonth;

                        // Calculate week number based on Monday-Sunday for the second month
                        const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                        const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                        const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                        const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                        finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                    }

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }
            }
        }
    }

    const [columnVisibilityFinalAdj, setColumnVisibilityFinalAdj] = useState({});

    const addSerialNumberShiftFinal = () => {
        const itemsWithSerialNumberFinal = allUsersShiftFinal?.flatMap((item, index) => {

            // Map days for the user
            const days = daysArray.map((column, index) => {
                let filteredRowDataFinalAdj = item.shiftallot?.filter((val) => val.empcode == item.empcode);
                const matchingItem = filteredRowDataFinalAdj?.find(item => item.adjdate === column.formattedDate);
                const matchingItemAllot = filteredRowDataFinalAdj?.find(item => formatDate(item.date) === column.formattedDate);
                const matchingDoubleShiftItem = filteredRowDataFinalAdj?.find(item => item.todate === column.formattedDate);
                const matchingRemovedItem = filteredRowDataFinalAdj?.find(item => item.removedshiftdate === column.formattedDate);
                const matchingAssignShiftItem = filteredRowDataFinalAdj?.find(item => item.adjdate === column.formattedDate && item.adjstatus === 'Approved' && item.adjustmenttype === 'Assign Shift');

                const filterBoardingLog = item.boardingLog && item.boardingLog?.filter((item) => {
                    return item.logcreation === "user" || item.logcreation === "shift";
                });

                const [day, month, year] = column.formattedDate.split('/');
                const finalDate = `${year}-${month}-${day}`;

                const uniqueEntriesDep = {};
                item.departmentlog?.forEach(entry => {
                    const key = entry.startdate;
                    if (!(key in uniqueEntriesDep)) {
                        uniqueEntriesDep[key] = entry;
                    }
                });
                const uniqueDepLog = Object.values(uniqueEntriesDep);

                const relevantDepLogEntry = uniqueDepLog
                    .filter(log => log.startdate <= finalDate)
                    .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

                const isWeekOff = getWeekOffDay(column, filterBoardingLog, (relevantDepLogEntry && relevantDepLogEntry.department)) === "Week Off" ? true : false;
                const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                const shiftsname = getShiftForDateFinal(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, (relevantDepLogEntry && relevantDepLogEntry.department), matchingRemovedItem, matchingAssignShiftItem);

                return {
                    id: `${item._id}_${column.formattedDate}_${index}`,
                    date: column.formattedDate,
                    adjstatus: matchingItem ?
                        (matchingItem.adjstatus === "Reject" ?
                            (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                    (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                            (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                matchingItem.adjstatus === "Adjustment" ? 'Adjustment' :
                                    matchingRemovedItem.adjstatus === "Not Allotted" ? 'Not Allotted' :
                                        (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                        (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                            matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                (isWeekOffWithManual ? "Manual" :
                                    (isWeekOffWithAdjustment ? 'Adjustment' :
                                        (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                                            (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                                                (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? 'Not Allotted' :
                                                    (isWeekOff ? 'Week Off' : 'Adjustment'))))))),

                    shiftlabel: shiftsname,
                    empCode: item.empcode,
                    depstatus: ((relevantDepLogEntry && relevantDepLogEntry.startdate) === finalDate) ? 'Department Changed' : '',
                    depstartdate: relevantDepLogEntry && relevantDepLogEntry.startdate,
                    department: (relevantDepLogEntry && relevantDepLogEntry.department)
                };
            });

            // Combine department logs where the department is the same
            const combinedDepartmentLog = [];
            let lastDepLog = null;

            item.departmentlog?.forEach(depLog => {
                if (lastDepLog && lastDepLog.department === depLog.department) {
                    // Continue the last department log if the department matches
                    lastDepLog.enddate = depLog.startdate;
                } else {
                    // Push the previous log and start a new one
                    if (lastDepLog) {
                        combinedDepartmentLog.push(lastDepLog);
                    }
                    lastDepLog = { ...depLog };
                }
            });

            // Push the last department log if it's not already added
            if (lastDepLog) {
                combinedDepartmentLog.push(lastDepLog);
            }

            // Group days by department and create a row for each group
            const rows = [];
            const addedDepartments = new Set();

            combinedDepartmentLog.forEach(depLog => {
                const group = days.filter(day => day.department === depLog.department);

                if (group.length > 0 && !addedDepartments.has(depLog.department)) {
                    addedDepartments.add(depLog.department);

                    rows.push({
                        ...item,
                        id: `${item._id}_${rows.length}`,
                        // serialNumber: index + 1 + (rows.length > 0 ? 0.1 * rows.length : 0),
                        department: depLog.department,
                        days: daysArray.map(column => {
                            const matchingDay = group.find(day => day.date === column.formattedDate);
                            return matchingDay || {
                                date: column.formattedDate,
                                empCode: item.empcode,
                                depstartdate: '',
                                department: ''
                            };
                        })
                    });
                }
            });

            return rows;
        });
        let resultFinal = valueDep.length > 0 ?
            (itemsWithSerialNumberFinal.filter((data) => valueDep.includes(data.department)).map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: `${item._id}_${index}`,
                userid: item._id,
                username: item.companyname,
                days: item.days,
            })))
            : (itemsWithSerialNumberFinal?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: `${item._id}_${index}`,
                userid: item._id,
                username: item.companyname,
                days: item.days,
            })));
        setFilteredDataItemsFinalAdjLast(resultFinal);
        setItems(resultFinal);
        setColumnVisibilityFinalAdj({
            serialNumber: true,
            checkbox: true,
            empcode: true,
            username: true,
            department: true,
            branch: true,
            unit: true,
            ...daysArray.reduce((acc, day) => {
                acc[`${day.formattedDate} ${day.dayName} Day${day.dayCount}`] = true;
                return acc;
            }, {}),
        });
    }

    useEffect(() => {
        addSerialNumberShiftFinal();
    }, [allUsersShiftFinal])

    // Show All Columns & Manage Columns
    const initialColumnVisibilityFinalAdj = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        username: true,
        department: true,
        branch: true,
        unit: true,
        ...daysArray.reduce((acc, day, index) => {
            acc[`${day.formattedDate} ${day.dayName} Day${day.dayCount}`] = true;
            return acc;
        }, {}),
    };

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReadyFinalAdj = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChangedFinalAdj = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataFinalAdj = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataFinalAdj.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredDataFinalAdj);
            }
        }
    };

    const onPaginationChangedFinalAdj = useCallback(() => {
        if (gridRefTableFinalAdj.current) {
            const gridApi = gridRefTableFinalAdj.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesFinalAdj = gridApi.paginationGetTotalPages();
            setPageFinalAdj(currentPage);
            setTotalPagesFinalAdj(totalPagesFinalAdj);
        }
    }, []);

    const columnDataTableFinalAdj = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityFinalAdj.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Name", flex: 0, width: 250, hide: !columnVisibilityFinalAdj.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "department", headerName: "Department", flex: 0, width: 200, hide: !columnVisibilityFinalAdj.department, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.unit, headerClassName: "bold-header", },
        ...daysArray.map((column, index) => {
            const [formatday1, fromatmonth1, formatyear1] = column.formattedDate?.split('/');
            const formattedDateNew = new Date(`${formatyear1}-${fromatmonth1}-${formatday1}`);
            return {
                field: `${column.formattedDate} ${column.dayName} Day${column.dayCount}`,
                headerName: `${column.formattedDate} ${column.dayName} Day${column.dayCount}`,
                hide: !columnVisibilityFinalAdj[`${column.formattedDate} ${column.dayName} Day${column.dayCount}`],
                flex: 0,
                width: 150,
                filter: false,
                sortable: false,
                cellRenderer: (params) => {
                    const dayData = params.data.days?.find(day => day.date === column.formattedDate);
                    if (!dayData) {
                        return null; // or return a default component
                    }
                    const reasonDate = new Date(params.data.reasondate);
                    // const dojDate = new Date(params.data.doj);
                    const userDoj = params.data?.boardingLog.length > 0 ?
                        params.data?.boardingLog[0].startdate
                        : params.data?.doj
                    const dojDate = new Date(userDoj);
                    const isDisable1 = formattedDateNew < dojDate
                    const isDisable2 = formattedDateNew > reasonDate

                    if (params.data.reasondate && params.data.reasondate != "" && formattedDateNew > reasonDate) {
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Button
                                        size="small"
                                        sx={{
                                            textTransform: 'capitalize',
                                            borderRadius: '4px',
                                            boxShadow: 'none',
                                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                            fontWeight: '400',
                                            fontSize: '0.575rem',
                                            lineHeight: '1.43',
                                            letterSpacing: '0.01071em',
                                            display: 'flex',
                                            padding: '3px 10px',
                                            color: 'black',
                                            backgroundColor: 'rgba(224, 224, 224, 1)',
                                            pointerEvents: 'none',

                                        }}
                                        // Disable the button if the date is before the current date
                                        disabled={isDisable2}
                                    >
                                        {params.data.resonablestatus}
                                    </Button>
                                </Box>
                            </Grid >
                        );
                    }
                    else if (params.data.doj && params.data.doj != "" && formattedDateNew < dojDate) {
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Button
                                        size="small"
                                        sx={{
                                            textTransform: 'capitalize',
                                            borderRadius: '4px',
                                            boxShadow: 'none',
                                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                            fontWeight: '400',
                                            fontSize: '0.575rem',
                                            lineHeight: '1.43',
                                            letterSpacing: '0.01071em',
                                            display: 'flex',
                                            padding: '3px 10px',
                                            color: 'black',
                                            backgroundColor: 'rgba(224, 224, 224, 1)',
                                            pointerEvents: 'none',

                                        }}
                                        // Disable the button if the date is before the current date
                                        disabled={isDisable1}
                                    >
                                        {"Not Joined"}
                                    </Button>
                                </Box>
                            </Grid >
                        );
                    }
                    else if (params.data.doj && params.data.doj != "" && formattedDateNew >= dojDate) {
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Typography variant="body2" sx={{ fontSize: '9px', color: '#2E073F', fontWeight: 'bold' }}>
                                        {dayData?.depstatus}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                        {dayData?.shiftlabel}
                                    </Typography>
                                </Box>
                            </Grid>
                        )
                    }
                },
            }
        }),
    ];

    // Datatable
    const handleSearchChangeFinalAdj = (e) => {
        const value = e.target.value;
        setSearchQueryFinalAdj(value);
        applyNormalFilterFinalAdj(value);
        setFilteredRowData([]);
    };

    const applyNormalFilterFinalAdj = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsFinalAdjLast(filtered);
        setPageFinalAdj(1);
    };

    const applyAdvancedFilterFinalAdj = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        setFilteredDataItemsFinalAdjLast(filtered); // Update filtered data
        setAdvancedFilterFinalAdj(filters);
        // handleCloseSearchFinalAdj(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearchFinalAdj = () => {
        setAdvancedFilterFinalAdj(null);
        setSearchQueryFinalAdj("");
        setFilteredDataItemsFinalAdjLast(items);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayFinalAdj = () => {
        if (advancedFilterFinalAdj && advancedFilterFinalAdj.length > 0) {
            return advancedFilterFinalAdj.map((filter, index) => {
                let showname = columnDataTableFinalAdj.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterFinalAdj.length > 1 ? advancedFilterFinalAdj[1].condition : '') + ' ');
        }
        return searchQueryFinalAdj;
    };

    const handlePageChangeFinalAdj = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesFinalAdj) {
            setPageFinalAdj(newPage);
            gridRefTableFinalAdj.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeFinalAdj = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeFinalAdj(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsFinalAdj = () => {
        const updatedVisibility = { ...columnVisibilityFinalAdj };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityFinalAdj(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityFinalAdj");
        if (savedVisibility) {
            setColumnVisibilityFinalAdj(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityFinalAdj", JSON.stringify(columnVisibilityFinalAdj));
    }, [columnVisibilityFinalAdj]);

    // // Function to filter columns based on search query
    const filteredColumnsFinalAdj = columnDataTableFinalAdj.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFinalAdj.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibilityFinalAdj = (field) => {
        if (!gridApi) return;

        setColumnVisibilityFinalAdj((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMovedFinalAdj = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityFinalAdj((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisibleFinalAdj = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityFinalAdj((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Pagination for innter filter
    const getVisiblePageNumbersFinalAdj = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageFinalAdj - 1);
        const endPage = Math.min(totalPagesFinalAdj, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageFinalAdj numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageFinalAdj, show ellipsis
        if (endPage < totalPagesFinalAdj) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredDataFinalAdj = filteredDataItemsFinalAdjLast?.slice((pageFinalAdj - 1) * pageSizeFinalAdj, pageFinalAdj * pageSizeFinalAdj);
    const totalPagesFinalAdjOuter = Math.ceil(filteredDataItemsFinalAdjLast?.length / pageSizeFinalAdj);
    const visiblePages = Math.min(totalPagesFinalAdjOuter, 3);
    const firstVisiblePage = Math.max(1, pageFinalAdj - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesFinalAdjOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageFinalAdj * pageSizeFinalAdj;
    const indexOfFirstItem = indexOfLastItem - pageSizeFinalAdj;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    // Excel
    const fileNameFinalAdj = "Shift Final List";
    const [fileFormatFinalAdj, setFormatFinalAdj] = useState('');
    const fileTypeFinalAdj = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionFinalAdj = fileFormatFinalAdj === "xl" ? '.xlsx' : '.csv';
    const exportToCSVFinalAdj = (csvData, fileNameFinalAdj) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeFinalAdj });
        FileSaver.saveAs(data, fileNameFinalAdj + fileExtensionFinalAdj);
    }

    const handleExportXLFinalAdj = (isfilter) => {
        // Define the table headers
        const headers = [
            'SNo',
            'Emp Code',
            'Name',
            'Department',
            'Branch',
            'Unit',
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day${column.dayCount}`),
        ];

        const extractTextFromReactElement = (element) => {
            if (!element) return ''; // Return empty string if element is null/undefined

            // If element is a string or number, return it directly
            if (typeof element === 'string' || typeof element === 'number') {
                return element;
            }

            // If it's a React element, recursively extract text from its children
            if (React.isValidElement(element)) {
                const children = element.props?.children;

                if (Array.isArray(children)) {
                    // If there are multiple children, recursively extract text from all of them
                    return children.map(child => extractTextFromReactElement(child)).join(' ');
                } else {
                    // If there's only one child, process it
                    return extractTextFromReactElement(children);
                }
            }

            // If the element is an object but not a React element, return an empty string
            if (typeof element === 'object') {
                return ''; // Or handle it in some other way if needed
            }

            // Fallback case for any other types (e.g., functions or symbols)
            return element.toString();
        };

        let data = [];
        let resultdataFinalAdj = (filteredRowDataFinalAdj.length > 0 ? filteredRowDataFinalAdj : filteredDataFinalAdj)

        if (isfilter === "filtered") {
            data = resultdataFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
                    }),
                ];
            });
        } else if (isfilter === "overall") {
            data = items?.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
                    }),
                ];
            });
        }

        // Add headers to the data array
        const formattedData = data.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Export to CSV
        exportToCSVFinalAdj(formattedData, fileNameFinalAdj);
        setIsFilterOpenFinalAdj(false);
    };

    // print...
    const componentRefSetTable = useRef();
    const handleprintFinalAdj = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Shift Final List",
        pageStyle: "print",
    });

    const downloadPdfFinalAdj = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = [
            'SNo',
            'Emp Code',
            'Name',
            'Department',
            'Branch',
            'Unit',
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day${column.dayCount}`),
        ];

        const extractTextFromReactElement = (element) => {
            if (!element) return ''; // Return empty string if element is null/undefined

            // If element is a string or number, return it directly
            if (typeof element === 'string' || typeof element === 'number') {
                return element;
            }

            // If it's a React element, recursively extract text from its children
            if (React.isValidElement(element)) {
                const children = element.props?.children;

                if (Array.isArray(children)) {
                    // If there are multiple children, recursively extract text from all of them
                    return children.map(child => extractTextFromReactElement(child)).join(' ');
                } else {
                    // If there's only one child, process it
                    return extractTextFromReactElement(children);
                }
            }

            // If the element is an object but not a React element, return an empty string
            if (typeof element === 'object') {
                return ''; // Or handle it in some other way if needed
            }

            // Fallback case for any other types (e.g., functions or symbols)
            return element.toString();
        };

        let data = [];
        let resultdataFinalAdj = (filteredRowDataFinalAdj.length > 0 ? filteredRowDataFinalAdj : filteredDataFinalAdj)

        if (isfilter === "filtered") {
            data = resultdataFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
                    }),
                ];
            });
        } else {
            data = items?.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
                    }),
                ];
            });
        }

        // Split data into chunks to fit on pages
        const columnsPerSheet = 10; // Number of columns per sheet
        const chunks = [];

        for (let i = 0; i < headers.length; i += columnsPerSheet) {
            const chunkHeaders = headers.slice(i, i + columnsPerSheet);
            const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

            chunks.push({ headers: chunkHeaders, data: chunkData });
        }

        chunks.forEach((chunk, index) => {
            if (index > 0) {
                doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
            }

            doc.autoTable({
                theme: "grid",
                styles: { fontSize: 8 },
                head: [chunk.headers],
                body: chunk.data,
                startY: 20, // Adjust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Adjust margin as needed
            });
        });

        doc.save("Shift Final List.pdf");
    };

    // image
    const handleCaptureImageFinalAdj = () => {
        if (gridRefImageFinalAdj.current) {
            domtoimage.toBlob(gridRefImageFinalAdj.current)
                .then((blob) => {
                    saveAs(blob, "Shift Final List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Shift List</Typography>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftadjustment") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Shift List</Typography>
                        </Grid>
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeFinalAdj}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeFinalAdj}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={allUsersShiftFinal?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenFinalAdj(true)
                                                setFormatFinalAdj("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenFinalAdj(true)
                                                setFormatFinalAdj("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintFinalAdj}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenFinalAdj(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFinalAdj}>
                                                {" "} <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilterFinalAdj && (
                                                    <IconButton onClick={handleResetSearchFinalAdj}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchFinalAdj} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplayFinalAdj()}
                                        onChange={handleSearchChangeFinalAdj}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilterFinalAdj}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFinalAdj}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFinalAdj}> Manage Columns  </Button><br /><br />
                        {allFinalAdj ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageFinalAdj} >
                                    <AgGridReact
                                        rowData={filteredDataItemsFinalAdjLast}
                                        columnDefs={columnDataTableFinalAdj.filter((column) => columnVisibilityFinalAdj[column.field])}
                                        ref={gridRefTableFinalAdj}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        getRowHeight={getRowHeight}
                                        pagination={true}
                                        paginationPageSize={pageSizeFinalAdj}
                                        onPaginationChanged={onPaginationChangedFinalAdj}
                                        onGridReady={onGridReadyFinalAdj}
                                        onColumnMoved={handleColumnMovedFinalAdj}
                                        onColumnVisible={handleColumnVisibleFinalAdj}
                                        onFilterChanged={onFilterChangedFinalAdj}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* show and hide based on the inner filter and outer filter */}
                                {/* <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                (filteredDataItemsFinalAdj.length > 0 ? (pageFinalAdj - 1) * pageSizeFinalAdj + 1 : 0)
                                            ) : (
                                                filteredRowDataFinalAdj.length > 0 ? (pageFinalAdj - 1) * pageSizeFinalAdj + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageFinalAdj * pageSizeFinalAdj, filteredDataItemsFinalAdj.length)
                                            ) : (
                                                filteredRowDataFinalAdj.length > 0 ? Math.min(pageFinalAdj * pageSizeFinalAdj, filteredRowDataFinalAdj.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItemsFinalAdj.length
                                            ) : (
                                                filteredRowDataFinalAdj.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeFinalAdj(1)} disabled={pageFinalAdj === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChangeFinalAdj(pageFinalAdj - 1)} disabled={pageFinalAdj === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbersFinalAdj().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChangeFinalAdj(pageNumber)}
                                                sx={{
                                                    ...userStyle.paginationbtn,
                                                    ...(pageNumber === "..." && {
                                                        cursor: "default",
                                                        color: "black",
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        "&:hover": {
                                                            backgroundColor: "transparent",
                                                            boxShadow: "none",
                                                        },
                                                    }),
                                                }}
                                                className={pageFinalAdj === pageNumber ? "active" : ""}
                                                disabled={pageFinalAdj === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChangeFinalAdj(pageFinalAdj + 1)} disabled={pageFinalAdj === totalPagesFinalAdj} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChangeFinalAdj(totalPagesFinalAdj)} disabled={pageFinalAdj === totalPagesFinalAdj} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        }
                    </Box>
                </>
            )}  <br />

            {/* Manage Column */}
            <Popover
                id={idFinalAdj}
                open={isManageColumnsOpenFinalAdj}
                anchorElFinalAdj={anchorElFinalAdj}
                onClose={handleCloseManageColumnsFinalAdj}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsFinalAdj}
                    searchQuery={searchQueryManageFinalAdj}
                    setSearchQuery={setSearchQueryManageFinalAdj}
                    filteredColumns={filteredColumnsFinalAdj}
                    columnVisibility={columnVisibilityFinalAdj}
                    toggleColumnVisibility={toggleColumnVisibilityFinalAdj}
                    setColumnVisibility={setColumnVisibilityFinalAdj}
                    initialColumnVisibility={initialColumnVisibilityFinalAdj}
                    columnDataTable={columnDataTableFinalAdj}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchFinalAdj}
                open={openSearchFinalAdj}
                anchorEl={anchorElSearchFinalAdj}
                onClose={handleCloseSearchFinalAdj}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableFinalAdj.filter(data => !daysArray.some(column => data.field === `${column.formattedDate} ${column.dayName} Day${column.dayCount}`))} onSearch={applyAdvancedFilterFinalAdj} initialSearchValue={searchQueryFinalAdj} handleCloseSearch={handleCloseSearchFinalAdj} />
            </Popover>

            {/* Print layout for Set Table */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="shiftfinallistpdf">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>SNo</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Emp Code</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Department</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                            {daysArray.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {column.formattedDate}<br />
                                                {column.dayName}<br />
                                                {`Day${column.dayCount}`}
                                            </Box>
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {(filteredRowDataFinalAdj.length > 0 ? filteredRowDataFinalAdj : filteredDataFinalAdj) &&
                            (filteredRowDataFinalAdj.length > 0 ? filteredRowDataFinalAdj : filteredDataFinalAdj).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.serialNumber}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.empcode}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.username}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.department}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.branch}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.unit}</TableCell>
                                    {row.days && (
                                        row.days.map((column, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.depstatus === undefined ? '' : column.depstatus}</Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.shiftlabel === undefined ? '' : column.shiftlabel}</Typography>
                                                    </TableCell>
                                                </React.Fragment>

                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFilterOpenFinalAdj} onClose={handleCloseFilterModFinalAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModFinalAdj}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormatFinalAdj === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLFinalAdj("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLFinalAdj("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenFinalAdj} onClose={handleClosePdfFilterModFinalAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModFinalAdj}
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
                            downloadPdfFinalAdj("filtered")
                            setIsPdfFilterOpenFinalAdj(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfFinalAdj("overall")
                            setIsPdfFilterOpenFinalAdj(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default ShiftFinalListTable;