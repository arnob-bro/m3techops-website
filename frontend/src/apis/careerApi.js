import api from "./api";

export default class CareerApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.careerApi = api;
    this.baseURL = baseURL+"/career";
  }
  
}
