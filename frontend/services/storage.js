import AsyncStorage from '@react-native-async-storage/async-storage';

const LISTS_KEY = '@lists';
const ENTRIES_KEY = '@entries';

export const storage = {
  generateId: () => Math.random().toString(36).substr(2, 9),

  getLists: async () => {
    try {
      const listsJson = await AsyncStorage.getItem(LISTS_KEY);
      return listsJson ? JSON.parse(listsJson) : [];
    } catch (error) {
      console.error('Error getting lists:', error);
      return [];
    }
  },

  saveLists: async (lists) => {
    try {
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  },

  getEntries: async () => {
    try {
      const entriesJson = await AsyncStorage.getItem(ENTRIES_KEY);
      return entriesJson ? JSON.parse(entriesJson) : [];
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  },

  saveEntries: async (entries) => {
    try {
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  }
}; 