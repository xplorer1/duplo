let mongoose = require('mongoose');
let Schema   = mongoose.Schema;

let DepartmentUserSchema = new Schema({
    'created_on' : {type: Date, default: Date.now},
    'updated_on': {type: Date},
    'user_id': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    'department_name': {type: String, trim: true},
    'business_name': {type: String, trim: true},
    'username' : {type: String, trim: true, index: true, lowercase: true}
});

module.exports = mongoose.model('DepartmentUser', DepartmentUserSchema);