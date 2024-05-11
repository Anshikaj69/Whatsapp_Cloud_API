const express = require('express')
const dbConnection = require('./config/dbConnection')
const cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require("dotenv").config()
const { createBot } = require('whatsapp-cloud-api');

//import DB Schema
const Message = require('./models/dbSchema');

const app = express()
port = 5001

dbConnection()

app.use(cors())
app.use(express.json())
app.use('/api/cloud', require('./routes/cloudApiRoutes'))

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/', (req, res) => {
  res.status(200).send({ "here": "here" })
})

//Listening to incomin messages
const receive = async () => {
  try {
    const sender = process.env.WA_PHONE_NUMBER_ID;
    const token = process.env.ACCESS_TOKEN;
    const webhookVerifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN;

    const bot = createBot(sender, token);

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
    });

    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Socket.io event handlers
    io.on('connection', (socket) => {
      console.log('New client connected');
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // Listen to ALL incoming messages
    bot.on('message', async (msg) => {
      try {
        // Destructure response
        const { from, type, data } = msg;

        // Store message details in the database
        await Message.create({
          from: from,
          to: sender,
          type: type,
          message: data.text
        });

        console.log('Message stored in the database:', msg);

        io.emit('newMessage', msg);
      } catch (error) {
        console.error('Error storing message in the database:', error);
      }
    })
  } catch (err) {
    console.log(err);
  }
};

receive()

