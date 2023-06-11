import axios from "axios";

import headerService from "./header.service";

const ProductCategoryAll = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductCategory/All`, { 
      headers: headerService.accessToken()
  })
  );
  const ProductCategoryAvailable = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductCategory/Available`, { 
      headers: headerService.accessToken()
  })
  );
  const GetProductCategoryById = (productCategoryId) => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductCategory/${productCategoryId}`, { 
      headers: headerService.accessToken()
  })
  );
  
  const DeleteProductCategoryById = (productCategoryId) => (
    axios.delete(`${process.env.REACT_APP_API_URL}/ProductCategory/${productCategoryId}`, { 
      headers: headerService.accessToken()
  })
  );
  
  const DisablePutProductCategoryById = ( productCategoryId) => (
    axios.put(`${process.env.REACT_APP_API_URL}/ProductCategory/Disable/${productCategoryId}`,{
      
    }, { 
      headers: headerService.accessToken()
  })
  );

  const EnablePutProductCategoryById = (productCategoryId) => (
    axios.put(`${process.env.REACT_APP_API_URL}/ProductCategory/Enable/${productCategoryId}`,{
      
    }, { 
      headers: headerService.accessToken()
  })
  );

  const PutProductCategoryById = (name, description, productCategoryId ,  isEnable = true) => (
    axios.put(`${process.env.REACT_APP_API_URL}/ProductCategory/${productCategoryId}`,{
      name, description,  isEnable
    }, { 
      headers: headerService.accessToken()
  })
  );

  
  const PostProductCategory = (name, description,  isEnable = true) => (
    axios.post(`${process.env.REACT_APP_API_URL}/ProductCategory/Create`,{
      name, description,  isEnable
    }, { 
      headers: headerService.accessToken()
  })
  );
const ProductCategoryService = {
  PostProductCategory,
    ProductCategoryAll,
    ProductCategoryAvailable,
    GetProductCategoryById,
    PutProductCategoryById,
    DisablePutProductCategoryById,
    EnablePutProductCategoryById,
    DeleteProductCategoryById
}

  export default ProductCategoryService 