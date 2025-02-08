// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const xrpl = require('xrpl');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const studentSchema = new mongoose.Schema({
    studentId: { type: String, unique: true },
    name: String,
    xrpAddress: String,
    xrpSecret: String,
    mealCredits: Number
});

const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    price: Number,
    capacity: Number
});

const Student = mongoose.model('Student', studentSchema);
const Event = mongoose.model('Event', eventSchema);

// Routes
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/events/purchase', async (req, res) => {
    try {
        const { studentId, eventId } = req.body;
        const student = await Student.findOne({ studentId });
        const event = await Event.findById(eventId);
        
        // XRPL Transaction
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
        
        // Send XRP payment
        const payment = {
            TransactionType: "Payment",
            Account: student.xrpAddress,
            Destination: process.env.SCHOOL_ADDRESS,
            Amount: xrpl.xrpToDrops(event.price)
        };
        
        const response = await client.submitAndWait(payment, {
            wallet: xrpl.Wallet.fromSeed(student.xrpSecret)
        });
        
        await client.disconnect();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});