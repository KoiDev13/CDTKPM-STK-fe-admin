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
import ViewCampaign from './view.campaign';
import headerService from '../../services/header.service';
import noti from '../../utils/noti';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
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

  const [isDetail, setIsDetail] = useState(false);

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
              alert(noti.ENABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
            }
          } , error => {
            alert(noti.ERROR)
            setSuccess(!success)
          }
        )
        
      } 
      else if(isEnable === statusEnable[1]) {
        CampaignService.CampaignDisableByCampaignId(campaignId).then(
          response => {
            if(response.data  && response.data.success) {
              alert(noti.DISABLE_SUCCESS);
              setOpenEnable(false)
              setSuccess(!success)
            }
            
          }, error => {
            alert(noti.ERROR)
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

  const handleClickNew = () => {
     setIsDetail(true);
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
          <Button onClick={handleClickNew} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Campaign
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
                  rowCount={campaigns.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, description, startDate, endDate,  gameName, status,   isEnable } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        

                        <TableCell align="left">{name}</TableCell>

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
