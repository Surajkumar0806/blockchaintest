const express = require("express");
const app = express();
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const sha256 = require('js-sha256');

//cors setup
const cors = require('cors');
app.use(cors());




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

    //checking the data is already stored or not
    const rollNo = req.body.rollNo.trim().toUpperCase();
    const semester = parseInt(req.body.semester);

    
    const existing = await Result.findOne({ rollNo, semester });
    if (existing) {
      return res.status(409).json({
        message: 'Result already exists for this student and semester.'
      });
    }


    // Step 1: Save student result data to MongoDB
    const student = new Result(req.body);
    // await student.save();

    // Step 2: Render EJS to HTML
    const html = await ejs.renderFile(path.join(__dirname, 'views', 'result.ejs'), {
      student,
      universityName: 'Your University Name'
    });

    // Step 3: Generate PDF from rendered HTML using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    //step : 4 generate hash from pdf
    const pdfHash = sha256(pdfBuffer);

    //add hash temporary in db
    student.pdfHash = pdfHash;
    //saving the data in db
    await student.save();

    // Optional: Save PDF locally (or upload to S3 next)
    const filePath = path.join(__dirname, `results/result-${student._id}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    // Respond
    res.status(200).json({ message: 'Result saved and PDF and hash  generated successfully', studentId: student._id ,hash: pdfHash });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
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


//find student route for showing result
app.post('/find-student', async (req, res) => {
  try {
    const { rollNo, studentName } = req.body;

    const student = await Result.findOne({
      rollNo: rollNo.trim().toUpperCase(),
      studentName: { $regex: new RegExp(studentName, 'i') }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ studentId: student._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
