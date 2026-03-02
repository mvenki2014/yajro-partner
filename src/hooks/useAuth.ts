import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { tokenStorage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  profile?: string;
}

export const AUTH_QUERY_KEY = ['auth-user'];

export function useAuth() {
  const queryClient = useQueryClient();
  
  // We use a local state only to trigger a re-render when storage changes,
  // but the actual source of truth for the token is tokenStorage.
  const [, setSessionTick] = useState(0);

  useEffect(() => {
    const handleStorageChange = (e?: StorageEvent) => {
      // If it's a native storage event, only respond to relevant keys
      if (e && e.key && e.key !== 'access_token' && e.key !== 'refresh_token') {
        return;
      }

      setSessionTick((prev) => prev + 1);
      
      const token = tokenStorage.getAccessToken();
      // If the token was cleared, we want to reset the user query data immediately
      if (!token) {
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        // Clear all queries on logout for security
        queryClient.clear();
      } else {
        // If a new token was set, refetch user data
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      }
    };

    window.addEventListener('auth-storage-changed', handleStorageChange as EventListener);
    window.addEventListener('storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('auth-storage-changed', handleStorageChange as EventListener);
      window.removeEventListener('storage', handleStorageChange as EventListener);
    };
  }, [queryClient]);

  const accessToken = tokenStorage.getAccessToken();

  const { 
    data: user, 
    isLoading, 
    isFetching,
    error, 
    refetch 
  } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      if (!accessToken) return null;
      try {
        const response = await authApi.getMe();
        const userData = response.data as User;
        // Persist user data for faster initial load next time
        tokenStorage.setUser(userData);
        return userData;
      } catch (err) {
        // If it's an auth error, we've already cleared tokens in the interceptor,
        // which will trigger the storage event and this query's invalidation.
        return null;
      }
    },
    initialData: () => {
      // Use persisted user data as initial state to avoid blocking loader
      return tokenStorage.getUser();
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: false,            // Don't retry on 401 as interceptor handles refresh
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout API call failed', e);
    } finally {
      tokenStorage.clearTokens();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    }
  };

  const handleSetCredentials = (data: { user: User; accessToken: string; refreshToken: string }) => {
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    tokenStorage.setUser(data.user);
    queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    queryClient.setQueryData<User>(AUTH_QUERY_KEY, (oldUser) => {
      if (!oldUser) return undefined;
      const newUser = { ...oldUser, ...userData } as User;
      tokenStorage.setUser(newUser);
      return newUser;
    });
  };

  // We are "authenticating" if we have a token but haven't fetched the user yet
  // AND we don't have persisted user data to show
  const hasPersistedUser = !!tokenStorage.getUser();
  const isAuthenticating = !!accessToken && isLoading && !hasPersistedUser;

  return {
    user: user || null,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading: isLoading || isAuthenticating,
    isFetching,
    error,
    login: handleSetCredentials,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    refreshUser: refetch,
  };
}
