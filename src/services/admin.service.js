import axios from "axios";
import headerService from "./header.service";

const Login = (userName, password) => (
    axios.post(`${process.env.REACT_APP_API_URL}/Admin/Login`, {
        userName,
        password
      })
);
const Logout = () => (
  localStorage.clear()
)

const refreshToken = (token) => (
  
   axios.post(`${process.env.REACT_APP_API_URL}/Admin/RefreshToken`, {
    token
  }, { 
    headers: headerService.accessToken()
})
);

const changePassword = (oldPassword, newPassword) =>(
   axios.put(`${process.env.REACT_APP_API_URL}/Admin/ChangePassword`, {
    oldPassword, newPassword
  }, { 
    headers: headerService.accessToken()
})
);
const PutAdminUpdate = (name, gender, dateOfBirth, address, position, department) =>(
  axios.put(`${process.env.REACT_APP_API_URL}/Admin/Update`, {
    accountUpdate:{
      name, gender, dateOfBirth, address
    },
    position, 
    department
 }, { 
   headers: headerService.accessToken()
})
);
const AdminInfo = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Info`,  { 
   headers: headerService.accessToken()
})
)


const partnerAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/Partner/All`, { 
    headers: headerService.accessToken() 
  })
);
const endUserAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Admin/EndUser/All`, { 
    headers: headerService.accessToken() 
  })
);


const AdminService = {
  Login, 
  Logout, 
  refreshToken,   
  changePassword,
  partnerAll,
  endUserAll, 
  PutAdminUpdate,
  AdminInfo
}


export default  AdminService
