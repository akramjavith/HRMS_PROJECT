import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, Popover, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2pdf from 'html2pdf.js';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BASE_URL } from "../../../services/Authservice";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, forwardRef, useRef, useState } from "react";
import Resizable from "react-resizable";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import hilifelogo from "../../../images/hilogo.png";
import LinearProgress from '@mui/material/LinearProgress';
import QRCode from 'qrcode';
import { ToWords } from "to-words"
import "./Loader.css";


const Loader = () => {
    return <div className="loader1"></div>;
};


const useStyles = {

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
            paddingTop: "20px",
            paddingBottom: "20px",
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

    SubHeader: {
        fontSize: "12px",
        display: "inline-block",
        fontWeight: "400",
        color: "#444 !important",
    },
    tableCellText: {
        border: "0.5px solid",
        padding: "5px",
        textAlign: "left",
    },
    tableValues: {
        textAlign: "right",
    },
};
const PayslipTemplateTwo = (props, ref) => {
    const toWords = new ToWords();
    const { data, index } = props;
    const [payrungens, setPayrungens] = useState([]);
    const [payslip, setPaySlip] = useState([]);
    const [paySlipData, setPaySlipDatas] = useState([]);
    const [userData, setUserData] = useState({});
    const [signaturePreview, setSignaturePreview] = useState("")
    const [sealPreview, setSealPreview] = useState("");
    const [imageUrl, setImageUrl] = useState('');
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

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    useEffect(() => {
        // Disable right-click
        const handleRightClick = (event) => {
            event.preventDefault();
        };

        // Disable Ctrl + P (print)
        // const handlePrint = (event) => {
        //     if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        //         event.preventDefault();
        //         alert('Printing is disabled on this page.');
        //     }
        // };

        // Disable copy and paste
        // const handleCopy = (event) => {
        //     event.preventDefault();
        //     alert('Copying is disabled on this page.');
        // };

        // const handlePaste = (event) => {
        //     event.preventDefault();
        //     alert('Pasting is disabled on this page.');
        // };

        // Attach event listeners
        document.addEventListener('contextmenu', handleRightClick); // Disable right-click
        // document.addEventListener('keydown', handlePrint); // Disable print (Ctrl + P)
        // document.addEventListener('copy', handleCopy); // Disable copy
        // document.addEventListener('paste', handlePaste); // Disable paste

        // Cleanup event listeners when the component is unmounted
        return () => {
            document.removeEventListener('contextmenu', handleRightClick);
            // document.removeEventListener('keydown', handlePrint);
            // document.removeEventListener('copy', handleCopy);
            // document.removeEventListener('paste', handlePaste);
        };
    }, []);

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
            }


        }
        catch (err) {
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

        // downloadExcel(excelData, filename);

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

    const addSerialNumber = () => {
        const itemsWithSerialNumber = payrungens?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [payrungens]);

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

    return (
        Object.keys(paySlipData)?.length === 0 ? <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100%",   // Full width
            backgroundColor: "#f5f5f5", // Optional: Add background color
        }}><Loader />
        </div>
            :
            <Box>
                <Headtitle title={"Pay Slip"} />
                {/* ****** Header Content ****** */}
                {/* {isUserRoleCompare?.includes("apayslip") && ( */}
                {/* <Box sx={{ backgroundColor: "white", width: '732px' }} ref={designRef}> */}
                <>
                    {isEmpty && <Typography sx={userStyle.HeaderText}> Pay Slip </Typography>}
                    {isEmpty && <Button variant="contained" onClick={handleDownloadPDF}>Download PDF</Button>}
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
                            <Grid container spacing={1} sx={{ border: "3px solid black", padding: "5px", display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }} >
                                <Grid item lg={6} md={12} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "1px", marginBottom: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={backgroundPreview?.documentcompany[0]?.preview} height={150} width={200} alt="Company Logo" />

                                </Grid>
                                <Grid item lg={5.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", border: "0.5px solid black", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignContent: "start" }}>
                                        <Typography sx={userStyle.HeaderText}> <strong>{backgroundPreview?.company}</strong> </Typography>
                                        <Typography sx={{ ...userStyle.SubHeaderText, lineHeight: "2" }}> {backgroundPreview?.address}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>

                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            EMP CODE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>

                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            {paySlipData?.["Emp Code"]}
                                        </Typography>
                                    </FormControl>
                                </Grid>


                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>

                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            <strong>NAME</strong>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>

                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>{paySlipData?.["Aadhar Name"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            DEPARTMENT
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader }}>{userData?.department}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={useStyles.SubHeader} >
                                            DESIGNATION
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={useStyles.SubHeader} >{paySlipData?.["Designation"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "2px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={useStyles.SubHeader} >
                                            PERIOD END DATE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        {/* <Typography>{payslip.periodenddate}</Typography> */}
                                        <Typography sx={useStyles.SubHeader} >{moment(payslip.periodenddate).format("DD-MM-YYYY")}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={useStyles.SubHeader} >
                                            BANK ACCOUNT NUM
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={useStyles.SubHeader} >{paySlipData?.["Account Number"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={useStyles.SubHeader} >
                                            PAID DAYS
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader }}>{paySlipData?.["Total Paid Days"]}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            UAN NO.
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>{paySlipData?.["UAN"] ? paySlipData?.["UAN"] : ""}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            DATE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" >

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            <strong>EARNINGS</strong>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            <strong>AMOUNT</strong>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", padding: "5px", }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            <strong>DEDUCTIONS</strong>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", height: "27px !important", display: "flex", alignItems: "center", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small" >
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            <strong>AMOUNT</strong>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            BASIC
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px", }}>
                                    <FormControl fullWidth size="small" >
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Basic"]}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" >
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            PROVIDENT FUND
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["PF Deduction"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            HRA
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["HRA"]}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            ESI
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["ESI Deduction"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            MA
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Medical Allowance"]}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            OTHER DEDUCTIONS
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Other Deduction"]}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            CONVEYANCE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Conveyance"]}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            INCOME TAX
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Income Tax"] ? paySlipData?.["Income Tax"] : 0}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            PRODUCTION ALLOWANCE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Production Allowance"] ? paySlipData?.["Production Allowance"] : 0}</Typography>

                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            PROFESSIONAL TAX
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Professional Tax"] ? paySlipData?.["Professional Tax"] : 0}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            ATTENDANCE BONUS
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Attendance Bonus"] ? paySlipData?.["Attendance Bonus"] : 0}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            OVER TIME
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Over Time"] ? paySlipData?.["Over Time"] : 0}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            OTHER ALLOWANCE
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Other Alowance"] ? paySlipData?.["Other Allowance"] : 0}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ ...useStyles.SubHeader }}>
                                            PERFORMANCE BONUS
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}>{paySlipData?.["Perfomance Bonus"] ? paySlipData?.["Performance Bonus"] : 0}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", height: "27px !important", display: "flex", alignItems: "center", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                    <FormControl fullWidth size="small">

                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ ...useStyles.SubHeader }}>
                                                GROSS TOTAL
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3.5} xs={12} >
                                        <FormControl fullWidth size="small">
                                            {/* <Input fullWidth disableUnderline={true} /> */}
                                            <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}><strong>{paySlipData?.["Net Salary"] ? paySlipData?.["Net Salary"] : 0}</strong></Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3.2} xs={12} sm={12}  >
                                        <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <Typography sx={userStyle.SubHeaderText}  >
                                                DEDUCTION TOTAL
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3.1} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            {/* <Input fullWidth disableUnderline={true} /> */}
                                            <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end" }}><strong>{paySlipData?.["Total Deductions"] ? paySlipData?.["Total Deductions"] : 0}</strong></Typography>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px" }}>
                                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ ...useStyles.SubHeader }}>
                                                <strong>NET PAY</strong>
                                            </Typography>
                                        </FormControl>
                                        <FormControl fullWidth size="small">
                                            {/* <Input fullWidth disableUnderline={true} /> */}
                                            <Typography sx={{ ...useStyles.SubHeader, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "end", marginRight: "14px" }}><strong>{paySlipData?.["Salary"] ? paySlipData?.["Salary"] : 0}</strong></Typography>
                                        </FormControl>
                                    </Grid>< br />
                                    <Grid item md={4} xs={12} sm={12}  >
                                        <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <Typography sx={userStyle.titletxt} >
                                                <Typography sx={{ ...useStyles.SubHeader }}><strong>{`(${toWords?.convert(paySlipData?.["Salary"])} Only)`}</strong></Typography>
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    {(signaturePreview !== "" && sealPreview !== "") ?
                                        <Grid container spacing={2} sx={{ marginTop: "30px" }}>
                                            {/* Signature Grid */}
                                            <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                    <img src={signaturePreview} alt="Signature" height={50} width={70} />
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
                                        }}>
                                            <strong>* This is a Computer Generated Payslip, hence Signature is not required.</strong>
                                        </Typography>}

                                    {qrCode === "true" && <Grid container spacing={2} sx={{ marginTop: "20px" }}>
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
                            </Grid>

                        </>
                    </Box>
                </>
                {/* </Box> */}
                <br />
                {/* {rowGetId === "Teammember" ? "" : <button onClick={handleConvert}>Download</button>} */}
                {/* <Button onClick={handleDownloadPDF}>Download PDF</Button> */}

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
}

export default forwardRef(PayslipTemplateTwo);
