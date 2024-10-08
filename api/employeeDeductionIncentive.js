require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create an Express application
const app = express();

// Middleware to handle JSON data and enable CORS
app.use(express.json());
app.use(cors());

// MongoDB connection using environment variable for the URI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Define the Employee Deduction/Incentive Schema
const employeeDeductionIncentiveSchema = new mongoose.Schema({
  id: Number,
  name: String,
  month: String,
  year: String,
  operation: String, // Either 'deduction' or 'incentive'
  reasonForDeductionOrIncentive: String,
  salaryDeductionOrIncentive: Number,
});

// Create the EmployeeDeductionIncentive model from the schema
const EmployeeDeductionIncentive = mongoose.model(
  'EmployeeDeductionIncentive',
  employeeDeductionIncentiveSchema,
  'employeeDeductionIncentive'
);

// API Routes

// Route to handle root URL
app.get('/', (req, res) => {
  res.send('API is running');
});

// GET route to retrieve all employee deduction/incentive records
app.get('/employeeDeductionIncentive', async (req, res) => {
  try {
    const records = await EmployeeDeductionIncentive.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route to retrieve a specific employee deduction/incentive record by id
app.get('/employeeDeductionIncentive/:id', async (req, res) => {
  try {
    const record = await EmployeeDeductionIncentive.find({
      id: req.params.id,
    });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to add a new employee deduction/incentive record
app.post('/employeeDeductionIncentive', async (req, res) => {
  const newRecord = new EmployeeDeductionIncentive({
    id: req.body.id,
    name: req.body.name,
    month: req.body.month,
    year: req.body.year,
    operation: req.body.operation,
    reasonForDeductionOrIncentive: req.body.reasonForDeductionOrIncentive,
    salaryDeductionOrIncentive: req.body.salaryDeductionOrIncentive,
  });

  try {
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT route to update a specific employee deduction/incentive record by id
app.put('/employeeDeductionIncentive/:id', async (req, res) => {
  try {
    const updatedRecord = await EmployeeDeductionIncentive.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedRecord)
      return res.status(404).json({ message: 'Record not found' });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to remove a specific employee deduction/incentive record by id
app.delete('/employeeDeductionIncentive/:id', async (req, res) => {
  try {
    const deletedRecord = await EmployeeDeductionIncentive.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedRecord)
      return res.status(404).json({ message: 'Record not found' });
    res.status(204).send(); // No content response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set the port dynamically using the environment variable or fallback to 3000
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
