let mongoose = require('mongoose');
let Schema   = mongoose.Schema;

let TransactionSchema = new Schema({
    'created_on' : {type: Date, default: Date.now},
    'business_id': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessOwner'
    },
    'amount': {type: Number, index: true},
    'status' : {type: String}
});

module.exports = mongoose.model('Transaction', TransactionSchema);