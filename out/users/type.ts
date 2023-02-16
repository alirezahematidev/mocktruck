type Users = {
  userId: number;
  email: string;
  firstname: string;
  employees: {
    employeeId: number;
    name: string;
  }[];
};

export type { Users };
