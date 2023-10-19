let general_config = require("../config/general_config");
let jwt = require("jsonwebtoken");

module.exports = {

    verifyAuthToken: async(req, res, next) => {
        try {
            if(!req.headers.authorization) return res.status(401).send({status: false, data: "token-required"});
    
            let token = req.header("Authorization").replace("Bearer ", "");
            if(!token) return res.status(401).send({status: false, message: "token-required"});
    
            if (token) {
                jwt.verify(token, general_config.secret_key, async function(err, verified) {
                    if (err) return res.status(401).send({status: false, message: err.message});

                    let user = await global.Models.UserModel.findOne({_id: verified._id}).exec();
                    if(!user) return res.status(401).json({status: false, message: "User invalid."});

                    let obj = {};
                    obj.token = token;
                    obj.user_id = verified.user_id;
                    obj._id = verified._id;
                    obj.username = verified.username;
                    req.verified = obj;

                    next();
                });

            } else {
                return res.status(401).send({status: false, message: "token-required" });
            }
        } catch (error) {
            return res.status(500).send({status: false, message: "There has been an error. Please try again later." });
        }
    }
}