import axios from "axios";
import {
    onGlobalError,
    onGlobalSuccess,
    API_HOST_PREFIX,
  } from "./serviceHelpers";

const productsService = {endpoint: `${API_HOST_PREFIX}/api/products`};

productsService.addProduct = (payload) => {
    const config = {
      method: "POST",
      url: `${productsService.endpoint}`,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
  };

  productsService.getProductById = (id) => {
    const config = {
      method: "GET",
      url: `${productsService.endpoint}/${id}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);  };

  export default productsService;
  