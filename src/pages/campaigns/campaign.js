import { Helmet } from 'react-helmet-async';
import { camelCase, filter, set } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';

import DialogTitle from '@mui/material/DialogTitle';
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
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import Label from '../../components/label';

import CampaignService from '../../services/campaign.service';


// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import AdminService from '../../services/admin.service';
import storeService from '../../services/store.service';
import ViewCampaign from './view.campaign';
import headerService from '../../services/header.service';
import noti from '../../utils/noti';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'storeName', label: 'Store', alignRight: false }, 
  { id: 'description', label: 'Description', alignRight: false },  
  { id: 'gameId', label: 'Game', alignRight: false },  
  { id: 'isEnable', label: 'Enable', alignRight: false }, 
  { id: 'status', label: 'Status', alignRight: false },  
  { id: 'startDate', label: 'StartDate', alignRight: false },  
  { id: 'endDate', label: 'EndDate', alignRight: false },  
  
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

export default function Campaign() {  

  const [edit, setEdit] = useState(false);
  
  const [success, setSuccess] = useState(false);

  
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc'); 

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [campaigns, setCampaigns] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(5);  

  const [openEnable, setOpenEnable] = useState(false);

  const [isEnable, setIsEnable] = useState("");

  const [campaignId, setCampaignId] = useState("");
  const [openTime, setOpenTime] = useState("")

  const [closeTime, setCloseTime] = useState("")
  const [open, setOpen] = useState(false);
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
   
  const handleClickEdit = (id) => {
    
    setCampaignId(id);
    setEdit(true)
    
  };
  
  const handleClickEditEnable = (id) =>{    
    setCampaignId(id);
    setOpenEnable(true)
    
  }
  
  const handleChangeStatusEnable = (event) =>{
    setIsEnable(event.target.value)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickSubmitEnable = () => {
    if(isEnable) {
      if(isEnable === statusEnable[0]) {
        CampaignService.CampaignEnableByCampaignId(campaignId).then(
          response => {
            if(response.data  && response.data.success) {
              alert(response.data.message);
              setOpenEnable(false)
              setSuccess(!success)
            }
          } , error => {
            if(error.response && error.response.data && !error.response.data.success ) {
              alert(error.response.data.message)
            }  
            setSuccess(!success)
          }
        )
        
      } 
      else if(isEnable === statusEnable[1]) {
        CampaignService.CampaignDisableByCampaignId(campaignId).then(
          response => {
            if(response.data  && response.data.success) {
              alert(response.data.message);
              setOpenEnable(false)
              setSuccess(!success)
            }
            
          }, error => {
            if(error.response && error.response.data && !error.response.data.success ) {
              alert(error.response.data.message)
            }  
            setSuccess(!success)
          }
        )        
      }
    } else {
      alert(noti.CONFIRM_CHOOSE_STATUS);
    }
  }

  const handleClose = () => {  
    setOpenEnable(false)

    setIsEnable("")
  }

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickCancel = () => {    
    setOpenEnable(false)
    setIsEnable("")
    setOpen(false)
  }

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    setSelected([]);
  };

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - campaigns.length) : 0;

  const filteredDatas = applySortFilter(campaigns, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDatas.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    CampaignService.CampaignAll().then(
      response =>{
        if(response.data  && response.data.success) {   
          const temp = response.data.data;
          console.log(temp.listCampaign)
          setCampaigns(response.data.data.listCampaign)          
        }
      }, error => {
        if(error.response && error.response.status === 401) {
          const token = headerService.refreshToken();
          AdminService.refreshToken(token).then(
            response => {
              
              if(response.data && response.data.success === true) {                
                localStorage.setItem("token", JSON.stringify(response.data.data));
                setSuccess(!success)
              } else {
                AdminService.refreshToken(token).then(
                  response=>{
                    if(response.data && response.data.success === true) {
                      console.log(response.data)
                      localStorage.setItem("token", JSON.stringify(response.data.data));
                      setSuccess(!success)
                    } else {
                      window.location.assign('/login')
                    }
                  }
                )
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
        <title> Campaigns  </title>
      </Helmet>
      {edit === true && campaignId !== "" ? <ViewCampaign editDisplay={edit} campaignIdText={campaignId}/> : 
      <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Campaigns
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
                  rowCount={campaigns.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, storeName, storeId, description, startDate, endDate,  gameName, status,   isEnable } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">
                        <Button className='btn btn-success' onClick={() => handleClickStore(storeId)}>{storeName}</Button>
                          </TableCell>

                        <TableCell align="left">{description}</TableCell>    

                        <TableCell align="left">{gameName}</TableCell>   

                        <TableCell align="left">
                        {(isEnable === true ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEditEnable(id)}>Enable</Button>):                           
                          (<Button className='btn btn-warning' onClick={() => handleClickEditEnable(id)}>Disable</Button>)}
                        </TableCell>

                        <TableCell align="left">{status}</TableCell>        

                        <TableCell align="left">{startDate.day}-{startDate.month}-{startDate.year}</TableCell>    

                        <TableCell align="left">{endDate.day}-{endDate.month}-{endDate.year}</TableCell>       

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
            count={campaigns.length}
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
      <Dialog open={openEnable} onClose={handleClose}>
        <DialogTitle>Edit Enable</DialogTitle>
        <DialogContent> 
        <DialogContentText>
            Please choose Enable or Disable.
          </DialogContentText>
          <Grid container spacing={2}>
          <Grid item xs={12}>
          <TextField
                  label="Status"
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
    
      }
      </>
  );
}
