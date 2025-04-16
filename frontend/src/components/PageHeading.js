import React, { useContext } from "react";
import { userStyle } from "../pageStyle";
import { Typography, Tooltip } from "@mui/material";
import { UserRoleAccessContext } from "../context/Appcontext";

const PageHeading = ({
  title = "",
  modulename = "",
  submodulename = "",
  mainpagename = "",
  subpagename = "",
  subsubpagename = "",
}) => {
  const { toolTip } = useContext(UserRoleAccessContext);
  let description =
    toolTip?.find(
      (data) =>

        data?.modulename === modulename &&
        data?.submodulename === submodulename &&
        data?.mainpagename === mainpagename &&
        data?.subpagename === subpagename &&
        data?.subsubpagename === subsubpagename

    )?.description || "";

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        // top: "-30px",
      }}
    >
      <Tooltip
        title={description}
        arrow
        placement="right" // Adjust the placement as needed
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 10], // Adjust the offset to position the tooltip
              },
            },
          ],
        }}
      >
        <Typography sx={userStyle.HeaderText}>{title}</Typography>
      </Tooltip>
    </div>
  );
};

export default PageHeading;
