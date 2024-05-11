const { createBot } = require('whatsapp-cloud-api');
const Message = require('../models/dbSchema');
const cloudinary = require('cloudinary').v2;

//cloudinary access
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_APP_SECRET
});

//importing Test phone number ID
const from = process.env.WA_PHONE_NUMBER_ID;

const createWhatsAppBot = () => {
    const token = process.env.ACCESS_TOKEN;
    return createBot(from, token);
};

//send image
//route /api/cloud/send-image
const sendImage = async (req, res) => {
    try {
        const to = req.body.to;
        const message = req.file.path;

        const bot = createWhatsAppBot();

        //get cloudinary url 
        const uploadResult = await cloudinary.uploader.upload(message, {
            resource_type: 'image'
        }).catch((error) => { console.log(error) });

        const url = uploadResult.url

        //send Message
        const result = await bot.sendImage(to, url);

        //STORE IN DB
        await Message.create({
            from: from,
            to: to,
            type: 'image',
            message: url
        });

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to send image' });
    }
};


//send video
//route /api/cloud/send-video
const sendVideo = async (req, res) => {
    try {
        const to = req.body.to;
        const message = req.file.path;

        const bot = createWhatsAppBot();

        //get cloudinary url 
        const uploadResult = await cloudinary.uploader.upload(message, {
            resource_type: 'video'
        }).catch((error) => { console.log(error) });

        const url = uploadResult.url

        const result = await bot.sendVideo(to, url);

        await Message.create({
            from: from,
            to: to,
            type: 'video',
            message: url
        });

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to send video' });
    }
};

//send audio
//route /api/cloud/send-audio
const sendAudio = async (req, res) => {
    try {
        const to = req.body.to;
        const message = req.file.path;

        const bot = createWhatsAppBot();

        //get cloudinary url 
        const uploadResult = await cloudinary.uploader.upload(message, {
            resource_type: 'auto'
        }).catch((error) => { console.log(error) });

        const url = uploadResult.url

        const result = await bot.sendAudio(to, url);

        await Message.create({
            from: from,
            to: to,
            type: 'audio',
            message: url
        });

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to send video' });
    }
};


//send Document
//route /api/cloud/send-doc
const sendDoc = async (req, res) => {
    try {
        const to = req.body.to;
        const message = req.file.path;

        const bot = createWhatsAppBot();

        //get cloudinary url 
        const uploadResult = await cloudinary.uploader.upload(message, {
            resource_type: 'raw'
        }).catch((error) => { console.log(error) });

        const url = uploadResult.url

        const result = await bot.sendDocument(to, url);

        await Message.create({
            from: from,
            to: to,
            type: 'document',
            message: url
        });

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to send video' });
    }
};

module.exports = { sendImage, sendVideo, sendAudio, sendDoc }
