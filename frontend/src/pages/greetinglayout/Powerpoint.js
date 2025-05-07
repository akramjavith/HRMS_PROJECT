import "@blueprintjs/core/lib/css/blueprint.css";
import { Delete, FileDownload, TextFormat } from "@mui/icons-material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import LoadingButton from "@mui/lab/LoadingButton";
import {
    AppBar, Backdrop,
    Box, Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormGroup,
    Grid, Menu, MenuItem,
    OutlinedInput,
    Paper,
    TextField,
    Toolbar, Typography
} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PptxGenJS from "pptxgenjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import 'react-resizable/css/styles.css';
import Selects from "react-select";
import Headtitle from "../../components/Headtitle.js";
import { colourStyles, userStyle } from "../../pageStyle";
//
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DescriptionIcon from '@mui/icons-material/Description';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import SaveIcon from '@mui/icons-material/Save';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CircularProgress from "@mui/material/CircularProgress";
import Slide from '@mui/material/Slide';
import axios from "axios";
import { Rnd } from "react-rnd";
import { Link } from "react-router-dom";
import WebFont from 'webfontloader';
import AlertDialog from "../../components/Alert.js";
import { handleApiError } from "../../components/Errorhandling.js";
import MessageAlert from "../../components/MessageAlert.js";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
import { SERVICE } from "../../services/Baseservice";

const LoadingBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
            open={open}
        >
            <div className="pulsating-circle">
                <CircularProgress color="inherit" className="loading-spinner" />
            </div>
            <Typography
                variant="h6"
                sx={{ marginLeft: 2, color: "#ffffff", fontWeight: "bold" }}
            >
                please wait...
            </Typography>
        </Backdrop>
    );
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Powerpoints = () => {

    const [fileName, setFileName] = useState("")

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch,
    } = useContext(UserRoleAccessContext);

    const { auth } = useContext(AuthContext);

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
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
        fetchCategoryAll()
    };
    const handleEditClose = () => {
        setEditOpen(false);
        setPowerpoint({
            categoryname: "Please Select Category",
            subcategoryname: "Please Select Subcategory",
            documentname: ""
        });
    };

    const [dimensions, setDimensions] = useState([{
        images: [],
    }]);


    const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
    const [categorythemegrouping, setCategorythemegrouping] = useState([])
    const [subcategoryOptEdit, setSubcategoryOptionEdit] = useState([]);

    const fetchCategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_location = await axios.get(`${SERVICE.PPTCATEGORYSUBCATEGORY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            let all_datas = res_location?.data?.pptcategoryAndSubCategory
            setCategorythemegrouping(all_datas)


            setCategoryOptionEdit([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchSubcategoryBasedEdit = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e === data.categoryname;
            });


            setSubcategoryOptionEdit(
                data_set[0]?.subcategoryname?.map((t) => ({
                    label: t,
                    value: t,
                })));

            // setSubcategorynameOptEdit(subcategoryname);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [categoryList, setCategoryList] = useState([]);


    const getCategoryList = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.POWERPOINT}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setCategoryList(response?.data?.powerpoint);

        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };



    const shapeStyles = {
        Circular: {
            borderRadius: '50%',
            width: '30px',
            height: '30px',
        },
        Square: {
            borderRadius: '0%',
            width: '100px',
            height: '60px',
        },
        roundedSquare: {
            borderRadius: '15px',
            width: '100px',
            height: '60px',
        },
        rectangleVertical: {
            borderRadius: '5px',
            width: '100px',
            height: '60px',
        },
        Hexagonal: {
            clipPath: 'polygon(25% 5%, 75% 5%, 95% 50%, 75% 95%, 25% 95%, 5% 50%)',
            width: '100px',
            height: '60px',
        }
    };

    const normalizeShape = (shape) => {
        switch (shape) {
            case "Rectangle":
                return "rectangleVertical";
            case "Rounded Square":
                return "roundedSquare";
            default:
                return shape;  // Direct match for Circular, Square, or Hexagonal
        }
    };

    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayCompanyLogoShapes, setBdayCompanyLogoShapes] = useState("")

    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);

            setBdayCompanyLogo(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.companylogo
            );

            setBdayCompanyLogoShapes(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.companylogoshape
            );

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const companyLogoShape = normalizeShape(bdayCompanyLogoShapes);


    useEffect(() => {
        fetchCategoryAll()
        getCategoryList()
        fetchBdaySetting()
    }, [])



    const slideRefs = useRef([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState([]);
    const [imagePositions, setImagePositions] = useState([]);

    const [powerpoint, setPowerpoint] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        documentname: ""
    });

    const [anchorElLay, setAnchorElLay] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState('Title Slide');



    const [slides, setSlides] = useState([
        {
            title: "",
            subtitle: "",
            images: [],
            istitleBold: false,
            istitleitalic: false,
            istitleunderline: false,
            issubtitleBold: false,
            issubtitleitalic: false,
            issubtitleunderline: false,
            titleFont: "",
            subtitleFont: "",
            istitlecursorposition: 1,
            issubtitlecursorposition: 1,
            titleFontSize: 12,
            subtitleFontSize: 12,

            layout: selectedLayout,
            subtitleFontSizetwo: 12,
            subtitletwo: "",
            subtitleFonttwo: "",
            issubtitleBoldtwo: false,
            issubtitleitalictwo: false,
            issubtitleunderlinetwo: false,
            issubtitlecursorpositiontwo: 1,


            alignitemstitle: "center",
            alignitemssubtitle: "center",
            alignitemssubtitletwo: "center",

        }
    ]);


    const [isHeadeContent, setHeaderContent] = useState(false)

    const [headerfooter, setHeaderfooter] = useState({
        isheadertext: false,
        isfootertext: false,
        isSlidenumber: false,
        headertext: "",
        footertext: "",
        isheaderfootercolor: false,
        headerfootercolor: "",
    })

    const [headerfooterForChoose, setHeaderfooterForChoose] = useState({
        isheadertext: false,
        isfootertext: false,
        isSlidenumber: false,
        headertext: "",
        footertext: "",
        isheaderfootercolor: false,
        headerfootercolor: "",
    })

    const slideRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);

    // Add Slide
    const addSlide = () => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides, {
                title: "",
                subtitle: "",
                images: [],
                istitleBold: false,
                istitleitalic: false,
                istitleunderline: false,
                issubtitleBold: false,
                issubtitleitalic: false,
                issubtitleunderline: false,
                titleFont: "",
                subtitleFont: "",
                subtitleFonttwo: "",
                istitlecursorposition: 1,
                issubtitlecursorposition: 1,
                titleFontSize: 12,
                subtitleFontSize: 12,
                layout: 'Title Slide',
            }];
            slideRefs.current = newSlides.map((_, i) => slideRefs.current[i] || React.createRef());
            return newSlides;
        });
    };

    const handleOpen = (event) => {
        setAnchorElLay(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElLay(null);
    };

    const layouts = [
        { id: 1, mt: 0, titheight: 30, subtitleht: 20, name: 'Title Slide', description: 'Two columns with a header' },
        { id: 2, mt: 0, titheight: 15, subtitleht: 35, name: 'Title And Content', description: 'Single column with footer' },
        { id: 3, mt: 0, titheight: 35, subtitleht: 15, name: 'Section Header', description: 'Three columns evenly spaced' },
        { id: 4, mt: 0, titheight: 15, subtitleht1: 40, subtitleht2: 40, name: 'Two Content', description: 'Centered content layout' },
        { id: 5, mt: 1, titheight: 20, subtitleht: 0, border: "none", name: 'Title Only', description: 'Split screen design' },
        { id: 6, mt: 1, titheight: 20, subtitleht: 30, titsubborder: "none", name: 'Blank', description: 'Responsive grid layout' },
    ];

    const handleSelectLayout = (layout) => {
        setSelectedLayout(layout.name);
        setSlides((prevSlides) => {
            const updatedSlides = [...prevSlides];
            const selectedSlideData = updatedSlides[selectedSlideIndex];

            // Reset slide data
            Object.assign(selectedSlideData, {
                title: "",
                subtitle: "",
                images: [],
                istitleBold: false,
                istitleitalic: false,
                istitleunderline: false,
                issubtitleBold: false,
                issubtitleitalic: false,
                issubtitleunderline: false,
                titleFont: "",
                subtitleFont: "",
                istitlecursorposition: 1,
                issubtitlecursorposition: 1,
                titleFontSize: 12,
                subtitleFontSize: 12,

                layout: layout.name,
                subtitleFontSizetwo: 12,
                subtitletwo: "",
                subtitleFonttwo: "",
                issubtitleBoldtwo: false,
                issubtitleitalictwo: false,
                issubtitleunderlinetwo: false,
                issubtitlecursorpositiontwo: 1,

                alignitemstitle: "center",
                alignitemssubtitle: "center",
                alignitemssubtitletwo: "center",

            });

            return updatedSlides;
        });


        // Manually clear refs for extra safety
        if (titleRef.current) titleRef.current.innerText = "";
        if (subtitleRef.current) subtitleRef.current.innerText = "";
        if (subtitleReftwo.current) subtitleReftwo.current.innerText = "";

        handleClose();
    };


    // const handleSelectLayout = (layout) => {
    //     setSelectedLayout(layout.name);
    //     setSlides((prevSlides) => {
    //         const updatedSlides = [...prevSlides];
    //         const selectedSlideData = updatedSlides[selectedSlideIndex];

    //         // // Add the image with default position and dimensions to the selected slide
    //         // selectedSlideData.layout = layout.name
    //         Object.assign(selectedSlideData, {
    //             layout: layout.name,
    //             title: "",
    //             subtitle: "",
    //             subtitleFont: "",
    //             subtitletwo: "",
    //             titleFont: "",
    //             images: [],
    //             issubtitleBold: false,
    //             issubtitleBoldtwo: false,
    //             issubtitleitalic: false,
    //             issubtitleitalictwo: false,
    //             issubtitleunderline: false,
    //             issubtitleunderlinetwo: false,
    //             istitleBold: false,
    //             istitleitalic: false,
    //             istitleunderline: false,
    //             subtitleFontSize: 16,
    //             titleFontSize: 18,

    //         });
    //         return updatedSlides;
    //     });
    //     handleClose();
    // };

    const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);


    // Delete Slide
    // const deleteSlide = () => {
    //     if (slides.length > 1) {
    //         const updatedSlides = slides.filter((_, index) => index !== selectedSlideIndex);
    //         setSlides(updatedSlides);
    //         slideRefs.current = updatedSlides.map((_, i) => slideRefs.current[i] || React.createRef());
    //     }
    // };


    const deleteSlide = () => {
        if (slides.length > 1) {
            // Create a copy of the slides array to avoid mutating the state directly
            const updatedSlides = [...slides];

            // Remove the slide at index 3 using splice
            updatedSlides.splice(selectedSlideIndex, 1);

            // Update the state with the new slides array
            setSlides(updatedSlides);

            // Update the refs array to match the new slides
            slideRefs.current = updatedSlides.map((_, i) => slideRefs.current[i] || React.createRef());
        }
    };

    const deleteSlideClose = (slideid) => {
        if (slides.length > 1) {
            const updatedSlides = slides.filter((_, index) => index !== slideid);
            setSlides(updatedSlides);
            slideRefs.current = updatedSlides.map((_, i) => slideRefs.current[i] || React.createRef());

            if (slideid === slides.length - 1) {
                setTimeout(() => {
                    handleSlideSelect(updatedSlides.length - 1)
                }, 5)

            }
        }
    };


    const preloadImages = (srcArray) => {
        const promises = srcArray.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        });
        return Promise.all(promises);
    };

    const downloadImage = async () => {
        const slideElement = slideRefs.current[selectedSlideIndex]; // Capture the first slide

        if (!slideElement || !(slideElement instanceof HTMLElement)) {
            console.error("slideRef is not assigned to any valid element.");
            return;
        }

        // Declare variables for the icons outside the try block
        let resizeIcons = [];
        let cancelIcons = [];
        let originalBackgroundColor = "";

        setIsLoading(true);
        try {
            // Select the cancel and resize icons
            resizeIcons = slideElement.querySelectorAll(".resize-icon");
            cancelIcons = slideElement.querySelectorAll(".cancel-icon");

            // Store the original background color and set it to white
            originalBackgroundColor = slideElement.style.backgroundColor;
            slideElement.style.backgroundColor = "#fff";

            // Hide the icons
            resizeIcons.forEach((icon) => (icon.style.display = "none"));
            cancelIcons.forEach((icon) => (icon.style.display = "none"));

            // Capture the canvas
            const canvas = await html2canvas(slideElement, {
                backgroundColor: "#fff", // White background
                scale: 2, // High resolution
                useCORS: true, // Ensure cross-origin images are captured
            });

            // Download the captured image
            const link = document.createElement("a");
            link.download = `${fileName}-Slide${selectedSlideIndex + 1}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            setIsLoading(false);
            console.error("Error capturing the slide:", error);
        } finally {
            setIsLoading(false);
            // Restore the icons after capturing the image
            slideElement.style.backgroundColor = originalBackgroundColor;
            resizeIcons.forEach((icon) => (icon.style.display = ""));
            cancelIcons.forEach((icon) => (icon.style.display = ""));
        }
    };


    const downloadPDF = async () => {
        const pdf = new jsPDF('landscape'); // Set initial PDF orientation to landscape

        for (let i = 0; i < slideRefs.current.length; i++) {
            const slideElement = slideRefs.current[i];

            if (!slideElement || !(slideElement instanceof HTMLElement)) {
                console.error(`slideRef at index ${i} is not assigned to any valid element.`);
                continue;
            }

            let resizeIcons = [];
            let cancelIcons = [];
            let originalBackgroundColor = "";

            setIsLoading(true);
            try {
                resizeIcons = slideElement.querySelectorAll(".resize-icon");
                cancelIcons = slideElement.querySelectorAll(".cancel-icon");

                originalBackgroundColor = slideElement.style.backgroundColor;
                slideElement.style.backgroundColor = "#fff";

                resizeIcons.forEach((icon) => (icon.style.display = "none"));
                cancelIcons.forEach((icon) => (icon.style.display = "none"));

                const images = Array.from(slideElement.querySelectorAll("img")).map(
                    (img) => img.src
                );
                await preloadImages(images);

                const canvas = await html2canvas(slideElement, {
                    backgroundColor: "#fff",
                    scale: 2,
                    useCORS: true,
                });

                const imgData = canvas.toDataURL("image/png");

                // Adjust these values to reduce image size on each page
                const imgWidth = 278; // Decreased width
                let imgHeight = (canvas.height * imgWidth) / canvas.width; // Adjust height proportionally

                // Reduce the image height by 10px
                imgHeight -= 10;

                // Ensure the image height doesn't go negative
                imgHeight = Math.max(imgHeight, 0);

                // Reduce page height by adjusting the yPosition (distance from the top)
                const pageWidth = pdf.internal.pageSize.width;
                const pageHeight = pdf.internal.pageSize.height;

                const xPosition = (pageWidth - imgWidth) / 2; // Horizontal centering
                const yPosition = (pageHeight - imgHeight) / 2 - 10; // Reduce height by 10px

                pdf.addImage(imgData, "PNG", xPosition, yPosition, imgWidth, imgHeight);

                if (i < slideRefs.current.length - 1) {
                    pdf.addPage('landscape'); // Add new page in landscape orientation
                }
            } catch (error) {
                console.error(`Error generating PDF for slide at index ${i}:`, error);
            } finally {
                setIsLoading(false);
                slideElement.style.backgroundColor = originalBackgroundColor;
                resizeIcons.forEach((icon) => (icon.style.display = ""));
                cancelIcons.forEach((icon) => (icon.style.display = ""));
            }
        }

        pdf.save(`${fileName}.pdf`);
    };






    const formatDate = () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear();
        return `${day}-${month}-${year}`;
    };


    const downloadPPT = async () => {

        const pptx = new PptxGenJS();

        const cleanHTMLContent = (content) => {
            const decodedContent = content
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'");
            return decodedContent.replace(/<\/?[^>]+(>|$)/g, "");
        };

        slides?.forEach((slide, slideIndex) => {
            const pptSlide = pptx.addSlide();

            // Add header background
            if (headerfooter?.isheadertext) {
                pptSlide.addShape(pptx.ShapeType.rect, {
                    x: 0,
                    y: 0,
                    w: 10,
                    h: 0.5,
                    fill: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor,
                });

                function addHeaderText(pptSlide, text, options) {
                    const maxLineWidth = 9.5;
                    const words = text.split(" ");
                    let currentLine = "";
                    const lines = [];

                    words.forEach((word) => {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        const testWidth = measureTextWidth(testLine, options.fontSize, options.fontFace);

                        if (testWidth <= maxLineWidth) {
                            currentLine = testLine;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    });

                    if (currentLine) lines.push(currentLine);

                    lines.forEach((line, index) => {
                        pptSlide.addText(line, {
                            ...options,
                            y: options.y + index * 0.4,
                        });
                    });
                }

                function measureTextWidth(text, fontSize, fontFace) {
                    const context = document.createElement("canvas").getContext("2d");
                    context.font = `${fontSize}pt ${fontFace}`;
                    const metrics = context.measureText(text);
                    return metrics.width / 96;
                }

                // Add header text
                addHeaderText(
                    pptSlide,
                    headerfooter?.isheadertext ? headerfooter?.headertext : "",
                    {
                        x: 2.5,
                        y: 0.3,
                        fontSize: 14,
                        fontFace: "Arial",
                        color: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor ? "FFFFFF" : "black",
                        bold: true,
                        align: "right",
                    }
                );
            }

            // Add header logo
            pptSlide.addImage({
                x: 0.1,
                y: 0.05,
                w: 0.9,
                h: 0.4,
                path: bdayCompanyLogo,
                objectFit: "cover",
                rectRadius: 0.1,
            });

            // Layout-based slide content
            const cleanTitle = slide.title ? cleanHTMLContent(slide.title) : "";
            const cleanSubtitle = slide.subtitle ? cleanHTMLContent(slide.subtitle) : "";

            switch (slide.layout) {
                case "Title Slide":
                    pptSlide.addText(cleanTitle, {
                        x: 0.8,
                        y: 1,
                        fontSize: slide.titleFontSize === 12 ? 7 : slide.titleFontSize === 14 ? 9 : slide.titleFontSize === 16 ? 11 : slide.titleFontSize === 18 ? 12 : slide.titleFontSize === 20 ? 13 : 9,
                        fontFace: slide.titleFont || "Arial",
                        bold: slide.istitleBold,
                        italic: slide.istitleitalic,
                        underline: slide.istitleunderline,
                        color: slide.title ? "666666" : "BBBBBB",
                        align: slide.alignitemstitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 2,
                    });
                    pptSlide.addText(cleanSubtitle, {
                        x: 0.8,
                        y: 3,
                        fontSize: slide.subtitleFontSize === 12 ? 7 : slide.subtitleFontSize === 14 ? 9 : slide.subtitleFontSize === 16 ? 11 : slide.subtitleFontSize === 18 ? 12 : slide.subtitleFontSize === 20 ? 13 : 9,
                        fontFace: slide.subtitleFont || "Arial",
                        bold: slide.issubtitleBold,
                        italic: slide.issubtitleitalic,
                        underline: slide.issubtitleunderline,
                        color: slide.subtitle ? "666666" : "BBBBBB",
                        align: slide.alignitemssubtitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 1.2,
                    });
                    break;

                case "Title And Content":
                    pptSlide.addText(cleanTitle, {
                        x: 0.8,
                        y: 0.8,
                        fontSize: slide.titleFontSize === 12 ? 7 : slide.titleFontSize === 14 ? 9 : slide.titleFontSize === 16 ? 11 : slide.titleFontSize === 18 ? 12 : slide.titleFontSize === 20 ? 13 : 9,
                        fontFace: slide.titleFont || "Arial",
                        bold: slide.istitleBold,
                        italic: slide.istitleitalic,
                        underline: slide.istitleunderline,
                        color: slide.title ? "666666" : "BBBBBB",
                        align: slide.alignitemstitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 1,
                    });
                    pptSlide.addText(cleanSubtitle || "Content goes here", {
                        x: 0.8,
                        y: 2,
                        fontSize: slide.subtitleFontSize === 12 ? 7 : slide.subtitleFontSize === 14 ? 9 : slide.subtitleFontSize === 16 ? 11 : slide.subtitleFontSize === 18 ? 12 : slide.subtitleFontSize === 20 ? 13 : 9,
                        fontFace: slide.subtitleFont || "Arial",
                        bold: slide.issubtitleBold,
                        italic: slide.issubtitleitalic,
                        underline: slide.issubtitleunderline,
                        color: slide.subtitle ? "666666" : "BBBBBB",
                        align: slide.alignitemssubtitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 3,
                    });
                    break;

                case "Section Header":
                    pptSlide.addText(cleanTitle, {
                        x: 0.8,
                        y: 0.8,
                        fontSize: slide.titleFontSize === 12 ? 7 : slide.titleFontSize === 14 ? 9 : slide.titleFontSize === 16 ? 11 : slide.titleFontSize === 18 ? 12 : slide.titleFontSize === 20 ? 13 : 9,
                        fontFace: slide.titleFont || "Arial",
                        bold: slide.istitleBold,
                        italic: slide.istitleitalic,
                        underline: slide.istitleunderline,
                        color: slide.title ? "666666" : "BBBBBB",
                        align: slide.alignitemstitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 2.5,
                    });

                    pptSlide.addText(cleanSubtitle || "Content goes here", {
                        x: 0.8,
                        y: 3.4,
                        fontSize: slide.subtitleFontSize === 12 ? 7 : slide.subtitleFontSize === 14 ? 9 : slide.subtitleFontSize === 16 ? 11 : slide.subtitleFontSize === 18 ? 12 : slide.subtitleFontSize === 20 ? 13 : 9,
                        fontFace: slide.subtitleFont || "Arial",
                        bold: slide.issubtitleBold,
                        italic: slide.issubtitleitalic,
                        underline: slide.issubtitleunderline,
                        color: slide.subtitle ? "666666" : "BBBBBB",
                        align: slide.alignitemssubtitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 1.5,
                    });

                    break;

                case "Two Content":
                    pptSlide.addText(cleanTitle, {
                        x: 0.8,
                        y: 0.8,
                        fontSize: slide.titleFontSize === 12 ? 7 : slide.titleFontSize === 14 ? 9 : slide.titleFontSize === 16 ? 11 : slide.titleFontSize === 18 ? 12 : slide.titleFontSize === 20 ? 13 : 9,
                        fontFace: slide.titleFont || "Arial",
                        bold: slide.istitleBold,
                        italic: slide.istitleitalic,
                        underline: slide.istitleunderline,
                        color: slide.title ? "666666" : "BBBBBB",
                        align: slide.alignitemstitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 1,
                    });
                    pptSlide.addText(slide.subtitle || "Left content", {
                        x: 0.8,
                        y: 2,
                        fontSize: slide.subtitleFontSize === 12 ? 7 : slide.subtitleFontSize === 14 ? 9 : slide.subtitleFontSize === 16 ? 11 : slide.subtitleFontSize === 18 ? 12 : slide.subtitleFontSize === 20 ? 13 : 9,
                        fontFace: slide.subtitleFont || "Arial",
                        bold: slide.issubtitleBold,
                        italic: slide.issubtitleitalic,
                        underline: slide.issubtitleunderline,
                        color: slide.subtitle ? "666666" : "BBBBBB",
                        align: slide.alignitemssubtitle || "center",
                        valign: "top",
                        w: 4.2,
                        h: 3,
                    });
                    pptSlide.addText(slide.subtitletwo || "Right content", {
                        x: 5,
                        y: 2,
                        fontSize: slide.subtitleFontSizetwo === 12 ? 7 : slide.subtitleFontSizetwo === 14 ? 9 : slide.subtitleFontSizetwo === 16 ? 11 : slide.subtitleFontSizetwo === 18 ? 12 : slide.subtitleFontSizetwo === 20 ? 13 : 9,
                        fontFace: slide.subtitleFonttwo || "Arial",
                        bold: slide.issubtitleBoldtwo,
                        italic: slide.issubtitleitalictwo,
                        underline: slide.issubtitleunderlinetwo,
                        color: slide.subtitletwo ? "666666" : "BBBBBB",
                        align: slide.alignitemssubtitletwo || "center",
                        valign: "top",
                        w: 4.2,
                        h: 3,
                    });
                    break;

                case "Title Only":
                    pptSlide.addText(cleanTitle, {
                        x: 0.8,
                        y: 1,
                        fontSize: slide.titleFontSize === 12 ? 7 : slide.titleFontSize === 14 ? 9 : slide.titleFontSize === 16 ? 11 : slide.titleFontSize === 18 ? 12 : slide.titleFontSize === 20 ? 13 : 9,
                        fontFace: slide.titleFont || "Arial",
                        bold: slide.istitleBold,
                        italic: slide.istitleitalic,
                        underline: slide.istitleunderline,
                        color: slide.title ? "666666" : "BBBBBB",
                        align: slide.alignitemstitle || "center",
                        valign: "top",
                        w: 8.5,
                        h: 1,
                    });

                    break;

                case "Blank":
                    // Do nothing for a blank slide
                    break;

                default:
                    pptSlide.addText("Default Layout: Add Content", {
                        x: 1,
                        y: 1,
                        fontSize: 18,
                        fontFace: "Arial",
                        align: "center",
                    });
                    break;
            }

            if (headerfooter?.isfootertext) {
                // Add footer
                pptSlide.addShape(pptx.ShapeType.rect, {
                    x: 0,
                    y: 5.2,
                    w: 10,
                    h: 0.5,
                    fill: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor,
                });

                pptSlide.addText(headerfooter?.isfootertext ? headerfooter?.footertext : "", {
                    x: 0.1,
                    y: 5.4,
                    fontSize: 12,
                    fontFace: "Arial",
                    align: "left",
                    color: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor ? "FFFFFF" : "black",
                    bold: true,
                });

                pptSlide.addText(headerfooter?.isSlidenumber ? (slideIndex + 1).toString() : "", {
                    x: 2.4,
                    y: 5.4,
                    fontSize: 12,
                    fontFace: "Arial",
                    align: "right",
                    color: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor ? "FFFFFF" : "black",
                    bold: true,
                });
            }


            // Slide dimensions and adding images (unchanged logic)
            const slidePixelWidth = 960;
            const slidePixelHeight = 720;
            const slideInchWidth = 10;
            const slideInchHeight = 7.5;
            const toInches = (pixels) => (pixels * slideInchWidth) / slidePixelWidth;

            slide.images?.forEach((image, index) => {
                const imgSrc = typeof image === "string" ? image : image.src;

                if (imgSrc && (imgSrc.startsWith("data:image") || imgSrc.startsWith("http"))) {
                    const imageX = dimensions[slideIndex]?.images[index]?.x || image?.x || 0;
                    const imageY = dimensions[slideIndex]?.images[index]?.y || 0;
                    const imageWidth = dimensions[slideIndex]?.images[index]?.width || 220;
                    const imageHeight = dimensions[slideIndex]?.images[index]?.height || 150;

                    // Convert values to inches
                    const imageXInches = toInches(imageX) + 3.6; // Adding 4.5 inches for additional horizontal offset
                    const imageYInches = toInches(imageY) + 0.2; // Vertical position adjustment
                    const imageWidthInches = toInches(imageWidth);
                    const imageHeightInches = toInches(imageHeight);

                    // Calculate adjusted X to ensure the image fits within the slide width
                    const adjustedX = Math.min(imageXInches, slideInchWidth - imageWidthInches);

                    // Add the image to the slide
                    pptSlide.addImage({
                        data: imgSrc.startsWith("data:image") ? imgSrc : undefined,
                        path: !imgSrc.startsWith("data:image") ? imgSrc : undefined,
                        x: adjustedX,
                        y: imageYInches,
                        w: imageWidthInches,
                        h: imageHeightInches,
                    });
                }
            });
        });
        pptx.writeFile(`${fileName}.pptx`);
    }

    const titleRef = useRef(null);

    const lastScrollTopRef = useRef(0); // Use ref for lastScrollTop

    const [title, setTitle] = useState(slides[selectedSlideIndex]?.title || "");
    const [subtitle, setSubtitle] = useState(slides[selectedSlideIndex]?.subtitle || "");
    const [subtitletwo, setSubtitletwo] = useState(slides[selectedSlideIndex]?.subtitletwo || "");

    const isManualSelection = useRef(false);

    useEffect(() => {
        const gridElement = parentBoxRef.current;



        // const handleScroll = () => {
        //     if (isManualSelection.current) return; // Ignore scroll if manually selecting

        //     const currentScrollTop = gridElement.scrollTop;

        //     setSelectedSlideIndex((prevIndex) => {
        //         if (currentScrollTop > lastScrollTopRef.current) {
        //             // Scrolling down
        //             const newIndex = slides?.length - 1 > prevIndex ? prevIndex + 1 : slides?.length - 1;
        //             scrollToSlide(newIndex);
        //             return newIndex;
        //         } else if (currentScrollTop < lastScrollTopRef.current) {
        //             // Scrolling up
        //             const newIndex = prevIndex === 0 ? 0 : prevIndex - 1;
        //             scrollToSlide(newIndex);
        //             return newIndex;
        //         }
        //         return prevIndex; // No change
        //     });

        //     lastScrollTopRef.current = currentScrollTop; // Update last scroll position
        // };

        const scrollToSlide = (index) => {
            const slideElement = slideRefs.current[index];
            if (slideElement) {
                const mainContainer = document.querySelector(".sidebar");
                if (mainContainer) {
                    const containerTop = mainContainer.getBoundingClientRect().top;
                    const slideTop = slideElement.getBoundingClientRect().top;
                    const scrollOffset = slideTop - containerTop;

                    mainContainer.scrollTo({
                        top: mainContainer.scrollTop + scrollOffset,
                        behavior: "smooth",
                    });
                }
            }
        };

        // if (gridElement) {
        //     gridElement.addEventListener("scroll", handleScroll);
        // }

        // // Cleanup the event listener
        // return () => {
        //     if (gridElement) {
        //         gridElement.removeEventListener("scroll", handleScroll);
        //     }
        // };
    }, [slides]);

    const handleSlideSelect = (index) => {
        isManualSelection.current = true;
        setSelectedSlideIndex(index);

        const slideElement = slideRefs.current[index];
        if (slideElement) {
            const mainContainer = document.querySelector(".sidebar");
            if (mainContainer) {
                const slideOffsetTop = slideElement.offsetTop; // Slide's position from the top
                const slideHeight = slideElement.offsetHeight;
                const containerHeight = mainContainer.offsetHeight;

                const scrollOffset =
                    slideOffsetTop - (containerHeight / 2 - slideHeight / 2);

                const handleScroll = () => {
                    const containerScrollTop = mainContainer.scrollTop;

                    mainContainer.scrollTo({
                        top: slideOffsetTop,
                        behavior: "auto",
                    });
                    mainContainer.removeEventListener("scroll", handleScroll);
                };

                mainContainer.addEventListener("scroll", handleScroll);

                mainContainer.scrollTo({
                    top: scrollOffset,
                    behavior: "smooth",
                });
            }
        }


        setTimeout(() => {
            isManualSelection.current = false;
        }, 300);
    };


    const InsertImage = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*"; // Restrict to image files
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result; // Base64 image URL

                    setSlides((prevSlides) => {
                        const updatedSlides = [...prevSlides];
                        const selectedSlideData = updatedSlides[selectedSlideIndex];

                        // Add the image with default position and dimensions to the selected slide
                        selectedSlideData.images = [
                            ...(selectedSlideData.images || []),
                            { src: imageUrl, x: 751, y: 314, w: 100, h: 100, crossOrigin: "anonymous" }, // Default position and size
                        ];


                        return updatedSlides;
                    });


                };
                reader.readAsDataURL(file); // Convert file to Base64
            }
        };

        // Trigger the file input click to open the file dialog
        fileInput.click();
    };

    const updateSlidesWithImagePositions = (slides, imagePositions) => {
        return slides.map((slide, index) => {
            // Assuming imagePositions is an array of objects for each slide
            // e.g., [{ x: 10, y: 20 }, { x: 30, y: 40 }]
            const updatedImages = slide.images.map((image, imgIndex) => ({
                ...image,
                xdrag: imagePositions[index]?.images[imgIndex]?.x ?? 0, // Use the corresponding x value or 0 if not available
                ydrag: imagePositions[index]?.images[imgIndex]?.y ?? 0, // Use the corresponding y value or 0 if not available
                w: imagePositions[index]?.images[imgIndex]?.width ?? 220, // Use the corresponding x value or 0 if not available
                h: imagePositions[index]?.images[imgIndex]?.height ?? 150, // Use the corresponding y value or 0 if not available
            }));

            return { ...slide, images: updatedImages };
        });
    };



    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            const updatedSlides = updateSlidesWithImagePositions(slides, dimensions);

            let projectscreate = await axios.post(SERVICE.POWERPOINT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                companylogo: String(bdayCompanyLogo),
                categoryname: String(powerpoint.categoryname),
                subcategoryname: String(powerpoint.subcategoryname),
                documentname: String(powerpoint.documentname),
                isheadertext: String(headerfooter.isheadertext),
                isfootertext: String(headerfooter.isfootertext),
                isSlidenumber: String(headerfooter.isSlidenumber),
                headertext: String(headerfooter.headertext),
                footertext: String(headerfooter.footertext),
                isheaderfootercolor: String(headerfooter.isheaderfootercolor),
                headerfootercolor: String(headerfooter.headerfootercolor),
                slides: [...updatedSlides],
                filename: String(powerpoint.documentname),
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setFileName(powerpoint.documentname)
            setPowerpoint({
                categoryname: "Please Select Category",
                subcategoryname: "Please Select Subcategory",
                documentname: ""
            });

            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleEditClose();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handlesubmitHeaderFooter = () => {
        if (headerfooterForChoose.isheadertext && headerfooterForChoose.headertext === "") {
            setPopupContentMalert("Please Enter Header");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        } else if (headerfooterForChoose.isfootertext && headerfooterForChoose.footertext === "") {
            setPopupContentMalert("Please Enter Footer");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        } else if (headerfooterForChoose.isheaderfootercolor && headerfooterForChoose.headerfootercolor === "") {
            setPopupContentMalert("Please Choose Color");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        }
        else {
            setHeaderfooter(headerfooterForChoose)
            setHeaderFooterEl(false);
        }
    }

    const handlesubmit = (e) => {
        e.preventDefault();

        const IsNameMatch = categoryList?.some(
            (data) =>
                data?.categoryname?.toLowerCase() === powerpoint?.categoryname?.toLowerCase() &&
                data?.subcategoryname?.toLowerCase() === powerpoint?.subcategoryname?.toLowerCase() &&
                data?.documentname?.toLowerCase() === powerpoint?.documentname?.toLowerCase()
        );

        if (powerpoint?.categoryname === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        } else if (powerpoint?.subcategoryname === "Please Select Subcategory") {
            setPopupContentMalert("Please Select Subcategory");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        } else if (powerpoint?.documentname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        } else if (IsNameMatch) {
            setPopupContentMalert("PPT Already Exists");
            setPopupSeverityMalert("error");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }

    }


    const parentBoxRef = useRef(null);



    const subtitleRef = useRef(null); // Initialize timeout ref correctly
    const subtitleReftwo = useRef(null); // Initialize timeout ref correctly

    const [ImageIndexForDrag, setImageIndexForDrag] = useState(0)
    const [slideIndexForDrag, setslideIndexForDrag] = useState(0)

    const handleImageMouseDown = (e, imgIndex, slideIndex, slidedata) => {
        e.preventDefault();
        setImageIndexForDrag(imgIndex);
        setslideIndexForDrag(slideIndex);
        setDragging(true);

        setDragStart((prevDragStart) => {
            // Create a shallow copy of the previous state
            const updatedDragStart = [...prevDragStart];

            // Ensure there is an entry for the current slideIndex
            if (!updatedDragStart[slideIndex]) {
                updatedDragStart[slideIndex] = { images: [] };
            }

            // Ensure the images array is initialized
            if (!updatedDragStart[slideIndex].images[imgIndex]) {
                updatedDragStart[slideIndex].images[imgIndex] = {};
            }

            // Update or add the image data for the current imgIndex
            updatedDragStart[slideIndex].images[imgIndex] = {
                ...updatedDragStart[slideIndex].images[imgIndex], // Preserve existing properties
                x: slidedata?.x || 0,          // Update x-coordinate
                y: slidedata?.y || 0,          // Update y-coordinate
            };

            return updatedDragStart; // Return the updated state
        });


        setSlides((prevSlides) => {
            const updatedSlides = [...prevSlides];
            if (updatedSlides[slideIndex] && updatedSlides[slideIndex].images[imgIndex]) {
                updatedSlides[slideIndex].images[imgIndex] = {
                    ...updatedSlides[slideIndex].images[imgIndex],  // Preserve the other properties
                    x: slidedata?.x,
                    y: slidedata?.y,
                };
            }
            return updatedSlides;
        });

    };


    const handleMouseMove = (e) => {
        if (dragging && slideIndexForDrag !== null && ImageIndexForDrag !== null) {
            const newX = e.clientX - dragStart[slideIndexForDrag]?.images[ImageIndexForDrag]?.x;
            const newY = e.clientY - dragStart[slideIndexForDrag]?.images[ImageIndexForDrag]?.y;

            setImagePositions((prevPositions) => {
                const updatedPositions = [...prevPositions];

                if (!updatedPositions[slideIndexForDrag]) {
                    updatedPositions[slideIndexForDrag] = { images: [] };
                }

                updatedPositions[slideIndexForDrag].images[ImageIndexForDrag] = {
                    ...imagePositions[slideIndexForDrag]?.images[ImageIndexForDrag],
                    x: newX,
                    y: newY
                };

                return updatedPositions;
            });


        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };


    useEffect(() => {
        // Attach mousemove and mouseup event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Clean up the event listeners
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, slideIndexForDrag, ImageIndexForDrag]);



    useEffect(() => {
        const element = titleRef.current;
        if (element && slides[selectedSlideIndex]?.istitlecursorposition !== undefined) {
            const position = slides[selectedSlideIndex]?.istitlecursorposition;

            const range = document.createRange();
            const selection = window.getSelection();
            const textNode = element.firstChild;

            if (textNode) {
                const maxPosition = Math.min(position, textNode.length);
                range.setStart(textNode, maxPosition); // Set the cursor to the stored position
                range.collapse(true); // Move the cursor to that position
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus();
            }
        }
    }, [title]);

    useEffect(() => {
        const element = subtitleRef.current;
        if (element && slides[selectedSlideIndex]?.issubtitlecursorposition !== undefined) {
            const position = slides[selectedSlideIndex]?.issubtitlecursorposition;

            const range = document.createRange();
            const selection = window.getSelection();
            const textNode = element.firstChild;

            if (textNode) {
                const maxPosition = Math.min(position, textNode.length);
                range.setStart(textNode, maxPosition); // Set the cursor to the stored position
                range.collapse(true); // Move the cursor to that position
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus();
            }
        }
    }, [subtitle]);

    useEffect(() => {
        const element = subtitleReftwo.current;
        if (element && slides[selectedSlideIndex]?.issubtitlecursorpositiontwo !== undefined) {
            const position = slides[selectedSlideIndex]?.issubtitlecursorpositiontwo;

            const range = document.createRange();
            const selection = window.getSelection();
            const textNode = element.firstChild;

            if (textNode) {
                const maxPosition = Math.min(position, textNode.length);
                range.setStart(textNode, maxPosition); // Set the cursor to the stored position
                range.collapse(true); // Move the cursor to that position
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus();
            }
        }
    }, [subtitletwo]);


    const handleCursorUpdatetitle = (e, index) => {
        const element = titleRef.current;
        if (!element || !element.childNodes.length) return;

        // Get the caret position from the mouse click location
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range) {
            const offset = range.startOffset;

            // Update the slides state with the new cursor position
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    istitlecursorposition: offset,
                };
                return updatedSlides;
            });
        }
    };

    const handleCursorUpdatesubtitle = (e, index) => {
        const element = subtitleRef.current;
        if (!element || !element.childNodes.length) return;

        // Get the caret position from the mouse click location
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range) {
            const offset = range.startOffset;

            // Update the slides state with the new cursor position
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    issubtitlecursorposition: offset,
                };
                return updatedSlides;
            });
        }
    };

    const handleCursorUpdatesubtitletwo = (e, index) => {
        const element = subtitleReftwo.current;
        if (!element || !element.childNodes.length) return;

        // Get the caret position from the mouse click location
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range) {
            const offset = range.startOffset;

            // Update the slides state with the new cursor position
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    issubtitlecursorpositiontwo: offset,
                };
                return updatedSlides;
            });
        }
    };

    const handlePaste = (e) => {
        e.preventDefault(); // Prevent default paste behavior

        // Get plain text from clipboard
        const text = e.clipboardData.getData("text/plain");

        // Insert the cleaned text manually
        document.execCommand("insertText", false, text);
    };


    let scrollTimeout; // Declare a timeout variable at a higher scope to manage debouncing

    const handleTextInput = async (e, index, type) => {
        e.preventDefault();

        document.execCommand('removeFormat', false, null);

        let text = e.currentTarget.textContent.trim();
        const selection = window.getSelection();
        const currentCaretPosition = selection.focusOffset;
        const textNode = e.currentTarget.firstChild;
        const newCaretPosition = Math.min(currentCaretPosition, textNode ? textNode.length : 0);

        const isBold = document.queryCommandState("bold");
        const isItalic = document.queryCommandState("italic");
        const isUnderline = document.queryCommandState("underline");

        // Update the selected slide index
        await handleSlideSelect(index);

        // Update slides state
        setSlides((prevSlides) => {
            const isUnderlines = window.getSelection().toString()
                ? !prevSlides[index]?.istitleunderline // Toggle underline if text is selected
                : prevSlides[index]?.istitleunderline;

            const isUnderlinessubtitle = window.getSelection().toString()
                ? !prevSlides[index]?.issubtitleunderline // Toggle underline if text is selected
                : prevSlides[index]?.issubtitleunderline;

            const isUnderlinessubtitletwo = window.getSelection().toString()
                ? !prevSlides[index]?.issubtitleunderlinetwo // Toggle underline if text is selected
                : prevSlides[index]?.issubtitleunderlinetwo;

            const updatedSlides = [...prevSlides];
            if (type === "title") {
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    title: text,
                    istitleBold: isBold,
                    istitleitalic: isItalic,
                    istitleunderline: isUnderline && isUnderlines,
                    istitlecursorposition: newCaretPosition,
                };
            } else if (type === "subtitle") {
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    subtitle: text,
                    issubtitleBold: isBold,
                    issubtitleitalic: isItalic,
                    issubtitleunderline: isUnderline && isUnderlinessubtitle,
                    issubtitlecursorposition: newCaretPosition,
                };
            } else if (type === "subtitletwo") {
                updatedSlides[index] = {
                    ...updatedSlides[index],
                    subtitletwo: text,
                    issubtitleBoldtwo: isBold,
                    issubtitleitalictwo: isItalic,
                    issubtitleunderlinetwo: isUnderline && isUnderlinessubtitletwo,
                    issubtitlecursorpositiontwo: newCaretPosition,
                };
            }
            return updatedSlides;
        });

        setTimeout(() => {
            const range = document.createRange();
            const element = e.currentTarget;

            if (textNode) {
                const safeCaretPosition = Math.min(newCaretPosition, textNode.length);
                range.setStart(textNode, safeCaretPosition);
                range.setEnd(textNode, safeCaretPosition);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }, 0);


        // Clear any previous timeout to debounce the scrolling
        clearTimeout(scrollTimeout);

        // Debounce the scroll logic
        scrollTimeout = setTimeout(() => {
            const slideElement = slideRefs.current[index];
            if (slideElement && slideElement.getBoundingClientRect) {
                const mainContainer = document.querySelector('.sidebar');
                if (mainContainer) {
                    const containerTop = mainContainer.getBoundingClientRect().top;
                    const slideTop = slideElement.getBoundingClientRect().top;
                    const scrollOffset = slideTop - containerTop;

                    // Smooth scroll to the selected slide
                    mainContainer.scrollTo({
                        top: mainContainer.scrollTop + scrollOffset,
                        behavior: 'smooth',
                    });
                }
            }
        }, 200); // Delay scrolling to ensure typing and UI interactions are stable


    };

    // const handleTextInput = async (e, index, type) => {
    //     e.preventDefault();

    //     document.execCommand('removeFormat', false, null);

    //     let text = e.currentTarget.textContent.trim();
    //     const selection = window.getSelection();
    //     const currentCaretPosition = selection.focusOffset;
    //     const textNode = e.currentTarget.firstChild;
    //     const newCaretPosition = Math.min(currentCaretPosition, textNode ? textNode.length : 0);

    //     const isBold = document.queryCommandState("bold");
    //     const isItalic = document.queryCommandState("italic");
    //     const isUnderline = document.queryCommandState("underline");

    //     // Update the selected slide index
    //     await handleSlideSelect(index);

    //     // Update slides state
    //     setSlides((prevSlides) => {
    //         const isUnderlines = window.getSelection().toString()
    //             ? !prevSlides[index]?.istitleunderline // Toggle underline if text is selected
    //             : prevSlides[index]?.istitleunderline;

    //         const isUnderlinessubtitle = window.getSelection().toString()
    //             ? !prevSlides[index]?.issubtitleunderline // Toggle underline if text is selected
    //             : prevSlides[index]?.issubtitleunderline;

    //         const isUnderlinessubtitletwo = window.getSelection().toString()
    //             ? !prevSlides[index]?.issubtitleunderlinetwo // Toggle underline if text is selected
    //             : prevSlides[index]?.issubtitleunderlinetwo;

    //         const updatedSlides = [...prevSlides];
    //         if (type === "title") {
    //             updatedSlides[index] = {
    //                 ...updatedSlides[index],
    //                 title: text,
    //                 istitleBold: isBold,
    //                 istitleitalic: isItalic,
    //                 istitleunderline: isUnderline && isUnderlines,
    //                 istitlecursorposition: newCaretPosition,
    //             };
    //         } else if (type === "subtitle") {
    //             updatedSlides[index] = {
    //                 ...updatedSlides[index],
    //                 subtitle: text,
    //                 issubtitleBold: isBold,
    //                 issubtitleitalic: isItalic,
    //                 issubtitleunderline: isUnderline && isUnderlinessubtitle,
    //                 issubtitlecursorposition: newCaretPosition,
    //             };
    //         } else if (type === "subtitletwo") {
    //             updatedSlides[index] = {
    //                 ...updatedSlides[index],
    //                 subtitletwo: text,
    //                 issubtitleBoldtwo: isBold,
    //                 issubtitleitalictwo: isItalic,
    //                 issubtitleunderlinetwo: isUnderline && isUnderlinessubtitletwo,
    //                 issubtitlecursorpositiontwo: newCaretPosition,
    //             };
    //         }
    //         return updatedSlides;
    //     });

    //     setTimeout(() => {
    //         const range = document.createRange();
    //         const element = e.currentTarget;

    //         if (textNode) {
    //             const safeCaretPosition = Math.min(newCaretPosition, textNode.length);
    //             range.setStart(textNode, safeCaretPosition);
    //             range.setEnd(textNode, safeCaretPosition);

    //             const selection = window.getSelection();
    //             selection.removeAllRanges();
    //             selection.addRange(range);
    //         }
    //     }, 0);

    //     // Clear any previous timeout to debounce the scrolling
    //     clearTimeout(scrollTimeout);

    //     // Debounce the scroll logic
    //     scrollTimeout = setTimeout(() => {
    //         const slideElement = slideRefs.current[index];
    //         if (slideElement && slideElement.getBoundingClientRect) {
    //             const mainContainer = document.querySelector('.sidebar');
    //             if (mainContainer) {
    //                 const containerTop = mainContainer.getBoundingClientRect().top;
    //                 const slideTop = slideElement.getBoundingClientRect().top;
    //                 const scrollOffset = slideTop - containerTop;

    //                 // Smooth scroll to the selected slide
    //                 mainContainer.scrollTo({
    //                     top: mainContainer.scrollTop + scrollOffset,
    //                     behavior: 'smooth',
    //                 });
    //             }
    //         }
    //     }, 200); // Delay scrolling to ensure typing and UI interactions are stable
    // };

    // const handleTextInput = async (e, index, type) => {
    //     e.preventDefault();
    //     const clipboardData = e.clipboardData || window.clipboardData;
    //     let pastedText = clipboardData.getData("text/plain").trim();

    //     // Get the current content of the editable div
    //     const currentContent = e.currentTarget.textContent.trim();

    //     // If the pasted text is identical to the current content, don't allow paste
    //     if (currentContent.includes(pastedText)) {
    //         return; // Prevent paste if text is the same as current content
    //     }

    //     // Manually handle the insertion of the pasted text at the caret position
    //     const selection = window.getSelection();
    //     const range = selection.getRangeAt(0);
    //     range.deleteContents(); // Delete any selected text before pasting

    //     const newTextNode = document.createTextNode(pastedText); // Create a new text node
    //     range.insertNode(newTextNode); // Insert the new text at the current caret position

    //     // Move the caret to the end of the newly inserted text
    //     range.setStartAfter(newTextNode);
    //     range.setEndAfter(newTextNode);

    //     selection.removeAllRanges(); // Clear current selection
    //     selection.addRange(range); // Add the new range with the caret at the end of the pasted text

    //     // Now we will update the slides state like before
    //     const isBold = document.queryCommandState("bold");
    //     const isItalic = document.queryCommandState("italic");
    //     const isUnderline = document.queryCommandState("underline");

    //     // Update the selected slide index
    //     await handleSlideSelect(index);

    //     setSlides((prevSlides) => {
    //         const updatedSlides = [...prevSlides];
    //         const isUnderlines = window.getSelection().toString()
    //             ? !prevSlides[index]?.istitleunderline // Toggle underline if text is selected
    //             : prevSlides[index]?.istitleunderline;

    //         if (type === "title") {
    //             updatedSlides[index] = {
    //                 ...updatedSlides[index],
    //                 title: pastedText,
    //                 istitleBold: isBold,
    //                 istitleitalic: isItalic,
    //                 istitleunderline: isUnderline && isUnderlines,
    //             };
    //         } else if (type === "subtitle") {
    //             updatedSlides[index] = {
    //                 ...updatedSlides[index],
    //                 subtitle: pastedText,
    //                 issubtitleBold: isBold,
    //                 issubtitleitalic: isItalic,
    //                 issubtitleunderline: isUnderline && isUnderlines,
    //             };
    //         }

    //         return updatedSlides;
    //     });

    //     // Handle scrolling logic (already defined)
    //     setTimeout(() => {
    //         const slideElement = slideRefs.current[index];
    //         if (slideElement && slideElement.getBoundingClientRect) {
    //             const mainContainer = document.querySelector('.sidebar');
    //             if (mainContainer) {
    //                 const containerTop = mainContainer.getBoundingClientRect().top;
    //                 const slideTop = slideElement.getBoundingClientRect().top;
    //                 const scrollOffset = slideTop - containerTop;

    //                 // Smooth scroll to the selected slide
    //                 mainContainer.scrollTo({
    //                     top: mainContainer.scrollTop + scrollOffset,
    //                     behavior: 'smooth',
    //                 });
    //             }
    //         }
    //     }, 200); // Delay scrolling to ensure typing and UI interactions are stable
    // };


    const attachPasteHandler = (element) => {
        if (!element) return;

        element.addEventListener("paste", (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData("text/plain");
            document.execCommand("insertText", false, text);
        });
    };

    // Example: Attach event listener when mounting (React)
    useEffect(() => {
        const inputElements = document.querySelectorAll("[contenteditable=true]");
        inputElements.forEach(attachPasteHandler);

        return () => {
            inputElements.forEach((el) => el.removeEventListener("paste", attachPasteHandler));
        };
    }, []);


    // window.scrollTo(0, 0);

    const handleBoldToggle = () => {
        document.execCommand("bold");
    };

    const handleItalicToggle = () => {
        document.execCommand("italic");
    };

    const handleUnderlineToggle = () => {
        document.execCommand("underline");
    };

    const handleRemoveImage = (imgIndex, slideIndex) => {

        if (imgIndex < 0 || slideIndex < 0) {
            console.error("Invalid indices");
            return;
        }

        setSlides((prevSlides) => {
            const updatedSlides = [...prevSlides];
            updatedSlides[slideIndex].images.splice(imgIndex, 1);
            return updatedSlides;
        });

        // setImagePositions((prevPositions) => {
        //     const updatedPositions = [...prevPositions];
        //     updatedPositions[slideIndex].images.splice(imgIndex, 1);
        //     return updatedPositions;
        // });

        setDimensions((prevPositions) => {
            const updatedPositions = [...prevPositions];
            updatedPositions[slideIndex].images.splice(imgIndex, 1);
            return updatedPositions;
        });







    };


    // Add these states
    const [fontThemeAnchorEl, setFontThemeAnchorEl] = useState(null);
    const [selectedFontTheme, setSelectedFontTheme] = useState('Default');

    const [fontSizeAnchorEl, setFontSizeAnchorEl] = useState(null);
    const [selectedFontSize, setSelectedFontSize] = useState(16); // Default font size

    // Add font themes array
    const fontThemes = [
        { name: 'Arial', font: 'Arial', icon: <TextFieldsIcon /> },
        { name: 'Calibri', font: 'Calibri', icon: <TextFieldsIcon /> },
        { name: 'Times New Roman', font: 'Times New Roman', icon: <TextFieldsIcon /> },
        { name: 'Verdana', font: 'Verdana', icon: <TextFieldsIcon /> },
        { name: 'Georgia', font: 'Georgia', icon: <TextFieldsIcon /> },
        { name: 'Courier New', font: 'Courier New', icon: <TextFieldsIcon /> },
        { name: 'Tahoma', font: 'Tahoma', icon: <TextFieldsIcon /> },
        { name: 'Comic Sans MS', font: 'Comic Sans MS', icon: <TextFieldsIcon /> },
        { name: 'Lucida Sans', font: 'Lucida Sans', icon: <TextFieldsIcon /> },
        { name: 'Impact', font: 'Impact', icon: <TextFieldsIcon /> },
        { name: 'Palatino Linotype', font: 'Palatino Linotype', icon: <TextFieldsIcon /> },
        { name: 'Segoe UI', font: 'Segoe UI', icon: <TextFieldsIcon /> },
        { name: 'Frank Ruhl Libre', font: 'Frank Ruhl Libre', icon: <TextFieldsIcon /> },
        { name: 'Arial Black', font: 'Arial Black', icon: <TextFieldsIcon /> },
        { name: 'Baskerville', font: 'Baskerville', icon: <TextFieldsIcon /> },
        { name: 'Book Antiqua', font: 'Book Antiqua', icon: <TextFieldsIcon /> },
        { name: 'Garamond', font: 'Garamond', icon: <TextFieldsIcon /> },
        { name: 'Segoe Script', font: 'Segoe Script', icon: <TextFieldsIcon /> },
        { name: 'Lucida Console', font: 'Lucida Console', icon: <TextFieldsIcon /> },
        { name: 'Cooper Black', font: 'Cooper Black', icon: <TextFieldsIcon /> },
        { name: 'Rockwell', font: 'Rockwell', icon: <TextFieldsIcon /> },
        { name: 'Bauhaus 93', font: 'Bauhaus 93', icon: <TextFieldsIcon /> },
        { name: 'Comic Sans MS', font: 'Comic Sans MS', icon: <TextFieldsIcon /> },
        { name: 'Helvetica', font: 'Helvetica', icon: <TextFieldsIcon /> },
        { name: 'Courier', font: 'Courier', icon: <TextFieldsIcon /> },
        { name: 'Tahoma', font: 'Tahoma', icon: <TextFieldsIcon /> },
        { name: 'Futura', font: 'Futura', icon: <TextFieldsIcon /> },
        { name: 'Proxima Nova', font: 'Proxima Nova', icon: <TextFieldsIcon /> },
        { name: 'Varela Round', font: 'Varela Round', icon: <TextFieldsIcon /> },
        { name: 'Candara', font: 'Candara', icon: <TextFieldsIcon /> },
        { name: 'Corbel', font: 'Corbel', icon: <TextFieldsIcon /> },
        { name: 'Consolas', font: 'Consolas', icon: <TextFieldsIcon /> },
        { name: 'Segoe UI Light', font: 'Segoe UI Light', icon: <TextFieldsIcon /> },
        { name: 'Segoe UI Semibold', font: 'Segoe UI Semibold', icon: <TextFieldsIcon /> },
        { name: 'MS Sans Serif', font: 'MS Sans Serif', icon: <TextFieldsIcon /> },
        { name: 'Mangal', font: 'Mangal', icon: <TextFieldsIcon /> },
        { name: 'Calibri Light', font: 'Calibri Light', icon: <TextFieldsIcon /> },
        { name: 'Constantia', font: 'Constantia', icon: <TextFieldsIcon /> },
        { name: 'Trebuchet MS', font: 'Trebuchet MS', icon: <TextFieldsIcon /> },
        { name: 'Arial Narrow', font: 'Arial Narrow', icon: <TextFieldsIcon /> },
        { name: 'Tahoma Bold', font: 'Tahoma Bold', icon: <TextFieldsIcon /> },
        { name: 'Lucida Sans Unicode', font: 'Lucida Sans Unicode', icon: <TextFieldsIcon /> },
        { name: 'Eras Bold ITC', font: 'Eras Bold ITC', icon: <TextFieldsIcon /> },
        { name: 'Rockwell Extra Bold', font: 'Rockwell Extra Bold', icon: <TextFieldsIcon /> },
        { name: 'MT Extra', font: 'MT Extra', icon: <TextFieldsIcon /> },
        { name: 'Arial Rounded MT Bold', font: 'Arial Rounded MT Bold', icon: <TextFieldsIcon /> },
    ];

    const fontSizes = [12, 14, 16, 18, 20]; // Add your preferred font sizes


    // Add handlers
    const handleFontThemeClick = (event) => {
        setFontThemeAnchorEl(event.currentTarget);
    };

    const handleFontThemeClose = () => {
        setFontThemeAnchorEl(null);
    };

    // Keep track of how many times the font has been applied
    let fontChangeCount = 0;

    const handleFontThemeSelect = (theme) => {
        setSelectedFontTheme(theme.name);

        // Function to find the parent div with a specific data-type
        const getParentDivByType = (selectedNode, type) => {
            let parentElement = selectedNode ? selectedNode.parentElement : null;

            // Traverse upwards until we find the div with the specified data-type
            while (parentElement && parentElement.getAttribute('data-type') !== type) {
                parentElement = parentElement.parentElement;
            }

            return parentElement;
        };

        // Get the selected text
        const selectedText = window.getSelection();
        const selectedNode = selectedText.anchorNode;

        // Get the parent div for title
        const titleDiv = getParentDivByType(selectedNode, 'title');


        // Get the parent div for subtitle
        const subtitleDiv = getParentDivByType(selectedNode, 'subtitle');


        // Get the parent div for subtitle
        const subtitleDivtwo = getParentDivByType(selectedNode, 'subtitletwo');



        // const isWhat = parentElement?.getAttribute('data-type')
        const selectedFont = theme.font || "Arial";

        if (titleDiv) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    titleFont: selectedFont,

                };
                return updatedSlides;
            });

        } else if (subtitleDiv) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    subtitleFont: selectedFont,
                };
                return updatedSlides;
            });
        } else if (subtitleDivtwo) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    subtitleFonttwo: selectedFont,
                };
                return updatedSlides;
            });
        }

        if (selectedText.rangeCount > 0) {
            const range = selectedText.getRangeAt(0);
            const selectedNode = range.startContainer;

            let spans = Array.from(range.cloneContents().querySelectorAll('span'));

            if (spans.length > 0) {
                const selectedFont = theme.font || 'Arial';

                const spanAppgetel = document.getElementsByTagName('span');;
                const spanApp = document.createElement('span');
                spanApp.style.fontFamily = selectedFont;

                const selectedTextNode = range.extractContents();

                Array.from(selectedTextNode.childNodes).forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                        spanApp.innerHTML += node.innerHTML; // Add text from existing spans
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        spanApp.innerHTML += node.textContent; // Add plain text
                    }
                });

                range.deleteContents();
                range.insertNode(spanApp);

            } else {
                const selectedFont = theme.font || 'Arial';
                const span = document.createElement('span');
                span.style.fontFamily = selectedFont;
                const selectedTextNode = range.extractContents();
                span.appendChild(selectedTextNode);

                range.insertNode(span);

                selectedText.removeAllRanges();
                selectedText.addRange(range);
            }


        } else {
            console.log("Selection contains non-text nodes. Unable to apply font.");
        }

        handleFontThemeClose();

        window.getSelection().removeAllRanges();
    };

    const handleFontThemeSelectAlign = (theme) => {
        // setSelectedFontTheme(theme.name);

        // Function to find the parent div with a specific data-type
        const getParentDivByType = (selectedNode, type) => {
            let parentElement = selectedNode ? selectedNode.parentElement : null;

            // Traverse upwards until we find the div with the specified data-type
            while (parentElement && parentElement.getAttribute('data-type') !== type) {
                parentElement = parentElement.parentElement;
            }

            return parentElement;
        };

        // Get the selected text
        const selectedText = window.getSelection();
        const selectedNode = selectedText.anchorNode;

        // Get the parent div for title
        const titleDiv = getParentDivByType(selectedNode, 'title');


        // Get the parent div for subtitle
        const subtitleDiv = getParentDivByType(selectedNode, 'subtitle');


        // Get the parent div for subtitle
        const subtitleDivtwo = getParentDivByType(selectedNode, 'subtitletwo');



        // const isWhat = parentElement?.getAttribute('data-type')
        const selectedFont = theme || "center";

        if (titleDiv) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    alignitemstitle: selectedFont,

                };
                return updatedSlides;
            });

        } else if (subtitleDiv) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    alignitemssubtitle: selectedFont,
                };
                return updatedSlides;
            });
        } else if (subtitleDivtwo) {

            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    alignitemssubtitletwo: selectedFont,
                };
                return updatedSlides;
            });
        }

        window.getSelection().removeAllRanges();
    };


    const handleFontSizeClick = (event) => {
        setFontSizeAnchorEl(event.currentTarget);
    };

    const handleFontSizeClose = () => {
        setFontSizeAnchorEl(null);
    };

    const handleFontSizeSelect = (size) => {
        // Function to find the parent div with a specific data-type
        const getParentDivByType = (selectedNode, type) => {
            let parentElement = selectedNode ? selectedNode.parentElement : null;

            // Traverse upwards until we find the div with the specified data-type
            while (parentElement && parentElement.getAttribute('data-type') !== type) {
                parentElement = parentElement.parentElement;
            }

            return parentElement;
        };

        // Get the selected text
        const selectedText = window.getSelection();
        const selectedNode = selectedText.anchorNode;

        // Get the parent div for title
        const titleDiv = getParentDivByType(selectedNode, 'title');


        // Get the parent div for subtitle
        const subtitleDiv = getParentDivByType(selectedNode, 'subtitle');


        const subtitleDivtwo = getParentDivByType(selectedNode, 'subtitletwo');

        // Update slide state for title or subtitle
        if (titleDiv) {
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    titleFontSize: size,
                };
                return updatedSlides;
            });
        } else if (subtitleDiv) {
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    subtitleFontSize: size,
                };
                return updatedSlides;
            });
        } else if (subtitleDivtwo) {
            setSlides((prevSlides) => {
                const updatedSlides = [...prevSlides];
                updatedSlides[selectedSlideIndex] = {
                    ...updatedSlides[selectedSlideIndex],
                    subtitleFontSizetwo: size,
                };
                return updatedSlides;
            });
        }

        // Apply font size to selected text
        if (selectedText.rangeCount > 0) {
            const range = selectedText.getRangeAt(0);

            // Check if the selection already has spans
            let spans = Array.from(range.cloneContents().querySelectorAll('span'));

            if (spans.length > 0) {
                const spanApp = document.createElement('span');
                spanApp.style.fontSize = `${size}px`;

                const selectedTextNode = range.extractContents();

                Array.from(selectedTextNode.childNodes).forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                        spanApp.innerHTML += node.innerHTML; // Add text from existing spans
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        spanApp.innerHTML += node.textContent; // Add plain text
                    }
                });

                range.deleteContents();
                range.insertNode(spanApp);

            } else {
                const span = document.createElement('span');
                span.style.fontSize = `${size}px`;
                const selectedTextNode = range.extractContents();
                span.appendChild(selectedTextNode);

                range.insertNode(span);

                selectedText.removeAllRanges();
                selectedText.addRange(range);
            }
        } else {
            console.log("Selection contains non-text nodes. Unable to apply font size.");
        }

        handleFontSizeClose();
        window.getSelection().removeAllRanges();
    };




    const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

    // Add handler functions
    const handleDownloadClick = (event) => {
        setDownloadAnchorEl(event.currentTarget);
    };

    const handleDownloadClose = () => {
        setDownloadAnchorEl(null);
    };

    const [formatAnchorEl, setFormatAnchorEl] = useState(null);

    // Add handler functions
    const handleFormatClick = (event) => {
        setFormatAnchorEl(event.currentTarget);
    };

    const handleFormatClose = () => {
        setFormatAnchorEl(null);
    };

    const [headerFooterEl, setHeaderFooterEl] = useState(false);

    // Add handler functions
    const handleHeaderFooterClick = (event) => {
        setHeaderFooterEl(true);
        setHeaderfooterForChoose(headerfooter)
    };

    const handleHeaderFooterClose = () => {
        setHeaderFooterEl(false)
        setHeaderContent(true);
        setTimeout(() => {
            setHeaderContent(false);
        }, 1000)
        setHeaderfooterForChoose({
            isheadertext: false,
            isfootertext: false,
            isSlidenumber: false,
            headertext: "",
            footertext: "",
            isheaderfootercolor: false,
            headerfootercolor: "",
        })
    };


    // Initialize Google Fonts
    useEffect(() => {
        WebFont.load({
            google: {
                families: [
                    'Roboto',
                    'Open Sans',
                    'Lato',
                    'Montserrat',
                    'Raleway',
                    'Playfair Display',
                    'Source Sans Pro',
                    'Oswald',
                    'Merriweather',
                    'Poppins',
                    'Ubuntu',
                    'Dancing Script',
                    'Pacifico',
                    'Quicksand',
                    'Nunito'
                ]
            }
        });
    }, []);

    const getStylesByLayout = (layout, index, type) => {
        switch (layout) {
            case "Title Slide": // Centered title with smaller subtitle
                return {
                    width: "750px",
                    marginTop: headerfooter?.isheadertext
                        ? "28px" : "28px",
                    minHeight: "194px",
                    fontSize: slides[index]?.titleFontSize || 12,
                    fontWeight: slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slides[index]?.titleFont ? slides[index]?.titleFont : "Arial",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "8px"
                }
            case "Title And Content": // Large title, no subtitle
                return {
                    width: "750px",
                    marginTop: headerfooter?.isheadertext
                        ? "28px" : "28px",
                    minHeight: "100px",
                    fontSize: slides[index]?.titleFontSize || 12,
                    fontWeight: slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slides[index]?.titleFont ? slides[index]?.titleFont : "Arial",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px"
                };
            case "Section Header": // Title centered, subtitle split into two columns
                return {
                    width: "750px",
                    marginTop: headerfooter?.isheadertext
                        ? "28px" : "28px",
                    minHeight: "212px",
                    fontSize: slides[index]?.titleFontSize || 12,
                    fontWeight: slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slides[index]?.titleFont ? slides[index]?.titleFont : "Arial",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                };
            case "Two Content": // Title centered, subtitle split for comparison
                return {

                    width: "750px",
                    marginTop: headerfooter?.isheadertext
                        ? "28px" : "28px",
                    minHeight: "100px",
                    fontSize: slides[index]?.titleFontSize || 12,
                    fontWeight: slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slides[index]?.titleFont ? slides[index]?.titleFont : "Arial",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px"

                };
            case "Title Only": // Title above, subtitle aligned left
                return {
                    width: "750px",
                    marginTop: headerfooter?.isheadertext
                        ? "28px" : "28px",
                    minHeight: "100px",
                    fontSize: slides[index]?.titleFontSize || 12,
                    fontWeight: slides[index]?.istitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.istitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                    fontFamily: slides[index]?.titleFont ? slides[index]?.titleFont : "Arial",
                    padding: "10px",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    overflow: "hidden",
                    marginBottom: "10px"
                };
            case "Blank": // No formatting
                break;
            default: // Default fallback
                return {
                    width: "750px",
                };
        }
    };

    const getStylesByLayoutSubtitle = (layout, index, type) => {
        switch (layout) {
            case "Title Slide": // Centered title with smaller subtitle
                return {
                    width: "750px",
                    minHeight: "140px",
                    fontSize: slides[index]?.subtitleFontSize || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFont ? slides[index]?.subtitleFont : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "45px"

                };
            case "Title And Content": // Large title, no subtitle
                return {
                    width: "750px",
                    minHeight: "242px",
                    fontSize: slides[index]?.subtitleFontSize || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFont ? slides[index]?.subtitleFont : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "Section Header": // Title centered, subtitle split into two columns
                return {
                    width: "750px",
                    minHeight: "140px",
                    fontSize: slides[index]?.subtitleFontSize || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFont ? slides[index]?.subtitleFont : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "Two Content": // Title centered, subtitle split for comparison
                return {
                    width: "370px",

                    minHeight: "242px",
                    fontSize: slides[index]?.subtitleFontSize || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBold ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalic ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFont ? slides[index]?.subtitleFont : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "content-with-caption": // Title above, subtitle aligned left
                return {
                    width: type === "title" ? "100%" : "80%",
                    margin: type === "title" ? "auto" : "10px auto",
                    fontSize: type === "title" ? "28px" : "18px",
                };
            case "Blank": // No formatting
                break;
            default: // Default fallback
                return {
                    width: "750px",
                };
        }
    };

    const getStylesByLayoutSubtitleTwo = (layout, index, type) => {
        switch (layout) {
            case "Title Slide": // Centered title with smaller subtitle
                return {
                    width: "750px",
                    minHeight: "140px",
                    fontSize: slides[index]?.subtitleFontSizetwo || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBoldtwo ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalictwo ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderlinetwo ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFonttwo ? slides[index]?.subtitleFonttwo : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "45px"

                };
            case "Title And Content": // Large title, no subtitle
                return {
                    width: "750px",
                    minHeight: "242px",
                    fontSize: slides[index]?.subtitleFontSizetwo || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBoldtwo ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalictwo ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderlinetwo ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFonttwo ? slides[index]?.subtitleFonttwo : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "Section Header": // Title centered, subtitle split into two columns
                return {
                    width: "750px",
                    minHeight: "140px",
                    fontSize: slides[index]?.subtitleFontSizetwo || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBoldtwo ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalictwo ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderlinetwo ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFonttwo ? slides[index]?.subtitleFonttwo : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "Two Content": // Title centered, subtitle split for comparison
                return {
                    width: "370px",

                    minHeight: "242px",
                    fontSize: slides[index]?.subtitleFontSizetwo || 12,
                    padding: "10px",
                    fontWeight: slides[index]?.issubtitleBoldtwo ? "bold" : "normal",
                    fontStyle: slides[index]?.issubtitleitalictwo ? "italic" : "normal",
                    textDecoration: slides[index]?.issubtitleunderlinetwo ? "underline" : "none",
                    border: "1px dotted rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    fontFamily: slides[index]?.subtitleFonttwo ? slides[index]?.subtitleFonttwo : 'Arial',
                    marginBottom: headerfooter?.isfootertext ||
                        headerfooter?.isSlidenumber ? "35px" : "35px"
                };
            case "content-with-caption": // Title above, subtitle aligned left
                return {
                    width: type === "title" ? "100%" : "80%",
                    margin: type === "title" ? "auto" : "10px auto",
                    fontSize: type === "title" ? "28px" : "18px",
                };
            case "Blank": // No formatting
                break;
            default: // Default fallback
                return {
                    width: "750px",
                };
        }
    };


    return (
        <Box
        >
            <Headtitle title={"TEMPLATE"} />
            <>
                <Grid container sx={{
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "rgb(97, 97, 97)",
                    padding: "30px",
                    boxShadow: "0px 0px 20px #00000029",
                }} >
                    <AppBar position="static" sx={{ marginBottom: "20px" }}>

                        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", width: "150px" }}>
                                <Button sx={{ padding: "10px" }} startIcon={<PostAddIcon />} color="inherit" onClick={addSlide}>Add Slide</Button>
                                <Button sx={{ padding: "10px" }} startIcon={<Delete />} color="inherit" onClick={deleteSlide}>Delete Slide</Button>
                            </Box>
                            <Box sx={{ alignItems: "flex-start" }}>

                                <Button startIcon={<FileDownload />} color="inherit" onClick={InsertImage}>Insert Image</Button>
                                <Button
                                    startIcon={<FileDownload />}
                                    endIcon={<ArrowDropDownIcon />}
                                    color="inherit"
                                    onClick={handleDownloadClick}
                                >
                                    Download
                                </Button>
                                <Menu
                                    anchorEl={downloadAnchorEl}
                                    open={Boolean(downloadAnchorEl)}
                                    onClose={handleDownloadClose}
                                >
                                    <MenuItem onClick={() => {
                                        if (fileName === "") {
                                            setPopupContentMalert("Please Save PPT");
                                            setPopupSeverityMalert("error");
                                            handleClickOpenPopupMalert();
                                        } else {
                                            downloadPPT();
                                            handleDownloadClose();
                                        }
                                    }}
                                    >
                                        Download PPT
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        if (fileName === "") {
                                            setPopupContentMalert("Please Save PPT");
                                            setPopupSeverityMalert("error");
                                            handleClickOpenPopupMalert();
                                        } else {
                                            downloadImage();
                                            handleDownloadClose();
                                        }
                                    }}>
                                        Download Image
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        if (fileName === "") {
                                            setPopupContentMalert("Please Save PPT");
                                            setPopupSeverityMalert("error");
                                            handleClickOpenPopupMalert();
                                        } else {
                                            downloadPDF();
                                            handleDownloadClose();
                                        }
                                    }}>
                                        Download PDF
                                    </MenuItem>
                                </Menu>
                                <Button
                                    startIcon={<FontDownloadIcon />}
                                    endIcon={<ArrowDropDownIcon />}
                                    color="inherit"
                                    onClick={handleFormatClick}
                                >
                                    Text Format
                                </Button>
                                <Menu
                                    anchorEl={formatAnchorEl}
                                    open={Boolean(formatAnchorEl)}
                                    onClose={handleFormatClose}
                                >
                                    <MenuItem onClick={() => {
                                        handleBoldToggle();
                                        handleFormatClose();
                                    }}>
                                        <Typography fontWeight="bold" style={{ marginRight: '8px' }}>B</Typography>
                                        Bold
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleItalicToggle();
                                        handleFormatClose();
                                    }}>
                                        <Typography fontStyle="italic" style={{ marginRight: '8px' }}>I</Typography>
                                        Italic
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleUnderlineToggle();
                                        handleFormatClose();
                                    }}>
                                        <Typography style={{ textDecoration: 'underline', marginRight: '8px' }}>U</Typography>
                                        Underline
                                    </MenuItem>
                                </Menu>
                                <Button
                                    startIcon={<TextFormat />}
                                    endIcon={<ArrowDropDownIcon />}
                                    color="inherit"
                                    onClick={handleFontThemeClick}
                                >
                                    Font Theme
                                </Button>
                                <Menu
                                    anchorEl={fontThemeAnchorEl}
                                    open={Boolean(fontThemeAnchorEl)}
                                    onClose={handleFontThemeClose}
                                    sx={{ marginTop: "40px", height: "500px", }}
                                >
                                    {fontThemes.map((theme) => (
                                        <MenuItem
                                            key={theme.name}
                                            onClick={() => handleFontThemeSelect(theme)}
                                            style={{
                                                backgroundColor: theme.name === selectedFontTheme ? '#f0f0f0' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            {/* <span style={{text-shadow: "10px 5px black"}}>T</span> */}
                                            <Typography style={{
                                                textShadow: "6px 5px grey",
                                                fontWeight: "bold"
                                            }}>
                                                T
                                            </Typography>
                                            &nbsp;
                                            <Typography style={{
                                                fontFamily: theme.font,
                                            }}>
                                                {theme.name}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                                <Button
                                    startIcon={<TextIncreaseIcon />}
                                    endIcon={<ArrowDropDownIcon />}
                                    color="inherit"
                                    onClick={handleFontSizeClick}
                                >
                                    Font Size
                                </Button>
                                <Menu
                                    anchorEl={fontSizeAnchorEl}
                                    open={Boolean(fontSizeAnchorEl)}
                                    onClose={handleFontSizeClose}
                                    sx={{ marginTop: "40px", height: "300px" }}
                                >
                                    {fontSizes.map((size) => (
                                        <MenuItem
                                            key={size}
                                            onClick={() => handleFontSizeSelect(size)}
                                            style={{
                                                backgroundColor: size === selectedFontSize ? '#f0f0f0' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <Typography style={{ fontSize: size }}>
                                                {size} pt
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                                <Button
                                    startIcon={<DescriptionIcon />}
                                    color="inherit"
                                    onClick={handleHeaderFooterClick}
                                >
                                    Header & Footer
                                </Button>

                                <Button
                                    startIcon={<ViewQuiltIcon />}
                                    color="inherit"
                                    onClick={handleOpen}

                                >
                                    Layout
                                </Button>
                                <Menu
                                    anchorEl={anchorElLay}
                                    open={Boolean(anchorElLay)}
                                    onClose={handleClose}
                                    PaperProps={{
                                        style: {
                                            maxWidth: 600, // Adjust dropdown width
                                        },
                                    }}
                                >
                                    <Box sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            {layouts.map((layout) => (
                                                <Grid item xs={4} key={layout.id}>
                                                    <MenuItem
                                                        onClick={() => handleSelectLayout(layout)}
                                                        sx={{ display: 'block', p: 0 }}
                                                    >
                                                        <Paper
                                                            elevation={3}
                                                            sx={{

                                                                backgroundColor: '#f9f9f9',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                ':hover': { backgroundColor: '#e0e0e0' },
                                                                height: "80px",
                                                                border: "1px solid black",
                                                                padding: "10px"
                                                            }}
                                                        >
                                                            <Typography variant="subtitle1" sx={{ border: layout?.titsubborder ? layout?.titsubborder : "1px dotted black", fontWeight: 'bold', height: layout?.titheight }}>
                                                                &nbsp;
                                                            </Typography>
                                                            {layout?.subtitleht2 ?
                                                                <Box sx={{ display: "flex", alignItems: "center", }}>
                                                                    <Typography variant="body2" sx={{ border: "1px dotted black", width: "50%", mt: layout?.mt, height: layout?.subtitleht1 }}>
                                                                        &nbsp;
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ border: "1px dotted black", width: "50%", mt: layout?.mt, height: layout?.subtitleht2 }}>
                                                                        &nbsp;
                                                                    </Typography>
                                                                </Box>
                                                                :
                                                                <Typography variant="body2" sx={{ border: layout?.border || layout?.titsubborder ? layout?.border : "1px dotted black", mt: layout?.mt, height: layout?.subtitleht }}>
                                                                    &nbsp;
                                                                </Typography>

                                                            }

                                                        </Paper>
                                                    </MenuItem>
                                                    <Typography variant="body1" sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                                        {layout.name}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Menu>
                                <Button size="small" color="inherit" onClick={() => {
                                    handleFontThemeSelectAlign("left")
                                }}>
                                    <FormatAlignLeftIcon />
                                </Button>
                                <Button size="small" color="inherit" onClick={() => {
                                    handleFontThemeSelectAlign("center")
                                }}>
                                    <FormatAlignCenterIcon />
                                </Button>
                                <Button size="small" color="inherit" onClick={() => {
                                    handleFontThemeSelectAlign("right")
                                }}>
                                    <FormatAlignRightIcon />
                                </Button>
                            </Box>
                            <Box>
                                <Button startIcon={<SaveIcon />} color="inherit" onClick={handleEditOpen}>Save</Button>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Grid container >
                        <Grid
                            item
                            xs={2}
                            style={{
                                backgroundColor: "#333",
                                color: "white",
                                padding: "10px",
                                height: "560px", // Ensures the height of the sidebar stretches across the viewport
                                overflowY: "auto",
                                marginTop: "-20px",
                            }}
                        >
                            <h3>Slides</h3>

                            {slides.map((_, index) => (
                                <Box
                                    key={index}
                                    ref={el => slideRefs.current[index] = el}
                                    style={{
                                        marginBottom: "10px",
                                        backgroundColor: index === selectedSlideIndex ? "#999" : "#444",
                                        color: "white",
                                        padding: "5px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        position: "relative",
                                    }}
                                    onClick={() => {
                                        handleSlideSelect(index)
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "7px",
                                            right: "2px",
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                            color: "white",
                                            fontWeight: "bold",
                                            zIndex: 1,
                                        }}
                                        onClick={(e) => deleteSlideClose(index)}
                                    >
                                        ×
                                    </div>
                                    Slide {index + 1}
                                </Box>
                            ))}
                        </Grid>
                        <Grid
                            item
                            xs={10}
                            className="sidebar"
                            style={{
                                height: "560px",
                                overflow: "hidden", position: "relative",
                                backgroundColor: "#fff",
                                padding: "20px",
                                boxSizing: "border-box",
                                display: "block",


                            }}
                            ref={parentBoxRef}
                        >
                            {slides.map((slide, index) => (
                                <>
                                    <Box
                                        key={index}
                                        ref={(el) => (slideRefs.current[index] = el)}
                                        style={{
                                            height: "520px",
                                            width: "960px",
                                            position: "relative",
                                            border: "1px solid rgba(0, 0, 0, 0.2)",
                                            minHeight: "100%", // Adjust slide height
                                            boxSizing: "border-box",
                                            marginBottom: "50px",
                                            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)", // Adds box shadow
                                            backgroundColor: index === selectedSlideIndex ? "#f0f0f0" : "#fff", // Highlight the selected slide
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            overflow: "visible",
                                            bottom: 0,

                                        }}
                                        className="backgroundColor-forall"
                                    >
                                        {(
                                            headerfooter?.isheadertext
                                        ) ?
                                            <div
                                                style={{
                                                    width: "100%",
                                                    fontWeight: "bold",
                                                    fontSize: "20px",
                                                    padding: "10px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    backgroundColor: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor || "", // Background color of the div
                                                    color: headerfooter?.isheaderfootercolor ? "white" : "black",
                                                    marginBottom: "0px",
                                                    height: "50px",
                                                    position: "relative", // Added for positioning
                                                    overflow: "hidden", // Prevents content from overflowing
                                                }}
                                            >
                                                <img
                                                    src={bdayCompanyLogo}
                                                    alt="logo"
                                                    width="90"
                                                    style={{
                                                        // ...shapeStyles[companyLogoShape],
                                                        objectFit: "cover",
                                                        zIndex: 2, // Ensures it's on top
                                                        position: "absolute", // Places it independently
                                                        left: "10px", // Adjusts its position from the left of the div
                                                        borderRadius: "10px"
                                                    }}
                                                />
                                                <p style={{
                                                    zIndex: 1,
                                                    position: "absolute",
                                                    right: "10px",
                                                }}>
                                                    {headerfooter?.isheadertext && headerfooter?.headertext || ""}
                                                </p>
                                            </div>
                                            :
                                            <div
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    marginBottom: "0px",
                                                    height: "50px",
                                                    position: "relative", // Added for positioning
                                                    overflow: "hidden", // Prevents content from overflowing                                                    
                                                }}
                                            >
                                                <img
                                                    src={bdayCompanyLogo}
                                                    alt="logo"
                                                    width="90"
                                                    style={{
                                                        // ...shapeStyles[companyLogoShape],
                                                        objectFit: "cover",
                                                        zIndex: 2, // Ensures it's on top
                                                        position: "absolute", // Places it independently
                                                        left: "10px", // Adjusts its position from the left of the div
                                                        borderRadius: "10px"
                                                    }}
                                                />
                                            </div>

                                        }


                                        <div
                                            contentEditable={slides[index]?.layout !== "Blank"}
                                            suppressContentEditableWarning={true}
                                            ref={titleRef}
                                            data-type="title"
                                            onInput={(e) => handleTextInput(e, index, "title")}
                                            onClick={(e) => handleCursorUpdatetitle(e, index)}
                                            onPaste={(e) => handlePaste(e)}
                                            style={{
                                                ...getStylesByLayout(slides[index]?.layout, "title"),
                                                fontFamily: slides[index]?.titleFont || "Arial",
                                                textDecoration: slides[index]?.istitleunderline ? "underline" : "none",
                                                textAlign: slides[index]?.alignitemstitle || "center",
                                            }}
                                        >

                                        </div>

                                        {slides[index]?.layout === "Two Content" ?
                                            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>


                                                <div
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={true}
                                                    ref={subtitleRef}
                                                    data-type="subtitle"
                                                    onInput={(e) => handleTextInput(e, index, "subtitle")}
                                                    onClick={(e) => handleCursorUpdatesubtitle(e, index)}
                                                    onPaste={(e) => handlePaste(e)}
                                                    style={{
                                                        ...getStylesByLayoutSubtitle(slides[index]?.layout, index, "subtitle"),
                                                        fontFamily: slides[index]?.subtitleFont || "Arial",
                                                        textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                                                        textAlign: slides[index]?.alignitemssubtitle || "center",

                                                    }}
                                                ></div>
                                                <div
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={true}
                                                    ref={subtitleReftwo}
                                                    data-type="subtitletwo"
                                                    onInput={(e) => handleTextInput(e, index, "subtitletwo")}
                                                    onClick={(e) => handleCursorUpdatesubtitletwo(e, index)}
                                                    onPaste={(e) => handlePaste(e)}
                                                    style={{
                                                        ...getStylesByLayoutSubtitleTwo(slides[index]?.layout, index, "subtitle"),
                                                        fontFamily: slides[index]?.subtitleFonttwo || "Arial",
                                                        textDecoration: slides[index]?.issubtitleunderlinetwo ? "underline" : "none",
                                                        textAlign: slides[index]?.alignitemssubtitletwo || "center",
                                                    }}
                                                ></div>
                                            </div> : slides[index]?.layout !== "Title Only" && (

                                                <div
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={true}
                                                    ref={subtitleRef}
                                                    data-type="subtitle"
                                                    onInput={(e) => handleTextInput(e, index, "subtitle")}
                                                    onClick={(e) => handleCursorUpdatesubtitle(e, index)}
                                                    onPaste={(e) => handlePaste(e)}
                                                    style={{
                                                        ...getStylesByLayoutSubtitle(slides[index]?.layout, index, "subtitle"),
                                                        fontFamily: slides[index]?.subtitleFont || "Arial",
                                                        textDecoration: slides[index]?.issubtitleunderline ? "underline" : "none",
                                                        textAlign: slides[index]?.alignitemssubtitle || "center",
                                                    }}
                                                ></div>
                                            )}

                                        {slide?.images.map((img, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                style={{
                                                    // width: `${imagePositions[index]?.images[imgIndex]?.w}px`,
                                                    // height: `${imagePositions[index]?.images[imgIndex]?.h}px`,
                                                    position: "absolute",
                                                    display: "inline-block",
                                                    cursor: "move",
                                                }}

                                                ref={slideRef}
                                                onMouseDown={(e) => handleImageMouseDown(e, imgIndex, index, img)}
                                            >
                                                <Rnd
                                                    style={{ border: "1px solid #ddd", position: "relative" }}
                                                    default={{
                                                        x: dimensions[index]?.images[imgIndex]?.x || 0,
                                                        y: dimensions[index]?.images[imgIndex]?.y || 0,
                                                        width: dimensions[index]?.images[imgIndex]?.width || 220,
                                                        height: dimensions[index]?.images[imgIndex]?.height || 150,
                                                    }}
                                                    maxWidth={400}
                                                    maxHeight={300}
                                                    onDragStop={(e, d) => {
                                                        setDimensions((prevPositions) => {
                                                            const updatedPositions = Array.isArray(prevPositions) ? [...prevPositions] : [];
                                                            if (!updatedPositions[index]) {
                                                                updatedPositions[index] = { images: [] };
                                                            }
                                                            updatedPositions[index].images[imgIndex] = {
                                                                ...updatedPositions[index]?.images[imgIndex],
                                                                x: d.x,
                                                                y: d.y,
                                                            };
                                                            return updatedPositions;
                                                        });
                                                    }}
                                                    onResizeStop={(e, direction, ref, delta, position) => {
                                                        setDimensions((prevPositions) => {
                                                            const updatedPositions = Array.isArray(prevPositions) ? [...prevPositions] : [];
                                                            if (!updatedPositions[index]) {
                                                                updatedPositions[index] = { images: [] };
                                                            }
                                                            updatedPositions[index].images[imgIndex] = {
                                                                ...updatedPositions[index]?.images[imgIndex],
                                                                x: position.x,
                                                                y: position.y,
                                                                width: parseInt(ref.style.width, 10),
                                                                height: parseInt(ref.style.height, 10),
                                                            };
                                                            return updatedPositions;
                                                        });
                                                    }}
                                                >
                                                    <img
                                                        src={img.src}
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            height: "100%",
                                                            pointerEvents: "none", // Prevent interference with drag
                                                        }}
                                                    />
                                                    <div
                                                        onMouseDown={(e) => handleRemoveImage(imgIndex, index)}
                                                        style={{
                                                            position: "absolute",
                                                            top: "5px", // Adjust distance from the top of the Rnd container
                                                            right: "5px", // Adjust distance from the right of the Rnd container
                                                            width: "15px",
                                                            height: "15px",
                                                            cursor: "pointer",
                                                            fontWeight: "bold",
                                                            color: "#808080",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "24px",
                                                            borderRadius: "50%",
                                                        }}
                                                        className="cancel-icon"
                                                    >
                                                        &times;
                                                    </div>
                                                </Rnd>

                                            </div>
                                        ))}




                                        {(headerfooter?.isfootertext


                                        ) &&
                                            <div
                                                style={{
                                                    width: "100%", // Full width of Box
                                                    fontSize: "16px",
                                                    padding:
                                                        headerfooter?.isfootertext ||
                                                            headerfooter?.isSlidenumber ? "10px" : "15px",
                                                    backgroundColor: headerfooter?.isheaderfootercolor && headerfooter?.headerfootercolor || "", // Background color of the div
                                                    color: headerfooter?.isheaderfootercolor && "white" || "black",
                                                    boxSizing: "border-box", // Ensure padding is included in the size calculation
                                                    paddingLeft: "20px", // Optional padding adjustments for text
                                                    paddingRight: "20px", // Optional padding adjustments for text
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,

                                                }}
                                            >
                                                <p>{headerfooter?.isfootertext && headerfooter?.footertext || ""}</p>
                                                <p>{headerfooter?.isSlidenumber && index + 1 || ""}</p>

                                            </div>
                                        }
                                    </Box>
                                </>
                            ))}
                        </Grid >

                    </Grid>
                </Grid>

            </>
            <br />
            <br />
            <Box>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={editOpen}
                    // onClose={handleEditClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                        marginTop: "80px",
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>

                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography sx={userStyle.HeaderText}>
                                        ADD PPT
                                    </Typography>
                                    <Link to="/pptcategory&subcategory" target="_blank">
                                        <Button
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            ADD Category
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: powerpoint.categoryname,
                                                value: powerpoint.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setPowerpoint({
                                                    ...powerpoint,
                                                    categoryname: e.value,
                                                    subcategoryname:
                                                        "Please Select Subcategory",
                                                    documentname: ""
                                                });
                                                fetchSubcategoryBasedEdit(e?.value);
                                                // setThemeNames([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub-Category Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: powerpoint.subcategoryname,
                                                value: powerpoint.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setPowerpoint({
                                                    ...powerpoint,
                                                    subcategoryname: e.value,
                                                    documentname: ""
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Category Template"
                                            value={powerpoint.documentname}
                                            onChange={(e) => {
                                                setPowerpoint({ ...powerpoint, documentname: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={12} sm={12} xs={12}>
                                    <br />
                                    <br />
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <LoadingButton
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={handlesubmit}
                                        >
                                            Save
                                        </LoadingButton>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={() => {
                                                handleEditClose();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Dialog
                open={headerFooterEl}
                onClose={handleHeaderFooterClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        handlesubmitHeaderFooter()
                    },
                }}
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogTitle>Header & Footer</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                sx={{ width: "100px" }}
                                control={
                                    <Checkbox

                                        checked={!!headerfooterForChoose.isheadertext}
                                        onChange={() =>
                                            setHeaderfooterForChoose((prev) => ({
                                                ...prev,
                                                isheadertext: !prev.isheadertext,
                                            }))
                                        }
                                    />
                                }
                                label="Header"
                            />
                        </FormControl>
                        <TextField
                            variant={headerfooterForChoose.isheadertext ? "outlined" : "filled"}
                            disabled={!headerfooterForChoose.isheadertext}
                            value={headerfooterForChoose.headertext}
                            onChange={(e) =>
                                setHeaderfooterForChoose((prev) => ({
                                    ...prev,
                                    headertext: e.target.value,
                                }))
                            }
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel
                            sx={{ width: "100px" }}
                            control={
                                <Checkbox
                                    checked={!!headerfooterForChoose.isfootertext}
                                    onChange={() =>
                                        setHeaderfooterForChoose((prev) => ({
                                            ...prev,
                                            isfootertext: !prev.isfootertext,
                                        }))
                                    }
                                />
                            }
                            label="Footer"
                        />
                        <TextField
                            variant={headerfooterForChoose.isfootertext ? "outlined" : "filled"}
                            disabled={!headerfooterForChoose.isfootertext}
                            value={headerfooterForChoose.footertext}
                            onChange={(e) =>
                                setHeaderfooterForChoose((prev) => ({
                                    ...prev,
                                    footertext: e.target.value,
                                }))
                            }
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel
                            sx={{ width: "150px" }}
                            control={
                                <Checkbox
                                    checked={!!headerfooterForChoose.isSlidenumber}
                                    onChange={() =>
                                        setHeaderfooterForChoose((prev) => ({
                                            ...prev,
                                            isSlidenumber: !prev.isSlidenumber,
                                        }))
                                    }
                                />
                            }
                            label="Slide Number"
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel
                            sx={{ width: "100px" }}
                            control={
                                <Checkbox
                                    checked={!!headerfooterForChoose.isheaderfootercolor}
                                    onChange={() =>
                                        setHeaderfooterForChoose((prev) => ({
                                            ...prev,
                                            isheaderfootercolor: !prev.isheaderfootercolor,
                                        }))
                                    }
                                />
                            }
                            label="Color"
                        />
                    </FormGroup>
                    <input
                        type="color"
                        style={{ width: "50%" }}
                        disabled={!headerfooterForChoose.isheaderfootercolor}
                        value={headerfooterForChoose.headerfootercolor || "#000000"}
                        onChange={(e) =>
                            setHeaderfooterForChoose((prev) => ({
                                ...prev,
                                headerfootercolor: e.target.value,
                            }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleHeaderFooterClose}>Cancel</Button>
                    <Button type="submit">OK</Button>
                </DialogActions>
            </Dialog>


            <LoadingBackdrop open={isLoading} />
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
        </Box >
    );
};

export default Powerpoints;
