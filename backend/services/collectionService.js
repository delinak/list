const collectionModel = require('../models/collections.model');
const listModel = require('../models/list.model');
const listService = require('../services/listService');

class ListCollectionService{
    static async newCollection(collectionData){
        try{
            const newColl = new collectionModel(collectionData);
            return await newColl.save();
        }catch(error){
            throw new Error('Error creating collection:' + error.message);
        }
    }

    static async getCollectoin(collId){
        try{
            const collectionFound = await collectionModel.findById(collId);
            return collectionFound;
        }catch(error){
            throw new Error('Error fetching collection' + error.message);
        }
    }

    static async updateCollection(collId, updatedFields) {
        try {
            const updatedCollection = await collectionModel.findByIdAndUpdate(
                collId,
                updatedFields,
                { new: true } // Return the updated document
            );

            return updatedCollection; // Return the updated document or null if not found
        } catch (error) {
            throw new Error("Error updating List: " + error.message);
        }
    }

    static async deleteCollection(collId) {
        try {
            const toDelete = await collectionModel.findById(collId); // Find the list by ID
            if (!toDelete) {
                throw new Error("Collection not found");
            }
    
            const lists = toDelete.lists;
    
            // Ensure entries are deleted
            if (lists && lists.length > 0) {
                for (const listId of lists) {
                    await listService.deleteEntry(listId); // Delete each entry
                }
            }
    
            // Delete the list itself
            await collectionModel.findByIdAndDelete(collId);    
            return toDelete;
        } catch (error) {
            throw new Error("Error deleting collection: " + error.message);
        }
    }

    static async getCollectionWithEntries(collectionId) {
        try {
            const collection = await collectionModel.findById(collectionId)
                .populate({
                    path: 'lists',
                    populate: {
                        path: 'entries',
                        model: 'Entry'
                    }
                });
            return collection;
        } catch (error) {
            throw new Error(`Error fetching collection: ${error.message}`);
        }
    }
}

module.exports = ListCollectionService;