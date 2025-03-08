const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://0.0.0.0:27017/todolistDB', { 
          });
        console.log('Connected to MongoDB...')
    }catch (err){
        console.error('Could not connect to MongoDB...', err);
    }
}

module.exports = connectDB;