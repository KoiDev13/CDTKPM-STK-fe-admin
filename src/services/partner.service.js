import axios from "axios";
import headerService from "./header.service";


const partnerAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Partner/All`, { 
    headers: headerService.accessToken() 
  })
);
const GetPartnerById = (partnerId) => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Partner/${partnerId}`, { 
    headers: headerService.accessToken() 
  })
);
const PutPartnerById = (partnerId, name, gender, dateOfBirth, address, partnerType, company = null) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Partner/${partnerId}`, {
    accountUpdate:{
      name,
      gender,
      dateOfBirth,
      address
    }, 
    partnerType,
    company
  },{ 
    headers: headerService.accessToken() 
  })
);
const PartnerService = {
  partnerAll,
  GetPartnerById,
  PutPartnerById
}

export default  PartnerService
