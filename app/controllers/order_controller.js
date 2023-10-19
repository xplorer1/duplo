let axios = require('axios');
let { v4: uuidv4 } = require('uuid');

async function logTax(order_id, order_amount) {
    try {
        let response = await axios.post('https://taxes.free.beeceptor.com/log-tax', {
            order_id: order_id,
            platform_code: "022",
            order_amount: order_amount
        }, { timeout: 40000 }); // 40 seconds timeout

        console.log("response logged successfully: ", response.data);
    } catch (err) {
        console.error("Error logging tax:", err);
    }
}

module.exports = {
    createOrder: async(req, res) => {
        let { amount, business_id } = req.body;

        try {

            let transaction = new global.Models.TransactionModel({
                business_id: business_id,
                created_by: req.verified.user_id,
                amount: amount,
                status: "PENDING"
            });

            await transaction.save();
            let order_id = uuidv4();

            let order = await global.Models.OrderModel.create({
                business_id: business_id,
                created_by: req.verified.user_id,
                order_id: order_id,
                amount,
                status: "PENDING",
            });
          
            //Use a message queue system to handle this for the best performance.
            logTax(order_id, amount);
          
            return res.status(200).json({status: true, message: "Order created successfully."});
            
        } catch (error) {
            return res.status(500).json({message: error.message, status: false });
        }
    }
}