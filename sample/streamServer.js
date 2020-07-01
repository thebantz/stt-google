const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer();

const app = express();
const port = 3000;

app.use('/*', express.static(path.join(__dirname, './streamHtml.html')));
app.get('/', function (req, res) { res.redirect('/streamHtml.html') });


async function testGoogleTextToSpeech(audioBuffer) {
  const speech = require('@google-cloud/speech');
  const client = new speech.SpeechClient({ keyFilename: "speechtotext-281504-9ef680719571.json" });

  const audio = {
    content: audioBuffer.toString('base64'),
  };
  const config = {
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

app.post('/upload_sound', upload.any(), async (req, res) => {
  console.log("Getting text transcription..");
  let transcription = await testGoogleTextToSpeech(req.files[0].buffer);
  console.log("Text transcription: " + transcription);
  res.status(200).send(transcription);
});

app.listen(port, () => {
  console.log(`Express server listening on port: ${port}...`);
});