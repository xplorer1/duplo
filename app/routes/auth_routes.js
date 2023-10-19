let express = require('express');
let router = express.Router();
let authController = require("../controllers/auth_controller");
let validator = require("../middlewares/validator");

router.post('/sign_in', [validator.signIn], authController.signIn);
router.post('/sign_up', [validator.signUp], authController.signUp);

module.exports = router;