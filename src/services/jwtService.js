const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const key = process.env.SECRET_KEY;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (error) {
        console.log(error);
    }

    return token;
};

const verifyToken = (token) => {
    const key = process.env.SECRET_KEY;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
        if (err instanceof jwt.TokenExpiredError) {
            decoded = 'TokenExpiredError';
        }
    }
    return decoded;
};

const extractToken = (authorization) => {
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
};

const jwtService = {
    generateToken,
    verifyToken,
    extractToken,
};

module.exports = jwtService;
