const tagModel = require('../models/tag.model');
const listModel = require('../models/list.model');

class TagService {
    static async createTag(tagData) {
        try {
            const newTag = new tagModel(tagData);
            return await newTag.save();
        } catch (error) {
            throw new Error(`Error creating tag: ${error.message}`);
        }
    }

    static async updateTag(tagId, updatedFields) {
        try {
            const updatedTag = await tagModel.findByIdAndUpdate(
                tagId,
                updatedFields,
                { new: true }
            );
            
            if (!updatedTag) {
                throw new Error("Tag not found");
            }

            return updatedTag;
        } catch (error) {
            throw new Error(`Error updating tag: ${error.message}`);
        }
    }

    static async deleteTag(tagId) {
        try {
            // First remove this tag from all lists
            await listModel.updateMany(
                { tags: tagId },
                { $pull: { tags: tagId } }
            );

            // Then delete the tag
            const deletedTag = await tagModel.findByIdAndDelete(tagId);
            if (!deletedTag) {
                throw new Error("Tag not found");
            }

            return deletedTag;
        } catch (error) {
            throw new Error(`Error deleting tag: ${error.message}`);
        }
    }

    static async getTag(tagId) {
        try {
            const tag = await tagModel.findById(tagId);
            if (!tag) {
                throw new Error("Tag not found");
            }
            return tag;
        } catch (error) {
            throw new Error(`Error fetching tag: ${error.message}`);
        }
    }

    static async getAllTags() {
        try {
            return await tagModel.find({});
        } catch (error) {
            throw new Error(`Error fetching tags: ${error.message}`);
        }
    }

    static async getListsByTag(tagId, includeEntries = false) {
        try {
            let query = listModel.find({ tags: tagId });
            
            // Optionally populate entries and their details
            if (includeEntries) {
                query = query.populate({
                    path: 'entries',
                    select: 'name description completed createdAt updatedAt'
                });
            }
            
            // Always populate basic tag information
            query = query.populate({
                path: 'tags',
                select: 'name createdAt'
            });

            const lists = await query.exec();
            
            if (!lists.length) {
                throw new Error('No lists found with this tag');
            }

            return lists;
        } catch (error) {
            throw new Error(`Error fetching lists by tag: ${error.message}`);
        }
    }

    static async searchListsByTags(tagNames) {
        try {
            // Find tags by names
            const tags = await tagModel.find({
                name: { $in: tagNames }
            });

            if (!tags.length) {
                throw new Error('No matching tags found');
            }

            const tagIds = tags.map(tag => tag._id);

            // Find lists that have ALL the specified tags
            const lists = await listModel.find({
                tags: { $all: tagIds }
            })
            .populate('tags', 'name createdAt')
            .populate('entries', 'name description completed');

            return lists;
        } catch (error) {
            throw new Error(`Error searching lists by tags: ${error.message}`);
        }
    }
}

module.exports = TagService; 