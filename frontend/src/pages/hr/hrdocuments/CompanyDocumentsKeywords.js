import React, { useContext } from "react";
import { userStyle } from "../../../pageStyle";
import { Box, Typography, TableBody, Paper, Table, TableHead, TableContainer } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import Headtitle from "../../../components/Headtitle";
import { UserRoleAccessContext } from "../../../context/Appcontext";

function CompanyDocumentsKeywords() {
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  return (
    <Box>
      <Headtitle title={"COMPANY DOCUMENT KEYWORDS"} />
      <Typography sx={userStyle.HeaderText}>Company Documents Keyword Instructions</Typography>
      {/* ****** Instructions Box ****** */}
      {isUserRoleCompare?.includes("lcompanydocumentskeywords") && (
        <Box sx={userStyle.container}>
          <Typography sx={userStyle.importheadtext}>Instructions</Typography>
          <br />
          <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before Creating Template - <b>COMPANY DOCUMENTS</b></Typography>
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
                    2
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
                    3
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
                    4
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
                    5
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
         
        </Box>
      )}
      {/* ****** Instructions Box Ends ****** */}
    </Box>
  );
}

export default CompanyDocumentsKeywords;