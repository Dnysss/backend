const express = require('express');
const cors = require('cors');

const app = express();

//Config JSON response

app.use(express.json())

//Solve cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//Plubic folder for images
app.use(express.static("public"));

//Routes
const UserRoutes = require('./routes/UserRoutes');
const CardRoutes = require('./routes/CardRoutes');
const ListRoutes = require('./routes/ListRoutes');

app.use('/users', UserRoutes);
app.use('/cards', CardRoutes);
app.use('/lists', ListRoutes);

app.listen(5000)
