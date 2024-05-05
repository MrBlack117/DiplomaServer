const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const key = 'super_secret_key';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key,
    passReqToCallback: true
};

module.exports = function (passport) {

    const jwtLogin = new JwtStrategy(jwtOptions, async function(req, payload, done) {
        try {
            const user = await User.findById(payload._id);  // Use async/await with findById

            if (user) {
                req.user = user;
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            console.log('err', err)
            done(err, false);
        }
    });

    passport.use(jwtLogin);
};
