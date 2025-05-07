import { FormControl, IconButton, InputAdornment, OutlinedInput, Popover, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import AdvancedSearchBar from './SearchbarEbList';

function AggregatedSearchBar({ columnDataTable, setItems, addSerialNumber, setPage, maindatas, setSearchedString, searchQuery,
    setSearchQuery, paginated, totalDatas, }) {

    // const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilter, setAdvancedFilter] = useState(null);


    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = maindatas?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        addSerialNumber(filtered);
        // Update filtered data
        setAdvancedFilter(filters);
        // handleCloseSearchUserShift(); // Close the popover after search
    };

    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQuery("");
        addSerialNumber(maindatas);
        setPage(1)
    };

    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        // setSearchQuery("")
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        // setSearchQuery("");
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");
        // Modify the filtering logic to check each term
        const filtered = (paginated ? totalDatas : maindatas)?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        addSerialNumber(filtered);
        // setPage(1);
    };

    const handleSearchChange = (event) => {

        const value = event.target.value;
        setSearchedString(value);
        setSearchQuery(value);
        if (value !== "") {

            applyNormalFilter(value);
        } else {

            // Restore the original items when the search input is cleared
            addSerialNumber(maindatas);
        }
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    return (
        <>
            <FormControl fullWidth size="small">
                <OutlinedInput size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                        <InputAdornment position="start">
                            <FaSearch />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            {advancedFilter && (
                                <IconButton onClick={handleResetSearch}>
                                    <MdClose />
                                </IconButton>
                            )}
                            <Tooltip title="Show search options">
                                <span>
                                    <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                </span>
                            </Tooltip>
                        </InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ 'aria-label': 'weight', }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                />
            </FormControl>
            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorElSearch}
                onClose={handleCloseSearch}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
            >
                <AdvancedSearchBar columns={columnDataTable?.filter(data => data.field !== 'checkbox' && data.field !== "actions")} onSearch={applyAdvancedFilter} initialSearchValue={searchQuery} handleCloseSearch={handleCloseSearch} />
            </Popover>
        </>
    )
}

export default AggregatedSearchBar;