let express = require('express');
let router = express.Router();
let businessController = require("../controllers/business_controller");
let authentication = require("../middlewares/authentication");

router.get('/credit_score', [authentication.verifyAuthToken], businessController.getBusinessCreditScore);
router.get('/order_detail', [authentication.verifyAuthToken], businessController.getBusinessOrderAnalysis);

module.exports = router;