const express = require("express");
const app = express();
const mongoose = require('mongoose');

app.listen(3000,()=>{
  console.log('app is listening at port 3000');
})


// Middleware to parse JSON
app.use(express.json());

// MongoDB connection (replace with your MongoDB Atlas URI if using Atlas)
mongoose.connect('mongodb://localhost:27017/studentResults').then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const Result = require('./models/Result'); // Import the model

app.post('/submit-result', async (req, res) => {
  try {
    const newResult = new Result(req.body);
    await newResult.save();
    res.status(200).json({ message: 'Result saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving result', error });
  }
});
