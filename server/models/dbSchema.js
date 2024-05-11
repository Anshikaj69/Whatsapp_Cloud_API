const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { 
    type: String,
    required: true 
    }, 
  to: { 
    type: String,
    required: true 
    }, 
  type: {
    type: String,
    required : true
  },
  message: { 
    type: String, 
    required: true 
    }, 
  timestamp: { 
    type: Date, 
    default: Date.now 
    } 
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;