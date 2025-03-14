const listRoutes = require('express').Router();
const listController = require('../controller/listController');
const ListService = require('../services/listService');

// Get all lists
listRoutes.get('/', async (req, res, next) => {
    try {
        const lists = await ListService.getAllLists();
        res.json({ status: true, lists });
    } catch (error) {
        next(error);
    }
});

// Create a new list
listRoutes.post('/', async (req, res, next) => {
    try {
        const list = await ListService.createList(req.body);
        res.status(201).json({ status: true, list });
    } catch (error) {
        next(error);
    }
});

// Get a specific list with its entries
listRoutes.get('/:listId', async (req, res, next) => {
    try {
        await listController.getList(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Add an entry to a list
listRoutes.post('/:listId/entries', async (req, res, next) => {
    try {
        await listController.addEntryToList(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Get incomplete entries from a list
listRoutes.get('/:listId/incomplete', async (req, res, next) => {
    try {
        await listController.getAllIncomplete(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Get incomplete entries from a list
listRoutes.get('/getAllIncomplete/:listId', async (req, res, next) => {
    try {
        await listController.getAllIncomplete(req, res, next); 
    } catch (error) {
        next(error); 
    }
});

// Get a random entry from a list
listRoutes.get('/:listId/random', async (req, res, next) => {
    try {
        const onlyIncomplete = req.query.incomplete === 'true';
        const entry = await ListService.getRandomEntry(req.params.listId, onlyIncomplete);
        res.json({ status: true, entry });
    } catch (error) {
        next(error);
    }
});

module.exports = listRoutes;