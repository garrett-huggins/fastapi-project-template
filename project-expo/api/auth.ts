import axios from "axios";
import { API_URL } from "../config/project";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_disabled: boolean;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const forgotPassword = async (email: string) => {
  const result = await axios.post(
    `${API_URL}/user/password/forgot?email=${email}`
  );
  return result.data;
};

export const resetPassword = async (data: {
  token: string;
  new_password: string;
}) => {
  const result = await axios.post(`${API_URL}/user/password/reset`, data);
  return result.data;
};

export const login = async (email: string, password: string) => {
  const result: { data: Tokens } = await axios.post(`${API_URL}/user/login`, {
    email,
    password,
  });
  return result.data;
};

export const userRegister = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  const result: { data: User } = await axios.post(`${API_URL}/user/register`, {
    email,
    password,
    first_name,
    last_name,
  });
  return result.data;
};

export const changePassword = async (
  current_password: string,
  new_password: string
) => {
  try {
    const result = await axios.put(`${API_URL}/user/password/change`, {
      current_password,
      new_password,
    });
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const refreshTokenRequest = async (refreshToken: string) => {
  const result = await axios.post(`${API_URL}/token/refresh`, {
    refresh_token: refreshToken,
  });
  return result.data;
};
