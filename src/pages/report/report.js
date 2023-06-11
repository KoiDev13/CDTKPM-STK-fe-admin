
import React,{ useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import { Grid, Container } from '@mui/material';

import AppWidgetSummaryOne from '../../sections/@dashboard/app/AppWidgetSummaryOne';
import AppWidgetSummaryTwo from '../../sections/@dashboard/app/AppWidgetSummaryTwo';
import AppWidgetSummaryThree from '../../sections/@dashboard/app/AppWidgetSummaryThree';
import dashboardService from '../../services/dashboard.service';
import headerService from '../../services/header.service';
import adminService from '../../services/admin.service';
// ----------------------------------------------------------------------


export default function Report() { 

  const [partner, setPartner] = useState([])
  const [partnerAll, setPartnerAll] = useState({});
  const [success, setSuccess] = useState(false)
  const [store, setStore] = useState([])
  const [storeAll, setStoreAll] = useState({});

  const [endUser, setEndUser] = useState([])
  const [endUserAll, setEndUserAll] = useState({});

  const [campaign, setCampaign] = useState({})
  const [category, setCategory] = useState({});
  const [productItem, setProductItem] = useState({

  });
  const [game, setGame] = useState([]);
  const [status, setStatus] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  useEffect(() =>{
    if(!headerService.GetUser() || headerService.refreshToken() === ""){
      window.location.assign('/login')
    }
    dashboardService.PartnerCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setPartner([{
            name: "Verified",
            value: temp.verified
          }])
          setPartnerAll({
            name: "Total Partner",
            value: temp.all
          })
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
    dashboardService.StoreCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setStoreAll({
            name: "Total Store",
            value: temp.all})
          setStore([{
            name: "NeedApproved",
            value: temp.needApproved
          }, {
            name: "Approved",
            value: temp.approved
          },{
            name: "Rejected",
            value: temp.rejected
          }])
        }
      }
    )
    dashboardService.EndUserCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setEndUser([{
            name: "Verified",
            value: temp.verified
          }])
          setEndUserAll({
            name: "Total EndUser",
            value: temp.all
          })
          
        }
      }
    )
    dashboardService.CampaignCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setCampaign({
            name: 'Total Campaign',
            value: temp.all
          })
        }
      }
    )
    dashboardService.CampaignCountByStatus().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          console.log(temp)
          setStatus(temp.campaignCount)
          
        }
      }
    )
    dashboardService.CampaignCountByGame().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          console.log(temp)
          setGame(temp.campaignCount)
        }
      }
    )
    dashboardService.ProductCategoryCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setCategory({
            name:"Total Category",
            value: temp.nCategory
          })
          
        }
      }
    )
    dashboardService.ProductItemCount().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          setProductItem({
            name:"Total Item",
            value: temp.nItem
          })
          
        }
      }
    )
    dashboardService.ItemCountByCategory().then(
      response => {
        if(response.data && response.data.success) {
          const temp = response.data.data
          console.log(temp)
          setItemCategory(temp.nItemByCategory)
        }
      }
    )
    

    
    
  },[success])

  return (
    <>
      <Helmet>
        <title> Reports  </title>
      </Helmet>
      <Container maxWidth="xl">

        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={partnerAll}  isActive={partner}  color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={endUserAll}  isActive={endUser}  color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={storeAll}  isActive={store}  color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={campaign}    color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={category}    color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryThree title={productItem}    color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryOne title="Campaign Status" isActive={status}    color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryTwo title="Games" isActive={game}    color="info"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummaryTwo title="Product Items" isActive={itemCategory}    color="info"/>
          </Grid>
          


        </Grid>
      </Container>
      
      
    </>
  );
}
