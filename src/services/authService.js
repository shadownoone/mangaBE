const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('~/models');
const jwtService = require('./jwtService');
const salt = bcrypt.genSaltSync(10);

const handleRegister = async (data) => {
    try {
        const isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist) {
            return {
                code: 1,
                message: 'Email is already exist!',
            };
        }

        const isUsernameExist = await checkUsernameExist(data.username);
        if (isUsernameExist) {
            return {
                code: 1,
                message: 'Username is already exist!',
            };
        }

        const hashPassword = generateHashPassword(data.password);

        await db.User.create({
            email: data.email,
            username: data.username,
            password: hashPassword,
            avatar: data.avatar,
            role: '0',
        });

        return {
            code: '0',
            message: 'A user is created successfully!',
        };
    } catch (error) {
        console.log(error);
        return {
            code: -1,
            message: 'Something wrong in service...',
        };
    }
};

const handleLogin = async (data) => {
    try {
        const user = await db.User.findOne({
            where: {
                email: data.email,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            raw: true,
        });

        if (user) {
            const isCorrectPassword = checkPassword(data.password, user.password);
            delete user.password;
            if (isCorrectPassword) {
                return {
                    code: 0,
                    message: 'ok',
                    data: {
                        accessToken: jwtService.generateToken({
                            id: user.id,
                            email: user.email,
                            username: user.username,
                        }),
                        refreshToken: uuidv4(),
                        email: user.email,
                        username: user.username,
                        ...user,
                    },
                };
            }
        }

        return {
            code: 1,
            message: 'Your email/phone number or password is incorrect!',
            data: '',
        };
    } catch (error) {
        console.log(error);
        return {
            code: -1,
            message: 'Something wrong in service...',
        };
    }
};

const checkEmailExist = async (email) => {
    const user = await db.User.findOne({
        where: {
            email,
        },
    });
    return !!user;
};

const checkUsernameExist = async (username) => {
    const user = await db.User.findOne({
        where: {
            username,
        },
    });
    return !!user;
};

const generateHashPassword = (password) => {
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const updateUserCode = async (email, code) => {
    const user = await db.User.update(
        { code },
        {
            where: {
                email,
            },
        },
    );
    return !!user;
};

const handleRefreshToken = async (token) => {
    let newAccessToken = '';
    let newRefreshToken = '';

    const user = await db.User.findOne({
        where: {
            code: token,
        },
    });

    if (user) {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        newAccessToken = jwtService.generateToken(payload);
        newRefreshToken = uuidv4();

        await updateUserCode(user.email, newRefreshToken);
    }

    return {
        newAccessToken,
        newRefreshToken,
    };
};

const authService = {
    handleLogin,
    handleRegister,
    updateUserCode,
    handleRefreshToken,
};

module.exports = authService;
