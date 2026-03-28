import React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import { useAuth } from '@/hooks/use-auth-store';
import GroupCard from '@/components/GroupCard';
import EmptyState from '@/components/EmptyState';
import { UserPlus, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GroupsScreen() {
  const router = useRouter();
  const { getUserGroups } = useGroups();
  const { currentUser } = useAuth();
  
  const userGroups = getUserGroups();
  
  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };
  
  const handleJoinGroup = () => {
    router.push('/group/join');
  };
  
  const handleCreateGroup = () => {
    router.push('/create');
  };
  
  if (!currentUser) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {currentUser.username}!</Text>
        <Text style={styles.subtitle}>Your Aura: <Text style={styles.auraValue}>{currentUser.totalAura}</Text></Text>
      </View>
      
      {userGroups.length > 0 ? (
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard 
              group={item} 
              onPress={() => handleGroupPress(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No Groups Yet"
          message="Join or create a group to start tracking Aura points with your friends."
        />
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleJoinGroup}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#9932CC', '#8A2BE2']}
            style={styles.buttonGradient}
          >
            <UserPlus color="white" size={20} />
            <Text style={styles.buttonText}>Join Group</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCreateGroup}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.buttonGradient}
          >
            <Users color="white" size={20} />
            <Text style={styles.buttonText}>Create Group</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  auraValue: {
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  }
});