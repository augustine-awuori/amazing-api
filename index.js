const users = require('./routes/users');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/users', users);

require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));