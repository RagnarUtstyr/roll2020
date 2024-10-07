const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let dataStore = [];

// Endpoint to receive submitted data
app.post('/submit', (req, res) => {
    const { name, number } = req.body;
    if (name && !isNaN(number)) {
        dataStore.push({ name, number });
        res.status(200).send({ message: 'Data received' });
    } else {
        res.status(400).send({ message: 'Invalid data' });
    }
});

// Endpoint to get rankings
app.get('/rankings', (req, res) => {
    res.status(200).json(dataStore);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
