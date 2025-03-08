const express = require('express');
const listRoutes = require('./routes/listRoutes');
const entryRoutes = require('./routes/entryRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
require('./utils/scheduledTasks');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/entry', entryRoutes);
app.use('/list', listRoutes);
app.use('/collection', collectionRoutes);

connectDB();

try {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
} catch (error) {
  console.log('Error starting server:', error);
}

module.exports = app;