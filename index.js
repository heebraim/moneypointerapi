
const express = require('express'); 
const path = require('path');
const connectDB = require('./config/dbConns');
const Payment = require('./models/formSchema');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());


// Connect to MongoDB
connectDB();

// Define the directory for serving static files
const publicDir = path.join(__dirname, 'public');
console.log('Public directory:', publicDir);

// Serve static files from the public directory
app.use(express.static(publicDir));

// POST endpoint to create a new payment
app.post('/api/payments', async (req, res) => {
  try {
    console.log(req.body);
    const privacy = req.body.privacy === 'on';
    const payment = new Payment({ ...req.body, privacy });
    await payment.save();
    res.status(201).send('Payment detail successfully added to database');
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve all payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NEW: PUT endpoint to update a payment by ID
app.put('/api/payments/:id', async (req, res) => {
  try {
    // Convert "on" or true string to boolean true
    if (typeof req.body.privacy !== 'undefined') {
      req.body.privacy = req.body.privacy === 'on' || req.body.privacy === true;
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  NEW: DELETE endpoint to delete a payment by ID
app.delete('/api/payments/:id', async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment successfully deleted' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve form1.html for the root and all other routes
app.get('*', (req, res) => {
  const filePath = path.join(publicDir, 'welcome.html');
  console.log('Serving file:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving form1.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Define the port number
const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
