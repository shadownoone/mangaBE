const Joi = require('joi');
const authService = require('~/services/authService');
const userService = require('~/services/userService');

class AuthController {
    login = async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        });
        const { error, value } = schema.validate({ ...req.body });
        if (error) {
            return res.status(200).json({
                code: 1,
                message: error.details[0].message,
            });
        }
        const data = await authService.handleLogin(value);

        await authService.updateUserCode(data.data.email, data.data.refreshToken);

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        //set cookie
        if (data) {
            res.cookie('accessToken', data.data.accessToken, {
                httpOnly: true,
                maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
            });
            res.cookie('refreshToken', data.data.refreshToken, {
                httpOnly: true,
                maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
            });
        }

        res.status(200).json(data);
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
