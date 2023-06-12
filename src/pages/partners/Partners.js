import { Helmet } from 'react-helmet-async';
import { filter, set } from 'lodash';
import { sentenceCase } from 'change-case';

import { useState, useEffect } from 'react';
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
  TextField
} from '@mui/material';
// components
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import Label from '../../components/label';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock

import adminService from '../../services/admin.service';

import partnerService from '../../services/partner.service';
import storeService from '../../services/store.service';
import headerService from '../../services/header.service';
import getService from '../../services/getEnum.service'
import noti from '../../utils/noti';
import { convertStringToDate } from '../../utils/formatTime';
// ----------------------------------------------------------------------
const avatar ={
  avatarMaleUrl: `/assets/images/avatars/avatar_2.jpg`,
  avatarFemaleUrl: `/assets/images/avatars/avatar_1.jpg`,
  avatarOthersUrl: `/assets/images/avatars/avatar_3.jpg`,
}
const TABLE_HEAD = [
  { id: 'userName', label: 'UserName', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'dateOfBirth', label: 'DateOfBirth', alignRight: false },
  { id: 'partnerType', label: 'PartnerType', alignRight: false },
  { id: 'store', label: 'Store', alignRight: false },
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

export default function Partner() {  


  const [success, setSuccess] = useState(false)
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [openPartner, setOpenPartner] = useState(false);
  const [addressStore, setAddressStore] = useState({
    district:"",
    province:"",
    ward:"",
    street:""
  })
  const [store, setStore] = useState({
    name:"",
    description:""
  })

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
  const [partnerTypes, setPartnerTypes] = useState([]);
  const [partnerType, setPartnerType] = useState("");
  const [userId, setUserId]  = useState("");

  const [provines, setProvines] = useState([]);
  const [provineId, setProvineId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWards] = useState([]);
  const [partnerId, setPartnerId] = useState("");

  const [openTime, setOpenTime] = useState("")

  const [closeTime, setCloseTime] = useState("")

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('userName');

  const [filterName, setFilterName] = useState('');

  const [partners, setPartners] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [companyName, setCompanyName] = useState("")
  const [businessCode, setBusinessCode] = useState("")
  const [showCompany, setShowCompany] = useState(false);
  const [provinesCompany, setProvinesCompany] = useState([]);
  const [provineCompanyId, setProvineCompanyId] = useState("");
  const [districtCompanyId, setDistrictCompanyId] = useState("");
  const [districtsCompany, setDistrictsCompany] = useState([]);
  const [wardsCompany, setWardsCompany] = useState([]);
  const [wardId, setWardId] = useState("");
  const [street, setStreet] = useState("");

  const handleChangeCompanyWardId = (event) => {        
    setWardId(event.target.value)
    setStreet("")
  }
  const handleChangeCompanyStreet = (event) => {        
    setStreet(event.target.value)
  }
  const handleChangeDistrictCompanyId = (event) => {  
    getService.getAddressWardDistrictId(event.target.value).then(
      response =>{
        if(response.status === 200 && response.data.data) {
          
          setWardsCompany(response.data.data.wards);
        }        
      }
    )
        
    setDistrictCompanyId(event.target.value)
    setWardId("")
    setStreet("")
  }

  const handleChangeProvineCompanyId = (event) => {   
    getService.getAddressDistrictProvineId(event.target.value).then(
      response =>{
        if(response.status === 200 && response.data.data) {
          setDistrictsCompany(response.data.data.districts);
        } 
      }
    )
    setDistrictCompanyId("");
    setWardId("")
    setStreet("")
         
    setProvineCompanyId(event.target.value)
  }

  const handleChangeCompanyName = (event) => { 
    setCompanyName(event.target.value)     
 }
 const handleChangeBusinessCode = (event) => {     
   setBusinessCode(event.target.value)     
 }

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
  
  
  const handleChangeType = (event) => {    
    setPartnerType(event.target.value)
    if(event.target.value === "Company") {
      setShowCompany(true)
    } else {
      setShowCompany(false)
    }
  }
  
  
  const handleChangeGender = (event) => {        
    setGender(event.target.value)
  }
  const handleChangeName = (event) =>{
    setName(event.target.value)
  }

  const handleClickEdit = (id, name) => {
    partnerService.GetPartnerById(id).then(
      response => {
        if(response.data && response.data.success === true) {
          const temp = response.data.data.partner
          
          setPartnerId(temp.id)
          setName(temp.name)
          setGender(temp.gender)
          setDateOfBirth(temp.dateOfBirth)          
          setProvineId(temp.address.ward.province.id)
          setDateOfBirthText(convertStringToDate(temp.dateOfBirth))
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
          setPartnerType(temp.partnerType) 
          if(temp.partnerType === "Company") {
            setShowCompany(true)
            setCompanyName(temp.company.name);
            setBusinessCode(temp.company.businessCode);
            setProvineCompanyId(temp.company.address.ward.province.id)
            getService.getAddressDistrictProvineId(temp.company.address.ward.province.id).then(
              response =>{
                if(response.status === 200 && response.data.data) {
                  setDistrictsCompany(response.data.data.districts);
                  setDistrictCompanyId(temp.company.address.ward.district.id)
                  
                  getService.getAddressWardDistrictId(temp.company.address.ward.district.id).then(
                    response =>{
                      if(response.status === 200 && response.data.data) {    
                        setWardsCompany(response.data.data.wards);    
                        setWardId(temp.company.address.ward.id)              
                        setStreet(temp.company.address.street)                      
                      }        
                    }
                  )
                } 
              }

            )
          }
          
        }
      }
    )
    setOpenPartner(true)
  };
  
  const handleClose = () => {
    setOpen(false)    
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickCancel = () => {
    setOpen(false);
    setShowCompany(false);
    setBusinessCode("");
    setCompanyName("");
    setDistrictCompanyId("");
    setProvineCompanyId("");
    setWardId("");
    setStreet("");
    setAddressStore({
      district:"",
      province:"",
      ward:"",
      street:""
    })
    setStore({
      name:"",
      description:""
    })
    setCloseTime("")
    setOpenTime("")
    setOpenPartner(false);

  }
  
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
  const handleClickSave = () =>{
    if(partnerId && name && gender && dateOfBirthText && address.street && address.wardId && partnerType) {
      if (partnerType === "Company") {
        const company = {
          name: companyName,
          businessCode,
          address: {
            wardId,
            street
          }
        }
        partnerService.PutPartnerById(partnerId,name,gender,dateOfBirth,address,partnerType, company).then(
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
        partnerService.PutPartnerById(partnerId,name,gender,dateOfBirth,address,partnerType).then(
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
      }
    } else {
      alert(noti.MISSING_DATA)
    }    
  }

  const clearScreen = () => {
    setName("");
    setDateOfBirthText("");
    setAddress({
      wardId: "",
      street: ""
    })
    setPartnerType("");
    setDistrictId("");
    setAddressStore({
      district: "",
      province: "",
      ward: "",
      street: ""
    })
  }
  

  const handleClickStore = (id) => {
    storeService.GetStoreById(id).then(
      response =>{
        if (response.data && response.data.success) {
          const temp = response.data.data.store
          console.log(temp)
          setOpen(true);
          setAddressStore({
            district: temp.address.ward.district.fullName,
            street: temp.address.street,
            province: temp.address.ward.province.fullName,
            ward: temp.address.ward.fullName,
          })
          setStore({
            name:temp.name,
            description: temp.description
          })
          setOpenTime(`${temp.openTime.hour}:${temp.openTime.minute}`)
          setCloseTime(`${temp.closeTime.hour}:${temp.closeTime.minute}`)
        }
        
      }, error => {
        setSuccess(!success)
      }
    )
   
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - partners.length) : 0;

  const filteredDatas = applySortFilter(partners, getComparator(order, orderBy), filterName);


  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    partnerService.partnerAll().then(
      response => {
        if(response && response.status === 200 && response.data.success && response.data.data) {
          setPartners(response.data.data.partners)
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
    getService.getValuesPartnerType().then(
      response =>{
        if(response.status === 200 && response.data.data) {
          
          setPartnerTypes(response.data.data.partnerTypValue);
        }
        
      }
    )
    
    getService.getAddressProvines().then(
      response =>{
        if(response.data && response.status === 200){
          setProvines(response.data.data.provines);     
          setProvinesCompany(response.data.data.provines);       
        }
      }
    )
  },[success])

  return (
    <>
      <Helmet>
        <title> Partners  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Partners
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
                  rowCount={partners.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, userName, name, dateOfBirth, partnerType, address,  store, gender } = row;
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
                            {gender === 'Other' &&(
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
                          {address.street} {address.ward.fullName} {address.ward.district.fullName} 
                         </TableCell>
                         <TableCell align="left">
                          {dateOfBirth.year} {"-"} {dateOfBirth.month}{"-"}{dateOfBirth.day}
                         </TableCell>
                         <TableCell align="left">
                          {partnerType}
                         </TableCell>
                         <TableCell align="left">
                          {(store !== null) ? <Button className='btn btn-success' onClick={() => handleClickStore(store.id)}>{store.name}</Button> : <Button className='btn btn-warning'>No</Button>}
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
            count={partners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> Store</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Label>Name</Label>
            <TextField 
              name="name" 
              
              fullWidth
              value={store.name} 
              disabled
              />
          </Grid>
          <Grid item xs={12}>
          <Label>Description</Label>
            <TextField 
              name="description"  
              value={store.description} 
              fullWidth
              disabled
              
              />
          </Grid>
          <Grid item xs={6}>
          <Label>Province</Label>
          <TextField
                  fullWidth                  
                  value={addressStore.province}
                  id="country"       
                  disabled   
                  
                />
           
          
          </Grid>
          <Grid item xs={6}>
          <Label>District</Label>
          <TextField
                                   
                  
                  fullWidth
                  value={addressStore.district}
                  id="country" 
                  disabled
                  
                />
               
          </Grid>
          <Grid item xs={4}>
          <Label>Ward</Label>
          <TextField
                  fullWidth                  
                  variant="outlined"
                  value={addressStore.ward}
                  id="country"      
                  disabled
                />
                  
          </Grid>
          <Grid item xs={8}>
          <Label>Street</Label>
            <TextField 
            fullWidth
            name="street" 
            disabled
            value={addressStore.street}             
           
            />
          </Grid>
          <Grid item xs={6}>
          <Label>Open Time</Label>
          <TextField 
            name="openTime" 
            type="text"
            fullWidth
            value={openTime} 
            disabled
           
            />
          </Grid>
          <Grid item xs={6}> 
          <Label>Close Time</Label>
          <TextField 
            name="closeTime" 
            type="text"
            fullWidth
            value={closeTime} 
            disabled            
            />
          </Grid>
        </Grid> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
      <Dialog open={openPartner} onClose={handleClose}>
        <DialogTitle> Partner</DialogTitle>
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
    <Grid item xs={4}>
    <Label>Partner Type</Label>
        <TextField
                  fullWidth
                  select
                  value={partnerType}
                  id="country"    
                  onChange= {handleChangeType}
                >
                  {partnerTypes && Array.isArray(partnerTypes)  && partnerTypes.map((option) => (
             <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
          )}
          </TextField>
    </Grid>
    {showCompany === true && 
    <>
    <Grid item xs={6}>
      <Label>Company Name</Label>
        <TextField 
        fullWidth
        name="companyname" 
        
        value={companyName} 
        type="text"
        required
        onChange={(event) => { handleChangeCompanyName(event) }}
        />
      </Grid>
 
      <Grid item xs={6}>
      <Label>BusinessCode</Label>
        <TextField 
        name="BusinessCode" 
        fullWidth
        value={businessCode} 
        required
        onChange={(event) => { handleChangeBusinessCode(event) }}
        />      
      </Grid>
      <Grid item xs={6}>
      <Label>Provine</Label>
      <TextField
                  fullWidth
                  select
                  value={provineCompanyId}
                  id="country"       
                  onChange= {handleChangeProvineCompanyId}
                >
                  {provinesCompany  && provinesCompany.map((option) => (
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
                  value={districtCompanyId}
                  id="country"         
                  onChange= {handleChangeDistrictCompanyId}
                >
                  {districtsCompany  && districtsCompany.map((option) => (
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
                  value={wardId}
                  id="country"       
                  onChange= {handleChangeCompanyWardId}
                >
                  {wardsCompany  && wardsCompany.map((option) => (
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
        value={street} 
        required
        onChange={(event) => { handleChangeCompanyStreet(event) }}
        />
    </Grid>
    </>
    }
    
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
