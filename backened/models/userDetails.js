const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        name: String,
    transportComingName: String,
transportReturnName: String,
mobile: String,
  pincode: String,
  gender: String,
  age: Number,
startDate: Date,
endDate: Date,
days: Number,
amount: Number,
aadhar: String,
delete: Boolean,
});

module.exports = mongoose.model('Participant', userSchema);
