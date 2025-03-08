/**
 * Abstracts logic for interacting with DB. 
 * example defines how to save todo in db language
 */

const entryModel = require('../models/entry.model');
const listModel = require('../models/list.model');

class EntryService{
    static async createEntry(entryData, listId) {
        try {
            const newEntry = new entryModel({
                ...entryData,
                list: listId
            });
            
            const savedEntry = await newEntry.save();
            
            // Add entry to list
            await listModel.findByIdAndUpdate(
                listId,
                { $push: { entries: savedEntry._id } }
            );

            return savedEntry;
        } catch (error) {
            throw new Error(`Error creating entry: ${error.message}`);
        }
    }

    static async updateEntry(entryId, updatedFields) {
        try {
            updatedFields.updatedAt = new Date();
            const updatedEntry = await entryModel.findByIdAndUpdate(
                entryId,
                updatedFields,
                { new: true }
            );
            
            if (!updatedEntry) {
                throw new Error("Entry not found");
            }

            return updatedEntry;
        } catch (error) {
            throw new Error(`Error updating entry: ${error.message}`);
        }
    }

    // static async markEntryCompleted(taskId){
    //     try{
    //         const todo = await entryModel.findByIdAndUpdate(taskId, {completed: true});
    //         if(!todo){
    //             throw new Error("Task not found");
    //         }
    //         return todo;
    //     }catch(error){
    //         throw new Error('Error fetching task' + error.message);
    //     }
    // }

    static async getEntry(entryId){
        try{
            const entry = await entryModel.findById(entryId);
            if(!entry){
                throw new Error("Entry not found");
            }
            return entry;
        }catch(error){
            throw new Error(`Error fetching entry: ${error.message}`);
        }
    }

    static async deleteEntry(entryId) {
        try {
            const entry = await entryModel.findById(entryId);
            if (!entry) {
                throw new Error("Entry not found");
            }

            // Remove entry from its list
            await listModel.findByIdAndUpdate(
                entry.list,
                { $pull: { entries: entryId } }
            );

            await entryModel.findByIdAndDelete(entryId);
            return entry;
        } catch (error) {
            throw new Error(`Error deleting entry: ${error.message}`);
        }
    }
}

module.exports = EntryService;