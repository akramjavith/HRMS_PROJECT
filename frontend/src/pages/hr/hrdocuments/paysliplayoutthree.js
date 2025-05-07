import {
    Box, Button,
    Dialog, DialogActions, DialogContent, FormControl,
    Grid,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography,
    useMediaQuery
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import React, { useContext, useEffect, forwardRef, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import { AuthContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import html2pdf from 'html2pdf.js';
import { BASE_URL } from "../../../services/Authservice";
import LinearProgress from '@mui/material/LinearProgress';
import QRCode from 'qrcode';
import { ToWords } from "to-words"
import "./Loader.css";


const Loader = () => {
    return <div className="loader1"></div>;
};


const Payslipthree = (props, ref) => {
    const { data, index } = props;
    const toWords = new ToWords();
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const useStyles = {
        tableHeaderText: {
            fontWeight: "bold",
            borderTop: "1px solid black",
            borderBottom: "1px dotted black",
            padding: "5px",
            textAlign: "left",
            width: "200px"
        },
        SubHeader: {
            fontSize: "12px",
            display: "inline-block",
            fontWeight: "400",
            lineHeight: "1.5",
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
                paddingTop: "20px",
                paddingBottom: "20px",
            },
            "& .MuiTableCell-root": {
                fontSize: "12px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
                background: "#8080800f",
                border: "1px solid #00000021",
            },
            "& .MuiOutlinedInput-root": {
                height: "40px",
            },
        },
        tableCellText: {
            border: "0px",
            padding: "5px",
            textAlign: "left",
            boxShadow: "none",
        },
    };
    const [paySlipData, setPaySlipDatas] = useState({});
    const [userData, setUserData] = useState({});
    const [signaturePreview, setSignaturePreview] = useState("")
    const [sealPreview, setSealPreview] = useState("")
    const [backgroundPreview, setBackgroundPreview] = useState("")
    const [imageUrl, setImageUrl] = useState('');
    const { auth } = useContext(AuthContext);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const ids = useParams().id;
    const payslipRef = useRef(null);
    useEffect(() => {
        // Disable right-click
        const handleRightClick = (event) => {
            event.preventDefault();
        };

        // // Disable Ctrl + P (print)
        // const handlePrint = (event) => {
        //     if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        //         event.preventDefault();
        //         alert('Printing is disabled on this page.');
        //     }
        // };

        // // Disable copy and paste
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

    const handleDownloadPDF = () => {
        const element = payslipRef.current; // Your HTML element reference
        const opt = {
            margin: 1,
            filename: `${userData?.companyname}_Payslip.pdf`,
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
                            <Grid container spacing={1} sx={{ padding: "6px", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }} >
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
                                        marginTop: "60px",
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
                                                fontSize: "15px",
                                                fontWeight: "500",
                                                margin: "0px 0px 5px 0px",
                                                color: "black"
                                            }}
                                        >
                                            <strong>{backgroundPreview?.company}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                fontWeight: "400",
                                                margin: "0px 0px 10px 0px",
                                            }}
                                        >
                                            {backgroundPreview?.address}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={12} xs={12} sm={12} sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    marginBottom: "3px",
                                    alignItems: "end"
                                }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
                                        <img src={backgroundPreview?.documentcompany[0]?.preview} style={{ objectFit: "contain" }} height={50} width={65} alt="Company Logo" />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: "0.5px solid black", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "100",
                                            color: "black"
                                        }}> <strong> Payslip For The Month Of  {paySlipMonth} {paySlipYear}</strong> </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginLeft: "1px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                        <Typography sx={{
                                            fontSize: "10px",
                                            fontWeight: "100",
                                        }}> <strong>EMPLOYEE PAY SUMMARY</strong> </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", margin: "0px" }}>
                                    <Grid md={6} xs={12} sm={12} >
                                        <TableContainer component={Paper} elevation={0} sx={{ margin: "0px", border: "none" }}>
                                            <Table size="small" sx={{ borderCollapse: "collapse" }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}> Employee Name</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>:</TableCell>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>{paySlipData?.["Aadhar Name"]}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>Designation</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>:</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>Software Engineer{paySlipData?.["Designation"]}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>Date Of Joining</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>:</TableCell>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>{paySlipData?.["DOJ"]}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>Pay Period</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>:</TableCell>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>{paySlipMonth}-{paySlipYear}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>Pay Date</TableCell>
                                                        <TableCell sx={{ borderBottom: "none", lineHeight: "1em" }}>:</TableCell>
                                                        <TableCell sx={{ ...useStyles.SubHeader, borderBottom: "none", lineHeight: "1em" }}>30-06-2020</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    <Grid md={6} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                                        <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <Typography sx={{
                                                fontSize: "12px",
                                                fontWeight: "100",
                                                color: "black",
                                            }}> <strong>Employee Net Pay</strong> </Typography>
                                            <Typography sx={{
                                                fontSize: "15px",
                                                fontWeight: "100",
                                                color: "black",
                                            }}> <strong>{paySlipData?.["Salary"]}</strong> </Typography>
                                            <Typography sx={{
                                                fontSize: "12px",
                                                fontWeight: "100",
                                                color: "black",
                                            }}> <strong>Paid Days: {paySlipData?.["Total Paid Days"]} | LOP Days: {paySlipData?.["Total Absent/Leave"]}</strong> </Typography>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="paySlipData table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableHeaderText, fontSize: "12px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>EARNINGS</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: "bold",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px dotted black",
                                                    padding: "5px",
                                                    textAlign: "right",
                                                    fontSize: "12px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>AMOUNT</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Basic</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["Basic"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>House Rent Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["HRA"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Conveyance Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["Conveyance"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Other Allowance</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["Other Allowance"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>Gross Earnings</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>₹{paySlipData?.["Net Salary"]}</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="deductions table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableHeaderText, fontSize: "152x", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>DEDUCTIONS</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: "bold",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px dotted black",
                                                    padding: "5px",
                                                    textAlign: "right",
                                                    fontSize: "12px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>(-)AMOUNT</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Professional Tax</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["Professional Tax"] ? paySlipData?.["Professional Tax"] : 0}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>EPF Contribution</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["PF Deduction"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>ESI Contribution</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["ESI Deduction"]}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>Total Deduction</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>₹{paySlipData?.["Total Deductions"]}</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="reimbursements table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableHeaderText, fontSize: "12px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>REIMBURSEMENTS</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: "bold",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px dotted black",
                                                    padding: "5px",
                                                    textAlign: "right",
                                                    fontSize: "12px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "12px" }}><strong>AMOUNT</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, width: "300px", fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Telephone Reimbursement</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹{paySlipData?.["Telephone Reimbursement"] ? paySlipData?.["Telephone Reimbursement"] : 0}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>Fuel Reimbursement</Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}>₹2000.00{paySlipData.esi}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, width: "200px", fontSize: "10px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>Total Reimbursement</strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "10px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}> <strong>₹{paySlipData?.["Fuel Reimbursement"] ? paySlipData?.["Fuel Reimbursement"] : 0}</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ ...useStyles.tableCellText, width: "600px", fontSize: "12px", lineHeight: "1" }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>NET PAY ((Gross Earnings - Total Deductions) + Reimbursements) </strong></Typography>
                                                </TableCell>
                                                <TableCell sx={{
                                                    ...useStyles.tableCellText,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    fontSize: "12px",
                                                    lineHeight: "1"
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: "10px" }}><strong>₹{paySlipData?.["Salary"]}</strong></Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", padding: "5px", marginBottom: "3px", marginLeft: "40px" }}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "black" }}  >
                                        <Typography sx={{ fontSize: "15px" }}><strong style={{ fontSize: "189x", fontFamily: "League Spartan, serif" }}>Total Net Payable ₹{paySlipData?.["Salary"]}</strong> {`(${toWords?.convert(paySlipData?.["Salary"])}) Only`}</Typography>
                                    </FormControl>
                                </Grid>
                                {(signaturePreview !== "" && sealPreview !== "") ?
                                    <Grid container spacing={2} sx={{ marginTop: "30px" }}>
                                        {/* Signature Grid */}
                                        <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <img src={signaturePreview} alt="Signature" height={100} width={100} />
                                            </FormControl>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "black" }}>
                                                <Typography sx={{ fontSize: "12px" }}><strong>Signature</strong></Typography>
                                            </FormControl>
                                        </Grid>

                                        {/* Seal Grid */}
                                        <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <img src={sealPreview} alt="Seal" height={100} width={100} />
                                            </FormControl>
                                        </Grid>

                                    </Grid> : <Typography sx={{
                                        fontSize: "12px",
                                        textAlign: "left",
                                        margin: 0,
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0
                                    }}><strong>* This is a Computer Generated Payslip ,hence Signature is not required.</strong></Typography>}

                                {qrCode === "true" && <Grid container spacing={2} sx={{ marginTop: "40px" }}>
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
                <br />
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

export default forwardRef(Payslipthree);
