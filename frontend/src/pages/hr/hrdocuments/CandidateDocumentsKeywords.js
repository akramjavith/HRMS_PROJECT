import React, { useContext } from "react";
import { userStyle } from "../../../pageStyle";
import { Box, Typography, TableBody, Paper, Table, TableHead, TableContainer } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import Headtitle from "../../../components/Headtitle";
import { UserRoleAccessContext } from "../../../context/Appcontext";

function CandidateDocumentsKeywords() {
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  return (
    <Box>
      <Headtitle title={"CANDIDATE DOCUMENTS KEYWORDS"} />
      <Typography sx={userStyle.HeaderText}>Candidate Documents Keyword Instructions</Typography>
      {/* ****** Instructions Box ****** */}
      {isUserRoleCompare?.includes("lcandidatedocumentskeywords") && (
        <Box sx={userStyle.container}>
          <Typography sx={userStyle.importheadtext}>Instructions</Typography>
          <br />
          <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before Creating Template - <b>COMPANY DOCUMENT</b></Typography>
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
                      <Typography sx={userStyle.importTabledata}>$GROSS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Gross Salary for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    2
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$BASIC$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Basic Salary for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    3
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$CONVEYANCE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes Conveyance for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    4
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$MA$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Medical allowance for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    5
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODALLOWANCE1$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the First Production Allowance for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    6
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PRODALLOWANCE2$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Second Production Allowance for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    7
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$OTHERALLOW$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Other Allowance for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    8
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$PF$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the PF Deduction for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    9
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$ESI$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the ESI Deduction for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    10
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:CONTACT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Contact Number for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    11
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:EMAIL$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Email for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    12
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:DOB$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Date Of birth for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    13
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:GENDER$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Gender for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    14
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:NAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate FirstName and LastName for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    15
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:AADHAR$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Aadhar Number for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    16
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:PAN$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate PAN Number for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    17
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$C:ADDRESS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Candidate Address for Candidate Document.</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>

            {/* ****** Table Ends ****** */}
          </TableContainer>
         
        </Box>
      )}
      {/* ****** Instructions Box Ends ****** */}
    </Box>
  );
}

export default CandidateDocumentsKeywords;