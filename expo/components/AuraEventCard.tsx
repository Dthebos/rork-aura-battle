import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuraEvent } from '@/types';
import { useAuth } from '@/hooks/use-auth-store';
import UserAvatar from './UserAvatar';

interface AuraEventCardProps {
  event: AuraEvent;
}

export default function AuraEventCard({ event }: AuraEventCardProps) {
  const { users } = useAuth();
  
  const fromUser = users.find(user => user.id === event.fromUserId);
  const toUser = users.find(user => user.id === event.toUserId);
  
  if (!fromUser || !toUser) return null;
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  return (
    <View style={styles.container} testID="aura-event-card">
      <View style={styles.header}>
        <UserAvatar user={fromUser} size={36} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{fromUser.username}</Text>
          <Text style={styles.timestamp}>
            {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.action}>
          gave <Text style={styles.points}>{event.points > 0 ? '+' : ''}{event.points} Aura</Text> to <Text style={styles.targetUser}>{toUser.username}</Text>
        </Text>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>"{event.description}"</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  content: {
    marginLeft: 48,
  },
  action: {
    fontSize: 15,
    lineHeight: 20,
  },
  points: {
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  targetUser: {
    fontWeight: '600',
  },
  descriptionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  description: {
    fontStyle: 'italic',
    fontSize: 14,
  }
});