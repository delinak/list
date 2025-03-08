const BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000'  // Android Emulator
  : 'http://localhost:3000'; // iOS Simulator/Web

export const createEntry = async (entryData) => {
  try {
    const entries = await storage.getEntries();
    const newEntry = {
      id: storage.generateId(),
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    entries.unshift(newEntry);
    await storage.saveEntries(entries);
    return { entry: newEntry };
  } catch (error) {
    throw new Error(`Error creating entry: ${error.message}`);
  }
};

export const createList = async (listData) => {
  try {
    const lists = await storage.getLists();
    const newList = {
      id: storage.generateId(),
      ...listData,
      createdAt: new Date().toISOString(),
      entries: [],
    };
    
    lists.unshift(newList);
    await storage.saveLists(lists);
    return { newList };
  } catch (error) {
    throw new Error(`Error creating list: ${error.message}`);
  }
};

// List detail related API calls
export const getListDetails = async (listId) => {
  try {
    const lists = await storage.getLists();
    const list = lists.find(l => l.id === listId);
    if (!list) {
      throw new Error('List not found');
    }
    return { list };
  } catch (error) {
    throw new Error(`Error fetching list details: ${error.message}`);
  }
};

export const addEntryToList = async (listId, entryData) => {
  try {
    const response = await fetch(`${BASE_URL}/list/${listId}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) {
      throw new Error('Failed to add entry');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error adding entry: ${error.message}`);
  }
};

export const updateEntry = async (entryId, updatedData) => {
  try {
    const lists = await storage.getLists();
    let updated = false;

    const updatedLists = lists.map(list => {
      const entryIndex = list.entries.findIndex(e => e.id === entryId);
      if (entryIndex !== -1) {
        list.entries[entryIndex] = {
          ...list.entries[entryIndex],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        updated = true;
      }
      return list;
    });

    if (!updated) {
      const entries = await storage.getEntries();
      const entryIndex = entries.findIndex(e => e.id === entryId);
      if (entryIndex !== -1) {
        entries[entryIndex] = {
          ...entries[entryIndex],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        await storage.saveEntries(entries);
      }
    } else {
      await storage.saveLists(updatedLists);
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Error updating entry: ${error.message}`);
  }
};

export const deleteEntry = async (entryId) => {
  try {
    const lists = await storage.getLists();
    let deleted = false;

    const updatedLists = lists.map(list => ({
      ...list,
      entries: list.entries.filter(e => {
        if (e.id === entryId) {
          deleted = true;
          return false;
        }
        return true;
      }),
    }));

    if (!deleted) {
      const entries = await storage.getEntries();
      const updatedEntries = entries.filter(e => e.id !== entryId);
      await storage.saveEntries(updatedEntries);
    } else {
      await storage.saveLists(updatedLists);
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Error deleting entry: ${error.message}`);
  }
}; 