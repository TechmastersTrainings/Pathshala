import { create } from 'zustand';
import { api } from '@/services/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'FACULTY' | 'PARENT';
  school_id: number | null;
  school_name: string | null;
  school_status: string | null;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user };
    } catch (error: any) {
      set({ isLoading: false });
      throw error.response?.data || { detail: 'An error occurred during login.' };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initAuth: async () => {
    set({ isLoading: true });
    const accessToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (accessToken && savedUser) {
      try {
        // Fetch fresh profile details from /auth/me/ to verify token validity
        const response = await api.get('/auth/me/');
        
        // Update user state using cached metadata but merge any fresh fields
        const cachedUser = JSON.parse(savedUser);
        const mergedUser = { ...cachedUser, ...response.data };
        
        set({
          user: mergedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // Token has expired or is invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
