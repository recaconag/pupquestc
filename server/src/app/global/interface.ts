export type TLogin = {
  email?: string;
  password: string;
};

export type TRegister = {
  email: string;
  password: string;
  userImg?: string;
};

export type TChangePassword = {
  newPassword: string;
  currentPassword: string;
};

export type TFilter = {
  searchTerm?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  foundItemName?: string;
  lostItemName?: string;
  categoryId?: string;
  location?: string;
  status?: string;
};