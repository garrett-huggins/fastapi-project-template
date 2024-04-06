import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/profile`;

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_disabled: boolean;
}

export interface IUserUpdate {
  first_name: string;
  last_name: string;
  email: string;
}

export const getProfile = async () => {
  const result: { data: IUser } = await axios.get(`${API_URL}`);
  return result.data;
};

export const updateProfile = async (data: IUserUpdate) => {
  const result: { data: IUser } = await axios.put(`${API_URL}`, data);
  return result.data;
};
