import axios from "axios";
import headerService from "./header.service";


const StoreAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Store/All`, { 
    headers: headerService.accessToken() 
})
);

const GetStoreById = (storeId) => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Store/${storeId}`, { 
    headers: headerService.accessToken() 
})
);

const StoreApproved = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Store/Approved` , { 
    headers: headerService.accessToken()
})
);

const StoreRejected = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Store/Rejected`, { 
    headers: headerService.accessToken() 
})
);

const StoreNeedApproval = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Store/NeedApproval`, { 
    headers: headerService.accessToken()
})
);

const StoreApproveStoreId = (storeId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Store/Approve/${storeId}`, {

  },{ 
    headers: headerService.accessToken()
})
);

const StoreRejecteStoreId = (storeId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Store/Reject/${storeId}`, {
    
  }, { 
    headers: headerService.accessToken()
})
);

const StoreEnableStoreId = (storeId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Store/Enable/${storeId}`, {

  },{ 
    headers: headerService.accessToken()
})
);

const StoreDisableStoreId = (storeId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Store/Disable/${storeId}`, {
    
  }, { 
    headers: headerService.accessToken()
})
);
const PutStoreByAdmin = (storeId, name, description, address, openTime, closeTime,  bannerUrl, isEnable = true) => (
    
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Store/${storeId}`,{
      name, description, address, openTime, closeTime, isEnable, bannerUrl
 }, { 
  headers: headerService.accessToken() 
  })
);

const StoreService = {
  GetStoreById,
  StoreAll,
  StoreApproveStoreId,
  StoreApproved,
  StoreNeedApproval,
  StoreRejecteStoreId,
  StoreRejected,
  StoreEnableStoreId,
  StoreDisableStoreId,
  PutStoreByAdmin
}




export default  StoreService;
