import { Button } from "@mui/material";
import { UserRoleAccessContext } from "../context/Appcontext";
import React, { useContext } from "react";

function SendToServer({ sendJSON }) {
  const { buttonStyles } = useContext(UserRoleAccessContext);
  return (
    <div>
      <Button
        variant="contained"
        sx={buttonStyles.buttonsubmit}
        onClick={() => {
          sendJSON();
        }}
      >
        Submit
      </Button>
    </div>
  );
}
export default SendToServer;
