import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { createGroup } = useGroups();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    try {
      setIsLoading(true);
      const newGroup = await createGroup(groupName);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      router.push(`/group/${newGroup.id}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
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
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.iconBackground}
          >
            <Users color="white" size={40} />
          </LinearGradient>
        </View>
        
        <Text style={styles.title}>Create a New Group</Text>
        <Text style={styles.subtitle}>
          Start tracking Aura points with your friends
        </Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
            maxLength={30}
            autoCapitalize="words"
          />
          
          <TouchableOpacity
            style={[styles.button, !groupName.trim() && styles.buttonDisabled]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8A2BE2', '#4B0082']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating...' : 'Create Group'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            After creating a group, you can invite friends by sharing your group code.
          </Text>
        </View>
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
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});