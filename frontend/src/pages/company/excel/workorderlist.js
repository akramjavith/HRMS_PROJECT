import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import jsPDF from "jspdf";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import 'jspdf-autotable';
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

const Workorder = () => {
    const [excels, setExcels] = useState([]);
    const [excelmapdataresperson, setExcelmapdataresperson] = useState([]);
    const [excelmapdata, setExcelmapdata] = useState([]);
    const [excelDataPrimary, setExcelDataPrimary] = useState([]);
    const [excelDataSecondary, setExcelDataSecondary] = useState([]);
    const [excelDataTertiary, setExcelDataTertiary] = useState([]);
    const [excelDataOthers, setExcelDataOthers] = useState([]);
    const [excelDataPriorityAll, setExcelDataPriorityAll] = useState([]);
    const [excelDataOverAll, setExcelDataOverAll] = useState([]);

    //Datatable
    const [pagePrimary, setPagePrimary] = useState(1);
    const [pageSizePrimary, setPageSizePrimary] = useState(1);

    //Datatable
    const [pageSecondary, setPageSecondary] = useState(1);
    const [pageSizeSecondary, setPageSizeSecondary] = useState(1);

    //Datatable
    const [pageTertiary, setPageTertiary] = useState(1);
    const [pageSizeTertiary, setPageSizeTertiary] = useState(1);

    //Datatable
    const [pageOthers, setPageOthers] = useState(1);
    const [pageSizeOthers, setPageSizeOthers] = useState(1);

    //Datatable
    const [pagePriorityAll, setPagePriorityAll] = useState(1);
    const [pageSizePriorityAll, setPageSizePriorityAll] = useState(1);

    //Datatable
    const [pageOverAll, setPageOverAll] = useState(1);
    const [pageSizeOverAll, setPageSizeOverAll] = useState(1);


    const { auth } = useContext(AuthContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // get all branches
    const fetchExcel = async () => {
        try {
            let res = await axios.get(SERVICE.EXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });

            setExcels((res?.data?.excel[((res?.data?.excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process'));

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // get all Excelsmapdatas
    const fetchExcelmapdataperson = async () => {
        try {
            let res_branch_mapdata = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExcelmapdataresperson(res_branch_mapdata?.data?.excelmaprespersondatas);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // get all Excelsmapdatas
    const fetchExcelmapdatacate = async () => {
        try {
            let res_branch_mapdata = await axios.get(SERVICE.EXCELMAPDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExcelmapdata(res_branch_mapdata?.data?.excelmapdatas);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }
    const [tableDataPrimary, setTableDataPrimary] = useState([]);
    const [tableDataSecondary, setTableDataSecondary] = useState([]);
    const [tableDataTertiary, setTableDataTertiary] = useState([]);
    const [tableDataOthers, setTableDataOthers] = useState([]);
    const [tableDataPriorityAll, setTableDataPriorityAll] = useState([]);
    const [tableDataOverAll, setTableDataOverAll] = useState([]);

    useEffect(() => {
        const result = excels.map((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );


            if (matchingMappedItemcate) {

                // Split the time into hours, minutes, and seconds
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time?.split(":").map(Number) : ('00:00:00')?.split(":").map(Number);

                // Calculate the total number of seconds
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                // Multiply the total time by the number of points
                const resultTimeInSeconds = totalTimeInSeconds * item.count;

                // Calculate the new hours, minutes, and seconds
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;

                // Format the result as a time string
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

                if (matchingMappedItemperson) {

                    const { todo } = matchingMappedItemperson;
                    const primaryPriority = todo?.filter((task) => (task.priority)?.toLowerCase() === "primary");

                    return {
                        ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), branch: primaryPriority[0]?.branch,
                        unit: primaryPriority[0]?.unit, team: primaryPriority[0]?.team, resperson: primaryPriority[0]?.resperson, prioritystatus: primaryPriority[0]?.priority
                    };
                } else {


                    return { ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), org: matchingMappedItemcate.points, branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item

                }

            } else {
                return { ...item, category: "Unallotted", subcategory: "Unallotted", queue: "Unallotted", time: "Unallotted", points: "Unallotted", branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item
            }
        });

        setTableDataPrimary(result)
    }, [excels, excelmapdata, excelmapdataresperson])

    useEffect(() => {
        const result = excels.map((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );


            if (matchingMappedItemcate) {
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? (matchingMappedItemcate.time).split(":").map(Number) : String('00:00:00').split(":").map(Number);

                // Calculate the total number of seconds
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                // Multiply the total time by the number of points
                const resultTimeInSeconds = totalTimeInSeconds * item.count;

                // Calculate the new hours, minutes, and seconds
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;

                // Format the result as a time string
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
                if (matchingMappedItemperson) {


                    // Split the time into hours, minutes, and seconds


                    const { todo } = matchingMappedItemperson;
                    const primaryPriority = todo?.filter((task) => (task.priority)?.toLowerCase() === "secondary");

                    return {
                        ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), branch: primaryPriority[0]?.branch,
                        unit: primaryPriority[0]?.unit, team: primaryPriority[0]?.team, resperson: primaryPriority[0]?.resperson, prioritystatus: primaryPriority[0]?.priority
                    };
                } else {


                    return { ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), org: matchingMappedItemcate.points, branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item

                }

            } else {
                return { ...item, category: "Unallotted", subcategory: "Unallotted", queue: "Unallotted", time: "Unallotted", points: "Unallotted", branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item
            }
        });

        setTableDataSecondary(result)
    }, [excels, excelmapdata, excelmapdataresperson])

    useEffect(() => {
        const result = excels.map((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );


            if (matchingMappedItemcate) {
                // Split the time into hours, minutes, and seconds
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? (matchingMappedItemcate.time).split(":").map(Number) : String('00:00:00').split(":").map(Number);

                // Calculate the total number of seconds
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                // Multiply the total time by the number of points
                const resultTimeInSeconds = totalTimeInSeconds * item.count;

                // Calculate the new hours, minutes, and seconds
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;

                // Format the result as a time string
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
                if (matchingMappedItemperson) {




                    const { todo } = matchingMappedItemperson;
                    const primaryPriority = todo?.filter((task) => (task.priority)?.toLowerCase() === "tertiary");

                    return {
                        ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), branch: primaryPriority[0]?.branch,
                        unit: primaryPriority[0]?.unit, team: primaryPriority[0]?.team, resperson: primaryPriority[0]?.resperson, prioritystatus: primaryPriority[0]?.priority
                    };
                } else {


                    return { ...item, category: matchingMappedItemcate.category, subcategory: matchingMappedItemcate.subcategory, queue: matchingMappedItemcate.queue, time: resulttime, orgtime: matchingMappedItemcate.time, points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4), org: matchingMappedItemcate.points, branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item

                }

            } else {
                return { ...item, category: "Unallotted", subcategory: "Unallotted", queue: "Unallotted", time: "Unallotted", points: "Unallotted", branch: 'Unallotted', unit: 'Unallotted', team: 'Unallotted', resperson: 'Unallotted', prioritystatus: 'Unallotted' }; // If there's no matching item in mappeddata, return the original item
            }
        });

        setTableDataTertiary(result)
    }, [excels, excelmapdata, excelmapdataresperson])

    useEffect(() => {
        const result = excels.flatMap((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            if (matchingMappedItemcate) {
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? (matchingMappedItemcate.time).split(":").map(Number) : String('00:00:00').split(":").map(Number);
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
                const resultTimeInSeconds = totalTimeInSeconds * item.count;
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

                if (matchingMappedItemperson) {
                    const { todo } = matchingMappedItemperson;
                    const matchedItems = todo?.filter(
                        (task) => ["NOT FOR US", "OTHER-NFU", "OTHER", "WEB-NFU"].includes(task.branch?.toUpperCase())
                    );

                    if (matchedItems && matchedItems.length > 0) {
                        return matchedItems.map((priorityItem) => ({
                            ...item,
                            category: matchingMappedItemcate.category,
                            subcategory: matchingMappedItemcate.subcategory,
                            queue: matchingMappedItemcate.queue,
                            time: resulttime,
                            orgtime: matchingMappedItemcate.time,
                            points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4),
                            branch: priorityItem.branch,
                            unit: priorityItem.unit,
                            team: priorityItem.team,
                            resperson: priorityItem.resperson,
                            prioritystatus: priorityItem.priority
                        }));
                    }
                }
            }

            // If no match is found, return an empty array
            return [];
        });

        setTableDataOthers(result);
    }, [excels, excelmapdata, excelmapdataresperson]);

    useEffect(() => {
        const result = excels.flatMap((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            if (matchingMappedItemcate) {
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? (matchingMappedItemcate.time).split(":").map(Number) : String('00:00:00').split(":").map(Number);
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
                const resultTimeInSeconds = totalTimeInSeconds * item.count;
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

                if (matchingMappedItemperson) {
                    const { todo } = matchingMappedItemperson;
                    const matchedItems = todo?.filter(
                        (task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase())
                    );

                    if (matchedItems && matchedItems.length > 0) {
                        return matchedItems.map((priorityItem) => ({
                            ...item,
                            category: matchingMappedItemcate.category,
                            subcategory: matchingMappedItemcate.subcategory,
                            queue: matchingMappedItemcate.queue,
                            time: resulttime,
                            orgtime: matchingMappedItemcate.time,
                            points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4),
                            branch: priorityItem.branch,
                            unit: priorityItem.unit,
                            team: priorityItem.team,
                            resperson: priorityItem.resperson,
                            prioritystatus: priorityItem.priority
                        }));
                    }
                }
            }

            // If no match is found, return an empty array
            return [];
        });

        setTableDataPriorityAll(result);
    }, [excels, excelmapdata, excelmapdataresperson]);


    useEffect(() => {
        const result = excels.flatMap((item) => {
            const matchingMappedItemcate = excelmapdata.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            const matchingMappedItemperson = excelmapdataresperson.find(
                (mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer
            );

            if (matchingMappedItemcate) {
                const [hours, minutes, seconds] = matchingMappedItemcate.time ? (matchingMappedItemcate.time).split(":").map(Number) : String('00:00:00').split(":").map(Number);
                const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
                const resultTimeInSeconds = totalTimeInSeconds * item.count;
                const newHours = Math.floor(resultTimeInSeconds / 3600);
                const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
                const newSeconds = resultTimeInSeconds % 60;
                const resulttime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

                if (matchingMappedItemperson) {
                    const { todo } = matchingMappedItemperson;
                    const matchedItems = todo?.filter(
                        (task) => (
                            ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) ||
                            (["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()))
                        )
                    );

                    if (matchedItems && matchedItems.length > 0) {
                        return matchedItems.map((priorityItem) => ({
                            ...item,
                            category: matchingMappedItemcate.category,
                            subcategory: matchingMappedItemcate.subcategory,
                            queue: matchingMappedItemcate.queue,
                            time: resulttime,
                            orgtime: matchingMappedItemcate.time,
                            points: (matchingMappedItemcate.points ? (Number(item.count) * (matchingMappedItemcate.points)) : 0).toFixed(4),
                            branch: priorityItem.branch,
                            unit: priorityItem.unit,
                            team: priorityItem.team,
                            resperson: priorityItem.resperson,
                            prioritystatus: priorityItem.priority
                        }));
                    }
                }
            }

            // If no match is found, return an empty array
            return [];
        });

        setTableDataOverAll(result);
    }, [excels, excelmapdata, excelmapdataresperson]);
    const [itemsPrimary, setItemsPrimary] = useState([]);
    const [itemsSecondary, setItemsSecondary] = useState([]);
    const [itemsTertiary, setItemsTertiary] = useState([]);
    const [itemsOthers, setItemsOthers] = useState([]);
    const [itemsPriorityAll, setItemsPriorityAll] = useState([]);
    const [itemsOverAll, setItemsOverAll] = useState([]);

    const addSerialNumberPrimary = () => {
        const itemsWithSerialNumbePrimary = tableDataPrimary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsPrimary(itemsWithSerialNumbePrimary);
    }

    useEffect(() => {
        addSerialNumberPrimary();
    }, [tableDataPrimary]);


    const addSerialNumberSecondary = () => {

        const itemsWithSerialNumberSecondary = tableDataSecondary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsSecondary(itemsWithSerialNumberSecondary);
    }

    useEffect(() => {
        addSerialNumberSecondary();
    }, [tableDataSecondary]);


    const addSerialNumberTertiary = () => {

        const itemsWithSerialNumberTertiary = tableDataTertiary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsTertiary(itemsWithSerialNumberTertiary);
    }

    useEffect(() => {
        addSerialNumberTertiary();
    }, [tableDataTertiary]);

    const addSerialNumberOthers = () => {

        const itemsWithSerialNumberOthers = tableDataOthers?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsOthers(itemsWithSerialNumberOthers);
    }

    useEffect(() => {
        addSerialNumberOthers();
    }, [tableDataOthers]);



    const addSerialNumberPriorityAll = () => {

        const itemsWithSerialNumberPriorityAll = tableDataPriorityAll?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsPriorityAll(itemsWithSerialNumberPriorityAll);
    }

    useEffect(() => {
        addSerialNumberPriorityAll();
    }, [tableDataPriorityAll]);

    const addSerialNumberOverAll = () => {

        const itemsWithSerialNumberOverAll = tableDataOverAll?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsOverAll(itemsWithSerialNumberOverAll);
    }

    useEffect(() => {
        addSerialNumberOverAll();
    }, [tableDataOverAll]);


    //Primary table
    //table sorting
    const [sortingPrimary, setSortingPrimary] = useState({ column: '', direction: '' });

    const handleSortingPrimary = (column) => {
        const direction = sortingPrimary.column === column && sortingPrimary.direction === 'asc' ? 'desc' : 'asc';
        setSortingPrimary({ column, direction });
    };

    const sortedDataPrimary = itemsPrimary.sort((a, b) => {
        if (sortingPrimary.direction === 'asc') {
            return a[sortingPrimary.column] > b[sortingPrimary.column] ? 1 : -1;
        } else if (sortingPrimary.direction === 'desc') {
            return a[sortingPrimary.column] < b[sortingPrimary.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconPrimary = (column) => {
        if (sortingPrimary.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingPrimary.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangePrimary = (newPage) => {
        setPagePrimary(newPage);
    };

    const handlePageSizeChangePrimary = (event) => {
        setPageSizePrimary(Number(event.target.value));
        setPagePrimary(1);
    };


    //datatable....
    const [searchQueryPrimary, setSearchQueryPrimary] = useState("");
    const handleSearchChangePrimary = (event) => {
        setSearchQueryPrimary(event.target.value);
    };
    const filteredDatasPrimary = itemsPrimary?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryPrimary.toLowerCase())
        )
    );


    const filteredDataPrimary = filteredDatasPrimary?.slice((pagePrimary - 1) * pageSizePrimary, pagePrimary * pageSizePrimary);

    const totalPagesPrimary = Math.ceil(filteredDatasPrimary?.length / pageSizePrimary);

    const visiblePagesPrimary = Math.min(totalPagesPrimary, 3);

    const firstVisiblePagePrimary = Math.max(1, pagePrimary - 1);
    const lastVisiblePagePrimary = Math.min(Math.abs(firstVisiblePagePrimary + visiblePagesPrimary - 1), totalPagesPrimary);


    const pageNumbersPrimary = [];

    const indexOfLastItemPrimary = pagePrimary * pageSizePrimary;
    const indexOfFirstItemPrimary = indexOfLastItemPrimary - pageSizePrimary;


    for (let i = firstVisiblePagePrimary; i <= lastVisiblePagePrimary; i++) {
        pageNumbersPrimary.push(i);
    }

    //secondary table
    //table sorting
    const [sortingSecondary, setSortingSecondary] = useState({ column: '', direction: '' });

    const handleSortingSecondary = (column) => {
        const direction = sortingSecondary.column === column && sortingSecondary.direction === 'asc' ? 'desc' : 'asc';
        setSortingSecondary({ column, direction });
    };

    const sortedDataSecondary = itemsSecondary.sort((a, b) => {
        if (sortingSecondary.direction === 'asc') {
            return a[sortingSecondary.column] > b[sortingSecondary.column] ? 1 : -1;
        } else if (sortingSecondary.direction === 'desc') {
            return a[sortingSecondary.column] < b[sortingSecondary.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconSecondary = (column) => {
        if (sortingSecondary.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingSecondary.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangeSecondary = (newPage) => {
        setPageSecondary(newPage);
    };

    const handlePageSizeChangeSecondary = (event) => {
        setPageSizeSecondary(Number(event.target.value));
        setPageSecondary(1);
    };


    //datatable....
    const [searchQuerySecondary, setSearchQuerySecondary] = useState("");
    const handleSearchChangeSecondary = (event) => {
        setSearchQuerySecondary(event.target.value);
    };
    const filteredDatasSecondary = itemsSecondary?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQuerySecondary.toLowerCase())
        )
    );


    const filteredDataSecondary = filteredDatasSecondary?.slice((pageSecondary - 1) * pageSizeSecondary, pageSecondary * pageSizeSecondary);

    const totalPagesSecondary = Math.ceil(filteredDatasSecondary?.length / pageSizeSecondary);

    const visiblePagesSecondary = Math.min(totalPagesSecondary, 3);

    const firstVisiblePageSecondary = Math.max(1, pageSecondary - 1);
    const lastVisiblePageSecondary = Math.min(Math.abs(firstVisiblePageSecondary + visiblePagesSecondary - 1), totalPagesSecondary);


    const pageNumbersSecondary = [];

    const indexOfLastItemSecondary = pageSecondary * pageSizeSecondary;
    const indexOfFirstItemSecondary = indexOfLastItemSecondary - pageSizeSecondary;


    for (let i = firstVisiblePageSecondary; i <= lastVisiblePageSecondary; i++) {
        pageNumbersSecondary.push(i);
    }

    //Tertiary table
    //table sorting
    const [sortingTertiary, setSortingTertiary] = useState({ column: '', direction: '' });

    const handleSortingTertiary = (column) => {
        const direction = sortingTertiary.column === column && sortingTertiary.direction === 'asc' ? 'desc' : 'asc';
        setSortingTertiary({ column, direction });
    };

    const sortedDataTertiary = itemsTertiary.sort((a, b) => {
        if (sortingTertiary.direction === 'asc') {
            return a[sortingTertiary.column] > b[sortingTertiary.column] ? 1 : -1;
        } else if (sortingTertiary.direction === 'desc') {
            return a[sortingTertiary.column] < b[sortingTertiary.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconTertiary = (column) => {
        if (sortingTertiary.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingTertiary.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangeTertiary = (newPage) => {
        setPageTertiary(newPage);
    };

    const handlePageSizeChangeTertiary = (event) => {
        setPageSizeTertiary(Number(event.target.value));
        setPageTertiary(1);
    };


    //datatable....
    const [searchQueryTertiary, setSearchQueryTertiary] = useState("");
    const handleSearchChangeTertiary = (event) => {
        setSearchQueryTertiary(event.target.value);
    };
    const filteredDatasTertiary = itemsTertiary?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryTertiary.toLowerCase())
        )
    );


    const filteredDataTertiary = filteredDatasTertiary?.slice((pageTertiary - 1) * pageSizeTertiary, pageTertiary * pageSizeTertiary);

    const totalPagesTertiary = Math.ceil(filteredDatasTertiary?.length / pageSizeTertiary);

    const visiblePagesTertiary = Math.min(totalPagesTertiary, 3);

    const firstVisiblePageTertiary = Math.max(1, pageTertiary - 1);
    const lastVisiblePageTertiary = Math.min(Math.abs(firstVisiblePageTertiary + visiblePagesTertiary - 1), totalPagesTertiary);


    const pageNumbersTertiary = [];

    const indexOfLastItemTertiary = pageTertiary * pageSizeTertiary;
    const indexOfFirstItemTertiary = indexOfLastItemTertiary - pageSizeTertiary;


    for (let i = firstVisiblePageTertiary; i <= lastVisiblePageTertiary; i++) {
        pageNumbersTertiary.push(i);
    }

    //others datatable

    //Others table
    //table sorting
    const [sortingOthers, setSortingOthers] = useState({ column: '', direction: '' });

    const handleSortingOthers = (column) => {
        const direction = sortingOthers.column === column && sortingOthers.direction === 'asc' ? 'desc' : 'asc';
        setSortingOthers({ column, direction });
    };

    const sortedDataOthers = itemsOthers.sort((a, b) => {
        if (sortingOthers.direction === 'asc') {
            return a[sortingOthers.column] > b[sortingOthers.column] ? 1 : -1;
        } else if (sortingOthers.direction === 'desc') {
            return a[sortingOthers.column] < b[sortingOthers.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconOthers = (column) => {
        if (sortingOthers.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingOthers.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangeOthers = (newPage) => {
        setPageOthers(newPage);
    };

    const handlePageSizeChangeOthers = (event) => {
        setPageSizeOthers(Number(event.target.value));
        setPageOthers(1);
    };


    //datatable....
    const [searchQueryOthers, setSearchQueryOthers] = useState("");
    const handleSearchChangeOthers = (event) => {
        setSearchQueryOthers(event.target.value);
    };
    const filteredDatasOthers = itemsOthers?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryOthers.toLowerCase())
        )
    );

    const filteredDataOthers = filteredDatasOthers?.slice((pageOthers - 1) * pageSizeOthers, pageOthers * pageSizeOthers);

    const totalPagesOthers = Math.ceil(filteredDatasOthers?.length / pageSizeOthers);

    const visiblePagesOthers = Math.min(totalPagesOthers, 3);

    const firstVisiblepageOthers = Math.max(1, pageOthers - 1);
    const lastVisiblepageOthers = Math.min(firstVisiblepageOthers + visiblePagesOthers - 1, totalPagesOthers);

    const pageNumbersOthers = [];

    const indexOfLastItemOthers = pageOthers * pageSizeOthers;
    const indexOfFirstItemOthers = indexOfLastItemOthers - pageSizeOthers;

    for (let i = firstVisiblepageOthers; i <= lastVisiblepageOthers; i++) {
        pageNumbersOthers.push(i);
    }


    //PriorityAll table
    //table sorting
    const [sortingPriorityAll, setSortingPriorityAll] = useState({ column: '', direction: '' });

    const handleSortingPriorityAll = (column) => {
        const direction = sortingPriorityAll.column === column && sortingPriorityAll.direction === 'asc' ? 'desc' : 'asc';
        setSortingPriorityAll({ column, direction });
    };

    const sortedDataPriorityAll = itemsPriorityAll.sort((a, b) => {
        if (sortingPriorityAll.direction === 'asc') {
            return a[sortingPriorityAll.column] > b[sortingPriorityAll.column] ? 1 : -1;
        } else if (sortingPriorityAll.direction === 'desc') {
            return a[sortingPriorityAll.column] < b[sortingPriorityAll.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconPriorityAll = (column) => {
        if (sortingPriorityAll.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingPriorityAll.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangePriorityAll = (newPage) => {
        setPagePriorityAll(newPage);
    };

    const handlePageSizeChangePriorityAll = (event) => {
        setPageSizePriorityAll(Number(event.target.value));
        setPagePriorityAll(1);
    };


    //datatable....
    const [searchQueryPriorityAll, setSearchQueryPriorityAll] = useState("");
    const handleSearchChangePriorityAll = (event) => {
        setSearchQueryPriorityAll(event.target.value);
    };
    const filteredDatasPriorityAll = itemsPriorityAll?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryPriorityAll.toLowerCase())
        )
    );


    const filteredDataPriorityAll = filteredDatasPriorityAll?.slice((pagePriorityAll - 1) * pageSizePriorityAll, pagePriorityAll * pageSizePriorityAll);

    const totalPagesPriorityAll = Math.ceil(filteredDatasPriorityAll?.length / pageSizePriorityAll);

    const visiblePagesPriorityAll = Math.min(totalPagesPriorityAll, 3);

    const firstVisiblePagePriorityAll = Math.max(1, pagePriorityAll - 1);
    const lastVisiblePagePriorityAll = Math.min(Math.abs(firstVisiblePagePriorityAll + visiblePagesPriorityAll - 1), totalPagesPriorityAll);


    const pageNumbersPriorityAll = [];

    const indexOfLastItemPriorityAll = pagePriorityAll * pageSizePriorityAll;
    const indexOfFirstItemPriorityAll = indexOfLastItemPriorityAll - pageSizePriorityAll;


    for (let i = firstVisiblePagePriorityAll; i <= lastVisiblePagePriorityAll; i++) {
        pageNumbersPriorityAll.push(i);
    }


    //overall
    //OverAll table
    //table sorting
    const [sortingOverAll, setSortingOverAll] = useState({ column: '', direction: '' });

    const handleSortingOverAll = (column) => {
        const direction = sortingOverAll.column === column && sortingOverAll.direction === 'asc' ? 'desc' : 'asc';
        setSortingOverAll({ column, direction });
    };

    const sortedDataOverAll = itemsOverAll.sort((a, b) => {
        if (sortingOverAll.direction === 'asc') {
            return a[sortingOverAll.column] > b[sortingOverAll.column] ? 1 : -1;
        } else if (sortingOverAll.direction === 'desc') {
            return a[sortingOverAll.column] < b[sortingOverAll.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconOverAll = (column) => {
        if (sortingOverAll.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingOverAll.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangeOverAll = (newPage) => {
        setPageOverAll(newPage);
    };

    const handlePageSizeChangeOverAll = (event) => {
        setPageSizeOverAll(Number(event.target.value));
        setPageOverAll(1);
    };


    //datatable....
    const [searchQueryOverAll, setSearchQueryOverAll] = useState("");
    const handleSearchChangeOverAll = (event) => {
        setSearchQueryOverAll(event.target.value);
    };
    const filteredDatasOverAll = itemsOverAll?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryOverAll.toLowerCase())
        )
    );


    const filteredDataOverAll = filteredDatasOverAll?.slice((pageOverAll - 1) * pageSizeOverAll, pageOverAll * pageSizeOverAll);

    const totalPagesOverAll = Math.ceil(filteredDatasOverAll?.length / pageSizeOverAll);

    const visiblePagesOverAll = Math.min(totalPagesOverAll, 3);

    const firstVisiblePageOverAll = Math.max(1, pageOverAll - 1);
    const lastVisiblePageOverAll = Math.min(Math.abs(firstVisiblePageOverAll + visiblePagesOverAll - 1), totalPagesOverAll);


    const pageNumbersOverAll = [];

    const indexOfLastItemOverAll = pageOverAll * pageSizeOverAll;
    const indexOfFirstItemOverAll = indexOfLastItemOverAll - pageSizeOverAll;


    for (let i = firstVisiblePageOverAll; i <= lastVisiblePageOverAll; i++) {
        pageNumbersOverAll.push(i);
    }



    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);


    //  PDF
    const columns = [
        { title: "SNO", field: "serialNumber" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Priority", field: "priority" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Count", field: "count" },
        { title: "Tat", field: "tat" },
        { title: "Created", field: "created" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Resperson", field: "resperson" },
        { title: "Priority", field: "prioritystatus" },
        { title: "Points", field: "points" },
        { title: "time", field: "time" },

    ]

    // const downloadPdf = () => {
    //     const doc = new jsPDF();
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: {
    //             fontSize: 6,
    //             cellWidth: 20,
    //         },
    //         columns: columns.map((col) => ({ ...col, dataKey: col.field })),
    //         body: items,
    //     });
    //     doc.save("Workorder.pdf");
    // };

    const downloadPdfPrimary = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsPrimary,
        });
        doc.save("Workorder Primary.pdf");
    };

    const downloadPdfSecondary = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsSecondary,
        });
        doc.save("Workorder Secondary.pdf");
    };

    const downloadPdfTertiary = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsTertiary,
        });
        doc.save("Workorder Tertiary.pdf");
    };

    const downloadPdfOthers = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsOthers,
        });
        doc.save("Workorder Others.pdf");
    };

    const downloadPdfPriorityAll = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsPriorityAll,
        });
        doc.save("Consolidated Workorder Priority.pdf");
    };

    const downloadPdfOverAll = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: itemsOverAll,
        });
        doc.save("Consolidated Workorder Others All.pdf");
    };




    // const downloadPdfPrimary = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsPrimary.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Workorder Primary.pdf");
    // };

    // const downloadPdfSecondary = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsSecondary.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Workorder Secondary.pdf");
    // };

    // const downloadPdfTertiary = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsTertiary.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Workorder Tertiary.pdf");
    // };

    // const downloadPdfOthers = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsOthers.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Workorder Others.pdf");
    // };


    // const downloadPdfPriorityAll = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsPriorityAll.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Consolidated Workorder Priority.pdf");
    // };

    // const downloadPdfOverAll = () => {
    //     const doc = new jsPDF();

    //     const columnsPerPage = 10; // Number of columns to show per page
    //     const totalColumns = columns.length;

    //     for (let page = 1; page <= Math.ceil(totalColumns / columnsPerPage); page++) {
    //         // Calculate which columns to include on this page
    //         const startColumn = (page - 1) * columnsPerPage;
    //         const endColumn = Math.min(startColumn + columnsPerPage, totalColumns);

    //         // Extract the relevant columns for this page
    //         const pageColumns = columns.slice(startColumn, endColumn);

    //         // Extract the relevant data for this page based on the columns
    //         const pageItems = itemsOverAll.map((item) => {
    //             const pageItem = {};
    //             pageColumns.forEach((col) => {
    //                 pageItem[col.field] = item[col.field];
    //             });
    //             return pageItem;
    //         });

    //         // Add the table to the current page
    //         doc.autoTable({
    //             theme: "grid",
    //             styles: {
    //                 fontSize: 6,
    //                 cellWidth: 20, // Set the desired cell width here
    //             },
    //             columns: pageColumns.map((col) => ({ ...col, dataKey: col.field })),
    //             body: pageItems,
    //             didDrawPage: function (pageNumber) {
    //                 if (pageNumber < Math.ceil(totalColumns / columnsPerPage)) {
    //                     doc.addPage(); // Add a new page for the next set of columns
    //                 }
    //             },
    //         });

    //         if (page < Math.ceil(totalColumns / columnsPerPage)) {
    //             doc.addPage(); // Add a new page for the next set of columns
    //         }
    //     }

    //     doc.save("Consolidated Workorder OverAll.pdf");
    // };



    // Excel
    const fileNamePrimary = "Workorder Primary";
    const fileNameSecondary = "Workorder Secondary";
    const fileNameTertiary = "Workorder Tertiary";
    const fileNameOthers = "Workorder Others";
    const fileNamePriorityAll = "Consolidated WorkOrder List";
    const fileNameOverAll = "Consolidated WorkOrder All List ";

    // get particular columns for export excel
    const getexcelDatasPrimary = async () => {


        var data = tableDataPrimary.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataPrimary(data);
    }

    // get particular columns for export excel
    const getexcelDatasSecondary = async () => {


        var data = tableDataSecondary.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataSecondary(data);
    }

    // get particular columns for export excel
    const getexcelDatasTertiary = async () => {


        var data = tableDataTertiary.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataTertiary(data);
    }

    // get particular columns for export excel
    const getexcelDatasOthers = async () => {


        var data = tableDataOthers.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataOthers(data);
    }

    // get particular columns for export excel
    const getexcelDatasPriorityAll = async () => {


        var data = tableDataPriorityAll.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataPriorityAll(data);
    }

    // get particular columns for export excel
    const getexcelDatasOverAll = async () => {


        var data = tableDataOverAll.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "priority": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
        }));
        setExcelDataOverAll(data);
    }



    //print...Primary
    const componentRefPrimary = useRef();
    const handleprintPrimary = useReactToPrint({
        content: () => componentRefPrimary.current,
        documentTitle: 'Work Order Primary',
        pageStyle: 'print'
    });

    //print...Secondary
    const componentRefSecondary = useRef();
    const handleprintSecondary = useReactToPrint({
        content: () => componentRefSecondary.current,
        documentTitle: 'Work Order Secondary',
        pageStyle: 'print'
    });

    //print...Tertiary
    const componentRefTertiary = useRef();
    const handleprintTertiary = useReactToPrint({
        content: () => componentRefTertiary.current,
        documentTitle: 'Work Order Tertiary',
        pageStyle: 'print'
    });

    //print...Others
    const componentRefOthers = useRef();
    const handleprintOthers = useReactToPrint({
        content: () => componentRefOthers.current,
        documentTitle: 'Work Order Others',
        pageStyle: 'print'
    });

    //print...PriorityAll
    const componentRefPriorityAll = useRef();
    const handleprintPriorityAll = useReactToPrint({
        content: () => componentRefPriorityAll.current,
        documentTitle: 'Consolidated Work Order Priority',
        pageStyle: 'print'
    });

    //print...OverAll
    const componentRefOverAll = useRef();
    const handleprintOverAll = useReactToPrint({
        content: () => componentRefOverAll.current,
        documentTitle: 'Consolidated Work Order OverAll',
        pageStyle: 'print'
    });



    useEffect(() => {
        fetchExcel();
        fetchExcelmapdataperson();
        fetchExcelmapdatacate();
    }, [])

    useEffect(() => {
        getexcelDatasPrimary();
    }, [excels, excelmapdata, excelmapdataresperson, itemsPrimary])


    useEffect(() => {
        getexcelDatasSecondary();
    }, [excels, excelmapdata, excelmapdataresperson, itemsSecondary])

    useEffect(() => {
        getexcelDatasTertiary();
    }, [excels, excelmapdata, excelmapdataresperson, itemsTertiary])

    useEffect(() => {
        getexcelDatasOthers();
    }, [excels, excelmapdata, excelmapdataresperson, itemsOthers])

    useEffect(() => {
        getexcelDatasPriorityAll();
    }, [excels, excelmapdata, excelmapdataresperson, itemsPriorityAll])


    useEffect(() => {
        getexcelDatasOverAll();
    }, [excels, excelmapdata, excelmapdataresperson, itemsOverAll])



    return (
        <>
            <Headtitle title={'Work Order'} />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}> WorkOrder List Primary</Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataPrimary} fileName={fileNamePrimary} />

                        <ExportXL csvData={excelDataPrimary} fileName={fileNamePrimary} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizePrimary} onChange={handlePageSizeChangePrimary} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(excels?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryPrimary}
                                onChange={handleSearchChangePrimary}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingPrimary('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPrimary('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPrimary('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataPrimary.length > 0 ? (
                                filteredDataPrimary?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.branch.length - 1 && <br />}
                                                </Typography>
                                            ))

                                            } */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.unit.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.team.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.resperson.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.prioritystatus.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing  {filteredDataPrimary.length > 0 ? ((pagePrimary - 1) * pageSizePrimary) + 1 : 0}  to {Math.min(pagePrimary * pageSizePrimary, filteredDatasPrimary.length)} of {filteredDatasPrimary.length} entries
                    </Box>

                    <Box>
                        <Button onClick={() => setPagePrimary(1)} disabled={pagePrimary === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangePrimary(pagePrimary - 1)} disabled={pagePrimary === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersPrimary?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangePrimary(pageNumber)} className={((pagePrimary)) === pageNumber ? 'active' : ''} disabled={pagePrimary === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePagePrimary < totalPagesPrimary && <span>...</span>}
                        <Button onClick={() => handlePageChangePrimary(pagePrimary + 1)} disabled={pagePrimary === totalPagesPrimary} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPagePrimary((totalPagesPrimary))} disabled={pagePrimary === totalPagesPrimary} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}> WorkOrder List Secondary</Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataSecondary} fileName={fileNameSecondary} />

                        <ExportXL csvData={excelDataSecondary} fileName={fileNameSecondary} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintSecondary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSecondary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizeSecondary} onChange={handlePageSizeChangeSecondary} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(excels?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQuerySecondary}
                                onChange={handleSearchChangeSecondary}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingSecondary('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingSecondary('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconSecondary('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataSecondary.length > 0 ? (
                                filteredDataSecondary?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.branch.length - 1 && <br />}
                                                </Typography>
                                            ))

                                            } */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.unit.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.team.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.resperson.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.prioritystatus.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing  {filteredDataSecondary.length > 0 ? ((pageSecondary - 1) * pageSizeSecondary) + 1 : 0}  to {Math.min(pageSecondary * pageSizeSecondary, filteredDatasSecondary.length)} of {filteredDatasSecondary.length} entries
                    </Box>

                    <Box>
                        <Button onClick={() => setPageSecondary(1)} disabled={pageSecondary === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeSecondary(pageSecondary - 1)} disabled={pageSecondary === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersSecondary?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSecondary(pageNumber)} className={((pageSecondary)) === pageNumber ? 'active' : ''} disabled={pageSecondary === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePageSecondary < totalPagesSecondary && <span>...</span>}
                        <Button onClick={() => handlePageChangeSecondary(pageSecondary + 1)} disabled={pageSecondary === totalPagesSecondary} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageSecondary((totalPagesSecondary))} disabled={pageSecondary === totalPagesSecondary} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}> WorkOrder List Tertiary</Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataTertiary} fileName={fileNameTertiary} />

                        <ExportXL csvData={excelDataTertiary} fileName={fileNameTertiary} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintTertiary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfTertiary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizeTertiary} onChange={handlePageSizeChangeTertiary} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(excels?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryTertiary}
                                onChange={handleSearchChangeTertiary}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingTertiary('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingTertiary('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTertiary('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataTertiary.length > 0 ? (
                                filteredDataTertiary?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.branch.length - 1 && <br />}
                                                </Typography>
                                            ))

                                            } */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.unit.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.team.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.resperson.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
                                                <Typography key={index}>
                                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                                    {index < row.prioritystatus.length - 1 && <br />}
                                                </Typography>
                                            ))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing  {filteredDataTertiary.length > 0 ? ((pageTertiary - 1) * pageSizeTertiary) + 1 : 0}  to {Math.min(pageTertiary * pageSizeTertiary, filteredDatasTertiary.length)} of {filteredDatasTertiary.length} entries
                    </Box>

                    <Box>
                        <Button onClick={() => setPageTertiary(1)} disabled={pageTertiary === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeTertiary(pageTertiary - 1)} disabled={pageTertiary === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersTertiary?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTertiary(pageNumber)} className={((pageTertiary)) === pageNumber ? 'active' : ''} disabled={pageTertiary === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePageTertiary < totalPagesTertiary && <span>...</span>}
                        <Button onClick={() => handlePageChangeTertiary(pageTertiary + 1)} disabled={pageTertiary === totalPagesTertiary} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageTertiary((totalPagesTertiary))} disabled={pageTertiary === totalPagesTertiary} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}> WorkOrder List Others</Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataOthers} fileName={fileNameOthers} />

                        <ExportXL csvData={excelDataOthers} fileName={fileNameOthers} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintOthers}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfOthers()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizeOthers} onChange={handlePageSizeChangeOthers} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(tableDataOthers?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryOthers}
                                onChange={handleSearchChangeOthers}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingOthers('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOthers('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOthers('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataOthers.length > 0 ? (
                                filteredDataOthers?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : (row.branch)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
                                <Typography key={index}>
                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                    {index < row.branch.length - 1 && <br />}
                                </Typography>
                            ))

                            } */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : (row.unit)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
                                <Typography key={index}>
                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                    {index < row.unit.length - 1 && <br />}
                                </Typography>
                            ))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : (row.team)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
                                <Typography key={index}>
                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                    {index < row.team.length - 1 && <br />}
                                </Typography>
                            ))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : (row.resperson)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
                                <Typography key={index}>
                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                    {index < row.resperson.length - 1 && <br />}
                                </Typography>
                            ))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : (row.prioritystatus)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
                                <Typography key={index}>
                                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                                    {index < row.prioritystatus.length - 1 && <br />}
                                </Typography>
                            ))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing  {filteredDataOthers.length > 0 ? ((pageOthers - 1) * pageSizeOthers) + 1 : 0}  to {Math.min(pageOthers * pageSizeOthers, filteredDatasOthers.length)} of {filteredDatasOthers.length} entries
                    </Box>

                    <Box>
                        <Button onClick={() => setPageOthers(1)} disabled={pageOthers === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeOthers(pageOthers - 1)} disabled={pageOthers === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersOthers?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeOthers(pageNumber)} className={((pageOthers)) === pageNumber ? 'active' : ''} disabled={pageOthers === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblepageOthers < totalPagesOthers && <span>...</span>}
                        <Button onClick={() => handlePageChangeOthers(pageOthers + 1)} disabled={pageOthers === totalPagesOthers} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageOthers((totalPagesOthers))} disabled={pageOthers === totalPagesOthers} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}>Consolidated WorkOrder List </Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataPriorityAll} fileName={fileNamePriorityAll} />

                        <ExportXL csvData={excelDataPriorityAll} fileName={fileNamePriorityAll} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintPriorityAll}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfPriorityAll()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizePriorityAll} onChange={handlePageSizeChangePriorityAll} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(tableDataPriorityAll?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryPriorityAll}
                                onChange={handleSearchChangePriorityAll}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingPriorityAll('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconPriorityAll('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataPriorityAll.length > 0 ? (
                                filteredDataPriorityAll?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : (row.branch)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
                <Typography key={index}>
                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                    {index < row.branch.length - 1 && <br />}
                </Typography>
            ))

            } */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : (row.unit)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
                <Typography key={index}>
                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                    {index < row.unit.length - 1 && <br />}
                </Typography>
            ))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : (row.team)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
                <Typography key={index}>
                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                    {index < row.team.length - 1 && <br />}
                </Typography>
            ))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : (row.resperson)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
                <Typography key={index}>
                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                    {index < row.resperson.length - 1 && <br />}
                </Typography>
            ))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : (row.prioritystatus)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
                <Typography key={index}>
                    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
                    {index < row.prioritystatus.length - 1 && <br />}
                </Typography>
            ))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing {filteredDataPriorityAll.length > 0 ? ((pagePriorityAll - 1) * pageSizePriorityAll) + 1 : 0} to {Math.min(pagePriorityAll * pageSizePriorityAll, filteredDatasPriorityAll?.length)} of {filteredDatasPriorityAll?.length} entries
                    </Box>
                    <Box>
                        <Button onClick={() => setPagePriorityAll(1)} disabled={pagePriorityAll === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangePriorityAll(pagePriorityAll - 1)} disabled={pagePriorityAll === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersPriorityAll?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangePriorityAll(pageNumber)} className={((pagePriorityAll)) === pageNumber ? 'active' : ''} disabled={pagePriorityAll === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePagePriorityAll < totalPagesPriorityAll && <span>...</span>}
                        <Button onClick={() => handlePageChangePriorityAll(pagePriorityAll + 1)} disabled={pagePriorityAll === totalPagesPriorityAll} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPagePriorityAll((totalPagesPriorityAll))} disabled={pagePriorityAll === totalPagesPriorityAll} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.SubHeaderText}>Consolidated WorkOrder All List </Typography>
                <br /><br />
                { /* ****** Header Buttons ****** */}
                <Grid container sx={{ justifyContent: "center" }} >
                    <Grid >

                        <ExportCSV csvData={excelDataOverAll} fileName={fileNameOverAll} />

                        <ExportXL csvData={excelDataOverAll} fileName={fileNameOverAll} />

                        <Button sx={userStyle.buttongrp} onClick={handleprintOverAll}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>

                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdfOverAll()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

                    </Grid>
                </Grid><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show entries:</label>
                        <Select id="pageSizeSelect" defaultValue="" value={pageSizeOverAll} onChange={handlePageSizeChangeOverAll} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(tableDataOverAll?.length)}>All</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryOverAll}
                                onChange={handleSearchChangeOverAll}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper} >
                    <Table
                        aria-label="simple table"
                        id="excel"
                    // ref={tableRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                                <StyledTableCell onClick={() => handleSortingOverAll('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('serialNumber')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('project')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('vendor')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('priority')}><Box sx={userStyle.tableheadstyle}><Box>Priority </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('priority')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('customer')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('hyperlink')}><Box sx={userStyle.tableheadstyle}><Box>Process Hyperlink </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('hyperlink')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('count')}><Box sx={userStyle.tableheadstyle}><Box>Count </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('count')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('tat')}><Box sx={userStyle.tableheadstyle}><Box>Tat Expiration </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('tat')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('created')}><Box sx={userStyle.tableheadstyle}><Box>Created </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('created')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('category')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('subcategory')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('queue')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('branch')}><Box sx={userStyle.tableheadstyle}><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('branch')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('unit')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('team')}><Box sx={userStyle.tableheadstyle}><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('team')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsibleperson</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('resperson')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('prioritystatus')}><Box sx={userStyle.tableheadstyle}><Box>Priority</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('prioritystatus')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('points')}><Box sx={userStyle.tableheadstyle}><Box>Points </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('points')}</Box></Box></StyledTableCell>
                                <StyledTableCell onClick={() => handleSortingOverAll('time')}><Box sx={userStyle.tableheadstyle}><Box>Time </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconOverAll('time')}</Box></Box></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDataOverAll.length > 0 ? (
                                filteredDataOverAll?.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell>{row.project} </StyledTableCell>
                                        <StyledTableCell>{row.vendor} </StyledTableCell>
                                        <StyledTableCell> {row.priority}</StyledTableCell>
                                        <StyledTableCell>{row.customer} </StyledTableCell>
                                        <StyledTableCell><a href={row.hyperlink} target="_blank">{row.process}</a></StyledTableCell>
                                        <StyledTableCell>{row.count}</StyledTableCell>
                                        <StyledTableCell>{row.tat} </StyledTableCell>
                                        <StyledTableCell>{row.created}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.category}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.subcategory} </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.queue}</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.branch)?.includes('Unallotted') ? "red" : (row.branch)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.branch?.map((task, index) => (
<Typography key={index}>
    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
    {index < row.branch.length - 1 && <br />}
</Typography>
))

} */}
                                            {row.branch}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.unit)?.includes('Unallotted') ? "red" : (row.unit)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.unit?.map((task, index) => (
<Typography key={index}>
    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
    {index < row.unit.length - 1 && <br />}
</Typography>
))} */}
                                            {row.unit}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.team)?.includes('Unallotted') ? "red" : (row.team)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.team?.map((task, index) => (
<Typography key={index}>
    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
    {index < row.team.length - 1 && <br />}
</Typography>
))} */}
                                            {row.team}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '350px', color: (row.resperson)?.includes('Unallotted') ? "red" : (row.resperson)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.resperson?.map((task, index) => (
<Typography key={index}>
    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
    {index < row.resperson.length - 1 && <br />}
</Typography>
))} */}
                                            {row.resperson}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: '250px', color: (row.prioritystatus)?.includes('Unallotted') ? "red" : (row.prioritystatus)?.includes('Allotted') ? "green" : "inherit" }}>
                                            {/* {row.prioritystatus?.map((task, index) => (
<Typography key={index}>
    {task !== "Unallotted" ? `${index + 1}. ${task}` : task}
    {index < row.prioritystatus.length - 1 && <br />}
</Typography>
))} */}
                                            {row.prioritystatus}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.points}</StyledTableCell>
                                        <StyledTableCell sx={{ color: row.category == "Unallotted" ? "red" : "inherit" }}>{row.time} </StyledTableCell>
                                    </StyledTableRow>
                                )))
                                : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                    <Box>
                        Showing {filteredDataOverAll.length > 0 ? ((pageOverAll - 1) * pageSizeOverAll) + 1 : 0} to {Math.min(pageOverAll * pageSizeOverAll, filteredDatasOverAll?.length)} of {filteredDatasOverAll?.length} entries
                    </Box>
                    <Box>
                        <Button onClick={() => setPageOverAll(1)} disabled={pageOverAll === 1} sx={userStyle.paginationbtn}>
                            <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeOverAll(pageOverAll - 1)} disabled={pageOverAll === 1} sx={userStyle.paginationbtn}>
                            <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersOverAll?.map((pageNumber) => (
                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeOverAll(pageNumber)} className={((pageOverAll)) === pageNumber ? 'active' : ''} disabled={pageOverAll === pageNumber}>
                                {pageNumber}
                            </Button>
                        ))}
                        {lastVisiblePageOverAll < totalPagesOverAll && <span>...</span>}
                        <Button onClick={() => handlePageChangeOverAll(pageOverAll + 1)} disabled={pageOverAll === totalPagesOverAll} sx={userStyle.paginationbtn}>
                            <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageOverAll((totalPagesOverAll))} disabled={pageOverAll === totalPagesOverAll} sx={userStyle.paginationbtn}>
                            <LastPageIcon />
                        </Button>
                    </Box>
                </Box>
                {/* ****** Table End ****** */}
            </Box>
            <br />
            {/* print layout Primary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefPrimary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsPrimary &&
                            (itemsPrimary.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* print layout Secondary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefSecondary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsSecondary &&
                            (itemsSecondary.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* print layout Tertiary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefTertiary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsTertiary &&
                            (itemsTertiary.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* print layout Others */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefOthers}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsOthers &&
                            (itemsOthers.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* print layout PriorityAll */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefPriorityAll}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsPriorityAll &&
                            (itemsPriorityAll.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* print layout OverAll */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefOverAll}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsOverAll &&
                            (itemsOverAll.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
export default Workorder;