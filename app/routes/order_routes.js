let express = require('express');
let router = express.Router();
let orderController = require("../controllers/order_controller");
let validator = require("../middlewares/validator");
let authentication = require("../middlewares/authentication");

router.post('/', [validator.createOrder, authentication.verifyAuthToken], orderController.createOrder);

module.exports = router;