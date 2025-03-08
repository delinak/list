const listCollectionRoutes = require('express').Router();
const listCollectionController = require('../controller/collectionController');

listCollectionRoutes.post('/newCollection',async(req,res,next) => {
    try{
        await listCollectionController.newCollection(req,res,next);
    }catch(error){
        next(error);
    }
});

listCollectionRoutes.get('/getCollectoin/:collId',async (req,res,next) => {
    try {
        await listCollectionController.getCollectoin(req,res,next);
    }catch(error){
        next(error);
    }
});

listCollectionRoutes.put('/updateCollection/:collId',async (req,res,next) => {
    try {
        await listCollectionController.updateCollection(req,res,next);
    }catch(error){
        next(error);
    }
});

listCollectionRoutes.delete('/deleteCollection/:collId', async (req,res,next) => {
    try{
        await listCollectionController.deleteCollection(req,res,next);
    }catch(error){
        next(error);
    }
})

// feature to add, need to add fields to the schemas tho.
// listCollectionRoutes.get('/getLikedLists/:collId',async (req,res,next) => {
//     try {
//         await listCollectionController.getLikedLists(req,res,next);
//     }catch(error){
//         next(error);
//     }
// });

module.exports = listCollectionRoutes;