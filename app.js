const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');

const users=require('./routes/users');
const feeds=require('./routes/feeds');
const events=require('./routes/events');
const clubs=require('./routes/clubs');
const pors=require('./routes/pors');
const admin=require('./routes/admin');
const {DB_URI}=require('./configs/config');

const app=express();

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
app.use(bodyParser.json());

//Routes
app.use('/users',users);
app.use('/feeds',feeds);
app.use('/events',events);
app.use('/clubs',clubs);
app.use('/pors',pors);
app.use('/admin',admin);

//Catch 404 errors and forward them to error handelers
app.use((req,res,next)=>{
    const err=new Error('Not Found');
    err.status=404;
    next(err);
})

//Error handeler function
app.use((err,req,res,next)=>{
    const error=err;
    const status=err.status||500;
    //respond to clients
    res.status(status).json({
        message: error.message
    });
    //respond to ourselves
    console.error(err); 
})

//Start the server
var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("App is running on port " + port);
});