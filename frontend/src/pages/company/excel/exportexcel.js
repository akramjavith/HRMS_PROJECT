import React from 'react';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Exportexcel({ checkexceldata, fileName }) {
    // Modify your data to include hyperlinks
    const data = checkexceldata.map((t) => ({
        Sno: t.sno,
        customer: t.customer,
        process: { value: t.process, link: t.hyperlink }, // Include a link property
        count: t.count,
        tat_expiration: t.tat,
        projectname: t.project,
        vendorname: t.vendor,
        date: t.date,
        time: t.time,
        created: t.created,
    }));

    return (
        <ExcelFile filename={fileName}>
            <ExcelSheet data={data} name="Sheet 1">
                <ExcelColumn label="Sno" value="Sno" />
                <ExcelColumn label="Customer" value="customer" />
                <ExcelColumn label="Process" value={(col) => col.process.value} /> {/* Include the hyperlink */}
                <ExcelColumn label="Count" value="count" />
                <ExcelColumn label="TAT Expiration" value="tat_expiration" />
                <ExcelColumn label="Project Name" value="projectname" />
                <ExcelColumn label="Vendor Name" value="vendorname" />
                <ExcelColumn label="Date" value="date" />
                <ExcelColumn label="Time" value="time" />
                <ExcelColumn label="Created" value="created" />
            </ExcelSheet>
        </ExcelFile>
    );
}
