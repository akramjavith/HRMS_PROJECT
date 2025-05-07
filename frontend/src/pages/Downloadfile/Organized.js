import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Container, IconButton, Typography } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { arrayMoveImmutable } from "array-move"; // Helper for reordering arrays
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from 'pdfjs-dist';
import React, { useRef, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const OrganizedPdf = () => {
    const [pdfPages, setPdfPages] = useState([]);
    const [fileLoading, setFileLoading] = useState(false);
    const [PdfFilename, setPdfFilename] = useState("");
    const fileInputRef = useRef(null);
    const [mode, setMode] = useState(null); // 'extractAll' or 'selectPages'

    const handleFileUpload = async (event) => {
        setFileLoading(true); // Set loading state to true
        const file = event.target.files[0]; // Get the uploaded file
        if (!file) return; // Exit if no file is selected

        const reader = new FileReader(); // Create a FileReader instance
        reader.onload = async (e) => {
            const pdfData = new Uint8Array(e.target.result); // Convert file to Uint8Array
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise; // Load PDF document

            const newPages = []; // Array to store new pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i); // Get each page

                // Increase the scale for higher resolution
                const scale = 1; // Adjust this value for higher/lower quality (e.g., 2, 3, 4)
                const viewport = page.getViewport({ scale });

                // Create a canvas element
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                // Set canvas dimensions based on the scaled viewport
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Increase the canvas DPI for better quality
                const dpi = 300; // Set DPI to 300 for high quality
                const scaleFactor = dpi / 96; // 96 is the default DPI for screens
                canvas.height = viewport.height * scaleFactor;
                canvas.width = viewport.width * scaleFactor;
                context.scale(scaleFactor, scaleFactor);

                // Render the page onto the canvas
                await page.render({ canvasContext: context, viewport }).promise;

                // Convert canvas to a high-quality data URL
                const imageDataUrl = canvas.toDataURL("image/png", 1.0); // Use PNG for lossless quality
                newPages.push(imageDataUrl); // Add the high-quality image to the array
            }

            // Append new pages to existing pages (if any)
            setPdfPages((prevPages) => [...prevPages, ...newPages]);

            setFileLoading(false); // Set loading state to false
            setPdfFilename(file.name.replace(/\.pdf$/, "")); // Set PDF filename (remove .pdf extension)
        };

        reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    };

    const [lodeinfExport, setLodeinfExport] = useState(false)

    const handleMergePdf = async () => {
        setLodeinfExport(true)
        try {
            const mergedPdf = await PDFDocument.create(); // Create a new PDF document

            // Loop through each base64 image in pdfPages
            for (const imageDataUrl of pdfPages) {
                try {
                    // Check if the data URL is valid
                    if (!imageDataUrl.startsWith('data:image/')) {
                        console.error('Invalid image data URL:', imageDataUrl);
                        throw new Error('Invalid image data URL format');
                    }

                    // Convert the image data URL to a Uint8Array
                    const base64Data = imageDataUrl.split(',')[1]; // Extract base64 data
                    const binaryString = atob(base64Data); // Decode base64
                    const uint8Array = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        uint8Array[i] = binaryString.charCodeAt(i);
                    }

                    // Embed the image into the PDF
                    let image;
                    if (imageDataUrl.startsWith('data:image/jpeg')) {
                        image = await mergedPdf.embedJpg(uint8Array);
                    } else if (imageDataUrl.startsWith('data:image/png')) {
                        image = await mergedPdf.embedPng(uint8Array);
                    } else {
                        throw new Error('Unsupported image format');
                    }

                    // Create a new PDF page with the image
                    const page = mergedPdf.addPage([image.width, image.height]);
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    });
                } catch (error) {
                    console.error('Error processing image:', imageDataUrl, error);
                    throw error; // Re-throw the error to stop the process
                }
            }

            // Save the merged PDF
            const mergedPdfFile = await mergedPdf.save();
            const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });

            // Create a download link for the merged PDF
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Organized.pdf'; // Set the filename for the downloaded file
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link); // Clean up
            setPdfPages([])
            setLodeinfExport(false)
        } catch (error) {
            setPdfPages([])
            setLodeinfExport(false)
            console.error('Error merging PDFs:', error);
            alert('Failed to merge PDFs. Please check the console for details.');
        }
    };

    // Handle Drag End for Sortable
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPdfPages((prevPages) => arrayMoveImmutable(prevPages, oldIndex, newIndex));
    };

    // Sortable Element
    const SortableItem = SortableElement(({ pageindex, index, value, originalIndex, onDelete }) => {
        return (
            <Card
                variant="outlined"
                sx={{
                    height: "264px",
                    overflow: "hidden",
                    position: "relative",
                    margin: "5px",
                    ":hover": { boxShadow: "1px 1px 5px 3px rgba(0, 0, 255, 0.2)" },
                }}
            >

                <IconButton
                    onClick={() => onDelete(pageindex)} // Trigger delete function
                    style={{ position: "absolute", top: 5, right: 5, color: "grey" }} // Style for the button
                >
                    <CloseIcon />
                </IconButton>
                <CardContent>
                    <img
                        src={value}
                        alt={`Page ${pageindex + 1}`}
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <Typography align="center">Page {originalIndex + 1}</Typography>
                </CardContent>
            </Card>
        )
    }
    );

    // Sortable Container
    const SortableList = SortableContainer(({ items, onDelete }) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>

            {items.map((page, index) => {
                return (
                    <SortableItem
                        key={`item-${index}`}
                        pageindex={index}
                        index={index}
                        value={page}
                        originalIndex={items.indexOf(page)}
                        onDelete={onDelete}
                    />
                )
            })}
        </div>
    ));

    // Function to handle page deletion
    const handleDelete = (pageindex) => {
        setPdfPages((prevPages) => prevPages.filter((_, index) => index !== pageindex));
    };

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Container maxWidth="md" sx={{ marginTop: "50px", padding: "0px !important" }}>
                <Card variant="outlined" sx={{ display: "flex", justifyContent: "center" }}>
                    <CardContent>
                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignContent: "center" }}>
                                <h1 className="custom-heading">Organize PDF</h1>
                                {pdfPages?.length > 0 && (

                                    <Tooltip title="Add File" arrow>

                                        <Button
                                            sx={{
                                                fontSize: '2.5em', // Font size
                                                color: 'white', // Text color
                                                backgroundColor: "red",
                                                borderRadius: "50%",
                                                height: "48px",
                                                width: "5px",
                                                margin: 0, // Margin
                                                marginBottom: '20px', // Bottom margin
                                                textShadow: '-1px -2px 3px rgba(17, 17, 17, 0.3)', // Text shadow
                                                '&:hover': {
                                                    backgroundColor: 'red', // Keep the same background color on hover
                                                    color: 'white', // Keep the same text color on hover
                                                },
                                            }}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <AddIcon
                                                sx={{
                                                    fontWeight: 'bold', // Add font weight to the icon
                                                    fontSize: 'inherit', // Inherit font size from the Button
                                                }}
                                            />
                                        </Button>
                                    </Tooltip>
                                )}

                            </div>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                            />
                            {pdfPages?.length === 0 && (
                                <Button variant="contained" onClick={() => fileInputRef.current.click()} disabled={fileLoading}>
                                    {fileLoading ? "Loading..." : "Upload PDF"}
                                </Button>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    marginTop: "20px",
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    padding: "10px",
                                }}
                            >
                                <SortableList
                                    items={pdfPages}
                                    onDelete={handleDelete}
                                    onSortEnd={onSortEnd}
                                    axis="xy" // Allow both horizontal and vertical dragging
                                    pressDelay={200} // Add a delay to avoid accidental drags
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Container>
            {
                pdfPages?.length > 0 && (
                    <Container maxWidth="md" sx={{ marginTop: "50px", padding: "0px !important", width: "60%" }}>
                        <Card variant="outlined" sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <CardContent sx={{ width: "100%" }}>
                                <div style={{ textAlign: "center", marginTop: "50px" }}>
                                    <h1 className="custom-heading">Organize</h1>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                        <h2>Extract mode:</h2>
                                        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                                            {pdfPages?.length > 0 && (
                                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleMergePdf}
                                                        // disabled={selectedPages.length === 0}
                                                        sx={{
                                                            mt: 2,
                                                            fontSize: "22px",
                                                            fontFamily: `"Graphik", Arial, sans-serif`,
                                                            textTransform: "none",
                                                            backgroundColor: "rgb(229, 50, 45)",
                                                            padding: "8px 20px",
                                                            "&:hover": { backgroundColor: "rgb(200, 40, 35)" },
                                                        }}
                                                    >
                                                        {lodeinfExport ? "Loading..." : <>Export <FileDownloadIcon /> </>}
                                                    </Button>
                                                </Box>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                )
            }
        </Box >
    );
};

export default OrganizedPdf;