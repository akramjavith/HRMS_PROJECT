import ForwardIcon from '@mui/icons-material/Forward';
import {
    Alert,
    Button,
    Card,
    CardContent,
    Container,
    Snackbar,
} from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import React, { useState } from 'react';
import { userStyle } from "../../pageStyle";
// Manually set the worker source to the CDN

function CompressPdf() {

    console.log(pdfjs.version, "pdfjs.version")

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [fileData, setFileData] = useState(false);
    console.log(fileData, "fileData")
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setAlertMessage('Please select a valid PDF file.');
            setAlertSeverity('error');
            setOpenAlert(true);
        }
    };

    const [uploadedSize, setUploadedSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);

    const handleCompress = async () => {
        if (!file) return;

        setLoading(true);
        setCompressedSize(null);
        setUploadedSize((file.size / 1024).toFixed(2)); // Set uploaded file size in KB
        try {
            console.log("File received:", file);

            const arrayBuffer = await file.arrayBuffer();
            console.log("ArrayBuffer received:", arrayBuffer.byteLength);

            console.log("Loading PDF using pdfjs-dist...");
            GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
            const pdf = await getDocument({ data: arrayBuffer }).promise;
            console.log("PDF loaded. Number of pages:", pdf.numPages);

            const newPdfDoc = await PDFDocument.create();

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 3.0 }); // Increase scale for higher DPI

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Render the page into the canvas
                await page.render({ canvasContext: context, viewport }).promise;

                // Get the image bytes from the canvas
                const imageBytes = await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(new Uint8Array(reader.result));
                        reader.readAsArrayBuffer(blob);
                    }, "image/png", 1.0); // Use PNG for lossless compression
                });

                // Embed as PNG image into the new PDF document
                const image = await newPdfDoc.embedPng(imageBytes); // Embed as PNG
                const newPage = newPdfDoc.addPage([canvas.width, canvas.height]);
                newPage.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: canvas.width,
                    height: canvas.height,
                });
            }

            let compressedPdfBytes = await newPdfDoc.save();
            console.log("Final Compressed file size:", compressedPdfBytes.length);

            const compressedSizeKB = (compressedPdfBytes.length / 1024).toFixed(2); // In KB
            setCompressedSize(compressedSizeKB);

            // Check if compressed file size is smaller than uploaded file size
            if (compressedPdfBytes.length < file.size) {
                const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = "compressed_hq.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setAlertMessage("PDF compressed successfully with HQ text & images!");
                setAlertSeverity("success");
                setFile(null);
                setOpenAlert(true);
                setFileData(true);
            } else {
                // Retry compression with reduced settings
                // setAlertMessage("Compressed file size is not smaller than the original file. Retrying with higher compression...");
                // setAlertSeverity("warning");
                // setOpenAlert(true);
                // setFileData(false);

                const retryCompressedPdfBytes = await retryCompression(file);
                const retryCompressedSizeKB = (retryCompressedPdfBytes.length / 1024).toFixed(2); // In KB
                setCompressedSize(retryCompressedSizeKB);

                if (retryCompressedPdfBytes.length < file.size) {
                    const blob = new Blob([retryCompressedPdfBytes], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "compressed_hq_retry.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    setAlertMessage("PDF compressed successfully after retry!");
                    setAlertSeverity("success");
                    setFile(null);
                    setOpenAlert(true);
                    setFileData(true);
                } else {
                    setAlertMessage("Unable to reduce file size further. Please try a different file.");
                    setAlertSeverity("error");
                    setOpenAlert(true);
                    setFileData(false);
                    setFile(null);
                }
            }
        } catch (error) {
            setFileData(false);
            console.error("Error compressing PDF:", error);
            setFile(null);
            setAlertMessage(error.message || "Failed to compress PDF. Please try again.");
            setAlertSeverity("error");
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    // Function to retry compression with reduced settings
    const retryCompression = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        const newPdfDoc = await PDFDocument.create();

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 }); // Lower scale for higher compression

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            const imageBytes = await new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(new Uint8Array(reader.result));
                    reader.readAsArrayBuffer(blob);
                }, "image/jpeg", 0.6); // Lower quality for better compression
            });

            const image = await newPdfDoc.embedJpg(imageBytes);
            const newPage = newPdfDoc.addPage([canvas.width, canvas.height]);
            newPage.drawImage(image, {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
            });
        }
        setOpenAlert(true);
        setFileData(false);

        return await newPdfDoc.save();
    };



    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: '50px' }}>
            <Card variant="outlined" sx={{ padding: '20px' }}>
                <CardContent>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h1 className="custom-heading">PDF Compressor</h1>

                        {/* File input (hidden) */}
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="pdf-input"
                        />

                        {/* Select PDF or Compress PDF button */}
                        {!file && (
                            <label htmlFor="pdf-input">
                                <Button
                                    variant="contained"
                                    component="span"
                                    disabled={loading}
                                    sx={{ marginBottom: '20px' }}
                                    onClick={() => {
                                        setFileData(false);
                                    }}
                                >
                                    {file ? 'Compress PDF' : 'Select PDF'}
                                </Button>
                            </label>
                        )}

                        {/* Compress button (only shown after file selection) */}
                        {file && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCompress}
                                disabled={loading}
                                sx={{ marginLeft: '10px' }}
                            >
                                {loading ? 'Compressing...' : 'Compress PDF'}
                            </Button>
                        )}

                        <div style={{ display: "flex", justifyContent: "center" }}>


                            {fileData &&

                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <div>
                                        <p style={userStyle.SubHeaderText}>Your PDF is now smaller!</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {uploadedSize && <p style={userStyle.SubHeaderText}>{uploadedSize} KB</p>}
                                        {compressedSize && (
                                            <p style={{ ...userStyle.SubHeaderText, display: "flex", alignItems: "center" }}>
                                                <ForwardIcon /> {compressedSize} KB
                                            </p>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alert for messages */}
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container >
    );
}



export default CompressPdf;