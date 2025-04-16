export const userStyle = {
    next: {
        display: "flex", justifyContent: 'end',
        marginRight: "40px",
        '& .css-9rn24h-MuiButtonBase-root-MuiButton-root:hover ': {
            backgroundColor: "#72bb4c",
        },
        '& .css-1xvd9mr-MuiButtonBase-root-MuiButton-root:hover': {
            backgroundColor: "#8ec9e7",
        },
        '@media only screen and (max-width: 1120px)': {
            marginLeft: "50px",
            justifyContent: 'center',
        },
        '@media only screen and (max-width: 600px)': {
            marginLeft: "10px",
        },
        '@media only screen and (max-width: 400px)': {
            marginRight: "50px",
            display: "flex",
            flexDirection: "column", alignItems: "center"
        },
    },

    commandStyle: {
        fontSize: "1.2rem",
        fontFamily: "jostMedium",
        color: "#5756A2",
        '@media only screen and (max-width: 900px) and (min-width :600px)': {
            fontSize: "1rem",
        },
        '@media only screen and (max-width: 600px) and (min-width :200px)': {
            fontSize: "0.8rem",
        },
    },
    Previousbutton: {
        
        fontFamily: "JostMedium",
        backgroundColor: "##1287EC",
        borderRadius: "5px",
        marginRight:"280px",
        width: "180px",
        padding: "10px",
        '@media (max-width: 700px)': {
            width: "90px",
            padding: "5px",
            paddingRight: "-3px",
            fontSize: "10px", marginLeft: "250px"
        },
        '@media (max-width: 400px)': {
            width: "90px",
            padding: "5px",
            fontSize: "9px",
             marginLeft: "250px"
        },


    },
    nextbutton: {
       
        fontFamily: "JostMedium",
        backgroundColor: "#1287EC",
        borderRadius: "5px",
        width: "180px",
        marginRight:"50px",
        padding: "10px",
        '@media (max-width: 700px)': {
            width: "90px",
            padding: "5px",
            fontSize: "10px"
        },
        '@media (max-width: 400px)': {
            width: "90px",
            padding: "5px",
            fontSize: "9px",
            marginLeft: "2px"
        },

    },
    container: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflow: 'hidden',
        height: 'max-content',
        padding: '30px',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: 'none',
        fontFamily: ' JostMedium',

        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    paymentpro: {
        fontFamily: "JostMedium",
        fontSize: "24px",
        fontWeight: "bolder",
        margin: "10px 0px 10px 0px",
        color: 'rgb(2, 2, 108)',
        '@media only screen and (max-width: 900px) and (min-width :600px)': {
            fontSize: "1rem",
        },
        '@media only screen and (max-width: 600px) and (min-width :200px)': {
            fontSize: "0.9rem",
        },
    },
    heading: {
        marginTop: "30px",
        color: "#171A1C ",
        fontSize: "38px",
        fontWeight: 700,
        marginRight:"100px",
      
        fontFamily: ' JostMedium',
        textAlign: "center",
        '@media only screen and (max-width: 600px)': {
            marginTop: "20px",
            marginBottom: "-20px",
            fontSize: "30px",
            textAlign: "center",
        },
        '@media only screen and (max-width: 500px)': {
            fontSize: "25px",
            textAlign: "center",
            marginLeft:"30px"
        },
        '@media only screen and (max-width: 300px)': {
            fontSize: "20px",
            textAlign: "center",
             marginLeft:"30px"
        },
    },
    containerview: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflow: 'auto',
        height: 'max-content',
        minWidth: '100%',
        padding: '30px',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: 'none',
        fontFamily: 'auto',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    selectcontainer: {
        color: 'rgb(97, 97, 97)',
        overflow: 'visible',
        height: 'max-content',
        padding: '50px',
        borderRadius: 'none',
        fontFamily: 'auto',
        '@media only screen and (max-width: 600px)': {
            padding: '40px',
        },
        '@media only screen and (max-width: 500px)': {
            padding: '30px',
        },
        '@media only screen and (max-width: 400px)': {
            padding: '20px',
        },
        '@media only screen and (max-width: 300px)': {
            padding: '8px',
            marginLeft: "0px"
        },
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    dialogbox: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflowY: 'visible',
        height: 'max-content',
        padding: '20px',
        maxWidth: '100% !important',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: 'none',
        fontFamily: 'auto',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    viewcontainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflow: 'hidden',
        height: 'max-content',
        padding: '50px',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: 'none',
        fontFamily: 'auto',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    HeaderText: {
        fontFamily: "Inter, Helvetica, sans-serif;",
        fontSize: "32px",
        fontWeight: "500",
        margin: "10px 0px 10px 0px",
        color: '#444 !important',
    },

    SubHeaderText: {
        fontSize: "18px",
        display: "inline-block",
        fontWeight: "400",
        lineHeight: "1",
        color: '#444 !important',
    },
    titletxt: {
        fontSize: "16px",
        display: "inline-block",
        fontWeight: "400",
        lineHeight: "1",
        color: '#444 !important',
    },
    topdropdown: {
        border: '1px solid white',
        borderRadius: '4px',

    },

    selectwhite: {
        color: 'white',
        '& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon': {
            color: 'white',
        },
        '&:hover': {
            '& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon': {
                color: 'white',
            },
        },
    },

    buttongrp: {
        backgroundColor: '#f4f4f4',
        color: '#444',
        borderRadius: '3px',
        boxShadow: 'none',
        fontSize: '12px',
        padding: '4px 6px',
        
        border: '1px solid black',

    },
    printcls: {
        display: 'none',
        '@media print': {
            display: 'block',
        },
    },


    loginbox: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflow: 'hidden',
        height: 'max-content',
        display: 'block',
        margin: 'auto',
        width: '450px',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 0px 20px #00000029',
        borderRadius: '9px',
        fontFamily: 'auto',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',
        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },
    input: {
        '& input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        }
    },
    btncancel: {
        backgroundColor: '#f4f4f4',
        color: '#444',
        boxShadow: 'none',
        borderRadius: '3px',
        border: '1px solid black',
        '&:hover': {
            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                backgroundColor: '#f4f4f4',
            },
        },
    },
    btnUploadcircle: {
        backgroundColor: '#f4f4f4',
        color: '#444',
        minWidth: '40px',
        boxShadow: 'none',
        borderRadius: '5px',
        marginTop: '-5px',
        // textTransform: 'capitalize',
        border: '1px solid #0000006b',
        '&:hover': {
            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                backgroundColor: '#f4f4f4',
            },
        },
    },
    customfileupload: {

        display: 'inline-block',
        border: '1px solid #b7b4b4',
        padding: '5px 45px',
        cursor: 'pointer',
        borderRadius: '3px',
        background: '#d2cfcf'
    },
    linkstyle: {
        textDecoration: 'none',
        color: '#fff'
    },
    actionbutton: {
        minWidth: '0px',
        boxShadow: '2px 2x #00000036',
        // background: 'white',
        padding: '6px'
    },

    Todoadd: {
        height: '30px',
        minWidth: '30px',
        padding: '6px 10px',
        marginTop: '28px',
        '@media only screen and (max-width: 600px)': {
            marginTop: '6px',
        },
    },

    uploadbtn: {
        background: 'rgb(25 118 210)',
        color: '#ffffff',
        appearance: 'none',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        padding: '7px',
        width: 'max-content',
        border: '0px',
        borderRadius: '3px',
    },
    uploadcancel: {
        background: 'f4f4f4',
        color: '#444',
        appearance: 'none',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        padding: '5px',
        width: 'max-content',
        border: '0px',
        borderRadius: '3px',

    },
    dataTablestyle: {
        display: "flex",
        margin: '10px 0px',
        justifyContent: 'space-between',
        '@media (max-width: 800px)': {
            display: "grid",
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center'
        },
    },

    paginationbtn: {
        color: "inherit",
        // textTransform: "capitalize",
        minWidth: '45px',
        // border: '1px solid rgba(0, 0, 0, 0.3)',
        //     boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        // background:"linear-gradient(to bottom, rgba(230, 230, 230, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)",
        '&:hover': {
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            background: 'linear-gradient(to bottom, #333 0%, rgb(0 0 0 / 66%) 100%)',
            color: "white",
        },
        '&.active': {
            backgroundColor: '#f4f4f4',
            color: '#444',
            boxShadow: 'none',
            borderRadius: '3px',
            border: '1px solid #0000006b',
        }
    },

    tableheadstyle: {
        display: 'flex',
        gap: '10px',
        height: 'max-content',
        width: 'max-content',
    },

    //HOME PAGE
    taskboxes: {
        padding: '16px',
        borderRadius: '7px',
        background: 'white',
        boxShadow: '0px 0px 10px #96909029',
    },
    taskboxesicons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#eca82c',
        borderRadius: '50%',
        color: 'white',
        height: '100%',
        padding: '25px 25px',
        width: 'fit-content',
        boxShadow: '0px 0px 8px #302f2f6e',
    },
    taskboxesiconsone: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#a3636e',
        borderRadius: '50%',
        color: 'white',
        height: '100%',
        padding: '25px 25px',
        width: 'fit-content',
        boxShadow: '0px 0px 8px #302f2f6e',
    },
    totaltaskicon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#D5C0DF',
        borderRadius: '50%',
        color: 'white',
        height: '100%',
        padding: '25px 25px',
        width: 'fit-content',
        boxShadow: '0px 0px 8px #302f2f6e',
    },
    homepagecontainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        overflow: 'hidden',
        minHeight: '350px',
        height: 'max-content',
        padding: '30px',
        boxShadow: '0px 0px 10px #96909029',
        borderRadius: 'none',
        fontFamily: 'auto',
        '& .MuiTable-root': {
            borderBottom: 'none !important',
            paddingTop: '20px',
            paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
            fontSize: '18px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            background: '#8080800f',
            border: '1px solid #00000021',

        },
        '& .MuiOutlinedInput-root': {
            height: '40px',
        }
    },

    Todoadd1: {
        height: '30px',
        minWidth: '20px',
        padding: '19px 13px',
        // marginTop: '-8px',
        // '@media only screen and (max-width: 600px)' :{
        //     marginTop: '-6px',
        // },
    },

    descriptioncontainer: {
        minHeight: '200px',
        '@media only screen and (max-width: 600px)': {
            minHeight: '300px',
        },
    },
    todobtn: {
        minWidth: '20px',
        minHeight: '41px',
        background: 'transparent',
        boxShadow: 'none',
        marginTop: '-13px !important',
        '&:hover': {
            background: '#f4f4f4',
            borderRadius: '50%',
            minHeight: '41px',
            minWidth: '20px',
            boxShadow: 'none',
            // marginTop:'-8px',
        },
    },
    todobtnsecond: {
        minWidth: '20px',
        minHeight: '41px',
        background: 'transparent',
        boxShadow: 'none',
        marginTop: '-3px !important',
        '&:hover': {
            background: '#f4f4f4',
            borderRadius: '50%',
            minHeight: '41px',
            minWidth: '20px',
            boxShadow: 'none',
            // marginTop:'-8px',
        },
    },


    //taskboard design  
    taskboardcontainer: {
        background: '#bfbebe5c',
        height: '100vh',
        padding: '20px',
        overflowY: 'auto'
    },
    taskboardbox: {
        background: 'white',
        padding: '11px',
        boxShadow: '0px 0px 10px #afaaaa8f'
    },
    taskboardbtn: {
        // textTransform: 'capitalize',
        padding: '3px',
        color: '#42c8ff59',
        // background: '#42c8ff59',
        borderRadius: '43%',
        fontSize: '11px'
    },

    //taskdetailpage
    btncanceltask: {
        backgroundColor: '#F4F4F4',
        color: '#444',
        padding: '7px 14px',
        boxShadow: 'none',
        borderRadius: '3px',
        border: '1px solid black',
        
        '&:hover': {
            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                backgroundColor: '#F4F4F4',
            },
        },
    },
    tabpanelstyle: {
        height: '250px', minHeight: '250px', overflow: 'auto',
        borderRadius: '4px',
        color: '#333333',
        border: "1PX SOLID #D9D9D9",
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    tablelistStyle: {
        backgroundColor: "white !important",
        color: 'Black !important',
        boxSizing: 'border-box',
        border: '1px solid #C3C3C3',
        boxShadow: '0px 0px 4px #B7B1B1',
    },

    btncomplete: {
        
        padding: '7px 19px',
        background: "#00905d",
        height: 'fit-content'
    }

}
export const useraccessStyle = {
    // containercontentdisplay: {

    //     display: 'flex',
    //     fontSize: '17px',
    //     marginBottom: "30px",
    // "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input  ": {
    //     fontFamily: "JostMedium",
    // },
    // '@media only screen and (max-width: 1150px)': {
    // display: "flex", flexDirection: "column", width: "70vw"
    // },
    //     '@media (max-width: 600px)': {
    //         width: "70vw",
    //         fontSize: '13px',
    //         flexFlow: 'column !important',
    //     },
    //     '@media (max-width: 500px)': {
    //         fontSize: '13px',
    //         flexFlow: 'column !important',
    //     },
    //     '@media (max-width: 200px)': {
    //         fontSize: '10px',
    //         flexFlow: 'column !important',
    //     },
    //     '& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root': {
    //         fontFamily: "JostMedium",
    //         '@media only screen and (max-width: 1150px)': {
    //             textAlign: "start"
    //         },
    //         fontSize: '17px',
    //         '@media (max-width: 500px)': {
    //             fontSize: '13px',
    //         },
    //         '@media (max-width: 200px)': {
    //             fontSize: '10px',
    //         },
    //     },
    //     '& .css-ahj2mt-MuiTypography-root': {
    //         fontSize: '17px',
    //         '@media (max-width: 500px)': {
    //             fontSize: '13px',
    //         },
    //         '@media (max-width: 200px)': {
    //             fontSize: '10px',
    //         },
    //     }
    // },
    pageresponsive: {
        marginBottom: "35px"
    },
    // container: {
    //     paddingTop: "30px"
    // },
    containercontentdisplay: {
        display: 'flex',
        marginTop: "45px",
        paddingLeft: "100px",
        '& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root': {
            marginTop: "5px",
            fontSize: '20px',
            '@media (max-width: 600px)': {
                marginTop: "-2px",
                fontSize: '15px',
            },
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        "& .rmsc .dropdown-heading ": {
            backgroundColor: "#f4f6fd",
            height: "46px",
            border: " 2px solid #8cc1db",
        },
        '@media only screen and (max-width: 1150px) ': {
            display: "flex", flexDirection: "column", width: "82vw",
            marginTop: "30px",
            "& .css-1ld3b9g-MuiGrid-root>.MuiGrid-item": {
                paddingLeft: "40px",
                textAlign: "left"
            },
            "& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root": {
                textAlign: "left"
            }
        },
        '@media only screen and (max-width: 550px)': {
            width: "84vw",
            paddingLeft: "60px",
        },
        '@media only screen and (max-width: 450px)': {
            width: "84vw",
            paddingLeft: "50px",
            "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
                fontSize: "15px"
            }
        },
        '@media only screen and (max-width: 350px)': {
            width: "84.5vw",
            paddingLeft: "40px",
            "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
                fontSize: "13px",
            }
        },
    },
    containercontentdisplaycheck: {
        display: 'flex',
        marginTop: "45px",
        paddingLeft: "100px",
        '& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root': {
            marginTop: "5px",
            fontSize: '20px',
            '@media (max-width: 600px)': {
                // marginTop: "-2px",
                fontSize: '15px',
            },
            '@media (max-width: 500px)': {
                marginTop: "12px",
                fontSize: '13px',
            },
            '@media (max-width: 400px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        '@media only screen and (max-width: 1150px)': {
            display: "flex",
            width: "80vw",
            marginTop: "30px",
            "& .css-1ld3b9g-MuiGrid-root>.MuiGrid-item": {
                paddingLeft: "40px",
                textAlign: "left"
            },
            "& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root": {
                textAlign: "left"
            }
        },
        '@media only screen and (max-width: 550px)': {
            width: "84vw",
            paddingLeft: "60px",
        },
        '@media only screen and (max-width: 450px)': {
            width: "84vw",
            paddingLeft: "50px",
            "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
                fontSize: "15px"
            }
        },
        '@media only screen and (max-width: 350px)': {
            width: "84.5vw",
            paddingLeft: "40px",
            "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
                fontSize: "13px",
            }
        },
    },
    containercontentdisplaytable: {
        display: 'flex',
        marginTop: "45px",
        paddingLeft: "80px",
        width: "70vw",
        '& .css-1ygcj2i-MuiTableCell-root': { padding: "5px", backgroundColor: '#007AFF' },
        '& .css-1ex1afd-MuiTableCell-root': { padding: "5px", backgroundColor: '#007AFF', },

        '@media only screen and (max-width: 1150px) ': {
            paddingLeft: "50px",
            display: "flex",
            width: "67vw",
            marginTop: "30px",
            "& .css-1ld3b9g-MuiGrid-root>.MuiGrid-item": {
                paddingLeft: "40px",
                textAlign: "left"
            },
            "& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root": {
                textAlign: "left"
            }
        },
        '@media only screen and (max-width: 900px) ': {
            paddingLeft: "60px",
            display: "flex",
            width: "90vw",
        },
        '@media only screen and (max-width: 700px) ': {
            paddingLeft: "50px",
            display: "flex",
            width: "87vw",
        },
        '@media only screen and (max-width: 500px) ': {
            paddingLeft: "50px",
            display: "flex",
            width: "85vw",
        },
        '@media only screen and (max-width: 400px) ': {
            paddingLeft: "40px",
            display: "flex",
            width: "80vw",
        },

    },
    
    //     display: 'flex',
    //     marginTop: "45px",
    //     paddingLeft: "50px",
    //     '& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root': {
    //         marginTop: "5px",
    //         fontSize: '20px',
    //         '@media (max-width: 600px)': {
    //             marginTop: "-2px",
    //             fontSize: '15px',
    //         },
    //         '@media (max-width: 500px)': {
    //             fontSize: '13px',
    //         },
    //         '@media (max-width: 200px)': {
    //             fontSize: '10px',
    //         },
    //     },
    //     '@media only screen and (max-width: 1150px)': {
    //         display: "flex", flexDirection: "column", width: "82vw",
    //         marginTop: "30px",
    //         "& .css-1ld3b9g-MuiGrid-root>.MuiGrid-item": {
    //             paddingLeft: "40px",
    //             textAlign: "left"
    //         },
    //         "& .css-9npbnl-MuiFormLabel-root-MuiInputLabel-root": {
    //             textAlign: "left"
    //         }
    //     },
    //     '@media only screen and (max-width: 550px)': {
    //         width: "84vw",
    //         paddingLeft: "60px",
    //     },
    //     '@media only screen and (max-width: 450px)': {
    //         width: "84vw",
    //         paddingLeft: "50px",
    //         "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    //             fontSize: "15px"
    //         }
    //     },
    //     '@media only screen and (max-width: 350px)': {
    //         width: "84.5vw",
    //         paddingLeft: "40px",
    //         "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    //             fontSize: "13px",
    //         }
    //     },
    // },


    uploadbutton: {
        border: " 2px solid #D03D56",
        fontFamily: "JostMedium",
        backgroundColor: "#E3E3E3",
        borderRadius: "0px",
        width: "110px",
        padding: "15px",
        color: "white",
        '&:hover': {
            background: 'rgb(255,204,165)',
            border: " 2px solid rgb(255,204,165)",
            color: "#444 !important"
            // marginTop:'-8px',
        },
        '@media (max-width: 700px)': {
            width: "90px",
            padding: "5px",
            fontSize: "10px"
        },
        '@media (max-width: 400px)': {
            width: "90px",
            padding: "5px",
            fontSize: "9px",
        },
    },
    uploadimagecontent: {
        fontSize: '15px',
        padding: '15px',
        border: '2px solid #8CC1DB',
        display: "flex",
        fontFamily: 'jostMedium',
        color: '#5756A2',
        justifyContent: 'center',
        width: '50%',
        height: '80%',
        '@media (max-width: 500px)': {
            fontSize: '10px',
        },
        '@media (max-width: 200px)': {
            fontSize: '8px',
        },
        '& .css-tgvdpk-MuiTypography-root': {
            fontSize: '15px',
            padding: '15px',
            border: '1px solid red',
            width: '50%',
            height: '80%',
            '@media (max-width: 500px)': {
                fontSize: '10px',
            },
            '@media (max-width: 200px)': {
                fontSize: '8px',
            },
        }
    },
    // container: {
    //     padding: 0,
    //     margin: 0
    // },
    containernavbar: {
        // background: 'rgb(36,0,31)', 
        background: 'linear-gradient(90deg, rgba(36,0,31,1) 0%, rgba(176,51,116,0.9472163865546218) 58%, rgba(107,6,69,1) 100%)',
        color: 'white'
    },
    navbarheading: {
        padding: '15px',
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        '@media (max-width: 900px)': {
            fontSize: '15px',
        },
        '@media (max-width: 600px)': {
            fontSize: '10px',
        },
        '@media (max-width: 300px)': {
            fontSize: '9px',
        }
    },
    containerquestion: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingLeft: '20px',
        boxShadow: '10px 10px #d8d3d3',
        borderRadius: '10px',
    },
    questionheading: {
        fontSize: '25px',
        color: '#7d0461',
        '@media (max-width: 900px)': {
            fontSize: '20px',
        },
        '@media (max-width: 600px)': {
            fontSize: '15px',
        },
        '@media (max-width: 300px)': {
            fontSize: '10px',
        }
    },
    questiontext: {
        textAlign: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        '& .css-ahj2mt-MuiTypography-root': {
            '@media (max-width: 900px)': {
                fontSize: '15px',
            },
            '@media (max-width: 600px)': {
                fontSize: '10px',
            },
            '@media (max-width: 300px)': {
                fontSize: '9px',
            }
        }

    },
    questionheadtext: {
        fontSize: '20px',
        '@media (max-width: 900px)': {
            fontSize: '15px',
        },
        '@media (max-width: 600px)': {
            fontSize: '10px',
        },
        '@media (max-width: 300px)': {
            fontSize: '9px',
        }
    },
    questionoptions: {
        justifyContent: "center", textAlign: "center",
        width: "200px",
        '@media (max-width: 900px)': {
            fontSize: '15px',
        },
        '@media (max-width: 600px)': {
            fontSize: '10px',
        },
        '@media (max-width: 300px)': {
            fontSize: '9px',
        }
    },
    nextbutton: {
        // background: 'rgb(108,67,20)',
        background: 'linear-gradient(90deg, rgba(108,67,20,1) 0%, rgba(120,13,94,1) 48%, rgba(123,20,129,1) 93%)'
    },
    //registration page container
    registercontainerone: {

    },
    containeronecontentone: {
        fontSize: '18px',
        color: 'black',
        textAlign: 'justify',
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },
        '& .css-ahj2mt-MuiTypography-root': {
            fontSize: '18px',
            color: 'black',
            textAlign: 'justify',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
    },
    containeronecontenttwo: {
        fontFamily: ' JostMedium',
        fontSize: '18px',
        color: 'black',
        textAlign: "center",
        fontWeight: '800',
        marginTop: "20px",
        // color: "red",
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },

    },
    containeronecontenttwotext: {
        fontFamily: ' JostMedium',
        fontSize: '19px',
        color: "#616161",
        '@media (max-width: 500px)': {
            fontSize: '12px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },

    },


    containertwocontentone: {
        letterSpacing: "1px",
        paddingLeft: 0,
        textIndent: '25px',
        textAlign: 'center',
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },
        '&  .css-ahj2mt-MuiTypography-root': {
            letterSpacing: "1px",
            textIndent: '25px',
            textAlign: 'center',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        '& .css-xor7ac-MuiTypography-root': {
            letterSpacing: "1px",
            textAlign: 'center',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        '& .css-3078li-MuiTypography-root': {
            letterSpacing: "1px",
            textAlign: 'center',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        }
    },
    containertwocontentoneh: {
        letterSpacing: "1px",
        paddingLeft: 0,
        textIndent: '25px',
        textAlign: 'justify',
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },
        '&  .css-ahj2mt-MuiTypography-root': {
            letterSpacing: "1px",
            textIndent: '25px',
            textAlign: 'justify',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        '& .css-xor7ac-MuiTypography-root': {
            letterSpacing: "1px",
            textAlign: 'justify',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
        '& .css-3078li-MuiTypography-root': {
            letterSpacing: "1px",
            textAlign: 'justify',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        }
    },
    containertwocontentwo: {
        fontFamily: ' JostMedium',
        color: "#5756a2",
        paddingRight: "8px",
        fontSize: "22px",
        textIndent: '30px',
        letterSpacing: "2px",
        textDecoration: 'underline',
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        }
    },
    containercontentthree: {
        fontFamily: ' JostMedium',
        '& .MuiInput-input': {
            fontFamily: ' JostMedium',
            borderBottom: "2px solid #5756a2",
            width: '90px', // Set the desired width here
        },
        padding: "20px",
        textAlign: 'center',
        border: "2px solid #5756a2",
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        }
    },

    tableheading: {
        color: 'red',
        fontSize: '18px',
        '@media (max-width: 500px)': {
            fontSize: '13px',
        },
        '@media (max-width: 200px)': {
            fontSize: '10px',
        },
        '& .css-1kivl2a-MuiTypography-root': {
            color: 'red',
            fontSize: '18px',
            '@media (max-width: 500px)': {
                fontSize: '13px',
            },
            '@media (max-width: 200px)': {
                fontSize: '10px',
            },
        },
    },
    tablebuttoncontainer: {
        display: 'flex',
        justifyContent: "end",
        fontSize: '15px',
        '@media (max-width: 500px)': {
            fontSize: '10px',
        },
        '@media (max-width: 200px)': {
            fontSize: '8px !important',
        },
        '& .css-1sgazdd-MuiButtonBase-root-MuiButton-root': {
            fontSize: '15px',
            '@media (max-width: 500px)': {
                fontSize: '10px',
            },
            '@media (max-width: 200px)': {
                fontSize: '8px !important',
            },
        },
        '& .css-3z2x6k-MuiButtonBase-root-MuiButton-root': {
            fontSize: '15px',
            '@media (max-width: 500px)': {
                fontSize: '10px',
            },
            '@media (max-width: 200px)': {
                fontSize: '8px',
            },
        }
    },


}