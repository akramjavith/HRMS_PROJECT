import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl,
    Grid, IconButton, List, ListItem, ListItemText, Popover, TextField, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2pdf from 'html2pdf.js';
import moment from "moment-timezone";
import { BASE_URL } from "../../../services/Authservice";
import React, { useContext, useEffect, forwardRef, useRef, useState } from "react";
import Resizable from "react-resizable";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import ttslogo from "../../../images/ttslogo.png"
import LinearProgress from '@mui/material/LinearProgress';
import QRCode from 'qrcode';
import { ToWords } from "to-words"
import "./Loader.css";


const Loader = () => {
    return <div className="loader1"></div>;
};


const Payslip = (props, ref) => {
    const toWords = new ToWords();
    const { data, index } = props;
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const useStyles = {
        tableHeaderText: {
            fontWeight: "bold",
            border: "0.5px solid",
            padding: "5px",
            textAlign: "left",
            // fontSize:"15px"

        },
        SubHeader: {
            fontSize: "12px !important",
            display: "inline-block",
            fontWeight: "400",
            color: "#444 !important",
        },
        dialogbox: {
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgb(97, 97, 97)",
            overflowY: "visible",
            height: "max-content",
            padding: "20px",
            maxWidth: "100% !important",
            // boxShadow: "0px 0px 20px #00000029",
            borderRadius: "none",
            fontFamily: "auto",
            "& .MuiTable-root": {
                borderBottom: "none !important",
                // paddingTop: "20px",
                // paddingBottom: "20px",
            },
            "& .MuiTableCell-root": {
                fontSize: "18px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
                background: "#8080800f",
                border: "1px solid #00000021",
            },
            "& .MuiOutlinedInput-root": {
                height: "40px",
            },
        },
        tableCellTexted: {
            border: "0.5px solid",
            // padding: "5px",
            textAlign: "left",
        },
        tableValues: {
            textAlign: "right",
        },
    };
    const location = useLocation();

    const [payslip, setPaySlip] = useState([]);


    const [paySlipData, setPaySlipDatas] = useState({});
    const [userData, setUserData] = useState({});
    const [signaturePreview, setSignaturePreview] = useState("")
    const [sealPreview, setSealPreview] = useState("")
    const [backgroundPreview, setBackgroundPreview] = useState("")

    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupCheck, setGroupCheck] = useState(false);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const { auth } = useContext(AuthContext);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");



    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Group.png");
                });
            });
        }
    };

    useEffect(() => {
        // Disable right-click
        const handleRightClick = (event) => {
            event.preventDefault();
        };
        // Attach event listeners
        document.addEventListener('contextmenu', handleRightClick); // Disable right-click
        // Cleanup event listeners when the component is unmounted
        return () => {
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

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
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
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
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
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
    const ids = open ? "simple-popover" : undefined;

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
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
        name: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };




    // const designRef = useRef(null);
    // const ids = useParams().id
    // const handleConvert = () => {
    //   domToImage.toPng(designRef.current)
    //     .then(function (dataUrl) {
    //       const link = document.createElement('a');
    //     //   link.download = `${userDetails.legalname}.jpg`;
    //       link.download = `${userDetails.legalname}.jpg`;
    //       link.href = dataUrl;
    //       link.click();
    //     });
    // }
    const [imageUrl, setImageUrl] = useState('');

    const payslipRef = useRef(null);


    const handleDownloadPDF = () => {
        const element = payslipRef.current; // Your HTML element reference
        const opt = {
            margin: 1,
            filename: `${userData.companyname}_Payslip.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };
    const { id, month, year, sealid, signatureid, backgroundid, genby, gendate, qrcode } = useParams();
    console.log(id, month, year, sealid, signatureid, backgroundid, genby, gendate, qrcode, 'id, month, year, sealid, signatureid, backgroundid, genby, gendate, qrcode')
    const [first, second, third] = moment(new Date(data?.generateddate)).format("DD-MM-YYYY hh:mm a")?.split(" ")
    const vasr = `${first}_${second}_${third}`
    const userID = data ? data?.userid : id;
    const paySlipMonth = data ? data?.month : month;
    const paySlipYear = data ? data?.year : year;
    const sealids = data ? data?.sealid : sealid;
    const signatureids = data ? data?.signatureid : signatureid;
    const backgroundids = data ? data?.backgroundimageid : backgroundid;
    const generatedName = data ? encryptString(data?.generatedby) : genby;
    const generatedDate = data ? vasr : gendate;
    const qrCode = data ? data?.qrcode : qrcode;
    const isEmpty = (data !== undefined) ? Object.keys(data)?.length === 0 : true;
    console.log(backgroundids, "backgroundids")
    function encryptString(str) {
        if (str) {
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const shift = 3; // You can adjust the shift value as per your requirement
            let encrypted = "";
            for (let i = 0; i < str.length; i++) {
                let charIndex = characters.indexOf(str[i]);
                if (charIndex === -1) {
                    // If character is not found, add it directly to the encrypted string
                    encrypted += str[i];
                } else {
                    // Shift the character index
                    charIndex = (charIndex + shift) % characters.length;
                    encrypted += characters[charIndex];
                }
            }
            return encrypted;
        }
        else {
            return ""
        }

    }

    const generateQrCode = async (user, id) => {
        let Allcodedata = `${BASE_URL}/document/payslippreparation/${encryptString(user?.companyname)}/${user?.empcode}/${encryptString(paySlipMonth)}/${encryptString(paySlipYear)}/${generatedName}/${generatedDate}/${id}`
        try {
            const response = await QRCode.toDataURL(`${Allcodedata}`);
            setImageUrl(response);
        } catch (error) {

        }
    }

    const fetchControlSettings = async () => {
        try {
            if (!isEmpty || (userID !== undefined)) {
                let res_sub = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                const user = res_sub.data.suser;
                let payrun = await axios.post(`${SERVICE.PAYSLIP_RELATED_PAYRUNDATA}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    month: paySlipMonth,
                    year: paySlipYear,
                    company: user?.company,
                    branch: user?.branch,
                    unit: user?.unit,
                    team: user?.team,
                    companyname: user?.companyname,
                });
                let res_temp_panel = await axios.post(`${SERVICE.PAYSLIP_GET_SINGLE_SIGNATURE_SEAL}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    signatureid: signatureids,
                    sealid: sealids,
                    backgroundid: backgroundids
                });

                const paySlip = payrun?.data?.payRunFilter?.length > 0 ? payrun?.data?.payRunFilter[0] : {}
                handleDataFromChildPaySlip(paySlip, user)
                setUserData(res_sub.data.suser);
                generateQrCode(res_sub.data.suser, backgroundids)
                const signature = Object.keys(res_temp_panel?.data?.signature)?.length !== 0 ? res_temp_panel?.data?.signature?.document[0]?.preview : ""
                const seal = Object.keys(res_temp_panel?.data?.seal)?.length !== 0 ? res_temp_panel?.data?.seal?.document[0]?.preview : ""
                const backgroundImage = res_temp_panel?.data?.background?.length > 0 ? res_temp_panel?.data?.background[0] : "";
                setSignaturePreview(signature);
                setSealPreview(seal);
                setBackgroundPreview(backgroundImage)
                console.log(res_temp_panel, payrun, res_sub, 'payrun')

            }


        }
        catch (err) {
            console.log(err, 'err')
            // setGroupCheck(true);
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const handleDataFromChildPaySlip = async (data, user) => {
        console.log(user, 'user')

        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data._id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let dataWithSerialNumber = res.data.spayrunlist.data?.filter(data => data?.company === user?.company
            && data?.branch === user?.branch
            && data?.unit === user?.unit
            && data?.team === user?.team && data?.companyname === user?.companyname
        ).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            outerId: data._id,
            selectedmonth: data.month,
            selectedyear: data.year,

            salarytypefinal: item.salarytypefinal ? item.salarytypefinal : item.salarytype,
            deductiontypefinal: item.deductiontypefinal ? item.deductiontypefinal : item.deductiontype,
            otherdeductionfinal: item.otherdeductionfinal ? item.otherdeductionfinal : item.otherdeduction,

            lossdeductionfinal: item.lossdeductionfinal ? item.lossdeductionfinal : (item.salarytype === "Final Salary" ? item.lossdeduction : item.salarytype === "Fixed Salary" ? item.fixedlossdeduction : item.prodlossdeduction)

        }))

        const sortedData = dataWithSerialNumber.sort((a, b) => {

            if (Number(b.experience) !== Number(a.experience)) {
                return Number(b.experience) - Number(a.experience);
            }

            return a.companyname.localeCompare(b.companyname);
        })

        const datasplitted = Object.values(sortedData.reduce((acc, item) => {
            const { salarytypefinal } = item;
            if (!acc[salarytypefinal]) {
                acc[salarytypefinal] = { salarytypefinal, data: [] };
            }
            acc[salarytypefinal].data.push({ ...item });
            return acc;
        }, {}));
        let finaldownloadData = datasplitted.map(d => {
            return d.data.map((t, index) => {
                let commonFields = {
                    Sno: index + 1,
                    Company: t.company,
                    Branch: t.branch,
                    Unit: t.unit,
                    "Emp Code": t.empcode,
                    "Aadhar Name": t.legalname,
                    "TTS Name": t.companyname,
                    Designation: t.designation,
                    Team: t.team,
                    "ProcessCode Exp": t.processcodeexp,
                    DOJ: t.doj,
                    "Experience In Months": Number(t.experience),
                    "Bank Name": t.bankname,
                    "Account Name": t.accountholdername,
                    "Account Number": t.accountnumber,
                    "IFSC Code": t.ifsccode,
                    UAN: t.uan,
                    "IP Name": t.ipname,
                    "Total No Of Days": Number(t.totalnumberofdays),
                    "Total Shift": Number(t.totalshift),
                    CLSL: Number(t.clsl),
                    "Week Off": Number(t.weekoffcount),
                    Holiday: Number(t.holiday),
                    "Total Absent/Leave": Number(t.totalasbleave),
                    "Total Paid Days": Number(t.totalpaidDays),
                    "Actual Basic": Number(t.basic),
                    "Actual HRA": Number(t.hra),
                    "Actual Conveyance": Number(t.conveyance),
                    "Actual Medical Allowance": Number(t.medicalallowance),
                    "Actual Production Allowance": Number(t.productionallowance),
                    "Actual Production Allowance 2": Number(t.productionallowancetwo),
                    "Actual Other Allowance": Number(t.otherallowance),
                    "Target Points": Number(t.monthPoint),
                    "Achieved Points": Number(t.acheivedpoints),
                    "Achieved %": Number(t.acheivedpercent),
                    "Penalty Amount": Number(t.penaltyamount),


                };

                if (d.salarytypefinal === "Final Salary") {
                    return {
                        ...commonFields,
                        "Other Deduction": Number(t.otherdeduction),
                        "Loss Deduction": Number(t.lossdeduction),
                        "Basic": Number(t.finalbasic),
                        "HRA": Number(t.finalhra),
                        "Conveyance": Number(t.finalconveyance),
                        "Medical Allowance": Number(t.finalmedicalallowance),
                        "Production Allowance": Number(t.finalproductionallowance),
                        "Other Allowance": Number(t.finalotherallowance),
                        "Net Salary": Number(t.finalnetsalary),
                        "PF Days": Number(t.pfdays),
                        "PF Deduction": Number(t.pfdeduction),
                        "ESI Deduction": Number(t.esideduction),
                        "F.L.O.P": Number(t.paysliplop),
                        "Professional Tax": Number(t.professionaltax),
                        "Total Deductions": Number(t.totaldeductions),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.finalsalary),
                        "Salary-Penalty": Number(t.finalsalarypenalty),
                        "Final Value": Number(t.finalvalue),
                        "Final Value-Penalty": Number(t.finalvaluepenalty),
                        CTC: Number(t.ctc),
                        "Actual Deduction": Number(t.actualdeduction),
                        "Minimum Deduction": Number(t.minimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                } else if (d.salarytypefinal === "Fixed Salary") {
                    return {
                        ...commonFields,
                        "Other Deduction": Number(t.otherdeduction),
                        "Fixed Loss Deduction": Number(t.fixedlossdeduction),
                        "Basic": Number(t.fixedbasic),
                        "HRA": Number(t.fixedhra),
                        "Conveyance": Number(t.fixedconveyance),
                        "Medical Allowance": Number(t.fixedmedicalallowance),
                        "Production Allowance": Number(t.fixedproductionallowance),
                        "Other Allowance": Number(t.fixedotherallowance),
                        "Net Salary": Number(t.fixednetsalaryone),
                        "PF Days": Number(t.pfdays),

                        "PF Deduction": Number(t.fixedemppf),
                        "ESI Deduction": Number(t.fixedempesi),
                        "F.L.O.P": Number(t.fixedlop),
                        "Professional Tax": Number(t.fixedempptax),
                        "Total Deductions": Number(t.fixedtotaldeductions),
                        "No. Allowance Shift": Number(t.noallowancepoint),
                        "Night Shift Allowance": Number(t.nightshiftallowance),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.fixedsalary),
                        "Salary+Penalty": Number(t.fixedsalarypenalty),
                        "Final Value": Number(t.fixedfinalvalue),
                        "Final Value-Penalty": Number(t.fixedfinalvalue),
                        "Fixed CTC": Number(t.fixedctc),
                        "Fixed Actual Deduction": Number(t.fixedactualdeduction),
                        "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                } else {
                    return {
                        ...commonFields,
                        "PROD Loss Deduction": Number(t.prodlossdeduction),
                        "Basic": Number(t.prodbasicp),
                        "HRA": Number(t.prodhrap),
                        "Conveyance": Number(t.prodconveyancep),
                        "Medical Allowance": Number(t.prodmedicalallowancep),
                        "Production Allowance": Number(t.prodproductionallowancep),
                        "Other Allowance": Number(t.prodotherallowancep),
                        "Net Salary": Number(t.prodnetsalaryonep),
                        "PF Days": Number(t.pfdays),

                        "PF Deduction": Number(t.prodemppf),
                        "ESI Deduction": Number(t.prodempesi),
                        "FLOP": Number(t.prodlop),
                        "Professional Tax": Number(t.prodempptax),
                        "Total Deductions": Number(t.prodtotaldeductions),
                        "No. Allowance Shift": Number(t.noallowancepoint),
                        "Night Shift Allowance": Number(t.nightshiftallowance),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.prodsalary),
                        "Salary-Penalty": Number(t.prodsalarypenalty),
                        "Final Value": Number(t.prodfinalvalue),
                        "Final Value-Penalty": Number(0),
                        "PROD CTC": Number(t.prodctc),
                        "PROD Actual Deduction": Number(t.prodactualdeduction),
                        "PROD Minimum Deduction": Number(t.prodminimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                }
            });
        });

        let excelData = finaldownloadData.flat().map((d, index) => ({ ...d, Sno: index + 1 }))
        setPaySlipDatas(excelData[0]);
    }




    useEffect(() => {
        fetchControlSettings();
    }, [userID]);


    function numberToWords(number) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const suffixes = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

        if (number === 0) {
            return 'Zero';
        }

        function convertLessThanOneThousand(num) {
            if (num < 10) {
                return ones[num];
            } else if (num < 20) {
                return teens[num - 10];
            } else if (num < 100) {
                return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
            } else {
                return ones[Math.floor(num / 100)] + ' Hundred ' + convertLessThanOneThousand(num % 100);
            }
        }

        function convert(number) {
            if (number === 0) {
                return '';
            }

            let result = '';
            for (let i = 0; number > 0; i++) {
                if (number % 1000 !== 0) {
                    result = convertLessThanOneThousand(number % 1000) + ' ' + suffixes[i] + ' ' + result;
                }
                number = Math.floor(number / 1000);
            }
            return result.trim();
        }

        return convert(number);
    }



    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };



    let snos = 1;

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Group Name", field: "name" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: items,
        });
        doc.save("Group.pdf");
    };



    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Group",
        pageStyle: "print",
    });



    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);


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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

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
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
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
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "name", headerName: "Group Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },


    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            // serialNumber: item.serialNumber,
            // name: item.name,
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

    // // Function to filter columns based on search query
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
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    // color: (theme) => theme.palette.grey[500],
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
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            />
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

    // return (
    //     <div ref={ref} style={{ padding: '20px', backgroundColor: '#fff', width: '800px', display: 'none' }}>
    //       <h1>Payslip</h1>
    //       <p>Employee: {employeeDetails.name}</p>
    //       <p>Salary: {salaryDetails.amount}</p>
    //       {/* Add more details here */}
    //     </div>
    //   );
    // });



    return (
        Object.keys(paySlipData)?.length === 0 ? <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100%",   // Full width
            backgroundColor: "#f5f5f5", // Optional: Add background color
        }}><Loader />
        </div> :
            <Box>
                <Headtitle title={"Pay Slip"} />
                {/* ****** Header Content ****** */}
                {/* {isUserRoleCompare?.includes("apayslip") && ( */}
                {/* <Box sx={{ backgroundColor: "white", width: '732px' }} ref={designRef}> */}
                <>
                    {isEmpty && <Typography sx={userStyle.HeaderText}> Pay Slip </Typography>}
                    <br />
                    {/* {rowGetId === "Teammember" ? "" : <button onClick={handleConvert}>Download</button>} */}
                    {isEmpty && <Button variant="contained" onClick={handleDownloadPDF}>Download PDF</Button>}
                    <br />

                    <Box sx={{
                        ...useStyles.dialogbox,
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center the watermark
                            width: '75%',
                            height: '50%',
                            backgroundImage: `url(${backgroundPreview?.letterheadbodycontent[0]?.preview})`,
                            backgroundSize: 'contain',  // Adjust size here (e.g., 'cover' or 'contain')
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            opacity: 0.1,  // Adjust the opacity for the watermark effect
                            zIndex: 0,
                        },
                    }} ref={data ? ref : payslipRef}>
                        <>
                            <br />
                            <Grid container spacing={1} sx={{ border: "3px solid black", padding: "6px", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }} >
                                <Grid item lg={4} md={12} xs={12} sm={12} sx={{ padding: "1px", marginBottom: "3px", marginLeft: "45px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FormControl fullWidth size="small" >
                                        {/* <img src={Logo} style={{ objectFit: "contain" }} /> */}
                                        <img src={backgroundPreview?.documentcompany[0]?.preview} height={200} width={200} alt="Company Logo" />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    lg={6.98}
                                    md={12}
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: isSmallScreen ? "center" : "flex-start",
                                        marginTop: "37px",
                                        marginBottom: "3px",
                                        marginLeft: "1px",
                                    }}
                                >
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: isSmallScreen ? "center" : "flex-start",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
                                                fontSize: "20px",
                                                fontWeight: "500",
                                                margin: "0px 0px 5px 0px",
                                                color: "#444 !important",
                                            }}
                                        >
                                            <strong>{backgroundPreview?.company}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: "400",
                                                margin: "0px 0px 5px 0px",
                                            }}
                                        >
                                            {backgroundPreview?.address}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "0.5px solid black", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography sx={{
                                            fontSize: "15px",
                                            fontWeight: "100",
                                            color: "#adaaaa !important",
                                        }}> <strong> Payslip For The Month Of {paySlipMonth} {paySlipYear}</strong> </Typography>
                                    </FormControl>
                                </Grid>

                                <TableContainer component={Paper} elevation={0} sx={{ marginBottom: "16px", border: "none" }}>
                                    <Table size="small" sx={{ borderCollapse: "collapse" }}>
                                        <TableHead>
                                            <TableRow sx={{ height: "10px !important" }}>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}> Emp Name</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5", fontSize: "12px !important" }} >{userData?.firstname} {userData?.lastname}</TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, lineHeight: "0.5", borderBottom: "none" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: "15px !important" }}>
                                                <TableCell sx={{ ...useStyles.SubHeader, lineHeight: "0.5", borderBottom: "none" }}>EmpCode</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5", fontSize: "12px !important" }} >{paySlipData?.["Emp Code"]}</TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, lineHeight: "0.5", borderBottom: "none" }}>Name of Bank</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5", fontSize: "12px !important" }}>{paySlipData?.["Bank Name"]}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>Designation</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["Designation"]}</TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>Account no</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["Account Number"]}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>DOJ</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["DOJ"]}</TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>No of Working Days</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["Total No Of Days"]}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>Leave Taken</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["Total Absent/Leave"]}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}></TableCell>
                                                <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "0.5" }}>No. of Present Days</TableCell>
                                                <TableCell sx={{ borderBottom: "none", lineHeight: "0.5" }}>:</TableCell>
                                                <TableCell sx={{ borderBottom: "none", fontSize: "12px !important", lineHeight: "0.5" }}>{paySlipData?.["Total Paid Days"]}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </TableContainer>
                                <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={useStyles.tableHeaderText}>
                                                    <Typography sx={{ fontSize: "15px" }}><strong>S.No</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={useStyles.tableHeaderText}>
                                                    <Typography sx={{ fontSize: "15px" }}><strong>EARNINGS</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: "bold",
                                                    border: "0.5px solid",
                                                    padding: "5px",
                                                    textAlign: "right",
                                                }}>
                                                    <Typography sx={{ fontSize: "15px" }}><strong>AMOUNT</strong></Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', lineHeight: "0.5", borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableHeaderText, lineHeight: "0.5" }}>
                                                    <Typography sx={{ fontSize: "15px" }}><strong>S.No</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableHeaderText, lineHeight: "0.5" }}>
                                                    <Typography sx={{ fontSize: "15px" }}><strong>DEDUCTIONS</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: "bold",
                                                    border: "0.5px solid",
                                                    padding: "5px",
                                                    textAlign: "right",
                                                    lineHeight: "0.5"
                                                }}>
                                                    <Typography sx={{ fontSize: "15px" }} ><strong>AMOUNT</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* Each row contains a spacer cell as well */}
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>1</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Basic</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: '12px' }}>{paySlipData?.["Basic"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>1</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Leave Deduction</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: '12px' }}>
                                                        {paySlipData?.["Leave Deduction"] ? paySlipData?.["Leave Deduction"] : 0}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>


                                            {/* Repeat the above structure for each row */}
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>2</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>HRA</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["HRA"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>2</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: "12px" }}>EPF</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["PF Deduction"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            {/* Add more rows as needed following the same pattern */}
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>3</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Conveyance</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["Conveyance"]}</Typography>
                                                </TableCell>
                                                {/* Spacer between columnsdfdf */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>3</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>ESI</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["ESI Deduction"]}</Typography>
                                                </TableCell>
                                            </TableRow>

                                            {/* Continue for all rows */}
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>4</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Medical Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["Medical Allowance"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>4</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Professional Tax</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["Professional Tax"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>5</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Other Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["Other Allowance"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>5</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>TDS</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.incometax}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>6</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Production Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{paySlipData?.["Production Allowance"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.incometax}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>7</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Over Time</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.conveyance}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.incometax}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>8</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Incentives</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.conveyance}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.incometax}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>9</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}>Night Shift Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.conveyance}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ fontSize: '12px' }}></Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues, fontSize: "12px" }}>{payslip.incometax}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ height: '0.5rem' }}>
                                                <TableCell colSpan={2} sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px', textAlign: 'center' }}>
                                                    <Typography>Total</Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px' }}>
                                                    <Typography sx={{ ...useStyles.tableValues }}> {paySlipData?.["Net Salary"]}</Typography>
                                                </TableCell>

                                                {/* Spacer between columns */}
                                                <TableCell sx={{ width: '50px', height: '0.5rem', lineHeight: '0.5', padding: '2px', borderBottom: "0.5px solid #fff" }}></TableCell>


                                                <TableCell colSpan={2} sx={{ ...useStyles.tableCellTexted, height: '0.5rem', lineHeight: '0.5', padding: '2px', textAlign: 'center' }}>
                                                    <Typography>Total</Typography>
                                                </TableCell>

                                                <TableCell sx={{ ...useStyles.tableCellTexted, lineHeight: "1" }}>
                                                    <Typography sx={{ ...useStyles.tableValues }}>{paySlipData?.["Total Deductions"]}</Typography>
                                                </TableCell>
                                            </TableRow>

                                            {/* Continue adding rows as required */}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", padding: "5px", marginBottom: "3px" }}></Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ padding: "5px", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>

                                    <Grid sx={{ width: "500px" }} >
                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }}>

                                                    Total Earnings:

                                                </Typography>
                                            </FormControl>
                                            <FormControl fullWidth size="small">

                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }}>

                                                    <strong>{paySlipData?.["Net Salary"]}</strong>

                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }} >

                                                    Less Total Deductions:

                                                </Typography>
                                            </FormControl>
                                            <FormControl fullWidth size="small">

                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }} >

                                                    <strong>{paySlipData?.["Total Deductions"]}</strong>

                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                                            <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }}>
                                                        Net Pay:
                                                    </Typography>
                                                </FormControl>
                                                <FormControl fullWidth size="small">
                                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                                    <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }} ><strong>{paySlipData?.["Salary"]}</strong></Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={12} xs={12} sm={12} >
                                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}  >
                                                    <Typography sx={{ fontSize: "12px" }}>{`(${toWords?.convert(paySlipData?.["Salary"])}) Only`}</Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                {(signaturePreview !== "" && sealPreview !== "") ?
                                    <Grid container spacing={2} sx={{ marginTop: "15px" }}>
                                        {/* Signature Grid */}
                                        <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <img src={signaturePreview} alt="Signature" height={50} width={60} />
                                            </FormControl>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "black" }}>
                                                <Typography sx={{ fontSize: "12px" }}><strong>Signature</strong></Typography>
                                            </FormControl>
                                        </Grid>

                                        {/* Seal Grid */}
                                        <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <img src={sealPreview} alt="Seal" height={75} width={75} />
                                            </FormControl>
                                        </Grid>

                                    </Grid> :
                                    <Typography sx={{
                                        fontSize: "12px",
                                        textAlign: "left",
                                        margin: 0,
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0
                                    }}><strong>* This is a Computer Generated Payslip ,hence Signature is not required.</strong></Typography>}


                                {qrCode === "true" && <Grid container spacing={2} sx={{ marginTop: "12px" }}>
                                    {/* Qr Code Grid */}
                                    <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                            <img src={imageUrl} alt="Qr Code" height={100} width={100} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={10} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px" }}>
                                        <Typography sx={{ fontSize: "10px" }}>1. Scan to verify the authenticity of this document.</Typography>
                                        <Typography sx={{ fontSize: "10px" }}>2. This document was generated on {moment(new Date()).format("DD-MM-YYYY hh:mm a")}</Typography>
                                        <Typography sx={{ fontSize: "10px" }}>3. For questions, contact us at {paySlipData?.email}.</Typography>
                                    </Grid>

                                </Grid>}
                            </Grid>

                        </>
                    </Box>
                </>
                {/* </Box> */}



                {/* <button onClick={handleConvert}>Download</button> */}
                {/* )} */}

                {/* ****** Table Start ****** */}

                {/* Manage Column */}
                <Popover
                    id={ids}
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



                {/* ALERT DIALOG */}
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
            </Box>
    );
};

export default forwardRef(Payslip);
