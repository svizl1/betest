const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  responded: { type: Boolean, default: false },
  response: {type: String,}
});

module.exports = mongoose.model('Contact', contactSchema);
