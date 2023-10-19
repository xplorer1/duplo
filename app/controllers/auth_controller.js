let jwt = require("jsonwebtoken");
let general_config = require("../config/general_config");
let bcrypt = require('bcrypt');
let salt_rounds = 10;

module.exports = {

    signIn: async(req, res) => {

        try {

            let user = await global.Models.UserModel.findOne({username: req.body.username}).exec();
            if(!user) return res.status(404).json({status: false, message: "User not found."});

            let match = await bcrypt.compare(req.body.password.trim(), user.password);
            if (!match) return res.status(404).json({status: 404, success: false, message: 'Username or password incorrect.'});

            let token = jwt.sign({username: req.body.username, user_id: user.owner_id, _id: user._id}, general_config.secret_key, {
                expiresIn: 86400000// expires in 24 hours
            });

            user.updated_on = new Date();
            await user.save();

            return res.status(200).json({status: true, data: token});

        } catch(error) {
            return res.status(500).json({message: error.message, status: false });
        }
    },

    signUp: async(req, res) => {

        try {

            let existing_user = await global.Models.UserModel.findOne({username: req.body.username}, {"_id": true}).exec();
            if(existing_user) return res.status(400).json({status: false, message: "username exists."});

            let hashed_password = await bcrypt.hash(req.body.password, salt_rounds);

            let user = new global.Models.UserModel({
                username: req.body.username,
                password: hashed_password,
                user_type: req.body.user_type
            });

            user = await user.save();

            if(req.body.user_type === "BUSINESS_OWNER") {
                let business_user = new global.Models.BusinessUserModel({
                    username: req.body.username,
                    user_id: user._id,
                    business_name: req.body.business_name
                });

                business_user = await business_user.save();
                user.owner_id = business_user._id;
                await user.save();

            } else {

                let dept_user = new global.Models.DepartmentUserModel({
                    username: req.body.username,
                    user_id: user._id,
                    business_name: req.body.business_name,
                    department_name: req.body.department_name
                });
                dept_user = await dept_user.save();

                user.owner_id = dept_user._id;
                await user.save();
            }

            return res.status(200).json({status: true, message: "User created successfully."});

        } catch (error) {
            
        }
    }
}