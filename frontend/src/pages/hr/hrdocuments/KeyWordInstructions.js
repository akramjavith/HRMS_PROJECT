import React, { useContext } from "react";
import { userStyle } from "../../../pageStyle";
import { Box, Typography, TableBody, Paper, Table, TableHead, TableContainer } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import Headtitle from "../../../components/Headtitle";
import { UserRoleAccessContext } from "../../../context/Appcontext";

function KeyWordInstructions() {
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  return (
    <Box>
      <Headtitle title={"KEYWORD INSTRUCTIONS"} />
      <Typography sx={userStyle.HeaderText}>Keyword Instructions</Typography>
      {/* ****** Instructions Box ****** */}
      {isUserRoleCompare?.includes("lkeywordinstructions") && (
        <Box sx={userStyle.container}>
          <Typography sx={userStyle.importheadtext}>Instructions</Typography>
          <br />
          <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before Creating Template</Typography>
          <br />
          <TableContainer
            component={Paper}
            sx={{
              padding: 1,
              width: "100%",
              margin: "auto",
              overflow: "auto",
              "&::-webkit-scrollbar": { width: 20 },
              "&::-webkit-scrollbar-track": { backgroundColor: "pink" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "blue" },
            }}
          >
            {/* ****** Table ****** */}
            <Table md={{ minWidth: 200, maxHeight: "5px", overflow: "auto" }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell align="left">Keywords</StyledTableCell>
                  <StyledTableCell align="left">Instructions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    1
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$LEGALNAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Legal Name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    2
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DOB$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Date of Birth of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    3
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$P:ADDRESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Permanent Address of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    4
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:ADDRESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Current Address of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    5
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$EMAIL$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Email Address of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    6
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$P:NUMBER$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Personal Number of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    7
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DOJ$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Date of Joining of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    8
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$EMPCODE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee Code of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    9
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$BRANCH$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Branch of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    10
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$LOGIN$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Username of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    11
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Company Name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    12
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$F:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the First Name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    13
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$L:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Last Name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    14
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DESIGNATION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Designation of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    15
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$UNIT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Unit of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    16
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$TEAM$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Team of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    17
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PROCESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}> It denotes the Process of the selected person </Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    18
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DEPARTMENT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Department of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    19
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$LWD$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Last Working Day</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    20
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$SHIFT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Shift Timing of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    21
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$AC:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Account Name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    22
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$AC:NUMBER$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Account Number of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    23
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$IFSC$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the IFSC Code of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    24
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:DATE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Current Date</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    25
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:TIME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Current Time</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    26
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$BREAK$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Break Time of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    27
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$WORKSTATION:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Work station name of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    28
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$WORKSTATION:COUNT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Workstation count of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    29
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$SYSTEM:COUNT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the System count of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    30
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$SIGNATURE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Signature of the person</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    31
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$FSIGNATURE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the For Seal with an Signature of the Document</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    32
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$RSEAL$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Round Seal of the Document</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    33
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$UNIID$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Unique id of the Document</Typography>
                  </StyledTableCell>
                </StyledTableRow>


                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    34
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$TEMPLATENAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Template Name for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>



                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    35
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$REFERENCEID$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Reference ID for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>



                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    36
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$CANDIDATENAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Name for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    37
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$COMPANYNAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Sender's Company Name for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>



                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    38
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DESIGNATION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Sender's Desognation for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>


                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    39
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$COMPANY$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Sender's Company for the Email format</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    40
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$ATTENDANCEDATE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Attendance status in date wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    41
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$ATTENDANCEMONTH$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Attendance status in month wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    42
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODUCTIONDATETARGET$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Production target Status in date wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    43
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODUCTIONDATEPOINT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Production point earned Status in Date wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    44
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODUCTIONMONTHTARGET$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Production target Status in Month wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    45
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODUCTIONMONTHPOINT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Employee's Production point earned Status in Month wise</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    46
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$GENDERHE/SHE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Gender of an employee like He/She</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    47
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$GENDERHE/SHE/SMALL$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Gender of an employee like he/she</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    48
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$GENDERHIM/HER$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Gender of an employee like Him/Her</Typography>
                  </StyledTableCell>
                </StyledTableRow>





                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    49
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$SALUTATION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes gesture used as a greeting.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    50
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$F.COMPANY$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the From Company Name of Company Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    51
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$F.BRANCH$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the From Branch Name of Company Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    52
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$F.BRANCHADDRESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the From Branch Address of Company Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    53
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$T.COMPANY$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the To Company Name of Company Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    54
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$T.COMPANYADDRESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the To Company Address of Company Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>

              </TableBody>
            </Table>
            {/* ****** Table Ends ****** */}
          </TableContainer>
          <br />
        </Box>
      )}
      {/* ****** Instructions Box Ends ****** */}
    </Box>
  );
}

export default KeyWordInstructions;