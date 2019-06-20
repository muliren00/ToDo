const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const postRouter = require('./routes/post');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/todo')
    .then(() => console.log(`MongoDB has started`))
    .catch(e => console.log(e))

const port = process.env.PORT || 5000;
const clientPath = path.join(__dirname, 'client');

const app = express();
app.use(bodyParser.json());
app.use('/api/post', postRouter);
app.use(express.static(clientPath));

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})