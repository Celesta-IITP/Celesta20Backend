const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {
    DB_URI
} = require('./configs/config');

const app = express();
let server = require('http').Server(app);

// Connecting to database
mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))
//set mongoose's Promise equal to global Promise since mongoose's Promise version is depricated
mongoose.Promise = global.Promise;

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use('/public/profilephotos', express.static(__dirname + '/public/profilephotos'));
app.use(bodyParser.json());

//Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const regRoutes = require('./routes/registration');
app.use('/api/registrations', regRoutes);
const galleryRoutes = require('./routes/gallery-routes');
app.use('/api/gallery', galleryRoutes);


//Catch 404 errors and forward them to error handelers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

//Error handeler function
app.use((err, req, res, next) => {
    const error = err;
    const status = err.status || 500;
    //respond to clients
    res.status(status).send(error.message);
    //respond to ourselves
    console.error(err);
})

//Start the server
var port = process.env.PORT || 4500;
server.listen(port, function () {
    console.log("App is running on port " + port);
});