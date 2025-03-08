/**
 * handle incoming HTTP requests and response
 */
const EntryService = require('../services/entryService');

// calls createTodo method to handle saving, and sends a response
exports.createEntry = async(req,res,next) =>{
    try {
        const {task,completed,description,category,list} = req.body;
        const entryData = {
            task,
            completed,
            description,
            category,
            list,
        }
        const entry = await EntryService.createEntry(entryData);
        res.status(200).json({ message: 'Task added successfully!', entry });
    }catch (error){
        next(error);
    }
}

exports.updateEntry = async (req, res, next) => {
    try {
        const { entryId } = req.params; // Extract taskId from route params
        const { task, completed, description, category, list } = req.body;

        // Filter out null/undefined fields to avoid unnecessary updates
        const updatedFields = {};
        if (task !== undefined) updatedFields.task = task;
        if (completed !== undefined) updatedFields.completed = completed;
        if (description !== undefined) updatedFields.description = description;
        if (category !== undefined) updatedFields.category = category;
        if (list !== undefined) updatedFields.list = list;

        const updatedEntry = await EntryService.updateEntry(entryId, updatedFields);

        if (!updatedEntry) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        res.json({ status: true, success: updatedEntry });
    } catch (error) {
        next(error);
    }
};

// exports.markEntryCompleted = async (req, res, next) => {
//     try {
//         const { entryId } = req.params; // Extract taskId from route params
//         const updatedEntry = await EntryService.markEntryCompleted(entryId);

//         if (!updatedEntry) {
//             return res.status(404).json({ status: false, message: "Task not found" });
//         }

//         res.json({ status: true, success: updatedEntry });
//     } catch (error) {
//         next(error);
//     }
// };


exports.getEntry = async(req,res,next) =>{
    try{
        const {entryId} = req.params;
        console.log("Controller received taskId:", entryId);

        if(!entryId){
            return res.status(400).json({ status: false, message: "Invalid Task ID" });
        }
        const receivedTodo = await EntryService.getEntry(entryId);
        if(!receivedTodo){
            return res.status(404).json({status: false, message: 'Task not found'});
        }
        console.log("Controller received taskId:", receivedTodo);
        res.json({status: true, sucess: receivedTodo});
    }catch(error){
        next(error);
    }
};

exports.deleteEntry = async(req,res,next) =>{
    try{
        const {entryId} = req.params;

        if(!entryId){
            return res.status(400).json({ status: false, message: "Invalid Task ID" });
        }
        const receivedTodo = await EntryService.deleteEntry(entryId);
        if(!receivedTodo){
            return res.status(404).json({status: false, message: 'Task not found'});
        }
        res.json({status: true, sucess: receivedTodo});
    }catch(error){
        next(error);
    }
};
