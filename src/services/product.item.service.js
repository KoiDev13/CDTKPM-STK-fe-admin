import axios from "axios";

import headerService from "./header.service";


  const ProductItemAll = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/All`, { 
      headers: headerService.accessToken()
  })
  );
  
  const ProductItemAvailable = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/Available`, { 
      headers: headerService.accessToken()
  })
  );
  const ProductItemDisable = () => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/Disable`, { 
      headers: headerService.accessToken()
  })
  );
  const ProductItemAllByStoreId = (storeId) => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/All/${storeId}`, { 
      headers: headerService.accessToken()
  })
  );
  const ProductItemAvailableByStoreId = (storeId ) => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/Available/${storeId}`, { 
      headers: headerService.accessToken()
  })
  );
  const ProductItemDisableByStoreId = (storeId ) => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/Disable/${storeId}`, { 
      headers: headerService.accessToken()
  })
  );
  const GetProductItemById = (productItemId) => (
    axios.get(`${process.env.REACT_APP_API_URL}/ProductItem/${productItemId}`, { 
      headers: headerService.accessToken()
  })
  );
  
  
const ProductItemService = {
  ProductItemAll,
    ProductItemAvailable,
    GetProductItemById,
    ProductItemDisable,
    ProductItemAvailableByStoreId,
    ProductItemAllByStoreId,
    ProductItemDisableByStoreId
}


export default ProductItemService;