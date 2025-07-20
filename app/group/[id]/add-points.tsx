import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import { useAuth } from '@/hooks/use-auth-store';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from '@/components/UserAvatar';
import * as Haptics from 'expo-haptics';
import { User } from '@/types';

export default function AddPointsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroupMembers, addAuraPoints } = useGroups();
  const { currentUser } = useAuth();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [points, setPoints] = useState('1');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const members = getGroupMembers(id);
  const filteredMembers = members.filter(member => member.id !== currentUser?.id);
  
  const handleAddPoints = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    
    const pointsValue = parseInt(points);
    if (isNaN(pointsValue)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    
    try {
      setIsLoading(true);
      await addAuraPoints(id, selectedUser.id, pointsValue, description);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Reset form
      setSelectedUser(null);
      setPoints('1');
      setDescription('');
      
      // Navigate to log
      router.push(`/group/${id}/log`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add points');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select User</Text>
          
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.userItem,
                  selectedUser?.id === item.id && styles.selectedUserItem
                ]}
                onPress={() => handleSelectUser(item)}
              >
                <UserAvatar user={item} size={40} />
                <Text style={styles.username}>{item.username}</Text>
                {selectedUser?.id === item.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.userList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No other members in this group</Text>
            }
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aura Points</Text>
          
          <View style={styles.pointsContainer}>
            <TouchableOpacity
              style={styles.pointsButton}
              onPress={() => setPoints(prev => {
                const current = parseInt(prev) || 0;
                return Math.max(current - 1, -10).toString();
              })}
            >
              <Text style={styles.pointsButtonText}>-</Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.pointsInput}
              value={points}
              onChangeText={setPoints}
              keyboardType="number-pad"
              maxLength={3}
            />
            
            <TouchableOpacity
              style={styles.pointsButton}
              onPress={() => setPoints(prev => {
                const current = parseInt(prev) || 0;
                return Math.min(current + 1, 10).toString();
              })}
            >
              <Text style={styles.pointsButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionHint}>
            Why does this person deserve Aura points?
          </Text>
          
          <TextInput
            style={styles.descriptionInput}
            placeholder="e.g. Wore cat ears to class unironically"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={100}
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedUser || !description.trim()) && styles.submitButtonDisabled
          ]}
          onPress={handleAddPoints}
          disabled={!selectedUser || !description.trim() || isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Adding...' : 'Add Aura Points'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userList: {
    paddingVertical: 8,
  },
  userItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 80,
  },
  selectedUserItem: {
    borderColor: '#8A2BE2',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  username: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8A2BE2',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsInput: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionHint: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});