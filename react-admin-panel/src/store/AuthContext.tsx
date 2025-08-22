import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { AuthState, User, LoginRequest } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored authentication on app start
    const initializeAuth = async () => {
      const token = authService.getStoredToken();
      const user = authService.getStoredUser();

      if (token && user) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          dispatch({
            type: 'SET_USER',
            payload: { user: currentUser, token },
          });
        } catch (error) {
          // Token is invalid, clear stored data
          authService.logout();
          dispatch({ type: 'CLEAR_USER' });
        }
      } else {
        dispatch({ type: 'CLEAR_USER' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: 'SET_USER',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  const refreshUser = async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const user = await authService.getCurrentUser();
      dispatch({
        type: 'SET_USER',
        payload: { user, token: state.token! },
      });
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
