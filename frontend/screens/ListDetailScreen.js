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
import { LinearGradient } from 'expo-linear-gradient';
import { getListDetails, addEntryToList, updateEntry, deleteEntry } from '../services/api';

const ListDetailScreen = ({ route, navigation }) => {
  const { listId } = route.params;
  const [list, setList] = useState(null);
  const [entries, setEntries] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'completed', 'incomplete'
  const [selectedTag, setSelectedTag] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    fetchListDetails();
  }, [listId]);

  const fetchListDetails = async () => {
    try {
      const response = await getListDetails(listId);
      setList(response.list);
      setEntries(response.list.entries || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () => {
    setShowBottomSheet(true);
  };

  const handleRandomEntry = () => {
    const incompleteEntries = entries.filter(entry => !entry.completed);
    if (incompleteEntries.length === 0) {
      Alert.alert('No entries', 'No incomplete entries available');
      return;
    }
    const randomEntry = incompleteEntries[Math.floor(Math.random() * incompleteEntries.length)];
    // Highlight the random entry or show in a modal
    Alert.alert('Random Entry', randomEntry.name);
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    
    // Filter by completion status
    if (filterType === 'completed') {
      filtered = filtered.filter(entry => entry.completed);
    } else if (filterType === 'incomplete') {
      filtered = filtered.filter(entry => !entry.completed);
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(entry => entry.tags?.includes(selectedTag));
    }
    
    return filtered;
  };

  const handleUpdateEntry = async (updatedEntry) => {
    try {
      await updateEntry(updatedEntry.id, updatedEntry);
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteEntry(entryId);
      setEntries(prevEntries =>
        prevEntries.filter(entry => entry.id !== entryId)
      );
    } catch (error) {
      Alert.alert('Error', error.message);
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
        
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowBottomSheet(true)}>
          <Icon name="local-offer" size={24} color="#FFF" />
          <Text style={styles.actionText}>Tags</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleRandomEntry}>
          <Icon name="shuffle" size={24} color="#FFF" />
          <Text style={styles.actionText}>Random</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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