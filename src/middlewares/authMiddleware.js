const { handleRefreshToken } = require('~/services/authService');
const jwtService = require('~/services/jwtService');
const userService = require('~/services/userService');

const nonSecurePaths = ['/logout', '/login', '/register', '/verify-services'];

const authenticateUser = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const cookies = req.cookies;

    const tokenFromHeader = jwtService.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        const decoded = jwtService.verifyToken(token);

        if (decoded && decoded !== 'TokenExpiredError') {
            const user = await userService.find({ findOne: true, where: { email: decoded.email } });

            req.user = user.data;
            next();
        } else if (decoded && decoded === 'TokenExpiredError' && cookies?.refreshToken) {
            console.log('TokenExpiredError');
            const data = await handleRefreshToken(cookies?.refreshToken);

            const newAccessToken = data.newAccessToken;
            const newRefreshToken = data.newRefreshToken;

            if (newAccessToken && newRefreshToken) {
                // set cookie
                res.cookie('accessToken', newAccessToken, {
                    maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
                    httpOnly: true,
                });
                res.cookie('refreshToken', newRefreshToken, {
                    maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
                    httpOnly: true,
                });
            }

            return res.status(405).json({
                code: -1,
                message: 'TokenExpiredError & Need to retry new token',
                data: '',
            });
        } else {
            console.log('Unauthorized');
            return res.status(401).json({
                code: -1,
                message: 'Unauthorized',
                data: '',
            });
        }
    } else {
        console.log('Unauthorized');
        return res.status(401).json({
            code: -1,
            message: 'Unauthorized',
            data: '',
        });
    }
};

const checkPermission = async (req, res, next) => {
    console.log(req.user);
};

const checkUserLogin = async (req, res, next) => {
    const cookies = req.cookies;
    const tokenFromHeader = jwtService.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    } else {
        next();
    }
};

module.exports = { authenticateUser, checkUserLogin };
