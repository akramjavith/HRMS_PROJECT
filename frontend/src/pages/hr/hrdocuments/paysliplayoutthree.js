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
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import { AuthContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";


function Payslipthree() {
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
        tableCellText: {
            border: "0px",
            padding: "5px",
            textAlign: "left",
            boxShadow: "none",
        },
    };
    const [payslip, setPaySlip] = useState([]);
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
    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setBdayCompanyLogo(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.companylogo
            );
        } catch (err) {
            console.log(err,'12')
        }
    };
    useEffect(()=>{
        fetchBdaySetting()
    },[])
    return (
        <Box>
            <Headtitle title={"Pay Slip"} />
            {/* ****** Header Content ****** */}
            <>
                <Typography sx={userStyle.HeaderText}> Pay Slip </Typography>
                <Box sx={userStyle.dialogbox} ref={payslipRef}>
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
                                            fontSize: "18px",
                                            fontWeight: "500",
                                            margin: "0px 0px 5px 0px",
                                            color: "black"
                                        }}
                                    >
                                        <strong>HILIFE.AI PRIVATE LIMITED</strong>
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            margin: "0px 0px 10px 0px",
                                        }}
                                    >
                                        No.2 Third Floor, Zee Towers, E.V.R. Road, Puthur
                                        Trichy 620017 Phone: 0431-2792269
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item lg={4} md={12} xs={12} sm={12} sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: "37px",
                                marginBottom: "3px",
                                alignItems: "end"
                            }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
                                    <img src={bdayCompanyLogo} style={{ objectFit: "contain", width: "100px", height: "100px", borderRadius: "100px" }} />
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} xs={12} sm={12} sx={{ marginBottom: "20px" }} >
                            </Grid>
                            <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: "0.5px solid black", marginBottom: "6px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                    <Typography sx={{
                                        fontSize: "20px",
                                        fontWeight: "100",
                                        color: "black"
                                    }}> <strong> Payslip For The Month Of May 2024</strong> </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "6px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                    <Typography sx={{
                                        fontSize: "16px",
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
                                                    <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}> Employee Name</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }} >AKILA SELVAN</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Designation</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>Software Engineer{payslip.department}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Date Of Joining</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }} >21-09-2014{payslip.empcode}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Pay Period</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>June-2020
                                                        </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Pay Date</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                                    <TableCell sx={{ borderBottom: "none" }}>30-06-2020</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid md={6} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Typography sx={{
                                            fontSize: "16px",
                                            fontWeight: "100",
                                            color: "black",
                                        }}> <strong>Employee Net Pay</strong> </Typography>
                                        <Typography sx={{
                                            fontSize: "26px",
                                            fontWeight: "100",
                                            color: "black",
                                        }}> <strong>₹43,150.00</strong> </Typography>
                                        <Typography sx={{
                                            fontSize: "16px",
                                            fontWeight: "100",
                                            color: "black",
                                        }}> <strong>Paid Days: 28 | LOP Days: 3</strong> </Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>EARNINGS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                borderTop: "1px solid black",
                                                borderBottom: "1px dotted black",
                                                padding: "5px",
                                                textAlign: "right",
                                            }}>
                                                <Typography ><strong>AMOUNT</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Each row contains a spacer cell as well */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Basic</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹25,000.00{payslip.basic}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Repeat the above structure for each row */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>House Rent Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹25,000.00{payslip.hra}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Add more rows as needed following the same pattern */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Conveyance Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹25,000.00{payslip.medicalallowance}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Continue for all rows */}
                                        <TableRow>
                                            <TableCell sx={{...useStyles.tableCellText, width: "400px"}}>
                                                <Typography>Children Education Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹25,000.00{payslip.conveyance}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Other Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹25,000.00{payslip.conveyance}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography><strong>Gross Earnings</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography><strong>₹25,000.00</strong></Typography>
                                            </TableCell>
                                            {/* Spacer between columns */}
                                        </TableRow>
                                        {/* Continue adding rows as required */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", padding: "15px" }}></Grid>
                            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>DEDUCTIONS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                borderTop: "1px solid black",
                                                borderBottom: "1px dotted black",
                                                padding: "5px",
                                                textAlign: "right",
                                            }}>
                                                <Typography ><strong>(-)AMOUNT</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Each row contains a spacer cell as well */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Income Tax</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹859.00{payslip.providentfund}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Repeat the above structure for each row */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>EPF Contribution</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹859.00{payslip.esi}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Add more rows as needed following the same pattern */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography><strong>Total Deduction</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography><strong>₹859.00{payslip.otherdeduction}</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Continue adding rows as required */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", padding: "15px" }}></Grid>
                            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>REIMBURSEMENTS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                borderTop: "1px solid black",
                                                borderBottom: "1px dotted black",
                                                padding: "5px",
                                                textAlign: "right",
                                            }}>
                                                <Typography ><strong>AMOUNT</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Each row contains a spacer cell as well */}
                                        <TableRow>
                                            <TableCell sx={{...useStyles.tableCellText,             width: "300px"}}>
                                                <Typography>Telephone Reimbursement</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹500.00{payslip.providentfund}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Repeat the above structure for each row */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Fuel Reimbursement</Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography>₹2000.00{payslip.esi}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Add more rows as needed following the same pattern */}
                                        <TableRow>
                                            <TableCell sx={{...useStyles.tableCellText,             width: "200px"}}>
                                                <Typography><strong>Total Reimbursement</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography><strong>₹2000.00{payslip.otherdeduction}</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                        <br></br>
                                        <br></br>
                                        <TableRow>
                                            <TableCell sx={{...useStyles.tableCellText,             width: "600px"}}>
                                                <Typography><strong>NET PAY ((Gross Earnings - Total Deductions) + Reimbursements) </strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{...useStyles.tableCellText, display: "flex", flexDirection: "row", justifyContent: "end"}}>
                                                <Typography><strong>₹43,150.00{payslip.otherdeduction}</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* Continue adding rows as required */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", padding: "5px", marginBottom: "3px" }}></Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", padding: "5px", marginBottom: "3px", marginLeft: "40px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}  >
                                    <Typography></Typography>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "black" }}  >
                                    <Typography><strong style={{fontSize: "22px", fontFamily: "League Spartan, serif"}}>Total Net Payable ₹43,150.00</strong> (Rupees Forty three thousand hundred and fifty only)</Typography>
                                </FormControl>
                            </Grid>
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

export default Payslipthree;
