const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new localStrategy({ 
    usernameField: 'username',
    passwordField: 'password'
    }, async (username, password, done) => {
    
    const user = await User.findOne({username: username});
    
    if(!user){
        return done(null, false, {message:'Not user found'});
    } else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect password'})
        }
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser( (id, done) =>{
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});
