const accessToken = () => {
  const user = JSON.parse(localStorage.getItem('token'));
  
  
  if (user &&  user.accessToken)  {
    return {
      Authorization: `Bearer ${user.accessToken}`      
    } 
  }
  return {

  }
}

const refreshToken = () => {
  
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.refreshToken)  {
    return user.refreshToken
  }
  return ""
}
const accessTokenImage = () => {
  const user = JSON.parse(localStorage.getItem('token'));
  
  if (user &&  user.accessToken)  {
    return {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "multipart/form-data"     
    } 
  }
  return {

  }
}

const userName = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if(user && user.userName){
    return user.userName
  }  
  return ""  
}

const GetUser = () => (
  JSON.parse(localStorage.getItem('user'))
);
const HeaderService = {
  accessToken,
  refreshToken,
  userName,
  GetUser,
  accessTokenImage
}

export default HeaderService
