const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oidc');
const { OAuth2Strategy } = require('passport-google-oauth');

const User = require('../models/User');

/**
 * Local Strategy
 */
passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    const user = await User.findOne({ username: username });

    if (!user) {
        return done(null, false, { message: 'Not user found' });
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password' })
        }
    }
}));

/**
 * Google Strategy
 */
passport.use(
    "auth.google",
    new OAuth2Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/oauth2/redirect/google",
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ 'google.id': profile.id }, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.google.email = profile.emails[0].value;
                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        } else {
                            const username = profile.emails[0].value;
                            const lastName = String(profile.name.familyName).split(" ");
                            const name = profile.name.givenName;
                            const last_name = lastName[0];
                            const second_last_name = lastName[1];
                            const newUser = new User({ name, last_name, second_last_name, username });
                            newUser.google.id = profile.id;
                            newUser.google.token = accessToken;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                }
            });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});