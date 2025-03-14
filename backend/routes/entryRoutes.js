/**
 * used by frontend to add data into database
 */

const entryRoutes = require('express').Router();
const { models } = require('mongoose');
const todoController = require('../controller/entryController');

entryRoutes.get('/', (req, res) => {
    res.send('Hello, world!');
  });
  
//add a task
entryRoutes.post('/createEntry', async (req, res, next) => {
    try {
        await todoController.createEntry(req, res, next);
    } catch (error) {
        next(error); 
    }
});

//update a task
entryRoutes.put('/:entryId',  async (req, res, next) => {
    try {
        await todoController.updateEntry(req, res, next); 
    } catch (error) {
        next(error);
    }
});

// //update a task
// entryRoutes.put('/markEntryCompleted/:entryId',  async (req, res, next) => {
//     try {
//         await todoController.markEntryCompleted(req, res, next); 
//     } catch (error) {
//         next(error);
//     }
// });

//get a task
entryRoutes.get('/:entryId', async (req, res, next) => {
    try {
        //console.log("Router taskId passed to controller:", req.params.taskId);
        await todoController.getEntry(req, res, next); 
    } catch (error) {
        next(error);
    }
});

//delete a task
entryRoutes.delete('/:entryId', async (req, res, next) => {
    try {
        await todoController.deleteEntry(req, res, next); 
    } catch (error) {
        next(error); 
    }
});


module.exports = entryRoutes;