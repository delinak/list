const listRoutes = require('express').Router();
const listController = require('../controller/listController');
const ListService = require('../services/listService');

//create a new list
listRoutes.post('/createList', async (req, res, next) => {
    try {
        await listController.createList(req, res, next); 
    } catch (error) {
        next(error);
    }
});

//update a list name and/or description
listRoutes.put('/updateList/:listId', async (req, res, next) => {
    try {
        await listController.updateList(req, res, next); 
    } catch (error) {
        next(error); 
    }
});

//delete list
listRoutes.delete('/deleteList/:listId', async (req, res, next) => {
    try {
        await listController.deleteList(req, res, next); 
    } catch (error) {
        next(error); 
    }
});

listRoutes.get('/getAllIncomplete/:listId', async (req, res, next) => {
    try {
        await listController.getAllIncomplete(req, res, next); 
    } catch (error) {
        next(error); 
    }
});

// Get incomplete entries from a list
listRoutes.get('/:listId/incomplete', async (req, res, next) => {
    try {
        const entries = await ListService.getIncompleteEntries(req.params.listId);
        res.json({ status: true, entries });
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