import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import UserListItem from '@/components/UserListItem';
import EmptyState from '@/components/EmptyState';
import { Users } from 'lucide-react-native';

export default function LeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroupById, getGroupMembers } = useGroups();
  
  const group = getGroupById(id);
  const members = getGroupMembers(id);
  
  if (!group) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Group Code: <Text style={styles.code}>{group.code}</Text></Text>
      </View>
      
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <UserListItem 
              user={item} 
              rank={index + 1}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No Members Yet"
          message="Invite friends to join your group using the group code."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#8A2BE2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  code: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  listContent: {
    padding: 16,
  }
});