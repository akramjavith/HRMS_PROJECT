import React from 'react'
import { Button } from '@mui/material';
import { userStyle } from '../../../pageStyle';
import { FaFileExcel } from 'react-icons/fa';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportXL = ({ fileName, rowDataTableexcel, daysArray }) => {
    const exportToCSV = async () => {
        try {
            const csvData = await Promise.all(
                rowDataTableexcel.map(async (t, index) => {
                    const dayDataArray = await Promise.all(
                        t.days.map(async (day) => {
                            const result = await day.dayData;
                            return result !== null ? result : "";
                        })
                    );

                    const firstPart = {
                        serialNumber: t.serialNumber,
                        companyname: t.companyname,
                        company: t.company,
                        branch: t.branch,
                        unit: t.unit,
                        team: t.team,
                        department: t.department,
                    };

                    const secondPart = daysArray.reduce((acc, _, index) => {
                        acc[`Day${index + 1}`] = dayDataArray[index];
                        return acc;
                    }, {});

                    return {
                        ...firstPart,
                        ...secondPart,
                    };
                })
            );

            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';

            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
        }
    };

    return (
        <Button onClick={exportToCSV} sx={userStyle.buttongrp}>
            <FaFileExcel />&ensp;Export to Excel&ensp;
        </Button>
    );
};

export const ExportCSV = ({ fileName, rowDataTableexcel, daysArray }) => {
    const exportToCSV = async () => {
        try {
            const csvData = await Promise.all(
                rowDataTableexcel.map(async (t, index) => {
                    const dayDataArray = await Promise.all(
                        t.days.map(async (day) => {
                            const result = await day.dayData;
                            return result !== null ? result : "";
                        })
                    );

                    const firstPart = {
                        serialNumber: t.serialNumber,
                        companyname: t.companyname,
                        company: t.company,
                        branch: t.branch,
                        unit: t.unit,
                        team: t.team,
                        department: t.department,
                    };

                    const secondPart = daysArray.reduce((acc, _, index) => {
                        acc[`Day${index + 1}`] = dayDataArray[index];
                        return acc;
                    }, {});

                    return {
                        ...firstPart,
                        ...secondPart,
                    };
                })
            );

            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.csv';

            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
        }
    };

    return (
        <Button onClick={exportToCSV} sx={userStyle.buttongrp}>
            <FaFileExcel />&ensp;Export to CSV&ensp;
        </Button>
    );
};
