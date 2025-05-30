export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  friends?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
}
