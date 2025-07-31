export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}
