import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth-store';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, User } from 'lucide-react-native';
import UserAvatar from '@/components/UserAvatar';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) return null;
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#4B0082']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <UserAvatar user={currentUser} size={100} />
        </View>
        
        <Text style={styles.username}>{currentUser.username}</Text>
        <View style={styles.auraContainer}>
          <Text style={styles.auraLabel}>Total Aura</Text>
          <Text style={styles.auraValue}>{currentUser.totalAura}</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What is Aura?</Text>
          <Text style={styles.infoText}>
            Aura (a.k.a. brainrot aura) is a fun way to track and compete with friends
            on who has the most chaotic or meme-worthy moments. The higher your Aura score,
            the more powerful your brainrot energy!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  auraContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  auraLabel: {
    color: 'white',
    fontSize: 14,
  },
  auraValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  }
});