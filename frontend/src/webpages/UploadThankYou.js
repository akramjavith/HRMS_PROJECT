import React from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import hilifelogo from "../login/hilifelogo.png";
import "../App.css";

function UploadThankYou() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            padding: "10px",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "black",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={hilifelogo}
              alt="Logo"
              style={{ height: "50px", width: "auto", marginRight: "10px" }}
            />
            <Typography
              variant={isSmallScreen ? "h6" : "h4"}
              style={{ color: "white", margin: 0 }}
            >
              HIHRMS
            </Typography>
          </div>
        </div>

        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
            paddingTop: "60px",
          }}
        >
          {/* Thank You Card */}
          <Box
            sx={{
              backgroundColor: "#ecf0f1",
              border: "2px solid lightgray",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: 500,
              boxSizing: "border-box",
              boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "20px",
                textAlign: "center",
              }}
              className="thankyoycardh1"
            >
              Thank you!
            </h1>
            <Typography
              variant="body1"
              sx={{
                lineHeight: "30px",
                fontFamily: "Comic Sans MS, cursive, sans-serif",
                letterSpacing: "2.2px",
                wordSpacing: "-1.2px",
                color: "#9C9C9C",
                fontWeight: "bolder",
                fontStyle: "italic",
              }}
            >
              Thanks a bunch for filling that out. It means a lot to us, just
              like you do! We really appreciate you giving us a moment of your
              time today. Thanks for being you!!
            </Typography>
          </Box>
          <br />
          <Typography
            variant="body2"
            sx={{
              lineHeight: "30px",
              fontFamily: "Comic Sans MS, cursive, sans-serif",
              letterSpacing: "2.2px",
              wordSpacing: "-1.2px",
              color: "#f5bf42",
              fontWeight: "bolder",
              fontStyle: "italic",
            }}
          >
            For further details check your Email!!
          </Typography>
        </Container>
      </div>
    </>
  );
}

export default UploadThankYou;