const Joi = require('joi');
const authService = require('~/services/authService');
const userService = require('~/services/userService');
const jwtService = require('~/services/jwtService');

const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

class AuthController {
    login = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (!user) {
                return res.status(500).json({ message: 'Password is incorrect' });
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                // Đặt Access Token vào cookie
                res.cookie('accessToken', user.data.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',

                    maxAge: 15 * 60 * 1000,
                });

                // Đặt Refresh Token vào cookie
                res.cookie('refreshToken', user.data.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.json({ user });
            });
        })(req, res, next);
    };

    logout = async (req, res) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ code: 0, message: 'ok' });
    };

    register = async (req, res) => {
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30),

            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

            repeatPassword: Joi.ref('password'),
        }).with('password', 'repeatPassword');

        const { error, value } = schema.validate({ ...req.body });
        if (error) {
            return res.status(200).json({
                code: 1, // error message
                message: error.details[0].message,
            });
        }
        const data = await authService.handleRegister(value);

        res.status(201).json({ data });
    };

    // todo
    refreshToken = async (req, res) => {
        const { error, value } = schema.validate({ ...req.body });
        if (error) {
            return res.status(200).json({
                code: 1, // error message
                message: error.details[0].message,
            });
        }
        const data = await authService.handleRegister(value);

        res.status(201).json({ data });
    };

    getCurrentUser = async (req, res) => {
        const user = await userService.find({
            findOne: true,
            where: { email: req.user.email },
            attributes: { exclude: ['password', 'type', 'code', 'createdAt', 'updatedAt'] },
        });

        return res.status(200).json(user);
    };

    updateProfile = async (req, res, next) => {
        console.log(req.file);
        if (req?.file) {
            req.body.avatar = 'http://localhost:5000/images/' + req.file.filename;
        }
        const data = await userService
            .update({
                data: req.body,
                where: { id: req.user.id },
            })
            .catch(next);

        res.io.emit('notification', { message: `Profile updated successfully.` });

        if (data.code !== 0) {
            return res.json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new AuthController();
