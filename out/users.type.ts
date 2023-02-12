type Users = {
  firstname: string;
  lastname: string;
  email: string;
  age?: number;
  bio?: string | null;
  createDate?: string;
  publishedDate?: string;
  location: {
    city?: string | null;
    country?: string | null;
  };
};

export type { Users };
