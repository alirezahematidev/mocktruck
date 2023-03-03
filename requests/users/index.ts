import fetch from "node-fetch";
import baseUrl from "../url";
import { Users } from "./type";

async function getUsersData(): Promise<Users> {
  try {
    const response = await fetch(baseUrl + "users");

    const key = response.headers.get("X-Truck-Key");

    if (!key) {
      throw new Error("The api:users is undefined.");
    }

    const data = (await response.json()) as Users;

    const users = Object.assign({}, data);

    Object.defineProperty(users, "__id", {
      value: key,
      enumerable: false,
      configurable: false,
      writable: false,
    });

    return users;
  } catch (error) {
    throw error;
  }
}

export default getUsersData;
