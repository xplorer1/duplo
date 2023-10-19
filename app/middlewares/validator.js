let Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {

    signIn: function(req, res, next) {
        let schema = Joi.object({
            username: Joi.string().required(''),
            password: Joi.required()
        });

        // schema options
		let options = {
			abortEarly: false, // include all errors
			allowUnknown: true, // ignore unknown props
			stripUnknown: true, // remove unknown props
		};
        
		// validate request body against schema
		let { error, value } = schema.validate(req.body, options);

		if (error) {
	        return res.status(400).json({
                message: error.message,
                status: false
            });

		} else {
            req.body = value;
			next();
		}
    },

    signUp: function(req, res, next) {
        let schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().min(8).required(),
            user_type: Joi.string().valid('DEPARTMENT_HEAD', 'BUSINESS_OWNER').required(),
            business_name: Joi.string().required(),
            department_name: Joi.when('user_type', {
                is: 'DEPARTMENT_HEAD',
                then: Joi.string().required()
            })
        });

        // schema options
		let options = {
			abortEarly: false, // include all errors
			allowUnknown: true, // ignore unknown props
			stripUnknown: true, // remove unknown props
		};
        
		// validate request body against schema
		let { error, value } = schema.validate(req.body, options);

		if (error) {
	        return res.status(400).json({
                message: error.message,
                status: false
            });

		} else {
            req.body = value;
			next();
		}
    },

    createOrder: async function(req, res, next) {

        let schema = Joi.object({
            amount: Joi.number().required(),
            business_id: Joi.string().required()
		});

		// schema options
		let options = {
			abortEarly: false, // include all errors
			allowUnknown: true, // ignore unknown props
			stripUnknown: true, // remove unknown props
		};
        
		// validate request body against schema
		let { error, value } = schema.validate(req.body, options);

		if (error) {
	        return res.status(400).json({ message: error.message, status: false });

		} else {

            let business = await global.Models.BusinessUserModel.findOne({_id: req.body.business_id}).exec();
            if(!business) return res.status(401).json({status: false, message: "Business not found"});

            req.body = value;
			next();
		}
    },
}