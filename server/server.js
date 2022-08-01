require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 3036;

// Connect MongoDB
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the ContactKeeper API 📧' });
});

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/contacts', require('./routes/contacts'));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
