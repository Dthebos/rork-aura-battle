import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { User } from '@/types';

const USERS_STORAGE_KEY = 'aura-battle-users';
const CURRENT_USER_KEY = 'aura-battle-current-user';

export const [AuthContext, useAuth] = createContextHook(() => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Load users from storage
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        return storedUsers ? JSON.parse(storedUsers) as User[] : [];
      } catch (error) {
        console.error('Failed to load users:', error);
        return [];
      }
    }
  });

  // Load current user ID from storage
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (userId) setCurrentUserId(userId);
      } catch (error) {
        console.error('Failed to load current user:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadCurrentUser();
  }, []);

  // Save users to storage
  const saveUsersMutation = useMutation({
    mutationFn: async (users: User[]) => {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return users;
    },
    onSuccess: (users) => {
      queryClient.setQueryData(['users'], users);
    }
  });

  // Save current user ID to storage
  const saveCurrentUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await AsyncStorage.setItem(CURRENT_USER_KEY, userId);
      return userId;
    }
  });

  // Create a new user
  const createUser = async (username: string, profilePicture?: string) => {
    const users = usersQuery.data || [];
    
    // Check if username already exists
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      profilePicture,
      totalAura: 0
    };
    
    await saveUsersMutation.mutateAsync([...users, newUser]);
    await saveCurrentUserMutation.mutateAsync(newUser.id);
    setCurrentUserId(newUser.id);
    
    return newUser;
  };

  // Login with username
  const login = async (username: string) => {
    const users = usersQuery.data || [];
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await saveCurrentUserMutation.mutateAsync(user.id);
    setCurrentUserId(user.id);
    
    return user;
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setCurrentUserId(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Get current user
  const currentUser = usersQuery.data?.find(user => user.id === currentUserId) || null;

  // Update user
  const updateUser = async (updatedUser: User) => {
    const users = usersQuery.data || [];
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    await saveUsersMutation.mutateAsync(updatedUsers);
    return updatedUser;
  };

  return {
    users: usersQuery.data || [],
    currentUser,
    isLoading: usersQuery.isLoading || !isInitialized,
    isAuthenticated: !!currentUserId && isInitialized,
    createUser,
    login,
    logout,
    updateUser
  };
});