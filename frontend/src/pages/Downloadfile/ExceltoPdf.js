import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Tooltip, Grid, IconButton } from '@mui/material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AlertDialog from "../../components/Alert";
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';

const ExcelToPDf = () => {
    const [jsonData, setJsonData] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);
   
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (files?.length !== 0) {
            setPopupContent("Please Upload only one file for conversion at a time.");
            setPopupSeverity("error");
            handleClickOpenPopup();            
        } else {
            if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0]; // Get the first sheet
                    const worksheet = workbook.Sheets[sheetName];
                    const result = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON
                    setJsonData(result);
                    // Add the Excel file to the `files` state
                    setFiles((prevFiles) => [
                        ...prevFiles,
                        {
                            file,
                            type: 'excel',
                            data: result, // Store the parsed Excel data
                            name: file.name,
                        },
                    ]);
                };

                reader.readAsArrayBuffer(file); // Read the file as an array buffer
            } else {
                setPopupContent("Please upload a valid Excel file");
                setPopupSeverity("error");
                handleClickOpenPopup();
            }
        }

    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const margin = 10;
        const fontSize = 10;
        doc.setFontSize(fontSize);

        const pageWidth = doc.internal.pageSize.width - 2 * margin; // Total usable page width
        const pageHeight = doc.internal.pageSize.height;

        let yPos = 10; // Vertical position for text in the PDF
        let xPos = margin; // Horizontal position for the first column

        // Add "S.No" as the first column
        const headers = Object.keys(jsonData[0]); // Add serial number column
        const totalColumns = headers.length;

        // Calculate dynamic column widths based on max content width
        const columnWidths = headers.map((header) => {
            let maxContentLength = doc.getTextWidth(header); // Start with header width

            jsonData.forEach((row, index) => {
                const value = header === "S.No" ? String(index + 1) : String(row[header]);
                const valueWidth = doc.getTextWidth(value);
                maxContentLength = Math.max(maxContentLength, valueWidth);
            });

            return maxContentLength + 5; // Add padding
        });

        // Function to print headers for a given column group
        const printHeaders = (columns) => {
            xPos = margin; // Reset x position
            columns.forEach((colIndex) => {
                doc.setFont("helvetica", "bold");
                doc.text(xPos, yPos, headers[colIndex]);
                xPos += columnWidths[colIndex]; // Move to the next column
            });
        };

        // Function to print rows for a given column group
        const printRows = (columns) => {
            jsonData.forEach((row, rowIndex) => {
                if (yPos + 10 > pageHeight - margin) {
                    doc.addPage();
                    yPos = 10;
                    printHeaders(columns); // Print headers on new page
                    yPos += 10;
                }

                xPos = margin;
                columns.forEach((colIndex) => {
                    const value = colIndex === 0 ? String(rowIndex + 1) : String(row[headers[colIndex]]); // Add S.No for first column
                    doc.setFont("helvetica", "normal");
                    doc.text(xPos, yPos, value);
                    xPos += columnWidths[colIndex];
                });

                yPos += 10; // Move to the next row
            });
        };

        // Split columns into groups based on page width
        let currentGroup = [];
        let currentWidth = 0;

        for (let i = 0; i < totalColumns; i++) {
            if (currentWidth + columnWidths[i] > pageWidth) {
                // Print the current group and start a new page
                printHeaders(currentGroup);
                yPos += 10;
                printRows(currentGroup);
                doc.addPage();
                yPos = 10;
                currentGroup = [];
                currentWidth = 0;
            }
            currentGroup.push(i);
            currentWidth += columnWidths[i];
        }

        // Print remaining columns if any
        if (currentGroup.length > 0) {
            printHeaders(currentGroup);
            yPos += 10;
            printRows(currentGroup);
        }

        doc.save(`${files[0].name}.pdf`); // Save the PDF
        setFiles([])
        setJsonData([])
    };

    const handleFileSelect = () => {
        document.getElementById("pdfUpload").click();
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return; // Dropped outside the list
        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFiles(items);
    };

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const [openExcelModal, setOpenExcelModal] = useState(false);
    const [selectedExcelData, setSelectedExcelData] = useState([]);

    const handleCardClick = (index) => {
        if (files[index].type === 'excel') {
            setSelectedExcelData(files[index].data);
            setOpenExcelModal(true);
        }
    };

    const handleCloseExcelModal = () => {
        setOpenExcelModal(false);
    };

    return (
        <>
            <Container maxWidth="md" sx={{ marginTop: "50px" }}>
                <Card variant="outlined" sx={{ padding: "20px" }}>
                    <CardContent>
                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                            <h1 className="custom-heading">Excel to PDF Converter</h1>
                            <input
                                type="file"
                                accept=".xls,.xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                id="pdfUpload"
                                style={{ display: "none" }}  // Hide the input
                                onChange={handleFileUpload}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFileSelect}
                            >
                                Upload Excel
                            </Button>
                            <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", padding: "10px", width: "100%" }}>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="pdf-list" direction="horizontal">
                                        {(provided) => (
                                            <Grid
                                                container
                                                spacing={2}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {files.map((file, index) => (
                                                    <Draggable key={file.name} draggableId={file.name} index={index}>
                                                        {(provided) => (
                                                            <Grid
                                                                item
                                                                xs={3} // 4 columns (12 / 3 = 4)
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <Card
                                                                    variant="outlined"
                                                                    sx={{
                                                                        height: "264px",
                                                                        overflow: "hidden",
                                                                        position: "relative",
                                                                        ":hover": {
                                                                            boxShadow: "1px 1px 5px 3px rgba(0, 0, 255, 0.2)", // Corrected camelCase
                                                                        },
                                                                    }}
                                                                    onMouseEnter={() => setHoveredIndex(index)}
                                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                                    onClick={() => handleCardClick(index)}
                                                                >
                                                                    {hoveredIndex === index && (
                                                                        <IconButton
                                                                            edge="end"
                                                                            sx={{
                                                                                position: "absolute",
                                                                                top: 8,
                                                                                right: 8,
                                                                                zIndex: 1,
                                                                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                                                "&:hover": {
                                                                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                                                                },
                                                                            }}
                                                                            onClick={() => handleRemoveFile(index)}
                                                                        >
                                                                            <CloseIcon />
                                                                        </IconButton>
                                                                    )}
                                                                    <CardContent>
                                                                        {file.type === 'excel' ? (
                                                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                                                                <DescriptionIcon sx={{ fontSize: 100, color: "green" }} />
                                                                            </Box>
                                                                        ) : (
                                                                            <img
                                                                                src={previews[index]}
                                                                                alt={file.name}
                                                                                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                                                            />
                                                                        )}
                                                                        <Box sx={{ display: "flex" }}>
                                                                            <Tooltip title={file.name} arrow>
                                                                                <span
                                                                                    style={{
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        maxWidth: "200px",
                                                                                    }}
                                                                                >
                                                                                    {file.name}
                                                                                </span>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Grid>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Box>
                            {jsonData.length > 0 && (
                                <>
                                    <Button
                                        sx={{
                                            fontFamily: `"Graphik", Arial, sans-serif`,
                                            textTransform: "none",
                                            backgroundColor: "rgb(229, 50, 45)",
                                            "&:hover": { backgroundColor: "red" },
                                        }}
                                        variant="contained" color="primary" onClick={generatePDF}>
                                        Download PDF <DownloadIcon />
                                    </Button>

                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Container>
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </>
    );
};

export default ExcelToPDf;