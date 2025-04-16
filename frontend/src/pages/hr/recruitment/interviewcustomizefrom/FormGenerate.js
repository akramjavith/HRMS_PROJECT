import { Box, Typography, OutlinedInput, TableBody,Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import React, { useState , useContext, useEffect } from "react";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { userStyle } from "../../../../pageStyle";
import axios from "axios";
import { AuthContext } from '../../../../context/Appcontext';
import { handleApiError } from "../../../../components/Errorhandling";
import { SERVICE } from '../../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useParams } from "react-router-dom";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';


export default function App() {
  const { auth } = useContext(AuthContext);
       // Error Popup model
       const [isErrorOpen, setIsErrorOpen] = useState(false);
       const [formData, setFormData] = useState({});
       const[useFormTodo , setUseFormTodo] = useState([])
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
      setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
      setIsErrorOpen(false);
  };
  const id = useParams().id


  const rowData = async () => {
    try {
      let res = await axios.get(`${SERVICE.CUSTOMFORM_SINGLE}/${id}`, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        } 
    });

    setUseFormTodo( res?.data?.sUseForm?.formtype)
} catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
}
   useEffect(() => {
    rowData();
    }, [])

    const handleFieldChange = (fieldName, value) => {
     
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    };
  
    const handleFieldSelection = (e) => {
        e.preventDefault();
      const selectedField = e.target.value;
      if (selectedField !== 'none') {
          setUseFormTodo([...useFormTodo, selectedField]);
          handleSubmit();
      }
    };
  
const handleSubmit = ()=>{

  handleGenerate();
}
   
const handleGenerate = async ()=>{
    const json_string = JSON.stringify(formData);
    let ans = json_string.replace("{", "").replace("}","").replaceAll('"' , '')
  
    let resmod = await axios.post(SERVICE.CUSTOMFORM_LIST_CREATE, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        },
        formtype: ans,
        formid: id
    })
}

const[useFormList , setUseFormList] = useState([])
//fetching the data's stored in an array
const gettingCustomFormsList = async () => {
    try {
      let res = await axios.get(SERVICE.CUSTOMFORMS_LIST, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        } 
    });
    
   
    setUseFormList(res?.data?.useFormList)
} catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
}

const modifiedData = 
useFormList.map((person) => ({
    ...person,
}));

//List Page Functionalities
const [items, setItems] = useState([]);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
}

useEffect(() => {
    addSerialNumber();
gettingCustomFormsList();
}, [useFormTodo])
//table sorting
const [sorting, setSorting] = useState({ column: '', direction: '' });

const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
};

items.sort((a, b) => {
    if (sorting.direction === 'asc') {
        return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === 'desc') {
        return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
});

const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
        return <>
            <Box sx={{ color: '#bbb6b6' }}>
                <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                    <ArrowDropUpOutlinedIcon />
                </Grid>
                <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                    <ArrowDropDownOutlinedIcon />
                </Grid>
            </Box>
        </>;
    } else if (sorting.direction === 'asc') {
        return <>
            <Box >
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                </Grid>
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                </Grid>
            </Box>
        </>;
    } else {
        return <>
            <Box >
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                </Grid>
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                </Grid>
            </Box>
        </>;
    }
};
//Datatable
const handlePageChange = (newPage) => {
    setPage(newPage);
};

const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
};



//datatable....
const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
};
// Split the search query into individual terms
const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
// Modify the filtering logic to check each term
const filteredDatas = items?.filter((item) => {
  return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
});


const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

const totalPages = Math.ceil(filteredDatas.length / pageSize);

const visiblePages = Math.min(totalPages, 3);

const firstVisiblePage = Math.max(1, page - 1);
const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

const pageNumbers = [];

const indexOfLastItem = page * pageSize;
const indexOfFirstItem = indexOfLastItem - pageSize;

for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
}

let ans;

  return (
    <>
     <Typography sx={{fontSize: 25}}>Form Output</Typography>
        <form onSubmit={handleFieldSelection}>
      { useFormTodo  && useFormTodo?.map((data , index)=>{
            if(data?.type === "text" || data?.type === "password" || data?.type ===  "email" ||data?.type ===  "search" || data?.type === "date" || data?.type === "time" ){
                return(
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>{data.name}</Typography>
                                <FormControl fullWidth size="small" >
                                    <div key={index}>
                                            <input
                                                type={data.type}
                                                name={data.name}
                                                required={data.required}
                                                minLength={data.maxlength}
                                                maxLength={data.maxlength}
                                                min={data.min}
                                                max={data.max}
                                                placeholder={`Enter ${data.name}`}
                                                onChange={(e) => handleFieldChange(data.name, e.target.value)}
                                                value={formData[data.name] || ''}
                                                        />
                                                </div>
                                </FormControl>
                            </Grid>
                        </Grid>
                    
                    </>
                )
            }
            if(data?.type === 'radio'){
               ans = data?.options && data?.options.split(";").map((data)=> data)

                return(
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>{data.name}</Typography>

                               { ans.length > 0 ? ans.map((item)=> (
                               <><FormControl fullWidth size="small" >
                                    <div key={index}>
                                            <input
                                                type={data.type}
                                                name={data.name}
                                                onChange={(e) => {handleFieldChange(data.name, e.target.value)}}
                                                value={item}
                                                        />{item}
                                                </div>
                                </FormControl>
                                </>
                               )
                               )
                                : ""}
                            </Grid>
                        </Grid>
                    
                    </>
                ) 

            }
        })
      }
      <br></br>
           <input type="submit"/>

        </form> 


        <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(useFormList?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <FormControl fullWidth size="small" >
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

                                    {/* ****** Table start ****** */}
                                    <TableContainer component={Paper}>
                                        <Table
                                            sx={{ minWidth: 700, }}
                                            aria-label="customized table"
                                            id="usertable"
                                        >
                                            <TableHead sx={{ fontWeight: "600" }}>
                                                <StyledTableRow>
                                                    <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Form Values</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {filteredData.length > 0 ? (
                                                    filteredData?.map((row, index) => (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                            <StyledTableCell>{row.formtype}</StyledTableCell>               
                                                        </StyledTableRow>
                                                    ))) : <StyledTableRow> <StyledTableCell colSpan={5} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                  {/* ALERT DIALOG */}
                  < Box >
                  <Dialog
                      open={isErrorOpen}
                      onClose={handleCloseerr}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                  >
                      <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                          <Typography variant="h6" >{showAlert}</Typography>
                      </DialogContent>
                      <DialogActions>
                          <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                      </DialogActions>
                  </Dialog>
              </Box >
              </>
  );
}
