const Joi = require('joi');

const createOrderSchema = Joi.object({
  amount: Joi.number().min(1).required().messages({
    'number.min': 'Amount must be at least 1 INR',
    'any.required': 'Amount in INR is required'
  }),
  currency: Joi.string().valid('INR').default('INR'),
  donationType: Joi.string().valid('one-time', 'monthly', 'foreign').required().messages({
    'any.only': 'Donation type must be either one-time, monthly, or foreign'
  }),
  category: Joi.string().valid('Education', 'Healthcare', 'Community').required().messages({
    'any.only': 'Category must be Education, Healthcare, or Community'
  }),
  subcategory: Joi.string().allow('', null).optional(),
  duration: Joi.number().when('donationType', {
    is: 'monthly',
    then: Joi.number().min(1).required().messages({
      'any.required': 'Duration is required for monthly donations'
    }),
    otherwise: Joi.number().optional()
  }),
  donorDetails: Joi.object({
    fullName: Joi.string().required().messages({ 'any.required': 'Full name is required' }),
    email: Joi.string().email().required().messages({ 'string.email': 'Invalid email', 'any.required': 'Email is required' }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({ 'string.pattern.base': 'Valid E.164 phone number required' }),
    pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).allow('', null).optional().messages({
      'string.pattern.base': 'PAN card must be a valid 10-digit alphanumeric (e.g. ABCDE1234F)'
    }),
    isAlumni: Joi.boolean().default(false),
    alumniId: Joi.string().when('isAlumni', {
      is: true,
      then: Joi.string().required().messages({ 'any.required': 'Alumni ID is required if isAlumni is true' }),
      otherwise: Joi.string().allow('', null).optional()
    }),
    address: Joi.object({
      line: Joi.string().required().messages({ 'any.required': 'Address line is required' }),
      city: Joi.string().required().messages({ 'any.required': 'City is required' }),
      state: Joi.string().required().messages({ 'any.required': 'State is required' }),
      country: Joi.string().default('India'),
      pincode: Joi.string().required().messages({ 'any.required': 'Pincode is required' })
    }).required().messages({ 'any.required': 'Address details are required' })
  }).required()
});

module.exports = {
  createOrderSchema
};
