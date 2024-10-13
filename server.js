// Budget API

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Adjust as Needed
let url = 'mongodb://localhost:27017/Assignment_8_KarimSasa';

// MongoDB connection
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(' Im Connected to MongoDB!');
}).catch(err => {
    console.error('Uh Oh, Connection error', err);
});

// Mongoose schema with validations
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The Title is required']
    },
    budget: {
        type: Number,
        required: [true, 'The Budget value is required']
    },
    color: {
        type: String,
        required: [true, 'The Color is required'],
        validate: {
            validator: function(v) {
                // Checks for Hex Formatting for Six Digits
                return /^#([0-9A-F]{6})$/i.test(v);
            },
            message: props => `${props.value} is not a valid hexadecimal color!`
        }
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

// Endpoint 1 Fetches
app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find(); 
        res.json({ myBudget: budgets });     
    } catch (err) {
        res.status(500).send(err.message); 
    }  
});

// Endpoint 2 Adds Data
app.post('/budget', async (req, res) => {
    try {
        const newBudget = new Budget({
            title: req.body.title,
            budget: req.body.budget,
            color: req.body.color
        });

        await newBudget.save();               
        res.status(201).send(newBudget);      
    } catch (err) {
        res.status(400).send(err.message);    
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
