require('module-alias/register');
require('dotenv').config();

const passport = require('passport');
const authRoute = require('./routes/api/auth');
const cookieSession = require('cookie-session');

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const passportStrategy = require('../passport'); // Import cấu hình passport

const routes = require('./routes');
const { sequelize, connect } = require('./config/connection');
const helpers = require('./helpers/handlebars');
const socketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const port = process.env.PORT || 5000;
connect();

app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
        helpers: helpers,
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));

app.use(
    session({
        secret: 'flashblog',
        saveUninitialized: true,
        resave: true,
        cookie: { expires: 300 * 1000 },
    }),
);

app.use(passport.initialize()); // Khởi tạo passport
app.use(passport.session()); // Sử dụng session của passport để duy trì đăng nhập

app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use((req, res, next) => {
    res.io = io;
    next();
});

routes(app);

io.on('connection', socketService.connection);

server.listen(port, () => {
    console.log(`Backend MangaTS listening on http://localhost:${port}`);
});
