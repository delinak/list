const ListService = require('../services/listService');

exports.createList = async(req,res,next) => {
    try {
        const {name,description,tasks,listCollection} = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: "Name is required" });
        }

        const listData = {
            name,
            description,
            tasks,
            listCollection, //could not be part of collection Handle Later
        }
        const newList = await ListService.createList(listData);
        res.status(201).json({status: true, newList});
    }catch(error){
        next(error);
    }
};

exports.updateList = async (req, res, next) => {
    try {
        const { listId } = req.params; // Extract taskId from route params
        const { name, description } = req.body;

        if(!listId){
            return res.status(400).json({ status: false, message: "List Id is not valid"})
        }
        // Filter out null/undefined fields to avoid unnecessary updates
        const updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (description !== undefined) updatedFields.description = description;

        const updateListContents = await ListService.updateList(listId, updatedFields);

        if (!updateListContents) {
            return res.status(404).json({ status: false, message: "List not found" });
        }

        res.json({ status: true, success: updateListContents });
    } catch (error) {
        next(error);
    }
};

exports.moveList = async (req, res, next) => {
    try {
        const { listId, collectionId } = req.params;

        if(!listId || !collectionId){
            return res.status(400).json({status: false, message: "List ID and Collection Id are required"})
        }

        const movedList = await ListService.moveList(listId, {collectionId});

        if (!movedList) {
            return res.status(404).json({ status: false, message: "List not found" });
        }

        res.json({ status: true, success: movedList });
    } catch (error) {
        next(error);
    }
};

exports.deleteList = async(req,res,next) =>{
    try{
        const {listId} = req.params;

        if(!listId){
            return res.status(400).json({ status: false, message: "Invalid List ID" });
        }
        const receivedList = await ListService.deleteList(listId);
        if(!receivedList){
            return res.status(404).json({status: false, message: 'List not found'});
        }
        res.json({status: true, sucess: receivedList});
    }catch(error){
        next(error);
    }
};

exports.getAllIncomplete = async(req,res,next) =>{
    try{
        const { listId }= req.params;
        if(!listId){
            return res.status(400).json({ status: false, message: "Invalid List ID" });
        }
        const entries = await ListService.getAllIncomplete(listId);
        if(!entries){
            return res.status(404).json({status: false, message: 'List not found'});
        }
        res.json({status: true, sucess: entries});
    }catch(error){
        next(error);
    }  
};
