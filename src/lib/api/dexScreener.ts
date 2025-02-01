import axios from "axios";

export const dexScreenerApi = axios.create({
  baseURL: "https://api.dexscreener.com",
});
