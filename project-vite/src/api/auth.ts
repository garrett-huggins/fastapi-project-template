import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/user`;

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface ICreateUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const forgotPassword = async (email: string) => {
  const result = await axios.post(`${API_URL}/password/forgot/${email}`);
  return result.data;
};

export const resetPassword = async (data: {
  token: string;
  new_password: string;
}) => {
  const result = await axios.post(`${API_URL}/password/reset`, data);
  return result.data;
};

export const registerUser = async (data: ICreateUser) => {
  const result = await axios.post(`${API_URL}/register`, data);
  return result.data;
};

export const login = async (email: string, password: string) => {
  const result: { data: { access_token: string; token_type: string } } =
    await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
  return result.data;
};

export const changePassword = async (
  current_password: string,
  new_password: string
) => {
  try {
    const result = await axios.put(`${API_URL}/password/change`, {
      current_password,
      new_password,
    });
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
