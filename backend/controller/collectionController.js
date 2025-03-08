const listCollectionRoutes = require('../routes/collectionRoutes');
const ListCollection = require('../services/collectionService');

exports.newCollection = async(req,res,next) => {
    try{
        const {name,description,list} = req.body;
        if(!name){
            return res.status(400).json({status: false, message: "Name is required" });
        }

        const collectionData = {
            name,
            description,
            listCollectionRoutes,
        }
        const newCollection = await ListCollection.newCollection(collectionData);
        res.status(201).json({status: true, newCollection})
    }catch(error){
        next(error);
    }
}

exports.getCollectoin = async(req,res,next) => {
    try{
        const { collId } = req.params;
        if(!collId){
            return res.status(400).json({ status: false, message: "Invalid Collection Id"});
        }
        const coll = await ListCollection.getCollectoin(collId);
        if(!coll){
            return res.status(404).json({status: false, message: 'Collection not found'});
        }
        res.json({status: true, sucess: coll});
    }catch(error){
        next(error);
    }
}

exports.updateCollection = async(req,res,next) => {
    try{
        const {collId} = req.params;
        const { name, description } = req.body;

        if(!collId){
            return res.status(400).json({ status: false, message: "Collection Id is not valid"})
        }

        const updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (description !== undefined) updatedFields.description = description;

        const updateContents = await ListCollection.updateCollection(collId, updatedFields);

        if (!updateContents) {
            return res.status(404).json({ status: false, message: "Collection not found" });
        }

        res.json({ status: true, success: updateContents });
    }catch(error){
        next(error);
    }
}

exports.deleteCollection = async(req,res,next) =>{
    try{
        const {collId} = req.params;

        if(!collId){
            return res.status(400).json({ status: false, message: "Invalid Collection ID" });
        }
        const receivedCollection = await ListCollection.deleteCollection(collId);
        if(!receivedCollection){
            return res.status(404).json({status: false, message: 'Collection not found'});
        }
        res.json({status: true, sucess: receivedCollection});
    }catch(error){
        next(error);
    }
};
