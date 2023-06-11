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
import gameService from '../../services/game.service';
import imageService from '../../services/image.service';
import noti from '../../utils/noti';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock

import searchPartner from '../../utils/searchPartner';

// ----------------------------------------------------------------------
const statusEnable = ["Enable             ", "Disable          "]


const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'instruction', label: 'Instruction', alignRight: false },  
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

export default function Game() {  
  const [instruction, setInstruction] = useState("")
  const [success, setSuccess] = useState(false)
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [games, setGames] = useState([])

  const [openEnable, setOpenEnable] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEnable, setIsEnable] = useState("");
  const [gameId, setGameId] = useState("");
  const [imageUrl, setImageUrl] = useState("")
  const [urlImage, setUrlImage] = useState("");

  const handleChangeName = (event) => {
    setName(event.target.value) 
  }

  const handleChangeStatusEnable = () => {
    if(isEnable) {
      if(isEnable === statusEnable[0]) {
        gameService.PutEnableGameById(gameId).then(
          response => {
            if(response.data  && response.data.success === true) {
              alert("Enable Success");
              setOpenEnable(false)
              setSuccess(!success)
              setIsEnable("")
            }
          }
        )        
      } 
      else if(isEnable === statusEnable[1]) {
        gameService.PutDisableGameById(gameId).then(
          response => {
            if(response.data  && response.data.success === true) {
              alert("Disable Success");
              setOpenEnable(false)
              setSuccess(!success)
              setIsEnable("")
            }
            
          }
        )        
      }
    } else {
      alert("Please choose Status");
    }
  }

  const handlechangeInstruction = (event) => {
    setInstruction(event.target.value) 
  }
  
  const handlechangeDescription = (event) => {
    setDescription(event.target.value) 
  }
  const handleClickChange = (event) => {
    setIsEnable(event.target.value)
  }
  
  const handleClose = () => {
    setOpen(false)    
    clearScreen();
    setOpenEnable(false)
  }
  const handleClickEdit = (id, name) => {
    gameService.GetGameById(id).then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data.game
          console.log(temp)
          setGameId(temp.id);
          setName(temp.name);
          setDescription(temp.description)
          setInstruction(temp.instruction)
          setImageUrl(temp.imageUrl);
          setOpen(true)
          setUrlImage(`${process.env.REACT_APP_API_URL}${temp.imageUrl}`)
        }
      }, error => {
        setSuccess(!success)
      }
    )
  };
  const handleClickDelete = (id) => {
    if(window.confirm(noti.CONFIRM_DELETE)) {
      gameService.DeleteGameById(id).then(
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

  const handleClickEnable = (id) => {
    setGameId(id)
    setOpenEnable(true)
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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    setSelected([]);
  };

  const handleClickNew = () => {
    setOpen(true);
    
  }
  const handleClickCancel = () => {
    setOpen(false);
    clearScreen()
    setOpenEnable(false)
  }
  const clearScreen = () => {
    
    setName("");
    setDescription("");
    setInstruction("");
    setGameId("");
    setIsEnable("");
    setIsEnable("")
    
  }

  const handleChangeImageURL = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file)
    imageService.ImageUpload(formData).then(
      response =>{
        if (response.data && response.data.success === true) {
          const temp = response.data.data.imagePath
          setImageUrl(temp)
          setUrlImage(`${process.env.REACT_APP_API_URL}${temp}`)
        }
         
      }, error => {
        console.log(error)
      }
    ) 
  }
  const handleClickSubmit = () => {
    if (name && description && instruction) {
      if (gameId === "") {
        gameService.PostGame(name, description,instruction, imageUrl).then(
          response =>{
            if(response.data && response.data.success && response.data.data) {
              alert(noti.CREATE_SUCCESS);
              setOpen(false); 
              clearScreen();
              setSuccess(!success)
            }
          }, error =>{
            alert(noti.ERROR)
    
            setSuccess(!success)
          }
        )
      } else {
        gameService.PutGameById(name, description, instruction, gameId , imageUrl).then(
          response =>{
            if(response.data && response.data.success && response.data.data) {
              alert(noti.EDIT_SUCCESS);
              setOpen(false); 
              clearScreen();
              setSuccess(!success)
            }
          }, error =>{
            alert(noti.ERROR)    
            setSuccess(!success)
          }
        )
      }
    } else {
      alert(noti.MISSING_DATA)
    }
    
    
       
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0;

  const filteredUsers = applySortFilter(games, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    gameService.GameAll().then(
      response =>{
        if( response.data && response.data.success && response.data.data) {
          
          setGames(response.data.data.games)
          setSuccess(false)
        }
        

      },  error =>{
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
        <title> Games  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Games
          </Typography>
          <Button onClick={handleClickNew} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Game
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
                  rowCount={games.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, description, instruction, imageUrl, isEnable } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                         

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">{instruction}</TableCell>                        

                        <TableCell align="left">
                        {(isEnable === true ) ? 
                          (<Button className='btn btn-primary' onClick={() => handleClickEnable(id)}>Enable</Button>):                           
                          (<Button className='btn btn-warning' onClick={() => handleClickEnable(id)}>Disable</Button>)}
                          
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
            count={games.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Game</DialogTitle>
        <DialogContent>
          <br/>
        <Grid container spacing={2}>

        <Grid xs={12}>
        <Label>Game</Label>
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
        <Grid xs={12}>
        <Label>Instruction</Label>
        <TextField 
        name="instruction" 
        value={instruction} 
        fullWidth
        required
        onChange={(event) => { handlechangeInstruction(event) }}
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
