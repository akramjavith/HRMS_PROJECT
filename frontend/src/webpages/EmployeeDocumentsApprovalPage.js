import React, { useState, useEffect, useRef } from "react";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "../App.css";
import PinIcon from "@mui/icons-material/Pin";
import hilifelogo from "../login/hilifelogo.png";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DescriptionIcon from "@mui/icons-material/Description";
import { Stack } from "@mui/material";
import moment from "moment-timezone";
import { Container, Checkbox, DialogContent, Grid, Skeleton, FormControl, OutlinedInput, FormControlLabel, Button, ListItem, Typography, List, Paper, Dialog, DialogTitle, DialogActions, Box } from "@mui/material";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import "./documentApproval.css";
import { useNavigate } from "react-router-dom";
import { AUTH, BASE_URL } from "../services/Authservice";
import confetti from 'canvas-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
function EmployeeDocumentsApprovalPage() {
    const { id } = useParams();
    const [documentData, setDocumentData] = useState({});
    const [userLoginStatus, setUserLoginStatus] = useState({});
    const [userESignature, setESignature] = useState("");
    const [templateMail, setTemplateMail] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [signature, setSignature] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState([]);
    const [checkedConditions, setCheckedConditions] = useState({});
    const backPage = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogTermsConditions, setOpenDialogTermsConditions] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: "", description: "", key: "" });
    const [openGreetDialog, setOpenGreetDialog] = React.useState(false);
    const [acceptedConditions, setAcceptedConditions] = useState({});
    // Handle checkbox changes
    const handleCheckboxChange = (event, condition) => {
        const { name, checked } = event.target;

        if (condition.viewmore && condition.description && checked) {
            // Open dialog instead of immediately toggling checkbox
            setDialogContent({
                title: condition.details,
                description: condition.description,
                key: condition.details,
            });
            setOpenDialogTermsConditions(true);
        } else {
            // Directly toggle checkbox state if no "See More"
            setCheckedConditions((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        }
    };
    const handleAcceptDialog = () => {
        const key = dialogContent.key;
        setAcceptedConditions((prevState) => ({
            ...prevState,
            [key]: true, // Mark as accepted
        }));
        setCheckedConditions((prevState) => ({
            ...prevState,
            [key]: true, // Enable the checkbox
        }));
        setOpenDialogTermsConditions(false);
    };

    const handleDialogClose = () => {
        setOpenDialogTermsConditions(false);
    };
    const handleViewMore = (condition) => {
        setDialogContent({ title: condition.details, description: condition.description });
        setOpenDialogTermsConditions(true);
    };
    // Check if all conditions are accepted
    const allChecked = termsAndConditions.length > 0 &&
        termsAndConditions.every((condition) => checkedConditions[condition.details]);
    // Handle approve button click
    const handleApproveClick = () => {
        setOpenDialog(true);
    };

    // Handle confirmation of submission
    const handleConfirmSubmit = () => {
        setOpenDialog(false);
        const canvas = document.getElementById('confettiCanvas');
        const myConfetti = confetti.create(canvas, { resize: true });

        // Trigger the confetti effect
        myConfetti({
            particleCount: 360,
            spread: 180,
            origin: { y: 0.8 }
        });
        setOpenGreetDialog(true)
        getApprovalDocument(documentData?.data?.sdocumentPreparation);
    };
    const TemplateDropdownsValue = async () => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
            });
            setDocumentData(res);
            TermsAndConditionsFetching(res?.data?.sdocumentPreparation?.termsAndConditons)
            if (res?.data?.sdocumentPreparation?.person) {
                let [response, userDetails] = await Promise.all([axios.post(`${SERVICE.INDIVIDUAL_USER_LOGIN_STATUS}`, {
                    companyname: res?.data?.sdocumentPreparation?.person
                }
                ),
                axios.post(`${SERVICE.USER_ESIGNATURE_FILTER}`, {
                    companyname: res?.data?.sdocumentPreparation?.person
                }
                )])
                const usersData = response?.data?.users?.loginUserStatus?.length > 0 ? response?.data?.users?.loginUserStatus?.filter(data => data?.status === "Active") : []
                const userESignature = userDetails?.data?.semployeesignature ? userDetails?.data?.semployeesignature?.signatureimage : ""
                const userMail = userDetails?.data?.tempControlPanel ? userDetails?.data?.semployeesignature?.tempControlPanel : ""
                setUserLoginStatus(usersData?.length > 0 ? usersData[0] : {})
                setESignature(userESignature ? userESignature : "")
                setTemplateMail(userMail ? userMail : "")
                await generatePdfPreview(res, userESignature);
            }



        } catch (err) { console.log(err, '39') }
    };


    const TermsAndConditionsFetching = async (selectedids) => {
        try {
            let res = await axios.get(SERVICE.ALL_TERMSANDCONDITION, {
            });
            setTermsAndConditions(res?.data?.termsandcondition?.filter(data => selectedids?.includes(data?._id)) ?? []);
        } catch (err) { console.log(err, '39') }
    };



    const generatePdfPreview = async (response, imageView) => {
        const htmlElement = document.createElement("div");
        // htmlElement.innerHTML = response.data.sdocumentPreparation.document;
        htmlElement.innerHTML = response.data.sdocumentPreparation.document.replace(/<img[^>]*>/g, '')
        //     .replaceAll("$EMPLOYEESIGNATURE$", imageView ? `
        //          <span style="display: inline-flex; flex-direction: column; align-items: center; text-align: center;">
        //     <img src="${imageView}" alt="Signature" style="width: 200px; height: 30px;" />
        //     <span style="font-weight: bold; margin-top: 2px;">(${response?.data?.sdocumentPreparation?.person})</span>
        // </span>
        //     ` : "")
        console.log(htmlElement, 'htmlElement')
        // setSignature(response.data.sdocumentPreparation.document?.replaceAll("$EMPLOYEESIGNATURE$", response.data.sdocumentPreparation?.person));
        setSignature(response?.data?.sdocumentPreparation?.document?.replaceAll("$EMPLOYEESIGNATURE$", imageView ? `
          <span style="position: relative; display: inline-block;">
         <img src="${imageView}" alt="Signature" 
                  style="
                      position: absolute;
                      z-index: 10;
         ${response?.data?.sdocumentPreparation?.pagesize === 'A3' ?
                'width: 200px !important; height: 30px !important; top: -25px;' :
                'width: 130px !important; height: 25px !important; top: -25px;'}
                      pointer-events: none;
                      background: transparent;
                  "
              />
          </span>
        ` : ``));
        // console.log(response.data.sdocumentPreparation.document , 'response.data.sdocumentPreparation.document');
        // Add custom styles to the HTML content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
           .ql-indent-1 { margin-left: 75px; }
           .ql-indent-2 { margin-left: 150px; }
           .ql-indent-3 { margin-left: 225px; }
           .ql-indent-4 { margin-left: 275px; }
           .ql-indent-5 { margin-left: 325px; }
           .ql-indent-6 { margin-left: 375px; }
           .ql-indent-7 { margin-left: 425px; }
           .ql-indent-8 { margin-left: 475px; }
           .ql-align-right { text-align: right; } 
           .ql-align-left { text-align: left; } 
           .ql-align-center { text-align: center; } 
           .ql-align-justify { text-align: justify; } 
         `;
        htmlElement.appendChild(styleElement);
        const addConfidentialWatermark = (htmlString, pageCount) => {
            let watermarkTexts =
                pageCount <= 2
                    ? ["CONFIDENTIAL"]
                    :
                    pageCount > 2 && pageCount <= 5 ?
                        ["CONFIDENTIAL", "SAMPLE DRAFT"]
                        :
                        ["CONFIDENTIAL", "SAMPLE DRAFT", "UNAUTHORIZED", "SHARING IS", "STRICTLY", "PROHIBITED"];

            return `
                        <div style="position: relative;">
                          <!-- Watermark Texts -->
                          ${watermarkTexts
                    .map(
                        (text, index) => `
                                  <div style="
                                    position: absolute;
                                    top: ${pageCount <= 2 ? 40 + index * 10 + "%" : 15 + index * 10 + "%"};
                                    left: 50%;
                                    width: 100%;
                                    height: 100%;
                                    transform: translate(-50%, -50%) rotate(-20deg);
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    font-size: 8rem;
                                    font-weight: 900;
                                    color: rgba(0, 0, 0, 0.1);
                                    text-transform: uppercase;
                                    white-space: nowrap;
                                    pointer-events: none;
                                    z-index: 1;
                                  ">
                                    ${text}
                                  </div>
                                `
                    )
                    .join("")}
                          
                          ${htmlString}
                        </div>
                      `;
        };



        const getPrintPageCount = (htmlString) => {
            const pageHeight = 297 * 3.77953; // Convert A4 paper height (in mm) to pixels
            const pageWidth = 210 * 3.77953;  // Convert A4 paper width (in mm) to pixels
            const watermarkHeight = 100; // Assuming watermark height in pixels

            // Create a temporary container to simulate the print area
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.visibility = 'hidden';
            container.style.width = `${pageWidth}px`;
            container.style.height = `${pageHeight}px`;
            container.innerHTML = htmlString;

            document.body.appendChild(container);

            // Calculate content height, assuming content doesn't overflow the container
            const contentHeight = container.scrollHeight;

            document.body.removeChild(container);

            // Calculate number of pages needed
            const pagesNeeded = Math.ceil((contentHeight + watermarkHeight) / pageHeight);

            return pagesNeeded;
        };

        // Example usage
        const pageCount = getPrintPageCount(htmlElement.outerHTML);
        // Example usages
        setHtmlContent(addConfidentialWatermark(htmlElement.outerHTML, pageCount));
        // setHtmlContent(htmlElement.outerHTML)
        // return htmlElement.outerHTML;
    };


    useEffect(() => { TemplateDropdownsValue(); }, [])
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [errorValidation, setErrorValidation] = useState("");
    const [openValidation, setOpenValidation] = useState(false);
    const [otp, setOtp] = useState("");
    const [openOTPView, setOpenOTPView] = useState(false);
    const [error, setError] = useState("");
    const handleViewOpenOTP = () => {
        setOpenOTPView(true);
    };
    const handlViewCloseOTP = () => {
        setOpenOTPView(false);
        setOtp("");
        setError("");
    };
    //view popup
    const [openView, setOpenView] = useState(false);
    const handleViewOpen = () => {
        setOpenView(true);
        setOtp("");
    };
    const handlViewClose = () => {
        setOpenView(false);
        setOtp("");
    };
    const handleOpenValidation = () => {
        setOpenValidation(true);
        setErrorValidation("")
    };
    const handleCloseValidation = () => {
        setOpenValidation(false);
        setErrorValidation("");
        setMobile("");
        setDob("");
        setErrorValidation("");
    };



    const handleMobileChange = (e) => {
        const enteredValue = e.target.value.replace(/\D/, ""); // Allow digits only
        if (/^\d{0,10}$/.test(enteredValue)) {
            setMobile(enteredValue);
        }
    };

    const handleDOBChange = (e) => {
        setDob(e.target.value);
    };

    const validateAndSubmit = () => {
        if (mobile.length !== 10) {
            setErrorValidation("Mobile number must be 10 digits.");
            return;
        }
        else if (dob === "") {
            setErrorValidation("Please Select DOB");
            return;
        } else {
            verifyValidation()
        }

    };





    const checkOtp = async () => {
        try {
            let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL}`, {
                otp: String(otp),
                companyname: documentData?.data?.sdocumentPreparation?.person,
            });
            if (response.data.otpneeded == true) {
                handleViewOpenOTP();
            }
            else {
                handleOpenValidation();
            }
        } catch (err) {
            console.log(err, 'err');
        }
    };
    const verifyOtp = async () => {
        try {
            if (otp != "") {
                let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL}`, {
                    otp: String(otp),
                    companyname: documentData?.data?.sdocumentPreparation?.person,
                });
                console.log(response?.data, "response?.data")
                if (response?.data?.success == true) {
                    handlViewCloseOTP();
                    const canvas = document.getElementById('confettiCanvas');
                    const myConfetti = confetti.create(canvas, { resize: true });
                    // Trigger the confetti effect
                    myConfetti({
                        particleCount: 360,
                        spread: 180,
                        origin: { y: 0.8 }
                    });
                    setOpenGreetDialog(true)
                    getApprovalDocument(documentData?.data?.sdocumentPreparation);
                } else {
                    handlViewClose();
                }
                setError("");
            } else {
                setError("Please Enter OTP");
            }
        } catch (err) {
            if (!err?.response?.data?.success) {
                setError(err?.response?.data?.message)
            }

            console.log(err, 'err')
        }
    };
    const verifyValidation = async () => {
        try {
            if (dob != "" || mobile != "") {
                let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL_VALIDATION}`, {
                    dateofbirth: String(dob),
                    mobile: String(mobile),
                    companyname: documentData?.data?.sdocumentPreparation?.person,
                });
                if (response?.data?.success == true) {
                    handleCloseValidation();
                    const canvas = document.getElementById('confettiCanvas');
                    const myConfetti = confetti.create(canvas, { resize: true });
                    // Trigger the confetti effect
                    myConfetti({
                        particleCount: 360,
                        spread: 180,
                        origin: { y: 0.8 }
                    });
                    setOpenGreetDialog(true)
                    getApprovalDocument(documentData?.data?.sdocumentPreparation);
                } else {
                    handleCloseValidation();
                    setMobile("");
                    setDob("");
                    setErrorValidation("");
                }
            }
        } catch (err) {
            const error = err?.response?.data?.message
            setErrorValidation(error)
            setMobile("");
            setDob("");
        }
    };
    const getApprovalDocument = async (data) => {
        try {

            await downloadPdfTesdtTable(documentData, signature, data)
            setTimeout(() => {
                setOpenGreetDialog(false);
                window.location.href = `${BASE_URL}/dashboard`;
            }, 3000);

        } catch (err) { console.log(err, 'err') }
    };
    const downloadPdfTesdtTable = async (response, documentTemp, dataDetails) => {
        console.log(response, documentTemp, 'response, documentTemp')
        const pdfElement = document.createElement("div");

        pdfElement.innerHTML = documentTemp;
        // Add custom styles to the PDF content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
         .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
         .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
         .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
         .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
         .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
         .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
         .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
         .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
         .ql-align-right { text-align: right; } 
         .ql-align-left { text-align: left; } 
         .ql-align-center { text-align: center; } 
         .ql-align-justify { text-align: justify; } 
       `;

        pdfElement.appendChild(styleElement);

        // pdfElement.appendChild(styleElement);
        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // Add header
                doc.setFontSize(12);

                if (userLoginStatus) {
                    const infoText = `${documentData?.data?.sdocumentPreparation?.person} | ${userLoginStatus?.localip} | ${userLoginStatus?.hostname} | ${moment().format("DD-MM-YYYY hh:mm:ss a")}`;
                    doc.setFontSize(7);
                    doc.setTextColor(0, 0, 0);
                    const textWidth = doc.getTextWidth(infoText);
                    const newX = pageWidth - margin - textWidth - 5;
                    doc.text(infoText, newX, 5);
                }
                // document.body.insertAdjacentHTML('beforeend', infoDiv);
                const headerImgWidth = pageWidth * 0.95; // Adjust as needed
                const headerImgHeight = pageHeight * 0.09;// Adjust as needed
                const headerX = 5; // Start from the left
                const headerY = 3.5; // Start from the top

                {
                    documentData?.data?.sdocumentPreparation?.printoptions === "With Letter Head" &&
                        doc.addImage(
                            response.data.sdocumentPreparation.head,
                            'JPEG',
                            headerX,
                            headerY,
                            headerImgWidth,
                            headerImgHeight,
                            '',
                            'FAST',
                            0.1
                        )
                }

                const imgWidth = pageWidth * 0.50; // 75% of page width
                const imgHeight = pageHeight * 0.25; // 50% of page height
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2 - 20;
                doc.setFillColor(0, 0, 0, 0.1);
                if (watermarkImage) {
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                }

                // Add footer
                doc.setFontSize(10);
                // doc.text(`Page ${ i } of ${ totalPages } `, pageWidth / 2, pageHeight - 10, { align: 'center' });
                // Add footer image stretched to page width
                const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
                const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
                const footerX = 5; // Start from the left
                const footerY = (pageHeight * 1) - footerImgHeight - 5;
                {
                    documentData?.data?.sdocumentPreparation?.printoptions === "With Letter Head" && doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                }
                if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
                    const textY = footerY - 3;
                    doc.text(`Page ${i} of ${totalPages} `, pageWidth / 2, textY, { align: 'center' });
                } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                    const textY = footerY - 3;
                    doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                }
                // Add QR code and statement only on the last page

                if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
                    if (i === totalPages) {
                        // Add QR code in the left corner
                        const qrCodeWidth = 25; // Adjust as needed
                        const qrCodeHeight = 25; // Adjust as needed
                        const qrCodeX = footerX; // Left corner
                        const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                        doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                        // Add statement on the right of the QR code
                        const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                        const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                        const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                        const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                        // Add statements
                        const statementText1 = '1. Scan to verify the authenticity of this document.';
                        const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")} `;
                        const statementText3 = templateMail ? `3. For questions, contact us at ${templateMail}` : "";


                        doc.setFontSize(12);
                        doc.text(statementText1, statementX, statementY1);
                        doc.text(statementText2, statementX, statementY2);
                        doc.text(statementText3, statementX, statementY3);
                        // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                    }
                }
            }
        };

        let margins = [15, 20, 15, 20];
        if (documentData?.data?.sdocumentPreparation?.printoptions === "With Letter Head") {
            let { pagesize, head, foot } = response.data.sdocumentPreparation || {};

            if (pagesize === "A3") {
                if (head !== "" && foot !== "") {
                    margins = [45, 15, 45, 15];
                } else if (head === "" && foot !== "") {
                    margins = [20, 15, 45, 15];
                } else if (head !== "" && foot === "") {
                    margins = [45, 15, 20, 15];
                } else {
                    margins = [20, 15, 20, 15];
                }
            } else {
                if (head !== "" && foot !== "") {
                    margins = [30, 15, 45, 15];
                } else if (head === "" && foot !== "") {
                    margins = [15, 15, 45, 15];
                } else if (head !== "" && foot === "") {
                    margins = [45, 15, 15, 15];
                } else {
                    margins = [15, 15, 15, 15];
                }
            }
        }

        // Convert the HTML content to PDF
        html2pdf()
            .from(pdfElement)
            .set({
                margin: margins,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: "mm",
                    format: [
                        parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                        parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                    ],
                    orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                },
                lineHeight: 0, // Increased line spacing
                fontSize: 12,
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }).toPdf().get('pdf').then((pdf) => {
                // Convert the watermark image to a base64 string
                const img = new Image();

                if (response?.data?.sdocumentPreparation?.watermark) {
                    img.src = response?.data?.sdocumentPreparation?.watermark;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.globalAlpha = 0.1;
                        ctx.drawImage(img, 0, 0);
                        const watermarkImage = canvas.toDataURL('image/png');

                        // Add QR code image
                        if (response.data.sdocumentPreparation?.qrcode !== "") {
                            const qrImg = new Image();
                            qrImg.src = response.data.sdocumentPreparation?.qrcode;

                            qrImg.onload = async () => {
                                const qrCanvas = document.createElement('canvas');
                                qrCanvas.width = qrImg.width;
                                qrCanvas.height = qrImg.height;
                                const qrCtx = qrCanvas.getContext('2d');
                                qrCtx.drawImage(qrImg, 0, 0);
                                const qrCodeImage = qrCanvas.toDataURL('image/png');
                                // Add page numbers and watermark to each page
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                                console.log()
                                // pdf.output('blob').then(async(pdfBlob) => {
                                const pdfBlob = pdf.output('blob', { type: 'application/pdf' });
                                const formData = new FormData();
                                formData.append("pdfFile", pdfBlob, `${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                                formData.append("documentname", response.data.sdocumentPreparation?.documentname);
                                formData.append("username", response.data.sdocumentPreparation?.person);
                                formData.append("id", response.data.sdocumentPreparation?._id);
                                await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${dataDetails?._id}`, {
                                    approval: "approved",
                                    approveddate: new Date(),
                                    approvedby: dataDetails?.person,
                                    document: signature
                                });
                                await axios.post(SERVICE.EMPLOYEE_APPROVAL_FORMDATA, formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data"
                                    }
                                }).then(response => {
                                    console.log("PDF uploaded successfully:");
                                }).catch(error => {
                                    console.error("Error uploading PDF:", error);
                                });

                                // Save the PDF
                                // pdf.save(`${ response.data.sdocumentPreparation?.template }_${ response.data.sdocumentPreparation?.person }.pdf`);
                            };
                        }
                    };
                } else {
                    if (response.data.sdocumentPreparation?.qrcode !== "") {
                        const qrImg = new Image();
                        qrImg.src = response.data.sdocumentPreparation?.qrcode;
                        qrImg.onload = async () => {
                            const qrCanvas = document.createElement('canvas');
                            qrCanvas.width = qrImg.width;
                            qrCanvas.height = qrImg.height;
                            const qrCtx = qrCanvas.getContext('2d');
                            qrCtx.drawImage(qrImg, 0, 0);
                            const qrCodeImage = qrCanvas.toDataURL('image/png');
                            // Add page numbers and watermark to each page
                            addPageNumbersAndHeadersFooters(pdf, "", qrCodeImage);
                            console.log()
                            // pdf.output('blob').then(async(pdfBlob) => {
                            const pdfBlob = pdf.output('blob', { type: 'application/pdf' });
                            const formData = new FormData();
                            formData.append("pdfFile", pdfBlob, `${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                            formData.append("documentname", response.data.sdocumentPreparation?.documentname);
                            formData.append("username", response.data.sdocumentPreparation?.person);
                            formData.append("id", response.data.sdocumentPreparation?._id);

                            await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${dataDetails?._id}`, {
                                approval: "approved",
                                approveddate: new Date(),
                                approvedby: dataDetails?.person,
                                document: signature
                            });
                            await axios.post(SERVICE.EMPLOYEE_APPROVAL_FORMDATA, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                            }).then(response => {
                                console.log("PDF uploaded successfully:");
                            }).catch(error => {
                                console.error("Error uploading PDF:", error);
                            });

                            // Save the PDF
                            // pdf.save(`${ response.data.sdocumentPreparation?.template }_${ response.data.sdocumentPreparation?.person }.pdf`);
                        };
                    }
                }

            });
    };


    useEffect(() => {
        // Disable right-click
        const handleRightClick = (event) => {
            event.preventDefault();
        };

        // Disable Ctrl + P (print)
        const handlePrint = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
                event.preventDefault();
                alert('Printing is disabled on this page.');
            }
        };

        // Disable copy and paste
        const handleCopy = (event) => {
            event.preventDefault();
            alert('Copying is disabled on this page.');
        };

        const handlePaste = (event) => {
            event.preventDefault();
            alert('Pasting is disabled on this page.');
        };

        // Attach event listeners
        document.addEventListener('contextmenu', handleRightClick); // Disable right-click
        document.addEventListener('keydown', handlePrint); // Disable print (Ctrl + P)
        document.addEventListener('copy', handleCopy); // Disable copy
        document.addEventListener('paste', handlePaste); // Disable paste

        // Cleanup event listeners when the component is unmounted
        return () => {
            document.removeEventListener('contextmenu', handleRightClick);
            document.removeEventListener('keydown', handlePrint);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <>
            <div style={{ zIndex: 20 }}>
                <div
                    style={{
                        textAlign: "center",
                        paddingTop: "50px",
                    }}
                >
                    <div
                        style={{
                            padding: "10px",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            backgroundColor: "black",
                            zIndex: 1,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={hilifelogo}
                                alt="Logo"
                                style={{ height: "50px", width: "auto", marginRight: "10px" }}
                            />
                            <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>
                                HIHRMS
                            </h2>
                        </div>
                    </div>

                </div>
                <div style={{ marginTop: "60px", display: "flex", justifyContent: "flex-end", padding: "10px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.href = `${BASE_URL}/dashboard`
                        }
                    >
                        Back
                    </Button >
                </div >
                <br />

                {
                    (documentData && documentData?.data?.sdocumentPreparation) ?
                        <Box>
                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",  // Left align content
                                    justifyContent: "center",
                                    minHeight: "90vh",
                                    padding: "40px",
                                    marginTop: "60px",
                                    marginBottom: "60px",
                                    background: "linear-gradient(135deg, #f3f3f3 0%, #e8e8e8 100%)",
                                    borderRadius: "20px",
                                    boxShadow: "0 10px 30px #336aeb",
                                    border: "2px solid rgb(14, 15, 15)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                                    },
                                }}
                            >
                                <br />
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                {/* {console.log(htmlContent , 'htmlContent')} */}
                                <br />
                                <br />
                                {termsAndConditions?.length > 0 &&
                                    <>
                                        <Typography
                                            variant="h4"
                                            gutterBottom
                                            sx={{ textAlign: "left", fontWeight: "bold", width: "100%" }}
                                        >
                                            Terms and Conditions
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            paragraph
                                            sx={{ textAlign: "left", width: "100%", lineHeight: "0.2" }} // Set lineHeight for better control
                                        >
                                            Please read and accept the following terms and conditions to proceed.
                                        </Typography>

                                        {termsAndConditions?.map((condition) => (
                                            <FormControlLabel
                                                key={condition.details}
                                                control={
                                                    <Checkbox
                                                        checked={checkedConditions[condition.details] || false}
                                                        onChange={(event) => handleCheckboxChange(event, condition)}
                                                        name={condition.details}
                                                        disabled={condition.viewmore && condition.description && !acceptedConditions[condition.details]}
                                                    />
                                                }
                                                label={
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <Typography sx={{ lineHeight: "1.2", marginBottom: "0px" }}>
                                                            {condition.details}
                                                        </Typography>
                                                        {condition.viewmore && condition.description && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => {
                                                                    setDialogContent({
                                                                        title: condition.details,
                                                                        description: condition.description,
                                                                        key: condition.details,
                                                                    });
                                                                    setOpenDialogTermsConditions(true);
                                                                }}
                                                                className="ui-btn"
                                                                sx={{ marginLeft: "16px" }}
                                                            >
                                                                <span>See More</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                }
                                                sx={{ display: "flex", alignItems: "center" }}
                                            />
                                        ))
                                        }
                                    </>
                                }


                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={termsAndConditions?.length > 0 ? !allChecked : false}
                                    onClick={checkOtp}
                                    fullWidth
                                    className="ui-btn"
                                >
                                    <span>Accept</span>
                                </Button>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginTop: "30px",
                                        textAlign: "center",
                                        fontSize: "0.85rem",
                                        fontWeight: "bold",
                                        color: "red",
                                        borderTop: "1px solid #ccc",
                                        paddingTop: "10px",
                                        width: "100%",
                                    }}
                                >
                                    ⚠️ Property of TTS Business Services. Unauthorized sharing is strictly prohibited.
                                </Typography>

                            </Container>
                            <Dialog
                                open={openDialog}
                                onClose={() => setOpenDialog(false)}
                                sx={{
                                    '& .MuiDialog-paper': {
                                        borderRadius: '20px',
                                        padding: '20px',
                                        minWidth: '400px',
                                        background: '#1E1E2E',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                <DialogTitle>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <WarningAmberIcon sx={{ color: "#FAC921", fontSize: 32 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FAC921' }}>
                                            Are you sure?
                                        </Typography>
                                    </Stack>
                                </DialogTitle>

                                <DialogContent>
                                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                        This action cannot be undone. Please confirm your decision.
                                    </Typography>
                                </DialogContent>

                                <DialogActions sx={{ justifyContent: "space-between", paddingX: 3 }}>
                                    <Button
                                        onClick={() => setOpenDialog(false)}
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            borderRadius: '8px',
                                            paddingX: '20px',
                                            textTransform: 'none',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        onClick={handleConfirmSubmit}
                                        variant="contained"
                                        color="primary"
                                        autoFocus
                                        sx={{
                                            borderRadius: '8px',
                                            paddingX: '20px',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            backgroundColor: '#1976D2',
                                            '&:hover': {
                                                backgroundColor: '#135BA1',
                                            }
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={openGreetDialog}
                                onClose={() => setOpenGreetDialog(false)}
                                sx={{
                                    '& .MuiDialog-paper': {
                                        borderRadius: '20px',
                                        padding: '20px',
                                        minWidth: '400px',
                                        background: '#1E1E2E',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                <DialogTitle>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 32 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                                            Thank You!
                                        </Typography>
                                    </Stack>
                                </DialogTitle>

                                <DialogContent>
                                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                        We appreciate your approval. Your support means a lot to us!
                                    </Typography>
                                </DialogContent>
                            </Dialog>
                            <Dialog
                                open={openOTPView}
                                onClose={handlViewCloseOTP}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                maxWidth="xs"
                                sx={{
                                    '& .MuiDialog-paper': {
                                        borderRadius: '20px',
                                        padding: '30px',
                                        minWidth: '400px',
                                        background: '#1E1E2E',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                <DialogContent>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <PinIcon
                                                sx={{
                                                    fontSize: "100px",
                                                    color: "#FAC921",
                                                    textAlign: "center",
                                                    animation: "pulse 1.5s infinite",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <FormControl sx={{ width: "100%", maxWidth: "300px", textAlign: "center" }}>
                                                <Typography variant="h6" fontWeight="bold" color="#FAC921" gutterBottom>
                                                    Enter Two Factor OTP
                                                    <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => {
                                                        const enteredValue = e.target.value.replace(/\D/, "");
                                                        if (/^\d{0,6}$/.test(enteredValue)) {
                                                            setOtp(enteredValue);
                                                        }
                                                    }}
                                                    inputProps={{
                                                        maxLength: 6,
                                                    }}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        backgroundColor: "#fff",
                                                        "& .MuiOutlinedInput-input": {
                                                            fontSize: "15px",
                                                            textAlign: "center",
                                                            letterSpacing: "5px",
                                                        },
                                                    }}
                                                />
                                                {error && (
                                                    <Typography sx={{ color: "red", fontSize: "0.9rem", marginTop: "10px" }}>
                                                        {error}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions sx={{ backgroundColor: "#2A2A3B", borderRadius: "0 0 20px 20px" }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            padding: "10px 30px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            backgroundColor: "#1976D2",
                                            '&:hover': {
                                                backgroundColor: "#135BA1",
                                            }
                                        }}
                                        onClick={verifyOtp}
                                    >
                                        Verify
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handlViewCloseOTP();
                                            setOtp("");
                                            setError("");
                                        }}
                                        sx={{
                                            padding: "10px 30px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            color: "#FFFFFF",
                                            border: "1px solid #FAC921",
                                            '&:hover': {
                                                backgroundColor: "#FAC921",
                                                color: "#000",
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={openValidation}
                                onClose={handleCloseValidation}
                                maxWidth="xs"
                                sx={{
                                    '& .MuiDialog-paper': {
                                        borderRadius: "20px",
                                        padding: "30px",
                                        minWidth: "400px",
                                        background: "#1E1E2E",
                                        color: "#FFFFFF",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                    },
                                }}
                            >
                                <DialogContent>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <ShieldIcon
                                                sx={{
                                                    fontSize: "80px",
                                                    color: "#FAC921",
                                                    animation: "pulse 1.5s infinite",
                                                }}
                                            />                                </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <FormControl sx={{ width: "100%", maxWidth: "300px", textAlign: "center" }}>
                                                <Typography variant="h8" fontWeight="bold" color="#FAC921" gutterBottom>
                                                    Enter Mobile Number<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    type="text"
                                                    placeholder="Enter Mobile Number"
                                                    value={mobile}
                                                    onChange={handleMobileChange}
                                                    inputProps={{
                                                        maxLength: 10,
                                                    }}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        backgroundColor: "#fff",
                                                        "& .MuiOutlinedInput-input": {
                                                            fontSize: "15px",
                                                            textAlign: "center",
                                                            letterSpacing: "2px",
                                                        },
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <FormControl sx={{ width: "100%", maxWidth: "300px", textAlign: "center" }}>
                                                <Typography variant="h8" fontWeight="bold" color="#FAC921" gutterBottom>
                                                    Enter Date of Birth<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    type="date"
                                                    value={dob}
                                                    onChange={handleDOBChange}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        backgroundColor: "#fff",
                                                        "& .MuiOutlinedInput-input": {
                                                            fontSize: "15px",
                                                            textAlign: "center",
                                                        },
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {errorValidation && (
                                            <Typography sx={{ color: "red", fontSize: "0.9rem", marginTop: "10px" }}>
                                                {errorValidation}
                                            </Typography>
                                        )}
                                    </Grid>
                                </DialogContent>
                                <DialogActions sx={{ backgroundColor: "#2A2A3B", borderRadius: "0 0 20px 20px" }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            padding: "10px 30px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            backgroundColor: "#1976D2",
                                            "&:hover": {
                                                backgroundColor: "#135BA1",
                                            },
                                        }}
                                        onClick={validateAndSubmit}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleCloseValidation();
                                            setMobile("");
                                            setDob("");
                                            setErrorValidation("");
                                        }}
                                        sx={{
                                            padding: "10px 30px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            color: "#FFFFFF",
                                            border: "1px solid #FAC921",
                                            "&:hover": {
                                                backgroundColor: "#FAC921",
                                                color: "#000",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={openDialogTermsConditions}
                                onClose={handleDialogClose} // Do nothing on close
                                sx={{
                                    "& .MuiDialog-paper": {
                                        borderRadius: "20px",
                                        padding: "20px",
                                        minWidth: "400px",
                                        background: "#1E1E2E",
                                        color: "#FFFFFF",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                    },
                                }}
                            >
                                <DialogTitle>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <DescriptionIcon sx={{ color: "#FAC921", fontSize: 32 }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FAC921" }}>
                                            {dialogContent.title}
                                        </Typography>
                                    </Stack>
                                </DialogTitle>

                                <DialogContent>
                                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                        {dialogContent.description}
                                    </Typography>
                                </DialogContent>
                                <DialogActions sx={{ justifyContent: "center", paddingX: 3 }}>
                                    <Button
                                        onClick={handleAcceptDialog}
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: "8px",
                                            paddingX: "20px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            backgroundColor: "#1976D2",
                                            "&:hover": {
                                                backgroundColor: "#135BA1",
                                            },
                                        }}
                                    >
                                        Accept
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                        :
                        <div class="progress" style={{ zIndex: 20 }}><div class="bar"></div></div>
                }

            </div >
        </>
    );
}

export default EmployeeDocumentsApprovalPage;