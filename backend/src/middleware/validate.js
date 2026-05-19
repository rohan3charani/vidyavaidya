const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true // strip fields that are not in the schema
    });

    if (error) {
      const details = error.details.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
