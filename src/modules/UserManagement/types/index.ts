export type User = {
  id: number;
  name: string;
  age: number;
  photo_url?: string;
};
export type RegisterUserParams = {
  gender?: string;
  completedBooks?: number;
  userName?: string;
  confirm?: string;
  email?: string;
  employeeId?: string;
  location?: string;
  password?: string;
  phone?: string;
  position?: string;
  role?: string;
  is_active?: boolean;
  // username?: string
  // name?: string
  id?: string;
  photo_url?: string;
  readingHabits?: any;
  language?: any;
  dateBirth?: string;
  photo?: any;
};
export type UserData = {
  id: string;
  is_active: boolean;
};
export type UserDataRole = {
  id: string;
  role: string;
};

export type UserFilterParams = {
  name?: string;
  email?: string;
  is_active?: boolean;
  role?: string;
  order_by?: string;
  from_date?: string;
  to_date?: string;
};
