const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    name: String,
   mode: String,
  fromDate: Date,
  toDate: Date,
  fromTime: String,
  toTime: String,
  boarding: {
    location: String,
    time: String,
  },
  destination: {
    location: String,
    time: String,
  },
  needPickup: Boolean,
  checkinTime: String,
  checkoutTime: String,
  total: Number,
  comment: String,
});

module.exports = mongoose.model('Transport', transportSchema);
