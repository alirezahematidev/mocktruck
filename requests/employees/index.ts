import fetch from "node-fetch";
import baseUrl from "../url";
import { Employees } from "./type";

async function getEmployeesData(): Promise<Employees> {
  try {
    const response = await fetch(baseUrl + "employees");

    const data = (await response.json()) as Employees;

    const employees = Object.assign({}, data);

    return employees;
  } catch (error) {
    throw error;
  }
}

export default getEmployeesData;
