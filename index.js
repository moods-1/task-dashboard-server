require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { join } = require('path');
const logger = require('morgan');
const { json, urlencoded } = express;
const app = express();
const PORT = process.env.PORT || 8000;
require('./db')();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

const taskRouter = require('./routes/tasks');
const userRouter = require('./routes/users');
const columnRouter = require('./routes/columns');

app.use('/tasks', taskRouter);
app.use('/users', userRouter);
app.use('/columns', columnRouter);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
