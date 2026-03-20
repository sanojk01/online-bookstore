const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/config');

// Connect to the database
connectDB();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});