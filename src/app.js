const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const moment = require('moment');
const morgan = require('morgan');
const multer = require('multer');

// Initiliazations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));

const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        licenciatura: function(value){
            return value == 'Licenciatura';
        },
        maestria: function(value){
            return value == 'Maestria';
        }, 
        doctorado: function(value){
            return value == 'Doctorado';
        },
        admin: function(value){
            return value.admin == true;
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'controlapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
//app.use(multer({storage}).single('image'));
app.use(multer({storage}).array('files'));
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/schedule'));
app.use(require('./routes/mail'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static('img'));

module.exports = app;