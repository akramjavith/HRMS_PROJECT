// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import LoadingButton from "@mui/lab/LoadingButton";
// import {
//     Box,
//     Button,
//     Checkbox,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     FormControl,
//     Grid,
//     IconButton,
//     InputLabel,
//     List,
//     ListItem,
//     ListItemText,
//     MenuItem,
//     OutlinedInput,
//     Paper,
//     Popover,
//     Select,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Tooltip,
//     Typography,
// } from "@mui/material";
// import axios from "axios";
// import "jspdf-autotable";
// import moment from "moment-timezone";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { FaFilePdf, FaPrint } from "react-icons/fa";
// import { ThreeDots } from "react-loader-spinner";
// import { useReactToPrint } from "react-to-print";
// import { handleApiError } from "../../../../components/Errorhandling";
// import {
//     AuthContext,
//     UserRoleAccessContext,
// } from "../../../../context/Appcontext";
// import { userStyle, colourStyles } from "../../../../pageStyle";
// import { SERVICE } from "../../../../services/Baseservice";

// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ChecklistIcon from "@mui/icons-material/Checklist";
// import CloseIcon from "@mui/icons-material/Close";
// import ErrorIcon from "@mui/icons-material/Error";
// import ImageIcon from "@mui/icons-material/Image";
// import InfoIcon from "@mui/icons-material/Info";
// import LoginIcon from "@mui/icons-material/Login";
// import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
// import WarningIcon from "@mui/icons-material/Warning";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import MuiInput from "@mui/material/Input";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import Stack from "@mui/material/Stack";
// import Switch from "@mui/material/Switch";
// import { styled } from "@mui/system";
// import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { FaFileCsv, FaFileExcel } from "react-icons/fa";
// import { MultiSelect } from "react-multi-select-component";
// import {
//     NotificationContainer,
//     NotificationManager,
// } from "react-notifications";
// import "react-notifications/lib/notifications.css";
// import { Link, useNavigate } from "react-router-dom";
// import AlertDialog from "../../../../components/Alert";
// import ExportData from "../../../../components/ExportData";
// import Headtitle from "../../../../components/Headtitle";
// import MessageAlert from "../../../../components/MessageAlert";
// import PageHeading from "../../../../components/PageHeading";
// import Webcamimage from "../Webcamprofile";
// import Selects from "react-select";
// import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
// import AggridTable from "../../../../components/AggridTable";

// const Input = styled(MuiInput)(({ theme }) => ({
//     "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
//         display: "none !important",
//     },
//     "& input[type=number]": {
//         MozAppearance: "textfield",
//     },
// }));

// function EmployeeDetailStatus({ rowDataTable, columnDataTable, columnVisibility, page, setPage, pageSize,

//     totalPages, setColumnVisibility, isHandleChange, items, selectedRows, setSelectedRows, gridRefTable, filteredDatas,

//     searchedString, handleShowAllColumns, setFilteredRowData, filteredRowData, setFilteredChanges, filteredChanges, gridRefTableImg
// }) {







