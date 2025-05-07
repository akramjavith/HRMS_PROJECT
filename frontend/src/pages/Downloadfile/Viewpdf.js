import { Button, Card, CardContent, Container } from "@mui/material";
import * as pdfjsLib from 'pdfjs-dist';
import React, { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const PDFViewer = () => {
    const [file, setFile] = useState(null);

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile)); // Convert file to URL
        }
    };

    const openInNewTab = () => {
        if (file) {
            window.open(file, "_blank");
        }
        setFile(null)
    };

    const handleFileSelect = () => {
        document.getElementById("pdfUpload").click();
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: "50px" }}>
            <Card variant="outlined" sx={{ padding: "20px" }}>
                <CardContent>
                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                        <h1 className="custom-heading">PDF Viewer</h1>
                        {/* <input type="file" accept="application/pdf" onChange={onFileChange} style={{ marginBottom: "20px" }} /> */}
                        <input
                            type="file"
                            accept="application/pdf"
                            id="pdfUpload"
                            style={{ display: "none" }}  // Hide the input
                            onChange={onFileChange}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileSelect}
                        >
                            Upload PDF
                        </Button>
                        &nbsp;
                        &nbsp;
                        {file && (
                            <>
                                <Button variant="contained" color="primary" onClick={openInNewTab}>
                                    Open PDF
                                </Button>

                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PDFViewer;
