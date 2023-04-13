import axios from "axios";
import {auth, idToken} from "./firebase_helper";

//pass new generated access token here
let token = idToken();

//apply base url for axios
// const API_URL = "https://us-central1-kobermart2022.cloudfunctions.net/server/";
const API_URL = "http://127.0.0.1:4000/";

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export async function get(url, config = {}) {
  console.log("run get from api helper");
  if(auth().currentUser){
    token = await idToken();
    console.log("refreshToken generated from api helper")
  }
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
  console.log("run post from api helper");
  if(auth().currentUser){
    token = await idToken();
    console.log("refreshToken generated from api helper")
  }
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data);
}
