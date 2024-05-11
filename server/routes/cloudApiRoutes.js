const express = require('express');
const multer = require('multer');
const sendMessage = require('../controllers/sendMessage');
const { sendImage, sendVideo, sendAudio, sendDoc } = require('../controllers/sendMedia');
const getMessages = require('../controllers/getMessages');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure Multer for file uploads

//POST route to send messages
router.route('/send-text').post(sendMessage);

// POST route to send images
router.route('/send-image').post(upload.single('file'), sendImage);

// POST route to send videos
router.route('/send-video').post(upload.single('file'), sendVideo);

// POST route to send audios
router.route('/send-audio').post(upload.single('file'), sendAudio);

// POST route to send documents
router.route('/send-doc').post(upload.single('file'), sendDoc);

// GET route to get messages
router.route('/messages').get(getMessages);

module.exports = router;
