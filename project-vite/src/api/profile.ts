import axios from "axios";
import { API_URL } from "../config/project";
const API = `${API_URL}/profile`;

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
  const result: { data: IUser } = await axios.get(`${API}`);
  return result.data;
};

export const updateProfile = async (data: IUserUpdate) => {
  const result: { data: IUser } = await axios.put(`${API}`, data);
  return result.data;
};
