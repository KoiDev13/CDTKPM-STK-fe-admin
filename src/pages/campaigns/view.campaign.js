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

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';



import getService from '../../services/getEnum.service'
import headerService from '../../services/header.service';

import gameService from '../../services/game.service';
import partnerService from '../../services/partner.service';
import { convertStringToDate } from '../../utils/formatTime';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import CampaignService from '../../services/campaign.service';
// mock
import noti from '../../utils/noti';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },  
  { id: 'quantity', label: 'Quantity', alignRight: false },  
  { id: 'expiresOn', label: 'ExpiresOn', alignRight: false },  
  { id: '' },
];


// ----------------------------------------------------------------------


const statusEnable = ["Enable             ", "Disable          "]



export default function ViewCampaign(props) {  
  

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [enable, setEnable ] = useState(false)

  const [isEnable, setIsEnable] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

 
  const [winRate, setWinRate] = useState("");

  const [startDateText, setStartDateText] = useState("");

  const [endDateText, setEndDateText] = useState("");

  const [gameId, setGameId] = useState("");

  const [tempVoucher, setTempVoucher] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  
  const [gameRuleId, setGameRuleId] = useState("");

  const [numberOfLimit, setNumberOfLimit] = useState("")

  const [ishowNumberOfLimit, setIshowNumberOfLimit] = useState(false)

  
  
  const handleChangeName = (event) => {
    setName(event.target.value) 
  }
 
  
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tempVoucher.length) : 0; 


  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    if(props.editDisplay === true && props.campaignIdText) {
      
      CampaignService.GetCampaignById(props.campaignIdText).then(
        response => {
          if(response.data && response.data.success === true) {
            const temp = response.data.data.campaign
            console.log(temp)
            setCampaignId(temp.id);
            setName(temp.name);
            setDescription(temp.description);
            setStartDateText(convertStringToDate(temp.startDate))
            setEndDateText(convertStringToDate(temp.endDate))
            setGameId(temp.gameName)
            setTempVoucher(temp.campaignVoucherList)
            setWinRate(temp.winRate)
            setGameRuleId(temp.gameRule)
            if(temp.isEnable === true) {
              setEnable(true)
              setIsEnable(statusEnable[0])
            } else {
              setEnable(false)
              setIsEnable(statusEnable[1])
            }
            if(temp.numberOfLimit) {
              setNumberOfLimit(temp.numberOfLimit);
              setIshowNumberOfLimit(true)
            }
          }
        }
      )
    }
    
    
  },[])

  return (
    <>
      <Helmet>
        <title> View Campaign  </title>
      </Helmet>

      <Container>
         
        <Grid container spacing={2}>
            <Grid xs={6}>
                <Label>Name </Label>
                <TextField 
                name="name" 
                fullWidth
                value={name} 
                disabled
                onChange={(event) => { handleChangeName(event) }}
                />
            </Grid>
            
            <Grid xs={3}>
                <Label>StartDate </Label>
                <TextField 
                name="start" 
                type="date"
                value={startDateText} 
                fullWidth
                disabled
               
                />
            </Grid>
            <Grid xs={3}>
                <Label>EndDate </Label>
                <TextField 
                name="end" 
                type="date"
                value={endDateText} 
                fullWidth
                disabled
                
                />
            </Grid>
            <Grid xs={12}>
                <Label>Description </Label>
                <TextField 
                name="description" 
                multiline
                rows={2}
                value={description} 
                fullWidth
                disabled
                
                />
            </Grid>
            <Grid xs={3}>
            <Label>Game </Label>
            <TextField
                  fullWidth
                  
                  variant="outlined"
                  value={gameId}
                  id="country"      
                  disabled
                />                  
           
            </Grid>
            <Grid xs={2}>
                <Label>WinRate </Label>
                <TextField 
                name="WinRate" 
                type="number"
                
                value={winRate} 
                fullWidth
                disabled
                
                />
            </Grid>
            <Grid xs={2}>
            <Label>Enable </Label>
            <TextField
                  fullWidth
                  
                  variant="outlined"
                  value={isEnable}
                  id="country"   
                  disabled   
                  
                />
                  
           
            </Grid>
            <Grid xs={2}>
            <Label>GameRule </Label>
            <TextField
                  fullWidth
                  
                  variant="outlined"
                  value={gameRuleId}
                  id="country"      
                  disabled
                />                 
           
            
            </Grid>
            {ishowNumberOfLimit && 
            <Grid xs={2}>
                <Label>NumberOfLimit </Label>
                <TextField 
                name="numberOfLimit" 
                type="number"
                
                value={numberOfLimit} 
                fullWidth
                disabled
                
                />
            </Grid>
            }
            
        </Grid>
        <br/>
        <Grid>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Vouchers
          </Typography>          
        </Stack>

        <Card>          

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tempVoucher.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}                  
                />
                <TableBody>
                  {tempVoucher.map((row) => {
                    const { id, name, description, quantity, expiresOn } = row;
                    

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" >
                        
                        
                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{description}</TableCell> 

                        <TableCell align="left">{quantity}</TableCell>  
                        
                        <TableCell align="left">{expiresOn.year}-{expiresOn.month}-{expiresOn.day} </TableCell>  
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tempVoucher.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        </Grid>
        

      </Container>
    </>
  );
}
