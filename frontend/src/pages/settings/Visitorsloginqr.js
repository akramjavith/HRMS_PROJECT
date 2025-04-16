import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Button, Dialog, DialogActions, DialogContent, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import PageHeading from "../../components/PageHeading";


const Visitorlogin = () => {
    const { auth } = useContext(AuthContext);
    const { isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [units, setUnits] = useState([]);
    const fetchUnits = async () => {

        const accessbranch = isAssignBranch
        ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
        : []; // Return an empty array if isAssignBranch is undefined or null
  
        setPageName(!pageName)
        try {
            let res_unit = await axios.post(SERVICE.BRANCHQRCODE, {
                assignbranch: accessbranch
              }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
           
            setUnits(res_unit?.data?.branch);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    useEffect(() => {
        fetchUnits()
    }, [])
    return (
        <Box sx={{ justifyContent: "center" }}>
            {/* <Typography sx={userStyle.HeaderText} style={{ textAlign: "center", margin: "20px" }}>Branch Wise QRCode</Typography> */}
            <PageHeading
                title="Branch Wise QRCode"
                modulename="Settings"
                submodulename="Visitor Login"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

            <Box sx={userStyle.dialogbox}>
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Company</StyledTableCell>
                                    <StyledTableCell align="left">Branch</StyledTableCell>
                                    <StyledTableCell align="left">Qr Code</StyledTableCell>
                                    <StyledTableCell align="left">Copy Link</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {units &&
                                    (units.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="left">{row.company}</StyledTableCell>
                                            <StyledTableCell align="left">{row.name}</StyledTableCell>
                                            <StyledTableCell align="left">{<img src={row.qrcode} width={50} height={50} />}</StyledTableCell>
                                            <StyledTableCell align="left">{row.qrcode ? <><Button variant="contained" color="primary"><a style={{ color: "white" }} href={`/Checkinvisitor/${row.company}/${row.name}`} target="_blank">
                                                Copy Visitor Link
                                            </a></Button></> : <></>}</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* ALERT DIALOG */}
                    <Box>
                        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <Typography variant="h6">{showAlert}</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" color="error" onClick={handleCloseerr}>
                                    ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>
        </Box>
    )
}
export default Visitorlogin;