import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import {  IconButton, InputAdornment, Stack, TextField, Link, Paper,styled, Grid  } from '@mui/material';
import Box from '@mui/material/Box';

import {Form, Button, Modal, Container} from 'react-bootstrap'
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from '../components/iconify';

// components
import adminService from '../services/admin.service'

import getService from '../services/getEnum.service'
import Label from '../components/label';
import { checkPassword } from '../utils/check';
import { convertStringToDate } from '../utils/formatTime';
import headerService from '../services/header.service';
// ----------------------------------------------------------------------
import noti from '../utils/noti';

export default function Profile() {
  
  const [address, setAddress] = useState({
    wardId:"",
    street:""
  })  
  const [name, setName] = useState("");
  const [genders, setGenders] = useState([]);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateBirthDate] = useState({
    year: 2000,
    month:1,
    day:1
  });
  
  const [open, setOpen] =  useState(false)
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [provines, setProvines] = useState([]);
  const [provineId, setProvineId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWards] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [position, setPosition] = useState("");

  const [department, setDepartment] = useState("");
  const [dateOfBirthText, setDateOfBirthText] = useState("")
  const [success, setSuccess] = useState(false)
  
  const handleClickCancel = () => {
    setOpen(false)    
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const handleChangeName = (event) => {        
    setName(event.target.value)
  }
  const handleChangePosition = (event) => {        
    setPosition(event.target.value)
  }
  const handleChangeDepartment = (event) => {        
    setDepartment(event.target.value)
  }
  
  const handleChangeBirthDate = (event) => {  
    setDateOfBirthText(event.target.value)
    const date = event.target.value.toString().split('-');
    
    setDateBirthDate({
      year: parseInt(date[0], 10),
      month: parseInt(date[1], 10),
      day: date[2]
    })
  }

  const handleClose = () => {
    setOpen(false)    
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
  
  const handleChangeNewPassword = (event) => {        
    setNewPassword(event.target.value)
  }
  const handleChangeOldPassword = (event) => {        
    setOldPassword(event.target.value)
  }
  const handleConfirmPassword = (event) => {        
    setConfirmPassword(event.target.value)
  }
  
  const handleChangeProvineId = (event) => { 
     
    getService.getAddressDistrictProvineId(event.target.value).then(
      response =>{
        if(response.status === 200 && response.data.data) {
          setDistricts(response.data.data.districts);
        } 
      }
    )
    setProvineId(event.target.value)
    setDistrictId("");
    setAddress({
      wardId: "",
      street: ""
    })

  }

  const handleChangeDistrictId = (event) => {  
    getService.getAddressWardDistrictId(event.target.value).then(
      response =>{
        if(response.status === 200 && response.data.data) {
          
          setWards(response.data.data.wards);
        }        
      }
    )
    setDistrictId(event.target.value)
    setAddress({
      wardId: "",
      street: ""
    })
  }
  
  const handleChangeGender = (event) => {        
    setGender(event.target.value)
  }
  const handleClickUpdate = () => {
    console.log(name, gender, dateOfBirth, address, position, department)
    if(name && dateOfBirthText && gender && provineId && districtId && address.wardId && address.street && position && department) {
      adminService.PutAdminUpdate(name, gender, dateOfBirth, address, position, department).then(
        response => {
          if(response.data && response.data.success === true) {
            alert(response.data.message);
            setSuccess(!success)
          }
        } , error => {
          console.log(error)
          if(error.response && error.response.data && !error.response.data.success ) {
            alert(error.response.data.message)
          }  
          
        }
      )
    } else {
      alert(noti.MISSING_DATA)
    }
  }
  const handleClickChangePass = () => {
    setOpen(true)
  }
  const handleClickSubmit = () => {
    console.log(oldPassword , newPassword , confirmPassword)
    if(oldPassword && newPassword && confirmPassword) {
      if(confirmPassword === newPassword ) {
        if(checkPassword(newPassword) === true && newPassword.length >= 8) {
          adminService.changePassword(oldPassword, newPassword).then(
            response => {
              console.log(response)
              if(response.data && response.data.success === true) {
                alert(response.data.message)
                setOpen(false)
                setOldPassword("");
                setNewPassword("")
                setConfirmPassword("")
              } else {
                alert(response.data.message)
              }
            }, error => {
              console.log(error)
              if(error.response && error.response.data && !error.response.data.success ) {
                alert(error.response.data.message)
              }  
              
            }
          )
        } else {
          alert(noti.ALERT_PASSWORD)
        }
        
      } else {
        alert(noti.SAMP_PASSWORD)
      }
    } else {
      alert(noti.MISSING_DATA)
    }
  }  
  useEffect (()=>{    
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    } else {
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
      adminService.AdminInfo().then(
        response => {
          if (response.data && response.data.success === true) {
            const temp = response.data.data
            console.log(temp)
            setName(temp.name)
            setPosition(temp.position)
            setDepartment(temp.department)
            setGender(temp.gender)
            setDateBirthDate(temp.dateOfBirth)
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
        }, error =>{
          if(error.response && error.response.status === 401) {
            const token = headerService.refreshToken();
            adminService.refreshToken(token).then(
              response=>{
                if(response.data && response.data.success === true) {
                  console.log(response.data)
                  localStorage.setItem("token", JSON.stringify(response.data.data));
                  setSuccess(!success)
                } else {
                  const token = headerService.refreshToken();
                  adminService.refreshToken(token).then(
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
              }
            )
            
          }
          
        }
      )
    }

  },[success])

  return (
    <>
    <Helmet>
        <title> Profile  </title>
      </Helmet>
      <Box 
        
        sx={{ width: '50%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>      
 
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
        value={dateOfBirthText} 
        required
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
    <Grid item xs={6}>
    <Label>Position</Label>
        <TextField 
        fullWidth
        name="position" 
        value={position} 
        required
        onChange={(event) => { handleChangePosition(event) }}
        />
    </Grid>   
    <Grid item xs={6}>
    <Label>Department</Label>
        <TextField 
        fullWidth
        name="department" 
        value={department} 
        required
        onChange={(event) => { handleChangeDepartment(event) }}
        />
    </Grid>   
    <Grid item xs={6} className="">
    <LoadingButton  size="large" type="submit" variant="contained" onClick={handleClickUpdate}>
        Update
      </LoadingButton>
    </Grid>   
    <Grid item xs={6} className="">
    <LoadingButton className='float-center' size="large" type="submit" variant="contained" onClick={handleClickChangePass}>
        Change Password
      </LoadingButton>
    </Grid> 
    
  </Grid>  
    </Box>
        

  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password </DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <Label>Old Password</Label>
      <TextField
      
        fullWidth
          name="password"          
          required
          value={oldPassword}
          type={showOldPassword? 'text' : 'password'}
          onChange={(event) => { handleChangeOldPassword(event) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                  <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}           
        />        
    </Grid>
        <Grid item xs={12}>
        <Label>New Password</Label>
      <TextField
      
        fullWidth
          name="password"
          
          required
          value={newPassword}
          type={showNewPassword? 'text' : 'password'}
          onChange={(event) => { handleChangeNewPassword(event) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                  <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}          
        />        
    </Grid>
    <Grid item xs={12}>
    <Label>Confirm Password</Label>
      <TextField
      fullWidth
          name="ConfirmPassword"
          required
          value={confirmPassword}
          type={showConfirmPassword ? 'text' : 'password'}
          onChange={(event) => { handleConfirmPassword(event) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}  
        />
    </Grid>
        </Grid>
        
        </DialogContent>
        <DialogActions>
          <Button className='btn btn-secondary' onClick={handleClickCancel}>Cancel</Button>
          <Button onClick={handleClickSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}
