const GoogleStrategy = require('passport-google-oauth20').Strategy;

const LocalStrategy = require('passport-local').Strategy;

// const FacebookStrategy = require('passport-facebook').Strategy;

const passport = require('passport');
const jwtService = require('~/services/jwtService');

const db = require('~/models');
const authService = require('~/services/authService');

//Google
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: '/api/v1/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async function (accessToken, refreshToken, profile, callback) {
            try {
                // Kiểm tra xem người dùng đã tồn tại chưa
                const existingUser = await db.User.findOne({
                    where: { email: profile.emails[0].value },
                });

                if (existingUser) {
                    // Nếu người dùng đã tồn tại, tạo token cho người dùng hiện tại
                    existingUser.accessToken = jwtService.generateToken({
                        id: existingUser.id,
                        email: existingUser.email,
                    });

                    // Trả về người dùng hiện tại
                    return callback(null, existingUser);
                }

                // Nếu người dùng chưa tồn tại, tạo người dùng mới
                const newUser = await db.User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                });

                // Tạo token cho người dùng mới
                newUser.accessToken = jwtService.generateToken({
                    id: newUser.id,
                    email: newUser.email,
                });

                return callback(null, newUser);
            } catch (error) {
                console.error('Error authenticating with Google:', error);
                return callback(error, null);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//Local

passport.use(
    new LocalStrategy(async function (email, password, done) {
        const res = await authService.handleLogin({ email: email, password: password });

        // if (!res) {
        //     return done(null, false);
        // }

        return done(null, res);
    }),
);

// Facebook
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_APP_ID,
//             clientSecret: process.env.FACEBOOK_APP_SECRET,
//             callbackURL:
//                 'https://bd4b-2001-ee0-4903-9290-71e3-7ca3-d474-75d8.ngrok-free.app/api/v1/auth/facebook/callback',
//             profileFields: ['id', 'displayName', 'photos', 'email'],
//         },
//         async function (accessToken, refreshToken, profile, callback) {
//             try {
//                 console.log(profile);
//
//                 // Tìm kiếm hoặc tạo người dùng trong cơ sở dữ liệu
//                 const [user, created] = await db.User.findOrCreate({
//                     where: {
//                         username: profile.displayName,
//                         email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`,
//                         avatar: profile.photos ? profile.photos[0].value : null,
//                     },
//                 });
//
//                 if (user) {
//                     user.accessToken = jwtService.generateToken({
//                         id: user.id,
//                         email: user.email,
//                     });
//
//                     return callback(null, user);
//                 }
//             } catch (error) {
//                 console.error('Error during Facebook authentication:', error);
//                 return callback(error, null);
//             }
//         },
//     ),
// );
