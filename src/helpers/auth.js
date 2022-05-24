const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash('error_msg', 'Not Authorized');
    res.render('users/login/signin');
};

module.exports = helpers;