import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import DialogTitle from '@mui/material/DialogTitle';

import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  
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
  TextField,
  MenuItem,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import Label from '../../components/label';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import { convertStringToTime } from '../../utils/formatTime';
import storeService from '../../services/store.service';
import getService from '../../services/getEnum.service'
import headerService from '../../services/header.service';
import adminService from '../../services/admin.service';
// ----------------------------------------------------------------------
import imageService from '../../services/image.service';
import noti from '../../utils/noti';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },  
  { id: 'openTime', label: 'OpenTime', alignRight: false },
  { id: 'closeTime', label: 'CloseTime', alignRight: false },
  { id: 'isApproved', label: 'Approved', alignRight: false },
  { id: 'isEnable', label: 'Enable', alignRight: false },
  { id: '' },
];


const statusApprove = ["Approve             ", "Reject          "]
const statusEnable = ["Enable             ", "Disable          "]
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
  if ( query.toLowerCase() === "nee" || query.toLowerCase() === "needapproval") {
    return filter(array, (_user) => _user.isApproved === null);
  }
  if (query.toLowerCase() === "app" || query.toLowerCase() === "approved") {
    return filter(array, (_user) => _user.isApproved === true);
  }
  if (query.toLowerCase() === "rej" ||  query.toLowerCase() === "rejected") {
    return filter(array, (_user) => _user.isApproved === true);
  }
    
    
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  } 
  return stabilizedThis.map((el) => el[0]);
}

