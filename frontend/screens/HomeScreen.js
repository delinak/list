import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ListBlock from '../components/ListBlock';
import AddButton from '../components/AddButton';
import AddModal from '../components/AddModal';
import { getLists, updateList, createList } from '../services/api';

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await getLists();
      if (response.lists) {
        setLists(response.lists);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch lists');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewList = async (listData) => {
    try {
      const response = await createList(listData);
      console.log('Create list response:', response); // Debug log
      if (response.status && response.list) {
        setLists(prevLists => [response.list, ...prevLists]);
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to create list: Invalid response format');
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create list');
      console.error('Create list error:', error);
    }
  };

  const handlePinList = async (listId) => {
    try {
      const pinnedList = lists.find(l => l.isPinned);
      if (pinnedList && pinnedList.id !== listId) {
        await updateList(pinnedList.id, { isPinned: false });
      }

      const selectedList = lists.find(l => l.id === listId);
      const newPinStatus = !selectedList.isPinned;
      const response = await updateList(listId, { isPinned: newPinStatus });

      if (response.list) {
        setLists(prevLists => prevLists.map(list => 
          list.id === listId 
            ? response.list
            : list.id === pinnedList?.id
              ? { ...list, isPinned: false }
              : list
        ));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update pin status');
      console.error(error);
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const pinnedList = lists.find(l => l.isPinned) || 
    [...lists].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0];

  const sortedLists = [...lists].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });

  const handleListPress = (list) => {
    navigation.navigate('ListDetail', { 
      listId: list.id,
      listData: {
        name: list.name,
        description: list.description,
        entries: list.entries || [],
        isPinned: list.isPinned,
        lastUpdated: list.lastUpdated,
        tags: list.tags || []
      }
    });
  };

  if (loading && lists.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>hello app</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.pinnedSection}>
          {pinnedList && (
            <ListBlock
              list={pinnedList}
              onPress={() => handleListPress(pinnedList)}
              fixedExpanded={true}
            />
          )}
        </View>

        <View style={styles.listsSection}>
          {sortedLists.map(list => (
            <ListBlock
              key={list.id}
              list={list}
              onPress={() => handleListPress(list)}
            />
          ))}
        </View>
      </ScrollView>

      <AddButton onPress={() => setModalVisible(true)} />
      
      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleNewList}
        presetColors={PRESET_COLORS}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2430',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  pinnedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

export default HomeScreen; 