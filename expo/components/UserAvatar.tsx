import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { User } from '@/types';

interface UserAvatarProps {
  user: User;
  size?: number;
  showUsername?: boolean;
  showAura?: boolean;
}

export default function UserAvatar({ 
  user, 
  size = 50, 
  showUsername = false,
  showAura = false
}: UserAvatarProps) {
  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container} testID="user-avatar">
      {user.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 }
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View 
          style={[
            styles.avatarPlaceholder,
            { width: size, height: size, borderRadius: size / 2 }
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(user.username)}
          </Text>
        </View>
      )}
      
      {showUsername && (
        <Text style={styles.username} numberOfLines={1}>
          {user.username}
        </Text>
      )}
      
      {showAura && (
        <Text style={styles.aura}>
          {user.totalAura} Aura
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#E1E1E1',
  },
  avatarPlaceholder: {
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontWeight: 'bold',
  },
  username: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  aura: {
    marginTop: 2,
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '600',
  }
});