export default function Store() {  

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [stores, setStores] = useState([])

  const [storeId, setStoreId] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [isApprove, setIsApprove] = useState("");

  const [isEnable, setIsEnable] = useState("");

  const [open, setOpen] = useState(false);

  const [openEnable, setOpenEnable] = useState(false);

  const [openStore, setOpenStore] = useState(false);

  const [success, setSuccess] = useState(false)

  const [bannerUrl, setBannerUrl] = useState("");
  const [urlImage, setUrlImage] = useState("");

  const [openTime, setOpenTime] = useState({
    hour: 0,
    minute: 1
  })
  const [closeTime, setCloseTime] = useState({
    hour: 0,
    minute: 1
  })
  

  const [openTimeText, setOpenTimeText] = useState("")
  const [closeTimeText, setCloseTimeText] = useState("")
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [address, setAddress] = useState({
    wardId:"",
    street:""
  })
  const [provines, setProvines] = useState([]);
  const [provineId, setProvineId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWards] = useState([]);
  

  const handleChangeImageURL = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file)
    imageService.ImageUpload(formData).then(
      response =>{
        if (response.data && response.data.success === true) {
          const temp = response.data.data.imagePath
          setBannerUrl(temp)
          setUrlImage(`${process.env.REACT_APP_API_URL}${temp}`)
        }
         
      }, error => {
        console.log(error)
      }
    )  
  }

  const handleChangeName = (event) => {
    setName(event.target.value) 
  }

  const handlechangeDescription = (event) => {
    setDescription(event.target.value) 
  }

  const handleWardId = (event) => { 
         
    setAddress(prevState => ({ ...prevState,
      wardId:event.target.value,
      street: ""
    }))
  }
  const handleChangeStreet = (event) => {        
    
    setAddress(prevState => ({ ...prevState,
      street:event.target.value}))
  }
  const handleChangeProvineId = (event) => { 
    
    
    getService.getAddressDistrictProvineId(event.target.value).then(
      response =>{
        console.log(response)
        if(response.status === 200 && response.data.data) {
          console.log("success")
          setDistricts(response.data.data.districts);
          
          setAddress({
            wardId: "",
            street: ""
          })
        } 
      }
    )
    setProvineId(event.target.value)
    
  }

  const handleChangeDistrictId = (event) => {  
    getService.getAddressWardDistrictId(event.target.value).then(
      response =>{
        if(response.status === 200 && response.data.data) {
          
          setWards(response.data.data.wards);
          setAddress({
            wardId: "",
            street: ""
          })
        }        
      }
    )
    setDistrictId(event.target.value)
  }
  const handleChangeOpenTime = (event) => {
    
    
    const timeText = event.target.value.split(':')
    
    setOpenTimeText(event.target.value)
    setOpenTime(prevState => ({ ...prevState,
      hour: parseInt(timeText[0], 10),
      minute: parseInt(timeText[1], 10)
    }))
    
  }
  const handleChangeCloseTime = (event) => {

    const timeText = event.target.value.split(':')
    
    setCloseTimeText(event.target.value)
    setCloseTime(prevState => ({ ...prevState,
      hour:parseInt(timeText[0],10),
      minute:parseInt(timeText[1], 10)
    }))
  }
  const handleClickSubmitStore = () => {
    if (name && description && openTimeText && closeTimeText && provineId && districtId && address.wardId && address.street) {
      storeService.PutStoreByAdmin(storeId, name, description, address, openTime, closeTime, bannerUrl).then(
        response => {
          if(response.data && response.data.success === true) {

            alert(noti.EDIT_SUCCESS)
            setOpenStore(false);
            setSuccess(!success)
            
            clearScreen();
          }
        }
      )
    } else {
      alert(noti.MISSING_DATA)
    }
  }

  const clearScreen = () => {
    setName("");
    setDescription("")
    setOpenTime({
      hour: 0,
      minute:0
    })
    setCloseTime({
      hour: 0,
      minute: 0
    })
    setAddress({
      wardId: "",
      street: ""
    });
    setProvineId("")
    setDistrictId("")
    setOpenTimeText("");
    setCloseTimeText("");
    setIsEnable("");
    setStoreId("");
  }

  const handleClickEdit = (id ) => {
    storeService.GetStoreById(id).then(
      response =>{
        if(response.data && response.data.success === true) {
          const temp = response.data.data.store
          console.log(temp)
          setBannerUrl(temp.bannerUrl)
          setUrlImage(`${process.env.REACT_APP_API_URL}${temp.bannerUrl}`)
          setOpenStore(true)
          setStoreId(temp.id)
          setName(temp.name)
          setOpenTime({
            hour: temp.openTime.hour,
            minute: temp.openTime.minute
          })
          setCloseTime({
            hour: temp.closeTime.hour,
            minute: temp.closeTime.minute
          })
          const tempOpenTime = convertStringToTime(temp.openTime);
          const tempCloseTime = convertStringToTime(temp.closeTime)
          setOpenTimeText(tempOpenTime)
          setCloseTimeText(tempCloseTime)
          setDescription(temp.description)
          setProvineId(temp.address.ward.province.id )
          getService.getAddressDistrictProvineId(temp.address.ward.province.id).then(
            response =>{
              if(response.status === 200 && response.data.data) {
                setDistricts(response.data.data.districts);
                setDistrictId(temp.address.ward.district.id)
                getService.getAddressWardDistrictId(temp.address.ward.district.id).then(
                  response =>{
                    if(response.status === 200 && response.data.data) {
                      
                      setWards(response.data.data.wards);
                      setAddress({
                        wardId:temp.address.ward.id,
                        street: temp.address.street
                      })
                    }        
                  }
                )
              } 
            }
          )
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
  
  const handleClickEditApprove = (id) =>{    
    setStoreId(id);
    setOpen(true)
    
  }
  const handleClickEditEnable = (id) =>{    
    setStoreId(id);
    setOpenEnable(true)    
  }
  const handleChangeStatusApprove = (event) =>{
    setIsApprove(event.target.value)
  }

  const handleChangeStatusEnable = (event) =>{
    setIsEnable(event.target.value)
  }


  const handleClickCancel = () => {
    setOpen(false);
    setOpenEnable(false)
    setOpenStore(false)
  }
  const handleClickSubmit = () => {
    if(isApprove) {
      if(isApprove === statusApprove[0]) {
        storeService.StoreApproveStoreId(storeId).then(
          response => {
            if(response.data && response.status === 200 && response.data.success) {
              alert(noti.APPROVE_SUCCESS);
              setOpen(false)
              setSuccess(!success)
            }
          }
        )
        
      } 
      else if(isApprove === statusApprove[1]) {
        storeService.StoreRejecteStoreId(storeId).then(
          response => {
            if(response.data && response.status === 200 && response.data.success) {
              alert(noti.REJECTE_SUCCESS);
              setOpen(false)
              setSuccess(!success)
            }
            
          }
        )
        
      }
    } else {
      alert(noti.CONFIRM_CHOOSE_STATUS);
    }
    
    
  }

  const handleClickSubmitEnable = () => {
    if(isEnable) {
      if(isEnable === statusEnable[0]) {
        storeService.StoreEnableStoreId(storeId).then(
          response => {
            if(response.data && response.status === 200 && response.data.success) {
              alert(noti.ENABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
            }
          } ,error => {
            setSuccess(!success)
          }
        )
        
      } 
      else if(isEnable === statusEnable[1]) {
        storeService.StoreDisableStoreId(storeId).then(
          response => {
            if(response.data && response.status === 200 && response.data.success) {
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

  const handleClose = () => {
    setOpen(false)    
    setOpenEnable(false)
    setOpenStore(false)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stores.length) : 0;

  const filteredDatas = applySortFilter(stores, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(()=>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    getService.getAddressProvines().then(
      response =>{
        if(response.data && response.data.success && response.data.data){
          setProvines(response.data.data.provines);          
        }
      }
    )
    storeService.StoreAll().then(
      response =>{
        if(response.data  && response.data.success) {
          console.log("Stores ==>",response.data.data.stores)
          setStores(response.data.data.stores)
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
        <title> Stores  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Stores
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
                  rowCount={stores.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id,  name, address, description, isApproved
                      , isEnable, openTime, closeTime } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                         <TableCell align="left">
                          {name} 
                         </TableCell>
                         
                         <TableCell align="left">
                          {address.ward.name}{" "}{address.street}
                         </TableCell>
                         <TableCell align="left">
                          {description}
                         </TableCell>
                         <TableCell align="left">
                          {openTime.hour}{":"}{openTime.minute}
                         </TableCell>
                         <TableCell align="left">
                         {closeTime.hour}{":"}{closeTime.minute}
                         </TableCell>
                         <TableCell align="left">
                          {((isApproved === null ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEditApprove(id)}>NeedApproval</Button>):
                          (isApproved === true)? <Button className='btn btn-success' onClick={() => handleClickEditApprove(id)}>Approved</Button> : 
                          <Button className='btn btn-warning' onClick={() => handleClickEditApprove(id)}>Rejected</Button>)}
                         </TableCell>
                          
                         <TableCell align="left">
                          {(isEnable === true ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEditEnable(id)}>Enable</Button>):                           
                          (<Button className='btn btn-warning' onClick={() => handleClickEditEnable(id)}>Disable</Button>)}
                         </TableCell>                         
                        
                        <TableCell align="right">                        
                          <IconButton size="large" color="inherit" onClick={()=>handleClickEdit(id)}>
                          <Iconify icon={'eva:edit-fill'}  sx={{ mr: 2 }} />                          
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
            count={stores.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Approved</DialogTitle>
        <DialogContent> 
        <DialogContentText>
            Please choose Approved or Rejected.
          </DialogContentText>
          <Grid container spacing={2}>
          <Grid item xs={12}>
          <Label>Status</Label>
          <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={isApprove}
                  id="country"      
                  onChange= {handleChangeStatusApprove}
                >
                  {statusApprove  && statusApprove.map((option) => (
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
      <Dialog open={openStore} onClose={handleClose}>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Label>Store Name</Label>
            <TextField 
              name="name" 
              fullWidth
              value={name} 
              required
              onChange={(event) => { handleChangeName(event) }}
              />
          </Grid>
          <Grid item xs={12}>
          <Label>Description</Label>
            <TextField 
              name="description" 
              value={description} 
              fullWidth
              required
              onChange={ handlechangeDescription }
              />
          </Grid>
          <Grid item xs={6}>
          <Label>Provine</Label>
          <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={provineId}
                  id="country"          
                  onChange= {handleChangeProvineId}
                >
                  {provines  && provines.map((option) => (
             <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          )
          )}
          </TextField>
          </Grid>
          <Grid item xs={6}>
          <Label>District</Label>
          <TextField             
                  select
                  fullWidth
                  variant="outlined"
                  value={districtId}
                  id="country" 
                  onChange= {handleChangeDistrictId}
                >
                  {districts  && districts.map((option) => (
             <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          )
          )}
            </TextField>
          </Grid>
          <Grid item xs={4}>
          <Label>Ward</Label>
          <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={address.wardId}
                  id="country"      
                  onChange= {handleWardId}
                >
                  {wards  && wards.map((option) => (
             <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          )
          )}
            </TextField>  
          </Grid>
          <Grid item xs={8}>
          <Label>Street</Label>
            <TextField 
            name="street" 
            fullWidth
            value={address.street} 
            required
            onChange={(event) => { handleChangeStreet(event) }}
            />
          </Grid>
          <Grid item xs={6}>
          <Label>Open Time</Label>
          <TextField 
            name="openTime" 
            type="time"
            fullWidth
            value={openTimeText} 
            required
            onChange={(event) => { handleChangeOpenTime(event) }}
            />
          </Grid>
          <Grid item xs={6}> 
          <Label>Close Time</Label>
          <TextField 
            name="closeTime" 
            type="time"
            fullWidth
            value={closeTimeText} 
            required
            onChange={(event) => { handleChangeCloseTime(event) }}
            />
          </Grid>
          <Grid xs={12}>
          <Label>Image</Label>
          <form encType='multipart/form-data'>
            <input type="file" onChange={(event) => { handleChangeImageURL(event) }}/>          
            
          </form>
          <br/>
          {(urlImage !== "") && <img src={urlImage} alt="Trulli" width="550" height="333"/>}
          </Grid>

        </Grid> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          <Button onClick={handleClickSubmitStore}>Submit</Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}
