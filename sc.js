const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const { exec } = require('child-process');
const { MessagingResponse } = require('twilio').twiml;
const client = require('twilio')('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const { youtubeUrl, phoneNumber } = req.body;

    if (!youtubeUrl || !phoneNumber) {
        return res.json({ success: false, message: 'Missing URL or phone number' });
    }

    const video = youtubedl(youtubeUrl, ['--extract-audio', '--audio-format=mp3'], { cwd: __dirname });

    video.on('info', info => {
        console.log('Download started');
        console.log('filename: ' + info._filename);
    });

    video.pipe(fs.createWriteStream('downloaded_music.mp3')); //todo: dynamically rename the downloads to music name using vars eg: -> `${info._filename}.mp3`

    video.on('end', async () => {
        try {
            await client.messages.create({
                from: WHATSAPP_CONTACT, //? Whose contact is this, are we not sending from twilio?
                to: `whatsapp:${phoneNumber}`,
                body: 'Here is your requested music!',
                mediaUrl: 'http://your-server-url.com/downloaded_music.mp3' //? Where is this link redirecting to?
            });

            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    });

    video.on('error', error => {
        res.json({ success: false, message: error.message });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
