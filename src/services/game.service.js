import axios from "axios";
import headerService from "./header.service";


const GameAll = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Game/All`, { 
    headers: headerService.accessToken()
})
);
const GameAvailable = () => (
  axios.get(`${process.env.REACT_APP_API_URL}/Game/Available`, { 
    headers: headerService.accessToken()
})
);
const GetGameById = (gameId) => (
  axios.get(`${process.env.REACT_APP_API_URL}/Game/${gameId}`, { 
    headers: headerService.accessToken()
})
);

const DeleteGameById = (gameId) => (
  axios.delete(`${process.env.REACT_APP_API_URL}/Game/${gameId}`, { 
    headers: headerService.accessToken()
})
);

const PutDisableGameById = (gameId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Game/Disable/${gameId}`, {

  },{ 
    headers: headerService.accessToken()
})
);
const PutEnableGameById = (gameId) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Game/Enable/${gameId}`, {
    
  },{ 
    headers: headerService.accessToken()
})
);

const PutGameById = (name, description, instruction, gameId, imageUrl, isEnable = true) => (
  axios.put(`${process.env.REACT_APP_API_URL}/Game/${gameId}`,{
    name, description, instruction, isEnable, imageUrl
  }, { 
    headers: headerService.accessToken()
})
);
const PostGame = (name, description, instruction, imageUrl, isEnable = true) => (
  axios.post(`${process.env.REACT_APP_API_URL}/Game/Create`,{
    name, description, instruction, isEnable, imageUrl
  }, { 
    headers: headerService.accessToken()
})
);

const GameService = {
  GameAll,
  GameAvailable,
  GetGameById,
  PostGame,
  PutGameById,
  DeleteGameById,
  PutDisableGameById,
  PutEnableGameById
}

export default  GameService;
