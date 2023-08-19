const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./config/db');
const userRoutes = require('./routes/user.routes');
const fileRoutes = require('./routes/file.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

mongoose.connect(db.mongoURI).then(() => {
    userRoutes(app);
    fileRoutes(app);
}).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});