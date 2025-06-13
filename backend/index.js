const express = require("express");
const app = express();
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

app.listen(3000,()=>{
  console.log('app is listening at port 3000');
})

//EJS setup
app.set('view engine', 'ejs');
app.set('views', './views'); // Folder to hold your EJS files


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

//route to render html from mongodb
app.get('/student/:id/result', async (req, res) => {
  try {
    const student = await Result.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    res.render('result', { student }); // render result.ejs with student data
  } catch (err) {
    res.status(500).send('Error loading result');
  }
});

//pdf download route
app.get('/student/:id/download-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const resultUrl = `http://localhost:3000/student/${req.params.id}/result`;

    await page.goto(resultUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="result-${req.params.id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).send('Failed to generate PDF');
  }
});