const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('', null).optional(),
  subject: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Subject is required'
  }),
  message: Joi.string().min(10).required().messages({
    'string.min': 'Message must be at least 10 characters',
    'any.required': 'Message content is required'
  }),
  queryType: Joi.string().valid(
    'General Inquiry',
    'Donation Process',
    'Tax Benefits (FCRA)',
    'Partnership',
    'Volunteer Abroad',
    'Other'
  ).required().messages({
    'any.only': 'Invalid query type'
  })
});

const foreignInquirySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('', null).optional(),
  subject: Joi.string().min(3).max(200).default('FCRA / Foreign Donation Inquiry'),
  message: Joi.string().min(10).required(),
  queryType: Joi.string().default('Tax Benefits (FCRA)'),
  country: Joi.string().required().messages({
    'any.required': 'Country is required for foreign inquiries'
  }),
  donationIntent: Joi.string().required().messages({
    'any.required': 'Donation intent details are required'
  }),
  organizationName: Joi.string().allow('', null).optional()
});

module.exports = {
  contactSchema,
  foreignInquirySchema
};
