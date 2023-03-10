import express from "express";
import usersInput from "../configs/users_QCNCJzCR.mjs";
import employeesInput from "../configs/employees_ENoVMqdk.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "QCNCJzCR");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "ENoVMqdk");

  res.json(employeesInput);
});

export default router;
