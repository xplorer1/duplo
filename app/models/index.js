let mongoose = require('mongoose');
let { Sequelize } = require('sequelize');
let general_config = require("../config/general_config");

mongoose.Promise = global.Promise;
mongoose.connect(general_config.mongo_database, { 'keepAlive': "true", useUnifiedTopology: true, useNewUrlParser: true, 'connectTimeoutMS': 0, 'useNewUrlParser': true });

let conn = mongoose.connection;
conn.on('error', function(err) {
    console.log('mongoose connection error:', err.message);
});

let sequelize = new Sequelize(general_config.pg_database, general_config.pg_database_user, general_config.pg_database_password, {
    host: general_config.pg_database_host,
    dialect: 'postgres',
});

//this is for development. Migration would be the best approach.
// sequelize.sync({ force: true }).then(() => {
//     console.log('Tables have been created.');
// });

module.exports = {
    UserModel: require("./user_model"),
    TransactionModel: require("./transaction_model"),
    DepartmentUserModel: require("./department_user_model"),
    BusinessUserModel: require("./business_user_model"),
    OrderModel: require('./order_model')(sequelize)
}