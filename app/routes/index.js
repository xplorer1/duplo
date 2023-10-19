let express = require("express");
let router = express.Router();
let dayjs = require("dayjs");
let logger = require("../utils/logger");

let AuthRoutes = require("./auth_routes");
let OrderRoutes = require("./order_routes");
let BusinessRoutes = require("./business_routes");

router.use(function (req, res, next) {
	logger.info(`${dayjs()}: ${req.originalUrl}`);
	next();
});

router.use("/auth", AuthRoutes);
router.use("/orders", OrderRoutes);
router.use("/business", BusinessRoutes);

module.exports = router;