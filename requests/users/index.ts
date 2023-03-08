import fetch from "node-fetch";
import baseUrl from "../url";
import { Users } from "./type";

async function getUsersData(): Promise<Users> {
  try {
    const response = await fetch(baseUrl + "users");

    const data = (await response.json()) as Users;

    const users = Object.assign({}, data);

    return users;
  } catch (error) {
    throw error;
  }
}

export default getUsersData;
