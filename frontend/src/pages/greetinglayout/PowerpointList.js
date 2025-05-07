import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { v4 as uuidv4 } from "uuid";
import AlertDialog from "../../components/Alert.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle.js";
import { menuItems } from "../../components/menuItemsList";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PptxGenJS from "pptxgenjs";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';

function PowerpointList() {

    const navigate = useNavigate();

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };

    let exportColumnNames = [
        "Theme Name",
        "Size",
    ];
    let exportRowValues = [
        "title",
        "size",
    ];


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [themeLayout, setThemeLayout] = useState([]);
    const { isUserRoleCompare, pageName,
        setPageName, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        serialNumber: true,
        categoryname: true,
        subcategoryname: true,
        documentname: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [themeLayout]);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Power Point List"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
        fetchThemeLayouts();
    }, []);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const getStylesByLayout = (slidesdata, index, allData) => {
     
        switch (slidesdata?.slides[index]?.layout) {
            case "Title Slide": // Centered title with smaller subtitle
                return {
                    width: "750px",
                    marginTop: slidesdata?.isheadertext ||
                        slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ||
                        slidesdata?.headertext !== "" ||
                        slidesdata?.footertext !== "" ||
                        slidesdata?.isheaderfootercolor ||
                        slidesdata?.headerfootercolor !== "" ? "38px" : "38px",
                    minHeight: "230px",
                    fontSize: slidesdata?.slides[index]?.titleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.titleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.titleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.titleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.titleFontSize === 20 ? "9px" : "12px",
                    fontWeight: slidesdata?.slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slidesdata?.slides[index]?.titleFont ? slidesdata?.slides[index]?.titleFont : "Arial",
                    textAlign: slidesdata?.slides[index]?.alignitemstitle || "center",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    padding: "10px",

                }
            case "Title And Content": // Large title, no subtitle
                return {
                    width: "750px",
                    marginTop: slidesdata?.isheadertext ||
                        slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ||
                        slidesdata?.headertext !== "" ||
                        slidesdata?.footertext !== "" ||
                        slidesdata?.isheaderfootercolor ||
                        slidesdata?.headerfootercolor !== "" ? "38px" : "38px",
                    minHeight: "130px",
                    fontSize: slidesdata?.slides[index]?.titleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.titleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.titleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.titleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.titleFontSize === 20 ? "9px" : "12px",
                    fontWeight: slidesdata?.slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slidesdata?.slides[index]?.titleFont ? slidesdata?.slides[index]?.titleFont : "Arial",
                    textAlign: slidesdata?.slides[index]?.alignitemstitle || "center",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px",
                    padding: "10px",

                };
            case "Section Header": // Title centered, subtitle split into two columns
                return {
                    width: "750px",
                    marginTop: slidesdata?.isheadertext ||
                        slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ||
                        slidesdata?.headertext !== "" ||
                        slidesdata?.footertext !== "" ||
                        slidesdata?.isheaderfootercolor ||
                        slidesdata?.headerfootercolor !== "" ? "38px"  : "38px",
                    minHeight: "250px",
                    fontSize: slidesdata?.slides[index]?.titleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.titleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.titleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.titleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.titleFontSize === 20 ? "9px" : "12px", fontWeight: slidesdata?.slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slidesdata?.slides[index]?.titleFont ? slidesdata?.slides[index]?.titleFont : "Arial",
                    textAlign: slidesdata?.slides[index]?.alignitemstitle || "center",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    padding: "10px",
                };
            case "Two Content": // Title centered, subtitle split for comparison
                return {

                    width: "750px",
                    marginTop: slidesdata?.isheadertext ||
                        slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ||
                        slidesdata?.headertext !== "" ||
                        slidesdata?.footertext !== "" ||
                        slidesdata?.isheaderfootercolor ||
                        slidesdata?.headerfootercolor !== "" ? "38px" : "38px",
                    minHeight: "150px",
                    fontSize: slidesdata?.slides[index]?.titleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.titleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.titleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.titleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.titleFontSize === 20 ? "9px" : "12px",
                    // fontSize: slidesdata?.slides[index]?.titleFontSize || 12,
                    fontWeight: slidesdata?.slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slidesdata?.slides[index]?.titleFont ? slidesdata?.slides[index]?.titleFont : "Arial",
                    textAlign: slidesdata?.slides[index]?.alignitemstitle || "center",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px",
                    padding: "10px",


                };
            case "Title Only": // Title above, subtitle aligned left
                const slide = slidesdata?.slides?.[index] || {};
                return {
                    width: "750px",
                    marginTop: slidesdata?.isheadertext ||
                        slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ||
                        (slidesdata?.headertext?.trim() || slidesdata?.footertext?.trim() || slidesdata?.isheaderfootercolor || slidesdata?.headerfootercolor?.trim())
                        ? "38px" 
                        : "38px",
                    minHeight: "150px",
                    fontSize: slide?.titleFontSize === 12 ? "6px" : slide?.titleFontSize === 14 ? "7px" : slide?.titleFontSize === 16 ? "8px" : slide?.titleFontSize === 18 ? "9px" : slide?.titleFontSize === 20 ? "9px" : "12px",
                    fontWeight: slide?.istitleBold ? "bold" : "normal",
                    fontStyle: slide?.istitleitalic ? "italic" : "normal",
                    textDecoration: slide?.istitleunderline ? "underline" : "none",
                    fontFamily: slide?.titleFont || "Arial",
                    textAlign: slide?.alignitemstitle || "center",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px",
                    padding: "10px",

                };
            case "Blank": // No formatting
                return {
                    textAlign: "center",
                    width: "750px",
                };
            default: // Default fallback
                return {
                    textAlign: "center",
                    width: "750px",
                };
        }
    };

    const getStylesByLayoutSubtitle = (slidesdata, index, type) => {
        switch (slidesdata?.slides[index]?.layout) {
            case "Title Slide": // Centered title with smaller subtitle
                return {
                    width: "750px",
                    minHeight: "160px",
                    fontSize: slidesdata?.slides[index]?.subtitleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.subtitleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.subtitleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.subtitleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.subtitleFontSize === 20 ? "9px" : "12px",
                    textAlign: slidesdata?.slides[index]?.alignitemssubtitle || "center",
                    fontWeight: slidesdata?.slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slidesdata?.slides[index]?.subtitleFont ? slidesdata?.slides[index]?.subtitleFont : 'Arial',
                    marginBottom: slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ? "35px" : "45px",
                    overflow: "hidden",
                    padding: "10px",
                };
            case "Title And Content": // Large title, no subtitle
                return {
                    width: "750px",
                    minHeight: "252px",
                    fontSize: slidesdata?.slides[index]?.subtitleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.subtitleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.subtitleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.subtitleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.subtitleFontSize === 20 ? "9px" : "12px",
                    textAlign: slidesdata?.slides[index]?.alignitemssubtitle || "center",
                    fontWeight: slidesdata?.slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slidesdata?.slides[index]?.subtitleFont ? slidesdata?.slides[index]?.subtitleFont : 'Arial',
                    marginBottom: slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ? "35px" : "35px",
                    overflow: "hidden",
                    padding: "10px",
                };
            case "Section Header": // Title centered, subtitle split into two columns
                return {
                    width: "750px",
                    minHeight: "160px",
                    fontSize: slidesdata?.slides[index]?.subtitleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.subtitleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.subtitleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.subtitleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.subtitleFontSize === 20 ? "9px" : "12px",
                    textAlign: slidesdata?.slides[index]?.alignitemssubtitle || "center",
                    fontWeight: slidesdata?.slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slidesdata?.slides[index]?.subtitleFont ? slidesdata?.slides[index]?.subtitleFont : 'Arial',
                    marginBottom: slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ? "35px" : "35px",
                    overflow: "hidden",
                    padding: "10px",

                };
            case "Two Content": // Title centered, subtitle split for comparison
                return {
                    width: "370px",
                    minHeight: "250px",
                    fontSize: slidesdata?.slides[index]?.subtitleFontSize === 12 ? "6px" : slidesdata?.slides[index]?.subtitleFontSize === 14 ? "7px" : slidesdata?.slides[index]?.subtitleFontSize === 16 ? "8px" : slidesdata?.slides[index]?.subtitleFontSize === 18 ? "9px" : slidesdata?.slides[index]?.subtitleFontSize === 20 ? "9px" : "12px",
                    textAlign: slidesdata?.slides[index]?.alignitemssubtitle || "center",
                    fontWeight: slidesdata?.slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slidesdata?.slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slidesdata?.slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slidesdata?.slides[index]?.subtitleFont ? slidesdata?.slides[index]?.subtitleFont : 'Arial',
                    marginBottom: slidesdata?.isfootertext ||
                        slidesdata?.isSlidenumber ? "35px" : "35px",
                    overflow: "hidden",
                    padding: "5px",
                };
            case "content-with-caption": // Title above, subtitle aligned left
                return {
                    textAlign: type === "title" ? "center" : "left",
                    width: type === "title" ? "100%" : "80%",
                    margin: type === "title" ? "auto" : "10px auto",
                    fontSize: type === "title" ? "28px" : "18px",
                };
            case "Blank": // No formatting
                return {
                    textAlign: "center",
                    width: "750px",
                };
            default: // Default fallback
                return {
                    textAlign: "center",
                    width: "750px",
                };
        }
    };

    const downloadPPT = (slidedata, headerfooter, alldata) => {

        const cleanHTMLContent = (content) => {
            const decodedContent = content
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'");

            return decodedContent.replace(/<\/?[^>]+(>|$)/g, "");
        };

        let htmlContent = `<html><head><title>Presentation</title></head><body style="display:flex; flex-direction: column; align-items: center;">`;



        slidedata?.forEach((slide, slideIndex) => {

            const convertStyleObjectToString = (styleObj) => {
                return Object.entries(styleObj)
                    .map(([key, value]) => {
                        // Convert camelCase to kebab-case (e.g., marginTop -> margin-top)
                        const formattedKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

                        // Ensure that numeric values have 'px' as unit, if needed
                        const formattedValue = typeof value === 'number' ? `${value}px` : value;

                        return `${formattedKey}: ${formattedValue};`;
                    })
                    .join(' ');
            };

            const data = getStylesByLayout(alldata, slideIndex)
            const datasubtitle = getStylesByLayoutSubtitle(alldata, slideIndex)

            const datastyleString = convertStyleObjectToString(data);
            const datasubtitlestyleString = convertStyleObjectToString(datasubtitle);

            // Apply a special style for the first slide
            const slideStyle = slideIndex === 0 ? `
                    height: 520px;
                    width: 960px;
                    position: relative;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    min-height: 100%;
                    box-sizing: border-box;
                    margin-bottom: 50px;
                    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    overflow: hidden;
                    // Special background for first slide
                    background-color: #f9f9f9;  // Example custom background color
                ` : `
                    height: 520px;
                    width: 960px;
                    position: relative;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    min-height: 100%;
                    box-sizing: border-box;
                    margin-bottom: 50px;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow: hidden;
                    justify-content: flex-start;
                `;

            htmlContent += `<div class="slide" style="${slideStyle}">`;

            if (
                headerfooter.isheadertext) {

                // Header section
                const headerContent = headerfooter.isheadertext ? headerfooter.headertext : "";
                const headerStyle = `
                width: 99%;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                padding: 10px 5px;
                display: flex;
                justify-content: space-between;
                align-items: center; /* Use align-items instead of align-content */
                color: ${headerfooter.isheaderfootercolor ? "white" : "black"};
                background-color: ${headerfooter.isheaderfootercolor ? headerfooter.headerfootercolor : "none"};
              `;

                const logoStyle = `
                width: 90px;
                object-fit: cover;
                margin-left: 10px;
                border-radius: 10px;
              `;
                // htmlContent += `<div class="header" style="${headerStyle}">${cleanHTMLContent(headerContent)}</div>`;

                htmlContent += `<div class="header" style="${headerStyle}">
                                    <img src="${headerfooter?.companylogo}" style="${logoStyle} alt="Logo" ">
                                    <p style="margin: 0; padding-right: 10px; text-align: right; font-size: 22px; font-family: Arial;">${cleanHTMLContent(headerContent)}</p>
                                </div>`;
            } else {
                const headerContent = headerfooter.isheadertext ? headerfooter.headertext : "";
                const headerStyle = `
                width: 99%;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                padding: 10px 5px;
                display: flex;
                justify-content: space-between;
                align-items: center; /* Use align-items instead of align-content */
                color: ${headerfooter.isheaderfootercolor ? "white" : "black"};
              `;

                const logoStyle = `
                width: 90px;
                object-fit: cover;
                margin-left: 10px;
                border-radius: 10px;
              `;
                // htmlContent += `<div class="header" style="${headerStyle}">${cleanHTMLContent(headerContent)}</div>`;

                htmlContent += `<div class="header" style="${headerStyle}">
                                    <img src="${headerfooter?.companylogo}" style="${logoStyle} alt="Logo" ">
                                </div>`;

            }

            // Title section
            const cleanTitle = slide.title ? cleanHTMLContent(slide.title) : "";

            const titleStyle = `
                    ${datastyleString}
                `;


            htmlContent += `<div class="title" style="${datastyleString};">`;
            htmlContent += `<h1>${cleanTitle}</h1>`;
            htmlContent += `</div>`; // Closing title div



            if (slide.layout === "Two Content") {

                htmlContent += `<div class="twocontent" style="display: flex; justify-content: space-between; gap: 7px;">`;

                // Subtitle section
                const cleanSubtitle = slide.subtitle ? cleanHTMLContent(slide.subtitle) : "";



                htmlContent += `<div class="subtitle" style="${datasubtitlestyleString}">`;
                htmlContent += `<h2>${cleanSubtitle}</h2>`;
                htmlContent += `</div>`; // Closing subtitle div

                // Subtitle section
                const cleanSubtitletwo = slide.subtitletwo ? cleanHTMLContent(slide.subtitletwo) : "";



                htmlContent += `<div class="subtitletwo" style="${datasubtitlestyleString}; text-align: ${slide?.alignitemssubtitletwo ? slide?.alignitemssubtitletwo : "center"};">`;
                htmlContent += `<h2>${cleanSubtitletwo}</h2>`;
                htmlContent += `</div>`; // Closing subtitle div

                htmlContent += `</div>`; // Closing subtitle div


            } else {
                // Subtitle section
                const cleanSubtitle = slide.subtitle ? cleanHTMLContent(slide.subtitle) : "";



                htmlContent += `<div class="subtitle" style="${datasubtitlestyleString}">`;
                htmlContent += `<h2>${cleanSubtitle}</h2>`;
                htmlContent += `</div>`; // Closing subtitle div

            }

            // Images section
            slide.images?.forEach((image) => {
                const imgSrc = typeof image === "string" ? image : image.src;
                if (imgSrc && (imgSrc.startsWith("data:image") || imgSrc.startsWith("http"))) {
                    const scalingFactor = 1; // Adjust if scaling is applied
                    const imageX = (image.xdrag || 0) * scalingFactor + 420; // Adjust for padding
                    const imageY = (image.ydrag || 0) * scalingFactor + 95;
                    const imageWidth = (image.w || 100) * scalingFactor;
                    const imageHeight = (image.h || 100) * scalingFactor;

                    htmlContent += `<img src="${imgSrc}" style="
                            position: absolute;
                            left: ${imageX}px;
                            top: ${imageY}px;
                            width: ${imageWidth}px;
                            height: ${imageHeight}px;
                        ">`;
                }
            });


            // Additional elements (text and shapes)
            slide.elements?.forEach((element) => {
                if (element.type === "text") {
                    const cleanText = element.text ? cleanHTMLContent(element.text) : "";
                    htmlContent += `<p style="position: absolute; left: ${element.position.x || 0}px; top: ${element.position.y || 0}px; font-size: 18px; color: #000000;">${cleanText}</p>`;
                } else if (element.type === "shape") {
                    htmlContent += `<div style="position: absolute; left: ${element.position.x || 0}px; top: ${element.position.y || 0}px; width: ${element.width || 300}px; height: ${element.height || 200}px; background-color: ${element.color || "#0000FF"};"></div>`;
                }
            });


            if (headerfooter?.isfootertext) {

                // Footer section
                const footerContent = headerfooter.isfootertext ? headerfooter.footertext : "";
                const footerStyle = `
                    width: 99.8%;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                   position: absolute;
                   bottom: 0;
                    background-color: ${headerfooter.isheaderfootercolor ? headerfooter.headerfootercolor : "none"}
                    
                    `;

                htmlContent += `
                    <div class="footer" style="${footerStyle}">
                        <p style="margin: 0; color: white; padding-left: 10px; text-align: left; font-family: Arial;">${cleanHTMLContent(footerContent)}</p>
                        <p style="margin: 0; color: white; padding-right: 10px; text-align: right; font-family: Arial;">${headerfooter.isSlidenumber ? slideIndex + 1 : ""}</p>
                    </div>
                `;


                htmlContent += `</div>`; // Closing slide div
            }
            else {

                const footerStyle = `
                    width: 99.8%;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                   position: absolute;
                   bottom: 0;
                    color: ${headerfooter.isheaderfootercolor ? "white" : "black"},

                    `;

                htmlContent += `
                    <div class="footer" style="${footerStyle}">
                        <p style="margin: 0; color: white; padding-left: 10px; text-align: left;"></p>
                        <p style="margin: 0; color: white; padding-right: 10px; text-align: right;"></p>
                    </div>
                `;


                htmlContent += `</div>`; // Closing slide div
            }
        });

        htmlContent += "</body></html>";

        // Open the HTML content in a new browser tab
        const newTab = window.open();
        newTab.document.write(htmlContent);
        newTab.document.close();
    };



    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };


    const rowData = async (id) => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.POWERPOINT_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            fetchThemeLayouts();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };

    //Delete model

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    //get all Asset Variant name.
    const fetchThemeLayouts = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.POWERPOINT}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setThemeLayout(response?.data?.powerpoint)
            setLoader(false);

        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(
                        blob,
                        `Power Point List.png`
                    );
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Power Point List`,
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = themeLayout?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery?.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ")?.toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "categoryname",
            headerName: "Category",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.categoryname,
        },
        {
            field: "subcategoryname",
            headerName: "Sub Category",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.subcategoryname,
        },
        {
            field: "documentname",
            headerName: "Name",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.documentname,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 230,
            hide: !columnVisibility.actions,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epowerpointlist") && (
                        <Link to={`/powerpointlist/${params.row.id}`} target="_blank">
                            <Button
                                sx={userStyle.buttonedit}
                                style={{ minWidth: "0px" }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </Link>
                    )}
                    {isUserRoleCompare?.includes("dpowerpointlist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpowerpointlist") && (
                        <Button
                            sx={userStyle.buttonview}
                            onClick={(e) => {
                                downloadPPT(params.row.slides, params.row, params.row.alldata);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}

                </Grid>
            ),
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item?.categoryname,
            subcategoryname: item?.subcategoryname,
            companylogo: item?.companylogo,

            isheadertext: item.isheadertext,
            isfootertext: item?.isfootertext,
            isSlidenumber: item?.isSlidenumber,
            headertext: item.headertext,
            footertext: item?.footertext,
            isheaderfootercolor: item?.isheaderfootercolor,
            headerfootercolor: item?.headerfootercolor,

            documentname: item?.documentname,
            slides: item?.slides,
            alldata: item
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName?.toLowerCase().includes(searchQueryManage?.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            {" "}
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    return (
        <Box>
            <Headtitle title={"POWER POINT LIST"} />
            <PageHeading
                title="Power Point List"
                modulename="Poster"
                submodulename="Power Point List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpowerpointlist") && (
                <>
                    {loader ? (
                        <Box sx={userStyle.container}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    minHeight: "350px",
                                }}
                            >
                                <ThreeDots
                                    height="80"
                                    width="80"
                                    radius="9"
                                    color="#1976d2"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography sx={userStyle.importheadtext}>
                                    Power Point List
                                </Typography>
                                <Button
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={() => {
                                        navigate("/powerpoint")
                                    }}
                                >
                                    ADD
                                </Button>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSize}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChange}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={themeLayout?.length}>
                                                All
                                            </MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        {isUserRoleCompare?.includes("excelpowerpointlist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("xl");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileExcel />
                                                    &ensp;Export to Excel&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvpowerpointlist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("csv");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileCsv />
                                                    &ensp;Export to CSV&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printpowerpointlist") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfpowerpointlist") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true);
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagepowerpointlist") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>
                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter(
                                        (column) => columnVisibility[column.field]
                                    )}
                                    onSelectionModelChange={handleSelectionChange}
                                    selectionModel={selectedRows}
                                    autoHeight={true}
                                    ref={gridRef}
                                    density="compact"
                                    hideFooter
                                    getRowClassName={getRowClassName}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing{" "}
                                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <FirstPageIcon />
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            sx={userStyle.paginationbtn}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={page === pageNumber ? "active" : ""}
                                            disabled={page === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            <br />
            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={`Power Point List`}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default PowerpointList;