const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = `mongodb+srv://suryaanshr:suryaanshr@cluster0.okbkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    const response = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected', response.connections[0].host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
