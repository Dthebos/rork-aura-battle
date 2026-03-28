import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import { Group } from '@/types';
import { useGroups } from '@/hooks/use-groups-store';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  const { getGroupMembers } = useGroups();
  const members = getGroupMembers(group.id);
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container}
      activeOpacity={0.8}
      testID="group-card"
    >
      <LinearGradient
        colors={['#8A2BE2', '#4B0082']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {group.name}
          </Text>
          
          <View style={styles.infoRow}>
            <Users size={16} color="white" />
            <Text style={styles.memberCount}>
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Group Code:</Text>
            <Text style={styles.code}>{group.code}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberCount: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeLabel: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  code: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  }
});