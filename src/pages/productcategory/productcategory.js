import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Box,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,  
  TableRow,  
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Modal 
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';



import getService from '../../services/getEnum.service'
import headerService from '../../services/header.service';
import adminService from '../../services/admin.service';
   
import productcategoryService from '../../services/productcategory.service';
import noti from '../../utils/noti';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },  
  { id: 'isEnable', label: 'Enable', alignRight: false },
  { id: '' },
];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  } 
  return stabilizedThis.map((el) => el[0]);
}

const statusEnable = ["Enable             ", "Disable          "]

export default function ProductCategory() {  
  
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [productCategorys, setProductCategorys] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [productCategoryId, setProductCategoryId] = useState("");

  const [openEnable, setOpenEnable] = useState(false);

  const [isEnable, setIsEnable] = useState("");

  const handleChangeName = (event) => {
    setName(event.target.value) 
  }

  const handlechangeDescription = (event) => {
    setDescription(event.target.value) 
  }
  const handleChangeStatusEnable = (event) =>{
    setIsEnable(event.target.value)
  }
  
  const handleClose = () => {
    setOpen(false)   
    setOpenEnable(false)

    clearScreen(); 
  }
  const handleClickEdit = (id, name) => {
    productcategoryService.GetProductCategoryById(id).then(
      response => { 
        if (response.data && response.data.success) {
          const temp = response.data.data.productCategories
          setProductCategoryId(temp.id);
          setName(temp.name);
          setDescription(temp.description)
          setOpen(true)
          
        }
        
      }, error => {
        setSuccess(!success)
      }
    )
    
  };
  const handleClickDelete = (id) => {
    if(window.confirm(noti.CONFIRM_DELETE)) {
      productcategoryService.DeleteProductCategoryById(id).then(
        response => { 
          if (response.data && response.data.success) {
            alert(noti.DELETE_SUCCESS)
            setSuccess(!success);
          }
          
        }, error => {
          alert(noti.ERROR)
          setSuccess(!success)
        }
      )
    }
    
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    setSelected([]);
  };

  const handleClickNew = () => {
    setOpen(true);
    
  }
  const handleClickSubmitEnable = () => {
    if(isEnable) {
      if(isEnable === statusEnable[0]) {
        productcategoryService.EnablePutProductCategoryById(productCategoryId).then(
          response => {
            if(response.data  && response.data.success) {
              alert(noti.ENABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
            }
          }, error => {
            setSuccess(!success)
          }
        )
        
      } 
      else if(isEnable === statusEnable[1]) {
        productcategoryService.DisablePutProductCategoryById(productCategoryId).then(
          response => {
            if(response.data  && response.data.success) {
              alert(noti.DISABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
            }
            
          }, error => {
            setSuccess(!success)
          }
        )        
      }
    } else {
      alert(noti.CONFIRM_CHOOSE_STATUS);
    }
  }

  const handleClickEditEnable = (id) =>{    
    setProductCategoryId(id);
    setOpenEnable(true)
    
  }
  
  
  const clearScreen = () =>{
    setProductCategoryId("");
    setName("");
    setDescription("");
    setIsEnable("")
  }
  const handleClickCancel = () => {  
    setOpen(false);  
    setOpenEnable(false)
    
    clearScreen()
  }

  const handleClickSubmit = () => {
    if (name && description) {
      if(productCategoryId === "") {
        productcategoryService.PostProductCategory(name, description).then(
          response => { 
            if(response.data && response.data.success) {
              alert(noti.CREATE_SUCCESS)
              setSuccess(true)
              setOpen(false);  
              clearScreen();
    
            }
            
          }, error => {
            alert(noti.ERROR)
            setSuccess(!success)
          }
        )
      } else {
        productcategoryService.PutProductCategoryById(name, description, productCategoryId).then(
          response => { 
            if(response.data && response.data.success) {
              alert(noti.EDIT_SUCCESS)
              setSuccess(true)
              setOpen(false);  
              clearScreen();  
            }
            
          }, error => {
            alert(noti.ERROR)
            setSuccess(!success)
          }
        )
      }  
    } else {
      alert(noti.MISSING_DATA)
    }
      
      
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productCategorys.length) : 0;

  const filteredDatas = applySortFilter(productCategorys, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    productcategoryService.ProductCategoryAll().then(
      response =>{
        if(response.data  && response.data.success) {
          
          setProductCategorys(response.data.data.productCategories)
          setSuccess(false)
        }
      }, error =>{
        if(error.response && error.response.status === 401) {
          const token = headerService.refreshToken();
          adminService.refreshToken(token).then(
            response=>{
              if(response.data && response.data.success === true) {
                console.log(response.data)
                localStorage.setItem("token", JSON.stringify(response.data.data));
                setSuccess(!success)
              }
            }
          )
          
        }
        
      }
    )
    
  },[success])

  return (
    <>
      <Helmet>
        <title> ProductCategory  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          ProductCategory
          </Typography>
          <Button onClick={handleClickNew} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New ProductCategory
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}  />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={productCategorys.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, description, isEnable } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">
                        {(isEnable === true ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEditEnable(id)}>Enable</Button>):                           
                          (<Button className='btn btn-warning' onClick={() => handleClickEditEnable(id)}>Disable</Button>)}
                        </TableCell>                         

                        <TableCell align="right">                        
                          <IconButton size="large" color="inherit" onClick={()=>handleClickEdit(id, name)}>
                          <Iconify icon={'eva:edit-fill'}  sx={{ mr: 2 }} />                          
                          </IconButton>
                          <IconButton size="large" color="inherit" onClick={()=>handleClickDelete(id)}>
                          <Iconify  icon={'eva:trash-2-outline'} color="red" sx={{ mr: 2 }} />                        
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productCategorys.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New ProductCategory</DialogTitle>
        <DialogContent>
        <br/>
        <Grid container spacing={2}>
          <Grid xs={12}>
          <Label>Name</Label>
          <TextField 
            name="name" 
            fullWidth
            value={name} 
            required
            onChange={(event) => { handleChangeName(event) }}
            />
          </Grid>
          <Grid xs={12}>
          <Label>Description</Label>
          <TextField 
            name="description" 
            value={description} 
            fullWidth
            required
            onChange={(event) => { handlechangeDescription(event) }}
            />
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          <Button onClick={handleClickSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEnable} onClose={handleClose}>
        <DialogTitle>Edit Enable</DialogTitle>
        <DialogContent> 
        <DialogContentText>
            Please choose Enable or Disable.
          </DialogContentText>
          <Grid container spacing={2}>
          <Grid item xs={12}>
          <Label>Status</Label>
          <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={isEnable}
                  id="country"      
                  onChange= {handleChangeStatusEnable}
                >
                  {statusEnable  && statusEnable.map((option) => (
             <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
          )}
            </TextField>  
          </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          <Button onClick={handleClickSubmitEnable}>Submit</Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}
