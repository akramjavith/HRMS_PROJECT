export const userStyle = {
  container: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "hidden",
    height: "max-content",
    padding: "30px",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },
  // excelbox: {
  //     backgroundColor: 'rgb(255, 255, 255)',
  //     color: 'rgb(97, 97, 97)',
  //     overflowX: 'auto',
  //     overflowY: 'hidden',
  //     height: 'max-content',
  //     padding: '30px',
  //     boxShadow: '0px 0px 20px #00000029',
  //     borderRadius: 'none',
  //     fontFamily: 'auto',
  //     '& .MuiTable-root': {
  //         borderBottom: 'none !important',
  //         paddingTop: '20px',
  //         paddingBottom: '20px',
  //     },
  //     '& .MuiTableCell-root': {
  //         fontSize: '18px',
  //     },
  //     '& .MuiOutlinedInput-notchedOutline': {
  //         background: '#8080800f',
  //         border: '1px solid #00000021',

  //     },
  //     '& .MuiOutlinedInput-root': {
  //         height: '40px',
  //     }
  // },

  containerview: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "auto",
    height: "max-content",
    minWidth: "100%",
    padding: "30px",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },
  selectcontainer: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "visible",
    height: "max-content",
    padding: "30px",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },
  dialogbox: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflowY: "visible",
    height: "max-content",
    padding: "20px",
    maxWidth: "100% !important",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },
  viewcontainer: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "hidden",
    height: "max-content",
    padding: "50px",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },
  HeaderText: {
    fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
    fontSize: "24px",
    fontWeight: "500",
    margin: "0px 0px 10px 0px",
    color: "#444 !important",
  },

  SubHeaderText: {
    fontSize: "18px",
    display: "inline-block",
    fontWeight: "400",
    lineHeight: "1",
    color: "#444 !important",
  },
  titletxt: {
    fontSize: "16px",
    display: "inline-block",
    fontWeight: "400",
    lineHeight: "1",
    color: "#444 !important",
  },

  topdropdown: {
    border: "1px solid white",
    borderRadius: "4px",
  },

  selectwhite: {
    color: "white",
    "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
      color: "white",
    },
    "&:hover": {
      "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
        color: "white",
      },
    },
  },

  buttongrp: {
    backgroundColor: "#f4f4f4",
    color: "#444",
    borderRadius: "3px",
    boxShadow: "none",
    fontSize: "12px",
    padding: "4px 6px",
    textTransform: "capitalize",
    border: "1px solid #8080808f",
    "@media only screen and (max-width: 767px)": {
      fontSize: "8px",
      marginRight: '5px'
    },
  },

  printcls: {
    display: "none",
    "@media print": {
      display: "block",
    },
  },

  loginbox: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "hidden",
    height: "max-content",
    display: "block",
    margin: "auto",
    width: "450px",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 0px 20px #00000029",
    borderRadius: "9px",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },

  btncancel: {
    backgroundColor: "#f4f4f4",
    color: "#444",
    boxShadow: "none",
    borderRadius: "3px",
    border: "1px solid #0000006b",
    "&:hover": {
      "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
        backgroundColor: "#f4f4f4",
      },
    },
  },
  btnUploadcircle: {
    backgroundColor: "#f4f4f4",
    color: "#444",
    minWidth: "40px",
    boxShadow: "none",
    borderRadius: "5px",
    marginTop: "-5px",
    textTransform: "capitalize",
    border: "1px solid #0000006b",
    "&:hover": {
      "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
        backgroundColor: "#f4f4f4",
      },
    },
  },
  customfileupload: {
    display: "inline-block",
    border: "1px solid #b7b4b4",
    padding: "5px 45px",
    cursor: "pointer",
    borderRadius: "3px",
    background: "#d2cfcf",
  },
  linkstyle: {
    textDecoration: "none",
    color: "#fff",
  },
  actionbutton: {
    minWidth: "0px",
    boxShadow: "2px 2x #00000036",
    // background: 'white',
    padding: "6px",
  },

  Todoadd: {
    height: "30px",
    minWidth: "30px",
    padding: "6px 10px",
    marginTop: "28px",
    "@media only screen and (max-width: 600px)": {
      marginTop: "6px",
    },
  },

  uploadbtn: {
    background: "rgb(25 118 210)",
    color: "#ffffff",
    appearance: "none",
    fontFamily: "sans-serif",
    cursor: "pointer",
    padding: "7px",
    width: "max-content",
    border: "0px",
    borderRadius: "3px",
  },
  uploadcancel: {
    background: "f4f4f4",
    color: "#444",
    appearance: "none",
    fontFamily: "sans-serif",
    cursor: "pointer",
    padding: "5px",
    width: "max-content",
    border: "0px",
    borderRadius: "3px",
  },
  dataTablestyle: {
    display: "flex",
    margin: "10px 0px",
    justifyContent: "space-between",
    "@media (max-width: 800px)": {
      display: "grid",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  },

  paginationbtn: {
    color: "inherit",
    textTransform: "capitalize",
    minWidth: "45px",
    // border: '1px solid rgba(0, 0, 0, 0.3)',
    //     boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    // background:"linear-gradient(to bottom, rgba(230, 230, 230, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)",
    "&:hover": {
      boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      background: "linear-gradient(to bottom, #333 0%, rgb(0 0 0 / 66%) 100%)",
      color: "white",
    },
    "&.active": {
      backgroundColor: "#f4f4f4",
      color: "#444",
      boxShadow: "none",
      borderRadius: "3px",
      border: "1px solid #0000006b",
    },
  },

  tableheadstyle: {
    display: "flex",
    // gap: '3px',
    width: "100%",
    padding: "0px 3px",
    justifyContent: "space-between",
    lineHeight: "1rem",
    fontWeight: "550",
    fontSize: "12px",
  },

  //HOME PAGE
  taskboxes: {
    padding: "16px",
    borderRadius: "7px",
    background: "white",
    boxShadow: "0px 0px 10px #96909029",
  },
  taskboxesicons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eca82c",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "25px 25px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },
  taskboxesiconsone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#a3636e",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "25px 25px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },

  //new dashboard
  totaltaskiconemp: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#5ad39b",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "15px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },

  totaltaskiconleave: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#d3c05a",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "15px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },


  totaltaskiconnotice: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ec7f2d",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "15px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },

  totaltaskiconrelieve: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#d3695a",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "15px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },

  totaltaskiconnotcheck: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#d35a89",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "15px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },

  taskboxeshome: {
    padding: "16px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0px 0px 10px #96909029",
    maxHeight: "104px"
  },
  //end

  totaltaskicon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#D5C0DF",
    borderRadius: "50%",
    color: "white",
    height: "100%",
    padding: "25px 25px",
    width: "fit-content",
    boxShadow: "0px 0px 8px #302f2f6e",
  },
  homepagecontainer: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(97, 97, 97)",
    overflow: "hidden",
    minHeight: "350px",
    height: "max-content",
    padding: "30px",
    boxShadow: "0px 0px 10px #96909029",
    borderRadius: "none",
    fontFamily: "auto",
    "& .MuiTable-root": {
      borderBottom: "none !important",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    "& .MuiTableCell-root": {
      fontSize: "18px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      background: "#8080800f",
      border: "1px solid #00000021",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
    },
  },

  Todoadd1: {
    height: "30px",
    minWidth: "20px",
    padding: "19px 13px",
    // marginTop: '-8px',
    // '@media only screen and (max-width: 600px)' :{
    //     marginTop: '-6px',
    // },
  },

  descriptioncontainer: {
    minHeight: "200px",
    "@media only screen and (max-width: 600px)": {
      minHeight: "300px",
    },
  },
  todobtn: {
    minWidth: "20px",
    minHeight: "41px",
    background: "transparent",
    boxShadow: "none",
    marginTop: "-13px !important",
    "&:hover": {
      background: "#f4f4f4",
      borderRadius: "50%",
      minHeight: "41px",
      minWidth: "20px",
      boxShadow: "none",
      // marginTop:'-8px',
    },
  },
  todobtnsecond: {
    minWidth: "20px",
    minHeight: "41px",
    background: "transparent",
    boxShadow: "none",
    marginTop: "-3px !important",
    "&:hover": {
      background: "#f4f4f4",
      borderRadius: "50%",
      minHeight: "41px",
      minWidth: "20px",
      boxShadow: "none",
      // marginTop:'-8px',
    },
  },

  //taskboard design
  taskboardcontainer: {
    background: "#bfbebe5c",
    height: "100vh",
    padding: "10px 10px",
    overflowY: "auto",
  },
  taskboardbox: {
    background: "white",
    padding: "11px",
    boxShadow: "0px 0px 10px #afaaaa8f",
  },
  taskboardbtn: {
    textTransform: "capitalize",
    padding: "3px",
    color: "#42c8ff59",
    // background: '#42c8ff59',
    borderRadius: "43%",
    fontSize: "11px",
  },

  //taskdetailpage
  btncanceltask: {
    backgroundColor: "#F4F4F4",
    color: "#444",
    padding: "7px 14px",
    boxShadow: "none",
    borderRadius: "3px",
    border: "1px solid #0000006b",
    textTransform: "capitalize !IMPORTANT",
    "&:hover": {
      "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
        backgroundColor: "#F4F4F4",
      },
    },
  },
  tabpanelstyle: {
    height: "250px",
    minHeight: "250px",
    overflow: "auto",
    borderRadius: "4px",
    color: "#333333",
    border: "1PX SOLID #D9D9D9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  tablelistStyle: {
    backgroundColor: "white !important",
    color: "Black !important",
    boxSizing: "border-box",
    border: "1px solid #C3C3C3",
    boxShadow: "0px 0px 4px #B7B1B1",
  },

  btncomplete: {
    textTransform: "capitalize !IMPORTANT",
    padding: "7px 19px",
    background: "#00905d",
    height: "fit-content",
  },

  errordialogbox: {
    boxSizing: " border-box",
    padding: " 15px 15px 15px 27px",
    borderRadius: "7px",
    color: "#6f6a6a",
    backgroundColor: "#fbfbfb",
    boxShadow: "0 0 12px #999",
    fontSize: "1em",
    lineHeight: "1.2em",
    position: "relative",
    opacity: "0.9",
    marginTop: "15px",
  },

  canvasHidden: {
    display: "hidden",
  },
  canvasShow: {
    display: "visible",
  },

  //new taskboard design
  taskboardbox_ui: {
    background: "white",
    padding: "5px",
    borderLeft: "solid",
    borderLeftColor: "#80008091",
    boxShadow: "0px 0px 10px #afaaaa8f",
    borderRadius: "5px",
    minHeight: "80px",
    overflow: "hidden",
    borderWidth: "thick",
  },

  //new taskboard design
  taskboardbox_dev: {
    background: "white",
    padding: "5px",
    borderLeft: "solid",
    borderLeftColor: "#1976d291",
    boxShadow: "0px 0px 10px #afaaaa8f",
    borderRadius: "5px",
    minHeight: "80px",
    overflow: "hidden",
    borderWidth: "thick",
  },
  buttongrpexp: {
    backgroundColor: "#f4f4f4",
    color: "#444",
    borderRadius: "3px",
    boxShadow: "none",
    fontSize: "12px",
    padding: "4px 6px",
    textTransform: "capitalize",
    border: "1px solid #8080808f",
    marginRight: '5px'
  },
  //new taskboard design
  taskboardbox_test: {
    background: "white",
    padding: "5px",
    borderLeft: "solid",
    borderLeftColor: "#e3b052",
    boxShadow: "0px 0px 10px #afaaaa8f",
    borderRadius: "5px",
    minHeight: "80px",
    overflow: "hidden",
    borderWidth: "thick",
  },

  input: {
    '& input[type=number]': {
      'MozAppearance': 'textfield' //#8b5cf6
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      'WebkitAppearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      'WebkitAppearance': 'none',
      margin: 0
    }
  },

  hideArrows: {
    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
  },
};

