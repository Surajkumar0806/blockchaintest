const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentName: String,
  rollNo: String,
  semester: Number,
  subjects: [
    {
      name: String,
      marks: Number
    }
  ]
});

module.exports = mongoose.model('Result', ResultSchema);


