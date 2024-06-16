const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const userRoutes = require('./routers/userRoutes');
const habitRoutes = require('./routers/habitRoutes');
const masterHabitRoutes = require('./routers/masterHabitRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/habit', habitRoutes);
app.use('/api/masterHabit', masterHabitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
