
module.exports = {

    getBusinessCreditScore: async(req, res) => {

        try {
            let business_id = req.verified.user_id;

            let _b = await global.Models.BusinessUserModel.findOne({_id: business_id}, {_id: true}).exec();
            if(!_b) return res.status(400).json({message: "Invalid request. Business owner not found.", status: false });

            let transactions = await global.Models.TransactionModel.find({ business_id: business_id }, {amount: true}).exec();
            let total_amount = transactions.reduce((acc, t) => acc + t.amount, 0);
            let credit_score = total_amount / (transactions.length * 100);

            return res.status(200).json({status: true, data: credit_score});

        } catch (error) {
            return res.status(500).json({message: error.message, status: false });
        }

    },

    getBusinessOrderAnalysis: async(req, res) => {

        try {

            let business_id = req.verified.user_id;
            
            let _b = await global.Models.BusinessUserModel.findOne({_id: business_id}, {_id: true}).exec();
            if(!_b) return res.status(400).json({message: "Invalid request. Business owner not found.", status: false });

            let all_orders = await global.Models.OrderModel.findAll({ where: { business_id } });

            let total_orders = all_orders.length;
            let total_order_amount = all_orders.reduce((acc, order) => acc + order.amount, 0);

            // Getting today's date
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            let todays_orders = all_orders.filter(order => 
                new Date(order.date) >= today && new Date(order.date) < tomorrow
            );

            let total_orders_today = todays_orders.length;
            let total_order_amount_today = todays_orders.reduce((acc, order) => acc + order.amount, 0);

            let details = {
                total_orders,
                total_order_amount,
                total_orders_today,
                total_order_amount_today,
            };

        return res.status(200).json({status: true, data: details});

        } catch (error) {
            return res.status(500).json({message: error.message, status: false });
        }
    }
}