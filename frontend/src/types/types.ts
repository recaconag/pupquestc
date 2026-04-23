export type Role = "ADMIN" | "USER";

export type decodedUser = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  userImg?: string;
  iat?: number;
  exp?: number;
};

export type lostItem = {
  id: string;
  img: string;
  userId: string;
  categoryId: string;
  lostItemName: string;
  description: string;
  date: string;
  location: string;
  isFound: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string;
    email: string;
  };
  category?: {
    name: string;
  };
};

export type foundItem = {
  id: string;
  img: string;
  userId: string;
  categoryId: string;
  foundItemName: string;
  description: string;
  date: string;
  location: string;
  isClaimed: boolean;
  claimProcess: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string;
    email: string;
  };
  category?: {
    name: string;
  };
};

export type modals = {
  message: string;
  status: boolean;
};