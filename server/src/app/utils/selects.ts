const userSelect = {
  id: true,
  name: true,
  email: true,
  userImg: true,
};

const categorySelect = {
  id: true,
  name: true,
};

const foundItemSelect = {
  id: true,
  img: true,
  foundItemName: true,
  description: true,
  location: true,
  date: true, 
  isClaimed: true,
  createdAt: true,
  user: {
    select: userSelect,
  },
  category: {
    select: categorySelect,
  },
};

const lostItemSelect = {
  id: true,
  img: true,
  lostItemName: true,
  description: true,
  location: true,
  date: true,
  isFound: true,
  createdAt: true,
  user: {
    select: userSelect,
  },
  category: {
    select: categorySelect,
  },
};

export const selects = {
  userSelect,
  foundItemSelect,
  lostItemSelect,
};