import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import AuraEventCard from '@/components/AuraEventCard';
import EmptyState from '@/components/EmptyState';
import { ClipboardList } from 'lucide-react-native';

export default function LogScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroupEvents } = useGroups();
  
  const events = getGroupEvents(id);
  
  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AuraEventCard event={item} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No Aura Events Yet"
          message="Start adding Aura points to see the activity log."
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
  listContent: {
    padding: 16,
  }
});