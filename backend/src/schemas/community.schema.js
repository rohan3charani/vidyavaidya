const Joi = require('joi');

const applySchema = Joi.object({
  type: Joi.string().valid('volunteer', 'donor', 'corporate', 'hospital').required().messages({
    'any.only': 'Application type must be volunteer, donor, corporate, or hospital',
    'any.required': 'Application type is required'
  }),

  // Optional general details that the controller maps from req.user
  applicantName: Joi.string().optional(),
  applicantEmail: Joi.string().optional(),
  applicantPhone: Joi.string().optional(),
  
  volunteerDetails: Joi.object({
    skills: Joi.array().items(Joi.string()).min(1).required().messages({
      'any.required': 'At least one skill is required'
    }),
    availability: Joi.string().required().messages({ 'any.required': 'Availability is required' }),
    experience: Joi.string().required().messages({ 'any.required': 'Experience detail is required' }),
    motivation: Joi.string().required().messages({ 'any.required': 'Motivation detail is required' }),
    preferredDays: Joi.array().items(Joi.string()).min(1).required().messages({
      'any.required': 'Preferred days are required'
    }),
    location: Joi.string().required().messages({ 'any.required': 'Location is required' })
  }).when('type', { is: 'volunteer', then: Joi.required(), otherwise: Joi.optional() }),

  corporateDetails: Joi.object({
    companyName: Joi.string().required().messages({ 'any.required': 'Company Name is required' }),
    designation: Joi.string().required().messages({ 'any.required': 'Designation is required' }),
    employeeCount: Joi.string().required().messages({ 'any.required': 'Employee Count is required' }),
    csrBudget: Joi.string().required().messages({ 'any.required': 'CSR Budget is required' }),
    collaborationType: Joi.string().required().messages({ 'any.required': 'Collaboration Type is required' }),
    gstNumber: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).allow('', null).optional().messages({
      'string.pattern.base': 'GST number must be a valid 15-character Indian GSTIN'
    })
  }).when('type', { is: 'corporate', then: Joi.required(), otherwise: Joi.optional() }),

  hospitalDetails: Joi.object({
    hospitalName: Joi.string().required().messages({ 'any.required': 'Hospital Name is required' }),
    registrationNumber: Joi.string().required().messages({ 'any.required': 'Registration Number is required' }),
    specializations: Joi.array().items(Joi.string()).min(1).required().messages({
      'any.required': 'At least one specialization is required'
    }),
    bedCount: Joi.number().min(1).required().messages({ 'any.required': 'Bed count is required' }),
    contactPerson: Joi.string().required().messages({ 'any.required': 'Contact person name is required' })
  }).when('type', { is: 'hospital', then: Joi.required(), otherwise: Joi.optional() })
});

module.exports = {
  applySchema
};
