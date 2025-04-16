import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const CustomStyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": { overflowY: "hidden" },
    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: " bold !important " },
    "& .custom-id-row": { backgroundColor: "#1976d22b !important" },
    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important",
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": { backgroundColor: "#ff00004a !important" },
      "& .custom-in-row:hover": { backgroundColor: "#ffff0061 !important" },
      "& .custom-others-row:hover": { backgroundColor: "#0080005e !important" },
    },
}));

const StyledDataGrid = forwardRef((props, ref) => (
    <CustomStyledDataGrid ref={ref} {...props} />
));

export default StyledDataGrid;