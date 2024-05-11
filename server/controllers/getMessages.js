
const Message = require('../models/dbSchema'); // Importing Mongoose model for messages

//@desc get all messages
//route /api/cloud/messages

const getMessages= async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getMessages;
