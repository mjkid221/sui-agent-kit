import axios from "axios";

export const goPlusLabsApiV1 = axios.create({
  baseURL: "https://api.gopluslabs.io/api/v1",
});
