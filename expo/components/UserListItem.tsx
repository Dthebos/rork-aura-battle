import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import UserAvatar from './UserAvatar';

interface UserListItemProps {
  user: User;
  rank?: number;
  onPress?: () => void;
}

export default function UserListItem({ user, rank, onPress }: UserListItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      testID="user-list-item"
    >
      {rank !== undefined && (
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{rank}</Text>
        </View>
      )}
      
      <UserAvatar user={user} size={40} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      
      <View style={styles.auraContainer}>
        <Text style={styles.auraValue}>{user.totalAura}</Text>
        <Text style={styles.auraLabel}>Aura</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  auraContainer: {
    alignItems: 'center',
  },
  auraValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  auraLabel: {
    fontSize: 12,
    color: '#666',
  }
});