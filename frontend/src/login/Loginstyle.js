export const loginSignIn = {
  container: {
    textAlign: 'center',
  },
  moresocialGooglebg: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: "center",
    display: 'flex',
    padding: '5px 10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    // marginTop: '10px',
    cursor: 'pointer',
    minHeight: '42px',
    maxHeight: '40px',
    boxShadow: '0px 1px 1px #ab9d9d  !important',
    // boxShadow: '0px 1px 1px #ab9d9d  !important',
    // width: "200px"
  },
  socialgoogle: {
    height: '36px !important',
    '@media (max-width:750px)': {
      height: '15px !important',
    },
  },

  socialiconstxt: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'GREY',
    fontWeight: 'bold',
    fontSize: '13px',
    '@media (max-width:750px)': {
      fontSize: '13px !important',
    },
  },
  linktext: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffc801',
    textDecoration: "underline",
    fontWeight: 'bold',
    fontSize: '13px',
    '@media (max-width:750px)': {
      fontSize: '13px !important',
    },
  },

  signinBtn: {
    width: "auto",
    color: 'white',
    padding: '9px 15px 9px 15px',
    margin: '0 auto',
    // marginBottom:"0px",
    // width: '100%',
    borderRadius: "10px",
    lineHeight: '20.75px',
    border: 'none',
    // borderRadius: '4px',
    backgroundColor: '#ffc801 !important',
    boxShadow: '0px 5px 18px #d5cbcb00',
    fontSize: '15px',
    fontWeight: "bold",
    cursor: 'pointer',
    display: "flex",
    justifyContent: 'center',

  },

  loginbox: {
    backgroundColor: '#f4f6fd',
    color: 'rgb(97, 97, 97)',
    overflow: 'hidden',
    height: 'max-content',
    display: 'block',
    margin: 'auto',
    width: '700px',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 20px #00000029',
    borderRadius: '50px',
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
  loginboxmedia: {
    backgroundColor: '#f4f6fd',
    color: 'rgb(97, 97, 97)',
    overflow: 'hidden',
    height: 'max-content',
    display: 'block',
    margin: '30px',
    width: 'auto',
    marginTop: "10px",
    paddingY: "50px",
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 20px #00000029',
    borderRadius: '50px',
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
    },
    "@media only screen and (max-width:400px)": {
      boxShadow: '0px 0px 0px',
    }
  },


}
