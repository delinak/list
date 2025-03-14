const listModel = require('../models/list.model');
const entryModel = require('../models/entry.model');
const entryService = require('../services/entryService');
const connectDB = require('../config/db');

class ListService{
    static async createList(listData) {
        try {
            const newList = new listModel(listData);
            return await newList.save();
        } catch (error) {
            throw new Error(`Error creating list: ${error.message}`);
        }
    }

    static async updateList(listId, updatedFields) {
        try {
            const updatedList = await listModel.findByIdAndUpdate(
                listId,
                updatedFields,
                { new: true } // Return the updated document
            );

            return updatedList; // Return the updated document or null if not found
        } catch (error) {
            throw new Error("Error updating List: " + error.message);
        }
    }

    static async moveList(listId, collectionId) {
        try {
            const movedList = await listModel.findByIdAndUpdate(
                listId,
                collectionId,
                { new: true } // Return the updated document
            );

            return movedList; // Return the updated document or null if not found
        } catch (error) {
            throw new Error("Error updating List: " + error.message);
        }
    }

    static async deleteList(listId) {
        try {
            const toDelete = await listModel.findById(listId);
            if (!toDelete) {
                throw new Error("List not found");
            }
    
            // Delete all entries in the list
            await entryModel.deleteMany({ list: listId });
    
            // Delete the list itself
            await listModel.findByIdAndDelete(listId);
    
            return toDelete;
        } catch (error) {
            throw new Error("Error deleting list: " + error.message);
        }
    }

    static async getFilteredEntries(listId, filterType = 'all', tag = null) {
        try {
            const list = await listModel.findById(listId).populate('entries');
            if (!list) {
                throw new Error("List not found");
            }

            let filteredEntries = list.entries;

            // First filter by completion status
            switch (filterType) {
                case 'completed':
                    filteredEntries = filteredEntries.filter(entry => entry.completed);
                    break;
                case 'incomplete':
                    filteredEntries = filteredEntries.filter(entry => !entry.completed);
                    break;
            }

            // Then filter by tag if provided
            if (tag) {
                filteredEntries = filteredEntries.filter(entry => 
                    entry.tags && entry.tags.includes(tag)
                );
            }

            return filteredEntries;
        } catch (error) {
            throw new Error(`Error filtering entries: ${error.message}`);
        }
    }

    static async getRandomEntry(listId, onlyIncomplete = false) {
        try {
            const list = await listModel.findById(listId).populate('entries');
            if (!list || !list.entries.length) {
                throw new Error("No entries found in list");
            }

            let eligibleEntries = list.entries;
            if (onlyIncomplete) {
                eligibleEntries = list.entries.filter(entry => !entry.completed);
                if (eligibleEntries.length === 0) {
                    throw new Error("No incomplete entries found in list");
                }
            }

            const randomIndex = Math.floor(Math.random() * eligibleEntries.length);
            return eligibleEntries[randomIndex];
        } catch (error) {
            throw new Error(`Error getting random entry: ${error.message}`);
        }
    }

    static async resetListEntries(listId) {
        try {
            const list = await listModel.findById(listId);
            if (!list) {
                throw new Error("List not found");
            }

            // Reset all entries to incomplete
            await entryModel.updateMany(
                { list: listId },
                { completed: false }
            );

            list.lastReset = new Date();
            await list.save();

            return list;
        } catch (error) {
            throw new Error(`Error resetting list: ${error.message}`);
        }
    }

    static async addTag(listId, tagId) {
        try {
            const list = await listModel.findByIdAndUpdate(
                listId,
                { $addToSet: { tags: tagId } },
                { new: true }
            );
            if (!list) {
                throw new Error("List not found");
            }
            return list;
        } catch (error) {
            throw new Error(`Error adding tag: ${error.message}`);
        }
    }

    static async addEntryToList(listId, entryData) {
        try {
            const list = await listModel.findById(listId);
            if (!list) {
                throw new Error("List not found");
            }

            const entry = await entryService.createEntry(entryData, listId);
            return entry;
        } catch (error) {
            throw new Error(`Error adding entry to list: ${error.message}`);
        }
    }

    static async addTagToEntry(listId, entryId, tag) {
        try {
            const list = await listModel.findById(listId);
            if (!list) {
                throw new Error("List not found");
            }

            const entry = await entryModel.findOneAndUpdate(
                { _id: entryId, list: listId },
                { $addToSet: { tags: tag } },
                { new: true }
            );

            if (!entry) {
                throw new Error("Entry not found in this list");
            }

            return entry;
        } catch (error) {
            throw new Error(`Error adding tag to entry: ${error.message}`);
        }
    }

    static async removeTagFromEntry(listId, entryId, tag) {
        try {
            const list = await listModel.findById(listId);
            if (!list) {
                throw new Error("List not found");
            }

            const entry = await entryModel.findOneAndUpdate(
                { _id: entryId, list: listId },
                { $pull: { tags: tag } },
                { new: true }
            );

            if (!entry) {
                throw new Error("Entry not found in this list");
            }

            return entry;
        } catch (error) {
            throw new Error(`Error removing tag from entry: ${error.message}`);
        }
    }

    static async getListTags(listId) {
        try {
            const list = await listModel.findById(listId).populate('entries');
            if (!list) {
                throw new Error("List not found");
            }

            // Get unique tags from all entries in the list
            const tags = new Set();
            list.entries.forEach(entry => {
                if (entry.tags) {
                    entry.tags.forEach(tag => tags.add(tag));
                }
            });

            return Array.from(tags);
        } catch (error) {
            throw new Error(`Error getting list tags: ${error.message}`);
        }
    }

    static async getAllLists() {
        try {
            const lists = await listModel.find()
                .populate('entries')
                .sort({ updatedAt: -1 });
            return lists;
        } catch (error) {
            throw new Error(`Error fetching lists: ${error.message}`);
        }
    }
}

module.exports = ListService;