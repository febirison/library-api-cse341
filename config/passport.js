// Description: Passport configuration for GitHub OAuth
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment variables');
}

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://library-api-cse341.onrender.com/auth/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = new User({
        githubId: profile.id,
        username: profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;