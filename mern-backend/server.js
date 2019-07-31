const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

// add middle-wares to express app
app.use(cors());
app.use(bodyParser.json());

// start server
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT.toString());
});
