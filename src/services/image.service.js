import axios from "axios";
import headerService from "./header.service";


const ImageUpload = (file) => (
  axios.post(`${process.env.REACT_APP_API_URL}/Image/Upload`,
    file
  , { 
    headers: headerService.accessTokenImage() 
})
);

const ImageService = {
  ImageUpload
}


export default  ImageService;
