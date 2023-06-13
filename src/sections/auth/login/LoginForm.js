import { useState } from 'react';

// @mui
import { Stack, IconButton, InputAdornment, TextField,  FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import admin from '../../../services/admin.service'
import noti from '../../../utils/noti';
// ----------------------------------------------------------------------



export default function LoginForm() {  

  const [userName, setUserName] = useState("");
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUserName = (event) => {        
    setUserName(event.target.value)
  }
  const handlePassword = (event) => {        
    setPassword(event.target.value)
  }
  const handleClick = () => {
    if(userName && password) {
      admin.Login(userName, password).then(
        response => {
          console.log(response.data.data)
          if(response.data.success && response.data.data) {
            alert(response.data.message);
            localStorage.setItem("user", JSON.stringify(response.data.data.account));
            localStorage.setItem("token", JSON.stringify(response.data.data.token)) 
            window.location.assign('/');
          }          
          
        }, error => {
          alert(error.response.data.message);
          
        }
      )
    } else {
      alert(noti.MISSING_DATA)
    }
    
    
  };

  return (
    <>
    
    <Stack spacing={3}>
        <TextField 
        name="userName" 
        label="User Name" 
        value={userName} 
        required
        onChange={(event) => { handleUserName(event) }}
        />

        <TextField
          name="password"
          label="Password"
          required
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => { handlePassword(event) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
        
      </Stack>
    
    </>
  );
}
