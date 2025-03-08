import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import ListBlock from '../components/ListBlock';
import AddButton from '../components/AddButton';
import AddModal from '../components/AddModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [lists, setLists] = useState([
    {
      id: '1',
      name: 'Movies to Watch',
      description: 'My watchlist',
      entriesCount: 12,
      lastUpdated: new Date('2024-01-10'),
      isPinned: true,
      entries: [
        { id: '1', name: 'The Matrix', completed: false },
        { id: '2', name: 'Inception', completed: true },
        { id: '3', name: 'Interstellar', completed: false },
        { id: '4', name: 'The Dark Knight', completed: false },
        { id: '5', name: 'Pulp Fiction', completed: false },
        { id: '6', name: 'The Godfather', completed: false },
      ],
      tags: [
        { id: '1', name: 'Entertainment', color: '#FF6B6B' },
        { id: '2', name: 'Weekend', color: '#4ECDC4' }
      ]
    },
    // ... other lists
  ]);
  const [tags, setTags] = useState([
    { id: '1', name: 'Entertainment', color: '#FF6B6B' },
    { id: '2', name: 'Weekend', color: '#4ECDC4' },
    { id: '3', name: 'Work', color: '#45B7D1' },
  ]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleNewList = (newList) => {
    setLists(prevLists => [newList, ...prevLists]);
  };

  const handlePinList = async (listId) => {
    try {
      // First unpin any currently pinned list
      const pinnedList = lists.find(l => l.isPinned);
      if (pinnedList && pinnedList.id !== listId) {
        await updateList(pinnedList.id, { isPinned: false });
      }

      // Toggle pin status for selected list
      const selectedList = lists.find(l => l.id === listId);
      const newPinStatus = !selectedList.isPinned;
      await updateList(listId, { isPinned: newPinStatus });

      // Update local state
      setLists(prevLists => prevLists.map(list => 
        list.id === listId 
          ? { ...list, isPinned: newPinStatus }
          : { ...list, isPinned: false }
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update pin status');
    }
  };

  useEffect(() => {
    // If no list is pinned, pin the most recently updated list
    const pinnedList = lists.find(l => l.isPinned);
    if (!pinnedList && lists.length > 0) {
      const mostRecent = [...lists].sort((a, b) => 
        new Date(b.lastUpdated) - new Date(a.lastUpdated)
      )[0];
      handlePinList(mostRecent.id);
    }
  }, [lists]);

  // Update the pinned section to use the actual pinned list
  const pinnedList = lists.find(l => l.isPinned) || 
    [...lists].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0];

  // Sort lists with pinned first, then by lastUpdated
  const sortedLists = [...lists].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.mainScroll}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>hello app</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Pinned List Section */}
        {pinnedList && (
          <View style={styles.pinnedSection}>
            <View style={styles.pinnedHeader}>
              <View>
                <Text style={styles.sectionTitle}>{pinnedList.name}</Text>
                <Text style={styles.sectionMeta}>
                  {new Date(pinnedList.lastUpdated).toLocaleDateString('en-US', { 
                    month: 'numeric', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} • {pinnedList.entries.length} items
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ListDetail', { listId: pinnedList.id })}
              >
                <Icon name="chevron-right" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.entriesScroll}>
              {pinnedList.entries.slice(0, 5).map((entry, index) => (
                <View key={entry.id} style={[
                  styles.entryBlock,
                  entry.completed && styles.completedEntry
                ]}>
                  <Text style={styles.entryText}>{entry.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tags ScrollView */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
        >
          {['projects', 'lifestyle', 'learning', 'finances'].map((tag, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.tagPill, { backgroundColor: getTagColor(tag) }]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lists Section */}
        <View style={styles.listsSection}>
          <Text style={styles.sectionTitle}>Your List</Text>
          <View style={styles.listsContainer}>
            {sortedLists.map(list => (
              <ListBlock 
                key={list.id}
                list={list}
                onPress={() => navigation.navigate('ListDetail', { listId: list.id })}
                isPinned={list.isPinned}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <AddButton onPress={() => setModalVisible(true)} />
      <AddModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSuccess={handleNewList}
        type="list"
        availableTags={tags}
      />
    </SafeAreaView>
  );
};

const getTagColor = (tag) => {
  const colors = {
    projects: '#96B6C5',
    lifestyle: '#ADC4CE',
    learning: '#EEE0C9',
    finances: '#F1F0E8',
  };
  return colors[tag] || '#96B6C5';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2430',
  },
  mainScroll: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  pinnedSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  pinnedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionMeta: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 16,
  },
  entriesScroll: {
    maxHeight: 200,
  },
  entryBlock: {
    padding: 16,
    backgroundColor: '#ADC4CE',
    borderRadius: 12,
    marginBottom: 8,
  },
  completedEntry: {
    backgroundColor: '#96B6C5',
  },
  entryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tagsScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tagPill: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  listsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 400,
  },
  listsContainer: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 