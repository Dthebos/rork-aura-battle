import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Group, AuraEvent, User } from '@/types';
import { useAuth } from './use-auth-store';

const GROUPS_STORAGE_KEY = 'aura-battle-groups';
const EVENTS_STORAGE_KEY = 'aura-battle-events';

// Generate a random 6-character code
const generateGroupCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const [GroupsContext, useGroups] = createContextHook(() => {
  const queryClient = useQueryClient();
  const { currentUser, users, updateUser } = useAuth();

  // Load groups from storage
  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const storedGroups = await AsyncStorage.getItem(GROUPS_STORAGE_KEY);
      return storedGroups ? JSON.parse(storedGroups) as Group[] : [];
    }
  });

  // Load events from storage
  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const storedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      return storedEvents ? JSON.parse(storedEvents) as AuraEvent[] : [];
    }
  });

  // Save groups to storage
  const saveGroupsMutation = useMutation({
    mutationFn: async (groups: Group[]) => {
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      return groups;
    },
    onSuccess: (groups) => {
      queryClient.setQueryData(['groups'], groups);
    }
  });

  // Save events to storage
  const saveEventsMutation = useMutation({
    mutationFn: async (events: AuraEvent[]) => {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      return events;
    },
    onSuccess: (events) => {
      queryClient.setQueryData(['events'], events);
    }
  });

  // Create a new group
  const createGroup = async (name: string) => {
    if (!currentUser) throw new Error('You must be logged in to create a group');
    
    const groups = groupsQuery.data || [];
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      code: generateGroupCode(),
      members: [currentUser.id],
      events: []
    };
    
    await saveGroupsMutation.mutateAsync([...groups, newGroup]);
    return newGroup;
  };

  // Join a group by code
  const joinGroup = async (code: string) => {
    if (!currentUser) throw new Error('You must be logged in to join a group');
    
    const groups = groupsQuery.data || [];
    const group = groups.find(g => g.code.toUpperCase() === code.toUpperCase());
    
    if (!group) {
      throw new Error('Group not found');
    }
    
    if (group.members.includes(currentUser.id)) {
      throw new Error('You are already a member of this group');
    }
    
    const updatedGroup = {
      ...group,
      members: [...group.members, currentUser.id]
    };
    
    const updatedGroups = groups.map(g => 
      g.id === group.id ? updatedGroup : g
    );
    
    await saveGroupsMutation.mutateAsync(updatedGroups);
    return updatedGroup;
  };

  // Add aura points to a user
  const addAuraPoints = async (groupId: string, toUserId: string, points: number, description: string) => {
    if (!currentUser) throw new Error('You must be logged in to add aura points');
    
    const groups = groupsQuery.data || [];
    const group = groups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error('Group not found');
    }
    
    if (!group.members.includes(currentUser.id)) {
      throw new Error('You are not a member of this group');
    }
    
    if (!group.members.includes(toUserId)) {
      throw new Error('User is not a member of this group');
    }
    
    // Create new event
    const newEvent: AuraEvent = {
      id: Date.now().toString(),
      groupId,
      fromUserId: currentUser.id,
      toUserId,
      points,
      description,
      timestamp: Date.now()
    };
    
    const events = eventsQuery.data || [];
    await saveEventsMutation.mutateAsync([...events, newEvent]);
    
    // Update group events
    const updatedGroup = {
      ...group,
      events: [...group.events, newEvent.id]
    };
    
    const updatedGroups = groups.map(g => 
      g.id === group.id ? updatedGroup : g
    );
    
    await saveGroupsMutation.mutateAsync(updatedGroups);
    
    // Update user's total aura
    const targetUser = users.find(user => user.id === toUserId);
    if (targetUser) {
      const updatedUser = {
        ...targetUser,
        totalAura: targetUser.totalAura + points
      };
      await updateUser(updatedUser);
    }
    
    return newEvent;
  };

  // Get user's groups
  const getUserGroups = () => {
    if (!currentUser) return [];
    
    const groups = groupsQuery.data || [];
    return groups.filter(group => group.members.includes(currentUser.id));
  };

  // Get group by ID
  const getGroupById = (groupId: string) => {
    const groups = groupsQuery.data || [];
    return groups.find(group => group.id === groupId);
  };

  // Get group events
  const getGroupEvents = (groupId: string) => {
    const events = eventsQuery.data || [];
    return events.filter(event => event.groupId === groupId)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  // Get group members
  const getGroupMembers = (groupId: string) => {
    const group = getGroupById(groupId);
    if (!group) return [];
    
    return users.filter(user => group.members.includes(user.id))
      .sort((a, b) => b.totalAura - a.totalAura);
  };

  return {
    groups: groupsQuery.data || [],
    events: eventsQuery.data || [],
    isLoading: groupsQuery.isLoading || eventsQuery.isLoading,
    createGroup,
    joinGroup,
    addAuraPoints,
    getUserGroups,
    getGroupById,
    getGroupEvents,
    getGroupMembers
  };
});