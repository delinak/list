const tagRoutes = require('express').Router();
const TagService = require('../services/tagService');

tagRoutes.post('/create', async (req, res, next) => {
    try {
        const tag = await TagService.createTag(req.body);
        res.status(201).json({ status: true, tag });
    } catch (error) {
        next(error);
    }
});

tagRoutes.put('/:tagId', async (req, res, next) => {
    try {
        const tag = await TagService.updateTag(req.params.tagId, req.body);
        res.json({ status: true, tag });
    } catch (error) {
        next(error);
    }
});

tagRoutes.delete('/:tagId', async (req, res, next) => {
    try {
        const tag = await TagService.deleteTag(req.params.tagId);
        res.json({ status: true, tag });
    } catch (error) {
        next(error);
    }
});

// Get lists by tag ID with optional entry details
tagRoutes.get('/:tagId/lists', async (req, res, next) => {
    try {
        const includeEntries = req.query.entries === 'true';
        const lists = await TagService.getListsByTag(req.params.tagId, includeEntries);
        res.json({ status: true, lists });
    } catch (error) {
        next(error);
    }
});

// Search lists by multiple tag names
tagRoutes.post('/search', async (req, res, next) => {
    try {
        const { tags } = req.body; // Expect an array of tag names
        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Please provide an array of tag names" 
            });
        }
        
        const lists = await TagService.searchListsByTags(tags);
        res.json({ status: true, lists });
    } catch (error) {
        next(error);
    }
});

tagRoutes.get('/', async (req, res, next) => {
    try {
        const tags = await TagService.getAllTags();
        res.json({ status: true, tags });
    } catch (error) {
        next(error);
    }
});

module.exports = tagRoutes; 