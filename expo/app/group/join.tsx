import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import { LinearGradient } from 'expo-linear-gradient';
import { UserPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function JoinGroupScreen() {
  const router = useRouter();
  const { joinGroup } = useGroups();
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      Alert.alert('Error', 'Please enter a group code');
      return;
    }
    
    try {
      setIsLoading(true);
      const group = await joinGroup(groupCode);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      router.push(`/group/${group.id}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen 
        options={{ 
          title: 'Join Group',
          headerStyle: { backgroundColor: '#8A2BE2' },
          headerTintColor: 'white',
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#9932CC', '#8A2BE2']}
            style={styles.iconBackground}
          >
            <UserPlus color="white" size={40} />
          </LinearGradient>
        </View>
        
        <Text style={styles.title}>Join a Group</Text>
        <Text style={styles.subtitle}>
          Enter the group code to join your friends
        </Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Group Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group code"
            value={groupCode}
            onChangeText={(text) => setGroupCode(text.toUpperCase())}
            autoCapitalize="characters"
            maxLength={6}
          />
          
          <TouchableOpacity
            style={[styles.button, !groupCode.trim() && styles.buttonDisabled]}
            onPress={handleJoinGroup}
            disabled={!groupCode.trim() || isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9932CC', '#8A2BE2']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Joining...' : 'Join Group'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Ask your friends for their group code to join their Aura Battle group.
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
    textAlign: 'center',
    letterSpacing: 4,
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