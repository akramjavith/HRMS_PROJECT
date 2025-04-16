import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Select, MenuItem, TextField, RadioGroup, FormControlLabel, Radio, Typography, IconButton, DialogContent, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AdvancedSearchBar({ columns, onSearch, initialSearchValue, handleCloseSearch }) {

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState(initialSearchValue || "");

    useEffect(() => {
        setFilterValue(initialSearchValue);
    }, [initialSearchValue]);

    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };

    const handleSearch = () => {
        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        onSearch(allFilters, logicOperator);
    };

    return (
        <Box style={{ padding: "10px", maxWidth: '450px' }}>
            <Typography variant="h6">Advance Search</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseSearch}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ width: "100%" }}>
                <Box sx={{
                    width: '350px',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    // padding: '5px',
                    // marginBottom: '16px',
                    // border: '1px solid #ddd',
                    // borderRadius: '8px',
                    position: 'relative'
                }}>
                    <Box sx={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        // paddingRight: '5px'
                    }}>
                        <Grid container spacing={1}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography>Columns</Typography>
                                <Select fullWidth size="small"
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                width: "auto",
                                            },
                                        },
                                    }}
                                    style={{ minWidth: 150 }}
                                    value={selectedColumn}
                                    onChange={(e) => setSelectedColumn(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Column</MenuItem>
                                    {columns.map((col) => (
                                        <MenuItem key={col.field} value={col.field}>
                                            {col.headerName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography>Operator</Typography>
                                <Select fullWidth size="small"
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                width: "auto",
                                            },
                                        },
                                    }}
                                    style={{ minWidth: 150 }}
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                    disabled={!selectedColumn}
                                >
                                    {conditions.map((condition) => (
                                        <MenuItem key={condition} value={condition}>
                                            {condition}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography>Value</Typography>
                                <TextField fullWidth size="small"
                                    value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                    placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                    sx={{
                                        '& .MuiOutlinedInput-root.Mui-disabled': {
                                            backgroundColor: 'rgb(0 0 0 / 26%)',
                                        },
                                        '& .MuiOutlinedInput-input.Mui-disabled': {
                                            cursor: 'not-allowed',
                                        },
                                    }}
                                />
                            </Grid>
                            {additionalFilters.length > 0 && (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <RadioGroup
                                            row
                                            value={logicOperator}
                                            onChange={(e) => setLogicOperator(e.target.value)}
                                        >
                                            <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                            <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                        </RadioGroup>
                                    </Grid>
                                    {/* <Grid item md={12} sm={12} xs={12}>
                                {additionalFilters.map((filter, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <span>{`${filter.column} ${filter.condition} "${filter.value}"`}</span>
                                    </Box>
                                ))}
                            </Grid> */}
                                </>
                            )}
                            {additionalFilters.length === 0 && (
                                <Grid item md={4} sm={12} xs={12} >
                                    <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                        Add Filter
                                    </Button>
                                </Grid>
                            )}

                            <Grid item md={2} sm={12} xs={12}>
                                <Button variant="contained" onClick={handleSearch} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                    Search
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
        </Box>
    );
}

export default AdvancedSearchBar;