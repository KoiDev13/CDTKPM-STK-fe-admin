import axios from "axios";
import headerService from "./header.service";


const PartnerCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/PartnerCount`,  { 
     headers: headerService.accessToken()
  })
)

const StoreCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/StoreCount`,  { 
     headers: headerService.accessToken()
  })
)

const EndUserCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/EndUserCount`,  { 
     headers: headerService.accessToken()
  })
)

const CampaignCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/CampaignCount`,  { 
     headers: headerService.accessToken()
  })
)

const CampaignCountByStatus = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/CampaignCountByStatus`,  { 
     headers: headerService.accessToken()
  })
)
const CampaignCountByGame = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/CampaignCountByGame`,  { 
     headers: headerService.accessToken()
  })
)
const ProductCategoryCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/ProductCategoryCount`,  { 
     headers: headerService.accessToken()
  })
)
const ProductItemCount = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/ProductItemCount`,  { 
     headers: headerService.accessToken()
  })
)

const ItemCountByCategory = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/Dashboard/Admin/ItemCountByCategory`,  { 
     headers: headerService.accessToken()
  })
)

const dashboardService = {
    PartnerCount,
    StoreCount,
    EndUserCount,
    CampaignCount,
    CampaignCountByGame,
    CampaignCountByStatus,
    ProductCategoryCount,
    ProductItemCount, 
    ItemCountByCategory
}
export default dashboardService;
  
  