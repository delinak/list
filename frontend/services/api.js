import axios from 'axios';

const BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android Emulator
  : 'http://localhost:3000/api'; // iOS Simulator/Web

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createEntry = async (entryData) => {
  try {
    const response = await api.post('/entry', entryData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating entry: ${error.message}`);
  }
};

export const createList = async (listData) => {
  try {
    console.log('Creating list with data:', listData); // Debug log
    const response = await api.post('/list', {
      name: listData.name,
      description: listData.description || '',
      isPinned: listData.isPinned || false,
      resetCycle: 'none',
      entries: [],
      tags: []
    });
    console.log('Server response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Full error details:', error.response || error); // Debug log
    throw new Error(`Error creating list: ${error.message}`);
  }
};

export const getListDetails = async (listId) => {
  try {
    const response = await api.get(`/list/${listId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching list details: ${error.message}`);
  }
};

export const addEntryToList = async (listId, entryData) => {
  try {
    const response = await api.post(`/list/${listId}/entry`, entryData);
    return response.data;
  } catch (error) {
    throw new Error(`Error adding entry: ${error.message}`);
  }
};

export const updateEntry = async (listId, entryId, updatedData) => {
  try {
    const response = await api.patch(`/list/${listId}/entry/${entryId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating entry: ${error.message}`);
  }
};

export const deleteEntry = async (listId, entryId) => {
  try {
    await api.delete(`/list/${listId}/entry/${entryId}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Error deleting entry: ${error.message}`);
  }
};

export const getIncompleteEntries = async (listId) => {
  try {
    const response = await api.get(`/list/${listId}/incomplete`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching incomplete entries: ${error.message}`);
  }
};

export const getLists = async () => {
  try {
    const response = await api.get('/list');
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching lists: ${error.message}`);
  }
};

export const updateList = async (listId, updateData) => {
  try {
    const response = await api.patch(`/list/${listId}`, {
      ...updateData,
      lastUpdated: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating list: ${error.message}`);
  }
};

export const deleteList = async (listId) => {
  try {
    await api.delete(`/list/${listId}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Error deleting list: ${error.message}`);
  }
}; 