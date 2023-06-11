import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

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
  TextField
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Label from '../../components/label';
// sections
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock


import adminService from '../../services/admin.service';
import headerService from '../../services/header.service';
import getService from '../../services/getEnum.service'
import UserService from '../../services/user.service';
import { convertStringToDate } from '../../utils/formatTime';
import noti from '../../utils/noti';
// ----------------------------------------------------------------------
const avatar ={
  avatarMaleUrl: `/assets/images/avatars/avatar_2.jpg`,
  avatarFemaleUrl: `/assets/images/avatars/avatar_1.jpg`,
  avatarOthersUrl: `/assets/images/avatars/avatar_3.jpg`,
}
const TABLE_HEAD = [
  { id: 'userName', label: 'UserName', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'dateOfBirth', label: 'DateOfBirth', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'gender', label: 'Gender', alignRight: false },
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
    return filter(array, (_user) => _user.userName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  } 
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {  
  const [success, setSuccess] = useState(false)
  const [openPartner, setOpenPartner] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('userName');

  const [filterName, setFilterName] = useState('');

  const [endUsers, setEndUsers] = useState([])


  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateOfBirthText, setDateOfBirthText] = useState("");
  const [name, setName] = useState("");
  const [genders, setGenders] = useState([]);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    year: 2000,
    month:1,
    day:1
  });
  const [address, setAddress] = useState({
    wardId:"",
    street:""
  })  
  
  const [provines, setProvines] = useState([]);
  const [provineId, setProvineId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWards] = useState([]);
  const [endUserId, setEndUserId] = useState("")

  const handleClose = () => {
    setOpenPartner(false)    
    clearScreen()
  }

  const handleClickCancel = () => {
    setOpenPartner(false)
    clearScreen()
  }

  const clearScreen = () => {
    setName("");
    setDateOfBirthText("");
    setDateOfBirth({
      year: 0,
      month: 0,
      day: 0
    })
    setProvineId("");
    setDistrictId("")
    setAddress({
      wardId: "",
      street: ""
    })
    setGender("")
  }
  const handleClickSave = () =>{
    if (endUserId && name && gender && dateOfBirthText && address.wardId && address.street) {
      UserService.PutUserById(endUserId, name, gender, dateOfBirth, address).then(
        response => {
          if(response.data && response.data.success === true) {
            alert(noti.EDIT_SUCCESS);
            setOpenPartner(false);
            clearScreen();
            setSuccess(!success)
          }
        }, error => {
          alert(noti.ERROR)
          setSuccess(!success)
        }
      )
    } else {
      alert(noti.MISSING_DATA)
    }
    
  }
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeBirthDate = (event) => {    
    const date = event.target.value.toString().split('-');
    setDateOfBirthText(event.target.value)
    setDateOfBirth({
      year: parseInt(date[0], 10),
      month: parseInt(date[1], 10),
      day: date[2]
    })
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

  const handleChangeGender = (event) => {        
    setGender(event.target.value)
  }
  const handleChangeName = (event) =>{
    setName(event.target.value)
  }

  const handleClickEdit = (id) => {
    UserService.GetUserById(id).then(
      
      response => {
        if(response.data && response.data.success === true) {
          
          const temp = response.data.data.endUsers
          console.log(temp)
          setEndUserId(temp.id)
          setName(temp.name)
          setGender(temp.gender)
          setDateOfBirth(temp.dateOfBirth)
          
          setDateOfBirthText(convertStringToDate(temp.dateOfBirth))
          setDistrictId(temp.address.ward.district.id)
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
    setOpenPartner(true)
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
  

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - endUsers.length) : 0;

  const filteredDatas = applySortFilter(endUsers, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    getService.getValuesGender().then(
      response =>{
        if(response.data && response.status === 200) {
          const arrayGender  = response.data.data.genderValue;        
             
          setGenders(arrayGender)
        }
        
      }, error => {
        console.log(error)
      }
    )
    getService.getAddressProvines().then(
      response =>{
        if(response.data && response.status === 200){
          setProvines(response.data.data.provines);          
        }
      }
    )
    adminService.endUserAll().then(
      response => {
        
        if(  response.data.success && response.data.data) {
         
          setEndUsers(response.data.data.endUsers)
          
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
        <title> EndUser  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          EndUser
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
                  rowCount={endUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, userName, name, dateOfBirth,  address, gender } = row;
                    const selectedUser = selected.indexOf(userName) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                         <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {gender === 'Male' &&(
                              <Avatar alt={userName} src={avatar.avatarMaleUrl} />
                            )}
                            {gender === 'Female' &&(
                              <Avatar alt={userName} src={avatar.avatarFemaleUrl} />
                            )}
                            {gender === 'Others' &&(
                              <Avatar alt={userName} src={avatar.avatarOthersUrl} />
                            )}
                            <Typography variant="subtitle2" noWrap>
                              {userName}
                            </Typography>
                          </Stack>
                        </TableCell>
                         <TableCell align="left">
                          {name} 
                         </TableCell>
                         <TableCell align="left">
                          {dateOfBirth.year} {"-"} {dateOfBirth.month}{"-"}{dateOfBirth.day}
                         </TableCell>
                         
                         <TableCell align="left">
                          {address.street}-{address.ward.fullName}-{address.ward.district.fullName}-{address.ward.province.fullName}
                         </TableCell>
                         <TableCell align="left">
                          {gender}
                         </TableCell>
                         
                        
                        <TableCell align="right">                        
                          <IconButton size="large" color="inherit" onClick={()=>handleClickEdit(id, userName)}>
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
            count={endUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openPartner} onClose={handleClose}>
        <DialogTitle> User</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
        <Grid item xs={7}>
      <Label>FullName</Label>
        <TextField 
        name="name" 
        fullWidth
        value={name} 
        required
        onChange={(event) => { handleChangeName(event) }}
        />      
      </Grid>
      <Grid item xs={5}>
      <Label>DateOfBirth</Label>
      <TextField 
        fullWidth
        type="date"        
        required
        value={dateOfBirthText}
        onChange={(event) => { handleChangeBirthDate(event) }}
        />  
      </Grid>
      <Grid item xs={4}>
      <Label>Gender</Label>
      <TextField
                  fullWidth
                  select
                  value={gender}
                  id="country"        
                  onChange= {handleChangeGender}
                >
                  {genders  && Array.isArray(genders) && genders.map((option) => (
             <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
          )}
                  </TextField>       
    </Grid>
      <Grid item xs={8}>
      <Label>Provine</Label>
      <TextField
                  fullWidth
                  select
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
                  fullWidth
                  select
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
    <Grid item xs={6}>
    <Label>Ward</Label>
      <TextField
                  fullWidth
                  select
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
        fullWidth
        name="street" 
        value={address.street} 
        required
        onChange={(event) => { handleChangeStreet(event) }}
        />
    </Grid>
    
    
        </Grid> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          <Button onClick={handleClickSave}>Save</Button>
          
        </DialogActions>
      </Dialog>
      
    </>
  );
}
