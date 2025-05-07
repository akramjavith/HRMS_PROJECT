import React, { useState, useRef } from "react";
import { Card, CardContent, Button, Checkbox, Container, Box, Typography, TextField } from "@mui/material";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from 'pdfjs-dist';
import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const SplitPDF = () => {
    const [pdfPages, setPdfPages] = useState([]);
    const [fileLoading, setFileLoading] = useState(false);
    const [PdfFilename, setPdfFilename] = useState("");
    const [selectedPages, setSelectedPages] = useState([]);
    const fileInputRef = useRef(null);
    const [mode, setMode] = useState(null); // 'extractAll' or 'selectPages'
    const [pagesToExtract, setPagesToExtract] = useState("");
    // Handle PDF file upload
    const handleFileUpload = async (event) => {
        setFileLoading(true)
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const pdfData = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const pages = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                pages.push(canvas.toDataURL());
            }
            setPdfPages(pages);
            setFileLoading(false)
            setPdfFilename(file.name.replace(/\.pdf$/, ""));
        };
        reader.readAsArrayBuffer(file);
    };


    const handleSplitPDF = async () => {
        if (selectedPages.length === 0) {
            alert("Please select at least one page.");
            return;
        }

        const file = fileInputRef.current.files[0];
        if (!file) {
            alert("No PDF file uploaded.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const pdfData = new Uint8Array(e.target.result);
            const pdfDoc = await PDFDocument.load(pdfData);

            if (selectedPages.length > 1) {
                const zip = new JSZip();

                for (const pageNumber of selectedPages) {
                    const newPdfDoc = await PDFDocument.create();

                    // Fix: Use (pageNumber - 1) to match PDF.js zero-based index
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);

                    newPdfDoc.addPage(copiedPage);
                    const pdfBytes = await newPdfDoc.save();
                    zip.file(`${PdfFilename}_${pageNumber}.pdf`, pdfBytes);
                }

                zip.generateAsync({ type: "blob" }).then((content) => {
                    saveAs(content, `${PdfFilename}.zip`);
                });
            } else {
                const newPdfDoc = await PDFDocument.create();

                // Fix: Use (selectedPages[0] - 1) for zero-based indexing
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [selectedPages[0] - 1]);

                newPdfDoc.addPage(copiedPage);
                const pdfBytes = await newPdfDoc.save();
                saveAs(new Blob([pdfBytes]), `${PdfFilename}_${selectedPages[0]}.pdf`);
            }
        };

        reader.readAsArrayBuffer(file);
        setPdfPages([])
    };


    const handleExtractAll = () => {
        setMode("extractAll");

        // Select all pages starting from 1
        const allPages = pdfPages.map((_, index) => index + 1);

        setSelectedPages(allPages);
        setPagesToExtract(allPages.join(", ")); // Update input field
    };


    // Handle Select Pages button click
    const handleSelectPages = () => {
        setMode("selectPages");
        setSelectedPages([]); // Uncheck all pages
        setPagesToExtract("")
    };

    const handleSelectPage = (index) => {
        const pageNumber = index + 1; // Ensure pages start from 1

        setSelectedPages((prev) => {
            const updatedPages = prev.includes(pageNumber)
                ? prev.filter((i) => i !== pageNumber)
                : [...prev, pageNumber];

            setPagesToExtract(updatedPages.sort((a, b) => a - b).join(", ")); // Keep input sorted
            return updatedPages;
        });
    };


    // Handle input change for pages to extract
    const totalPages = pdfPages?.length; // Set the total number of pages dynamically if needed


    const handlePagesToExtractChange = (e) => {
        let input = e.target.value;

        // Allow only numbers and commas in input
        input = input.replace(/[^0-9,]/g, ""); // Remove non-numeric & non-comma characters

        // Keep raw input value
        setPagesToExtract(input);

        // Extract valid numbers
        const pagesArray = input
            .split(",")
            .map((num) => num.trim())
            .filter((num) => num !== "" && !isNaN(num) && Number(num) > 0) // No 0 or negatives
            .map(Number)
            .filter((num) => num <= totalPages); // Ensure within range

        setSelectedPages(pagesArray); // Update selected pages
    };



    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Container maxWidth="md" sx={{ marginTop: "50px", padding: "0px !important", }}>
                <Card variant="outlined" sx={{ display: "flex", justifyContent: "center" }}>
                    <CardContent>
                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                            <h1 className="custom-heading">Split PDF</h1>
                            {/* <input type="file" accept="application/pdf" onChange={onFileChange} style={{ marginBottom: "20px" }} /> */}
                            <div>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileUpload}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                />
                                {pdfPages?.length === 0 &&

                                    <Button variant="contained" onClick={() => fileInputRef.current.click()} disabled={fileLoading}>
                                        {fileLoading ? "Loading..." : "Upload PDF"}
                                    </Button>
                                }
                                <div
                                    // style={{ display: "flex", width: "100%", justifyContent: "space-between", flexWrap: "wrap", marginTop: "20px" }}
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        marginTop: "20px",
                                        maxHeight: "500px", // Set a maximum height for the container
                                        overflowY: "auto", // Enable vertical scrolling
                                        padding: "10px", // Optional: Add some padding
                                    }}
                                >
                                    {pdfPages.map((page, index) => (
                                        <Card key={index}

                                            variant="outlined"
                                            sx={{
                                                height: "264px",
                                                overflow: "hidden",
                                                position: "relative",
                                                margin: "5px",
                                                ":hover": {
                                                    boxShadow: "1px 1px 5px 3px rgba(0, 0, 255, 0.2)", // Corrected camelCase
                                                },
                                            }}
                                        >

                                            <Checkbox
                                                checked={selectedPages.includes(index + 1)} // Use index + 1
                                                onChange={() => handleSelectPage(index)}
                                                style={{ position: "absolute", top: 5, right: 5 }}
                                            />
                                            <CardContent>
                                                <img src={page} alt={`Page ${index + 1}`} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                                <Typography align="center">Page {index + 1}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>



                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Container>
            {pdfPages?.length > 0 &&
                <Container maxWidth="md" sx={{ marginTop: "50px", padding: "0px !important", width: "60%" }}>
                    {pdfPages?.length > 0 &&

                        <Card variant="outlined" sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <CardContent sx={{ width: "100%" }}>
                                <div style={{ textAlign: "center", marginTop: "50px" }}>
                                    <h1 className="custom-heading">Split</h1>
                                    {/* <input type="file" accept="application/pdf" onChange={onFileChange} style={{ marginBottom: "20px" }} /> */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>


                                        <h2>Extract mode:</h2>

                                        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleExtractAll}
                                                style={{ marginRight: "10px" }}
                                            >
                                                Extract All Pages
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleSelectPages}
                                            >
                                                Select Pages
                                            </Button>
                                        </div>
                                        {mode === "extractAll" && (
                                            <Typography variant="body1" style={{ marginTop: "10px" }}>
                                                Selected pages will be converted into separate PDF files. <strong>{selectedPages.length} PDFs </strong>will be created.
                                            </Typography>
                                        )}
                                        {mode === "selectPages" && (
                                            <div style={{ marginTop: "10px", padding: "0px !important", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                <TextField
                                                    label="Pages to extract"
                                                    value={pagesToExtract}
                                                    onChange={handlePagesToExtractChange}
                                                    placeholder="e.g., 1, 3, 5"
                                                />
                                                <Typography variant="body2" style={{ marginTop: "5px" }}>
                                                    Enter page numbers separated by commas.
                                                </Typography>
                                            </div>
                                        )}

                                        {pdfPages?.length > 0 &&
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSplitPDF}
                                                    disabled={selectedPages.length === 0}
                                                    sx={{
                                                        mt: 2, // margin-top: 20px
                                                        fontSize: "22px",
                                                        fontFamily: `"Graphik", Arial, sans-serif`, // Ensure correct font syntax
                                                        textTransform: "none", // Prevent uppercase transformation
                                                        backgroundColor: "rgb(229, 50, 45)",
                                                        padding: "8px 20px",
                                                        "&:hover": { backgroundColor: "rgb(200, 40, 35)" },
                                                    }}
                                                >
                                                    Split PDF <InsertPageBreakIcon />
                                                </Button>

                                            </Box>

                                        }
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    }
                </Container>
            }
        </Box >

    );
};

export default SplitPDF;