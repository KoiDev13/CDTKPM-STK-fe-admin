import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,  
  TableRow,  
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  MenuItem,

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

import productItemService from '../../services/product.item.service'

import headerService from '../../services/header.service';
import AdminService from '../../services/admin.service';
import noti from '../../utils/noti';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';

// mock



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },  
  { id: 'price', label: 'Price', alignRight: false }, 
  { id: 'productCategory', label: 'ProductCategory', alignRight: false },  
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

export default function ProductItem() {  
  const [success, setSuccess] = useState(false)
  
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [productItems, setProductItems] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [productCategoryId, setProductCategoryId] = useState("");

  const [urlImage, setUrlImage] = useState("");

  const [productItemId, setProductItemId]  = useState("");
  
  const [imageUrl, setImageUrl] = useState("/Image/ProductItem");

  const [isEnable, setIsEnable] = useState("");
  const [openEnable, setOpenEnable] = useState(false);

  const handleClickEnable = (id) => {
    setProductItemId(id)
    
  }

  const handleClickChange = (event) => {
    setIsEnable(event.target.value)
  }

  const handleChangeStatusEnable = () => {
    if(isEnable) {
      if(isEnable === statusEnable[0]) {
        productItemService.PutEnableProductItemById(productItemId).then(
          response => {
            if(response.data  && response.data.success === true) {
              alert(noti.ENABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
              setIsEnable("")
            }
          } , error => {
            setSuccess(!success)
          }
        )        
      } 
      else if(isEnable === statusEnable[1]) {
        productItemService.PutDisableProductItemById(productItemId).then(
          response => {
            if(response.data  && response.data.success === true) {
              alert(noti.DISABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
              setIsEnable("")
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

  

  
  const handleClose = () => {
    setOpen(false)    
  }
  const handleClickEdit = (id) => {
    productItemService.GetProductItemById(id).then(
      response => {
        if (response.data && response.data.success) {
          const temp = response.data.data.productItem
          setOpen(true)  
          setProductItemId(temp.id)
          setName(temp.name);
          setDescription(temp.description);
          setPrice(temp.price)
          setProductCategoryId(temp.productCategory.name)
          setUrlImage(`${process.env.REACT_APP_API_URL}${temp.imageUrl}`)
        }
        
      }, error => {
        setSuccess(!success)
      }
    )
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

  
  const handleClickCancel = () => {
    setOpen(false);
    clearInput();
    setOpenEnable(false)
  }
  const clearInput = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("")
    setProductCategoryId("");
    setProductItemId("");
  }
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productItems.length) : 0;

  const filteredDatas = applySortFilter(productItems, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    productItemService.ProductItemAll().then(
      response =>{
        if(response.data  && response.data.success) {
          console.log(response.data.data.productItems)
          setProductItems(response.data.data.productItems)
        }
      }, error => {
        if(error.response && error.response.status === 401) {
          console.log(error.response)
          const token = headerService.refreshToken();
          AdminService.refreshToken(token).then(
            response => {
              console.log(response.data)
              if(response.data && response.data.success === true) {                
                localStorage.setItem("token", JSON.stringify(response.data.data));
                setSuccess(!success)
              }
            }, error => {
              console.log(error)
            }
          )
        }        
      }
    )
    
  },[success])

  return (
    <>
      <Helmet>
        <title> ProductItem  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          ProductItem
          </Typography>          
          
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
                  rowCount={productItems.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, description, price, imageUrl, productCategory, isEnable } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">{price}</TableCell>

                       

                        <TableCell align="left">{productCategory.name}</TableCell>

                        <TableCell align="left">
                        {(isEnable === true ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEnable(id)}>Enable</Button>):                           
                          (<Button className='btn btn-warning' onClick={() => handleClickEnable(id)}>Disable</Button>)}
                        </TableCell>                        

                        <TableCell align="right">                        
                          <IconButton size="large" color="inherit" onClick={()=>handleClickEdit(id)}>
                          <Iconify icon={'ep:view'}  sx={{ mr: 2 }} />                          
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
            count={productItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> ProductItem</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={12}>
          <Label>Name</Label>
          <TextField 
            name="name" 
            fullWidth
            value={name} 
            disabled
            
            />
          </Grid>
          <Grid xs={12}>
          <Label>Description</Label>
          <TextField 
            name="description" 
            value={description} 
            fullWidth
            disabled
            />             
          </Grid>
          <Grid xs={12}>
          <Label>Price</Label>
            <TextField 
              name="price" 
              type="number"
              value={price} 
              fullWidth
              disabled
              />
          </Grid>
          <Grid xs={12}>
          <Label>ProductCategory</Label>
          <TextField 
            name="ProductCategory" 
            value={productCategoryId} 
            fullWidth
            disabled
            />             
          </Grid>
          
          <Grid xs={12}>
          <Label>Image</Label>          
          {(urlImage !== "") && <img src={urlImage} alt="Trulli" width="550" height="333"/>}
          </Grid>
        </Grid>
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
      <Dialog open={openEnable} onClose={handleClose}>
      <DialogTitle>Edit Enable</DialogTitle>
        <DialogContent> 
        <DialogContentText>
            Please choose Enable or Disable.
          </DialogContentText>
        <Grid container spacing={2}>

        <Grid xs={12}>
          <Label>Status</Label>
          <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={isEnable}
                  id="country"      
                  onChange= {handleClickChange}
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
          <Button onClick={handleChangeStatusEnable}>Change</Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}
