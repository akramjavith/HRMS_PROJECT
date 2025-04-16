import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, ListItemText, ListItem, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TextareaAutosize, TableHead, Checkbox, IconButton, TableContainer, InputLabel, Button, TableBody, List } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import { Link, } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Webcamimage from "../webcamprofile";
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MuiInput from "@mui/material/Input";
import Selects from "react-select";
import html2canvas from 'html2canvas';
import { saveAs } from "file-saver";
import ImageIcon from '@mui/icons-material/Image';

import CloseIcon from '@mui/icons-material/Close';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Headtitle from "../../../components/Headtitle";


const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));


const CheckListTable = ({ isTable, handleCloseTable, userId, from }) => {


    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [groupDetails, setGroupDetails] = useState();

    const [datasAvailedDB, setDatasAvailedDB] = useState();

    const [dateValue, setDateValue] = useState([]);
    const [timeValue, setTimeValue] = useState([]);

    const [dateValueRandom, setDateValueRandom] = useState([]);
    const [timeValueRandom, setTimeValueRandom] = useState([]);

    const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
    const [dateValueMultiTo, setDateValueMultiTo] = useState([]);

    const [firstDateValue, setFirstDateValue] = useState([]);
    const [firstTimeValue, setFirstTimeValue] = useState([]);
    const [secondDateValue, setSecondDateValue] = useState([]);
    const [secondTimeValue, setSecondTimeValue] = useState([]);

    async function fecthDBDatas() {
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);

            let foundData;

            if (from == "deactivate") {
                foundData = res?.data?.mychecklist
                    .filter((item) => (
                        item.commonid === userId &&
                        (item.subsubpage === "Rejoined Employee List" || item.subsubpage === "Action Employee List")
                    ))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
            } else if (from == "rejoined") {
                foundData = res?.data?.mychecklist
                    .filter((item) => (
                        item.commonid === userId &&
                        item.subsubpage == "Deactivate Employees List"
                    ))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
            }

            setGroupDetails(foundData?.groups);


            let forFillDetails = foundData?.groups?.map((data) => {
                if (data.checklist === "Date Multi Random Time") {
                    if (data?.data && data?.data !== "") {
                        const [date, time] = data?.data?.split(" ");
                        return { date, time };
                    }

                } else {
                    return { date: "0", time: "0" };
                }
            });

            let forDateSpan = foundData?.groups?.map((data) => {
                if (data.checklist === "Date Multi Span") {
                    if (data?.data && data?.data !== "") {
                        const [fromdate, todate] = data?.data?.split(" ");
                        return { fromdate, todate };
                    }
                } else {
                    return { fromdate: "0", todate: "0" };
                }
            })


            let forDateTime = foundData?.groups?.map((data) => {
                if (data.checklist === "DateTime") {
                    if (data?.data && data?.data !== "") {
                        const [date, time] = data?.data?.split(" ");
                        return { date, time };
                    }
                } else {
                    return { date: "0", time: "0" };
                }
            })

            let forDateMultiSpanTime = foundData?.groups?.map((data) => {
                if (data.checklist === "Date Multi Span Time") {
                    if (data?.data && data?.data !== "") {
                        const [from, to] = data?.data?.split("/");
                        const [fromdate, fromtime] = from?.split(" ");
                        const [todate, totime] = to?.split(" ");
                        return { fromdate, fromtime, todate, totime };
                    }
                } else {
                    return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
                }
            })

            setDateValueMultiFrom(forDateSpan?.map((item) => item?.fromdate))
            setDateValueMultiTo(forDateSpan?.map((item) => item?.todate))

            setDateValueRandom(forFillDetails?.map((item) => item?.date))
            setTimeValueRandom(forFillDetails?.map((item) => item?.time))

            setDateValue(forDateTime?.map((item) => item?.date))
            setTimeValue(forDateTime?.map((item) => item?.time))

            setFirstDateValue(forDateMultiSpanTime?.map((item) => item?.fromdate))
            setFirstTimeValue(forDateMultiSpanTime?.map((item) => item?.fromtime))
            setSecondDateValue(forDateMultiSpanTime?.map((item) => item?.todate))
            setSecondTimeValue(forDateMultiSpanTime?.map((item) => item?.totime))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {
        fecthDBDatas();

    }, [isTable, handleCloseTable, userId])

    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };



    return (
        <>
            <Dialog open={isTable} onClose={handleCloseTable} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl">
                <Box sx={{ padding: "20px 50px" }}>
                    <>

                        <br />
                        <Box sx={{ padding: "20px 10px", width: '100%' }}>
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ ...userStyle.SubHeaderText, fontWeight: '600' }} >
                                        Check List Details
                                    </Typography>
                                </div>
                                <br />
                                <br />
                                <br />
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                                               
                                                <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>

                                                {/* Add more table headers as needed */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupDetails?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{row.details}</TableCell>
                                                    {
                                                        (() => {
                                                            switch (row.checklist) {
                                                                case "Text Box":

                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}

                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-number":
                                                                    return <TableCell>
                                                                        <OutlinedInput value={row.data}
                                                                            style={{ height: '32px' }}
                                                                            type="text"

                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-alpha":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}


                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-alphanumeric":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}

                                                                        />
                                                                    </TableCell>;
                                                                case "Attachments":
                                                                    return <TableCell>
                                                                        <div>
                                                                            <InputLabel sx={{ m: 1 }}>File</InputLabel>


                                                                            <div>

                                                                                <Box
                                                                                    sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                                                                                >



                                                                                    {row.files && <Grid container spacing={2}>
                                                                                        <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                            <Typography>{row.files.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                            <VisibilityOutlinedIcon
                                                                                                style={{
                                                                                                    fontsize: "large",
                                                                                                    color: "#357AE8",
                                                                                                    cursor: "pointer",
                                                                                                }}
                                                                                                onClick={() => renderFilePreviewEdit(row.files)}
                                                                                            />
                                                                                        </Grid>

                                                                                    </Grid>}

                                                                                </Box>

                                                                            </div>

                                                                        </div>


                                                                    </TableCell>;
                                                                case "Pre-Value":
                                                                    return <TableCell><Typography>{row?.data}</Typography>

                                                                    </TableCell>;
                                                                case "Date":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='date'
                                                                            value={row.data}

                                                                        />
                                                                    </TableCell>;
                                                                case "Time":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='time'
                                                                            value={row.data}

                                                                        />
                                                                    </TableCell>;
                                                                case "DateTime":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValue[index]}

                                                                            />
                                                                            <OutlinedInput
                                                                                type='time'
                                                                                style={{ height: '32px' }}
                                                                                value={timeValue[index]}

                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Date Multi Span":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValueMultiFrom[index]}

                                                                            />
                                                                            <OutlinedInput
                                                                                type='date'
                                                                                style={{ height: '32px' }}
                                                                                value={dateValueMultiTo[index]}

                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Date Multi Span Time":
                                                                    return <TableCell>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                            <Stack direction="row" spacing={2}>
                                                                                <OutlinedInput
                                                                                    style={{ height: '32px' }}
                                                                                    type='date'
                                                                                    value={firstDateValue[index]}

                                                                                />
                                                                                <OutlinedInput
                                                                                    type='time'
                                                                                    style={{ height: '32px' }}
                                                                                    value={firstTimeValue[index]}

                                                                                />
                                                                            </Stack>
                                                                            <Stack direction="row" spacing={2}>

                                                                                <OutlinedInput
                                                                                    type='date'
                                                                                    style={{ height: '32px' }}
                                                                                    value={secondDateValue[index]}

                                                                                />
                                                                                <OutlinedInput
                                                                                    style={{ height: '32px' }}
                                                                                    type='time'
                                                                                    value={secondTimeValue[index]}

                                                                                />
                                                                            </Stack>
                                                                        </div>

                                                                    </TableCell>;
                                                                case "Date Multi Random":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='date'
                                                                            value={row.data}

                                                                        />
                                                                    </TableCell>;
                                                                case "Date Multi Random Time":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValueRandom[index]}

                                                                            />
                                                                            <OutlinedInput
                                                                                type='time'
                                                                                style={{ height: '32px' }}
                                                                                value={timeValueRandom[index]}

                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Radio":
                                                                    return <TableCell>
                                                                        <FormControl component="fieldset">
                                                                            <RadioGroup value={row.data} sx={{ display: 'flex', flexDirection: 'row !important' }}
                                                                            >
                                                                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />

                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </TableCell>;

                                                                default:
                                                                    return <TableCell></TableCell>; // Default case
                                                            }
                                                        })()
                                                    }
                                                    <TableCell>{row?.employee && row?.employee?.map((data, index) => (
                                                        <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                                                    ))}</TableCell>
                                                     <TableCell>{row.completedby}</TableCell>
                                                    <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                                                    <TableCell>
                                                        {row.checklist === "DateTime" ?
                                                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                <Typography>Completed</Typography>
                                                                : <Typography>Pending</Typography>
                                                            : row.checklist === "Date Multi Span" ?
                                                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                                                    <Typography>Completed</Typography>
                                                                    : <Typography>Pending</Typography>
                                                                : row.checklist === "Date Multi Span Time" ?
                                                                    (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                                                        <Typography>Completed</Typography>
                                                                        : <Typography>Pending</Typography>
                                                                    : row.checklist === "Date Multi Random Time" ?
                                                                        (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                            <Typography>Completed</Typography>
                                                                            : <Typography>Pending</Typography>
                                                                        : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                                                            <Typography>Completed</Typography>
                                                                            : <Typography>Pending</Typography>
                                                        }
                                                    </TableCell>

                                                    {/* <TableCell>
                                                        {Array.isArray(row?.employee) &&
                                                            row.employee.map((item, index) => (
                                                                <Typography key={index} variant="body1">
                                                                    {`${index + 1}. ${item}, `}
                                                                </Typography>
                                                            ))}
                                                    </TableCell> */}
                                                    <TableCell>{row.category}</TableCell>
                                                    <TableCell>{row.subcategory}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </>
                        </Box>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={() => { handleCloseTable(); }}>
                                    {" "}
                                    Close
                                </Button>
                            </Grid>
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
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CheckListTable;