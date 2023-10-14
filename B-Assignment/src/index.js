const express = require('express');
const route = require('./routes/route')
require('../db/config');
const app = express();

app.use(express.json());

app.use('/', route)

app.listen(process.env.port || 3000, function() {
    console.log('express listening on port ' + (process.env.port || 3000));
});