// SELECT DROPDOWN STYLES
export const colourStyles = {
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "black",
      // fontWeight:900
    };
  },
  menuList: (styles) => ({
    ...styles,
    background: "white",
    maxHeight: "200px",
    boxShadow: "0px 0px 5px #00000052",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    // color:'black',

    color: isFocused ? "rgb(255 255 255, 0.5)" : isSelected ? "white" : "black",
    background: isFocused ? "rgb(25 118 210, 0.7)" : isSelected ? "rgb(25 118 210, 0.5)" : null,
    zIndex: 1,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10000,
  }),
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? "1px solid #4A7BF7" : "1px solid #4A7BF7",
    boxShadow: state.isFocused ? "1px solid rgb(185,125,240)" : "1px solid rgb(185,125,240)",
    "&:hover": {
      border: state.isFocused ? "1px solid #4A7BF7" : "1px solid #4A7BF7",
    },
  }),
};

export const selectDropdownStyles = {
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "black",
      // fontWeight:900
    };
  },
  menuList: (styles) => ({
    ...styles,
    background: "white",
    maxHeight: "250px",
    position: "absolute",
    width: "100%",
    boxShadow: "0px 0px 5px #00000052",
  }),
  // Set a higher z-index for the dropdown menu
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // Adjust the value as needed
    position: "absolute",
  }),
  control: (base, state) => ({
    ...base,
    "&:hover": {
      border: state.isFocused ? "1px solid #4A7BF7" : "1px solid #4A7BF7",
    },
  }),
};

// SELECT DROPDOWN STYLES
export const colourStylesEdit = {
  menuList: (styles) => ({
    ...styles,
    background: "white",
    maxHeight: "170px !important",
    boxShadow: "0px 0px 5px #00000052",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isFocused ? "rgb(255 255 255, 0.5)" : isSelected ? "white" : "black",
    background: isFocused ? "rgb(25 118 210, 0.7)" : isSelected ? "rgb(25 118 210, 0.5)" : null,
    zIndex: 1,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10000,
    maxHeight: "120px !important",
  }),
};

// const tasks = [
//   {id:'123',
//    uidesign:[{taskdev:'user1', state:'running'},{taskdev:'user2', state:''}],
//    develop:[{taskdev:'user1', state:''},{taskdev:'user2', state:''}],
//    testing:[{taskdev:'user1', state:''},{taskdev:'user2', state:''}],
//   },
// {id:'456',
//  uidesign:[{taskdev:'user1', state:''},{taskdev:'user2', state:''}],
//  develop:[{taskdev:'user2', state:''},{taskdev:'user2', state:''}],
//  testing:[{taskdev:'user1', state:''},{taskdev:'user2', state:''}],
// }
// ]
