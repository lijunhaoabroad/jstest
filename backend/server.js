let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db'),
    createError = require('http-errors');

// Connecting with mongo db
mongoose.Promise = global.Promise;
const dbLink = process.env.DBURL || dbConfig.db;
mongoose.connect(dbLink, {
    useNewUrlParser: true
}).then(() => {
    console.log('Database sucessfully connected')
},
    error => {
        console.log('Database could not connected: ' + error)
    }
)

// Setting up port with express js
const userRoute = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(path.join(__dirname, 'dist/frontend')));
app.use('/', express.static(path.join(__dirname, '../frontend/dist/frontend')));



// routes
app.get('*', checkUser);
app.use(authRoutes);
app.use('/api', requireAuth, userRoute);



// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});