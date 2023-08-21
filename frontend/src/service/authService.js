import axios from "axios";

export const userData = (data) => axios.post("/auth/register", data);

export const userDataGoogle = (data) => axios.post("/auth/register-google", data);

export const loginData = (data) => axios.post("/auth/login", data);

export const userDataGoogleLogin = (data) => axios.post("/auth/login-google", data);

export const setTokenInLocalStorage = (token) => localStorage.setItem("token", JSON.stringify(token))