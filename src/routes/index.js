const apiRouter = require('./api');

const routes = (app) => {
    app.get('/', (req, res) => {
        res.send('<h1>Hello world!</h1>');
    });
    app.use('/api/v1', apiRouter);

    app.use((err, rep, res, next) => {
        res.status(500).json({ code: -1, message: 'Something wrong ...', data: { err } });
    });
};

module.exports = routes;
