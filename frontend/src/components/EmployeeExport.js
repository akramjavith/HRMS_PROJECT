import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import jsPDF from "jspdf";
import React from "react";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableCell } from "../components/Table";
import { userStyle } from "../pageStyle";
import { Backdrop } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";



// const LoadingBackdrop = ({ open }) => {
//     return (
//         <Backdrop
//             sx={{
//                 color: '#fff',
//                 position: "absolute", // Changed to absolute
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 zIndex: (theme) => theme.zIndex.drawer + 1
//             }}
//             open={open}
//         >
//             <div className="pulsating-circle">
//                 <CircularProgress color="inherit" className="loading-spinner" />
//             </div>
//             <Typography variant="h6" sx={{ marginLeft: 2, color: '#fff', fontWeight: 'bold' }}>
//                 Submitting, please wait...
//             </Typography>
//         </Backdrop>
//     );
// };

function EmployeeExportData({
    isFilterOpen,
    setIsLoading,
    setIsFilterOpen,
    handleCloseFilterMod,
    fileFormat,
    isPdfFilterOpen,
    setIsPdfFilterOpen,
    handleClosePdfFilterMod,
    filteredDataTwo,
    itemsTwo,
    filename,
    exportColumnNames,
    exportRowValues,
    componentRef,

}) {
    //------------------------------------------------------

    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";


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

            worksheet.columns = [
                { header: "S.No", key: "serial", width: 10 },
                { header: "Image", key: "image", width: 30 },
                { header: "Status", key: "status", width: 50 },
                { header: "Empcode", key: "empcode", width: 15 },
                { header: "Employeename", key: "companyname", width: 30 },
                { header: "Username", key: "username", width: 20 },
                { header: "Email", key: "email", width: 30 },
                { header: "Branch", key: "branch", width: 20 },
                { header: "Unit", key: "unit", width: 20 },
                { header: "Team", key: "team", width: 20 },
                { header: "Experience", key: "experience", width: 20 },
                { header: "Doj", key: "doj", width: 20 },
                { header: "Mode", key: "mode", width: 20 },
                { header: "Value", key: "value", width: 20 },
                { header: "Endexp", key: "endexp", width: 20 },
                { header: "EndexpDate", key: "endexpdate", width: 20 },
                { header: "Endtar", key: "endtar", width: 20 },
                { header: "EndtarDate", key: "endtardate", width: 20 },
                {
                    header: "Username Auto Generate",
                    key: "usernameautogenerate",
                    width: 20,
                },
                { header: "Work Mode", key: "workmode", width: 20 },
                { header: "Enquiry Status", key: "enquirystatus", width: 20 },
                { header: "Area", key: "area", width: 20 },
                { header: "Prefix", key: "prefix", width: 20 },
                { header: "Shift Grouping", key: "shiftgrouping", width: 20 },
                { header: "First Name", key: "firstname", width: 20 },
                { header: "Last Name", key: "lastname", width: 20 },
                { header: "Legal Name", key: "legalname", width: 20 },
                { header: "Calling Name", key: "callingname", width: 20 },
                { header: "Father Name", key: "fathername", width: 20 },
                { header: "Mother Name", key: "mothername", width: 20 },
                { header: "Gender", key: "gender", width: 10 },
                { header: "Marital Status", key: "maritalstatus", width: 15 },
                { header: "Date of Birth", key: "dob", width: 15 },
                { header: "Blood Group", key: "bloodgroup", width: 10 },
                { header: "Location", key: "location", width: 20 },
                { header: "Personal Contact", key: "contactpersonal", width: 20 },
                { header: "Family Contact", key: "contactfamily", width: 20 },
                { header: "Emergency Contact", key: "emergencyno", width: 20 },
                { header: "Same as Permanent", key: "samesprmnt", width: 15 },
                { header: "Date of Termination", key: "dot", width: 15 },
                { header: "Permanent Door No", key: "pdoorno", width: 20 },
                { header: "Permanent Street", key: "pstreet", width: 20 },
                { header: "Permanent Area", key: "parea", width: 20 },
                { header: "Permanent Landmark", key: "plandmark", width: 20 },
                { header: "Permanent Taluk", key: "ptaluk", width: 20 },
                { header: "Permanent Post", key: "ppost", width: 20 },
                { header: "Permanent Pincode", key: "ppincode", width: 15 },
                { header: "Permanent Country", key: "pcountry", width: 20 },
                { header: "Permanent State", key: "pstate", width: 20 },
                { header: "Permanent City", key: "pcity", width: 20 },
                { header: "Current Door No", key: "cdoorno", width: 20 },
                { header: "Current Street", key: "cstreet", width: 20 },
                { header: "Current Area", key: "carea", width: 20 },
                { header: "Current Landmark", key: "clandmark", width: 20 },
                { header: "Current Taluk", key: "ctaluk", width: 20 },
                { header: "Current Post", key: "cpost", width: 20 },
                { header: "Current Pincode", key: "cpincode", width: 15 },
                { header: "Current Country", key: "ccountry", width: 20 },
                { header: "Current State", key: "cstate", width: 20 },
                { header: "Current City", key: "ccity", width: 20 },
                { header: "Workstation Input", key: "workstationinput", width: 20 },
                {
                    header: "Workstation Office Status",
                    key: "workstationofficestatus",
                    width: 15,
                },
                { header: "Floor", key: "floor", width: 10 },
                { header: "Department", key: "department", width: 20 },
                { header: "Designation", key: "designation", width: 20 },
                { header: "Shift Timing", key: "shifttiming", width: 20 },
                { header: "Reporting To", key: "reportingto", width: 20 },
                { header: "Company", key: "company", width: 20 },
                { header: "Role", key: "role", width: 30 },
                { header: "Aadhar", key: "aadhar", width: 15 },
                { header: "PAN Status", key: "panstatus", width: 15 },
                { header: "PAN Reference No", key: "panrefno", width: 20 },
                { header: "PAN No", key: "panno", width: 15 },
                { header: "Employee Count", key: "employeecount", width: 10 },
                { header: "Date of Marriage", key: "dom", width: 15 },
                { header: "Enable Workstation", key: "enableworkstation", width: 15 },
                { header: "2FA Enabled", key: "twofaenabled", width: 10 },
                { header: "Process", key: "process", width: 20 },
                { header: "Assigned Experience Mode", key: "assignExpMode", width: 20 },
                {
                    header: "Assigned Experience Value",
                    key: "assignExpvalue",
                    width: 20,
                },
                { header: "Process Type", key: "processtype", width: 20 },
                { header: "Process Duration", key: "processduration", width: 20 },
                { header: "Date", key: "date", width: 15 },
                { header: "Time", key: "time", width: 15 },
                { header: "Gross Salary", key: "grosssalary", width: 20 },
                { header: "Time Mins", key: "timemins", width: 10 },
                { header: "Mode Experience", key: "modeexperience", width: 20 },
                { header: "Target Experience", key: "targetexperience", width: 20 },
                { header: "Target Points", key: "targetpts", width: 10 },
                { header: "Shift Type", key: "shifttype", width: 20 },
                { header: "Workstation Primary", key: "workstationprimary", width: 30 },
                {
                    header: "Workstation Secondary",
                    key: "workstationsecondary",
                    width: 30,
                },
                { header: "Week Off", key: "weekoff", width: 20 },
                { header: "Word Check", key: "wordcheck", width: 10 },
                { header: "Salary Setup", key: "salarysetup", width: 10 },
            ];

            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Yellow background
                };
                cell.font = {
                    bold: true,
                    color: { argb: "000" }, // Red text color
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            // Add rows and images
            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const row = worksheet.addRow({
                    serial: i + 1,
                    status: item.status || "",
                    empcode: item.empcode || "",
                    companyname: item.companyname || "",
                    username: item.username || "",
                    email: item.email || "",
                    branch: item.branch || "",
                    unit: item.unit || "",
                    team: item.team || "",
                    experience: item.experience || "",
                    doj: item.doj || "",
                    mode: item.mode || "",
                    value: item.value || "",
                    endexp: item.endexp || "",
                    endexpdate: item.endexpdate || "",
                    endtar: item.endtar || "",
                    endtardate: item.endtardate || "",

                    usernameautogenerate: item?.usernameautogenerate ? "Yes" : "No",
                    workmode: item?.workmode,
                    enquirystatus: item?.enquirystatus,
                    area: item?.area,
                    password: item?.password,
                    prefix: item?.prefix,
                    shiftgrouping: item?.shiftgrouping,
                    firstname: item?.firstname,
                    lastname: item?.lastname,
                    legalname: item?.legalname,
                    callingname: item?.callingname,
                    fathername: item?.fathername,
                    mothername: item?.mothername,
                    gender: item?.gender,
                    maritalstatus: item?.maritalstatus,
                    dob: item?.dob,
                    bloodgroup: item?.bloodgroup,
                    location: item?.location,
                    contactpersonal: item?.contactpersonal,
                    contactfamily: item?.contactfamily,
                    emergencyno: item?.emergencyno,
                    samesprmnt: item?.samesprmnt ? "Yes" : "No",
                    dot: item?.dot,
                    contactno: item?.contactno,
                    details: item?.details,
                    pdoorno: item?.pdoorno,
                    pstreet: item?.pstreet,
                    parea: item?.parea,
                    plandmark: item?.plandmark,
                    ptaluk: item?.ptaluk,
                    ppost: item?.ppost,
                    ppincode: item?.ppincode,
                    pcountry: item?.pcountry,
                    pstate: item?.pstate,
                    pcity: item?.pcity,
                    cdoorno: item?.cdoorno,
                    cstreet: item?.cstreet,
                    carea: item?.carea,
                    clandmark: item?.clandmark,
                    ctaluk: item?.ctaluk,
                    cpost: item?.cpost,
                    cpincode: item?.cpincode,
                    ccountry: item?.ccountry,
                    cstate: item?.cstate,
                    ccity: item?.ccity,
                    workstationinput: item?.workstationinput,
                    workstationofficestatus: item?.workstationofficestatus ? "Yes" : "No",
                    floor: item?.floor,
                    department: item?.department,
                    designation: item?.designation,
                    shifttiming: item?.shifttiming,
                    reportingto: item?.reportingto,
                    company: item?.company,
                    role:
                        Array.isArray(item?.role) && item.role.length > 0
                            ? item.role?.join(",")
                            : "",
                    aadhar: item?.aadhar,
                    panstatus: item?.panstatus,
                    panrefno: item?.panrefno,
                    panno: item?.panno,
                    workhistTodo: item?.workhistTodo?.join(","),
                    intStartDate: item?.intStartDate,
                    intEndDate: item?.intEndDate,
                    modeOfInt: item?.modeOfInt,
                    intDuration: item?.intDuration,
                    clickedGenerate: item?.clickedGenerate,
                    employeecount: item?.employeecount,
                    dom: item?.dom,
                    enableworkstation: item?.enableworkstation ? "Yes" : "No",
                    twofaenabled: item?.twofaenabled ? "Yes" : "No",
                    twofatempsecret: item?.twofatempsecret,
                    twofasecret: item?.twofasecret,
                    process: item?.process,
                    originalpassword: item?.originalpassword,
                    assignExpMode: item?.assignExpMode,
                    assignExpvalue: item?.assignExpvalue,
                    processtype: item?.processtype,
                    processduration: item?.processduration,
                    date: item?.date,
                    time: item?.time,
                    grosssalary: item?.grosssalary,
                    timemins: item?.timemins,
                    modeexperience: item?.modeexperience,
                    targetexperience: item?.targetexperience,
                    targetpts: item?.targetpts,
                    shifttype: item?.shifttype,
                    shiftallot:
                        Array.isArray(item?.shiftallot) && item.shiftallot.length > 0
                            ? item.shiftallot?.join(",")
                            : "",
                    workstationprimary:
                        Array.isArray(item?.workstation) && item.workstation.length > 0
                            ? item.workstation.slice(0, 1).join(",")
                            : "",
                    workstationsecondary:
                        Array.isArray(item?.workstation) && item.workstation.length > 1
                            ? item.workstation.slice(1).join(",")
                            : "",
                    weekoff:
                        Array.isArray(item?.weekoff) && item.weekoff.length > 0
                            ? item.weekoff?.join(",")
                            : "",
                    wordcheck: item?.wordcheck ? "Yes" : "No",
                    salarysetup: item?.salarysetup ? "Yes" : "No",
                });

                // Center align the text in each cell of the row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { vertical: "middle", horizontal: "center" };

                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });

                if (item.profileimage) {
                    try {
                        const base64Image = item.profileimage.split(",")[1]; // Extract base64 content
                        const imageExtension = item.profileimage.split(";")[0].split("/")[1]; // Extract extension (png/jpeg)

                        // Validate and add the image
                        if (["png", "jpeg", "jpg"].includes(imageExtension.toLowerCase())) {
                            const imageId = workbook.addImage({
                                base64: base64Image,
                                extension: imageExtension, // Ensure the correct extension is used
                            });

                            // Adjust row height to fit the image
                            worksheet.getRow(row.number).height = 80;

                            // Add the image to the worksheet
                            worksheet.addImage(imageId, {
                                tl: { col: 1, row: row.number - 1 },
                                ext: { width: 100, height: 80 },
                            });

                            // Center align the image cell
                            worksheet.getCell(`H${row.number}`).alignment = {
                                vertical: "middle",
                                horizontal: "center",
                            };
                        } else {
                            console.error(`Unsupported image format: ${imageExtension}`);
                        }
                    } catch (imageError) {
                        console.error('Error adding image:', imageError);
                    }
                }
            }

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            FileSaver.saveAs(blob, `${fileName}${fileExtension}`);
            setIsLoading(false);
            setIsFilterOpen(false);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            let finalData = {};
            for (let i = 0; i < exportColumnNames?.length; i++) {
                finalData[exportColumnNames[i]] = Array.isArray(
                    item[exportRowValues[i]]
                )
                    ? item[exportRowValues[i]]?.join(",")
                    : item[exportRowValues[i]];
            }
            return {
                Sno: index + 1,
                ...finalData,
            };
        });
    };

    const handleExportXL = (isfilter) => {
        const dataToExport = isfilter === "filtered" ? filteredDataTwo : itemsTwo;

        if (!dataToExport || dataToExport.length === 0) {
            console.error("No data available to export");
            return;
        }

        exportToExcel(dataToExport, `${filename}`);
        
    };

    //  PDF
    // pdf.....
    let columns = [];

    for (let i = 0; i < exportColumnNames?.length; i++) {
        columns.push({ title: exportColumnNames[i], field: exportRowValues[i] });
    }

    const downloadPdfTwo = async (isfilter) => {
        const doc = new jsPDF();

        const tableColumn = columns.map((col) => col.title);
        const tableRows = [];
        const imagesToLoad = [];

        let datatoPdf = isfilter === "filtered" ? filteredDataTwo : itemsTwo;

        datatoPdf.forEach((item, index) => {
            const rowData = [
                index + 1,
                item.status || "",
                item.empcode || "",
                item.companyname || "",
                item.username || "",
                item.email || "",
                item.branch || "",
                item.unit || "",
                item.team || "",
                item.experience || "",
                item.doj || "",
                "", // Placeholder for the image column
            ];

            tableRows.push(rowData);

            if (item.profileimage) {
                // Basic validation of the base64 string
                if (item.profileimage.startsWith('data:image/')) {
                    imagesToLoad.push({ index, imageBase64: item.profileimage });
                } else {
                    console.warn("Invalid image data at index:", index);
                }
            }
        });


        const loadImage = (imageBase64) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => {
                    // Provide a default image as a fallback
                    const defaultImg = new Image();
                    defaultImg.onload = () => resolve(defaultImg);
                    defaultImg.src = "data:image/png;base64,..."; // base64 for a default image
                };
                img.src = imageBase64;
            });
        };


        let loadedImages = [];
        try {
            loadedImages = await Promise.all(
                imagesToLoad.map((item) =>
                    loadImage(item.imageBase64).then((img) => ({ ...item, img }))
                )
            );
        } catch (error) {
            alert("Failed to load images. Please try again.");
            return;
        }

        const rowHeight = 10; // Set desired row height

        try {
            doc.autoTable({
                theme: "grid",
                head: [tableColumn],
                body: tableRows,
                styles: { fontSize: 4 },
                didDrawCell: (data) => {
                    if (
                        data.section === "body" &&
                        data.column.index === columns.length - 1
                    ) {
                        const imageInfo = loadedImages.find(
                            (image) => image.index === data.row.index
                        );
                        if (imageInfo) {
                            const imageHeight = 10;
                            const imageWidth = 10;
                            const xOffset = (data.cell.width - imageWidth) / 2;
                            const yOffset = (rowHeight - imageHeight) / 2;

                            doc.addImage(
                                imageInfo.img,
                                "PNG",
                                data.cell.x + xOffset,
                                data.cell.y + yOffset,
                                imageWidth,
                                imageHeight
                            );

                            data.cell.height = rowHeight;
                        }
                    }
                },
                headStyles: {
                    minCellHeight: 5,
                    fontSize: 4,
                    cellPadding: { top: 2, right: 1, bottom: 2, left: 1 },
                },
                bodyStyles: {
                    fontSize: 4,
                    minCellHeight: rowHeight,
                    cellPadding: { top: 4, right: 1, bottom: 0, left: 1 },
                },
                columnStyles: {
                    [tableColumn.length - 1]: { cellWidth: 12 },
                },
            });

            setIsLoading(false);
            setIsPdfFilterOpen(false);
            doc.save(`${filename}.pdf`);
        } catch (error) {
            alert("Failed to generate PDF. Please try again.");
        }
    };



    return (
        <>
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
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

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
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

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");
                            setIsLoading(true);

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
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
                            downloadPdfTwo("filtered");

                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfTwo("overall");
                            setIsLoading(true);

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Print Layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="diagnosistable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            {exportColumnNames?.map((item) => {
                                return <TableCell>{item}</TableCell>;
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredDataTwo &&
                            filteredDataTwo?.map((row, index) => (

                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>

                                    <TableCell>{row.status} </TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.companyname}</TableCell>
                                    <StyledTableCell>{row.username} </StyledTableCell>
                                    <TableCell> {row.email}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <StyledTableCell>{row.team} </StyledTableCell>
                                    <StyledTableCell>{row.experience} </StyledTableCell>
                                    <TableCell> {row.doj}</TableCell>
                                    <TableCell>
                                        {row?.profileimage ? (
                                            <img
                                                src={row?.profileimage}
                                                style={{ height: "100px", width: "100px" }}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </TableCell>
                                </TableRow>

                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <LoadingBackdrop open={isLoading} /> */}

        </>
    );
}

export default EmployeeExportData;