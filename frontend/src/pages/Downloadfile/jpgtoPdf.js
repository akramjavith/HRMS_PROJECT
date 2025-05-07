import React, { useState, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, IconButton, Typography } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { jsPDF } from "jspdf";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move"; // Helper for reordering arrays
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const JpgToPdfConverter = () => {
    const [images, setImages] = useState([]);
    const [pdfEnabled, setPdfEnabled] = useState(false);
    const [orientation, setOrientation] = useState("portrait");
    const [pageSize, setPageSize] = useState("a4");
    const [margin, setMargin] = useState("no-margin");
    const fileInputRef = useRef(null);
    const [fileLoading, setFileLoading] = useState(false);

    const [lodeinfExport, setLodeinfExport] = useState(false)

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter((file) =>
            file.type.startsWith("image/") // This accepts all image types (JPEG, PNG, GIF, etc.)
        );

        if (validFiles.length > 0) {
            const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
            setImages([...images, ...imageUrls]); // Append new images to existing state
            setPdfEnabled(true);
        } else {
            alert("Please upload only image files.");
        }
    };


    // Convert Images to PDF (Ensuring Centered Placement)
    const generatePDF = async () => {
        const pdf = new jsPDF({
            orientation: orientation, // Portrait or Landscape
            unit: "mm",
            format: pageSize, // A4, A3, Letter
        });

        // Define page sizes
        const pageDimensions = {
            a4: { width: 210, height: 297 },
            a3: { width: 297, height: 420 },
            letter: { width: 216, height: 279 },
        };

        let pageWidth = orientation === "portrait" ? pageDimensions[pageSize].width : pageDimensions[pageSize].height;
        let pageHeight = orientation === "portrait" ? pageDimensions[pageSize].height : pageDimensions[pageSize].width;

        // Define margin values
        const marginSizes = {
            "no-margin": 0,
            "small": 10,
            "big": 20,
        };

        let marginValue = marginSizes[margin];

        for (let index = 0; index < images.length; index++) {
            if (index !== 0) pdf.addPage();

            // Load each image before adding to PDF
            await new Promise((resolve) => {
                const img = new Image();
                img.src = images[index];
                img.onload = () => {
                    let aspectRatio = img.width / img.height;
                    let maxWidth = pageWidth - 2 * marginValue;
                    let maxHeight = pageHeight - 2 * marginValue;

                    let imgWidth = maxWidth;
                    let imgHeight = imgWidth / aspectRatio;

                    if (imgHeight > maxHeight) {
                        imgHeight = maxHeight;
                        imgWidth = imgHeight * aspectRatio;
                    }

                    // Calculate center position
                    let xOffset = (pageWidth - imgWidth) / 2;
                    let yOffset = (pageHeight - imgHeight) / 2;

                    pdf.addImage(img, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
                    resolve();
                };
            });
        }

        pdf.save("Images.pdf");
        setPdfEnabled(false);
    };

    // Handle Drag End for Sortable
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setImages((prevPages) => arrayMoveImmutable(prevPages, oldIndex, newIndex));
    };

    // Sortable Element
    const SortableItem = SortableElement(({ pageindex, index, value, originalIndex, onDelete }) => {
        return (
            <Card
                variant="outlined"
                sx={{

                    height: "200px",
                    width: "200px",
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
                </CardContent>
            </Card>
        )
    }
    );

    // Sortable Container
    const SortableList = SortableContainer(({ items, onDelete }) => (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>

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
        setImages((prevPages) => prevPages.filter((_, index) => index !== pageindex));
    };

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Container maxWidth="md" sx={{ marginTop: "50px", width: "100%", padding: "0px !important" }}>
                <Card variant="outlined" sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                    <CardContent sx={{ width: images?.length > 0 ? "100%" : "none" }}>
                        <div style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", alignItems: "center", width: "100%" }}>
                                <h1 className="custom-heading">JPG to PDF Converter</h1>
                                {images?.length > 0 && (

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
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />

                            {images?.length === 0 && (
                                <Button variant="contained" onClick={() => fileInputRef.current.click()} disabled={fileLoading}>
                                    {fileLoading ? "Loading..." : "Upload PDF"}
                                </Button>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    marginTop: "20px",
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    padding: "10px",
                                }}
                            >
                                <SortableList
                                    items={images}
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
                images?.length > 0 && (
                    <Container maxWidth="md" sx={{ marginTop: "50px", padding: "0px !important", width: "45%" }}>
                        <Card variant="outlined" sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <CardContent sx={{ width: "100%" }}>
                                <div style={{ marginTop: "50px" }}>
                                    <h1 className="custom-heading">JPG to PDF</h1>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                        <h2>Extract mode:</h2>
                                        <Box sx={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                                            {/* Orientation */}
                                            <FormControl sx={{ width: "100%" }}>
                                                <InputLabel id="demo-simple-select-label">Orientation</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={orientation}
                                                    label="Orientation"
                                                    onChange={(e) => setOrientation(e.target.value)}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                textAlign: "left" // Aligns text to the left in the dropdown menu
                                                            }
                                                        }
                                                    }}

                                                >
                                                    <MenuItem value="portrait">Portrait</MenuItem>
                                                    <MenuItem value="landscape">Landscape</MenuItem>
                                                </Select>
                                            </FormControl>

                                            {/* Page Size */}
                                            <FormControl>
                                                <InputLabel id="demo-simple-select-label">Page Size</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Page Size"
                                                    value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                                                    <MenuItem value="a4">A4</MenuItem>
                                                    <MenuItem value="a3">A3</MenuItem>
                                                    <MenuItem value="letter">Letter</MenuItem>
                                                </Select>
                                            </FormControl>

                                            {/* Margin */}
                                            <FormControl>
                                                <InputLabel id="demo-simple-select-label">Margin</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Margin"
                                                    value={margin} onChange={(e) => setMargin(e.target.value)}>
                                                    <MenuItem value="no-margin">No Margin</MenuItem>
                                                    <MenuItem value="small">Small</MenuItem>
                                                    <MenuItem value="big">Big</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                                            {images?.length > 0 && (
                                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={generatePDF}
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

export default JpgToPdfConverter;
