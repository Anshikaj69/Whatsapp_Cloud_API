const { createBot } = require('whatsapp-cloud-api');
const Message = require('../models/dbSchema')

const sendMessage = async (req, res) => {
  try {
    const from = process.env.WA_PHONE_NUMBER_ID;
    const token = process.env.ACCESS_TOKEN;
    const to = req.body.to;
    const message = req.body.message;

    const bot = createBot(from, token);
    const result = await bot.sendText(to, message);

    res.status(200).json({ success: true, result });

    await Message.create({
      "from": from,
      "to": to,
      "type": "text",
      "message": message
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

module.exports = sendMessage;