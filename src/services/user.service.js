import axios from "axios";
import headerService from "./header.service";


const UserAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/EndUser/All`, { 
    headers: headerService.accessToken() 
  })
);
const GetUserById = (endUserId) => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/EndUser/${endUserId}`, { 
    headers: headerService.accessToken() 
  })
);
const PutUserById = (endUserId, name, gender, dateOfBirth, address) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/EndUser/${endUserId}`, {
    name,
    gender,
    dateOfBirth,
    address
  },{ 
    headers: headerService.accessToken() 
  })
);
const UserService = {
  UserAll,
  GetUserById,
  PutUserById
}

export default  UserService