//     return (
//         <Box>
//             <>
//                 {isUserRoleCompare?.includes("llongabsentrestrictionlist") && (
//                     <>
//                         <Box sx={userStyle.container}>
//                             {/* ******************************************************EXPORT Buttons****************************************************** */}
//                             <Grid container spacing={2}>
//                                 <Grid item xs={8}>
//                                     <Typography sx={userStyle.SubHeaderText}>
//                                         Long Absent Restriction List
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     {isUserRoleCompare?.includes("lmychecklist") && (
//                                         <>
//                                             <Link
//                                                 to="/interview/myinterviewchecklist"
//                                                 style={{
//                                                     textDecoration: "none",
//                                                     color: "white",
//                                                     float: "right",
//                                                 }}
//                                                 target="_blank"
//                                             >
//                                                 <Button variant="contained">My Check List</Button>
//                                             </Link>
//                                         </>
//                                     )}
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <br />
//                             <Grid container spacing={2} style={userStyle.dataTablestyle}>
//                                 <Grid item md={2} xs={12} sm={12}>
//                                     <Box>
//                                         <label>Show entries:</label>
//                                         <Select
//                                             id="pageSizeSelect"
//                                             value={pageSize}
//                                             MenuProps={{
//                                                 PaperProps: {
//                                                     style: {
//                                                         maxHeight: 180,
//                                                         width: 80,
//                                                     },
//                                                 },
//                                             }}
//                                             onChange={handlePageSizeChange}
//                                             sx={{ width: "77px" }}
//                                         >
//                                             <MenuItem value={1}>1</MenuItem>
//                                             <MenuItem value={5}>5</MenuItem>
//                                             <MenuItem value={10}>10</MenuItem>
//                                             <MenuItem value={25}>25</MenuItem>
//                                             <MenuItem value={50}>50</MenuItem>
//                                             <MenuItem value={100}>100</MenuItem>
//                                             <MenuItem value={employees?.length}>All</MenuItem>
//                                         </Select>
//                                     </Box>
//                                 </Grid>
//                                 <Grid
//                                     item
//                                     md={8}
//                                     xs={12}
//                                     sm={12}
//                                     sx={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Box>
//                                         {isUserRoleCompare?.includes(
//                                             "excellongabsentrestrictionlist"
//                                         ) && (
//                                                 <>
//                                                     <Button
//                                                         onClick={(e) => {
//                                                             setIsFilterOpen(true);
//                                                             setFormat("xl");
//                                                         }}
//                                                         sx={userStyle.buttongrp}
//                                                     >
//                                                         <FaFileExcel />
//                                                         &ensp;Export to Excel&ensp;
//                                                     </Button>
//                                                 </>
//                                             )}
//                                         {isUserRoleCompare?.includes(
//                                             "csvlongabsentrestrictionlist"
//                                         ) && (
//                                                 <>
//                                                     <Button
//                                                         onClick={(e) => {
//                                                             setIsFilterOpen(true);
//                                                             setFormat("csv");
//                                                         }}
//                                                         sx={userStyle.buttongrp}
//                                                     >
//                                                         <FaFileCsv />
//                                                         &ensp;Export to CSV&ensp;
//                                                     </Button>
//                                                 </>
//                                             )}
//                                         {isUserRoleCompare?.includes(
//                                             "printlongabsentrestrictionlist"
//                                         ) && (
//                                                 <>
//                                                     <Button
//                                                         sx={userStyle.buttongrp}
//                                                         onClick={handleprint}
//                                                     >
//                                                         &ensp;
//                                                         <FaPrint />
//                                                         &ensp;Print&ensp;
//                                                     </Button>
//                                                 </>
//                                             )}
//                                         {isUserRoleCompare?.includes(
//                                             "pdflongabsentrestrictionlist"
//                                         ) && (
//                                                 <>
//                                                     <Button
//                                                         sx={userStyle.buttongrp}
//                                                         onClick={() => {
//                                                             setIsPdfFilterOpen(true);
//                                                         }}
//                                                     >
//                                                         <FaFilePdf />
//                                                         &ensp;Export to PDF&ensp;
//                                                     </Button>
//                                                 </>
//                                             )}
//                                         {isUserRoleCompare?.includes(
//                                             "imagelongabsentrestrictionlist"
//                                         ) && (
//                                                 <Button
//                                                     sx={userStyle.buttongrp}
//                                                     onClick={handleCaptureImage}
//                                                 >
//                                                     {" "}
//                                                     <ImageIcon sx={{ fontSize: "15px" }} />{" "}
//                                                     &ensp;Image&ensp;{" "}
//                                                 </Button>
//                                             )}
//                                     </Box>
//                                 </Grid>
//                                 <Grid item md={2} xs={6} sm={6}>

//                                     <AggregatedSearchBar
//                                         columnDataTable={columnDataTable}
//                                         setItems={setItems}


//                                         addSerialNumber={addSerialNumber}
//                                         setPage={setPage}
//                                         maindatas={employees}
//                                         setSearchedString={setSearchedString}
//                                         searchQuery={searchQuery}
//                                         setSearchQuery={setSearchQuery}
//                                     />
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
//                                 Show All Columns
//                             </Button>
//                             &ensp;
//                             <Button
//                                 sx={userStyle.buttongrp}
//                                 onClick={handleOpenManageColumns}
//                             >
//                                 Manage Columns
//                             </Button>
//                             &ensp;
//                             <br />
//                             <br />
//                             <AggridTable
//                                 rowDataTable={rowDataTable}
//                                 columnDataTable={columnDataTable}
//                                 columnVisibility={columnVisibility}
//                                 page={page}
//                                 setPage={setPage}
//                                 pageSize={pageSize}
//                                 totalPages={totalPages}
//                                 setColumnVisibility={setColumnVisibility}
//                                 isHandleChange={isHandleChange}
//                                 items={items}
//                                 selectedRows={selectedRows}
//                                 setSelectedRows={setSelectedRows}
//                                 gridRefTable={gridRefTable}
//                                 paginated={false}
//                                 filteredDatas={filteredDatas}
//                                 // totalDatas={totalDatas}
//                                 searchQuery={searchedString}
//                                 handleShowAllColumns={handleShowAllColumns}
//                                 setFilteredRowData={setFilteredRowData}
//                                 filteredRowData={filteredRowData}
//                                 setFilteredChanges={setFilteredChanges}
//                                 filteredChanges={filteredChanges}
//                                 gridRefTableImg={gridRefTableImg}
//                             />
//                         </Box>
//                     </>
//                 )}
//             </>



//             {/* Manage Column */}
//             <Popover
//                 id={id}
//                 open={isManageColumnsOpen}
//                 anchorEl={anchorEl}
//                 onClose={handleCloseManageColumns}
//                 anchorOrigin={{
//                     vertical: "bottom",
//                     horizontal: "left",
//                 }}
//             >
//                 {manageColumnsContent}
//             </Popover>

//             {/* EXTERNAL COMPONENTS -------------- START */}
//             {/* VALIDATION */}
//             <MessageAlert
//                 openPopup={openPopupMalert}
//                 handleClosePopup={handleClosePopupMalert}
//                 popupContent={popupContentMalert}
//                 popupSeverity={popupSeverityMalert}
//             />
//             {/* SUCCESS */}
//             <AlertDialog
//                 openPopup={openPopup}
//                 handleClosePopup={handleClosePopup}
//                 popupContent={popupContent}
//                 popupSeverity={popupSeverity}
//             />
//             {/* PRINT PDF EXCEL CSV */}
//             <ExportData
//                 isFilterOpen={isFilterOpen}
//                 handleCloseFilterMod={handleCloseFilterMod}
//                 fileFormat={fileFormat}
//                 setIsFilterOpen={setIsFilterOpen}
//                 isPdfFilterOpen={isPdfFilterOpen}
//                 setIsPdfFilterOpen={setIsPdfFilterOpen}
//                 handleClosePdfFilterMod={handleClosePdfFilterMod}
//                 filteredDataTwo={filteredData ?? []}
//                 itemsTwo={items ?? []}
//                 filename={"Long Absent Restrcition List"}
//                 exportColumnNames={exportColumnNames}
//                 exportRowValues={exportRowValues}
//                 componentRef={componentRef}
//             />

//             {/* EXTERNAL COMPONENTS -------------- END */}

//         </Box>
//     );
// }

// export default EmployeeDetailStatus;
