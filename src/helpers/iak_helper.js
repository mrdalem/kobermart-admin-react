import axios from "axios";
import md5 from "md5";

const username = process.env.REACT_APP_IAK_USER_HP;
const apiKey = process.env.REACT_APP_IAK_API_KEY;
const stage = process.env.REACT_APP_IAK_STAGE;

const signPricelist = md5(username+apiKey+"pl");

//production
const PREPAID_API_URL = "https://prepaid.iak.id/";

//development
// const PREPAID_API_URL = "https://prepaid.iak.dev/";

const prepaid = axios.create({
  baseURL: PREPAID_API_URL,
});

prepaid.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);


export async function prepaidCheckBalance() {
    const data = {
        "username": username,
        "sign": md5(username+apiKey+"bl"),
    }
    return prepaid
    .post("api/check-balance", { ...data })
    .then(response => response.data);
}

export async function prepaidPricelist() {
    const data = {
        "username": username,
        "sign": md5(username+apiKey+"pl"),
        "status": "all",
    }
    return prepaid
    .post("api/pricelist/", { ...data })
    .then(response => response.data);
}

// export async function get(url, config = {}) {
//   return await prepaid.get(url, { ...config }).then(response => response.data);
// }

// export async function put(url, data, config = {}) {
//   return prepaid
//     .put(url, { ...data }, { ...config })
//     .then(response => response.data);
// }

// export async function del(url, config = {}) {
//   return await prepaid
//     .delete(url, { ...config })
//     .then(response => response.data);
// }
