import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import headerService from '../services/header.service';
// components


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  useEffect(()=>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
  },[])

  return (
    <>
      <Helmet>
        <title> Dashboard  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        
      </Container>
    </>
  );
}
