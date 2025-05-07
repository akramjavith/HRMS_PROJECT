import { Box, Typography, OutlinedInput, TableBody, Checkbox,Select, MenuItem, Dialog, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import React, { useState , useContext, useEffect } from "react";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import {colourStyles, userStyle } from "../../../../pageStyle";
import Selects from "react-select";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { AuthContext } from '../../../../context/Appcontext';
import { handleApiError } from "../../../../components/Errorhandling";
import { SERVICE } from '../../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { Link } from "react-router-dom";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


const UseForm = ()=>{
    const[name , setName] = useState('');
    const[type , setType] = useState('');
    const[options , setOptions] = useState(''); 
    const[check , setCheck] = useState(false);
    const[useFormTodo , setUseFormTodo] = useState([])
    const[show , setShow]= useState(false);
    const[required , setrequired]= useState(false)
    const[maxValue , setmaxValue]= useState('')
    const[minValue , setminValue]= useState('')
    const[maxLength , setmaxLength]= useState('')
    const[pattern , setpattern]= useState('');
    const[nameEdit , setNameEdit] = useState('');
    const[typeEdit , setTypeEdit] = useState('');
    const[checkEdit , setCheckEdit] = useState(false);
    const[showEdit , setShowEdit]= useState(false);
    const[requiredEdit , setrequiredEdit]= useState(false)
    const[maxValueEdit , setmaxValueEdit]= useState('')
    const[minValueEdit , setminValueEdit]= useState('')
    const[maxLengthEdit , setmaxLengthEdit]= useState('')
    const[patternEdit , setpatternEdit]= useState('');
    const [formData, setFormData] = useState({});
    const [editSubmitIndex, setEditSubmitIndex] = useState('');
    const { register, handleOnSubmit, formState: { errors } } = useForm();
    const { auth } = useContext(AuthContext);

        // Error Popup model
        const [isErrorOpen, setIsErrorOpen] = useState(false);
        const [showAlert, setShowAlert] = useState()
        const handleClickOpenerr = () => {
            setIsErrorOpen(true);
        };
        const handleCloseerr = () => {
            setIsErrorOpen(false);
        };

            // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };



    const handleSubmit= ()=>{
        let answerTodo = {
            name: name,
            type: type,
            options: options,
            show: show,
            required : required,
            max : maxValue,
            min : minValue,
            maxlength : Number(maxLength),
            pattern : pattern,
        };
        setUseFormTodo([...useFormTodo , answerTodo]);
        setName("")
        setType("")
        setShow(false)
        setCheck(false)
        setrequired(false)
        setmaxValue("")
        setminValue("")
        setmaxLength("")
        setpattern("")
     
    }


    const handleGenerate = async ()=>{
        let resmod = await axios.post(SERVICE.CUSTOMFORM_CREATE, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            formtype: useFormTodo
        })
       setShow(true);    

    }

    const selectType = [{label:"Text", value:"text"} ,
    {label:"Password", value:"password"},
    {label:"Search", value:"search"},
    {label:"Checkbox", value:"checkbox"},
    {label:"Radio", value:"radio"},
    {label:"Number", value:"number"},
    {label:"Teaxtarea", value:"textarea"},
    {label:"Email", value:"email"},
    {label:"Range", value:"range"},
    {label:"Search", value:"search"},
    {label:"Tel", value:"tel"},
    {label:"Url", value:"url"},
    {label:"Time", value:"time"},
    {label:"Date", value:"date"},
    {label:"Week", value:"week"},
    {label:"Month", value:"month"},
    ]

  const handleFieldChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };


    const handleFieldSelection = (e) => {
    const selectedField = e.target.value;
    if (selectedField !== 'none') {
        setUseFormTodo([...useFormTodo, selectedField]);
    }
  };

  //Edit For SubMit 
  const getCode = (index)=>{
    setEditSubmitIndex(index)
    handleClickOpenerr();
    setNameEdit(useFormTodo[index].name)
    setTypeEdit(useFormTodo[index].type)
    setShowEdit(useFormTodo[index].show)
    setrequiredEdit(useFormTodo[index].required)
    setmaxValueEdit(useFormTodo[index].max)
    setminValueEdit(useFormTodo[index].min)
    setmaxLengthEdit(useFormTodo[index].maxlength)
    setpatternEdit(useFormTodo[index].pattern)
  }

  const handleDelete = (index)=>{
    const newSelectedFiles = [...useFormTodo];
    newSelectedFiles.splice(index, 1);
    setUseFormTodo(newSelectedFiles)
  }

  //update call for Temporary Adding of Data's
  const handleUpdateSubmit = ()=>{
    useFormTodo[editSubmitIndex].name = nameEdit;
    useFormTodo[editSubmitIndex].type = typeEdit;
    useFormTodo[editSubmitIndex].show = showEdit;
    useFormTodo[editSubmitIndex].required = requiredEdit;
    useFormTodo[editSubmitIndex].min = minValueEdit;
    useFormTodo[editSubmitIndex].max = maxValueEdit;
    useFormTodo[editSubmitIndex].maxlength = maxLengthEdit;
    useFormTodo[editSubmitIndex].pattern = patternEdit;
    handleCloseerr();
  }
  
  //View Code for an particular Row 
  const[viewRowWiseForm , setViewRowWiseForm] = useState([])
  const getViewCode = async (rowid) => {
    try {
      let res = await axios.get(SERVICE.CUSTOMFORMS_LIST, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        } 
    });
    let result = res.data.useFormList.filter((data)=> data.formid === rowid);
    setViewRowWiseForm(result);
    handleClickOpenview();
} catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
}




  const[useFormList , setUseFormList] = useState([])
  //fetching the data's stored in an array
  const gettingCustomFormsList = async () => {
      try {
        let res = await axios.get(SERVICE.CUSTOMFORMS, {
          headers: {
              'Authorization': `Bearer ${auth.APIToken}`
          } 
      });
      let result = res.data.Useform.filter((data)=> data);
      setUseFormList(result);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  
  const modifiedData = 
  useFormList.map((person) => ({
      ...person,
  }));

  const[interview,setInterview] = useState([])

  const fetchInterviewquestions = async () => {
    try {
        let res_priority = await axios.get(SERVICE.INTERVIEWQUESTION, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            }
        });
        const priorityall = res_priority?.data?.interviewquestions?.map((d) => (
            {
                ...d,
                label: d.name,
                value: d.name
            }
        ));
        setInterview(priorityall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
};

useEffect(() => {
    fetchInterviewquestions();
}, [])



  
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
  }, [modifiedData])
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
  







 
    return(  
        <>
     
         <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small" >
                                <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Name"
                                    value={name}
                                    onChange={(e)=> setName(e.target.value)}
                                /> */}
                                 <Selects
                                        options={interview}
                                        styles={colourStyles}
                                        value={{ label: name, value: name }}
                                        onChange={(e)=> setName(e.value)}

                                    />
                            </FormControl>
                    </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>         
                        <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small" >
                                    <Typography>Type <b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                            options={selectType}
                                            styles={colourStyles}
                                            value={{ label: type, value: type }}
                                            onChange={(e) => { setType(e.value);  }}

                                        />
                                </FormControl>
                        </Grid>
                    </Grid>
                   {type === 'radio' ? <> <Grid container spacing={2}> 
                  <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small" >
                                <Typography>Options <b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Enter options Separated by ;"
                                    value={options}
                                    onChange={(e)=> setOptions(e.target.value)}
                                />
                            </FormControl>
                    </Grid>
                    </Grid> </> : ""}
                    <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} sx={{display:"flex"}}>
                                    <Checkbox  checked={check} onChange={(e) => {setCheck(e.target.checked)}} />
                                    <Typography sx={{marginTop: 2.7}} >Show Validation <b style={{ color: "red" }}>*</b> </Typography>    
                            </Grid>
                    </Grid>
                                 { check && <>
                                    <Grid container spacing={2}>
                                                <Grid item md={2} xs={12} sm={12}  sx={{display:"flex"}}>
                                                <Checkbox  checked={required} onChange={(e) => {setrequired(e.target.checked)}} />
                                                <Typography sx={{marginTop: 2.7}} >Required<b style={{ color: "red" }}>*</b></Typography> 
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                    <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Max</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Max"
                                                    value={maxValue}
                                                    onChange={(e)=> setmaxValue(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Min</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Min"
                                                    value={minValue}
                                                    onChange={(e)=> setminValue(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                    <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>MaxLength<b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter maxLength"
                                                    value={maxLength}
                                                    onChange={(e)=> setmaxLength(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                    <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Pattern</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Pattern"
                                                    value={pattern}
                                                    onChange={(e)=> setpattern(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            </Grid>
                                    </>
                    }
           <br></br>
         <br></br>
         <Grid container spacing={2}> 
                   { name && type && maxLength  ? <><Grid item md={2} xs={12} sm={12}>
                        <Button variant="contained" onClick={handleSubmit}>ADD</Button>
                    </Grid></> :""}
                   { useFormTodo.length > 0 ?
                   <>
                  <Grid item md={2} xs={12} sm={12}>
                        <Button variant="contained" onClick={handleGenerate}>Submit</Button>
                    </Grid>
                    </> 
                     : ""}
          </Grid>
         <br></br>
         <br></br>
         <br></br>
{useFormTodo.length > 0 && useFormTodo.map((data , index)=>{
    return(
        <Grid sx={{display:'flex'}}>
        <Typography>{data.name}{" "}</Typography>
        <Button><EditOutlinedIcon onClick={()=>getCode(index)}/>        </Button>
        <Button><DeleteOutlineOutlined onClick={()=>handleDelete(index)}/></Button>
        </Grid>
    )
})}





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
                                                    <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' , width:"20"}}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' ,width:40}}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Type</Box><Box sx={{ marginTop: '-6PX' ,width:20}}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Minimum</Box><Box sx={{ marginTop: '-6PX' , width:10 }}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Maximum</Box><Box sx={{ marginTop: '-6PX' , width:10 }}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>maximum length</Box><Box sx={{ marginTop: '-6PX' , width:10}}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                     <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Required</Box><Box sx={{ marginTop: '-6PX' , width:10}}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell> 
                                                     <StyledTableCell onClick={() => handleSorting('formtype')}><Box sx={userStyle.tableheadstyle}><Box>Pattern</Box><Box sx={{ marginTop: '-6PX' , width:50 }}>{renderSortingIcon('formtype')}</Box></Box></StyledTableCell>
                                                     <StyledTableCell onClick={() => handleSorting('action')}><Box sx={userStyle.tableheadstyle}><Box>Action</Box><Box sx={{ marginTop: '-6PX' , width:50 }}>{renderSortingIcon('action')}</Box></Box></StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {filteredData.length > 0 ? (
                                                    filteredData?.map((row, index) => (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                            <StyledTableCell colspan={7}>
                                                    {row.formtype.map((item, i) => (
                                                        <Grid container spacing={1} key={i}>
                                                            <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                                {i + 1}. &ensp;
                                                            </Grid>
                                                            <Grid item md={1.5} sm={2.5} xs={2.5}>
                                                                &ensp; {item?.name}
                                                            </Grid>
                                                            <Grid item md={1.5} sm={2} xs={2}>
                                                                {item?.type}
                                                            </Grid>
                                                            <Grid item md={1.5} sm={2} xs={2}>
                                                                {item?.min}
                                                            </Grid>
                                                            <Grid item md={2} sm={3.8} xs={3.8}>
                                                                {item?.max}
                                                            </Grid>
                                                            <Grid item md={1.9} sm={2} xs={2}>
                                                                {item?.maxlength}
                                                            </Grid>
                                                            <Grid item md={1.5} sm={2} xs={2}>
                                                                {item?.required}
                                                            </Grid>
                                                            <Grid item md={1} sm={2} xs={2}>
                                                                {item?.pattern}
                                                            </Grid>
                                                        </Grid>
                                                    ))}

                                                </StyledTableCell>             
                                                <StyledTableCell>{
                                                    <>
                                                    <Button variant="contained">Copy</Button>
                                                    <Link to={`../hr/recruitment/formgenerate/${row._id}`}><Button variant="contained">Generate</Button></Link>
                                                    <Button variant="contained" onClick={()=>getViewCode(row._id)}>View</Button>
                                                    </>}</StyledTableCell>
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                <Typography sx={{fontWeight:'bold' , fontSize: 15}}>Form Details :</Typography><br></br>
                <br></br>

                {
                    viewRowWiseForm && viewRowWiseForm.map((data , index)=>{
                        return(
                            <Grid item md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small" >
                                <Typography>{index+1}. {data.formtype} </Typography>
                            </FormControl>
                    </Grid>
                        )
                    })
                }
                <br></br>
                <br></br>
                <Grid item md={2} xs={12} sm={12}>
                        <Button variant="contained" onClick={handleCloseview}>Back</Button>
                    </Grid>
                </Box>
            </Dialog>







            {/* ALERT DIALOG */}
            < Box >
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <Box  sx={userStyle.dialogbox} >
                    <Box >
                    <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small" >
                                <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Name"
                                    value={nameEdit}
                                    onChange={(e)=> setNameEdit(e.target.value)}
                                /> */}
                                  <Selects
                                        options={interview}
                                        styles={colourStyles}
                                        value={{ label: nameEdit, value: nameEdit }}
                                        onChange={(e)=> setNameEdit(e.value)}

                                    />
                            </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small" >
                                <Typography>Type <b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                        options={selectType}
                                        styles={colourStyles}
                                        value={{ label: typeEdit, value: typeEdit }}
                                        onChange={(e) => { setTypeEdit(e.value);  }}

                                    />
                            </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{display:"flex"}}>
                            <Checkbox  checked={checkEdit} onChange={(e) => {setCheckEdit(e.target.checked)}} />
                            <Typography sx={{marginTop: 2.7}} >Show Validation<b style={{ color: "red" }}>*</b></Typography>    
                    </Grid>
                                 { checkEdit && <>
                                 
                                            <Grid item md={2} xs={12} sm={12}  sx={{display:"flex"}}>
                                            <Checkbox  checked={requiredEdit} onChange={(e) => {setrequiredEdit(e.target.checked)}} />
                                            <Typography sx={{marginTop: 2.7}} >Required<b style={{ color: "red" }}>*</b></Typography> 
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Max</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Max"
                                                    value={maxValueEdit}
                                                    onChange={(e)=> setmaxValueEdit(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Min</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Min"
                                                    value={minValueEdit}
                                                    onChange={(e)=> setminValueEdit(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>MaxLength</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter maxLength"
                                                    value={maxLengthEdit}
                                                    onChange={(e)=> setmaxLengthEdit(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Pattern</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Pattern"
                                                    value={patternEdit}
                                                    onChange={(e)=> setpatternEdit(e.target.value)}
                                                />
                                            </FormControl>
                                            </Grid>
                                    </>
                    }
                    

         </Grid><br></br>
                    </Box>
                    <DialogActions>
                    <Grid item md={2} xs={12} sm={12}>
                    <Button variant="contained" onClick={handleUpdateSubmit}>Update</Button>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                        <Button variant="contained" onClick={handleCloseerr}>Cancel</Button>
                    </Grid>
                    </DialogActions>
                    </Box>
                </Dialog>
            </Box >
        </>

    )
}

export default UseForm;

































// import React, { useState } from 'react';

// export default function App() {
//   const [formData, setFormData] = useState({});
  
//   // Define an array of field configurations
//   const fields = [
//     { name: 'Field1', type: 'text', required: true, minLength: 2, maxLength: 10 },
//     { name: 'Field2', type: 'number', required: true, min: 1, max: 100 },
//     { name: 'Field3', type: 'email', required: true },
//     // Add more fields with their configurations as needed
//   ];

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <form>
//       {fields.map((field, index) => (
//         <div key={index}>
//           <label>{field.name}</label>
//           <input
//             type={field.type}
//             name={field.name}
//             required={field.required}
//             minLength={field.minLength}
//             maxLength={field.maxLength}
//             min={field.min}
//             max={field.max}
//             onChange={handleInputChange}
//           />
//         </div>
//       ))}

//       <div>
//         <strong>Form Data:</strong>
//         <pre>{JSON.stringify(formData, null, 2)}</pre>
//       </div>
//     </form>
//   );
// }




