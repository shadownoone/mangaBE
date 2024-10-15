require('module-alias/register');
require('dotenv').config();

const passport = require('passport');
const authRoute = require('./routes/api/auth');
const cookieSession = require('cookie-session');
const PayOS = require('@payos/node');

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_SECRET_ID, process.env.PAYOS_SECRET_KEY);

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
const passportStrategy = require('~/controllers/passport'); // Import cấu hình passport

const routes = require('./routes');
const { sequelize, connect } = require('./config/connection');
const helpers = require('./helpers/handlebars');
const socketService = require('./services/socketService');
const generateOrderCode = () => {
    return Math.floor(Math.random() * 100000); // Số ngẫu nhiên nhỏ hơn 1 tỷ
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
const port = process.env.PORT || 5000;
connect();
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5174', 'https://pay.payos.vn'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

const YOUR_DOMAIN = 'http://localhost:5000';
app.post('/api/v1/payment-link', async (req, res) => {
    const order = {
        amount: 10000,
        description: 'Thanh toan Vip',
        orderCode: generateOrderCode(),
        returnUrl: `${YOUR_DOMAIN}/login`,
        cancelUrl: `${YOUR_DOMAIN}/logout`,
    };
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
});

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

//

app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    }),
);
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
    res.io = io;
    next();
});

routes(app);

io.on('connection', socketService.connection);

server.listen(port, () => {
    console.log(`Backend MangaTS listening on http://localhost:${port}`);
});
