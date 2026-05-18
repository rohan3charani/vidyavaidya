const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string()
    .pattern(/^(\+?[1-9]\d{1,14}|\d{10})$/)
    .required()
    .messages({
      'string.pattern.base': 'Enter a valid 10-digit phone number (e.g. 9876543210 or +919876543210)',
      'any.required': 'Phone number is required'
    }),
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Full Name must be at least 2 characters',
    'any.required': 'Full Name is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

const loginSchema = Joi.object({
  idToken: Joi.string().required().messages({
    'any.required': 'Firebase ID Token is required'
  })
});

const sendOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required to send OTP'
  })
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
    'any.required': 'OTP code is required'
  })
});

const adminLoginSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Admin email or username is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  adminLoginSchema
};
