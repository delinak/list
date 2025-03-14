import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListEntry from '../components/ListEntry';
import AddEntryModal from '../components/AddEntryModal';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../services/storage';

const ListDetailScreen = ({ route, navigation }) => {
  const { listId, listData } = route.params;
  const [list, setList] = useState(listData);
  const [entries, setEntries] = useState(listData.entries || []);
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [tags, setTags] = useState(listData.tags || []);

  useEffect(() => {
    // Extract unique tags from entries if not already available
    if (!tags || tags.length === 0) {
      const uniqueTags = new Map();
      entries?.forEach(entry => {
        entry.tags?.forEach(tag => {
          if (!uniqueTags.has(tag.id)) {
            uniqueTags.set(tag.id, tag);
          }
        });
      });
      setTags(Array.from(uniqueTags.values()));
    }
  }, []);

  const handleAddEntry = () => {
    setShowAddModal(true);
  };

  const handleEntrySubmit = async (newEntry) => {
    try {
      // Get all lists from storage
      const lists = await storage.getLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex === -1) {
        throw new Error('List not found');
      }

      // Add the new entry to the list
      lists[listIndex].entries = [newEntry, ...lists[listIndex].entries];
      lists[listIndex].lastUpdated = new Date().toISOString();
      
      // Save updated lists back to storage
      await storage.saveLists(lists);
      
      // Update local state
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      setList(prevList => ({
        ...prevList,
        lastUpdated: new Date().toISOString()
      }));
      
      // Update tags if new ones were added
      const newTags = newEntry.tags?.filter(
        newTag => !tags.some(existingTag => existingTag.id === newTag.id)
      ) || [];
      
      if (newTags.length > 0) {
        setTags(prevTags => [...prevTags, ...newTags]);
      }
      
      // Close the modal
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding entry:', error);
      Alert.alert('Error', 'Failed to add entry: ' + error.message);
    }
  };

  const handleRandomEntry = () => {
    const incompleteEntries = entries.filter(entry => !entry.completed);
    if (incompleteEntries.length === 0) {
      Alert.alert('No entries', 'No incomplete entries available');
      return;
    }
    const randomEntry = incompleteEntries[Math.floor(Math.random() * incompleteEntries.length)];
    Alert.alert('Random Entry', randomEntry.name);
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    
    if (filterType === 'completed') {
      filtered = filtered.filter(entry => entry.completed);
    } else if (filterType === 'incomplete') {
      filtered = filtered.filter(entry => !entry.completed);
    }
    
    return filtered;
  };

  const handleUpdateEntry = async (updatedEntry) => {
    try {
      const lists = await storage.getLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex === -1) {
        throw new Error('List not found');
      }

      // Update the entry in the list
      lists[listIndex].entries = lists[listIndex].entries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      lists[listIndex].lastUpdated = new Date().toISOString();
      
      // Save updated lists back to storage
      await storage.saveLists(lists);
      
      // Update local state
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
      setList(prevList => ({
        ...prevList,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update entry: ' + error.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const lists = await storage.getLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex === -1) {
        throw new Error('List not found');
      }

      // Remove the entry from the list
      lists[listIndex].entries = lists[listIndex].entries.filter(entry => entry.id !== entryId);
      lists[listIndex].lastUpdated = new Date().toISOString();
      
      // Save updated lists back to storage
      await storage.saveLists(lists);
      
      // Update local state
      setEntries(prevEntries =>
        prevEntries.filter(entry => entry.id !== entryId)
      );
      setList(prevList => ({
        ...prevList,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error deleting entry:', error);
      Alert.alert('Error', 'Failed to delete entry: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F45" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#FF9F45', '#87CEEB']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{list?.name || 'List'}</Text>
          <Text style={styles.subtitle}>
            {entries.length} entries • Last updated {list?.lastUpdated ? new Date(list.lastUpdated).toLocaleDateString() : 'never'}
          </Text>
        </View>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filterType === 'incomplete' && styles.activeFilter]}
          onPress={() => setFilterType('incomplete')}
        >
          <Text style={styles.filterText}>To Do</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filterType === 'completed' && styles.activeFilter]}
          onPress={() => setFilterType('completed')}
        >
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesContainer}>
        {getFilteredEntries().map(entry => (
          <ListEntry
            key={entry.id}
            entry={entry}
            onUpdate={handleUpdateEntry}
            onDelete={() => handleDeleteEntry(entry.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleAddEntry}>
          <Icon name="add" size={24} color="#FFF" />
          <Text style={styles.actionText}>Add Entry</Text>
        </TouchableOpacity>
        
        {list?.isPinned && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowResetModal(true)}
          >
            <Icon name="refresh" size={24} color="#FFF" />
            <Text style={styles.actionText}>Reset</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={handleRandomEntry}>
          <Icon name="shuffle" size={24} color="#FFF" />
          <Text style={styles.actionText}>Random</Text>
        </TouchableOpacity>
      </View>

      <AddEntryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleEntrySubmit}
        existingTags={tags}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeFilter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    color: '#FFF',
    fontWeight: '500',
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9F45',
  },
});

export default ListDetailScreen; 