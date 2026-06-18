const User = require('../models/User.model');
const { Notification } = require('../models/index.models');
const { sendEmail } = require('../utils/email.util');
const crypto = require('crypto');

// ─── Helper: Send Token Response ───────────────────────────
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  const userObj = user.toObject();
  delete userObj.password;
  res.status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, message, token, user: userObj });
};

// ─── @POST /api/auth/register ───────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, nationality } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });
    }
    const user = await User.create({ name, email, password, phone, nationality });
    // Generate verification token
    const verifyToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Zeno Africa Adventures — Verify Your Email',
        template: 'welcome',
        data: { name: user.name, verifyUrl },
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr.message);
    }
    // Create welcome notification
    await Notification.create({
      user: user._id,
      type: 'system',
      title: 'Welcome to Zeno Africa Adventures!',
      message: 'Your account has been created. Start exploring our amazing African packages!',
      icon: '🌍',
    });
    sendTokenResponse(user, 201, res, 'Registration successful! Welcome aboard.');
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/auth/login ──────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated. Please contact support.' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    sendTokenResponse(user, 200, res, 'Login successful. Welcome back!');
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/auth/logout ──────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ─── @GET /api/auth/me ──────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ─── @PUT /api/auth/updatedetails ───────────────────────────
exports.updateDetails = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'nationality', 'dateOfBirth', 'gender', 'address', 'emergencyContact', 'dietaryRequirements', 'newsletterSubscribed'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    next(err);
  }
};

// ─── @PUT /api/auth/updatepassword ──────────────────────────
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/auth/forgotpassword ─────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Zeno Africa Adventures — Password Reset Request',
        template: 'resetPassword',
        data: { name: user.name, resetUrl, expiry: '1 hour' },
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent. Please try again.' });
    }
    res.status(200).json({ success: true, message: 'Password reset email sent. Check your inbox.' });
  } catch (err) {
    next(err);
  }
};

// ─── @PUT /api/auth/resetpassword/:token ────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/auth/verify/:token ───────────────────────────
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    next(err);
  }
};
