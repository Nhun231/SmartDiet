const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport');
const User = require('../models/user.model')
require('dotenv').config();
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.PUBLIC_SERVER_ENDPOINT}/${process.env.APPLICATION_NAME}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(null, false, { message: "Không lấy được địa chỉ email từ Google" });
      }

      let user = await User.findOne({ email });

      if (user) {
        if (!user.googleId) {
          // User signed up locally (email/password) but tries to login with Google
          return done(null, false, {
            message: "Email đã được đăng ký, vui lòng đăng nhập với mật khẩu.",
          });
        }
        console.log("googleId:", user.googleId);
        // User already linked with Google → proceed
        return done(null, user);
      }

      // If new user, create with Google info and initialize premium fields
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: email,
        level: 1, // Default to free tier
        coins: 100, // Start with 100 coins as welcome bonus
        aiChatUsed: 0, // No AI chats used yet
        expertChatUsed: 0, // No expert chats used yet
        lastResetDate: new Date(), // Set current date as reset date
        premiumExpiry: null // No premium expiry for free tier
      });
      // disable validation for password
      await user.save({ validateBeforeSave: false });

      return done(null, user) // null mean no error, user authenticated
    } catch (err) {
      return done(err) // error occurred
    }
  }));