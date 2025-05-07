import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Container, Tooltip, Grid, IconButton } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

function MergePdf() {
    const [files, setFiles] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [previews, setPreviews] = useState([]);

    // Handle file upload
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        generatePreviews(newFiles);
    };

    // Generate PDF previews
    const generatePreviews = async (files) => {
        const newPreviews = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1); // Get the first page
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                return canvas.toDataURL(); // Return the preview as a data URL
            })
        );
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    // Handle file removal
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    // Handle drag-and-drop reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return; // Dropped outside the list
        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFiles(items);

        const previewItems = Array.from(previews);
        const [reorderedPreview] = previewItems.splice(result.source.index, 1);
        previewItems.splice(result.destination.index, 0, reorderedPreview);
        setPreviews(previewItems);
    };

    // Merge PDFs
    const handleMergePdf = async () => {
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save();
        const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);
    };

    // Download merged PDF
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = mergedPdfUrl;
        link.download = 'merged.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMergedPdfUrl(null)
        setFiles([])
    };
    const [hoveredIndex, setHoveredIndex] = useState(null);
    return (
        <Container maxWidth="md" sx={{ marginTop: '50px' }}>
            <Card variant="outlined" sx={{ padding: '20px'}}>
                <CardContent>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h1 className="custom-heading">Merge PDF</h1>
                        <Box my={2}>
                            <input
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                id="upload-pdf"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-pdf">
                                <Button variant="contained" component="span">
                                    Upload PDF
                                </Button>
                            </label>
                        </Box>

                        {!mergedPdfUrl && (
                            <>
                                {/* Drag-and-drop PDF list */}
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
                                                                            <img
                                                                                src={previews[index]}
                                                                                alt={file.name}
                                                                                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                                                            />
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

                                {files.length > 1 && (
                                    <Box my={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button variant="contained" color="primary" onClick={handleMergePdf} disabled={files.length < 2}>
                                            Merge PDFs
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}



                        {mergedPdfUrl && (
                            <Box my={2}>
                                <Button variant="contained" sx={{
                                    backgroundColor: "rgb(255, 0, 0)", // Custom red color
                                    "&:hover": {
                                        backgroundColor: "darkred", // Darker red on hover
                                    },
                                }} onClick={handleDownload}>
                                    Download Merged PDF
                                </Button>
                            </Box>
                        )}
                    </div>
                </CardContent>
            </Card >
        </Container >
    );
}

export default MergePdf;