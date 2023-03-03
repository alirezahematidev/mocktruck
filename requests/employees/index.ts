import fetch from "node-fetch";
import baseUrl from "../url";
import { Employees } from "./type";

async function getEmployeesData(): Promise<Employees> {
  try {
    const response = await fetch(baseUrl + "employees");

    const key = response.headers.get("X-Truck-Key");

    if (!key) {
      throw new Error("The api:employees is undefined.");
    }

    const data = (await response.json()) as Employees;

    const employees = Object.assign({}, data);

    Object.defineProperty(employees, "__id", {
      value: key,
      enumerable: false,
      configurable: false,
      writable: false,
    });

    return employees;
  } catch (error) {
    throw error;
  }
}

export default getEmployeesData;
